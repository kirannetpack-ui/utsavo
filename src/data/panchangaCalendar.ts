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
    dateBS: '2083 Ashwin 25 - Kartik 05',
    dateAD: '2026-10-11 - 2026-10-21',
    description: "Nepal's greatest national festival celebrating the victory of good over evil. Family gatherings and feasts.",
    isPeakPartyPalaceSeason: true,
  },
  {
    id: 'tihar',
    name: 'Tihar (Deepawali & Bhai Tika)',
    nepaliName: 'तिहार (यमपञ्चक र भाइटीका)',
    community: 'NATIONAL',
    dateBS: '2083 Kartik 22 - Kartik 26',
    dateAD: '2026-11-07 - 2026-11-11',
    description: 'Festival of lights, Laxmi Puja, Govardhan Puja, and sibling bond celebration with sweets and family banquets.',
    isPeakPartyPalaceSeason: true,
  },
  {
    id: 'chhath',
    name: 'Chhath Parva',
    nepaliName: 'छठ पर्व',
    community: 'HINDU',
    dateBS: '2083 Kartik 30',
    dateAD: '2026-11-15',
    description: 'Solar deity worship widely celebrated in Terai and Kathmandu valleys with riverbank and community hall rituals.',
    isPeakPartyPalaceSeason: true,
  },
  {
    id: 'mangsir-wedding-peak',
    name: 'Mangsir Peak Wedding Season',
    nepaliName: 'मंसिर विवाह लगन मौसम',
    community: 'HINDU',
    dateBS: '2083 Mangsir 01 - 29',
    dateAD: '2026-11-17 - 2026-12-15',
    description: 'The premier Hindu Panchanga wedding month in Nepal with highest celebration demand for party palaces.',
    isPeakPartyPalaceSeason: true,
  },
  {
    id: 'maghe-sankranti',
    name: 'Maghe Sankranti / Makar Sankranti',
    nepaliName: 'माघे सङ्क्रान्ति / माघी',
    community: 'NATIONAL',
    dateBS: '2083 Magh 01',
    dateAD: '2027-01-15',
    description: 'Winter solstice celebration, Tharu New Year (Maghi), and feast of Til ko Laddu, Chaku, and Ghee.',
    isPeakPartyPalaceSeason: false,
  },
  {
    id: 'losar-tamu',
    name: 'Tamu / Sonam / Gyalpo Losar',
    nepaliName: 'तमु / सोनाम / ग्याल्पो ल्होसार',
    community: 'BUDDHIST',
    dateBS: '2083 Poush 15 - Falgun 25',
    dateAD: '2026-12-30 - 2027-03-09',
    description: 'Gurung, Tamang, and Sherpa cultural New Year celebrations with grand community feasts and cultural performances.',
    isPeakPartyPalaceSeason: true,
  },
  {
    id: 'falgun-wedding-peak',
    name: 'Falgun Spring Wedding Season',
    nepaliName: 'फागुन वसन्त लग्न मौसम',
    community: 'HINDU',
    dateBS: '2083 Falgun 01 - 30',
    dateAD: '2027-02-13 - 2027-03-14',
    description: 'Auspicious pre-spring wedding dates per Panchanga with pleasant celebratory weather across all 7 provinces.',
    isPeakPartyPalaceSeason: true,
  },
  {
    id: 'holi',
    name: 'Fagu Purnima (Holi)',
    nepaliName: 'फागु पूर्णिमा (होली)',
    community: 'NATIONAL',
    dateBS: '2083 Chaitra 07 - 08',
    dateAD: '2027-03-21 - 2027-03-22',
    description: 'Vibrant festival of colors and spring joy, highly popular for outdoor lawn, poolside, and garden parties.',
    isPeakPartyPalaceSeason: true,
  },
  {
    id: 'udhauli',
    name: 'Udhauli / Ubhauli Parva',
    nepaliName: 'उधौली / उभौली पर्व (किरात)',
    community: 'KIRAT',
    dateBS: '2083 Mangsir 29 / 2084 Baishakh Purnima',
    dateAD: '2026-12-15 / 2027-05-20',
    description: 'Kirat Rai, Limbu, Yakkha, and Sunuwar harvest and nature Thanksgiving with Sakela dance and community banquets.',
    isPeakPartyPalaceSeason: true,
  },
  {
    id: 'akshaya-tritiya',
    name: 'Akshaya Tritiya (Abujha Muhurat)',
    nepaliName: 'अक्षय तृतीया',
    community: 'HINDU',
    dateBS: '2084 Baishakh 26',
    dateAD: '2027-05-09',
    description: 'Immortal prosperity Muhurat universally auspicious for weddings, Griha Pravesh, and milestone family feasts.',
    isPeakPartyPalaceSeason: true,
  },
];

