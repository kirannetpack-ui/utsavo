/**
 * UTSAVO — Full-Service Managed Event Templates & Suggestive Blueprint Engine
 * Provides smart suggestive defaults across all 12 core vendor functions and global
 * event-production standards based on Date, Time, Pax, Budget, and Event Type,
 * while ensuring the client retains 100% authority to modify or override every selection.
 */

import {
  EventType,
  ManagedBlueprintChecklistItem,
  ManagedBlueprintTimelineSlot,
  ManagedEventBlueprint,
  ManagedEventRequest,
  ManagedVendorFunctionSpec,
  ShiftTime,
  VendorFunctionKey,
} from '../types';

export interface VendorFunctionCatalogMeta {
  key: VendorFunctionKey;
  label: string;
  nepaliLabel: string;
  categoryGroup: ManagedVendorFunctionSpec['categoryGroup'];
  defaultSharePercent: number;
  summaryHint: string;
  suggestedSpecPrompt: string;
}

export const VENDOR_FUNCTION_CATALOG: VendorFunctionCatalogMeta[] = [
  {
    key: 'VENUE_AND_HALL',
    label: 'Venue, Party Palace or Star Hotel Ballroom',
    nepaliLabel: 'भेन्यु / पार्टी प्यालेस / तारे होटल हल',
    categoryGroup: 'CORE_HOSPITALITY',
    defaultSharePercent: 18,
    summaryHint: 'Hall rental, VIP changing rooms, valet parking courtyard, HVAC & backup genset load',
    suggestedSpecPrompt: 'Ballroom + outdoor pre-function garden lawn, dedicated green room & VIP lounge',
  },
  {
    key: 'CATERING_AND_BEVERAGE',
    label: 'Multi-Cuisine Catering, Live Counters & Bar',
    nepaliLabel: 'भोज, परिकार, लाइभ काउन्टर र पेय',
    categoryGroup: 'CORE_HOSPITALITY',
    defaultSharePercent: 36,
    summaryHint: 'Per-plate buffet, separate Veg/Jain/Halal prep lines, Sel Roti/Momo live bars & welcome drinks',
    suggestedSpecPrompt: 'Welcome drinks, 6 starters, live Momo & Chaat counters, Royal Thakali/Newari & Continental mains',
  },
  {
    key: 'DECOR_MANDAP_FLORAL',
    label: 'Stage, Sacred Mandap & Fresh Floral Styling',
    nepaliLabel: 'मण्डप, स्टेज तथा फूल सजावट',
    categoryGroup: 'CEREMONIAL_TALENT',
    defaultSharePercent: 12,
    summaryHint: 'Architectural entrance gate, brass/floral Mandap, guest lounge tables & cold-spark runway',
    suggestedSpecPrompt: 'Custom marigold & jasmine floral Mandap with velvet lounge seating & ambient table centerpieces',
  },
  {
    key: 'PHOTOGRAPHY_CINEMA_DRONE',
    label: 'Candid Photo, 4K Cinema, Drone & Livestream',
    nepaliLabel: 'फोटो, ४K भिडियो, ड्रोन र लाइभ प्रसारण',
    categoryGroup: 'CEREMONIAL_TALENT',
    defaultSharePercent: 8,
    summaryHint: 'Multi-camera storytelling, licensed aerial drone ops, same-day teaser & 4K broadcast for abroad family',
    suggestedSpecPrompt: '2 candid photographers, 2 cinema shooters, licensed drone coverage & private YouTube/Zoom stream',
  },
  {
    key: 'CULTURAL_ARTISTS_MUSIC',
    label: 'Cultural Ensembles, Panche/Dhime Baja & DJ/Band',
    nepaliLabel: 'पञ्चेबाजा, धिमे बाजा, लोक नृत्य र डीजे',
    categoryGroup: 'CEREMONIAL_TALENT',
    defaultSharePercent: 5,
    summaryHint: 'Traditional Panche/Naumati Baja, Newari Dhime, Sarangi folk duo, acoustic Sangeet band or curated DJ',
    suggestedSpecPrompt: '9-piece Panche Baja morning Baraat + acoustic cocktail ensemble & evening DJ',
  },
  {
    key: 'VEDIC_PUROHIT_RITUALS',
    label: 'Bilingual Vedic Purohit / Rituals & Puja Samagri',
    nepaliLabel: 'वैदिक पण्डित, विधि तथा पूजा सामग्री',
    categoryGroup: 'CEREMONIAL_TALENT',
    defaultSharePercent: 2,
    summaryHint: 'Nepal Panchanga aligned rituals, Nepali/English narration for guests & complete copper Puja Samagri kit',
    suggestedSpecPrompt: 'Senior Vedic Acharya explaining rituals in Nepali & English + pre-packed brass Havan & Samagri kit',
  },
  {
    key: 'BRIDAL_GROOM_GLAM_ATTIRE',
    label: 'Bridal/Groom Makeup, Mehndi & Heritage Wardrobe',
    nepaliLabel: 'मेकअप, मेहन्दी र परम्परागत पोशाक',
    categoryGroup: 'CEREMONIAL_TALENT',
    defaultSharePercent: 4,
    summaryHint: 'HD airbrush bridal styling, henna artists for guests, Dhaka Topi welcome kits, Daura Suruwal & Sari draping',
    suggestedSpecPrompt: 'Lead bridal MUA + 2 family draping stylists, henna booth & Dhaka Topi guest honors',
  },
  {
    key: 'SOUND_LIGHTING_AV_STAGE',
    label: 'Sound System, LED Wall, Lighting & Curfew Ops',
    nepaliLabel: 'साउन्ड, एलईडी वाल, लाइटिङ र कर्फ्यू व्यवस्थापन',
    categoryGroup: 'PRODUCTION_OPS',
    defaultSharePercent: 5,
    summaryHint: 'Distributed line-array acoustics, P3 LED backdrop, cordless mics, acoustic limiter & 10 PM curfew transition',
    suggestedSpecPrompt: 'Warm wash lighting, wireless lectern mics, LED backdrop & automated 10:00 PM dB transition',
  },
  {
    key: 'EVENT_STAFF_HOSPITALITY',
    label: 'Hospitality Crew: Ushers, Waiters, Halwai & Valet',
    nepaliLabel: 'स्वागत टोली, वेटर, कुक सहयोगी र भ्याले',
    categoryGroup: 'PRODUCTION_OPS',
    defaultSharePercent: 4,
    summaryHint: 'Labour Act 2074 statutory wage compliant banquet servers, elder escorts, valet marshals & backstage runners',
    suggestedSpecPrompt: '1:18 server-to-guest ratio, 4 uniformed welcome ushers, valet marshals & sanitation lead',
  },
  {
    key: 'LOGISTICS_TRANSFERS_STAYS',
    label: 'VIP Transfers, Hotel Room Blocks & Bridal Fleet',
    nepaliLabel: 'यातायात, होटल कोठा र भीआईपी सवारी',
    categoryGroup: 'PRODUCTION_OPS',
    defaultSharePercent: 4,
    summaryHint: 'Decorated Baraat/Bridal vehicle, airport pickup desk, shuttles between hotels & discounted guest room blocks',
    suggestedSpecPrompt: 'Airport meet-and-greet SUVs, 2 shuttle coasters for relatives & decorated bridal car',
  },
  {
    key: 'DIGITAL_NIMANTRANA_RSVP',
    label: 'Digital Nimantrana E-Cards, QR Check-In & Kitchen Sync',
    nepaliLabel: 'डिजिटल निम्तो, QR र भान्सा सिङ्क',
    categoryGroup: 'DIGITAL_AND_CARE',
    defaultSharePercent: 1,
    summaryHint: 'WhatsApp/Viber E-card dispatch, automated RSVP diet split (Veg/Mutton/Jain) & zero-waste plate count',
    suggestedSpecPrompt: 'Custom bilingual E-card with QR gate pass & live headcount sync to kitchen chef',
  },
  {
    key: 'ANNAPURNA_SUSTAINABILITY_RESCUE',
    label: 'Eco Zero-Plastic Protocol & Annapurna Food Rescue',
    nepaliLabel: 'पर्यावरण मैत्री र अन्नपूर्णा भोजन सेवा',
    categoryGroup: 'DIGITAL_AND_CARE',
    defaultSharePercent: 1,
    summaryHint: 'Plastic-free glass/ceramic serviceware, waste segregation & voluntary consent surplus food donation dispatch',
    suggestedSpecPrompt: 'Zero single-use plastics + opt-in DFTQC-compliant excess food rescue dispatch post-banquet',
  },
];

