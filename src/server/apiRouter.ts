/**
 * SAGUNOO - Backend API Router (Gemini AI Proxy & Endpoints)
 * Shared across standalone server (AI Studio dev) and Vercel serverless deployment
 */

import { Router, type Response } from 'express';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

export const apiRouter = Router();

// Ongoing Security: Defensive HTTP Headers & Input Guardrails
apiRouter.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Shared GoogleGenAI client (reads GEMINI_API_KEY from environment)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check
apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'SAGUNOO',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// 1. Multi-Turn Chatbot Endpoint (gemini-4-hydrogen / gemini-3.1-flash-lite with role system instructions)
const CHAT_ROLE_INSTRUCTIONS: Record<string, string> = {
  EVENT_PLANNER:
    'You are SAGUNOO Event Producer & Planning Assistant for Nepal. Guide clients on wedding (Bibaha), reception, Bratabandha, Pasni, party palace selection, run-of-show logistics, sound curfews (10:00 PM DAO rule), and catering menus across Nepal in warm, structured English or Nepali.',
  PANCHANGA_PANDIT:
    'You are SAGUNOO Hindu Panchanga & Vedic Ritual Advisor. Explain Samiti auspicious dates, Tithi, Nakshatra, Lagan windows, seasonal suitability, and ceremonial requirements (Vivah Mandap, Havan, Bratabandha, Griha Pravesh) clearly and respectfully.',
  NEGOTIATION_STRATEGIST:
    'You are SAGUNOO Hospitality Commercial Strategist. Help hosts calculate per-plate costs + 10% Service Charge + 13% IRD VAT, spot off-season concession opportunities, and structure fair counter-offers for venues in NPR.',
  DESTINATION_CONCIERGE:
    'You are SAGUNOO Destination & NRI Celebration Concierge specializing in Pokhara, Kathmandu, Nagarkot, Chitwan, and Nepali diaspora events abroad. Cover guest room blocks, travel logistics, visas, customs for wedding attire, and mountain weather backups.',
};

apiRouter.post('/chat', async (req, res) => {
  try {
    const {
      messages,
      systemInstruction,
      rolePreset = 'EVENT_PLANNER',
      modelTier = 'GENERAL',
      useSearchGrounding = false,
    } = req.body || {};

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is missing in environment configuration.',
      });
    }

    const chosenInstruction =
      (typeof systemInstruction === 'string' && systemInstruction.trim()) ||
      CHAT_ROLE_INSTRUCTIONS[String(rolePreset)] ||
      CHAT_ROLE_INSTRUCTIONS.EVENT_PLANNER;

    // Route strictly using active free-tier-capable Gemini 4 / 3.1 models
    let selectedModel = 'gemini-4-hydrogen';
    let thinkingLevel: ThinkingLevel = ThinkingLevel.MEDIUM;

    if (modelTier === 'FAST') {
      selectedModel = 'gemini-3.1-flash-lite';
      thinkingLevel = ThinkingLevel.MINIMAL;
    } else if (modelTier === 'DEEP') {
      selectedModel = 'gemini-4-hydrogen';
      thinkingLevel = ThinkingLevel.HIGH;
    }

    const formattedContents = messages
      .slice(-30)
      .map((m: { role: string; text: string }) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: String(m.text || '') }],
      }));

    const config: any = {
      systemInstruction: chosenInstruction,
      thinkingConfig: { thinkingLevel },
    };

    if (useSearchGrounding) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: formattedContents,
      config,
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSources = groundingChunks
      .filter((c: any) => c.web)
      .map((c: any) => ({
        title: String(c.web.title || 'Verified Web Source'),
        uri: String(c.web.uri || ''),
      }))
      .filter((s: any) => s.uri);

    res.json({
      text: response.text || 'No response generated.',
      modelUsed: selectedModel,
      thinkingLevel,
      sources: webSources,
    });
  } catch (err: any) {
    console.error('Chat API Error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate chat response' });
  }
});

// 2. Google Search Grounding Endpoint (gemini-4-hydrogen with googleSearch)
apiRouter.post('/search', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'query is required' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Search and provide verified, up-to-date celebration, venue, Panchanga, or cultural information for Nepal: ${query}`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSources = groundingChunks
      .filter((c: any) => c.web)
      .map((c: any) => ({
        title: c.web.title,
        uri: c.web.uri,
      }));

    res.json({
      text: response.text || '',
      sources: webSources,
    });
  } catch (err: any) {
    console.error('Search Grounding Error:', err);
    res.status(500).json({ error: err.message || 'Failed to execute search grounding' });
  }
});

// 3. Google Maps Grounding Endpoint (gemini-4-hydrogen with googleMaps)
apiRouter.post('/maps', async (req, res) => {
  try {
    const { query, latitude, longitude } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'query is required' });
    }

    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    if (latitude && longitude) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: Number(latitude),
            longitude: Number(longitude),
          },
        },
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Find celebration venues, party palaces, landmark directions, and banquet accessibility in Nepal: ${query}`,
      config,
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const mapSources = groundingChunks
      .filter((c: any) => c.maps)
      .map((c: any) => ({
        title: c.maps.title,
        uri: c.maps.uri,
      }));

    res.json({
      text: response.text || '',
      places: mapSources,
    });
  } catch (err: any) {
    console.error('Maps Grounding Error:', err);
    res.status(500).json({ error: err.message || 'Failed to execute maps grounding' });
  }
});

// 4. Audio Transcription Endpoint (gemini-3.5-transcribe)
apiRouter.post('/transcribe', async (req, res) => {
  try {
    const { audioBase64, mimeType } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: 'audioBase64 is required' });
    }

    const audioPart = {
      inlineData: {
        mimeType: mimeType || 'audio/webm',
        data: audioBase64,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          audioPart,
          { text: 'Transcribe this spoken audio accurately. It may be in Nepali, English, or mixed Nepali-English.' },
        ],
      },
    });

    res.json({
      transcription: response.text || '',
    });
  } catch (err: any) {
    console.error('Audio Transcription Error:', err);
    res.status(500).json({ error: err.message || 'Failed to transcribe audio' });
  }
});

