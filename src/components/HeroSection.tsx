/**
 * UTSAVO - Hero Discovery, Search Bar & Granular Filter Controls
 * Nepal's Smart Celebration Marketplace
 *
 * Implements:
 * 1. Unified search bar for quick query by venue name, locality, landmark
 * 2. Granular location filter controls (7 provinces, 77 districts, locality, adjacent district toggles)
 * 3. Granular price range controls (Min/Max Per-Plate NPR & Base Hall Rental)
 * 4. Capacity range controls (Min/Max Guest Capacity & Pax slider)
 * 5. Panchanga Subha Muhurat shortcuts and claim-to-proof metrics
 */

import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { NEPAL_PROVINCES } from '../data/nepalGeography';
import { PANCHANGA_AUSPICIOUS_MUHURATS } from '../data/panchangaCalendar';
import { EventType } from '../types';
import {
  MapPin,
  Calendar,
  Users,
  Sparkles,
  Search,
  SlidersHorizontal,
  DollarSign,
  Building,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Compass,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { t, language } = useLanguage();
  const { filters, setFilters, resetFilters, venues, setActiveModal, openVenueOnboarding } = useMarketplace();

  // Local state initialized from marketplace filters
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || '');
  const [selectedProvince, setSelectedProvince] = useState(filters.province || '');
  const [selectedDistrict, setSelectedDistrict] = useState(filters.district || '');
  const [selectedLocality, setSelectedLocality] = useState(filters.locality || '');
  const [selectedEventType, setSelectedEventType] = useState<EventType | 'ALL'>(filters.eventType || 'ALL');
  const [guestCount, setGuestCount] = useState<number>(filters.guestCount || 350);
  const [minCapacity, setMinCapacity] = useState<number>(filters.minCapacity || 50);
  const [maxCapacity, setMaxCapacity] = useState<number>(filters.maxCapacity || 1500);
  const [minPerPlate, setMinPerPlate] = useState<number>(filters.minPerPlateBudget || 800);
  const [maxPerPlate, setMaxPerPlate] = useState<number>(filters.maxPerPlateBudget || 4000);
  const [maxHallRental, setMaxHallRental] = useState<number>(filters.maxHallRentalNpr || 250000);
  const [includeAdjacent, setIncludeAdjacent] = useState<boolean>(filters.includeAdjacentDistricts ?? true);

  // Expand/collapse advanced filter drawer
  const [isFiltersExpanded, setIsFiltersExpanded] = useState<boolean>(false);

  // Available districts based on selected province
  const currentProvinceData = NEPAL_PROVINCES.find((p) => p.name === selectedProvince);
  const availableDistricts = currentProvinceData ? currentProvinceData.districts : [];

  // Count active non-default filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (selectedProvince) count++;
    if (selectedDistrict) count++;
    if (selectedLocality.trim()) count++;
    if (selectedEventType !== 'ALL') count++;
    if (minPerPlate > 800 || maxPerPlate < 4000) count++;
    if (minCapacity > 50 || maxCapacity < 1500) count++;
    if (maxHallRental < 250000) count++;
    return count;
  }, [
    searchQuery,
    selectedProvince,
    selectedDistrict,
    selectedLocality,
    selectedEventType,
    minPerPlate,
    maxPerPlate,
    minCapacity,
    maxCapacity,
    maxHallRental,
  ]);

  const applySearchAndFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      searchQuery,
      province: selectedProvince,
      district: selectedDistrict,
      locality: selectedLocality,
      eventType: selectedEventType,
      guestCount,
      minCapacity,
      maxCapacity,
      minPerPlateBudget: minPerPlate,
      maxPerPlateBudget: maxPerPlate,
      maxHallRentalNpr: maxHallRental,
      includeAdjacentDistricts: includeAdjacent,
    }));

    // Smooth scroll to catalog
    const el = document.getElementById('venues-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedProvince('');
    setSelectedDistrict('');
    setSelectedLocality('');
    setSelectedEventType('ALL');
    setGuestCount(350);
    setMinCapacity(50);
    setMaxCapacity(1500);
    setMinPerPlate(800);
    setMaxPerPlate(4000);
    setMaxHallRental(250000);
    setIncludeAdjacent(true);
    resetFilters();
  };

  const applyMuhuratShortcut = (dateBS: string, dateAD: string, eventType: EventType) => {
    setSelectedEventType(eventType);
    setFilters((prev) => ({
      ...prev,
      dateBS,
      dateAD,
      eventType,
    }));
    const el = document.getElementById('venues-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-stone-100/90 via-amber-50/40 to-stone-50 border-b border-stone-200 py-10 md:py-14">
      {/* Subtle traditional architectural radial ambient background */}
      <div className="absolute top-0 inset-x-0 h-48 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-200/25 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Display Headline & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100/70 border border-amber-200/80 rounded-full text-xs font-semibold uppercase tracking-wider text-amber-900 mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>{language === 'ne' ? 'नेपालको स्मार्ट उत्सव तथा पार्टी प्यालेस बजार' : "Nepal's Smart Celebration & Party Palace Marketplace"}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-900 text-balance leading-tight">
            {t('heroTitle')}
          </h1>

          <p className="mt-3 text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
            {t('heroSubtitle')}
          </p>
        </div>

        {/* Primary Unified Search & Filter Command Center */}
        <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/60 border border-stone-200/90 p-4 sm:p-5 max-w-5xl mx-auto transition-all">
          <form onSubmit={applySearchAndFilters} className="space-y-4">
            
            {/* Top Unified Search Row */}
            <div className="flex flex-col md:flex-row gap-3">
              {/* Full-text keyword search bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    language === 'ne'
                      ? 'पार्टी प्यालेस, स्थान, वा बैंक्वेट खोज्नुहोस् (उदा: बालुवाटार, पोखरा, ललितपुर)...'
                      : 'Search party palaces, venues, or areas (e.g. Baluwatar, Pokhara, Sanepa)...'
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Action Buttons: Filter Controls Toggle & Search Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                  className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    isFiltersExpanded || activeFilterCount > 0
                      ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-amber-800" />
                  <span>{language === 'ne' ? 'विस्तृत फिल्टर' : 'Filter Controls'}</span>
                  {activeFilterCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-amber-900 text-white text-[10px] flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                  {isFiltersExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                  )}
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-amber-900 hover:bg-amber-950 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>{t('btnSearch')}</span>
                </button>
              </div>
            </div>

            {/* Quick Top Controls (Always visible for fast selection: Location, Event Type, Guests) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 border-t border-stone-100">
              
              {/* Quick Field 1: Province */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-stone-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-700" />
                  <span>{language === 'ne' ? 'प्रदेश (Province)' : 'Province'}</span>
                </label>
                <select
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setSelectedDistrict('');
                  }}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-800"
                >
                  <option value="">{language === 'ne' ? 'सबै प्रदेश (All Provinces)' : 'All 7 Provinces'}</option>
                  {NEPAL_PROVINCES.map((p) => (
                    <option key={p.id} value={p.name}>
                      {language === 'ne' ? p.nepaliName : p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Field 2: District */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-stone-600 flex items-center gap-1">
                  <Compass className="w-3 h-3 text-amber-700" />
                  <span>{language === 'ne' ? 'जिल्ला (District)' : 'District'}</span>
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedProvince}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-800 disabled:opacity-50"
                >
                  <option value="">
                    {selectedProvince
                      ? language === 'ne'
                        ? 'जिल्ला छान्नुहोस्'
                        : 'Select District'
                      : language === 'ne'
                      ? 'पहिला प्रदेश रोज्नुहोस्'
                      : 'Choose Province first'}
                  </option>
                  {availableDistricts.map((d) => (
                    <option key={d.name} value={d.name}>
                      {language === 'ne' ? d.nepaliName : d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Field 3: Celebration Type */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-stone-600 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-700" />
                  <span>{t('searchEventType')}</span>
                </label>
                <select
                  value={selectedEventType}
                  onChange={(e) => setSelectedEventType(e.target.value as any)}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-800"
                >
                  <option value="ALL">{language === 'ne' ? 'सबै उत्सवहरू' : 'All Celebration Types'}</option>
                  <option value="WEDDING">{language === 'ne' ? 'विवाह (Bibaha / Wedding)' : 'Wedding Ceremony'}</option>
                  <option value="RECEPTION">{language === 'ne' ? 'प्रीतिभोज (Reception Gala)' : 'Reception Gala'}</option>
                  <option value="BRATABANDHA">{language === 'ne' ? 'व्रतबन्ध (Bratabandha)' : 'Bratabandha'}</option>
                  <option value="PASNI">{language === 'ne' ? 'पास्नी (Pasni / Weaning)' : 'Pasni / Rice Weaning'}</option>
                  <option value="ENGAGEMENT">{language === 'ne' ? 'टीका / मगनी (Engagement)' : 'Engagement'}</option>
                  <option value="CORPORATE_GALA">{language === 'ne' ? 'कर्पोरेट भेला (Corporate)' : 'Corporate Program'}</option>
                  <option value="BIRTHDAY_JUBILEE">{language === 'ne' ? 'जन्मोत्सव (Birthday/Jubilee)' : 'Birthday & Jubilee'}</option>
                </select>
              </div>

              {/* Quick Field 4: Expected Guests Range Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-stone-600 flex items-center gap-1">
                    <Users className="w-3 h-3 text-amber-700" />
                    <span>{t('searchGuests')}</span>
                  </label>
                  <span className="text-xs font-bold text-amber-900 tabular-nums">
                    {guestCount} pax
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1500"
                  step="25"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-900 mt-2"
                />
                <div className="flex justify-between text-[10px] text-stone-400 tabular-nums">
                  <span>50</span>
                  <span>350</span>
                  <span>750</span>
                  <span>1500+</span>
                </div>
              </div>

            </div>

            {/* EXPANDABLE GRANULAR FILTER CONTROLS PANEL */}
            {isFiltersExpanded && (
              <div className="pt-4 border-t border-stone-200/90 space-y-4 bg-stone-50/70 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-4 sm:p-5 rounded-b-2xl">
                
                <div className="flex items-center justify-between pb-1 border-b border-stone-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-amber-800" />
                    <span>{language === 'ne' ? 'स्थान, मूल्य र क्षमता फिल्टरहरू' : 'Location, Price Range & Capacity Controls'}</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-stone-500 hover:text-amber-900 flex items-center gap-1 font-medium transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{language === 'ne' ? 'सबै रिसेट' : 'Reset All'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  
                  {/* Filter Group 1: Granular Location Controls */}
                  <div className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-xs space-y-3">
                    <div className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-800" />
                      <span>{language === 'ne' ? 'स्थान विवरण (Location Details)' : 'Geographic Location'}</span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="text-[11px] text-stone-500 block mb-1">
                          {language === 'ne' ? 'टोल वा पालिका (Locality / Municipality)' : 'Locality or Municipality'}
                        </label>
                        <input
                          type="text"
                          value={selectedLocality}
                          onChange={(e) => setSelectedLocality(e.target.value)}
                          placeholder={language === 'ne' ? 'उदा: सानेपा, तीनकुने, लेकसाइड...' : 'e.g. Sanepa, Tinkune, Lakeside...'}
                          className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-800"
                        />
                      </div>

                      <div className="pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
                          <input
                            type="checkbox"
                            checked={includeAdjacent}
                            onChange={(e) => setIncludeAdjacent(e.target.checked)}
                            className="rounded border-stone-300 text-amber-900 focus:ring-amber-800"
                          />
                          <span>
                            {language === 'ne'
                              ? 'नजिकका छिमेकी जिल्लाहरू समावेश गर्नुहोस्'
                              : 'Include adjacent nearby districts'}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Filter Group 2: Price Range Controls */}
                  <div className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-xs space-y-3">
                    <div className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-amber-800" />
                      <span>{language === 'ne' ? 'मूल्य दायरा (Price Range NPR)' : 'Price Range (NPR)'}</span>
                    </div>

                    {/* Per Plate Range */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] text-stone-600">
                        <span>{language === 'ne' ? 'प्रति प्लेट खानपिन दर:' : 'Per-Plate Catering:'}</span>
                        <span className="font-bold text-amber-900 tabular-nums">
                          NPR {minPerPlate.toLocaleString()} - {maxPerPlate >= 4000 ? '4,000+' : maxPerPlate.toLocaleString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] text-stone-400 block">{language === 'ne' ? 'न्यूनतम दर' : 'Min Plate'}</span>
                          <input
                            type="number"
                            min="500"
                            max="3000"
                            step="50"
                            value={minPerPlate}
                            onChange={(e) => setMinPerPlate(Number(e.target.value))}
                            className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-stone-800 tabular-nums"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block">{language === 'ne' ? 'अधिकतम दर' : 'Max Plate'}</span>
                          <input
                            type="number"
                            min="1000"
                            max="6000"
                            step="100"
                            value={maxPerPlate}
                            onChange={(e) => setMaxPerPlate(Number(e.target.value))}
                            className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-stone-800 tabular-nums"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Max Hall Base Rental */}
                    <div className="pt-1">
                      <div className="flex justify-between text-[11px] text-stone-600 mb-1">
                        <span>{language === 'ne' ? 'अधिकतम हल भाडा:' : 'Max Hall Base Rental:'}</span>
                        <span className="font-semibold text-stone-800 tabular-nums">
                          NPR {maxHallRental >= 250000 ? '250,000+' : maxHallRental.toLocaleString()}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="25000"
                        max="250000"
                        step="10000"
                        value={maxHallRental}
                        onChange={(e) => setMaxHallRental(Number(e.target.value))}
                        className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-900"
                      />
                    </div>
                  </div>

                  {/* Filter Group 3: Capacity Range Controls */}
                  <div className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-xs space-y-3">
                    <div className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-amber-800" />
                      <span>{language === 'ne' ? 'हल तथा अतिथि क्षमता (Capacity Limits)' : 'Venue Capacity Limits'}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[11px] text-stone-600">
                        <span>{language === 'ne' ? 'क्षमता दायरा:' : 'Capacity Span:'}</span>
                        <span className="font-bold text-amber-900 tabular-nums">
                          {minCapacity} - {maxCapacity >= 1500 ? '1,500+' : maxCapacity} pax
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] text-stone-400 block">{language === 'ne' ? 'न्यूनतम क्षमता' : 'Min Capacity'}</span>
                          <input
                            type="number"
                            min="25"
                            max="500"
                            step="25"
                            value={minCapacity}
                            onChange={(e) => setMinCapacity(Number(e.target.value))}
                            className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-stone-800 tabular-nums"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block">{language === 'ne' ? 'अधिकतम क्षमता' : 'Max Capacity'}</span>
                          <input
                            type="number"
                            min="200"
                            max="3000"
                            step="50"
                            value={maxCapacity}
                            onChange={(e) => setMaxCapacity(Number(e.target.value))}
                            className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-stone-800 tabular-nums"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {[
                          { label: '50-200 (Intimate)', min: 50, max: 200 },
                          { label: '200-600 (Medium)', min: 200, max: 600 },
                          { label: '600-1500+ (Grand)', min: 600, max: 2000 },
                        ].map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => {
                              setMinCapacity(preset.min);
                              setMaxCapacity(preset.max);
                            }}
                            className="px-2 py-0.5 text-[10px] rounded bg-stone-100 hover:bg-amber-100 hover:text-amber-900 text-stone-600 border border-stone-200 transition-colors"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Filter Action Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-stone-600">
                    <span className="font-semibold text-stone-900">{venues.length}</span> {language === 'ne' ? 'वटा पार्टी प्यालेस र बैंक्वेट उपलब्ध' : 'verified party palaces and banquets across Nepal'}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 font-medium"
                    >
                      {language === 'ne' ? 'रिसेट' : 'Clear'}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-950 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>{language === 'ne' ? 'फिल्टर लागु गर्नुहोस्' : 'Apply Filters'}</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

          </form>
        </div>

        {/* Auspicious Panchanga Muhurat Shortcuts */}
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600 pt-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-700" />
              <span>{language === 'ne' ? 'नजिकका पञ्चाङ्ग शुभ लग्न:' : 'Upcoming Auspicious Muhurats:'}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {PANCHANGA_AUSPICIOUS_MUHURATS.slice(0, 4).map((m) => (
              <button
                key={m.id}
                onClick={() => applyMuhuratShortcut(m.dateBS, m.dateAD, m.eventType)}
                className="px-2.5 py-1 text-xs font-medium bg-amber-50/70 hover:bg-amber-100 text-amber-900 rounded-md border border-amber-200/60 transition-colors flex items-center gap-1"
                title={`${m.tithi} · ${m.significance}`}
              >
                <span>{m.dateBS}</span>
                <span className="text-[11px] text-amber-700 font-normal">
                  ({m.eventType === 'WEDDING' ? 'विवाह' : m.eventType === 'BRATABANDHA' ? 'व्रतबन्ध' : 'पास्नी'})
                </span>
              </button>
            ))}

            <button
              onClick={() => setActiveModal('PANCHANGA_CALENDAR')}
              className="text-amber-900 hover:text-amber-950 font-semibold flex items-center gap-0.5 ml-1"
            >
              <span>{language === 'ne' ? 'सबै हेर्नुहोस्' : 'View all'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Venue Operator Self-Service Registration Banner */}
        <div className="max-w-5xl mx-auto mt-6 p-3.5 bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 rounded-xl text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0">
              <Building className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-200">
                {language === 'ne' ? 'पार्टी प्यालेस तथा बैंक्वेट सञ्चालक हुनुहुन्छ?' : 'Are you a Venue Owner or Party Palace Manager?'}
              </div>
              <div className="text-[11px] text-stone-300">
                {language === 'ne'
                  ? 'आफ्नो हल, क्याटरिङ मेनु, प्यान/भ्याट र सुविधा दर्ता गरी नेपालभरका ग्राहकमाझ पुग्नुहोस्।'
                  : 'Showcase your halls, menus, pricing, PAN/VAT and policies to thousands of event hosts.'}
              </div>
            </div>
          </div>
          <button
            onClick={() => openVenueOnboarding(null)}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-amber-950 rounded-lg text-xs font-bold transition-all whitespace-nowrap shadow-sm hover:scale-[1.02]"
          >
            {language === 'ne' ? 'आफ्नो भेन्यु दर्ता गर्नुहोस्' : 'Register Your Party Palace'}
          </button>
        </div>

        {/* Claim-to-Proof Metric Strip */}
        <div className="max-w-5xl mx-auto mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-stone-200/70 pt-6">
          <div className="text-left">
            <div className="text-xl font-bold font-display text-amber-950 tabular-nums">7 Provinces</div>
            <div className="text-xs text-stone-500 mt-0.5">Authoritative 77 districts coverage</div>
          </div>
          <div className="text-left">
            <div className="text-xl font-bold font-display text-amber-950 tabular-nums">100% Verified</div>
            <div className="text-xs text-stone-500 mt-0.5">PAN / VAT & registration verified</div>
          </div>
          <div className="text-left">
            <div className="text-xl font-bold font-display text-amber-950 tabular-nums">Panchanga Samiti</div>
            <div className="text-xs text-stone-500 mt-0.5">Official Subha Muhurat calendar</div>
          </div>
          <div className="text-left">
            <div className="text-xl font-bold font-display text-amber-950 tabular-nums">Digital Contracts</div>
            <div className="text-xs text-stone-500 mt-0.5">Binding agreement on every booking</div>
          </div>
        </div>

      </div>
    </section>
  );
};