export function getSuggestedBudgetShares(
  eventType: EventType | 'DESTINATION_WEDDING' | 'ANNIVERSARY_RENEWAL'
): Record<VendorFunctionKey, number> {
  if (eventType === 'CORPORATE_GALA') {
    return {
      VENUE_AND_HALL: 20,
      CATERING_AND_BEVERAGE: 32,
      DECOR_MANDAP_FLORAL: 10,
      PHOTOGRAPHY_CINEMA_DRONE: 7,
      CULTURAL_ARTISTS_MUSIC: 4,
      VEDIC_PUROHIT_RITUALS: 0,
      BRIDAL_GROOM_GLAM_ATTIRE: 0,
      SOUND_LIGHTING_AV_STAGE: 14,
      EVENT_STAFF_HOSPITALITY: 6,
      LOGISTICS_TRANSFERS_STAYS: 4,
      DIGITAL_NIMANTRANA_RSVP: 2,
      ANNAPURNA_SUSTAINABILITY_RESCUE: 1,
    };
  }
  if (eventType === 'PASNI' || eventType === 'BIRTHDAY_JUBILEE' || eventType === 'GRIHA_PRAVESH') {
    return {
      VENUE_AND_HALL: 18,
      CATERING_AND_BEVERAGE: 40,
      DECOR_MANDAP_FLORAL: 12,
      PHOTOGRAPHY_CINEMA_DRONE: 10,
      CULTURAL_ARTISTS_MUSIC: 4,
      VEDIC_PUROHIT_RITUALS: 3,
      BRIDAL_GROOM_GLAM_ATTIRE: 3,
      SOUND_LIGHTING_AV_STAGE: 4,
      EVENT_STAFF_HOSPITALITY: 3,
      LOGISTICS_TRANSFERS_STAYS: 1,
      DIGITAL_NIMANTRANA_RSVP: 1,
      ANNAPURNA_SUSTAINABILITY_RESCUE: 1,
    };
  }
  // Default balanced wedding / reception / destination distribution totaling 100%
  return {
    VENUE_AND_HALL: 18,
    CATERING_AND_BEVERAGE: 36,
    DECOR_MANDAP_FLORAL: 12,
    PHOTOGRAPHY_CINEMA_DRONE: 8,
    CULTURAL_ARTISTS_MUSIC: 5,
    VEDIC_PUROHIT_RITUALS: 2,
    BRIDAL_GROOM_GLAM_ATTIRE: 4,
    SOUND_LIGHTING_AV_STAGE: 5,
    EVENT_STAFF_HOSPITALITY: 4,
    LOGISTICS_TRANSFERS_STAYS: 4,
    DIGITAL_NIMANTRANA_RSVP: 1,
    ANNAPURNA_SUSTAINABILITY_RESCUE: 1,
  };
}

