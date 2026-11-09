/**
 * Hindu Panchanga Samiti Calendar & Auspicious Occasion Master
 * Nepal Panchanga Nirnayak Samiti - Muhurats (शुभ लग्न / साइत), Tithi, Nakshatra & Festivals
 */

import { EventType, PanchangaMuhurat } from '../types';

export interface NepaliMonth {
  id: number;
  name: string;
  nepaliName: string;
  season: string;
  seasonNepali: string;
}

export const NEPALI_MONTHS: NepaliMonth[] = [
  { id: 1, name: 'Baishakh', nepaliName: 'वैशाख', season: 'Basanta (Spring)', seasonNepali: 'वसन्त' },
  { id: 2, name: 'Jestha', nepaliName: 'जेठ', season: 'Grishma (Summer)', seasonNepali: 'ग्रीष्म' },
  { id: 3, name: 'Ashadh', nepaliName: 'असार', season: 'Grishma (Summer)', seasonNepali: 'ग्रीष्म' },
  { id: 4, name: 'Shrawan', nepaliName: 'श्रावण', season: 'Barsha (Monsoon)', seasonNepali: 'वर्षा' },
  { id: 5, name: 'Bhadra', nepaliName: 'भाद्र', season: 'Barsha (Monsoon)', seasonNepali: 'वर्षा' },
  { id: 6, name: 'Ashwin', nepaliName: 'असोज', season: 'Sharad (Autumn)', seasonNepali: 'शरद्' },
  { id: 7, name: 'Kartik', nepaliName: 'कार्तिक', season: 'Sharad (Autumn)', seasonNepali: 'शरद्' },
  { id: 8, name: 'Mangsir', nepaliName: 'मंसिर', season: 'Hemanta (Late Autumn)', seasonNepali: 'हेमन्त' },
  { id: 9, name: 'Poush', nepaliName: 'पुष', season: 'Hemanta (Pre-Winter)', seasonNepali: 'हेमन्त' },
  { id: 10, name: 'Magh', nepaliName: 'माघ', season: 'Shishir (Winter)', seasonNepali: 'शिशिर' },
  { id: 11, name: 'Falgun', nepaliName: 'फागुन', season: 'Shishir (Late Winter)', seasonNepali: 'शिशिर' },
  { id: 12, name: 'Chaitra', nepaliName: 'चैत', season: 'Basanta (Spring)', seasonNepali: 'वसन्त' },
];

export interface CulturalFestival {
  id: string;
  name: string;
  nepaliName: string;
  community: 'HINDU' | 'BUDDHIST' | 'KIRAT' | 'ISLAMIC' | 'NATIONAL' | 'NEWAR';
  dateBS: string;
  dateAD: string;
  description: string;
  isPeakPartyPalaceSeason: boolean;
}

