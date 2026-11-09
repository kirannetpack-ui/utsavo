/**
 * UTSAVO - Customer & Event Organizer Dashboard
 * Section 12: Upcoming celebrations, active negotiations, signed contracts, verified reviews,
 * and Bookmarked 'Saved Venues & Vendors' Management
 */

import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { initialCulturalVendors } from '../data/culturalVendorsData';
import { VenueImageVisual } from './VenueImageVisual';
import { WhatsAppViberButtons } from './WhatsAppViberButtons';
import { createVenueInquiryMessage, createVendorInquiryMessage } from '../utils/communication';
import {
  Calendar,
  Clock,
  ShieldCheck,
  FileText,
  Star,
  ArrowRight,
  CreditCard,
  MessageSquare,
  CheckCircle,
  Bookmark,
  Trash2,
  MapPin,
  Users,
  Car,
  Zap,
  Sparkles,
  Building2,
  Music,
  ExternalLink,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Flame,
  Check,
  X,
  Columns
} from 'lucide-react';

interface CustomerDashboardProps {
  onOpenReviewModal: (bookingId: string, venueId: string) => void;
  onNavigateView?: (view: 'EXPLORE' | 'ORGANIZERS' | 'VENDORS' | 'NIMANTRANA' | 'DASHBOARD' | 'DESTINATION' | 'STAFF_POOL') => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onOpenReviewModal,
  onNavigateView,
}) => {
  const { language, t } = useLanguage();
  const {
    currentUser,
    venues,
    bookings,
    negotiations,
    setActiveModal,
    setActiveNegotiationId,
    setActiveBookingId,
    setSelectedVenue,
    savedVenueIds,
    savedVendorIds,
    removeSavedVenue,
    removeSavedVendor,
    customerDashboardTab,
    setCustomerDashboardTab,
  } = useMarketplace();

  // Internal tab state synced with context
  const activeTab = customerDashboardTab;
  const setActiveTab = setCustomerDashboardTab;

  // Filter state inside SAVED tab
  const [savedFilterCategory, setSavedFilterCategory] = useState<'ALL' | 'VENUES' | 'VENDORS'>('ALL');
  const [savedSearchQuery, setSavedSearchQuery] = useState('');
  const [showComparisonMatrix, setShowComparisonMatrix] = useState(false);

  const myBookings = bookings;
  const myNegotiations = negotiations;

  // Resolve saved venue objects
  const savedVenues = useMemo(() => {
    return venues.filter((v) => savedVenueIds.includes(v.id));
  }, [venues, savedVenueIds]);

  // Resolve saved cultural vendors objects
  const savedVendors = useMemo(() => {
    return initialCulturalVendors.filter((v) => savedVendorIds.includes(v.id));
  }, [savedVendorIds]);

  // Filtered saved venues by search query
  const filteredSavedVenues = useMemo(() => {
    if (!savedSearchQuery.trim()) return savedVenues;
    const q = savedSearchQuery.toLowerCase().trim();
    return savedVenues.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        (v.nepaliName && v.nepaliName.includes(q)) ||
        v.district.toLowerCase().includes(q) ||
        v.locality.toLowerCase().includes(q)
    );
  }, [savedVenues, savedSearchQuery]);

  // Filtered saved vendors by search query
  const filteredSavedVendors = useMemo(() => {
    if (!savedSearchQuery.trim()) return savedVendors;
    const q = savedSearchQuery.toLowerCase().trim();
    return savedVendors.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        (v.nepaliName && v.nepaliName.includes(q)) ||
        v.district.toLowerCase().includes(q) ||
        v.bio.toLowerCase().includes(q) ||
        v.leaderOrContact.toLowerCase().includes(q)
    );
  }, [savedVendors, savedSearchQuery]);

  const totalSavedCount = savedVenueIds.length + savedVendorIds.length;

  return (
    <div className="space-y-6">
      
      {/* Dashboard Top Welcome Banner */}
      <div className="p-6 bg-white rounded-3xl border border-stone-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{language === 'ne' ? 'ग्राहक तथा आयोजक ड्यासबोर्ड' : 'Customer & Event Host Portal'}</span>
          </span>
          <h2 className="font-display text-2xl font-bold text-stone-900 mt-1">
            Namaste, {currentUser.name}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage your booked banquet agreements, negotiations, and your bookmarked party palaces & vendors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1 bg-stone-100 rounded-2xl border border-stone-200 text-xs font-semibold flex flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('BOOKINGS')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'BOOKINGS'
                  ? 'bg-white text-stone-900 shadow-sm font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              My Bookings ({myBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('NEGOTIATIONS')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'NEGOTIATIONS'
                  ? 'bg-white text-stone-900 shadow-sm font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Active Negotiations ({myNegotiations.length})
            </button>
            <button
              onClick={() => setActiveTab('SAVED')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'SAVED'
                  ? 'bg-amber-900 text-white shadow-sm font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${activeTab === 'SAVED' ? 'fill-amber-300 text-amber-300' : 'text-amber-800'}`} />
              <span>{language === 'ne' ? 'सुरक्षित भेन्यु तथा सेवा' : 'Saved Venues & Vendors'}</span>
              <span
                className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'SAVED' ? 'bg-amber-800 text-amber-200' : 'bg-stone-200 text-stone-700'
                }`}
              >
                {totalSavedCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: BOOKINGS & AGREEMENTS */}
      {activeTab === 'BOOKINGS' && (
        <div className="space-y-4">
          {myBookings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 p-6">
              <Calendar className="w-10 h-10 text-stone-400 mx-auto mb-2" />
              <h4 className="font-bold text-stone-800 text-sm">No Active Bookings Yet</h4>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Explore venues, check Panchanga auspicious dates, and submit a banquet negotiation proposal to book your celebration.
              </p>
              {onNavigateView && (
                <button
                  onClick={() => onNavigateView('EXPLORE')}
                  className="mt-4 px-4 py-2 bg-amber-900 text-white rounded-xl text-xs font-semibold"
                >
                  Browse Party Palaces →
                </button>
              )}
            </div>
          ) : (
            myBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold font-mono text-stone-400">#{b.bookingRef}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        b.status === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'COMPLETED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {b.status}
                    </span>
                    <span className="text-xs font-semibold text-amber-950 px-2 py-0.5 bg-amber-50 rounded">
                      {b.eventType}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-stone-900">
                      {b.venueName}
                    </h3>
                    <div className="text-xs text-stone-500">
                      Hall: <strong>{b.hallName}</strong> · Reserved for: <strong>{b.guestCount} guests</strong>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600">
                    <span className="flex items-center gap-1 text-amber-950 font-bold">
                      <Calendar className="w-3.5 h-3.5 text-amber-700" />
                      <span>{b.eventDateBS} BS ({b.eventDateAD} AD)</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{b.shift} Shift</span>
                    </span>
                  </div>
                </div>

                {/* Financial Snapshot & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t md:border-t-0 md:border-l border-stone-100 pt-4 md:pt-0 md:pl-6">
                  <div className="text-left sm:text-right text-xs">
                    <span className="text-stone-400 block text-[11px]">Total Agreed Consideration</span>
                    <span className="text-base font-bold font-display text-amber-950 tabular-nums block">
                      NPR {b.totalAmountNpr.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-stone-500 tabular-nums">
                      Paid: <strong className="text-emerald-700">NPR {b.depositPaidNpr.toLocaleString()}</strong> · Due: NPR {b.balanceDueNpr.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setActiveBookingId(b.id);
                        setActiveModal('AGREEMENT');
                      }}
                      className="px-4 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Agreement</span>
                    </button>

                    {b.depositPaidNpr === 0 && (
                      <button
                        onClick={() => {
                          setActiveBookingId(b.id);
                          setActiveModal('PAYMENT');
                        }}
                        className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay Deposit</span>
                      </button>
                    )}

                    {b.status === 'COMPLETED' && (
                      <button
                        onClick={() => onOpenReviewModal(b.id, b.venueId)}
                        className="px-4 py-2 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-600" />
                        <span>Write Verified Review</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: ACTIVE NEGOTIATIONS */}
      {activeTab === 'NEGOTIATIONS' && (
        <div className="space-y-4">
          {myNegotiations.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 p-6">
              <MessageSquare className="w-10 h-10 text-stone-400 mx-auto mb-2" />
              <h4 className="font-bold text-stone-800 text-sm">No Active Negotiations</h4>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Negotiate per-plate catering rates and hall rentals directly with verified venue operators.
              </p>
              {onNavigateView && (
                <button
                  onClick={() => onNavigateView('EXPLORE')}
                  className="mt-4 px-4 py-2 bg-amber-900 text-white rounded-xl text-xs font-semibold"
                >
                  Start Venue Discovery →
                </button>
              )}
            </div>
          ) : (
            myNegotiations.map((neg) => {
              const latest = neg.versions[neg.versions.length - 1];

              return (
                <div
                  key={neg.id}
                  className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-stone-400">Enquiry #{neg.enquiryId}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          neg.status === 'COUNTER_BY_VENUE'
                            ? 'bg-amber-100 text-amber-900'
                            : neg.status === 'ACCEPTED'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {neg.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-stone-400">· Version {neg.currentVersion}</span>
                    </div>

                    <h3 className="text-base font-bold text-stone-900">
                      {neg.venueName}
                    </h3>
                    <div className="text-xs text-stone-600">
                      Proposed Rate: <strong>NPR {latest.proposedPerPlateNpr.toLocaleString()} / plate</strong> · Guaranteed: <strong>{latest.guestCount} guests</strong>
                    </div>

                    <div className="text-xs text-stone-500">
                      Target Date: {latest.dateBS} BS · Shift: {latest.shift}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right text-xs">
                      <span className="text-stone-400 block text-[11px]">Binding Total Amount</span>
                      <span className="text-base font-bold font-display text-amber-950 tabular-nums">
                        NPR {latest.totalNpr.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveNegotiationId(neg.id);
                        setActiveModal('NEGOTIATION');
                      }}
                      className="px-4 py-2.5 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-950 rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <span>Open Negotiation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 3: SAVED VENUES & EVENT VENDORS */}
      {activeTab === 'SAVED' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Controls Bar: Sub-category filter, search, & comparison matrix toggle */}
          <div className="p-4 sm:p-5 bg-white rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setSavedFilterCategory('ALL')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  savedFilterCategory === 'ALL'
                    ? 'bg-amber-900 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                All Bookmarks ({totalSavedCount})
              </button>
              <button
                onClick={() => setSavedFilterCategory('VENUES')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  savedFilterCategory === 'VENUES'
                    ? 'bg-amber-900 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Party Palaces ({savedVenues.length})</span>
              </button>
              <button
                onClick={() => setSavedFilterCategory('VENDORS')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  savedFilterCategory === 'VENDORS'
                    ? 'bg-amber-900 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span>Artists & Vendors ({savedVendors.length})</span>
              </button>
            </div>

            {/* Search Input & Comparison Toggle */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-60">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-stone-400" />
                <input
                  type="text"
                  value={savedSearchQuery}
                  onChange={(e) => setSavedSearchQuery(e.target.value)}
                  placeholder="Filter saved by name or district..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-800"
                />
              </div>

              {savedVenues.length >= 2 && (
                <button
                  onClick={() => setShowComparisonMatrix(!showComparisonMatrix)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 border ${
                    showComparisonMatrix
                      ? 'bg-amber-100 text-amber-950 border-amber-300'
                      : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                  }`}
                  title="Compare saved party palaces side-by-side"
                >
                  <Columns className="w-3.5 h-3.5 text-amber-800" />
                  <span>{showComparisonMatrix ? 'Hide Comparison' : 'Compare Venues'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Side-by-Side Comparison Matrix for Saved Venues */}
          {showComparisonMatrix && savedVenues.length >= 2 && (
            <div className="p-5 bg-gradient-to-br from-amber-50/70 via-white to-orange-50/60 rounded-3xl border border-amber-200 shadow-sm space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-display text-base font-bold text-amber-950 flex items-center gap-1.5">
                    <Columns className="w-4 h-4 text-amber-800" />
                    <span>Side-by-Side Comparison of Saved Venues</span>
                  </h4>
                  <p className="text-[11px] text-stone-600">
                    Compare guest capacity, per-plate pricing, hall rental, and verified amenities to make an informed booking decision.
                  </p>
                </div>
                <button
                  onClick={() => setShowComparisonMatrix(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-amber-200/80 bg-amber-100/50">
                      <th className="p-2.5 font-bold text-amber-950">Specification</th>
                      {savedVenues.map((v) => (
                        <th key={v.id} className="p-2.5 font-bold text-amber-950 min-w-[160px]">
                          <div className="truncate">{v.name}</div>
                          <div className="text-[10px] font-normal text-stone-500">{v.locality}, {v.district}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100/60 text-stone-700">
                    <tr>
                      <td className="p-2.5 font-semibold text-stone-900">Rating & Reviews</td>
                      {savedVenues.map((v) => (
                        <td key={v.id} className="p-2.5">
                          <span className="font-bold text-amber-950">{v.rating.toFixed(1)} ★</span>
                          <span className="text-[10px] text-stone-500 ml-1">({v.reviewCount})</span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-stone-900">Max Guest Capacity</td>
                      {savedVenues.map((v) => (
                        <td key={v.id} className="p-2.5 font-bold text-stone-900">
                          {v.minGuests} – {v.maxGuests} Guests
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-stone-900">Catering (Per Plate)</td>
                      {savedVenues.map((v) => (
                        <td key={v.id} className="p-2.5 font-bold text-amber-950">
                          Rs. {v.cateringStartingNpr.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-stone-900">Base Hall Rental</td>
                      {savedVenues.map((v) => (
                        <td key={v.id} className="p-2.5">
                          Rs. {v.baseRentalStartingNpr.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-stone-900">Dedicated Mandap</td>
                      {savedVenues.map((v) => (
                        <td key={v.id} className="p-2.5">
                          {v.hasMandapSetup ? (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Yes
                            </span>
                          ) : (
                            <span className="text-stone-400">No</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-stone-900">Power Backup (Genset)</td>
                      {savedVenues.map((v) => (
                        <td key={v.id} className="p-2.5">
                          {v.hasPowerBackup ? (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> 100% Backup
                            </span>
                          ) : (
                            <span className="text-stone-400">Limited</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-stone-900">Car Parking Space</td>
                      {savedVenues.map((v) => (
                        <td key={v.id} className="p-2.5 font-medium">
                          {v.parkingCapacityCars} Cars / {v.parkingCapacityBikes} Bikes
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-stone-900">Outside Planners</td>
                      {savedVenues.map((v) => (
                        <td key={v.id} className="p-2.5">
                          {v.eventManagementPolicy?.allowsOutsideOrganizers ? (
                            <span className="text-blue-700 font-semibold">Allowed</span>
                          ) : (
                            <span className="text-stone-500">In-house Only</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-stone-900">Quick Actions</td>
                      {savedVenues.map((v) => (
                        <td key={v.id} className="p-2.5">
                          <button
                            onClick={() => setSelectedVenue(v)}
                            className="px-3 py-1 bg-amber-900 hover:bg-amber-950 text-white rounded-lg text-[11px] font-semibold transition-colors"
                          >
                            Explore Halls & Menu →
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section A: Saved Party Palaces & Banquets */}
          {(savedFilterCategory === 'ALL' || savedFilterCategory === 'VENUES') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-amber-800" />
                    <span>Saved Party Palaces & Celebration Venues ({filteredSavedVenues.length})</span>
                  </h3>
                  <p className="text-xs text-stone-500">
                    Bookmarked banquets with instant Panchanga shift availability and direct owner communication.
                  </p>
                </div>
              </div>

              {filteredSavedVenues.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-3xl border border-stone-200">
                  <Bookmark className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-stone-700">No party palaces saved yet.</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Browse our nationwide verified party palaces and tap the bookmark icon to save your top choices here.
                  </p>
                  {onNavigateView && (
                    <button
                      onClick={() => onNavigateView('EXPLORE')}
                      className="mt-3 px-4 py-2 bg-amber-900 text-white rounded-xl text-xs font-bold"
                    >
                      Browse Party Palaces →
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSavedVenues.map((venue) => (
                    <div
                      key={venue.id}
                      className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Visual Header */}
                        <div className="relative">
                          <VenueImageVisual type={venue.coverImage} name={venue.name} className="h-44 w-full" />
                          
                          {/* Verified Badge */}
                          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-semibold text-amber-950 flex items-center gap-1 shadow-sm">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{t('verifiedBadge')}</span>
                          </div>

                          {/* Top Right: Rating & Remove Bookmark */}
                          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                            <div className="bg-stone-900/80 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 shadow-xs">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span className="tabular-nums">{venue.rating.toFixed(1)}</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeSavedVenue(venue.id)}
                              aria-label="Remove from saved"
                              title="Remove from saved bookmarks"
                              className="p-1.5 rounded-md bg-stone-900/80 hover:bg-rose-900 text-stone-300 hover:text-white backdrop-blur-md transition-colors shadow-xs cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-4 space-y-2.5">
                          <div className="flex items-center gap-1.5 text-xs text-stone-500">
                            <MapPin className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                            <span className="truncate">{venue.locality}, {venue.district}</span>
                            <span>·</span>
                            <span className="text-stone-400 text-[11px]">{venue.province}</span>
                          </div>

                          <div>
                            <h4 className="font-display text-base font-bold text-stone-900 group-hover:text-amber-900 transition-colors line-clamp-1">
                              {venue.name}
                            </h4>
                            <p className="text-xs text-stone-500 font-medium line-clamp-1">
                              {venue.nepaliName}
                            </p>
                          </div>

                          {/* Capacity & Pricing Snapshot */}
                          <div className="grid grid-cols-2 gap-2 p-2.5 bg-stone-50 rounded-2xl border border-stone-100 text-xs">
                            <div>
                              <span className="text-[10px] text-stone-400 block font-medium">Capacity</span>
                              <span className="font-bold text-stone-800">
                                {venue.minGuests}–{venue.maxGuests} Guests
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-stone-400 block font-medium">Starting Plate</span>
                              <span className="font-bold text-amber-950 font-display">
                                Rs. {venue.cateringStartingNpr.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* Amenities Badges */}
                          <div className="flex flex-wrap items-center gap-1 text-[10px]">
                            {venue.hasMandapSetup && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 font-medium">
                                ✓ Mandap
                              </span>
                            )}
                            {venue.hasPowerBackup && (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-medium">
                                ✓ 100% Genset
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium">
                              {venue.parkingCapacityCars}+ Cars
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="p-4 pt-0 space-y-2">
                        <button
                          onClick={() => setSelectedVenue(venue)}
                          className="w-full py-2 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <span>Explore Halls, Menu & Shifts</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                          <span className="text-[10px] font-semibold text-stone-400">Direct Chat:</span>
                          <WhatsAppViberButtons
                            phone={venue.phone}
                            messageText={createVenueInquiryMessage(venue.name, 'Subha Muhurat Booking', 'Upcoming BS Date', venue.minGuests || 300)}
                            variant="badges"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Section B: Saved Cultural Artists & Specialized Vendors */}
          {(savedFilterCategory === 'ALL' || savedFilterCategory === 'VENDORS') && (
            <div className="space-y-4 pt-4 border-t border-stone-200/80">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Music className="w-5 h-5 text-amber-800" />
                    <span>Saved Cultural Artists & Specialized Talent ({filteredSavedVendors.length})</span>
                  </h3>
                  <p className="text-xs text-stone-500">
                    Bookmarked Panche Baja, Dhime ensembles, Vedic Acharyas, Photographers, and Bridal stylists.
                  </p>
                </div>
              </div>

              {filteredSavedVendors.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-3xl border border-stone-200">
                  <Music className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-stone-700">No cultural artists or vendors saved yet.</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Explore master Panche Baja bands, certified Vedic Acharyas, and cinematographers to save your favorites.
                  </p>
                  {onNavigateView && (
                    <button
                      onClick={() => onNavigateView('VENDORS')}
                      className="mt-3 px-4 py-2 bg-amber-900 text-white rounded-xl text-xs font-bold"
                    >
                      Browse Cultural Artists →
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSavedVendors.map((vendor) => {
                    const inquiryMessage = createVendorInquiryMessage(
                      vendor.name,
                      vendor.category.replace(/_/g, ' '),
                      'Upcoming Subha Muhurat Celebration',
                      vendor.district
                    );

                    return (
                      <div
                        key={vendor.id}
                        className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                      >
                        <div>
                          {/* Image & Badges */}
                          <div className="relative h-44 bg-stone-100 overflow-hidden">
                            <img
                              src={vendor.portfolioImages[0]}
                              alt={vendor.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                            <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold shadow-xs">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Verified Guild</span>
                            </div>

                            <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-amber-400 text-xs font-bold shadow-xs">
                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                <span>{vendor.rating}</span>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeSavedVendor(vendor.id)}
                                aria-label="Remove from saved"
                                title="Remove from saved artists"
                                className="p-1.5 rounded-full bg-stone-900/80 hover:bg-rose-900 text-stone-300 hover:text-white backdrop-blur-md transition-colors shadow-xs cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="absolute bottom-3 left-3 right-3 text-white">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-400/40">
                                {vendor.category.replace(/_/g, ' ')}
                              </span>
                              <h4 className="font-display text-base font-bold truncate mt-1">
                                {vendor.name}
                              </h4>
                            </div>
                          </div>

                          {/* Body Content */}
                          <div className="p-4 space-y-2.5">
                            <div className="flex items-center gap-3 text-xs text-stone-500">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                                <span>{vendor.district}, {vendor.province}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-stone-400" />
                                <span>{vendor.yearsOfExperience} yrs exp</span>
                              </div>
                            </div>

                            <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                              {vendor.bio}
                            </p>

                            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 flex items-center justify-between text-xs">
                              <span className="text-[10px] font-medium text-stone-500 uppercase">Starting Rate</span>
                              <span className="font-bold text-amber-900 font-display">
                                Rs. {vendor.startingPriceNpr.toLocaleString()} / event
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-4 pt-0 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold text-stone-400">Direct Chat:</span>
                            <WhatsAppViberButtons
                              phone={vendor.phone}
                              messageText={inquiryMessage}
                              variant="badges"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Overall Empty State if absolutely nothing is saved */}
          {totalSavedCount === 0 && (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 max-w-lg mx-auto shadow-xs">
              <div className="w-14 h-14 bg-amber-50 text-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-amber-200">
                <Bookmark className="w-7 h-7 text-amber-800" />
              </div>
              <h3 className="font-display text-xl font-bold text-stone-900">
                {language === 'ne' ? 'तपाईंले कुनै भेन्यु वा सेवा सुरक्षित गर्नुभएको छैन' : 'No Saved Venues or Vendors Yet'}
              </h3>
              <p className="text-xs text-stone-500 mt-2 max-w-sm mx-auto leading-relaxed">
                {language === 'ne'
                  ? 'पार्टी प्यालेस, ब्यान्क्वेट तथा सांस्कृतिक कलाकारहरूको सूची हेर्दा बुकमार्क आइकन (🔖) थिच्नुहोस्। यसले तपाईंलाई छिटो तुलना गर्न मद्दत गर्नेछ।'
                  : 'While exploring party palaces and cultural artists, tap the bookmark icon to save your favorites here for side-by-side comparison and instant booking.'}
              </p>
              {onNavigateView && (
                <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                  <button
                    onClick={() => onNavigateView('EXPLORE')}
                    className="px-4 py-2 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                  >
                    Explore Venues
                  </button>
                  <button
                    onClick={() => onNavigateView('VENDORS')}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Explore Cultural Artists
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
