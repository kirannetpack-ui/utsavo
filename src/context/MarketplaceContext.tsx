/**
 * UTSAVO - Marketplace State & Persistence Context
 * Central engine governing venues, negotiations, bookings, agreements, and role switching
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
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
} from '../types';
import { SEED_VENUES } from '../data/venuesData';
import { SEED_BOOKINGS, SEED_NEGOTIATIONS, SEED_REVIEWS } from '../data/seedMarketplaceState';
import { SEED_EVENT_ORGANIZERS } from '../data/organizersData';
import { initialCulturalVendors } from '../data/culturalVendorsData';
import { SEED_DESTINATION_HOTELS, SEED_DESTINATION_VENDOR_SERVICES } from '../data/destinationVendorsData';

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
  activeModal: 'NONE' | 'SMART_PLANNER' | 'PANCHANGA_CALENDAR' | 'NEGOTIATION' | 'AGREEMENT' | 'PAYMENT' | 'REVIEW' | 'VENUE_ONBOARDING' | 'EVENT_ORGANIZER_REGISTER';
  setActiveModal: (modal: 'NONE' | 'SMART_PLANNER' | 'PANCHANGA_CALENDAR' | 'NEGOTIATION' | 'AGREEMENT' | 'PAYMENT' | 'REVIEW' | 'VENUE_ONBOARDING' | 'EVENT_ORGANIZER_REGISTER') => void;
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
  customerDashboardTab: 'BOOKINGS' | 'NEGOTIATIONS' | 'SAVED';
  setCustomerDashboardTab: (tab: 'BOOKINGS' | 'NEGOTIATIONS' | 'SAVED') => void;

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
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-current',
  name: 'Kiran Sharma',
  email: 'kiran.sharma@example.com',
  phone: '+977-9851098421',
  role: 'CUSTOMER',
  avatar: '',
  assignedVenueId: 'venue-regal-pavilion-ktm',
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

  const [activeModal, setActiveModal] = useState<'NONE' | 'SMART_PLANNER' | 'PANCHANGA_CALENDAR' | 'NEGOTIATION' | 'AGREEMENT' | 'PAYMENT' | 'REVIEW' | 'VENUE_ONBOARDING' | 'EVENT_ORGANIZER_REGISTER'>('NONE');
  const [activeNegotiationId, setActiveNegotiationId] = useState<string | null>(null);
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [customerDashboardTab, setCustomerDashboardTab] = useState<'BOOKINGS' | 'NEGOTIATIONS' | 'SAVED'>('BOOKINGS');

  // Bookmarking: Saved Venues & Event Vendors
  const [savedVenueIds, setSavedVenueIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('utsavo_saved_venues');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to parse saved venues from localStorage', e);
      }
    }
    return ['venue-regal-pavilion-ktm', 'venue-heritage-garden-sanepa'];
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
