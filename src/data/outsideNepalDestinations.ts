/**
 * UTSAVO — Global Destination Celebrations Outside Nepal & Star Hotel Concierge Seed Data
 */

import {
  GlobalDestinationArchetype,
  OutsideNepalDestinationRequest,
  StarHotelSourcingRequest,
} from '../types';

export interface InternationalDestinationProfile {
  id: string;
  country: string;
  cityOrRegion: string;
  headline: string;
  bestMonths: string;
  directFlightsFromKtm: string;
  visaAdvisoryForNepaliGuests: string;
  vedicHavanFeasibility: string;
  recommendedArchetype: GlobalDestinationArchetype;
  startingBudgetUsd: number;
  highlightExperiences: string[];
  coverImage: string;
}

export const INTERNATIONAL_DESTINATIONS_OUTSIDE_NEPAL: InternationalDestinationProfile[] = [
  {
    id: 'intl-udaipur-jaipur',
    country: 'India',
    cityOrRegion: 'Udaipur & Jaipur (Rajasthan Palaces)',
    headline: 'Lakeside Royal Havelis, Vintage Baraat & Heritage Fortress Galas',
    bestMonths: 'October – March',
    directFlightsFromKtm: 'Direct flights Kathmandu → Delhi / Jaipur (1.5 hrs)',
    visaAdvisoryForNepaliGuests: 'Visa-free entry for Nepali citizens with valid passport or citizenship ID; smooth NRI e-Visa.',
    vedicHavanFeasibility: 'Full open-air Vedic Agni Mandap, elephant/horse Baraat & fireworks permitted at heritage palaces.',
    recommendedArchetype: 'ROYAL_PALACE_HAVELI',
    startingBudgetUsd: 35000,
    highlightExperiences: [
      'Private boat Baraat arrival across Lake Pichola',
      '100-piece brass band & folk Kalbeliya welcome',
      'Maharaj-crafted Nepali-Marwari royal thali feast',
    ],
    coverImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'intl-dubai-uae',
    country: 'United Arab Emirates',
    cityOrRegion: 'Dubai (Palm Jumeirah) & Abu Dhabi Desert Resorts',
    headline: '5-Star Palm Beachfront & Starlit Arabian Desert Dune Celebrations',
    bestMonths: 'November – March',
    directFlightsFromKtm: 'Direct 4.5-hr flights Kathmandu → Dubai / Abu Dhabi daily',
    visaAdvisoryForNepaliGuests: 'UTSAVO coordinates group 30/60-day UAE tourist visas through licensed hotel sponsors.',
    vedicHavanFeasibility: 'Permitted on designated private hotel beach lawns & sand-dune majlis with smokeless Havan kits.',
    recommendedArchetype: 'FIVE_STAR_LUXURY_RESORT',
    startingBudgetUsd: 48000,
    highlightExperiences: [
      'Private yacht Sangeet cruise past Dubai Marina skyline',
      'Arabian dune sunset cocktail with Sufi & Sarangi fusion',
      '5-star ballroom Vivah with gold-leaf floral Mandap',
    ],
    coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'intl-phuket-krabi',
    country: 'Thailand',
    cityOrRegion: 'Phuket, Krabi & Hua Hin Beachfront Sanctuary',
    headline: 'Cliffside Ocean-View Mandap & Tropical Villa Full-Resort Buyouts',
    bestMonths: 'November – April',
    directFlightsFromKtm: 'Direct flights Kathmandu → Bangkok (3.5 hrs) + 1 hr to Phuket',
    visaAdvisoryForNepaliGuests: 'Group sticker/e-Visa facilitation for Nepali passports; visa-exempt for most US/UK/EU/AU guests.',
    vedicHavanFeasibility: 'Full beachfront Sacred Fire Mandap & Panchai Baja allowed until 10:30 PM with indoor afterparty clubs.',
    recommendedArchetype: 'BEACHFRONT_BUYOUT',
    startingBudgetUsd: 32000,
    highlightExperiences: [
      'Floating infinity-pool floral Phere overlooking Andaman Sea',
      'Longtail boat island-hopping Haldi brunch',
      'Dedicated flown-in Nepali/Indian Maharaj culinary brigade',
    ],
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'intl-bali-indonesia',
    country: 'Indonesia',
    cityOrRegion: 'Uluwatu Cliffside & Ubud Rainforest, Bali',
    headline: 'Glass-Aisle Clifftop Chapels, Sacred Balinese Blessings & Poolside Galas',
    bestMonths: 'April – October',
    directFlightsFromKtm: '1-stop connections via Singapore, Kuala Lumpur, or Bangkok',
    visaAdvisoryForNepaliGuests: 'B211A sponsored e-Visa support for Nepali passport holders; Visa-on-Arrival for 90+ nationalities.',
    vedicHavanFeasibility: 'Hindu-Balinese hospitality warmly embraces Vedic Havan ceremonies, conch blowing, and floral archways.',
    recommendedArchetype: 'FIVE_STAR_LUXURY_RESORT',
    startingBudgetUsd: 34000,
    highlightExperiences: [
      'Transparent glass Mandap suspended above Uluwatu ocean surf',
      'Traditional Balinese Gamelan + Nepali Sarangi welcome duet',
      'Candlelit Ubud jungle canopy reception dinner',
    ],
    coverImage: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'intl-como-tuscany',
    country: 'Italy',
    cityOrRegion: 'Lake Como, Tuscany & Amalfi Historic Estates',
    headline: 'Renaissance Waterfront Villas, Vineyard Banquets & Classical Quartets',
    bestMonths: 'May – September',
    directFlightsFromKtm: '1-stop flights via Doha/Dubai/Istanbul to Milan or Florence',
    visaAdvisoryForNepaliGuests: 'Complete Schengen visa invitation letters & embassy dossier support prepared 90 days prior.',
    vedicHavanFeasibility: 'Outdoor ceremonial Mandap supported at historic villas using eco-safe brass Havan Kunds.',
    recommendedArchetype: 'EUROPEAN_CHATEAU_VILLA',
    startingBudgetUsd: 65000,
    highlightExperiences: [
      'Vintage Riva wooden boat arrival at Villa Balbianello jetty',
      'Tuscan cypress-avenue long-table aperitivo & Gelato cart',
      'Mithila-inspired silk stationery paired with Italian marble menus',
    ],
    coverImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'intl-santorini-greece',
    country: 'Greece',
    cityOrRegion: 'Santorini Caldera & Athenian Riviera',
    headline: 'Sun-Drenched Aegean Cliffside Terraces & Mediterranean Sunset Vows',
    bestMonths: 'May – October',
    directFlightsFromKtm: '1-stop via Doha / Athens to Santorini',
    visaAdvisoryForNepaliGuests: 'Schengen tourist visa sponsorship documentation for Nepal & diaspora families.',
    vedicHavanFeasibility: 'Wind-shielded glass terrace Mandap or secular sunset vow exchange with acoustic folk music.',
    recommendedArchetype: 'BEACHFRONT_BUYOUT',
    startingBudgetUsd: 52000,
    highlightExperiences: [
      'Golden-hour Caldera cliff terrace ceremony overlooking Aegean Sea',
      'Private catamaran island cruise welcome reception',
      'White-and-marigold fusion floral arches & Aegean seafood/veg feast',
    ],
    coverImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
  },
];

