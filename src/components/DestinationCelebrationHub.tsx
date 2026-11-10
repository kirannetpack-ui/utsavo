/**
 * UTSAVO - Destination Celebrations in Nepal (नेपाल डेस्टिनेशन उत्सव)
 * Global client intake, tourism promotion, iconic package discovery,
 * and AI-powered global requirements sourcing engine.
 */

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { DESTINATION_PACKAGES } from '../data/destinationPackages';
import {
  DestinationCelebrationPackage,
  DestinationInquiry,
  EventType,
  DestinationPlaceRegion,
  DestinationServiceCategory,
  DestinationHotelProperty,
  DestinationVendorService,
} from '../types';
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
  PlusCircle,
  Plus,
  BedDouble,
  Navigation,
  Radio,
  Wifi,
  Phone,
  Mail,
} from 'lucide-react';
import { WhatsAppViberButtons } from './WhatsAppViberButtons';
import { createDestinationInquiryMessage } from '../utils/communication';
import { NepalDistrictSelector } from './NepalLocationSelector';

interface DestinationCelebrationHubProps {
  onBackToExplore?: () => void;
}

export const DestinationCelebrationHub: React.FC<DestinationCelebrationHubProps> = ({ onBackToExplore }) => {
  const { language } = useLanguage();
  const {
    setActiveModal,
    setSelectedVenue,
    venues,
    destinationHotels,
    destinationVendors,
    addDestinationHotel,
    addDestinationVendorService,
  } = useMarketplace();

  // Primary Destination View Mode: Packages vs Destination Hotels/Places vs Specialized Vendor Services
  const [activeCatalogTab, setActiveCatalogTab] = useState<'PACKAGES' | 'HOTELS_AND_PLACES' | 'VENDOR_SERVICES'>('HOTELS_AND_PLACES');

  // Selected region filter
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [hotelRegionFilter, setHotelRegionFilter] = useState<string>('ALL');
  const [vendorCategoryFilter, setVendorCategoryFilter] = useState<string>('ALL');

  // Registration Modal State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerType, setRegisterType] = useState<'HOTEL' | 'VENDOR_SERVICE'>('HOTEL');
  const [registrationSuccessToast, setRegistrationSuccessToast] = useState<string | null>(null);

  // Form state for Hotel
  const [hotelName, setHotelName] = useState('');
  const [hotelNepaliName, setHotelNepaliName] = useState('');
  const [hotelRegion, setHotelRegion] = useState<DestinationPlaceRegion>('POKHARA_ANNAPURNA');
  const [hotelLocation, setHotelLocation] = useState('');
  const [hotelAltitude, setHotelAltitude] = useState(1500);
  const [hotelStarRating, setHotelStarRating] = useState<3 | 4 | 5 | 'HERITAGE_LUXURY'>(5);
  const [hotelRooms, setHotelRooms] = useState(40);
  const [hotelBanquetCap, setHotelBanquetCap] = useState(300);
  const [hotelPriceUsd, setHotelPriceUsd] = useState(6500);
  const [hotelPriceNpr, setHotelPriceNpr] = useState(850000);
  const [hotelCoverImage, setHotelCoverImage] = useState('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80');
  const [hotelPlaceFeatures, setHotelPlaceFeatures] = useState('Certified Airbus H125 Helipad on lawn, 180° Annapurna panoramic view, Glasshouse Mandap with heated floors, Sacred lakeside dining pier');
  const [hotelAmenities, setHotelAmenities] = useState('Private Helipad, Spa, High-Speed Starlink WiFi, Himalayan Guides, All-Weather Heating');
  const [hotelContact, setHotelContact] = useState('');
  const [hotelPhone, setHotelPhone] = useState('');
  const [hotelEmail, setHotelEmail] = useState('');

  // Form state for Vendor Service
  const [serviceName, setServiceName] = useState('');
  const [serviceProvider, setServiceProvider] = useState('');
  const [serviceCategory, setServiceCategory] = useState<DestinationServiceCategory>('HELI_CHARTER_LOGISTICS');
  const [serviceRegion, setServiceRegion] = useState<DestinationPlaceRegion>('POKHARA_ANNAPURNA');
  const [servicePlaceName, setServicePlaceName] = useState('');
  const [servicePriceUsd, setServicePriceUsd] = useState(2500);
  const [servicePriceNpr, setServicePriceNpr] = useState(325000);
  const [servicePriceModel, setServicePriceModel] = useState<'PER_EVENT' | 'PER_DAY' | 'PER_GUEST' | 'PER_FLIGHT_HOUR'>('PER_EVENT');
  const [serviceOverview, setServiceOverview] = useState('');
  const [servicePlaceFeatures, setServicePlaceFeatures] = useState('High-altitude mountain capability, Oxygen support kits, Starlink satellite 4K link, Direct glacier landing permits');
  const [serviceDeliverables, setServiceDeliverables] = useState('Turnkey setup, Multicam 4K recording, Dedicated technical crew, Sound engineering');
  const [serviceCoverImage, setServiceCoverImage] = useState('https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=1200&q=80');
  const [servicePhone, setServicePhone] = useState('');
  const [serviceEmail, setServiceEmail] = useState('');

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

  // Submit Destination Hotel Registration
  const handleRegisterHotel = (e: React.FormEvent) => {
    e.preventDefault();
    const newHotel: DestinationHotelProperty = {
      id: `dest-hotel-${Date.now()}`,
      name: hotelName || 'Bespoke Luxury Mountain Retreat',
      nepaliName: hotelNepaliName,
      placeRegion: hotelRegion,
      locationName: hotelLocation || 'Pokhara / Annapurna Foothills',
      altitudeMeters: Number(hotelAltitude) || 1200,
      starRating: hotelStarRating,
      roomCount: Number(hotelRooms) || 30,
      maxBanquetCapacity: Number(hotelBanquetCap) || 250,
      startingPricePerNightUsd: Number(hotelPriceUsd) || 5000,
      startingPricePerNightNpr: Number(hotelPriceNpr) || 650000,
      coverImage: hotelCoverImage || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [hotelCoverImage],
      placeFeatures: hotelPlaceFeatures.split(',').map(s => s.trim()).filter(Boolean),
      propertyAmenities: hotelAmenities.split(',').map(s => s.trim()).filter(Boolean),
      contactPerson: hotelContact || 'General Manager',
      phone: hotelPhone || '+977-9851000000',
      email: hotelEmail || 'info@destinations-nepal.com',
      isVerified: true,
      featuredBadges: ['UTSAVO Verified Haven', `${hotelAltitude}m Elevation`],
    };

    addDestinationHotel(newHotel);
    setIsRegisterModalOpen(false);
    setActiveCatalogTab('HOTELS_AND_PLACES');
    setRegistrationSuccessToast(`Successfully registered ${newHotel.name} into Destination Nepal havens!`);
    setTimeout(() => setRegistrationSuccessToast(null), 5000);
  };

  // Submit Destination Vendor Service Registration
  const handleRegisterVendorService = (e: React.FormEvent) => {
    e.preventDefault();
    const newService: DestinationVendorService = {
      id: `dest-vendor-${Date.now()}`,
      serviceName: serviceName || 'Alpine Celebration Logistics & Charter',
      serviceCategory,
      featuredPlaceRegion: serviceRegion,
      placeName: servicePlaceName || 'Annapurna & Kathmandu Valley',
      providerName: serviceProvider || 'Nepal Celebration Specialists',
      phone: servicePhone || '+977-9801234567',
      email: serviceEmail || 'concierge@utsavo.com',
      startingPriceUsd: Number(servicePriceUsd) || 2000,
      startingPriceNpr: Number(servicePriceNpr) || 260000,
      priceModel: servicePriceModel,
      overview: serviceOverview || 'Bespoke destination vendor service for high-altitude mountain weddings and celebrations.',
      placeSpecificFeatures: servicePlaceFeatures.split(',').map(s => s.trim()).filter(Boolean),
      deliverables: serviceDeliverables.split(',').map(s => s.trim()).filter(Boolean),
      coverImage: serviceCoverImage || 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=1200&q=80',
      isVerified: true,
      yearsOperating: 8,
      internationalClientReady: true,
      createdAt: new Date().toISOString(),
    };

    addDestinationVendorService(newService);
    setIsRegisterModalOpen(false);
    setActiveCatalogTab('VENDOR_SERVICES');
    setRegistrationSuccessToast(`Successfully added ${newService.serviceName} to Destination Services!`);
    setTimeout(() => setRegistrationSuccessToast(null), 5000);
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

      {/* 2. Destination Havens, Vendor Services & Curated Packages Catalog */}
      <div id="packages-catalog" className="space-y-6">
        
        {/* Toast Notification */}
        {registrationSuccessToast && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{registrationSuccessToast}</span>
            </div>
            <button
              onClick={() => setRegistrationSuccessToast(null)}
              className="text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Section Header & Catalog View Mode Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Destination Nepal Global Celebration Marketplace
              </span>
              <span className="px-2 py-0.5 text-[10px] bg-amber-100 text-amber-900 font-bold rounded-full border border-amber-300">
                Global NRI & Tourism Port
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Iconic Havens, Heritage Lodges & Specialized Services
            </h2>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl">
              Source luxury mountain resort buyouts, sacred high-altitude monastery ceremonies, Airbus H125 heli charters, and Starlink cinema streams across Pokhara, Kathmandu, Mustang, Chitwan, and Everest.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Primary View Mode Switcher */}
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-2xl border border-stone-200 text-xs font-semibold">
              <button
                onClick={() => setActiveCatalogTab('HOTELS_AND_PLACES')}
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeCatalogTab === 'HOTELS_AND_PLACES'
                    ? 'bg-white text-stone-900 shadow-sm font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-amber-800" />
                <span>Destination Hotels ({destinationHotels.length})</span>
              </button>

              <button
                onClick={() => setActiveCatalogTab('VENDOR_SERVICES')}
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeCatalogTab === 'VENDOR_SERVICES'
                    ? 'bg-white text-stone-900 shadow-sm font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-amber-800" />
                <span>Specialized Services ({destinationVendors.length})</span>
              </button>

              <button
                onClick={() => setActiveCatalogTab('PACKAGES')}
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeCatalogTab === 'PACKAGES'
                    ? 'bg-white text-stone-900 shadow-sm font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                <span>Curated Packages (4)</span>
              </button>
            </div>

            {/* Register Destination Vendor / Hotel CTA Button */}
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register Hotel / Service</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* VIEW 1: DESTINATION HOTELS & HERITAGE HAVENS             */}
        {/* ======================================================== */}
        {activeCatalogTab === 'HOTELS_AND_PLACES' && (
          <div className="space-y-6">
            {/* Region Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-800" />
                <span className="text-xs font-bold text-stone-800">Filter by Sacred Region:</span>
              </div>
              <div className="flex flex-wrap gap-1.5 text-xs font-medium">
                {[
                  { id: 'ALL', label: `All Havens (${destinationHotels.length})` },
                  { id: 'POKHARA_ANNAPURNA', label: 'Pokhara & Annapurna' },
                  { id: 'NAGARKOT_DHULIKHEL', label: 'Dhulikhel & Nagarkot' },
                  { id: 'CHITWAN_SAFARI', label: 'Chitwan Jungle' },
                  { id: 'MUKTINATH_MUSTANG', label: 'Mustang & Jomsom' },
                  { id: 'EVEREST_SOLUKHUMBU', label: 'Everest Region' },
                ].map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => setHotelRegionFilter(chip.id)}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      hotelRegionFilter === chip.id
                        ? 'bg-amber-900 text-white font-bold shadow-xs'
                        : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hotels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinationHotels
                .filter((h) => {
                  if (hotelRegionFilter === 'ALL') return true;
                  return h.placeRegion === hotelRegionFilter;
                })
                .map((hotel) => (
                  <div
                    key={hotel.id}
                    className="group bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Header with Elevation & Badges */}
                      <div className="relative h-60 overflow-hidden">
                        <img
                          src={hotel.coverImage}
                          alt={hotel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <div className="px-2.5 py-1 bg-stone-900/85 backdrop-blur-md rounded-lg text-[11px] font-bold text-white flex items-center gap-1 border border-white/20">
                            <Mountain className="w-3 h-3 text-amber-400" />
                            <span>{hotel.altitudeMeters}m Elevation</span>
                          </div>
                          {hotel.isVerified && (
                            <span className="px-2 py-1 bg-emerald-700/90 backdrop-blur-md rounded-lg text-[10px] font-bold text-white flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Verified Haven</span>
                            </span>
                          )}
                        </div>

                        {/* Star Rating Badge */}
                        <div className="absolute top-3 right-3 px-2.5 py-1 bg-amber-500 text-stone-950 rounded-lg text-[11px] font-extrabold shadow">
                          {typeof hotel.starRating === 'number' ? `★ ${hotel.starRating}-Star Luxury` : '★ Heritage Palace'}
                        </div>

                        {/* Overlay Title */}
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <span className="text-[11px] text-amber-300 font-semibold uppercase tracking-wider block">
                            {hotel.locationName}
                          </span>
                          <h3 className="font-display text-xl font-bold leading-tight drop-shadow-sm">
                            {hotel.name}
                          </h3>
                          {hotel.nepaliName && (
                            <span className="text-xs text-stone-300 font-medium">{hotel.nepaliName}</span>
                          )}
                        </div>
                      </div>

                      {/* Card Content & Place-Specific Features */}
                      <div className="p-5 space-y-4">
                        {/* Capacity and Specs Strip */}
                        <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 pb-3 border-b border-stone-100">
                          <div className="flex items-center gap-1.5">
                            <BedDouble className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                            <span className="font-medium">{hotel.roomCount} Luxury Rooms/Villas</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                            <span className="font-medium">Up to {hotel.maxBanquetCapacity} Guests</span>
                          </div>
                        </div>

                        {/* Place-Specific Features (Prominent user request) */}
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wide block">
                            Place-Specific Features & Terrain Highlights:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {hotel.placeFeatures.map((feat, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-amber-50 text-amber-950 rounded-md text-[11px] font-medium border border-amber-200/80 flex items-center gap-1"
                              >
                                <Check className="w-2.5 h-2.5 text-amber-700" />
                                <span>{feat}</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Property Amenities */}
                        <div className="space-y-1 pt-1 text-[11px] text-stone-500">
                          <span className="font-semibold text-stone-700">Amenities: </span>
                          <span>{hotel.propertyAmenities.slice(0, 4).join(' · ')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing and Action Footer */}
                    <div className="p-5 pt-0 border-t border-stone-100 mt-2 space-y-3">
                      <div className="flex items-baseline justify-between pt-3">
                        <div>
                          <span className="text-[10px] text-stone-400 block uppercase font-medium">Starting Full Buyout</span>
                          <div className="flex items-baseline gap-1.5">
                            <strong className="font-display text-lg font-bold text-stone-900">
                              ${hotel.startingPricePerNightUsd.toLocaleString()}
                            </strong>
                            <span className="text-[11px] text-stone-500">/ night</span>
                          </div>
                        </div>
                        <div className="text-right text-[11px] text-stone-500 tabular-nums">
                          NPR {hotel.startingPricePerNightNpr.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <WhatsAppViberButtons
                          phone={hotel.phone || "+977-9851098421"}
                          messageText={`Namaste! I am planning a celebration in Nepal and inquiring about dates and buyout at ${hotel.name} (${hotel.locationName}).`}
                          variant="badges"
                        />
                        <button
                          onClick={() => {
                            setTargetDestination(`${hotel.name} (${hotel.locationName})`);
                            const el = document.getElementById('intake-portal');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="flex-1 py-2 px-3 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-bold transition-all shadow-xs text-center"
                        >
                          Book / Inquire
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: SPECIALIZED DESTINATION VENDOR SERVICES          */}
        {/* ======================================================== */}
        {activeCatalogTab === 'VENDOR_SERVICES' && (
          <div className="space-y-6">
            {/* Category Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-800" />
                <span className="text-xs font-bold text-stone-800">Filter by Specialist Service:</span>
              </div>
              <div className="flex flex-wrap gap-1.5 text-xs font-medium">
                {[
                  { id: 'ALL', label: `All Services (${destinationVendors.length})` },
                  { id: 'HELI_CHARTER_LOGISTICS', label: 'Helicopter Charters' },
                  { id: 'EXPEDITION_PHOTOGRAPHY_DRONE', label: 'High-Altitude 4K Cinema' },
                  { id: 'SACRED_MONASTERY_CEREMONY', label: 'Sacred Lamas & Monasteries' },
                  { id: 'HERITAGE_CULTURAL_EXPERIENCE', label: 'Cultural & Folk Troupes' },
                  { id: 'HIGH_ALTITUDE_EVENT_PRODUCTION', label: 'Alpine Glamping & Mandaps' },
                ].map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => setVendorCategoryFilter(chip.id)}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      vendorCategoryFilter === chip.id
                        ? 'bg-amber-900 text-white font-bold shadow-xs'
                        : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Vendor Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinationVendors
                .filter((v) => {
                  if (vendorCategoryFilter === 'ALL') return true;
                  return v.serviceCategory === vendorCategoryFilter;
                })
                .map((service) => (
                  <div
                    key={service.id}
                    className="group bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Header */}
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={service.coverImage}
                          alt={service.serviceName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />

                        {/* Category & Verified Badges */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className="px-2.5 py-1 bg-stone-900/85 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase tracking-wider border border-white/20">
                            {service.serviceCategory.replace(/_/g, ' ')}
                          </span>
                        </div>

                        {service.internationalClientReady && (
                          <div className="absolute top-3 right-3 px-2 py-0.5 bg-emerald-600 text-white rounded-md text-[10px] font-bold shadow flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            <span>Global Client Ready</span>
                          </div>
                        )}

                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <span className="text-[11px] text-amber-300 font-semibold block">{service.placeName}</span>
                          <h3 className="font-display text-lg font-bold leading-tight">{service.serviceName}</h3>
                          <span className="text-xs text-stone-300">{service.providerName} · {service.yearsOperating}+ Yrs Experience</span>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-5 space-y-4">
                        <p className="text-xs text-stone-600 leading-relaxed">
                          {service.overview}
                        </p>

                        {/* Place-Specific Features (Prominently highlighted) */}
                        <div className="space-y-1.5 pt-2 border-t border-stone-100">
                          <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wide block">
                            Place-Specific Features:
                          </span>
                          <ul className="space-y-1 text-xs text-stone-700">
                            {service.placeSpecificFeatures.map((feat, idx) => (
                              <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Deliverables */}
                        <div className="text-[11px] text-stone-500 pt-1">
                          <span className="font-semibold text-stone-700">Deliverables: </span>
                          <span>{service.deliverables.join(' · ')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-5 pt-0 border-t border-stone-100 mt-2 space-y-3">
                      <div className="flex items-baseline justify-between pt-3">
                        <div>
                          <span className="text-[10px] text-stone-400 block uppercase font-medium">Starting Fee ({service.priceModel.replace(/_/g, ' ')})</span>
                          <div className="flex items-baseline gap-1.5">
                            <strong className="font-display text-lg font-bold text-stone-900">
                              ${service.startingPriceUsd.toLocaleString()}
                            </strong>
                            <span className="text-[11px] text-stone-500">
                              (NPR {service.startingPriceNpr.toLocaleString()})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <WhatsAppViberButtons
                          phone={service.phone || "+977-9801234567"}
                          messageText={`Namaste! I am inquiring about the destination service "${service.serviceName}" in ${service.placeName} for an upcoming celebration.`}
                          variant="badges"
                        />
                        <button
                          onClick={() => {
                            setAdditionalNotes((prev) => `${prev}\nInterested in adding destination vendor service: ${service.serviceName} (${service.providerName})`);
                            const el = document.getElementById('intake-portal');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="flex-1 py-2 px-3 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-xs text-center"
                        >
                          Add to Itinerary
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: CURATED ALL-INCLUSIVE CELEBRATION PACKAGES        */}
        {/* ======================================================== */}
        {activeCatalogTab === 'PACKAGES' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-800" />
                <span className="text-xs font-bold text-stone-800">Filter Curated Itineraries:</span>
              </div>
              <div className="flex flex-wrap gap-1.5 text-xs font-medium">
                {[
                  { id: 'ALL', label: 'All Packages (4)' },
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
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      selectedRegion === tab.id
                        ? 'bg-amber-900 text-white font-bold shadow-xs'
                        : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="group bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={pkg.heroImage}
                        alt={pkg.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-stone-900/80 backdrop-blur-md rounded-lg text-[11px] font-semibold text-white flex items-center gap-1 border border-white/20">
                        <Mountain className="w-3 h-3 text-amber-400" />
                        <span>{pkg.altitudeMeters}m Elevation</span>
                      </div>

                      <div className="absolute top-3 right-3 px-2.5 py-1 bg-amber-500 text-stone-950 rounded-lg text-[11px] font-bold shadow">
                        {pkg.durationDays} Days / {pkg.durationDays - 1} Nights
                      </div>

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

                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                      <div className="flex items-center gap-1.5">
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

                      <WhatsAppViberButtons
                        phone="+977-9801234567"
                        messageText={createDestinationInquiryMessage(pkg.title, pkg.locationName)}
                        variant="badges"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* MODAL: REGISTER DESTINATION SERVICE OR LUXURY HOTEL      */}
      {/* ======================================================== */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <Mountain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">
                    Register Destination Haven or Specialized Service
                  </h3>
                  <p className="text-xs text-stone-300">
                    Feature your luxury hotel or celebration service to global NRIs & international couples.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-300 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Type Switcher */}
            <div className="p-4 bg-stone-100 border-b border-stone-200 flex items-center gap-2 shrink-0 text-xs font-bold">
              <span className="text-stone-500 mr-2">Listing Type:</span>
              <button
                type="button"
                onClick={() => setRegisterType('HOTEL')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                  registerType === 'HOTEL'
                    ? 'bg-amber-900 text-white shadow-sm'
                    : 'bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Destination Hotel / Luxury Resort</span>
              </button>
              <button
                type="button"
                onClick={() => setRegisterType('VENDOR_SERVICE')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                  registerType === 'VENDOR_SERVICE'
                    ? 'bg-amber-900 text-white shadow-sm'
                    : 'bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Specialized Destination Vendor Service</span>
              </button>
            </div>

            {/* Form Scroll Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              {registerType === 'HOTEL' ? (
                /* HOTEL REGISTRATION FORM */
                <form onSubmit={handleRegisterHotel} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Hotel / Resort Name (English) *
                      </label>
                      <input
                        type="text"
                        required
                        value={hotelName}
                        onChange={(e) => setHotelName(e.target.value)}
                        placeholder="e.g. Tiger Mountain Pokhara Lodge"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Nepali Name (नेपाली नाम)
                      </label>
                      <input
                        type="text"
                        value={hotelNepaliName}
                        onChange={(e) => setHotelNepaliName(e.target.value)}
                        placeholder="उदा: टाइगर माउन्टेन पोखरा लज"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Sacred Destination Region *
                      </label>
                      <select
                        value={hotelRegion}
                        onChange={(e) => setHotelRegion(e.target.value as DestinationPlaceRegion)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      >
                        <option value="POKHARA_ANNAPURNA">Pokhara & Annapurna</option>
                        <option value="NAGARKOT_DHULIKHEL">Nagarkot & Dhulikhel</option>
                        <option value="KATHMANDU_HERITAGE">Kathmandu UNESCO Valley</option>
                        <option value="CHITWAN_SAFARI">Chitwan Wilderness</option>
                        <option value="MUKTINATH_MUSTANG">Mustang & Muktinath</option>
                        <option value="EVEREST_SOLUKHUMBU">Everest & Solukhumbu</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Specific Place / District (७७ जिल्ला वा टाइप गर्नुहोस्) *
                      </label>
                      <NepalDistrictSelector
                        value={hotelLocation}
                        onChange={(dist) => setHotelLocation(dist)}
                        placeholder="e.g. Kaski / Mustang / Chitwan (Type or pick)..."
                        inputClassName="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Elevation (Meters Above Sea Level) *
                      </label>
                      <input
                        type="number"
                        required
                        value={hotelAltitude}
                        onChange={(e) => setHotelAltitude(Number(e.target.value))}
                        placeholder="1200"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Star Luxury Tier
                      </label>
                      <select
                        value={hotelStarRating}
                        onChange={(e) => {
                          const val = e.target.value;
                          setHotelStarRating(val === 'HERITAGE_LUXURY' ? 'HERITAGE_LUXURY' : (Number(val) as 3|4|5));
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      >
                        <option value={5}>5-Star Luxury Resort</option>
                        <option value="HERITAGE_LUXURY">Heritage Boutique Palace</option>
                        <option value={4}>4-Star Deluxe Haven</option>
                        <option value={3}>3-Star Mountain Retreat</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Total Guest Rooms / Villas
                      </label>
                      <input
                        type="number"
                        value={hotelRooms}
                        onChange={(e) => setHotelRooms(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Max Banquet Lawn Capacity
                      </label>
                      <input
                        type="number"
                        value={hotelBanquetCap}
                        onChange={(e) => setHotelBanquetCap(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Place-Specific Features (Prominent user requirement) */}
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Place-Specific Features & Terrain Highlights * (Comma-separated)
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={hotelPlaceFeatures}
                      onChange={(e) => setHotelPlaceFeatures(e.target.value)}
                      placeholder="e.g. Certified Airbus H125 Helipad on lawn, 180° Annapurna panoramic view, Glasshouse Mandap with heated floors, Sacred riverside dining"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    <span className="text-[11px] text-stone-400">
                      Highlight helipads, mountain views, microclimates, sacred shrines, or architectural heritage.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Starting Buyout Price (USD $) *
                      </label>
                      <input
                        type="number"
                        required
                        value={hotelPriceUsd}
                        onChange={(e) => {
                          const usd = Number(e.target.value);
                          setHotelPriceUsd(usd);
                          setHotelPriceNpr(usd * 133);
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Starting Price in NPR (रु.) *
                      </label>
                      <input
                        type="number"
                        required
                        value={hotelPriceNpr}
                        onChange={(e) => setHotelPriceNpr(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Contact Person</label>
                      <input
                        type="text"
                        value={hotelContact}
                        onChange={(e) => setHotelContact(e.target.value)}
                        placeholder="e.g. Bikash Thapa (GM)"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Phone / WhatsApp *</label>
                      <input
                        type="text"
                        required
                        value={hotelPhone}
                        onChange={(e) => setHotelPhone(e.target.value)}
                        placeholder="+977-9851000000"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={hotelEmail}
                        onChange={(e) => setHotelEmail(e.target.value)}
                        placeholder="reservations@hotel.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Cover Photo URL</label>
                    <input
                      type="text"
                      value={hotelCoverImage}
                      onChange={(e) => setHotelCoverImage(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => setIsRegisterModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-amber-900 hover:bg-amber-950 text-white rounded-xl font-bold shadow-md flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Register Destination Hotel</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* SPECIALIZED VENDOR SERVICE REGISTRATION FORM */
                <form onSubmit={handleRegisterVendorService} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Service Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        placeholder="e.g. Annapurna Helicopter Barat Charter Fleet"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Provider / Operating Company *
                      </label>
                      <input
                        type="text"
                        required
                        value={serviceProvider}
                        onChange={(e) => setServiceProvider(e.target.value)}
                        placeholder="e.g. Himalayan Aviation & Celebration Logistics"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Service Category *
                      </label>
                      <select
                        value={serviceCategory}
                        onChange={(e) => setServiceCategory(e.target.value as DestinationServiceCategory)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      >
                        <option value="HELI_CHARTER_LOGISTICS">Helicopter Charter Logistics</option>
                        <option value="EXPEDITION_PHOTOGRAPHY_DRONE">High-Altitude Cinema & Starlink 4K</option>
                        <option value="SACRED_MONASTERY_CEREMONY">Sacred Monastery & Lama Rites</option>
                        <option value="HERITAGE_CULTURAL_EXPERIENCE">Royal Newari & Indigenous Folk Troupe</option>
                        <option value="HIGH_ALTITUDE_EVENT_PRODUCTION">Glamping & Weatherproof Mandap</option>
                        <option value="ECO_FARM_BANQUET_CATERING">Eco Farm Organic Banqueting</option>
                        <option value="OTHER_DESTINATION_SERVICE">Other Specialized Service</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Primary Operational Region *
                      </label>
                      <select
                        value={serviceRegion}
                        onChange={(e) => setServiceRegion(e.target.value as DestinationPlaceRegion)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      >
                        <option value="POKHARA_ANNAPURNA">Pokhara & Annapurna</option>
                        <option value="MUKTINATH_MUSTANG">Mustang & Muktinath (3,710m)</option>
                        <option value="EVEREST_SOLUKHUMBU">Everest Region & Syangboche (3,880m)</option>
                        <option value="KATHMANDU_HERITAGE">Kathmandu UNESCO Valley</option>
                        <option value="NAGARKOT_DHULIKHEL">Nagarkot & Dhulikhel Ridge</option>
                        <option value="CHITWAN_SAFARI">Chitwan Wilderness</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Landing Hub / District (७७ जिल्ला वा टाइप गर्नुहोस्) *
                      </label>
                      <NepalDistrictSelector
                        value={servicePlaceName}
                        onChange={(dist) => setServicePlaceName(dist)}
                        placeholder="e.g. Mustang / Solukhumbu / Kaski (Type or pick)..."
                        inputClassName="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Place-Specific Features (Prominent user requirement) */}
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Place-Specific Features & Geographic Capabilities * (Comma-separated)
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={servicePlaceFeatures}
                      onChange={(e) => setServicePlaceFeatures(e.target.value)}
                      placeholder="e.g. Airbus H125 high-altitude aircraft with Barat flower garlands, Certified high-altitude pilots, Emergency medical oxygen kits, Glacier landing permits"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Deliverables Summary (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={serviceDeliverables}
                      onChange={(e) => setServiceDeliverables(e.target.value)}
                      placeholder="e.g. 3 chartered flights, flower garlands on landing gear, ground coordination"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Pricing Model
                      </label>
                      <select
                        value={servicePriceModel}
                        onChange={(e) => setServicePriceModel(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white"
                      >
                        <option value="PER_EVENT">Per Celebration Event</option>
                        <option value="PER_FLIGHT_HOUR">Per Flight Hour</option>
                        <option value="PER_DAY">Per Operational Day</option>
                        <option value="PER_GUEST">Per Guest / Attendee</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Starting Price (USD $) *
                      </label>
                      <input
                        type="number"
                        required
                        value={servicePriceUsd}
                        onChange={(e) => {
                          const usd = Number(e.target.value);
                          setServicePriceUsd(usd);
                          setServicePriceNpr(usd * 133);
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Starting Price in NPR (रु.)
                      </label>
                      <input
                        type="number"
                        value={servicePriceNpr}
                        onChange={(e) => setServicePriceNpr(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Contact Phone / WhatsApp *</label>
                      <input
                        type="text"
                        required
                        value={servicePhone}
                        onChange={(e) => setServicePhone(e.target.value)}
                        placeholder="+977-9801234567"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={serviceEmail}
                        onChange={(e) => setServiceEmail(e.target.value)}
                        placeholder="operations@aviation.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => setIsRegisterModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-amber-900 hover:bg-amber-950 text-white rounded-xl font-bold shadow-md flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Register Destination Service</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

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
