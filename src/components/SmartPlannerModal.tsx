/**
 * UTSAVO - Smart Conversational Event Planning Assistant & Hindu Panchanga Cross-Referencer
 * Suggests auspicious dates for specific event types based on Nepal Panchanga Nirnayak Samiti data,
 * cross-referencing every Muhurat against guest count, budget, location, shift, space & facility requirements.
 */

import React, { useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { NEPALI_MONTHS } from '../data/panchangaCalendar';
import {
  MuhuratCrossReferenceResult,
  suggestAndCrossReferenceMuhurats,
} from '../utils/panchangaPlannerEngine';
import { EventType, ShiftTime, Venue } from '../types';
import {
  X,
  RotateCcw,
  Check,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Ban,
  Building2,
  MapPin,
  SlidersHorizontal,
} from 'lucide-react';
import { NepalDistrictSelector, NepalProvinceSelector } from './NepalLocationSelector';

const EVENT_TYPE_OPTIONS: Array<{ id: EventType; label: string; nepali: string }> = [
  { id: 'WEDDING', label: 'Wedding (Bibaha)', nepali: 'विवाह' },
  { id: 'RECEPTION', label: 'Reception Gala', nepali: 'प्रीतिभोज' },
  { id: 'BRATABANDHA', label: 'Bratabandha', nepali: 'व्रतबन्ध' },
  { id: 'PASNI', label: 'Pasni / Rice Weaning', nepali: 'पास्नी' },
  { id: 'ENGAGEMENT', label: 'Engagement / Tika', nepali: 'टीका / मगनी' },
  { id: 'GRIHA_PRAVESH', label: 'Griha Pravesh', nepali: 'गृह प्रवेश' },
  { id: 'CORPORATE_GALA', label: 'Corporate Program', nepali: 'कर्पोरेट भेला' },
  { id: 'BIRTHDAY_JUBILEE', label: 'Birthday / Jubilee', nepali: 'जन्मोत्सव' },
  { id: 'OTHER_CELEBRATION', label: 'Other Celebration', nepali: 'अन्य उत्सव' },
];

const SHIFT_OPTIONS: Array<{ id: 'ANY' | ShiftTime; label: string }> = [
  { id: 'ANY', label: 'Any Shift (Flexible)' },
  { id: 'MORNING', label: 'Morning (07:00 AM – 12:00 PM)' },
  { id: 'DAY', label: 'Day (11:30 AM – 04:30 PM)' },
  { id: 'EVENING', label: 'Evening (05:00 PM – 10:00 PM)' },
  { id: 'FULL_DAY', label: 'Full Day Ceremony' },
];

const GRADE_LABELS: Record<MuhuratCrossReferenceResult['panchangaGrade'], string> = {
  SARVA_SIDDHI: 'Sarva Siddhi Muhurat',
  ABHIJIT_YOGA: 'Abhijit / Pushya Yoga',
  SHUBHA_LAGNA: 'Shubha Lagna',
};

export const SmartPlannerModal: React.FC = () => {
  const { language } = useLanguage();
  const {
    activeModal,
    setActiveModal,
    setFilters,
    venues,
    bookings,
    negotiations,
    setSelectedVenue,
  } = useMarketplace();

  // 4-step flexible workflow (Step 4 = Panchanga Dates & Requirement Cross-Reference)
  const [step, setStep] = useState<number>(1);

  // Step 1: Event Type & Location
  const [eventType, setEventType] = useState<EventType>('WEDDING');
  const [selectedProvince, setSelectedProvince] = useState<string>('Bagmati Province');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Kathmandu');
  const [includeAdjacent, setIncludeAdjacent] = useState<boolean>(true);

  // Step 2: Guests, Shift, Season & Per-Plate Budget
  const [guestRange, setGuestRange] = useState<number>(350);
  const [perPlateBudget, setPerPlateBudget] = useState<number>(2200);
  const [preferredShift, setPreferredShift] = useState<'ANY' | ShiftTime>('ANY');
  const [preferredMonthBS, setPreferredMonthBS] = useState<string>('ALL');

  // Step 3: Space & Facility Requirements
  const [spacePreference, setSpacePreference] = useState<'ANY' | 'INDOOR' | 'LAWN_GARDEN'>('ANY');
  const [needMandap, setNeedMandap] = useState<boolean>(true);
  const [needGenset, setNeedGenset] = useState<boolean>(true);
  const [parkingCarsRequired, setParkingCarsRequired] = useState<number>(60);
  const [wantFoodRescueConsent, setWantFoodRescueConsent] = useState<boolean>(false);

  // Step 4: Selected Auspicious Date & Cross-Reference UI State
  const [selectedMuhuratId, setSelectedMuhuratId] = useState<string | null>(null);
  const [expandedDateId, setExpandedDateId] = useState<string | null>(null);
  const [crossRefFilter, setCrossRefFilter] = useState<'ALL' | 'OPEN_ONLY' | 'IDEAL_ONLY'>('ALL');

  const panchangaSuggestions = useMemo(() => {
    return suggestAndCrossReferenceMuhurats(
      {
        eventType,
        province: selectedProvince,
        district: selectedDistrict,
        includeAdjacentDistricts: includeAdjacent,
        guestCount: guestRange,
        maxPerPlateBudget: perPlateBudget,
        preferredShift,
        spacePreference,
        needMandap,
        needGenset,
        parkingCarsRequired,
        preferredMonthBS,
      },
      venues,
      bookings,
      negotiations
    );
  }, [
    eventType,
    selectedProvince,
    selectedDistrict,
    includeAdjacent,
    guestRange,
    perPlateBudget,
    preferredShift,
    spacePreference,
    needMandap,
    needGenset,
    parkingCarsRequired,
    preferredMonthBS,
    venues,
    bookings,
    negotiations,
  ]);

  const filteredSuggestions = useMemo(() => {
    return panchangaSuggestions.filter((item) => {
      if (crossRefFilter === 'IDEAL_ONLY') {
        return item.overallVerdict === 'IDEAL_MATCH';
      }
      if (crossRefFilter === 'OPEN_ONLY') {
        return item.perfectAvailableVenuesCount + item.partialAvailableVenuesCount > 0;
      }
      return true;
    });
  }, [panchangaSuggestions, crossRefFilter]);

  const selectedMuhuratEntry = useMemo(() => {
    if (!selectedMuhuratId) return null;
    return panchangaSuggestions.find((s) => s.muhurat.id === selectedMuhuratId) || null;
  }, [panchangaSuggestions, selectedMuhuratId]);

  const stats = useMemo(() => {
    return {
      totalDates: panchangaSuggestions.length,
      idealCount: panchangaSuggestions.filter((s) => s.overallVerdict === 'IDEAL_MATCH').length,
      openDatesCount: panchangaSuggestions.filter(
        (s) => s.perfectAvailableVenuesCount + s.partialAvailableVenuesCount > 0
      ).length,
    };
  }, [panchangaSuggestions]);

  if (activeModal !== 'SMART_PLANNER') return null;

  const handleFinishAndShowVenues = () => {
    setFilters((prev) => ({
      ...prev,
      province: selectedProvince,
      district: selectedDistrict,
      eventType,
      guestCount: guestRange,
      maxPerPlateBudget: perPlateBudget,
      includeAdjacentDistricts: includeAdjacent,
      dateBS: selectedMuhuratEntry ? selectedMuhuratEntry.muhurat.dateBS : prev.dateBS,
      dateAD: selectedMuhuratEntry ? selectedMuhuratEntry.muhurat.dateAD : prev.dateAD,
    }));
    setActiveModal('NONE');
    const el = document.getElementById('venues-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleJumpToVenueFromDate = (venue: Venue, item: MuhuratCrossReferenceResult) => {
    setSelectedMuhuratId(item.muhurat.id);
    setFilters((prev) => ({
      ...prev,
      province: selectedProvince,
      district: selectedDistrict,
      eventType,
      guestCount: guestRange,
      maxPerPlateBudget: perPlateBudget,
      includeAdjacentDistricts: includeAdjacent,
      dateBS: item.muhurat.dateBS,
      dateAD: item.muhurat.dateAD,
    }));
    setSelectedVenue(venue);
    setActiveModal('NONE');
  };

  const handleStartOver = () => {
    setStep(1);
    setEventType('WEDDING');
    setSelectedProvince('Bagmati Province');
    setSelectedDistrict('Kathmandu');
    setIncludeAdjacent(true);
    setGuestRange(350);
    setPerPlateBudget(2200);
    setPreferredShift('ANY');
    setPreferredMonthBS('ALL');
    setSpacePreference('ANY');
    setNeedMandap(true);
    setNeedGenset(true);
    setParkingCarsRequired(60);
    setWantFoodRescueConsent(false);
    setSelectedMuhuratId(null);
    setExpandedDateId(null);
    setCrossRefFilter('ALL');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-stone-900 text-white flex items-start justify-between gap-4 border-b border-stone-800">
          <div>
            <div className="text-xs font-semibold text-amber-300 tracking-wide mb-1">
              {language === 'ne'
                ? 'स्मार्ट उत्सव योजनाकार र पञ्चाङ्ग साइत मिलान'
                : 'Smart Planning Assistant · Hindu Panchanga Cross-Reference'}
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-balance">
              {language === 'ne'
                ? 'तपाईंको आवश्यकताअनुसार शुभ साइत र उपयुक्त स्थल मिलाउनुहोस्'
                : 'Match Requirements & Discover Auspicious Panchanga Dates'}
            </h3>
            <p className="text-xs text-stone-300 mt-1">
              {language === 'ne'
                ? 'कुनै पनि चरण अनिवार्य छैन। पञ्चाङ्ग शुभ लगनलाई अतिथि, बजेट, सिफ्ट र उपलब्ध स्थलहरूसँग तुरुन्त जाँच गर्नुहोस्।'
                : 'Cross-reference Samiti auspicious dates directly against your guests, NPR budget, shift window, facility specs, and live bookings.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveModal('NONE')}
            className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors shrink-0"
            aria-label="Close smart planner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clickable 4-Step Segmented Bar */}
        <div className="px-5 sm:px-6 py-3 bg-stone-100 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-200/80 rounded-xl text-xs">
            {[
              { n: 1, label: '01. Event & Place' },
              { n: 2, label: '02. Pax & Budget' },
              { n: 3, label: '03. Facilities' },
              { n: 4, label: `04. Panchanga Dates (${stats.totalDates})` },
            ].map((s) => (
              <button
                key={s.n}
                type="button"
                onClick={() => setStep(s.n)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  step === s.n
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleFinishAndShowVenues}
            className="text-xs text-amber-900 font-semibold hover:underline whitespace-nowrap shrink-0"
          >
            {language === 'ne' ? 'सिधै स्थलहरू हेर्नुहोस्' : 'Skip to Venues →'}
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[62vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-stone-800 block mb-2">
                  {language === 'ne'
                    ? '१. कुन उत्सवको तयारी गर्दै हुनुहुन्छ?'
                    : '1. Select Your Celebration Type'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {EVENT_TYPE_OPTIONS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setEventType(item.id);
                        setSelectedMuhuratId(null);
                      }}
                      className={`p-3 rounded-xl border text-left text-xs transition-colors flex flex-col gap-0.5 cursor-pointer ${
                        eventType === item.id
                          ? 'border-amber-900 bg-amber-50 text-amber-950 font-semibold'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <span className="font-semibold truncate">{item.label}</span>
                      <span className="text-[11px] text-stone-500">{item.nepali}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200">
                <label className="text-xs font-bold text-stone-800 block mb-2">
                  {language === 'ne'
                    ? '२. प्रदेश र जिल्ला छनोट गर्नुहोस्'
                    : '2. Target Location in Nepal'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <NepalProvinceSelector
                    label="Province (प्रदेश)"
                    value={selectedProvince}
                    onChange={(p) => setSelectedProvince(p)}
                    placeholder="Type or pick province..."
                  />
                  <NepalDistrictSelector
                    label="District (जिल्ला)"
                    value={selectedDistrict}
                    selectedProvince={selectedProvince}
                    onChange={(d, prov) => {
                      setSelectedDistrict(d);
                      if (prov && !selectedProvince) setSelectedProvince(prov);
                    }}
                    placeholder="Type or pick from 77 districts..."
                  />
                </div>
                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer mt-3">
                  <input
                    type="checkbox"
                    checked={includeAdjacent}
                    onChange={(e) => setIncludeAdjacent(e.target.checked)}
                    className="rounded text-amber-900 focus:ring-amber-800"
                  />
                  <span>Include matching venues in adjacent nearby districts when cross-referencing dates</span>
                </label>
              </div>

              {/* Quiet Inline Panchanga Readiness Bar */}
              <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-stone-700">
                  <strong className="text-stone-900">{stats.totalDates} Samiti Panchanga dates</strong>{' '}
                  found for{' '}
                  <strong className="text-amber-950">
                    {EVENT_TYPE_OPTIONS.find((o) => o.id === eventType)?.label}
                  </strong>{' '}
                  <span aria-hidden="true">·</span>{' '}
                  <span className="tabular-nums text-emerald-800 font-semibold">
                    {stats.openDatesCount} have open venue availability
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-3.5 py-2 bg-amber-900 hover:bg-amber-950 text-white rounded-xl font-semibold whitespace-nowrap shrink-0 inline-flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Jump to Panchanga Dates →</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-stone-800">
                    {language === 'ne'
                      ? '३. अपेक्षित अतिथि संख्या (Guest Count)'
                      : '3. Expected Guest Count'}
                  </label>
                  <span className="text-sm font-bold text-amber-950 font-display tabular-nums">
                    {guestRange} Guests
                  </span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="1200"
                  step="25"
                  value={guestRange}
                  onChange={(e) => setGuestRange(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-900"
                />
                <div className="flex justify-between text-[11px] text-stone-500 mt-1 tabular-nums">
                  <span>80 (Intimate)</span>
                  <span>400 (Medium)</span>
                  <span>800 (Grand)</span>
                  <span>1,200+ (Royal)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-stone-800">
                    {language === 'ne'
                      ? '४. प्रति-प्लेट बजेट सीमा (Max Per-Plate Budget)'
                      : '4. Maximum Per-Plate Budget'}
                  </label>
                  <span className="text-sm font-bold text-amber-950 font-display tabular-nums">
                    NPR {perPlateBudget.toLocaleString()} / plate
                  </span>
                </div>
                <input
                  type="range"
                  min="1100"
                  max="3500"
                  step="50"
                  value={perPlateBudget}
                  onChange={(e) => setPerPlateBudget(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-900"
                />
                <div className="flex justify-between text-[11px] text-stone-500 mt-1 tabular-nums">
                  <span>NPR 1,100</span>
                  <span>NPR 1,800</span>
                  <span>NPR 2,600</span>
                  <span>NPR 3,500+</span>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1.5">
                    5. Preferred Celebration Shift (Lagna Alignment)
                  </label>
                  <select
                    value={preferredShift}
                    onChange={(e) => setPreferredShift(e.target.value as 'ANY' | ShiftTime)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-800"
                  >
                    {SHIFT_OPTIONS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1.5">
                    6. Preferred Nepali Month (Optional)
                  </label>
                  <select
                    value={preferredMonthBS}
                    onChange={(e) => setPreferredMonthBS(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-800"
                  >
                    <option value="ALL">All Upcoming Auspicious Months (2083–2085 BS · 2026–2028)</option>
                    {NEPALI_MONTHS.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name} ({m.nepaliName}) · {m.season}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-stone-800 block mb-2">
                  {language === 'ne'
                    ? '७. स्थलको शैली (Hall or Lawn Setting)'
                    : '7. Preferred Venue Setting (Cross-Checked Against Seasonal Weather)'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  {[
                    { id: 'ANY', label: 'Flexible (Indoor or Lawn)' },
                    { id: 'INDOOR', label: 'AC Indoor Ballroom' },
                    { id: 'LAWN_GARDEN', label: 'Open Lawn / Garden' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSpacePreference(s.id as 'ANY' | 'INDOOR' | 'LAWN_GARDEN')}
                      className={`p-3 rounded-xl border text-center transition-colors whitespace-nowrap cursor-pointer ${
                        spacePreference === s.id
                          ? 'border-amber-900 bg-amber-50 text-amber-950 font-semibold'
                          : 'border-stone-200 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-stone-800">
                    8. Minimum Car Parking Capacity Required
                  </label>
                  <span className="text-xs font-bold text-amber-950 tabular-nums">
                    {parkingCarsRequired}+ Cars
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="20"
                  value={parkingCarsRequired}
                  onChange={(e) => setParkingCarsRequired(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-900"
                />
              </div>

              <div className="space-y-2.5 pt-2 border-t border-stone-200">
                <label className="text-xs font-bold text-stone-800 block">
                  {language === 'ne' ? '९. आवश्यक सुविधाहरू' : '9. Mandatory Facilities'}
                </label>
                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needMandap}
                    onChange={(e) => setNeedMandap(e.target.checked)}
                    className="rounded text-amber-900 focus:ring-amber-800"
                  />
                  <span>
                    {language === 'ne'
                      ? 'विवाह मण्डप तथा होमको अनुमति आवश्यक'
                      : 'Vedic Mandap & Sacred Havan Fire Setup Required'}
                  </span>
                </label>
                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needGenset}
                    onChange={(e) => setNeedGenset(e.target.checked)}
                    className="rounded text-amber-900 focus:ring-amber-800"
                  />
                  <span>
                    {language === 'ne'
                      ? '१००% पावर ब्याकअप जेनेरेटर सुनिश्चित हुनुपर्ने'
                      : '100% Generator Power Backup Required'}
                  </span>
                </label>

                <label className="flex items-start gap-2 text-xs text-stone-700 cursor-pointer pt-2 border-t border-stone-100">
                  <input
                    type="checkbox"
                    checked={wantFoodRescueConsent}
                    onChange={(e) => setWantFoodRescueConsent(e.target.checked)}
                    className="rounded text-amber-900 focus:ring-amber-800 mt-0.5"
                  />
                  <span>
                    <strong className="text-stone-900 block">
                      {language === 'ne'
                        ? 'अन्नपूर्णा सेवा (स्वेच्छिक): बाँकी रहेको भोजन वृद्धआश्रममा वितरण गर्ने'
                        : 'Annapurna Seva (Voluntary): Pledge untouched surplus feast food to verified shelters'}
                    </strong>
                    <span className="text-[11px] text-stone-500 block mt-0.5">
                      Dispatched safely only with explicit client consent under DFTQC hygiene rules.
                    </span>
                  </span>
                </label>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              {/* Live Cross-Reference Filter & Parameter Adjustments */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="text-stone-700 flex flex-wrap items-center gap-2 tabular-nums">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-amber-800" />
                    <strong className="text-stone-900">
                      {EVENT_TYPE_OPTIONS.find((e) => e.id === eventType)?.label}
                    </strong>
                    <span aria-hidden="true">·</span>
                    <span>{selectedDistrict || selectedProvince || 'All Nepal'}</span>
                    <span aria-hidden="true">·</span>
                    <span>{guestRange} Guests</span>
                    <span aria-hidden="true">·</span>
                    <span>Up to NPR {perPlateBudget.toLocaleString()}/plate</span>
                    <span aria-hidden="true">·</span>
                    <span>{spacePreference.replace('_', ' ')}</span>
                  </div>

                  <div className="text-[11px] text-stone-600 tabular-nums">
                    <strong>{stats.idealCount}</strong> Ideal Fit <span aria-hidden="true">·</span>{' '}
                    <strong>{stats.openDatesCount}</strong> Open Dates
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-200">
                  <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-stone-200 text-xs">
                    {[
                      { id: 'ALL', label: `All Panchanga Dates (${stats.totalDates})` },
                      { id: 'OPEN_ONLY', label: `Open Venue Slots (${stats.openDatesCount})` },
                      { id: 'IDEAL_ONLY', label: `Ideal Spec Fit (${stats.idealCount})` },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setCrossRefFilter(f.id as 'ALL' | 'OPEN_ONLY' | 'IDEAL_ONLY')}
                        className={`px-2.5 py-1 rounded-lg font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          crossRefFilter === f.id
                            ? 'bg-stone-900 text-white'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <select
                      aria-label="Filter shift alignment"
                      value={preferredShift}
                      onChange={(e) => setPreferredShift(e.target.value as 'ANY' | ShiftTime)}
                      className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-800"
                    >
                      {SHIFT_OPTIONS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.id === 'ANY' ? 'Shift: Any' : `Shift: ${s.id}`}
                        </option>
                      ))}
                    </select>
                    <select
                      aria-label="Filter Nepali month"
                      value={preferredMonthBS}
                      onChange={(e) => setPreferredMonthBS(e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-800"
                    >
                      <option value="ALL">Month: All</option>
                      {NEPALI_MONTHS.map((m) => (
                        <option key={m.id} value={m.name}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Ranked Auspicious Dates List */}
              {filteredSuggestions.length === 0 ? (
                <div className="p-8 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-3 text-xs">
                  <Calendar className="w-8 h-8 text-stone-400 mx-auto" />
                  <h4 className="font-bold text-stone-900 text-sm">
                    No Panchanga Dates Match the Strict Filter View
                  </h4>
                  <p className="text-stone-600 max-w-md mx-auto">
                    Reset the strict date filter or enable adjacent districts to inspect additional auspicious Samiti dates and venue matches.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCrossRefFilter('ALL');
                        setPreferredMonthBS('ALL');
                        setIncludeAdjacent(true);
                      }}
                      className="px-4 py-2 bg-amber-900 text-white rounded-xl font-semibold"
                    >
                      Show All Matched Dates
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveModal('STAR_HOTEL_REQUEST')}
                      className="px-4 py-2 bg-white border border-stone-300 text-stone-800 rounded-xl font-semibold"
                    >
                      Request Star Hotel Concierge
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredSuggestions.map((item) => {
                    const isSelected = selectedMuhuratId === item.muhurat.id;
                    const isExpanded = expandedDateId === item.muhurat.id;
                    const verdictIsIdeal = item.overallVerdict === 'IDEAL_MATCH';
                    const verdictIsHighDemand = item.overallVerdict === 'HIGH_DEMAND';

                    return (
                      <div
                        key={item.muhurat.id}
                        className={`rounded-2xl border p-4 transition-colors space-y-3 ${
                          isSelected
                            ? 'border-amber-900 bg-amber-50/40'
                            : 'border-stone-200 bg-white hover:border-stone-300'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1.5 flex-1 min-w-0">
                            {/* Unboxed metadata header line */}
                            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-stone-500">
                              <span className="font-semibold text-amber-900">
                                {GRADE_LABELS[item.panchangaGrade]}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>{item.seasonLabel}</span>
                              <span aria-hidden="true">·</span>
                              <span
                                className={`inline-flex items-center gap-1 font-semibold ${
                                  verdictIsIdeal
                                    ? 'text-emerald-800'
                                    : verdictIsHighDemand
                                    ? 'text-rose-800'
                                    : 'text-amber-800'
                                }`}
                              >
                                {verdictIsIdeal ? (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                ) : verdictIsHighDemand ? (
                                  <Ban className="w-3.5 h-3.5" />
                                ) : (
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                )}
                                <span>
                                  {verdictIsIdeal
                                    ? 'Ideal Match'
                                    : verdictIsHighDemand
                                    ? 'High Demand'
                                    : 'Partial Match'}
                                </span>
                              </span>
                            </div>

                            <div className="flex flex-wrap items-baseline gap-2">
                              <h4 className="font-display text-base sm:text-lg font-bold text-stone-900 tabular-nums">
                                {item.muhurat.dateBS} BS
                              </h4>
                              <span className="text-xs text-stone-500 tabular-nums">
                                ({item.muhurat.dateAD} AD)
                              </span>
                            </div>

                            <div className="text-xs text-stone-700 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                              <span>
                                <strong>Tithi:</strong> {item.muhurat.tithi}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>
                                <strong>Nakshatra:</strong> {item.muhurat.nakshatra}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums inline-flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-800" />
                                <strong>Lagan:</strong> {item.muhurat.auspiciousTime}
                              </span>
                            </div>

                            <p className="text-xs text-stone-600">{item.muhurat.significance}</p>
                          </div>

                          {/* Date Selection & Expansion Controls */}
                          <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedMuhuratId(isSelected ? null : item.muhurat.id)
                              }
                              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-800 text-white'
                                  : 'bg-amber-900 hover:bg-amber-950 text-white'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                              <span>{isSelected ? 'Date Selected' : 'Select Date'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setExpandedDateId(isExpanded ? null : item.muhurat.id)
                              }
                              className="px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              <span>
                                Cross-Ref ({item.matchedVenues.length} Venues)
                              </span>
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Requirement Cross-Reference Summary Row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-stone-200/80 text-xs tabular-nums">
                          <div>
                            <span className="text-[11px] text-stone-500 block">Open Matching Venues</span>
                            <strong
                              className={
                                item.perfectAvailableVenuesCount + item.partialAvailableVenuesCount > 0
                                  ? 'text-emerald-800'
                                  : 'text-rose-800'
                              }
                            >
                              {item.perfectAvailableVenuesCount} Full · {item.partialAvailableVenuesCount} Partial
                            </strong>
                          </div>
                          <div>
                            <span className="text-[11px] text-stone-500 block">Shift &amp; Lagna Fit</span>
                            <strong className={item.shiftAligned ? 'text-stone-900' : 'text-amber-800'}>
                              {item.shiftAligned
                                ? `Aligned (${item.recommendedShifts.slice(0, 2).join('/')})`
                                : `Favors ${item.recommendedShifts[0]}`}
                            </strong>
                          </div>
                          <div>
                            <span className="text-[11px] text-stone-500 block">Weather &amp; Space</span>
                            <strong
                              className={
                                item.weatherOutdoorSuitable ? 'text-stone-900' : 'text-amber-800'
                              }
                            >
                              {item.weatherOutdoorSuitable ? 'Suitable' : 'Covered Backup Advised'}
                            </strong>
                          </div>
                          <div>
                            <span className="text-[11px] text-stone-500 block">Reserved on Date</span>
                            <strong className="text-stone-800">
                              {item.bookedMatchingVenuesCount} of {item.totalRequirementMatchingVenues} booked
                            </strong>
                          </div>
                        </div>

                        {/* Concise Cross-Reference Advisories */}
                        {item.advisoryNotes.length > 0 && (
                          <div className="text-[11px] text-stone-600 space-y-0.5 pt-1">
                            {item.advisoryNotes.map((note, idx) => (
                              <div key={idx}>• {note}</div>
                            ))}
                          </div>
                        )}

                        {/* Expanded Cross-Referenced Venue Breakdown Table */}
                        {isExpanded && (
                          <div className="pt-3 border-t border-stone-200 space-y-2.5">
                            <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
                              <span className="inline-flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-amber-800" />
                                <span>
                                  Venue Requirement Cross-Reference on {item.muhurat.dateBS} BS
                                </span>
                              </span>
                              <span className="text-[11px] text-stone-500 font-normal">
                                Checked against capacity, plate rate, setting, mandap, genset &amp; parking
                              </span>
                            </div>

                            <div className="divide-y divide-stone-200 border border-stone-200 rounded-xl overflow-hidden bg-stone-50/50">
                              {item.matchedVenues.map((vm) => (
                                <div
                                  key={vm.venue.id}
                                  className="p-3 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                                >
                                  <div className="min-w-0 space-y-0.5">
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                      <strong className="text-stone-900 truncate">
                                        {vm.venue.name}
                                      </strong>
                                      <span className="text-[11px] text-stone-500 inline-flex items-center gap-0.5">
                                        <MapPin className="w-3 h-3 text-stone-400" />
                                        {vm.venue.district}
                                      </span>
                                      <span aria-hidden="true">·</span>
                                      <span className="text-[11px] font-mono tabular-nums text-amber-900 font-semibold">
                                        {vm.matchedCriteriaCount}/{vm.totalCriteriaCount} specs met
                                      </span>
                                    </div>
                                    <div className="text-[11px] text-stone-500 tabular-nums flex flex-wrap items-center gap-x-2">
                                      <span>Up to {vm.venue.maxGuests} pax</span>
                                      <span aria-hidden="true">·</span>
                                      <span>NPR {vm.venue.cateringStartingNpr.toLocaleString()}/plate</span>
                                      <span aria-hidden="true">·</span>
                                      <span
                                        className={`font-semibold ${
                                          vm.availabilityStatus === 'BOOKED_UNAVAILABLE'
                                            ? 'text-rose-800'
                                            : vm.availabilityStatus === 'LIMITED_HOLD'
                                            ? 'text-amber-800'
                                            : 'text-emerald-800'
                                        }`}
                                      >
                                        {vm.availabilityNote}
                                      </span>
                                    </div>
                                  </div>

                                  {vm.availabilityStatus !== 'BOOKED_UNAVAILABLE' ? (
                                    <button
                                      type="button"
                                      onClick={() => handleJumpToVenueFromDate(vm.venue, item)}
                                      className="px-3 py-1.5 bg-amber-900 hover:bg-amber-950 text-white rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
                                    >
                                      Inspect on Date →
                                    </button>
                                  ) : (
                                    <span className="text-[11px] font-semibold text-rose-800 whitespace-nowrap shrink-0">
                                      Booked on {item.muhurat.dateBS}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleStartOver}
              className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'ne' ? 'सुरुबाट' : 'Reset'}</span>
            </button>

            {selectedMuhuratEntry && (
              <span className="text-xs text-stone-700 tabular-nums">
                Locked Date:{' '}
                <strong className="text-amber-950">{selectedMuhuratEntry.muhurat.dateBS} BS</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-100 transition-colors"
              >
                {language === 'ne' ? 'अघिल्लो' : 'Back'}
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-950 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <span>
                  {step === 3
                    ? language === 'ne'
                      ? 'शुभ साइत जाँच्नुहोस्'
                      : 'See Panchanga Dates'
                    : language === 'ne'
                    ? 'अर्को'
                    : 'Continue'}
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishAndShowVenues}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Check className="w-4 h-4" />
                <span>
                  {selectedMuhuratEntry
                    ? `Apply ${selectedMuhuratEntry.muhurat.dateBS} & Show Venues`
                    : language === 'ne'
                    ? 'स्थलहरू देखाउनुहोस्'
                    : 'Show Matching Venues'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
