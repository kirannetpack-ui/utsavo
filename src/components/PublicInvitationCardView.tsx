/**
 * UTSAVO — Standalone Public Guest Invitation Card View
 * Solves: "The QR should open the exact same invitation card with information and the link should also show the exact card."
 * Renders when a guest opens /invite/:code or clicks/scans the QR code.
 */

import React, { useState, useEffect } from 'react';
import { DigitalInvitation, GuestRsvpResponse, NimantranaTemplate } from '../types';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Heart,
  CheckCircle,
  Navigation,
  Volume2,
  VolumeX,
  UtensilsCrossed,
  Share2,
  ArrowLeft,
  Copy,
  Check
} from 'lucide-react';
import { WhatsAppViberButtons } from './WhatsAppViberButtons';
import { ScannableQrCode } from './ScannableQrCode';
import { getPublicInvitationUrl, createNimantranaShareMessage } from '../utils/communication';
import { BrandLogo } from './BrandLogo';

interface PublicInvitationCardViewProps {
  invitationCode: string;
  onBackToApp?: () => void;
}

const defaultFallbackInvitation: DigitalInvitation = {
  id: 'inv-utsavo-2081-01',
  invitationCode: 'UTS-INV-8921',
  hostUserId: 'user-sample',
  hostName: 'Kiran Thapa & Family',
  hostPhone: '+977-9851023456',
  eventType: 'WEDDING',
  celebrantsTitle: 'Sneha & Aayush',
  venueName: 'Heritage Garden Sanepa Party Palace',
  hallName: 'Sagarmatha Grand Ballroom & Lawn',
  dateBS: '2081 Mangsir 14, Friday',
  dateAD: '2024-11-29',
  muhuratTime: '09:15 AM - 01:45 PM (Sarva Siddhi Muhurat)',
  locationAddress: 'Sanepa-2, Lalitpur, Kathmandu Valley',
  mapDirectionsUrl: 'https://maps.google.com/?q=Sanepa+Lalitpur',
  welcomeMessage:
    'With the divine blessings of Lord Shiva & Goddess Parvati, we solicit your auspicious presence and blessings on the joyous occasion of the wedding ceremony of our beloved daughter and son.',
  templateId: 'MITHILA_MADHUBANI',
  accentColor: '#92400e',
  invocationText: '🦚 ॐ श्री गणेशाय नमः 🦚',
  taglineText: 'शुभ विवाह · हार्दिक निमन्त्रणा (CORDIAL INVITATION)',
  celebrantsPrefix: 'The Auspicious Matrimony of',
  celebrantsParentsText: 'Daughter of Mr. Kiran & Mrs. Anita Thapa (Lalitpur) and Son of Mr. Bikram & Mrs. Sunita Sharma (Kathmandu)',
  rsvpContactPerson: 'Kiran Thapa (+977-9851023456)',
  customNote: 'Your presence is our biggest blessing and gift / उपहार होइन उपस्थिति नै हाम्रो सौभाग्य',
  subEvents: [
    { time: '09:30 AM', title: 'Barani & Janti Welcome', description: 'Welcoming the Groom’s procession with traditional Panche Baja fanfare' },
    { time: '11:15 AM', title: 'Kanyadaan & Saptapadi', description: 'Vedic rituals around the sacred Agni Kunda mandap' },
    { time: '01:00 PM', title: 'Royal Vivaha Bhoj (Banquet)', description: 'Grand celebratory feast with traditional Nepali culinary spread' },
    { time: '03:30 PM', title: 'Doli & Bidai', description: 'Auspicious send-off ceremony' }
  ],
  rsvpDeadlineBS: '2081 Mangsir 07',
  enableKitchenRsvpSync: true,
  isPublished: true,
  createdAt: '2024-10-15'
};

