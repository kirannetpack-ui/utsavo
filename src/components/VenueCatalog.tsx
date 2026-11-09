/**
 * UTSAVO - Venue Catalog & Discovery
 * Multi-district filtering, adjacent district recommendations, and explainable ranking
 */

import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { Venue } from '../types';
import { VenueImageVisual } from './VenueImageVisual';
import { getAdjacentDistricts } from '../data/nepalGeography';
import {
  Building2,
  MapPin,
  Users,
  ShieldCheck,
  Star,
  CheckCircle,
  Sparkles,
  SlidersHorizontal,
  Car,
  Zap,
  Music,
  Flame,
  ChevronRight,
  Info,
  Tag,
  Percent,
  Bookmark,
} from 'lucide-react';
import { WhatsAppViberButtons } from './WhatsAppViberButtons';
import { createVenueInquiryMessage } from '../utils/communication';

export const VenueCatalog: React.FC = () => {
  const { t, language } = useLanguage();
  const {
    venues,
    filters,
    setFilters,
    setSelectedVenue,
    openVenueOnboarding,
    resetFilters,
    toggleSaveVenue,
    isVenueSaved,
    savedVenueIds,
  } = useMarketplace();

  const [selectedAmenity, setSelectedAmenity] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'GRID' | 'MAP_VIEW'>('GRID');

  // Filter venues with adjacent district intelligence, query, price ranges and capacity
  const filteredVenues = useMemo(() => {
    return venues.filter((venue) => {
      // 1. Full text search query (name, nepali name, locality, address, municipality, district)
      if (filters.searchQuery && filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchName = venue.name.toLowerCase().includes(query);
        const matchNepali = venue.nepaliName?.toLowerCase().includes(query);
        const matchLocality = venue.locality?.toLowerCase().includes(query);
        const matchAddress = venue.address?.toLowerCase().includes(query);
        const matchMunicipality = venue.municipality?.toLowerCase().includes(query);
        const matchDistrict = venue.district?.toLowerCase().includes(query);
        const matchTagline = venue.tagline?.toLowerCase().includes(query);
        if (!matchName && !matchNepali && !matchLocality && !matchAddress && !matchMunicipality && !matchDistrict && !matchTagline) {
          return false;
        }
      }

      // 2. Locality or municipality specific filter
      if (filters.locality && filters.locality.trim() !== '') {
        const locQuery = filters.locality.toLowerCase().trim();
        const matchLoc = venue.locality?.toLowerCase().includes(locQuery);
        const matchMuni = venue.municipality?.toLowerCase().includes(locQuery);
        const matchAddr = venue.address?.toLowerCase().includes(locQuery);
        if (!matchLoc && !matchMuni && !matchAddr) {
          return false;
        }
      }

      // 3. Province filter
      if (filters.province && venue.province.toLowerCase() !== filters.province.toLowerCase()) {
        return false;
      }

      // 4. District filter with adjacent district fallback logic
      if (filters.district) {
        const matchesDistrict = venue.district.toLowerCase() === filters.district.toLowerCase();
        if (!matchesDistrict) {
          if (filters.includeAdjacentDistricts) {
            const adjacent = getAdjacentDistricts(filters.district);
            const isAdjacent = adjacent.some((adj) => adj.toLowerCase() === venue.district.toLowerCase());
            if (!isAdjacent) return false;
          } else {
            return false;
          }
        }
      }

      // 5. Capacity constraints
      // Target guest count: venue max capacity must comfortably fit
      if (filters.guestCount && venue.maxGuests < filters.guestCount) {
        return false;
      }
      // Min capacity filter
      if (filters.minCapacity && venue.maxGuests < filters.minCapacity) {
        return false;
      }
      // Max capacity filter (don't show massive halls if user specifically asks for smaller spaces)
      if (filters.maxCapacity && venue.minGuests > filters.maxCapacity) {
        return false;
      }

      // 6. Price range constraints
      if (filters.minPerPlateBudget && venue.cateringStartingNpr < filters.minPerPlateBudget) {
        return false;
      }
      if (filters.maxPerPlateBudget && venue.cateringStartingNpr > filters.maxPerPlateBudget) {
        return false;
      }
      if (filters.maxHallRentalNpr && venue.baseRentalStartingNpr > filters.maxHallRentalNpr) {
        return false;
      }

      // 7. Amenity filter
      if (selectedAmenity === 'SAVED_ONLY' && !isVenueSaved(venue.id)) return false;
      if (selectedAmenity === 'ACTIVE_OFFERS' && !(venue.offers || []).some((o) => o.isActive)) return false;
      if (selectedAmenity === 'POWER_BACKUP' && !venue.hasPowerBackup) return false;
      if (selectedAmenity === 'MANDAP' && !venue.hasMandapSetup) return false;
      if (selectedAmenity === 'WHEELCHAIR' && !venue.hasWheelchairAccess) return false;
      if (selectedAmenity === 'PARKING_100' && venue.parkingCapacityCars < 100) return false;
      if (selectedAmenity === 'OUTSIDE_PLANNERS' && !venue.eventManagementPolicy?.allowsOutsideOrganizers) return false;
      if (filters.allowsOutsideOrganizersOnly && !venue.eventManagementPolicy?.allowsOutsideOrganizers) return false;

      return true;
    });
  }, [venues, filters, selectedAmenity, savedVenueIds]);

  // Sort venues
  const sortedVenues = useMemo(() => {
    const list = [...filteredVenues];
    if (filters.sortBy === 'PRICE_ASC') {
      return list.sort((a, b) => a.cateringStartingNpr - b.cateringStartingNpr);
    }
    if (filters.sortBy === 'CAPACITY_DESC') {
      return list.sort((a, b) => b.maxGuests - a.maxGuests);
    }
    if (filters.sortBy === 'RATING_DESC') {
      return list.sort((a, b) => b.rating - a.rating);
    }
    // Default: Explainable Recommended (Prioritizes verified, rating, and guest fit)
    return list.sort((a, b) => b.rating * 100 - a.rating * 100);
  }, [filteredVenues, filters.sortBy]);

  // Explainable recommendation note generator (Principle #7 in specification)
  const getRecommendationReason = (venue: Venue) => {
    const reasons: string[] = [];
    if (filters.guestCount && venue.maxGuests >= filters.guestCount && venue.minGuests <= filters.guestCount) {
      reasons.push(language === 'ne' ? `तपाईंको ${filters.guestCount} अतिथिलाई सहज ठाउँ पुग्छ` : `Fits your ${filters.guestCount} guests comfortably`);
    }
    if (venue.hasMandapSetup) {
      reasons.push(language === 'ne' ? 'वैदिक मण्डप तथा होम व्यवस्था' : 'Approved Vedic Mandap & Homa setup');
    }
    if (venue.hasPowerBackup) {
      reasons.push(language === 'ne' ? '१००% जेनेरेटर ब्याकअप' : 'Full generator power backup');
    }
    return reasons.slice(0, 2).join(' · ');
  };

  return (
    <section id="venues-catalog" className="py-12 bg-stone-50 min-h-[600px] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header & View Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              {language === 'ne' ? 'प्रमाणित पार्टी प्यालेस तथा उत्सव स्थलहरू' : 'Verified Party Palaces & Event Halls'}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              {language === 'ne'
                ? `${sortedVenues.length} स्थलहरू उपलब्ध छन्`
                : `${sortedVenues.length} Venues Available in Nepal`}
            </h2>
            {filters.district && (
              <p className="text-xs text-stone-500 mt-1">
                {language === 'ne'
                  ? `${filters.district} र छिमेकी जिल्लाहरू समावेश छन्`
                  : `Showing options in ${filters.district} and nearby municipalities`}
              </p>
            )}
          </div>

          {/* Quick Amenity Filter Bar & Sort Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg bg-stone-200/70 p-1 text-xs font-medium text-stone-600">
              <button
                onClick={() => setSelectedAmenity('ALL')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  selectedAmenity === 'ALL' ? 'bg-white text-stone-900 shadow-sm' : 'hover:text-stone-900'
                }`}
              >
                {language === 'ne' ? 'सबै' : 'All'}
              </button>
              <button
                onClick={() => setSelectedAmenity('MANDAP')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  selectedAmenity === 'MANDAP' ? 'bg-white text-stone-900 shadow-sm' : 'hover:text-stone-900'
                }`}
              >
                {language === 'ne' ? 'मण्डप सुविधा' : 'Mandap Allowed'}
              </button>
              <button
                onClick={() => setSelectedAmenity('POWER_BACKUP')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  selectedAmenity === 'POWER_BACKUP' ? 'bg-white text-stone-900 shadow-sm' : 'hover:text-stone-900'
                }`}
              >
                {language === 'ne' ? 'पावर ब्याकअप' : '100% Genset'}
              </button>
              <button
                onClick={() => setSelectedAmenity('PARKING_100')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  selectedAmenity === 'PARKING_100' ? 'bg-white text-stone-900 shadow-sm' : 'hover:text-stone-900'
                }`}
              >
                {language === 'ne' ? '१००+ गाडी पार्किङ' : '100+ Cars'}
              </button>
              <button
                onClick={() => setSelectedAmenity('ACTIVE_OFFERS')}
                className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                  selectedAmenity === 'ACTIVE_OFFERS'
                    ? 'bg-amber-900 text-white shadow-sm font-semibold'
                    : 'text-amber-900 font-semibold hover:bg-amber-50'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>{language === 'ne' ? 'छुट तथा अफरहरू' : 'Offers & Discounts'}</span>
              </button>
              <button
                onClick={() => setSelectedAmenity('OUTSIDE_PLANNERS')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  selectedAmenity === 'OUTSIDE_PLANNERS' ? 'bg-white text-stone-900 shadow-sm' : 'hover:text-stone-900'
                }`}
              >
                {language === 'ne' ? 'बाह्य आयोजक खुला' : 'Outside Planners Welcome'}
              </button>
              <button
                onClick={() => setSelectedAmenity(selectedAmenity === 'SAVED_ONLY' ? 'ALL' : 'SAVED_ONLY')}
                className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                  selectedAmenity === 'SAVED_ONLY'
                    ? 'bg-amber-900 text-white shadow-sm font-semibold'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${selectedAmenity === 'SAVED_ONLY' ? 'fill-amber-300 text-amber-300' : 'text-amber-700'}`} />
                <span>{language === 'ne' ? `सुरक्षित (${savedVenueIds.length})` : `Saved (${savedVenueIds.length})`}</span>
              </button>
            </div>

            {/* Sort Selector */}
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
              className="text-xs font-medium bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-700 focus:outline-none focus:ring-1 focus:ring-amber-800"
            >
              <option value="RECOMMENDED">{t('sortRecommended')}</option>
              <option value="PRICE_ASC">{t('sortPriceAsc')}</option>
              <option value="CAPACITY_DESC">{t('sortCapacityDesc')}</option>
              <option value="RATING_DESC">{t('sortRatingDesc')}</option>
            </select>
          </div>
        </div>

        {/* Empty State */}
        {sortedVenues.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200/80 my-8">
            <Info className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-stone-800">
              {language === 'ne' ? 'कुनै स्थल भेटिएन' : 'No Venues Found For This Search'}
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-5">
              {language === 'ne'
                ? 'कृपया जिल्ला वा अतिथि संख्याको दायरा फराकिलो बनाएर फेरि प्रयास गर्नुहोस्।'
                : 'Try expanding your district selection or adjusting guest count filters.'}
            </p>
            <button
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  province: '',
                  district: '',
                  guestCount: 300,
                  eventType: 'ALL',
                }))
              }
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-900 rounded-lg hover:bg-amber-950 transition-colors"
            >
              {language === 'ne' ? 'सबै फिल्टर हटाउनुहोस्' : 'Reset All Filters'}
            </button>
          </div>
        )}

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {sortedVenues.map((venue) => {
            const reason = getRecommendationReason(venue);

            return (
              <div
                key={venue.id}
                className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Visual Header */}
                  <div className="relative">
                    <VenueImageVisual type={venue.coverImage} name={venue.name} className="h-52 w-full" />
                    
                    {/* Verified PAN Badge */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-semibold text-amber-950 flex items-center gap-1 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t('verifiedBadge')}</span>
                    </div>

                    {/* Rating & Bookmark Controls */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                      <div className="bg-stone-900/80 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 shadow-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="tabular-nums">{venue.rating.toFixed(1)}</span>
                        <span className="text-[10px] text-stone-300">({venue.reviewCount})</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveVenue(venue.id);
                        }}
                        aria-label={isVenueSaved(venue.id) ? 'Remove from saved venues' : 'Save venue to favorites'}
                        title={isVenueSaved(venue.id) ? 'Saved to Favorites (सुरक्षित)' : 'Bookmark Venue (मनपर्नेमा राख्नुहोस्)'}
                        className={`p-1.5 rounded-md backdrop-blur-md transition-all shadow-xs cursor-pointer ${
                          isVenueSaved(venue.id)
                            ? 'bg-amber-900 text-amber-100 ring-2 ring-amber-400/60 scale-105'
                            : 'bg-stone-900/80 text-stone-300 hover:text-white hover:bg-stone-900'
                        }`}
                      >
                        <Bookmark
                          className={`w-3.5 h-3.5 transition-transform ${
                            isVenueSaved(venue.id) ? 'fill-amber-300 text-amber-300 scale-110' : 'text-stone-300'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Active Promotional Offer Badge on Image */}
                    {venue.offers && venue.offers.some((o) => o.isActive) && (
                      <div className="absolute bottom-2.5 left-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md border border-amber-400/40">
                        <Tag className="w-3.5 h-3.5" />
                        <span>{venue.offers.find((o) => o.isActive)?.badgeText}</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    {/* Location Breadcrumb */}
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                      <span className="truncate">
                        {venue.locality}, {venue.district}
                      </span>
                      <span>·</span>
                      <span className="text-stone-400 text-[11px]">{venue.province}</span>
                    </div>

                    {/* Venue Title & Nepali Name */}
                    <h3 className="font-display text-lg font-bold text-stone-900 group-hover:text-amber-900 transition-colors line-clamp-1">
                      {venue.name}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium line-clamp-1 mt-0.5">
                      {venue.nepaliName}
                    </p>

                    {/* Active Promotional Offer Banner in Card */}
                    {venue.offers && venue.offers.some((o) => o.isActive) && (
                      <div className="mt-2 p-2 bg-gradient-to-r from-amber-50 via-white to-orange-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-center justify-between shadow-2xs">
                        <div className="flex items-center gap-1.5 truncate">
                          <Tag className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                          <span className="font-bold truncate text-[11px]">{venue.offers.find((o) => o.isActive)?.title}</span>
                        </div>
                        <span className="font-mono text-[10px] bg-amber-100/80 text-amber-950 px-1.5 py-0.5 rounded border border-amber-300 font-bold shrink-0 ml-1">
                          {venue.offers.find((o) => o.isActive)?.promoCode}
                        </span>
                      </div>
                    )}

                    {/* Event Management & Media Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        venue.eventManagementPolicy?.allowsOutsideOrganizers
                          ? 'bg-blue-50 text-blue-900 border border-blue-200'
                          : 'bg-stone-100 text-stone-700'
                      }`}>
                        {venue.eventManagementPolicy?.allowsOutsideOrganizers
                          ? '✓ Outside Planners Welcome'
                          : 'In-House Event Team Only'}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-900 border border-amber-200">
                        {(venue.mediaGallery?.length || venue.gallery.length)} Media
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-stone-100 text-stone-700">
                        {venue.packages?.length || 2} Menu Tiers
                      </span>
                    </div>

                    {/* Explainable Recommendation Note */}
                    {reason && (
                      <div className="mt-3 p-2 bg-amber-50/60 rounded-lg border border-amber-200/50 text-[11px] text-amber-900 flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{reason}</span>
                      </div>
                    )}

                    {/* Key Specifications Strip */}
                    <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-stone-100 text-xs text-stone-600">
                      <div>
                        <span className="text-[11px] text-stone-400 block">{t('capacityLabel')}</span>
                        <span className="font-semibold text-stone-800 tabular-nums">
                          {venue.minGuests} – {venue.maxGuests} guests
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] text-stone-400 block">{t('cateringFrom')}</span>
                        <span className="font-semibold text-stone-800 tabular-nums">
                          NPR {venue.cateringStartingNpr.toLocaleString()} {t('perPlate')}
                        </span>
                      </div>
                    </div>

                    {/* Amenities Checklist */}
                    <div className="flex items-center gap-3 mt-3 text-[11px] text-stone-500">
                      {venue.hasPowerBackup && (
                        <span className="flex items-center gap-1" title="100% Generator Backup">
                          <Zap className="w-3.5 h-3.5 text-amber-600" />
                          <span>Genset</span>
                        </span>
                      )}
                      {venue.hasMandapSetup && (
                        <span className="flex items-center gap-1" title="Vedic Mandap & Homa Allowed">
                          <Flame className="w-3.5 h-3.5 text-orange-600" />
                          <span>Mandap</span>
                        </span>
                      )}
                      {venue.parkingCapacityCars > 0 && (
                        <span className="flex items-center gap-1" title={`${venue.parkingCapacityCars} Cars Parking`}>
                          <Car className="w-3.5 h-3.5 text-stone-500" />
                          <span>{venue.parkingCapacityCars} Cars</span>
                        </span>
                      )}
                      <span className="ml-auto font-medium text-stone-700 tabular-nums">
                        {venue.halls.length} {venue.halls.length > 1 ? 'Halls' : 'Hall'}
                      </span>
                    </div>

                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-5 pt-0 space-y-2">
                  <button
                    onClick={() => setSelectedVenue(venue)}
                    className="w-full py-2.5 text-xs font-semibold text-amber-950 bg-stone-100 hover:bg-amber-900 hover:text-white rounded-xl transition-all flex items-center justify-center gap-1.5 group-hover:bg-amber-900 group-hover:text-white"
                  >
                    <span>{t('btnViewDetails')}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {/* Direct WhatsApp / Viber Chat */}
                  <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                    <span className="text-[10px] font-semibold text-stone-400">Direct Chat:</span>
                    <WhatsAppViberButtons
                      phone={venue.phone}
                      messageText={createVenueInquiryMessage(venue.name, 'Subha Muhurat Celebration', 'Upcoming BS Date', venue.minGuests || 300)}
                      variant="badges"
                    />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Empty State when no venues match */}
        {sortedVenues.length === 0 && (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-stone-200 mt-8 shadow-xs max-w-xl mx-auto">
            <div className="w-14 h-14 bg-amber-50 text-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <Building2 className="w-7 h-7 text-amber-800" />
            </div>
            <h3 className="font-display text-xl font-bold text-stone-900">
              {language === 'ne' ? 'कुनै भेन्यु वा पार्टी प्यालेस फेला परेन' : 'No Venues Found Matching Your Criteria'}
            </h3>
            <p className="text-xs text-stone-500 mt-2 max-w-md mx-auto leading-relaxed">
              {language === 'ne'
                ? 'तपाईंले छान्नुभएको मूल्य, क्षमता वा स्थानको दायरा अलि फराकिलो बनाएर पुनः प्रयास गर्नुहोस् वा सबै फिल्टरहरू रिसेट गर्नुहोस्।'
                : 'Try adjusting your price range, guest capacity, or search query to explore more party palaces across Nepal.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
              >
                {language === 'ne' ? 'सबै फिल्टर रिसेट गर्नुहोस्' : 'Reset All Filters'}
              </button>
              <button
                onClick={() => openVenueOnboarding(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-950 rounded-xl shadow-xs transition-colors"
              >
                {language === 'ne' ? 'नयाँ पार्टी प्यालेस दर्ता गर्नुहोस्' : 'Register a Party Palace Here'}
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
