/**
 * UTSAVO - Professional Event Organizer Registration Modal
 * Grounded in global event management standards (MPI, ILEA, Event Safety Alliance)
 * Multi-step wizard capturing company credentials, insurance, technical riders,
 * run-of-show protocols, safety measures, portfolio photos/videos, and pricing.
 */

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { EventOrganizer, OrganizerSpecialization, OrganizerSuccessStandard } from '../types';
import { NEPAL_PROVINCES } from '../data/nepalGeography';
import {
  Sparkles,
  Building2,
  ShieldCheck,
  Award,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Plus,
  Trash2,
  FileCheck,
  Zap,
  Clock,
  HeartHandshake,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Eye,
} from 'lucide-react';

interface EventOrganizerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EventOrganizerRegistrationModal: React.FC<EventOrganizerRegistrationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language } = useLanguage();
  const { editingOrganizer, saveOrganizer, setSelectedOrganizer } = useMarketplace();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState<Partial<EventOrganizer>>({
    id: `org-${Date.now()}`,
    companyName: '',
    nepaliName: '',
    tagline: '',
    founderOrContact: '',
    email: '',
    phone: '',
    address: '',
    district: 'Kathmandu',
    province: 'Bagmati Province',
    panNumber: '',
    businessRegNumber: '',
    yearsOfExperience: 5,
    teamSize: 15,
    rating: 4.9,
    reviewCount: 1,
    verificationStatus: 'DOCUMENTS_SUBMITTED',
    specializations: ['WEDDING_PLANNING', 'STAGE_LIGHTING_AV', 'DECOR_AND_FLORAL'],
    successStandards: {
      hasPublicLiabilityInsurance: true,
      insurancePolicyNumber: '',
      hasEmergencyMedicalPlan: true,
      hasFireSafetyCertification: true,
      hasRunOfShowTimelineSystem: true,
      hasTechnicalRiderCapability: true,
      hasWasteManagementPlan: true,
      certifiedPlannersCount: 2,
    },
    startingPriceNpr: 85000,
    pricingModel: 'TURNKEY_FULL_PLANNING',
    portfolioMedia: [
      {
        id: `pm-${Date.now()}-1`,
        type: 'PHOTO',
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        title: 'Vedic Mandap & Floral Ceiling Installation',
        eventType: 'Bibaha Ceremony',
      },
      {
        id: `pm-${Date.now()}-2`,
        type: 'VIDEO',
        url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
        title: 'Run-of-Show Behind-the-Scenes Production Video',
        eventType: 'Wedding Reception',
      },
    ],
    preferredVenueTypes: ['Heritage Palaces', 'Banqueting Lawns', '5-Star Convention Halls'],
    externalManagementInsuranceDoc: 'Verified Corporate Third-Party Liability Cover',
    clientTestimonialsCount: 12,
    bio: '',
    websiteUrl: '',
  });

  // Media input temp state
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaType, setNewMediaType] = useState<'PHOTO' | 'VIDEO'>('PHOTO');
  const [newMediaEventType, setNewMediaEventType] = useState('Wedding / Celebration');

  useEffect(() => {
    if (editingOrganizer) {
      setFormData(editingOrganizer);
    } else {
      setFormData((prev) => ({
        ...prev,
        id: `org-${Date.now()}`,
        companyName: '',
        nepaliName: '',
        tagline: '',
        founderOrContact: '',
        email: '',
        phone: '',
        address: '',
        panNumber: '',
        businessRegNumber: '',
      }));
    }
  }, [editingOrganizer, isOpen]);

  if (!isOpen) return null;

  // Selected Province data
  const currentProvinceData = NEPAL_PROVINCES.find((p) => p.name === formData.province);
  const availableDistricts = currentProvinceData
    ? currentProvinceData.districts.map((d) => d.name)
    : ['Kathmandu', 'Lalitpur', 'Bhaktapur'];

  // Toggle specialization
  const toggleSpecialization = (spec: OrganizerSpecialization) => {
    const current = formData.specializations || [];
    if (current.includes(spec)) {
      setFormData({
        ...formData,
        specializations: current.filter((s) => s !== spec),
      });
    } else {
      setFormData({
        ...formData,
        specializations: [...current, spec],
      });
    }
  };

  // Toggle success standards
  const updateSuccessStandard = (key: keyof OrganizerSuccessStandard, value: any) => {
    setFormData((prev) => ({
      ...prev,
      successStandards: {
        ...(prev.successStandards as OrganizerSuccessStandard),
        [key]: value,
      },
    }));
  };

  // Add media item
  const handleAddMedia = () => {
    if (!newMediaUrl.trim()) return;
    const item = {
      id: `media-${Date.now()}`,
      type: newMediaType,
      url: newMediaUrl.trim(),
      title: newMediaTitle.trim() || (newMediaType === 'PHOTO' ? 'Event Showcase Photo' : 'Event Video Highlights'),
      eventType: newMediaEventType.trim() || 'Celebration',
    };
    setFormData((prev) => ({
      ...prev,
      portfolioMedia: [...(prev.portfolioMedia || []), item],
    }));
    setNewMediaUrl('');
    setNewMediaTitle('');
  };

  const handleRemoveMedia = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      portfolioMedia: (prev.portfolioMedia || []).filter((m) => m.id !== id),
    }));
  };

  // Save registration
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName) {
      alert(language === 'ne' ? 'कृपया कम्पनीको नाम भर्नुहोस्।' : 'Please enter the event organizer company name.');
      setActiveStep(1);
      return;
    }

    const fullOrganizer: EventOrganizer = {
      id: formData.id || `org-${Date.now()}`,
      companyName: formData.companyName,
      nepaliName: formData.nepaliName || formData.companyName,
      tagline: formData.tagline || 'Excellence in Event Design, Technical Production & Run-of-Show Management',
      founderOrContact: formData.founderOrContact || 'Lead Event Producer',
      email: formData.email || 'contact@eventpro.com.np',
      phone: formData.phone || '+977-9851000000',
      address: formData.address || 'Kathmandu, Nepal',
      district: formData.district || 'Kathmandu',
      province: formData.province || 'Bagmati Province',
      panNumber: formData.panNumber || '601928374',
      businessRegNumber: formData.businessRegNumber || 'REG-EVT-2081/01',
      yearsOfExperience: Number(formData.yearsOfExperience) || 5,
      teamSize: Number(formData.teamSize) || 12,
      rating: formData.rating || 4.9,
      reviewCount: formData.reviewCount || 1,
      verificationStatus: (formData.verificationStatus as any) || 'VERIFIED',
      specializations: formData.specializations?.length ? formData.specializations : ['WEDDING_PLANNING'],
      successStandards: formData.successStandards || {
        hasPublicLiabilityInsurance: true,
        hasEmergencyMedicalPlan: true,
        hasFireSafetyCertification: true,
        hasRunOfShowTimelineSystem: true,
        hasTechnicalRiderCapability: true,
        hasWasteManagementPlan: true,
        certifiedPlannersCount: 2,
      },
      startingPriceNpr: Number(formData.startingPriceNpr) || 75000,
      pricingModel: formData.pricingModel || 'TURNKEY_FULL_PLANNING',
      portfolioMedia: formData.portfolioMedia || [],
      preferredVenueTypes: formData.preferredVenueTypes || ['Heritage Palaces', 'Lawns'],
      externalManagementInsuranceDoc: formData.externalManagementInsuranceDoc || 'Verified Liability Insurance',
      clientTestimonialsCount: formData.clientTestimonialsCount || 10,
      bio: formData.bio || `${formData.companyName} is a verified professional event production company adhering to global standards in technical production, crowd safety, and timeline precision.`,
      websiteUrl: formData.websiteUrl,
    };

    saveOrganizer(fullOrganizer);
    setSaveSuccessMsg(true);

    setTimeout(() => {
      setSaveSuccessMsg(false);
      onClose();
      setSelectedOrganizer(fullOrganizer);
    }, 1500);
  };

  const steps = [
    { num: 1, title: language === 'ne' ? 'कम्पनी विवरण' : 'Company & Credentials', icon: Building2 },
    { num: 2, title: language === 'ne' ? 'विशेषज्ञता र मूल्य' : 'Services & Pricing', icon: Award },
    { num: 3, title: language === 'ne' ? 'अन्तर्राष्ट्रिय मापदण्ड' : 'Global Success Standards', icon: ShieldCheck },
    { num: 4, title: language === 'ne' ? 'पोर्टफोलियो फोटो/भिडियो' : 'Portfolio (Unlimited)', icon: ImageIcon },
    { num: 5, title: language === 'ne' ? 'पूर्वावलोकन र दर्ता' : 'Review & Publish', icon: Eye },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                {language === 'ne' ? 'इभेन्ट अर्गनाइजर तथा व्यवस्थापक दर्ता' : 'Event Organizer Global Registration Portal'}
              </span>
            </div>
            <h2 className="font-display text-xl font-bold mt-0.5">
              {editingOrganizer
                ? language === 'ne' ? 'अर्गनाइजर प्रोफाइल सम्पादन' : 'Edit Event Organizer Profile'
                : language === 'ne' ? 'नयाँ इभेन्ट अर्गनाइजर दर्ता गर्नुहोस्' : 'Register as a Professional Event Organizer'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation Bar */}
        <div className="bg-stone-100 border-b border-stone-200 px-4 py-2 flex items-center justify-between overflow-x-auto gap-2 shrink-0">
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = activeStep === s.num;
            const isCompleted = activeStep > s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setActiveStep(s.num)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-900 text-white shadow-xs'
                    : isCompleted
                    ? 'bg-amber-100/70 text-amber-950 hover:bg-amber-100'
                    : 'text-stone-600 hover:bg-stone-200/70'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isActive
                      ? 'bg-amber-400 text-amber-950'
                      : isCompleted
                      ? 'bg-amber-800 text-white'
                      : 'bg-stone-300 text-stone-700'
                  }`}
                >
                  {isCompleted ? '✓' : s.num}
                </span>
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* STEP 1: Company Credentials */}
            {activeStep === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-stone-200 pb-3">
                  <h3 className="font-display text-lg font-bold text-stone-900">
                    {language === 'ne' ? '१. व्यावसायिक पहिचान र दर्ता' : '1. Legal Business Identity & Authorized Credentials'}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {language === 'ne'
                      ? 'तपाईंको इभेन्ट म्यानेजमेन्ट कम्पनीको आधिकारिक प्यान/भ्याट, दर्ता तथा सम्पर्क विवरण।'
                      : 'Official company information, PAN/VAT, contact authority, and business credentials.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {language === 'ne' ? 'कम्पनीको आधिकारिक नाम *' : 'Company / Agency Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.companyName || ''}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g. Royal Heritage Event Management & Production"
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {language === 'ne' ? 'नेपाली नाम (Devanagari Name)' : 'Nepali Name in Devanagari'}
                    </label>
                    <input
                      type="text"
                      value={formData.nepaliName || ''}
                      onChange={(e) => setFormData({ ...formData, nepaliName: e.target.value })}
                      placeholder="उदा: रोयल हेरिटेज इभेन्ट म्यानेजमेन्ट"
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {language === 'ne' ? 'प्यान वा भ्याट नम्बर (९ अंक) *' : 'PAN / VAT Registration Number (9 digits) *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.panNumber || ''}
                      onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                      placeholder="e.g. 603918274"
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-mono focus:outline-none focus:ring-1 focus:ring-amber-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {language === 'ne' ? 'कम्पनी दर्ता नम्बर' : 'Company Registrar / DDC Permit No.'}
                    </label>
                    <input
                      type="text"
                      value={formData.businessRegNumber || ''}
                      onChange={(e) => setFormData({ ...formData, businessRegNumber: e.target.value })}
                      placeholder="e.g. REG-PROD-2078/042"
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-mono focus:outline-none focus:ring-1 focus:ring-amber-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {language === 'ne' ? 'संस्थापक वा मुख्य उत्पादक (Lead Producer)' : 'Founder / Lead Producer Name'}
                    </label>
                    <input
                      type="text"
                      value={formData.founderOrContact || ''}
                      onChange={(e) => setFormData({ ...formData, founderOrContact: e.target.value })}
                      placeholder="e.g. Prakash Shakya (Managing Director)"
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {language === 'ne' ? 'सम्पर्क फोन / मोबाइल' : 'Phone / Mobile (+977)'}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+977-9851012345"
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-mono focus:outline-none focus:ring-1 focus:ring-amber-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {language === 'ne' ? 'इमेल ठेगाना' : 'Official Email Address'}
                    </label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="events@company.com.np"
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {language === 'ne' ? 'वेबसाइट वा पोर्टफोलियो लिङ्क' : 'Website or Digital Portfolio Link'}
                    </label>
                    <input
                      type="url"
                      value={formData.websiteUrl || ''}
                      onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                      placeholder="https://youragency.com"
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {language === 'ne' ? 'प्रदेश (Province)' : 'Province'}
                    </label>
                    <select
                      value={formData.province}
                      onChange={(e) => {
                        const newProv = e.target.value;
                        const pData = NEPAL_PROVINCES.find((p) => p.name === newProv);
                        setFormData({
                          ...formData,
                          province: newProv,
                          district: pData && pData.districts.length > 0 ? pData.districts[0].name : formData.district,
                        });
                      }}
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                    >
                      {NEPAL_PROVINCES.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name} ({p.nepaliName})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {language === 'ne' ? 'जिल्ला (District)' : 'District'}
                    </label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                    >
                      {availableDistricts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {language === 'ne' ? 'ट्यागलाइन / मुख्य परिचय' : 'Signature Motto / Tagline'}
                    </label>
                    <input
                      type="text"
                      value={formData.tagline || ''}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      placeholder="e.g. Masterful Event Architecture, Vedic Rituals & Immersive Production"
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Services & Pricing */}
            {activeStep === 2 && (
              <div className="space-y-5 animate-in fade-in">
                <div className="border-b border-stone-200 pb-3">
                  <h3 className="font-display text-lg font-bold text-stone-900">
                    {language === 'ne' ? '२. सेवाहरू, विशेषज्ञता र मूल्य निर्धारण' : '2. Specializations, Scale & Pricing Structure'}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {language === 'ne'
                      ? 'तपाईंले प्रदान गर्ने मुख्य इभेन्ट सेवाहरू, अनुभव र सुरुवाती शुल्क चयन गर्नुहोस्।'
                      : 'Define event categories you excel at, your crew scale, and baseline fees.'}
                  </p>
                </div>

                {/* Specializations Grid */}
                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-2 uppercase tracking-wider">
                    {language === 'ne' ? 'विशेषज्ञता सेवाहरू (Select Specializations):' : 'Core Event Specializations:'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      {
                        key: 'WEDDING_PLANNING',
                        label: 'Complete Wedding Planning',
                        nepali: 'सम्पूर्ण विवाह व्यवस्थापन (Bibaha/Reception)',
                      },
                      {
                        key: 'STAGE_LIGHTING_AV',
                        label: 'Stage, Sound & AV Production',
                        nepali: 'स्टेज, लाइभ साउन्ड तथा एलइडी स्क्रिन',
                      },
                      {
                        key: 'DECOR_AND_FLORAL',
                        label: 'Floral & Thematic Decor',
                        nepali: 'फूल तथा मण्डप कलात्मक सजावट',
                      },
                      {
                        key: 'CORPORATE_SUMMIT',
                        label: 'Corporate Summits & AGMs',
                        nepali: 'कर्पोरेट भेला तथा सम्मेलन',
                      },
                      {
                        key: 'DESTINATION_MANAGEMENT',
                        label: 'Destination Celebrations',
                        nepali: 'डेस्टिनेसन वेडिङ (पोखरा, नगरकोट, चितवन)',
                      },
                      {
                        key: 'CULTURAL_AND_FESTIVAL',
                        label: 'Cultural Festivals & Jubilees',
                        nepali: 'सांस्कृतिक महोत्सव, पास्नी तथा ब्रतबन्ध',
                      },
                    ].map((item) => {
                      const isSelected = (formData.specializations || []).includes(item.key as any);
                      return (
                        <div
                          key={item.key}
                          onClick={() => toggleSpecialization(item.key as any)}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-amber-50 border-amber-800 ring-1 ring-amber-800 text-amber-950'
                              : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs">{item.label}</span>
                            <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                              isSelected ? 'bg-amber-900 border-amber-900 text-white' : 'border-stone-300'
                            }`}>
                              {isSelected ? '✓' : ''}
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-500 mt-1">{item.nepali}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pricing & Scale Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-stone-100">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {language === 'ne' ? 'सुरुवाती योजना शुल्क (NPR Starting Fee)' : 'Starting Management Fee (NPR)'}
                    </label>
                    <input
                      type="number"
                      step="5000"
                      value={formData.startingPriceNpr || 75000}
                      onChange={(e) => setFormData({ ...formData, startingPriceNpr: Number(e.target.value) })}
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-mono text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {language === 'ne' ? 'योजना मोडेल (Pricing Model)' : 'Primary Pricing Model'}
                    </label>
                    <select
                      value={formData.pricingModel || 'TURNKEY_FULL_PLANNING'}
                      onChange={(e) => setFormData({ ...formData, pricingModel: e.target.value as any })}
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                    >
                      <option value="TURNKEY_FULL_PLANNING">Turnkey Full Event Planning (A to Z)</option>
                      <option value="DAY_OF_COORDINATION">Day-of Coordination & Execution Only</option>
                      <option value="STYLING_AND_DESIGN">Styling, Floral & Decor Only</option>
                      <option value="CUSTOM_QUOTATION">Custom Tiered Quotation</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {language === 'ne' ? 'अनुभव (वर्ष)' : 'Years of Experience'}
                    </label>
                    <input
                      type="number"
                      value={formData.yearsOfExperience || 5}
                      onChange={(e) => setFormData({ ...formData, yearsOfExperience: Number(e.target.value) })}
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-mono text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {language === 'ne' ? 'टोलीको आकार (Full-time Crew)' : 'Dedicated Production Crew Size'}
                    </label>
                    <input
                      type="number"
                      value={formData.teamSize || 15}
                      onChange={(e) => setFormData({ ...formData, teamSize: Number(e.target.value) })}
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-mono text-stone-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {language === 'ne' ? 'संक्षिप्त विवरण (Bio / Summary)' : 'Company Summary & Client Value Proposition'}
                    </label>
                    <textarea
                      rows={2}
                      value={formData.bio || ''}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="e.g. Over 200+ successful celebrations organized with zero delays, stringent safety standards, and bespoke aesthetic designs."
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Global Event Success Standards */}
            {activeStep === 3 && (
              <div className="space-y-5 animate-in fade-in">
                <div className="border-b border-stone-200 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                    <h3 className="font-display text-lg font-bold text-stone-900">
                      {language === 'ne' ? '३. अन्तर्राष्ट्रिय इभेन्ट सफलता तथा जोखिम मापदण्ड' : '3. Global Event Success & Risk Management Compliance'}
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {language === 'ne'
                      ? 'अन्तर्राष्ट्रिय मापदण्ड (MPI, ILEA) अनुसार सफल उत्सवका लागि दायित्व बिमा, सुरक्षा योजना, र समय-तालिका व्यवस्थापन।'
                      : 'International standards mandated for event success: public liability insurance, run-of-show protocols, power loads, and emergency protocols.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Public Liability Insurance */}
                  <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        <span>Public Liability Insurance (PLI)</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={Boolean(formData.successStandards?.hasPublicLiabilityInsurance)}
                        onChange={(e) => updateSuccessStandard('hasPublicLiabilityInsurance', e.target.checked)}
                        className="rounded border-emerald-300 text-emerald-700 focus:ring-emerald-600"
                      />
                    </div>
                    <p className="text-[11px] text-emerald-900">
                      Mandatory under global standards to protect venue property and third-party guests against damages.
                    </p>
                    <div>
                      <label className="text-[11px] text-stone-600 block mb-1">Policy / Insurer Reference</label>
                      <input
                        type="text"
                        value={formData.successStandards?.insurancePolicyNumber || ''}
                        onChange={(e) => updateSuccessStandard('insurancePolicyNumber', e.target.value)}
                        placeholder="e.g. NLG Insurance PLI-2081/0984 (NPR 50 Lakh)"
                        className="w-full text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 font-mono"
                      />
                    </div>
                  </div>

                  {/* Run-of-Show Minute-by-Minute Master Schedule */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-800" />
                        <span>Run-of-Show Timeline Protocol</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={Boolean(formData.successStandards?.hasRunOfShowTimelineSystem)}
                        onChange={(e) => updateSuccessStandard('hasRunOfShowTimelineSystem', e.target.checked)}
                        className="rounded border-stone-300 text-amber-900 focus:ring-amber-800"
                      />
                    </div>
                    <p className="text-[11px] text-stone-600">
                      Minute-by-minute execution schedule with designated rehearsal times, artist cueing, and ritual sync.
                    </p>
                    <div className="text-[11px] text-amber-900 font-medium bg-amber-50 p-2 rounded-lg border border-amber-200">
                      ✓ Guarantees 0-delay transition from Muhurat to Dining Buffet
                    </div>
                  </div>

                  {/* Technical Rider & Electrical Load Management */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-amber-600" />
                        <span>Technical Rider & Power Engineering</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={Boolean(formData.successStandards?.hasTechnicalRiderCapability)}
                        onChange={(e) => updateSuccessStandard('hasTechnicalRiderCapability', e.target.checked)}
                        className="rounded border-stone-300 text-amber-900 focus:ring-amber-800"
                      />
                    </div>
                    <p className="text-[11px] text-stone-600">
                      Single-line electrical diagram submitted to venue for generator load calculation and acoustic dB limit compliance.
                    </p>
                  </div>

                  {/* Emergency, Fire & Crowd Safety Protocol */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-red-600" />
                        <span>Fire Safety & Emergency Medical Station</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={Boolean(formData.successStandards?.hasFireSafetyCertification)}
                        onChange={(e) => updateSuccessStandard('hasFireSafetyCertification', e.target.checked)}
                        className="rounded border-stone-300 text-amber-900 focus:ring-amber-800"
                      />
                    </div>
                    <p className="text-[11px] text-stone-600">
                      Flame-retardant fabric certification for mandap, marked emergency exits, and on-site first-aid kit station.
                    </p>
                  </div>

                  {/* Waste Management & Sustainability */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                        <HeartHandshake className="w-4 h-4 text-emerald-700" />
                        <span>Waste Management & Environmental Sustainability Policy</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={Boolean(formData.successStandards?.hasWasteManagementPlan)}
                        onChange={(e) => updateSuccessStandard('hasWasteManagementPlan', e.target.checked)}
                        className="rounded border-stone-300 text-emerald-700 focus:ring-emerald-700"
                      />
                    </div>
                    <p className="text-[11px] text-stone-600">
                      Post-event organic floral composting, waste segregation (wet vs dry), and zero single-use plastic options.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Portfolio Media (Unlimited Photos & Videos) */}
            {activeStep === 4 && (
              <div className="space-y-5 animate-in fade-in">
                <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-stone-900">
                      {language === 'ne' ? '४. पोर्टफोलियो फोटो तथा भिडियो (असीमित)' : '4. Event Portfolio Media (Unlimited Photos & Videos)'}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {language === 'ne'
                        ? 'तपाईंले सम्पन्न गरेका कार्यक्रमहरूको तस्बिर र भिडियो लिङ्क थप्नुहोस् (युट्युब, भिमिओ, एमपी४)।'
                        : 'Showcase your real setups, stage décor, lighting, and video highlight reels without quantity limits.'}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full">
                    {(formData.portfolioMedia || []).length} Items Added
                  </span>
                </div>

                {/* Add New Media Form */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <span className="text-xs font-bold text-stone-800 block">
                    {language === 'ne' ? '+ नयाँ मिडिया थप्नुहोस्:' : '+ Add New Media Item (Photo or Video URL):'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] text-stone-500 block mb-1">Media Type</label>
                      <select
                        value={newMediaType}
                        onChange={(e) => setNewMediaType(e.target.value as any)}
                        className="w-full text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1.5"
                      >
                        <option value="PHOTO">Photo (Image URL)</option>
                        <option value="VIDEO">Video (YouTube / Vimeo / MP4)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[11px] text-stone-500 block mb-1">Direct Media URL</label>
                      <input
                        type="url"
                        value={newMediaUrl}
                        onChange={(e) => setNewMediaUrl(e.target.value)}
                        placeholder={
                          newMediaType === 'PHOTO'
                            ? 'https://images.unsplash.com/photo-...'
                            : 'https://www.youtube.com/watch?v=...'
                        }
                        className="w-full text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-stone-500 block mb-1">Event Type</label>
                      <input
                        type="text"
                        value={newMediaEventType}
                        onChange={(e) => setNewMediaEventType(e.target.value)}
                        placeholder="e.g. Wedding Reception"
                        className="w-full text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1.5"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="text-[11px] text-stone-500 block mb-1">Caption / Title</label>
                      <input
                        type="text"
                        value={newMediaTitle}
                        onChange={(e) => setNewMediaTitle(e.target.value)}
                        placeholder="e.g. 500-Pax Regal Mandap with Custom Floral Chandelier"
                        className="w-full text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1.5"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleAddMedia}
                        className="w-full py-1.5 bg-amber-900 hover:bg-amber-950 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Media</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Media Grid Showcase */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-stone-700 block">
                    Current Portfolio Items ({(formData.portfolioMedia || []).length}):
                  </span>
                  {(formData.portfolioMedia || []).length === 0 ? (
                    <div className="text-center py-6 text-stone-400 text-xs border border-dashed border-stone-200 rounded-xl">
                      No media added yet. You can also upload photos and videos later anytime.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {(formData.portfolioMedia || []).map((m) => (
                        <div key={m.id} className="p-3 bg-white rounded-2xl border border-stone-200 relative group shadow-2xs">
                          <button
                            type="button"
                            onClick={() => handleRemoveMedia(m.id)}
                            className="absolute top-2 right-2 p-1 rounded-full bg-stone-900/70 hover:bg-red-700 text-white transition-colors z-10"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <div className="h-28 rounded-xl bg-stone-100 overflow-hidden relative mb-2">
                            {m.type === 'PHOTO' ? (
                              <img src={m.url} alt={m.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900 text-white p-2 text-center">
                                <Video className="w-6 h-6 text-amber-400 mb-1" />
                                <span className="text-[10px] text-stone-300 font-mono truncate max-w-full">
                                  {m.url}
                                </span>
                              </div>
                            )}
                            <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-stone-900/80 text-white uppercase">
                              {m.type}
                            </span>
                          </div>

                          <div className="text-xs font-semibold text-stone-900 line-clamp-1">{m.title}</div>
                          <div className="text-[10px] text-stone-500">{m.eventType}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 5: Review & Publish */}
            {activeStep === 5 && (
              <div className="space-y-5 animate-in fade-in">
                <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-stone-900">
                      {language === 'ne' ? '५. पूर्वावलोकन तथा दर्ता प्रमाणीकरण' : '5. Review Profile & Publish Registration'}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {language === 'ne'
                        ? 'तपाईंको प्रोफाइल भेन्यु सञ्चालक तथा ग्राहकहरूलाई कसरी देखिन्छ पूर्वावलोकन गर्नुहोस्।'
                        : 'Review how your verified organizer profile appears to clients and partner venues.'}
                    </p>
                  </div>
                </div>

                {/* Organizer Card Preview */}
                <div className="max-w-md mx-auto bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-lg p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-amber-800 font-semibold mb-1">
                        <Award className="w-3.5 h-3.5 text-amber-700" />
                        <span>Verified Event Management Agency</span>
                      </div>
                      <h4 className="font-display text-lg font-bold text-stone-900">
                        {formData.companyName || 'Your Agency Name'}
                      </h4>
                      <p className="text-xs text-stone-500">{formData.address || formData.district}, {formData.province}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                      VERIFIED
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 italic">
                    "{formData.tagline || 'Excellence in production and run-of-show scheduling'}"
                  </p>

                  {/* Standards Badges */}
                  <div className="flex flex-wrap gap-1.5 text-[10px]">
                    {formData.successStandards?.hasPublicLiabilityInsurance && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-700" />
                        <span>Liability Insured</span>
                      </span>
                    )}
                    {formData.successStandards?.hasRunOfShowTimelineSystem && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 font-semibold border border-amber-200 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-700" />
                        <span>Run-of-Show Protocol</span>
                      </span>
                    )}
                    {formData.successStandards?.hasTechnicalRiderCapability && (
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-semibold border border-blue-200 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-blue-700" />
                        <span>Technical AV Rider</span>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-stone-100 text-xs">
                    <div>
                      <span className="text-[10px] text-stone-400 block">Starting Fee</span>
                      <span className="font-bold text-amber-950 tabular-nums">
                        NPR {(formData.startingPriceNpr || 75000).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block">Experience & Crew</span>
                      <span className="font-semibold text-stone-800 tabular-nums">
                        {formData.yearsOfExperience || 5}+ yrs · {formData.teamSize || 15} crew
                      </span>
                    </div>
                  </div>
                </div>

                {/* Save Feedback */}
                {saveSuccessMsg && (
                  <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>
                      {language === 'ne'
                        ? 'इभेन्ट अर्गनाइजर प्रोफाइल सफलतापूर्वक दर्ता भयो! UTSAVO नेटवर्कमा सक्रिय गरिँदैछ...'
                        : 'Event Organizer registered successfully! Publishing to UTSAVO global directory...'}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-between shrink-0">
              {activeStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{language === 'ne' ? 'पछाडि' : 'Back'}</span>
                </button>
              ) : (
                <div />
              )}

              {activeStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="px-5 py-2 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-950 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>{language === 'ne' ? 'अर्को चरण' : 'Next Step'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl flex items-center gap-2 transition-colors shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {editingOrganizer
                      ? language === 'ne' ? 'परिवर्तन सुरक्षित गर्नुहोस्' : 'Update & Save Profile'
                      : language === 'ne' ? 'इभेन्ट अर्गनाइजर दर्ता सम्पन्न गर्नुहोस्' : 'Complete Registration & Publish Live'}
                  </span>
                </button>
              )}
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
