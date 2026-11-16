/**
 * UTSAVO - Marketplace State & Persistence Context
 * Central engine governing venues, negotiations, bookings, agreements, and role switching
 */

import React, { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Booking,
  EventOrganizer,
  EventType,
  NegotiationThread,
  OfferVersion,
  UserProfile,
  UserRole,
  Venue,
  VerifiedReview,
  CustomVendorCategoryProposal,
  CulturalVendor,
  DestinationHotelProperty,
  DestinationVendorService,
  EventStaffProfile,
  StaffReviewComment,
  NepalGovtDirectiveItem,
  StaffCustomRoleProposal,
  SocialCelebrationPost,
  UserPanchangaPreferences,
  AuspiciousPushAlert,
  ExcessFoodRescuePledge,
  DynamicCancellationPolicy,
  VendorReferralOffer,
  CancellationResolutionRecord,
  CancellationStakeholderRole,
  RecommendedReferralPartner,
  ReferralFeeModel,
  StarHotelSourcingRequest,
  SourcedStarHotelProposal,
  OutsideNepalDestinationRequest,
  FavoriteVenueAlert,
  FavoriteVenueAlertKind,
  SseStreamStatus,
  ManagedEventRequest,
  ManagedCoordinationMessage,
} from '../types';
import {
  SEED_VENDOR_CANCELLATION_POLICIES,
  SEED_VENDOR_REFERRAL_OFFERS,
  SEED_CANCELLATION_RECORDS,
  createDynamicPolicyFromPreset,
  calculateCancellationOutcome,
} from '../data/cancellationPoliciesData';
import {
  SEED_STAR_HOTEL_REQUESTS,
  SEED_OUTSIDE_NEPAL_REQUESTS,
} from '../data/outsideNepalDestinations';
import { SEED_MANAGED_EVENT_REQUESTS } from '../data/managedEventTemplates';
import { STANDARD_CATERING_PACKAGES, MASTER_MENU_ITEMS } from '../data/menuCatalog';
import { doc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase/config';
import {
  saveUserWorkspacePreferences,
  subscribeUserWorkspacePreferences,
  syncAuthenticatedUserProfile,
} from '../firebase/userWorkspaceSync';
import { PANCHANGA_AUSPICIOUS_MUHURATS } from '../data/panchangaCalendar';
import { SEED_VENUES } from '../data/venuesData';
import { SEED_BOOKINGS, SEED_NEGOTIATIONS, SEED_REVIEWS } from '../data/seedMarketplaceState';
import { SEED_EVENT_ORGANIZERS } from '../data/organizersData';
import { initialCulturalVendors } from '../data/culturalVendorsData';
import { SEED_DESTINATION_HOTELS, SEED_DESTINATION_VENDOR_SERVICES } from '../data/destinationVendorsData';
import { SEED_EVENT_STAFF } from '../data/eventStaffData';
import { SEED_SOCIAL_CELEBRATION_POSTS } from '../data/socialCelebrationData';
import { SEED_FOOD_RESCUE_PLEDGES } from '../data/socialCauseFoodData';
import { sanitizeText, sanitizeUrl } from '../utils/security';
import {
  SEED_NEPAL_GOVT_DIRECTIVES,
  NEPAL_GOVT_STATUTORY_WAGES,
  NEPAL_GOVT_VENUE_RULES,
} from '../data/nepalGovtRegulations';

export interface SearchFilterState {
  searchQuery: string;
  destination: string;
  province: string;
  district: string;
  locality: string;
  eventType: EventType | 'ALL';
  dateBS: string;
  dateAD: string;
  guestCount: number;
  minCapacity: number;
  maxCapacity: number;
  minPerPlateBudget: number;
  maxPerPlateBudget: number;
  maxHallRentalNpr: number;
  includeAdjacentDistricts: boolean;
  allowsOutsideOrganizersOnly?: boolean;
  selectedAmenities: string[];
  sortBy: 'RECOMMENDED' | 'PRICE_ASC' | 'CAPACITY_DESC' | 'RATING_DESC';
}

interface MarketplaceContextType {
  currentUser: UserProfile;
  setCurrentRole: (role: UserRole) => void;
  venues: Venue[];
  organizers: EventOrganizer[];
  negotiations: NegotiationThread[];
  bookings: Booking[];
  reviews: VerifiedReview[];
  filters: SearchFilterState;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilterState>>;
  resetFilters: () => void;
  selectedVenue: Venue | null;
  setSelectedVenue: (venue: Venue | null) => void;
  selectedOrganizer: EventOrganizer | null;
  setSelectedOrganizer: (organizer: EventOrganizer | null) => void;
  
  // Event Organizers Management
  saveOrganizer: (organizer: EventOrganizer) => void;
  openOrganizerRegistration: (organizer?: EventOrganizer | null) => void;
  editingOrganizer: EventOrganizer | null;
  
  // Negotiation Actions
  createNegotiationOffer: (params: {
    venueId: string;
    venueName: string;
    eventType: EventType;
    dateBS: string;
    dateAD: string;
    shift: any;
    hallId: string;
    guestCount: number;
    proposedPerPlateNpr: number;
    hallRentalNpr: number;
    includedAmenities: string[];
    specialRequests: string;
    subtotalNpr: number;
    serviceChargeNpr: number;
    vatNpr: number;
    totalNpr: number;
  }) => string; // returns thread id
  submitCounterOffer: (threadId: string, offer: Partial<OfferVersion>, message?: string) => void;
  acceptOffer: (threadId: string) => void;
  rejectOffer: (threadId: string) => void;

  // Booking & Agreement Actions
  createBookingFromOffer: (threadId: string) => Booking;
  signAgreement: (bookingId: string) => void;
  processPayment: (params: {
    bookingId: string;
    paymentMethod: 'ESEWA' | 'KHALTI' | 'FONEPAY' | 'BANK_TRANSFER';
    amountNpr: number;
    transactionId: string;
  }) => Promise<boolean>;

  // Venue Management & Onboarding Actions
  updateVenueListing: (updatedVenue: Venue) => void;
  saveVenueListing: (venue: Venue) => void;
  openVenueOnboarding: (venue?: Venue | null) => void;
  editingVenue: Venue | null;
  createWalkInBooking: (booking: Partial<Booking>) => void;
  verifyVenueStatus: (venueId: string, newStatus: any) => void;

  // Reviews
  addVerifiedReview: (review: Omit<VerifiedReview, 'id' | 'createdAt'>) => void;

  // Modals & Drawers
  activeModal: 'NONE' | 'SMART_PLANNER' | 'PANCHANGA_CALENDAR' | 'NEGOTIATION' | 'AGREEMENT' | 'PAYMENT' | 'REVIEW' | 'VENUE_ONBOARDING' | 'EVENT_ORGANIZER_REGISTER' | 'STAR_HOTEL_REQUEST';
  setActiveModal: (modal: 'NONE' | 'SMART_PLANNER' | 'PANCHANGA_CALENDAR' | 'NEGOTIATION' | 'AGREEMENT' | 'PAYMENT' | 'REVIEW' | 'VENUE_ONBOARDING' | 'EVENT_ORGANIZER_REGISTER' | 'STAR_HOTEL_REQUEST') => void;
  activeNegotiationId: string | null;
  setActiveNegotiationId: (id: string | null) => void;
  activeBookingId: string | null;
  setActiveBookingId: (id: string | null) => void;

  // Saved Venues & Event Vendors Bookmarking
  savedVenueIds: string[];
  savedVendorIds: string[];
  toggleSaveVenue: (venueId: string) => void;
  isVenueSaved: (venueId: string) => boolean;
  toggleSaveVendor: (vendorId: string) => void;
  isVendorSaved: (vendorId: string) => boolean;
  removeSavedVenue: (venueId: string) => void;
  removeSavedVendor: (vendorId: string) => void;
  customerDashboardTab: 'BOOKINGS' | 'NEGOTIATIONS' | 'BUDGET' | 'SAVED' | 'ALERTS' | 'FAVORITE_ALERTS' | 'MANAGED_EVENTS';
  setCustomerDashboardTab: (tab: 'BOOKINGS' | 'NEGOTIATIONS' | 'BUDGET' | 'SAVED' | 'ALERTS' | 'FAVORITE_ALERTS' | 'MANAGED_EVENTS') => void;

  // Cultural Artists & Custom Category Proposals
  culturalVendors: CulturalVendor[];
  addCulturalVendor: (vendor: CulturalVendor) => void;
  customCategories: CustomVendorCategoryProposal[];
  proposeCustomCategory: (proposal: Omit<CustomVendorCategoryProposal, 'id' | 'createdAt' | 'status'>) => string;
  reviewCustomCategory: (categoryId: string, decision: 'PERMANENT' | 'TEMPORARY' | 'REJECTED', adminNotes?: string) => void;

  // Destination Nepal Luxury Hotels & Vendor Services
  destinationHotels: DestinationHotelProperty[];
  destinationVendors: DestinationVendorService[];
  addDestinationHotel: (hotel: DestinationHotelProperty) => void;
  addDestinationVendorService: (service: DestinationVendorService) => void;

  // Event Staff & Gig Talent Pool (उत्सव जनशक्ति तथा गिग कार्यथलो)
  eventStaffPool: EventStaffProfile[];
  addEventStaffProfile: (profile: Omit<EventStaffProfile, 'id' | 'createdAt' | 'rating' | 'totalShiftsCompleted' | 'reviews'>) => EventStaffProfile;
  toggleStaffAvailability: (staffId: string) => void;
  addStaffReview: (staffId: string, review: Omit<StaffReviewComment, 'id' | 'createdAt'>) => void;
  staffCustomRoles: StaffCustomRoleProposal[];
  proposeStaffCustomRole: (proposal: Omit<StaffCustomRoleProposal, 'id' | 'createdAt' | 'status'>) => string;
  reviewStaffCustomRole: (roleId: string, decision: 'PERMANENT' | 'TEMPORARY' | 'REJECTED', adminNotes?: string) => void;

  // Nepal Government Statutory Regulatory Intelligence
  govtDirectives: NepalGovtDirectiveItem[];
  applyGovtDirective: (directiveId: string, updatedValue?: string) => void;
  dismissGovtDirective: (directiveId: string) => void;
  statutoryRules: {
    minDailyShiftWageNpr: number;
    minHourlyWageNpr: number;
    minMonthlyWageNpr: number;
    soundCurfewTime: string;
    vatPercent: number;
    tdsPercent: number;
  };
  updateStatutoryRules: (rules: Partial<{
    minDailyShiftWageNpr: number;
    minHourlyWageNpr: number;
    minMonthlyWageNpr: number;
    soundCurfewTime: string;
    vatPercent: number;
    tdsPercent: number;
  }>) => void;

  // Social Celebration Wall (वास्तविक उत्सव अनुभव पर्खाल)
  socialPosts: SocialCelebrationPost[];
  addSocialPost: (post: Omit<SocialCelebrationPost, 'id' | 'createdAt' | 'likesCount'>) => SocialCelebrationPost;
  likeSocialPost: (postId: string) => void;

  // Maximum Information at Minimum Touchable - 1-Tap Quick Peek
  quickPeekVenueId: string | null;
  setQuickPeekVenueId: (venueId: string | null) => void;

  // Panchanga Auspicious Push Notification System (Simulated Local State)
  panchangaPreferences: UserPanchangaPreferences;
  updatePanchangaPreferences: (prefs: Partial<UserPanchangaPreferences>) => void;
  pushAlerts: AuspiciousPushAlert[];
  activePushToast: AuspiciousPushAlert | null;
  dismissPushToast: () => void;
  markAlertAsRead: (alertId: string) => void;
  clearAllAlerts: () => void;
  simulatePushAlert: (specificMuhuratId?: string) => void;
  unreadAlertsCount: number;

  // Real-Time Server-Sent Events (SSE) Favorite Venue Availability & Cancellation Alerts
  favoriteVenueAlerts: FavoriteVenueAlert[];
  unreadFavoriteVenueAlertsCount: number;
  sseConnectionStatus: SseStreamStatus;
  isScanningFavoriteVenues: boolean;
  lastFavoriteScanMessage: string | null;
  activeFavoriteVenueToast: FavoriteVenueAlert | null;
  dismissFavoriteVenueToast: () => void;
  markFavoriteVenueAlertRead: (alertId: string | 'ALL') => Promise<void>;
  scanFavoriteVenueAvailability: () => Promise<number>;
  publishFavoriteVenueAlert: (params: {
    venueId: string;
    venueName: string;
    district?: string;
    locality?: string;
    alertKind: FavoriteVenueAlertKind;
    title?: string;
    message?: string;
    dateBS: string;
    dateAD?: string;
    shift?: any;
    hallName?: string;
    tithi?: string;
    nakshatra?: string;
    auspiciousTime?: string;
    discountOrIncentiveNote?: string;
    sourceBookingRef?: string;
  }) => Promise<FavoriteVenueAlert | null>;

  // Social Cause: Annapurna Surplus Feast Food Rescue (Strict Voluntary Client Consent)
  foodRescuePledges: ExcessFoodRescuePledge[];
  addFoodRescuePledge: (pledge: Omit<ExcessFoodRescuePledge, 'id' | 'createdAt' | 'temperatureAndSafetyChecked' | 'cleanStorageBoxesSuppliedByUtsavo'>) => ExcessFoodRescuePledge;
  updateFoodRescueConsent: (pledgeId: string, consentGiven: boolean, declaration?: string) => void;
  updateFoodRescueStatus: (pledgeId: string, status: ExcessFoodRescuePledge['status'], notes?: string, beneficiariesFed?: number) => void;

  // Dynamic Cancellation Policies, Past-Deadline Resolution & Vendor Partner Referrals
  vendorPolicies: Record<string, DynamicCancellationPolicy>;
  getVendorCancellationPolicy: (
    vendorId: string,
    vendorName?: string,
    stakeholderCategory?: 'VENUE_VENDOR' | 'CULTURAL_ARTIST' | 'EVENT_PLANNER'
  ) => DynamicCancellationPolicy;
  updateVendorCancellationPolicy: (policy: DynamicCancellationPolicy) => void;
  referralOffers: VendorReferralOffer[];
  createVendorReferralOffer: (params: {
    bookingId: string;
    cancellingVendorId: string;
    cancellingVendorName: string;
    stakeholderRole: CancellationStakeholderRole;
    handoffType: 'WARM_REFERRAL' | 'DIRECT_SUBSTITUTE_GUARANTEE';
    recommendedPartners: RecommendedReferralPartner[];
    referralFeeModel: ReferralFeeModel;
    reason: string;
    includeLiabilityRelease: boolean;
  }) => VendorReferralOffer;
  respondToReferralOffer: (
    offerId: string,
    decision: 'ACCEPTED_PARTNER' | 'DECLINED_REFUND_ONLY',
    acceptedPartnerId?: string
  ) => void;
  cancellationRecords: CancellationResolutionRecord[];
  cancelBookingWithPolicy: (params: {
    bookingId: string;
    initiatedByRole: CancellationStakeholderRole;
    daysBeforeEvent: number;
    isPastDeadline: boolean;
    isForceMajeure: boolean;
    hasEmergencyMedicalProof: boolean;
    bookedPoolStaffCount?: number;
    reason: string;
  }) => CancellationResolutionRecord | null;

  // Star Hotel Concierge Sourcing & Outside-Nepal Global Celebrations
  starHotelRequests: StarHotelSourcingRequest[];
  submitStarHotelRequest: (
    req: Omit<StarHotelSourcingRequest, 'id' | 'requestRef' | 'status' | 'createdAt' | 'updatedAt'>
  ) => StarHotelSourcingRequest;
  updateStarHotelRequestByAdmin: (
    requestId: string,
    updates: {
      status?: StarHotelSourcingRequest['status'];
      adminWorkNotes?: string;
      newProposal?: Omit<SourcedStarHotelProposal, 'id' | 'adminVerifiedAt'>;
    }
  ) => void;
  publishStarHotelAsVenue: (requestId: string, proposal: SourcedStarHotelProposal) => Venue | null;

  outsideNepalRequests: OutsideNepalDestinationRequest[];
  submitOutsideNepalRequest: (
    req: Omit<OutsideNepalDestinationRequest, 'id' | 'requestRef' | 'status' | 'createdAt' | 'updatedAt'>
  ) => OutsideNepalDestinationRequest;
  updateOutsideNepalRequestByAdmin: (
    requestId: string,
    updates: {
      status?: OutsideNepalDestinationRequest['status'];
      adminCoordinatorNotes?: string;
      newDeliverable?: string;
    }
  ) => void;

  // UTSAVO Full-Service Managed Events (Client-Authoritative & Team Coordinated)
  managedEventRequests: ManagedEventRequest[];
  submitManagedEventRequest: (
    req: Omit<
      ManagedEventRequest,
      'id' | 'requestRef' | 'createdAt' | 'updatedAt' | 'teamActionUpdates' | 'coordinationMessages'
    > & { initialMessage?: string }
  ) => ManagedEventRequest;
  updateManagedEventByClient: (requestId: string, updates: Partial<ManagedEventRequest>) => void;
  sendManagedEventMessage: (
    requestId: string,
    params: {
      senderRole: 'CLIENT' | 'UTSAVO_TEAM';
      senderName: string;
      channel?: ManagedCoordinationMessage['channel'];
      text: string;
    }
  ) => void;
  updateManagedEventByAdmin: (
    requestId: string,
    updates: {
      status?: ManagedEventRequest['status'];
      assignedCoordinatorName?: string;
      assignedCoordinatorPhone?: string;
      newTeamActionUpdate?: string;
    }
  ) => void;
}

export const DEFAULT_PANCHANGA_PREFS: UserPanchangaPreferences = {
  enabled: true,
  eventTypes: ['WEDDING', 'BRATABANDHA', 'PASNI'],
  preferredMonthsBS: ['Mangsir', 'Magh', 'Falgun', 'Baishakh'],
  leadTimeDays: 30,
  pushSoundEnabled: true,
  autoCheckOnLaunch: true,
  minUrgencyLevel: 'ALL',
};

const DEFAULT_USER: UserProfile = {
  id: 'usr-current',
  name: 'Kiran Sharma',
  email: 'kiran.sharma@example.com',
  phone: '+977-9851098421',
  role: 'CUSTOMER',
  avatar: '',
  assignedVenueId: 'venue-regal-pavilion-ktm',
  panchangaPreferences: DEFAULT_PANCHANGA_PREFS,
};

const DEFAULT_FILTERS: SearchFilterState = {
  searchQuery: '',
  destination: '',
  province: '',
  district: '',
  locality: '',
  eventType: 'ALL',
  dateBS: '',
  dateAD: '',
  guestCount: 350,
  minCapacity: 50,
  maxCapacity: 1500,
  minPerPlateBudget: 800,
  maxPerPlateBudget: 4000,
  maxHallRentalNpr: 250000,
  includeAdjacentDistricts: true,
  selectedAmenities: [],
  sortBy: 'RECOMMENDED',
};

const MarketplaceContext = createContext<MarketplaceContextType | null>(null);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEFAULT_USER);
  const [venues, setVenues] = useState<Venue[]>(SEED_VENUES);
  const [organizers, setOrganizers] = useState<EventOrganizer[]>(SEED_EVENT_ORGANIZERS);
  const [selectedOrganizer, setSelectedOrganizer] = useState<EventOrganizer | null>(null);
  const [editingOrganizer, setEditingOrganizer] = useState<EventOrganizer | null>(null);
  const [negotiations, setNegotiations] = useState<NegotiationThread[]>(SEED_NEGOTIATIONS);
  const [bookings, setBookings] = useState<Booking[]>(SEED_BOOKINGS);
  const [reviews, setReviews] = useState<VerifiedReview[]>(SEED_REVIEWS);
  const [filters, setFilters] = useState<SearchFilterState>(DEFAULT_FILTERS);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);

  const [activeModal, setActiveModal] = useState<'NONE' | 'SMART_PLANNER' | 'PANCHANGA_CALENDAR' | 'NEGOTIATION' | 'AGREEMENT' | 'PAYMENT' | 'REVIEW' | 'VENUE_ONBOARDING' | 'EVENT_ORGANIZER_REGISTER' | 'STAR_HOTEL_REQUEST'>('NONE');
  const [activeNegotiationId, setActiveNegotiationId] = useState<string | null>(null);
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [customerDashboardTab, setCustomerDashboardTab] = useState<'BOOKINGS' | 'NEGOTIATIONS' | 'BUDGET' | 'SAVED' | 'ALERTS' | 'FAVORITE_ALERTS' | 'MANAGED_EVENTS'>('BOOKINGS');

  // Star Hotel Concierge Requests & Outside-Nepal Global Celebrations (Persisted)
  const [starHotelRequests, setStarHotelRequests] = useState<StarHotelSourcingRequest[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('utsavo_star_hotel_requests');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to parse star hotel requests', e);
      }
    }
    return SEED_STAR_HOTEL_REQUESTS;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('utsavo_star_hotel_requests', JSON.stringify(starHotelRequests));
      } catch (e) {
        console.warn('Failed to save star hotel requests', e);
      }
    }
  }, [starHotelRequests]);

  const [outsideNepalRequests, setOutsideNepalRequests] = useState<OutsideNepalDestinationRequest[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('utsavo_outside_nepal_requests');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to parse outside Nepal requests', e);
      }
    }
    return SEED_OUTSIDE_NEPAL_REQUESTS;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('utsavo_outside_nepal_requests', JSON.stringify(outsideNepalRequests));
      } catch (e) {
        console.warn('Failed to save outside Nepal requests', e);
      }
    }
  }, [outsideNepalRequests]);

  // UTSAVO Full-Service Managed Events State (Persisted)
  const [managedEventRequests, setManagedEventRequests] = useState<ManagedEventRequest[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('utsavo_managed_event_requests');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to parse managed event requests', e);
      }
    }
    return SEED_MANAGED_EVENT_REQUESTS;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('utsavo_managed_event_requests', JSON.stringify(managedEventRequests));
      } catch (e) {
        console.warn('Failed to save managed event requests', e);
      }
    }
  }, [managedEventRequests]);

  // Bookmarking: Saved Venues & Event Vendors
  const [savedVenueIds, setSavedVenueIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('utsavo_saved_venues');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            return parsed.map((id) =>
              id === 'venue-heritage-garden-sanepa' ? 'venue-lalitpur-royal-palace' : id
            );
          }
        }
      } catch (e) {
        console.warn('Failed to parse saved venues from localStorage', e);
      }
    }
    return ['venue-regal-pavilion-ktm', 'venue-lalitpur-royal-palace', 'venue-pokhara-lakeside-resort'];
  });

  const [savedVendorIds, setSavedVendorIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('utsavo_saved_vendors');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to parse saved vendors from localStorage', e);
      }
    }
    return ['vendor-panche-01'];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('utsavo_saved_venues', JSON.stringify(savedVenueIds));
      } catch (e) {
        console.warn('Failed to save venues to localStorage', e);
      }
    }
  }, [savedVenueIds]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('utsavo_saved_vendors', JSON.stringify(savedVendorIds));
      } catch (e) {
        console.warn('Failed to save vendors to localStorage', e);
      }
    }
  }, [savedVendorIds]);

  const firestoreHydratedRef = useRef(false);
  const authenticatedUidRef = useRef<string | null>(null);

  useEffect(() => {
    let unsubPrefs: (() => void) | null = null;
    const unsubAuth = onAuthStateChanged(auth, (fbUser) => {
      if (unsubPrefs) {
        unsubPrefs();
        unsubPrefs = null;
      }
      if (!fbUser) {
        authenticatedUidRef.current = null;
        firestoreHydratedRef.current = false;
        return;
      }

      authenticatedUidRef.current = fbUser.uid;
      setCurrentUser((prev) => ({
        ...prev,
        id: fbUser.uid,
        email: fbUser.email || prev.email,
        name: fbUser.displayName ? `${fbUser.displayName}` : prev.name,
      }));

      syncAuthenticatedUserProfile(fbUser).catch((err) => {
        console.warn('User profile sync note:', err);
      });

      unsubPrefs = subscribeUserWorkspacePreferences(
        fbUser.uid,
        (remotePrefs) => {
          firestoreHydratedRef.current = true;
          if (remotePrefs) {
            if (Array.isArray(remotePrefs.savedVenueIds) && remotePrefs.savedVenueIds.length > 0) {
              setSavedVenueIds(remotePrefs.savedVenueIds);
            }
            if (Array.isArray(remotePrefs.savedVendorIds) && remotePrefs.savedVendorIds.length > 0) {
              setSavedVendorIds(remotePrefs.savedVendorIds);
            }
          } else {
            saveUserWorkspacePreferences(fbUser.uid, savedVenueIds, savedVendorIds).catch((err) =>
              console.warn('Initial workspace preference sync note:', err)
            );
          }
        },
        (err) => {
          console.warn('Workspace preference listener note:', err);
        }
      );
    });

    return () => {
      if (unsubPrefs) unsubPrefs();
      unsubAuth();
    };
  }, []);

  useEffect(() => {
    const uid = authenticatedUidRef.current;
    if (!uid || !auth.currentUser || !firestoreHydratedRef.current) return;
    saveUserWorkspacePreferences(uid, savedVenueIds, savedVendorIds).catch((err) =>
      console.warn('Workspace preference save note:', err)
    );
  }, [savedVenueIds, savedVendorIds]);

  const toggleSaveVenue = (venueId: string) => {
    setSavedVenueIds((prev) =>
      prev.includes(venueId) ? prev.filter((id) => id !== venueId) : [...prev, venueId]
    );
  };

  const isVenueSaved = (venueId: string) => savedVenueIds.includes(venueId);

  const removeSavedVenue = (venueId: string) => {
    setSavedVenueIds((prev) => prev.filter((id) => id !== venueId));
  };

  const toggleSaveVendor = (vendorId: string) => {
    setSavedVendorIds((prev) =>
      prev.includes(vendorId) ? prev.filter((id) => id !== vendorId) : [...prev, vendorId]
    );
  };

  const isVendorSaved = (vendorId: string) => savedVendorIds.includes(vendorId);

  const removeSavedVendor = (vendorId: string) => {
    setSavedVendorIds((prev) => prev.filter((id) => id !== vendorId));
  };

  // Cultural Vendors List (reactive & persisted)
  const [culturalVendors, setCulturalVendors] = useState<CulturalVendor[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('utsavo_cultural_vendors');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to load cultural vendors', e);
      }
    }
    return initialCulturalVendors;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('utsavo_cultural_vendors', JSON.stringify(culturalVendors));
      } catch (e) {
        console.warn('Failed to save cultural vendors', e);
      }
    }
  }, [culturalVendors]);

  const addCulturalVendor = (vendor: CulturalVendor) => {
    setCulturalVendors((prev) => [vendor, ...prev]);
  };

  // Custom Category Proposals (OTHER category workflow)
  const [customCategories, setCustomCategories] = useState<CustomVendorCategoryProposal[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('utsavo_custom_categories');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to load custom categories', e);
      }
    }
    return [
      {
        id: 'cat-prop-01',
        categoryKey: 'GHATU_MARUNI_DANCE',
        name: 'Gurung & Magar Traditional Ghatu & Maruni Troupes',
        nepaliName: 'घाटु तथा मारुनी परम्परागत सांस्कृतिक नृत्य',
        icon: '🎭',
        description: 'Ancestral Gurung and Magar cultural dance troupes for traditional wedding welcomes, janti receptions and felicitations.',
        proposedByVendorId: 'vendor-gandharva-01',
        proposedByVendorName: 'Gandharva & Pariyar Royal Ensemble',
        status: 'PENDING',
        createdAt: '2026-03-10',
      },
      {
        id: 'cat-prop-02',
        categoryKey: 'HELI_BARAT_CHARTER',
        name: 'Mountain Helicopter Barat & Aerial Transit',
        nepaliName: 'हेलिकप्टर जन्ती तथा माउन्टेन ट्रान्जिट',
        icon: '🚁',
        description: 'Scenic high-altitude helicopter transit for bride & groom arrivals and alpine photoshoot ceremonies.',
        proposedByVendorId: 'vendor-heli-01',
        proposedByVendorName: 'Himalayan Air Charters',
        status: 'PERMANENT',
        createdAt: '2026-02-14',
        reviewedAt: '2026-02-15',
      },
    ];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('utsavo_custom_categories', JSON.stringify(customCategories));
      } catch (e) {
        console.warn('Failed to save custom categories', e);
      }
    }
  }, [customCategories]);

  const proposeCustomCategory = (proposal: Omit<CustomVendorCategoryProposal, 'id' | 'createdAt' | 'status'>) => {
    const id = `cat-prop-${Date.now()}`;
    const newProposal: CustomVendorCategoryProposal = {
      ...proposal,
      id,
      status: 'PENDING',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCustomCategories((prev) => [newProposal, ...prev]);
    return id;
  };

  const reviewCustomCategory = (
    categoryId: string,
    decision: 'PERMANENT' | 'TEMPORARY' | 'REJECTED',
    adminNotes?: string
  ) => {
    setCustomCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            status: decision,
            reviewedAt: new Date().toISOString().split('T')[0],
            adminNotes: adminNotes || cat.adminNotes,
          };
        }
        return cat;
      })
    );

    // Also update any cultural vendors associated with this custom category
    setCulturalVendors((prev) =>
      prev.map((vendor) => {
        if (vendor.customCategoryName) {
          const target = customCategories.find((c) => c.id === categoryId);
          if (target && target.name.toLowerCase() === vendor.customCategoryName.toLowerCase()) {
            return {
              ...vendor,
              customCategoryStatus: decision,
            };
          }
        }
        return vendor;
      })
    );
  };

  // Destination Nepal Luxury Hotels & Resorts
  const [destinationHotels, setDestinationHotels] = useState<DestinationHotelProperty[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('utsavo_destination_hotels');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to load destination hotels', e);
      }
    }
    return SEED_DESTINATION_HOTELS;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('utsavo_destination_hotels', JSON.stringify(destinationHotels));
      } catch (e) {
        console.warn('Failed to save destination hotels', e);
      }
    }
  }, [destinationHotels]);

  const addDestinationHotel = (hotel: DestinationHotelProperty) => {
    setDestinationHotels((prev) => [hotel, ...prev]);
  };

  // Destination Nepal Vendor Services
  const [destinationVendors, setDestinationVendors] = useState<DestinationVendorService[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('utsavo_destination_vendors');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to load destination vendors', e);
      }
    }
    return SEED_DESTINATION_VENDOR_SERVICES;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('utsavo_destination_vendors', JSON.stringify(destinationVendors));
      } catch (e) {
        console.warn('Failed to save destination vendors', e);
      }
    }
  }, [destinationVendors]);

  const addDestinationVendorService = (service: DestinationVendorService) => {
    setDestinationVendors((prev) => [service, ...prev]);
  };

  // Event Staff & Gig Talent Pool (उत्सव जनशक्ति तथा गिग कार्यथलो)
  const [eventStaffPool, setEventStaffPool] = useState<EventStaffProfile[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('utsavo_event_staff_pool_v1');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to load event staff pool', e);
      }
    }
    return SEED_EVENT_STAFF;
  });

  // Nepal Government Statutory Rules & Current Enforced Parameters
  const [statutoryRules, setStatutoryRules] = useState<{
    minDailyShiftWageNpr: number;
    minHourlyWageNpr: number;
    minMonthlyWageNpr: number;
    soundCurfewTime: string;
    vatPercent: number;
    tdsPercent: number;
  }>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('utsavo_statutory_rules_v1');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to load statutory rules', e);
      }
    }
    return {
      minDailyShiftWageNpr: NEPAL_GOVT_STATUTORY_WAGES.DAILY_SHIFT_MIN_NPR,
      minHourlyWageNpr: NEPAL_GOVT_STATUTORY_WAGES.HOURLY_MIN_NPR,
      minMonthlyWageNpr: NEPAL_GOVT_STATUTORY_WAGES.MONTHLY_MIN_NPR,
      soundCurfewTime: NEPAL_GOVT_VENUE_RULES.DAO_SOUND_CURFEW_TIME,
      vatPercent: NEPAL_GOVT_VENUE_RULES.IRD_VAT_RATE_PERCENT,
      tdsPercent: NEPAL_GOVT_VENUE_RULES.IRD_TDS_RATE_PERCENT,
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('utsavo_statutory_rules_v1', JSON.stringify(statutoryRules));
      } catch (e) {
        console.warn('Failed to save statutory rules', e);
      }
    }
  }, [statutoryRules]);

  const updateStatutoryRules = (rules: Partial<typeof statutoryRules>) => {
    setStatutoryRules((prev) => ({ ...prev, ...rules }));
  };

  // Nepal Government Gazette & Legal Directives
  const [govtDirectives, setGovtDirectives] = useState<NepalGovtDirectiveItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('utsavo_govt_directives_v1');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to load govt directives', e);
      }
    }
    return SEED_NEPAL_GOVT_DIRECTIVES;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('utsavo_govt_directives_v1', JSON.stringify(govtDirectives));
      } catch (e) {
        console.warn('Failed to save govt directives', e);
      }
    }
  }, [govtDirectives]);

  const applyGovtDirective = (directiveId: string, updatedValue?: string) => {
    setGovtDirectives((prev) =>
      prev.map((d) => {
        if (d.id === directiveId) {
          return {
            ...d,
            status: 'ACTIVE_ENFORCED',
            currentEnforcedValue: updatedValue || d.proposedGazetteUpdate || d.currentEnforcedValue,
            proposedGazetteUpdate: undefined,
            lastScannedAt: new Date().toISOString(),
          };
        }
        return d;
      })
    );
  };

  const dismissGovtDirective = (directiveId: string) => {
    setGovtDirectives((prev) =>
      prev.map((d) => (d.id === directiveId ? { ...d, status: 'DISMISSED' } : d))
    );
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('utsavo_event_staff_pool_v1', JSON.stringify(eventStaffPool));
      } catch (e) {
        console.warn('Failed to save event staff pool', e);
      }
    }
  }, [eventStaffPool]);

  const addEventStaffProfile = (
    profile: Omit<EventStaffProfile, 'id' | 'createdAt' | 'rating' | 'totalShiftsCompleted' | 'reviews'>
  ): EventStaffProfile => {
    // If worker did not declare custom wage, default to official Nepal Government statutory minimum
    const hasCustomWage = typeof profile.expectedWageNpr === 'number' && profile.expectedWageNpr > 0;
    const defaultStatutoryWage =
      profile.wageType === 'MONTHLY'
        ? statutoryRules.minMonthlyWageNpr
        : profile.wageType === 'PER_HOUR'
        ? statutoryRules.minHourlyWageNpr
        : statutoryRules.minDailyShiftWageNpr;

    const finalWage = hasCustomWage ? profile.expectedWageNpr : defaultStatutoryWage;

    // Calculate Age & Child Labour Compliance Verification (Nepal Child Labour Prohibition Act 2056 & Children's Act 2075)
    let calculatedAge = profile.ageYears;
    if (profile.dateOfBirth) {
      const birthDate = new Date(profile.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      calculatedAge = age;
    }
    const isAdult = typeof calculatedAge === 'number' && calculatedAge >= 18;

    const newStaff: EventStaffProfile = {
      ...profile,
      dateOfBirth: profile.dateOfBirth,
      ageYears: calculatedAge,
      childLabourCompliantVerified: isAdult,
      ageVerificationBadge: isAdult
        ? `Verified Legal Adult (${calculatedAge} yrs) · Bal Shram Nishedh Act Compliant`
        : 'Underage Restricted (< 18 yrs) · Banquet Shift Restricted',
      expectedWageNpr: finalWage,
      isGovtStatutoryWage: !hasCustomWage,
      wageDeclaredByUser: hasCustomWage,
      id: `staff-${Date.now()}`,
      rating: 5.0,
      totalShiftsCompleted: 0,
      reviews: [],
      createdAt: new Date().toISOString(),
    };
    setEventStaffPool((prev) => [newStaff, ...prev]);
    return newStaff;
  };

  const toggleStaffAvailability = (staffId: string) => {
    setEventStaffPool((prev) =>
      prev.map((staff) =>
        staff.id === staffId ? { ...staff, isAvailableNow: !staff.isAvailableNow } : staff
      )
    );
  };

  const addStaffReview = (
    staffId: string,
    review: Omit<StaffReviewComment, 'id' | 'createdAt'>
  ) => {
    const newReview: StaffReviewComment = {
      ...review,
      id: `rev-st-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setEventStaffPool((prev) =>
      prev.map((staff) => {
        if (staff.id === staffId) {
          const updatedReviews = [newReview, ...staff.reviews];
          const totalScore = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
          const newAverage = Number((totalScore / updatedReviews.length).toFixed(1));
          return {
            ...staff,
            rating: newAverage,
            totalShiftsCompleted: staff.totalShiftsCompleted + 1,
            reviews: updatedReviews,
          };
        }
        return staff;
      })
    );
  };

  // Staff Custom Role Proposals (अन्य नयाँ भूमिका / विधा)
  const [staffCustomRoles, setStaffCustomRoles] = useState<StaffCustomRoleProposal[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('utsavo_staff_custom_roles_v1');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to load staff custom roles', e);
      }
    }
    return [
      {
        id: 'staff-role-prop-01',
        proposedRoleName: 'Live Paan & Saunf Counter Artisan',
        proposedNepaliName: 'शाही पान तथा मसला कारीगर',
        submittedByStaffName: 'Rajesh Chaurasia',
        staffPhone: '+977-9841998877',
        description: 'Specializes in fresh Banarasi sweet paan, meetha paan, fire paan, and organic mukhwas for wedding receptions.',
        status: 'PERMANENT',
        createdAt: '2024-10-15',
        reviewedAt: '2024-10-16',
        adminNotes: 'Highly requested celebration booth artisan. Approved permanently across Nepal.',
      },
      {
        id: 'staff-role-prop-02',
        proposedRoleName: 'Traditional Newari Aila / Chyang Pourer (Anthe)',
        proposedNepaliName: 'ऐला / थ्वँ (छ्याङ) सत्कार सहयोगी (अन्थे)',
        submittedByStaffName: 'Rabin Shakya',
        staffPhone: '+977-9851088776',
        description: 'Pours ceremonial authentic Newari aila from anti brass kettle into salicha for traditional bhoj banquets.',
        status: 'PERMANENT',
        createdAt: '2024-11-01',
        reviewedAt: '2024-11-02',
        adminNotes: 'Essential for Newari cultural feasts. Approved permanently.',
      },
      {
        id: 'staff-role-prop-03',
        proposedRoleName: 'Kids Celebration Playzone & Bouncy Caretaker',
        proposedNepaliName: 'बालबालिका खेलकुद तथा मनोरञ्जन हेरचाहकर्ता',
        submittedByStaffName: 'Anjana Thapa',
        staffPhone: '+977-9801223344',
        description: 'Supervises toddler play corners, bouncy castles, and face painting during 5-hour family wedding banquets.',
        status: 'PENDING',
        createdAt: '2024-11-05',
        adminNotes: 'New category proposal under admin review.',
      },
    ];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('utsavo_staff_custom_roles_v1', JSON.stringify(staffCustomRoles));
      } catch (e) {
        console.warn('Failed to save staff custom roles', e);
      }
    }
  }, [staffCustomRoles]);

  const proposeStaffCustomRole = (
    proposal: Omit<StaffCustomRoleProposal, 'id' | 'createdAt' | 'status'>
  ): string => {
    const id = `staff-role-prop-${Date.now()}`;
    const newProposal: StaffCustomRoleProposal = {
      ...proposal,
      id,
      status: 'PENDING',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setStaffCustomRoles((prev) => [newProposal, ...prev]);
    return id;
  };

  const reviewStaffCustomRole = (
    roleId: string,
    decision: 'PERMANENT' | 'TEMPORARY' | 'REJECTED',
    adminNotes?: string
  ) => {
    setStaffCustomRoles((prev) =>
      prev.map((role) => {
        if (role.id === roleId) {
          return {
            ...role,
            status: decision,
            reviewedAt: new Date().toISOString().split('T')[0],
            adminNotes: adminNotes || role.adminNotes,
          };
        }
        return role;
      })
    );

    // Also update staff in talent pool with this proposed role
    setEventStaffPool((prev) =>
      prev.map((staff) => {
        if (staff.customRoleName) {
          const target = staffCustomRoles.find((r) => r.id === roleId);
          if (target && target.proposedRoleName.toLowerCase() === staff.customRoleName.toLowerCase()) {
            return {
              ...staff,
              customRoleStatus: decision,
            };
          }
        }
        return staff;
      })
    );
  };

  // -------------------------------------------------------------
  // SOCIAL CELEBRATION WALL STATE & PERSISTENCE
  // -------------------------------------------------------------
  const [socialPosts, setSocialPosts] = useState<SocialCelebrationPost[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('utsavo_social_posts_v1');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to load social posts', e);
      }
    }
    return SEED_SOCIAL_CELEBRATION_POSTS;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('utsavo_social_posts_v1', JSON.stringify(socialPosts));
      } catch (e) {
        console.warn('Failed to save social posts', e);
      }
    }
  }, [socialPosts]);

  const addSocialPost = (
    post: Omit<SocialCelebrationPost, 'id' | 'createdAt' | 'likesCount'>
  ): SocialCelebrationPost => {
    const id = `post-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    // Defensive input sanitization
    const sanitizedPhotos = (post.photos || []).map((p) => ({
      ...p,
      url: sanitizeUrl(p.url, 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'),
      caption: p.caption ? sanitizeText(p.caption, 200) : undefined,
    }));

    const sanitizedPost: SocialCelebrationPost = {
      ...post,
      id,
      celebrationTitle: sanitizeText(post.celebrationTitle, 150),
      hostName: sanitizeText(post.hostName, 100),
      hostRole: sanitizeText(post.hostRole, 60),
      reviewQuote: sanitizeText(post.reviewQuote, 400),
      detailedStory: post.detailedStory ? sanitizeText(post.detailedStory, 2000) : undefined,
      coverPhoto: sanitizeUrl(post.coverPhoto, sanitizedPhotos[0]?.url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'),
      photos: sanitizedPhotos,
      tags: (post.tags || []).map((t) => sanitizeText(t, 40)),
      cateringHighlights: (post.cateringHighlights || []).map((c) => sanitizeText(c, 60)),
      likesCount: 1,
      userLiked: true,
      createdAt: new Date().toISOString(),
    };

    setSocialPosts((prev) => [sanitizedPost, ...prev]);
    return sanitizedPost;
  };

  const likeSocialPost = (postId: string) => {
    setSocialPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !!post.userLiked;
          return {
            ...post,
            userLiked: !isLiked,
            likesCount: isLiked ? Math.max(0, post.likesCount - 1) : post.likesCount + 1,
          };
        }
        return post;
      })
    );
  };

  // 1-Tap Quick Peek State
  const [quickPeekVenueId, setQuickPeekVenueId] = useState<string | null>(null);

  // -------------------------------------------------------------
  // PANCHANGA PREFERENCES & PUSH NOTIFICATION STATE SIMULATION
  // -------------------------------------------------------------
  const [panchangaPreferences, setPanchangaPreferences] = useState<UserPanchangaPreferences>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('utsavo_panchanga_prefs_v1');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to load panchanga preferences', e);
      }
    }
    return DEFAULT_PANCHANGA_PREFS;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('utsavo_panchanga_prefs_v1', JSON.stringify(panchangaPreferences));
      } catch (e) {
        console.warn('Failed to save panchanga preferences', e);
      }
    }
  }, [panchangaPreferences]);

  const updatePanchangaPreferences = (prefs: Partial<UserPanchangaPreferences>) => {
    setPanchangaPreferences((prev) => {
      const updated = { ...prev, ...prefs };
      setCurrentUser((user) => ({
        ...user,
        panchangaPreferences: updated,
      }));
      return updated;
    });
  };

  // Sound chime helper
  const playAuspiciousChime = () => {
    if (typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5 note
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.85);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.85);
    } catch {
      // Audio might require user interaction in strict environments
    }
  };

  // Seed Push Alerts
  const [pushAlerts, setPushAlerts] = useState<AuspiciousPushAlert[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('utsavo_push_alerts_v1');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to load push alerts', e);
      }
    }
    return [
      {
        id: 'alert-mangsir-18',
        muhuratId: 'muhurat-w-2',
        title: '🔔 Upcoming Auspicious Wedding Muhurat (शुभ विवाह साइत)',
        titleNepali: 'मंसिर १८ — गुरु आदित्य योग विवाह लगन',
        message: 'Upcoming prime wedding date in Nepal (2081 Mangsir 18). Recommended booking party palaces now.',
        messageNepali: 'तपाईंको मंसिर विवाह प्राथमिकता अनुसार मंसिर १८ गते अति शुभ लग्न परेको छ। पार्टी प्यालेस बुक गर्नुहोस्।',
        dateBS: '2081 Mangsir 18',
        dateAD: '2024-12-03',
        tithi: 'Dwitiya (द्वितीया)',
        nakshatra: 'Mool (मूल)',
        eventType: 'WEDDING',
        auspiciousTime: '11:00 AM - 04:30 PM',
        significance: 'Highly auspicious Lagna under Guru Aditya Yoga. Peak party palace booking demand.',
        isRead: false,
        timestamp: new Date().toISOString(),
        urgencyLevel: 'HIGH',
        matchedPreferenceReason: 'Matched preference: Wedding (विवाह) & Mangsir month',
      },
      {
        id: 'alert-magh-22-basanta',
        muhuratId: 'muhurat-w-4',
        title: '🌸 Basanta Panchami Auspicious Alert (श्रीपञ्चमी)',
        titleNepali: 'माघ २२ — वसन्त पञ्चमी (अति शुभ अबुझ साइत)',
        message: '2081 Magh 22 is Saraswati Puja — universally auspicious for all celebrations without horoscope matching.',
        messageNepali: 'माघ २२ गते सरस्वती पूजा तथा वसन्त पञ्चमी — विवाह तथा पास्नीको लागि स्वतः शुभ साइत।',
        dateBS: '2081 Magh 22',
        dateAD: '2025-02-04',
        tithi: 'Panchami (वसन्त पञ्चमी / श्रीपञ्चमी)',
        nakshatra: 'Revati (रेवती)',
        eventType: 'WEDDING',
        auspiciousTime: 'Abhijit Muhurat (11:45 AM - 12:35 PM)',
        significance: 'Universally auspicious day requiring no astrological horoscope matching.',
        isRead: false,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        urgencyLevel: 'HIGH',
        matchedPreferenceReason: 'Matched preference: Wedding & Magh month',
      },
    ];
  });

  const [activePushToast, setActivePushToast] = useState<AuspiciousPushAlert | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('utsavo_push_alerts_v1', JSON.stringify(pushAlerts));
      } catch (e) {
        console.warn('Failed to save push alerts', e);
      }
    }
  }, [pushAlerts]);

  const dismissPushToast = () => {
    setActivePushToast(null);
  };

  const markAlertAsRead = (alertId: string) => {
    setPushAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, isRead: true } : a))
    );
  };

  const clearAllAlerts = () => {
    setPushAlerts([]);
    setActivePushToast(null);
  };

  const simulatePushAlert = (specificMuhuratId?: string) => {
    // Pick an auspicious muhurat matching preferences or specific one
    let targetMuhurat = specificMuhuratId
      ? PANCHANGA_AUSPICIOUS_MUHURATS.find((m) => m.id === specificMuhuratId)
      : null;

    if (!targetMuhurat) {
      // Find one matching preferred event types or months
      const matching = PANCHANGA_AUSPICIOUS_MUHURATS.filter((m) => {
        const matchesType = panchangaPreferences.eventTypes.includes(m.eventType);
        const matchesMonth = panchangaPreferences.preferredMonthsBS.some((mo) => m.dateBS.includes(mo));
        return matchesType || matchesMonth;
      });
      // Pick random or cycle
      const pool = matching.length > 0 ? matching : PANCHANGA_AUSPICIOUS_MUHURATS;
      const randomIndex = Math.floor(Math.random() * pool.length);
      targetMuhurat = pool[randomIndex];
    }

    if (!targetMuhurat) return;

    const newAlert: AuspiciousPushAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      muhuratId: targetMuhurat.id,
      title: `🔔 Auspicious ${targetMuhurat.eventType} Alert: ${targetMuhurat.dateBS}`,
      titleNepali: `${targetMuhurat.dateBS} — शुभ ${targetMuhurat.eventType === 'WEDDING' ? 'विवाह लगन' : targetMuhurat.eventType === 'BRATABANDHA' ? 'व्रतबन्ध साइत' : 'उत्सव मुहूर्त'}`,
      message: `${targetMuhurat.tithi} • ${targetMuhurat.nakshatra}. Auspicious window: ${targetMuhurat.auspiciousTime}`,
      messageNepali: `${targetMuhurat.significance}`,
      dateBS: targetMuhurat.dateBS,
      dateAD: targetMuhurat.dateAD,
      tithi: targetMuhurat.tithi,
      nakshatra: targetMuhurat.nakshatra,
      eventType: targetMuhurat.eventType,
      auspiciousTime: targetMuhurat.auspiciousTime,
      significance: targetMuhurat.significance,
      isRead: false,
      timestamp: new Date().toISOString(),
      urgencyLevel: 'HIGH',
      matchedPreferenceReason: `Matched profile preferences (${targetMuhurat.eventType} in ${targetMuhurat.dateBS.split(' ')[1] || 'Nepal'})`,
    };

    setPushAlerts((prev) => [newAlert, ...prev]);
    setActivePushToast(newAlert);

    if (panchangaPreferences.pushSoundEnabled) {
      playAuspiciousChime();
    }
  };

  const unreadAlertsCount = pushAlerts.filter((a) => !a.isRead).length;

  // Real-Time Server-Sent Events (SSE) Favorite Venue Notifications
  const [rawServerVenueAlerts, setRawServerVenueAlerts] = useState<FavoriteVenueAlert[]>([]);
  const [sseConnectionStatus, setSseConnectionStatus] = useState<SseStreamStatus>('CONNECTING');
  const [isScanningFavoriteVenues, setIsScanningFavoriteVenues] = useState(false);
  const [lastFavoriteScanMessage, setLastFavoriteScanMessage] = useState<string | null>(null);
  const [activeFavoriteVenueToast, setActiveFavoriteVenueToast] = useState<FavoriteVenueAlert | null>(null);

  const savedVenueIdsRef = useRef<string[]>(savedVenueIds);
  savedVenueIdsRef.current = savedVenueIds;

  const panchangaPrefsRef = useRef<UserPanchangaPreferences>(panchangaPreferences);
  panchangaPrefsRef.current = panchangaPreferences;

  const upsertServerAlertIdempotently = useCallback((incoming: FavoriteVenueAlert) => {
    setRawServerVenueAlerts((prev) => {
      const idx = prev.findIndex((a) => a.id === incoming.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = incoming;
        return updated;
      }
      return [incoming, ...prev];
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof EventSource === 'undefined') return;

    setSseConnectionStatus('CONNECTING');
    const eventSource = new EventSource('/api/favorite-venue-alerts/stream');

    eventSource.onopen = () => {
      setSseConnectionStatus('CONNECTED');
    };

    const handleInit = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data || '{}');
        if (Array.isArray(data.alerts)) {
          setRawServerVenueAlerts((prev) => {
            const merged = new Map<string, FavoriteVenueAlert>();
            for (const existing of prev) {
              if (existing && existing.id) merged.set(existing.id, existing);
            }
            for (const item of data.alerts as FavoriteVenueAlert[]) {
              if (!item || !item.id) continue;
              const current = merged.get(item.id);
              merged.set(item.id, {
                ...item,
                isRead: current?.isRead ? true : item.isRead,
              });
            }
            return Array.from(merged.values());
          });
        }
        setSseConnectionStatus('CONNECTED');
      } catch (err) {
        console.warn('Failed to parse SSE init payload', err);
      }
    };

    const handleCreated = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data || '{}');
        const alert = data?.alert as FavoriteVenueAlert | undefined;
        if (!alert || !alert.id) return;

        let wasAlreadyPresent = false;
        setRawServerVenueAlerts((prev) => {
          if (prev.some((a) => a.id === alert.id)) {
            wasAlreadyPresent = true;
            return prev;
          }
          return [alert, ...prev];
        });

        if (!wasAlreadyPresent && savedVenueIdsRef.current.includes(alert.venueId)) {
          setActiveFavoriteVenueToast(alert);
          if (panchangaPrefsRef.current.pushSoundEnabled) {
            playAuspiciousChime();
          }
        }
      } catch (err) {
        console.warn('Failed to parse SSE alert:created payload', err);
      }
    };

    const handleUpdated = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data || '{}');
        const alert = data?.alert as FavoriteVenueAlert | undefined;
        if (!alert || !alert.id) return;
        upsertServerAlertIdempotently(alert);
      } catch (err) {
        console.warn('Failed to parse SSE alert:updated payload', err);
      }
    };

    const handleSync = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data || '{}');
        if (Array.isArray(data.alerts)) {
          const deduped = new Map<string, FavoriteVenueAlert>();
          for (const item of data.alerts as FavoriteVenueAlert[]) {
            if (item && item.id) deduped.set(item.id, item);
          }
          setRawServerVenueAlerts(Array.from(deduped.values()));
        }
      } catch (err) {
        console.warn('Failed to parse SSE alert:sync payload', err);
      }
    };

    eventSource.addEventListener('init', handleInit as EventListener);
    eventSource.addEventListener('alert:created', handleCreated as EventListener);
    eventSource.addEventListener('alert:updated', handleUpdated as EventListener);
    eventSource.addEventListener('alert:sync', handleSync as EventListener);

    eventSource.onerror = () => {
      // Browser EventSource handles automatic reconnect and server resends 'init' on reconnect
      setSseConnectionStatus('RECONNECTING');
    };

    return () => {
      eventSource.removeEventListener('init', handleInit as EventListener);
      eventSource.removeEventListener('alert:created', handleCreated as EventListener);
      eventSource.removeEventListener('alert:updated', handleUpdated as EventListener);
      eventSource.removeEventListener('alert:sync', handleSync as EventListener);
      eventSource.close();
    };
  }, [upsertServerAlertIdempotently]);

  const favoriteVenueAlerts = useMemo(() => {
    const idSet = new Set(savedVenueIds);
    return rawServerVenueAlerts
      .filter((a) => idSet.has(a.venueId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [rawServerVenueAlerts, savedVenueIds]);

  const unreadFavoriteVenueAlertsCount = useMemo(
    () => favoriteVenueAlerts.filter((a) => !a.isRead).length,
    [favoriteVenueAlerts]
  );

  const dismissFavoriteVenueToast = useCallback(() => {
    setActiveFavoriteVenueToast(null);
  }, []);

  const markFavoriteVenueAlertRead = useCallback(
    async (alertId: string | 'ALL') => {
      // Optimistic local state update synced immediately with server authoritative state via SSE
      if (alertId === 'ALL') {
        const favIds = new Set(savedVenueIdsRef.current);
        setRawServerVenueAlerts((prev) =>
          prev.map((a) => (favIds.has(a.venueId) ? { ...a, isRead: true } : a))
        );
        try {
          await fetch('/api/favorite-venue-alerts/mark-read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ markAll: true, venueIds: savedVenueIdsRef.current }),
          });
        } catch (err) {
          console.warn('Failed to mark all favorite venue alerts read on server', err);
        }
        return;
      }

      setRawServerVenueAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, isRead: true } : a))
      );
      try {
        await fetch('/api/favorite-venue-alerts/mark-read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ alertId }),
        });
      } catch (err) {
        console.warn('Failed to mark favorite venue alert read on server', err);
      }
    },
    []
  );

  const publishFavoriteVenueAlert = useCallback(
    async (params: {
      venueId: string;
      venueName: string;
      district?: string;
      locality?: string;
      alertKind: FavoriteVenueAlertKind;
      title?: string;
      message?: string;
      dateBS: string;
      dateAD?: string;
      shift?: any;
      hallName?: string;
      tithi?: string;
      nakshatra?: string;
      auspiciousTime?: string;
      discountOrIncentiveNote?: string;
      sourceBookingRef?: string;
    }): Promise<FavoriteVenueAlert | null> => {
      try {
        const res = await fetch('/api/favorite-venue-alerts/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        });
        if (!res.ok) return null;
        const data = await res.json();
        const alert = data?.alert as FavoriteVenueAlert | undefined;
        if (alert) {
          upsertServerAlertIdempotently(alert);
          return alert;
        }
        return null;
      } catch (err) {
        console.warn('Failed to publish favorite venue alert', err);
        return null;
      }
    },
    [upsertServerAlertIdempotently]
  );

  const scanFavoriteVenueAvailability = useCallback(async (): Promise<number> => {
    const favoriteVenuesPayload = venues
      .filter((v) => savedVenueIdsRef.current.includes(v.id))
      .map((v) => ({
        id: v.id,
        name: v.name,
        district: v.district,
        locality: v.locality,
        hallNames: v.halls.map((h) => h.name),
      }));

    if (favoriteVenuesPayload.length === 0) {
      setLastFavoriteScanMessage('Bookmark at least one venue to scan server Panchanga & cancellation availability.');
      return 0;
    }

    setIsScanningFavoriteVenues(true);
    setLastFavoriteScanMessage(null);
    try {
      const res = await fetch('/api/favorite-venue-alerts/scan-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          favoriteVenues: favoriteVenuesPayload,
          bookings: bookings.map((b) => ({
            venueId: b.venueId,
            eventDateBS: b.eventDateBS,
            eventDateAD: b.eventDateAD,
            shift: b.shift,
            status: b.status,
            hallName: b.hallName,
            bookingRef: b.bookingRef,
          })),
          muhurats: PANCHANGA_AUSPICIOUS_MUHURATS.map((m) => ({
            dateBS: m.dateBS,
            dateAD: m.dateAD,
            tithi: m.tithi,
            nakshatra: m.nakshatra,
            auspiciousTime: m.auspiciousTime,
            eventType: m.eventType,
          })),
        }),
      });
      if (!res.ok) {
        setLastFavoriteScanMessage('Server scan temporarily unavailable.');
        return 0;
      }
      const data = await res.json();
      const discovered = Array.isArray(data?.discoveredAlerts)
        ? (data.discoveredAlerts as FavoriteVenueAlert[])
        : [];
      for (const alert of discovered) {
        if (alert && alert.id) {
          upsertServerAlertIdempotently(alert);
        }
      }
      if (discovered.length > 0 && savedVenueIdsRef.current.includes(discovered[0].venueId)) {
        setActiveFavoriteVenueToast(discovered[0]);
      }
      const count = discovered.length || Number(data?.newlyDiscovered) || 0;
      if (count > 0) {
        setLastFavoriteScanMessage(`Discovered & pushed ${count} new favorite-venue slot alert${count > 1 ? 's' : ''} via live server stream.`);
      } else {
        setLastFavoriteScanMessage('All currently open Panchanga dates and cancellations for your saved venues are already synced.');
      }
      return count;
    } catch (err) {
      console.warn('Error scanning favorite venue availability', err);
      setLastFavoriteScanMessage('Unable to reach availability scanner right now.');
      return 0;
    } finally {
      setIsScanningFavoriteVenues(false);
    }
  }, [venues, bookings, upsertServerAlertIdempotently]);

  // Social Cause: Annapurna Surplus Feast Food Rescue (Strict Voluntary Client Consent Driven)
  const [foodRescuePledges, setFoodRescuePledges] = useState<ExcessFoodRescuePledge[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('utsavo_food_rescue_pledges_v1');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to load food rescue pledges', e);
      }
    }
    return SEED_FOOD_RESCUE_PLEDGES;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('utsavo_food_rescue_pledges_v1', JSON.stringify(foodRescuePledges));
      } catch (e) {
        console.warn('Failed to save food rescue pledges', e);
      }
    }
  }, [foodRescuePledges]);

  const addFoodRescuePledge = (
    pledge: Omit<ExcessFoodRescuePledge, 'id' | 'createdAt' | 'temperatureAndSafetyChecked' | 'cleanStorageBoxesSuppliedByUtsavo'>
  ): ExcessFoodRescuePledge => {
    const newPledge: ExcessFoodRescuePledge = {
      ...pledge,
      id: `food-pledge-${Date.now()}`,
      temperatureAndSafetyChecked: true,
      cleanStorageBoxesSuppliedByUtsavo: true,
      createdAt: new Date().toISOString(),
    };
    setFoodRescuePledges((prev) => [newPledge, ...prev]);
    return newPledge;
  };

  const updateFoodRescueConsent = (pledgeId: string, consentGiven: boolean, declaration?: string) => {
    setFoodRescuePledges((prev) =>
      prev.map((p) =>
        p.id === pledgeId
          ? {
              ...p,
              clientConsentGiven: consentGiven,
              clientConsentTimestamp: consentGiven ? new Date().toISOString() : undefined,
              status: consentGiven ? 'CONSENT_GRANTED' : 'CONSENT_WITHDRAWN',
              clientConsentDeclaration: declaration || p.clientConsentDeclaration,
            }
          : p
      )
    );
  };

  const updateFoodRescueStatus = (
    pledgeId: string,
    status: ExcessFoodRescuePledge['status'],
    notes?: string,
    beneficiariesFed?: number
  ) => {
    setFoodRescuePledges((prev) =>
      prev.map((p) =>
        p.id === pledgeId
          ? {
              ...p,
              status,
              recipientStoryNotes: notes !== undefined ? notes : p.recipientStoryNotes,
              beneficiariesFedCount: beneficiariesFed !== undefined ? beneficiariesFed : p.beneficiariesFedCount,
            }
          : p
      )
    );
  };

  // Dynamic Per-Vendor Cancellation Policies, Past-Deadline Protocols & Peer Partner Referrals
  const [vendorPolicies, setVendorPolicies] = useState<Record<string, DynamicCancellationPolicy>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('utsavo_vendor_cancellation_policies_v1');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to load vendor cancellation policies', e);
      }
    }
    return SEED_VENDOR_CANCELLATION_POLICIES;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('utsavo_vendor_cancellation_policies_v1', JSON.stringify(vendorPolicies));
      } catch (e) {
        console.warn('Failed to save vendor cancellation policies', e);
      }
    }
  }, [vendorPolicies]);

  const [referralOffers, setReferralOffers] = useState<VendorReferralOffer[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('utsavo_vendor_referral_offers_v1');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to load vendor referral offers', e);
      }
    }
    return SEED_VENDOR_REFERRAL_OFFERS;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('utsavo_vendor_referral_offers_v1', JSON.stringify(referralOffers));
      } catch (e) {
        console.warn('Failed to save vendor referral offers', e);
      }
    }
  }, [referralOffers]);

  const [cancellationRecords, setCancellationRecords] = useState<CancellationResolutionRecord[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('utsavo_cancellation_records_v1');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to load cancellation records', e);
      }
    }
    return SEED_CANCELLATION_RECORDS;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('utsavo_cancellation_records_v1', JSON.stringify(cancellationRecords));
      } catch (e) {
        console.warn('Failed to save cancellation records', e);
      }
    }
  }, [cancellationRecords]);

  const getVendorCancellationPolicy = (
    vendorId: string,
    vendorName?: string,
    stakeholderCategory: 'VENUE_VENDOR' | 'CULTURAL_ARTIST' | 'EVENT_PLANNER' = 'VENUE_VENDOR'
  ): DynamicCancellationPolicy => {
    if (vendorPolicies[vendorId]) return vendorPolicies[vendorId];
    return createDynamicPolicyFromPreset({
      vendorId,
      vendorName: vendorName || 'UTSAVO Partner',
      stakeholderCategory,
      preset: 'MODERATE_STANDARD',
    });
  };

  const updateVendorCancellationPolicy = (policy: DynamicCancellationPolicy) => {
    const stamped: DynamicCancellationPolicy = {
      ...policy,
      updatedAt: new Date().toISOString(),
    };
    setVendorPolicies((prev) => ({
      ...prev,
      [stamped.vendorId]: stamped,
    }));

    // Sync concise summary to matching venue if applicable
    const summaryTier = stamped.tiers[0];
    const summaryText = `${stamped.preset.replace(/_/g, ' ')} Policy: ${stamped.coolingOffHours}h free grace; ${
      summaryTier ? `${summaryTier.refundPercent}% refund at ${summaryTier.minDaysBefore}+ days` : ''
    }; Past-deadline ${stamped.pastDeadlineRule.forfeitPercentAfterDeadline}% retained (${
      stamped.pastDeadlineRule.allowEmergencyMedicalReviewHours
    }h emergency review). ${
      stamped.referralConfig.allowsPartnerReferral
        ? 'Peer partner referral & escrow transfer supported.'
        : ''
    }`;

    setVenues((prev) =>
      prev.map((v) =>
        v.id === stamped.vendorId
          ? {
              ...v,
              dynamicCancellationPolicy: stamped,
              cancellationPolicy: stamped.customSummaryText || summaryText,
            }
          : v
      )
    );
  };

  const createVendorReferralOffer = (params: {
    bookingId: string;
    cancellingVendorId: string;
    cancellingVendorName: string;
    stakeholderRole: CancellationStakeholderRole;
    handoffType: 'WARM_REFERRAL' | 'DIRECT_SUBSTITUTE_GUARANTEE';
    recommendedPartners: RecommendedReferralPartner[];
    referralFeeModel: ReferralFeeModel;
    reason: string;
    includeLiabilityRelease: boolean;
  }): VendorReferralOffer => {
    const targetBooking = bookings.find((b) => b.id === params.bookingId);
    const newOffer: VendorReferralOffer = {
      id: `ref-offer-${Date.now()}`,
      bookingId: params.bookingId,
      bookingRef: targetBooking?.bookingRef || `UTS-REF-${Date.now().toString().slice(-4)}`,
      eventDateBS: targetBooking?.eventDateBS || '2081 Falgun 14',
      eventDateAD: targetBooking?.eventDateAD || '2025-02-26',
      clientName: targetBooking?.customerName || currentUser.name,
      cancellingVendorId: params.cancellingVendorId,
      cancellingVendorName: params.cancellingVendorName,
      stakeholderRole: params.stakeholderRole,
      handoffType: params.handoffType,
      recommendedPartners: params.recommendedPartners,
      referralFeeModel: params.referralFeeModel,
      reason: sanitizeText(params.reason, 400),
      includeLiabilityRelease: params.includeLiabilityRelease,
      clientDecision: 'PENDING',
      escrowAction: 'HELD_FOR_TRANSFER',
      escrowAmountNpr: targetBooking?.depositPaidNpr || targetBooking?.depositRequiredNpr || 100000,
      createdAt: new Date().toISOString(),
    };

    setReferralOffers((prev) => [newOffer, ...prev]);
    return newOffer;
  };

  const respondToReferralOffer = (
    offerId: string,
    decision: 'ACCEPTED_PARTNER' | 'DECLINED_REFUND_ONLY',
    acceptedPartnerId?: string
  ) => {
    const targetOffer = referralOffers.find((o) => o.id === offerId);
    if (!targetOffer) return;

    const chosenPartner = targetOffer.recommendedPartners.find((p) => p.partnerId === acceptedPartnerId) ||
      targetOffer.recommendedPartners[0];

    setReferralOffers((prev) =>
      prev.map((offer) => {
        if (offer.id !== offerId) return offer;
        if (decision === 'ACCEPTED_PARTNER' && chosenPartner) {
          return {
            ...offer,
            clientDecision: 'ACCEPTED_PARTNER',
            acceptedPartnerId: chosenPartner.partnerId,
            acceptedPartnerName: chosenPartner.partnerName,
            escrowAction: 'TRANSFERRED_TO_PARTNER',
            resolvedAt: new Date().toISOString(),
          };
        }
        return {
          ...offer,
          clientDecision: 'DECLINED_REFUND_ONLY',
          escrowAction: 'FULL_REFUND_ISSUED',
          resolvedAt: new Date().toISOString(),
        };
      })
    );

    if (decision === 'ACCEPTED_PARTNER' && chosenPartner) {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === targetOffer.bookingId
            ? {
                ...b,
                venueId: chosenPartner.partnerId,
                venueName: chosenPartner.partnerName,
                hallName: chosenPartner.categoryOrCapacity.split('·')[1]?.trim() || b.hallName,
                status: 'CONFIRMED',
              }
            : b
        )
      );
    } else {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === targetOffer.bookingId
            ? {
                ...b,
                status: 'CANCELLED',
              }
            : b
        )
      );
    }
  };

  const cancelBookingWithPolicy = (params: {
    bookingId: string;
    initiatedByRole: CancellationStakeholderRole;
    daysBeforeEvent: number;
    isPastDeadline: boolean;
    isForceMajeure: boolean;
    hasEmergencyMedicalProof: boolean;
    bookedPoolStaffCount?: number;
    reason: string;
  }): CancellationResolutionRecord | null => {
    const booking = bookings.find((b) => b.id === params.bookingId);
    if (!booking) return null;

    const policy = getVendorCancellationPolicy(booking.venueId, booking.venueName, 'VENUE_VENDOR');
    const calc = calculateCancellationOutcome({
      policy,
      initiatedBy: params.initiatedByRole,
      daysBeforeEvent: params.daysBeforeEvent,
      hoursSinceBooking: 72,
      isPastDeadline: params.isPastDeadline,
      isForceMajeure: params.isForceMajeure,
      hasEmergencyMedicalProof: params.hasEmergencyMedicalProof,
      totalAmountNpr: booking.totalAmountNpr,
      depositPaidNpr: booking.depositPaidNpr,
      bookedPoolStaffCount: params.bookedPoolStaffCount || 0,
      staffShiftWageNpr: statutoryRules.minDailyShiftWageNpr,
    });

    const record: CancellationResolutionRecord = {
      id: `cancel-rec-${Date.now()}`,
      bookingId: booking.id,
      bookingRef: booking.bookingRef,
      venueOrPartnerName: booking.venueName,
      initiatedByRole: params.initiatedByRole,
      reason: sanitizeText(params.reason, 400),
      isPastDeadline: params.isPastDeadline,
      isForceMajeure: params.isForceMajeure,
      totalAmountNpr: booking.totalAmountNpr,
      depositPaidNpr: booking.depositPaidNpr,
      refundIssuedNpr: calc.refundToClientNpr,
      rescheduleCreditNpr: calc.rescheduleCreditNpr,
      retainedFeeNpr: calc.retainedByVendorNpr,
      staffReportingPayNpr: calc.staffReportingPayTotalNpr,
      legalBasisSummary: calc.legalBasis,
      resolvedAt: new Date().toISOString(),
    };

    setCancellationRecords((prev) => [record, ...prev]);
    setBookings((prev) =>
      prev.map((b) =>
        b.id === booking.id
          ? {
              ...b,
              status: 'CANCELLED',
              settlementStatus: calc.retainedByVendorNpr > 0 ? 'SETTLED' : 'HELD',
            }
          : b
      )
    );

    // Broadcast real-time SSE alert for any customer who favorited this venue
    const venueObj = venues.find((v) => v.id === booking.venueId);
    const matchingMuhurat = PANCHANGA_AUSPICIOUS_MUHURATS.find(
      (m) => m.dateBS === booking.eventDateBS
    );
    void publishFavoriteVenueAlert({
      venueId: booking.venueId,
      venueName: booking.venueName,
      district: venueObj?.district || 'Kathmandu',
      locality: venueObj?.locality || '',
      alertKind: 'LAST_MINUTE_CANCELLATION',
      title: `Last-Minute Cancellation Released at ${booking.venueName}`,
      message: `Booking #${booking.bookingRef} (${booking.shift} Shift, ${booking.hallName}) was cancelled (${record.initiatedByRole.toLowerCase()} request) — ${booking.eventDateBS} is now open for immediate reservation.`,
      dateBS: booking.eventDateBS,
      dateAD: booking.eventDateAD,
      shift: booking.shift,
      hallName: booking.hallName,
      tithi: matchingMuhurat?.tithi,
      nakshatra: matchingMuhurat?.nakshatra,
      auspiciousTime: matchingMuhurat?.auspiciousTime,
      discountOrIncentiveNote: 'Last-Minute Cancellation Release · Express Escrow Transfer Available',
      sourceBookingRef: booking.bookingRef,
    });

    return record;
  };

  // Star Hotel Concierge Actions
  const submitStarHotelRequest = (
    req: Omit<StarHotelSourcingRequest, 'id' | 'requestRef' | 'status' | 'createdAt' | 'updatedAt'>
  ): StarHotelSourcingRequest => {
    const now = new Date().toISOString();
    const requestRef = `UTS-HTL-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReq: StarHotelSourcingRequest = {
      ...req,
      id: `htl-req-${Date.now()}`,
      requestRef,
      clientName: sanitizeText(req.clientName, 100),
      clientEmail: sanitizeText(req.clientEmail, 100),
      clientPhone: sanitizeText(req.clientPhone, 40),
      preferredHotelNames: sanitizeText(req.preferredHotelNames, 250),
      districtOrCity: sanitizeText(req.districtOrCity, 100),
      country: sanitizeText(req.country, 80),
      specialHospitalityNotes: sanitizeText(req.specialHospitalityNotes, 600),
      status: 'SUBMITTED_TO_ADMIN',
      adminAssignedCoordinator: 'Anurag Thapa (Admin Concierge Queue)',
      sourcedHotelProposals: [],
      createdAt: now,
      updatedAt: now,
    };

    setStarHotelRequests((prev) => [newReq, ...prev]);

    // Sync sanitized summary to Firestore destinationInquiries when active auth session is present
    if (auth.currentUser) {
      setDoc(doc(db, 'destinationInquiries', newReq.id), {
        inquiryRef: newReq.requestRef,
        clientName: newReq.clientName,
        clientEmail: newReq.clientEmail,
        clientCountryOfResidence: newReq.country,
        targetDestination: `${newReq.starTier.replace(/_/g, ' ')} Hotel in ${newReq.districtOrCity}`.slice(0, 145),
        estimatedGuests: newReq.estimatedGuests,
        budgetAmount: newReq.targetBudgetAmount,
        budgetCurrency: newReq.targetBudgetCurrency,
        status: 'SUBMITTED',
        createdAt: now,
      }).catch((err) => console.warn('Optional Firestore sync skipped for Star Hotel inquiry:', err));
    }

    return newReq;
  };

  const updateStarHotelRequestByAdmin = (
    requestId: string,
    updates: {
      status?: StarHotelSourcingRequest['status'];
      adminWorkNotes?: string;
      newProposal?: Omit<SourcedStarHotelProposal, 'id' | 'adminVerifiedAt'>;
    }
  ) => {
    const now = new Date().toISOString();
    setStarHotelRequests((prev) =>
      prev.map((item) => {
        if (item.id !== requestId) return item;
        const nextProposals = [...(item.sourcedHotelProposals || [])];
        if (updates.newProposal) {
          nextProposals.push({
            ...updates.newProposal,
            id: `prop-${Date.now()}`,
            hotelName: sanitizeText(updates.newProposal.hotelName, 150),
            starCategory: sanitizeText(updates.newProposal.starCategory, 80),
            districtOrCity: sanitizeText(updates.newProposal.districtOrCity, 100),
            availabilityNote: sanitizeText(updates.newProposal.availabilityNote, 300),
            adminVerifiedAt: now.split('T')[0],
          });
        }
        return {
          ...item,
          status: updates.status || item.status,
          adminWorkNotes:
            updates.adminWorkNotes !== undefined
              ? sanitizeText(updates.adminWorkNotes, 500)
              : item.adminWorkNotes,
          sourcedHotelProposals: nextProposals,
          updatedAt: now,
        };
      })
    );
  };

  const publishStarHotelAsVenue = (requestId: string, proposal: SourcedStarHotelProposal): Venue | null => {
    const reqItem = starHotelRequests.find((r) => r.id === requestId);
    if (!reqItem) return null;

    const newVenueId = `venue-star-${Date.now()}`;
    const perPlateNpr =
      proposal.currency === 'USD'
        ? Math.round(proposal.quotedPerPlateNprOrUsd * 133)
        : proposal.quotedPerPlateNprOrUsd;
    const hallRentalNpr =
      proposal.currency === 'USD'
        ? Math.round(proposal.quotedHallRentalNprOrUsd * 133)
        : proposal.quotedHallRentalNprOrUsd;

    const newVenue: Venue = {
      id: newVenueId,
      name: proposal.hotelName,
      nepaliName: `${proposal.hotelName} (${proposal.starCategory})`,
      tagline: `${proposal.starCategory} · Sourced & Verified by UTSAVO Admin Concierge (${proposal.districtOrCity})`,
      province: 'Bagmati Province',
      district: proposal.districtOrCity || 'Kathmandu',
      municipality: `${proposal.districtOrCity || 'Kathmandu'} Hospitality Hub`,
      ward: 1,
      locality: proposal.districtOrCity || 'Central District',
      address: `${proposal.hotelName}, ${proposal.districtOrCity}, ${reqItem.country}`,
      mapCoordinates: { lat: 27.7172, lng: 85.324 },
      coverImage: 'heritage_palace',
      gallery: ['heritage_palace', 'indoor_hall', 'garden_lawn'],
      verificationStatus: 'VERIFIED',
      panNumber: '609001122',
      businessRegNumber: `CONCIERGE-${reqItem.requestRef}`,
      contactPerson: reqItem.adminAssignedCoordinator || 'UTSAVO Star Hotel Concierge',
      phone: '+977-9801234567',
      email: 'concierge@utsavo.com',
      rating: 4.9,
      reviewCount: 42,
      responseRatePercent: 99,
      halls: [
        {
          id: `${newVenueId}-ballroom`,
          name: `${proposal.hotelName} Grand Ballroom`,
          nepaliName: `${proposal.hotelName} ग्रान्ड बलरूम`,
          type: reqItem.banquetSetting === 'POOLSIDE_LAWN' ? 'GARDEN_LAWN' : 'INDOOR_HALL',
          minCapacity: Math.max(50, Math.floor(reqItem.estimatedGuests * 0.5)),
          maxCapacity: Math.max(400, reqItem.estimatedGuests + 150),
          minGuestGuarantee: Math.max(50, Math.floor(reqItem.estimatedGuests * 0.7)),
          areaSqFt: 9800,
          baseRentalNpr: hallRentalNpr,
          features: [
            proposal.starCategory,
            'Central HVAC & Acoustic Ballroom',
            reqItem.roomBlockNeeded ? `${reqItem.roomsCount} Guest Room Block Available` : 'Luxury Hospitality Suite',
            'Concierge Rate Secured',
          ],
          photoUrl: 'indoor_hall',
        },
      ],
      parkingCapacityCars: 150,
      parkingCapacityBikes: 200,
      hasPowerBackup: true,
      hasWheelchairAccess: true,
      hasMandapSetup: true,
      hasLiveMusicPermit: true,
      hasVipLounge: true,
      minGuests: 80,
      maxGuests: Math.max(500, reqItem.estimatedGuests + 150),
      baseRentalStartingNpr: hallRentalNpr,
      cateringStartingNpr: perPlateNpr,
      packages: STANDARD_CATERING_PACKAGES,
      availableMenuItems: MASTER_MENU_ITEMS,
      cancellationPolicy: 'Star Hotel Flexible Terms: Full refund minus 10% admin fee up to 30 days prior.',
      decorationPolicy: reqItem.allowExternalCatererOrDecor
        ? 'External luxury decorators approved per Admin concierge agreement.'
        : 'In-house 5-Star floral & banquet production team.',
    };

    setVenues((prev) => [newVenue, ...prev]);
    setStarHotelRequests((prev) =>
      prev.map((item) => {
        if (item.id !== requestId) return item;
        return {
          ...item,
          status: 'PUBLISHED_TO_MARKETPLACE',
          sourcedHotelProposals: (item.sourcedHotelProposals || []).map((p) =>
            p.id === proposal.id ? { ...p, publishedVenueId: newVenueId } : p
          ),
          updatedAt: new Date().toISOString(),
        };
      })
    );

    return newVenue;
  };

  // Outside-Nepal Global Celebrations Actions
  const submitOutsideNepalRequest = (
    req: Omit<OutsideNepalDestinationRequest, 'id' | 'requestRef' | 'status' | 'createdAt' | 'updatedAt'>
  ): OutsideNepalDestinationRequest => {
    const now = new Date().toISOString();
    const requestRef = `UTS-INTL-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReq: OutsideNepalDestinationRequest = {
      ...req,
      id: `intl-req-${Date.now()}`,
      requestRef,
      clientName: sanitizeText(req.clientName, 100),
      clientEmail: sanitizeText(req.clientEmail, 100),
      clientPhone: sanitizeText(req.clientPhone, 40),
      originCities: sanitizeText(req.originCities, 200),
      guestPassportNationalities: sanitizeText(req.guestPassportNationalities, 200),
      targetCountry: sanitizeText(req.targetCountry, 80),
      targetCityOrRegion: sanitizeText(req.targetCityOrRegion, 120),
      loveStoryOrMilestoneTheme: sanitizeText(req.loveStoryOrMilestoneTheme, 500),
      specialDreamsAndNotes: sanitizeText(req.specialDreamsAndNotes, 800),
      status: 'DOSSIER_GATHERED',
      arrangedDeliverables: [
        'Full Global Celebration Dossier Logged with Executive Concierge',
      ],
      createdAt: now,
      updatedAt: now,
    };

    setOutsideNepalRequests((prev) => [newReq, ...prev]);

    if (auth.currentUser) {
      setDoc(doc(db, 'destinationInquiries', newReq.id), {
        inquiryRef: newReq.requestRef,
        clientName: newReq.clientName,
        clientEmail: newReq.clientEmail,
        clientCountryOfResidence: newReq.originCities.slice(0, 95),
        targetDestination: `${newReq.targetCityOrRegion}, ${newReq.targetCountry}`.slice(0, 145),
        estimatedGuests: newReq.estimatedGuests,
        budgetAmount: newReq.budgetAmount,
        budgetCurrency: newReq.currency,
        status: 'SUBMITTED',
        createdAt: now,
      }).catch((err) => console.warn('Optional Firestore sync skipped for Global inquiry:', err));
    }

    return newReq;
  };

  const updateOutsideNepalRequestByAdmin = (
    requestId: string,
    updates: {
      status?: OutsideNepalDestinationRequest['status'];
      adminCoordinatorNotes?: string;
      newDeliverable?: string;
    }
  ) => {
    const now = new Date().toISOString();
    setOutsideNepalRequests((prev) =>
      prev.map((item) => {
        if (item.id !== requestId) return item;
        const nextDeliverables = [...(item.arrangedDeliverables || [])];
        if (updates.newDeliverable && updates.newDeliverable.trim()) {
          nextDeliverables.push(sanitizeText(updates.newDeliverable, 240));
        }
        return {
          ...item,
          status: updates.status || item.status,
          adminCoordinatorNotes:
            updates.adminCoordinatorNotes !== undefined
              ? sanitizeText(updates.adminCoordinatorNotes, 600)
              : item.adminCoordinatorNotes,
          arrangedDeliverables: nextDeliverables,
          updatedAt: now,
        };
      })
    );
  };

  // UTSAVO Full-Service Managed Events Actions
  const submitManagedEventRequest = (
    req: Omit<
      ManagedEventRequest,
      'id' | 'requestRef' | 'createdAt' | 'updatedAt' | 'teamActionUpdates' | 'coordinationMessages'
    > & { initialMessage?: string }
  ): ManagedEventRequest => {
    const now = new Date().toISOString();
    const requestRef = `UTS-MGD-2082-${Math.floor(1000 + Math.random() * 9000)}`;
    const activeVendorsCount = req.vendorFunctions.filter((v) => v.isEnabled && v.mode !== 'NOT_NEEDED').length;

    const initialMessages: ManagedCoordinationMessage[] = [
      {
        id: `mgd-msg-auto-${Date.now()}`,
        senderRole: 'UTSAVO_TEAM',
        senderName: req.assignedCoordinatorName || 'Aarav Shrestha (Senior UTSAVO Event Director)',
        channel: 'PORTAL_CHAT',
        text: `Namaste ${sanitizeText(req.clientName, 80)}! Your Full-Service Managed Event Brief (#${requestRef}) with ${activeVendorsCount} active vendor functions is live with our team. You may adjust any option or message us right here anytime.`,
        timestamp: now,
      },
    ];

    if (req.initialMessage && req.initialMessage.trim()) {
      initialMessages.push({
        id: `mgd-msg-client-${Date.now() + 1}`,
        senderRole: 'CLIENT',
        senderName: sanitizeText(req.clientName, 80),
        channel: 'PORTAL_CHAT',
        text: sanitizeText(req.initialMessage, 700),
        timestamp: now,
      });
    }

    const newReq: ManagedEventRequest = {
      ...req,
      id: `mgd-${Date.now()}`,
      requestRef,
      clientName: sanitizeText(req.clientName, 120),
      clientEmail: sanitizeText(req.clientEmail, 120),
      clientPhone: sanitizeText(req.clientPhone, 40),
      eventTitle: sanitizeText(req.eventTitle, 180),
      cityOrLocality: sanitizeText(req.cityOrLocality, 120),
      country: sanitizeText(req.country, 80),
      coordinationMessages: initialMessages,
      teamActionUpdates: [
        `Brief received (${activeVendorsCount} vendor functions captured · ${req.totalPax} pax · ${req.budgetCurrency} ${req.totalBudget.toLocaleString()})`,
        `Assigned Senior Producer: ${req.assignedCoordinatorName || 'Aarav Shrestha'}`,
      ],
      createdAt: now,
      updatedAt: now,
    };

    setManagedEventRequests((prev) => [newReq, ...prev]);

    if (auth.currentUser) {
      setDoc(doc(db, 'managedEventRequests', newReq.id), {
        requestRef: newReq.requestRef,
        clientName: newReq.clientName,
        clientEmail: newReq.clientEmail,
        eventTitle: newReq.eventTitle,
        eventType: newReq.eventType,
        totalPax: newReq.totalPax,
        totalBudget: newReq.totalBudget,
        budgetCurrency: newReq.budgetCurrency,
        status: newReq.status,
        createdAt: now,
      }).catch((err) => console.warn('Optional Firestore sync skipped for Managed Event brief:', err));
    }

    return newReq;
  };

  const updateManagedEventByClient = (
    requestId: string,
    updates: Partial<ManagedEventRequest>
  ) => {
    const now = new Date().toISOString();
    setManagedEventRequests((prev) =>
      prev.map((item) => {
        if (item.id !== requestId) return item;
        return {
          ...item,
          ...updates,
          updatedAt: now,
        };
      })
    );
  };

  const sendManagedEventMessage = (
    requestId: string,
    params: {
      senderRole: 'CLIENT' | 'UTSAVO_TEAM';
      senderName: string;
      channel?: ManagedCoordinationMessage['channel'];
      text: string;
    }
  ) => {
    const cleanText = sanitizeText(params.text, 900);
    if (!cleanText) return;
    const now = new Date().toISOString();
    const msg: ManagedCoordinationMessage = {
      id: `mgd-msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      senderRole: params.senderRole,
      senderName: sanitizeText(params.senderName, 100),
      channel: params.channel || 'PORTAL_CHAT',
      text: cleanText,
      timestamp: now,
    };
    setManagedEventRequests((prev) =>
      prev.map((item) =>
        item.id === requestId
          ? {
              ...item,
              coordinationMessages: [...item.coordinationMessages, msg],
              updatedAt: now,
            }
          : item
      )
    );
  };

  const updateManagedEventByAdmin = (
    requestId: string,
    updates: {
      status?: ManagedEventRequest['status'];
      assignedCoordinatorName?: string;
      assignedCoordinatorPhone?: string;
      newTeamActionUpdate?: string;
    }
  ) => {
    const now = new Date().toISOString();
    setManagedEventRequests((prev) =>
      prev.map((item) => {
        if (item.id !== requestId) return item;
        const nextUpdates = [...(item.teamActionUpdates || [])];
        if (updates.newTeamActionUpdate && updates.newTeamActionUpdate.trim()) {
          nextUpdates.push(sanitizeText(updates.newTeamActionUpdate, 280));
        }
        return {
          ...item,
          status: updates.status || item.status,
          assignedCoordinatorName:
            updates.assignedCoordinatorName !== undefined
              ? sanitizeText(updates.assignedCoordinatorName, 120)
              : item.assignedCoordinatorName,
          assignedCoordinatorPhone:
            updates.assignedCoordinatorPhone !== undefined
              ? sanitizeText(updates.assignedCoordinatorPhone, 40)
              : item.assignedCoordinatorPhone,
          teamActionUpdates: nextUpdates,
          updatedAt: now,
        };
      })
    );
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const openVenueOnboarding = (venue?: Venue | null) => {
    setEditingVenue(venue || null);
    setActiveModal('VENUE_ONBOARDING');
  };

  const openOrganizerRegistration = (organizer?: EventOrganizer | null) => {
    setEditingOrganizer(organizer || null);
    setActiveModal('EVENT_ORGANIZER_REGISTER');
  };

  const saveOrganizer = (newOrUpdated: EventOrganizer) => {
    setOrganizers((prev) => {
      const exists = prev.some((o) => o.id === newOrUpdated.id);
      if (exists) {
        return prev.map((o) => (o.id === newOrUpdated.id ? newOrUpdated : o));
      }
      return [newOrUpdated, ...prev];
    });
  };

  const setCurrentRole = (role: UserRole) => {
    setCurrentUser((prev) => ({
      ...prev,
      role,
      name:
        role === 'CUSTOMER'
          ? 'Kiran Sharma (Event Host)'
          : role === 'VENUE_OWNER'
          ? 'Suman Shrestha (Regal Pavilion GM)'
          : role === 'EVENT_ORGANIZER'
          ? 'Rohan Shrestha (Shree Celebrations Producer)'
          : role === 'SUPER_ADMIN'
          ? 'Anurag Thapa (Super Admin)'
          : 'Pramila Karki (Settlement Officer)',
    }));
  };

  const createNegotiationOffer = (params: {
    venueId: string;
    venueName: string;
    eventType: EventType;
    dateBS: string;
    dateAD: string;
    shift: any;
    hallId: string;
    guestCount: number;
    proposedPerPlateNpr: number;
    hallRentalNpr: number;
    includedAmenities: string[];
    specialRequests: string;
    subtotalNpr: number;
    serviceChargeNpr: number;
    vatNpr: number;
    totalNpr: number;
  }): string => {
    const threadId = `neg-${Date.now()}`;
    const initialOffer: OfferVersion = {
      version: 1,
      senderRole: 'CUSTOMER',
      senderName: currentUser.name,
      timestamp: new Date().toISOString(),
      dateBS: params.dateBS,
      dateAD: params.dateAD,
      shift: params.shift,
      hallId: params.hallId,
      guestCount: params.guestCount,
      proposedPerPlateNpr: params.proposedPerPlateNpr,
      hallRentalNpr: params.hallRentalNpr,
      includedAmenities: params.includedAmenities,
      specialRequests: params.specialRequests,
      subtotalNpr: params.subtotalNpr,
      serviceChargeNpr: params.serviceChargeNpr,
      vatNpr: params.vatNpr,
      totalNpr: params.totalNpr,
      validUntil: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
      notes: 'Initial quotation offer submitted by customer via UTSAVO.',
    };

    const newThread: NegotiationThread = {
      id: threadId,
      enquiryId: `enq-${Date.now().toString().slice(-4)}`,
      venueId: params.venueId,
      venueName: params.venueName,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      eventType: params.eventType,
      status: 'SUBMITTED_TO_VENUE',
      currentVersion: 1,
      versions: [initialOffer],
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderRole: 'CUSTOMER',
          senderName: currentUser.name,
          text: `Proposed NPR ${params.proposedPerPlateNpr.toLocaleString()} per plate for ${params.guestCount} guests on ${params.dateBS} BS.`,
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setNegotiations((prev) => [newThread, ...prev]);
    setActiveNegotiationId(threadId);
    return threadId;
  };

  const submitCounterOffer = (threadId: string, offerUpdates: Partial<OfferVersion>, message?: string) => {
    setNegotiations((prev) =>
      prev.map((thread) => {
        if (thread.id !== threadId) return thread;

        const latestVersion = thread.versions[thread.versions.length - 1];
        const newVersionNumber = thread.currentVersion + 1;
        const senderRole = currentUser.role === 'VENUE_OWNER' || currentUser.role === 'VENUE_MANAGER' ? 'VENUE' : 'CUSTOMER';

        const newVersion: OfferVersion = {
          ...latestVersion,
          ...offerUpdates,
          version: newVersionNumber,
          senderRole,
          senderName: currentUser.name,
          timestamp: new Date().toISOString(),
          validUntil: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        };

        const updatedMessages = [...thread.messages];
        if (message) {
          updatedMessages.push({
            id: `msg-${Date.now()}`,
            senderRole,
            senderName: currentUser.name,
            text: message,
            timestamp: new Date().toISOString(),
          });
        }

        return {
          ...thread,
          currentVersion: newVersionNumber,
          status: senderRole === 'VENUE' ? 'COUNTER_BY_VENUE' : 'COUNTER_BY_CUSTOMER',
          versions: [...thread.versions, newVersion],
          messages: updatedMessages,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const acceptOffer = (threadId: string) => {
    setNegotiations((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, status: 'ACCEPTED', updatedAt: new Date().toISOString() } : t))
    );
  };

  const rejectOffer = (threadId: string) => {
    setNegotiations((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, status: 'REJECTED', updatedAt: new Date().toISOString() } : t))
    );
  };

  const createBookingFromOffer = (threadId: string): Booking => {
    const thread = negotiations.find((t) => t.id === threadId);
    if (!thread) throw new Error('Negotiation thread not found');
    const latest = thread.versions[thread.versions.length - 1];
    const venue = venues.find((v) => v.id === thread.venueId);
    const hall = venue?.halls.find((h) => h.id === latest.hallId) || venue?.halls[0];

    const bookingRef = `UTS-2081-${Math.floor(1000 + Math.random() * 9000)}`;
    const depositRequired = Math.round(latest.totalNpr * 0.25);
    const commissionAmount = Math.round(latest.totalNpr * 0.05);

    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      bookingRef,
      venueId: thread.venueId,
      venueName: thread.venueName,
      hallId: latest.hallId,
      hallName: hall?.name || 'Main Hall',
      customerId: thread.customerId,
      customerName: thread.customerName,
      customerPhone: thread.customerPhone,
      customerEmail: currentUser.email,
      eventType: thread.eventType,
      eventDateBS: latest.dateBS,
      eventDateAD: latest.dateAD,
      shift: latest.shift,
      guestCount: latest.guestCount,
      agreedPerPlateNpr: latest.proposedPerPlateNpr,
      hallRentalNpr: latest.hallRentalNpr,
      totalAmountNpr: latest.totalNpr,
      depositRequiredNpr: depositRequired,
      depositPaidNpr: 0,
      balanceDueNpr: latest.totalNpr,
      status: 'ON_HOLD',
      selectedMenuSummary: latest.includedAmenities,
      signedAgreementHash: '',
      createdAt: new Date().toISOString(),
      commissionRatePercent: 5.0,
      commissionAmountNpr: commissionAmount,
      settlementStatus: 'PENDING',
    };

    setBookings((prev) => [newBooking, ...prev]);
    setActiveBookingId(newBooking.id);
    return newBooking;
  };

  const signAgreement = (bookingId: string) => {
    const agreementHash = `sha256:${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              signedAgreementHash: agreementHash,
              agreementSignedAt: new Date().toISOString(),
            }
          : b
      )
    );
  };

  const processPayment = async (params: {
    bookingId: string;
    paymentMethod: 'ESEWA' | 'KHALTI' | 'FONEPAY' | 'BANK_TRANSFER';
    amountNpr: number;
    transactionId: string;
  }): Promise<boolean> => {
    // Simulated server-side payment confirmation & transaction verification
    await new Promise((res) => setTimeout(res, 800));

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== params.bookingId) return b;
        const newDeposit = b.depositPaidNpr + params.amountNpr;
        const newBalance = Math.max(0, b.totalAmountNpr - newDeposit);
        const newStatus = newDeposit >= b.depositRequiredNpr ? 'CONFIRMED' : 'ON_HOLD';

        return {
          ...b,
          depositPaidNpr: newDeposit,
          balanceDueNpr: newBalance,
          status: newStatus,
          paymentDetails: {
            paymentMethod: params.paymentMethod,
            transactionId: params.transactionId,
            paidAmountNpr: params.amountNpr,
            paidAt: new Date().toISOString(),
            verifiedServerSide: true,
          },
        };
      })
    );
    return true;
  };

  const updateVenueListing = (updatedVenue: Venue) => {
    setVenues((prev) => prev.map((v) => (v.id === updatedVenue.id ? updatedVenue : v)));
  };

  const saveVenueListing = (venue: Venue) => {
    setVenues((prev) => {
      const idx = prev.findIndex((v) => v.id === venue.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = venue;
        return copy;
      } else {
        return [venue, ...prev];
      }
    });
  };

  const createWalkInBooking = (bookingData: Partial<Booking>) => {
    const bookingRef = `UTS-OFFLINE-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullBooking: Booking = {
      id: `book-offline-${Date.now()}`,
      bookingRef,
      venueId: currentUser.assignedVenueId || 'venue-regal-pavilion-ktm',
      venueName: 'The Regal Pavilion & Heritage Banquet',
      hallId: bookingData.hallId || 'regal-kailash-hall',
      hallName: bookingData.hallName || 'Grand Kailash Ballroom',
      customerId: 'walk-in-customer',
      customerName: bookingData.customerName || 'Walk-In Host',
      customerPhone: bookingData.customerPhone || '+977-9800000000',
      customerEmail: bookingData.customerEmail || 'walkin@example.com',
      eventType: bookingData.eventType || 'WEDDING',
      eventDateBS: bookingData.eventDateBS || '2081 Mangsir 20',
      eventDateAD: bookingData.eventDateAD || '2024-12-05',
      shift: bookingData.shift || 'DAY',
      guestCount: bookingData.guestCount || 350,
      agreedPerPlateNpr: bookingData.agreedPerPlateNpr || 1600,
      hallRentalNpr: bookingData.hallRentalNpr || 60000,
      totalAmountNpr: bookingData.totalAmountNpr || 700000,
      depositRequiredNpr: Math.round((bookingData.totalAmountNpr || 700000) * 0.25),
      depositPaidNpr: bookingData.depositPaidNpr || 175000,
      balanceDueNpr: (bookingData.totalAmountNpr || 700000) - (bookingData.depositPaidNpr || 175000),
      status: 'CONFIRMED',
      selectedMenuSummary: ['Custom Walk-in Banquet Package'],
      signedAgreementHash: 'OFFLINE_COUNTER_RECEIPT',
      createdAt: new Date().toISOString(),
      commissionRatePercent: 5.0,
      commissionAmountNpr: Math.round((bookingData.totalAmountNpr || 700000) * 0.05),
      settlementStatus: 'PENDING',
    };

    setBookings((prev) => [fullBooking, ...prev]);
  };

  const verifyVenueStatus = (venueId: string, newStatus: any) => {
    setVenues((prev) => prev.map((v) => (v.id === venueId ? { ...v, verificationStatus: newStatus } : v)));
  };

  const addVerifiedReview = (reviewData: Omit<VerifiedReview, 'id' | 'createdAt'>) => {
    const newRev: VerifiedReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [newRev, ...prev]);
  };

  return (
    <MarketplaceContext.Provider
      value={{
        currentUser,
        setCurrentRole,
        venues,
        organizers,
        selectedOrganizer,
        setSelectedOrganizer,
        editingOrganizer,
        saveOrganizer,
        openOrganizerRegistration,
        negotiations,
        bookings,
        reviews,
        filters,
        setFilters,
        resetFilters,
        selectedVenue,
        setSelectedVenue,
        createNegotiationOffer,
        submitCounterOffer,
        acceptOffer,
        rejectOffer,
        createBookingFromOffer,
        signAgreement,
        processPayment,
        updateVenueListing,
        saveVenueListing,
        openVenueOnboarding,
        editingVenue,
        createWalkInBooking,
        verifyVenueStatus,
        addVerifiedReview,
        activeModal,
        setActiveModal,
        activeNegotiationId,
        setActiveNegotiationId,
        activeBookingId,
        setActiveBookingId,
        savedVenueIds,
        savedVendorIds,
        toggleSaveVenue,
        isVenueSaved,
        removeSavedVenue,
        toggleSaveVendor,
        isVendorSaved,
        removeSavedVendor,
        customerDashboardTab,
        setCustomerDashboardTab,
        culturalVendors,
        addCulturalVendor,
        customCategories,
        proposeCustomCategory,
        reviewCustomCategory,
        destinationHotels,
        destinationVendors,
        addDestinationHotel,
        addDestinationVendorService,
        eventStaffPool,
        addEventStaffProfile,
        toggleStaffAvailability,
        addStaffReview,
        govtDirectives,
        applyGovtDirective,
        dismissGovtDirective,
        statutoryRules,
        updateStatutoryRules,
        staffCustomRoles,
        proposeStaffCustomRole,
        reviewStaffCustomRole,
        socialPosts,
        addSocialPost,
        likeSocialPost,
        quickPeekVenueId,
        setQuickPeekVenueId,
        panchangaPreferences,
        updatePanchangaPreferences,
        pushAlerts,
        activePushToast,
        dismissPushToast,
        markAlertAsRead,
        clearAllAlerts,
        simulatePushAlert,
        unreadAlertsCount,
        favoriteVenueAlerts,
        unreadFavoriteVenueAlertsCount,
        sseConnectionStatus,
        isScanningFavoriteVenues,
        lastFavoriteScanMessage,
        activeFavoriteVenueToast,
        dismissFavoriteVenueToast,
        markFavoriteVenueAlertRead,
        scanFavoriteVenueAvailability,
        publishFavoriteVenueAlert,
        foodRescuePledges,
        addFoodRescuePledge,
        updateFoodRescueConsent,
        updateFoodRescueStatus,
        vendorPolicies,
        getVendorCancellationPolicy,
        updateVendorCancellationPolicy,
        referralOffers,
        createVendorReferralOffer,
        respondToReferralOffer,
        cancellationRecords,
        cancelBookingWithPolicy,
        starHotelRequests,
        submitStarHotelRequest,
        updateStarHotelRequestByAdmin,
        publishStarHotelAsVenue,
        outsideNepalRequests,
        submitOutsideNepalRequest,
        updateOutsideNepalRequestByAdmin,
        managedEventRequests,
        submitManagedEventRequest,
        updateManagedEventByClient,
        sendManagedEventMessage,
        updateManagedEventByAdmin,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) throw new Error('useMarketplace must be used within MarketplaceProvider');
  return context;
};
