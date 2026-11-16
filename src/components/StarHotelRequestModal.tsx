/**
 * UTSAVO — Client Star Hotel Venue Request & Admin Concierge Modal
 * Allows clients to request any 3-Star, 4-Star, 5-Star, Heritage, or 7-Star hotel
 * (specific property names or open recommendations in Nepal or worldwide) so the
 * UTSAVO System Admin can source availability, negotiate corporate rates, and list it.
 */

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { NepalDistrictSelector } from './NepalLocationSelector';
import {
  EventType,
  ShiftTime,
  StarHotelSourcingRequest,
  StarHotelTier,
} from '../types';
import {
  X,
  Building2,
  Star,
  CheckCircle2,
  Calendar,
  Users,
  BedDouble,
  Globe,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const STAR_TIER_OPTIONS: Array<{ value: StarHotelTier; label: string; hint: string }> = [
  { value: '5_STAR_LUXURY', label: '5-Star Luxury Hotel', hint: 'e.g. Hyatt, Marriott, Soaltee, Hilton' },
  { value: '5_STAR_HERITAGE_RESORT', label: '5-Star Heritage / Resort', hint: "e.g. Dwarika's, Tiger Mountain, Sarangkot" },
  { value: '4_STAR', label: '4-Star Boutique / Business', hint: 'e.g. Aloft, Courtyard, Barahi, Fishtail' },
  { value: '3_STAR', label: '3-Star Classic Banquet', hint: 'Comfortable rooms & courtyard ballroom' },
  { value: '7_STAR_ULTRA_LUXURY', label: '7-Star Ultra-Luxury', hint: 'Royal palace suites & full-property buyout' },
  { value: 'ANY_TOP_STAR', label: 'Any Verified 3★–5★ Option', hint: 'Let UTSAVO Admin curate the best match' },
];

const BANQUET_SETTINGS: Array<{
  value: StarHotelSourcingRequest['banquetSetting'];
  label: string;
}> = [
  { value: 'INDOOR_BALLROOM', label: 'Grand Indoor Ballroom' },
  { value: 'POOLSIDE_LAWN', label: 'Poolside Garden / Lawn' },
  { value: 'ROOFTOP_TERRACE', label: 'Rooftop Skyline Terrace' },
  { value: 'FULL_HOTEL_BUYOUT', label: 'Full Hotel Buyout (Private)' },
];

export const StarHotelRequestModal: React.FC = () => {
  const { language } = useLanguage();
  const { activeModal, setActiveModal, currentUser, submitStarHotelRequest } = useMarketplace();

  const [clientName, setClientName] = useState(currentUser.name || '');
  const [clientEmail, setClientEmail] = useState(currentUser.email || '');
  const [clientPhone, setClientPhone] = useState(currentUser.phone || '');
  const [starTier, setStarTier] = useState<StarHotelTier>('5_STAR_LUXURY');
  const [preferredHotelNames, setPreferredHotelNames] = useState('');
  const [openToAdminRecommendations, setOpenToAdminRecommendations] = useState(true);

  const [locationScope, setLocationScope] = useState<'INSIDE_NEPAL' | 'OUTSIDE_NEPAL'>('INSIDE_NEPAL');
  const [districtOrCity, setDistrictOrCity] = useState('Kathmandu');
  const [country, setCountry] = useState('Nepal');

  const [eventType, setEventType] = useState<EventType>('WEDDING');
  const [eventDateBS, setEventDateBS] = useState('2083 Falgun 15');
  const [eventDateAD, setEventDateAD] = useState('2027-02-27');
  const [shift, setShift] = useState<ShiftTime>('EVENING');
  const [estimatedGuests, setEstimatedGuests] = useState(300);

  const [roomBlockNeeded, setRoomBlockNeeded] = useState(true);
  const [roomsCount, setRoomsCount] = useState(25);
  const [banquetSetting, setBanquetSetting] =
    useState<StarHotelSourcingRequest['banquetSetting']>('POOLSIDE_LAWN');
  const [allowExternalCatererOrDecor, setAllowExternalCatererOrDecor] = useState(true);
  const [targetBudgetCurrency, setTargetBudgetCurrency] = useState<'NPR' | 'USD'>('NPR');
  const [targetBudgetAmount, setTargetBudgetAmount] = useState(2500000);
  const [specialHospitalityNotes, setSpecialHospitalityNotes] = useState('');

  const [submittedRequest, setSubmittedRequest] = useState<StarHotelSourcingRequest | null>(null);

  if (activeModal !== 'STAR_HOTEL_REQUEST') return null;

  const handleClose = () => {
    setSubmittedRequest(null);
    setActiveModal('NONE');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = submitStarHotelRequest({
      clientName: clientName || currentUser.name || 'Celebration Host',
      clientEmail: clientEmail || 'host@example.com',
      clientPhone: clientPhone || '+977-9800000000',
      starTier,
      preferredHotelNames:
        preferredHotelNames.trim() || 'Open to System Admin Verified Star Hotel Suggestions',
      openToAdminRecommendations,
      locationScope,
      districtOrCity: districtOrCity.trim() || 'Kathmandu',
      country: locationScope === 'INSIDE_NEPAL' ? 'Nepal' : country.trim() || 'International',
      eventType,
      eventDateBS,
      eventDateAD,
      shift,
      estimatedGuests: Number(estimatedGuests) || 200,
      roomBlockNeeded,
      roomsCount: roomBlockNeeded ? Number(roomsCount) || 10 : 0,
      banquetSetting,
      allowExternalCatererOrDecor,
      targetBudgetCurrency,
      targetBudgetAmount: Number(targetBudgetAmount) || 1500000,
      specialHospitalityNotes,
    });
    setSubmittedRequest(created);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>
                {language === 'ne'
                  ? 'तारे होटल भेन्यु सोर्सिङ सेवा'
                  : 'UTSAVO Star Hotel Venue Concierge'}
              </span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold">
              {language === 'ne'
                ? 'कुनै पनि ३★–५★ वा ७★ होटल भेन्यु अनुरोध गर्नुहोस्'
                : 'Request Any Star Hotel as Your Celebration Venue'}
            </h3>
            <p className="text-xs text-stone-300 mt-1 max-w-2xl">
              {language === 'ne'
                ? 'तपाईंले चाहेको तारे होटल र मिति पठाउनुहोस्; हाम्रो सिस्टम एडमिनले हल उपलब्धता, कोठा ब्लक र कर्पोरेट दर मिलाई प्रणालीमा जोड्नेछ।'
                : 'Specify any 3-Star to 7-Star hotel inside Nepal or abroad. UTSAVO System Admin checks banquet holds, negotiates group room & plate rates, and secures it for you.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {submittedRequest ? (
            <div className="p-6 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-5 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                    Dispatched to UTSAVO System Admin Desk
                  </span>
                  <h4 className="font-display text-xl font-bold text-stone-900 tabular-nums">
                    Request Reference #{submittedRequest.requestRef}
                  </h4>
                </div>
              </div>

              <p className="text-stone-700 leading-relaxed text-sm">
                Our Venue Concierge Team has received your request for{' '}
                <strong>{submittedRequest.preferredHotelNames}</strong> in{' '}
                <strong>
                  {submittedRequest.districtOrCity}, {submittedRequest.country}
                </strong>{' '}
                for <strong>{submittedRequest.estimatedGuests} guests</strong> on{' '}
                <strong className="tabular-nums">{submittedRequest.eventDateBS} BS</strong>. Admin
                updates and corporate rate proposals appear live inside your Customer Portal.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-white rounded-xl border border-stone-200 tabular-nums">
                <div>
                  <span className="text-stone-400 block text-[10px]">Hotel Tier</span>
                  <strong className="text-stone-900">
                    {submittedRequest.starTier.replace(/_/g, ' ')}
                  </strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Room Block</span>
                  <strong className="text-stone-900">
                    {submittedRequest.roomBlockNeeded
                      ? `${submittedRequest.roomsCount} Rooms`
                      : 'Banquet Only'}
                  </strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Target Budget</span>
                  <strong className="text-stone-900">
                    {submittedRequest.targetBudgetCurrency}{' '}
                    {submittedRequest.targetBudgetAmount.toLocaleString()}
                  </strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Admin SLA Status</span>
                  <strong className="text-amber-900">Submitted to Admin</strong>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmittedRequest(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-semibold"
                >
                  Submit Another Hotel Request
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2 bg-amber-900 hover:bg-amber-950 text-white rounded-xl font-bold"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              {/* 1. Star Rating Selection */}
              <div className="space-y-2">
                <label className="font-bold text-stone-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-800" />
                  <span>1. Select Desired Star Rating &amp; Property Category</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {STAR_TIER_OPTIONS.map((opt) => {
                    const selected = starTier === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setStarTier(opt.value)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selected
                            ? 'bg-amber-50 border-amber-900 ring-1 ring-amber-900'
                            : 'bg-white border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="font-bold text-stone-900">{opt.label}</div>
                        <div className="text-[11px] text-stone-500 mt-0.5">{opt.hint}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Specific Hotel Names & Location Scope */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-stone-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-amber-800" />
                    <span>2. Location Scope &amp; Target Hotel Name(s)</span>
                  </span>

                  <div className="flex items-center gap-1 p-1 bg-stone-200/80 rounded-xl font-semibold">
                    <button
                      type="button"
                      onClick={() => {
                        setLocationScope('INSIDE_NEPAL');
                        setCountry('Nepal');
                        if (!districtOrCity || districtOrCity === 'Dubai') setDistrictOrCity('Kathmandu');
                      }}
                      className={`px-3 py-1 rounded-lg text-[11px] whitespace-nowrap shrink-0 ${
                        locationScope === 'INSIDE_NEPAL'
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-600'
                      }`}
                    >
                      Inside Nepal (All 77 Districts)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLocationScope('OUTSIDE_NEPAL');
                        setTargetBudgetCurrency('USD');
                        if (country === 'Nepal') setCountry('United Arab Emirates');
                        if (districtOrCity === 'Kathmandu') setDistrictOrCity('Dubai');
                      }}
                      className={`px-3 py-1 rounded-lg text-[11px] whitespace-nowrap shrink-0 ${
                        locationScope === 'OUTSIDE_NEPAL'
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-600'
                      }`}
                    >
                      Outside Nepal (Global)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Preferred Star Hotel Name(s) (Optional if open to Admin suggestions)
                  </label>
                  <input
                    type="text"
                    value={preferredHotelNames}
                    onChange={(e) => setPreferredHotelNames(e.target.value)}
                    placeholder={
                      locationScope === 'INSIDE_NEPAL'
                        ? "e.g. Hyatt Regency, Kathmandu Marriott, Soaltee, Dwarika's, Tiger Palace Resort"
                        : 'e.g. Atlantis The Palm Dubai, Taj Lake Palace Udaipur, Banyan Tree Phuket'
                    }
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800/20"
                  />
                </div>

                {locationScope === 'INSIDE_NEPAL' ? (
                  <div>
                    <NepalDistrictSelector
                      label="Nepal District (All 77 Districts Selectable or Typeable)"
                      value={districtOrCity}
                      onChange={(d) => setDistrictOrCity(d)}
                      placeholder="Type or pick any district across Nepal..."
                      required
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Target Country *
                      </label>
                      <input
                        type="text"
                        required
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="e.g. UAE, Thailand, India, Italy, UK"
                        className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Target City / State / Island *
                      </label>
                      <input
                        type="text"
                        required
                        value={districtOrCity}
                        onChange={(e) => setDistrictOrCity(e.target.value)}
                        placeholder="e.g. Dubai, Phuket, Udaipur, Lake Como"
                        className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl"
                      />
                    </div>
                  </div>
                )}

                <label className="flex items-center gap-2 cursor-pointer text-stone-700 font-medium">
                  <input
                    type="checkbox"
                    checked={openToAdminRecommendations}
                    onChange={(e) => setOpenToAdminRecommendations(e.target.checked)}
                    className="rounded text-amber-900"
                  />
                  <span>
                    Allow System Admin to propose 2–3 equivalent star hotels if preferred property is sold out
                  </span>
                </label>
              </div>

              {/* 3. Celebration Date, Scale & Banquet Configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Occasion / Event Type
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as EventType)}
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-xl"
                  >
                    <option value="WEDDING">Wedding (Bibaha)</option>
                    <option value="RECEPTION">Grand Reception Gala</option>
                    <option value="ENGAGEMENT">Ring Ceremony / Engagement</option>
                    <option value="BRATABANDHA">Bratabandha</option>
                    <option value="PASNI">Pasni / Annaprashan</option>
                    <option value="CORPORATE_GALA">Corporate Summit / Gala</option>
                    <option value="BIRTHDAY_JUBILEE">Anniversary / Birthday</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-800" />
                    <span>Event Date (BS) *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={eventDateBS}
                    onChange={(e) => setEventDateBS(e.target.value)}
                    placeholder="e.g. 2083 Falgun 15"
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-xl tabular-nums"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Gregorian Date (AD) *
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDateAD}
                    onChange={(e) => setEventDateAD(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-xl tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-amber-800" />
                    <span>Expected Guests *</span>
                  </label>
                  <input
                    type="number"
                    min={20}
                    max={2500}
                    required
                    value={estimatedGuests}
                    onChange={(e) => setEstimatedGuests(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-xl tabular-nums"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Banquet Shift
                  </label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as ShiftTime)}
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-xl"
                  >
                    <option value="MORNING">Morning Shift</option>
                    <option value="DAY">Daytime Shift</option>
                    <option value="EVENING">Evening Gala</option>
                    <option value="FULL_DAY">Full Day Buyout</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Preferred Space Setting
                  </label>
                  <select
                    value={banquetSetting}
                    onChange={(e) => setBanquetSetting(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-xl"
                  >
                    {BANQUET_SETTINGS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 4. Room Blocks & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-semibold text-stone-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={roomBlockNeeded}
                      onChange={(e) => setRoomBlockNeeded(e.target.checked)}
                      className="rounded text-amber-900"
                    />
                    <BedDouble className="w-3.5 h-3.5 text-amber-800" />
                    <span>Require Guest Hotel Room Block</span>
                  </label>
                  {roomBlockNeeded && (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-stone-600">Rooms needed:</span>
                      <input
                        type="number"
                        min={1}
                        max={400}
                        value={roomsCount}
                        onChange={(e) => setRoomsCount(Number(e.target.value))}
                        className="w-24 px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg tabular-nums font-bold"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block font-semibold text-stone-700">
                    Target Total Budget ({targetBudgetCurrency})
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={targetBudgetCurrency}
                      onChange={(e) => setTargetBudgetCurrency(e.target.value as 'NPR' | 'USD')}
                      className="w-24 px-2 py-2 bg-white border border-stone-300 rounded-xl font-semibold"
                    >
                      <option value="NPR">NPR</option>
                      <option value="USD">USD</option>
                    </select>
                    <input
                      type="number"
                      min={5000}
                      value={targetBudgetAmount}
                      onChange={(e) => setTargetBudgetAmount(Number(e.target.value))}
                      className="flex-1 px-3 py-2 bg-white border border-stone-300 rounded-xl tabular-nums font-bold"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-stone-700 font-medium">
                    <input
                      type="checkbox"
                      checked={allowExternalCatererOrDecor}
                      onChange={(e) => setAllowExternalCatererOrDecor(e.target.checked)}
                      className="rounded text-amber-900"
                    />
                    <span>Request permission / waived royalty for custom external Mandap decor or specialty caterer</span>
                  </label>
                </div>
              </div>

              {/* 5. Contact & Special Hospitality Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Phone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+977-98XXXXXXXX"
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="client@example.com"
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Special Hospitality, Menu, Sound Curfew, or VIP Notes
                </label>
                <textarea
                  rows={2}
                  value={specialHospitalityNotes}
                  onChange={(e) => setSpecialHospitalityNotes(e.target.value)}
                  placeholder="Specify bridal suite needs, Jain/Halal kitchen rules, helipad arrival, quiet rooms for elders, or Panchai Baja entry..."
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl"
                />
              </div>

              {/* Footer Submit */}
              <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Direct Admin Concierge sourcing · Zero client concierge fee</span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold whitespace-nowrap shrink-0"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-950 text-white font-bold shadow flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Submit Star Hotel Request to Admin</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
