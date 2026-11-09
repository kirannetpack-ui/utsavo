/**
 * UTSAVO — Interactive Fullscreen Guest E-Card & RSVP Modal
 * Solves: "Invitation is not opening the Invitation e-card"
 * Provides an authentic traditional Nepali ceremonial invitation experience with instant RSVP.
 */

import React, { useState } from 'react';
import {
  DigitalInvitation,
  GuestRsvpResponse,
  NimantranaTemplate
} from '../types';
import {
  X,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Heart,
  CheckCircle,
  XCircle,
  Send,
  Navigation,
  Music,
  Share2,
  Volume2,
  VolumeX,
  UtensilsCrossed,
  Flame,
  QrCode
} from 'lucide-react';
import { WhatsAppViberButtons } from './WhatsAppViberButtons';
import { ScannableQrCode } from './ScannableQrCode';
import { createNimantranaShareMessage, getPublicInvitationUrl } from '../utils/communication';

interface InteractiveGuestInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitation: DigitalInvitation;
  onRsvpSubmitted: (newRsvp: GuestRsvpResponse) => void;
}

export const InteractiveGuestInvitationModal: React.FC<InteractiveGuestInvitationModalProps> = ({
  isOpen,
  onClose,
  invitation,
  onRsvpSubmitted,
}) => {
  if (!isOpen) return null;

  // Envelope Opening State
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(true);
  const [isPlayingBlessingChime, setIsPlayingBlessingChime] = useState(false);

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
    halal: 0,
  });
  const [wishesMessage, setWishesMessage] = useState('');
  const [transportNeeded, setTransportNeeded] = useState(false);

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
        halal: Number(dietary.halal),
      } : { veg: 0, nonVegChicken: 0, nonVegMutton: 0, nonVegFish: 0, jain: 0, halal: 0 },
      transportNeeded,
      arrivalShift: 'DAY',
      wishesMessage: wishesMessage.trim() || 'Warm blessings to the couple!',
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    onRsvpSubmitted(newRsvp);
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
  const publicUrl = getPublicInvitationUrl(invitation.invitationCode);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      
      {/* Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[96vh]">
        
        {/* Top Control Bar */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Official Digital Nimantrana · {invitation.invitationCode}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlayingBlessingChime(!isPlayingBlessingChime)}
              className="p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
              title={isPlayingBlessingChime ? 'Mute Auspicious Sound' : 'Play Auspicious Chime'}
            >
              {isPlayingBlessingChime ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable E-Card Visual Canvas */}
        <div className={`p-6 sm:p-10 overflow-y-auto flex-1 ${theme.wrapperBg} text-stone-800 space-y-8 relative`}>
          
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-4 left-4 text-amber-800/30 text-2xl font-serif select-none pointer-events-none">✥</div>
          <div className="absolute top-4 right-4 text-amber-800/30 text-2xl font-serif select-none pointer-events-none">✥</div>
          <div className="absolute bottom-4 left-4 text-amber-800/30 text-2xl font-serif select-none pointer-events-none">✥</div>
          <div className="absolute bottom-4 right-4 text-amber-800/30 text-2xl font-serif select-none pointer-events-none">✥</div>

          {/* Ornate Frame Border */}
          <div className={`border-2 sm:border-4 ${theme.borderColor} rounded-3xl p-6 sm:p-8 text-center space-y-6 relative bg-white/70 shadow-sm backdrop-blur-xs`}>
            
            {/* Auspicious Vedic Symbol */}
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold tracking-wide text-amber-900 select-none">
                {invitation.invocationText || theme.symbol}
              </div>
              <div className="text-[11px] font-bold text-amber-800 uppercase tracking-widest">
                {invitation.taglineText || 'शुभ विवाह · हार्दिक निमन्त्रणा (CORDIAL INVITATION)'}
              </div>
            </div>

            {/* Welcoming Blessings Statement */}
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic px-2 sm:px-6 font-serif">
              "{invitation.welcomeMessage}"
            </p>

            {/* The Celebrants Core Header */}
            <div className="py-4 border-y-2 border-dashed border-amber-900/20 space-y-1">
              <span className="text-[11px] uppercase tracking-widest text-amber-900 font-bold block">
                {invitation.celebrantsPrefix || 'The Auspicious Matrimony of'}
              </span>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-amber-950 tracking-tight">
                {invitation.celebrantsTitle}
              </h1>
              {invitation.celebrantsParentsText && (
                <p className="text-xs text-stone-600 font-serif italic pt-1">
                  {invitation.celebrantsParentsText}
                </p>
              )}
              <div className="text-xs text-stone-500 font-medium pt-1">
                Requested by: <strong className="text-stone-800">{invitation.hostName}</strong>
              </div>
            </div>

            {/* Event Date, Muhurat & Venue Highlight */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-900/15 space-y-3">
              <div className="flex items-center justify-center gap-2 text-sm sm:text-base font-bold text-amber-950">
                <Calendar className="w-5 h-5 text-amber-800" />
                <span>{invitation.dateBS}</span>
                <span className="text-xs font-normal text-stone-500">({invitation.dateAD})</span>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs text-stone-700">
                <Clock className="w-4 h-4 text-amber-700" />
                <span>शुभ मुहूर्त: <strong>{invitation.muhuratTime}</strong></span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs font-medium text-stone-800 pt-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-700 shrink-0" />
                  <span>{invitation.venueName} · {invitation.locationAddress}</span>
                </div>
                {invitation.mapDirectionsUrl && (
                  <a
                    href={invitation.mapDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Get Directions</span>
                  </a>
                )}
              </div>
            </div>

            {/* Sub-Events Schedule Order */}
            <div className="space-y-3 text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block text-center">
                शुभ कार्यक्रम समयतालिका (Ceremony Schedule)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {invitation.subEvents.map((evt, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-white border border-amber-900/10 shadow-2xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold text-amber-950">
                      <span>{evt.title}</span>
                      <span className="text-amber-800 text-[11px] font-mono">{evt.time}</span>
                    </div>
                    <p className="text-[11px] text-stone-500 leading-tight">
                      {evt.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* QR Code and Quick Share */}
            <div className="pt-4 border-t border-amber-900/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
              <div>
                <span className="text-xs font-bold text-stone-800 block">
                  RSVP Deadline: {invitation.rsvpDeadlineBS}
                </span>
                <p className="text-[11px] text-stone-500">
                  Please confirm attendance below to assist our venue catering kitchen with zero food waste.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <ScannableQrCode
                  url={publicUrl}
                  code={invitation.invitationCode}
                  label="Scan to RSVP"
                  size={95}
                />
              </div>
            </div>

          </div>

          {/* GUEST RSVP INTERACTIVE SECTION */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-4">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Guest Response (उपस्थिति पुष्टि)
                </span>
                <h3 className="font-display text-xl font-bold text-stone-900 mt-0.5">
                  Confirm Your Presence (RSVP)
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
                <span className="text-xs text-stone-500 font-medium">Synced to Venue Chef</span>
              </div>
            </div>

            {isSubmitted ? (
              /* Success confirmation card */
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="font-display text-lg font-bold text-emerald-950">
                  Dhanyabad, {guestName}! Your RSVP is Confirmed
                </h4>
                <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                  Your response for <strong>{adultsCount} adults</strong> ({dietary.veg} Veg, {dietary.chicken + dietary.mutton} Non-Veg) has been sent directly to the host and updated on the venue kitchen sheet.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setShowRsvpForm(false);
                    }}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Edit My Response
                  </button>
                </div>
              </div>
            ) : !showRsvpForm ? (
              /* Click to open RSVP Form */
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="font-bold text-sm text-stone-900 block">
                    Will you be joining us for the celebration?
                  </span>
                  <span className="text-xs text-stone-500 block">
                    Kindly submit your headcount so {invitation.venueName} can prepare your feast with love.
                  </span>
                </div>

                <button
                  onClick={() => setShowRsvpForm(true)}
                  className="px-6 py-3 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span>RSVP Now (उपस्थिति दर्ता गर्नुहोस्)</span>
                </button>
              </div>
            ) : (
              /* Actual Interactive RSVP Form */
              <form onSubmit={handleRsvpSubmit} className="space-y-4 text-xs pt-2">
                
                {/* Attendance Toggle */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAttendance('ATTENDING')}
                    className={`p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                      attendance === 'ATTENDING'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Joyfully Attending (उपस्थित हुनेछु)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAttendance('NOT_ATTENDING')}
                    className={`p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                      attendance === 'NOT_ATTENDING'
                        ? 'border-rose-600 bg-rose-50 text-rose-950 ring-2 ring-rose-500'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Unable to Attend (उपस्थित हुन असमर्थ)</span>
                  </button>
                </div>

                {attendance === 'ATTENDING' && (
                  <div className="space-y-4">
                    
                    {/* Guest Name & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-stone-700 block mb-1">Your Full Name *</label>
                        <input
                          type="text"
                          required
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="e.g. Ramesh Adhikari"
                          className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-stone-700 block mb-1">Mobile / WhatsApp Number</label>
                        <input
                          type="tel"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          placeholder="+977-98..."
                          className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Headcount */}
                    <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                      <div>
                        <label className="font-semibold text-stone-700 block mb-1">Adults Count</label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={adultsCount}
                          onChange={(e) => setAdultsCount(Number(e.target.value))}
                          className="w-full p-2 bg-white border border-stone-200 rounded-xl text-center font-bold"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-stone-700 block mb-1">Children Count (Under 10)</label>
                        <input
                          type="number"
                          min="0"
                          max="15"
                          value={childrenCount}
                          onChange={(e) => setChildrenCount(Number(e.target.value))}
                          className="w-full p-2 bg-white border border-stone-200 rounded-xl text-center font-bold"
                        />
                      </div>
                    </div>

                    {/* Dietary Choices */}
                    <div className="space-y-2 p-3 bg-amber-50/40 rounded-2xl border border-amber-200/60">
                      <span className="font-bold text-stone-800 block text-xs">
                        Dietary Preferences (भोजन रोजाइ):
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div>
                          <label className="text-[10px] text-stone-600 block mb-0.5">🥗 Pure Veg</label>
                          <input
                            type="number"
                            min="0"
                            value={dietary.veg}
                            onChange={(e) => setDietary({ ...dietary, veg: Number(e.target.value) })}
                            className="w-full p-1.5 bg-white border border-stone-200 rounded-lg text-center font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-stone-600 block mb-0.5">🍗 Chicken</label>
                          <input
                            type="number"
                            min="0"
                            value={dietary.chicken}
                            onChange={(e) => setDietary({ ...dietary, chicken: Number(e.target.value) })}
                            className="w-full p-1.5 bg-white border border-stone-200 rounded-lg text-center font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-stone-600 block mb-0.5">🍖 Mutton</label>
                          <input
                            type="number"
                            min="0"
                            value={dietary.mutton}
                            onChange={(e) => setDietary({ ...dietary, mutton: Number(e.target.value) })}
                            className="w-full p-1.5 bg-white border border-stone-200 rounded-lg text-center font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-stone-600 block mb-0.5">🪷 Root-Free Jain</label>
                          <input
                            type="number"
                            min="0"
                            value={dietary.jain}
                            onChange={(e) => setDietary({ ...dietary, jain: Number(e.target.value) })}
                            className="w-full p-1.5 bg-white border border-stone-200 rounded-lg text-center font-bold"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* Blessings Message */}
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Wishes & Blessings for the Celebrants (शुभकामना सन्देश)
                  </label>
                  <textarea
                    rows={2}
                    value={wishesMessage}
                    onChange={(e) => setWishesMessage(e.target.value)}
                    placeholder="Write a warm note of blessing to the host family..."
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setShowRsvpForm(false)}
                    className="px-4 py-2 border border-stone-200 rounded-xl hover:bg-stone-50 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-amber-900 hover:bg-amber-950 text-white rounded-xl font-bold shadow-md flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit RSVP to Host</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-stone-500 flex items-center gap-1">
            <span>Organized at:</span>
            <strong className="text-stone-800">{invitation.venueName}</strong>
          </div>

          <div className="flex items-center gap-2">
            <WhatsAppViberButtons
              phone={invitation.hostPhone}
              messageText={createNimantranaShareMessage(
                invitation.celebrantsTitle,
                invitation.eventType === 'WEDDING' ? 'शुभ विवाह' : invitation.eventType,
                invitation.dateBS,
                invitation.venueName,
                invitation.invitationCode
              )}
              variant="compact"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