export const OUTSIDE_NEPAL_CEREMONIAL_OPTIONS = [
  'Welcome Cocktail & Sundowner',
  'Mehndi Garden Afternoon',
  'Haldi Carnival by Pool / Beach',
  'Sangeet Gala & Choreographed Show',
  'Groom Baraat Procession',
  'Sacred Vedic Vivah / Saat Phere',
  'Black-Tie International Reception',
  'Anniversary Vow Renewal',
  'Traditional Pasni / Bratabandha Abroad',
  'Farewell Excursion & Brunch',
];

export const OUTSIDE_NEPAL_WOW_MOMENTS = [
  'Private Yacht / Vintage Boat Arrival',
  'Vintage Convertible or Royal Horse Baraat',
  'Custom Nepali Suite Welcome Hampers (Pashmina, Ilam Tea, Khada)',
  'Drone Light Show / Cold-Spark Pyrotechnics',
  '4K Ultra-Low-Latency Live Broadcast to Relatives in Nepal',
  '360° Glam Booth & Handwritten Polaroid Memory Book',
  'Curated Half-Day Sightseeing Excursion for All Guests',
  'Surprise Flash-Mob / Acoustic Concert Reveal',
];

export const SEED_STAR_HOTEL_REQUESTS: StarHotelSourcingRequest[] = [
  {
    id: 'htl-req-1',
    requestRef: 'UTS-HTL-8421',
    clientName: 'Prakash & Anjali Pradhan',
    clientEmail: 'prakash.pradhan@gmail.com',
    clientPhone: '+977-9851044821',
    starTier: '5_STAR_LUXURY',
    preferredHotelNames: 'Hyatt Regency Kathmandu, Kathmandu Marriott Hotel, or The Soaltee Kathmandu',
    openToAdminRecommendations: true,
    locationScope: 'INSIDE_NEPAL',
    districtOrCity: 'Kathmandu',
    country: 'Nepal',
    eventType: 'WEDDING',
    eventDateBS: '2083 Magh 28',
    eventDateAD: '2027-02-11',
    shift: 'EVENING',
    estimatedGuests: 450,
    roomBlockNeeded: true,
    roomsCount: 35,
    banquetSetting: 'POOLSIDE_LAWN',
    allowExternalCatererOrDecor: true,
    targetBudgetCurrency: 'NPR',
    targetBudgetAmount: 3200000,
    specialHospitalityNotes:
      'Basanta Panchami evening reception & wedding mandap by poolside garden; require 35 rooms for London/Sydney relatives and late quiet lounge extension.',
    status: 'PROPOSAL_AND_RATES_SHARED',
    adminAssignedCoordinator: 'Anurag Thapa (Chief Venue Sourcing Lead)',
    adminWorkNotes:
      'Confirmed ballroom & poolside lawn hold at Hyatt Regency Boudha with 18% corporate room-block discount and waived external floral royalty fee.',
    sourcedHotelProposals: [
      {
        id: 'prop-1',
        hotelName: 'Hyatt Regency Kathmandu (Boudha Lawn & Regency Ballroom)',
        starCategory: '5-Star Luxury Resort',
        districtOrCity: 'Kathmandu',
        quotedPerPlateNprOrUsd: 4650,
        quotedHallRentalNprOrUsd: 185000,
        roomBlockRateNprOrUsd: 21500,
        currency: 'NPR',
        availabilityNote: 'Poolside lawn soft-held for 2083 Magh 28; 35 deluxe rooms reserved until Sunday.',
        adminVerifiedAt: '2026-11-14',
      },
    ],
    createdAt: '2026-11-12T09:15:00Z',
    updatedAt: '2026-11-14T11:30:00Z',
  },
  {
    id: 'htl-req-2',
    requestRef: 'UTS-HTL-8490',
    clientName: 'Dr. Ramesh & Meera Adhikari',
    clientEmail: 'meera.adhikari@outlook.com',
    clientPhone: '+977-9841229018',
    starTier: '5_STAR_HERITAGE_RESORT',
    preferredHotelNames: "The Dwarika's Hotel or Tiger Mountain Pokhara Lodge",
    openToAdminRecommendations: true,
    locationScope: 'INSIDE_NEPAL',
    districtOrCity: 'Kaski (Pokhara)',
    country: 'Nepal',
    eventType: 'RECEPTION',
    eventDateBS: '2083 Falgun 15',
    eventDateAD: '2027-02-27',
    shift: 'FULL_DAY',
    estimatedGuests: 160,
    roomBlockNeeded: true,
    roomsCount: 25,
    banquetSetting: 'FULL_HOTEL_BUYOUT',
    allowExternalCatererOrDecor: false,
    targetBudgetCurrency: 'NPR',
    targetBudgetAmount: 2400000,
    specialHospitalityNotes:
      'Seeking intimate heritage luxury buyout with pure vegetarian & Sattvik Nepali banquet option and acoustic Panchai Baja.',
    status: 'ADMIN_SCOUTING_HOTELS',
    adminAssignedCoordinator: 'Anurag Thapa (Chief Venue Sourcing Lead)',
    adminWorkNotes: 'Outreach sent to Pokhara Grande & Sarangkot 5-Star resorts for full villa block.',
    sourcedHotelProposals: [],
    createdAt: '2026-11-14T08:40:00Z',
    updatedAt: '2026-11-14T08:40:00Z',
  },
];

