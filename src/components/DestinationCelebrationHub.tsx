/**
 * UTSAVO - Destination Celebrations in Nepal (नेपाल डेस्टिनेशन उत्सव)
 * Global client intake, tourism promotion, iconic package discovery,
 * and AI-powered global requirements sourcing engine.
 */

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { DESTINATION_PACKAGES } from '../data/destinationPackages';
import { DestinationCelebrationPackage, DestinationInquiry, EventType } from '../types';
import {
  Compass,
  Mountain,
  Calendar,
  Users,
  Sparkles,
  Plane,
  Award,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  DollarSign,
  Heart,
  ChevronRight,
  Globe,
  Camera,
  FileText,
  Send,
  Loader2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info,
  Check,
  Building2,
  X,
  Share2,
} from 'lucide-react';

interface DestinationCelebrationHubProps {
  onBackToExplore?: () => void;
}

export const DestinationCelebrationHub: React.FC<DestinationCelebrationHubProps> = ({ onBackToExplore }) => {
  const { language } = useLanguage();
  const { setActiveModal, setSelectedVenue, venues } = useMarketplace();

  // Selected region filter
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');

  // Selected package for detailed inspection modal
  const [selectedPkg, setSelectedPkg] = useState<DestinationCelebrationPackage | null>(null);

  // Global Client Intake Wizard state
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCountry, setClientCountry] = useState('United States');
  const [isNri, setIsNri] = useState(true);
  const [celebrationType, setCelebrationType] = useState<EventType | 'DESTINATION_WEDDING'>('DESTINATION_WEDDING');
  const [targetDestination, setTargetDestination] = useState('Pokhara Lakeside & Annapurna Vista');
  const [estimatedGuests, setEstimatedGuests] = useState(150);
  const [currency, setCurrency] = useState<'USD' | 'NPR' | 'EUR' | 'GBP' | 'AUD' | 'INR'>('USD');
  const [budgetAmount, setBudgetAmount] = useState(25000);
  const [accommodationNeed, setAccommodationNeed] = useState<'FIVE_STAR_LUXURY' | 'HERITAGE_BOUTIQUE' | 'RESORT_VILLAS' | 'FLEXIBLE'>('FIVE_STAR_LUXURY');

  // Special checkboxes
  const [needHeli, setNeedHeli] = useState(true);
  const [needSightseeing, setNeedSightseeing] = useState(true);
  const [needBilingualPriest, setNeedBilingualPriest] = useState(true);
  const [needSpecialDiet, setNeedSpecialDiet] = useState(false);
  const [needAttire, setNeedAttire] = useState(true);
  const [needLegalGuidance, setNeedLegalGuidance] = useState(true);
  const [additionalNotes, setAdditionalNotes] = useState('');

  // AI Sourcing state
  const [isSourcing, setIsSourcing] = useState(false);
  const [sourcedData, setSourcedData] = useState<{
    text: string;
    sources: Array<{ title: string; uri: string }>;
  } | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<DestinationInquiry | null>(null);

  // Filter packages by region
  const filteredPackages = DESTINATION_PACKAGES.filter((pkg) => {
    if (selectedRegion === 'ALL') return true;
    return pkg.destinationRegion === selectedRegion;
  });

  // Call backend AI destination sourcing
  const handleFetchAiSourcing = async () => {
    setIsSourcing(true);
    try {
      const response = await fetch('/api/destination-sourcing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: clientName || 'International Wedding Client',
          clientCountryOfResidence: clientCountry,
          celebrationType,
          targetDestination,
          estimatedGuests,
          budgetCurrency: currency,
          budgetAmount,
          specialRequirements: {
            needHelicopterFlight: needHeli,
            needMountainSightseeing: needSightseeing,
            needVedicPriestEnglishHindi: needBilingualPriest,
            needSpecialDietaryJainHalalVeg: needSpecialDiet,
            needTraditionalNepaliAttire: needAttire,
            needLegalMarriageCertificateGuidance: needLegalGuidance,
          },
          additionalNotes,
        }),
      });

      const data = await response.json();
      if (data.text) {
        setSourcedData({
          text: data.text,
          sources: data.sources || [],
        });
      } else if (data.fallbackText) {
        setSourcedData({
          text: data.fallbackText,
          sources: [],
        });
      }
    } catch (err) {
      console.error('Error fetching destination sourcing:', err);
      setSourcedData({
        text: 'Nepal is a world-class destination wedding hub. Key seasons are Sept-Dec and Feb-May. Tribhuvan International Airport (TIA) and Pokhara International Airport offer 15/30/90 day tourist visas on arrival. Luxury resorts provide full Mandap setup, mountain flight tours, and multilingual Vedic priests.',
        sources: [],
      });
    } finally {
      setIsSourcing(false);
    }
  };

  // Submit formal destination inquiry
  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const refCode = `UTS-DEST-NP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInquiry: DestinationInquiry = {
      id: `inq-${Date.now()}`,
      inquiryRef: refCode,
      clientName: clientName || 'International Client',
      clientEmail: clientEmail || 'client@example.com',
      clientPhone: clientPhone || '+1 415-555-0199',
      clientCountryOfResidence: clientCountry,
      isNriOrForeigner: isNri,
      celebrationType,
      targetDestination,
      estimatedGuests,
      budgetCurrency: currency,
      budgetAmount,
      guestAccommodationNeeds: accommodationNeed,
      specialRequirements: {
        needHelicopterFlight: needHeli,
        needMountainSightseeing: needSightseeing,
        needVedicPriestEnglishHindi: needBilingualPriest,
        needSpecialDietaryJainHalalVeg: needSpecialDiet,
        needTraditionalNepaliAttire: needAttire,
        needLegalMarriageCertificateGuidance: needLegalGuidance,
      },
      additionalNotes,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      setSubmittedInquiry(newInquiry);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. Hero Destination & Tourism Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-800 bg-stone-950 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1800&q=80"
            alt="Annapurna Range Pokhara Nepal"
            className="w-full h-full object-cover object-center opacity-40 mix-blend-overlay filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
          <div className="absolute inset-0 bg-radial-at-t from-amber-500/10 via-transparent to-transparent" />
        </div>

        <div className="relative max-w-5xl px-6 sm:px-12 py-14 sm:py-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold backdrop-blur-md">
            <Mountain className="w-3.5 h-3.5 text-amber-400" />
            <span>नेपाल डेस्टिनेशन उत्सव · Nepal Luxury Destination Celebrations</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
            The Sacred Himalayas & Heritage Palaces of Nepal
          </h1>

          <p className="text-base sm:text-lg text-stone-300 max-w-2xl leading-relaxed font-light">
            Host your wedding, milestone anniversary, or sacred rites amidst the world's highest peaks, UNESCO medieval courtyards, and tranquil lakes. Complete turnkey concierge for global NRIs and international couples.
          </p>

          {/* Quick Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-stone-800/80">
            <div className="space-y-1">
              <span className="text-amber-400 font-bold text-lg sm:text-xl">15/30/90 Days</span>
              <p className="text-xs text-stone-400">Visa on Arrival at TIA / PIA</p>
            </div>
            <div className="space-y-1">
              <span className="text-amber-400 font-bold text-lg sm:text-xl">6 Iconic Regions</span>
              <p className="text-xs text-stone-400">Pokhara, Kathmandu, Nagarkot & more</p>
            </div>
            <div className="space-y-1">
              <span className="text-amber-400 font-bold text-lg sm:text-xl">Bilingual Acharya</span>
              <p className="text-xs text-stone-400">English/Hindi Vedic & Buddhist Priests</p>
            </div>
            <div className="space-y-1">
              <span className="text-amber-400 font-bold text-lg sm:text-xl">Airbus H125 Heli</span>
              <p className="text-xs text-stone-400">Chartered mountain & glacier flights</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#intake-portal"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl font-bold text-sm transition-all shadow-lg shadow-amber-500/20 inline-flex items-center gap-2"
            >
              <span>Design Your Destination Celebration</span>
              <ChevronRight className="w-4 h-4" />
            </a>
            <a
              href="#packages-catalog"
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-sm transition-all backdrop-blur-md border border-white/20"
            >
              Explore 6 Curated Packages
            </a>
          </div>
        </div>
      </div>

      {/* 2. Destination Region Selector & Curated Packages Catalog */}
      <div id="packages-catalog" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Curated Destination Portfolios
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Iconic Celebration Havens Across Nepal
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Hand-picked luxury resort buyouts, heritage courtyards, and mountain terrace estates.
            </p>
          </div>

          {/* Region Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-stone-200/70 rounded-xl text-xs font-medium">
            {[
              { id: 'ALL', label: 'All Nepal Destinations' },
              { id: 'POKHARA_ANNAPURNA', label: 'Pokhara Lakeside' },
              { id: 'KATHMANDU_HERITAGE', label: 'Kathmandu UNESCO' },
              { id: 'NAGARKOT_DHULIKHEL', label: 'Nagarkot Sunrise' },
              { id: 'CHITWAN_SAFARI', label: 'Chitwan Jungle' },
              { id: 'MUKTINATH_SACRED', label: 'Muktinath 3,710m' },
              { id: 'EVEREST_PANORAMA', label: 'Everest Heli' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedRegion(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedRegion === tab.id
                    ? 'bg-white text-stone-950 font-bold shadow-xs'
                    : 'text-stone-700 hover:text-stone-950'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="group bg-white rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={pkg.heroImage}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Altitude badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-stone-900/80 backdrop-blur-md rounded-lg text-[11px] font-semibold text-white flex items-center gap-1 border border-white/20">
                    <Mountain className="w-3 h-3 text-amber-400" />
                    <span>{pkg.altitudeMeters}m Elevation</span>
                  </div>

                  {/* Duration badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-amber-500 text-stone-950 rounded-lg text-[11px] font-bold shadow">
                    {pkg.durationDays} Days / {pkg.durationDays - 1} Nights
                  </div>

                  {/* Bottom title overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] text-amber-300 font-medium">{pkg.locationName}</span>
                    <h3 className="font-display text-lg font-bold leading-tight">{pkg.title}</h3>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {pkg.tagline}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 pt-2 border-t border-stone-100">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span className="truncate">{pkg.idealForGuests}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span className="truncate">Peak: {pkg.bestSeasons.split('(')[0]}</span>
                    </div>
                  </div>

                  {/* Inclusions highlights */}
                  <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs">
                    <span className="font-semibold text-stone-800 text-[11px] uppercase tracking-wide">
                      Key Signature Experiences:
                    </span>
                    <ul className="space-y-1">
                      {pkg.includedExperiences.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-stone-600 text-[11px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-500 block uppercase">Starting Package</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-lg font-bold text-amber-950">
                      ${pkg.startingPriceUsd.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      (NPR {pkg.startingPriceNpr.toLocaleString()})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedPkg(pkg)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Itinerary
                  </button>
                  <button
                    onClick={() => {
                      setTargetDestination(pkg.locationName);
                      const el = document.getElementById('intake-portal');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-3 py-1.5 bg-amber-900 hover:bg-amber-950 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
                  >
                    Select
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Global Requirements Intake & Sourcing Portal */}
      <div id="intake-portal" className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-10 space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs font-semibold">
            <Globe className="w-3.5 h-3.5 text-amber-700" />
            <span>Global Concierge & Custom Sourcing Intake</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-950 mt-2">
            Plan Your Nepal Destination Celebration
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-3xl">
            Tell us about your guests, celebration vision, flight requirements, and religious preferences. Our system connects you with licensed Nepal event producers, 5-star resort buyouts, and global tourism authorities.
          </p>
        </div>

        {submittedInquiry ? (
          /* Submission Success Card */
          <div className="p-8 bg-gradient-to-br from-emerald-50 via-white to-amber-50 rounded-2xl border border-emerald-200 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Dossier Successfully Logged
                </span>
                <h3 className="font-display text-2xl font-bold text-stone-900">
                  Reference #{submittedInquiry.inquiryRef}
                </h3>
              </div>
            </div>

            <p className="text-sm text-stone-700 leading-relaxed max-w-2xl">
              Thank you, <strong className="text-stone-950">{submittedInquiry.clientName}</strong>! Your customized celebration dossier for <strong className="text-stone-950">{submittedInquiry.targetDestination}</strong> has been received by UTSAVO's Chief Destination Concierge. An itemized proposal with hotel room blocks, helicopter logistics, and Panchanga Muhurat timing is being routed to <strong className="text-stone-950">{submittedInquiry.clientEmail}</strong>.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-white/80 rounded-xl border border-stone-200 text-xs">
              <div>
                <span className="text-stone-500 block">Occasion</span>
                <span className="font-semibold text-stone-900">{submittedInquiry.celebrationType}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Guest Count</span>
                <span className="font-semibold text-stone-900">{submittedInquiry.estimatedGuests} Guests</span>
              </div>
              <div>
                <span className="text-stone-500 block">Budget Allocated</span>
                <span className="font-semibold text-stone-900">
                  {submittedInquiry.budgetCurrency} {submittedInquiry.budgetAmount.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block">Status</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Concierge Assigned
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSubmittedInquiry(null)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-950 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Submit Another Request
              </button>
              {onBackToExplore && (
                <button
                  onClick={onBackToExplore}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors"
                >
                  Return to Venue Catalog
                </button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitInquiry} className="space-y-8">
            {/* Step 1: Client & Geographic Origin */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-900 text-white flex items-center justify-center text-[11px]">1</span>
                <span>Client Identification & Global Origin</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name / Family Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Maya & Rohan Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="e.g. maya.rohan@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    International Phone / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="e.g. +1 415-890-2345 / +44 7911"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Country of Residence
                  </label>
                  <select
                    value={clientCountry}
                    onChange={(e) => setClientCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="United States">United States (USA)</option>
                    <option value="United Kingdom">United Kingdom (UK)</option>
                    <option value="Australia">Australia</option>
                    <option value="Canada">Canada</option>
                    <option value="United Arab Emirates">United Arab Emirates (UAE / Dubai)</option>
                    <option value="India">India</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Germany">Germany / EU</option>
                    <option value="Nepal">Nepal (Domestic High-Net-Worth)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Citizenship / Identity
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsNri(true)}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                        isNri
                          ? 'bg-amber-900 text-white border-amber-900'
                          : 'bg-stone-50 text-stone-700 border-stone-300'
                      }`}
                    >
                      NRI / Nepali Heritage
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsNri(false)}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                        !isNri
                          ? 'bg-amber-900 text-white border-amber-900'
                          : 'bg-stone-50 text-stone-700 border-stone-300'
                      }`}
                    >
                      International Couple
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Occasion / Event Type
                  </label>
                  <select
                    value={celebrationType}
                    onChange={(e) => setCelebrationType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="DESTINATION_WEDDING">Destination Vedic Wedding (विवाह)</option>
                    <option value="RECEPTION">Grand Reception & Sangeet</option>
                    <option value="ENGAGEMENT">Tikka & Ring Ceremony</option>
                    <option value="BIRTHDAY_JUBILEE">Silver/Golden Anniversary Renewal</option>
                    <option value="PASNI">Traditional Himalayan Pasni / Rice Feeding</option>
                    <option value="BRATABANDHA">Sacred Upanayan / Bratabandha</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Destination & Scale */}
            <div className="space-y-4 pt-4 border-t border-stone-200">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-900 text-white flex items-center justify-center text-[11px]">2</span>
                <span>Destination Preference & Celebration Scope</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Target Nepal Haven
                  </label>
                  <select
                    value={targetDestination}
                    onChange={(e) => setTargetDestination(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Pokhara Lakeside & Annapurna Vista">Pokhara Lakeside & Annapurna Vista</option>
                    <option value="Kathmandu Valley (Patan / Bhaktapur UNESCO)">Kathmandu Valley (Patan / Bhaktapur Heritage)</option>
                    <option value="Nagarkot & Dhulikhel Cloud-Peak Sunrise Ridge">Nagarkot & Dhulikhel Cloud-Peak Sunrise Ridge</option>
                    <option value="Chitwan National Park & Rapti River Luxury">Chitwan National Park & Rapti River Luxury</option>
                    <option value="Sacred Muktinath 3,710m Mustang Valley">Sacred Muktinath 3,710m Mustang Valley</option>
                    <option value="Everest Syangboche / Kongde Heli-Terrace">Everest Syangboche / Kongde Heli-Terrace</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Guest Count: {estimatedGuests} Attendees
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="600"
                    step="10"
                    value={estimatedGuests}
                    onChange={(e) => setEstimatedGuests(Number(e.target.value))}
                    className="w-full accent-amber-900 mt-2"
                  />
                  <div className="flex justify-between text-[10px] text-stone-500">
                    <span>Intimate (20)</span>
                    <span>Mid-Scale (250)</span>
                    <span>Mega (600+)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Target Budget & Currency
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as any)}
                      className="w-24 px-2 py-2.5 rounded-xl border border-stone-300 text-xs bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="NPR">NPR (रू)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="AUD">AUD (A$)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                    <input
                      type="number"
                      value={budgetAmount}
                      onChange={(e) => setBudgetAmount(Number(e.target.value))}
                      className="flex-1 px-3 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      placeholder="Budget figure"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Special Luxury Logistics & Cultural Checklist */}
            <div className="space-y-4 pt-4 border-t border-stone-200">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-900 text-white flex items-center justify-center text-[11px]">3</span>
                <span>Specialized Tourism Logistics & Ceremonial Requirements</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-stone-200 hover:bg-stone-50/80 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={needHeli}
                    onChange={(e) => setNeedHeli(e.target.checked)}
                    className="mt-0.5 rounded text-amber-900 focus:ring-amber-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">
                      Chartered Helicopter or Mountain Flight
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Airbus H125 mountain landings & guest sightseeing
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-stone-200 hover:bg-stone-50/80 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={needBilingualPriest}
                    onChange={(e) => setNeedBilingualPriest(e.target.checked)}
                    className="mt-0.5 rounded text-amber-900 focus:ring-amber-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">
                      Bilingual Vedic / Buddhist Priest
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Fluent English & Sanskrit translation of Saat Phere vows
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-stone-200 hover:bg-stone-50/80 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={needAttire}
                    onChange={(e) => setNeedAttire(e.target.checked)}
                    className="mt-0.5 rounded text-amber-900 focus:ring-amber-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">
                      Handcrafted Traditional Nepali Attire
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Custom bridal Dhaka, Gunyo Cholo, Daura Suruwal
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-stone-200 hover:bg-stone-50/80 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={needSpecialDiet}
                    onChange={(e) => setNeedSpecialDiet(e.target.checked)}
                    className="mt-0.5 rounded text-amber-900 focus:ring-amber-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">
                      Specialized Diet (Jain / Halal / Vegan)
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Dedicated master chefs with strict kitchen separation
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-stone-200 hover:bg-stone-50/80 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={needSightseeing}
                    onChange={(e) => setNeedSightseeing(e.target.checked)}
                    className="mt-0.5 rounded text-amber-900 focus:ring-amber-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">
                      Curated Nepal Tourism & Safari Add-on
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Pre/post celebration tours in Pokhara, Chitwan, Everest
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-stone-200 hover:bg-stone-50/80 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={needLegalGuidance}
                    onChange={(e) => setNeedLegalGuidance(e.target.checked)}
                    className="mt-0.5 rounded text-amber-900 focus:ring-amber-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">
                      Foreigner Marriage Legal Certification
                    </span>
                    <span className="text-[11px] text-stone-500">
                      District court registration & apostille embassy compliance
                    </span>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Additional Notes or Specific Dreams for this Occasion
                </label>
                <textarea
                  rows={3}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Tell us about special arrival dates, favorite color palettes, floral mandap desires, or VIP guest accommodations..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* AI Sourcing Intelligence Generator Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-white space-y-4 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-white">
                      UTSAVO AI Global Sourcing Engine
                    </h4>
                    <p className="text-xs text-stone-300">
                      Instantly query live Google Search grounding for Nepal visa laws, bridal jewelry customs, seasonal weather & itemized costs.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleFetchAiSourcing}
                  disabled={isSourcing}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-stone-950 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 shrink-0 shadow"
                >
                  {isSourcing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sourcing Global Requirements...</span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4" />
                      <span>Fetch Global Sourcing Dossier</span>
                    </>
                  )}
                </button>
              </div>

              {/* Sourced Intelligence Output Box */}
              {sourcedData && (
                <div className="p-4 bg-stone-900/90 rounded-xl border border-stone-700 text-xs text-stone-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                    <span className="font-bold text-amber-400 text-xs">
                      Live Destination Blueprint Generated:
                    </span>
                    <span className="text-[10px] text-stone-400">
                      Sourced via Gemini & Google Search Grounding
                    </span>
                  </div>
                  <div className="whitespace-pre-line leading-relaxed max-h-80 overflow-y-auto pr-2 font-mono text-[11px] text-stone-300">
                    {sourcedData.text}
                  </div>
                  {sourcedData.sources.length > 0 && (
                    <div className="pt-2 border-t border-stone-800 flex flex-wrap gap-2 text-[10px]">
                      <span className="text-stone-400">Verified Citations:</span>
                      {sourcedData.sources.map((src, idx) => (
                        <a
                          key={idx}
                          href={src.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="text-amber-400 hover:underline flex items-center gap-1"
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

            {/* Submission Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-amber-900 hover:bg-amber-950 disabled:bg-stone-400 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting Dossier to Concierge...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Formal Destination Inquiry</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 4. Detailed Package Itinerary Modal */}
      {selectedPkg && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="relative h-64 overflow-hidden shrink-0">
              <img
                src={selectedPkg.heroImage}
                alt={selectedPkg.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <button
                onClick={() => setSelectedPkg(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {selectedPkg.locationName} · {selectedPkg.altitudeMeters}m Elevation
                </span>
                <h3 className="font-display text-2xl font-bold">{selectedPkg.title}</h3>
                <p className="text-xs text-stone-300">{selectedPkg.overview}</p>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Day-by-Day Itinerary */}
              <div className="space-y-4">
                <h4 className="font-display text-lg font-bold text-stone-900">
                  Signature Day-by-Day Celebration Itinerary
                </h4>
                <div className="space-y-3">
                  {selectedPkg.itinerary.map((day) => (
                    <div
                      key={day.dayNumber}
                      className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-amber-900 text-white text-[11px] font-bold">
                          Day {day.dayNumber}
                        </span>
                        <h5 className="font-bold text-xs text-stone-900">{day.title}</h5>
                      </div>
                      <ul className="space-y-1 pl-4 list-disc text-xs text-stone-600">
                        {day.highlights.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                      <div className="text-[11px] text-amber-900 font-medium pt-1">
                        Logistics: {day.logistics}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logistics & Support Grid */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3 text-xs">
                <h5 className="font-bold text-stone-900 text-xs uppercase tracking-wide">
                  Included Hospitality & Logistics Protocols
                </h5>
                <div className="grid grid-cols-2 gap-2 text-stone-700">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Airport VIP Pickup & Luggage Transfer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Bilingual Acharya / Vedic Priest</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Foreign Marriage Legal Documentation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Drone & Sound Permit Clearances</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
              <div>
                <span className="text-[10px] text-stone-500 uppercase block">Starting Price</span>
                <span className="font-display text-xl font-bold text-stone-900">
                  ${selectedPkg.startingPriceUsd.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-stone-500">
                    (NPR {selectedPkg.startingPriceNpr.toLocaleString()})
                  </span>
                </span>
              </div>
              <button
                onClick={() => {
                  setTargetDestination(selectedPkg.locationName);
                  setSelectedPkg(null);
                  const el = document.getElementById('intake-portal');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-2.5 bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold rounded-xl transition-colors shadow"
              >
                Proceed with this Package
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
