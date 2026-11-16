/**
 * UTSAVO - Core Types & Domain Models
 * Nepal's Smart Celebration Marketplace
 */

export type UserRole = 
  | 'CUSTOMER' 
  | 'VENUE_OWNER' 
  | 'VENUE_MANAGER' 
  | 'EVENT_ORGANIZER'
  | 'SUPER_ADMIN' 
  | 'FINANCE_ADMIN' 
  | 'SUPPORT_OFFICER';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  organization?: string;
  assignedVenueId?: string;
  assignedOrganizerId?: string;
  panchangaPreferences?: UserPanchangaPreferences;
}

export type EventType = 
  | 'WEDDING'           // विवाह (Bibaha)
  | 'RECEPTION'         // प्रीतिभोज
  | 'BRATABANDHA'       // व्रतबन्ध / उपनयन
  | 'PASNI'             // पास्नी / अन्नप्राशन
  | 'ENGAGEMENT'        // टीका / मगनी
  | 'BIRTHDAY_JUBILEE'  // जन्मदिन / जन्मोत्सव
  | 'CORPORATE_GALA'    // व्यावसायिक सम्मेलन / भेला
  | 'GRIHA_PRAVESH'     // गृह प्रवेश
  | 'OTHER_CELEBRATION';// अन्य उत्सव

export type ShiftTime = 'MORNING' | 'DAY' | 'EVENING' | 'FULL_DAY';

export interface ShiftInfo {
  id: ShiftTime;
  name: string;
  nepaliName: string;
  timeRange: string;
}

export interface PanchangaMuhurat {
  id: string;
  dateBS: string;         // e.g. "2083 Mangsir 19"
  dateAD: string;         // e.g. "2026-12-05"
  tithi: string;          // e.g. "Trayodashi / त्रयोदशी"
  nakshatra: string;      // e.g. "Rohini / रोहिणी"
  eventType: EventType;
  auspiciousTime: string; // e.g. "09:15 AM - 01:45 PM"
  significance: string;   // e.g. "Sarva Siddhi Muhurat per Nepal Panchanga Nirnayak Samiti"
}

export interface HallSpace {
  id: string;
  name: string;
  nepaliName: string;
  type: 'INDOOR_HALL' | 'GARDEN_LAWN' | 'ROOFTOP' | 'POOLSIDE' | 'DINING_PAVILION';
  minCapacity: number;
  maxCapacity: number;
  minGuestGuarantee: number;
  areaSqFt: number;
  baseRentalNpr: number;
  features: string[];
  photoUrl: string;
}

export interface MenuItem {
  id: string;
  name: string;
  nepaliName: string;
  category: MenuCategory;
  isVegetarian: boolean;
  isTraditionalNepali: boolean;
  extraPriceNpr?: number; // extra if added beyond included tier
  description?: string;
  isMandatory?: boolean;
}

export type MenuCategory = 
  | 'WELCOME_DRINK'
  | 'VEG_STARTER'
  | 'NON_VEG_STARTER'
  | 'TRADITIONAL_NEPALI'
  | 'MAIN_COURSE_VEG'
  | 'MAIN_COURSE_NON_VEG'
  | 'RICE_AND_BREAD'
  | 'LIVE_COUNTER'
  | 'DESSERT'
  | 'BEVERAGE';

export interface CateringPackage {
  id: string;
  name: string;
  nepaliName: string;
  pricePerPlateNpr: number;
  description: string;
  includedCounts: {
    welcomeDrinks: number;
    vegStarters: number;
    nonVegStarters: number;
    traditionalNepali: number;
    mainCourses: number;
    riceAndBreads: number;
    liveCounters: number;
    desserts: number;
  };
  sampleItems: string[];
}

export type VerificationStatus = 
  | 'UNVERIFIED' 
  | 'DOCUMENTS_SUBMITTED' 
  | 'VERIFIED' 
  | 'SUSPENDED';

export type MediaType = 'PHOTO' | 'VIDEO';
export type MediaCategory = 
  | 'BALLROOM' 
  | 'GARDEN_LAWN' 
  | 'STAGE_MANDAP' 
  | 'FOOD_BUFFET' 
  | 'ENTRANCE_LOBBY' 
  | 'VIP_LOUNGE' 
  | 'DRONE_AERIAL' 
  | 'GENERAL';

export interface VenueMediaItem {
  id: string;
  type: MediaType;
  url: string;
  title?: string;
  caption?: string;
  category?: MediaCategory;
  isCover?: boolean;
  videoPlatform?: 'YOUTUBE' | 'VIMEO' | 'DIRECT' | 'INSTAGRAM' | 'TIKTOK';
  thumbnailUrl?: string;
}

export type EventManagementPolicyType = 
  | 'IN_HOUSE_ONLY'      // Performs event management exclusively in-house
  | 'OUTSIDE_ALLOWED'    // Open to outside event management companies
  | 'HYBRID_BOTH';       // In-house planning team available, but also open to outside event planners

export interface EventManagementPolicy {
  policyType: EventManagementPolicyType;
  allowsOutsideOrganizers: boolean;
  inHouseServicesDescription: string;
  outsideOrganizerFeeNpr?: number;        // Royalty/coordination fee for outside planners (0 if free)
  outsideOrganizerGuidelines?: string;    // Operational rules, load-in timing, advance site walk-through
  soundCurfewTime?: string;               // e.g. "10:30 PM"
  powerLoadCapacityKw?: number;           // e.g. 50 kW generator allocation for stage/lighting
  refundableSecurityDepositNpr?: number;  // e.g. 25000 NPR
}

export interface VenueOffer {
  id: string;
  title: string;
  nepaliTitle?: string;
  badgeText: string;             // e.g. "⚡ 15% OFF", "Save Rs. 50,000", "🎁 Free Mandap Rig"
  discountType: 'PERCENTAGE' | 'FLAT_AMOUNT' | 'COMPLIMENTARY_ADDON';
  discountValue: number;         // e.g. 15 (percent) or 50000 (NPR)
  promoCode: string;             // e.g. "UTSAVO15", "VIVAHA2083"
  validUntilBS: string;          // e.g. "2083 Falgun 30"
  validUntilAD?: string;         // e.g. "2027-03-14"
  minGuests?: number;            // e.g. 250
  minTotalNpr?: number;          // e.g. 300000
  description: string;
  terms?: string[];
  isActive: boolean;
  highlightOnCard?: boolean;      // Show prominent badge on catalog card
  applicableHalls?: string[];    // Hall IDs or ['ALL']
  applicableEventTypes?: EventType[];
}

export interface KycDocuments {
  businessPanDocUrl?: string;
  companyRegDocUrl?: string;
  citizenshipOrPassportDocUrl?: string;
  foodHygieneCertificationUrl?: string;
  fireSafetyCertificationUrl?: string;
  verificationPhotos: Array<{
    id: string;
    category: 'EXTERIOR_ENTRANCE' | 'MAIN_HALL' | 'KITCHEN_HYGIENE' | 'POWER_BACKUP_GENSET' | 'FIRE_SAFETY_EXIT';
    title: string;
    url: string;
    uploadedAt: string;
    notes?: string;
  }>;
  status: VerificationStatus;
  lastUpdated?: string;
  complianceNotes?: string;
}