export function buildSuggestiveVendorFunctions(
  eventType: EventType | 'DESTINATION_WEDDING' | 'ANNIVERSARY_RENEWAL',
  totalBudget: number,
  totalPax: number
): ManagedVendorFunctionSpec[] {
  const shares = getSuggestedBudgetShares(eventType);
  const safeBudget = Math.max(5000, Number(totalBudget) || 800000);
  const recommendedServers = Math.max(4, Math.ceil(totalPax / 20));

  return VENDOR_FUNCTION_CATALOG.map((meta) => {
    const share = shares[meta.key] ?? meta.defaultSharePercent;
    const isEnabled = share > 0;
    const allocated = Math.round((safeBudget * share) / 100);
    const dynamicSpecs =
      meta.key === 'EVENT_STAFF_HOSPITALITY'
        ? `${recommendedServers} trained banquet servers (1:20 ratio for ${totalPax} pax), welcome ushers & parking marshals`
        : meta.key === 'CATERING_AND_BEVERAGE'
        ? `Calibrated for ${totalPax} pax (~${Math.round(allocated / Math.max(1, totalPax)).toLocaleString()} per head ceiling incl. live counters)`
        : meta.suggestedSpecPrompt;

    return {
      key: meta.key,
      label: meta.label,
      nepaliLabel: meta.nepaliLabel,
      categoryGroup: meta.categoryGroup,
      isEnabled,
      mode: isEnabled ? 'UTSAVO_FULL_MANAGE' : 'NOT_NEEDED',
      clientAuthorityLocked: false,
      suggestedBudgetSharePercent: share,
      allocatedBudgetAmount: allocated,
      selectedTier: safeBudget >= 2500000 ? 'ROYAL_LUXURY' : safeBudget >= 900000 ? 'PREMIUM' : 'ESSENTIAL',
      preferredVendorOrVenueName: '',
      specifications: dynamicSpecs,
    };
  });
}

