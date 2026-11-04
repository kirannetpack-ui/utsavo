/**
 * UTSAVO - Venue Detail & Multi-Hall Modal
 * Overview, Hall Spaces, Live Shift Calendar, Menu Customizer & Verified Reviews
 */

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { HallSpace, Venue } from '../types';
import { VenueImageVisual } from './VenueImageVisual';
import { MenuCustomizer } from './MenuCustomizer';
import {
  X,
  MapPin,
  ShieldCheck,
  Star,
  Users,
  Car,
  Zap,
  Flame,
  Calendar,
  Utensils,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  Building,
} from 'lucide-react';

export const VenueDetailModal: React.FC = () => {
  const { language, t } = useLanguage();
  const {
    selectedVenue,
    setSelectedVenue,
    reviews,
    createNegotiationOffer,
    setActiveModal,
    setActiveNegotiationId,
  } = useMarketplace();

  if (!selectedVenue) return null;

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'MENU_ENGINE' | 'CALENDAR' | 'REVIEWS'>('OVERVIEW');
  const [selectedHall, setSelectedHall] = useState<HallSpace>(selectedVenue.halls[0]);
  const [selectedShift, setSelectedShift] = useState<'MORNING' | 'DAY' | 'EVENING' | 'FULL_DAY'>('DAY');
  const [selectedDateBS, setSelectedDateBS] = useState<string>('2081 Mangsir 18');
  const [selectedDateAD, setSelectedDateAD] = useState<string>('2024-12-03');

  // Venue-specific verified reviews
  const venueReviews = reviews.filter((r) => r.venueId === selectedVenue.id);

  const handleProceedToNegotiation = (quotationData: any) => {
    const threadId = createNegotiationOffer({
      venueId: selectedVenue.id,
      venueName: selectedVenue.name,
      eventType: 'WEDDING',
      dateBS: selectedDateBS,
      dateAD: selectedDateAD,
      shift: selectedShift,
      hallId: selectedHall.id,
      guestCount: quotationData.guestCount,
      proposedPerPlateNpr: quotationData.effectivePerPlateNpr,
      hallRentalNpr: quotationData.hallRentalNpr,
      includedAmenities: quotationData.selectedItemNames,
      specialRequests: 'Initial quotation proposal submitted with customized banquet menu.',
      subtotalNpr: quotationData.rawSubtotalNpr,
      serviceChargeNpr: quotationData.serviceChargeNpr,
      vatNpr: quotationData.vatNpr,
      totalNpr: quotationData.totalNpr,
    });

    setActiveNegotiationId(threadId);
    setActiveModal('NEGOTIATION');
    setSelectedVenue(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Visual Bar */}
        <div className="relative">
          <VenueImageVisual type={selectedVenue.coverImage} name={selectedVenue.name} className="h-44 sm:h-52 w-full" />
          
          <button
            onClick={() => setSelectedVenue(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-end justify-between gap-3 text-white">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Business · PAN: {selectedVenue.panNumber}</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold drop-shadow">
                {selectedVenue.name}
              </h2>
              <p className="text-xs text-stone-200">{selectedVenue.locality}, {selectedVenue.district}, {selectedVenue.province}</p>
            </div>

            <div className="bg-stone-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-right">
              <div className="text-[11px] text-stone-300">Customer Rating</div>
              <div className="text-base font-bold text-amber-400 flex items-center gap-1 justify-end">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{selectedVenue.rating.toFixed(1)}</span>
                <span className="text-xs text-stone-300 font-normal">({selectedVenue.reviewCount} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-3 bg-stone-100 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-stone-200/80 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('OVERVIEW')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'OVERVIEW' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t('tabOverview')}
            </button>
            <button
              onClick={() => setActiveTab('MENU_ENGINE')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                activeTab === 'MENU_ENGINE' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Utensils className="w-3.5 h-3.5 text-amber-800" />
              <span>{t('tabMenuCustomizer')}</span>
            </button>
            <button
              onClick={() => setActiveTab('CALENDAR')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                activeTab === 'CALENDAR' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-amber-800" />
              <span>{t('tabAvailability')}</span>
            </button>
            <button
              onClick={() => setActiveTab('REVIEWS')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'REVIEWS' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t('tabReviews')} ({venueReviews.length})
            </button>
          </div>

          <div className="text-xs text-stone-500">
            Response Rate: <strong className="text-stone-800">{selectedVenue.responseRatePercent}%</strong>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 max-h-[60vh]">
          
          {/* TAB 1: OVERVIEW & HALLS */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              {/* About description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                  About the Venue
                </h4>
                <p className="text-sm text-stone-700 leading-relaxed">
                  {selectedVenue.tagline} Located at {selectedVenue.address}. Managed with high-quality banquet operations, power redundancy, and full Nepali and continental catering.
                </p>
              </div>

              {/* Multiple Halls Picker */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Available Halls & Spaces ({selectedVenue.halls.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedVenue.halls.map((hall) => (
                    <div
                      key={hall.id}
                      onClick={() => setSelectedHall(hall)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedHall.id === hall.id
                          ? 'border-amber-900 bg-amber-50/50 shadow-sm ring-1 ring-amber-900'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-bold text-sm text-stone-900">{hall.name}</h5>
                          <span className="text-xs text-stone-500">{hall.nepaliName}</span>
                        </div>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                          {hall.type === 'INDOOR_HALL' ? 'Indoor Ballroom' : 'Open Lawn'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-stone-100 text-xs text-stone-600">
                        <div>
                          <span className="text-[11px] text-stone-400 block">Capacity Range:</span>
                          <span className="font-semibold tabular-nums">{hall.minCapacity} – {hall.maxCapacity} guests</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-stone-400 block">Base Rental:</span>
                          <span className="font-semibold text-amber-950 tabular-nums">NPR {hall.baseRentalNpr.toLocaleString()}</span>
                        </div>
                      </div>

                      <ul className="mt-3 space-y-1 text-[11px] text-stone-500">
                        {hall.features.slice(0, 3).map((f, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="truncate">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comprehensive Facilities Grid */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Verified Property Amenities
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <Zap className="w-4 h-4 text-amber-600 mb-1" />
                    <span className="font-semibold text-stone-800 block">Power Generator</span>
                    <span className="text-[11px] text-stone-500">100% continuous backup</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <Car className="w-4 h-4 text-stone-600 mb-1" />
                    <span className="font-semibold text-stone-800 block">Valet & Parking</span>
                    <span className="text-[11px] text-stone-500">{selectedVenue.parkingCapacityCars} Cars / {selectedVenue.parkingCapacityBikes} Bikes</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <Flame className="w-4 h-4 text-orange-600 mb-1" />
                    <span className="font-semibold text-stone-800 block">Vedic Mandap</span>
                    <span className="text-[11px] text-stone-500">Sacred fire permit</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <Building className="w-4 h-4 text-stone-600 mb-1" />
                    <span className="font-semibold text-stone-800 block">Green Rooms</span>
                    <span className="text-[11px] text-stone-500">Bridal suites with safe</span>
                  </div>
                </div>
              </div>

              {/* Quick Contact & Policies */}
              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/60 text-xs space-y-2">
                <div className="font-bold text-amber-950">Operating Policies:</div>
                <div className="text-stone-600">
                  <strong>Cancellation Policy:</strong> {selectedVenue.cancellationPolicy}
                </div>
                <div className="text-stone-600">
                  <strong>Decoration Rules:</strong> {selectedVenue.decorationPolicy}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MENU CUSTOMIZER ENGINE */}
          {activeTab === 'MENU_ENGINE' && (
            <MenuCustomizer
              venue={selectedVenue}
              selectedHall={selectedHall}
              onProceedToNegotiation={handleProceedToNegotiation}
            />
          )}

          {/* TAB 3: CALENDAR & SHIFTS */}
          {activeTab === 'CALENDAR' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
                <div>
                  <span className="text-stone-400 block text-[11px]">Selected Hall Calendar:</span>
                  <strong className="text-stone-900 text-sm">{selectedHall.name}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-stone-500">Target Date:</span>
                  <input
                    type="text"
                    value={selectedDateBS}
                    onChange={(e) => setSelectedDateBS(e.target.value)}
                    className="px-2.5 py-1 text-xs bg-white border border-stone-200 rounded-lg font-medium text-stone-800"
                    placeholder="2081 Mangsir 18"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {[
                  { shift: 'MORNING', time: '07:00 AM - 11:30 AM', status: 'Available', color: 'emerald' },
                  { shift: 'DAY', time: '11:30 AM - 04:30 PM', status: 'Available', color: 'emerald' },
                  { shift: 'EVENING', time: '05:00 PM - 10:30 PM', status: 'Tentative Hold', color: 'amber' },
                  { shift: 'FULL_DAY', time: 'Full Day Auspicious', status: 'Available', color: 'emerald' },
                ].map((s) => (
                  <button
                    key={s.shift}
                    onClick={() => setSelectedShift(s.shift as any)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      selectedShift === s.shift
                        ? 'border-amber-900 bg-amber-50 shadow-sm ring-1 ring-amber-900'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-stone-800">{s.shift}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          s.color === 'emerald'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {s.status}
                      </span>
                    </div>
                    <div className="text-xs text-stone-500 flex items-center gap-1 mt-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{s.time}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="text-center pt-4">
                <button
                  onClick={() => setActiveTab('MENU_ENGINE')}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-950 rounded-xl transition-colors"
                >
                  Configure Menu & Request Quote for {selectedShift} Shift →
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: VERIFIED REVIEWS */}
          {activeTab === 'REVIEWS' && (
            <div className="space-y-4">
              {venueReviews.length === 0 ? (
                <div className="text-center py-8 text-stone-500 text-xs">
                  No verified customer reviews yet. Be the first to host and review!
                </div>
              ) : (
                venueReviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-bold text-stone-900 flex items-center gap-2">
                          <span>{rev.customerName}</span>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Verified Booking Ref: {rev.bookingRef}
                          </span>
                        </div>
                        <div className="text-xs text-stone-400">
                          {rev.eventType} · Event Date: {rev.eventDateBS} BS
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span>{rev.overallRating.toFixed(1)}</span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-700 italic">
                      "{rev.comment}"
                    </p>

                    {rev.venueResponse && (
                      <div className="mt-2 p-2.5 bg-white rounded-xl border border-stone-200 text-xs text-stone-600">
                        <strong className="text-stone-900 block text-[11px] mb-0.5">Venue Owner Response:</strong>
                        <span>{rev.venueResponse}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
