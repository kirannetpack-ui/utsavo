/**
 * UTSAVO - Bilingual Nepali / English Localization Engine
 */

import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'ne';

interface TranslationDictionary {
  [key: string]: {
    en: string;
    ne: string;
  };
}

export const DICTIONARY: TranslationDictionary = {
  // Brand & Navigation
  brandName: { en: 'UTSAVO', ne: 'उत्सवो' },
  tagline: { en: "Nepal's Smart Celebration Marketplace", ne: "नेपालको पहिलो स्मार्ट उत्सव तथा पार्टी प्यालेस बजार" },
  navExplore: { en: 'Explore Venues', ne: 'स्थल खोज्नुहोस्' },
  navMuhurats: { en: 'Panchanga Dates', ne: 'पञ्चाङ्ग शुभ साइत' },
  navSmartPlanner: { en: 'Smart Planner', ne: 'स्मार्ट योजनाकार' },
  navNegotiations: { en: 'Negotiations', ne: 'मूल्य वार्ता' },
  navBookings: { en: 'My Bookings', ne: 'मेरो बुकिङहरू' },
  navDashboard: { en: 'Portal', ne: 'ड्यासबोर्ड' },

  // Role Switcher
  roleCustomer: { en: 'Customer / Organizer', ne: 'ग्राहक / आयोजक' },
  roleVenueOwner: { en: 'Venue Owner / Manager', ne: 'पार्टी प्यालेस संचालक' },
  roleSuperAdmin: { en: 'Super Administrator', ne: 'केन्द्रीय प्रशासक' },
  roleFinanceAdmin: { en: 'Finance & Settlement', ne: 'वित्त तथा भुक्तानी' },

  // Hero & Search
  heroTitle: { en: 'Discover, Customize & Negotiate Your Perfect Venue in Nepal', ne: 'नेपालभरका उत्कृष्ट पार्टी प्यालेस र उत्सव स्थलहरू खोज्नुहोस् र बुकिङ गर्नुहोस्' },
  heroSubtitle: { en: '7 Provinces · 77 Districts · Hindu Panchanga Auspicious Dates · Transparent Pricing & Digital Agreements', ne: '७ प्रदेश · ७७ जिल्ला · पञ्चाङ्ग निर्णायक समिति अनुसारको शुभ साइत · पारदर्शी मूल्य र कानुनी सम्झौता' },
  searchDestination: { en: 'Where in Nepal?', ne: 'कहाँ आयोजना गर्ने?' },
  searchEventType: { en: 'Event Type', ne: 'उत्सवको प्रकार' },
  searchDate: { en: 'Event Date (BS / AD)', ne: 'कार्यक्रम मिति' },
  searchGuests: { en: 'Guests', ne: 'अतिथि संख्या' },
  btnSearch: { en: 'Find Venues', ne: 'स्थल खोज्नुहोस्' },
  btnSmartPlan: { en: 'Plan with AI Assistant', ne: 'स्मार्ट सहायकसँग योजना' },
  btnPanchangaMuhurat: { en: 'View Auspicious Muhurats', ne: 'शुभ साइत क्यालेन्डर हेर्नुहोस्' },

  // Filters & Sorting
  filterProvince: { en: 'Province', ne: 'प्रदेश' },
  filterDistrict: { en: 'District', ne: 'जिल्ला' },
  filterCapacity: { en: 'Capacity (Min - Max)', ne: 'क्षमता' },
  filterBudget: { en: 'Per-Plate Budget (NPR)', ne: 'प्रति-प्लेट बजेट (रु)' },
  filterAmenities: { en: 'Facilities', ne: 'सुविधा' },
  sortBy: { en: 'Sort by', ne: 'क्रमबद्ध' },
  sortRecommended: { en: 'Recommended (Explainable)', ne: 'सिफारिस गरिएको' },
  sortPriceAsc: { en: 'Lowest Starting Price', ne: 'न्यूनतम मूल्य' },
  sortCapacityDesc: { en: 'Highest Capacity', ne: 'अधिकतम क्षमता' },
  sortRatingDesc: { en: 'Highest Customer Rating', ne: 'उत्कृष्ट ग्राहक मूल्याङ्कन' },
  nearbyToggle: { en: 'Include adjacent districts if venues are limited', ne: 'नजिकका छिमेकी जिल्लाहरू पनि देखाउनुहोस्' },

  // Venue Card
  capacityLabel: { en: 'Capacity', ne: 'क्षमता' },
  cateringFrom: { en: 'Catering from', ne: 'खानपान' },
  rentalFrom: { en: 'Hall rental', ne: 'हल भाडा' },
  perPlate: { en: '/ plate', ne: '/ प्लेट' },
  btnViewDetails: { en: 'Customize & Quote', ne: 'परिकार छनोट र कोटेशन' },
  verifiedBadge: { en: 'Verified Venue (PAN/VAT)', ne: 'प्रमाणित स्थल (प्यान/भ्याट)' },

  // Menu & Catering
  tabOverview: { en: 'Overview & Halls', ne: 'परिचय र हलहरू' },
  tabMenuCustomizer: { en: 'Menu & Catering Engine', ne: 'खानपान र मेनु छनोट' },
  tabAvailability: { en: 'Live Calendar & Shifts', ne: 'उपलब्धता क्यालेन्डर' },
  tabReviews: { en: 'Verified Reviews', ne: 'प्रमाणित समीक्षाहरू' },

  // Negotiation & Agreement
  btnRequestQuote: { en: 'Request Binding Quotation', ne: 'कोटेशन अनुरोध गर्नुहोस्' },
  btnProposeOffer: { en: 'Make a Counter-Offer', ne: 'मूल्य वार्ता / प्रति-प्रस्ताव' },
  btnAcceptOffer: { en: 'Accept Offer & Proceed', ne: 'प्रस्ताव स्वीकार गर्नुहोस्' },
  btnSignAgreement: { en: 'Review & Sign Digital Agreement', ne: 'डिजिटल सम्झौता समीक्षा र हस्ताक्षर' },
  btnPayDeposit: { en: 'Pay 25% Deposit', ne: '२५% अग्रिम भुक्तानी गर्नुहोस्' },

  // Payment Providers
  paymentEsewa: { en: 'eSewa Mobile Wallet', ne: 'ई-सेवा वालेट' },
  paymentKhalti: { en: 'Khalti Digital Wallet', ne: 'खल्ती डिजिटल वालेट' },
  paymentFonepay: { en: 'Fonepay QR (Nepal Pay)', ne: 'फोनपे क्यूआर' },
  paymentBank: { en: 'Direct Bank Wire (Nabil/NIC)', ne: 'बैंक ट्रान्सफर' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    if (DICTIONARY[key]) {
      return DICTIONARY[key][language] || DICTIONARY[key].en;
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