export interface Venue {
  id: string;
  name: string;
  nepaliName: string;
  tagline: string;
  province: string;
  district: string;
  municipality: string;
  ward: number;
  locality: string;
  address: string;
  mapCoordinates: { lat: number; lng: number };
  coverImage: string;
  gallery: string[];
  mediaGallery?: VenueMediaItem[];         // Unlimited photos and videos
  offers?: VenueOffer[];                   // Venue discounts and promotional offers
  kycDocuments?: KycDocuments;             // KYC verification documents & physical facility photos
  verificationStatus: VerificationStatus;
  panNumber: string;
  businessRegNumber: string;
  contactPerson: string;
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  responseRatePercent: number;
  halls: HallSpace[];
  parkingCapacityCars: number;
  parkingCapacityBikes: number;
  hasPowerBackup: boolean;
  hasWheelchairAccess: boolean;
  hasMandapSetup: boolean;
  hasLiveMusicPermit: boolean;
  hasVipLounge: boolean;
  minGuests: number;
  maxGuests: number;
  baseRentalStartingNpr: number;
  cateringStartingNpr: number;
  packages: CateringPackage[];
  availableMenuItems: MenuItem[];
  cancellationPolicy: string;
  dynamicCancellationPolicy?: DynamicCancellationPolicy;
  decorationPolicy: string;
  eventManagementPolicy?: EventManagementPolicy; // In-house vs Outside event management configuration
}

export interface DestinationCelebrationPackage {
  id: string;
  title: string;
  nepaliTitle: string;
  destinationRegion: 'POKHARA_ANNAPURNA' | 'KATHMANDU_HERITAGE' | 'NAGARKOT_DHULIKHEL' | 'CHITWAN_SAFARI' | 'MUKTINATH_SACRED' | 'EVEREST_PANORAMA';
  locationName: string;
  altitudeMeters: number;
  heroImage: string;
  galleryImages: string[];
  durationDays: number;
  idealForGuests: string;
  bestSeasons: string;
  startingPriceUsd: number;
  startingPriceNpr: number;
  tagline: string;
  overview: string;
  itinerary: Array<{
    dayNumber: number;
    title: string;
    highlights: string[];
    logistics: string;
  }>;
  includedExperiences: string[];
  logisticsSupport: {
    airportVipTransfers: boolean;
    domesticMountainFlights: boolean;
    charteredHelicopterOption: boolean;
    luxuryRoomBlocks: string;
    multilingualPriestPanchanga: boolean;
    foreignerMarriageLegalSupport: boolean;
    culturalEnsembleWardrobe: boolean;
  };
}

export interface DestinationInquiry {
  id: string;
  inquiryRef: string; // e.g. "UTS-DEST-NP-8924"
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCountryOfResidence: string;
  isNriOrForeigner: boolean;
  celebrationType: EventType | 'DESTINATION_WEDDING' | 'ANNIVERSARY_RENEWAL';
  targetDestination: string;
  estimatedDateBS?: string;
  estimatedDateAD?: string;
  estimatedGuests: number;
  budgetCurrency: 'USD' | 'NPR' | 'EUR' | 'GBP' | 'AUD' | 'INR';
  budgetAmount: number;
  guestAccommodationNeeds: 'FIVE_STAR_LUXURY' | 'HERITAGE_BOUTIQUE' | 'RESORT_VILLAS' | 'FLEXIBLE';
  specialRequirements: {
    needHelicopterFlight: boolean;
    needMountainSightseeing: boolean;
    needVedicPriestEnglishHindi: boolean;
    needSpecialDietaryJainHalalVeg: boolean;
    needTraditionalNepaliAttire: boolean;
    needLegalMarriageCertificateGuidance: boolean;
  };
  additionalNotes: string;
  aiSourcedInsights?: {
    travelAndPermits: string;
    recommendedItinerary: string;
    customsAndJewelryGuidance: string;
    estimatedCostBreakdown: string;
  };
  status: 'SUBMITTED' | 'CONCIERGE_CONTACTED' | 'ITINERARY_CUSTOMIZED' | 'CONFIRMED';
  createdAt: string;
}

export type OrganizerSpecialization = 
  | 'WEDDING_PLANNING'         // Complete Vedic, Newari & Contemporary Weddings
  | 'CORPORATE_SUMMIT'         // Conferences, AGMs, Product Launches & Brand Activations
  | 'STAGE_LIGHTING_AV'        // Technical stage architecture, acoustic line arrays & LED walls
  | 'DECOR_AND_FLORAL'         // Theme styling, fresh floral installations & mandap art
  | 'CULTURAL_AND_FESTIVAL'    // Mega concerts, cultural jubilees, exhibitions
  | 'DESTINATION_MANAGEMENT';  // Destination weddings (Pokhara, Nagarkot, Chitwan, Dhulikhel)

export interface OrganizerSuccessStandard {
  hasPublicLiabilityInsurance: boolean;
  insurancePolicyNumber?: string;
  hasEmergencyMedicalPlan: boolean;
  hasFireSafetyCertification: boolean;
  hasRunOfShowTimelineSystem: boolean;  // Minute-by-minute execution schedule
  hasTechnicalRiderCapability: boolean; // Load calculations & acoustic dB control
  hasWasteManagementPlan: boolean;      // Eco-friendly zero single-use plastic & recycling
  certifiedPlannersCount: number;
}

export interface EventOrganizer {
  id: string;
  companyName: string;
  nepaliName?: string;
  tagline: string;
  founderOrContact: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  province: string;
  panNumber: string;
  businessRegNumber: string;
  yearsOfExperience: number;
  teamSize: number;
  rating: number;
  reviewCount: number;
  verificationStatus: VerificationStatus;
  specializations: OrganizerSpecialization[];
  successStandards: OrganizerSuccessStandard;
  startingPriceNpr: number;
  pricingModel: 'TURNKEY_FULL_PLANNING' | 'DAY_OF_COORDINATION' | 'STYLING_AND_DESIGN' | 'CUSTOM_QUOTATION';
  portfolioMedia: {
    id: string;
    type: 'PHOTO' | 'VIDEO';
    url: string;
    title: string;
    eventType: string;
  }[];
  preferredVenueTypes: string[];
  externalManagementInsuranceDoc?: string;
  clientTestimonialsCount: number;
  bio: string;
  websiteUrl?: string;
  dynamicCancellationPolicy?: DynamicCancellationPolicy;
}

export type NegotiationStatus = 
  | 'DRAFT'
  | 'SUBMITTED_TO_VENUE'
  | 'COUNTER_BY_VENUE'
  | 'COUNTER_BY_CUSTOMER'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED';

