/**
 * UTSAVO - Advanced Catering & Menu Packages Engine
 * Authentic Nepali banquets, Newari feasts, Terai Mithila dishes, and modern celebrations.
 */

import { CateringPackage, MenuItem } from '../types';

export const MASTER_MENU_ITEMS: MenuItem[] = [
  // Welcome Drinks
  {
    id: 'wd-1',
    name: 'Fresh Mint Lemonade',
    nepaliName: 'पुदिना कागती पानी',
    category: 'WELCOME_DRINK',
    isVegetarian: true,
    isTraditionalNepali: false,
    description: 'Chilled freshly squeezed lemon with crushed mountain mint and rock salt.',
  },
  {
    id: 'wd-2',
    name: 'Sweet Royal Lassi with Pistachio',
    nepaliName: 'शाही पिस्ता लस्सी',
    category: 'WELCOME_DRINK',
    isVegetarian: true,
    isTraditionalNepali: true,
    extraPriceNpr: 60,
    description: 'Traditional thick churned curd lassi garnished with saffron and crushed pistachios.',
  },
  {
    id: 'wd-3',
    name: 'Spiced Buttermilk (Mohi)',
    nepaliName: 'मसालेदार मोही',
    category: 'WELCOME_DRINK',
    isVegetarian: true,
    isTraditionalNepali: true,
    description: 'Refreshing rustic buttermilk churned with roasted cumin, ginger, and green chillies.',
  },
  {
    id: 'wd-4',
    name: 'Virgin Mojito & Blue Lagoon Mocktails',
    nepaliName: 'भर्जिन मोजिटो र मकटेल',
    category: 'WELCOME_DRINK',
    isVegetarian: true,
    isTraditionalNepali: false,
    extraPriceNpr: 80,
    description: 'Sparkling mocktails prepared live at the welcome counter.',
  },

  // Vegetarian Starters
  {
    id: 'vs-1',
    name: 'Tandoori Paneer Tikka',
    nepaliName: 'पनीर टिक्का',
    category: 'VEG_STARTER',
    isVegetarian: true,
    isTraditionalNepali: false,
    description: 'Charcoal-grilled fresh cottage cheese marinated in mustard oil, hung curd, and carom seeds.',
  },
  {
    id: 'vs-2',
    name: 'Crispy Butter Salt Corn',
    nepaliName: 'क्रिस्पी बटर कर्न',
    category: 'VEG_STARTER',
    isVegetarian: true,
    isTraditionalNepali: false,
    description: 'Golden fried sweet corn tossed with capsicum, black pepper, and fresh butter.',
  },
  {
    id: 'vs-3',
    name: 'Aloo Tareko / Spicy Potato Roast',
    nepaliName: 'आलु तारेको',
    category: 'VEG_STARTER',
    isVegetarian: true,
    isTraditionalNepali: true,
    description: 'Crisp mountain potatoes spiced with timur (Sichuan pepper), fenugreek seeds, and turmeric.',
  },
  {
    id: 'vs-4',
    name: 'Mushroom Chilly Dry',
    nepaliName: 'च्याउ चिल्ली',
    category: 'VEG_STARTER',
    isVegetarian: true,
    isTraditionalNepali: false,
    extraPriceNpr: 50,
    description: 'Button mushrooms sautéed with bell peppers, spring onions, and tangy garlic sauce.',
  },
  {
    id: 'vs-5',
    name: 'Crispy Veg Spring Rolls',
    nepaliName: 'भेज स्प्रिङ्ग रोल',
    category: 'VEG_STARTER',
    isVegetarian: true,
    isTraditionalNepali: false,
    description: 'Crisp pastry wrappers loaded with shredded seasonal vegetables and sweet chilli dip.',
  },

  // Non-Veg Starters
  {
    id: 'nvs-1',
    name: 'Traditional Chicken Sekuwa',
    nepaliName: 'कुखुराको सेकुवा',
    category: 'NON_VEG_STARTER',
    isVegetarian: false,
    isTraditionalNepali: true,
    description: 'Boneless tender chicken skewers roasted over charcoal with mustard oil, timur, and garlic paste.',
  },
  {
    id: 'nvs-2',
    name: 'Smoked Mutton Choila (Newari Khasi Choila)',
    nepaliName: 'खसीको छोइला (नेवारी शैली)',
    category: 'NON_VEG_STARTER',
    isVegetarian: false,
    isTraditionalNepali: true,
    extraPriceNpr: 150,
    description: 'Authentic fire-flamed mutton marinated with burnt fenugreek oil, ginger-garlic paste, and roasted cumin.',
  },
  {
    id: 'nvs-3',
    name: 'Crispy Fish Amritsari Finger',
    nepaliName: 'माछा फ्राइ (अमृतसरी)',
    category: 'NON_VEG_STARTER',
    isVegetarian: false,
    isTraditionalNepali: false,
    description: 'River fish fillets dipped in carom seed gram flour batter and fried till crisp with tartar chutney.',
  },
  {
    id: 'nvs-4',
    name: 'Chicken Chilly with Roasted Sesame',
    nepaliName: 'चिकन चिल्ली',
    category: 'NON_VEG_STARTER',
    isVegetarian: false,
    isTraditionalNepali: false,
    description: 'Tender chicken tossed in wok with bell peppers, green chillies, and roasted sesame seeds.',
  },

  // Traditional Nepali Cultural Specialities
  {
    id: 'tn-1',
    name: 'Himalayan Khasi ko Kalo Masu',
    nepaliName: 'खसीको कालो मासु',
    category: 'TRADITIONAL_NEPALI',
    isVegetarian: false,
    isTraditionalNepali: true,
    description: 'Slow-cooked cast iron pot goat curry seasoned with roasted coriander, black cardamom, and Jimbu.',
  },
  {
    id: 'tn-2',
    name: 'Local Kukhura ko Gravy with Jimbu',
    nepaliName: 'लोकल कुखुराको झोल (जिम्मु झानेको)',
    category: 'TRADITIONAL_NEPALI',
    isVegetarian: false,
    isTraditionalNepali: true,
    description: 'Free-range local country chicken cooked in homestyle ginger-turmeric gravy tempered with Himalayan Jimbu.',
  },
  {
    id: 'tn-3',
    name: 'Newari Samay Baji Platter Assortment',
    nepaliName: 'समय बजी परिकार (बजी, भटमास, छोइला, अचार)',
    category: 'TRADITIONAL_NEPALI',
    isVegetarian: true,
    isTraditionalNepali: true,
    description: 'Baji (beaten rice), spiced black soybeans, smoked ginger, and authentic radish fermented achar.',
  },
  {
    id: 'tn-4',
    name: 'Traditional Mixed Sprouted Bean Stew (Kwati)',
    nepaliName: 'क्वाँटी झोल',
    category: 'TRADITIONAL_NEPALI',
    isVegetarian: true,
    isTraditionalNepali: true,
    description: 'Nine varieties of sprouted beans simmered slowly with ajwain and mountain herbs.',
  },

  // Main Courses (Veg & Non-Veg)
  {
    id: 'mc-1',
    name: 'Shahi Paneer Butter Masala',
    nepaliName: 'पनीर बटर मसाला',
    category: 'MAIN_COURSE_VEG',
    isVegetarian: true,
    isTraditionalNepali: false,
    description: 'Rich tomato, butter, and cashew gravy infused with kasuri methi and soft malai paneer.',
  },
  {
    id: 'mc-2',
    name: 'Slow Cooked Dal Makhani',
    nepaliName: 'दाल मखनी',
    category: 'MAIN_COURSE_VEG',
    isVegetarian: true,
    isTraditionalNepali: false,
    description: 'Black lentils slow-cooked overnight with white butter, fresh cream, and garlic.',
  },
  {
    id: 'mc-3',
    name: 'Navratan Seasonal Vegetable Korma',
    nepaliName: 'सिजनल मिक्स भेज कुर्मा',
    category: 'MAIN_COURSE_VEG',
    isVegetarian: true,
    isTraditionalNepali: false,
    description: 'Fresh seasonal vegetables cooked with ground almonds, mild spices, and coconut cream.',
  },
  {
    id: 'mc-4',
    name: 'Rich Butter Chicken Gravy',
    nepaliName: 'बटर चिकन',
    category: 'MAIN_COURSE_NON_VEG',
    isVegetarian: false,
    isTraditionalNepali: false,
    description: 'Tandoori chicken pieces simmered in silky tomato velvet makhani gravy.',
  },

  // Rice, Breads & Staples
  {
    id: 'rb-1',
    name: 'Fragrant Basmati Jeera Pulao',
    nepaliName: 'बासमती जिरा पुलाउ',
    category: 'RICE_AND_BREAD',
    isVegetarian: true,
    isTraditionalNepali: true,
    description: 'Extra long grain aged Basmati rice tossed with whole ghee, roasted cumin, and whole spices.',
  },
  {
    id: 'rb-2',
    name: 'Dum Hyderabadi Mutton Biryani with Raita',
    nepaliName: 'दम मटन बिर्यानी',
    category: 'RICE_AND_BREAD',
    isVegetarian: false,
    isTraditionalNepali: false,
    extraPriceNpr: 180,
    description: 'Layered Basmati rice and tender goat meat sealed in handi with saffron, mint, and fried onions.',
  },
  {
    id: 'rb-3',
    name: 'Fresh Tandoori Roti & Garlic Butter Naan',
    nepaliName: 'तान्दुरी रोटी र बटर नान',
    category: 'RICE_AND_BREAD',
    isVegetarian: true,
    isTraditionalNepali: false,
    description: 'Hot baked in clay oven and brushed with pure butter.',
  },
  {
    id: 'rb-4',
    name: 'Crispy Festive Sel Roti & Puri',
    nepaliName: 'सेल रोटी र पुरी',
    category: 'RICE_AND_BREAD',
    isVegetarian: true,
    isTraditionalNepali: true,
    description: 'Traditional Nepalese ring-shaped sweet rice bread fried golden crisp in pure ghee.',
  },

  // Live Food Counters
  {
    id: 'lc-1',
    name: 'Live Steamed Momo Bar (Buff, Chicken & Paneer)',
    nepaliName: 'लाइभ मोमो काउन्टर (बफ, चिकेन, पनीर)',
    category: 'LIVE_COUNTER',
    isVegetarian: false,
    isTraditionalNepali: true,
    extraPriceNpr: 120,
    description: 'Steaming hot momos made to order with authentic roasted tomato sesame chutney & jhol achar.',
  },
  {
    id: 'lc-2',
    name: 'Live Chatpate, Pani Puri & Dahi Puri Station',
    nepaliName: 'लाइभ पानीपुरी र दहीपुरी काउन्टर',
    category: 'LIVE_COUNTER',
    isVegetarian: true,
    isTraditionalNepali: true,
    extraPriceNpr: 90,
    description: 'Crispy puris stuffed with potato-chickpea masala served with tangy mint water and sweetened curd.',
  },
  {
    id: 'lc-3',
    name: 'Live Mongolian Wok & Noodle Bar',
    nepaliName: 'लाइभ नुडल्स र पास्ता काउन्टर',
    category: 'LIVE_COUNTER',
    isVegetarian: true,
    isTraditionalNepali: false,
    extraPriceNpr: 110,
    description: 'Custom stir-fried noodles and pasta with assorted vegetables and signature sauces.',
  },

  // Desserts
  {
    id: 'ds-1',
    name: 'Bhaktapur King Curd (Juju Dhau)',
    nepaliName: 'भक्तपुरको जुजु धौ (राजदही)',
    category: 'DESSERT',
    isVegetarian: true,
    isTraditionalNepali: true,
    description: 'Authentic clay pot sweetened buffalo curd made by Bhaktapur master artisans.',
  },
  {
    id: 'ds-2',
    name: 'Warm Gulab Jamun & Rasbari with Rabri',
    nepaliName: 'तातो लालमोहन र रसबरी',
    category: 'DESSERT',
    isVegetarian: true,
    isTraditionalNepali: true,
    description: 'Melt-in-mouth milk dumplings soaked in cardamom sugar syrup served with condensed rabri.',
  },
  {
    id: 'ds-3',
    name: 'Vanilla / Butterscotch Ice Cream with Chocolate Brownie',
    nepaliName: 'आइसक्रिम र चकलेट ब्राउनी',
    category: 'DESSERT',
    isVegetarian: true,
    isTraditionalNepali: false,
    description: 'Rich cream gelato topped with warm walnut brownie and dark chocolate drizzle.',
  },
  {
    id: 'ds-4',
    name: 'Traditional Kheer with Almonds & Saffron',
    nepaliName: 'शाही नेपाली खीर',
    category: 'DESSERT',
    isVegetarian: true,
    isTraditionalNepali: true,
    description: 'Rice pudding cooked in full cream milk with cardamom, saffron strands, and roasted cashews.',
  },
];