export const CULTURAL_FESTIVALS: CulturalFestival[] = [
  {
    id: 'dashain',
    name: 'Bada Dashain (Bijaya Dashami)',
    nepaliName: 'बडा दशैँ (विजया दशमी)',
    community: 'NATIONAL',
    dateBS: '2081 Ashwin 26 - Kartik 01',
    dateAD: '2024-10-12 - 2024-10-17',
    description: "Nepal's greatest national festival celebrating the victory of good over evil. Family gatherings and feasts.",
    isPeakPartyPalaceSeason: true,
  },
  {
    id: 'tihar',
    name: 'Tihar (Deepawali & Bhai Tika)',
    nepaliName: 'तिहार (यमपञ्चक र भाइटीका)',
    community: 'NATIONAL',
    dateBS: '2081 Kartik 15 - Kartik 18',
    dateAD: '2024-10-31 - 2024-11-03',
    description: 'Festival of lights, Laxmi Puja, Govardhan Puja, and sibling bond celebration with sweets and family banquets.',
    isPeakPartyPalaceSeason: true,
  },
  {
    id: 'chhath',
    name: 'Chhath Parva',
    nepaliName: 'छठ पर्व',
    community: 'HINDU',
    dateBS: '2081 Kartik 22',
    dateAD: '2024-11-07',
    description: 'Solar deity worship widely celebrated in Terai and Kathmandu valleys with riverbank and community hall rituals.',
    isPeakPartyPalaceSeason: true,
  },
  {
    id: 'mangsir-wedding-peak',
    name: 'Mangsir Peak Wedding Season',
    nepaliName: 'मंसिर विवाह लगन मौसम',
    community: 'HINDU',
    dateBS: '2081 Mangsir 01 - 30',
    dateAD: '2024-11-16 - 2024-12-15',
    description: 'The premier Hindu Panchanga wedding month in Nepal with highest celebration demand for party palaces.',
    isPeakPartyPalaceSeason: true,
  },
  {
    id: 'maghe-sankranti',
    name: 'Maghe Sankranti / Makar Sankranti',
    nepaliName: 'माघे सङ्क्रान्ति / माघी',
    community: 'NATIONAL',
    dateBS: '2081 Magh 01',
    dateAD: '2025-01-14',
    description: 'Winter solstice celebration, Tharu New Year (Maghi), and feast of Til ko Laddu, Chaku, and Ghee.',
    isPeakPartyPalaceSeason: false,
  },
  {
    id: 'losar-tamu',
    name: 'Tamu / Sonam / Gyalpo Losar',
    nepaliName: 'तमु / सोनाम / ग्याल्पो ल्होसार',
    community: 'BUDDHIST',
    dateBS: '2081 Poush 15 - Falgun 16',
    dateAD: '2024-12-30 - 2025-02-28',
    description: 'Gurung, Tamang, and Sherpa cultural New Year celebrations with grand community feasts and cultural performances.',
    isPeakPartyPalaceSeason: true,
  },
  {
    id: 'falgun-wedding-peak',
    name: 'Falgun Spring Wedding Season',
    nepaliName: 'फागुन वसन्त लग्न मौसम',
    community: 'HINDU',
    dateBS: '2081 Falgun 01 - 30',
    dateAD: '2025-02-13 - 2025-03-14',
    description: 'Auspicious pre-spring wedding dates per Panchanga with pleasant celebratory weather across all 7 provinces.',
    isPeakPartyPalaceSeason: true,
  },
  {
    id: 'holi',
    name: 'Fagu Purnima (Holi)',
    nepaliName: 'फागु पूर्णिमा (होली)',
    community: 'NATIONAL',
    dateBS: '2081 Falgun 29 - 30',
    dateAD: '2025-03-13 - 2025-03-14',
    description: 'Vibrant festival of colors and spring joy, highly popular for outdoor lawn, poolside, and garden parties.',
    isPeakPartyPalaceSeason: true,
  },
  {
    id: 'udhauli',
    name: 'Udhauli / Ubhauli Parva',
    nepaliName: 'उधौली / उभौली पर्व (किरात)',
    community: 'KIRAT',
    dateBS: '2081 Mangsir 30 / Baishakh Purnima',
    dateAD: '2024-12-15 / 2025-05-12',
    description: 'Kirat Rai, Limbu, Yakkha, and Sunuwar harvest and nature Thanksgiving with Sakela dance and community banquets.',
    isPeakPartyPalaceSeason: true,
  },
];

