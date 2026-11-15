/**
 * UTSAVO — Worldwide Celebrations Outside Nepal (Global Destination Concierge)
 * Gathers deep guest origin, passport/visa needs, elders accessibility, target country/city,
 * resort/palace archetype, multi-day ceremonies, Nepal cultural bridge (Panchai Baja, Maharaj Chef,
 * Puja Samagri, 4K live stream), culinary profiles, unforgettable wow moments, & love story theme,
 * then generates an actionable AI Arrangement Blueprint via Gemini + Search Grounding.
 */

import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  INTERNATIONAL_DESTINATIONS_OUTSIDE_NEPAL,
  OUTSIDE_NEPAL_CEREMONIAL_OPTIONS,
  OUTSIDE_NEPAL_WOW_MOMENTS,
} from '../data/outsideNepalDestinations';
import {
  GlobalDestinationArchetype,
  OutsideNepalDestinationRequest,
} from '../types';
import {
  Globe,
  Plane,
  Sparkles,
  Users,
  Calendar,
  MapPin,
  CheckCircle2,
  Check,
  Loader2,
  Building2,
  Heart,
  Utensils,
  Video,
  Send,
  ExternalLink,
  Compass,
  ShieldCheck,
} from 'lucide-react';

interface OutsideNepalDestinationWorkspaceProps {
  onBackToExplore?: () => void;
}

const ARCHETYPE_OPTIONS: Array<{ value: GlobalDestinationArchetype; label: string }> = [
  { value: 'FIVE_STAR_LUXURY_RESORT', label: '5-Star Luxury Resort & Spa' },
  { value: 'ROYAL_PALACE_HAVELI', label: 'Royal Heritage Palace / Haveli' },
  { value: 'BEACHFRONT_BUYOUT', label: 'Private Beachfront Resort Buyout' },
  { value: 'EUROPEAN_CHATEAU_VILLA', label: 'Historic Chateau / Lakefront Villa' },
  { value: 'PRIVATE_ISLAND_OVERWATER', label: 'Private Island / Overwater Sanctuary' },
  { value: 'ULTRA_LUXURY_CITY_HOTEL', label: 'Ultra-Luxury Landmark City Hotel' },
];

const DIETARY_PROFILE_OPTIONS = [
  'Traditional Nepali & Thakali',
  'Pure Vegetarian / Sattvik',
  'Jain (No Root Veg)',
  'Halal Certified',
  'Gluten-Free / Vegan Western',
  'Local Destination Signature Cuisine',
];

export const OutsideNepalDestinationWorkspace: React.FC<
  OutsideNepalDestinationWorkspaceProps
