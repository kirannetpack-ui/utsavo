/**
 * UTSAVO - Venue Operator Onboarding & Listing Management Wizard
 * Section 5: Self-service registration, multi-hall configuration, legal PAN/VAT,
 * catering packages, operating policies, verification workflow, and live preview.
 */

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { CateringPackage, HallSpace, Venue, VerificationStatus } from '../types';
import { NEPAL_PROVINCES } from '../data/nepalGeography';
import { VenueImageVisual } from './VenueImageVisual';
import { NepalDistrictSelector, NepalProvinceSelector } from './NepalLocationSelector';
import {
  Building2,
  MapPin,
  FileText,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  X,
  Plus,
  Trash2,
  Car,
  Zap,
  Flame,
  Music,
  Users,
  Eye,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  UploadCloud,
  Check,
} from 'lucide-react';

interface VenueOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VenueOnboardingModal: React.FC<VenueOnboardingModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const { editingVenue, saveVenueListing, setSelectedVenue } = useMarketplace();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Venue>>({
    id: `venue-${Date.now()}`,
    name: '',
    nepaliName: '',
    tagline: '',
    province: 'Bagmati Province',
    district: 'Kathmandu',
    municipality: 'Kathmandu Metropolitan City',
    ward: 3,
    locality: '',
    address: '',
    mapCoordinates: { lat: 27.7172, lng: 85.324 },
    coverImage: 'REGAL_BALLROOM',
    gallery: ['REGAL_BALLROOM', 'HERITAGE_NEWARI', 'OPEN_LAWN'],
    verificationStatus: 'DOCUMENTS_SUBMITTED',
    panNumber: '',
    businessRegNumber: '',
    contactPerson: '',
    phone: '',
    email: '',
    rating: 4.8,
    reviewCount: 1,
    responseRatePercent: 98,
    halls: [
      {
        id: `hall-${Date.now()}-1`,
        name: 'Grand Main Ballroom',
        nepaliName: 'मुख्य भव्य सभा हल',
        type: 'INDOOR_HALL',
        minCapacity: 150,
        maxCapacity: 800,
        minGuestGuarantee: 200,
        areaSqFt: 6500,
        baseRentalNpr: 60000,
        features: ['Full Central AC', 'Acoustic Sound System', 'Bridal Dressing Room', 'Stage & Ambient Lighting'],
        photoUrl: '',
      },
    ],
    parkingCapacityCars: 80,
    parkingCapacityBikes: 200,
    hasPowerBackup: true,
    hasWheelchairAccess: true,
    hasMandapSetup: true,
    hasLiveMusicPermit: true,
    hasVipLounge: true,
    minGuests: 150,
    maxGuests: 800,
    baseRentalStartingNpr: 60000,
    cateringStartingNpr: 1650,
    packages: [
      {
        id: 'pkg-silver',
        name: 'Silver Celebration Buffet',
        nepaliName: 'सिल्भर उत्सव भोज',
        pricePerPlateNpr: 1500,
        description: 'Standard 24-dish traditional celebration menu with welcome juice and dessert.',
        includedCounts: {
          welcomeDrinks: 1,
          vegStarters: 2,
          nonVegStarters: 2,
          traditionalNepali: 1,
          mainCourses: 3,
          riceAndBreads: 2,
          liveCounters: 1,
          desserts: 2,
        },
        sampleItems: ['Mixed Fruit Punch', 'Paneer Tikka', 'Chicken Sekuwa', 'Traditional Dal Bhat', 'Mutton Curry', 'Gulab Jamun'],
      },
      {
        id: 'pkg-gold',
        name: 'Royal Heritage Feast',
        nepaliName: 'रोयल हेरिटेज भोज',
        pricePerPlateNpr: 1950,
        description: 'Premium banquet menu with live barbecue, goat curry, and choice of 4 starters.',
        includedCounts: {
          welcomeDrinks: 2,
          vegStarters: 3,
          nonVegStarters: 3,
          traditionalNepali: 2,
          mainCourses: 4,
          riceAndBreads: 2,
          liveCounters: 2,
          desserts: 3,
        },
        sampleItems: ['Virgin Mojito', 'Fish Fry', 'Chicken Choila', 'Khasi ko Masu', 'Paneer Butter Masala', 'Live Jalebi Rabri'],
      },
    ],
    availableMenuItems: [],
    cancellationPolicy: 'Full deposit refund if cancelled at least 30 days prior to event. 50% deposit retention within 14-29 days. Flexible date rescheduling with zero penalty.',
    decorationPolicy: 'Outside florists and custom stage decorators permitted. Traditional Vedic Hom/Havan mandap allowed with safety supervision. Confetti and sparklers allowed in designated zones.',
    mediaGallery: [
      {
        id: `med-${Date.now()}-1`,
        type: 'PHOTO',
        url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
        title: 'Grand Ballroom Interior',
        category: 'BALLROOM',
        isCover: true,
      },
    ],
    eventManagementPolicy: {
      policyType: 'HYBRID_BOTH',
      allowsOutsideOrganizers: true,
      inHouseServicesDescription: 'Full in-house banquet hospitality, Vedic mandap team & acoustic system available. Also welcoming certified external wedding planners & event organizers.',
      outsideOrganizerFeeNpr: 10000,
      outsideOrganizerGuidelines: 'Outside event organizers must submit production plan and single-line electrical diagram 7 days prior.',
      soundCurfewTime: '10:30 PM',
      powerLoadCapacityKw: 60,
      refundableSecurityDepositNpr: 20000,
    },
  });

  // Populate if editing existing venue
  useEffect(() => {
    if (editingVenue) {
      setFormData(editingVenue);
    } else {
      // Default template for new venue
      setFormData((prev) => ({
        ...prev,
        id: `venue-${Date.now()}`,
        name: '',
        nepaliName: '',
        tagline: '',
        panNumber: '',
        businessRegNumber: '',
        contactPerson: '',
        phone: '',
        email: '',
      }));
    }
  }, [editingVenue]);

  if (!isOpen) return null;

  // Selected Province and available districts
  const currentProvinceData = NEPAL_PROVINCES.find((p) => p.name === formData.province);
  const availableDistricts = currentProvinceData ? currentProvinceData.districts : [];

  // Hall manipulation
  const addHall = () => {
    const newHall: HallSpace = {
      id: `hall-${Date.now()}-${(formData.halls || []).length + 1}`,
      name: `New Hall ${(formData.halls || []).length + 1}`,
      nepaliName: `नयाँ हल ${(formData.halls || []).length + 1}`,
      type: 'INDOOR_HALL',
      minCapacity: 100,
      maxCapacity: 400,
      minGuestGuarantee: 120,
      areaSqFt: 3500,
      baseRentalNpr: 45000,
      features: ['Acoustic System', 'Air Conditioned', 'Stage Lights'],
      photoUrl: '',
    };
    setFormData((prev) => ({
      ...prev,
      halls: [...(prev.halls || []), newHall],
    }));
  };

  const removeHall = (hallId: string) => {
    setFormData((prev) => ({
      ...prev,
      halls: (prev.halls || []).filter((h) => h.id !== hallId),
    }));
  };

  const updateHallField = (hallId: string, field: keyof HallSpace, value: any) => {
    setFormData((prev) => ({
      ...prev,
      halls: (prev.halls || []).map((h) => (h.id === hallId ? { ...h, [field]: value } : h)),
    }));
  };

  // Device file upload for onboarding photos & videos
  const handleOnboardingFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const isVid = file.type.startsWith('video');
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const newMedia = {
          id: `med-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          type: isVid ? ('VIDEO' as const) : ('PHOTO' as const),
          url: result,
          title: file.name.replace(/\.[^/.]+$/, ''),
          category: 'BALLROOM' as const,
          isCover: (formData.mediaGallery || []).length === 0,
        };
        setFormData((prev) => ({
          ...prev,
          mediaGallery: [...(prev.mediaGallery || []), newMedia],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  // Save venue to marketplace context
  const handleSaveVenue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert(language === 'ne' ? 'कृपया भेन्युको नाम भर्नुहोस्।' : 'Please provide the venue name.');
      setActiveStep(1);
      return;
    }

    const calculatedMinGuests = Math.min(...(formData.halls || []).map((h) => h.minCapacity), 50);
    const calculatedMaxGuests = (formData.halls || []).reduce((sum, h) => sum + h.maxCapacity, 0) || 500;

    const fullVenue: Venue = {
      id: formData.id || `venue-${Date.now()}`,
      name: formData.name || 'Kathmandu Celebration Palace',
      nepaliName: formData.nepaliName || formData.name || 'काठमाडौँ सेलिब्रेसन प्यालेस',
      tagline: formData.tagline || 'Grand Celebration & Cultural Banqueting',
      province: formData.province || 'Bagmati Province',
      district: formData.district || 'Kathmandu',
      municipality: formData.municipality || 'Kathmandu Metropolitan City',
      ward: formData.ward || 3,
      locality: formData.locality || 'Baluwatar',
      address: formData.address || `${formData.locality || 'Baluwatar'}, ${formData.district || 'Kathmandu'}`,
      mapCoordinates: formData.mapCoordinates || { lat: 27.7172, lng: 85.324 },
      coverImage: formData.coverImage || 'REGAL_BALLROOM',
      gallery: formData.gallery || ['REGAL_BALLROOM', 'HERITAGE_NEWARI', 'OPEN_LAWN'],
      verificationStatus: (formData.verificationStatus as VerificationStatus) || 'VERIFIED',
      panNumber: formData.panNumber || '601928471',
      businessRegNumber: formData.businessRegNumber || 'REG-PALACE-2080',
      contactPerson: formData.contactPerson || 'General Manager',
      phone: formData.phone || '+977-9851000000',
      email: formData.email || 'info@partyplace.com.np',
      rating: formData.rating || 4.8,
      reviewCount: formData.reviewCount || 1,
      responseRatePercent: formData.responseRatePercent || 98,
      halls: formData.halls || [],
      parkingCapacityCars: Number(formData.parkingCapacityCars) || 50,
      parkingCapacityBikes: Number(formData.parkingCapacityBikes) || 150,
      hasPowerBackup: Boolean(formData.hasPowerBackup),
      hasWheelchairAccess: Boolean(formData.hasWheelchairAccess),
      hasMandapSetup: Boolean(formData.hasMandapSetup),
      hasLiveMusicPermit: Boolean(formData.hasLiveMusicPermit),
      hasVipLounge: Boolean(formData.hasVipLounge),
      minGuests: calculatedMinGuests,
      maxGuests: calculatedMaxGuests,
      baseRentalStartingNpr: Number(formData.baseRentalStartingNpr) || 50000,
      cateringStartingNpr: Number(formData.cateringStartingNpr) || 1500,
      packages: formData.packages || [],
      availableMenuItems: formData.availableMenuItems || [],
      cancellationPolicy: formData.cancellationPolicy || 'Standard 30-day cancellation refund.',
      decorationPolicy: formData.decorationPolicy || 'Outside florists permitted.',
      mediaGallery: formData.mediaGallery || [
        {
          id: `med-${Date.now()}-1`,
          type: 'PHOTO',
          url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
          title: 'Grand Ballroom Interior',
          category: 'BALLROOM',
          isCover: true,
        },
      ],
      eventManagementPolicy: formData.eventManagementPolicy || {
        policyType: 'HYBRID_BOTH',
        allowsOutsideOrganizers: true,
        inHouseServicesDescription: 'Full in-house banquet hospitality, Vedic mandap team & acoustic system available. Also welcoming certified external wedding planners & event organizers.',
        outsideOrganizerFeeNpr: 10000,
        outsideOrganizerGuidelines: 'Outside event organizers must submit production plan and single-line electrical diagram 7 days prior.',
        soundCurfewTime: '10:30 PM',
        powerLoadCapacityKw: 60,
        refundableSecurityDepositNpr: 20000,
      },
    };

    saveVenueListing(fullVenue);
    setSaveSuccessMsg(true);
    setTimeout(() => {
      setSaveSuccessMsg(false);
      onClose();
      setSelectedVenue(fullVenue);
    }, 1800);
  };

  const steps = [
    { num: 1, title: language === 'ne' ? 'पहिचान र दर्ता' : 'Identity & Registration', icon: Building2 },
    { num: 2, title: language === 'ne' ? 'स्थान र नक्सा' : 'Location & Maps', icon: MapPin },
    { num: 3, title: language === 'ne' ? 'हल र क्षमता' : 'Halls & Spaces', icon: Users },
    { num: 4, title: language === 'ne' ? 'सुविधा तथा पूर्वाधार' : 'Amenities & Power', icon: Zap },
    { num: 5, title: language === 'ne' ? 'मेनु, मिडिया र नीति' : 'Menu, Media & Policies', icon: DollarSign },
    { num: 6, title: language === 'ne' ? 'पूर्वावलोकन र प्रकाशन' : 'Preview & Publish', icon: Eye },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                {language === 'ne' ? 'पार्टी प्यालेस तथा भेन्यु सञ्चालक पोर्टल' : 'Venue Operator Self-Service Portal'}
              </span>
            </div>
            <h2 className="font-display text-xl font-bold mt-0.5">
              {editingVenue
                ? language === 'ne' ? 'भेन्यु विवरण सम्पादन गर्नुहोस्' : 'Edit Venue Profile & Halls'
                : language === 'ne' ? 'नयाँ पार्टी प्यालेस / भेन्यु दर्ता गर्नुहोस्' : 'Register New Party Palace / Celebration Venue'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation Pill Bar */}
        <div className="bg-stone-100 border-b border-stone-200 px-4 py-2.5 flex items-center justify-between overflow-x-auto gap-2 shrink-0">
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
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isActive ? 'bg-amber-400 text-amber-950' : isCompleted ? 'bg-amber-800 text-white' : 'bg-stone-300 text-stone-700'
                }`}>
                  {isCompleted ? '✓' : s.num}
                </span>
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Main Step Content Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSaveVenue}>
            
            {/* STEP 1: Business Identity & Registration */}
            {activeStep === 1 && (
              <div className="space-y-5 animate-in fade-in">
                <div className="border-b border-stone-200 pb-3">
                  <h3 className="font-display text-lg font-bold text-stone-900">
                    {language === 'ne' ? '१. कानुनी तथा व्यावसायिक पहिचान' : '1. Legal Business Identity & Authorized Details'}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {language === 'ne'
                      ? 'तपाईंको व्यवसायको आधिकारिक नाम, प्यान/भ्याट, र दर्ता नम्बर प्रविष्ट गर्नुहोस्।'
                      : 'Provide your verified business name, PAN/VAT, and municipal registration credentials.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {language === 'ne' ? 'भेन्युको प्रदर्शन नाम (Display Name) *' : 'Venue Public Display Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. The Heritage Grand Pavilion & Banquet"
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
                      placeholder="उदा: द हेरिटेज ग्रान्ड प्याभिलियन"
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {language === 'ne' ? 'प्यान वा भ्याट नम्बर (PAN/VAT 9-digits) *' : 'PAN / VAT Registration Number (9 digits) *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.panNumber || ''}
                      onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                      placeholder="e.g. 601928471"
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-mono focus:outline-none focus:ring-1 focus:ring-amber-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {language === 'ne' ? 'कम्पनी वा वडा दर्ता नम्बर' : 'Company / Municipal Registration No.'}
                    </label>
                    <input
                      type="text"
                      value={formData.businessRegNumber || ''}
                      onChange={(e) => setFormData({ ...formData, businessRegNumber: e.target.value })}
                      placeholder="e.g. REG-KTM-2079/0421"
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-mono focus:outline-none focus:ring-1 focus:ring-amber-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {language === 'ne' ? 'आधिकारिक सम्पर्क व्यक्ति' : 'Authorized Contact Person'}
                    </label>
                    <input
                      type="text"
                      value={formData.contactPerson || ''}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="e.g. Suresh Shrestha (General Manager)"
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {language === 'ne' ? 'सम्पर्क फोन / मोबाइल (+९७७)' : 'Phone / Mobile (+977)'}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+977-9851098421"
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-mono focus:outline-none focus:ring-1 focus:ring-amber-800"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {language === 'ne' ? 'ट्यागलाइन / स्लोगन (Tagline)' : 'Venue Tagline / Signature Motto'}
                    </label>
                    <input
                      type="text"
                      value={formData.tagline || ''}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      placeholder="e.g. Palatial Elegance, Vedic Traditions, and Exquisite Celebrations in the Heart of the Valley"
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Location & Geographic Coordinates */}
            {activeStep === 2 && (
              <div className="space-y-5 animate-in fade-in">
                <div className="border-b border-stone-200 pb-3">
                  <h3 className="font-display text-lg font-bold text-stone-900">
                    {language === 'ne' ? '२. भौगोलिक स्थान र नक्सा विवरण' : '2. Geographic Master Location & Coordinates'}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {language === 'ne'
                      ? 'नेपालको ७ प्रदेश र ७७ जिल्ला अन्तर्गत तपाईंको पार्टी प्यालेसको सही ठेगाना र नक्सा।'
                      : 'Accurate geographic hierarchy across Nepal with dependent district selector and GPS coordinates.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <NepalProvinceSelector
                      label={language === 'ne' ? 'प्रदेश (Province) *' : 'Province *'}
                      value={formData.province || 'Bagmati Province'}
                      onChange={(newProv) => {
                        setFormData({
                          ...formData,
                          province: newProv,
                        });
                      }}
                      placeholder="Type or select province..."
                      required
                    />
                  </div>

                  <div>
                    <NepalDistrictSelector
                      label={language === 'ne' ? 'जिल्ला (District) *' : 'District *'}
                      value={formData.district || ''}
                      selectedProvince={formData.province}
                      onChange={(dist, prov) => {
                        setFormData({
                          ...formData,
                          district: dist,
                          ...(prov && !formData.province ? { province: prov } : {}),
                        });
                      }}
                      placeholder="Type or pick from 77 districts..."
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {language === 'ne' ? 'नगरपालिका / गाउँपालिका' : 'Municipality / Rural Municipality'}
                    </label>
                    <input
                      type="text"
                      value={formData.municipality || ''}
                      onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                      placeholder="e.g. Kathmandu Metropolitan City"
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {language === 'ne' ? 'वडा नम्बर (Ward No.)' : 'Ward Number'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="35"
                      value={formData.ward || 3}
                      onChange={(e) => setFormData({ ...formData, ward: Number(e.target.value) })}
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {language === 'ne' ? 'टोल / इलाका (Locality / Tole)' : 'Locality / Neighborhood'}
                    </label>
                    <input
                      type="text"
                      value={formData.locality || ''}
                      onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                      placeholder="e.g. Baluwatar / Sanepa / Lakeside"
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {language === 'ne' ? 'सडक ठेगाना (Street Address)' : 'Full Street Address'}
                    </label>
                    <input
                      type="text"
                      value={formData.address || ''}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g. Ring Road, Near Bhatbhateni"
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                    />
                  </div>
                </div>

                {/* GPS Coordinates Preview */}
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-800" />
                      <span>{language === 'ne' ? 'गुगल म्याप्स अक्षांश र देशान्तर' : 'Google Maps GPS Coordinates'}</span>
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Lat: {formData.mapCoordinates?.lat.toFixed(4)}, Lng: {formData.mapCoordinates?.lng.toFixed(4)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-stone-500 block mb-1">Latitude</span>
                      <input
                        type="number"
                        step="0.0001"
                        value={formData.mapCoordinates?.lat || 27.7172}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mapCoordinates: {
                              lat: parseFloat(e.target.value),
                              lng: formData.mapCoordinates?.lng || 85.324,
                            },
                          })
                        }
                        className="w-full text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 block mb-1">Longitude</span>
                      <input
                        type="number"
                        step="0.0001"
                        value={formData.mapCoordinates?.lng || 85.324}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mapCoordinates: {
                              lat: formData.mapCoordinates?.lat || 27.7172,
                              lng: parseFloat(e.target.value),
                            },
                          })
                        }
                        className="w-full text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Multiple Halls & Inventory */}
            {activeStep === 3 && (
              <div className="space-y-5 animate-in fade-in">
                <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-stone-900">
                      {language === 'ne' ? '३. हल, लन र शाखा व्यवस्थापन' : '3. Multiple Halls, Lawns & Spaces'}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {language === 'ne'
                        ? 'तपाईंको पार्टी प्यालेसमा भएका विभिन्न हलहरू, बगैंचा (Lawn), वा रुफटप थप्नुहोस्।'
                        : 'Configure each distinct hall space, capacity limits, base rentals, and scheduling constraints.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addHall}
                    className="px-3 py-1.5 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{language === 'ne' ? 'थप हल थप्नुहोस्' : 'Add Another Hall'}</span>
                  </button>
                </div>

                {/* Halls List */}
                <div className="space-y-4">
                  {(formData.halls || []).map((hall, idx) => (
                    <div key={hall.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 relative">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-200">
                        <span className="text-xs font-bold text-amber-950">
                          {language === 'ne' ? `हल #${idx + 1}` : `Space #${idx + 1}`}: {hall.name}
                        </span>
                        {(formData.halls || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeHall(hall.id)}
                            className="text-stone-400 hover:text-red-700 text-xs flex items-center gap-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{language === 'ne' ? 'हटाउनुहोस्' : 'Remove'}</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-stone-600 block mb-1">Hall Name</label>
                          <input
                            type="text"
                            value={hall.name}
                            onChange={(e) => updateHallField(hall.id, 'name', e.target.value)}
                            className="w-full text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1.5"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-stone-600 block mb-1">Space Type</label>
                          <select
                            value={hall.type}
                            onChange={(e) => updateHallField(hall.id, 'type', e.target.value)}
                            className="w-full text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1.5"
                          >
                            <option value="INDOOR_HALL">Indoor Banquet Hall</option>
                            <option value="GARDEN_LAWN">Open Garden Lawn</option>
                            <option value="ROOFTOP">Rooftop Pavilion</option>
                            <option value="POOLSIDE">Poolside Deck</option>
                            <option value="DINING_PAVILION">Dining Pavilion</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-stone-600 block mb-1">Base Rental (NPR)</label>
                          <input
                            type="number"
                            step="5000"
                            value={hall.baseRentalNpr}
                            onChange={(e) => updateHallField(hall.id, 'baseRentalNpr', Number(e.target.value))}
                            className="w-full text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-stone-600 block mb-1">Min Capacity (Guests)</label>
                          <input
                            type="number"
                            value={hall.minCapacity}
                            onChange={(e) => updateHallField(hall.id, 'minCapacity', Number(e.target.value))}
                            className="w-full text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-stone-600 block mb-1">Max Capacity (Guests)</label>
                          <input
                            type="number"
                            value={hall.maxCapacity}
                            onChange={(e) => updateHallField(hall.id, 'maxCapacity', Number(e.target.value))}
                            className="w-full text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-stone-600 block mb-1">Area (Sq Feet)</label>
                          <input
                            type="number"
                            value={hall.areaSqFt}
                            onChange={(e) => updateHallField(hall.id, 'areaSqFt', Number(e.target.value))}
                            className="w-full text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: Facilities, Parking & Infrastructure */}
            {activeStep === 4 && (
              <div className="space-y-5 animate-in fade-in">
                <div className="border-b border-stone-200 pb-3">
                  <h3 className="font-display text-lg font-bold text-stone-900">
                    {language === 'ne' ? '४. सुविधा, पार्किङ र पूर्वाधार' : '4. Amenities, Power Backup & Parking Infrastructure'}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {language === 'ne'
                      ? 'जेनेरेटर ब्याकअप, वैदिक मण्डप होम अनुमति, र पार्किङ क्षमता प्रमाणित गर्नुहोस्।'
                      : 'Showcase your real physical amenities, power generators, fire safety, and accessibility features.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Parking Details */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                    <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-amber-800" />
                      <span>{language === 'ne' ? 'पार्किङ क्षमता' : 'Dedicated Parking Capacity'}</span>
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-stone-500 block mb-1">Car Spaces</label>
                        <input
                          type="number"
                          value={formData.parkingCapacityCars || 0}
                          onChange={(e) => setFormData({ ...formData, parkingCapacityCars: Number(e.target.value) })}
                          className="w-full text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-stone-500 block mb-1">Bike / Motorcycle</label>
                        <input
                          type="number"
                          value={formData.parkingCapacityBikes || 0}
                          onChange={(e) => setFormData({ ...formData, parkingCapacityBikes: Number(e.target.value) })}
                          className="w-full text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Visual Style Preset */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                    <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                      <span>{language === 'ne' ? 'भेन्युको सजावट शैली' : 'Venue Ambiance Style'}</span>
                    </span>
                    <div>
                      <label className="text-[11px] text-stone-500 block mb-1">Select Visual Preset</label>
                      <select
                        value={formData.coverImage || 'REGAL_BALLROOM'}
                        onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                        className="w-full text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1.5"
                      >
                        <option value="REGAL_BALLROOM">Palatial Luxury Ballroom (शाही सभा हल)</option>
                        <option value="HERITAGE_NEWARI">Newari Heritage Courtyard (परम्परागत नेवारी शैली)</option>
                        <option value="OPEN_LAWN">Sprawling Botanical Garden Lawn (हरियाली बगैंचा)</option>
                        <option value="MODERN_MINIMAL">Contemporary Modern Pavilion (आधुनिक मिनिमलिस्ट)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Amenity Checklist Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    {
                      key: 'hasPowerBackup',
                      title: '100% Genset Power Backup',
                      nepali: '१००% जेनेरेटर ब्याकअप',
                      icon: Zap,
                    },
                    {
                      key: 'hasMandapSetup',
                      title: 'Vedic Mandap & Homa Sacred Fire',
                      nepali: 'वैदिक मण्डप तथा होम अनुमति',
                      icon: Flame,
                    },
                    {
                      key: 'hasWheelchairAccess',
                      title: 'Wheelchair / Accessibility Ramps',
                      nepali: 'ह्विलचेयर पहुँच तथा र्‍याम्प',
                      icon: CheckCircle2,
                    },
                    {
                      key: 'hasLiveMusicPermit',
                      title: 'Live Music & DJ Sound Permit',
                      nepali: 'लाइभ संगीत तथा डीजे अनुमति',
                      icon: Music,
                    },
                    {
                      key: 'hasVipLounge',
                      title: 'VIP Bridal Suites & Dressing Room',
                      nepali: 'दुलही तथा भीआईपी विश्राम कक्ष',
                      icon: Sparkles,
                    },
                  ].map((amenity) => {
                    const Icon = amenity.icon;
                    const isChecked = Boolean((formData as any)[amenity.key]);
                    return (
                      <label
                        key={amenity.key}
                        className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                          isChecked ? 'bg-amber-50 border-amber-300 text-amber-950' : 'bg-white border-stone-200 text-stone-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => setFormData({ ...formData, [amenity.key]: e.target.checked })}
                          className="rounded border-stone-300 text-amber-900 focus:ring-amber-800"
                        />
                        <Icon className={`w-4 h-4 ${isChecked ? 'text-amber-800' : 'text-stone-400'}`} />
                        <div className="text-xs">
                          <div className="font-semibold">{amenity.title}</div>
                          <div className="text-[10px] text-stone-500">{amenity.nepali}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 5: Menu Pricing, Unlimited Media Gallery & Event Management Policies */}
            {activeStep === 5 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="border-b border-stone-200 pb-3">
                  <h3 className="font-display text-lg font-bold text-stone-900">
                    {language === 'ne' ? '५. मेनु र मूल्य, तस्बिर/भिडियो तथा इभेन्ट नीतिहरू' : '5. Menu with Prices, Media Gallery & Event Policies'}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {language === 'ne'
                      ? 'मेनु र प्रति प्लेट मूल्य, असीमित तस्बिर र भिडियो, तथा बाह्य इभेन्ट म्यानेजर खुला नीतिहरू। यी सबै विवरण पछि ड्यासबोर्डबाट पनि जुनसुकै बेला सम्पादन गर्न सकिन्छ।'
                      : 'Provide your menu with prices, unlimited photos and videos, and state if you perform event management or allow outside event management companies. All details can be edited anytime later.'}
                  </p>
                </div>

                {/* Section 5A: Menu with Prices */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5 uppercase tracking-wider">
                      <DollarSign className="w-4 h-4 text-amber-800" />
                      <span>{language === 'ne' ? 'मेनु तथा मूल्य सूची (Menu with Prices)' : 'Menu Packages & Per-Plate Pricing'}</span>
                    </span>
                    <span className="text-[11px] text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded-full font-semibold">
                      Editable Anytime Later
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-500">
                    Configure your starting catering rate and menu tiers. You can edit dish breakdowns and prices anytime in your Venue Dashboard.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">
                        Starting Catering Rate (NPR per plate) *
                      </label>
                      <input
                        type="number"
                        step="50"
                        value={formData.cateringStartingNpr || 1650}
                        onChange={(e) => setFormData({ ...formData, cateringStartingNpr: Number(e.target.value) })}
                        className="w-full text-xs bg-white border border-stone-300 rounded-xl px-3 py-2 font-mono font-bold text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">
                        Base Hall Rental Price (NPR) *
                      </label>
                      <input
                        type="number"
                        step="5000"
                        value={formData.baseRentalStartingNpr || 50000}
                        onChange={(e) => setFormData({ ...formData, baseRentalStartingNpr: Number(e.target.value) })}
                        className="w-full text-xs bg-white border border-stone-300 rounded-xl px-3 py-2 font-mono font-bold text-stone-900"
                      />
                    </div>
                  </div>

                  {/* Active Packages Tiers Preview */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-bold text-stone-600 block">Initial Catering Packages:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(formData.packages || []).map((pkg, idx) => (
                        <div key={pkg.id || idx} className="p-2.5 bg-white rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-stone-800 block">{pkg.name}</span>
                            <span className="text-[10px] text-stone-500">{pkg.sampleItems?.slice(0, 3).join(', ')}...</span>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-bold text-amber-950">NPR {pkg.pricePerPlateNpr}</span>
                            <span className="text-[10px] text-stone-400 block">/ plate</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 5B: Photos and Videos (Unlimited Quantity) */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5 uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-amber-800" />
                      <span>{language === 'ne' ? 'तस्बिर र भिडियोहरू (Photos & Videos - Unlimited)' : 'Photos & Videos (Unlimited Quantity)'}</span>
                    </span>
                    <span className="text-[11px] text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-semibold">
                      {(formData.mediaGallery || []).length} Media Added
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <p className="text-[11px] text-stone-500">
                      The quantity of photos and videos is not limited. You can upload photos directly from your device or paste links. Editable anytime.
                    </p>
                    <label className="cursor-pointer px-3 py-1.5 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg text-xs font-semibold text-stone-800 flex items-center justify-center gap-1.5 transition-colors shadow-2xs shrink-0">
                      <UploadCloud className="w-3.5 h-3.5 text-amber-800" />
                      <span>Upload from Device</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={handleOnboardingFileUpload}
                      />
                    </label>
                  </div>

                  {/* Quick Add Media Item */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-stone-200 text-xs">
                    <div>
                      <label className="text-[11px] text-stone-500 block mb-0.5">Media Title / Description</label>
                      <input
                        type="text"
                        placeholder="e.g. Grand Kailash Ballroom 4K Tour"
                        id="onboarding-media-title"
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-stone-500 block mb-0.5">Photo or Video URL (YouTube/MP4)</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/... or https://youtube.com/..."
                        id="onboarding-media-url"
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 font-mono"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => {
                          const titleEl = document.getElementById('onboarding-media-title') as HTMLInputElement;
                          const urlEl = document.getElementById('onboarding-media-url') as HTMLInputElement;
                          if (!urlEl || !urlEl.value) return;
                          const isVid = urlEl.value.includes('youtube') || urlEl.value.includes('vimeo') || urlEl.value.endsWith('.mp4');
                          const newMedia = {
                            id: `med-${Date.now()}`,
                            type: isVid ? 'VIDEO' as const : 'PHOTO' as const,
                            url: urlEl.value.trim(),
                            title: titleEl?.value?.trim() || 'Venue Property Media',
                            category: 'BALLROOM' as const,
                            isCover: false,
                          };
                          setFormData((prev) => ({
                            ...prev,
                            mediaGallery: [...(prev.mediaGallery || []), newMedia],
                          }));
                          if (urlEl) urlEl.value = '';
                          if (titleEl) titleEl.value = '';
                        }}
                        className="w-full py-1.5 bg-amber-900 hover:bg-amber-950 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Gallery</span>
                      </button>
                    </div>
                  </div>

                  {/* Media Chips */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(formData.mediaGallery || []).map((m) => (
                      <span
                        key={m.id}
                        className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 text-[11px] flex items-center gap-1.5"
                      >
                        <span className="font-bold text-[10px] text-amber-800">{m.type}:</span>
                        <span className="truncate max-w-[150px]">{m.title}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              mediaGallery: (prev.mediaGallery || []).filter((item) => item.id !== m.id),
                            }))
                          }
                          className="text-stone-400 hover:text-red-700 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Section 5C: Event Management Policy (In-House vs Outside Event Organizers) */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5 uppercase tracking-wider">
                      <Building2 className="w-4 h-4 text-amber-800" />
                      <span>{language === 'ne' ? 'इभेन्ट म्यानेजमेन्ट तथा बाह्य आयोजक नीति' : 'Event Management & Outside Planner Policy'}</span>
                    </span>
                    <span className="text-[11px] text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full font-semibold">
                      Required by Market
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-500">
                    State clearly whether your palace performs in-house event management only, or if you are open to external event management companies.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        key: 'IN_HOUSE_ONLY',
                        title: 'In-House Only',
                        desc: 'Venue team handles all decor, sound, and coordination exclusively. Outside planners not permitted.',
                      },
                      {
                        key: 'OUTSIDE_ALLOWED',
                        title: 'Outside Allowed',
                        desc: 'Open to external event management agencies and decorators with transparent guidelines.',
                      },
                      {
                        key: 'HYBRID_BOTH',
                        title: 'Hybrid / Both',
                        desc: 'In-house team available, but clients are also welcome to bring outside planners.',
                      },
                    ].map((opt) => {
                      const isSel = formData.eventManagementPolicy?.policyType === opt.key;
                      return (
                        <div
                          key={opt.key}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              eventManagementPolicy: {
                                ...(prev.eventManagementPolicy || {
                                  inHouseServicesDescription: 'Full in-house banquet operations and mandap support.',
                                  outsideOrganizerFeeNpr: 10000,
                                  soundCurfewTime: '10:30 PM',
                                  powerLoadCapacityKw: 60,
                                }),
                                policyType: opt.key as any,
                                allowsOutsideOrganizers: opt.key !== 'IN_HOUSE_ONLY',
                              },
                            }))
                          }
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            isSel
                              ? 'bg-amber-50 border-amber-900 ring-1 ring-amber-900 text-amber-950 font-semibold'
                              : 'bg-white border-stone-200 hover:border-stone-300 text-stone-600'
                          }`}
                        >
                          <span className="text-xs font-bold block mb-0.5">{opt.title}</span>
                          <span className="text-[10px] text-stone-500 leading-tight block">{opt.desc}</span>
                        </div>
                      );
                    })}
                  </div>

                  {formData.eventManagementPolicy?.allowsOutsideOrganizers && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                      <div>
                        <label className="text-stone-600 block mb-1 font-semibold">Outside Planner Fee / Royalty (NPR, 0 if Free)</label>
                        <input
                          type="number"
                          value={formData.eventManagementPolicy.outsideOrganizerFeeNpr || 0}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              eventManagementPolicy: {
                                ...(prev.eventManagementPolicy as any),
                                outsideOrganizerFeeNpr: Number(e.target.value),
                              },
                            }))
                          }
                          className="w-full bg-white border border-stone-300 rounded-lg p-2 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-stone-600 block mb-1 font-semibold">Sound Curfew Time</label>
                        <input
                          type="text"
                          value={formData.eventManagementPolicy.soundCurfewTime || '10:30 PM'}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              eventManagementPolicy: {
                                ...(prev.eventManagementPolicy as any),
                                soundCurfewTime: e.target.value,
                              },
                            }))
                          }
                          className="w-full bg-white border border-stone-300 rounded-lg p-2"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 5D: Cancellation & Decoration policies */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {language === 'ne' ? 'रद्द तथा पुनर्तालिका नीति (Cancellation Policy)' : 'Cancellation & Rescheduling Policy'}
                    </label>
                    <textarea
                      rows={2}
                      value={formData.cancellationPolicy || ''}
                      onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
                      placeholder="e.g. 100% deposit refund if cancelled at least 30 days prior."
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {language === 'ne' ? 'सजावट तथा बाह्य सेवा नीति (Decoration Policy)' : 'Decoration & Outside Vendor Rules'}
                    </label>
                    <textarea
                      rows={2}
                      value={formData.decorationPolicy || ''}
                      onChange={(e) => setFormData({ ...formData, decorationPolicy: e.target.value })}
                      placeholder="e.g. Outside florists allowed without royalty."
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: Review, Verification & Live Preview */}
            {activeStep === 6 && (
              <div className="space-y-5 animate-in fade-in">
                <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-stone-900">
                      {language === 'ne' ? '६. प्रमाणिकरण स्थिति तथा ग्राहक पूर्वावलोकन' : '6. Verification Status & Live Customer Preview'}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {language === 'ne'
                        ? 'तपाईंको पार्टी प्यालेस ग्राहकहरूले कसरी देख्छन् पूर्वावलोकन गर्नुहोस् र प्रकाशन गर्नुहोस्।'
                        : 'Review how your verified venue card appears on UTSAVO before publishing live.'}
                    </p>
                  </div>
                </div>

                {/* Verification Document Checklist */}
                <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/90 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>{language === 'ne' ? 'UTSAVO आधिकारिक प्रमाणिकरण चेकलिस्ट' : 'UTSAVO Verification Checklist'}</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-700 text-white uppercase">
                      {formData.verificationStatus || 'VERIFIED'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-900">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>PAN/VAT Registration Verified ({formData.panNumber || '601928471'})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Municipal Ward Business Permit Submitted</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Generator & Power Safety Compliance</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Catering Food Hygiene & Quality Verified</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Live Customer Preview Card */}
                <div>
                  <span className="text-xs font-bold text-stone-700 block mb-2 uppercase tracking-wider">
                    {language === 'ne' ? 'लाइभ कार्ड पूर्वावलोकन (Customer View Preview):' : 'Live Customer Card Preview:'}
                  </span>

                  <div className="max-w-md mx-auto bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-md">
                    <div className="relative">
                      <VenueImageVisual type={formData.coverImage || 'REGAL_BALLROOM'} name={formData.name || 'Sample Palace'} className="h-48 w-full" />
                      <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-md text-[11px] font-semibold text-amber-950 flex items-center gap-1 shadow-sm">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified Venue</span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-stone-500">
                        <MapPin className="w-3.5 h-3.5 text-amber-800" />
                        <span>{formData.locality || 'Locality'}, {formData.district} · {formData.province}</span>
                      </div>
                      <h4 className="font-display text-base font-bold text-stone-900">
                        {formData.name || 'Your Venue Name'}
                      </h4>
                      <p className="text-xs text-stone-500">{formData.nepaliName || 'तपाईंको भेन्यु'}</p>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs">
                        <div>
                          <span className="text-[10px] text-stone-400 block">Capacity</span>
                          <span className="font-semibold text-stone-800 tabular-nums">
                            {formData.minGuests || 100} - {formData.maxGuests || 800} guests
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block">Catering Starting</span>
                          <span className="font-semibold text-stone-800 tabular-nums">
                            NPR {(formData.cateringStartingNpr || 1650).toLocaleString()} / plate
                          </span>
                        </div>
                      </div>

                      {/* Event Management & Media Badges */}
                      <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-1.5 text-[10px]">
                        <span className={`px-2 py-0.5 rounded font-semibold ${
                          formData.eventManagementPolicy?.allowsOutsideOrganizers
                            ? 'bg-blue-50 text-blue-900 border border-blue-200'
                            : 'bg-stone-100 text-stone-800'
                        }`}>
                          {formData.eventManagementPolicy?.allowsOutsideOrganizers
                            ? '✓ Outside Planners Welcome'
                            : 'In-House Event Team Only'}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 font-semibold">
                          {(formData.mediaGallery || []).length} Photos & Videos
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold">
                          {(formData.packages || []).length} Menu Packages
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Success feedback alert */}
                {saveSuccessMsg && (
                  <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>
                      {language === 'ne'
                        ? 'भेन्यु सफलतापूर्वक सुरक्षित भयो! UTSAVO बजारमा प्रकाशित गरिँदैछ...'
                        : 'Venue details saved successfully! Publishing to UTSAVO marketplace...'}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Modal Navigation & Submit Buttons */}
            <div className="mt-8 pt-4 border-t border-stone-200 flex items-center justify-between">
              <div>
                {activeStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setActiveStep(activeStep - 1)}
                    className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{language === 'ne' ? 'अघिल्लो' : 'Previous'}</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {activeStep < 6 ? (
                  <button
                    type="button"
                    onClick={() => setActiveStep(activeStep + 1)}
                    className="px-5 py-2 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-950 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <span>{language === 'ne' ? 'अर्को चरण' : 'Next Step'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{language === 'ne' ? 'प्रकाशन गर्नुहोस् (Save & Publish)' : 'Save & Publish Listing'}</span>
                  </button>
                )}
              </div>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