export const PANCHANGA_AUSPICIOUS_MUHURATS: PanchangaMuhurat[] = [
  // Wedding Muhurats (विवाह लगन)
  {
    id: 'muhurat-w-1',
    dateBS: '2081 Mangsir 14',
    dateAD: '2024-11-29',
    tithi: 'Trayodashi (त्रयोदशी)',
    nakshatra: 'Rohini (रोहिणी)',
    eventType: 'WEDDING',
    auspiciousTime: '09:30 AM - 02:15 PM',
    significance: 'Sarva Siddhi Subha Bibaha Muhurat sanctioned by Nepal Panchanga Nirnayak Samiti.',
  },
  {
    id: 'muhurat-w-2',
    dateBS: '2081 Mangsir 18',
    dateAD: '2024-12-03',
    tithi: 'Dwitiya (द्वितीया)',
    nakshatra: 'Mool (मूल)',
    eventType: 'WEDDING',
    auspiciousTime: '11:00 AM - 04:30 PM',
    significance: 'Highly auspicious Lagna for bride & groom under Guru Aditya Yoga.',
  },
  {
    id: 'muhurat-w-3',
    dateBS: '2081 Mangsir 24',
    dateAD: '2024-12-09',
    tithi: 'Ashtami (अष्टमी)',
    nakshatra: 'Uttarabhadrapada (उत्तरभाद्रपदा)',
    eventType: 'WEDDING',
    auspiciousTime: '10:15 AM - 03:00 PM',
    significance: 'Prime weekend celebration Muhurat recommended for banquet reservations.',
  },
  {
    id: 'muhurat-w-4',
    dateBS: '2081 Magh 22',
    dateAD: '2025-02-04',
    tithi: 'Panchami (वसन्त पञ्चमी / श्रीपञ्चमी)',
    nakshatra: 'Revati (रेवती)',
    eventType: 'WEDDING',
    auspiciousTime: 'Abhijit Muhurat (11:45 AM - 12:35 PM)',
    significance: 'Saraswati Puja / Basanta Panchami — universally auspicious day requiring no astrological horoscope matching.',
  },
  {
    id: 'muhurat-w-5',
    dateBS: '2081 Falgun 08',
    dateAD: '2025-02-20',
    tithi: 'Saptami (सप्तमी)',
    nakshatra: 'Anuradha (अनुराधा)',
    eventType: 'WEDDING',
    auspiciousTime: '01:00 PM - 06:00 PM',
    significance: 'Spring marriage Muhurat with auspicious planetary alignments.',
  },
  {
    id: 'muhurat-w-6',
    dateBS: '2081 Baishakh 19',
    dateAD: '2025-05-02',
    tithi: 'Tritiya (अक्षय तृतीया - Akshaya Tritiya)',
    nakshatra: 'Rohini (रोहिणी)',
    eventType: 'WEDDING',
    auspiciousTime: 'Full Day Auspicious (अक्षय शुभ मुहूर्त)',
    significance: 'Akshaya Tritiya — immortal prosperity Muhurat. Best booked 3-6 months in advance.',
  },

  // Bratabandha Muhurats (व्रतबन्ध / उपनयन)
  {
    id: 'muhurat-b-1',
    dateBS: '2081 Falgun 14',
    dateAD: '2025-02-26',
    tithi: 'Trayodashi (त्रयोदशी)',
    nakshatra: 'Pushya (पुष्य नक्षत्र)',
    eventType: 'BRATABANDHA',
    auspiciousTime: '08:00 AM - 12:30 PM',
    significance: 'Pushya Nakshatra — supreme sacred thread initiation & Vedic Gayatri mantra initiation.',
  },
  {
    id: 'muhurat-b-2',
    dateBS: '2081 Chaitra 06',
    dateAD: '2025-03-20',
    tithi: 'Panchami (पञ्चमी)',
    nakshatra: 'Hast (हस्त नक्षत्र)',
    eventType: 'BRATABANDHA',
    auspiciousTime: '09:00 AM - 01:15 PM',
    significance: 'Spring Upanayana ceremony with auspicious morning Homa and dining banquet.',
  },

  // Pasni Muhurats (पास्नी / अन्नप्राशन)
  {
    id: 'muhurat-p-1',
    dateBS: '2081 Mangsir 28',
    dateAD: '2024-12-13',
    tithi: 'Trayodashi (शुक्ल त्रयोदशी)',
    nakshatra: 'Mrigashira (मृगशिरा)',
    eventType: 'PASNI',
    auspiciousTime: '10:30 AM - 01:00 PM',
    significance: 'Auspicious first solid rice feeding (Chhewar/Pasni) for healthy longevity.',
  },
  {
    id: 'muhurat-p-2',
    dateBS: '2081 Magh 16',
    dateAD: '2025-01-29',
    tithi: 'Amavasya Purnima border (शुक्ल द्वितीया)',
    nakshatra: 'Dhanishta (धनिष्ठा)',
    eventType: 'PASNI',
    auspiciousTime: '11:15 AM - 02:00 PM',
    significance: 'Rice weaning banquet with maternal uncle (Mama) ritual and silver thali feast.',
  },

  // Griha Pravesh (गृह प्रवेश)
  {
    id: 'muhurat-g-1',
    dateBS: '2081 Kartik 28',
    dateAD: '2024-11-13',
    tithi: 'Dwadashi (द्वादशी)',
    nakshatra: 'Uttaraphalguni (उत्तराफाल्गुनी)',
    eventType: 'GRIHA_PRAVESH',
    auspiciousTime: '07:30 AM - 11:00 AM',
    significance: 'Vastu Shanti & auspicious housewarming entrance.',
  },
];

/**
 * Filter auspicious dates by event type
 */
export function getMuhuratsForEventType(eventType: EventType): PanchangaMuhurat[] {
  return PANCHANGA_AUSPICIOUS_MUHURATS.filter((m) => m.eventType === eventType);
}

/**
 * Simple BS <-> AD helper for display and synchronization
 */
export function formatBilingualDate(dateBS: string, dateAD: string): string {
  return `${dateBS} BS (${dateAD} AD)`;
}
