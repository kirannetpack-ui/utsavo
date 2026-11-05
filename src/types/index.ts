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
  dateBS: string;         // e.g. "2081 Mangsir 14"
  dateAD: string;         // e.g. "2024-11-29"
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
  promoCode: string;             // e.g. "UTSAVO15", "VIVAHA2081"
  validUntilBS: string;          // e.g. "2081 Falgun 30"
  validUntilAD?: string;         // e.g. "2025-03-14"
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
  bookingRef: string; // e.g. "UTS-2081-9842"
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
// CULTURAL VENDOR MARKETPLACE TYPES
// -------------------------------------------------------------
export type CulturalVendorCategory = 
  | 'PANCHE_NAUMATI_BAJA'      // पञ्चे बाजा तथा नौमती बाजा
  | 'NEWARI_DHIME_BAJA'        // नेवारी धिमे तथा बाँसुरी बाजा
  | 'VEDIC_PUROHIT_ACHARYA'    // वैदिक पण्डित तथा पुरोहित (नेपाली/English)
  | 'PHOTOGRAPHY_CINEMATOGRAPHY' // फोटोग्राफी तथा ड्रोन सिनेमाटोग्राफी
  | 'BRIDAL_MAKEUP_MEHENDI'    // ब्राइडल मेकअप तथा मेहन्दी आर्ट
  | 'DECOR_MANDAP_ARTIST'      // मण्डप तथा स्टेज सजावट
  | 'TRADITIONAL_ATTIRE_JEWELRY'; // दौरा सुरुवाल, ढाका टोपी, गुन्यु चोलो

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
  contractRef: string; // e.g. "UTS-KRA-2081-0419"
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