export const PANCHANGA_AUSPICIOUS_MUHURATS: PanchangaMuhurat[] = [
  // Wedding Muhurats (विवाह लगन) — 2083 BS (2026–2027) & 2084 BS (2027–2028)
  {
    id: 'muhurat-w-1',
    dateBS: '2083 Mangsir 09',
    dateAD: '2026-11-25',
    tithi: 'Purnima / Pratipada (मार्गशीर्ष शुक्ल)',
    nakshatra: 'Rohini (रोहिणी)',
    eventType: 'WEDDING',
    auspiciousTime: '09:30 AM - 02:15 PM',
    significance: 'Opening Mangsir Sarva Siddhi Subha Bibaha Muhurat sanctioned by Nepal Panchanga Nirnayak Vikas Samiti.',
  },
  {
    id: 'muhurat-w-2',
    dateBS: '2083 Mangsir 19',
    dateAD: '2026-12-05',
    tithi: 'Ekadashi (एकादशी)',
    nakshatra: 'Hasta (हस्त)',
    eventType: 'WEDDING',
    auspiciousTime: '11:00 AM - 04:30 PM',
    significance: 'Prime Saturday Vivaha Lagna for bride & groom under Guru Aditya Yoga.',
  },
  {
    id: 'muhurat-w-3',
    dateBS: '2083 Mangsir 26',
    dateAD: '2026-12-12',
    tithi: 'Tritiya (तृतीया)',
    nakshatra: 'Uttarashadha (उत्तराषाढा)',
    eventType: 'WEDDING',
    auspiciousTime: '10:15 AM - 03:00 PM',
    significance: 'Closing Mangsir weekend Subha Bibaha Muhurat recommended for grand banquet reservations.',
  },
  {
    id: 'muhurat-w-4',
    dateBS: '2083 Magh 28',
    dateAD: '2027-02-11',
    tithi: 'Shukla Panchami (वसन्त पञ्चमी / श्रीपञ्चमी)',
    nakshatra: 'Revati (रेवती)',
    eventType: 'WEDDING',
    auspiciousTime: 'Abhijit Muhurat (11:45 AM - 12:35 PM)',
    significance: 'Saraswati Puja / Basanta Panchami — universally auspicious day requiring no astrological horoscope matching.',
  },
  {
    id: 'muhurat-w-5',
    dateBS: '2083 Falgun 15',
    dateAD: '2027-02-27',
    tithi: 'Shashthi (षष्ठी)',
    nakshatra: 'Swati (स्वाती)',
    eventType: 'WEDDING',
    auspiciousTime: '01:00 PM - 06:00 PM',
    significance: 'Prime Saturday Spring marriage Muhurat with auspicious planetary alignments.',
  },
  {
    id: 'muhurat-w-6',
    dateBS: '2084 Baishakh 26',
    dateAD: '2027-05-09',
    tithi: 'Shukla Tritiya (अक्षय तृतीया - Akshaya Tritiya)',
    nakshatra: 'Rohini (रोहिणी)',
    eventType: 'WEDDING',
    auspiciousTime: 'Full Day Auspicious (अक्षय शुभ मुहूर्त)',
    significance: 'Akshaya Tritiya 2084 — immortal prosperity Muhurat. Best booked 3-6 months in advance.',
  },
  {
    id: 'muhurat-w-7',
    dateBS: '2084 Mangsir 11',
    dateAD: '2027-11-27',
    tithi: 'Trayodashi (त्रयोदशी)',
    nakshatra: 'Ashwini (अश्विनी)',
    eventType: 'WEDDING',
    auspiciousTime: '10:30 AM - 04:00 PM',
    significance: 'Next-year 2084 Mangsir Saturday peak Hemanta Vivaha planning window for early venue holds.',
  },
  {
    id: 'muhurat-w-8',
    dateBS: '2084 Magh 18',
    dateAD: '2028-01-31',
    tithi: 'Shukla Panchami (वसन्त पञ्चमी २०८४)',
    nakshatra: 'Uttarabhadrapada (उत्तरभाद्रपदा)',
    eventType: 'WEDDING',
    auspiciousTime: 'Full Day Auspicious (अबुझ मुहूर्त)',
    significance: 'Basanta Panchami 2028 future season Abujha Muhurat ideal for long-range destination & palace bookings.',
  },

  // Bratabandha Muhurats (व्रतबन्ध / उपनयन)
  {
    id: 'muhurat-b-1',
    dateBS: '2083 Falgun 18',
    dateAD: '2027-03-02',
    tithi: 'Navami (नवमी)',
    nakshatra: 'Anuradha (अनुराधा)',
    eventType: 'BRATABANDHA',
    auspiciousTime: '08:00 AM - 12:30 PM',
    significance: 'Auspicious Uttarayana Lagna for sacred thread initiation & Vedic Gayatri mantra initiation.',
  },
  {
    id: 'muhurat-b-2',
    dateBS: '2083 Chaitra 12',
    dateAD: '2027-03-26',
    tithi: 'Chaturthi (चतुर्थी)',
    nakshatra: 'Pushya (पुष्य नक्षत्र)',
    eventType: 'BRATABANDHA',
    auspiciousTime: '09:00 AM - 01:15 PM',
    significance: 'Spring Pushya Yoga Upanayana ceremony with auspicious morning Homa and dining banquet.',
  },
  {
    id: 'muhurat-b-3',
    dateBS: '2084 Baishakh 17',
    dateAD: '2027-04-30',
    tithi: 'Dashami (दशमी)',
    nakshatra: 'Hasta (हस्त नक्षत्र)',
    eventType: 'BRATABANDHA',
    auspiciousTime: '08:30 AM - 01:00 PM',
    significance: 'Baishakh Shukla morning Bratabandha alignment ideal for courtyard Mandap ceremonies.',
  },

  // Pasni Muhurats (पास्नी / अन्नप्राशन)
  {
    id: 'muhurat-p-1',
    dateBS: '2083 Mangsir 24',
    dateAD: '2026-12-10',
    tithi: 'Pratipada (शुक्ल प्रतिपदा)',
    nakshatra: 'Mrigashira (मृगशिरा)',
    eventType: 'PASNI',
    auspiciousTime: '10:30 AM - 01:00 PM',
    significance: 'Auspicious first solid rice feeding (Chhewar/Pasni) for healthy longevity.',
  },
  {
    id: 'muhurat-p-2',
    dateBS: '2083 Magh 18',
    dateAD: '2027-02-01',
    tithi: 'Ekadashi (एकादशी)',
    nakshatra: 'Dhanishta (धनिष्ठा)',
    eventType: 'PASNI',
    auspiciousTime: '11:15 AM - 02:00 PM',
    significance: 'Rice weaning banquet with maternal uncle (Mama) ritual and silver thali feast.',
  },

  // Griha Pravesh (गृह प्रवेश)
  {
    id: 'muhurat-g-1',
    dateBS: '2083 Mangsir 17',
    dateAD: '2026-12-03',
    tithi: 'Navami (नवमी)',
    nakshatra: 'Uttaraphalguni (उत्तराफाल्गुनी)',
    eventType: 'GRIHA_PRAVESH',
    auspiciousTime: '07:30 AM - 11:00 AM',
    significance: 'Vastu Shanti & auspicious housewarming entrance.',
  },
  {
    id: 'muhurat-g-2',
    dateBS: '2083 Falgun 20',
    dateAD: '2027-03-04',
    tithi: 'Ekadashi (शुक्ल एकादशी)',
    nakshatra: 'Mool (मूल)',
    eventType: 'GRIHA_PRAVESH',
    auspiciousTime: '08:45 AM - 12:15 PM',
    significance: 'Amrita Siddhi Yoga housewarming entrance with morning Rudrabhishek and family prasad feast.',
  },

  // Reception Gala (प्रीतिभोज / Reception)
  {
    id: 'muhurat-r-1',
    dateBS: '2083 Mangsir 25',
    dateAD: '2026-12-11',
    tithi: 'Dwitiya (द्वितीया)',
    nakshatra: 'Purvashadha (पूर्वाषाढा)',
    eventType: 'RECEPTION',
    auspiciousTime: '04:00 PM - 09:30 PM',
    significance: 'Friday evening Shubha Pritibhoj alignment with smooth evening hospitality flow under 10 PM DAO window.',
  },
  {
    id: 'muhurat-r-2',
    dateBS: '2083 Magh 29',
    dateAD: '2027-02-12',
    tithi: 'Shashthi (षष्ठी)',
    nakshatra: 'Ashwini (अश्विनी)',
    eventType: 'RECEPTION',
    auspiciousTime: '05:00 PM - 10:00 PM',
    significance: 'Friday weekend evening auspicious Lagna tailored for grand ballroom receptions and VIP family dining.',
  },
  {
    id: 'muhurat-r-3',
    dateBS: '2083 Falgun 16',
    dateAD: '2027-02-28',
    tithi: 'Saptami (सप्तमी)',
    nakshatra: 'Vishakha (विशाखा)',
    eventType: 'RECEPTION',
    auspiciousTime: '01:00 PM - 09:30 PM',
    significance: 'Sunday daytime-to-evening garden lawn and banquet reception window with pleasant Basanta temperatures.',
  },

  // Engagement / Tika / Swayambar (टीका / मगनी)
  {
    id: 'muhurat-e-1',
    dateBS: '2083 Mangsir 10',
    dateAD: '2026-11-26',
    tithi: 'Dwitiya (द्वितीया)',
    nakshatra: 'Mrigashira (मृगशिरा)',
    eventType: 'ENGAGEMENT',
    auspiciousTime: '10:00 AM - 02:30 PM',
    significance: 'Shubha Tika & Ring Exchange Muhurat blessed by family harmony and auspicious Guru Lagna.',
  },
  {
    id: 'muhurat-e-2',
    dateBS: '2083 Magh 15',
    dateAD: '2027-01-29',
    tithi: 'Ashtami (अष्टमी)',
    nakshatra: 'Swati (स्वाती)',
    eventType: 'ENGAGEMENT',
    auspiciousTime: '11:30 AM - 04:00 PM',
    significance: 'Siddha Yoga day engagement Lagna ideal for intimate lunch celebrations and traditional Swayambar.',
  },
  {
    id: 'muhurat-e-3',
    dateBS: '2083 Falgun 04',
    dateAD: '2027-02-16',
    tithi: 'Dashami (दशमी)',
    nakshatra: 'Mool (मूल)',
    eventType: 'ENGAGEMENT',
    auspiciousTime: '02:00 PM - 07:30 PM',
    significance: 'Evening Sangeet & Ring Ceremony alignment with clear Hemanta-spring transition weather.',
  },

  // Corporate Gala & Inaugurations (व्यावसायिक सम्मेलन / शुभारम्भ)
  {
    id: 'muhurat-c-1',
    dateBS: '2083 Poush 08',
    dateAD: '2026-12-23',
    tithi: 'Chaturdashi (चतुर्दशी)',
    nakshatra: 'Rohini (रोहिणी)',
    eventType: 'CORPORATE_GALA',
    auspiciousTime: '09:30 AM - 05:30 PM',
    significance: 'Vyapar Vriddhi Rohini Yoga — auspicious for year-end corporate summits, annual milestone galas & brand launches.',
  },
  {
    id: 'muhurat-c-2',
    dateBS: '2083 Falgun 25',
    dateAD: '2027-03-09',
    tithi: 'Dwitiya (द्वितीया)',
    nakshatra: 'Uttarabhadrapada (उत्तरभाद्रपदा)',
    eventType: 'CORPORATE_GALA',
    auspiciousTime: '10:00 AM - 08:30 PM',
    significance: 'Full-day conference & evening awards gala alignment with strong Abhijit midday keynote window.',
  },

  // Birthday & Jubilee (जन्मोत्सव / शुभ दिवस)
  {
    id: 'muhurat-j-1',
    dateBS: '2083 Mangsir 16',
    dateAD: '2026-12-02',
    tithi: 'Ashtami (अष्टमी)',
    nakshatra: 'Purvaphalguni (पूर्वाफाल्गुनी)',
    eventType: 'BIRTHDAY_JUBILEE',
    auspiciousTime: '04:30 PM - 09:30 PM',
    significance: 'Ayushya Vardhak evening celebration Muhurat suited for 25th/50th Jubilees & milestone birthdays.',
  },
  {
    id: 'muhurat-j-2',
    dateBS: '2084 Baishakh 12',
    dateAD: '2027-04-25',
    tithi: 'Chaturthi (चतुर्थी)',
    nakshatra: 'Jyeshtha (ज्येष्ठा)',
    eventType: 'BIRTHDAY_JUBILEE',
    auspiciousTime: '11:00 AM - 07:00 PM',
    significance: 'Baishakh Sunday celebration alignment ideal for golden anniversaries and outdoor garden family feasts.',
  },

  // Other / General Auspicious Celebration (सर्वार्थ सिद्धि उत्सव)
  {
    id: 'muhurat-o-1',
    dateBS: '2084 Baishakh 26',
    dateAD: '2027-05-09',
    tithi: 'Shukla Tritiya (अक्षय तृतीया - Akshaya Tritiya)',
    nakshatra: 'Rohini (रोहिणी)',
    eventType: 'OTHER_CELEBRATION',
    auspiciousTime: 'Full Day Auspicious (अक्षय शुभ मुहूर्त)',
    significance: 'Akshaya Tritiya 2084 — Swayamsiddha Abujha Muhurat universally auspicious for any family or community celebration.',
  },
  {
    id: 'muhurat-o-2',
    dateBS: '2085 Baishakh 15',
    dateAD: '2028-04-27',
    tithi: 'Shukla Tritiya (अक्षय तृतीया २०८५)',
    nakshatra: 'Rohini (रोहिणी)',
    eventType: 'OTHER_CELEBRATION',
    auspiciousTime: 'Full Day Auspicious (अक्षय शुभ मुहूर्त)',
    significance: 'Akshaya Tritiya 2028 — Future-year Swayamsiddha Abujha Muhurat for long-range celebration reservations.',
  },
];

/**
 * Filter auspicious dates by event type
 */
export function getMuhuratsForEventType(eventType: EventType): PanchangaMuhurat[] {
  const todayIso = new Date().toISOString().split('T')[0];
  const exact = PANCHANGA_AUSPICIOUS_MUHURATS.filter((m) => m.eventType === eventType);
  const upcomingExact = exact.filter((m) => m.dateAD >= todayIso);
  if (upcomingExact.length > 0) return upcomingExact;
  if (exact.length > 0) return exact;
  return PANCHANGA_AUSPICIOUS_MUHURATS.filter((m) => m.eventType === 'OTHER_CELEBRATION');
}

/**
 * Simple BS <-> AD helper for display and synchronization
 */
export function formatBilingualDate(dateBS: string, dateAD: string): string {
  return `${dateBS} BS (${dateAD} AD)`;
}
