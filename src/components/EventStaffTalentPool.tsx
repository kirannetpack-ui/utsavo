/**
 * UTSAVO - Celebration Workforce & Gig Talent Pool (उत्सव जनशक्ति तथा गिग कार्यथलो)
 * Section: Shared event staffing pool for party palaces, caterers, decorators, and planners.
 * Features: Open candidate registration (full-time/part-time), search & filter, direct WhatsApp/call hiring,
 * and a full rating & review commenting system for fair worker acknowledgement.
 */

import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { WhatsAppViberButtons } from './WhatsAppViberButtons';

export const EventStaffTalentPool: React.FC = () => {
  const {
    eventStaffPool,
    addEventStaffProfile,
    toggleStaffAvailability,
    addStaffReview,
    currentUser,
  } = useMarketplace();

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
  const [secondarySkillsText, setSecondarySkillsText] = useState('Silver Service, Buffet Management, Polite Etiquette');
  const [shiftPreference, setShiftPreference] = useState<StaffShiftPreference>('EVENING_SHIFT');
  const [expectedWageNpr, setExpectedWageNpr] = useState(1800);
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
    OTHER_EVENT_STAFF: { en: 'Event Operations Support', ne: 'अन्य उत्सव सहयोग', icon: '🤝' },
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
        const matchesRole = ROLE_LABELS[staff.primaryRole]?.en.toLowerCase().includes(q);
        if (!matchesName && !matchesBio && !matchesDistrict && !matchesSkills && !matchesRole) {
          return false;
        }
      }
      return true;
    });
  }, [eventStaffPool, selectedAvailability, selectedRole, selectedDistrict, onlyAvailableNow, minRating, searchQuery]);

  // Handle Candidate Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      secondarySkills: secondarySkillsText.split(',').map((s) => s.trim()).filter(Boolean),
      shiftPreference,
      expectedWageNpr: Number(expectedWageNpr) || 1800,
      wageType,
      district: district || 'Kathmandu',
      preferredLocalities: preferredLocalitiesText.split(',').map((s) => s.trim()).filter(Boolean),
      isAvailableNow,
      experienceYears: Number(experienceYears) || 1,
      pastVenuesWorked: pastVenuesText.split(',').map((s) => s.trim()).filter(Boolean),
      nidOrCitizenshipVerified: true,
    });

    setIsRegisterModalOpen(false);
    setRegistrationSuccessToast(`Congratulations! ${newProfile.fullName} has been added to the UTSAVO Celebration Staff Pool.`);
    setTimeout(() => setRegistrationSuccessToast(null), 5000);
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

  return (
    <div className="space-y-8 pb-16">
      
      {/* Toast */}
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

      {/* 1. Hero & Value Proposition Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-stone-800 bg-stone-950 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1800&q=80"
            alt="Nepal Wedding Banquet Staff"
            className="w-full h-full object-cover opacity-25 mix-blend-overlay filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/85 to-transparent" />
        </div>

        <div className="relative max-w-5xl px-6 sm:px-12 py-12 sm:py-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold backdrop-blur-md">
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            <span>उत्सव जनशक्ति तथा गिग कार्यथलो · Celebration Workforce & Gig Talent Pool</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Connect Event Talent with Party Palaces, Caterers & Planners
          </h1>

          <p className="text-sm sm:text-base text-stone-300 max-w-3xl leading-relaxed font-light">
            An open, unrestricted talent pool for banquet servers, kitchen halwais, decorators, ushers, and sound technicians. Anyone can register for <strong>full-time, part-time, or weekend wedding gigs</strong>. All vendors can hire as per their requirements with a verified rating and review system for fair acknowledgement.
          </p>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-stone-800/80 text-xs">
            <div>
              <span className="text-amber-400 font-display text-2xl font-bold block">{eventStaffPool.length}+</span>
              <span className="text-stone-400">Registered Candidates</span>
            </div>
            <div>
              <span className="text-emerald-400 font-display text-2xl font-bold block">
                {eventStaffPool.filter((s) => s.isAvailableNow).length}
              </span>
              <span className="text-stone-400">Available Right Now</span>
            </div>
            <div>
              <span className="text-amber-400 font-display text-2xl font-bold block">100% Direct</span>
              <span className="text-stone-400">Zero Agency Deduction</span>
            </div>
            <div>
              <span className="text-amber-400 font-display text-2xl font-bold block">Verified Ratings</span>
              <span className="text-stone-400">Peer Reviews & Comments</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl font-bold text-xs transition-all shadow-lg shadow-amber-600/20 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register for Jobs (कामको लागि दर्ता)</span>
            </button>
            <a
              href="#talent-grid"
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-xs transition-all backdrop-blur-md border border-white/20 flex items-center gap-2"
            >
              <span>Browse & Hire Event Staff</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. Search, Filter & Availability Controls Strip */}
      <div id="talent-grid" className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div>
            <h2 className="font-display text-2xl font-bold text-stone-900">
              Celebration Talent Pool ({filteredStaff.length} Candidates Available)
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Filter by availability, specialized skill role, wage expectation, and district. Direct WhatsApp and phone contact for instant hiring.
            </p>
          </div>

          {/* Right Button */}
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="px-4 py-2.5 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm self-start lg:self-center shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Join Talent Pool (Free Registration)</span>
          </button>
        </div>

        {/* Search Bar & Fast Toggles */}
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

      {/* 3. Candidate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredStaff.map((staff) => {
          const roleMeta = ROLE_LABELS[staff.primaryRole] || { en: staff.primaryRole, ne: '', icon: '👤' };
          const availMeta = AVAILABILITY_LABELS[staff.availabilityType] || { en: staff.availabilityType, ne: '' };

          return (
            <div
              key={staff.id}
              className="bg-white rounded-3xl border border-stone-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Photo & Status Banner */}
                <div className="relative h-48 overflow-hidden bg-stone-100">
                  <img
                    src={staff.photo}
                    alt={staff.fullName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent" />

                  {/* Availability Live Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
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

                  {/* Shift Counter Badge */}
                  <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[11px] font-bold text-stone-900 shadow">
                    {staff.totalShiftsCompleted} Shifts Done
                  </div>

                  {/* Name Overlay */}
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

                {/* Content */}
                <div className="p-4 space-y-3 text-xs">
                  {/* Role & Availability pills */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-950 font-bold text-[11px] border border-amber-200/80 flex items-center gap-1">
                      <span>{roleMeta.icon}</span>
                      <span>{roleMeta.en}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-semibold">
                      {availMeta.en}
                    </span>
                  </div>

                  {/* Wage & Shift */}
                  <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-stone-600">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase block font-semibold">Expected Wage</span>
                      <strong className="text-stone-900 text-sm font-display">
                        NPR {staff.expectedWageNpr.toLocaleString()}
                      </strong>
                      <span className="text-[10px] text-stone-500">
                        {staff.wageType === 'PER_SHIFT' ? ' / shift' : staff.wageType === 'MONTHLY' ? ' / mo' : ' / hr'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 uppercase block font-semibold">Location</span>
                      <span className="font-semibold text-stone-800 flex items-center gap-1 justify-end">
                        <MapPin className="w-3 h-3 text-amber-800" />
                        <span>{staff.district}</span>
                      </span>
                    </div>
                  </div>

                  {/* Short Bio */}
                  <p className="text-stone-600 line-clamp-2 leading-relaxed text-[11px]">
                    {staff.bio}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {staff.secondarySkills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-stone-50 text-stone-600 rounded text-[10px] border border-stone-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 border-t border-stone-100 mt-2 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2">
                  <span>{staff.reviews.length} Verified Reviews</span>
                  <button
                    onClick={() => {
                      setSelectedStaffForDossier(staff);
                      setIsReviewFormOpen(false);
                    }}
                    className="text-amber-800 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>View Dossier & Reviews</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <WhatsAppViberButtons
                    phone={staff.whatsapp || staff.phone}
                    messageText={`Namaste ${staff.fullName}! We found your profile on the UTSAVO Celebration Staff Pool. We have an upcoming event shift and would like to check your availability.`}
                    variant="badges"
                  />
                  <a
                    href={`tel:${staff.phone}`}
                    className="flex-1 py-2 px-3 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1"
                  >
                    <Phone className="w-3 h-3 text-amber-400" />
                    <span>Call Candidate</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
            className="px-4 py-2 bg-amber-900 text-white rounded-xl text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: CANDIDATE REGISTRATION (UNRESTRICTED)           */}
      {/* ======================================================== */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">
                    Register for Event Jobs & Gigs (उत्सव जनशक्ति दर्ता)
                  </h3>
                  <p className="text-xs text-stone-300">
                    Join Nepal's shared celebration workforce. Available for banquet servers, kitchen staff, ushers, and decorators.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleRegisterSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Full Name (पूरा नाम) *
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Primary Event Role *
                  </label>
                  <select
                    value={primaryRole}
                    onChange={(e) => setPrimaryRole(e.target.value as EventStaffGigRole)}
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
                    <option value="WEEKEND_GIGS">Weekend Wedding Gigs (शनिबार/बिदाको गिग)</option>
                    <option value="PART_TIME">Part-Time (अंशकालीन)</option>
                    <option value="FULL_TIME">Full-Time (पूर्णकालीन)</option>
                    <option value="ON_CALL_DAILY">On-Call Daily (दैनिक आवश्यकतामा)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Preferred Shift
                  </label>
                  <select
                    value={shiftPreference}
                    onChange={(e) => setShiftPreference(e.target.value as StaffShiftPreference)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="EVENING_SHIFT">Evening Shift (साँझको सिफ्ट)</option>
                    <option value="MORNING_SHIFT">Morning Shift (बिहानी सिफ्ट)</option>
                    <option value="FULL_DAY">Full Day (पूरा दिन)</option>
                    <option value="ANY_FLEXIBLE">Any Flexible (जुनसुकै समय)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Expected Wage (NPR रु.) *
                  </label>
                  <input
                    type="number"
                    required
                    value={expectedWageNpr}
                    onChange={(e) => setExpectedWageNpr(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Wage Frequency
                  </label>
                  <select
                    value={wageType}
                    onChange={(e) => setWageType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="PER_SHIFT">Per Shift (प्रति सिफ्ट)</option>
                    <option value="PER_HOUR">Per Hour (प्रति घण्टा)</option>
                    <option value="MONTHLY">Monthly Salary (मासिक)</option>
                  </select>
                </div>
              </div>

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
                  Short Bio & Work Experience Summary *
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
                    className="px-6 py-2.5 bg-amber-900 hover:bg-amber-950 text-white rounded-xl font-bold shadow-md flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Join Talent Pool</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: CANDIDATE DOSSIER, REVIEWS & RATING ENGINE      */}
      {/* ======================================================== */}
      {selectedStaffForDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-stone-950 to-stone-900 text-white flex items-start justify-between shrink-0">
              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400 shrink-0">
                  <img src={selectedStaffForDossier.photo} alt={selectedStaffForDossier.fullName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display text-xl font-bold">{selectedStaffForDossier.fullName}</h3>
                    {selectedStaffForDossier.nepaliName && (
                      <span className="text-sm text-stone-300">({selectedStaffForDossier.nepaliName})</span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950 text-xs font-extrabold flex items-center gap-1 shadow">
                      <Star className="w-3.5 h-3.5 fill-stone-950" />
                      <span>{selectedStaffForDossier.rating.toFixed(1)}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-300 mt-1">
                    <span>{ROLE_LABELS[selectedStaffForDossier.primaryRole]?.en}</span>
                    <span>·</span>
                    <span>{selectedStaffForDossier.district}</span>
                    <span>·</span>
                    <span>{selectedStaffForDossier.experienceYears} Years Experience</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedStaffForDossier(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Success alert */}
            {reviewSuccessMsg && (
              <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 px-6">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Thank you! Your verified rating and review has been added to this worker's profile.</span>
              </div>
            )}

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              
              {/* Quick specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block">Availability</span>
                  <strong className="text-stone-900 font-medium">
                    {AVAILABILITY_LABELS[selectedStaffForDossier.availabilityType]?.en}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block">Expected Wage</span>
                  <strong className="text-stone-900 font-display text-sm">
                    NPR {selectedStaffForDossier.expectedWageNpr.toLocaleString()}
                  </strong>
                  <span className="text-[10px] text-stone-500 block">
                    {selectedStaffForDossier.wageType === 'PER_SHIFT' ? 'per shift' : 'monthly'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block">Completed Shifts</span>
                  <strong className="text-stone-900 font-display text-sm">
                    {selectedStaffForDossier.totalShiftsCompleted} Events
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block">Live Status</span>
                  <span className={`inline-flex items-center gap-1 font-bold ${selectedStaffForDossier.isAvailableNow ? 'text-emerald-700' : 'text-stone-500'}`}>
                    <span className={`w-2 h-2 rounded-full ${selectedStaffForDossier.isAvailableNow ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                    <span>{selectedStaffForDossier.isAvailableNow ? 'Available Right Now' : 'Busy on Shift'}</span>
                  </span>
                </div>
              </div>

              {/* Bio & Skills */}
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 text-sm">Candidate Overview & Background</h4>
                <p className="text-stone-600 leading-relaxed text-xs">
                  {selectedStaffForDossier.bio}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedStaffForDossier.secondarySkills.map((sk, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-amber-50 text-amber-900 rounded-lg text-xs font-medium border border-amber-200">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Past Venues */}
              {selectedStaffForDossier.pastVenuesWorked && selectedStaffForDossier.pastVenuesWorked.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="font-bold text-stone-800 text-xs">Past Venues & Banquet Halls Worked:</span>
                  <p className="text-stone-600 text-xs">
                    {selectedStaffForDossier.pastVenuesWorked.join(' · ')}
                  </p>
                </div>
              )}

              {/* Reviews Section */}
              <div className="space-y-4 pt-4 border-t border-stone-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-800" />
                      <span>Vendor Ratings & Reviews ({selectedStaffForDossier.reviews.length})</span>
                    </h4>
                    <p className="text-xs text-stone-500">
                      Fair feedback from Party Palace managers, head chefs, and event directors.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                    className="px-3.5 py-1.5 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span>{isReviewFormOpen ? 'Cancel Review' : '+ Rate & Write Review'}</span>
                  </button>
                </div>

                {/* Inline Review Form */}
                {isReviewFormOpen && (
                  <form onSubmit={handleReviewSubmit} className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4 animate-fade-in">
                    <h5 className="font-bold text-stone-900 text-xs uppercase tracking-wide">
                      Submit Verified Evaluation for {selectedStaffForDossier.fullName}
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Overall Rating (1 - 5) *</label>
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-bold text-stone-900"
                        >
                          <option value={5}>★★★★★ (5 - Excellent)</option>
                          <option value={4}>★★★★☆ (4 - Good / Reliable)</option>
                          <option value={3}>★★★☆☆ (3 - Average)</option>
                          <option value={2}>★★☆☆☆ (2 - Needs Improvement)</option>
                          <option value={1}>★☆☆☆☆ (1 - Poor Performance)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Punctuality Score</label>
                        <select
                          value={reviewPunctuality}
                          onChange={(e) => setReviewPunctuality(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                        >
                          <option value={5}>5/5 - Arrived Early</option>
                          <option value={4}>4/5 - On Time</option>
                          <option value={3}>3/5 - Slight Delay</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Grooming & Courtesy</label>
                        <select
                          value={reviewCourtesy}
                          onChange={(e) => setReviewCourtesy(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                        >
                          <option value={5}>5/5 - Spotless Uniform & Polite</option>
                          <option value={4}>4/5 - Neat & Courteous</option>
                          <option value={3}>3/5 - Acceptable</option>
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
            <div className="p-6 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
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
