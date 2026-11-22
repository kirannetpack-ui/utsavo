/**
 * SAGUNOO — AI-Driven Smart Venue Matcher
 * Analyzes user occasion preferences, Nepal district/province selection, guest count,
 * and NPR budget (Total or Per-Plate incl. 10% SC & 13% IRD VAT) to recommend the
 * top 3 best-fit party palaces across Nepal.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useLanguage } from '../context/LanguageContext';
import { EventType, Venue } from '../types';
import { VenueImageVisual } from './VenueImageVisual';
import { NepalDistrictSelector, NepalProvinceSelector } from './NepalLocationSelector';
import {
  Sparkles,
  MapPin,
  Star,
  Check,
  Bookmark,
  Eye,
  ChevronRight,
  SlidersHorizontal,
  RotateCcw,
  Building2,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';

interface MatcherRecommendationItem {
  rank: number;
  venueId: string;
  fitSummary: string;
  budgetBreakdownNote: string;
  matchedHighlights: string[];
  tradeoffOrTip: string;
}

interface SmartVenueMatcherResponse {
  matcherOverview: string;
  recommendations: MatcherRecommendationItem[];
  generatedWith: string;
  generatedAt: string;
}

interface SmartVenueMatcherProps {
  onApplyFiltersToCatalog?: () => void;
}

const EVENT_TYPE_OPTIONS: Array<{ value: EventType; label: string; nepali: string }> = [
  { value: 'WEDDING', label: 'Wedding (Bibaha)', nepali: 'विवाह' },
  { value: 'RECEPTION', label: 'Reception (Pritibhoj)', nepali: 'प्रीतिभोज' },
  { value: 'BRATABANDHA', label: 'Bratabandha / Upanayan', nepali: 'व्रतबन्ध' },
  { value: 'PASNI', label: 'Pasni / Rice Feeding', nepali: 'पास्नी' },
  { value: 'ENGAGEMENT', label: 'Engagement / Ring Ceremony', nepali: 'मगनी / टीका' },
  { value: 'BIRTHDAY_JUBILEE', label: 'Birthday / Anniversary', nepali: 'जन्मदिन / उत्सव' },
  { value: 'CORPORATE_GALA', label: 'Corporate Gala / Summit', nepali: 'व्यावसायिक सम्मेलन' },
  { value: 'GRIHA_PRAVESH', label: 'Griha Pravesh', nepali: 'गृह प्रवेश' },
  { value: 'OTHER_CELEBRATION', label: 'Other Celebration', nepali: 'अन्य उत्सव' },
];

const RANK_LABELS = [
  '01. Best Overall Fit',
  '02. Strong Alternative',
  '03. Curated Match',
];

function computeEstimatedTotalNpr(venue: Venue, guests: number): number {
  const subtotal = venue.cateringStartingNpr * guests + venue.baseRentalStartingNpr;
  const sc = Math.round(subtotal * 0.1);
  const vat = Math.round((subtotal + sc) * 0.13);
  return subtotal + sc + vat;
}

export const SmartVenueMatcher: React.FC<SmartVenueMatcherProps> = ({
  onApplyFiltersToCatalog,
}) => {
  const { language } = useLanguage();
  const {
    venues,
    filters,
    setFilters,
    setSelectedVenue,
    setQuickPeekVenueId,
    toggleSaveVenue,
    isVenueSaved,
    setActiveModal,
  } = useMarketplace();

  // Preferences state (seeded sensibly from current Explore filters)
  const [eventType, setEventType] = useState<EventType>(
    filters.eventType !== 'ALL' ? filters.eventType : 'WEDDING'
  );
  const [province, setProvince] = useState<string>(filters.province || '');
  const [district, setDistrict] = useState<string>(filters.district || '');
  const [guestCount, setGuestCount] = useState<number>(filters.guestCount || 350);
  const [budgetMode, setBudgetMode] = useState<'TOTAL_NPR' | 'PER_PLATE_NPR'>('TOTAL_NPR');
  const [totalBudgetNpr, setTotalBudgetNpr] = useState<number>(850000);
  const [perPlateBudgetNpr, setPerPlateBudgetNpr] = useState<number>(
    filters.maxPerPlateBudget && filters.maxPerPlateBudget < 4000
      ? filters.maxPerPlateBudget
      : 1800
  );
  const [spaceStyle, setSpaceStyle] = useState<
    'ANY' | 'INDOOR_HALL' | 'GARDEN_LAWN' | 'ROOFTOP'
  >('ANY');

  // Facility toggles
  const [requireMandap, setRequireMandap] = useState<boolean>(true);
  const [requirePowerBackup, setRequirePowerBackup] = useState<boolean>(true);
  const [requireParking100Plus, setRequireParking100Plus] = useState<boolean>(false);
  const [requireOutsidePlanners, setRequireOutsidePlanners] = useState<boolean>(false);
  const [requireWheelchairAccess, setRequireWheelchairAccess] = useState<boolean>(false);
  const [specialNotes, setSpecialNotes] = useState<string>('');

  // Results state
  const [matchResult, setMatchResult] = useState<SmartVenueMatcherResponse | null>(null);
  const [isMatching, setIsMatching] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const runSmartMatch = useCallback(async () => {
    if (!venues.length) return;
    setIsMatching(true);
    setErrorMessage(null);

    const serializedVenues = venues.map((v) => {
      const activeOffer = (v.offers || []).find((o) => o.isActive);
      return {
        id: v.id,
        name: v.name,
        nepaliName: v.nepaliName,
        province: v.province,
        district: v.district,
        locality: v.locality,
        tagline: v.tagline,
        minGuests: v.minGuests,
        maxGuests: v.maxGuests,
        cateringStartingNpr: v.cateringStartingNpr,
        baseRentalStartingNpr: v.baseRentalStartingNpr,
        rating: v.rating,
        reviewCount: v.reviewCount,
        parkingCapacityCars: v.parkingCapacityCars,
        hasPowerBackup: v.hasPowerBackup,
        hasMandapSetup: v.hasMandapSetup,
        hasWheelchairAccess: v.hasWheelchairAccess,
        hasLiveMusicPermit: v.hasLiveMusicPermit,
        hasVipLounge: v.hasVipLounge,
        allowsOutsideOrganizers: Boolean(v.eventManagementPolicy?.allowsOutsideOrganizers),
        hallTypes: v.halls.map((h) => h.type),
        hallNames: v.halls.map((h) => h.name),
        activeOfferTitle: activeOffer ? `${activeOffer.title} (${activeOffer.promoCode})` : '',
      };
    });

    try {
      const res = await fetch('/api/smart-venue-matcher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: {
            eventType,
            province,
            district,
            guestCount,
            budgetMode,
            budgetAmountNpr: budgetMode === 'TOTAL_NPR' ? totalBudgetNpr : perPlateBudgetNpr,
            spaceStyle,
            requireMandap,
            requirePowerBackup,
            requireParking100Plus,
            requireOutsidePlanners,
            requireWheelchairAccess,
            specialNotes,
          },
          venues: serializedVenues,
        }),
      });

      if (!res.ok) {
        throw new Error(`Matcher responded with status ${res.status}`);
      }

      const data: SmartVenueMatcherResponse = await res.json();
      setMatchResult(data);
    } catch (err: any) {
      console.error('Smart Venue Matcher error:', err);
      setErrorMessage(
        'Could not complete AI venue matching right now. Please try again in a moment.'
      );
    } finally {
      setIsMatching(false);
    }
  }, [
    venues,
    eventType,
    province,
    district,
    guestCount,
    budgetMode,
    totalBudgetNpr,
    perPlateBudgetNpr,
    spaceStyle,
    requireMandap,
    requirePowerBackup,
    requireParking100Plus,
    requireOutsidePlanners,
    requireWheelchairAccess,
    specialNotes,
  ]);

  // Run initial match once when mounted so Explore visitors immediately see top 3 picks
  useEffect(() => {
    if (!matchResult && venues.length > 0) {
      runSmartMatch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venues.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSmartMatch();
  };

  const handleResetPreferences = () => {
    setEventType('WEDDING');
    setProvince('');
    setDistrict('');
    setGuestCount(350);
    setBudgetMode('TOTAL_NPR');
    setTotalBudgetNpr(850000);
    setPerPlateBudgetNpr(1800);
    setSpaceStyle('ANY');
    setRequireMandap(true);
    setRequirePowerBackup(true);
    setRequireParking100Plus(false);
    setRequireOutsidePlanners(false);
    setRequireWheelchairAccess(false);
    setSpecialNotes('');
  };

  const handleSyncFiltersToCatalog = () => {
    setFilters((prev) => ({
      ...prev,
      province,
      district,
      eventType,
      guestCount,
      maxPerPlateBudget:
        budgetMode === 'PER_PLATE_NPR'
          ? perPlateBudgetNpr
          : Math.max(1000, Math.round(totalBudgetNpr / Math.max(guestCount, 50))),
      allowsOutsideOrganizersOnly: requireOutsidePlanners,
      includeAdjacentDistricts: true,
    }));
    if (onApplyFiltersToCatalog) {
      onApplyFiltersToCatalog();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>
              {language === 'ne'
                ? 'स्मार्ट भेन्यु म्याचर · नेपालका शीर्ष ३ पार्टी प्यालेस सिफारिस'
                : 'AI Smart Venue Matcher · Top 3 Party Palace Recommendations'}
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 text-balance">
            {language === 'ne'
              ? 'बजेट र प्राथमिकता अनुसार उत्कृष्ट ३ पार्टी प्यालेस छान्नुहोस्'
              : 'Match Your Celebration Budget & Preferences to Top 3 Nepal Venues'}
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Specify your occasion, any of Nepal&apos;s 77 districts, guest count, and target NPR budget.
            Our AI evaluates verified capacity, catering packages, hall rental, 10% service charge, and
            13% IRD VAT to surface the best 3 matches.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleSyncFiltersToCatalog}
            className="px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-stone-800 transition-colors whitespace-nowrap shrink-0"
          >
            Apply Criteria to Full Catalog →
          </button>
          <button
            type="button"
            onClick={() => setActiveModal('STAR_HOTEL_REQUEST')}
            className="px-4 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <Building2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Request Any Star Hotel</span>
          </button>
        </div>
      </div>

      {/* Main Split Workspace: Preferences Form (5 cols) + Top 3 Recommendations (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Event Preferences & Budget Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 space-y-5"
        >
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-800" />
              <h3 className="font-display text-base font-bold text-stone-900">
                Your Event Preferences &amp; Budget
              </h3>
            </div>
            <button
              type="button"
              onClick={handleResetPreferences}
              className="text-xs font-medium text-stone-500 hover:text-stone-900 flex items-center gap-1 whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* 1. Event Type */}
          <div>
            <label
              htmlFor="matcher-event-type"
              className="block text-xs font-semibold text-stone-700 mb-1.5"
            >
              Celebration / Event Type
            </label>
            <select
              id="matcher-event-type"
              value={eventType}
              onChange={(e) => setEventType(e.target.value as EventType)}
              className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
            >
              {EVENT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} ({opt.nepali})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Province & District (All 77 Districts Selectable OR Typeable) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NepalProvinceSelector
              label="State / Province (Optional)"
              value={province}
              onChange={(prov) => {
                setProvince(prov);
                if (!prov) setDistrict('');
              }}
              includeAllOption
              allOptionLabel="All 7 Provinces"
              placeholder="All Provinces or type..."
            />

            <NepalDistrictSelector
              label="District (77 Districts)"
              value={district}
              selectedProvince={province}
              onChange={(dist, resolvedProv) => {
                setDistrict(dist);
                if (resolvedProv) setProvince(resolvedProv);
              }}
              placeholder="Any district or type..."
              showProvinceBadge={false}
            />
          </div>

          {/* 3. Expected Guests */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="matcher-guests"
                className="text-xs font-semibold text-stone-700"
              >
                Expected Guests
              </label>
              <span className="text-xs font-bold text-amber-900 tabular-nums">
                {guestCount.toLocaleString()} guests
              </span>
            </div>
            <input
              id="matcher-guests"
              type="number"
              min={30}
              max={3000}
              step={10}
              value={guestCount}
              onChange={(e) => setGuestCount(Math.max(20, Number(e.target.value) || 20))}
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-sm font-semibold text-stone-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[150, 300, 500, 800, 1200].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setGuestCount(preset)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors tabular-nums whitespace-nowrap shrink-0 ${
                    guestCount === preset
                      ? 'bg-amber-900 text-white border-amber-900'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-amber-700'
                  }`}
                >
                  {preset} pax
                </button>
              ))}
            </div>
          </div>

          {/* 4. Budget Mode & Target Amount */}
          <div className="space-y-2.5 pt-1 border-t border-stone-100">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-stone-700">Budget Target (NPR)</span>
              <div className="inline-flex p-0.5 rounded-lg bg-stone-100 border border-stone-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setBudgetMode('TOTAL_NPR')}
                  className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    budgetMode === 'TOTAL_NPR'
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Total Budget
                </button>
                <button
                  type="button"
                  onClick={() => setBudgetMode('PER_PLATE_NPR')}
                  className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    budgetMode === 'PER_PLATE_NPR'
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Per-Plate Rate
                </button>
              </div>
            </div>

            {budgetMode === 'TOTAL_NPR' ? (
              <div>
                <input
                  type="number"
                  min={100000}
                  max={20000000}
                  step={25000}
                  value={totalBudgetNpr}
                  onChange={(e) => setTotalBudgetNpr(Math.max(50000, Number(e.target.value) || 50000))}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-sm font-semibold text-stone-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[
                    { label: 'NPR 4.5L', val: 450000 },
                    { label: 'NPR 8.5L', val: 850000 },
                    { label: 'NPR 12L', val: 1200000 },
                    { label: 'NPR 20L', val: 2000000 },
                  ].map((b) => (
                    <button
                      key={b.val}
                      type="button"
                      onClick={() => setTotalBudgetNpr(b.val)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors tabular-nums whitespace-nowrap shrink-0 ${
                        totalBudgetNpr === b.val
                          ? 'bg-amber-900 text-white border-amber-900'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-amber-700'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-stone-500 mt-1.5">
                  Includes estimated catering, hall rental, 10% service charge &amp; 13% IRD VAT.
                </p>
              </div>
            ) : (
              <div>
                <input
                  type="number"
                  min={600}
                  max={10000}
                  step={100}
                  value={perPlateBudgetNpr}
                  onChange={(e) =>
                    setPerPlateBudgetNpr(Math.max(500, Number(e.target.value) || 500))
                  }
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-sm font-semibold text-stone-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[1200, 1600, 2000, 2800].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setPerPlateBudgetNpr(rate)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors tabular-nums whitespace-nowrap shrink-0 ${
                        perPlateBudgetNpr === rate
                          ? 'bg-amber-900 text-white border-amber-900'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-amber-700'
                      }`}
                    >
                      NPR {rate.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 5. Preferred Space Setting */}
          <div className="space-y-1.5 pt-1 border-t border-stone-100">
            <span className="block text-xs font-semibold text-stone-700">
              Preferred Hall &amp; Space Vibe
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'ANY', label: 'Any Setting' },
                { id: 'INDOOR_HALL', label: 'Indoor Ballroom' },
                { id: 'GARDEN_LAWN', label: 'Garden / Lawn' },
                { id: 'ROOFTOP', label: 'Rooftop / Terrace' },
              ].map((sp) => (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => setSpaceStyle(sp.id as any)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border text-left transition-colors whitespace-nowrap truncate ${
                    spaceStyle === sp.id
                      ? 'bg-amber-900 text-white border-amber-900'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-amber-700'
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Essential Facilities */}
          <div className="space-y-2 pt-1 border-t border-stone-100">
            <span className="block text-xs font-semibold text-stone-700">
              Facility Priorities
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                {
                  checked: requireMandap,
                  onToggle: () => setRequireMandap(!requireMandap),
                  label: 'Vedic Mandap & Homa',
                },
                {
                  checked: requirePowerBackup,
                  onToggle: () => setRequirePowerBackup(!requirePowerBackup),
                  label: '100% Genset Backup',
                },
                {
                  checked: requireParking100Plus,
                  onToggle: () => setRequireParking100Plus(!requireParking100Plus),
                  label: '100+ Car Parking',
                },
                {
                  checked: requireOutsidePlanners,
                  onToggle: () => setRequireOutsidePlanners(!requireOutsidePlanners),
                  label: 'Outside Planners OK',
                },
                {
                  checked: requireWheelchairAccess,
                  onToggle: () => setRequireWheelchairAccess(!requireWheelchairAccess),
                  label: 'Wheelchair Accessible',
                },
              ].map((fac, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={fac.onToggle}
                  className={`px-3 py-2 rounded-xl border font-medium flex items-center justify-between gap-2 transition-colors ${
                    fac.checked
                      ? 'bg-amber-50 border-amber-700 text-amber-950 font-semibold'
                      : 'bg-white border-stone-200 text-stone-600 hover:border-stone-400'
                  }`}
                >
                  <span className="truncate">{fac.label}</span>
                  {fac.checked && <Check className="w-3.5 h-3.5 text-amber-800 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* 7. Special Preferences */}
          <div>
            <label
              htmlFor="matcher-notes"
              className="block text-xs font-semibold text-stone-700 mb-1.5"
            >
              Custom Event Wishes (Optional)
            </label>
            <textarea
              id="matcher-notes"
              rows={2}
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="e.g. Need traditional Newari/Thakali feast, easy Ring Road access for senior guests, quiet courtyard..."
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
            />
          </div>

          <button
            type="submit"
            disabled={isMatching}
            className="w-full py-3 px-4 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-60 whitespace-nowrap"
          >
            <Sparkles className={`w-4 h-4 text-amber-300 ${isMatching ? 'animate-spin' : ''}`} />
            <span>
              {isMatching
                ? 'Analyzing Nepal Party Palaces...'
                : 'Find Top 3 Best-Fit Party Palaces'}
            </span>
          </button>
        </form>

        {/* Right: Top 3 Recommendations Output */}
        <div className="lg:col-span-7 space-y-5">
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={runSmartMatch}
                className="px-3 py-1.5 rounded-lg bg-red-800 text-white font-semibold whitespace-nowrap shrink-0"
              >
                Retry
              </button>
            </div>
          )}

          {isMatching && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl border border-stone-200 bg-white space-y-3 animate-pulse">
                <div className="h-4 bg-stone-200 rounded w-1/3" />
                <div className="h-3.5 bg-stone-200 rounded w-5/6" />
                <div className="h-3.5 bg-stone-200 rounded w-2/3" />
              </div>
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="p-5 rounded-2xl border border-stone-200 bg-white grid grid-cols-1 sm:grid-cols-12 gap-4 animate-pulse"
                >
                  <div className="sm:col-span-4 h-36 bg-stone-200 rounded-xl" />
                  <div className="sm:col-span-8 space-y-2.5">
                    <div className="h-4 bg-stone-200 rounded w-1/2" />
                    <div className="h-3 bg-stone-200 rounded w-full" />
                    <div className="h-3 bg-stone-200 rounded w-4/5" />
                    <div className="h-8 bg-stone-200 rounded w-1/3 mt-3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isMatching && matchResult && (
            <>
              {/* Executive Match Summary */}
              <div className="p-5 rounded-2xl border border-stone-200 bg-white space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
                  <span className="font-bold text-stone-900">
                    Top {matchResult.recommendations.length} Recommended Party Palaces
                  </span>
                  <span className="tabular-nums">
                    {matchResult.generatedWith} ·{' '}
                    {new Date(matchResult.generatedAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {matchResult.matcherOverview}
                </p>
              </div>

              {/* Ranked Top 3 Venue Cards */}
              <div className="space-y-5">
                {matchResult.recommendations.map((rec, idx) => {
                  const venue = venues.find((v) => v.id === rec.venueId);
                  if (!venue) return null;

                  const estimatedTotalNpr = computeEstimatedTotalNpr(venue, guestCount);
                  const isWithinBudget =
                    budgetMode === 'TOTAL_NPR'
                      ? estimatedTotalNpr <= totalBudgetNpr
                      : venue.cateringStartingNpr <= perPlateBudgetNpr;
                  const saved = isVenueSaved(venue.id);

                  return (
                    <article
                      key={venue.id}
                      className="bg-white rounded-3xl border border-stone-200 overflow-hidden transition-shadow hover:shadow-md"
                    >
                      {/* Top Rank Header Row */}
                      <div className="px-5 py-3 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="font-bold text-amber-950">
                          {RANK_LABELS[idx] || `0${idx + 1}. Curated Match`}
                        </span>

                        <div className="flex items-center gap-3 text-stone-600 tabular-nums">
                          <span className="flex items-center gap-1 font-semibold text-stone-900">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {venue.rating.toFixed(1)} ({venue.reviewCount})
                          </span>
                          <span aria-hidden="true">·</span>
                          <span
                            className={`font-semibold flex items-center gap-1 ${
                              isWithinBudget ? 'text-emerald-800' : 'text-amber-900'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            {isWithinBudget ? 'Within Target Budget' : 'Open to Negotiation'}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 grid grid-cols-1 sm:grid-cols-12 gap-5">
                        {/* Venue Photo & Quick Metrics */}
                        <div className="sm:col-span-4 space-y-3">
                          <div className="rounded-2xl overflow-hidden border border-stone-200">
                            <VenueImageVisual
                              type={venue.coverImage}
                              name={venue.name}
                              className="h-40 sm:h-44 w-full"
                            />
                          </div>

                          <div className="text-xs space-y-1 text-stone-600">
                            <div className="flex items-center justify-between">
                              <span>Per-Plate From</span>
                              <strong className="text-stone-900 tabular-nums">
                                NPR {venue.cateringStartingNpr.toLocaleString()}
                              </strong>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Capacity</span>
                              <strong className="text-stone-900 tabular-nums">
                                {venue.minGuests}–{venue.maxGuests} pax
                              </strong>
                            </div>
                            <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                              <span>Est. Total ({guestCount} pax)</span>
                              <strong className="text-amber-950 tabular-nums">
                                NPR {estimatedTotalNpr.toLocaleString()}
                              </strong>
                            </div>
                          </div>
                        </div>

                        {/* AI Rationale & Venue Actions */}
                        <div className="sm:col-span-8 flex flex-col justify-between space-y-4">
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-display text-lg font-bold text-stone-900 leading-snug">
                                {venue.name}
                              </h4>
                              <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500 mt-0.5">
                                <span>{venue.nepaliName}</span>
                                <span aria-hidden="true">·</span>
                                <span className="inline-flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                                  {venue.locality}, {venue.district} ({venue.province})
                                </span>
                              </div>
                            </div>

                            <p className="text-xs sm:text-[13px] text-stone-700 leading-relaxed">
                              {rec.fitSummary}
                            </p>

                            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700">
                              <strong className="text-stone-900">Budget Assessment: </strong>
                              <span className="tabular-nums">{rec.budgetBreakdownNote}</span>
                            </div>

                            {/* Matched Highlights */}
                            {rec.matchedHighlights.length > 0 && (
                              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-stone-700">
                                {rec.matchedHighlights.map((hl, hIdx) => (
                                  <li key={hIdx} className="flex items-start gap-1.5">
                                    <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                                    <span>{hl}</span>
                                  </li>
                                ))}
                              </ul>
                            )}

                            {rec.tradeoffOrTip && (
                              <div className="flex items-start gap-2 text-xs text-stone-600 pt-1">
                                <Lightbulb className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                                <span>{rec.tradeoffOrTip}</span>
                              </div>
                            )}
                          </div>

                          {/* Card Footer Actions */}
                          <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedVenue(venue)}
                              className="flex-1 min-w-[140px] py-2.5 px-4 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                            >
                              <span>Inspect Full Details</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setQuickPeekVenueId(venue.id)}
                              className="py-2.5 px-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                            >
                              <Eye className="w-3.5 h-3.5 text-amber-800" />
                              <span>Quick Peek</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleSaveVenue(venue.id)}
                              className={`py-2.5 px-3.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                                saved
                                  ? 'bg-amber-50 border-amber-700 text-amber-950'
                                  : 'bg-white border-stone-200 text-stone-700 hover:border-stone-400'
                              }`}
                            >
                              <Bookmark
                                className={`w-3.5 h-3.5 ${
                                  saved ? 'fill-amber-700 text-amber-800' : 'text-stone-500'
                                }`}
                              />
                              <span>{saved ? 'Saved' : 'Save'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