export const STANDARD_CATERING_PACKAGES: CateringPackage[] = [
  {
    id: 'pkg-silver',
    name: 'Silver Celebration Buffet',
    nepaliName: 'सिल्भर उत्सव बुफे',
    pricePerPlateNpr: 1250,
    description: 'Ideal for birthday milestones, family Pasni gatherings, and intimate corporate receptions.',
    includedCounts: {
      welcomeDrinks: 1,
      vegStarters: 2,
      nonVegStarters: 1,
      traditionalNepali: 1,
      mainCourses: 2,
      riceAndBreads: 2,
      liveCounters: 0,
      desserts: 1,
    },
    sampleItems: ['Fresh Mint Lemonade', 'Paneer Tikka', 'Chicken Sekuwa', 'Khasi ko Masu', 'Dal Makhani', 'Jeera Pulao', 'Juju Dhau'],
  },
  {
    id: 'pkg-gold',
    name: 'Gold Grand Royal Feast (Most Popular)',
    nepaliName: 'गोल्ड शाही भोज (सबैभन्दा लोकप्रिय)',
    pricePerPlateNpr: 1750,
    description: 'Comprehensive wedding and Bratabandha package with live counter, Newari specialities, and goat curry.',
    includedCounts: {
      welcomeDrinks: 2,
      vegStarters: 2,
      nonVegStarters: 2,
      traditionalNepali: 2,
      mainCourses: 3,
      riceAndBreads: 3,
      liveCounters: 1,
      desserts: 2,
    },
    sampleItems: ['Royal Pistachio Lassi', 'Chicken Choila', 'Fish Amritsari', 'Khasi ko Kalo Masu', 'Live Steamed Momo Bar', 'Juju Dhau', 'Gulab Jamun'],
  },
  {
    id: 'pkg-platinum',
    name: 'Platinum Heritage Banquet (VIP Experience)',
    nepaliName: 'प्लैटिनम हेरिटेज बैंक्वेट (भीआईपी अनुभव)',
    pricePerPlateNpr: 2450,
    description: 'Luxurious multi-course wedding extravaganza with dual live counters, dum biryani, and artisanal desserts.',
    includedCounts: {
      welcomeDrinks: 3,
      vegStarters: 3,
      nonVegStarters: 3,
      traditionalNepali: 2,
      mainCourses: 4,
      riceAndBreads: 3,
      liveCounters: 2,
      desserts: 3,
    },
    sampleItems: ['Virgin Mojito', 'Smoked Mutton Choila', 'Live Momo Bar', 'Live Pani Puri Cart', 'Dum Mutton Biryani', 'Kheer with Saffron', 'Ice Cream Brownie'],
  },
];

