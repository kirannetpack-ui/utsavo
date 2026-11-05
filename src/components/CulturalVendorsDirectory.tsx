/**
 * UTSAVO — Cultural Artists & Specialized Celebration Vendors Directory
 * Turnkey talent: Panche Baja, Dhime Baja, Vedic Purohits, Photographers, Makeup Artists & Attire
 */

import React, { useState } from 'react';
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
  Award
} from 'lucide-react';

interface CulturalVendorsDirectoryProps {
  onBackToExplore?: () => void;
}

export const CulturalVendorsDirectory: React.FC<CulturalVendorsDirectoryProps> = ({ onBackToExplore }) => {
  const [vendors, setVendors] = useState<CulturalVendor[]>(initialCulturalVendors);
  const [selectedCategory, setSelectedCategory] = useState<CulturalVendorCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendorForModal, setSelectedVendorForModal] = useState<CulturalVendor | null>(null);
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
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Category filter tabs
  const categoryTabs: { id: CulturalVendorCategory | 'ALL'; label: string; nepaliLabel: string; icon: string }[] = [
    { id: 'ALL', label: 'All Artists & Vendors', nepaliLabel: 'सबै कलाकार तथा सेवा', icon: '🌟' },
    { id: 'PANCHE_NAUMATI_BAJA', label: 'Panche & Naumati Baja', nepaliLabel: 'पञ्चे तथा नौमती बाजा', icon: '🎺' },
    { id: 'NEWARI_DHIME_BAJA', label: 'Newari Dhime & Flute', nepaliLabel: 'धिमे तथा बाँसुरी खलः', icon: '🥁' },
    { id: 'VEDIC_PUROHIT_ACHARYA', label: 'Vedic Purohits & Acharyas', nepaliLabel: 'वैदिक पण्डित/पुरोहित', icon: '🕉️' },
    { id: 'PHOTOGRAPHY_CINEMATOGRAPHY', label: 'Photographers & Drone', nepaliLabel: 'फोटो तथा ड्रोन सिनेमा', icon: '📸' },
    { id: 'BRIDAL_MAKEUP_MEHENDI', label: 'Bridal Makeup & Henna', nepaliLabel: 'ब्राइडल मेकअप तथा मेहन्दी', icon: '💄' },
    { id: 'TRADITIONAL_ATTIRE_JEWELRY', label: 'Traditional Attire & Dhaka', nepaliLabel: 'दौरा सुरुवाल तथा ढाका', icon: '👔' },
  ];

  const filteredVendors = vendors.filter((v) => {
    const matchesCategory = selectedCategory === 'ALL' || v.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.nepaliName && v.nepaliName.includes(searchQuery)) ||
      v.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.bio.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: CulturalVendor = {
      id: `vendor-custom-${Date.now()}`,
      name: newVendor.name,
      nepaliName: newVendor.nepaliName || undefined,
      category: newVendor.category,
      leaderOrContact: newVendor.leaderOrContact,
      phone: newVendor.phone,
      email: newVendor.email,
      district: newVendor.district,
      province: newVendor.province,
      address: newVendor.address,
      yearsOfExperience: Number(newVendor.yearsOfExperience),
      rating: 5.0,
      reviewCount: 1,
      verifiedBadge: true,
      startingPriceNpr: Number(newVendor.startingPriceNpr),
      priceUnit: 'PER_EVENT',
      bio: newVendor.bio,
      specializations: newVendor.specializations
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      isOpenForTravelAcrossNepal: newVendor.isOpenForTravelAcrossNepal,
      bilingualEnglishSupport: newVendor.bilingualEnglishSupport,
      portfolioImages: [
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80'
      ],
      packages: [
        {
          id: `pkg-${Date.now()}`,
          name: 'Standard Celebratory Package',
          priceNpr: Number(newVendor.startingPriceNpr),
          description: 'Standard event coverage and certified ceremonial execution.',
          deliverables: ['Full event execution', 'Professional team attire', 'Guaranteed punctuality']
        }
      ]
    };

    setVendors([created, ...vendors]);
    setRegistrationSuccess(true);
    setTimeout(() => {
      setRegistrationSuccess(false);
      setIsRegisterModalOpen(false);
    }, 1800);
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

                {/* Rating */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-amber-400 text-[11px] font-bold shadow-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{vendor.rating} ({vendor.reviewCount})</span>
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

                {/* Actions: View Packages + WhatsApp/Viber buttons */}
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <button
                    onClick={() => setSelectedVendorForModal(vendor)}
                    className="w-full py-2 bg-stone-900 hover:bg-stone-950 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    View Packages & Deliverables ({vendor.packages.length})
                  </button>

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
              <button
                onClick={() => setSelectedVendorForModal(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
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
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      <option value="PANCHE_NAUMATI_BAJA">🎺 Panche & Naumati Baja</option>
                      <option value="NEWARI_DHIME_BAJA">🥁 Newari Dhime & Flute</option>
                      <option value="VEDIC_PUROHIT_ACHARYA">🕉️ Vedic Purohit & Acharya</option>
                      <option value="PHOTOGRAPHY_CINEMATOGRAPHY">📸 Photography & Drone</option>
                      <option value="BRIDAL_MAKEUP_MEHENDI">💄 Bridal Makeup & Mehendi</option>
                      <option value="TRADITIONAL_ATTIRE_JEWELRY">👔 Traditional Attire & Dhaka</option>
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">District *</label>
                    <input
                      type="text"
                      required
                      value={newVendor.district}
                      onChange={(e) => setNewVendor({ ...newVendor, district: e.target.value })}
                      placeholder="e.g. Kaski / Kathmandu"
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
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
