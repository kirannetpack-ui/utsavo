/**
 * UTSAVO - Backend API Router (Gemini AI Proxy & Endpoints)
 * Shared across standalone server (AI Studio dev) and Vercel serverless deployment
 */

import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';

export const apiRouter = Router();

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
    app: 'UTSAVO',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// 1. Multi-Turn Chatbot Endpoint (gemini-3.8-flash)
apiRouter.post('/chat', async (req, res) => {
  try {
    const { messages, systemInstruction } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const defaultInstruction =
      'You are UTSAVO AI, Nepal\'s premier event and celebration planning assistant. You guide users on wedding (Bibaha) customs, Bratabandha, Pasni, Newari bhoj, Terai Mithila traditions, Hindu Panchanga auspicious Muhurats, party palace selections, and catering budgets across Nepal\'s 7 provinces. Provide polite, culturally respectful, warm, and structured guidance in English and Nepali.';

    const formattedContents = messages.map((m: { role: string; text: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction || defaultInstruction,
      },
    });

    res.json({
      text: response.text || 'No response generated.',
    });
  } catch (err: any) {
    console.error('Chat API Error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate chat response' });
  }
});

// 2. Google Search Grounding Endpoint (gemini-3.8-flash with googleSearch)
apiRouter.post('/search', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'query is required' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
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

// 3. Google Maps Grounding Endpoint (gemini-3.8-flash with googleMaps)
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
      model: 'gemini-3.8-flash',
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
You are the Chief Destination Concierge for UTSAVO, Nepal's Smart Celebration & Tourism Authority.
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
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction:
          'You are UTSAVO Global Destination Concierge. You champion luxury destination tourism in Nepal, highlighting Pokhara, Kathmandu, Nagarkot, Chitwan, Muktinath, and Everest. Provide authoritative, warm, and structured event planning dossiers.',
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