export interface OfferVersion {
  version: number;
  senderRole: 'CUSTOMER' | 'VENUE';
  senderName: string;
  timestamp: string;
  dateBS: string;
  dateAD: string;
  shift: ShiftTime;
  hallId: string;
  guestCount: number;
  proposedPerPlateNpr: number;
  hallRentalNpr: number;
  includedAmenities: string[];
  specialRequests: string;
  subtotalNpr: number;
  serviceChargeNpr: number; // 10%
  vatNpr: number;           // 13%
  totalNpr: number;
  validUntil: string;
  notes?: string;
}

export interface NegotiationThread {
  id: string;
  enquiryId: string;
  venueId: string;
  venueName: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  eventType: EventType;
  status: NegotiationStatus;
  currentVersion: number;
  versions: OfferVersion[];
  messages: Array<{
    id: string;
    senderRole: 'CUSTOMER' | 'VENUE';
    senderName: string;
    text: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 
  | 'ON_HOLD'
  | 'DEPOSIT_PAID'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED';

export interface Booking {
  id: string;
  bookingRef: string; // e.g. "UTS-2083-9842"
  venueId: string;
  venueName: string;
  hallId: string;
  hallName: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  eventType: EventType;
  eventDateBS: string;
  eventDateAD: string;
  shift: ShiftTime;
  guestCount: number;
  agreedPerPlateNpr: number;
  hallRentalNpr: number;
  totalAmountNpr: number;
  depositRequiredNpr: number;
  depositPaidNpr: number;
  balanceDueNpr: number;
  status: BookingStatus;
  selectedMenuSummary: string[];
  signedAgreementHash: string;
  agreementSignedAt?: string;
  createdAt: string;
  paymentDetails?: {
    paymentMethod: 'ESEWA' | 'KHALTI' | 'FONEPAY' | 'BANK_TRANSFER';
    transactionId: string;
    paidAmountNpr: number;
    paidAt: string;
    verifiedServerSide: boolean;
  };
  commissionRatePercent: number; // e.g. 5%
  commissionAmountNpr: number;
  settlementStatus: 'PENDING' | 'SETTLED' | 'HELD';
}

export interface VerifiedReview {
  id: string;
  venueId: string;
  bookingRef: string;
  customerName: string;
  eventType: EventType;
  eventDateBS: string;
  overallRating: number;
  ratings: {
    ambience: number;
    catering: number;
    serviceStaff: number;
    cleanliness: number;
    priceTransparency: number;
  };
  comment: string;
  venueResponse?: string;
  createdAt: string;
  verifiedBooking: boolean;
}

// -------------------------------------------------------------
// CULTURAL VENDOR MARKETPLACE TYPES & CUSTOM CATEGORIES
// -------------------------------------------------------------
export type CulturalVendorCategory = 
  | 'PANCHE_NAUMATI_BAJA'      // पञ्चे बाजा तथा नौमती बाजा
  | 'NEWARI_DHIME_BAJA'        // नेवारी धिमे तथा बाँसुरी बाजा
  | 'VEDIC_PUROHIT_ACHARYA'    // वैदिक पण्डित तथा पुरोहित (नेपाली/English)
  | 'PHOTOGRAPHY_CINEMATOGRAPHY' // फोटोग्राफी तथा ड्रोन सिनेमाटोग्राफी
  | 'BRIDAL_MAKEUP_MEHENDI'    // ब्राइडल मेकअप तथा मेहन्दी आर्ट
  | 'DECOR_MANDAP_ARTIST'      // मण्डप तथा स्टेज सजावट
  | 'TRADITIONAL_ATTIRE_JEWELRY' // दौरा सुरुवाल, ढाका टोपी, गुन्यु चोलो
  | 'OTHER'                    // अन्य नयाँ विधा (Custom vendor category proposal)
  | string;

export interface CustomVendorCategoryProposal {
  id: string;
  categoryKey: string;
  name: string;
  nepaliName: string;
  icon: string;
  description?: string;
  proposedByVendorId?: string;
  proposedByVendorName?: string;
  status: 'PENDING' | 'PERMANENT' | 'TEMPORARY' | 'REJECTED';
  createdAt: string;
  reviewedAt?: string;
  adminNotes?: string;
}

export interface VendorPackage {
  id: string;
  name: string;
  priceNpr: number;
  description: string;
  deliverables: string[];
}

export interface CulturalVendor {
  id: string;
  name: string;
  nepaliName?: string;
  category: CulturalVendorCategory;
  customCategoryName?: string;
  customCategoryNepaliName?: string;
  customCategoryStatus?: 'PENDING' | 'PERMANENT' | 'TEMPORARY' | 'REJECTED';
  leaderOrContact: string;
  phone: string;
  email: string;
  district: string;
  province: string;
  address: string;
  yearsOfExperience: number;
  rating: number;
  reviewCount: number;
  verifiedBadge: boolean;
  startingPriceNpr: number;
  priceUnit: 'PER_EVENT' | 'PER_DAY' | 'PER_PERSON' | 'FIXED_PACKAGE';
  packages: VendorPackage[];
  portfolioImages: string[];
  audioSampleTitle?: string;
  videoClipUrl?: string;
  bio: string;
  specializations: string[];
  isOpenForTravelAcrossNepal: boolean;
  bilingualEnglishSupport?: boolean; // For diaspora & international destination clients
  dynamicCancellationPolicy?: DynamicCancellationPolicy;
}

// -------------------------------------------------------------
// DESTINATION NEPAL VENDORS & LUXURY HERITAGE HOTELS TYPES
// -------------------------------------------------------------
export type DestinationPlaceRegion = 
  | 'POKHARA_ANNAPURNA' 
  | 'KATHMANDU_HERITAGE' 
  | 'NAGARKOT_DHULIKHEL' 
  | 'CHITWAN_SAFARI' 
  | 'MUKTINATH_SACRED' 
  | 'EVEREST_PANORAMA'
  | 'JANAKPUR_LUMBINI';

export type DestinationServiceCategory =
  | 'DESTINATION_HOTEL_RESORT'       // 5-Star Heritage / Mountain Resort
  | 'HELI_CHARTER_LOGISTICS'         // Chartered mountain helicopter & airport transfers
  | 'HIGH_ALTITUDE_EVENT_PRODUCTION' // Glamping, sound rigs, mountain weatherproofing
  | 'HERITAGE_CULTURAL_EXPERIENCE'   // Royal Newari banquet, Gurung/Tharu folk troupes
  | 'EXPEDITION_PHOTOGRAPHY_DRONE'   // High-altitude drone cinematography & streaming
  | 'ECO_FARM_BANQUET_CATERING'      // Organic Himalayan farm-to-table feast
  | 'SACRED_MONASTERY_CEREMONY'      // Buddhist Lama / Vedic high priest ceremonies
  | 'OTHER_DESTINATION_SERVICE';

export interface DestinationHotelProperty {
  id: string;
  name: string;
  nepaliName?: string;
  placeRegion: DestinationPlaceRegion;
  locationName: string;
  altitudeMeters: number;
  starRating: 3 | 4 | 5 | 'HERITAGE_LUXURY';
  roomCount: number;
  maxBanquetCapacity: number;
  startingPricePerNightUsd: number;
  startingPricePerNightNpr: number;
  coverImage: string;
  galleryImages: string[];
  placeFeatures: string[];
  propertyAmenities: string[];
  contactPerson: string;
  phone: string;
  email: string;
  isVerified: boolean;
  featuredBadges: string[];
}

export interface DestinationVendorService {
  id: string;
  serviceName: string;
  serviceCategory: DestinationServiceCategory;
  serviceCategoryCustom?: string;
  featuredPlaceRegion: DestinationPlaceRegion;
  placeName: string;
  providerName: string;
  phone: string;
  email: string;
  startingPriceUsd: number;
  startingPriceNpr: number;
  priceModel: 'PER_EVENT' | 'PER_DAY' | 'PER_GUEST' | 'PER_FLIGHT_HOUR';
  overview: string;
  placeSpecificFeatures: string[];
  deliverables: string[];
  coverImage: string;
  isVerified: boolean;
  yearsOperating: number;
  internationalClientReady: boolean;
  createdAt: string;
}

// -------------------------------------------------------------
// DIGITAL NIMANTRANA (INVITATION) & RSVP KITCHEN SYNC TYPES
// -------------------------------------------------------------
export type NimantranaTemplate = 
  | 'MITHILA_MADHUBANI'   // परम्परागत मिथिला कला
  | 'NEWARI_MALLA_GOLD'   // नेवारी परम्परागत कला
  | 'HIMALAYAN_ROYAL'     // हिमाल तथा सुनौलो राजसी
  | 'CONTEMPORARY_LOTUS'; // आधुनिक कमल शैली

export type DietaryType = 
  | 'VEG' 
  | 'NON_VEG_CHICKEN' 
  | 'NON_VEG_MUTTON' 
  | 'NON_VEG_FISH' 
  | 'JAIN_NO_ROOTS' 
  | 'HALAL';

export interface CeremonySubEvent {
  time: string;
  title: string;
  nepaliTitle?: string;
  description: string;
}

export interface DigitalInvitation {
  id: string;
  invitationCode: string; // e.g. "UTS-INV-8901"
  hostUserId: string;
  hostName: string;
  hostPhone: string;
  eventType: EventType;
  celebrantsTitle: string; // e.g. "Aayush & Sneha" or "Aarav's Bratabandha"
  venueId?: string;
  venueName: string;
  hallName?: string;
  dateBS: string;
  dateAD: string;
  muhuratTime: string;
  locationAddress: string;
  mapDirectionsUrl?: string;
  welcomeMessage: string;
  templateId: NimantranaTemplate;
  accentColor: string;
  subEvents: CeremonySubEvent[];
  rsvpDeadlineBS: string;
  enableKitchenRsvpSync: boolean;
  isPublished: boolean;
  createdAt: string;
  invocationText?: string;
  taglineText?: string;
  celebrantsPrefix?: string;
  celebrantsParentsText?: string;
  rsvpContactPerson?: string;
  customNote?: string;
}

export interface GuestRsvpResponse {
  id: string;
  invitationId: string;
  guestName: string;
  phone: string;
  attendanceStatus: 'ATTENDING' | 'NOT_ATTENDING' | 'TENTATIVE';
  adultsCount: number;
  childrenCount: number;
  dietaryPreferences: {
    veg: number;
    nonVegChicken: number;
    nonVegMutton: number;
    nonVegFish: number;
    jain: number;
    halal: number;
  };
  transportNeeded: boolean;
  arrivalShift: ShiftTime;
  wishesMessage?: string;
  submittedAt: string;
}

export interface KitchenPrepSheet {
  invitationId: string;
  venueName: string;
  eventDateBS: string;
  shift: ShiftTime;
  totalConfirmedAdults: number;
  totalConfirmedChildren: number;
  totalConfirmedHeads: number;
  vegHeadcount: number;
  nonVegChickenHeadcount: number;
  nonVegMuttonHeadcount: number;
  jainHeadcount: number;
  halalHeadcount: number;
  bufferMarginPercent: number; // e.g. 8%
  bufferHeadcount: number;
  totalPlatesToPrepare: number;
  rawMaterialsKg: {
    basmatiRiceKg: number;
    muttonKhasiKg: number;
    chickenBroilerKg: number;
    paneerFreshKg: number;
    dalBlackMahaKg: number;
    seasonalVegKg: number;
    dahiCurdLtr: number;
    lalmohanSweetsPieces: number;
    saladVeggiesKg: number;
    cookingOilGheeLtr: number;
  };
  generatedAt: string;
}

// -------------------------------------------------------------
// LEGAL CONTRACT & QUOTATION TYPES (Nepal Contract Act 2056)
// -------------------------------------------------------------
export interface LegalContractDocument {
  contractRef: string; // e.g. "UTS-KRA-2083-0419"
  dateIssuedBS: string;
  dateIssuedAD: string;
  partyAVenue: {
    legalEntityName: string;
    tradeName: string;
    panOrVatNumber: string;
    regNumber: string;
    authorizedSignatory: string;
    designation: string;
    phone: string;
    email: string;
    address: string;
  };
  partyBClient: {
    fullName: string;
    citizenshipOrPassportNumber: string;
    panNumber?: string;
    phone: string;
    email: string;
    address: string;
  };
  eventDetails: {
    eventType: EventType;
    eventDateBS: string;
    eventDateAD: string;
    shift: ShiftTime;
    hallName: string;
    guaranteedGuestCount: number;
  };
  pricingBreakdown: {
    perPlateAgreedRateNpr: number;
    cateringSubtotalNpr: number;
    hallRentalNpr: number;
    amenitiesSubtotalNpr: number;
    grossSubtotalNpr: number;
    discountNpr: number;
    taxableAmountNpr: number;
    vatRatePercent: number; // 13%
    vatAmountNpr: number;
    grandTotalNpr: number;
    securityDepositRefundableNpr: number;
  };
  paymentMilestones: {
    tokenAdvance20Npr: number;
    dueAtTokenDate: string;
    preEvent60Npr: number;
    dueAtPreEventDate: string;
    finalClearance20Npr: number;
    dueAtFinalDate: string;
  };
  legalClauses: {
    soundCurfewTime: string; // e.g. 10:30 PM
    generatorFuelTerms: string;
    outsideVendorPolicy: string;
    cancellationRefundSchedule: string;
    disputeJurisdiction: string; // e.g. Kathmandu District Court / Nepal Arbitration
  };
  partyASigned: boolean;
  partyBSigned: boolean;
  signedTimestamp?: string;
}

// -------------------------------------------------------------
// EVENT STAFF & GIG TALENT POOL TYPES (उत्सव जनशक्ति तथा गिग कार्यथलो)
// -------------------------------------------------------------
export type EventStaffGigRole = 
  | 'BANQUET_SERVER_WAITER'   // ब्यान्क्वेट वेटर / सर्भर
  | 'ASSISTANT_COOK_HALWAI'   // कुक / हलुवाई सहयोगी
  | 'BARTENDER_BARISTA'       // बारटेन्डर / पेय व्यवस्थापक
  | 'DISHWASHING_SANITATION'  // भाँडा सरसफाइ तथा किचन हाइजिन
  | 'MANDAP_DECOR_CREW'       // मण्डप तथा स्टेज सजावट सहयोगी
  | 'EVENT_USHER_HOST'        // अतिथि सत्कार तथा स्वागत टोली
  | 'SOUND_LIGHTING_TECH'     // ध्वनि तथा प्रकाश सहयोगी
  | 'VALET_SECURITY_PARKING'  // पार्किङ तथा सुरक्षा सहयोगी
  | 'PHOTOGRAPHY_ASSISTANT'   // फोटो/भिडियो क्यामेरा सहयोगी
  | 'OTHER_EVENT_STAFF';      // अन्य उत्सव सहयोग

export type EmploymentAvailabilityType = 
  | 'PART_TIME'       // अंशकालीन - Part Time
  | 'FULL_TIME'       // पूर्णकालीन - Full Time
  | 'WEEKEND_GIGS'    // शनिबार/बिदाको गिग - Weekend Gigs
  | 'ON_CALL_DAILY';  // दैनिक आवश्यकतामा - On-Call Daily

export type StaffShiftPreference = 
  | 'MORNING_SHIFT'   // बिहानी सिफ्ट (7 AM - 3 PM)
  | 'EVENING_SHIFT'   // साँझको सिफ्ट (3 PM - 11 PM)
  | 'FULL_DAY'        // पूरा दिन (All Day)
  | 'ANY_FLEXIBLE';   // जुनसुकै समय (Any Flexible)

export interface StaffReviewComment {
  id: string;
  staffId: string;
  reviewerName: string;            // Name of manager / hiring vendor
  reviewerOrganization: string;    // e.g. "The Regal Pavilion", "Kathmandu Royal Catering"
  reviewerRole?: string;           // "Banquet Manager", "Head Chef", "Event Planner"
  rating: number;                  // 1 to 5
  punctualityScore?: number;       // 1 to 5
  groomingCourtesyScore?: number;  // 1 to 5
  comment: string;                 // Detailed evaluation & feedback
  eventDate: string;               // When the work was performed
  eventType?: string;              // "Bihav Vivah", "Reception", "Bratabandha"
  createdAt: string;
}

export interface EventStaffProfile {
  id: string;
  fullName: string;
  nepaliName?: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  photo: string;
  bio: string;
  availabilityType: EmploymentAvailabilityType;
  primaryRole: EventStaffGigRole;
  secondarySkills: string[];
  shiftPreference: StaffShiftPreference;
  expectedWageNpr?: number;
  wageType: 'PER_SHIFT' | 'PER_HOUR' | 'MONTHLY';
  isGovtStatutoryWage?: boolean; // Set when defaulting to Nepal Labour Act minimum wage
  wageDeclaredByUser?: boolean; // False if worker left wage blank (adopted statutory min)
  customRoleName?: string; // If candidate selected OTHER and proposed a new specialized role
  customRoleNepaliName?: string;
  customRoleStatus?: 'PENDING' | 'PERMANENT' | 'TEMPORARY' | 'REJECTED';
  district: string;
  preferredLocalities: string[];
  isAvailableNow: boolean;
  dateOfBirth?: string; // YYYY-MM-DD (DOB for Child Labour Prohibition verification)
  ageYears?: number;
  childLabourCompliantVerified: boolean; // Verified >= 18 under Nepal Child Labour Prohibition Act 2056 & Children's Act 2075
  ageVerificationBadge?: string;
  experienceYears: number;
  pastVenuesWorked: string[];
  rating: number;
  totalShiftsCompleted: number;
  reviews: StaffReviewComment[];
  nidOrCitizenshipVerified: boolean;
  createdAt: string;
}

export interface StaffCustomRoleProposal {
  id: string;
  proposedRoleName: string;
  proposedNepaliName?: string;
  submittedByStaffName: string;
  staffPhone: string;
  description: string;
  status: 'PENDING' | 'PERMANENT' | 'TEMPORARY' | 'REJECTED';
  createdAt: string;
  reviewedAt?: string;
  adminNotes?: string;
}

// -------------------------------------------------------------
// NEPAL GOVERNMENT REGULATORY COMPLIANCE INTELLIGENCE
// -------------------------------------------------------------
export type GovtDirectiveCategory = 
  | 'LABOUR_ACT_WAGE'
  | 'DAO_SOUND_CURFEW'
  | 'IRD_VAT_TDS'
  | 'FOOD_SAFETY_ACT'
  | 'MUNICIPAL_BANQUET_CODE';

export interface NepalGovtDirectiveItem {
  id: string;
  category: GovtDirectiveCategory;
  actTitle: string;
  actTitleNepali: string;
  gazetteNoticeRef: string;
  effectiveDateBS: string;
  currentEnforcedValue: string;
  proposedGazetteUpdate?: string;
  impactOnPlatform: string;
  impactOnPlatformNepali: string;
  status: 'ACTIVE_ENFORCED' | 'PENDING_ADMIN_DECISION' | 'DISMISSED';
  verifiedSourceUrl?: string;
  lastScannedAt: string;
}

// -------------------------------------------------------------
// SOCIAL CELEBRATION WALL & AUTHENTIC TESTIMONIALS
// -------------------------------------------------------------
export interface SocialCelebrationPhoto {
  url: string;
  caption?: string;
  tag?: 'STAGE_MANDAP' | 'DINING_BUFFET' | 'ENTRANCE' | 'COUPLE_PORTRAIT' | 'CANDID' | 'VENUE_EXTERIOR';
}

export interface SocialCelebrationPost {
  id: string;
  venueId: string;
  venueName: string;
  venueDistrict: string;
  venueLocality?: string;
  eventType: EventType;
  celebrationTitle: string;        // e.g. "Rohan & Sneha's Traditional Vivah & Grand Reception"
  hostName: string;                // e.g. "Rohan Shakya"
  hostRole: string;                // e.g. "Groom", "Bride", "Father of Bride", "Bratabandha Parent"
  reviewQuote: string;             // Concise memorable quote
  detailedStory?: string;          // Full experiential testimonial
  overallRating: number;           // 1 to 5 (e.g. 5.0)
  cateringRating?: number;         // 1 to 5
  hospitalityRating?: number;      // 1 to 5
  eventDateBS: string;             // e.g. "2083 Mangsir 19"
  eventDateAD: string;             // e.g. "2026-12-05"
  guestCount: number;              // e.g. 550
  photos: SocialCelebrationPhoto[];
  coverPhoto: string;
  verifiedBooking: boolean;        // True if verified via UTSAVO escrow or PAN invoice
  likesCount: number;
  userLiked?: boolean;
  cateringHighlights?: string[];   // e.g. ["Live Jalebi Counter", "Hyderabadi Biryani", "Traditional Samay Baji"]
  tags: string[];                  // e.g. ["#KathmanduWedding", "#GrandBallroom", "#ValetParking"]
  createdAt: string;
}

// -------------------------------------------------------------
// PANCHANGA PREFERENCES & AUSPICIOUS PUSH NOTIFICATIONS
// -------------------------------------------------------------
export interface UserPanchangaPreferences {
  enabled: boolean;
  eventTypes: EventType[];
  preferredMonthsBS: string[];     // e.g. ['Mangsir', 'Magh', 'Falgun', 'Baishakh']
  leadTimeDays: number;            // e.g. 7, 14, 30 days before the Muhurat
  pushSoundEnabled: boolean;
  autoCheckOnLaunch: boolean;
  minUrgencyLevel: 'ALL' | 'HIGH_DEMAND_ONLY';
}

export interface AuspiciousPushAlert {
  id: string;
  muhuratId: string;
  title: string;
  titleNepali: string;
  message: string;
  messageNepali: string;
  dateBS: string;                  // e.g. "2083 Mangsir 19"
  dateAD: string;                  // e.g. "2026-12-05"
  tithi: string;                   // e.g. "Dwitiya (द्वितीया)"
  nakshatra: string;               // e.g. "Mool (मूल)"
  eventType: EventType;
  auspiciousTime: string;          // e.g. "11:00 AM - 04:30 PM"
  significance: string;
  isRead: boolean;
  timestamp: string;
  urgencyLevel: 'HIGH' | 'MEDIUM' | 'NORMAL';
  matchedPreferenceReason?: string;
}

// -------------------------------------------------------------
// SOCIAL CAUSE: ANNAPURNA SURPLUS FEAST FOOD RESCUE & RECOVERY
// (Strict voluntary client consent driven - Nepal DFTQC compliant)
// -------------------------------------------------------------
export type FoodDistributionPartnerType = 
  | 'UTSAVO_DIRECT_RESCUE'
  | 'REGISTERED_ORGANIZATION'
  | 'LOCAL_SHELTER_ASHRAM';

export interface ExcessFoodRescuePledge {
  id: string;
  eventId?: string;
  celebrationTitle: string;
  venueName: string;
  venueDistrict: string;
  clientHostName: string;
  clientPhone: string;
  clientConsentGiven: boolean; // MANDATORY: Explicit client consent
  clientConsentTimestamp?: string;
  clientConsentDeclaration: string;
  partnerType: FoodDistributionPartnerType;
  organizationName: string; // e.g. "UTSAVO Annapurna Seva", "Food for Life Nepal", "Manav Sewa Ashram", "Rokpa Nepal"
  estimatedSurplusPortions: number; // e.g. 50-150 portions
  foodCategory: 'VEGETARIAN_SATVIK' | 'TRADITIONAL_NEPALI_FEAST' | 'BUFFET_VARIETY' | 'SWEETS_MITHAI';
  eventEndTime: string;
  safeWindowHours: number; // typically 2-3 hours
  status: 'PENDING_CONSENT' | 'CONSENT_GRANTED' | 'SCHEDULED_FOR_RESCUE' | 'DISPATCHED' | 'SAFELY_SERVED' | 'CONSENT_WITHDRAWN';
  temperatureAndSafetyChecked: boolean;
  cleanStorageBoxesSuppliedByUtsavo: boolean;
  recipientStoryNotes?: string;
  beneficiariesFedCount?: number;
  acknowledgementReceiptId?: string;
  createdAt: string;
}

// -------------------------------------------------------------
// GLOBAL & DYNAMIC CANCELLATION POLICY + VENDOR REFERRAL SYSTEM
// -------------------------------------------------------------
export type CancellationStakeholderRole =
  | 'CLIENT'
  | 'VENUE_VENDOR'
  | 'CULTURAL_ARTIST'
  | 'EVENT_PLANNER'
  | 'EVENT_STAFF_POOL';

export type CancellationPolicyPreset =
  | 'FLEXIBLE'
  | 'MODERATE_STANDARD'
  | 'STRICT_PEAK_MUHURAT'
  | 'CUSTOM';

export type ReferralFeeModel =
  | 'COURTESY_ZERO_FEE'
  | 'B2B_COMMISSION_5_PERCENT'
  | 'B2B_COMMISSION_10_PERCENT';

export interface CancellationTier {
  id: string;
  label: string;
  minDaysBefore: number;
  maxDaysBefore?: number;
  refundPercent: number;
  rescheduleCreditPercent: number;
  retainedFeePercent: number;
  notes: string;
}

export interface PastDeadlineRule {
  forfeitPercentAfterDeadline: number;          // e.g. 100% after cutoff/event time passes
  claimRemainingBalanceOnNoShow: boolean;        // Whether unpaid balance is due on client no-show
  allowEmergencyMedicalReviewHours: number;      // e.g. 48-hour post-event documentation window
  goodwillCreditCapPercent: number;              // e.g. 0-25% future off-season credit on verified medical emergency
  staffReportingPayPercent: number;              // e.g. 50-100% shift pay protected for pool staff on late/past cancel
  vendorNoShowPenaltyCreditPercent: number;      // e.g. 15% emergency replacement credit on vendor default
  evidenceLockRequired: boolean;                 // Locks check-in, kitchen prep & timestamps for dispute audit
}

export interface ReferralHandoffConfig {
  allowsPartnerReferral: boolean;                // Can cancelling vendor refer peer partners
  substitutionGuaranteeEnabled: boolean;         // Direct equal-or-better replacement option
  referralFeeModel: ReferralFeeModel;            // 0% courtesy vs 5% / 10% B2B finder fee
  clientMustApproveSubstitute: boolean;          // Required consent for creative/performance/venue changes
  escrowDirectTransferAllowed: boolean;          // Allow client to transfer existing escrow directly to replacement
  liabilityReleaseIncluded: boolean;             // Third-party referral liability disclaimer
}

export interface DynamicCancellationPolicy {
  vendorId: string;
  vendorName: string;
  stakeholderCategory: 'VENUE_VENDOR' | 'CULTURAL_ARTIST' | 'EVENT_PLANNER';
  preset: CancellationPolicyPreset;
  coolingOffHours: number;                       // e.g. 24-48h free cancellation if booked >14 days out
  retainerNonRefundablePercent: number;          // Administrative/Muhurat hold retainer %
  tiers: CancellationTier[];
  pastDeadlineRule: PastDeadlineRule;
  referralConfig: ReferralHandoffConfig;
  forceMajeureCreditMonths: number;              // e.g. 12 months credit validity (Muluki Civil Code Sec. 531)
  customSummaryText?: string;
  updatedAt: string;
}

export interface RecommendedReferralPartner {
  partnerId: string;
  partnerName: string;
  partnerType: 'VENUE_VENDOR' | 'CULTURAL_ARTIST' | 'EVENT_PLANNER';
  district: string;
  categoryOrCapacity: string;
  estimatedPriceNpr: number;
  priceDeltaNote: string;                        // e.g. "Price matched" / "NPR 25,000 lower (refund credited)"
  phone: string;
  rating: number;
}

export interface VendorReferralOffer {
  id: string;
  bookingId: string;
  bookingRef: string;
  eventDateBS: string;
  eventDateAD: string;
  clientName: string;
  cancellingVendorId: string;
  cancellingVendorName: string;
  stakeholderRole: CancellationStakeholderRole;
  handoffType: 'WARM_REFERRAL' | 'DIRECT_SUBSTITUTE_GUARANTEE';
  recommendedPartners: RecommendedReferralPartner[];
  referralFeeModel: ReferralFeeModel;
  reason: string;
  includeLiabilityRelease: boolean;
  clientDecision: 'PENDING' | 'ACCEPTED_PARTNER' | 'DECLINED_REFUND_ONLY';
  acceptedPartnerId?: string;
  acceptedPartnerName?: string;
  escrowAction: 'HELD_FOR_TRANSFER' | 'TRANSFERRED_TO_PARTNER' | 'FULL_REFUND_ISSUED';
  escrowAmountNpr: number;
  createdAt: string;
  resolvedAt?: string;
}

export interface CancellationResolutionRecord {
  id: string;
  bookingId: string;
  bookingRef: string;
  venueOrPartnerName: string;
  initiatedByRole: CancellationStakeholderRole;
  reason: string;
  isPastDeadline: boolean;
  isForceMajeure: boolean;
  totalAmountNpr: number;
  depositPaidNpr: number;
  refundIssuedNpr: number;
  rescheduleCreditNpr: number;
  retainedFeeNpr: number;
  staffReportingPayNpr: number;
  referralOfferId?: string;
  legalBasisSummary: string;
  resolvedAt: string;
}

// -------------------------------------------------------------
// CLIENT STAR HOTEL VENUE CONCIERGE & OUTSIDE-NEPAL CELEBRATIONS
// -------------------------------------------------------------
export type StarHotelTier =
  | 'ANY_TOP_STAR'
  | '3_STAR'
  | '4_STAR'
  | '5_STAR_LUXURY'
  | '5_STAR_HERITAGE_RESORT'
  | '7_STAR_ULTRA_LUXURY';

export interface SourcedStarHotelProposal {
  id: string;
  hotelName: string;
  starCategory: string;
  districtOrCity: string;
  quotedPerPlateNprOrUsd: number;
  quotedHallRentalNprOrUsd: number;
  roomBlockRateNprOrUsd?: number;
  currency: 'NPR' | 'USD';
  availabilityNote: string;
  adminVerifiedAt: string;
  publishedVenueId?: string;
}

export interface StarHotelSourcingRequest {
  id: string;
  requestRef: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  starTier: StarHotelTier;
  preferredHotelNames: string;
  openToAdminRecommendations: boolean;
  locationScope: 'INSIDE_NEPAL' | 'OUTSIDE_NEPAL';
  districtOrCity: string;
  country: string;
  eventType: EventType;
  eventDateBS: string;
  eventDateAD: string;
  shift: ShiftTime;
  estimatedGuests: number;
  roomBlockNeeded: boolean;
  roomsCount: number;
  banquetSetting: 'INDOOR_BALLROOM' | 'POOLSIDE_LAWN' | 'ROOFTOP_TERRACE' | 'FULL_HOTEL_BUYOUT';
  allowExternalCatererOrDecor: boolean;
  targetBudgetCurrency: 'NPR' | 'USD';
  targetBudgetAmount: number;
  specialHospitalityNotes: string;
  status:
    | 'SUBMITTED_TO_ADMIN'
    | 'ADMIN_SCOUTING_HOTELS'
    | 'PROPOSAL_AND_RATES_SHARED'
    | 'HOTEL_SECURED'
    | 'PUBLISHED_TO_MARKETPLACE';
  adminAssignedCoordinator?: string;
  adminWorkNotes?: string;
  sourcedHotelProposals?: SourcedStarHotelProposal[];
  createdAt: string;
  updatedAt: string;
}

export type GlobalDestinationArchetype =
  | 'FIVE_STAR_LUXURY_RESORT'
  | 'ROYAL_PALACE_HAVELI'
  | 'BEACHFRONT_BUYOUT'
  | 'EUROPEAN_CHATEAU_VILLA'
  | 'PRIVATE_ISLAND_OVERWATER'
  | 'ULTRA_LUXURY_CITY_HOTEL';

export interface OutsideNepalDestinationRequest {
  id: string;
  requestRef: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  originCities: string;
  guestPassportNationalities: string;
  needGroupVisaConcierge: boolean;
  targetCountry: string;
  targetCityOrRegion: string;
  celebrationType: EventType | 'DESTINATION_WEDDING' | 'ANNIVERSARY_RENEWAL';
  celebrationDaysCount: number;
  preferredDateWindowAD: string;
  auspiciousMuhuratReferenceBS?: string;
  estimatedGuests: number;
  eldersAndKidsAccessibilityNotes: string;
  accommodationArchetype: GlobalDestinationArchetype;
  roomBlockCount: number;
  ceremonialRitualsIncluded: string[];
  culturalBridgeNeeds: {
    flyPancheBajaOrFolkTroupe: boolean;
    shipPujaSamagriAndAttire: boolean;
    bilingualVedicOrBuddhistPriest: boolean;
    liveBroadcastBackToNepal: boolean;
  };
  culinaryDesign: {
    dietaryProfiles: string[];
    flyNepaliMaharajChef: boolean;
    signatureCounters: string;
    beverageStyle: string;
  };
  memorableSignatureExperiences: string[];
  loveStoryOrMilestoneTheme: string;
  aestheticColorPalette: string;
  currency: 'USD' | 'EUR' | 'GBP' | 'AED' | 'AUD' | 'INR' | 'NPR';
  budgetAmount: number;
  specialDreamsAndNotes: string;
  aiConciergeBlueprint?: string;
  status:
    | 'DOSSIER_GATHERED'
    | 'PARTNER_HOTEL_SCOUTING'
    | 'MEMORABLE_PROPOSAL_READY'
    | 'ARRANGEMENTS_CONFIRMED';
  adminCoordinatorNotes?: string;
  arrangedDeliverables?: string[];
  createdAt: string;
  updatedAt: string;
}

export type FavoriteVenueAlertKind = 'PANCHANGA_DATE_OPEN' | 'LAST_MINUTE_CANCELLATION';

export type SseStreamStatus = 'CONNECTING' | 'CONNECTED' | 'RECONNECTING';

export interface FavoriteVenueAlert {
  id: string;
  venueId: string;
  venueName: string;
  district: string;
  locality: string;
  alertKind: FavoriteVenueAlertKind;
  title: string;
  message: string;
  dateBS: string;
  dateAD: string;
  shift: ShiftTime;
  hallName?: string;
  tithi?: string;
  nakshatra?: string;
  auspiciousTime?: string;
  discountOrIncentiveNote?: string;
  sourceBookingRef?: string;
  createdAt: string;
  isRead: boolean;
}

// -------------------------------------------------------------
// UTSAVO FULL-SERVICE MANAGED EVENT CONCIERGE (END-TO-END EVENTS)
// -------------------------------------------------------------
export type VendorFunctionKey =
  | 'VENUE_AND_HALL'
  | 'CATERING_AND_BEVERAGE'
  | 'CULTURAL_ARTISTS_MUSIC'
  | 'VEDIC_PUROHIT_RITUALS'
  | 'PHOTOGRAPHY_CINEMA_DRONE'
  | 'DECOR_MANDAP_FLORAL'
  | 'BRIDAL_GROOM_GLAM_ATTIRE'
  | 'SOUND_LIGHTING_AV_STAGE'
  | 'EVENT_STAFF_HOSPITALITY'
  | 'LOGISTICS_TRANSFERS_STAYS'
  | 'DIGITAL_NIMANTRANA_RSVP'
  | 'ANNAPURNA_SUSTAINABILITY_RESCUE';

export type VendorFunctionMode =
  | 'UTSAVO_FULL_MANAGE'
  | 'CO_SELECT_MARKETPLACE'
  | 'CLIENT_HAS_OWN_VENDOR'
  | 'NOT_NEEDED';

export type VendorServiceTier = 'ESSENTIAL' | 'PREMIUM' | 'ROYAL_LUXURY' | 'CUSTOM';

export interface ManagedVendorFunctionSpec {
  key: VendorFunctionKey;
  label: string;
  nepaliLabel: string;
  categoryGroup: 'CORE_HOSPITALITY' | 'CEREMONIAL_TALENT' | 'PRODUCTION_OPS' | 'DIGITAL_AND_CARE';
  isEnabled: boolean;
  mode: VendorFunctionMode;
  clientAuthorityLocked: boolean;
  suggestedBudgetSharePercent: number;
  allocatedBudgetAmount: number;
  selectedTier: VendorServiceTier;
  preferredVendorOrVenueName: string;
  specifications: string;
}

export interface CustomManagedVendorFunction {
  id: string;
  title: string;
  mode: VendorFunctionMode;
  budgetAmount: number;
  specifications: string;
}

export interface ManagedBlueprintTimelineSlot {
  id: string;
  timeSlot: string;
  activity: string;
  leadOwner: string;
  notes: string;
  included: boolean;
}

export interface ManagedBlueprintChecklistItem {
  id: string;
  category: 'PERMITS_CURFEW' | 'WEATHER_SAFETY' | 'VENDOR_HANDOFF' | 'GUEST_CARE';
  item: string;
  completed: boolean;
}

export interface ManagedEventBlueprint {
  executiveSummary: string;
  panchangaAndTimingAdvice: string;
  recommendedRunOfShow: ManagedBlueprintTimelineSlot[];
  vendorCoordinationPlaybook: string[];
  globalRiskAndPermitsChecklist: ManagedBlueprintChecklistItem[];
  webSources: Array<{ title: string; uri: string }>;
  generatedWith: string;
  generatedAt: string;
}

export interface ManagedCoordinationMessage {
  id: string;
  senderRole: 'CLIENT' | 'UTSAVO_TEAM';
  senderName: string;
  channel: 'PORTAL_CHAT' | 'WHATSAPP_BRIDGE' | 'CALLBACK_REQUEST';
  text: string;
  timestamp: string;
}

export interface ManagedEventRequest {
  id: string;
  requestRef: string;
  wantsUtsavoFullManagement: boolean;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  preferredContactChannel: 'PORTAL_AND_WHATSAPP' | 'PHONE_CALL' | 'VIBER' | 'EMAIL';
  preferredCallbackWindow: string;

  // Step 1: Time, Date, Pax, Budget & Scope
  eventTitle: string;
  eventType: EventType | 'DESTINATION_WEDDING' | 'ANNIVERSARY_RENEWAL';
  eventScope: 'INSIDE_NEPAL' | 'OUTSIDE_NEPAL';
  province: string;
  district: string;
  cityOrLocality: string;
  country: string;
  eventDateBS: string;
  eventDateAD: string;
  isDateFlexible: boolean;
  muhuratPreference: string;
  shift: ShiftTime;
  startTime: string;
  endTime: string;
  multiDayCount: number;
  totalPax: number;
  paxBreakdown: {
    adults: number;
    eldersRequiringAccess: number;
    children: number;
    vipHeads: number;
    outstationGuestsNeedingRooms: number;
  };
  budgetCurrency: 'NPR' | 'USD' | 'EUR' | 'GBP' | 'AUD' | 'INR';
  totalBudget: number;
  budgetFlexibility: 'STRICT_CEILING' | 'FLEXIBLE_15_PERCENT' | 'VALUE_OPTIMIZED';
  venueSettingPreference:
    | 'INDOOR_BANQUET'
    | 'GARDEN_LAWN'
    | 'STAR_HOTEL'
    | 'HERITAGE_PALACE'
    | 'DESTINATION_RESORT'
    | 'HYBRID_INDOOR_OUTDOOR';

  // Step 2: Mandatory Vendor Functions Capture (Full Client Authority)
  vendorFunctions: ManagedVendorFunctionSpec[];
  customVendorFunctions: CustomManagedVendorFunction[];

  // Step 3: Globally Sourced Production & Guest Care Parameters
  globalStandards: {
    weatherBackupContingency: 'INDOOR_BACKUP_HALL' | 'WATERPROOF_MARQUEE' | 'FLEXIBLE_SHIFT' | 'NONE';
    accessibilityEldersKidsPlan: string;
    permitsAndCurfewCompliance: boolean;
    powerBackupAndSafetySpecs: string;
    vipProtocolAndWelcomeKits: string;
    ecoZeroWastePreference: boolean;
    hybridLivestreamNeeds: boolean;
    culinaryStyles: string[];
    dietarySeparations: string[];
    barPolicy: 'NON_ALCOHOLIC' | 'SIGNATURE_COCKTAILS' | 'OPEN_PREMIUM_BAR' | 'BYOB_CORKAGE';
    themeAndColorPalette: string;
    specialDreamsAndNonNegotiables: string;
  };

  // Step 4: Smart Suggestive Blueprint (Client Editable)
  blueprint: ManagedEventBlueprint;

  // Step 5: Direct UTSAVO Team Coordination & Lifecycle
  status:
    | 'DRAFT_DISCOVERY'
    | 'BRIEF_SUBMITTED'
    | 'BLUEPRINT_REVIEW'
    | 'VENDOR_SOURCING_ACTIVE'
    | 'COORDINATION_LOCKED'
    | 'EXECUTION_READY';
  assignedCoordinatorName: string;
  assignedCoordinatorPhone: string;
  coordinationMessages: ManagedCoordinationMessage[];
  teamActionUpdates: string[];
  createdAt: string;
  updatedAt: string;
}

