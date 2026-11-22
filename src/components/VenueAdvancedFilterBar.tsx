/**
 * SAGUNOO - Advanced Venue Filter Component
 * Multi-criteria filtering by capacity range, catering & rental price range, and verified amenities
 */

import React, { useMemo, useState } from 'react';
import {
  SlidersHorizontal,
  Users,
  IndianRupee,
  Sparkles,
  Trees,
  Volume2,
  Wind,
  Flame,
  Zap,
  Car,
  Crown,
  Accessibility,
  Briefcase,
  Music,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SearchFilterState } from '../context/MarketplaceContext';

export interface AmenityOption {
  id: string;
  label: string;
  labelNe: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const VENUE_AMENITY_OPTIONS: AmenityOption[] = [
  {
    id: 'OUTDOOR_GARDEN',
    label: 'Outdoor Garden / Lawn',
    labelNe: 'खुला बगैँचा / लन',
    icon: Trees,
  },
  {
    id: 'SOUND_SYSTEM',
    label: 'Sound System / Acoustic Audio',
    labelNe: 'साउन्ड सिस्टम / अडियो',
    icon: Volume2,
  },
  {
    id: 'AIR_CONDITIONING',
    label: 'Full Air Conditioning (AC)',
    labelNe: 'एयर कन्डिसनिङ (AC)',
    icon: Wind,
  },
  {
    id: 'MANDAP_SETUP',
    label: 'Vedic Mandap Allowed',
    labelNe: 'वैदिक मण्डप व्यवस्था',
    icon: Flame,
  },
  {
    id: 'POWER_BACKUP',
    label: '100% Genset Backup',
    labelNe: 'जेनेरेटर पावर ब्याकअप',
    icon: Zap,
  },
  {
    id: 'CAR_PARKING_100',
    label: '100+ Cars Parking',
    labelNe: '१००+ गाडी पार्किङ',
    icon: Car,
  },
  {
    id: 'VIP_LOUNGE',
    label: 'VIP / Bridal Lounge',
    labelNe: 'भीआईपी / ब्राइडल लाउन्ज',
    icon: Crown,
  },
  {
    id: 'WHEELCHAIR_ACCESS',
    label: 'Wheelchair Accessible',
    labelNe: 'ह्वीलचेयर पहुँच',
    icon: Accessibility,
  },
  {
    id: 'OUTSIDE_PLANNERS',
    label: 'Outside Planners Welcome',
    labelNe: 'बाह्य आयोजक अनुमति',
    icon: Briefcase,
  },
  {
    id: 'LIVE_MUSIC',
    label: 'Live Music & Cultural Band',
    labelNe: 'लाइभ संगीत / पञ्चे बाजा',
    icon: Music,
  },
];

interface VenueAdvancedFilterBarProps {
  filters: SearchFilterState;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilterState>>;
  onResetAll: () => void;
  matchingCount: number;
  totalCount: number;
}

const DEFAULT_MIN_CAP = 50;
const DEFAULT_MAX_CAP = 1500;
const DEFAULT_MIN_PLATE = 800;
const DEFAULT_MAX_PLATE = 4000;
const DEFAULT_MAX_RENTAL = 250000;

export const VenueAdvancedFilterBar: React.FC<VenueAdvancedFilterBarProps> = ({
  filters,
  setFilters,
  onResetAll,
  matchingCount,
  totalCount,
}) => {
  const { language } = useLanguage();
  const isNe = language === 'ne';
  const [isExpanded, setIsExpanded] = useState(true);

  const selectedAmenities = filters.selectedAmenities || [];

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.minCapacity > DEFAULT_MIN_CAP || filters.maxCapacity < DEFAULT_MAX_CAP) count += 1;
    if (filters.guestCount && filters.guestCount !== 350) count += 1;
    if (filters.minPerPlateBudget > DEFAULT_MIN_PLATE || filters.maxPerPlateBudget < DEFAULT_MAX_PLATE) count += 1;
    if (filters.maxHallRentalNpr < DEFAULT_MAX_RENTAL) count += 1;
    if (filters.allowsOutsideOrganizersOnly) count += 1;
    count += selectedAmenities.length;
    return count;
  }, [filters, selectedAmenities.length]);

  const toggleAmenity = (amenityId: string) => {
    setFilters((prev) => {
      const current = prev.selectedAmenities || [];
      const exists = current.includes(amenityId);
      const nextAmenities = exists
        ? current.filter((id) => id !== amenityId)
        : [...current, amenityId];

      return {
        ...prev,
        selectedAmenities: nextAmenities,
        allowsOutsideOrganizersOnly:
          amenityId === 'OUTSIDE_PLANNERS' ? !exists : prev.allowsOutsideOrganizersOnly,
      };
    });
  };

  const applyCapacityPreset = (minCap: number, maxCap: number, targetGuests: number) => {
    setFilters((prev) => ({
      ...prev,
      minCapacity: minCap,
      maxCapacity: maxCap,
      guestCount: targetGuests,
    }));
  };

  const applyPricePreset = (minPlate: number, maxPlate: number, maxRental: number) => {
    setFilters((prev) => ({
      ...prev,
      minPerPlateBudget: minPlate,
      maxPerPlateBudget: maxPlate,
      maxHallRentalNpr: maxRental,
    }));
  };

  const activeAmenityLabels = useMemo(() => {
    return VENUE_AMENITY_OPTIONS.filter((opt) => selectedAmenities.includes(opt.id)).map((opt) =>
      isNe ? opt.labelNe : opt.label
    );
  }, [selectedAmenities, isNe]);

  return (
    <div className="mb-6 bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
      {/* Toolbar Header */}
      <div className="px-4 sm:px-6 py-3.5 bg-stone-50/80 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-stone-900 hover:text-amber-900 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-800 whitespace-nowrap shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-800 shrink-0" />
            <span>{isNe ? 'विस्तृत भेन्यु फिल्टर' : 'Advanced Venue Filters'}</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-stone-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-stone-500" />
            )}
          </button>

          <span className="hidden sm:inline text-stone-300" aria-hidden="true">
            ·
          </span>

          <div className="text-xs text-stone-600 tabular-nums truncate">
            {isNe ? (
              <>
                <strong className="text-stone-900">{matchingCount}</strong> / {totalCount} स्थल देखाइँदै
              </>
            ) : (
              <>
                Showing <strong className="text-stone-900">{matchingCount}</strong> of {totalCount} venues
              </>
            )}
            {activeFilterCount > 0 && (
              <>
                <span className="mx-1.5 text-stone-300" aria-hidden="true">
                  ·
                </span>
                <span className="font-semibold text-amber-900">
                  {activeFilterCount} {isNe ? 'सक्रिय' : 'active'}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onResetAll}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-200/70 transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isNe ? 'सबै रिसेट' : 'Reset Filters'}</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-stone-200 text-stone-700 hover:border-stone-300 hover:text-stone-900 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {isExpanded ? (isNe ? 'लुकाउनुहोस्' : 'Hide Filters') : isNe ? 'फिल्टर खोल्नुहोस्' : 'Show Filters'}
          </button>
        </div>
      </div>

      {/* Collapsed Active Summary Line */}
      {!isExpanded && activeFilterCount > 0 && (
        <div className="px-4 sm:px-6 py-2.5 text-xs text-stone-600 flex flex-wrap items-center gap-x-2 gap-y-1 bg-white tabular-nums">
          <span className="font-semibold text-stone-800">{isNe ? 'चयन:' : 'Active:'}</span>
          <span>
            Capacity {filters.minCapacity}–{filters.maxCapacity >= 1500 ? '1,500+' : filters.maxCapacity} pax (target{' '}
            {filters.guestCount})
          </span>
          <span className="text-stone-300" aria-hidden="true">
            ·
          </span>
          <span>
            Plate NPR {filters.minPerPlateBudget.toLocaleString()}–{filters.maxPerPlateBudget.toLocaleString()}
          </span>
          {activeAmenityLabels.length > 0 && (
            <>
              <span className="text-stone-300" aria-hidden="true">
                ·
              </span>
              <span className="text-amber-900 font-medium">{activeAmenityLabels.join(', ')}</span>
            </>
          )}
        </div>
      )}

      {/* Expanded Multi-Criteria Filter Workspace */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-6">
          {/* Top Split Grid: Capacity & Price Range */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Capacity Filter Section */}
            <div className="space-y-3.5 pb-5 lg:pb-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-stone-200/80">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-800 shrink-0" />
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900">
                    {isNe ? 'अतिथि क्षमता (Capacity Range)' : 'Guest Capacity Range'}
                  </h3>
                </div>
                <span className="text-xs font-semibold text-amber-900 tabular-nums">
                  {filters.minCapacity.toLocaleString()} –{' '}
                  {filters.maxCapacity >= 1500 ? '1,500+' : filters.maxCapacity.toLocaleString()} pax
                </span>
              </div>

              {/* Capacity Quick Presets */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { label: isNe ? 'सबै आकार' : 'All Sizes', min: 50, max: 1500, target: 350 },
                  { label: '50–300 Intimate', min: 50, max: 300, target: 150 },
                  { label: '300–700 Classic', min: 300, max: 700, target: 400 },
                  { label: '500+ Grand Wedding', min: 500, max: 1500, target: 650 },
                  { label: '900+ Royal Gala', min: 900, max: 1500, target: 900 },
                ].map((preset) => {
                  const isActive =
                    filters.minCapacity === preset.min &&
                    filters.maxCapacity === preset.max &&
                    filters.guestCount === preset.target;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => applyCapacityPreset(preset.min, preset.max, preset.target)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'bg-amber-900 text-white'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-900'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              {/* Target Guest Count Slider & Numeric Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label
                    htmlFor="adv-filter-target-guests"
                    className="block text-[11px] font-semibold text-stone-600 mb-1"
                  >
                    {isNe ? 'लक्षित अतिथि संख्या' : 'Expected Guests'}
                  </label>
                  <input
                    id="adv-filter-target-guests"
                    type="number"
                    min={50}
                    max={1500}
                    step={25}
                    value={filters.guestCount}
                    onChange={(e) => {
                      const val = Math.max(50, Math.min(1500, Number(e.target.value) || 50));
                      setFilters((prev) => ({
                        ...prev,
                        guestCount: val,
                      }));
                    }}
                    className="w-full px-3 py-2 text-xs font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800/30 tabular-nums"
                  />
                </div>

                <div>
                  <label
                    htmlFor="adv-filter-min-cap"
                    className="block text-[11px] font-semibold text-stone-600 mb-1"
                  >
                    {isNe ? 'न्यूनतम सिट क्षमता' : 'Min Hall Capacity'}
                  </label>
                  <input
                    id="adv-filter-min-cap"
                    type="number"
                    min={50}
                    max={1400}
                    step={50}
                    value={filters.minCapacity}
                    onChange={(e) => {
                      const val = Math.max(50, Math.min(1400, Number(e.target.value) || 50));
                      setFilters((prev) => ({
                        ...prev,
                        minCapacity: val,
                        maxCapacity: Math.max(prev.maxCapacity, val),
                      }));
                    }}
                    className="w-full px-3 py-2 text-xs font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800/30 tabular-nums"
                  />
                </div>

                <div>
                  <label
                    htmlFor="adv-filter-max-cap"
                    className="block text-[11px] font-semibold text-stone-600 mb-1"
                  >
                    {isNe ? 'अधिकतम सिट क्षमता' : 'Max Hall Capacity'}
                  </label>
                  <input
                    id="adv-filter-max-cap"
                    type="number"
                    min={150}
                    max={1500}
                    step={50}
                    value={filters.maxCapacity}
                    onChange={(e) => {
                      const val = Math.max(150, Math.min(1500, Number(e.target.value) || 1500));
                      setFilters((prev) => ({
                        ...prev,
                        maxCapacity: val,
                        minCapacity: Math.min(prev.minCapacity, val),
                        guestCount: prev.guestCount > val ? val : prev.guestCount,
                      }));
                    }}
                    className="w-full px-3 py-2 text-xs font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800/30 tabular-nums"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-stone-500 mb-1 tabular-nums">
                  <span>{isNe ? 'अतिथि स्लाइडर' : 'Quick Guest Count Fit'}</span>
                  <span className="font-semibold text-stone-800">{filters.guestCount} guests</span>
                </div>
                <input
                  type="range"
                  aria-label="Expected guest count"
                  min={50}
                  max={1400}
                  step={50}
                  value={filters.guestCount}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFilters((prev) => ({
                      ...prev,
                      guestCount: val,
                    }));
                  }}
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-900"
                />
              </div>
            </div>

            {/* 2. Price Range Filter Section */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-amber-800 shrink-0" />
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900">
                    {isNe ? 'मूल्य र बजेट दायरा (NPR)' : 'Price & Budget Range (NPR)'}
                  </h3>
                </div>
                <span className="text-xs font-semibold text-amber-900 tabular-nums">
                  NPR {filters.minPerPlateBudget.toLocaleString()} –{' '}
                  {filters.maxPerPlateBudget.toLocaleString()}/plate
                </span>
              </div>

              {/* Price Quick Presets */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { label: isNe ? 'सबै बजेट' : 'All Budgets', minP: 800, maxP: 4000, maxR: 250000 },
                  { label: 'Value (≤ NPR 1,500)', minP: 800, maxP: 1500, maxR: 60000 },
                  { label: 'Standard (NPR 1,200–2,200)', minP: 1200, maxP: 2200, maxR: 120000 },
                  { label: 'Royal Hall ≤ NPR 50k Rental', minP: 800, maxP: 4000, maxR: 50000 },
                ].map((preset) => {
                  const isActive =
                    filters.minPerPlateBudget === preset.minP &&
                    filters.maxPerPlateBudget === preset.maxP &&
                    filters.maxHallRentalNpr === preset.maxR;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => applyPricePreset(preset.minP, preset.maxP, preset.maxR)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'bg-amber-900 text-white'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-900'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              {/* Plate Min/Max & Hall Rental Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label
                    htmlFor="adv-filter-min-plate"
                    className="block text-[11px] font-semibold text-stone-600 mb-1"
                  >
                    {isNe ? 'न्यूनतम प्रति थाली (NPR)' : 'Min Per Plate (NPR)'}
                  </label>
                  <input
                    id="adv-filter-min-plate"
                    type="number"
                    min={500}
                    max={4000}
                    step={50}
                    value={filters.minPerPlateBudget}
                    onChange={(e) => {
                      const val = Math.max(500, Math.min(4000, Number(e.target.value) || 500));
                      setFilters((prev) => ({
                        ...prev,
                        minPerPlateBudget: val,
                        maxPerPlateBudget: Math.max(prev.maxPerPlateBudget, val),
                      }));
                    }}
                    className="w-full px-3 py-2 text-xs font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800/30 tabular-nums"
                  />
                </div>

                <div>
                  <label
                    htmlFor="adv-filter-max-plate"
                    className="block text-[11px] font-semibold text-stone-600 mb-1"
                  >
                    {isNe ? 'अधिकतम प्रति थाली (NPR)' : 'Max Per Plate (NPR)'}
                  </label>
                  <input
                    id="adv-filter-max-plate"
                    type="number"
                    min={800}
                    max={6000}
                    step={50}
                    value={filters.maxPerPlateBudget}
                    onChange={(e) => {
                      const val = Math.max(800, Math.min(6000, Number(e.target.value) || 4000));
                      setFilters((prev) => ({
                        ...prev,
                        maxPerPlateBudget: val,
                        minPerPlateBudget: Math.min(prev.minPerPlateBudget, val),
                      }));
                    }}
                    className="w-full px-3 py-2 text-xs font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800/30 tabular-nums"
                  />
                </div>

                <div>
                  <label
                    htmlFor="adv-filter-max-rental"
                    className="block text-[11px] font-semibold text-stone-600 mb-1"
                  >
                    {isNe ? 'अधिकतम हल भाडा (NPR)' : 'Max Hall Base Rental'}
                  </label>
                  <select
                    id="adv-filter-max-rental"
                    value={filters.maxHallRentalNpr}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        maxHallRentalNpr: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 text-xs font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800/30 tabular-nums"
                  >
                    <option value={250000}>{isNe ? 'कुनै सीमा छैन (Up to 2.5L)' : 'Any Rental (Up to NPR 250k)'}</option>
                    <option value={45000}>Up to NPR 45,000</option>
                    <option value={50000}>Up to NPR 50,000</option>
                    <option value={60000}>Up to NPR 60,000</option>
                    <option value={90000}>Up to NPR 90,000</option>
                    <option value={150000}>Up to NPR 150,000</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-stone-500 mb-1 tabular-nums">
                  <span>{isNe ? 'अधिकतम थाली मूल्य स्लाइडर' : 'Max Catering Budget Ceiling'}</span>
                  <span className="font-semibold text-stone-800">
                    NPR {filters.maxPerPlateBudget.toLocaleString()}/plate
                  </span>
                </div>
                <input
                  type="range"
                  aria-label="Maximum per-plate budget in NPR"
                  min={800}
                  max={4000}
                  step={50}
                  value={Math.min(4000, filters.maxPerPlateBudget)}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFilters((prev) => ({
                      ...prev,
                      maxPerPlateBudget: val,
                      minPerPlateBudget: Math.min(prev.minPerPlateBudget, val),
                    }));
                  }}
                  className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-900"
                />
              </div>
            </div>
          </div>

          {/* 3. Multi-Select Specific Amenities Grid */}
          <div className="pt-5 border-t border-stone-200/80 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-800 shrink-0" />
                <h3 className="text-xs sm:text-sm font-bold text-stone-900">
                  {isNe ? 'विशेष सुविधाहरू छान्नुहोस् (Multi-Select Amenities)' : 'Specific Amenities & Technical Specs'}
                </h3>
              </div>
              <span className="text-xs text-stone-500">
                {selectedAmenities.length === 0
                  ? isNe
                    ? 'अतिरिक्त सुविधाहरू मिलाउन एक वा बढी छान्नुहोस्'
                    : 'Select one or more features (matches all selected)'
                  : isNe
                  ? `${selectedAmenities.length} सुविधा अनिवार्य गरियो`
                  : `${selectedAmenities.length} required ${selectedAmenities.length === 1 ? 'amenity' : 'amenities'} selected`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {VENUE_AMENITY_OPTIONS.map((amenity) => {
                const Icon = amenity.icon;
                const isSelected = selectedAmenities.includes(amenity.id);
                return (
                  <button
                    key={amenity.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleAmenity(amenity.id)}
                    className={`min-h-[42px] px-3 py-2 rounded-xl border text-left text-xs font-medium transition-colors flex items-center justify-between gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-800 ${
                      isSelected
                        ? 'bg-amber-900 text-white border-amber-900 font-semibold'
                        : 'bg-stone-50/70 text-stone-700 border-stone-200 hover:border-amber-700/50 hover:bg-white'
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <Icon
                        className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-200' : 'text-amber-800'}`}
                      />
                      <span className="truncate">{isNe ? amenity.labelNe : amenity.label}</span>
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-amber-200" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
