/**
 * UTSAVO - Venue Owner & Manager Business Portal
 * Complete ERP: Scheduling, Inquiries, Walk-In Reservations, Analytics,
 * Menu & Pricing Management (Per-Plate & Dishes), Unlimited Media Gallery (Photos & Videos),
 * and Event Management Policies (In-House vs Outside Event Organizers).
 */

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  Booking,
  CateringPackage,
  EventManagementPolicy,
  EventManagementPolicyType,
  HallSpace,
  KycDocuments,
  MediaCategory,
  MenuItem,
  ShiftTime,
  Venue,
  VenueMediaItem,
  VenueOffer,
} from '../types';
import {
  Building2,
  Calendar,
  Clock,
  Plus,
  Users,
  CheckCircle,
  FileText,
  DollarSign,
  TrendingUp,
  MessageSquare,
  AlertCircle,
  BarChart3,
  Utensils,
  Image as ImageIcon,
  Video,
  Trash2,
  Edit2,
  ShieldCheck,
  Check,
  ExternalLink,
  Sparkles,
  Zap,
  Flame,
  Award,
  X,
  Volume2,
  Tag,
  Percent,
  UploadCloud,
  Camera,
  FileCheck,
  Eye,
  Printer,
  UtensilsCrossed,
} from 'lucide-react';
import { VenueAnalytics } from './VenueAnalytics';
import { LegalContractQuotationGenerator } from './LegalContractQuotationGenerator';

