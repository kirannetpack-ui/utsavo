/**
 * UTSAVO — Cultural Artists & Specialized Celebration Vendors Data
 * Preserving authentic Nepali ceremonial traditions and providing turnkey talent
 */

import { CulturalVendor } from '../types';

export const initialCulturalVendors: CulturalVendor[] = [
  {
    id: 'vendor-panche-01',
    name: 'Gandharva & Pariyar Royal Naumati Ensemble',
    nepaliName: 'गन्धर्व तथा परियार शाही नौमती बाजा खलः',
    category: 'PANCHE_NAUMATI_BAJA',
    leaderOrContact: 'Ustad Prem Bahadur Pariyar',
    phone: '+977-9846012345',
    email: 'naumati.gandharva@utsavo.np',
    district: 'Kaski',
    province: 'Gandaki',
    address: 'Bagar-1, Pokhara / Travel Service to Kathmandu & Chitwan',
    yearsOfExperience: 26,
    rating: 4.95,
    reviewCount: 88,
    verifiedBadge: true,
    startingPriceNpr: 45000,
    priceUnit: 'PER_EVENT',
    bio: 'Authentic 11-member master folk ensemble featuring authentic Karnal, Sahanaai, Narsingha, Dholaki, Damaha, and Jhyali. Revered across Gandaki and Bagmati for high-energy bridal arrivals (Janti) and traditional Vedic vivaha procession fanfare.',
    specializations: [
      'Authentic Janti Baraat Procession',
      'Twin Sahanaai Classical Melodies',
      'Long Curved Copper Narsingha Fanfare',
      'Bratabandha & Griha Pravesh Rhythms'
    ],
    isOpenForTravelAcrossNepal: true,
    bilingualEnglishSupport: false,
    portfolioImages: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80'
    ],
    packages: [
      {
        id: 'pkg-p01',
        name: 'Classic Janti Vivah (9 Performers)',
        priceNpr: 45000,
        description: 'Complete 9-piece traditional brass & percussion line for Janti arrival and ceremonial reception.',
        deliverables: [
          '4 Hours live continuous performance',
          '2 Master Sahanaai players + 1 Narsingha horn',
          'Traditional Nepali Daura Suruwal uniform & Dhaka Patuka',
          'Ceremonial welcome fanfare for in-laws'
        ]
      },
      {
        id: 'pkg-p02',
        name: 'Royal Durbar Gala Ensemble (14 Master Artists)',
        priceNpr: 75000,
        description: 'Grand royal wedding configuration with twin Narsingha horns, double Dholak, and custom entrance compositions.',
        deliverables: [
          'Full-day procession & reception coverage (up to 8 hours)',
          '4 Master Sahanaai maestros + 2 Narsingha + Karnal',
          'Custom choreographed bridal entry melody',
          'Inter-district travel arrangement ready'
        ]
      }
    ]
  },
  {
    id: 'vendor-dhime-02',
    name: 'Patan Jyapu Heritage Dhime & Bansuri Khala',
    nepaliName: 'पाटन ज्यापु सांस्कृतिक धिमे तथा बाँसुरी खलः',
    category: 'NEWARI_DHIME_BAJA',
    leaderOrContact: 'Nhuche Ratna Maharjan',
    phone: '+977-9851088741',
    email: 'dhime.patan@utsavo.np',
    district: 'Lalitpur',
    province: 'Bagmati',
    address: 'Mangalbazar, Patan Heritage Square',
    yearsOfExperience: 31,
    rating: 4.92,
    reviewCount: 64,
    verifiedBadge: true,
    startingPriceNpr: 35000,
    priceUnit: 'PER_EVENT',
    bio: 'Preserving ancestral Kathmandu Valley Newari ceremonial rhythms. Vibrant Dhime drums, Bhusya cymbals, Chhusya, and bamboo flute (Bansuri) melodies. Ideal for Newari Vivah, Ihi (Bel Vivah), Bratabandha (Bare Chhyegu), and reception cultural welcomes.',
    specializations: [
      'Newari Traditional Vivah Rhythms',
      'Ihi / Bel Vivah & Bahra Tayegu Ceremonies',
      'Traditional Lakhey & Pulukisi Cultural Dance Add-ons',
      'Bansuri Classical Raga Melodies'
    ],
    isOpenForTravelAcrossNepal: true,
    bilingualEnglishSupport: true,
    portfolioImages: [
      'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1000&q=80'
    ],
    packages: [
      {
        id: 'pkg-d01',
        name: 'Authentic Dhime & Bhusya Squad (8 Artists)',
        priceNpr: 35000,
        description: 'Traditional 8-member troupe dressed in pristine Newari Haku Patasi and Daura Suruwal.',
        deliverables: [
          '3 Dhime drums + 2 Bhusya cymbals + 2 Bansuri flutes + 1 Tinchhu',
          '3-Hour energetic performance during entrance and dining',
          'Traditional Swagatam auspicious Newari chant'
        ]
      },
      {
        id: 'pkg-d02',
        name: 'UNESCO Heritage Cultural Showcase with Lakhey Dance',
        priceNpr: 60000,
        description: 'Full musical orchestra accompanied by authentic ceremonial Lakhey dancer for memorable guest entertainment.',
        deliverables: [
          '12 Master musicians + 1 Lakhey dancer',
          'Dramatic fire-torch ceremonial entrance',
          'Photo-session interaction with international guests'
        ]
      }
    ]
  },
  {
    id: 'vendor-purohit-03',
    name: 'Acharya Pt. Damodar Adhikari (Vedic & Bilingual Acharya)',
    nepaliName: 'आचार्य पण्डित दामोदर अधिकारी (वैदिक कर्मकाण्ड)',
    category: 'VEDIC_PUROHIT_ACHARYA',
    leaderOrContact: 'Acharya Damodar Adhikari (M.A. Sanskrit, Banaras)',
    phone: '+977-9841298765',
    email: 'acharya.damodar@utsavo.np',
    district: 'Kathmandu',
    province: 'Bagmati',
    address: 'Gausala, Kathmandu (Near Pashupatinath Temple)',
    yearsOfExperience: 19,
    rating: 4.98,
    reviewCount: 112,
    verifiedBadge: true,
    startingPriceNpr: 25000,
    priceUnit: 'PER_EVENT',
    bio: 'Renowned Vedic scholar and Acharya specializing in authentic Vivaha Sanskar, Bratabandha, Rudrabhishek, and Griha Pravesh. Highly sought after by modern Nepali couples and Non-Resident Nepalis (NRIs) because he fluently explains the philosophical meaning of Saptapadi (7 Pheras), Kanyadaan, and Sindoor Daana in clear English and Nepali.',
    specializations: [
      'Bilingual Vedic Vivaha Explanation (English & Nepali)',
      'Accurate Panchanga Subha Muhurat Calculation',
      'Panchagni Havan & Pure Vedic Mantras',
      'NRI & Mixed-Culture Destination Wedding Officiation'
    ],
    isOpenForTravelAcrossNepal: true,
    bilingualEnglishSupport: true,
    portfolioImages: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80'
    ],
    packages: [
      {
        id: 'pkg-v01',
        name: 'Complete Vedic Vivaha Sanskar (Lead Pandit + Sahayak)',
        priceNpr: 30000,
        description: 'Complete Vedic marriage rituals from Swayamvar to Kanyadaan, Laja Havan, and Saptapadi.',
        deliverables: [
          'Complete Karma Kanda Samagri checklist provided in advance',
          'Bilingual narration of marital vows for guests',
          'Auspicious Lagna Patrika (Handwritten Horoscope alignment record)'
        ]
      },
      {
        id: 'pkg-v02',
        name: 'Destination Himalayan Sacred Nuptials',
        priceNpr: 55000,
        description: 'Comprehensive high-altitude ceremonial officiation for Pokhara, Nagarkot, or Muktinath destination weddings.',
        deliverables: [
          'Multi-day ritual coordination (Mehendi Puja, Mandap Puja, Vivaha)',
          'High-altitude ritual safety adjustments for holy fire smoke',
          'English translation booklet of the 7 sacred vows for foreign guests'
        ]
      }
    ]
  },
  {
    id: 'vendor-photo-04',
    name: 'Himalayan Nuptials & Drone Cinema',
    nepaliName: 'हिमालयन नप्सियल्स तथा ड्रोन सिनेमा',
    category: 'PHOTOGRAPHY_CINEMATOGRAPHY',
    leaderOrContact: 'Suman Shrestha & Team',
    phone: '+977-9801876543',
    email: 'films@himalayannuptials.np',
    district: 'Kathmandu',
    province: 'Bagmati',
    address: 'Jhamsikhel, Lalitpur / Pokhara Branch',
    yearsOfExperience: 11,
    rating: 4.96,
    reviewCount: 140,
    verifiedBadge: true,
    startingPriceNpr: 85000,
    priceUnit: 'PER_EVENT',
    bio: 'Pioneers in high-fashion cinematic wedding films and 4K licensed aerial drone cinematography in Nepal. Award-winning team specializing in Himalayan pre-wedding expeditions (Sarangkot, Poon Hill, Nagarkot, Manang) and grand party palace live broadcasts.',
    specializations: [
      '4K 60FPS Cinematic Storytelling Film',
      'Dual-Operator Licensed Drone Coverage',
      'Himalayan Sunset & Golden Hour Pre-Wedding Shoots',
      'Same-Day Teaser Video for Social Media'
    ],
    isOpenForTravelAcrossNepal: true,
    bilingualEnglishSupport: true,
    portfolioImages: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80'
    ],
    packages: [
      {
        id: 'pkg-ph01',
        name: 'The Royal Vivaha Cinematic (2 Photo + 2 Video + Drone)',
        priceNpr: 120000,
        description: 'Comprehensive 2-day wedding celebration coverage with aerial shots, full candid photography, and master film.',
        deliverables: [
          'Full-day coverage by 4 senior visual artists',
          '4K Aerial drone cinematography of venue & Janti',
          '3-5 Minute cinematic highlight reel + 45-minute documentary cut',
          'Handcrafted Italian leather photobook (100 premium pages)'
        ]
      },
      {
        id: 'pkg-ph02',
        name: 'Himalayan Pre-Wedding Destination Expedition',
        priceNpr: 65000,
        description: '2-day exclusive pre-wedding shoot in Pokhara lakeside or Nagarkot Himalayan sunrise ridges.',
        deliverables: [
          '20 Master edited cinematic portrait prints',
          '1-Minute romantic teaser trailer',
          'Digital cloud gallery with instant guest access'
        ]
      }
    ]
  },
  {
    id: 'vendor-makeup-05',
    name: 'Glow by Shristi — Luxury Bridal & Mehendi Studio',
    nepaliName: 'ग्लो बाई सृष्टि — ब्राइडल मेकअप तथा मेहन्दी स्टुडियो',
    category: 'BRIDAL_MAKEUP_MEHENDI',
    leaderOrContact: 'Shristi Thapa Magar',
    phone: '+977-9849554433',
    email: 'shristi.makeup@utsavo.np',
    district: 'Kathmandu',
    province: 'Bagmati',
    address: 'Lazimpat, Kathmandu / Doorstep Bridal Suite Service',
    yearsOfExperience: 9,
    rating: 4.97,
    reviewCount: 95,
    verifiedBadge: true,
    startingPriceNpr: 28000,
    priceUnit: 'PER_EVENT',
    bio: 'Celebrity bridal artist specializing in HD Airbrush makeup, traditional Nepali red bridal styling with authentic Shringar, Sirbandhi placement, and intricate Rajasthani & Madhubani henna artistry. Provides doorstep hotel and venue dressing room vanity setups.',
    specializations: [
      '16-Hour Sweatproof HD Airbrush Bridal Makeup',
      'Traditional Nepali Red Sari & Pote/Sirbandhi Draping',
      'Organic Chemical-Free Dark Stain Bridal Mehendi',
      'Groom Grooming & Family Touchup Squad'
    ],
    isOpenForTravelAcrossNepal: true,
    bilingualEnglishSupport: true,
    portfolioImages: [
      'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80'
    ],
    packages: [
      {
        id: 'pkg-mk01',
        name: 'The Grand Vivaha Bride (Airbrush + Hair + Saree Draping)',
        priceNpr: 32000,
        description: 'Luxury turnkey bridal makeover using Temptu HD Airbrush, international luxury cosmetic palettes, and hairstyling.',
        deliverables: [
          'Full HD Airbrush makeup with 24K gold lash accents',
          'Royal bridal hair updo with fresh natural orchids/roses',
          'Traditional Sari/Lehenga pleating and jewelry setting',
          'Touchup kit for the evening reception'
        ]
      },
      {
        id: 'pkg-mk02',
        name: 'Bridal Henna Extravaganza (Feet & Arms)',
        priceNpr: 18000,
        description: 'Master organic henna artist creating detailed personalized bridal story motifs (mandap, baraat, couple initials).',
        deliverables: [
          'Elbow-length intricate arms + mid-calf feet henna',
          '100% Organic certified dark maroon staining paste',
          'Complimentary henna for mother of bride & groom'
        ]
      }
    ]
  },
  {
    id: 'vendor-attire-06',
    name: 'Lumbini Dhaka & Heritage Daura Suruwal Atelier',
    nepaliName: 'लुम्बिनी ढाका तथा परम्परागत दौरा सुरुवाल प्रतिष्ठान',
    category: 'TRADITIONAL_ATTIRE_JEWELRY',
    leaderOrContact: 'Rajan Shrestha',
    phone: '+977-9851234987',
    email: 'dhaka.heritage@utsavo.np',
    district: 'Kathmandu',
    province: 'Bagmati',
    address: 'New Road & Ason, Kathmandu / Delivery Across Nepal',
    yearsOfExperience: 35,
    rating: 4.89,
    reviewCount: 78,
    verifiedBadge: true,
    startingPriceNpr: 12000,
    priceUnit: 'PER_EVENT',
    bio: 'Master weavers of authentic Palpali Dhaka, pure Pashmina shawls, royal tailored Daura Suruwal coats with silver coin buttons, Gunyo Cholo sets, and traditional Newari Haku Patasi. Provides bespoke fitting and rental options for wedding parties and international guests.',
    specializations: [
      'Handloom Palpali Dhaka Wedding Sets',
      'Custom Groom Daura Suruwal with Khukuri Brooch',
      'Gunyo Cholo & Haku Patasi Rentals for Bridesmaids',
      'International Guest Traditional Fitting Service'
    ],
    isOpenForTravelAcrossNepal: true,
    bilingualEnglishSupport: true,
    portfolioImages: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80'
    ],
    packages: [
      {
        id: 'pkg-at01',
        name: 'Royal Groom Vivaha Attire Suite',
        priceNpr: 24000,
        description: 'Pristine tailored pure wool Daura Suruwal with royal brocade coat, matching Palpali Dhaka Topi, and ceremonial Patuka.',
        deliverables: [
          'Custom tailored Daura Suruwal set (kept by client)',
          'Bespoke handloom Palpali Dhaka Topi + Golden Khukuri pin',
          'Pure Pashmina shoulder shawl (Khesh)',
          'Doorstep measuring and trial service'
        ]
      },
      {
        id: 'pkg-at02',
        name: 'International & Diaspora Guest Traditional Wardrobe Block (10 Sets)',
        priceNpr: 45000,
        description: 'Complete rental package for foreign and NRI wedding guests to experience authentic Nepali ceremonial clothing.',
        deliverables: [
          '6 Daura Suruwal sets + 4 Gunyo Cholo or Kurtha sets',
          'On-site dressing assistant at venue on wedding morning',
          'Professional laundry and pickup post-event'
        ]
      }
    ]
  }
];