export const PublicInvitationCardView: React.FC<PublicInvitationCardViewProps> = ({
  invitationCode,
  onBackToApp
}) => {
  const [invitation, setInvitation] = useState<DigitalInvitation>(() => {
    // Check localStorage for host edits
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`utsavo_invitation_${invitationCode}`);
        if (saved) return JSON.parse(saved);

        // Check generic current invitation
        const generic = localStorage.getItem('utsavo_current_invitation');
        if (generic) {
          const parsed = JSON.parse(generic);
          if (parsed.invitationCode === invitationCode || !invitationCode) {
            return parsed;
          }
        }
      } catch (e) {
        console.error('Error loading invitation from storage', e);
      }
    }
    return { ...defaultFallbackInvitation, invitationCode: invitationCode || defaultFallbackInvitation.invitationCode };
  });

  const [isPlayingBlessingChime, setIsPlayingBlessingChime] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Guest RSVP Form State
  const [showRsvpForm, setShowRsvpForm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [attendance, setAttendance] = useState<'ATTENDING' | 'NOT_ATTENDING'>('ATTENDING');
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [dietary, setDietary] = useState({
    veg: 1,
    chicken: 1,
    mutton: 0,
    jain: 0,
    halal: 0
  });
  const [wishesMessage, setWishesMessage] = useState('');
  const [transportNeeded, setTransportNeeded] = useState(false);

  // Sync changes from localStorage if edited in another tab
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === `utsavo_invitation_${invitationCode}` && e.newValue) {
        try {
          setInvitation(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [invitationCode]);

  const publicUrl = getPublicInvitationUrl(invitation.invitationCode);

  const handleCopyLink = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(publicUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    const newRsvp: GuestRsvpResponse = {
      id: `rsvp-${Date.now()}`,
      invitationId: invitation.id,
      guestName: guestName.trim(),
      phone: guestPhone.trim() || '+977-9800000000',
      attendanceStatus: attendance,
      adultsCount: attendance === 'ATTENDING' ? adultsCount : 0,
      childrenCount: attendance === 'ATTENDING' ? childrenCount : 0,
      dietaryPreferences: attendance === 'ATTENDING' ? {
        veg: Number(dietary.veg),
        nonVegChicken: Number(dietary.chicken),
        nonVegMutton: Number(dietary.mutton),
        nonVegFish: 0,
        jain: Number(dietary.jain),
        halal: Number(dietary.halal)
      } : { veg: 0, nonVegChicken: 0, nonVegMutton: 0, nonVegFish: 0, jain: 0, halal: 0 },
      transportNeeded,
      arrivalShift: 'DAY',
      wishesMessage: wishesMessage.trim() || 'Warm blessings to the couple!',
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    // Save to local storage for kitchen and host sync
    try {
      const stored = localStorage.getItem(`utsavo_rsvps_${invitation.id}`);
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newRsvp);
      localStorage.setItem(`utsavo_rsvps_${invitation.id}`, JSON.stringify(list));
      // Dispatch storage event for other components
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Error storing rsvp', err);
    }

    setIsSubmitted(true);
  };

  const getThemeStyling = (template: NimantranaTemplate) => {
    switch (template) {
      case 'MITHILA_MADHUBANI':
        return {
          wrapperBg: 'bg-[#fffcf2]',
          borderColor: 'border-amber-800',
          titleColor: 'text-amber-950',
          accentColor: 'text-amber-800',
          bannerBg: 'bg-amber-900',
          symbol: '🦚 ॐ श्री गणेशाय नमः 🦚',
          motifName: 'Mithila Madhubani Folk Art'
        };
      case 'NEWARI_MALLA_GOLD':
        return {
          wrapperBg: 'bg-[#fcf8f2]',
          borderColor: 'border-yellow-700',
          titleColor: 'text-stone-900',
          accentColor: 'text-amber-800',
          bannerBg: 'bg-stone-900',
          symbol: '🏛️ 卐 न्हूज्याः सुभाय् 卐 🏛️',
          motifName: 'Kathmandu Valley Malla Golden Torana'
        };
      case 'HIMALAYAN_ROYAL':
        return {
          wrapperBg: 'bg-[#f8fafc]',
          borderColor: 'border-sky-800',
          titleColor: 'text-sky-950',
          accentColor: 'text-sky-800',
          bannerBg: 'bg-sky-950',
          symbol: '🏔️ ॐ नमो भगवते वासुदेवाय 🏔️',
          motifName: 'Annapurna Himalayan Snow Peak'
        };
      case 'CONTEMPORARY_LOTUS':
      default:
        return {
          wrapperBg: 'bg-[#fffbfb]',
          borderColor: 'border-rose-800',
          titleColor: 'text-rose-950',
          accentColor: 'text-rose-800',
          bannerBg: 'bg-rose-950',
          symbol: '🪷 ॐ सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके 🪷',
          motifName: 'Crimson Lotus Royal Elegance'
        };
    }
  };

  const theme = getThemeStyling(invitation.templateId);

  return (
    <div className={`min-h-screen ${theme.wrapperBg} text-stone-900 flex flex-col items-center py-6 px-3 sm:px-6`}>
      
      {/* Top Banner Navigation */}
      <header className="w-full max-w-3xl mb-6 flex items-center justify-between bg-white/90 backdrop-blur-md px-4 sm:px-6 py-3 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-3">
          {onBackToApp && (
            <button
              onClick={onBackToApp}
              className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">UTSAVO Marketplace</span>
            </button>
          )}
          <BrandLogo variant="light" size="sm" showSubtitle={false} />
          <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Pass: {invitation.invitationCode}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlayingBlessingChime(!isPlayingBlessingChime)}
            className="p-2 rounded-xl text-stone-600 hover:text-amber-900 hover:bg-amber-50 transition-colors flex items-center gap-1 text-xs font-semibold"
            title={isPlayingBlessingChime ? 'Mute Music' : 'Play Auspicious Music'}
          >
            {isPlayingBlessingChime ? (
              <Volume2 className="w-4 h-4 text-amber-700" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400" />
            )}
            <span className="hidden md:inline">{isPlayingBlessingChime ? 'Mangal Dhun' : 'Sound'}</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 transition-colors flex items-center gap-1.5 text-xs font-bold"
            title="Copy Public Invitation URL"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </header>

      {/* Main Ceremonial Invitation Card */}
      <main className="w-full max-w-3xl space-y-8">
        
        {/* Ornate Card Container */}
        <div className={`relative bg-white rounded-3xl p-6 sm:p-12 shadow-2xl border-4 ${theme.borderColor} overflow-hidden text-center space-y-8`}>
          
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-4 left-4 text-amber-800/30 text-2xl font-serif select-none pointer-events-none">✥</div>
          <div className="absolute top-4 right-4 text-amber-800/30 text-2xl font-serif select-none pointer-events-none">✥</div>
          <div className="absolute bottom-4 left-4 text-amber-800/30 text-2xl font-serif select-none pointer-events-none">✥</div>
          <div className="absolute bottom-4 right-4 text-amber-800/30 text-2xl font-serif select-none pointer-events-none">✥</div>

          {/* Religious/Spiritual Invocation Header (Editable) */}
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold tracking-wide text-amber-900 select-none">
              {invitation.invocationText || theme.symbol}
            </div>
            <div className="text-xs font-bold text-amber-800 uppercase tracking-widest">
              {invitation.taglineText || 'शुभ विवाह · हार्दिक निमन्त्रणा (CORDIAL INVITATION)'}
            </div>
          </div>

          {/* Welcoming Blessings Statement (Editable) */}
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic px-2 sm:px-10 font-serif">
            "{invitation.welcomeMessage}"
          </p>

          {/* The Celebrants Core Header (Editable) */}
          <div className="py-4 border-y-2 border-dashed border-amber-900/20 space-y-1.5">
            <span className="text-xs uppercase tracking-widest text-amber-900 font-bold block">
              {invitation.celebrantsPrefix || 'The Auspicious Matrimony of'}
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-amber-950 tracking-tight">
              {invitation.celebrantsTitle}
            </h1>
            {invitation.celebrantsParentsText && (
              <p className="text-xs sm:text-sm text-stone-600 font-serif italic pt-1 max-w-xl mx-auto">
                {invitation.celebrantsParentsText}
              </p>
            )}
            <div className="text-xs text-stone-500 font-medium pt-1">
              Cordially invited by: <strong className="text-stone-800">{invitation.hostName}</strong>
            </div>
          </div>

          {/* Key Schedule and Venue Details (Editable) */}
          <div className="bg-amber-50/70 p-5 sm:p-6 rounded-2xl border border-amber-900/10 space-y-3 text-xs sm:text-sm">
            <div className="flex items-center justify-center gap-2 font-bold text-amber-950 text-sm sm:text-base">
              <Calendar className="w-5 h-5 text-amber-800" />
              <span>{invitation.dateBS}</span>
              {invitation.dateAD && (
                <span className="text-xs text-stone-500 font-normal">({invitation.dateAD})</span>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-stone-700">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>{invitation.muhuratTime}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-stone-800 font-semibold pt-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-700 shrink-0" />
                <span>{invitation.venueName} {invitation.hallName ? `· ${invitation.hallName}` : ''}</span>
              </div>
              <span className="hidden sm:inline text-stone-400">•</span>
              <span className="text-stone-600 font-normal">{invitation.locationAddress}</span>
            </div>

            {invitation.mapDirectionsUrl && (
              <div className="pt-2">
                <a
                  href={invitation.mapDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-stone-100 text-stone-800 rounded-xl text-xs font-bold border border-stone-200 shadow-xs transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-rose-600" />
                  <span>Get Driving Directions (Google Maps)</span>
                </a>
              </div>
            )}
          </div>

          {/* Ceremonial Order of Events (Sub-events) */}
          {invitation.subEvents && invitation.subEvents.length > 0 && (
            <div className="space-y-3 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block text-center">
                Ceremonial Order of Events (शुभ कार्यक्रम)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {invitation.subEvents.map((evt, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white border border-amber-900/10 shadow-xs space-y-1">
                    <div className="flex items-center justify-between text-amber-900 font-bold">
                      <span>{evt.title}</span>
                      <span className="text-[10px] font-mono bg-amber-50 px-2 py-0.5 rounded-full border border-amber-900/10">
                        {evt.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 leading-tight">
                      {evt.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Note or Gift Policy */}
          {invitation.customNote && (
            <p className="text-xs text-stone-500 italic border-t border-amber-900/10 pt-3">
              🌸 {invitation.customNote} 🌸
            </p>
          )}

          {/* Scannable Real QR Code and RSVP Info */}
          <div className="pt-6 border-t border-amber-900/15 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
            <div className="space-y-1 max-w-sm">
              <span className="text-xs font-bold text-stone-800 block uppercase">
                RSVP Deadline: {invitation.rsvpDeadlineBS}
              </span>
              <p className="text-xs text-stone-500 leading-relaxed">
                Scan or share this QR code with family members to access this official card anytime and submit headcount.
              </p>
              {invitation.rsvpContactPerson && (
                <p className="text-xs text-stone-600 font-medium pt-1">
                  RSVP Contacts: {invitation.rsvpContactPerson}
                </p>
              )}
            </div>

            <div className="flex flex-col items-center">
              <ScannableQrCode
                url={publicUrl}
                code={invitation.invitationCode}
                label="Direct Scannable Pass"
                size={110}
              />
            </div>
          </div>
        </div>

        {/* GUEST RSVP INTERACTIVE SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Guest Response (उपस्थिति पुष्टि)
              </span>
              <h3 className="font-display text-2xl font-bold text-stone-900 mt-0.5">
                Confirm Your Presence (RSVP)
              </h3>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <UtensilsCrossed className="w-4 h-4 text-emerald-700" />
              <span className="text-xs text-emerald-800 font-semibold">Live Kitchen Headcount Sync</span>
            </div>
          </div>

          {isSubmitted ? (
            <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
              <CheckCircle className="w-14 h-14 text-emerald-600 mx-auto" />
              <h4 className="font-display text-xl font-bold text-emerald-950">
                Dhanyabad, {guestName}! Your RSVP is Confirmed
              </h4>
              <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                Your response for <strong>{adultsCount} adults</strong> ({dietary.veg} Veg, {dietary.chicken + dietary.mutton} Non-Veg) has been synced directly to the host's catering planner.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setShowRsvpForm(false);
                  }}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  Edit My Response
                </button>
              </div>
            </div>
          ) : !showRsvpForm ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-amber-50/70 rounded-2xl border border-amber-200/60">
              <div className="space-y-1 text-center sm:text-left">
                <span className="font-bold text-base text-stone-900 block">
                  Will you be joining us for the celebration?
                </span>
                <span className="text-xs text-stone-500 block">
                  Please submit your headcount so {invitation.venueName} can prepare your feast without food waste.
                </span>
              </div>
              <button
                onClick={() => setShowRsvpForm(true)}
                className="px-6 py-3 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0 active:scale-95"
              >
                Submit RSVP Now (उपस्थिति जनाउनुहोस्)
              </button>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Your Full Name / Family Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh & Sita Thapa"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Contact Phone (WhatsApp / Viber) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+977-98..."
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Attendance Radio Buttons */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-700 block">Attendance Confirmation *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAttendance('ATTENDING')}
                    className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      attendance === 'ATTENDING'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <CheckCircle className={`w-4 h-4 ${attendance === 'ATTENDING' ? 'text-emerald-600' : 'text-stone-400'}`} />
                    <span>Joyfully Attending (उपस्थित हुने)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAttendance('NOT_ATTENDING')}
                    className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      attendance === 'NOT_ATTENDING'
                        ? 'border-stone-600 bg-stone-100 text-stone-900 ring-2 ring-stone-500/20'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span>Sending Blessings from Afar</span>
                  </button>
                </div>
              </div>

              {attendance === 'ATTENDING' && (
                <div className="space-y-4 pt-2 border-t border-stone-100 animate-in fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">Number of Adults</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={adultsCount}
                        onChange={(e) => setAdultsCount(Math.max(1, Number(e.target.value)))}
                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-center font-bold text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">Children (under 10)</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={childrenCount}
                        onChange={(e) => setChildrenCount(Math.max(0, Number(e.target.value)))}
                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-center font-bold text-sm"
                      />
                    </div>
                  </div>

                  {/* Dietary Preferences */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-700 block">
                      Feast Dietary Preferences (भोजन रोजाइ)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                        <span className="text-[11px] font-semibold text-stone-700 block">🥗 Shuddha Veg</span>
                        <input
                          type="number"
                          min="0"
                          value={dietary.veg}
                          onChange={(e) => setDietary({ ...dietary, veg: Number(e.target.value) })}
                          className="w-full mt-1 p-1 bg-white border border-stone-200 rounded text-center font-bold"
                        />
                      </div>
                      <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                        <span className="text-[11px] font-semibold text-stone-700 block">🍗 Chicken</span>
                        <input
                          type="number"
                          min="0"
                          value={dietary.chicken}
                          onChange={(e) => setDietary({ ...dietary, chicken: Number(e.target.value) })}
                          className="w-full mt-1 p-1 bg-white border border-stone-200 rounded text-center font-bold"
                        />
                      </div>
                      <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                        <span className="text-[11px] font-semibold text-stone-700 block">🍖 Mutton</span>
                        <input
                          type="number"
                          min="0"
                          value={dietary.mutton}
                          onChange={(e) => setDietary({ ...dietary, mutton: Number(e.target.value) })}
                          className="w-full mt-1 p-1 bg-white border border-stone-200 rounded text-center font-bold"
                        />
                      </div>
                      <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                        <span className="text-[11px] font-semibold text-stone-700 block">🪷 Jain</span>
                        <input
                          type="number"
                          min="0"
                          value={dietary.jain}
                          onChange={(e) => setDietary({ ...dietary, jain: Number(e.target.value) })}
                          className="w-full mt-1 p-1 bg-white border border-stone-200 rounded text-center font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Wishes Message */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Blessings & Wishes for Celebrants (शुभकामना सन्देश)
                </label>
                <textarea
                  rows={3}
                  value={wishesMessage}
                  onChange={(e) => setWishesMessage(e.target.value)}
                  placeholder="Write your heartfelt blessings..."
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRsvpForm(false)}
                  className="px-4 py-2.5 border border-stone-200 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  Confirm & Sync RSVP
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Share with Family Bar */}
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-amber-800" />
            <span className="text-xs font-bold text-stone-800">
              Share Invitation with Family & Relatives:
            </span>
          </div>

          <WhatsAppViberButtons
            phone={invitation.hostPhone}
            messageText={createNimantranaShareMessage(
              invitation.celebrantsTitle,
              invitation.eventType === 'WEDDING' ? 'शुभ विवाह' : invitation.eventType,
              invitation.dateBS,
              invitation.venueName,
              invitation.invitationCode,
              publicUrl
            )}
            variant="compact"
          />
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-stone-400 space-y-1">
        <p>UTSAVO — Nepal's Smart Celebration Marketplace · Powered by Digital Nimantrana Suite</p>
        <p className="text-[10px]">Zero food waste catering sync for banquet palaces across Nepal</p>
      </footer>
    </div>
  );
};