> = ({ onBackToExplore }) => {
  const {
    currentUser,
    outsideNepalRequests,
    submitOutsideNepalRequest,
    setActiveModal,
  } = useMarketplace();

  // Intake State
  const [clientName, setClientName] = useState(currentUser.name || '');
  const [clientEmail, setClientEmail] = useState(currentUser.email || '');
  const [clientPhone, setClientPhone] = useState(currentUser.phone || '');
  const [originCities, setOriginCities] = useState('Kathmandu, London, Sydney');
  const [guestPassportNationalities, setGuestPassportNationalities] = useState(
    'Nepali, US, UK, Australian Passports'
  );
  const [needGroupVisaConcierge, setNeedGroupVisaConcierge] = useState(true);

  const [targetCountry, setTargetCountry] = useState('Thailand');
  const [targetCityOrRegion, setTargetCityOrRegion] = useState(
    'Phuket, Krabi & Hua Hin Beachfront Sanctuary'
  );
  const [celebrationType, setCelebrationType] = useState<
    OutsideNepalDestinationRequest['celebrationType']
  >('DESTINATION_WEDDING');
  const [celebrationDaysCount, setCelebrationDaysCount] = useState(3);
  const [preferredDateWindowAD, setPreferredDateWindowAD] = useState('2025-11-18 to 2025-11-21');
  const [auspiciousMuhuratReferenceBS, setAuspiciousMuhuratReferenceBS] = useState('2082 Mangsir');
  const [estimatedGuests, setEstimatedGuests] = useState(140);
  const [eldersAndKidsAccessibilityNotes, setEldersAndKidsAccessibilityNotes] = useState(
    'Grandparents require step-free suites, golf-cart transfers, and mild spice options.'
  );

  const [accommodationArchetype, setAccommodationArchetype] =
    useState<GlobalDestinationArchetype>('BEACHFRONT_BUYOUT');
  const [roomBlockCount, setRoomBlockCount] = useState(55);
  const [ceremonialRitualsIncluded, setCeremonialRitualsIncluded] = useState<string[]>([
    'Welcome Cocktail & Sundowner',
    'Haldi Carnival by Pool / Beach',
    'Sangeet Gala & Choreographed Show',
    'Sacred Vedic Vivah / Saat Phere',
    'Black-Tie International Reception',
  ]);

  // Cultural Bridge from Nepal
  const [flyPancheBajaOrFolkTroupe, setFlyPancheBajaOrFolkTroupe] = useState(true);
  const [shipPujaSamagriAndAttire, setShipPujaSamagriAndAttire] = useState(true);
  const [bilingualVedicOrBuddhistPriest, setBilingualVedicOrBuddhistPriest] = useState(true);
  const [liveBroadcastBackToNepal, setLiveBroadcastBackToNepal] = useState(true);

  // Culinary Design
  const [dietaryProfiles, setDietaryProfiles] = useState<string[]>([
    'Traditional Nepali & Thakali',
    'Pure Vegetarian / Sattvik',
  ]);
  const [flyNepaliMaharajChef, setFlyNepaliMaharajChef] = useState(true);
  const [signatureCounters, setSignatureCounters] = useState(
    'Live Momo & Sel Roti Bar, Royal Thakali Gala Thali & Local Coastal Grill'
  );
  const [beverageStyle, setBeverageStyle] = useState(
    'Botanical Signature Cocktails + Fresh Masala Chai & Lassi Counter'
  );

  // Memorable Touches & Budget
  const [memorableSignatureExperiences, setMemorableSignatureExperiences] = useState<string[]>([
    'Private Yacht / Vintage Boat Arrival',
    'Custom Nepali Suite Welcome Hampers (Pashmina, Ilam Tea, Khada)',
    '4K Ultra-Low-Latency Live Broadcast to Relatives in Nepal',
  ]);
  const [loveStoryOrMilestoneTheme, setLoveStoryOrMilestoneTheme] = useState('');
  const [aestheticColorPalette, setAestheticColorPalette] = useState(
    'Marigold Gold, Crimson Silk & Coastal Ivory'
  );
  const [currency, setCurrency] = useState<OutsideNepalDestinationRequest['currency']>('USD');
  const [budgetAmount, setBudgetAmount] = useState(50000);
  const [specialDreamsAndNotes, setSpecialDreamsAndNotes] = useState('');

  // AI Concierge Blueprint generation
  const [isGeneratingBlueprint, setIsGeneratingBlueprint] = useState(false);
  const [aiBlueprintData, setAiBlueprintData] = useState<{
    text: string;
    sources: Array<{ title: string; uri: string }>;
  } | null>(null);

  const [submittedRequest, setSubmittedRequest] =
    useState<OutsideNepalDestinationRequest | null>(null);

  const toggleArrayValue = (list: string[], value: string, setter: (v: string[]) => void) => {
    if (list.includes(value)) {
      setter(list.filter((item) => item !== value));
    } else {
      setter([...list, value]);
    }
  };

  const handleSelectInternationalHub = (
    profile: (typeof INTERNATIONAL_DESTINATIONS_OUTSIDE_NEPAL)[number]
  ) => {
    setTargetCountry(profile.country);
    setTargetCityOrRegion(profile.cityOrRegion);
    setAccommodationArchetype(profile.recommendedArchetype);
    setBudgetAmount(profile.startingBudgetUsd);
    const el = document.getElementById('outside-nepal-intake');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleGenerateBlueprint = async () => {
    setIsGeneratingBlueprint(true);
    try {
      const response = await fetch('/api/destination-outside-nepal-sourcing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: clientName || 'Celebration Family',
          originCities,
          guestPassportNationalities,
          needGroupVisaConcierge,
          targetCountry,
          targetCityOrRegion,
          celebrationType,
          celebrationDaysCount,
          preferredDateWindowAD,
          estimatedGuests,
          accommodationArchetype,
          roomBlockCount,
          ceremonialRitualsIncluded,
          culturalBridgeNeeds: {
            flyPancheBajaOrFolkTroupe,
            shipPujaSamagriAndAttire,
            bilingualVedicOrBuddhistPriest,
            liveBroadcastBackToNepal,
          },
          culinaryDesign: {
            dietaryProfiles,
            flyNepaliMaharajChef,
            signatureCounters,
            beverageStyle,
          },
          memorableSignatureExperiences,
          loveStoryOrMilestoneTheme,
          aestheticColorPalette,
          currency,
          budgetAmount,
          specialDreamsAndNotes,
        }),
      });
      const data = await response.json();
      setAiBlueprintData({
        text: data.text || data.fallbackText || 'Arrangement blueprint prepared.',
        sources: data.sources || [],
      });
    } catch (err) {
      console.error('Error generating outside-Nepal blueprint:', err);
      setAiBlueprintData({
        text: `Memorable Celebration Blueprint for ${targetCityOrRegion}, ${targetCountry} (${estimatedGuests} guests · ${celebrationDaysCount} days):\n• Property Match: ${accommodationArchetype.replace(/_/g, ' ')} with ${roomBlockCount}-room block and outdoor Vedic Mandap permit.\n• Guest Travel & Visas: Coordinated flights from ${originCities} with group visa desk for ${guestPassportNationalities}.\n• Cultural Bridge: Bilingual priest, Puja Samagri freight, and 4K stream back to relatives in Nepal.`,
        sources: [],
      });
    } finally {
      setIsGeneratingBlueprint(false);
    }
  };

  const handleSubmitDossier = (e: React.FormEvent) => {
    e.preventDefault();
    const created = submitOutsideNepalRequest({
      clientName: clientName || 'Global Celebration Family',
      clientEmail: clientEmail || 'family@example.com',
      clientPhone: clientPhone || '+977-9800000000',
      originCities,
      guestPassportNationalities,
      needGroupVisaConcierge,
      targetCountry: targetCountry.trim() || 'Thailand',
      targetCityOrRegion: targetCityOrRegion.trim() || 'Phuket',
      celebrationType,
      celebrationDaysCount: Number(celebrationDaysCount) || 3,
      preferredDateWindowAD,
      auspiciousMuhuratReferenceBS,
      estimatedGuests: Number(estimatedGuests) || 120,
      eldersAndKidsAccessibilityNotes,
      accommodationArchetype,
      roomBlockCount: Number(roomBlockCount) || 40,
      ceremonialRitualsIncluded,
      culturalBridgeNeeds: {
        flyPancheBajaOrFolkTroupe,
        shipPujaSamagriAndAttire,
        bilingualVedicOrBuddhistPriest,
        liveBroadcastBackToNepal,
      },
      culinaryDesign: {
        dietaryProfiles,
        flyNepaliMaharajChef,
        signatureCounters,
        beverageStyle,
      },
      memorableSignatureExperiences,
      loveStoryOrMilestoneTheme,
      aestheticColorPalette,
      currency,
      budgetAmount: Number(budgetAmount) || 40000,
      specialDreamsAndNotes,
      aiConciergeBlueprint: aiBlueprintData?.text,
    });
    setSubmittedRequest(created);
  };

  return (
    <div className="space-y-10">
      {/* 1. Hero Banner for Worldwide Celebrations Outside Nepal */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-stone-800 bg-stone-950 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1800&q=80"
            alt="Global Destination Celebration"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/85 to-stone-950/40" />
        </div>

        <div className="relative max-w-5xl px-6 sm:px-10 py-12 sm:py-16 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold">
            <Plane className="w-3.5 h-3.5 text-amber-400" />
            <span>Global Celebrations Outside Nepal · Worldwide Bespoke Concierge</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Celebrate Anywhere in the World, Rooted in Nepal&apos;s Warmth
          </h1>

          <p className="text-sm sm:text-base text-stone-300 max-w-2xl leading-relaxed">
            From Rajasthan royal palaces and Dubai beachfront resorts to Phuket buyouts, Bali glass
            cliffside chapels, and Lake Como villas—we gather every guest visa, flight hub, culinary,
            and cultural detail to craft an unforgettable multi-day celebration abroad.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#outside-nepal-intake"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl font-bold text-xs sm:text-sm transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Global Dossier &amp; Arrange Celebration</span>
            </a>
            <button
              type="button"
              onClick={() => setActiveModal('STAR_HOTEL_REQUEST')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-xs sm:text-sm border border-white/20 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Building2 className="w-4 h-4 text-amber-300" />
              <span>Request Any International Star Hotel</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Curated International Destinations Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Curated Global Wedding &amp; Celebration Havens
            </span>
            <h2 className="font-display text-2xl font-bold text-stone-900 mt-0.5">
              Popular Countries Outside Nepal (Or Specify Any Destination Worldwide)
            </h2>
          </div>
          <span className="text-xs text-stone-500">
            Click any destination to pre-fill visa, flight &amp; Mandap protocols below
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {INTERNATIONAL_DESTINATIONS_OUTSIDE_NEPAL.map((dest) => (
            <div
              key={dest.id}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={dest.coverImage}
                    alt={`${dest.cityOrRegion}, ${dest.country}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent" />
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-stone-900/85 text-white rounded-lg text-[11px] font-bold">
                    {dest.country}
                  </div>
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-amber-500 text-stone-950 rounded-lg text-[11px] font-bold tabular-nums">
                    Best: {dest.bestMonths}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-display text-lg font-bold leading-tight">
                      {dest.cityOrRegion}
                    </h3>
                  </div>
                </div>

                <div className="p-4 space-y-2.5 text-xs">
                  <p className="font-semibold text-stone-800">{dest.headline}</p>
                  <div className="space-y-1 text-[11px] text-stone-600">
                    <div>
                      <strong className="text-stone-800">Flights:</strong> {dest.directFlightsFromKtm}
                    </div>
                    <div>
                      <strong className="text-stone-800">Visas:</strong> {dest.visaAdvisoryForNepaliGuests}
                    </div>
                    <div>
                      <strong className="text-stone-800">Vedic Setup:</strong> {dest.vedicHavanFeasibility}
                    </div>
                  </div>
                  <div className="pt-1 flex flex-wrap gap-1">
                    {dest.highlightExperiences.slice(0, 2).map((exp, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-amber-50 text-amber-950 border border-amber-200 rounded text-[10px] font-medium"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                <div className="text-xs tabular-nums">
                  <span className="text-[10px] text-stone-400 block uppercase">From</span>
                  <strong className="font-display text-base font-bold text-stone-900">
                    ${dest.startingBudgetUsd.toLocaleString()}
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectInternationalHub(dest)}
                  className="px-4 py-2 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0"
                >
                  Plan Here →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Deep Client Information Gathering & Arrangement Engine */}
      <div
        id="outside-nepal-intake"
        className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6"
      >
        <div className="border-b border-stone-100 pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs font-semibold">
            <Globe className="w-3.5 h-3.5 text-amber-800" />
            <span>Comprehensive Outside-Nepal Celebration Dossier</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-950 mt-2">
            Tell Us Everything to Make It Unforgettable
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl">
            The more details you share—guest passports, airport departure cities, elderly care, cultural
            traditions from Nepal, dietary customs, and signature wow moments—the more tailored your
            global production blueprint and Admin execution plan will be.
          </p>
        </div>

        {submittedRequest ? (
          <div className="p-6 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-5 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                  Global Arrangement Dossier Active
                </span>
                <h3 className="font-display text-xl font-bold text-stone-900 tabular-nums">
                  Reference #{submittedRequest.requestRef}
                </h3>
              </div>
            </div>

            <p className="text-sm text-stone-700 leading-relaxed">
              Your complete international celebration brief for{' '}
              <strong>
                {submittedRequest.targetCityOrRegion}, {submittedRequest.targetCountry}
              </strong>{' '}
              ({submittedRequest.celebrationDaysCount} days ·{' '}
              {submittedRequest.estimatedGuests} guests ·{' '}
              {submittedRequest.ceremonialRitualsIncluded.length} events) has been logged for our
              Global Concierge Desk. Track live arranged deliverables and venue proposals inside your
              Customer Portal.
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSubmittedRequest(null)}
                className="px-4 py-2 bg-stone-900 text-white rounded-xl font-bold"
              >
                Submit Another Global Dossier
              </button>
              {onBackToExplore && (
                <button
                  type="button"
                  onClick={onBackToExplore}
                  className="px-4 py-2 bg-stone-100 text-stone-800 rounded-xl font-semibold"
                >
                  Back to Explore
                </button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitDossier} className="space-y-7 text-xs">
            {/* Part 1: Host Contact, Origin Hubs & Visa Readiness */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-900 text-white flex items-center justify-center text-[11px]">
                  1
                </span>
                <span>Host Contact, Guest Departure Hubs &amp; Passport / Visa Profile</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Host / Family Name *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Kriti & Siddharth Rai"
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="family@example.com"
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Phone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+977 / +44 / +1 ..."
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Guest Departure Cities &amp; Airport Mix *
                  </label>
                  <input
                    type="text"
                    required
                    value={originCities}
                    onChange={(e) => setOriginCities(e.target.value)}
                    placeholder="e.g. Kathmandu (70), London (40), New York (30)"
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Guest Passport Nationalities (for visa planning) *
                  </label>
                  <input
                    type="text"
                    required
                    value={guestPassportNationalities}
                    onChange={(e) => setGuestPassportNationalities(e.target.value)}
                    placeholder="e.g. Nepali, US, UK, Australian, Indian passports"
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                <input
                  type="checkbox"
                  checked={needGroupVisaConcierge}
                  onChange={(e) => setNeedGroupVisaConcierge(e.target.checked)}
                  className="rounded text-amber-900"
                />
                <span>
                  Arrange Group Tourist Visa sponsorship letters, airport meet-and-greet &amp; chartered
                  group transfers
                </span>
              </label>
            </div>

            {/* Part 2: Destination Country, Dates, Venue Setting & Accessibility */}
            <div className="space-y-4 pt-5 border-t border-stone-200">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-900 text-white flex items-center justify-center text-[11px]">
                  2
                </span>
                <span>Target Country Worldwide, Dates, Room Block &amp; Accessibility</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Target Country Outside Nepal *
                  </label>
                  <input
                    type="text"
                    required
                    value={targetCountry}
                    onChange={(e) => setTargetCountry(e.target.value)}
                    placeholder="e.g. Thailand, UAE, India, Italy, Sri Lanka"
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Target City, Island, or Region *
                  </label>
                  <input
                    type="text"
                    required
                    value={targetCityOrRegion}
                    onChange={(e) => setTargetCityOrRegion(e.target.value)}
                    placeholder="e.g. Udaipur, Phuket, Dubai Palm, Lake Como"
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Venue Archetype (Star Hotel / Palace)
                  </label>
                  <select
                    value={accommodationArchetype}
                    onChange={(e) =>
                      setAccommodationArchetype(e.target.value as GlobalDestinationArchetype)
                    }
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl bg-white"
                  >
                    {ARCHETYPE_OPTIONS.map((a) => (
                      <option key={a.value} value={a.value}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Occasion Type</label>
                  <select
                    value={celebrationType}
                    onChange={(e) => setCelebrationType(e.target.value as any)}
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl bg-white"
                  >
                    <option value="DESTINATION_WEDDING">Destination Wedding</option>
                    <option value="RECEPTION">Grand Reception Gala</option>
                    <option value="ENGAGEMENT">Engagement / Ring Exchange</option>
                    <option value="ANNIVERSARY_RENEWAL">Milestone Vow Renewal</option>
                    <option value="BRATABANDHA">Bratabandha Abroad</option>
                    <option value="PASNI">Pasni Abroad</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Celebration Span (Days)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={celebrationDaysCount}
                    onChange={(e) => setCelebrationDaysCount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Expected Guests
                  </label>
                  <input
                    type="number"
                    min={15}
                    max={1500}
                    value={estimatedGuests}
                    onChange={(e) => setEstimatedGuests(Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Hotel Rooms Needed
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={500}
                    value={roomBlockCount}
                    onChange={(e) => setRoomBlockCount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Preferred Date Window (AD) *
                  </label>
                  <input
                    type="text"
                    required
                    value={preferredDateWindowAD}
                    onChange={(e) => setPreferredDateWindowAD(e.target.value)}
                    placeholder="e.g. 2025-11-18 to 2025-11-21"
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Panchanga Reference (BS)
                  </label>
                  <input
                    type="text"
                    value={auspiciousMuhuratReferenceBS}
                    onChange={(e) => setAuspiciousMuhuratReferenceBS(e.target.value)}
                    placeholder="e.g. 2082 Mangsir"
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Budget &amp; Currency
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as any)}
                      className="w-24 px-2 py-2.5 border border-stone-300 rounded-xl bg-white font-semibold"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="AED">AED</option>
                      <option value="AUD">AUD</option>
                      <option value="INR">INR</option>
                      <option value="NPR">NPR</option>
                    </select>
                    <input
                      type="number"
                      value={budgetAmount}
                      onChange={(e) => setBudgetAmount(Number(e.target.value))}
                      className="flex-1 px-3 py-2.5 border border-stone-300 rounded-xl tabular-nums font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Elders, Children &amp; Medical / Accessibility Considerations
                </label>
                <input
                  type="text"
                  value={eldersAndKidsAccessibilityNotes}
                  onChange={(e) => setEldersAndKidsAccessibilityNotes(e.target.value)}
                  placeholder="Step-free wheelchairs, kids play nanny zone, calm rooms away from afterparty DJ..."
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl"
                />
              </div>
            </div>

            {/* Part 3: Multi-Day Ceremonies & Cultural Bridge from Nepal */}
            <div className="space-y-4 pt-5 border-t border-stone-200">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-900 text-white flex items-center justify-center text-[11px]">
                  3
                </span>
                <span>Multi-Day Ceremonies &amp; Flying Nepal&apos;s Cultural Soul Abroad</span>
              </h3>

              <div className="space-y-2">
                <span className="font-semibold text-stone-700 block">
                  Select Ceremonies &amp; Gatherings to Include:
                </span>
                <div className="flex flex-wrap gap-2">
                  {OUTSIDE_NEPAL_CEREMONIAL_OPTIONS.map((ritual) => {
                    const active = ceremonialRitualsIncluded.includes(ritual);
                    return (
                      <button
                        key={ritual}
                        type="button"
                        onClick={() =>
                          toggleArrayValue(
                            ceremonialRitualsIncluded,
                            ritual,
                            setCeremonialRitualsIncluded
                          )
                        }
                        className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-colors ${
                          active
                            ? 'bg-amber-900 text-white border-amber-900'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {ritual}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-stone-200 bg-stone-50/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={flyPancheBajaOrFolkTroupe}
                    onChange={(e) => setFlyPancheBajaOrFolkTroupe(e.target.checked)}
                    className="mt-0.5 rounded text-amber-900"
                  />
                  <div>
                    <strong className="block text-stone-900">
                      Fly Panchai Baja / Sarangi Cultural Troupe from Nepal
                    </strong>
                    <span className="text-[11px] text-stone-500">
                      Work visas, instruments air-freight &amp; Baraat / Welcome performance
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-stone-200 bg-stone-50/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shipPujaSamagriAndAttire}
                    onChange={(e) => setShipPujaSamagriAndAttire(e.target.checked)}
                    className="mt-0.5 rounded text-amber-900"
                  />
                  <div>
                    <strong className="block text-stone-900">
                      Ship Authentic Puja Samagri, Rudraksha &amp; Dhaka Attire
                    </strong>
                    <span className="text-[11px] text-stone-500">
                      Custom Dhaka Topi, Gunyo Cholo, brass Karuwa, Kalash &amp; Dhoop
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-stone-200 bg-stone-50/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bilingualVedicOrBuddhistPriest}
                    onChange={(e) => setBilingualVedicOrBuddhistPriest(e.target.checked)}
                    className="mt-0.5 rounded text-amber-900"
                  />
                  <div>
                    <strong className="block text-stone-900">
                      Bilingual English/Nepali Vedic Acharya or Buddhist Lama
                    </strong>
                    <span className="text-[11px] text-stone-500">
                      Guided translation so international guests understand every sacred vow
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-stone-200 bg-stone-50/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={liveBroadcastBackToNepal}
                    onChange={(e) => setLiveBroadcastBackToNepal(e.target.checked)}
                    className="mt-0.5 rounded text-amber-900"
                  />
                  <div>
                    <strong className="block text-stone-900">
                      4K Interactive Broadcast &amp; Ashirbad Screen back to Nepal
                    </strong>
                    <span className="text-[11px] text-stone-500">
                      Private stream for elders &amp; extended family in Kathmandu / Pokhara
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Part 4: Culinary Design & Unforgettable Wow-Moments */}
            <div className="space-y-4 pt-5 border-t border-stone-200">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-900 text-white flex items-center justify-center text-[11px]">
                  4
                </span>
                <span>Culinary Architecture, Story Theme &amp; Unforgettable Touches</span>
              </h3>

              <div className="space-y-2">
                <span className="font-semibold text-stone-700 block">
                  Dietary Profiles Across Your Guest List:
                </span>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_PROFILE_OPTIONS.map((dp) => {
                    const active = dietaryProfiles.includes(dp);
                    return (
                      <button
                        key={dp}
                        type="button"
                        onClick={() =>
                          toggleArrayValue(dietaryProfiles, dp, setDietaryProfiles)
                        }
                        className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-colors ${
                          active
                            ? 'bg-emerald-800 text-white border-emerald-800'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {dp}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Signature Live Food Counters
                  </label>
                  <input
                    type="text"
                    value={signatureCounters}
                    onChange={(e) => setSignatureCounters(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Beverage &amp; Hospitality Lounge Style
                  </label>
                  <input
                    type="text"
                    value={beverageStyle}
                    onChange={(e) => setBeverageStyle(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-800">
                <input
                  type="checkbox"
                  checked={flyNepaliMaharajChef}
                  onChange={(e) => setFlyNepaliMaharajChef(e.target.checked)}
                  className="rounded text-amber-900"
                />
                <span>
                  Include flown-in Nepali/Indian Maharaj Chef Brigade with resort kitchen buyout
                </span>
              </label>

              <div className="space-y-2 pt-1">
                <span className="font-semibold text-stone-700 block">
                  Memorable Signature Moments &amp; Guest Surprises:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {OUTSIDE_NEPAL_WOW_MOMENTS.map((moment) => {
                    const active = memorableSignatureExperiences.includes(moment);
                    return (
                      <button
                        key={moment}
                        type="button"
                        onClick={() =>
                          toggleArrayValue(
                            memorableSignatureExperiences,
                            moment,
                            setMemorableSignatureExperiences
                          )
                        }
                        className={`p-2.5 rounded-xl border text-left text-[11px] font-semibold flex items-center gap-2 transition-colors ${
                          active
                            ? 'bg-amber-50 border-amber-900 text-amber-950'
                            : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <Check
                          className={`w-3.5 h-3.5 shrink-0 ${
                            active ? 'text-amber-900' : 'text-stone-300'
                          }`}
                        />
                        <span>{moment}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Couple Story / Milestone Theme
                  </label>
                  <input
                    type="text"
                    value={loveStoryOrMilestoneTheme}
                    onChange={(e) => setLoveStoryOrMilestoneTheme(e.target.value)}
                    placeholder="e.g. Met in London, celebrating both Nepali & European roots..."
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Aesthetic Mood &amp; Florals Palette
                  </label>
                  <input
                    type="text"
                    value={aestheticColorPalette}
                    onChange={(e) => setAestheticColorPalette(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Personal Wishes, Surprise Performances, or Special Dreams
                </label>
                <textarea
                  rows={2}
                  value={specialDreamsAndNotes}
                  onChange={(e) => setSpecialDreamsAndNotes(e.target.value)}
                  placeholder="Any personal traditions, guest surprises, fireworks permissions, or child/elder moments you want us to orchestrate..."
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl"
                />
              </div>
            </div>

            {/* Part 5: AI Global Celebration Arrangement Generator */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-display text-base font-bold">
                    AI Global Celebration Arrangement Architect
                  </h4>
                  <p className="text-xs text-stone-300 mt-0.5">
                    Synthesizes live flights, group visa procedures, top star hotels, Vedic Havan permits,
                    and day-by-day memorable moments for {targetCityOrRegion}, {targetCountry}.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateBlueprint}
                  disabled={isGeneratingBlueprint}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-stone-950 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  {isGeneratingBlueprint ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Arranging Blueprint...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Memorable Arrangement Blueprint</span>
                    </>
                  )}
                </button>
              </div>

              {aiBlueprintData && (
                <div className="p-4 bg-stone-950/90 rounded-xl border border-stone-700 text-xs text-stone-200 space-y-3">
                  <div className="font-bold text-amber-400">
                    Tailored Execution Blueprint — {targetCityOrRegion}, {targetCountry}
                  </div>
                  <div className="whitespace-pre-line leading-relaxed max-h-72 overflow-y-auto text-[11px] text-stone-300">
                    {aiBlueprintData.text}
                  </div>
                  {aiBlueprintData.sources.length > 0 && (
                    <div className="pt-2 border-t border-stone-800 flex flex-wrap gap-2 text-[10px]">
                      <span className="text-stone-400">Sources:</span>
                      {aiBlueprintData.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="text-amber-400 hover:underline inline-flex items-center gap-1"
                        >
                          <span>{src.title}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                className="px-7 py-3 bg-amber-900 hover:bg-amber-950 text-white rounded-xl font-bold text-sm shadow flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <Send className="w-4 h-4" />
                <span>Submit Global Celebration Dossier to Concierge</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 4. Active Global Requests Tracker */}
      {outsideNepalRequests.length > 0 && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-lg font-bold text-stone-900">
                Active Outside-Nepal Celebration Dossiers ({outsideNepalRequests.length})
              </h3>
              <p className="text-xs text-stone-500">
                Live global concierge arrangements and coordinated deliverables
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {outsideNepalRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-bold text-stone-500">#{req.requestRef}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-950 border border-amber-300">
                    {req.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <h4 className="font-display text-base font-bold text-stone-900">
                  {req.targetCityOrRegion}, {req.targetCountry}
                </h4>

                <div className="text-stone-600 tabular-nums">
                  {req.clientName} · {req.estimatedGuests} Guests · {req.celebrationDaysCount} Days ·{' '}
                  {req.currency} {req.budgetAmount.toLocaleString()}
                </div>

                {req.adminCoordinatorNotes && (
                  <p className="text-[11px] text-stone-700 bg-white p-2.5 rounded-xl border border-stone-200">
                    <strong>Concierge Update:</strong> {req.adminCoordinatorNotes}
                  </p>
                )}

                {req.arrangedDeliverables && req.arrangedDeliverables.length > 0 && (
                  <ul className="space-y-1 text-[11px] text-emerald-900">
                    {req.arrangedDeliverables.map((d, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