// 5. Global Destination Celebration Sourcing Endpoint (gemini-3.8-flash with googleSearch)
apiRouter.post('/destination-sourcing', async (req, res) => {
  try {
    const {
      clientName,
      clientCountryOfResidence,
      celebrationType,
      targetDestination,
      estimatedGuests,
      budgetCurrency,
      budgetAmount,
      specialRequirements,
      additionalNotes,
    } = req.body;

    const prompt = `
You are the Chief Destination Concierge for SAGUNOO, Nepal's Smart Celebration & Tourism Authority.
A client is planning an iconic Destination Celebration in Nepal. Sourced from globally reputable travel & event standards, provide comprehensive, up-to-date guidance grounded in Google Search.

Client Dossier:
- Name: ${clientName || 'Valued International Client'}
- Country of Residence: ${clientCountryOfResidence || 'United States / Global NRI'}
- Occasion: ${celebrationType || 'Destination Wedding (Vedic Vivah)'}
- Target Destination in Nepal: ${targetDestination || 'Pokhara Lakeside & Annapurna Vista'}
- Guest Count: ${estimatedGuests || 150} guests
- Currency & Budget: ${budgetCurrency || 'USD'} ${budgetAmount || '25,000'}
- Helicopter / Mountain Flights: ${specialRequirements?.needHelicopterFlight ? 'Yes, chartered helicopter requested' : 'Standard domestic flights'}
- Mountain Sightseeing: ${specialRequirements?.needMountainSightseeing ? 'Yes, Sarangkot / Everest / ACAP tour' : 'Standard'}
- Priest / Pandits: ${specialRequirements?.needVedicPriestEnglishHindi ? 'Bilingual English/Hindi Vedic Acharya required' : 'Traditional'}
- Dietary: ${specialRequirements?.needSpecialDietaryJainHalalVeg ? 'Specialized Jain / Pure Veg / Halal requested' : 'Nepali & International multi-cuisine'}
- Traditional Attire: ${specialRequirements?.needTraditionalNepaliAttire ? 'Yes, Handcrafted Dhaka Topi, Gunyo Cholo & Bridal Silk' : 'Personal attire'}
- Foreign Marriage Legal Guidance: ${specialRequirements?.needLegalMarriageCertificateGuidance ? 'Yes, Court registration / Embassy verification needed' : 'Not required'}
- Client Notes: ${additionalNotes || 'Looking for an unforgettable, authentic Himalayan luxury celebration'}

Please provide a structured, inspiring, highly practical destination blueprint with these exact sections:
1. TRAVEL, VISAS & PERMITS: Visa on arrival at TIA/Pokhara Airport (15/30/90 days), customs allowances for gold jewelry and bridal attire, drone permits, and mountain flight coordination.
2. SIGNATURE 4-DAY ITINERARY: Day 1 Arrival & Sunset Cocktail, Day 2 Sangeet & Folk Troupe, Day 3 Sacred Vivah Subha Muhurat Ceremony, Day 4 Sunrise Heli/Mountain Brunch.
3. CUSTOMS, JEWELRY & ATTIRE ADVICE: Practical rules for international guests carrying wedding jewelry, duty-free allowances, and Nepal customs declarations.
4. ITEMIZED ESTIMATED COST BREAKDOWN: In ${budgetCurrency || 'USD'} and NPR covering Venue Buyout, Catering per plate, Production & Sound Rig, Decor & Mandap, Photography/Drone, and Guest Transfers.
5. CULTURAL & PRIEST COORDINATION: Vedic Panchanga Muhurat, bilingual rituals, and traditional hospitality touches (Khada, Panchai Baja, Dhimay).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction:
          'You are SAGUNOO Global Destination Concierge. You champion luxury destination tourism in Nepal, highlighting Pokhara, Kathmandu, Nagarkot, Chitwan, Muktinath, and Everest. Provide authoritative, warm, and structured event planning dossiers.',
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSources = groundingChunks
      .filter((c: any) => c.web)
      .map((c: any) => ({
        title: c.web.title,
        uri: c.web.uri,
      }));

    res.json({
      text: response.text || '',
      sources: webSources,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Destination Sourcing Error:', err);
    res.status(500).json({
      error: err.message || 'Failed to source destination intelligence',
      fallbackText:
        'Nepal offers world-renowned destination celebration venues. For Pokhara and Annapurna, peak seasons are September-December and February-May. International guests can obtain 15/30/90-day visas on arrival at Kathmandu (TIA) or Pokhara International Airport. Luxury banquet resorts in Pokhara and Kathmandu provide full Vedic mandap setups, sound rigs with quiet curfew at 10:30 PM, and chartered helicopter flights to Annapurna or Everest.',
    });
  }
});

// 5B. Celebrations Outside Nepal (International Worldwide Arrangement & Concierge Sourcing)
apiRouter.post('/destination-outside-nepal-sourcing', async (req, res) => {
  try {
    const dossier = req.body || {};

    const prompt = `
You are SAGUNOO's Executive International Celebration Director. A client wants to host an unforgettable celebration OUTSIDE OF NEPAL.
Using live Google Search grounding, research practical hospitality, visa, cultural ceremony, and memorable experiential arrangements for the target country & city below.

Client Gathered Dossier:
- Lead Host: ${dossier.clientName || 'Valued Host'}
- Target Country & City Abroad: ${dossier.targetCityOrRegion || 'Phuket'}, ${dossier.targetCountry || 'Thailand'}
- Origin Hubs: ${dossier.originCities || 'Kathmandu, London, Sydney'}
- Guest Passport Nationalities: ${dossier.guestPassportNationalities || 'Nepali, UK, US'} (Group Visa Concierge Needed: ${dossier.needGroupVisaConcierge ? 'Yes' : 'No'})
- Occasion & Days: ${dossier.celebrationType || 'Destination Wedding'} (${dossier.celebrationDaysCount || 3} Days)
- Preferred Dates / Muhurat: ${dossier.preferredDateWindowAD || 'Flexible peak season'} ${dossier.auspiciousMuhuratReferenceBS ? `(Muhurat: ${dossier.auspiciousMuhuratReferenceBS})` : ''}
- Guests & Rooms: ${dossier.estimatedGuests || 150} guests · ${dossier.roomBlockCount || 60} hotel rooms
- Venue Setting Archetype: ${dossier.accommodationArchetype || '5-Star Beachfront Resort'}
- Ceremonial Rituals: ${(dossier.ceremonialRitualsIncluded || []).join(', ') || 'Mehndi, Sangeet, Baraat, Vedic Vivah, Reception'}
- Cultural Bridge From Nepal: Panche Baja/Troupe (${dossier.culturalBridgeNeeds?.flyPancheBajaOrFolkTroupe ? 'Yes' : 'No'}), Puja Samagri Shipping (${dossier.culturalBridgeNeeds?.shipPujaSamagriAndAttire ? 'Yes' : 'No'}), Bilingual Acharya (${dossier.culturalBridgeNeeds?.bilingualVedicOrBuddhistPriest ? 'Yes' : 'No'}), 4K Broadcast to Nepal (${dossier.culturalBridgeNeeds?.liveBroadcastBackToNepal ? 'Yes' : 'No'})
- Culinary Design: Dietary (${(dossier.culinaryDesign?.dietaryProfiles || []).join(', ')}), Fly Maharaj Chef (${dossier.culinaryDesign?.flyNepaliMaharajChef ? 'Yes' : 'No'}), Signature Counters (${dossier.culinaryDesign?.signatureCounters || 'Nepali & International Fusion'})
- Signature Unforgettable Moments: ${(dossier.memorableSignatureExperiences || []).join(', ') || 'Grand Baraat, Welcome Hampers, Excursion'}
- Love Story / Aesthetic Theme: ${dossier.loveStoryOrMilestoneTheme || 'Timeless family heritage'} (${dossier.aestheticColorPalette || 'Crimson & Gold'})
- Target Budget: ${dossier.currency || 'USD'} ${dossier.budgetAmount || '45,000'}
- Special Dreams: ${dossier.specialDreamsAndNotes || 'Create lifelong memories'}

Provide a structured, inspiring, actionable arrangement blueprint with these 5 sections:
1. PASSPORTS, GROUP VISAS & FLIGHT CORRIDOR FROM NEPAL/DIASPORA: Practical entry/visa rules for Nepali & international passport holders traveling to ${dossier.targetCountry || 'the destination'}, best connecting airlines from TIA Kathmandu, and group room-block attrition tips.
2. RECOMMENDED 5-STAR & ICONIC VENUE SETTINGS: Specific star-hotel / resort / palace tiers in ${dossier.targetCityOrRegion || 'the destination'} suited for ${(dossier.estimatedGuests || 150)} guests, local Vedic fire/Havan permits, and evening sound curfew laws.
3. CULTURAL BRIDGE & CULINARY EXECUTION ABROAD: Step-by-step plan for flying/sourcing Panchai Baja & Bilingual Priest, shipping wedding Puja Samagri & Dhaka/silk wardrobes cleanly through customs, and executing the requested culinary counters.
4. SIGNATURE WOW-MOMENT & MEMORY PRODUCTION TIMELINE: Multi-day experiential flow integrating their theme, requested unforgettable moments, and family livestream back to Nepal.
5. ESTIMATED BUDGET ALLOCATION MATRIX: Transparent percentage & ${dossier.currency || 'USD'} estimate across Hotel Room Block, Banquet & Beverage, Decor & Sound Rig, Artists/Priest Travel, and Guest Excursions.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction:
          'You are SAGUNOO Executive International Celebration Director helping Nepali diaspora and global clients host extraordinary weddings and milestones outside Nepal. Be practical, accurate on international venue/fire/visa logistics, and deeply creative.',
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSources = groundingChunks
      .filter((c: any) => c.web)
      .map((c: any) => ({
        title: c.web.title,
        uri: c.web.uri,
      }));

    res.json({
      text: response.text || '',
      sources: webSources,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Outside-Nepal Destination Sourcing Error:', err);
    const { targetCityOrRegion = 'Selected Global City', targetCountry = 'International Destination', currency = 'USD', budgetAmount = 45000, estimatedGuests = 150 } = req.body || {};
    res.json({
      text: `### Global Celebration Arrangement Blueprint: ${targetCityOrRegion}, ${targetCountry}\n\n**1. Travel, Visas & Flight Corridors**\n- Coordinated group arrivals from Kathmandu (TIA) and global diaspora hubs (London, New York, Sydney, Dubai).\n- Dedicated sponsor invitation letters prepared for Nepali passport holders 60–90 days prior, alongside airport meet-and-greet greeters and VIP coach transfers.\n\n**2. Star-Hotel & Sacred Ceremony Compliance**\n- Shortlisting 5-star beachfront, palace, or boutique buyout properties for ${estimatedGuests} guests with private outdoor lawns and air-conditioned late-night afterparty ballrooms.\n- Securing venue-approved smokeless copper Havan Kund permits and pre-cleared sound curfews.\n\n**3. Cultural Bridge & Culinary Design**\n- Dedicated Nepali Maharaj culinary team coordination with live Momo/Thakali/Chaat stations plus strict vegetarian/Jain kitchen separation.\n- Priority luggage allocation for Puja Samagri, Dhaka Topi welcome kits, and bilingual English/Sanskrit Vedic Acharya.\n\n**4. Unforgettable Memory Production**\n- Welcome suite hampers upon check-in, grand signature arrival procession, curated excursion afternoon, and 4K multi-camera broadcast for elders back in Nepal.\n\n**5. Budget Allocation Benchmark (${currency} ${Number(budgetAmount).toLocaleString()})**\n- 42% Venue Buyout & Banquet · 22% Room Blocks & Transfers · 18% Floral/Mandap/AV Production · 10% Artists/Priest/Culinary Fly-In · 8% Wow Moments & Excursions.`,
      sources: [],
      timestamp: new Date().toISOString(),
    });
  }
});

// 5. Nepal Government Regulatory Compliance & Gazette Intelligence Endpoint
apiRouter.post('/regulatory-compliance-intelligence', async (req, res) => {
  try {
    const { category, specificQuery } = req.body || {};

    const prompt = `
You are the Nepal Government Regulatory Compliance Engine for SAGUNOO (Nepal's Celebration & Party Palace Marketplace).
Search the latest verified Nepal Government legal acts, gazette notices (नेपाल राजपत्र), ministry directives, and municipal circulars concerning:
1. LABOUR ACT 2074 (श्रम ऐन २०७४) & MINIMUM WAGE: Verify statutory minimum wage notifications by the Ministry of Labour, Employment and Social Security (current statutory baseline: NPR 17,300/month, NPR 668/day shift, NPR 89/hour), overtime rules (1.5x for >8 hours), and temporary/gig worker protections.
2. DAO SOUND POLLUTION & CURFEW: District Administration Office (DAO Kathmandu, Lalitpur, Bhaktapur) notifications regarding party palace sound curfew (mandatory cutoff at 10:00 PM / 22:00 hrs) and decibel restrictions for DJs, brass bands, and outdoor speakers.
3. INLAND REVENUE DEPARTMENT (IRD): Value Added Tax Act 2052 & Finance Acts regarding 13% VAT for banquet catering services and 1.5% TDS on venue lease/services.
4. FOOD SAFETY & QUALITY ACT 2081 (खाद्य स्वच्छता तथा गुणस्तर ऐन २०८१): Department of Food Technology and Quality Control (DFTQC) standards for mass banquets, drinking water testing, and kitchen hygiene.

Specific Focus query: ${specificQuery || 'Latest Nepal Gazette circulars regarding minimum wages, party palace noise curfew, and banquet VAT/TDS'}

Provide an authoritative compliance report for SAGUNOO's Super Admin with:
A. Current Enforced Legal Rules & Gazette Numbers
B. Recent or Proposed Circular Updates (with effective dates if any)
C. Direct Impact on SAGUNOO Platform (Wages, Contracts, Run-of-Show, VAT)
D. Actionable Recommendation for Platform Admin (Whether to Apply or Maintain)
`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction:
          'You are a senior legal compliance advisor specializing in Nepal laws (Labour Act 2074, DAO Directives, IRD VAT, Food Safety Act 2081). Provide clear, verified, well-cited legal summaries in both English and Nepali terms.',
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSources = groundingChunks
      .filter((c: any) => c.web)
      .map((c: any) => ({
        title: c.web.title,
        uri: c.web.uri,
      }));

    res.json({
      status: 'success',
      report: response.text || '',
      sources: webSources,
      timestamp: new Date().toISOString(),
      statutoryDefaults: {
        minShiftWageNpr: 668,
        minHourlyWageNpr: 89,
        minMonthlyWageNpr: 17300,
        soundCurfewTime: '22:00 (10:00 PM)',
        vatPercent: 13,
        tdsPercent: 1.5,
      },
    });
  } catch (err: any) {
    console.error('Regulatory Compliance Error:', err);
    res.json({
      status: 'fallback',
      report: `### 🇳🇵 नेपाल सरकार वैधानिक मापदण्ड तथा राजपत्र अद्यावधिक विश्लेषण (SAGUNOO Statutory Compliance Overview)\n\n**१. श्रम ऐन २०७४ तथा न्यूनतम पारिश्रमिक मापदण्ड (Labour Act 2074):**\n- श्रम, रोजगार तथा सामाजिक सुरक्षा मन्त्रालयको राजपत्र सूचना अनुसार नेपाल सरकारद्वारा तोकिएको न्यूनतम पारिश्रमिक **मासिक रू. १७,३००** (आधारभूत रू. १०,८२० + महँगी भत्ता रू. ६,४८०) हो।\n- दैनिक सिफ्ट (८ घण्टा) को लागि न्यूनतम पारिश्रमिक **रू. ६६८** र प्रतिघण्टा **रू. ८९** कायम गरिएको छ।\n- SAGUNOO को नियम: कुनै पनि पार्टी प्यालेस वा क्याटररले कामदारलाई रू. ६६८ भन्दा कम भुक्तानी गर्न पाउने छैनन्। पारिश्रमिक नतोकेका कामदारलाई यो नियम स्वतः लागू हुन्छ।\n\n**२. जिल्ला प्रशासन कार्यालय ध्वनि नियन्त्रण तथा रात्रीकालीन सुरक्षा (DAO Sound Curfew):**\n- काठमाडौँ तथा ललितपुर जिल्ला प्रशासन कार्यालयको आदेश अनुसार आवासीय क्षेत्रका पार्टी प्यालेस तथा ब्यान्क्वेटहरूमा **राति १०:०० बजे (२२:००)** पछि डिजे, लाउडस्पिकर र बाजा पूर्ण रूपमा बन्द गर्नुपर्नेछ।\n- SAGUNOO को कार्यान्वयन: प्रत्येक डिजिटल सम्झौता र रन-अफ-शोमा १०:०० बजे साउन्ड कट-अफ अनिवार्य शर्तको रूपमा राखिएको छ।\n\n**३. आन्तरिक राजस्व विभाग (IRD VAT & TDS Compliance):**\n- पार्टी प्यालेस तथा क्याटरिङ सेवामा **१३% भ्याट** र सेवा भुक्तानीमा **१.५% टीडीएस** अनिवार्य रूपमा कट्टी गरी प्यान बिलिङ गर्नुपर्नेछ।\n\n**४. खाद्य स्वच्छता तथा गुणस्तर ऐन, २०८१ (Food Safety & Quality Act 2081):**\n- ब्यान्क्वेट भान्सामा पिउने पानीको ल्याब परीक्षण र खानाको तापक्रम मापदण्ड पालना हुनुपर्नेछ।`,
      sources: [
        { title: 'Ministry of Labour, Employment and Social Security (MoLESS)', uri: 'https://moless.gov.np' },
        { title: 'Inland Revenue Department Nepal (IRD)', uri: 'https://ird.gov.np' },
        { title: 'District Administration Office Kathmandu (DAO)', uri: 'https://daokathmandu.moha.gov.np' },
        { title: 'Department of Food Technology and Quality Control (DFTQC)', uri: 'https://dftqc.gov.np' },
      ],
      timestamp: new Date().toISOString(),
      statutoryDefaults: {
        minShiftWageNpr: 668,
        minHourlyWageNpr: 89,
        minMonthlyWageNpr: 17300,
        soundCurfewTime: '22:00 (10:00 PM)',
        vatPercent: 13,
        tdsPercent: 1.5,
      },
    });
  }
});

// 6. AI Negotiation Summary Endpoint (gemini-4-hydrogen structured JSON)
apiRouter.post('/negotiation-summary', async (req, res) => {
  const thread = req.body?.thread;
  if (!thread || !Array.isArray(thread.versions) || thread.versions.length === 0) {
    return res.status(400).json({ error: 'A valid negotiation thread with versions is required.' });
  }

  const versions = thread.versions as Array<any>;
  const messages = Array.isArray(thread.messages) ? thread.messages : [];
  const firstOffer = versions[0];
  const latestOffer = versions[versions.length - 1];

  const perPlateDelta = (latestOffer.proposedPerPlateNpr || 0) - (firstOffer.proposedPerPlateNpr || 0);
  const hallDelta = (latestOffer.hallRentalNpr || 0) - (firstOffer.hallRentalNpr || 0);
  const totalDelta = (latestOffer.totalNpr || 0) - (firstOffer.totalNpr || 0);

  const buildDeterministicSummary = () => {
    const isAccepted = thread.status === 'ACCEPTED';
    const isRejected = thread.status === 'REJECTED';

    const priceProgressionSummary =
      versions.length === 1
        ? `Single-version quotation at NPR ${Number(latestOffer.proposedPerPlateNpr).toLocaleString()}/plate and NPR ${Number(latestOffer.hallRentalNpr).toLocaleString()} hall rental for ${latestOffer.guestCount} guests (Total incl. 10% SC + 13% VAT: NPR ${Number(latestOffer.totalNpr).toLocaleString()}).`
        : `Across ${versions.length} recorded versions, per-plate pricing moved from NPR ${Number(firstOffer.proposedPerPlateNpr).toLocaleString()} (v1) to NPR ${Number(latestOffer.proposedPerPlateNpr).toLocaleString()} (v${latestOffer.version}) [${perPlateDelta >= 0 ? '+' : ''}NPR ${perPlateDelta.toLocaleString()}/plate], while hall rental adjusted from NPR ${Number(firstOffer.hallRentalNpr).toLocaleString()} to NPR ${Number(latestOffer.hallRentalNpr).toLocaleString()} [${hallDelta >= 0 ? '+' : ''}NPR ${hallDelta.toLocaleString()}]. Final total moved by ${totalDelta >= 0 ? '+' : ''}NPR ${totalDelta.toLocaleString()} to NPR ${Number(latestOffer.totalNpr).toLocaleString()} inclusive of 10% service charge and 13% VAT.`;

    const timelineHighlights = versions.map(
      (v) =>
        `v${v.version} (${v.senderRole === 'CUSTOMER' ? 'Customer' : 'Venue Operator'}): Proposed NPR ${Number(v.proposedPerPlateNpr).toLocaleString()}/plate · Hall NPR ${Number(v.hallRentalNpr).toLocaleString()} · ${v.guestCount} guests · Total NPR ${Number(v.totalNpr).toLocaleString()}${v.specialRequests ? ` — Note: "${v.specialRequests}"` : ''}`
    );

    const agreedTermsList: string[] = [
      `Event Date & Shift: ${latestOffer.dateBS} BS (${latestOffer.dateAD} AD) · ${latestOffer.shift} Shift · ${latestOffer.guestCount} guaranteed guests`,
      `Commercial Rate: NPR ${Number(latestOffer.proposedPerPlateNpr).toLocaleString()}/plate + NPR ${Number(latestOffer.hallRentalNpr).toLocaleString()} hall rental (incl. 10% SC & 13% IRD VAT)`,
      ...(Array.isArray(latestOffer.includedAmenities) && latestOffer.includedAmenities.length > 0
        ? [`Included Amenities (${latestOffer.includedAmenities.length}): ${latestOffer.includedAmenities.join(', ')}`]
        : []),
    ];
    if (latestOffer.specialRequests) {
      agreedTermsList.push(`Recorded Concessions / Special Terms: ${latestOffer.specialRequests}`);
    }

    return {
      executiveOverview: isAccepted
        ? `Both ${thread.customerName} and ${thread.venueName} mutually finalized Enquiry #${thread.enquiryId} at Version ${latestOffer.version} for a binding total of NPR ${Number(latestOffer.totalNpr).toLocaleString()} (25% escrow deposit: NPR ${Math.round(Number(latestOffer.totalNpr) * 0.25).toLocaleString()}). All counter-offers and concessions remain locked in the permanent audit record.`
        : isRejected
        ? `Negotiation #${thread.enquiryId} between ${thread.customerName} and ${thread.venueName} closed after ${versions.length} offer version(s) without final acceptance. The full commercial history remains preserved for reference.`
        : `Negotiation #${thread.enquiryId} between ${thread.customerName} and ${thread.venueName} is currently active at Version ${latestOffer.version} (${String(thread.status).replace(/_/g, ' ')}) with a current proposed total of NPR ${Number(latestOffer.totalNpr).toLocaleString()} across ${versions.length} recorded offer(s).`,
      priceProgressionSummary,
      concessionsAndAgreedTerms: agreedTermsList,
      transparentAuditHighlights: timelineHighlights,
      fairnessAndReadinessNote: isAccepted
        ? 'Terms are mutually ratified and ready for digital contract execution and 25% escrow deposit settlement under Nepal Contract Act 2056.'
        : 'Both customer and venue operator can review every counter-offer delta below before locking final terms or submitting another counter-proposal.',
      generatedWith: 'SAGUNOO Deterministic Audit Synthesizer',
      generatedAt: new Date().toISOString(),
    };
  };

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.json(buildDeterministicSummary());
    }

    const serializedVersions = versions.map((v) => ({
      version: v.version,
      senderRole: v.senderRole,
      senderName: v.senderName,
      timestamp: v.timestamp,
      dateBS: v.dateBS,
      dateAD: v.dateAD,
      shift: v.shift,
      guestCount: v.guestCount,
      proposedPerPlateNpr: v.proposedPerPlateNpr,
      hallRentalNpr: v.hallRentalNpr,
      subtotalNpr: v.subtotalNpr,
      serviceChargeNpr: v.serviceChargeNpr,
      vatNpr: v.vatNpr,
      totalNpr: v.totalNpr,
      includedAmenities: v.includedAmenities || [],
      specialRequests: v.specialRequests || '',
      notes: v.notes || '',
    }));

    const serializedMessages = messages.map((m: any) => ({
      senderRole: m.senderRole,
      senderName: m.senderName,
      text: m.text,
      timestamp: m.timestamp,
    }));

    const prompt = `
Analyze the following structured banquet negotiation thread on SAGUNOO (Nepal's party palace & event marketplace) and produce an impartial, crystal-clear negotiation summary record for BOTH the customer and the venue vendor.

Thread Metadata:
- Enquiry ID: ${thread.enquiryId}
- Venue: ${thread.venueName}
- Customer: ${thread.customerName}
- Event Type: ${thread.eventType}
- Current Status: ${thread.status}
- Current Active Version: v${thread.currentVersion}

Offer Versions History (chronological):
${JSON.stringify(serializedVersions, null, 2)}

Discussion Messages:
${JSON.stringify(serializedMessages, null, 2)}

Strictly summarize ONLY the facts, NPR amounts, concessions, amenities, and dates present in the data above. Do not invent numbers.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        systemInstruction:
          'You are an impartial commercial agreement auditor for SAGUNOO Nepal. Produce concise, factual summaries reconciling counter-offers, price deltas in NPR, concessions, and agreed terms so both customer and vendor share a single source of truth.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveOverview: {
              type: Type.STRING,
              description: '2-3 sentence impartial overview of negotiation outcome or current standing, citing Enquiry ID, parties, version count, and total NPR.',
            },
            priceProgressionSummary: {
              type: Type.STRING,
              description: 'Clear summary of how per-plate rates, hall rental, and total NPR changed from initial proposal to latest/accepted offer.',
            },
            concessionsAndAgreedTerms: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of agreed commercial rates, complimentary concessions, included amenities, date/shift, and tax structure.',
            },
            transparentAuditHighlights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Chronological bullet summary of each offer version and major discussion concession.',
            },
            fairnessAndReadinessNote: {
              type: Type.STRING,
              description: '1 concise impartial note on agreement transparency and readiness for formal contract/escrow.',
            },
          },
          required: [
            'executiveOverview',
            'priceProgressionSummary',
            'concessionsAndAgreedTerms',
            'transparentAuditHighlights',
            'fairnessAndReadinessNote',
          ],
        },
      },
    });

    const parsed = JSON.parse((response.text || '{}').trim());
    return res.json({
      executiveOverview: parsed.executiveOverview || buildDeterministicSummary().executiveOverview,
      priceProgressionSummary:
        parsed.priceProgressionSummary || buildDeterministicSummary().priceProgressionSummary,
      concessionsAndAgreedTerms:
        Array.isArray(parsed.concessionsAndAgreedTerms) && parsed.concessionsAndAgreedTerms.length > 0
          ? parsed.concessionsAndAgreedTerms
          : buildDeterministicSummary().concessionsAndAgreedTerms,
      transparentAuditHighlights:
        Array.isArray(parsed.transparentAuditHighlights) && parsed.transparentAuditHighlights.length > 0
          ? parsed.transparentAuditHighlights
          : buildDeterministicSummary().transparentAuditHighlights,
      fairnessAndReadinessNote:
        parsed.fairnessAndReadinessNote || buildDeterministicSummary().fairnessAndReadinessNote,
      generatedWith: 'Gemini 4 Hydrogen Agreement Auditor',
      generatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Negotiation Summary Error:', err);
    return res.json(buildDeterministicSummary());
  }
});

// 7. AI-Driven Smart Venue Matcher Endpoint (Top 3 Party Palaces in Nepal)
apiRouter.post('/smart-venue-matcher', async (req, res) => {
  const rawPrefs = req.body?.preferences || {};
  const rawVenues = req.body?.venues;

  if (!Array.isArray(rawVenues) || rawVenues.length === 0) {
    return res.status(400).json({ error: 'A non-empty venues list is required for matching.' });
  }

  // Sanitize & normalize incoming preferences
  const eventType = String(rawPrefs.eventType || 'WEDDING').slice(0, 40);
  const province = String(rawPrefs.province || '').trim().slice(0, 80);
  const district = String(rawPrefs.district || '').trim().slice(0, 80);
  const guestCount = Math.max(20, Math.min(5000, Number(rawPrefs.guestCount) || 300));
  const budgetMode: 'TOTAL_NPR' | 'PER_PLATE_NPR' =
    rawPrefs.budgetMode === 'PER_PLATE_NPR' ? 'PER_PLATE_NPR' : 'TOTAL_NPR';
  const budgetAmountNpr = Math.max(
    budgetMode === 'PER_PLATE_NPR' ? 400 : 50000,
    Math.min(50000000, Number(rawPrefs.budgetAmountNpr) || (budgetMode === 'PER_PLATE_NPR' ? 1800 : 800000))
  );
  const spaceStyle = String(rawPrefs.spaceStyle || 'ANY').slice(0, 40);
  const requireMandap = Boolean(rawPrefs.requireMandap);
  const requirePowerBackup = Boolean(rawPrefs.requirePowerBackup);
  const requireParking100Plus = Boolean(rawPrefs.requireParking100Plus);
  const requireOutsidePlanners = Boolean(rawPrefs.requireOutsidePlanners);
  const requireWheelchairAccess = Boolean(rawPrefs.requireWheelchairAccess);
  const specialNotes = String(rawPrefs.specialNotes || '').trim().slice(0, 500);

  // Normalize venue snapshots & compute exact NPR estimate incl. 10% SC + 13% IRD VAT
  const venueSummaries = rawVenues.slice(0, 60).map((v: any) => {
    const catering = Number(v.cateringStartingNpr) || 1200;
    const rental = Number(v.baseRentalStartingNpr) || 0;
    const subtotal = catering * guestCount + rental;
    const serviceCharge = Math.round(subtotal * 0.1);
    const vat = Math.round((subtotal + serviceCharge) * 0.13);
    const estimatedTotalNpr = subtotal + serviceCharge + vat;

    return {
      id: String(v.id || ''),
      name: String(v.name || ''),
      nepaliName: String(v.nepaliName || ''),
      province: String(v.province || ''),
      district: String(v.district || ''),
      locality: String(v.locality || ''),
      tagline: String(v.tagline || ''),
      minGuests: Number(v.minGuests) || 50,
      maxGuests: Number(v.maxGuests) || 500,
      cateringStartingNpr: catering,
      baseRentalStartingNpr: rental,
      estimatedTotalNpr,
      rating: Number(v.rating) || 4.5,
      reviewCount: Number(v.reviewCount) || 0,
      parkingCapacityCars: Number(v.parkingCapacityCars) || 0,
      hasPowerBackup: Boolean(v.hasPowerBackup),
      hasMandapSetup: Boolean(v.hasMandapSetup),
      hasWheelchairAccess: Boolean(v.hasWheelchairAccess),
      hasLiveMusicPermit: Boolean(v.hasLiveMusicPermit),
      hasVipLounge: Boolean(v.hasVipLounge),
      allowsOutsideOrganizers: Boolean(v.allowsOutsideOrganizers),
      hallTypes: Array.isArray(v.hallTypes) ? v.hallTypes.map(String) : [],
      hallNames: Array.isArray(v.hallNames) ? v.hallNames.map(String) : [],
      activeOfferTitle: v.activeOfferTitle ? String(v.activeOfferTitle) : '',
    };
  }).filter((v) => v.id && v.name);

  const venueById = new Map(venueSummaries.map((v) => [v.id, v]));

  // Deterministic multi-factor ranking fallback & validator
  const scoreVenueDeterministically = (v: typeof venueSummaries[number]) => {
    let score = 0;
    const reasons: string[] = [];

    // 1. Capacity match (0-30 pts)
    if (guestCount >= v.minGuests && guestCount <= v.maxGuests) {
      score += 30;
      reasons.push(`Fits ${guestCount} guests comfortably (${v.minGuests}–${v.maxGuests} pax capacity)`);
    } else if (guestCount < v.minGuests) {
      const gap = v.minGuests - guestCount;
      score += Math.max(5, 20 - Math.round(gap / 20));
      reasons.push(`Spacious halls (${v.minGuests}–${v.maxGuests} pax); minimum guarantee ${v.minGuests} guests`);
    } else {
      const overflow = guestCount - v.maxGuests;
      score += Math.max(0, 14 - Math.round(overflow / 25));
    }

    // 2. Location match (0-30 pts)
    if (district) {
      if (v.district.toLowerCase() === district.toLowerCase() || v.locality.toLowerCase().includes(district.toLowerCase())) {
        score += 30;
        reasons.push(`Located directly in ${v.locality}, ${v.district}`);
      } else if (province && v.province.toLowerCase() === province.toLowerCase()) {
        score += 18;
        reasons.push(`In preferred ${v.province} (${v.district})`);
      }
    } else if (province) {
      if (v.province.toLowerCase() === province.toLowerCase()) {
        score += 25;
        reasons.push(`Located in ${v.province} (${v.locality}, ${v.district})`);
      }
    } else {
      score += 15;
    }

    // 3. Budget fit (0-28 pts)
    const compareMetric = budgetMode === 'PER_PLATE_NPR' ? v.cateringStartingNpr : v.estimatedTotalNpr;
    const ratio = compareMetric / budgetAmountNpr;
    if (ratio <= 1.0) {
      score += 28;
      reasons.push(
        budgetMode === 'PER_PLATE_NPR'
          ? `Starting rate NPR ${v.cateringStartingNpr.toLocaleString()}/plate fits your NPR ${budgetAmountNpr.toLocaleString()} target`
          : `Estimated total NPR ${v.estimatedTotalNpr.toLocaleString()} (incl. SC & VAT) fits within your NPR ${budgetAmountNpr.toLocaleString()} budget`
      );
    } else if (ratio <= 1.18) {
      score += 18;
      reasons.push(
        budgetMode === 'PER_PLATE_NPR'
          ? `NPR ${v.cateringStartingNpr.toLocaleString()}/plate is within negotiable range of your target`
          : `Estimated NPR ${v.estimatedTotalNpr.toLocaleString()} is slightly above budget and open to counter-offer`
      );
    } else {
      score += Math.max(0, 10 - Math.round((ratio - 1.18) * 15));
    }

    // 4. Space style & required facilities (0-20 pts)
    if (spaceStyle !== 'ANY' && v.hallTypes.includes(spaceStyle)) {
      score += 8;
      reasons.push(`Offers requested ${spaceStyle.replace(/_/g, ' ').toLowerCase()} setting`);
    }
    if (requireMandap && v.hasMandapSetup) {
      score += 5;
      reasons.push('Vedic Mandap & Homa fire setup approved');
    }
    if (requirePowerBackup && v.hasPowerBackup) {
      score += 4;
      reasons.push('100% generator power backup');
    }
    if (requireParking100Plus && v.parkingCapacityCars >= 100) {
      score += 4;
      reasons.push(`${v.parkingCapacityCars}+ dedicated car parking bays`);
    }
    if (requireOutsidePlanners && v.allowsOutsideOrganizers) {
      score += 4;
      reasons.push('Welcomes outside event management teams');
    }
    if (requireWheelchairAccess && v.hasWheelchairAccess) {
      score += 3;
      reasons.push('Step-free wheelchair accessible halls');
    }

    // 5. Verified quality & active promos
    score += Math.round(v.rating * 2);
    if (v.activeOfferTitle) {
      score += 3;
      reasons.push(`Active offer: ${v.activeOfferTitle}`);
    }

    return { venue: v, score, reasons };
  };

  const buildSingleDeterministicRecommendation = (
    v: typeof venueSummaries[number],
    rank: number,
    reasons: string[]
  ) => {
    const budgetTargetText =
      budgetMode === 'PER_PLATE_NPR'
        ? `NPR ${budgetAmountNpr.toLocaleString()}/plate`
        : `NPR ${budgetAmountNpr.toLocaleString()} total`;

    const isWithinBudget =
      budgetMode === 'PER_PLATE_NPR'
        ? v.cateringStartingNpr <= budgetAmountNpr
        : v.estimatedTotalNpr <= budgetAmountNpr;

    return {
      rank,
      venueId: v.id,
      fitSummary: `${v.name} in ${v.locality}, ${v.district} accommodates ${v.minGuests}–${v.maxGuests} guests across ${v.hallNames.slice(0, 2).join(' & ') || 'its banquet spaces'}, making it a strong match for your ${guestCount}-guest ${eventType.replace(/_/g, ' ').toLowerCase()}.`,
      budgetBreakdownNote: `Est. NPR ${v.estimatedTotalNpr.toLocaleString()} total (from NPR ${v.cateringStartingNpr.toLocaleString()}/plate + NPR ${v.baseRentalStartingNpr.toLocaleString()} hall rental + 10% SC & 13% IRD VAT) — ${
        isWithinBudget ? `within your ${budgetTargetText} target.` : `above your ${budgetTargetText} baseline; counter-offer recommended.`
      }`,
      matchedHighlights:
        reasons.length > 0
          ? reasons.slice(0, 4)
          : [
              `Verified ${v.rating.toFixed(1)}★ rating across ${v.reviewCount} reviews`,
              `${v.parkingCapacityCars} cars parking & ${v.hasPowerBackup ? '100% power backup' : 'city power supply'}`,
              `Starting from NPR ${v.cateringStartingNpr.toLocaleString()}/plate`,
            ],
      tradeoffOrTip: v.activeOfferTitle
        ? `Negotiation tip: Apply active venue offer (${v.activeOfferTitle}) or propose a counter-offer in the Negotiation Drawer.`
        : `Planning tip: Confirm 10:00 PM DAO sound curfew compliance and lock 25% escrow deposit early for auspicious Panchanga dates.`,
    };
  };

  const buildDeterministicMatches = () => {
    const ranked = venueSummaries
      .map(scoreVenueDeterministically)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const locationLabel = district || province || 'all provinces in Nepal';
    const budgetLabel =
      budgetMode === 'PER_PLATE_NPR'
        ? `NPR ${budgetAmountNpr.toLocaleString()}/plate`
        : `NPR ${budgetAmountNpr.toLocaleString()} total`;

    return {
      matcherOverview: `Evaluated ${venueSummaries.length} verified SAGUNOO party palaces across ${locationLabel} for a ${guestCount}-guest ${eventType.replace(/_/g, ' ').toLowerCase()} targeting ${budgetLabel}. Below are the top ${ranked.length} ranked matches including estimated 10% service charge and 13% Nepal VAT.`,
      recommendations: ranked.map((item, idx) =>
        buildSingleDeterministicRecommendation(item.venue, idx + 1, item.reasons)
      ),
      generatedWith: 'SAGUNOO Multi-Factor Venue Ranker',
      generatedAt: new Date().toISOString(),
    };
  };

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.json(buildDeterministicMatches());
    }

    const prompt = `
You are SAGUNOO's Smart Venue Matcher for Nepal's party palaces and banquet halls.
Select and rank the TOP 3 best-fit party palaces ONLY from the verified venue catalog JSON below based on the user's event preferences and budget.

User Event Preferences & Budget:
- Occasion / Event Type: ${eventType}
- Preferred Location: ${district ? `${district} District` : 'Any District'}${province ? `, ${province}` : ' (All Nepal)'}
- Expected Guest Count: ${guestCount} guests
- Budget Constraint: ${
      budgetMode === 'PER_PLATE_NPR'
        ? `Max NPR ${budgetAmountNpr.toLocaleString()} per plate`
        : `Target total budget NPR ${budgetAmountNpr.toLocaleString()} (inclusive of hall, catering, 10% SC, and 13% IRD VAT)`
    }
- Preferred Hall/Space Style: ${spaceStyle}
- Mandatory/Desired Facilities: ${[
      requireMandap ? 'Vedic Mandap & Homa setup' : null,
      requirePowerBackup ? '100% Generator Power Backup' : null,
      requireParking100Plus ? '100+ Car Parking' : null,
      requireOutsidePlanners ? 'Outside Event Planners Allowed' : null,
      requireWheelchairAccess ? 'Wheelchair Accessibility' : null,
    ]
      .filter(Boolean)
      .join(', ') || 'Flexible'}
- Additional Notes: ${specialNotes || 'None specified'}

Verified Nepal Party Palaces Catalog (each includes pre-computed estimatedTotalNpr for ${guestCount} guests incl. 10% SC & 13% VAT):
${JSON.stringify(venueSummaries, null, 2)}

Rules:
1. Return AT MOST 3 distinct venues (or fewer if fewer than 3 exist in the catalog).
2. Every venueId MUST match an exact "id" from the catalog above. Never invent venues or numbers.
3. Prioritize guest capacity fit, location match, and budget alignment, then amenities and rating.
4. Keep explanations practical, warm, and tailored to Nepal event logistics (Baraat/parking, Mandap fire permits, DAO sound curfew, negotiation tips).
`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        systemInstruction:
          'You are SAGUNOO Smart Venue Matcher helping families and planners in Nepal pick the top 3 best-fit party palaces based strictly on verified venue data, guest count, and NPR budget.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matcherOverview: {
              type: Type.STRING,
              description:
                '2-sentence summary explaining how the top 3 party palaces were matched to the user preferences, district/province, guest count, and NPR budget.',
            },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  rank: { type: Type.INTEGER },
                  venueId: { type: Type.STRING },
                  fitSummary: {
                    type: Type.STRING,
                    description: '2 concise sentences explaining why this palace fits the occasion, capacity, and location.',
                  },
                  budgetBreakdownNote: {
                    type: Type.STRING,
                    description: 'Transparent budget fit note citing estimatedTotalNpr, per-plate rate, and whether it fits or needs negotiation.',
                  },
                  matchedHighlights: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: '3 to 4 crisp factual highlights matching the user requirements.',
                  },
                  tradeoffOrTip: {
                    type: Type.STRING,
                    description: '1 practical tip, concession opportunity, or tradeoff to keep in mind.',
                  },
                },
                required: [
                  'rank',
                  'venueId',
                  'fitSummary',
                  'budgetBreakdownNote',
                  'matchedHighlights',
                  'tradeoffOrTip',
                ],
              },
            },
          },
          required: ['matcherOverview', 'recommendations'],
        },
      },
    });

    const parsed = JSON.parse((response.text || '{}').trim());
    const deterministic = buildDeterministicMatches();

    // Validate & deduplicate returned venueIds against real catalog
    const seenIds = new Set<string>();
    const validRecommendations: any[] = [];

    if (Array.isArray(parsed.recommendations)) {
      for (const rec of parsed.recommendations) {
        const vid = String(rec?.venueId || '');
        if (!vid || !venueById.has(vid) || seenIds.has(vid)) continue;
        seenIds.add(vid);
        validRecommendations.push({
          rank: validRecommendations.length + 1,
          venueId: vid,
          fitSummary: String(rec.fitSummary || ''),
          budgetBreakdownNote: String(rec.budgetBreakdownNote || ''),
          matchedHighlights: Array.isArray(rec.matchedHighlights)
            ? rec.matchedHighlights.slice(0, 4).map(String)
            : [],
          tradeoffOrTip: String(rec.tradeoffOrTip || ''),
        });
        if (validRecommendations.length >= 3) break;
      }
    }

    // Backfill up to 3 from deterministic matches if Gemini returned fewer than 3 valid IDs
    for (const fallbackRec of deterministic.recommendations) {
      if (validRecommendations.length >= 3) break;
      if (!seenIds.has(fallbackRec.venueId)) {
        seenIds.add(fallbackRec.venueId);
        validRecommendations.push({
          ...fallbackRec,
          rank: validRecommendations.length + 1,
        });
      }
    }

    return res.json({
      matcherOverview: parsed.matcherOverview || deterministic.matcherOverview,
      recommendations: validRecommendations,
      generatedWith: 'Gemini 4 Hydrogen Smart Venue Matcher',
      generatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Smart Venue Matcher Error:', err);
    return res.json(buildDeterministicMatches());
  }
});

// ============================================================================
// 8. Real-Time Favorite Venue Availability & Cancellation Notification Broker (SSE)
// ============================================================================

interface ServerFavoriteVenueAlert {
  id: string;
  venueId: string;
  venueName: string;
  district: string;
  locality: string;
  alertKind: 'PANCHANGA_DATE_OPEN' | 'LAST_MINUTE_CANCELLATION';
  title: string;
  message: string;
  dateBS: string;
  dateAD: string;
  shift: 'MORNING' | 'DAY' | 'EVENING' | 'FULL_DAY';
  hallName?: string;
  tithi?: string;
  nakshatra?: string;
  auspiciousTime?: string;
  discountOrIncentiveNote?: string;
  sourceBookingRef?: string;
  createdAt: string;
  isRead: boolean;
}

const sseClients = new Set<Response>();

let favoriteVenueAlertsStore: ServerFavoriteVenueAlert[] = [
  {
    id: 'fav-alert-seed-1',
    venueId: 'venue-regal-pavilion-ktm',
    venueName: 'The Regal Pavilion & Heritage Banquet',
    district: 'Kathmandu',
    locality: 'Naxal (Near Narayanhiti)',
    alertKind: 'LAST_MINUTE_CANCELLATION',
    title: 'Last-Minute Evening Slot Released at The Regal Pavilion',
    message:
      'Booking #SGN-2083-4890 was released by the prior host. Grand Kailash Ballroom is now immediately open for 2083 Mangsir 09 (Vivah Muhurat) Evening Shift.',
    dateBS: '2083 Mangsir 09',
    dateAD: '2026-11-25',
    shift: 'EVENING',
    hallName: 'Grand Kailash Ballroom',
    tithi: 'Purnima / Pratipada',
    nakshatra: 'Rohini (रोहिणी)',
    auspiciousTime: '04:30 PM - 10:30 PM',
    discountOrIncentiveNote: 'Priority Express Rebooking · 10% Deposit Transfer Fee Waived',
    sourceBookingRef: 'SGN-2083-4890',
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    isRead: false,
  },
  {
    id: 'fav-alert-seed-2',
    venueId: 'venue-lalitpur-royal-palace',
    venueName: 'Lalitpur Royal Heritage Palace',
    district: 'Lalitpur',
    locality: 'Jhamsikhel / Patan',
    alertKind: 'PANCHANGA_DATE_OPEN',
    title: 'Basanta Panchami Shubha Lagna Open at Lalitpur Royal Palace',
    message:
      'Universal auspicious Abhijit Muhurat on Basanta Panchami (2083 Magh 28) has verified Day Shift availability across Patan Imperial Courtyard.',
    dateBS: '2083 Magh 28',
    dateAD: '2027-02-11',
    shift: 'DAY',
    hallName: 'Patan Imperial Courtyard',
    tithi: 'Shukla Panchami (वसन्त पञ्चमी)',
    nakshatra: 'Revati (रेवती)',
    auspiciousTime: 'Abhijit Muhurat (11:45 AM - 12:35 PM)',
    discountOrIncentiveNote: 'Complimentary Vedic Mandap Floral Arch for Favorite Watchers',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    isRead: false,
  },
  {
    id: 'fav-alert-seed-3',
    venueId: 'venue-pokhara-lakeside-resort',
    venueName: 'Pokhara Lakeside Himalayan Resort & Banquet',
    district: 'Kaski',
    locality: 'Phewa Lakeside',
    alertKind: 'PANCHANGA_DATE_OPEN',
    title: 'Spring Vivah Muhurat Open at Pokhara Lakeside Resort',
    message:
      'Newly confirmed clear evening schedule for 2083 Falgun 15 (Shashthi • Swati Nakshatra) with Phewa Sunset Lawn access.',
    dateBS: '2083 Falgun 15',
    dateAD: '2027-02-27',
    shift: 'EVENING',
    hallName: 'Annapurna & Phewa Sunset Lawn',
    tithi: 'Shashthi (षष्ठी)',
    nakshatra: 'Swati (स्वाती)',
    auspiciousTime: '01:00 PM - 06:00 PM',
    discountOrIncentiveNote: 'Lakeside Ferry Welcome & Couple Sunset Boating Included',
    createdAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    isRead: true,
  },
  {
    id: 'fav-alert-seed-4',
    venueId: 'venue-bhaktapur-durbar-banquet',
    venueName: 'Bhaktapur Durbar Banquet & Juju Dhau Pavilion',
    district: 'Bhaktapur',
    locality: 'Suryabinayak / Durbar Marg',
    alertKind: 'LAST_MINUTE_CANCELLATION',
    title: 'Freed Uttarayana Slot at Bhaktapur Durbar Banquet',
    message:
      'Hold expired on Suryabinayak Main Hall for 2083 Falgun 18 Morning Shift (Navami • Anuradha Nakshatra). Ideal for Bratabandha or intimate Vivah.',
    dateBS: '2083 Falgun 18',
    dateAD: '2027-03-02',
    shift: 'MORNING',
    hallName: 'Suryabinayak Main Hall',
    tithi: 'Navami (नवमी)',
    nakshatra: 'Anuradha (अनुराधा)',
    auspiciousTime: '08:00 AM - 12:30 PM',
    discountOrIncentiveNote: 'Complimentary Juju Dhau Welcome Service',
    sourceBookingRef: 'SGN-2083-3918-HOLD',
    createdAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    isRead: false,
  },
];

function broadcastSseEvent(eventName: string, data: unknown) {
  const frame = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(frame);
    } catch {
      sseClients.delete(client);
    }
  }
}

// SSE subscription endpoint
apiRouter.get('/favorite-venue-alerts/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  // Serverless environments (Vercel) cannot hold persistent open sockets; use native EventSource retry interval
  if (process.env.VERCEL) {
    res.write('retry: 10000\n');
    res.write(
      `event: init\ndata: ${JSON.stringify({
        alerts: favoriteVenueAlertsStore,
        connectedClients: 1,
        serverTime: new Date().toISOString(),
        mode: 'serverless-sse',
      })}\n\n`
    );
    res.end();
    return;
  }

  sseClients.add(res);

  // Initial authoritative snapshot so clients synchronize cleanly on connect/reconnect
  res.write(
    `event: init\ndata: ${JSON.stringify({
      alerts: favoriteVenueAlertsStore,
      connectedClients: sseClients.size,
      serverTime: new Date().toISOString(),
    })}\n\n`
  );

  // Proxy keep-alive comment only (never emits synthetic alerts)
  const keepAliveTimer = setInterval(() => {
    try {
      res.write(`: keepalive ${Date.now()}\n\n`);
    } catch {
      clearInterval(keepAliveTimer);
      sseClients.delete(res);
    }
  }, 25000);

  req.on('close', () => {
    clearInterval(keepAliveTimer);
    sseClients.delete(res);
  });
});

// REST snapshot getter
apiRouter.get('/favorite-venue-alerts', (_req, res) => {
  res.json({ alerts: favoriteVenueAlertsStore });
});

// Publish a real-time alert (e.g. booking cancellation or venue slot release) and broadcast via SSE
apiRouter.post('/favorite-venue-alerts/publish', (req, res) => {
  const body = req.body || {};
  const venueId = String(body.venueId || '').trim();
  const venueName = String(body.venueName || '').trim();
  const alertKind: ServerFavoriteVenueAlert['alertKind'] =
    body.alertKind === 'LAST_MINUTE_CANCELLATION' ? 'LAST_MINUTE_CANCELLATION' : 'PANCHANGA_DATE_OPEN';
  const dateBS = String(body.dateBS || '').trim();
  const dateAD = String(body.dateAD || '').trim();
  const shift: ServerFavoriteVenueAlert['shift'] =
    body.shift === 'MORNING' || body.shift === 'DAY' || body.shift === 'EVENING' || body.shift === 'FULL_DAY'
      ? body.shift
      : 'DAY';

  if (!venueId || !venueName || !dateBS) {
    return res.status(400).json({ error: 'venueId, venueName, and dateBS are required.' });
  }

  const incomingId = String(body.id || '').trim();
  const existing = favoriteVenueAlertsStore.find(
    (a) =>
      (incomingId && a.id === incomingId) ||
      (a.venueId === venueId &&
        a.alertKind === alertKind &&
        a.dateBS === dateBS &&
        a.shift === shift &&
        (!body.sourceBookingRef || a.sourceBookingRef === body.sourceBookingRef))
  );

  if (existing) {
    return res.json({ alert: existing, deduplicated: true });
  }

  const newAlert: ServerFavoriteVenueAlert = {
    id: incomingId || `fav-alert-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    venueId,
    venueName,
    district: String(body.district || 'Kathmandu'),
    locality: String(body.locality || ''),
    alertKind,
    title:
      String(body.title || '').trim() ||
      (alertKind === 'LAST_MINUTE_CANCELLATION'
        ? `Last-Minute Cancellation Opening at ${venueName}`
        : `New Panchanga Date Open at ${venueName}`),
    message:
      String(body.message || '').trim() ||
      (alertKind === 'LAST_MINUTE_CANCELLATION'
        ? `A prior reservation${body.sourceBookingRef ? ` (#${body.sourceBookingRef})` : ''} was cancelled, opening ${dateBS} (${shift} Shift)${body.hallName ? ` at ${body.hallName}` : ''}.`
        : `${venueName} has verified availability on auspicious Panchanga date ${dateBS} (${shift} Shift)${body.hallName ? ` · ${body.hallName}` : ''}.`),
    dateBS,
    dateAD: dateAD || '2027-02-27',
    shift,
    hallName: body.hallName ? String(body.hallName) : undefined,
    tithi: body.tithi ? String(body.tithi) : undefined,
    nakshatra: body.nakshatra ? String(body.nakshatra) : undefined,
    auspiciousTime: body.auspiciousTime ? String(body.auspiciousTime) : undefined,
    discountOrIncentiveNote: body.discountOrIncentiveNote
      ? String(body.discountOrIncentiveNote)
      : undefined,
    sourceBookingRef: body.sourceBookingRef ? String(body.sourceBookingRef) : undefined,
    createdAt: new Date().toISOString(),
    isRead: false,
  };

  favoriteVenueAlertsStore = [newAlert, ...favoriteVenueAlertsStore].slice(0, 60);
  broadcastSseEvent('alert:created', { alert: newAlert });

  return res.status(201).json({ alert: newAlert, deduplicated: false });
});

// Deterministic server scan comparing favorited venues against bookings + Panchanga Muhurats
apiRouter.post('/favorite-venue-alerts/scan-availability', (req, res) => {
  const favoriteVenues = Array.isArray(req.body?.favoriteVenues) ? req.body.favoriteVenues : [];
  const bookings = Array.isArray(req.body?.bookings) ? req.body.bookings : [];
  const muhurats = Array.isArray(req.body?.muhurats) ? req.body.muhurats : [];

  if (favoriteVenues.length === 0) {
    return res.json({ discoveredAlerts: [], newlyDiscovered: 0 });
  }

  const discoveredAlerts: ServerFavoriteVenueAlert[] = [];

  // 1. Check any cancelled bookings at favorite venues not yet alerted
  for (const b of bookings) {
    if (discoveredAlerts.length >= 2) break;
    if (b?.status !== 'CANCELLED') continue;
    const fav = favoriteVenues.find((v: any) => v.id === b.venueId);
    if (!fav) continue;

    const alreadySent = favoriteVenueAlertsStore.some(
      (a) =>
        a.venueId === fav.id &&
        a.alertKind === 'LAST_MINUTE_CANCELLATION' &&
        a.dateBS === b.eventDateBS &&
        a.shift === b.shift
    );
    if (alreadySent) continue;

    const created: ServerFavoriteVenueAlert = {
      id: `fav-alert-scan-cxl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      venueId: String(fav.id),
      venueName: String(fav.name),
      district: String(fav.district || 'Kathmandu'),
      locality: String(fav.locality || ''),
      alertKind: 'LAST_MINUTE_CANCELLATION',
      title: `Cancelled Booking Slot Open at ${fav.name}`,
      message: `Booking #${b.bookingRef || 'RELEASED'} for ${b.eventDateBS} (${b.shift} Shift) is cancelled and ready for instant booking.`,
      dateBS: String(b.eventDateBS),
      dateAD: String(b.eventDateAD || ''),
      shift: b.shift || 'DAY',
      hallName: b.hallName ? String(b.hallName) : fav.hallNames?.[0],
      discountOrIncentiveNote: 'Fast-Track Replacement Slot · Immediate Escrow Transfer',
      sourceBookingRef: b.bookingRef ? String(b.bookingRef) : undefined,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    favoriteVenueAlertsStore = [created, ...favoriteVenueAlertsStore].slice(0, 60);
    discoveredAlerts.push(created);
    broadcastSseEvent('alert:created', { alert: created });
  }

  // 2. Check open Panchanga Muhurat dates across favorite venues without confirmed/hold collisions
  const candidateShifts: Array<ServerFavoriteVenueAlert['shift']> = ['EVENING', 'DAY', 'MORNING'];
  for (const fav of favoriteVenues) {
    if (discoveredAlerts.length >= 2) break;
    for (const m of muhurats) {
      if (discoveredAlerts.length >= 2) break;
      for (const shift of candidateShifts) {
        const hasBooking = bookings.some(
          (b: any) =>
            b.venueId === fav.id &&
            b.eventDateBS === m.dateBS &&
            b.shift === shift &&
            b.status !== 'CANCELLED'
        );
        if (hasBooking) continue;

        const alreadyAlerted = favoriteVenueAlertsStore.some(
          (a) => a.venueId === fav.id && a.dateBS === m.dateBS && a.shift === shift
        );
        if (alreadyAlerted) continue;

        const created: ServerFavoriteVenueAlert = {
          id: `fav-alert-scan-pan-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          venueId: String(fav.id),
          venueName: String(fav.name),
          district: String(fav.district || 'Kathmandu'),
          locality: String(fav.locality || ''),
          alertKind: 'PANCHANGA_DATE_OPEN',
          title: `Open ${m.eventType || 'Subha'} Panchanga Slot at ${fav.name}`,
          message: `Verified open ${shift.toLowerCase()} shift on ${m.dateBS} (${m.tithi} • ${m.nakshatra})${fav.hallNames?.[0] ? ` in ${fav.hallNames[0]}` : ''}.`,
          dateBS: String(m.dateBS),
          dateAD: String(m.dateAD),
          shift,
          hallName: fav.hallNames?.[0],
          tithi: String(m.tithi || ''),
          nakshatra: String(m.nakshatra || ''),
          auspiciousTime: String(m.auspiciousTime || ''),
          discountOrIncentiveNote: 'Matched Your Saved Favorite Venue & Panchanga Calendar',
          createdAt: new Date().toISOString(),
          isRead: false,
        };

        favoriteVenueAlertsStore = [created, ...favoriteVenueAlertsStore].slice(0, 60);
        discoveredAlerts.push(created);
        broadcastSseEvent('alert:created', { alert: created });
        break;
      }
      if (discoveredAlerts.length >= 2) break;
    }
  }

  return res.json({
    discoveredAlerts,
    newlyDiscovered: discoveredAlerts.length,
    checkedAt: new Date().toISOString(),
  });
});

// Mark one or all favorite venue alerts read
apiRouter.post('/favorite-venue-alerts/mark-read', (req, res) => {
  const { alertId, markAll, venueIds } = req.body || {};

  if (markAll) {
    const idSet = Array.isArray(venueIds) ? new Set<string>(venueIds.map(String)) : null;
    favoriteVenueAlertsStore = favoriteVenueAlertsStore.map((a) =>
      !idSet || idSet.has(a.venueId) ? { ...a, isRead: true } : a
    );
    broadcastSseEvent('alert:sync', { alerts: favoriteVenueAlertsStore });
    return res.json({ updated: true, alerts: favoriteVenueAlertsStore });
  }

  if (!alertId) {
    return res.status(400).json({ error: 'alertId or markAll=true is required.' });
  }

  let updatedAlert: ServerFavoriteVenueAlert | undefined;
  favoriteVenueAlertsStore = favoriteVenueAlertsStore.map((a) => {
    if (a.id === alertId) {
      updatedAlert = { ...a, isRead: true };
      return updatedAlert;
    }
    return a;
  });

  if (updatedAlert) {
    broadcastSseEvent('alert:updated', { alert: updatedAlert });
  }

  return res.json({ updated: Boolean(updatedAlert), alert: updatedAlert || null });
});

// ---------------------------------------------------------------------------
// 9. SAGUNOO Full-Service Managed Event Global Sourcing & Blueprint Generator
// ---------------------------------------------------------------------------
apiRouter.post('/managed-event/suggest-blueprint', async (req, res) => {
  const dossier = req.body || {};
  const eventTitle = String(dossier.eventTitle || 'SAGUNOO Managed Celebration').slice(0, 180);
  const eventType = String(dossier.eventType || 'WEDDING').slice(0, 60);
  const eventScope = dossier.eventScope === 'OUTSIDE_NEPAL' ? 'OUTSIDE_NEPAL' : 'INSIDE_NEPAL';
  const locationLabel = [dossier.cityOrLocality, dossier.district, dossier.province, dossier.country]
    .filter(Boolean)
    .join(', ') || 'Kathmandu Valley, Nepal';
  const eventDateBS = String(dossier.eventDateBS || '2083 Magh 28').slice(0, 60);
  const eventDateAD = String(dossier.eventDateAD || '2027-02-11').slice(0, 40);
  const shift = String(dossier.shift || 'FULL_DAY').slice(0, 20);
  const startTime = String(dossier.startTime || '09:30 AM').slice(0, 20);
  const endTime = String(dossier.endTime || '10:00 PM').slice(0, 20);
  const totalPax = Math.max(20, Math.min(10000, Number(dossier.totalPax) || 350));
  const budgetCurrency = String(dossier.budgetCurrency || 'NPR').slice(0, 10);
  const totalBudget = Math.max(1000, Number(dossier.totalBudget) || 1500000);
  const vendorFunctions = Array.isArray(dossier.vendorFunctions) ? dossier.vendorFunctions : [];
  const activeVFs = vendorFunctions.filter((vf: any) => vf?.isEnabled && vf?.mode !== 'NOT_NEEDED');
  const clientOwnVFs = activeVFs.filter((vf: any) => vf?.mode === 'CLIENT_HAS_OWN_VENDOR');

  const buildDeterministicBlueprint = () => {
    const perGuest = Math.round(totalBudget / Math.max(1, totalPax));
    const isDayOrMorning = shift === 'MORNING' || shift === 'FULL_DAY';

    return {
      executiveSummary: `Tailored Full-Service Execution Blueprint for "${eventTitle}" (${totalPax} guests in ${locationLabel}) on ${eventDateBS} BS (${eventDateAD}). Within ${budgetCurrency} ${totalBudget.toLocaleString()} (~${budgetCurrency} ${perGuest.toLocaleString()}/guest), SAGUNOO manages ${
        activeVFs.length - clientOwnVFs.length
      } turnkey vendor functions and seamlessly integrates ${clientOwnVFs.length} client-appointed vendor(s). Every suggestion remains editable under full client authority.`,
      panchangaAndTimingAdvice: `For ${shift} (${startTime} – ${endTime}) in ${locationLabel}: Schedule vendor load-in 150 minutes prior, lock acoustic soundcheck 45 minutes before VIP arrival, and reserve a buffer block ahead of dining service to protect ceremony punctuality.`,
      recommendedRunOfShow: [
        {
          id: 'ai-slot-1',
          timeSlot: isDayOrMorning ? '07:00 AM - 08:45 AM' : '12:00 PM - 02:30 PM',
          activity: 'Technical Rigging, Floral Mandap Sign-Off & Backup Genset Load Test',
          leadOwner: 'SAGUNOO Executive Director + Venue Engineer',
          notes: 'Inspect kitchen hygiene temperature logs, fire extinguishers & elder wheelchair ramps.',
          included: true,
        },
        {
          id: 'ai-slot-2',
          timeSlot: startTime,
          activity: `Guest Welcome, Cultural Procession & QR Check-In Desk (${totalPax} Pax)`,
          leadOwner: 'Welcome Ushers + Cultural Music Ensemble',
          notes: 'Coordinate valet parking flow and welcome beverage distribution from entrance plaza.',
          included: true,
        },
        {
          id: 'ai-slot-3',
          timeSlot: isDayOrMorning ? '10:30 AM - 01:00 PM' : '05:30 PM - 07:30 PM',
          activity:
            eventType === 'CORPORATE_GALA'
              ? 'Main Plenary Keynote, Awards & Stage Production'
              : 'Sacred Subha Muhurat Ceremony / Signature Celebration Moment',
          leadOwner: 'Ceremonial Lead / Show Caller + Photo/Drone Crew',
          notes: 'Real-time kitchen prep headcount confirmed via Nimantrana RSVP scan count.',
          included: true,
        },
        {
          id: 'ai-slot-4',
          timeSlot: isDayOrMorning ? '01:00 PM - 03:00 PM' : '07:30 PM - 09:30 PM',
          activity: 'Multi-Island Feast Service (Isolated Veg/Jain/Halal + Live Stations)',
          leadOwner: 'Executive Catering Chef + Banquet Service Captains',
          notes: 'Dedicated senior citizen seated buffet assistance & allergen signage at every chafing dish.',
          included: true,
        },
        {
          id: 'ai-slot-5',
          timeSlot: endTime,
          activity:
            eventScope === 'INSIDE_NEPAL'
              ? '10:00 PM DAO Sound Curfew Transition, Farewell & Annapurna Food Rescue'
              : 'Send-Off Finale, Gift Hampers & Post-Event Surplus Food Recovery',
          leadOwner: 'SAGUNOO Night Producer + Operations Crew',
          notes: 'Complete venue strike audit and final vendor sign-off.',
          included: true,
        },
      ],
      vendorCoordinationPlaybook: [
        'Appoint one dedicated SAGUNOO Producer as the single command bridge between all client-chosen and marketplace vendors.',
        'Consolidate load-in windows across venue, decor, AV riggers, and kitchen supply trucks to eliminate venue bottlenecks.',
        'Lock 48-hour weather contingency trigger between garden lawn and backup indoor hall.',
        'Synchronize Digital Nimantrana guest counts with kitchen brigade 24 hours prior to curb food waste.',
      ],
      globalRiskAndPermitsChecklist: [
        {
          id: 'ai-chk-1',
          category: 'PERMITS_CURFEW',
          item:
            eventScope === 'INSIDE_NEPAL'
              ? 'DAO 10:00 PM outdoor PA sound curfew compliance & municipal banquet permit verified'
              : 'Local municipal noise ordinance, open-flame Havan permit & drone clearance obtained',
          completed: false,
        },
        {
          id: 'ai-chk-2',
          category: 'WEATHER_SAFETY',
          item: 'Rain/wind backup enclosure, 65+ kVA dual generator & kitchen fire suppression check',
          completed: false,
        },
        {
          id: 'ai-chk-3',
          category: 'GUEST_CARE',
          item: 'Step-free elder access, quiet medical standby, & allergenic/dietary kitchen isolation',
          completed: false,
        },
        {
          id: 'ai-chk-4',
          category: 'VENDOR_HANDOFF',
          item: `Pre-event technical briefing completed for all ${activeVFs.length} active vendor functions`,
          completed: false,
        },
      ],
      webSources: [],
      generatedWith: 'SAGUNOO Global Event Production Synthesizer',
      generatedAt: new Date().toISOString(),
    };
  };

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.json(buildDeterministicBlueprint());
    }

    const vendorSummary = activeVFs
      .map(
        (vf: any) =>
          `- ${vf.label}: mode=${vf.mode}, tier=${vf.selectedTier}, budget=${budgetCurrency} ${vf.allocatedBudgetAmount}, vendor="${vf.preferredVendorOrVenueName || 'SAGUNOO to source'}", specs="${vf.specifications || ''}"`
      )
      .join('\n');

    const prompt = `
You are SAGUNOO's Chief Global Event Director & Executive Producer.
A client wants SAGUNOO itself to organize their entire event end-to-end, starting from their core time, date, pax, budget, and all requested vendor functions.
Using Google Search grounding for authentic regional/seasonal/weather, permit, hospitality, and global event-management best practices for ${locationLabel}, generate a practical, suggestive, client-editable blueprint.

Client Dossier:
- Event Title: ${eventTitle}
- Event Type: ${eventType}
- Scope & Location: ${eventScope} · ${locationLabel}
- Date: ${eventDateBS} BS / ${eventDateAD} AD (Shift: ${shift}, ${startTime} - ${endTime})
- Total Pax: ${totalPax} guests (Elders: ${dossier.paxBreakdown?.eldersRequiringAccess || 0}, Children: ${dossier.paxBreakdown?.children || 0}, VIPs: ${dossier.paxBreakdown?.vipHeads || 0}, Rooms needed: ${dossier.paxBreakdown?.outstationGuestsNeedingRooms || 0})
- Budget Ceiling: ${budgetCurrency} ${totalBudget} (${dossier.budgetFlexibility || 'VALUE_OPTIMIZED'})
- Weather Contingency: ${dossier.globalStandards?.weatherBackupContingency || 'INDOOR_BACKUP_HALL'}
- Dietary & Bar: ${(dossier.globalStandards?.dietarySeparations || []).join(', ') || 'Standard'} | ${dossier.globalStandards?.barPolicy || 'Non-alcoholic / curated'}
- Active Vendor Functions Configured by Client:
${vendorSummary || 'All standard vendor functions'}

Return ONLY a valid JSON object inside a \`\`\`json code fence with exact keys:
{
  "executiveSummary": "2-3 sentence tailored strategic summary honoring date, pax, location, budget & vendor mix",
  "panchangaAndTimingAdvice": "2-3 sentence seasonal weather, timing, curfew/permit & setup advice specific to location and date",
  "recommendedRunOfShow": [
    { "id": "slot-1", "timeSlot": "...", "activity": "...", "leadOwner": "...", "notes": "...", "included": true }
  ],
  "vendorCoordinationPlaybook": ["4 concise actionable coordination rules factoring in client's own vendors and SAGUNOO-sourced vendors"],
  "globalRiskAndPermitsChecklist": [
    { "id": "chk-1", "category": "PERMITS_CURFEW" | "WEATHER_SAFETY" | "VENDOR_HANDOFF" | "GUEST_CARE", "item": "...", "completed": false }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction:
          'You are an international senior event producer for SAGUNOO. Always incorporate seasonal climate considerations, local noise/fire/drone permits, accessible hospitality for elders/children, and seamless vendor run-of-show synchronization. Return valid JSON inside a ```json fence.',
      },
    });

    const rawText = response.text || '';
    const jsonMatch = rawText.match(/```json\s*([\s\S]*?)```/i) || rawText.match(/(\{[\s\S]*\})/);
    const fallback = buildDeterministicBlueprint();
    let parsed: any = {};

    if (jsonMatch && jsonMatch[1]) {
      try {
        parsed = JSON.parse(jsonMatch[1].trim());
      } catch {
        parsed = {};
      }
    }

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSources = groundingChunks
      .filter((c: any) => c.web)
      .map((c: any) => ({
        title: String(c.web.title || 'Verified Reference'),
        uri: String(c.web.uri || ''),
      }))
      .filter((s: any) => s.uri);

    return res.json({
      executiveSummary: parsed.executiveSummary || fallback.executiveSummary,
      panchangaAndTimingAdvice: parsed.panchangaAndTimingAdvice || fallback.panchangaAndTimingAdvice,
      recommendedRunOfShow:
        Array.isArray(parsed.recommendedRunOfShow) && parsed.recommendedRunOfShow.length > 0
          ? parsed.recommendedRunOfShow.map((s: any, idx: number) => ({
              id: String(s.id || `slot-${idx + 1}`),
              timeSlot: String(s.timeSlot || ''),
              activity: String(s.activity || ''),
              leadOwner: String(s.leadOwner || 'SAGUNOO Event Director'),
              notes: String(s.notes || ''),
              included: s.included !== false,
            }))
          : fallback.recommendedRunOfShow,
      vendorCoordinationPlaybook:
        Array.isArray(parsed.vendorCoordinationPlaybook) && parsed.vendorCoordinationPlaybook.length > 0
          ? parsed.vendorCoordinationPlaybook.map(String)
          : fallback.vendorCoordinationPlaybook,
      globalRiskAndPermitsChecklist:
        Array.isArray(parsed.globalRiskAndPermitsChecklist) && parsed.globalRiskAndPermitsChecklist.length > 0
          ? parsed.globalRiskAndPermitsChecklist.map((c: any, idx: number) => ({
              id: String(c.id || `chk-${idx + 1}`),
              category: ['PERMITS_CURFEW', 'WEATHER_SAFETY', 'VENDOR_HANDOFF', 'GUEST_CARE'].includes(c.category)
                ? c.category
                : 'PERMITS_CURFEW',
              item: String(c.item || ''),
              completed: Boolean(c.completed),
            }))
          : fallback.globalRiskAndPermitsChecklist,
      webSources,
      generatedWith: 'Gemini 4 Hydrogen + Google Search Global Sourcing',
      generatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Managed Event Blueprint Error:', err);
    return res.json(buildDeterministicBlueprint());
  }
});