export const VenueOwnerDashboard: React.FC = () => {
  const { language } = useLanguage();
  const {
    venues,
    bookings,
    negotiations,
    createWalkInBooking,
    openVenueOnboarding,
    saveVenueListing,
    setActiveModal,
    setActiveNegotiationId,
  } = useMarketplace();

  // Active venue for the logged-in venue operator
  const myVenue: Venue = venues[0]; // The Regal Pavilion & Heritage Banquet

  const [activeTab, setActiveTab] = useState<
    'CALENDAR' | 'INBOX' | 'WALK_IN' | 'MENU_PRICING' | 'MEDIA_GALLERY' | 'OFFERS' | 'KYC_VERIFICATION' | 'EVENT_POLICY' | 'ANALYTICS'
  >('CALENDAR');

  const [selectedHallId, setSelectedHallId] = useState<string>(myVenue.halls[0].id);
  const [isLegalPdfOpen, setIsLegalPdfOpen] = useState(false);

  // OFFERS & DISCOUNTS STATE
  const [offersList, setOffersList] = useState<VenueOffer[]>(
    myVenue.offers || [
      {
        id: 'off-regal-1',
        title: 'Mangsir Vivah Subha Muhurat Special: 15% OFF',
        nepaliTitle: 'मंसिर विवाह शुभ मुहूर्त विशेष: १५% छुट',
        badgeText: '⚡ 15% OFF Subha Muhurat',
        discountType: 'PERCENTAGE',
        discountValue: 15,
        promoCode: 'UTSAVO15',
        validUntilBS: '2081 Mangsir 30',
        minGuests: 300,
        description: 'Get a flat 15% discount on total catering billing for weddings booked on auspicious Panchanga dates in Mangsir.',
        terms: ['Minimum guarantee of 300 guests required', 'Valid on Silver and Gold catering buffet packages'],
        isActive: true,
        highlightOnCard: true,
      },
      {
        id: 'off-regal-2',
        title: 'Complimentary Sacred Mandap & Dual Stage Rig',
        nepaliTitle: 'नि:शुल्क वैदिक मण्डप तथा स्टेज सेटअप',
        badgeText: '🎁 Free Mandap Rig (Worth Rs. 35,000)',
        discountType: 'COMPLIMENTARY_ADDON',
        discountValue: 35000,
        promoCode: 'FREEMANDAP',
        validUntilBS: '2081 Poush 15',
        minGuests: 250,
        description: 'Free complete traditional Vedic Havan Mandap with marigold floral work and ambient spotlights.',
        terms: ['Applicable on Sagarmatha Lawn & Kailash Ballroom joint bookings'],
        isActive: true,
        highlightOnCard: false,
      },
    ]
  );

  // New offer form state
  const [showAddOffer, setShowAddOffer] = useState(false);
  const [newOfferTitle, setNewOfferTitle] = useState('');
  const [newOfferNepali, setNewOfferNepali] = useState('');
  const [newOfferBadge, setNewOfferBadge] = useState('⚡ 15% OFF');
  const [newOfferType, setNewOfferType] = useState<'PERCENTAGE' | 'FLAT_AMOUNT' | 'COMPLIMENTARY_ADDON'>('PERCENTAGE');
  const [newOfferValue, setNewOfferValue] = useState(15);
  const [newOfferPromo, setNewOfferPromo] = useState('SPECIAL15');
  const [newOfferValidBS, setNewOfferValidBS] = useState('2081 Poush 30');
  const [newOfferMinGuests, setNewOfferMinGuests] = useState(250);
  const [newOfferDesc, setNewOfferDesc] = useState('');

  // KYC STATE & PHYSICAL FACILITY VERIFICATION PHOTOS
  const [kycData, setKycData] = useState<KycDocuments>(
    myVenue.kycDocuments || {
      status: myVenue.verificationStatus || 'VERIFIED',
      lastUpdated: '2024-10-15',
      complianceNotes: 'Inspected and certified compliant with Department of Food Technology and Quality Control (DFTQC) standards.',
      verificationPhotos: [
        {
          id: 'kyc-regal-1',
          category: 'EXTERIOR_ENTRANCE',
          title: 'Main Security Gate & Reception Entrance',
          url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
          uploadedAt: '2024-10-15',
        },
        {
          id: 'kyc-regal-2',
          category: 'KITCHEN_HYGIENE',
          title: 'Commercial Stainless Steel Kitchen & Water Filtration Plant',
          url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
          uploadedAt: '2024-10-15',
        },
        {
          id: 'kyc-regal-3',
          category: 'POWER_BACKUP_GENSET',
          title: '125 kVA Silent Cummins Generator System',
          url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
          uploadedAt: '2024-10-15',
        },
      ],
    }
  );

  const [editingPanNumber, setEditingPanNumber] = useState(myVenue.panNumber || '602918471');
  const [editingRegNumber, setEditingRegNumber] = useState(myVenue.businessRegNumber || '184920/075/076');
  const [newKycPhotoUrl, setNewKycPhotoUrl] = useState('');
  const [newKycPhotoTitle, setNewKycPhotoTitle] = useState('');
  const [newKycPhotoCategory, setNewKycPhotoCategory] = useState<any>('EXTERIOR_ENTRANCE');
  const [editingMediaItem, setEditingMediaItem] = useState<VenueMediaItem | null>(null);

  // Success toast state
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3500);
  };

  // Walk-in booking state form
  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInGuests, setWalkInGuests] = useState(300);
  const [walkInDateBS, setWalkInDateBS] = useState('2081 Mangsir 20');
  const [walkInShift, setWalkInShift] = useState<ShiftTime>('DAY');
  const [walkInRate, setWalkInRate] = useState(myVenue.cateringStartingNpr || 1650);
  const [walkInDeposit, setWalkInDeposit] = useState(150000);
  const [walkInSuccessMsg, setWalkInSuccessMsg] = useState(false);

  // MENU STATE (Editable packages & items)
  const [packages, setPackages] = useState<CateringPackage[]>(myVenue.packages || []);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(myVenue.availableMenuItems || []);

  // New package form state
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [newPkgName, setNewPkgName] = useState('');
  const [newPkgNepali, setNewPkgNepali] = useState('');
  const [newPkgPrice, setNewPkgPrice] = useState(1850);
  const [newPkgDesc, setNewPkgDesc] = useState('');
  const [newPkgItems, setNewPkgItems] = useState('Chicken Sekuwa, Paneer Tikka, Dal Makhani, Pulao, Gulab Jamun');

  // New custom dish state
  const [showAddDish, setShowAddDish] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishCategory, setNewDishCategory] = useState<any>('NON_VEG_STARTER');
  const [newDishPrice, setNewDishPrice] = useState(120);
  const [newDishIsVeg, setNewDishIsVeg] = useState(false);

  // MEDIA GALLERY STATE (Unlimited photos and videos)
  const [mediaList, setMediaList] = useState<VenueMediaItem[]>(
    myVenue.mediaGallery || [
      {
        id: 'med-regal-1',
        type: 'PHOTO',
        url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
        title: 'Grand Kailash Ballroom',
        category: 'BALLROOM',
        caption: 'Luxury banquet ballroom with Italian marble & crystal chandeliers.',
        isCover: true,
      },
      {
        id: 'med-regal-2',
        type: 'PHOTO',
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        title: 'Sagarmatha Open Lawn Mandap',
        category: 'GARDEN_LAWN',
        caption: 'Traditional Vedic Havan/Hom sacred fire setup area.',
      },
      {
        id: 'med-regal-3',
        type: 'VIDEO',
        url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
        title: '4K Drone Aerial Tour & Evening Reception Highlights',
        category: 'DRONE_AERIAL',
        videoPlatform: 'YOUTUBE',
        thumbnailUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80',
        caption: 'Cinematic overview of all banquet halls and garden lawns.',
      },
    ]
  );

  // Add media modal state
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaType, setNewMediaType] = useState<'PHOTO' | 'VIDEO'>('PHOTO');
  const [newMediaCategory, setNewMediaCategory] = useState<MediaCategory>('BALLROOM');
  const [newMediaCaption, setNewMediaCaption] = useState('');
  const [activeVideoModal, setActiveVideoModal] = useState<VenueMediaItem | null>(null);

  // EVENT MANAGEMENT POLICY STATE
  const [eventPolicy, setEventPolicy] = useState<EventManagementPolicy>(
    myVenue.eventManagementPolicy || {
      policyType: 'HYBRID_BOTH',
      allowsOutsideOrganizers: true,
      inHouseServicesDescription:
        'Complete in-house banquet hospitality, Vedic mandap team & acoustic system available. Also welcoming certified external wedding planners & event organizers.',
      outsideOrganizerFeeNpr: 15000,
      outsideOrganizerGuidelines:
        'Outside event organizers must submit production plan and single-line electrical diagram 7 days prior. Max sound level: 85 dB. Full access to loading dock from 06:00 AM.',
      soundCurfewTime: '10:30 PM',
      powerLoadCapacityKw: 60,
      refundableSecurityDepositNpr: 25000,
    }
  );

  const venueBookings = bookings.filter((b) => b.venueId === myVenue.id);
  const venueNegotiations = negotiations.filter((n) => n.venueId === myVenue.id);

  // Financial KPIs
  const totalRevenueNpr = venueBookings.reduce((sum, b) => sum + (b.depositPaidNpr || 0), 0);
  const totalBookedGuests = venueBookings.reduce((sum, b) => sum + (b.guestCount || 0), 0);

  // Create walk-in
  const handleCreateWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName || !walkInPhone) return;

    const rawSubtotal = walkInGuests * walkInRate + 50000;
    const vatTotal = Math.round(rawSubtotal * 1.23);

    createWalkInBooking({
      hallId: selectedHallId,
      customerName: walkInName,
      customerPhone: walkInPhone,
      guestCount: walkInGuests,
      eventDateBS: walkInDateBS,
      shift: walkInShift,
      agreedPerPlateNpr: walkInRate,
      totalAmountNpr: vatTotal,
      depositPaidNpr: walkInDeposit,
      status: 'CONFIRMED',
    });

    setWalkInSuccessMsg(true);
    setWalkInName('');
    setWalkInPhone('');
    setTimeout(() => setWalkInSuccessMsg(false), 4000);
  };

  // MENU HANDLERS
  const handleUpdatePackagePrice = (pkgId: string, newPrice: number) => {
    const updated = packages.map((p) => (p.id === pkgId ? { ...p, pricePerPlateNpr: newPrice } : p));
    setPackages(updated);
    saveVenueListing({
      ...myVenue,
      packages: updated,
      cateringStartingNpr: Math.min(...updated.map((p) => p.pricePerPlateNpr)),
    });
    showToast('Package price updated and saved live!');
  };

  const handleAddNewPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkgName) return;

    const newPkg: CateringPackage = {
      id: `pkg-${Date.now()}`,
      name: newPkgName,
      nepaliName: newPkgNepali || newPkgName,
      pricePerPlateNpr: newPkgPrice,
      description: newPkgDesc || 'Custom banquet catering package configured by venue operator.',
      includedCounts: {
        welcomeDrinks: 2,
        vegStarters: 3,
        nonVegStarters: 2,
        traditionalNepali: 1,
        mainCourses: 3,
        riceAndBreads: 2,
        liveCounters: 1,
        desserts: 2,
      },
      sampleItems: newPkgItems.split(',').map((s) => s.trim()).filter(Boolean),
    };

    const updated = [...packages, newPkg];
    setPackages(updated);
    saveVenueListing({
      ...myVenue,
      packages: updated,
      cateringStartingNpr: Math.min(...updated.map((p) => p.pricePerPlateNpr)),
    });

    setNewPkgName('');
    setNewPkgNepali('');
    setNewPkgDesc('');
    setShowAddPackage(false);
    showToast(`New menu package "${newPkg.name}" added successfully!`);
  };

  const handleRemovePackage = (pkgId: string) => {
    if (packages.length <= 1) {
      alert('You must have at least one active catering package.');
      return;
    }
    const updated = packages.filter((p) => p.id !== pkgId);
    setPackages(updated);
    saveVenueListing({ ...myVenue, packages: updated });
    showToast('Package removed.');
  };

  const handleAddCustomDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName) return;

    const newDish: MenuItem = {
      id: `dish-${Date.now()}`,
      name: newDishName,
      nepaliName: newDishName,
      category: newDishCategory,
      isVegetarian: newDishIsVeg,
      isTraditionalNepali: false,
      extraPriceNpr: newDishPrice,
      description: 'Special custom item available for banquet customization.',
    };

    const updated = [...menuItems, newDish];
    setMenuItems(updated);
    saveVenueListing({ ...myVenue, availableMenuItems: updated });
    setNewDishName('');
    setShowAddDish(false);
    showToast(`Custom item "${newDish.name}" added to menu catalog!`);
  };

  const handleRemoveDish = (dishId: string) => {
    const updated = menuItems.filter((i) => i.id !== dishId);
    setMenuItems(updated);
    saveVenueListing({ ...myVenue, availableMenuItems: updated });
    showToast('Dish removed.');
  };

  // MEDIA HANDLERS (Unlimited quantity)
  const handleAddMediaItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaUrl.trim()) return;

    const newMedia: VenueMediaItem = {
      id: `media-${Date.now()}`,
      type: newMediaType,
      url: newMediaUrl.trim(),
      title: newMediaTitle.trim() || (newMediaType === 'PHOTO' ? 'Venue Property Photo' : 'Venue Video Highlight'),
      category: newMediaCategory,
      caption: newMediaCaption.trim() || undefined,
      isCover: mediaList.length === 0,
      videoPlatform: newMediaType === 'VIDEO' ? 'YOUTUBE' : undefined,
    };

    const updated = [newMedia, ...mediaList];
    setMediaList(updated);
    saveVenueListing({
      ...myVenue,
      mediaGallery: updated,
    });

    setNewMediaUrl('');
    setNewMediaTitle('');
    setNewMediaCaption('');
    showToast(`New ${newMediaType.toLowerCase()} added to gallery! Unlimited media supported.`);
  };

  const handleRemoveMedia = (mediaId: string) => {
    const updated = mediaList.filter((m) => m.id !== mediaId);
    setMediaList(updated);
    saveVenueListing({ ...myVenue, mediaGallery: updated });
    showToast('Media item deleted.');
  };

  const handleSetCoverPhoto = (mediaId: string) => {
    const updated = mediaList.map((m) => ({ ...m, isCover: m.id === mediaId }));
    setMediaList(updated);
    saveVenueListing({ ...myVenue, mediaGallery: updated });
    showToast('Cover photo updated.');
  };

  // Device file upload for photos & videos
  const handleDevicePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const isVid = file.type.startsWith('video');
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const newItem: VenueMediaItem = {
          id: `med-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          type: isVid ? 'VIDEO' : 'PHOTO',
          url: result,
          title: file.name.replace(/\.[^/.]+$/, ''),
          category: 'BALLROOM',
          caption: `Device upload (${(file.size / 1024).toFixed(0)} KB)`,
          isCover: mediaList.length === 0,
        };

        setMediaList((prev) => {
          const updated = [newItem, ...prev];
          saveVenueListing({ ...myVenue, mediaGallery: updated });
          return updated;
        });
        showToast(`"${file.name}" uploaded successfully!`);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSaveEditedMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMediaItem) return;

    const updated = mediaList.map((m) => (m.id === editingMediaItem.id ? editingMediaItem : m));
    setMediaList(updated);
    saveVenueListing({ ...myVenue, mediaGallery: updated });
    setEditingMediaItem(null);
    showToast('Media details updated successfully!');
  };

  // OFFER HANDLERS
  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfferTitle.trim()) return;

    const newOffer: VenueOffer = {
      id: `off-${Date.now()}`,
      title: newOfferTitle.trim(),
      nepaliTitle: newOfferNepali.trim() || undefined,
      badgeText: newOfferBadge.trim() || '⚡ Special Deal',
      discountType: newOfferType,
      discountValue: newOfferValue,
      promoCode: (newOfferPromo.trim() || 'DEAL').toUpperCase(),
      validUntilBS: newOfferValidBS.trim() || '2081 Chaitra 30',
      minGuests: newOfferMinGuests,
      description: newOfferDesc.trim() || 'Special promotional celebration package.',
      terms: [`Valid on bookings of ${newOfferMinGuests}+ guests`, 'Subject to hall availability'],
      isActive: true,
      highlightOnCard: true,
    };

    const updated = [newOffer, ...offersList];
    setOffersList(updated);
    saveVenueListing({ ...myVenue, offers: updated });

    setNewOfferTitle('');
    setNewOfferNepali('');
    setNewOfferDesc('');
    setShowAddOffer(false);
    showToast(`Special offer "${newOffer.title}" published live!`);
  };

  const handleToggleOffer = (offerId: string) => {
    const updated = offersList.map((o) => (o.id === offerId ? { ...o, isActive: !o.isActive } : o));
    setOffersList(updated);
    saveVenueListing({ ...myVenue, offers: updated });
    showToast('Offer status toggled.');
  };

  const handleDeleteOffer = (offerId: string) => {
    const updated = offersList.filter((o) => o.id !== offerId);
    setOffersList(updated);
    saveVenueListing({ ...myVenue, offers: updated });
    showToast('Offer deleted.');
  };

  // KYC VERIFICATION HANDLERS
  const handleAddKycPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKycPhotoUrl.trim()) return;

    const newPhoto = {
      id: `kyc-${Date.now()}`,
      category: newKycPhotoCategory,
      title: newKycPhotoTitle.trim() || `${newKycPhotoCategory.replace(/_/g, ' ')} Inspection Photo`,
      url: newKycPhotoUrl.trim(),
      uploadedAt: new Date().toISOString().split('T')[0],
    };

    const updatedPhotos = [newPhoto, ...(kycData.verificationPhotos || [])];
    const updatedKyc: KycDocuments = {
      ...kycData,
      verificationPhotos: updatedPhotos,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setKycData(updatedKyc);
    saveVenueListing({ ...myVenue, kycDocuments: updatedKyc });
    setNewKycPhotoUrl('');
    setNewKycPhotoTitle('');
    showToast('Facility inspection photo attached to KYC dossier!');
  };

  const handleSaveKyc = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedKyc: KycDocuments = {
      ...kycData,
      status: 'VERIFIED',
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setKycData(updatedKyc);
    saveVenueListing({
      ...myVenue,
      panNumber: editingPanNumber,
      businessRegNumber: editingRegNumber,
      verificationStatus: 'VERIFIED',
      kycDocuments: updatedKyc,
    });
    showToast('KYC records & verified compliance documents updated successfully!');
  };

  // EVENT POLICY HANDLER
  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    saveVenueListing({
      ...myVenue,
      eventManagementPolicy: eventPolicy,
    });
    showToast('Event management policy updated live on marketplace!');
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-emerald-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold">{saveToast}</span>
        </div>
      )}

      {/* Venue Header & Identity */}
      <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
              Venue Business ERP & Operations
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
              {myVenue.verificationStatus}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              eventPolicy.policyType === 'OUTSIDE_ALLOWED'
                ? 'bg-blue-100 text-blue-900'
                : eventPolicy.policyType === 'HYBRID_BOTH'
                ? 'bg-purple-100 text-purple-900'
                : 'bg-stone-100 text-stone-800'
            }`}>
              {eventPolicy.policyType === 'OUTSIDE_ALLOWED'
                ? 'Open to Outside Planners'
                : eventPolicy.policyType === 'HYBRID_BOTH'
                ? 'Hybrid: In-House + Outside Planners'
                : 'In-House Event Team Only'}
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold text-stone-900 mt-1">
            {myVenue.name}
          </h2>
          <div className="text-xs text-stone-500 mt-0.5">
            PAN: <strong>{myVenue.panNumber}</strong> · {myVenue.locality}, {myVenue.district} · {myVenue.halls.length} Halls Registered · {mediaList.length} Photos & Videos · {packages.length} Menu Packages
          </div>
        </div>

        {/* Action Controls & Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsLegalPdfOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-950 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            title="Generate binding contract per Nepal Contract Act 2056"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Draft Contract / Quotation (PDF)</span>
          </button>

          <button
            onClick={() => openVenueOnboarding(myVenue)}
            className="px-3.5 py-1.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            title="Edit Halls, General Specs & Legal Info"
          >
            <Building2 className="w-3.5 h-3.5 text-amber-800" />
            <span>Full Venue Wizard</span>
          </button>

          <button
            onClick={() => openVenueOnboarding(null)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            title="Register a new Palace or Branch"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register New Palace</span>
          </button>

          <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('CALENDAR')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'CALENDAR' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Hall Calendar
            </button>
            <button
              onClick={() => setActiveTab('INBOX')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'INBOX' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Leads ({venueNegotiations.length})
            </button>
            <button
              onClick={() => setActiveTab('WALK_IN')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                activeTab === 'WALK_IN' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Plus className="w-3 h-3 text-amber-800" />
              <span>Walk-in</span>
            </button>
            <button
              onClick={() => setActiveTab('MENU_PRICING')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'MENU_PRICING' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Utensils className="w-3.5 h-3.5 text-amber-800" />
              <span>Menu & Prices ({packages.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('MEDIA_GALLERY')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'MEDIA_GALLERY' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber-800" />
              <span>Photos & Videos ({mediaList.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('OFFERS')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'OFFERS' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-amber-800" />
              <span>Offers & Deals ({offersList.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('KYC_VERIFICATION')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'KYC_VERIFICATION' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>KYC & Inspection ({kycData.verificationPhotos?.length || 0})</span>
            </button>
            <button
              onClick={() => setActiveTab('EVENT_POLICY')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'EVENT_POLICY' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-800" />
              <span>Event Management Policy</span>
            </button>
            <button
              onClick={() => setActiveTab('ANALYTICS')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'ANALYTICS' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-amber-800" />
              <span>Analytics & Trends</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-stone-200">
          <span className="text-xs text-stone-400 block">Total Deposited Revenue</span>
          <span className="text-xl font-bold font-display text-amber-950 tabular-nums">
            NPR {totalRevenueNpr.toLocaleString()}
          </span>
          <span className="text-[11px] text-emerald-700 block mt-1">Active reservation deposits</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200">
          <span className="text-xs text-stone-400 block">Confirmed Bookings</span>
          <span className="text-xl font-bold font-display text-amber-950 tabular-nums">
            {venueBookings.length} Events
          </span>
          <span className="text-[11px] text-stone-500 block mt-1">{totalBookedGuests.toLocaleString()} total guests hosted</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200">
          <span className="text-xs text-stone-400 block">Catering Starting Rate</span>
          <span className="text-xl font-bold font-display text-amber-950 tabular-nums">
            NPR {Math.min(...packages.map((p) => p.pricePerPlateNpr)).toLocaleString()}
          </span>
          <span className="text-[11px] text-stone-500 block mt-1">{packages.length} active menu tiers</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200">
          <span className="text-xs text-stone-400 block">Media Gallery Count</span>
          <span className="text-xl font-bold font-display text-emerald-700 tabular-nums">
            {mediaList.length} Items
          </span>
          <span className="text-[11px] text-stone-500 block mt-1">Unlimited storage active</span>
        </div>
      </div>

      {/* TAB 1: HALL INVENTORY CALENDAR */}
      {activeTab === 'CALENDAR' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Hall Schedule & Auspicious Muhurat Availability
              </h3>
              <p className="text-xs text-stone-500">
                Live availability by date and shift. Green indicates open slot; red indicates confirmed booking.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 font-medium">Select Hall:</span>
              <select
                value={selectedHallId}
                onChange={(e) => setSelectedHallId(e.target.value)}
                className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 font-semibold text-stone-800"
              >
                {myVenue.halls.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.minCapacity}-{h.maxCapacity} pax)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                dateBS: '2081 Mangsir 14',
                tithi: 'Trayodashi (Bibaha Muhurat)',
                shifts: { MORNING: 'AVAILABLE', DAY: 'CONFIRMED', EVENING: 'CONFIRMED' },
              },
              {
                dateBS: '2081 Mangsir 18',
                tithi: 'Dwitiya (Subha Muhurat)',
                shifts: { MORNING: 'AVAILABLE', DAY: 'AVAILABLE', EVENING: 'HOLD' },
              },
              {
                dateBS: '2081 Mangsir 20',
                tithi: 'Panchami (Universal Muhurat)',
                shifts: { MORNING: 'CONFIRMED', DAY: 'CONFIRMED', EVENING: 'AVAILABLE' },
              },
              {
                dateBS: '2081 Mangsir 24',
                tithi: 'Dashami (Bratabandha / Bibaha)',
                shifts: { MORNING: 'AVAILABLE', DAY: 'AVAILABLE', EVENING: 'AVAILABLE' },
              },
            ].map((slot, idx) => (
              <div key={idx} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="border-b border-stone-200 pb-2">
                  <span className="font-bold text-xs text-stone-900 block">{slot.dateBS}</span>
                  <span className="text-[10px] text-amber-800 font-medium">{slot.tithi}</span>
                </div>

                <div className="space-y-1.5">
                  {Object.entries(slot.shifts).map(([shiftKey, status]) => (
                    <div key={shiftKey} className="flex items-center justify-between text-xs">
                      <span className="text-stone-600 capitalize text-[11px]">{shiftKey.toLowerCase()} Shift</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          status === 'AVAILABLE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : status === 'CONFIRMED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: INBOX / LEADS */}
      {activeTab === 'INBOX' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Customer Negotiation Pipeline ({venueNegotiations.length} Active Leads)
              </h3>
              <p className="text-xs text-stone-500">
                Review proposed per-plate rates, amenities, and send instant counter-offers.
              </p>
            </div>
          </div>

          <div className="divide-y divide-stone-100">
            {venueNegotiations.map((thread) => {
              const latestOffer = thread.versions[thread.versions.length - 1];
              return (
                <div
                  key={thread.id}
                  className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">{thread.customerName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                        {thread.eventType}
                      </span>
                    </div>
                    <div className="text-xs text-stone-500">
                      Date: {latestOffer.dateBS} ({latestOffer.shift} Shift) · Guests: {latestOffer.guestCount} pax
                    </div>
                    <div className="text-xs font-semibold text-amber-950">
                      Proposed: NPR {latestOffer.proposedPerPlateNpr.toLocaleString()} / plate · Total: NPR {latestOffer.totalNpr.toLocaleString()}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveNegotiationId(thread.id);
                      setActiveModal('NEGOTIATION');
                    }}
                    className="px-4 py-2 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-semibold shadow-xs"
                  >
                    Open Offer Drawer
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: WALK-IN RESERVATION */}
      {activeTab === 'WALK_IN' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 max-w-xl mx-auto space-y-4 shadow-sm">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-base font-bold text-stone-900">Walk-In & Offline Reservation Entry</h3>
            <p className="text-xs text-stone-500">Record direct offline reservations to block your online calendar instantly.</p>
          </div>

          {walkInSuccessMsg && (
            <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              <span>Walk-in booking successfully recorded and calendar shift locked!</span>
            </div>
          )}

          <form onSubmit={handleCreateWalkIn} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Customer Full Name *</label>
              <input
                type="text"
                required
                value={walkInName}
                onChange={(e) => setWalkInName(e.target.value)}
                placeholder="e.g. Ramesh Karki"
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-900 font-medium"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Customer Phone Number (+977) *</label>
              <input
                type="tel"
                required
                value={walkInPhone}
                onChange={(e) => setWalkInPhone(e.target.value)}
                placeholder="+977-9851000000"
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-900 font-mono font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Guest Pax Count</label>
                <input
                  type="number"
                  value={walkInGuests}
                  onChange={(e) => setWalkInGuests(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-900 font-semibold"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Event Date (Bikram Sambat)</label>
                <input
                  type="text"
                  value={walkInDateBS}
                  onChange={(e) => setWalkInDateBS(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-900 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Agreed Per-Plate (NPR)</label>
                <input
                  type="number"
                  value={walkInRate}
                  onChange={(e) => setWalkInRate(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-900 font-semibold"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Deposit Collected (NPR)</label>
                <input
                  type="number"
                  value={walkInDeposit}
                  onChange={(e) => setWalkInDeposit(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-900 font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-950 rounded-xl transition-colors shadow flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Confirm & Lock Hall Calendar</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: MENU WITH PRICES (EDITABLE ANYTIME) */}
      {activeTab === 'MENU_PRICING' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-amber-800" />
                <h3 className="text-lg font-bold text-stone-900">
                  {language === 'ne' ? 'मेनु र प्रति प्लेट मूल्य व्यवस्थापन' : 'Menu Packages & Pricing Management'}
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {language === 'ne'
                  ? 'तपाईंको बुफे प्याकेजको दर, थप परिकारको मूल्य, र मेनु विवरणहरू जुनसुकै बेला सम्पादन गर्नुहोस्।'
                  : 'Manage your buffet catering packages, adjust prices per plate, and add custom dish add-ons anytime.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddDish(!showAddDish)}
                className="px-3 py-1.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Custom Dish Add-on</span>
              </button>
              <button
                onClick={() => setShowAddPackage(!showAddPackage)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Catering Package</span>
              </button>
            </div>
          </div>

          {/* Add Package Modal Form Dropdown */}
          {showAddPackage && (
            <form onSubmit={handleAddNewPackage} className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-amber-950">Add New Catering Tier</span>
                <button type="button" onClick={() => setShowAddPackage(false)} className="text-stone-400 hover:text-stone-700">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-stone-600 block mb-1 font-semibold">Package Name *</label>
                  <input
                    type="text"
                    required
                    value={newPkgName}
                    onChange={(e) => setNewPkgName(e.target.value)}
                    placeholder="e.g. Diamond Royal Banquet"
                    className="w-full bg-white border border-stone-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="text-stone-600 block mb-1 font-semibold">Nepali Name</label>
                  <input
                    type="text"
                    value={newPkgNepali}
                    onChange={(e) => setNewPkgNepali(e.target.value)}
                    placeholder="उदा: हिरा शाही उत्सव भोज"
                    className="w-full bg-white border border-stone-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="text-stone-600 block mb-1 font-semibold">Price Per Plate (NPR) *</label>
                  <input
                    type="number"
                    step="50"
                    required
                    value={newPkgPrice}
                    onChange={(e) => setNewPkgPrice(Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 font-mono font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-stone-600 block mb-1 font-semibold">Sample Included Dishes (comma separated)</label>
                  <input
                    type="text"
                    value={newPkgItems}
                    onChange={(e) => setNewPkgItems(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="text-stone-600 block mb-1 font-semibold">Short Description</label>
                  <input
                    type="text"
                    value={newPkgDesc}
                    onChange={(e) => setNewPkgDesc(e.target.value)}
                    placeholder="e.g. 28-course premium feast with live barbecue"
                    className="w-full bg-white border border-stone-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPackage(false)}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-600 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-900 text-white text-xs font-semibold shadow-xs"
                >
                  Save Package Live
                </button>
              </div>
            </form>
          )}

          {/* Add Custom Dish Dropdown */}
          {showAddDish && (
            <form onSubmit={handleAddCustomDish} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-stone-900">Add Individual Dish with Extra Price</span>
                <button type="button" onClick={() => setShowAddDish(false)} className="text-stone-400 hover:text-stone-700">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="text-stone-600 block mb-1 font-semibold">Dish Name *</label>
                  <input
                    type="text"
                    required
                    value={newDishName}
                    onChange={(e) => setNewDishName(e.target.value)}
                    placeholder="e.g. Mutton Choila or Live Jalebi Counter"
                    className="w-full bg-white border border-stone-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="text-stone-600 block mb-1 font-semibold">Extra Price (NPR)</label>
                  <input
                    type="number"
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 font-mono font-bold"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
                    <input
                      type="checkbox"
                      checked={newDishIsVeg}
                      onChange={(e) => setNewDishIsVeg(e.target.checked)}
                      className="rounded border-stone-300 text-emerald-700"
                    />
                    <span>Vegetarian</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-semibold shadow-xs"
                >
                  Save Dish
                </button>
              </div>
            </form>
          )}

          {/* Active Catering Packages Cards */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
              Active Catering Packages ({packages.length}):
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="p-5 bg-stone-50 rounded-2xl border border-stone-200 relative group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-stone-900">{pkg.name}</h4>
                        <span className="text-xs text-stone-500">{pkg.nepaliName}</span>
                      </div>
                      <button
                        onClick={() => handleRemovePackage(pkg.id)}
                        className="text-stone-400 hover:text-red-700 p-1"
                        title="Delete package"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-stone-600 mt-2 line-clamp-2">{pkg.description}</p>

                    {/* Price editor */}
                    <div className="mt-3 p-2 bg-white rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                      <span className="text-stone-500 font-medium">Price per plate:</span>
                      <div className="flex items-center gap-1 font-mono font-bold text-amber-950">
                        <span>NPR</span>
                        <input
                          type="number"
                          step="25"
                          value={pkg.pricePerPlateNpr}
                          onChange={(e) => handleUpdatePackagePrice(pkg.id, Number(e.target.value))}
                          className="w-20 px-1 py-0.5 text-right bg-stone-50 border border-stone-200 rounded font-bold"
                        />
                      </div>
                    </div>

                    {/* Sample dishes */}
                    <div className="mt-3 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">Sample Dishes:</span>
                      <div className="flex flex-wrap gap-1">
                        {pkg.sampleItems.map((item, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-white text-stone-700 border border-stone-200">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Dishes Catalog */}
          {menuItems.length > 0 && (
            <div className="pt-4 border-t border-stone-100 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                Custom Menu Dish Add-ons ({menuItems.length}):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                {menuItems.slice(0, 12).map((item) => (
                  <div key={item.id} className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-stone-800 block truncate">{item.name}</span>
                      <span className="text-[10px] text-stone-500">
                        {item.isVegetarian ? '🌱 Veg' : '🍗 Non-Veg'} · +NPR {item.extraPriceNpr || 0}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveDish(item.id)}
                      className="text-stone-300 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: PHOTOS AND VIDEOS GALLERY (UNLIMITED QUANTITY) */}
      {activeTab === 'MEDIA_GALLERY' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-800" />
                <h3 className="text-lg font-bold text-stone-900">
                  {language === 'ne' ? 'तस्बिर तथा भिडियो ग्यालरी (असीमित)' : 'Photos & Videos Media Gallery (Unlimited Quantity)'}
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {language === 'ne'
                  ? 'तपाईंको पार्टी प्यालेसका हल, मण्डप, खाना, र ४K ड्रोन भिडियोहरू अपलोड तथा व्यवस्थापन गर्नुहोस्। कुनै सीमा छैन।'
                  : 'Showcase your halls, lawn, Vedic mandap, buffet presentation, and high-definition YouTube/Vimeo/MP4 video reels without limits.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl text-xs font-semibold text-stone-800 transition-colors shadow-xs">
                <UploadCloud className="w-3.5 h-3.5 text-amber-800" />
                <span>Upload from Device</span>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleDevicePhotoUpload}
                />
              </label>

              <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
                {mediaList.length} Media Files Active
              </span>
            </div>
          </div>

          {/* Add Media Form */}
          <form onSubmit={handleAddMediaItem} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800 block">
                + Add New Photo or Video URL (Unlimited):
              </span>
              <span className="text-[11px] text-stone-500">
                Supports Unsplash, CDN images, and YouTube / Vimeo / MP4 reels
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-stone-600 block mb-1 font-semibold">Media Type</label>
                <select
                  value={newMediaType}
                  onChange={(e) => setNewMediaType(e.target.value as any)}
                  className="w-full bg-white border border-stone-300 rounded-lg p-2"
                >
                  <option value="PHOTO">Photo (Image URL)</option>
                  <option value="VIDEO">Video (YouTube / Vimeo / MP4)</option>
                </select>
              </div>

              <div>
                <label className="text-stone-600 block mb-1 font-semibold">Category Tag</label>
                <select
                  value={newMediaCategory}
                  onChange={(e) => setNewMediaCategory(e.target.value as any)}
                  className="w-full bg-white border border-stone-300 rounded-lg p-2"
                >
                  <option value="BALLROOM">Ballroom / Hall</option>
                  <option value="GARDEN_LAWN">Garden & Lawn</option>
                  <option value="STAGE_MANDAP">Stage & Mandap</option>
                  <option value="FOOD_BUFFET">Food Buffet</option>
                  <option value="DRONE_AERIAL">Drone Aerial</option>
                  <option value="VIP_LOUNGE">VIP Suite</option>
                  <option value="GENERAL">General Property</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-stone-600 block mb-1 font-semibold">Media Link / URL *</label>
                <input
                  type="url"
                  required
                  value={newMediaUrl}
                  onChange={(e) => setNewMediaUrl(e.target.value)}
                  placeholder={
                    newMediaType === 'PHOTO'
                      ? 'https://images.unsplash.com/...'
                      : 'https://www.youtube.com/watch?v=...'
                  }
                  className="w-full bg-white border border-stone-300 rounded-lg p-2 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-stone-600 block mb-1 font-semibold">Media Title</label>
                <input
                  type="text"
                  value={newMediaTitle}
                  onChange={(e) => setNewMediaTitle(e.target.value)}
                  placeholder="e.g. Grand Kailash Ballroom Evening Ambiance"
                  className="w-full bg-white border border-stone-300 rounded-lg p-2"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-stone-600 block mb-1 font-semibold">Caption / Details</label>
                <input
                  type="text"
                  value={newMediaCaption}
                  onChange={(e) => setNewMediaCaption(e.target.value)}
                  placeholder="e.g. Accommodates up to 900 guests with central air conditioning"
                  className="w-full bg-white border border-stone-300 rounded-lg p-2"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Gallery</span>
              </button>
            </div>
          </form>

          {/* Media Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {mediaList.map((media) => (
              <div
                key={media.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs group flex flex-col justify-between"
              >
                <div className="relative h-44 bg-stone-900 overflow-hidden">
                  {media.type === 'PHOTO' ? (
                    <img src={media.url} alt={media.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center text-white relative">
                      {media.thumbnailUrl && (
                        <img src={media.thumbnailUrl} alt={media.title} className="absolute inset-0 w-full h-full object-cover opacity-40" />
                      )}
                      <div className="relative z-10">
                        <Video className="w-10 h-10 text-amber-400 mx-auto mb-1 drop-shadow" />
                        <span className="text-xs font-bold block drop-shadow line-clamp-1">{media.title}</span>
                      </div>
                    </div>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-900/80 text-white uppercase backdrop-blur-xs">
                      {media.type}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-900/80 text-white backdrop-blur-xs">
                      {media.category}
                    </span>
                  </div>

                  {media.isCover && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white shadow">
                      Cover Photo
                    </span>
                  )}
                </div>

                <div className="p-3.5 space-y-2">
                  <div className="font-bold text-xs text-stone-900 line-clamp-1">{media.title}</div>
                  {media.caption && (
                    <p className="text-[11px] text-stone-500 line-clamp-2">{media.caption}</p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                    <div className="flex items-center gap-2">
                      {media.type === 'PHOTO' ? (
                        <button
                          onClick={() => handleSetCoverPhoto(media.id)}
                          className={`text-[11px] font-semibold ${
                            media.isCover ? 'text-emerald-700' : 'text-stone-500 hover:text-stone-900'
                          }`}
                        >
                          {media.isCover ? '✓ Main Cover' : 'Set as Cover'}
                        </button>
                      ) : (
                        <button
                          onClick={() => setActiveVideoModal(media)}
                          className="text-[11px] font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Play</span>
                        </button>
                      )}
                      <button
                        onClick={() => setEditingMediaItem(media)}
                        className="text-[11px] font-semibold text-stone-500 hover:text-amber-900 flex items-center gap-0.5"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveMedia(media.id)}
                      className="text-stone-400 hover:text-red-700 p-1"
                      title="Delete media"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Media Modal */}
          {editingMediaItem && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <form
                onSubmit={handleSaveEditedMedia}
                className="bg-white rounded-2xl border border-stone-200 max-w-md w-full p-6 space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <h4 className="font-bold text-sm text-stone-900">Edit Photo / Video Details</h4>
                  <button
                    type="button"
                    onClick={() => setEditingMediaItem(null)}
                    className="text-stone-400 hover:text-stone-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-stone-600 block mb-1 font-semibold">Title</label>
                    <input
                      type="text"
                      required
                      value={editingMediaItem.title || ''}
                      onChange={(e) => setEditingMediaItem({ ...editingMediaItem, title: e.target.value })}
                      className="w-full bg-white border border-stone-300 rounded-lg p-2"
                    />
                  </div>

                  <div>
                    <label className="text-stone-600 block mb-1 font-semibold">Category Tag</label>
                    <select
                      value={editingMediaItem.category || 'BALLROOM'}
                      onChange={(e) => setEditingMediaItem({ ...editingMediaItem, category: e.target.value as any })}
                      className="w-full bg-white border border-stone-300 rounded-lg p-2"
                    >
                      <option value="BALLROOM">Ballroom / Hall</option>
                      <option value="GARDEN_LAWN">Garden & Lawn</option>
                      <option value="STAGE_MANDAP">Stage & Mandap</option>
                      <option value="FOOD_BUFFET">Food Buffet</option>
                      <option value="DRONE_AERIAL">Drone Aerial</option>
                      <option value="VIP_LOUNGE">VIP Suite</option>
                      <option value="GENERAL">General Property</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-stone-600 block mb-1 font-semibold">Caption</label>
                    <textarea
                      rows={2}
                      value={editingMediaItem.caption || ''}
                      onChange={(e) => setEditingMediaItem({ ...editingMediaItem, caption: e.target.value })}
                      className="w-full bg-white border border-stone-300 rounded-lg p-2"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setEditingMediaItem(null)}
                    className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-600 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-amber-900 text-white text-xs font-semibold shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: SPECIAL OFFERS & DISCOUNTS MANAGER */}
      {activeTab === 'OFFERS' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-amber-800" />
                <h3 className="text-lg font-bold text-stone-900">
                  Venue Discounts, Promotions & Special Offers
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Provide discounts, early-bird Muhurat deals, and complimentary amenities. Active offers appear prominently as promotional ribbons on your venue catalog card and in the search filters.
              </p>
            </div>

            <button
              onClick={() => setShowAddOffer(!showAddOffer)}
              className="px-4 py-2 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Special Offer</span>
            </button>
          </div>

          {/* Add Offer Form */}
          {showAddOffer && (
            <form
              onSubmit={handleCreateOffer}
              className="p-5 bg-gradient-to-br from-amber-50/80 via-white to-amber-50/50 rounded-2xl border border-amber-200 space-y-4 animate-in fade-in"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-900" />
                  <span className="font-bold text-xs text-amber-950 uppercase tracking-wide">
                    Configure New Promotional Discount / Offer
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddOffer(false)}
                  className="text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-stone-700 block mb-1 font-semibold">Offer Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={newOfferTitle}
                    onChange={(e) => setNewOfferTitle(e.target.value)}
                    placeholder="e.g. Mangsir Vivah Subha Muhurat: 15% OFF"
                    className="w-full bg-white border border-stone-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="text-stone-700 block mb-1 font-semibold">Nepali Title</label>
                  <input
                    type="text"
                    value={newOfferNepali}
                    onChange={(e) => setNewOfferNepali(e.target.value)}
                    placeholder="उदा: मंसिर विवाह शुभ मुहूर्त: १५% छुट"
                    className="w-full bg-white border border-stone-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="text-stone-700 block mb-1 font-semibold">
                    Catalog Card Badge Ribbon Text *
                  </label>
                  <input
                    type="text"
                    required
                    value={newOfferBadge}
                    onChange={(e) => setNewOfferBadge(e.target.value)}
                    placeholder="e.g. ⚡ 15% OFF or 🎁 Free Mandap"
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 font-bold text-amber-900"
                  />
                </div>

                <div>
                  <label className="text-stone-700 block mb-1 font-semibold">Discount Type</label>
                  <select
                    value={newOfferType}
                    onChange={(e) => setNewOfferType(e.target.value as any)}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2"
                  >
                    <option value="PERCENTAGE">Percentage (%) Off</option>
                    <option value="FLAT_AMOUNT">Flat Amount (NPR) Off</option>
                    <option value="COMPLIMENTARY_ADDON">Complimentary Add-On (Worth Rs.)</option>
                  </select>
                </div>

                <div>
                  <label className="text-stone-700 block mb-1 font-semibold">
                    {newOfferType === 'PERCENTAGE'
                      ? 'Discount Percentage (%) *'
                      : 'Amount / Worth in NPR *'}
                  </label>
                  <input
                    type="number"
                    required
                    value={newOfferValue}
                    onChange={(e) => setNewOfferValue(Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-stone-700 block mb-1 font-semibold">Promotional Promo Code *</label>
                  <input
                    type="text"
                    required
                    value={newOfferPromo}
                    onChange={(e) => setNewOfferPromo(e.target.value.toUpperCase())}
                    placeholder="e.g. VIVAHA15"
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 font-mono font-bold uppercase"
                  />
                </div>

                <div>
                  <label className="text-stone-700 block mb-1 font-semibold">Valid Until (Bikram Sambat)</label>
                  <input
                    type="text"
                    value={newOfferValidBS}
                    onChange={(e) => setNewOfferValidBS(e.target.value)}
                    placeholder="e.g. 2081 Poush 30"
                    className="w-full bg-white border border-stone-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="text-stone-700 block mb-1 font-semibold">Minimum Guest Requirement</label>
                  <input
                    type="number"
                    value={newOfferMinGuests}
                    onChange={(e) => setNewOfferMinGuests(Number(e.target.value))}
                    placeholder="e.g. 250"
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 font-mono"
                  />
                </div>

                <div>
                  <label className="text-stone-700 block mb-1 font-semibold">Live Badge Preview</label>
                  <div className="p-2 bg-stone-100 rounded-lg border border-stone-200 flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-amber-500 text-stone-950 font-bold text-[11px] rounded shadow-xs">
                      {newOfferBadge}
                    </span>
                    <span className="font-mono text-[10px] text-stone-600 font-bold">{newOfferPromo}</span>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label className="text-stone-700 block mb-1 font-semibold">Offer Terms & Description</label>
                  <textarea
                    rows={2}
                    value={newOfferDesc}
                    onChange={(e) => setNewOfferDesc(e.target.value)}
                    placeholder="Detailed conditions, applicable menus, advance reservation deadlines..."
                    className="w-full bg-white border border-stone-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-amber-200">
                <button
                  type="button"
                  onClick={() => setShowAddOffer(false)}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-600 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-900 text-white text-xs font-bold shadow-xs hover:bg-amber-950"
                >
                  Publish Offer Live on Marketplace
                </button>
              </div>
            </form>
          )}

          {/* List of Offers */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
              Active & Configured Offers ({offersList.length}):
            </span>

            {offersList.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-xs">
                No active promotional offers right now. Click "Create New Special Offer" above to attract more bookings!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {offersList.map((offer) => (
                  <div
                    key={offer.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                      offer.isActive
                        ? 'bg-gradient-to-br from-amber-50/60 via-white to-stone-50 border-amber-300 shadow-xs'
                        : 'bg-stone-50 border-stone-200 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-amber-500 text-stone-950 font-bold text-xs rounded-lg shadow-xs">
                            {offer.badgeText}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-stone-100 text-stone-800 border border-stone-200">
                            {offer.promoCode}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleOffer(offer.id)}
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                              offer.isActive
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-stone-200 text-stone-600'
                            }`}
                          >
                            {offer.isActive ? 'Active Live' : 'Paused'}
                          </button>
                          <button
                            onClick={() => handleDeleteOffer(offer.id)}
                            className="text-stone-400 hover:text-red-700 p-1"
                            title="Delete offer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-bold text-sm text-stone-900 mt-3">{offer.title}</h4>
                      {offer.nepaliTitle && (
                        <p className="text-xs text-stone-500">{offer.nepaliTitle}</p>
                      )}
                      <p className="text-xs text-stone-600 mt-2 leading-relaxed">{offer.description}</p>
                    </div>

                    <div className="pt-3 border-t border-stone-200/60 mt-4 flex items-center justify-between text-xs text-stone-500">
                      <span>Valid until: <strong>{offer.validUntilBS}</strong></span>
                      {offer.minGuests && (
                        <span>Min: <strong>{offer.minGuests} Guests</strong></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 7: KYC DOCUMENTS & VENUE FACILITY INSPECTION PHOTOS */}
      {activeTab === 'KYC_VERIFICATION' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="text-lg font-bold text-stone-900">
                  Venue KYC Compliance & Physical Facility Inspection Photos
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Upload your legal registration certificates and physical venue inspection photos (Exterior Entrance, Kitchen, Fire Exits, Genset Power Backup). Editable anytime by venue operators.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>KYC Status: {kycData.status || 'VERIFIED'}</span>
              </span>
            </div>
          </div>

          {/* Legal Business Information Form */}
          <form onSubmit={handleSaveKyc} className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
            <span className="text-xs font-bold text-stone-900 uppercase tracking-wide block">
              1. Business Registration & Tax Identification
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-stone-700 block mb-1 font-semibold">
                  Permanent Account Number (PAN / VAT) *
                </label>
                <input
                  type="text"
                  required
                  value={editingPanNumber}
                  onChange={(e) => setEditingPanNumber(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg p-2.5 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-stone-700 block mb-1 font-semibold">
                  Company / DDC / Municipality Registration No. *
                </label>
                <input
                  type="text"
                  required
                  value={editingRegNumber}
                  onChange={(e) => setEditingRegNumber(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg p-2.5 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Save Legal Registration
              </button>
            </div>
          </form>

          {/* Facility Inspection Photos Upload & Gallery */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wide block">
                  2. Physical Venue Inspection Photos ({kycData.verificationPhotos?.length || 0})
                </span>
                <p className="text-xs text-stone-500">
                  Required by municipal and celebration safety standards.
                </p>
              </div>
            </div>

            {/* Add Facility Photo Form */}
            <form onSubmit={handleAddKycPhoto} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <span className="text-xs font-bold text-stone-800 block">
                + Upload Facility Verification Photo:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-stone-600 block mb-1 font-semibold">Facility Category</label>
                  <select
                    value={newKycPhotoCategory}
                    onChange={(e) => setNewKycPhotoCategory(e.target.value as any)}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2"
                  >
                    <option value="EXTERIOR_ENTRANCE">Main Exterior Entrance & Security Gate</option>
                    <option value="MAIN_HALL">Main Ballroom & Ventilation</option>
                    <option value="KITCHEN_HYGIENE">Commercial Kitchen & Hygiene Facility</option>
                    <option value="POWER_BACKUP_GENSET">Silent Diesel Backup Generator</option>
                    <option value="FIRE_SAFETY_EXIT">Fire Extinguisher & Emergency Exits</option>
                  </select>
                </div>

                <div>
                  <label className="text-stone-600 block mb-1 font-semibold">Inspection Photo URL *</label>
                  <input
                    type="url"
                    required
                    value={newKycPhotoUrl}
                    onChange={(e) => setNewKycPhotoUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 font-mono"
                  />
                </div>

                <div>
                  <label className="text-stone-600 block mb-1 font-semibold">Title / Description</label>
                  <input
                    type="text"
                    value={newKycPhotoTitle}
                    onChange={(e) => setNewKycPhotoTitle(e.target.value)}
                    placeholder="e.g. 125 kVA Silent Cummins Generator"
                    className="w-full bg-white border border-stone-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-950 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Attach to KYC Dossier
                </button>
              </div>
            </form>

            {/* Uploaded Photos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(kycData.verificationPhotos || []).map((photo) => (
                <div
                  key={photo.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs group flex flex-col justify-between"
                >
                  <div className="relative h-40 bg-stone-900 overflow-hidden">
                    <img src={photo.url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-stone-900/80 text-white uppercase backdrop-blur-xs">
                      {photo.category.replace(/_/g, ' ')}
                    </div>
                  </div>
                  <div className="p-3 space-y-1">
                    <span className="font-bold text-xs text-stone-900 block truncate">{photo.title}</span>
                    <span className="text-[10px] text-stone-400 block">Uploaded on {photo.uploadedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: EVENT MANAGEMENT POLICY (IN-HOUSE VS OUTSIDE ALLOWED) */}
      {activeTab === 'EVENT_POLICY' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 max-w-2xl mx-auto space-y-6 shadow-sm">
          <div className="border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-800" />
              <h3 className="text-lg font-bold text-stone-900">
                {language === 'ne' ? 'इभेन्ट म्यानेजमेन्ट तथा बाह्य आयोजक नीति' : 'Event Management & Outside Planner Policy'}
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {language === 'ne'
                ? 'तपाईं आफैं इभेन्ट व्यवस्थापन गर्नुहुन्छ वा बाहिरका इभेन्ट अर्गनाइजर कम्पनीहरूलाई अनुमति दिनुहुन्छ? स्पष्ट नीति तोक्नुहोस्।'
                : 'Indicate whether your venue performs event management in-house or welcomes outside event management companies.'}
            </p>
          </div>

          <form onSubmit={handleSavePolicy} className="space-y-4 text-xs">
            {/* Policy Type Selection */}
            <div>
              <label className="font-bold text-stone-800 block mb-2 uppercase tracking-wider text-[11px]">
                Event Management Operations Model:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    type: 'IN_HOUSE_ONLY',
                    title: 'In-House Only',
                    desc: 'Venue team handles all decor, sound, and coordination exclusively. Outside planners not permitted.',
                  },
                  {
                    type: 'OUTSIDE_ALLOWED',
                    title: 'Outside Allowed',
                    desc: 'Fully open to external event management agencies and decorators with transparent guidelines.',
                  },
                  {
                    type: 'HYBRID_BOTH',
                    title: 'Hybrid / Both',
                    desc: 'In-house team available, but clients are also welcome to bring their own certified external planners.',
                  },
                ].map((opt) => (
                  <div
                    key={opt.type}
                    onClick={() =>
                      setEventPolicy({
                        ...eventPolicy,
                        policyType: opt.type as EventManagementPolicyType,
                        allowsOutsideOrganizers: opt.type !== 'IN_HOUSE_ONLY',
                      })
                    }
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      eventPolicy.policyType === opt.type
                        ? 'bg-amber-50 border-amber-900 ring-1 ring-amber-900 text-amber-950 shadow-xs'
                        : 'bg-white border-stone-200 hover:border-stone-300 text-stone-600'
                    }`}
                  >
                    <span className="font-bold text-xs block mb-1">{opt.title}</span>
                    <p className="text-[11px] leading-relaxed text-stone-500">{opt.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* In-house services description */}
            <div>
              <label className="font-semibold text-stone-700 block mb-1">
                In-House Team Scope & Provided Services:
              </label>
              <textarea
                rows={2}
                value={eventPolicy.inHouseServicesDescription}
                onChange={(e) => setEventPolicy({ ...eventPolicy, inHouseServicesDescription: e.target.value })}
                placeholder="e.g. Master banquet setup, mandap carpentry, floral arch, and resident sound engineering team."
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-900"
              />
            </div>

            {/* Outside Organizer rules (if allowed) */}
            {eventPolicy.allowsOutsideOrganizers && (
              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/80 space-y-3">
                <span className="font-bold text-xs text-amber-950 block">
                  Outside Event Management Agency Rules & Specs:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-stone-600 block mb-1 font-semibold">
                      Outside Planner Fee / Royalty (NPR, 0 if Free)
                    </label>
                    <input
                      type="number"
                      value={eventPolicy.outsideOrganizerFeeNpr || 0}
                      onChange={(e) => setEventPolicy({ ...eventPolicy, outsideOrganizerFeeNpr: Number(e.target.value) })}
                      className="w-full bg-white border border-stone-300 rounded-lg p-2 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-stone-600 block mb-1 font-semibold">
                      Refundable Security Deposit (NPR)
                    </label>
                    <input
                      type="number"
                      value={eventPolicy.refundableSecurityDepositNpr || 0}
                      onChange={(e) =>
                        setEventPolicy({ ...eventPolicy, refundableSecurityDepositNpr: Number(e.target.value) })
                      }
                      className="w-full bg-white border border-stone-300 rounded-lg p-2 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-stone-600 block mb-1 font-semibold">
                      Sound Curfew Limit (Municipal Decibels)
                    </label>
                    <input
                      type="text"
                      value={eventPolicy.soundCurfewTime || '10:30 PM'}
                      onChange={(e) => setEventPolicy({ ...eventPolicy, soundCurfewTime: e.target.value })}
                      placeholder="e.g. 10:30 PM"
                      className="w-full bg-white border border-stone-300 rounded-lg p-2 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-stone-600 block mb-1 font-semibold">
                      Generator Load Allocation for Production (kW)
                    </label>
                    <input
                      type="number"
                      value={eventPolicy.powerLoadCapacityKw || 60}
                      onChange={(e) => setEventPolicy({ ...eventPolicy, powerLoadCapacityKw: Number(e.target.value) })}
                      className="w-full bg-white border border-stone-300 rounded-lg p-2 font-mono font-bold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-stone-600 block mb-1 font-semibold">
                      Operational Guidelines for External Planners
                    </label>
                    <textarea
                      rows={2}
                      value={eventPolicy.outsideOrganizerGuidelines || ''}
                      onChange={(e) => setEventPolicy({ ...eventPolicy, outsideOrganizerGuidelines: e.target.value })}
                      placeholder="e.g. Single-line electrical diagram required 7 days prior. Rigging points must use approved clamps."
                      className="w-full bg-white border border-stone-300 rounded-lg p-2"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold text-white bg-amber-900 hover:bg-amber-950 rounded-xl transition-colors shadow flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Event Management Policy Live</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 7: ADVANCED RECHARTS ANALYTICS & MARKET INTELLIGENCE */}
      {activeTab === 'ANALYTICS' && (
        <VenueAnalytics
          venue={myVenue}
          bookings={venueBookings}
          negotiations={venueNegotiations}
        />
      )}

      {/* Video Modal Preview */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
              <span className="font-bold text-xs">{activeVideoModal.title}</span>
              <button onClick={() => setActiveVideoModal(null)} className="text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 text-center space-y-3 bg-stone-950 text-white">
              <Video className="w-12 h-12 text-amber-400 mx-auto" />
              <p className="text-xs text-stone-300 font-mono">{activeVideoModal.url}</p>
              <a
                href={activeVideoModal.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow transition-colors"
              >
                <span>Watch on External Player</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Legal Contract & Quotation PDF Generator Modal */}
      <LegalContractQuotationGenerator
        isOpen={isLegalPdfOpen}
        onClose={() => setIsLegalPdfOpen(false)}
        initialVenueData={{
          venueName: myVenue.name,
          panNumber: myVenue.panNumber,
          contactPerson: myVenue.contactPerson,
          phone: myVenue.phone,
          email: myVenue.email,
          address: `${myVenue.locality}, ${myVenue.district}, ${myVenue.province}`,
          cateringStartingNpr: myVenue.cateringStartingNpr,
          baseRentalStartingNpr: myVenue.baseRentalStartingNpr,
        }}
      />

    </div>
  );
};

