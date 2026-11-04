/**
 * UTSAVO - Core Types & Domain Models
 * Nepal's Smart Celebration Marketplace
 */

export type UserRole = 
  | 'CUSTOMER' 
  | 'VENUE_OWNER' 
  | 'VENUE_MANAGER' 
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