export const SEED_OUTSIDE_NEPAL_REQUESTS: OutsideNepalDestinationRequest[] = [
  {
    id: 'intl-req-1',
    requestRef: 'UTS-INTL-5092',
    clientName: 'Aayush Adhikari & Elena Vance',
    clientEmail: 'aayush.elena@gmail.com',
    clientPhone: '+44 7700 900412',
    originCities: 'Kathmandu (60 guests), London (55 guests), Boston (35 guests)',
    guestPassportNationalities: 'Nepali, British, US Passports',
    needGroupVisaConcierge: true,
    targetCountry: 'Thailand',
    targetCityOrRegion: 'Phuket (Kamala Bay Oceanfront)',
    celebrationType: 'DESTINATION_WEDDING',
    celebrationDaysCount: 3,
    preferredDateWindowAD: '2027-02-26 to 2027-02-28',
    auspiciousMuhuratReferenceBS: '2083 Falgun 15',
    estimatedGuests: 150,
    eldersAndKidsAccessibilityNotes: '4 grandparents require ground-floor elevator access & shady buggy transfers.',
    accommodationArchetype: 'BEACHFRONT_BUYOUT',
    roomBlockCount: 65,
    ceremonialRitualsIncluded: [
      'Welcome Cocktail & Sundowner',
      'Haldi Carnival by Pool / Beach',
      'Sangeet Gala & Choreographed Show',
      'Sacred Vedic Vivah / Saat Phere',
      'Black-Tie International Reception',
    ],
    culturalBridgeNeeds: {
      flyPancheBajaOrFolkTroupe: true,
      shipPujaSamagriAndAttire: true,
      bilingualVedicOrBuddhistPriest: true,
      liveBroadcastBackToNepal: true,
    },
    culinaryDesign: {
      dietaryProfiles: ['Traditional Nepali & Thakali', 'Pure Vegetarian', 'Gluten-Free Western'],
      flyNepaliMaharajChef: true,
      signatureCounters: 'Live Momo Steam Cart, Juju Dhau Terracotta Bowls & Thai Seafood Grill',
      beverageStyle: 'Signature Himalayan Botanical Cocktails + Zero-Proof Masala Chai Bar',
    },
    memorableSignatureExperiences: [
      'Private Yacht / Vintage Boat Arrival',
      'Custom Nepali Suite Welcome Hampers (Pashmina, Ilam Tea, Khada)',
      '4K Ultra-Low-Latency Live Broadcast to Relatives in Nepal',
      '360° Glam Booth & Handwritten Polaroid Memory Book',
    ],
    loveStoryOrMilestoneTheme: 'Met hiking Annapurna Base Camp, bridging Nepal mountain warmth with coastal sunset elegance.',
    aestheticColorPalette: 'Crimson Marigold, Ivory Silk & Andaman Sunset Gold',
    currency: 'USD',
    budgetAmount: 55000,
    specialDreamsAndNotes: 'Surprise cold-spark fireworks during Saat Phere finale and live stream to grandmother in Patan.',
    status: 'PARTNER_HOTEL_SCOUTING',
    adminCoordinatorNotes: 'Shortlisting Hyatt Regency Phuket & InterContinental Kamala Beach full ocean lawn buyouts.',
    arrangedDeliverables: [
      'Preliminary Thailand 60-guest Nepali e-Visa checklist prepared',
      'Smokeless Vedic Havan Mandap clearance confirmed with Kamala resort engineering',
    ],
    createdAt: '2026-11-13T14:20:00Z',
    updatedAt: '2026-11-14T10:00:00Z',
  },
];