export function buildSuggestiveBlueprint(params: {
  eventTitle: string;
  eventType: EventType | 'DESTINATION_WEDDING' | 'ANNIVERSARY_RENEWAL';
  eventScope: 'INSIDE_NEPAL' | 'OUTSIDE_NEPAL';
  locationLabel: string;
  eventDateBS: string;
  eventDateAD: string;
  shift: ShiftTime;
  startTime: string;
  endTime: string;
  totalPax: number;
  budgetCurrency: string;
  totalBudget: number;
  vendorFunctions: ManagedVendorFunctionSpec[];
}): ManagedEventBlueprint {
  const activeFunctions = params.vendorFunctions.filter((vf) => vf.isEnabled && vf.mode !== 'NOT_NEEDED');
  const perHead = Math.round(params.totalBudget / Math.max(1, params.totalPax));
  const managedCount = activeFunctions.filter((vf) => vf.mode === 'UTSAVO_FULL_MANAGE').length;
  const ownVendorCount = activeFunctions.filter((vf) => vf.mode === 'CLIENT_HAS_OWN_VENDOR').length;

  const isMorningOrFull = params.shift === 'MORNING' || params.shift === 'FULL_DAY';

  const recommendedRunOfShow: ManagedBlueprintTimelineSlot[] = [
    {
      id: 'slot-loadin',
      timeSlot: isMorningOrFull ? '06:30 AM - 08:30 AM' : '11:30 AM - 02:30 PM',
      activity: 'Venue Handover, Decor Mandap Rigging, Soundcheck & Genset Load Test',
      leadOwner: 'UTSAVO Event Director + Venue Ops',
      notes: 'Verify 3-phase generator load, Havan fire extinguishers, and elder wheelchair ramp clearance.',
      included: true,
    },
    {
      id: 'slot-arrival',
      timeSlot: params.startTime || (isMorningOrFull ? '09:00 AM' : '04:30 PM'),
      activity: 'Guest Arrival, Panche Baja / Acoustic Welcome, QR Gate Check-In & Welcome Drinks',
      leadOwner: 'Hospitality Ushers + Valet & Cultural Ensemble',
      notes: `Calibrated arrival flow for ${params.totalPax} guests with chilled beverages & welcome kits.`,
      included: true,
    },
    {
      id: 'slot-ritual',
      timeSlot: isMorningOrFull ? '10:00 AM - 12:30 PM' : '05:30 PM - 07:15 PM',
      activity:
        params.eventType === 'CORPORATE_GALA'
          ? 'Keynote Stage Session, Felicitation & Panel Showcase'
          : 'Main Subha Muhurat Ritual / Ceremonial Highlight & Family Portraits',
      leadOwner:
        params.eventType === 'CORPORATE_GALA'
          ? 'AV Show Caller + Stage Emcee'
          : 'Bilingual Vedic Purohit + Lead Cinema & Drone Team',
      notes: 'Preserve 20-minute buffer for elders blessing photos before main feast opening.',
      included: true,
    },
    {
      id: 'slot-feast',
      timeSlot: isMorningOrFull ? '12:30 PM - 02:30 PM' : '07:15 PM - 09:30 PM',
      activity: 'Grand Celebration Feast Opens (Separate Veg/Jain/Halal Zones + Live Stations)',
      leadOwner: 'Executive Maharaj / Catering Lead + Banquet Captains',
      notes: 'Open 2 parallel double-sided buffet islands so every guest is served within 18 minutes.',
      included: true,
    },
    {
      id: 'slot-curfew',
      timeSlot: params.endTime || (isMorningOrFull ? '03:30 PM' : '10:00 PM'),
      activity:
        params.eventScope === 'INSIDE_NEPAL'
          ? 'DAO 10:00 PM Outdoor Sound Fade, Indoor Lounge Acoustic Wrap & Annapurna Food Rescue'
          : 'Evening Finale Toast, Gift Hamper Distribution & Voluntary Excess Food Recovery',
      leadOwner: 'UTSAVO Night Director + DFTQC Rescue Partner',
      notes: 'Pack sealed surplus food cleanly (if client opted in) and sign venue clearance log.',
      included: true,
    },
  ];

  const globalRiskAndPermitsChecklist: ManagedBlueprintChecklistItem[] = [
    {
      id: 'chk-curfew',
      category: 'PERMITS_CURFEW',
      item:
        params.eventScope === 'INSIDE_NEPAL'
          ? 'DAO Noise Curfew (10:00 PM outdoor PA cutoff) & Municipality banquet permit verified'
          : 'Local municipality noise ordinance, Havan smokeless fire permit & drone airspace clearance',
      completed: false,
    },
    {
      id: 'chk-weather',
      category: 'WEATHER_SAFETY',
      item: 'Weather contingency trigger (48h rain forecast switch to Indoor Backup Hall / Marquee)',
      completed: false,
    },
    {
      id: 'chk-access',
      category: 'GUEST_CARE',
      item: 'Senior citizen step-free access, dedicated quiet seating & first-aid standby confirmed',
      completed: false,
    },
    {
      id: 'chk-vendor-sync',
      category: 'VENDOR_HANDOFF',
      item: `Unified WhatsApp/Portal Run-of-Show group active across ${activeFunctions.length} enabled vendor functions (${ownVendorCount} client-provided synced)`,
      completed: false,
    },
    {
      id: 'chk-power',
      category: 'WEATHER_SAFETY',
      item: 'Backup silent generator (minimum 65 kVA load) & dedicated kitchen hygiene inspection',
      completed: false,
    },
  ];

  return {
    executiveSummary: `UTSAVO Full-Service Managed Event Blueprint for "${params.eventTitle}" (${params.totalPax} guests in ${params.locationLabel}) on ${params.eventDateBS} BS (${params.eventDateAD}). Configured with ${params.budgetCurrency} ${params.totalBudget.toLocaleString()} total ceiling (~${params.budgetCurrency} ${perHead.toLocaleString()}/guest): ${managedCount} vendor functions under UTSAVO end-to-end execution and ${ownVendorCount} client-owned vendor(s) integrated seamlessly. You retain 100% authority to tweak any function, budget share, or timeline slot.`,
    panchangaAndTimingAdvice: `For ${params.shift} window (${params.startTime}–${params.endTime}) on ${params.eventDateBS} BS, load-in begins 2.5 hours prior so floral Mandap, AV soundcheck, and kitchen sanitization finish 30 minutes before VIP guest arrivals.`,
    recommendedRunOfShow,
    vendorCoordinationPlaybook: [
      'Single-Point UTSAVO Executive Director coordinates all site visits, B2B royalty clearances & contract milestones.',
      'Client approves every vendor shortlist & sample menu before escrow release.',
      'Unified load-in dock schedule prevents traffic congestion between decor trucks, caterers & Panche Baja troupes.',
      'Real-time RSVP kitchen headcount sync prevents shortages or costly 20% over-buffering.',
    ],
    globalRiskAndPermitsChecklist,
    webSources: [],
    generatedWith: 'UTSAVO Smart Global Event Synthesizer',
    generatedAt: new Date().toISOString(),
  };
}

