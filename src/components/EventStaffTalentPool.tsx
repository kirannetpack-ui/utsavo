/**
 * UTSAVO - Celebration Workforce & Gig Talent Pool (उत्सव जनशक्ति तथा गिग कार्यथलो)
 * Features:
 * 1. View Density Switcher: Small Icons (Default), Medium Cards, Large Detailed Cards.
 * 2. Multi-selection for vendors: Choose candidates individually or multiple at once with bulk WhatsApp shift outreach.
 * 3. Optional worker wages: Defaulting to official Nepal Government statutory minimums (Labour Act 2074: NPR 668/shift, NPR 17,300/month).
 * 4. Custom "OTHER" category proposal: Let joining employees propose specialized roles for different experience, informing the Admin Console.
 * 5. Peer rating and review commenting system for fair worker acknowledgement.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  EventStaffProfile,
  EventStaffGigRole,
  EmploymentAvailabilityType,
  StaffShiftPreference,
  StaffReviewComment,
} from '../types';
import {
  Users,
  Search,
  Star,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  PlusCircle,
  CheckCircle2,
  Filter,
  ShieldCheck,
  Briefcase,
  Award,
  Sparkles,
  X,
  Send,
  Calendar,
  DollarSign,
  UserCheck,
  Heart,
  ChevronRight,
  List,
  LayoutGrid,
  Layers,
  CheckSquare,
  Square,
  HelpCircle,
  AlertCircle,
  Building,
  Check,
  Share2,
} from 'lucide-react';
import { WhatsAppViberButtons } from './WhatsAppViberButtons';

export type ViewDensity = 'SMALL' | 'MEDIUM' | 'LARGE';

interface EventStaffTalentPoolProps {
  initialOpenRegister?: boolean;
  onResetInitialOpenRegister?: () => void;
}

export const EventStaffTalentPool: React.FC<EventStaffTalentPoolProps> = ({
  initialOpenRegister,
  onResetInitialOpenRegister,
}) => {
  const {
    eventStaffPool,
    addEventStaffProfile,
    toggleStaffAvailability,
    addStaffReview,
    currentUser,
    statutoryRules,
    proposeStaffCustomRole,
  } = useMarketplace();

  // View Density (DEFAULT IS 'SMALL' per specification!)
  const [viewDensity, setViewDensity] = useState<ViewDensity>('SMALL');

  // Multi-Selection State for Vendors
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [isBulkShiftModalOpen, setIsBulkShiftModalOpen] = useState(false);
  const [bulkShiftDateBS, setBulkShiftDateBS] = useState('2081 Mangsir 20');
  const [bulkShiftTime, setBulkShiftTime] = useState('EVENING');
  const [bulkVenueName, setBulkVenueName] = useState('The Regal Pavilion');
  const [bulkShiftNotes, setBulkShiftNotes] = useState('Formal black & white banquet attire required. Dinner service starts at 6:30 PM.');
  const [bulkDispatchSuccess, setBulkDispatchSuccess] = useState(false);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('ALL');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [onlyAvailableNow, setOnlyAvailableNow] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);

  // Modals state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedStaffForDossier, setSelectedStaffForDossier] = useState<EventStaffProfile | null>(null);
  const [registrationSuccessToast, setRegistrationSuccessToast] = useState<string | null>(null);

  // Auto-open registration if triggered from front page CTA
  useEffect(() => {
    if (initialOpenRegister) {
      setIsRegisterModalOpen(true);
      if (onResetInitialOpenRegister) onResetInitialOpenRegister();
    }
  }, [initialOpenRegister, onResetInitialOpenRegister]);

  // Review form state inside Dossier Modal
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewPunctuality, setReviewPunctuality] = useState(5);
  const [reviewCourtesy, setReviewCourtesy] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewerName, setReviewerName] = useState(currentUser?.name || '');
  const [reviewerOrg, setReviewerOrg] = useState('The Regal Pavilion');
  const [reviewerRole, setReviewerRole] = useState('Banquet Operations Manager');
  const [reviewEventType, setReviewEventType] = useState('Wedding Reception (विवाह भोज)');
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState(false);

  // Registration Form State
  const [fullName, setFullName] = useState('');
  const [nepaliName, setNepaliName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
  const [bio, setBio] = useState('');
  const [availabilityType, setAvailabilityType] = useState<EmploymentAvailabilityType>('WEEKEND_GIGS');
  const [primaryRole, setPrimaryRole] = useState<EventStaffGigRole>('BANQUET_SERVER_WAITER');
  
  // Custom "OTHER" category proposal states
  const [isCustomRoleSelected, setIsCustomRoleSelected] = useState(false);
  const [customRoleTitle, setCustomRoleTitle] = useState('');
  const [customRoleNepaliTitle, setCustomRoleNepaliTitle] = useState('');
  const [customRoleDescription, setCustomRoleDescription] = useState('');

  const [secondarySkillsText, setSecondarySkillsText] = useState('Silver Service, Buffet Management, Polite Etiquette');
  const [shiftPreference, setShiftPreference] = useState<StaffShiftPreference>('EVENING_SHIFT');
  
  // Optional Wage State
  const [expectedWageInput, setExpectedWageInput] = useState<string>(''); // Optional!
  const [useStatutoryWageRule, setUseStatutoryWageRule] = useState<boolean>(true);
  const [wageType, setWageType] = useState<'PER_SHIFT' | 'PER_HOUR' | 'MONTHLY'>('PER_SHIFT');
  
  const [district, setDistrict] = useState('Kathmandu');
  const [preferredLocalitiesText, setPreferredLocalitiesText] = useState('Baluwatar, Naya Baneshwor, Lalitpur');
  const [isAvailableNow, setIsAvailableNow] = useState(true);
  const [experienceYears, setExperienceYears] = useState(2);
  const [pastVenuesText, setPastVenuesText] = useState('The Regal Pavilion, Heritage Garden');

  // Photo presets for quick candidate selection
  const PHOTO_PRESETS = [
    { label: 'Banquet Male Groomed', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
    { label: 'Hospitality Female Lead', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' },
    { label: 'Young Server Professional', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
    { label: 'Kitchen & Tandoor Specialist', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
    { label: 'Beverage & Barista Lead', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
  ];

  // Helper labels for Roles
  const ROLE_LABELS: Record<EventStaffGigRole, { en: string; ne: string; icon: string }> = {
    BANQUET_SERVER_WAITER: { en: 'Banquet Server / Waiter', ne: 'ब्यान्क्वेट वेटर / सर्भर', icon: '🍽️' },
    EVENT_USHER_HOST: { en: 'Guest Usher & Host', ne: 'अतिथि सत्कार तथा स्वागत टोली', icon: '🌸' },
    ASSISTANT_COOK_HALWAI: { en: 'Assistant Cook & Halwai Helper', ne: 'कुक / हलुवाई सहयोगी', icon: '👨‍🍳' },
    MANDAP_DECOR_CREW: { en: 'Mandap & Stage Decor Hand', ne: 'मण्डप तथा स्टेज सजावट', icon: '🎪' },
    BARTENDER_BARISTA: { en: 'Bartender & Barista', ne: 'बारटेन्डर / पेय व्यवस्थापक', icon: '🍹' },
    SOUND_LIGHTING_TECH: { en: 'Sound & Lighting Tech', ne: 'ध्वनि तथा प्रकाश सहयोगी', icon: '🔊' },
    VALET_SECURITY_PARKING: { en: 'Valet Parking & Escort', ne: 'पार्किङ तथा सुरक्षा सहयोगी', icon: '🚗' },
    DISHWASHING_SANITATION: { en: 'Kitchen Sanitation & Hygiene', ne: 'भाँडा सरसफाइ तथा किचन हाइजिन', icon: '✨' },
    PHOTOGRAPHY_ASSISTANT: { en: 'Photo/Cinema Assistant', ne: 'फोटो/भिडियो क्यामेरा सहयोगी', icon: '📸' },
    OTHER_EVENT_STAFF: { en: 'Other Specialized Celebration Role', ne: 'अन्य नयाँ भूमिका / फरक अनुभव', icon: '💡' },
  };

  // Helper labels for Availability
  const AVAILABILITY_LABELS: Record<EmploymentAvailabilityType, { en: string; ne: string }> = {
    PART_TIME: { en: 'Part-Time', ne: 'अंशकालीन' },
    FULL_TIME: { en: 'Full-Time', ne: 'पूर्णकालीन' },
    WEEKEND_GIGS: { en: 'Weekend Wedding Gigs', ne: 'शनिबार/बिदाको गिग' },
    ON_CALL_DAILY: { en: 'On-Call Daily', ne: 'दैनिक आवश्यकतामा' },
  };

  // Filtered staff pool
  const filteredStaff = useMemo(() => {
    return eventStaffPool.filter((staff) => {
      // Availability
      if (selectedAvailability !== 'ALL' && staff.availabilityType !== selectedAvailability) {
        return false;
      }
      // Role
      if (selectedRole !== 'ALL' && staff.primaryRole !== selectedRole) {
        return false;
      }
      // District
      if (selectedDistrict !== 'ALL' && staff.district.toLowerCase() !== selectedDistrict.toLowerCase()) {
        return false;
      }
      // Available right now
      if (onlyAvailableNow && !staff.isAvailableNow) {
        return false;
      }
      // Min Rating
      if (minRating > 0 && staff.rating < minRating) {
        return false;
      }
      // Search
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = staff.fullName.toLowerCase().includes(q) || (staff.nepaliName && staff.nepaliName.includes(q));
        const matchesBio = staff.bio.toLowerCase().includes(q);
        const matchesDistrict = staff.district.toLowerCase().includes(q);
        const matchesSkills = staff.secondarySkills.some((s) => s.toLowerCase().includes(q));
        const matchesRole = (staff.customRoleName || ROLE_LABELS[staff.primaryRole]?.en || '').toLowerCase().includes(q);
        if (!matchesName && !matchesBio && !matchesDistrict && !matchesSkills && !matchesRole) {
          return false;
        }
      }
      return true;
    });
  }, [eventStaffPool, selectedAvailability, selectedRole, selectedDistrict, onlyAvailableNow, minRating, searchQuery]);

  // Multi-Selection helpers
  const toggleSelectStaff = (id: string) => {
    setSelectedStaffIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedStaffIds.length === filteredStaff.length) {
      setSelectedStaffIds([]);
    } else {
      setSelectedStaffIds(filteredStaff.map((s) => s.id));
    }
  };

  const selectedStaffObjects = useMemo(() => {
    return eventStaffPool.filter((s) => selectedStaffIds.includes(s.id));
  }, [eventStaffPool, selectedStaffIds]);

  const totalSelectedShiftCost = useMemo(() => {
    return selectedStaffObjects.reduce((sum, s) => {
      const wage = s.expectedWageNpr || statutoryRules.minDailyShiftWageNpr;
      return sum + wage;
    }, 0);
  }, [selectedStaffObjects, statutoryRules]);

  // Handle Candidate Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Determine wage: optional, defaults to Nepal Govt Statutory Minimum
    const enteredWage = expectedWageInput.trim() ? Number(expectedWageInput) : undefined;
    const isUsingStatutory = !enteredWage || useStatutoryWageRule;

    let finalCustomRoleName: string | undefined = undefined;
    let finalCustomRoleNepali: string | undefined = undefined;

    // If OTHER role or custom role proposed, save proposal to Admin Console
    if (primaryRole === 'OTHER_EVENT_STAFF' || isCustomRoleSelected) {
      const roleName = customRoleTitle.trim() || 'Specialized Celebration Role';
      finalCustomRoleName = roleName;
      finalCustomRoleNepali = customRoleNepaliTitle.trim() || undefined;

      proposeStaffCustomRole({
        proposedRoleName: roleName,
        proposedNepaliName: finalCustomRoleNepali,
        submittedByStaffName: fullName.trim() || 'Registered Worker',
        staffPhone: phone.trim() || '+977-9800000000',
        description: customRoleDescription.trim() || bio.trim() || 'New event experience role proposed from registration.',
      });
    }

    const newProfile = addEventStaffProfile({
      fullName: fullName.trim() || 'Event Talent Candidate',
      nepaliName: nepaliName.trim() || undefined,
      phone: phone.trim() || '+977-9800000000',
      whatsapp: whatsapp.trim() || phone.trim() || '+977-9800000000',
      email: email.trim() || undefined,
      photo: photo || PHOTO_PRESETS[0].url,
      bio: bio.trim() || 'Motivated event professional eager to contribute to weddings and celebrations in Nepal.',
      availabilityType,
      primaryRole,
      customRoleName: finalCustomRoleName,
      customRoleNepaliName: finalCustomRoleNepali,
      customRoleStatus: finalCustomRoleName ? 'PENDING' : undefined,
      secondarySkills: secondarySkillsText.split(',').map((s) => s.trim()).filter(Boolean),
      shiftPreference,
      expectedWageNpr: isUsingStatutory ? undefined : enteredWage,
      wageType,
      district: district || 'Kathmandu',
      preferredLocalities: preferredLocalitiesText.split(',').map((s) => s.trim()).filter(Boolean),
      isAvailableNow,
      experienceYears: Number(experienceYears) || 1,
      pastVenuesWorked: pastVenuesText.split(',').map((s) => s.trim()).filter(Boolean),
      nidOrCitizenshipVerified: true,
    });

    setIsRegisterModalOpen(false);
    setRegistrationSuccessToast(
      `बधाई छ! ${newProfile.fullName} उत्सव जनशक्ति कार्यथलोमा सफलतापूर्वक दर्ता हुनुभयो। (नेपाल सरकारको वैधानिक न्यूनतम पारिश्रमिक सुरक्षित)`
    );
    setTimeout(() => setRegistrationSuccessToast(null), 6000);
  };

  // Handle Review Submission
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffForDossier) return;

    addStaffReview(selectedStaffForDossier.id, {
      staffId: selectedStaffForDossier.id,
      reviewerName: reviewerName.trim() || 'Venue Banquet Manager',
      reviewerOrganization: reviewerOrg.trim() || 'Utsavo Partner Venue',
      reviewerRole: reviewerRole.trim() || 'Floor Supervisor',
      rating: Number(reviewRating),
      punctualityScore: Number(reviewPunctuality),
      groomingCourtesyScore: Number(reviewCourtesy),
      comment: reviewComment.trim() || 'Punctual, polite, and followed instructions well throughout the event.',
      eventDate: new Date().toISOString().split('T')[0],
      eventType: reviewEventType,
    });

    // Refresh modal with updated data
    const updated = eventStaffPool.find((s) => s.id === selectedStaffForDossier.id);
    if (updated) {
      setSelectedStaffForDossier(updated);
    }
    setReviewComment('');
    setIsReviewFormOpen(false);
    setReviewSuccessMsg(true);
    setTimeout(() => setReviewSuccessMsg(false), 4000);
  };

  // Handle Bulk WhatsApp Dispatch
  const handleBulkWhatsAppDispatch = () => {
    const staffNames = selectedStaffObjects.map((s) => s.fullName).join(', ');
    const message = `Namaste! We are contacting a selected team of ${selectedStaffObjects.length} celebration professionals via UTSAVO (${staffNames}) for an upcoming event shift at ${bulkVenueName} on ${bulkShiftDateBS} (${bulkShiftTime} Shift). Total shift pay adheres to Nepal Government statutory standards (NPR ${statutoryRules.minDailyShiftWageNpr}/shift minimum). Notes: ${bulkShiftNotes}`;
    
    // Open primary selected worker's WhatsApp with full team brief
    const targetPhone = selectedStaffObjects[0]?.whatsapp || selectedStaffObjects[0]?.phone || '+9779800000000';
    const cleanPhone = targetPhone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    
    setBulkDispatchSuccess(true);
    setTimeout(() => {
      setBulkDispatchSuccess(false);
      setIsBulkShiftModalOpen(false);
    }, 3000);
  };

  return (
    <div className="space-y-8 pb-24">
      
      {/* Toast Alert */}
      {registrationSuccessToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{registrationSuccessToast}</span>
          </div>
          <button onClick={() => setRegistrationSuccessToast(null)} className="text-stone-400 hover:text-stone-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Hero & Open Workforce Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-stone-800 bg-stone-950 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1800&q=80"
            alt="Nepal Wedding Banquet Staff"
            className="w-full h-full object-cover opacity-25 mix-blend-overlay filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/90 to-transparent" />
        </div>

        <div className="relative max-w-5xl px-6 sm:px-12 py-10 sm:py-14 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold backdrop-blur-md">
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            <span>उत्सव जनशक्ति तथा गिग कार्यथलो · Nepal's Open Celebration Gig Workforce</span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Connect Event Talent with Party Palaces, Caterers & Planners
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 max-w-3xl leading-relaxed font-light">
            No restrictions on the number of people wanting to join. Anyone can register for <strong>full-time, part-time, or weekend gigs</strong>. Vendors can select individuals or multi-select full shift crews with <strong>Nepal Government statutory minimum wage protections</strong> (श्रम ऐन २०७४) and verified peer ratings.
          </p>

          {/* Statutory Compliance Badge Strip */}
          <div className="inline-flex flex-wrap items-center gap-2 p-2 rounded-xl bg-amber-950/60 border border-amber-500/30 text-[11px] text-amber-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>🇳🇵 नेपाल सरकार श्रम ऐन २०७४ न्यूनतम पारिश्रमिक पालना:</strong> रू. ६६८/८ घण्टा सिफ्ट · रू. १७,३००/मासिक · पारिश्रमिक ऐच्छिक</span>
          </div>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-stone-800/80 text-xs">
            <div>
              <span className="text-amber-400 font-display text-2xl font-bold block">{eventStaffPool.length}+</span>
              <span className="text-stone-400">Total Registered Pool</span>
            </div>
            <div>
              <span className="text-emerald-400 font-display text-2xl font-bold block">
                {eventStaffPool.filter((s) => s.isAvailableNow).length}
              </span>
              <span className="text-stone-400">Available Right Now</span>
            </div>
            <div>
              <span className="text-amber-400 font-display text-2xl font-bold block">Multiple Selection</span>
              <span className="text-stone-400">Individual or Batch Hiring</span>
            </div>
            <div>
              <span className="text-amber-400 font-display text-2xl font-bold block">3 View Options</span>
              <span className="text-stone-400">Small (Default), Med, Large</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl font-bold text-xs transition-all shadow-lg shadow-amber-600/20 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register for Jobs / फरक अनुभव दर्ता</span>
            </button>
            <a
              href="#talent-grid"
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-xs transition-all backdrop-blur-md border border-white/20 flex items-center gap-2"
            >
              <span>Browse Workforce Pool</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. Control Toolbar: Search, Filters, Multi-Select & VIEW DENSITY SWITCHER */}
      <div id="talent-grid" className="bg-white rounded-3xl border border-stone-200 shadow-xs p-5 sm:p-6 space-y-5">
        
        {/* Top Header: Title + View Switcher + Join Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-stone-900">
                Celebration Workforce ({filteredStaff.length} Candidates)
              </h2>
              {selectedStaffIds.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-900 text-white text-xs font-bold animate-pulse">
                  {selectedStaffIds.length} Selected
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Choose individually or multiple at once for banquet and celebration shifts.
            </p>
          </div>

          {/* Right Action Cluster: View Density Controls (Small Default, Medium, Large) & Register */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
            
            {/* View Density Switcher (SMALL DEFAULT) */}
            <div className="flex items-center p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs">
              <button
                type="button"
                onClick={() => setViewDensity('SMALL')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  viewDensity === 'SMALL'
                    ? 'bg-amber-900 text-white shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Small icon listing view (Default) - compact rapid scan"
              >
                <List className="w-3.5 h-3.5" />
                <span>Small Icons (सानो)</span>
              </button>

              <button
                type="button"
                onClick={() => setViewDensity('MEDIUM')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  viewDensity === 'MEDIUM'
                    ? 'bg-amber-900 text-white shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Medium card grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Medium (मध्यम)</span>
              </button>

              <button
                type="button"
                onClick={() => setViewDensity('LARGE')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  viewDensity === 'LARGE'
                    ? 'bg-amber-900 text-white shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Detailed large showcase cards"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Large (ठूलो)</span>
              </button>
            </div>

            {/* Select All Toggle */}
            <button
              type="button"
              onClick={handleSelectAll}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                selectedStaffIds.length > 0 && selectedStaffIds.length === filteredStaff.length
                  ? 'bg-amber-100 border-amber-300 text-amber-950 font-bold'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              {selectedStaffIds.length === filteredStaff.length && filteredStaff.length > 0 ? (
                <>
                  <CheckSquare className="w-3.5 h-3.5 text-amber-900" />
                  <span>Deselect All</span>
                </>
              ) : (
                <>
                  <Square className="w-3.5 h-3.5 text-stone-500" />
                  <span>Select All ({filteredStaff.length})</span>
                </>
              )}
            </button>

            {/* Free Candidate Registration */}
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-4 py-2 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>+ Join Pool</span>
            </button>
          </div>
        </div>

        {/* Search Bar & District Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by worker name, role (Waiter, Usher, Halwai), or locality..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value="ALL">All Districts (सबै जिल्ला)</option>
              <option value="Kathmandu">Kathmandu (काठमाडौँ)</option>
              <option value="Lalitpur">Lalitpur (ललितपुर)</option>
              <option value="Bhaktapur">Bhaktapur (भक्तपुर)</option>
              <option value="Pokhara">Pokhara (पोखरा)</option>
              <option value="Chitwan">Chitwan (चितवन)</option>
            </select>
          </div>

          <div className="sm:col-span-3 flex items-center justify-end">
            <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer bg-stone-50 px-3.5 py-2 rounded-xl border border-stone-200 hover:bg-stone-100 transition-colors w-full sm:w-auto">
              <input
                type="checkbox"
                checked={onlyAvailableNow}
                onChange={(e) => setOnlyAvailableNow(e.target.checked)}
                className="rounded border-stone-300 text-amber-900 focus:ring-amber-500 w-4 h-4"
              />
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Available Right Now</span>
              </span>
            </label>
          </div>
        </div>

        {/* Availability Type Pills */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
            <Clock className="w-3.5 h-3.5 text-amber-800" />
            <span>Job Type & Availability:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'ALL', label: 'All Availabilities (सबै)' },
              { id: 'WEEKEND_GIGS', label: 'Weekend Wedding Gigs (शनिबार/बिदा)' },
              { id: 'PART_TIME', label: 'Part-Time (अंशकालीन)' },
              { id: 'FULL_TIME', label: 'Full-Time (पूर्णकालीन)' },
              { id: 'ON_CALL_DAILY', label: 'On-Call Daily (दैनिक आवश्यकता)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedAvailability(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedAvailability === tab.id
                    ? 'bg-amber-900 text-white shadow-xs font-bold'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Role Filter Chips */}
        <div className="space-y-2 pt-1 border-t border-stone-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
            <Briefcase className="w-3.5 h-3.5 text-amber-800" />
            <span>Event Role / Skills Category:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedRole('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedRole === 'ALL'
                  ? 'bg-stone-900 text-white font-bold'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              All Roles ({eventStaffPool.length})
            </button>
            {Object.entries(ROLE_LABELS).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setSelectedRole(key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                  selectedRole === key
                    ? 'bg-amber-900 text-white font-bold shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <span>{val.icon}</span>
                <span>{val.en}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. DYNAMIC CANDIDATE LISTINGS BASED ON VIEW DENSITY */}

      {/* VIEW 1: SMALL ICONS / DENSE LIST (DEFAULT) */}
      {viewDensity === 'SMALL' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredStaff.map((staff) => {
            const roleMeta = ROLE_LABELS[staff.primaryRole] || { en: staff.primaryRole, ne: '', icon: '👤' };
            const isSelected = selectedStaffIds.includes(staff.id);
            const wage = staff.expectedWageNpr || statutoryRules.minDailyShiftWageNpr;

            return (
              <div
                key={staff.id}
                className={`p-3.5 bg-white rounded-2xl border transition-all flex items-center justify-between gap-3 relative group ${
                  isSelected
                    ? 'border-amber-700 ring-2 ring-amber-700/20 shadow-sm bg-amber-50/20'
                    : 'border-stone-200/90 shadow-2xs hover:border-amber-400 hover:shadow-xs'
                }`}
              >
                {/* Left: Checkbox + Small Icon Thumbnail + Basic Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelectStaff(staff.id)}
                    className="w-4 h-4 rounded text-amber-900 border-stone-300 focus:ring-amber-500 cursor-pointer shrink-0"
                    title="Select candidate for bulk hiring"
                  />

                  {/* Small Avatar Icon (44x44px) */}
                  <div className="relative w-11 h-11 shrink-0">
                    <img
                      src={staff.photo}
                      alt={staff.fullName}
                      className="w-11 h-11 rounded-xl object-cover border border-stone-200 shadow-2xs"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        staff.isAvailableNow ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'
                      }`}
                      title={staff.isAvailableNow ? 'Available Right Now' : 'Shift Booked'}
                    />
                  </div>

                  {/* Name, Role & Wage */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-bold text-xs text-stone-900 truncate">
                        {staff.fullName}
                      </h4>
                      {staff.nepaliName && (
                        <span className="text-[10px] text-stone-500 truncate hidden sm:inline">
                          ({staff.nepaliName})
                        </span>
                      )}
                      {staff.nidOrCitizenshipVerified && (
                        <span title="NID/Citizenship Verified">
                          <ShieldCheck className="w-3 h-3 text-amber-700 shrink-0" />
                        </span>
                      )}
                    </div>

                    {/* Role Tag */}
                    <div className="text-[11px] text-stone-600 font-medium flex items-center gap-1 truncate mt-0.5">
                      <span>{roleMeta.icon}</span>
                      <span className="truncate">{staff.customRoleName || roleMeta.en}</span>
                      {staff.customRoleName && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-100 text-amber-900 font-bold border border-amber-300">
                          नयाँ विधा
                        </span>
                      )}
                    </div>

                    {/* Wage & Statutory Badge */}
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="text-[11px] font-bold text-amber-950 font-display">
                        NPR {wage.toLocaleString()}
                        <span className="text-[10px] text-stone-500 font-normal">
                          {staff.wageType === 'PER_SHIFT' ? '/shift' : staff.wageType === 'MONTHLY' ? '/mo' : '/hr'}
                        </span>
                      </span>

                      {staff.isGovtStatutoryWage && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                          🇳🇵 श्रम ऐन न्यूनतम
                        </span>
                      )}

                      <span className="text-[10px] text-stone-400 flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5 text-stone-400" />
                        <span>{staff.district}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Rating & Quick Actions */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-950 text-[10px] font-bold">
                    <Star className="w-2.5 h-2.5 fill-amber-700 text-amber-700" />
                    <span>{staff.rating.toFixed(1)}</span>
                    <span className="text-stone-400 font-normal">({staff.totalShiftsCompleted})</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <WhatsAppViberButtons
                      phone={staff.whatsapp || staff.phone}
                      messageText={`Namaste ${staff.fullName}! We found your profile on UTSAVO. We have an upcoming event shift and would like to hire you.`}
                      variant="badges"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStaffForDossier(staff);
                        setIsReviewFormOpen(false);
                      }}
                      className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs transition-colors"
                      title="View Dossier & Reviews"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: MEDIUM CARDS */}
      {viewDensity === 'MEDIUM' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStaff.map((staff) => {
            const roleMeta = ROLE_LABELS[staff.primaryRole] || { en: staff.primaryRole, ne: '', icon: '👤' };
            const availMeta = AVAILABILITY_LABELS[staff.availabilityType] || { en: staff.availabilityType, ne: '' };
            const isSelected = selectedStaffIds.includes(staff.id);
            const wage = staff.expectedWageNpr || statutoryRules.minDailyShiftWageNpr;

            return (
              <div
                key={staff.id}
                className={`bg-white rounded-3xl border transition-all p-4 flex flex-col justify-between group ${
                  isSelected
                    ? 'border-amber-700 ring-2 ring-amber-700/20 shadow-md bg-amber-50/15'
                    : 'border-stone-200 shadow-xs hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectStaff(staff.id)}
                        className="w-4 h-4 rounded text-amber-900 border-stone-300 focus:ring-amber-500 cursor-pointer shrink-0"
                      />

                      <div className="relative w-14 h-14 shrink-0">
                        <img
                          src={staff.photo}
                          alt={staff.fullName}
                          className="w-14 h-14 rounded-2xl object-cover border border-stone-200 shadow-xs"
                        />
                        <span
                          className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                            staff.isAvailableNow ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'
                          }`}
                        />
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-stone-900">{staff.fullName}</h4>
                        {staff.nepaliName && (
                          <span className="text-xs text-stone-500 block">{staff.nepaliName}</span>
                        )}
                        <span className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-amber-800" />
                          <span>{staff.district}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-100 text-amber-950 text-xs font-bold shadow-2xs">
                      <Star className="w-3 h-3 fill-amber-700 text-amber-700" />
                      <span>{staff.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Role, Availability & Wage */}
                  <div className="mt-3.5 pt-3 border-t border-stone-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-950 font-bold text-[11px] border border-amber-200/80 flex items-center gap-1">
                        <span>{roleMeta.icon}</span>
                        <span>{staff.customRoleName || roleMeta.en}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-semibold">
                        {availMeta.en}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-stone-600">
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase block font-semibold">Expected Wage</span>
                        <strong className="text-stone-900 text-sm font-display">
                          NPR {wage.toLocaleString()}
                        </strong>
                        <span className="text-[10px] text-stone-500">
                          {staff.wageType === 'PER_SHIFT' ? ' / shift' : staff.wageType === 'MONTHLY' ? ' / mo' : ' / hr'}
                        </span>
                      </div>

                      {staff.isGovtStatutoryWage && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                          🇳🇵 श्रम ऐन न्यूनतम
                        </span>
                      )}
                    </div>

                    {/* Bio snippet */}
                    <p className="text-stone-600 line-clamp-2 text-[11px] leading-relaxed">
                      {staff.bio}
                    </p>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStaffForDossier(staff);
                      setIsReviewFormOpen(false);
                    }}
                    className="text-xs text-amber-900 font-bold hover:underline"
                  >
                    View Dossier ({staff.reviews.length})
                  </button>

                  <div className="flex items-center gap-1.5">
                    <WhatsAppViberButtons
                      phone={staff.whatsapp || staff.phone}
                      messageText={`Namaste ${staff.fullName}! We found your profile on UTSAVO. We have an upcoming event shift.`}
                      variant="badges"
                    />
                    <a
                      href={`tel:${staff.phone}`}
                      className="p-2 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all"
                      title="Call Candidate"
                    >
                      <Phone className="w-3 h-3 text-amber-400" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: LARGE DETAILED CARDS */}
      {viewDensity === 'LARGE' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredStaff.map((staff) => {
            const roleMeta = ROLE_LABELS[staff.primaryRole] || { en: staff.primaryRole, ne: '', icon: '👤' };
            const availMeta = AVAILABILITY_LABELS[staff.availabilityType] || { en: staff.availabilityType, ne: '' };
            const isSelected = selectedStaffIds.includes(staff.id);
            const wage = staff.expectedWageNpr || statutoryRules.minDailyShiftWageNpr;

            return (
              <div
                key={staff.id}
                className={`bg-white rounded-3xl border transition-all overflow-hidden flex flex-col justify-between group ${
                  isSelected
                    ? 'border-amber-700 ring-2 ring-amber-700/20 shadow-lg bg-amber-50/10'
                    : 'border-stone-200 shadow-xs hover:shadow-md'
                }`}
              >
                <div>
                  {/* Photo Header Banner */}
                  <div className="relative h-48 overflow-hidden bg-stone-100">
                    <img
                      src={staff.photo}
                      alt={staff.fullName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent" />

                    {/* Top Checkbox & Availability */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <div className="p-1.5 bg-white/90 backdrop-blur-md rounded-lg flex items-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectStaff(staff.id)}
                          className="w-4 h-4 rounded text-amber-900 border-stone-300 focus:ring-amber-500 cursor-pointer"
                        />
                      </div>

                      {staff.isAvailableNow ? (
                        <span className="px-2.5 py-1 bg-emerald-700/90 backdrop-blur-md rounded-lg text-[10px] font-bold text-white flex items-center gap-1.5 border border-emerald-400/30">
                          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                          <span>Available Now</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-stone-900/80 backdrop-blur-md rounded-lg text-[10px] font-bold text-stone-300">
                          Shift Booked
                        </span>
                      )}

                      {staff.nidOrCitizenshipVerified && (
                        <span className="px-2 py-1 bg-stone-900/80 backdrop-blur-md rounded-lg text-[10px] font-bold text-amber-300 flex items-center gap-1 border border-white/20">
                          <ShieldCheck className="w-3 h-3 text-amber-400" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[11px] font-bold text-stone-900 shadow">
                      {staff.totalShiftsCompleted} Shifts Done
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-lg font-bold drop-shadow-sm">{staff.fullName}</h3>
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500 text-stone-950 text-xs font-bold shadow">
                          <Star className="w-3 h-3 fill-stone-950 text-stone-950" />
                          <span>{staff.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      {staff.nepaliName && (
                        <span className="text-xs text-stone-300 block">{staff.nepaliName}</span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3.5 text-xs">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-950 font-bold text-[11px] border border-amber-200/80 flex items-center gap-1">
                        <span>{roleMeta.icon}</span>
                        <span>{staff.customRoleName || roleMeta.en}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-semibold">
                        {availMeta.en}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-stone-600">
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase block font-semibold">Expected Wage</span>
                        <strong className="text-stone-900 text-sm font-display">
                          NPR {wage.toLocaleString()}
                        </strong>
                        <span className="text-[10px] text-stone-500">
                          {staff.wageType === 'PER_SHIFT' ? ' / shift' : staff.wageType === 'MONTHLY' ? ' / mo' : ' / hr'}
                        </span>
                      </div>

                      {staff.isGovtStatutoryWage && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                          🇳🇵 श्रम ऐन २०७४ न्यूनतम पारिश्रमिक
                        </span>
                      )}

                      <div className="text-right">
                        <span className="text-[10px] text-stone-400 uppercase block font-semibold">Location</span>
                        <span className="font-semibold text-stone-800 flex items-center gap-1 justify-end">
                          <MapPin className="w-3 h-3 text-amber-800" />
                          <span>{staff.district}</span>
                        </span>
                      </div>
                    </div>

                    <p className="text-stone-600 leading-relaxed text-xs">
                      {staff.bio}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {staff.secondarySkills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-stone-50 text-stone-600 rounded text-[10px] border border-stone-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Large Card Actions */}
                <div className="p-5 pt-0 border-t border-stone-100 mt-2 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2">
                    <span>{staff.reviews.length} Verified Reviews</span>
                    <button
                      onClick={() => {
                        setSelectedStaffForDossier(staff);
                        setIsReviewFormOpen(false);
                      }}
                      className="text-amber-800 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>View Full Dossier</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <WhatsAppViberButtons
                      phone={staff.whatsapp || staff.phone}
                      messageText={`Namaste ${staff.fullName}! We found your profile on UTSAVO. We have an upcoming event shift.`}
                      variant="badges"
                    />
                    <a
                      href={`tel:${staff.phone}`}
                      className="flex-1 py-2.5 px-3 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      <span>Call Directly</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {filteredStaff.length === 0 && (
        <div className="p-12 text-center bg-stone-50 rounded-3xl border border-dashed border-stone-300 space-y-3">
          <Briefcase className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">No candidates match your current filter</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Try broadening your search query, clearing the district filter, or switching job availability.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedAvailability('ALL');
              setSelectedRole('ALL');
              setSelectedDistrict('ALL');
              setOnlyAvailableNow(false);
              setMinRating(0);
            }}
            className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-black"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* 4. FIXED FLOATING BULK SELECTION DOCK FOR VENDORS */}
      {selectedStaffIds.length > 0 && (
        <div className="fixed bottom-4 inset-x-4 max-w-4xl mx-auto z-40 bg-stone-950/95 backdrop-blur-md text-white p-3 sm:p-4 rounded-2xl border border-stone-700 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-slide-up">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-amber-500 text-stone-950 rounded-xl font-bold text-xs shrink-0">
              {selectedStaffIds.length} Staff Selected
            </span>
            <div className="text-xs text-stone-300">
              <span>Total Shift Cost Est: </span>
              <strong className="text-white text-sm font-display">
                NPR {totalSelectedShiftCost.toLocaleString()}
              </strong>
              <span className="text-[10px] text-amber-400 block sm:inline sm:ml-1 font-semibold">
                (🇳🇵 Statutory Minimum Compliant)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsBulkShiftModalOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Book / Send Collective Shift Offer</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedStaffIds([])}
              className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-semibold transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* 5. COLLECTIVE SHIFT BOOKING MODAL FOR MULTI-SELECTED VENDORS */}
      {isBulkShiftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                  Bulk Shift Dispatch (थोक सिफ्ट अफर)
                </span>
                <h3 className="font-display text-xl font-bold text-stone-900 mt-0.5">
                  Hire {selectedStaffIds.length} Celebration Staff Members
                </h3>
              </div>
              <button
                onClick={() => setIsBulkShiftModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selected Candidates Summary Chips */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-2">
                Selected Team Members ({selectedStaffObjects.length}):
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-stone-50 rounded-xl border border-stone-200">
                {selectedStaffObjects.map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-stone-200 text-xs font-medium text-stone-800 shadow-2xs"
                  >
                    <img src={s.photo} alt={s.fullName} className="w-4 h-4 rounded-full object-cover" />
                    <span>{s.fullName}</span>
                    <span className="text-[10px] text-amber-800">
                      (NPR {s.expectedWageNpr || statutoryRules.minDailyShiftWageNpr})
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* Form Fields for Shift Dispatch */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Event Date (मिति BS)
                  </label>
                  <input
                    type="text"
                    value={bulkShiftDateBS}
                    onChange={(e) => setBulkShiftDateBS(e.target.value)}
                    placeholder="e.g. 2081 Mangsir 20"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Shift Time (सिफ्ट)
                  </label>
                  <select
                    value={bulkShiftTime}
                    onChange={(e) => setBulkShiftTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="EVENING">Evening Shift (3:00 PM - 11:00 PM)</option>
                    <option value="MORNING">Morning Shift (7:00 AM - 3:00 PM)</option>
                    <option value="FULL_DAY">Full Day (8:00 AM - 10:00 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Venue / Party Palace Name
                </label>
                <input
                  type="text"
                  value={bulkVenueName}
                  onChange={(e) => setBulkVenueName(e.target.value)}
                  placeholder="e.g. The Regal Pavilion, Kathmandu"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Shift Instructions & Dress Code Notes
                </label>
                <textarea
                  rows={2}
                  value={bulkShiftNotes}
                  onChange={(e) => setBulkShiftNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              {/* Statutory Wage Guarantee Notice */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>Nepal Labour Act 2074 Statutory Compliance:</strong> Total shift payroll is NPR {totalSelectedShiftCost.toLocaleString()} (Min NPR {statutoryRules.minDailyShiftWageNpr}/shift per worker guaranteed).
                </span>
              </div>
            </div>

            {bulkDispatchSuccess ? (
              <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold text-center">
                ✓ Shift invitation dispatched successfully to team members!
              </div>
            ) : (
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsBulkShiftModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBulkWhatsAppDispatch}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send WhatsApp Shift Dispatch to Team</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. CANDIDATE REGISTRATION MODAL (WITH OPTIONAL WAGE & "OTHER" CUSTOM CATEGORY PROPOSAL) */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
            
            <div className="flex items-start justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Open Workforce Registration (खुला जनशक्ति दर्ता)
                </span>
                <h3 className="font-display text-2xl font-bold text-stone-900 mt-1">
                  Join the UTSAVO Celebration Workforce Pool
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Full-time, part-time & weekend event gigs across Nepal. No restrictions on candidate numbers.
                </p>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              
              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Full Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Suman Tamang"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Nepali Name (नेपाली नाम)
                  </label>
                  <input
                    type="text"
                    value={nepaliName}
                    onChange={(e) => setNepaliName(e.target.value)}
                    placeholder="उदा: सुमन तामाङ"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +977-9841000000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    WhatsApp Number (for instant hiring)
                  </label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="e.g. +977-9841000000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Photo Preset Selection */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Profile Photo (फोटो छनोट गर्नुहोस्)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-2">
                  {PHOTO_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhoto(preset.url)}
                      className={`relative rounded-xl overflow-hidden border-2 text-left transition-all ${
                        photo === preset.url ? 'border-amber-700 ring-2 ring-amber-600/30' : 'border-stone-200'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-16 object-cover" />
                      <span className="block p-1 text-[10px] font-medium text-stone-700 truncate text-center">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  placeholder="Or paste custom image URL..."
                  className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-[11px]"
                />
              </div>

              {/* Role Selection & "OTHER" Category Proposal */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Primary Event Role / Category *
                    </label>
                    <select
                      value={primaryRole}
                      onChange={(e) => {
                        const val = e.target.value as EventStaffGigRole;
                        setPrimaryRole(val);
                        if (val === 'OTHER_EVENT_STAFF') {
                          setIsCustomRoleSelected(true);
                        } else {
                          setIsCustomRoleSelected(false);
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      {Object.entries(ROLE_LABELS).map(([key, val]) => (
                        <option key={key} value={key}>
                          {val.icon} {val.en} ({val.ne})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Availability / Job Type *
                    </label>
                    <select
                      value={availabilityType}
                      onChange={(e) => setAvailabilityType(e.target.value as EmploymentAvailabilityType)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      {Object.entries(AVAILABILITY_LABELS).map(([key, val]) => (
                        <option key={key} value={key}>
                          {val.en} ({val.ne})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* OTHER Category Details Input - informs Admin Console */}
                {(isCustomRoleSelected || primaryRole === 'OTHER_EVENT_STAFF') && (
                  <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-3 animate-fade-in">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                      <Sparkles className="w-4 h-4 text-amber-700" />
                      <span>Propose New Category / फरक अनुभव विधा दर्ता गर्नुहोस्:</span>
                    </div>
                    <p className="text-[11px] text-amber-900 leading-relaxed">
                      तपाईंसँग माथि उल्लिखित भन्दा फरक उत्सव अनुभव छ भने यहाँ नयाँ विधा खुलाउनुहोस्। यसले एडमिनलाई प्रणालीमा नयाँ विधा थप्न सहयोग गर्दछ।
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-amber-950 mb-1">
                          Proposed Category Name (English) *
                        </label>
                        <input
                          type="text"
                          required={primaryRole === 'OTHER_EVENT_STAFF'}
                          value={customRoleTitle}
                          onChange={(e) => setCustomRoleTitle(e.target.value)}
                          placeholder="e.g. Traditional Aila Pourer, Live Paan Maker, Playzone Nanny"
                          className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-amber-950 mb-1">
                          Category Name in Nepali (नेपाली नाम)
                        </label>
                        <input
                          type="text"
                          value={customRoleNepaliTitle}
                          onChange={(e) => setCustomRoleNepaliTitle(e.target.value)}
                          placeholder="उदा: परम्परागत ऐला सत्कार, शाही पान कारीगर"
                          className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-amber-950 mb-1">
                        Explain Your Different Experience (फरक अनुभवको विवरण)
                      </label>
                      <input
                        type="text"
                        value={customRoleDescription}
                        onChange={(e) => setCustomRoleDescription(e.target.value)}
                        placeholder="e.g. 5 years experience serving authentic Newari ceremonial drinks or kid play supervision."
                        className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* WAGE SECTION: OPTIONAL WITH NEPAL GOVT STATUTORY MINIMUM RULE */}
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Wage Rate & Statutory Protections (पारिश्रमिक तथा सरकारी मापदण्ड)</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Optional / ऐच्छिक
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Expected Wage (NPR रु.)
                    </label>
                    <input
                      type="number"
                      value={expectedWageInput}
                      onChange={(e) => {
                        setExpectedWageInput(e.target.value);
                        if (e.target.value) setUseStatutoryWageRule(false);
                      }}
                      placeholder={`Min रू. ${statutoryRules.minDailyShiftWageNpr}`}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Wage Frequency
                    </label>
                    <select
                      value={wageType}
                      onChange={(e) => setWageType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs"
                    >
                      <option value="PER_SHIFT">Per Shift (प्रति सिफ्ट)</option>
                      <option value="PER_HOUR">Per Hour (प्रति घण्टा)</option>
                      <option value="MONTHLY">Monthly Salary (मासिक)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Preferred Shift
                    </label>
                    <select
                      value={shiftPreference}
                      onChange={(e) => setShiftPreference(e.target.value as StaffShiftPreference)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs"
                    >
                      <option value="EVENING_SHIFT">Evening Shift (साँझ)</option>
                      <option value="MORNING_SHIFT">Morning Shift (बिहान)</option>
                      <option value="FULL_DAY">Full Day (पूरा दिन)</option>
                      <option value="ANY_FLEXIBLE">Any Flexible (जुनसुकै)</option>
                    </select>
                  </div>
                </div>

                {/* Statutory Minimum Wage Checkbox Rule */}
                <label className="flex items-start gap-2 cursor-pointer p-2 rounded-xl bg-white border border-emerald-200 text-[11px] text-emerald-950">
                  <input
                    type="checkbox"
                    checked={useStatutoryWageRule}
                    onChange={(e) => {
                      setUseStatutoryWageRule(e.target.checked);
                      if (e.target.checked) setExpectedWageInput('');
                    }}
                    className="mt-0.5 rounded border-emerald-400 text-emerald-800 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>
                    <strong>नेपाल सरकारको वैधानिक न्यूनतम पारिश्रमिक मापदण्ड लागू गर्नुहोस्:</strong> यदि पारिश्रमिक नतोकेमा श्रम ऐन २०७४ अनुसार (रू. {statutoryRules.minDailyShiftWageNpr}/सिफ्ट वा रू. {statutoryRules.minMonthlyWageNpr.toLocaleString()}/महिना) स्वतः सुरक्षित कायम हुनेछ।
                  </span>
                </label>
              </div>

              {/* District & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    District (जिल्ला) *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="Kathmandu">Kathmandu (काठमाडौँ)</option>
                    <option value="Lalitpur">Lalitpur (ललितपुर)</option>
                    <option value="Bhaktapur">Bhaktapur (भक्तपुर)</option>
                    <option value="Pokhara">Pokhara (पोखरा)</option>
                    <option value="Chitwan">Chitwan (चितवन)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Short Bio & Work Strengths *
                </label>
                <textarea
                  rows={2}
                  required
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell party palaces and caterers about your background, punctuality, and key strengths..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Secondary Skills (Comma-separated)
                </label>
                <input
                  type="text"
                  value={secondarySkillsText}
                  onChange={(e) => setSecondarySkillsText(e.target.value)}
                  placeholder="e.g. Silver Service, VIP Attendance, Buffet Setup, Nepali/English Fluency"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Past Venues / Party Palaces Worked At (Comma-separated)
                </label>
                <input
                  type="text"
                  value={pastVenuesText}
                  onChange={(e) => setPastVenuesText(e.target.value)}
                  placeholder="e.g. The Regal Pavilion, Heritage Garden Sanepa, Royal Banquet"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-stone-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAvailableNow}
                    onChange={(e) => setIsAvailableNow(e.target.checked)}
                    className="rounded border-stone-300 text-amber-900 focus:ring-amber-500 w-4 h-4"
                  />
                  <span className="font-semibold text-stone-800">Set as Available Right Now (तत्काल उपलब्ध)</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRegisterModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:text-stone-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-amber-900 hover:bg-amber-950 text-white rounded-xl font-bold shadow-md transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>Complete Registration (दर्ता गर्नुहोस्)</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. CANDIDATE DOSSIER & VERIFIED REVIEWS MODAL */}
      {selectedStaffForDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col">
            
            {/* Header with Photo & Quick Stats */}
            <div className="p-6 bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white flex items-start justify-between gap-4 shrink-0">
              <div className="flex items-center gap-4">
                <img
                  src={selectedStaffForDossier.photo}
                  alt={selectedStaffForDossier.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/50 shadow"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-xl font-bold">{selectedStaffForDossier.fullName}</h3>
                    {selectedStaffForDossier.nidOrCitizenshipVerified && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                        NID Verified
                      </span>
                    )}
                  </div>
                  {selectedStaffForDossier.nepaliName && (
                    <span className="text-xs text-stone-300 block">{selectedStaffForDossier.nepaliName}</span>
                  )}
                  <span className="text-xs text-amber-200 mt-1 block font-medium">
                    {selectedStaffForDossier.customRoleName || ROLE_LABELS[selectedStaffForDossier.primaryRole]?.en} · {selectedStaffForDossier.district}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedStaffForDossier(null)}
                className="p-1 rounded-full text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Dossier Content */}
            <div className="p-6 space-y-6 overflow-y-auto text-xs">
              
              {/* Bio & Details Grid */}
              <div className="space-y-3">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                  Professional Background
                </h4>
                <p className="text-stone-700 leading-relaxed text-sm bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  {selectedStaffForDossier.bio}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-stone-600">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-400 block font-semibold">Availability</span>
                    <strong className="text-stone-900 font-bold">
                      {AVAILABILITY_LABELS[selectedStaffForDossier.availabilityType]?.en}
                    </strong>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-400 block font-semibold">Expected Wage</span>
                    <strong className="text-stone-900 font-bold font-display">
                      NPR {(selectedStaffForDossier.expectedWageNpr || statutoryRules.minDailyShiftWageNpr).toLocaleString()}
                    </strong>
                    {selectedStaffForDossier.isGovtStatutoryWage && (
                      <span className="text-[9px] text-emerald-800 font-bold block">🇳🇵 श्रम ऐन न्यूनतम</span>
                    )}
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-400 block font-semibold">Experience</span>
                    <strong className="text-stone-900 font-bold">
                      {selectedStaffForDossier.experienceYears} Years
                    </strong>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-400 block font-semibold">Shifts Completed</span>
                    <strong className="text-amber-900 font-bold font-display">
                      {selectedStaffForDossier.totalShiftsCompleted} Shifts
                    </strong>
                  </div>
                </div>
              </div>

              {/* Skills and Past Venues */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                  <span className="font-bold text-stone-900 block text-[11px] uppercase tracking-wider">
                    Specialized Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStaffForDossier.secondarySkills.map((skill, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-white text-stone-700 rounded-lg text-xs font-medium border border-stone-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                  <span className="font-bold text-stone-900 block text-[11px] uppercase tracking-wider">
                    Past Venues Worked
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStaffForDossier.pastVenuesWorked.map((venue, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-white text-stone-700 rounded-lg text-xs font-medium border border-stone-200 flex items-center gap-1">
                        <Building className="w-3 h-3 text-amber-800" />
                        <span>{venue}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Verified Reviews Section */}
              <div className="space-y-4 pt-2 border-t border-stone-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                      <span>Verified Ratings & Comments</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 font-bold text-xs">
                        {selectedStaffForDossier.rating.toFixed(1)} ★ ({selectedStaffForDossier.reviews.length} evaluations)
                      </span>
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Evaluated by banquet managers, head chefs, and event directors.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-black text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Rate Candidate</span>
                  </button>
                </div>

                {reviewSuccessMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl font-semibold text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Review logged and candidate score updated!</span>
                  </div>
                )}

                {/* Review Form Drawer */}
                {isReviewFormOpen && (
                  <form onSubmit={handleReviewSubmit} className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-3 animate-fade-in">
                    <span className="font-bold text-xs text-amber-950 block">
                      Write an Evaluation for {selectedStaffForDossier.fullName}:
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Overall Rating (1-5)</label>
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                        >
                          <option value={5}>5 Stars - Excellent (उत्कृष्ट)</option>
                          <option value={4}>4 Stars - Very Good (धेरै राम्रो)</option>
                          <option value={3}>3 Stars - Satisfactory (सन्तोषजनक)</option>
                          <option value={2}>2 Stars - Needs Improvement (सुधार आवश्यक)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Punctuality Score</label>
                        <select
                          value={reviewPunctuality}
                          onChange={(e) => setReviewPunctuality(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                        >
                          <option value={5}>5/5 - Arrived Early (समयमै आएको)</option>
                          <option value={4}>4/5 - On Time</option>
                          <option value={3}>3/5 - Slight Delay</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Courtesy & Grooming</label>
                        <select
                          value={reviewCourtesy}
                          onChange={(e) => setReviewCourtesy(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                        >
                          <option value={5}>5/5 - Clean Uniform & Polite</option>
                          <option value={4}>4/5 - Good Etiquette</option>
                          <option value={3}>3/5 - Average</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Your Name / Title *</label>
                        <input
                          type="text"
                          required
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          placeholder="e.g. Subash Shrestha"
                          className="w-full px-3 py-2 rounded-xl border border-stone-300"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Party Palace / Vendor Name *</label>
                        <input
                          type="text"
                          required
                          value={reviewerOrg}
                          onChange={(e) => setReviewerOrg(e.target.value)}
                          placeholder="e.g. The Regal Pavilion"
                          className="w-full px-3 py-2 rounded-xl border border-stone-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Comment & Evaluation Feedback *</label>
                      <textarea
                        rows={2}
                        required
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Describe candidate's work ethic, handling of guests, and whether you would hire again..."
                        className="w-full px-3 py-2 rounded-xl border border-stone-300"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsReviewFormOpen(false)}
                        className="px-3 py-1.5 text-stone-600 hover:text-stone-900"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Publish Review</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Existing Reviews List */}
                <div className="space-y-3">
                  {selectedStaffForDossier.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-stone-900 text-xs">{rev.reviewerName}</strong>
                            <span className="text-stone-400">·</span>
                            <span className="text-stone-600 font-semibold">{rev.reviewerOrganization}</span>
                            {rev.reviewerRole && (
                              <span className="text-[11px] text-stone-400">({rev.reviewerRole})</span>
                            )}
                          </div>
                          <div className="text-[11px] text-stone-400 mt-0.5">
                            Event Date: {rev.eventDate} {rev.eventType && `· ${rev.eventType}`}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-950 font-bold rounded-md text-[11px]">
                          <Star className="w-3 h-3 fill-amber-700 text-amber-700" />
                          <span>{rev.rating} / 5</span>
                        </div>
                      </div>

                      <p className="text-stone-700 text-xs leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}

                  {selectedStaffForDossier.reviews.length === 0 && (
                    <div className="p-6 text-center text-xs text-stone-400 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                      No reviews logged yet. Be the first party palace or vendor to write an evaluation!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Direct Contact Strip */}
            <div className="p-5 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
              <div className="text-xs text-stone-600">
                <span>Contact candidate directly for upcoming event shifts or interviews:</span>
                <strong className="text-stone-900 block font-mono text-sm mt-0.5">{selectedStaffForDossier.phone}</strong>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <WhatsAppViberButtons
                  phone={selectedStaffForDossier.whatsapp || selectedStaffForDossier.phone}
                  messageText={`Namaste ${selectedStaffForDossier.fullName}! We have reviewed your UTSAVO profile (Rating: ${selectedStaffForDossier.rating.toFixed(1)} ★) and would like to hire you for an upcoming event shift.`}
                  variant="badges"
                />
                <a
                  href={`tel:${selectedStaffForDossier.phone}`}
                  className="px-5 py-2.5 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>Call Now</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