/**
 * Recalculate quotation price based on package, custom extra items, guest count, and taxes
 */
export function calculateCateringQuotation(params: {
  packageId: string;
  guestCount: number;
  hallRentalNpr: number;
  selectedItemIds: string[];
  discountNpr?: number;
}) {
  const pkg = STANDARD_CATERING_PACKAGES.find((p) => p.id === params.packageId) || STANDARD_CATERING_PACKAGES[1];
  let extraPerPlateNpr = 0;

  // Calculate any item extras beyond package inclusions
  for (const itemId of params.selectedItemIds) {
    const item = MASTER_MENU_ITEMS.find((i) => i.id === itemId);
    if (item && item.extraPriceNpr) {
      extraPerPlateNpr += item.extraPriceNpr;
    }
  }

  const effectivePerPlateNpr = pkg.pricePerPlateNpr + extraPerPlateNpr;
  const cateringSubtotalNpr = effectivePerPlateNpr * params.guestCount;
  const rawSubtotalNpr = cateringSubtotalNpr + params.hallRentalNpr - (params.discountNpr || 0);

  // Standard Nepal Hospitality Tax rules: 10% Service Charge + 13% VAT
  const serviceChargeNpr = Math.round(rawSubtotalNpr * 0.10);
  const taxableAmountNpr = rawSubtotalNpr + serviceChargeNpr;
  const vatNpr = Math.round(taxableAmountNpr * 0.13);
  const totalNpr = taxableAmountNpr + vatNpr;

  // Deposit standard: 25% upon agreement
  const depositRequiredNpr = Math.round(totalNpr * 0.25);

  return {
    package: pkg,
    effectivePerPlateNpr,
    cateringSubtotalNpr,
    hallRentalNpr: params.hallRentalNpr,
    discountNpr: params.discountNpr || 0,
    rawSubtotalNpr,
    serviceChargeNpr,
    vatNpr,
    totalNpr,
    depositRequiredNpr,
  };
}