export const SEED_MANAGED_EVENT_REQUESTS: ManagedEventRequest[] = [
  {
    id: 'mgd-seed-1',
    requestRef: 'UTS-MGD-2083-9104',
    wantsUtsavoFullManagement: true,
    clientName: 'Kiran Sharma (Event Host)',
    clientEmail: 'kiran.sharma@example.com',
    clientPhone: '+977-9851098421',
    preferredContactChannel: 'PORTAL_AND_WHATSAPP',
    preferredCallbackWindow: '5:00 PM - 7:30 PM NPT',
    eventTitle: 'Sharma–Adhikari Royal Vivah & Reception Gala',
    eventType: 'WEDDING',
    eventScope: 'INSIDE_NEPAL',
    province: 'Bagmati Province',
    district: 'Kathmandu',
    cityOrLocality: 'Baluwatar / Maharajgunj',
    country: 'Nepal',
    eventDateBS: '2083 Magh 28',
    eventDateAD: '2027-02-11',
    isDateFlexible: false,
    muhuratPreference: 'Basanta Panchami Abhijit Muhurat (11:45 AM - 12:35 PM)',
    shift: 'FULL_DAY',
    startTime: '09:30 AM',
    endTime: '10:00 PM',
    multiDayCount: 2,
    totalPax: 450,
    paxBreakdown: {
      adults: 360,
      eldersRequiringAccess: 35,
      children: 35,
      vipHeads: 20,
      outstationGuestsNeedingRooms: 40,
    },
    budgetCurrency: 'NPR',
    totalBudget: 2400000,
    budgetFlexibility: 'FLEXIBLE_15_PERCENT',
    venueSettingPreference: 'HYBRID_INDOOR_OUTDOOR',
    vendorFunctions: buildSuggestiveVendorFunctions('WEDDING', 2400000, 450).map((vf) =>
      vf.key === 'VEDIC_PUROHIT_RITUALS'
        ? {
            ...vf,
            mode: 'CLIENT_HAS_OWN_VENDOR',
            clientAuthorityLocked: true,
            preferredVendorOrVenueName: 'Family Kul-Purohit Pt. Hari Prasad Sharma',
            specifications: 'Own family Purohit leading Sankalpa; UTSAVO supplies bilingual guide sheet & complete Puja Samagri kit.',
          }
        : vf.key === 'VENUE_AND_HALL'
        ? {
            ...vf,
            preferredVendorOrVenueName: 'The Regal Pavilion & Heritage Banquet (Shortlisted)',
          }
        : vf
    ),
    customVendorFunctions: [
      {
        id: 'cvf-seed-1',
        title: 'Live Maithili & Mithila Paubha Guest Keepsake Caricature Corner',
        mode: 'UTSAVO_FULL_MANAGE',
        budgetAmount: 35000,
        specifications: 'Two live artists painting custom mini keepsake portraits for outstation guests during reception.',
      },
    ],
    globalStandards: {
      weatherBackupContingency: 'INDOOR_BACKUP_HALL',
      accessibilityEldersKidsPlan: 'Golf-cart drop at porch, 4 wheelchairs standby, soft sofa zone for grandparents & quiet nursing room.',
      permitsAndCurfewCompliance: true,
      powerBackupAndSafetySpecs: 'Dual 82.5 kVA silent DG backup + CO2 kitchen & Havan fire marshals.',
      vipProtocolAndWelcomeKits: 'Ilam organic tea + woven Dhaka pouch welcome gifts at entrance desk with valet tag sync.',
      ecoZeroWastePreference: true,
      hybridLivestreamNeeds: true,
      culinaryStyles: ['Royal Nepali Thakali', 'Authentic Newari Samay Baji', 'North Indian Mughlai', 'Pan-Asian Live Wok'],
      dietarySeparations: ['Pure Vegetarian Island', 'Strict Jain Counter (No Garlic/Onion)', 'Low-Spice Elder Corner'],
      barPolicy: 'SIGNATURE_COCKTAILS',
      themeAndColorPalette: 'Crimson Velvet, Raw Marigold & Antique Brass',
      specialDreamsAndNonNegotiables: '100% punctual Panche Baja Baraat entry on Muhurat dot and crisp 4K broadcast for siblings in Toronto.',
    },
    blueprint: buildSuggestiveBlueprint({
      eventTitle: 'Sharma–Adhikari Royal Vivah & Reception Gala',
      eventType: 'WEDDING',
      eventScope: 'INSIDE_NEPAL',
      locationLabel: 'Baluwatar, Kathmandu, Bagmati Province',
      eventDateBS: '2083 Magh 28',
      eventDateAD: '2027-02-11',
      shift: 'FULL_DAY',
      startTime: '09:30 AM',
      endTime: '10:00 PM',
      totalPax: 450,
      budgetCurrency: 'NPR',
      totalBudget: 2400000,
      vendorFunctions: buildSuggestiveVendorFunctions('WEDDING', 2400000, 450),
    }),
    status: 'VENDOR_SOURCING_ACTIVE',
    assignedCoordinatorName: 'Aarav Shrestha (Senior UTSAVO Event Director)',
    assignedCoordinatorPhone: '+977-9801122334',
    coordinationMessages: [
      {
        id: 'mgd-msg-1',
        senderRole: 'UTSAVO_TEAM',
        senderName: 'Aarav Shrestha (UTSAVO Director)',
        channel: 'PORTAL_CHAT',
        text: 'Namaste Kiran! We received your full-service brief (#UTS-MGD-2083-9104) for Basanta Panchami. We placed a courtesy 48h hold on The Regal Pavilion and synced your family Purohit requirements with our Samagri kit team.',
        timestamp: '2026-11-12T09:15:00.000Z',
      },
      {
        id: 'mgd-msg-2',
        senderRole: 'CLIENT',
        senderName: 'Kiran Sharma',
        channel: 'PORTAL_CHAT',
        text: 'Thank you! Please also make sure our Pure Veg & Jain island is completely separated on the garden lawn terrace away from the non-veg grill.',
        timestamp: '2026-11-12T10:40:00.000Z',
      },
    ],
    teamActionUpdates: [
      '48h complimentary hall soft-hold placed at The Regal Pavilion (Baluwatar)',
      '9-piece Panche Baja troupe & 4K drone livestream unit availability verified for 2083 Magh 28',
      'Separate terrace Pure Veg & Jain kitchen island floorplan drafted',
    ],
    createdAt: '2026-11-12T08:50:00.000Z',
    updatedAt: '2026-11-12T10:40:00.000Z',
  },
];
