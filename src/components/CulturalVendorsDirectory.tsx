/**
 * UTSAVO — Cultural Artists & Specialized Celebration Vendors Directory
 * Turnkey talent: Panche Baja, Dhime Baja, Vedic Purohits, Photographers, Makeup Artists & Attire
 */

import React, { useState, useMemo } from 'react';
import { initialCulturalVendors } from '../data/culturalVendorsData';
import { CulturalVendor, CulturalVendorCategory } from '../types';
import { WhatsAppViberButtons } from './WhatsAppViberButtons';
import { createVendorInquiryMessage } from '../utils/communication';
import {
  Sparkles,
  Music,
  Camera,
  Heart,
  Shirt,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Search,
  SlidersHorizontal,
  PlusCircle,
  X,
  CheckCircle,
  Globe,
  Award,
  Calendar,
  Bookmark,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { RealtimeAvailabilityCalendar } from './RealtimeAvailabilityCalendar';
import { NepalDistrictSelector, NepalProvinceSelector } from './NepalLocationSelector';

interface CulturalVendorsDirectoryProps {
  onBackToExplore?: () => void;
}

interface CategoryFilterTab {
  id: string;
  label: string;
  nepaliLabel: string;
  icon: string;
}

export const CulturalVendorsDirectory: React.FC<CulturalVendorsDirectoryProps> = ({ onBackToExplore }) => {
  const {
    culturalVendors,
    addCulturalVendor,
    customCategories,
    proposeCustomCategory,
    toggleSaveVendor,
    isVendorSaved,
    savedVendorIds,
  } = useMarketplace();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendorForModal, setSelectedVendorForModal] = useState<CulturalVendor | null>(null);
  const [selectedVendorForCalendar, setSelectedVendorForCalendar] = useState<CulturalVendor | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // New Vendor Registration State
  const [newVendor, setNewVendor] = useState({
    name: '',
    nepaliName: '',
    category: 'PANCHE_NAUMATI_BAJA' as CulturalVendorCategory,
    leaderOrContact: '',
    phone: '',
    email: '',
    district: 'Kathmandu',
    province: 'Bagmati',
    address: '',
    yearsOfExperience: 5,
    startingPriceNpr: 30000,
    bio: '',
    specializations: '',
    isOpenForTravelAcrossNepal: true,
    bilingualEnglishSupport: false,
  });

  // State for "OTHER" Category proposal
  const [otherCategoryName, setOtherCategoryName] = useState('');
  const [otherCategoryNepali, setOtherCategoryNepali] = useState('');
  const [otherCategoryIcon, setOtherCategoryIcon] = useState('🎭');
  const [otherCategoryDesc, setOtherCategoryDesc] = useState('');

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [proposalSentToAdmin, setProposalSentToAdmin] = useState(false);

  // Base Category filter tabs
  const baseCategoryTabs: CategoryFilterTab[] = [
    { id: 'ALL', label: 'All Artists & Vendors', nepaliLabel: 'सबै कलाकार तथा सेवा', icon: '🌟' },
    { id: 'SAVED', label: `Saved Artists (${savedVendorIds.length})`, nepaliLabel: `सुरक्षित (${savedVendorIds.length})`, icon: '🔖' },
    { id: 'PANCHE_NAUMATI_BAJA', label: 'Panche & Naumati Baja', nepaliLabel: 'पञ्चे तथा नौमती बाजा', icon: '🎺' },
    { id: 'NEWARI_DHIME_BAJA', label: 'Newari Dhime & Flute', nepaliLabel: 'धिमे तथा बाँसुरी खलः', icon: '🥁' },
    { id: 'VEDIC_PUROHIT_ACHARYA', label: 'Vedic Purohits & Acharyas', nepaliLabel: 'वैदिक पण्डित/पुरोहित', icon: '🕉️' },
    { id: 'PHOTOGRAPHY_CINEMATOGRAPHY', label: 'Photographers & Drone', nepaliLabel: 'फोटो तथा ड्रोन सिनेमा', icon: '📸' },
    { id: 'BRIDAL_MAKEUP_MEHENDI', label: 'Bridal Makeup & Henna', nepaliLabel: 'ब्राइडल मेकअप तथा मेहन्दी', icon: '💄' },
    { id: 'TRADITIONAL_ATTIRE_JEWELRY', label: 'Traditional Attire & Dhaka', nepaliLabel: 'दौरा सुरुवाल तथा ढाका', icon: '👔' },
  ];

  // Dynamic tabs combining standard categories + approved (Permanent or Temporary) custom categories
  const categoryTabs: CategoryFilterTab[] = useMemo(() => {
    const list: CategoryFilterTab[] = [...baseCategoryTabs];
    customCategories.forEach((cat) => {
      if (cat.status === 'PERMANENT' || cat.status === 'TEMPORARY') {
        const alreadyExists = list.some((item) => item.id === cat.categoryKey);
        if (!alreadyExists) {
          list.push({
            id: cat.categoryKey,
            label: cat.name + (cat.status === 'TEMPORARY' ? ' (Seasonal)' : ''),
            nepaliLabel: cat.nepaliName,
            icon: cat.icon || '✨',
          });
        }
      }
    });
    return list;
  }, [baseCategoryTabs, customCategories]);

  const filteredVendors = culturalVendors.filter((v) => {
    let matchesCategory = false;
    if (selectedCategory === 'ALL') {
      matchesCategory = true;
    } else if (selectedCategory === 'SAVED') {
      matchesCategory = isVendorSaved(v.id);
    } else {
      matchesCategory =
        v.category === selectedCategory ||
        Boolean(
          v.customCategoryName &&
          v.customCategoryName.toUpperCase().replace(/[^A-Z0-9]/g, '_') === selectedCategory
        );
    }

    const matchesSearch =
      searchQuery.trim() === '' ||
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.nepaliName && v.nepaliName.includes(searchQuery)) ||
      v.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.customCategoryName && v.customCategoryName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let assignedCategory: CulturalVendorCategory = newVendor.category;
    let customCategoryStatus: 'PENDING' | 'PERMANENT' | 'TEMPORARY' | undefined = undefined;
    let customCatName: string | undefined = undefined;
    let customCatNepali: string | undefined = undefined;

    if (newVendor.category === 'OTHER') {
      const generatedKey = otherCategoryName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '_');
      proposeCustomCategory({
        categoryKey: generatedKey || `CAT_${Date.now()}`,
        name: otherCategoryName.trim() || 'New Cultural Category',
        nepaliName: otherCategoryNepali.trim() || otherCategoryName.trim(),
        icon: otherCategoryIcon.trim() || '✨',
        description: otherCategoryDesc.trim() || `Proposed by ${newVendor.name}`,
        proposedByVendorName: newVendor.name,
      });

      assignedCategory = generatedKey;
      customCatName = otherCategoryName.trim();
      customCatNepali = otherCategoryNepali.trim();
      customCategoryStatus = 'PENDING';
      setProposalSentToAdmin(true);
    } else {
      setProposalSentToAdmin(false);
    }

    const created: CulturalVendor = {
      id: `vendor-custom-${Date.now()}`,
      name: newVendor.name,
      nepaliName: newVendor.nepaliName || undefined,
      category: assignedCategory,
      customCategoryName: customCatName,
      customCategoryNepaliName: customCatNepali,
      customCategoryStatus: customCategoryStatus,
      leaderOrContact: newVendor.leaderOrContact,
      phone: newVendor.phone,
      email: newVendor.email,
      district: newVendor.district,
      province: newVendor.province,
      address: newVendor.address || `${newVendor.district}, ${newVendor.province}`,
      yearsOfExperience: Number(newVendor.yearsOfExperience),
      rating: 5.0,
      reviewCount: 1,
      verifiedBadge: true,
      startingPriceNpr: Number(newVendor.startingPriceNpr),
      priceUnit: 'PER_EVENT',
      bio: newVendor.bio || `${newVendor.name} - Professional celebration service provider.`,
      specializations: newVendor.specializations
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      isOpenForTravelAcrossNepal: newVendor.isOpenForTravelAcrossNepal,
      bilingualEnglishSupport: newVendor.bilingualEnglishSupport,
      portfolioImages: [
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80',
      ],
      packages: [
        {
          id: `pkg-${Date.now()}`,
          name: 'Standard Celebratory Package',
          priceNpr: Number(newVendor.startingPriceNpr),
          description: 'Standard event coverage and certified ceremonial execution.',
          deliverables: ['Full event execution', 'Professional team attire', 'Guaranteed punctuality'],
        },
      ],
    };

    addCulturalVendor(created);
    setRegistrationSuccess(true);
    setTimeout(() => {
      setRegistrationSuccess(false);
      setIsRegisterModalOpen(false);
      // Reset OTHER inputs
      setOtherCategoryName('');
      setOtherCategoryNepali('');
      setOtherCategoryDesc('');
    }, 2400);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white p-8 sm:p-10 shadow-xl border border-amber-900/40">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Turnkey Cultural Talent & Master Artists</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            Nepal's Cultural Artist & Celebration Vendor Guild
          </h1>
          <p className="text-sm sm:text-base text-stone-200 leading-relaxed">
            Book certified master ensembles for your wedding, Bratabandha, or gala. 
            From royal Panche Baja & Newari Dhime troupes to English-fluent Vedic Acharyas and Himalayan drone cinematographers.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Join as Artist / Vendor (कलाकार दर्ता)</span>
            </button>
            <div className="text-xs text-amber-200/80 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Identity · Direct WhatsApp Connect · No Intermediary Markup</span>
            </div>
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute right-4 -bottom-6 text-9xl text-amber-500/10 font-display select-none pointer-events-none">
          बाजा
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative max-w-xl">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by artist name, district (e.g. Kaski, Lalitpur), or instrument..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === tab.id
                  ? 'bg-amber-900 text-white shadow-sm'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => {
          const inquiryMessage = createVendorInquiryMessage(
            vendor.name,
            vendor.category.replace(/_/g, ' '),
            'Upcoming Subha Muhurat',
            vendor.district
          );

          return (
            <div
              key={vendor.id}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col group"
            >
              {/* Photo & Badge Banner */}
              <div className="relative h-48 bg-stone-100 overflow-hidden">
                <img
                  src={vendor.portfolioImages[0]}
                  alt={vendor.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Verification Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Master Guild</span>
                </div>

                {/* Rating & Bookmark */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-amber-400 text-[11px] font-bold shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{vendor.rating} ({vendor.reviewCount})</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveVendor(vendor.id);
                    }}
                    aria-label={isVendorSaved(vendor.id) ? 'Remove from saved' : 'Save vendor to favorites'}
                    title={isVendorSaved(vendor.id) ? 'Saved to Favorites (सुरक्षित)' : 'Bookmark Artist (मनपर्नेमा राख्नुहोस्)'}
                    className={`p-1.5 rounded-full backdrop-blur-md transition-all shadow-xs cursor-pointer ${
                      isVendorSaved(vendor.id)
                        ? 'bg-amber-900 text-amber-100 ring-2 ring-amber-400/80 scale-105'
                        : 'bg-stone-900/80 text-stone-300 hover:text-white hover:bg-stone-900'
                    }`}
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 transition-transform ${
                        isVendorSaved(vendor.id) ? 'fill-amber-300 text-amber-300 scale-110' : 'text-stone-300'
                      }`}
                    />
                  </button>
                </div>

                {/* Bottom Overlay Title */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="text-[11px] font-medium text-amber-300 uppercase tracking-wider">
                    {vendor.leaderOrContact}
                  </div>
                  <h3 className="font-display text-lg font-bold truncate">
                    {vendor.name}
                  </h3>
                  {vendor.nepaliName && (
                    <div className="text-xs text-stone-200 truncate">
                      {vendor.nepaliName}
                    </div>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Location & Experience Meta */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-700" />
                      <span>{vendor.district}, {vendor.province}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{vendor.yearsOfExperience} yrs exp</span>
                    </div>
                    {vendor.bilingualEnglishSupport && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-[10px] border border-blue-200">
                        Bilingual English/Nepali
                      </span>
                    )}
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {vendor.bio}
                  </p>

                  {/* Specializations Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {vendor.specializations.slice(0, 3).map((spec, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-medium"
                      >
                        ✓ {spec}
                      </span>
                    ))}
                  </div>

                  {/* Pricing Overview */}
                  <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-medium text-stone-500 uppercase block">Starting Rate</span>
                      <span className="text-sm font-bold text-amber-950 font-display">
                        Rs. {vendor.startingPriceNpr.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-stone-500 ml-1">/ event</span>
                    </div>
                    {vendor.isOpenForTravelAcrossNepal && (
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-1 rounded-md">
                        Travels Across Nepal ✈️
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions: View Packages, Live Calendar + WhatsApp/Viber buttons */}
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedVendorForModal(vendor)}
                      className="w-full py-2 bg-stone-900 hover:bg-stone-950 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Packages ({vendor.packages.length})
                    </button>
                    <button
                      onClick={() => setSelectedVendorForCalendar(vendor)}
                      className="w-full py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl text-xs font-bold transition-colors border border-amber-300 flex items-center justify-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5 text-amber-800" />
                      <span>Availability</span>
                    </button>
                  </div>

                  {/* Instant WhatsApp / Viber Click-to-Chat */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-stone-400">Direct Chat:</span>
                    <WhatsAppViberButtons
                      phone={vendor.phone}
                      messageText={inquiryMessage}
                      variant="badges"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredVendors.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
          <p className="text-sm text-stone-500">No artists or vendors match your search filters.</p>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSearchQuery('');
            }}
            className="mt-3 px-4 py-2 bg-amber-900 text-white rounded-xl text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Vendor Package Detail Modal */}
      {selectedVendorForModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-5 bg-stone-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {selectedVendorForModal.category.replace(/_/g, ' ')}
                </span>
                <h3 className="font-display text-xl font-bold">{selectedVendorForModal.name}</h3>
                <p className="text-xs text-stone-300">
                  Lead Artist: {selectedVendorForModal.leaderOrContact} · {selectedVendorForModal.district}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleSaveVendor(selectedVendorForModal.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md transition-all shadow-md cursor-pointer ${
                    isVendorSaved(selectedVendorForModal.id)
                      ? 'bg-amber-900 text-amber-100 ring-2 ring-amber-400/80 shadow-amber-950/30'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <Bookmark
                    className={`w-3.5 h-3.5 ${
                      isVendorSaved(selectedVendorForModal.id) ? 'fill-amber-300 text-amber-300' : 'text-stone-300'
                    }`}
                  />
                  <span>{isVendorSaved(selectedVendorForModal.id) ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  onClick={() => setSelectedVendorForModal(null)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              <div>
                <h4 className="font-bold text-sm text-stone-900 mb-2">Available Packages & Deliverables</h4>
                <div className="space-y-4">
                  {selectedVendorForModal.packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="font-bold text-stone-900 text-sm">{pkg.name}</h5>
                          <p className="text-xs text-stone-600 mt-0.5">{pkg.description}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-sm font-bold text-amber-900 block font-display">
                            Rs. {pkg.priceNpr.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-stone-400">All inclusive</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-stone-200/60 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                          Included Deliverables:
                        </span>
                        {pkg.deliverables.map((del, dIdx) => (
                          <div key={dIdx} className="flex items-center gap-1.5 text-stone-700">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{del}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability & Auspicious Dates Shortcut */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-stone-900 block text-xs">Panchanga Auspicious Dates</span>
                  <span className="text-[11px] text-stone-500">Check availability on peak marriage & bratabandha dates</span>
                </div>
                <button
                  onClick={() => {
                    const v = selectedVendorForModal;
                    setSelectedVendorForModal(null);
                    setSelectedVendorForCalendar(v);
                  }}
                  className="px-3 py-1.5 bg-amber-900 hover:bg-amber-950 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-300" />
                  <span>Open Calendar</span>
                </button>
              </div>

              {/* Direct Booking & Chat Connect */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-stone-900 text-sm">Lock Date & Inquire Direct</h5>
                    <p className="text-[11px] text-stone-600">
                      Message {selectedVendorForModal.leaderOrContact} directly on WhatsApp or Viber.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-stone-800">{selectedVendorForModal.phone}</span>
                  </div>
                </div>

                <WhatsAppViberButtons
                  phone={selectedVendorForModal.phone}
                  messageText={createVendorInquiryMessage(
                    selectedVendorForModal.name,
                    selectedVendorForModal.category.replace(/_/g, ' '),
                    'Subha Muhurat',
                    selectedVendorForModal.district
                  )}
                  variant="full"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-Time Availability & Auspicious Dates Modal */}
      {selectedVendorForCalendar && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                    {selectedVendorForCalendar.category.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-stone-300">Live Booking Schedule</span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold mt-1">{selectedVendorForCalendar.name}</h3>
                <p className="text-xs text-stone-300">
                  Panchanga-aligned shift availability for {selectedVendorForCalendar.leaderOrContact} · {selectedVendorForCalendar.district}
                </p>
              </div>
              <button
                onClick={() => setSelectedVendorForCalendar(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              <RealtimeAvailabilityCalendar
                entityType="VENDOR"
                entityId={selectedVendorForCalendar.id}
                entityName={selectedVendorForCalendar.name}
                contactPhone={selectedVendorForCalendar.phone}
                onSelectSlot={(_dateBS, _dateAD, _shift, _muhurat) => {
                  // Slot selected
                }}
                onProceedToQuote={(_dateBS, _shift) => {
                  const v = selectedVendorForCalendar;
                  setSelectedVendorForCalendar(null);
                  setSelectedVendorForModal(v);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Register New Artist / Vendor Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-5 bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Utsavo Cultural Guild Registration
                </span>
                <h3 className="font-display text-xl font-bold">Register as Artist or Vendor</h3>
                <p className="text-xs text-stone-300">
                  Connect with thousands of wedding couples and party palaces across Nepal
                </p>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {registrationSuccess ? (
              <div className="p-10 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="font-display text-lg font-bold text-stone-900">
                  Welcome to the Utsavo Cultural Guild!
                </h4>
                <p className="text-xs text-stone-600">
                  Your troupe profile has been registered and verified. Couples and venues can now connect with you via WhatsApp and Viber.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Ensemble / Brand Name *</label>
                    <input
                      type="text"
                      required
                      value={newVendor.name}
                      onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                      placeholder="e.g. Gandharva Naumati Ensemble"
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Nepali Name (ऐच्छिक)</label>
                    <input
                      type="text"
                      value={newVendor.nepaliName}
                      onChange={(e) => setNewVendor({ ...newVendor, nepaliName: e.target.value })}
                      placeholder="e.g. गन्धर्व नौमती बाजा खलः"
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Guild Category *</label>
                    <select
                      value={newVendor.category}
                      onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value as CulturalVendorCategory })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
                    >
                      <option value="PANCHE_NAUMATI_BAJA">🎺 Panche & Naumati Baja (पञ्चे तथा नौमती बाजा)</option>
                      <option value="NEWARI_DHIME_BAJA">🥁 Newari Dhime & Flute (धिमे तथा बाँसुरी खलः)</option>
                      <option value="VEDIC_PUROHIT_ACHARYA">🕉️ Vedic Purohit & Acharya (वैदिक पण्डित/पुरोहित)</option>
                      <option value="PHOTOGRAPHY_CINEMATOGRAPHY">📸 Photography & Drone (फोटो तथा सिनेमा)</option>
                      <option value="BRIDAL_MAKEUP_MEHENDI">💄 Bridal Makeup & Mehendi (मेकअप तथा मेहन्दी)</option>
                      <option value="TRADITIONAL_ATTIRE_JEWELRY">👔 Traditional Attire & Dhaka (दौरा सुरुवाल र ढाका)</option>
                      {/* Approved Custom Categories */}
                      {customCategories
                        .filter((c) => c.status === 'PERMANENT' || c.status === 'TEMPORARY')
                        .map((c) => (
                          <option key={c.id} value={c.categoryKey}>
                            {c.icon} {c.name} {c.status === 'TEMPORARY' ? '(Seasonal)' : ''}
                          </option>
                        ))}
                      <option value="OTHER" className="font-bold text-amber-900 bg-amber-50">
                        ✨ OTHER — Propose New Category (अन्य नयाँ विधा प्रस्ताव गर्नुहोस्)
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Lead Artist / Contact *</label>
                    <input
                      type="text"
                      required
                      value={newVendor.leaderOrContact}
                      onChange={(e) => setNewVendor({ ...newVendor, leaderOrContact: e.target.value })}
                      placeholder="e.g. Ustad Prem Bahadur"
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Conditional "OTHER" Custom Category Proposal Card */}
                {newVendor.category === 'OTHER' && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50/60 to-amber-50 border border-amber-300 space-y-3 animate-in fade-in zoom-in-95 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-800" />
                        <span className="font-bold text-amber-950 text-xs">
                          Propose New Celebration Category to Admin
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-amber-200/90 text-amber-950 text-[10px] font-bold">
                        Admin Approval Workflow
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      Enter your specialized category. The proposal will be sent directly to the <strong>Admin Dashboard</strong>, where the administrator can approve it as <strong>Permanently Visible</strong> for all users or <strong>Temporary</strong> for this event season.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-stone-800 block text-[11px] mb-1">
                          Proposed Category Name (English) *
                        </label>
                        <input
                          type="text"
                          required
                          value={otherCategoryName}
                          onChange={(e) => setOtherCategoryName(e.target.value)}
                          placeholder="e.g. Gurung Traditional Ghatu Dancers"
                          className="w-full p-2 bg-white border border-amber-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-stone-800 block text-[11px] mb-1">
                          Category Name (नेपालीमा)
                        </label>
                        <input
                          type="text"
                          value={otherCategoryNepali}
                          onChange={(e) => setOtherCategoryNepali(e.target.value)}
                          placeholder="e.g. घाटु तथा मारुनी सांस्कृतिक समूह"
                          className="w-full p-2 bg-white border border-amber-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="font-semibold text-stone-800 block text-[11px] mb-1">
                          Icon / Emoji
                        </label>
                        <input
                          type="text"
                          value={otherCategoryIcon}
                          onChange={(e) => setOtherCategoryIcon(e.target.value)}
                          placeholder="e.g. 🎭, 🚁, 🎆, 🐎"
                          className="w-full p-2 bg-white border border-amber-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none text-center"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="font-semibold text-stone-800 block text-[11px] mb-1">
                          Description for Admin Review
                        </label>
                        <input
                          type="text"
                          value={otherCategoryDesc}
                          onChange={(e) => setOtherCategoryDesc(e.target.value)}
                          placeholder="Why this cultural talent is valuable for celebrations..."
                          className="w-full p-2 bg-white border border-amber-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Phone (WhatsApp / Viber) *</label>
                    <input
                      type="tel"
                      required
                      value={newVendor.phone}
                      onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                      placeholder="+977-9841000000"
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={newVendor.email}
                      onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                      placeholder="artist@utsavo.np"
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Province (प्रदेश - Select or Type)</label>
                    <NepalProvinceSelector
                      value={newVendor.province}
                      onChange={(prov) => setNewVendor({ ...newVendor, province: prov })}
                      inputClassName="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">District (७७ जिल्ला वा टाइप गर्नुहोस्) *</label>
                    <NepalDistrictSelector
                      value={newVendor.district}
                      onChange={(dist) => setNewVendor({ ...newVendor, district: dist })}
                      provinceFilter={newVendor.province}
                      onSelectProvince={(prov: string) => {
                        if (!newVendor.province || newVendor.province !== prov) {
                          setNewVendor((prev) => ({ ...prev, province: prov }));
                        }
                      }}
                      inputClassName="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Years of Exp</label>
                    <input
                      type="number"
                      value={newVendor.yearsOfExperience}
                      onChange={(e) => setNewVendor({ ...newVendor, yearsOfExperience: Number(e.target.value) })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Starting Price (NPR) *</label>
                    <input
                      type="number"
                      required
                      value={newVendor.startingPriceNpr}
                      onChange={(e) => setNewVendor({ ...newVendor, startingPriceNpr: Number(e.target.value) })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Short Bio & Ceremonial Heritage</label>
                  <textarea
                    rows={2}
                    value={newVendor.bio}
                    onChange={(e) => setNewVendor({ ...newVendor, bio: e.target.value })}
                    placeholder="Describe your instruments, performance style, and ceremonial repertoire..."
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Specializations (Comma separated)</label>
                  <input
                    type="text"
                    value={newVendor.specializations}
                    onChange={(e) => setNewVendor({ ...newVendor, specializations: e.target.value })}
                    placeholder="e.g. Janti Baraat, Sahanaai Melodies, Narsingha Fanfare"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                    <input
                      type="checkbox"
                      checked={newVendor.isOpenForTravelAcrossNepal}
                      onChange={(e) => setNewVendor({ ...newVendor, isOpenForTravelAcrossNepal: e.target.checked })}
                      className="rounded text-amber-900 focus:ring-amber-500"
                    />
                    <span>Open to Travel Across Nepal (नेपालभर यात्रा गर्न तयार)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                    <input
                      type="checkbox"
                      checked={newVendor.bilingualEnglishSupport}
                      onChange={(e) => setNewVendor({ ...newVendor, bilingualEnglishSupport: e.target.checked })}
                      className="rounded text-amber-900 focus:ring-amber-500"
                    />
                    <span>Bilingual English / Hindi Support (NRI Friendly)</span>
                  </label>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setIsRegisterModalOpen(false)}
                    className="px-4 py-2 border border-stone-200 rounded-xl hover:bg-stone-50 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-900 hover:bg-amber-950 text-white rounded-xl font-bold shadow"
                  >
                    Complete Guild Registration
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
