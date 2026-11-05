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
  Image as ImageIcon,
  Video,
  Award,
  ExternalLink,
  Tag,
  FileText,
  Printer,
} from 'lucide-react';
import { WhatsAppViberButtons } from './WhatsAppViberButtons';
import { createVenueInquiryMessage } from '../utils/communication';
import { LegalContractQuotationGenerator } from './LegalContractQuotationGenerator';

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

  const [isLegalPdfOpen, setIsLegalPdfOpen] = useState(false);

  if (!selectedVenue) return null;

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'MENU_ENGINE' | 'MEDIA_GALLERY' | 'CALENDAR' | 'REVIEWS'>('OVERVIEW');
  const [selectedHall, setSelectedHall] = useState<HallSpace>(selectedVenue.halls[0]);
  const [selectedShift, setSelectedShift] = useState<'MORNING' | 'DAY' | 'EVENING' | 'FULL_DAY'>('DAY');
  const [selectedDateBS, setSelectedDateBS] = useState<string>('2081 Mangsir 18');
  const [selectedDateAD, setSelectedDateAD] = useState<string>('2024-12-03');
  const [activeVideoModal, setActiveVideoModal] = useState<any | null>(null);

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
              onClick={() => setActiveTab('MEDIA_GALLERY')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                activeTab === 'MEDIA_GALLERY' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber-800" />
              <span>Photos & Videos ({selectedVenue.mediaGallery?.length || selectedVenue.gallery.length})</span>
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

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLegalPdfOpen(true)}
              className="px-3 py-1.5 bg-amber-900 hover:bg-amber-950 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-amber-300" />
              <span>Official Quotation & Contract (PDF)</span>
            </button>

            <WhatsAppViberButtons
              phone={selectedVenue.phone}
              messageText={createVenueInquiryMessage(selectedVenue.name, 'Subha Muhurat Celebration', selectedDateBS, selectedVenue.minGuests || 350)}
              variant="badges"
            />

            <div className="text-xs text-stone-500 hidden sm:block">
              Response Rate: <strong className="text-stone-800">{selectedVenue.responseRatePercent}%</strong>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 max-h-[60vh]">
          
          {/* TAB 1: OVERVIEW & HALLS */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              {/* Active Special Offers & Promo Deals */}
              {selectedVenue.offers && selectedVenue.offers.some((o) => o.isActive) && (
                <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50 rounded-2xl border border-amber-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-amber-900" />
                      <span className="font-bold text-xs uppercase tracking-wide text-amber-950">
                        Exclusive Deals & Promotional Discounts Available
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded-full">
                      Verified Venue Offer
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedVenue.offers.filter((o) => o.isActive).map((offer) => (
                      <div key={offer.id} className="p-3 bg-white rounded-xl border border-amber-200 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 bg-amber-500 text-stone-950 font-bold text-xs rounded-md shadow-2xs">
                            {offer.badgeText}
                          </span>
                          <span className="font-mono text-xs font-bold text-amber-950 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                            Code: {offer.promoCode}
                          </span>
                        </div>
                        <h5 className="font-bold text-xs text-stone-900">{offer.title}</h5>
                        <p className="text-[11px] text-stone-600 line-clamp-2">{offer.description}</p>
                        <div className="text-[10px] text-stone-500 pt-1 border-t border-stone-100 flex justify-between">
                          <span>Valid: {offer.validUntilBS}</span>
                          {offer.minGuests && <span>Min: {offer.minGuests} pax</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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

              {/* Event Management & Outside Organizer Policy */}
              <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200/80 text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-950 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <Award className="w-4 h-4 text-purple-800" />
                    <span>Event Management & Outside Planner Policy</span>
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedVenue.eventManagementPolicy?.policyType === 'OUTSIDE_ALLOWED'
                      ? 'bg-blue-100 text-blue-900'
                      : selectedVenue.eventManagementPolicy?.policyType === 'HYBRID_BOTH'
                      ? 'bg-purple-200 text-purple-950'
                      : 'bg-stone-200 text-stone-800'
                  }`}>
                    {selectedVenue.eventManagementPolicy?.policyType === 'OUTSIDE_ALLOWED'
                      ? 'Open to Outside Event Planners'
                      : selectedVenue.eventManagementPolicy?.policyType === 'HYBRID_BOTH'
                      ? 'Hybrid: In-House + Outside Planners'
                      : 'In-House Event Team Only'}
                  </span>
                </div>

                <p className="text-purple-900 leading-relaxed">
                  {selectedVenue.eventManagementPolicy?.inHouseServicesDescription ||
                    'In-house banqueting operations and basic mandap setup provided.'}
                </p>

                {selectedVenue.eventManagementPolicy?.allowsOutsideOrganizers && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-purple-200/60 text-[11px] text-purple-950">
                    <div>
                      <span className="text-purple-700 block text-[10px]">Outside Planner Royalty:</span>
                      <strong className="font-mono">
                        {selectedVenue.eventManagementPolicy.outsideOrganizerFeeNpr
                          ? `NPR ${selectedVenue.eventManagementPolicy.outsideOrganizerFeeNpr.toLocaleString()}`
                          : 'Zero Fee (Complimentary)'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-purple-700 block text-[10px]">Sound Curfew:</span>
                      <strong>{selectedVenue.eventManagementPolicy.soundCurfewTime || '10:30 PM'}</strong>
                    </div>
                    <div>
                      <span className="text-purple-700 block text-[10px]">Production Power:</span>
                      <strong>{selectedVenue.eventManagementPolicy.powerLoadCapacityKw || 60} kW Generator</strong>
                    </div>
                  </div>
                )}
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

          {/* TAB 2.5: UNLIMITED PHOTOS & VIDEOS GALLERY */}
          {activeTab === 'MEDIA_GALLERY' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <div>
                  <h4 className="text-sm font-bold text-stone-900">
                    Photos & Videos Media Gallery
                  </h4>
                  <p className="text-xs text-stone-500">
                    High-definition walkthrough photos and video reels of ballrooms, lawns, and Mandap setups.
                  </p>
                </div>
                <span className="text-xs font-semibold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  {(selectedVenue.mediaGallery || []).length} Media Items
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {(selectedVenue.mediaGallery && selectedVenue.mediaGallery.length > 0
                  ? selectedVenue.mediaGallery
                  : selectedVenue.gallery.map((g, idx) => ({
                      id: `g-${idx}`,
                      type: 'PHOTO' as const,
                      url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
                      title: `${selectedVenue.name} - Space ${idx + 1}`,
                      category: 'BALLROOM' as const,
                    }))
                ).map((media: any) => (
                  <div
                    key={media.id}
                    className="bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden shadow-2xs group flex flex-col justify-between"
                  >
                    <div className="relative h-40 bg-stone-900 overflow-hidden">
                      {media.type === 'PHOTO' ? (
                        <img
                          src={media.url}
                          alt={media.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center text-white relative">
                          {media.thumbnailUrl && (
                            <img src={media.thumbnailUrl} alt={media.title} className="absolute inset-0 w-full h-full object-cover opacity-40" />
                          )}
                          <div className="relative z-10">
                            <Video className="w-8 h-8 text-amber-400 mx-auto mb-1 drop-shadow" />
                            <span className="text-xs font-bold block drop-shadow line-clamp-1">{media.title}</span>
                          </div>
                        </div>
                      )}

                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-stone-900/80 text-white uppercase backdrop-blur-xs">
                        {media.type}
                      </span>
                    </div>

                    <div className="p-3 space-y-1.5">
                      <div className="font-semibold text-xs text-stone-900 line-clamp-1">{media.title}</div>
                      {media.caption && (
                        <p className="text-[11px] text-stone-500 line-clamp-2">{media.caption}</p>
                      )}

                      {media.type === 'VIDEO' && (
                        <button
                          onClick={() => setActiveVideoModal(media)}
                          className="w-full mt-2 py-1.5 bg-amber-900 hover:bg-amber-950 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Watch Video</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
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

      {/* Video Modal Player */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-60 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
              <span className="font-bold text-xs">{activeVideoModal.title}</span>
              <button onClick={() => setActiveVideoModal(null)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-center space-y-3 bg-stone-950 text-white">
              <Video className="w-12 h-12 text-amber-400 mx-auto" />
              <p className="text-xs text-stone-300 font-mono">{activeVideoModal.url}</p>
              <a
                href={activeVideoModal.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow transition-colors"
              >
                <span>Watch on External Player</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Legal Contract & Quotation PDF Generator Modal */}
      <LegalContractQuotationGenerator
        isOpen={isLegalPdfOpen}
        onClose={() => setIsLegalPdfOpen(false)}
        initialVenueData={{
          venueName: selectedVenue.name,
          panNumber: selectedVenue.panNumber,
          contactPerson: selectedVenue.contactPerson,
          phone: selectedVenue.phone,
          email: selectedVenue.email,
          address: `${selectedVenue.locality}, ${selectedVenue.district}, ${selectedVenue.province}`,
          cateringStartingNpr: selectedVenue.cateringStartingNpr,
          baseRentalStartingNpr: selectedVenue.baseRentalStartingNpr,
        }}
      />
    </div>
  );
};

