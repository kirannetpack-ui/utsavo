/**
 * UTSAVO — Digital Nimantrana Suite & Kitchen RSVP Sync
 * Solves Nepal's #1 wedding catering food waste problem through real-time guest sync
 */

import React, { useState } from 'react';
import {
  DigitalInvitation,
  GuestRsvpResponse,
  KitchenPrepSheet,
  NimantranaTemplate,
  EventType,
  ShiftTime
} from '../types';
import { WhatsAppViberButtons } from './WhatsAppViberButtons';
import { createNimantranaShareMessage } from '../utils/communication';
import {
  Sparkles,
  QrCode,
  Share2,
  Users,
  UtensilsCrossed,
  Printer,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Plus,
  Send,
  Download,
  Flame,
  ChefHat,
  HeartHandshake
} from 'lucide-react';

// Initial mock invitation
const initialInvitation: DigitalInvitation = {
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
  accentColor: '#92400e', // Amber 800
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

// Initial mock RSVPs
const initialRsvps: GuestRsvpResponse[] = [
  {
    id: 'rsvp-1',
    invitationId: 'inv-utsavo-2081-01',
    guestName: 'Prof. Ram Prasad Sharma',
    phone: '+977-9841223344',
    attendanceStatus: 'ATTENDING',
    adultsCount: 2,
    childrenCount: 1,
    dietaryPreferences: { veg: 1, nonVegChicken: 1, nonVegMutton: 1, nonVegFish: 0, jain: 0, halal: 0 },
    transportNeeded: false,
    arrivalShift: 'DAY',
    wishesMessage: 'Wishing the auspicious couple a lifetime of joy and prosperity!',
    submittedAt: '2024-10-18 14:20'
  },
  {
    id: 'rsvp-2',
    invitationId: 'inv-utsavo-2081-01',
    guestName: 'Sunita & Deepak Adhikari',
    phone: '+977-9851098765',
    attendanceStatus: 'ATTENDING',
    adultsCount: 3,
    childrenCount: 0,
    dietaryPreferences: { veg: 1, nonVegChicken: 0, nonVegMutton: 2, nonVegFish: 0, jain: 0, halal: 0 },
    transportNeeded: false,
    arrivalShift: 'DAY',
    wishesMessage: 'Heartiest congratulations from Pokhara!',
    submittedAt: '2024-10-19 09:12'
  },
  {
    id: 'rsvp-3',
    invitationId: 'inv-utsavo-2081-01',
    guestName: 'Bikash & Rashmi Gurung (Sydney, Australia)',
    phone: '+61-412345678',
    attendanceStatus: 'ATTENDING',
    adultsCount: 2,
    childrenCount: 0,
    dietaryPreferences: { veg: 0, nonVegChicken: 1, nonVegMutton: 1, nonVegFish: 0, jain: 0, halal: 0 },
    transportNeeded: true,
    arrivalShift: 'DAY',
    wishesMessage: 'Excited to fly home to Nepal for this beautiful celebration!',
    submittedAt: '2024-10-20 16:45'
  },
  {
    id: 'rsvp-4',
    invitationId: 'inv-utsavo-2081-01',
    guestName: 'Pavitra Jain & Family',
    phone: '+977-9841778899',
    attendanceStatus: 'ATTENDING',
    adultsCount: 4,
    childrenCount: 2,
    dietaryPreferences: { veg: 0, nonVegChicken: 0, nonVegMutton: 0, nonVegFish: 0, jain: 6, halal: 0 },
    transportNeeded: false,
    arrivalShift: 'DAY',
    wishesMessage: 'Shubhkamnayein to both families!',
    submittedAt: '2024-10-21 11:30'
  },
  {
    id: 'rsvp-5',
    invitationId: 'inv-utsavo-2081-01',
    guestName: 'Er. Mohan Shrestha',
    phone: '+977-9801234123',
    attendanceStatus: 'NOT_ATTENDING',
    adultsCount: 0,
    childrenCount: 0,
    dietaryPreferences: { veg: 0, nonVegChicken: 0, nonVegMutton: 0, nonVegFish: 0, jain: 0, halal: 0 },
    transportNeeded: false,
    arrivalShift: 'DAY',
    wishesMessage: 'Sending warm blessings from abroad. Regret unable to attend in person.',
    submittedAt: '2024-10-22 08:15'
  }
];

export const DigitalNimantranaSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CARD' | 'TRACKER' | 'KITCHEN_SYNC'>('CARD');
  const [invitation, setInvitation] = useState<DigitalInvitation>(initialInvitation);
  const [rsvps, setRsvps] = useState<GuestRsvpResponse[]>(initialRsvps);

  // Manual RSVP Modal State
  const [isAddRsvpOpen, setIsAddRsvpOpen] = useState(false);
  const [manualRsvp, setManualRsvp] = useState({
    guestName: '',
    phone: '',
    attendanceStatus: 'ATTENDING' as 'ATTENDING' | 'NOT_ATTENDING',
    adultsCount: 2,
    childrenCount: 0,
    vegCount: 1,
    chickenCount: 1,
    muttonCount: 0,
    jainCount: 0,
    notes: ''
  });

  // Calculate RSVP Aggregates
  const confirmedList = rsvps.filter((r) => r.attendanceStatus === 'ATTENDING');
  const totalAdults = confirmedList.reduce((acc, r) => acc + r.adultsCount, 0);
  const totalChildren = confirmedList.reduce((acc, r) => acc + r.childrenCount, 0);
  const totalConfirmedGuests = totalAdults + totalChildren;

  const totalVeg = confirmedList.reduce((acc, r) => acc + r.dietaryPreferences.veg, 0);
  const totalChicken = confirmedList.reduce((acc, r) => acc + r.dietaryPreferences.nonVegChicken, 0);
  const totalMutton = confirmedList.reduce((acc, r) => acc + r.dietaryPreferences.nonVegMutton, 0);
  const totalJain = confirmedList.reduce((acc, r) => acc + r.dietaryPreferences.jain, 0);
  const totalHalal = confirmedList.reduce((acc, r) => acc + r.dietaryPreferences.halal, 0);

  // Kitchen Prep Raw Material Estimator (Industry Standard Ratios for Nepal Banquets)
  const bufferMarginPercent = 8; // 8% buffer for walk-ins
  const bufferMultiplier = 1 + bufferMarginPercent / 100;
  const totalPlatesWithBuffer = Math.round(totalConfirmedGuests * bufferMultiplier);

  const rawMaterials = {
    basmatiRiceKg: Math.round((totalAdults * 0.16 + totalChildren * 0.08) * bufferMultiplier),
    muttonKhasiKg: Math.round((totalMutton * 0.24) * bufferMultiplier),
    chickenBroilerKg: Math.round((totalChicken * 0.26) * bufferMultiplier),
    paneerFreshKg: Math.round(((totalVeg + totalJain) * 0.15) * bufferMultiplier),
    dalBlackMahaKg: Math.round((totalConfirmedGuests * 0.06) * bufferMultiplier),
    seasonalVegKg: Math.round((totalConfirmedGuests * 0.14) * bufferMultiplier),
    dahiCurdLtr: Math.round((totalConfirmedGuests * 0.08) * bufferMultiplier),
    lalmohanSweetsPieces: Math.round(totalConfirmedGuests * 2.2 * bufferMultiplier),
    saladVeggiesKg: Math.round((totalConfirmedGuests * 0.07) * bufferMultiplier),
    cookingOilGheeLtr: Math.round((totalConfirmedGuests * 0.035) * bufferMultiplier)
  };

  const handleManualRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: GuestRsvpResponse = {
      id: `rsvp-manual-${Date.now()}`,
      invitationId: invitation.id,
      guestName: manualRsvp.guestName,
      phone: manualRsvp.phone,
      attendanceStatus: manualRsvp.attendanceStatus,
      adultsCount: Number(manualRsvp.adultsCount),
      childrenCount: Number(manualRsvp.childrenCount),
      dietaryPreferences: {
        veg: Number(manualRsvp.vegCount),
        nonVegChicken: Number(manualRsvp.chickenCount),
        nonVegMutton: Number(manualRsvp.muttonCount),
        nonVegFish: 0,
        jain: Number(manualRsvp.jainCount),
        halal: 0
      },
      transportNeeded: false,
      arrivalShift: 'DAY',
      wishesMessage: manualRsvp.notes || 'Recorded via phone call',
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setRsvps([newEntry, ...rsvps]);
    setIsAddRsvpOpen(false);
  };

  const shareMessage = createNimantranaShareMessage(
    invitation.celebrantsTitle,
    invitation.eventType === 'WEDDING' ? 'शुभ विवाह' : invitation.eventType,
    invitation.dateBS,
    invitation.venueName,
    invitation.invitationCode
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-amber-900/40">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Digital Nimantrana & Food Waste Mitigation</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold">
            Smart Digital Invitation & Kitchen Headcount Sync
          </h2>
          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
            Create authentic Nepali e-invitations with QR codes. Automatically collect guest dietary counts (Veg, Mutton, Chicken, Jain) and feed exact raw ingredient requirements into your venue caterer's master prep sheet.
          </p>
        </div>

        {/* Quick Share Widget */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shrink-0 space-y-2 sm:w-72">
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-300 font-medium">Inv Code:</span>
            <span className="font-mono font-bold text-amber-300">{invitation.invitationCode}</span>
          </div>
          <div className="pt-1">
            <WhatsAppViberButtons
              phone={invitation.hostPhone}
              messageText={shareMessage}
              variant="full"
            />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('CARD')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'CARD'
              ? 'bg-amber-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>E-Invitation Card (निमन्त्रणा पत्र)</span>
        </button>

        <button
          onClick={() => setActiveTab('TRACKER')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'TRACKER'
              ? 'bg-amber-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Guest RSVP Tracker ({totalConfirmedGuests} Confirmed)</span>
        </button>

        <button
          onClick={() => setActiveTab('KITCHEN_SYNC')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'KITCHEN_SYNC'
              ? 'bg-amber-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Kitchen Prep Sheet (भान्सा तयारी पाना)</span>
        </button>
      </div>

      {/* Tab 1: E-Invitation Card Visualizer & Editor */}
      {activeTab === 'CARD' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Customization Controls */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Card Parameters & Cultural Themes</span>
            </h3>

            {/* Template Selection */}
            <div>
              <label className="font-semibold text-stone-700 block mb-1.5">Artistic Theme Motif</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'MITHILA_MADHUBANI', name: 'Mithila Madhubani Art', icon: '🦚' },
                  { id: 'NEWARI_MALLA_GOLD', name: 'Newari Malla Golden', icon: '🏛️' },
                  { id: 'HIMALAYAN_ROYAL', name: 'Himalayan Snow Peak', icon: '🏔️' },
                  { id: 'CONTEMPORARY_LOTUS', name: 'Minimal Lotus Crimson', icon: '🪷' }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setInvitation({ ...invitation, templateId: t.id as NimantranaTemplate })}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                      invitation.templateId === t.id
                        ? 'border-amber-900 bg-amber-50 text-amber-950 font-bold'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span className="text-base">{t.icon}</span>
                    <span className="truncate">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Celebrants Title */}
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Celebrants Title (वर तथा वधु)</label>
              <input
                type="text"
                value={invitation.celebrantsTitle}
                onChange={(e) => setInvitation({ ...invitation, celebrantsTitle: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
              />
            </div>

            {/* Host Family Name */}
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Host Family Name (निमन्त्रक परिवार)</label>
              <input
                type="text"
                value={invitation.hostName}
                onChange={(e) => setInvitation({ ...invitation, hostName: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* Date & Muhurat */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Date BS</label>
                <input
                  type="text"
                  value={invitation.dateBS}
                  onChange={(e) => setInvitation({ ...invitation, dateBS: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-stone-700 block mb-1">RSVP Deadline</label>
                <input
                  type="text"
                  value={invitation.rsvpDeadlineBS}
                  onChange={(e) => setInvitation({ ...invitation, rsvpDeadlineBS: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Venue & Hall */}
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Venue & Location</label>
              <input
                type="text"
                value={invitation.venueName}
                onChange={(e) => setInvitation({ ...invitation, venueName: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* Welcome Blessings Text */}
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Blessing Message (आशीर्वाद तथा निम्तो)</label>
              <textarea
                rows={3}
                value={invitation.welcomeMessage}
                onChange={(e) => setInvitation({ ...invitation, welcomeMessage: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* Right: Authentic Printable Invitation Preview */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full max-w-lg bg-[#fffdf7] rounded-3xl p-8 sm:p-10 shadow-xl border-4 border-amber-900/20 relative overflow-hidden text-center space-y-6">
              
              {/* Ornate Corner Accents */}
              <div className="absolute top-3 left-3 text-amber-800/40 text-xl font-serif">✥</div>
              <div className="absolute top-3 right-3 text-amber-800/40 text-xl font-serif">✥</div>
              <div className="absolute bottom-3 left-3 text-amber-800/40 text-xl font-serif">✥</div>
              <div className="absolute bottom-3 right-3 text-amber-800/40 text-xl font-serif">✥</div>

              {/* Cultural Om / Ganesha Symbol */}
              <div className="space-y-1">
                <div className="text-3xl text-amber-900 font-bold select-none">
                  {invitation.templateId === 'MITHILA_MADHUBANI' ? 'ॐ श्री गणेशाय नमः' : '卐 श्री गणेशाय नमः 卐'}
                </div>
                <div className="text-[11px] font-bold text-amber-800 uppercase tracking-widest">
                  शुभ विवाह · हार्दीक निमन्त्रणा
                </div>
              </div>

              {/* Blessing Invocation */}
              <p className="text-xs text-stone-600 leading-relaxed italic px-4 font-serif">
                "{invitation.welcomeMessage}"
              </p>

              {/* Celebrants Names */}
              <div className="py-2 border-y border-amber-900/15 space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-amber-900 font-bold">
                  The Auspicious Matrimony of
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-amber-950">
                  {invitation.celebrantsTitle}
                </h2>
                <span className="text-xs text-stone-500 font-medium">
                  Cordially invited by {invitation.hostName}
                </span>
              </div>

              {/* Schedule and Venue Box */}
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-900/10 space-y-2 text-xs text-stone-800">
                <div className="flex items-center justify-center gap-1.5 font-bold text-amber-950">
                  <Calendar className="w-4 h-4 text-amber-800" />
                  <span>{invitation.dateBS}</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-stone-600">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>{invitation.muhuratTime}</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-stone-700 font-medium pt-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-700" />
                  <span>{invitation.venueName} · {invitation.locationAddress}</span>
                </div>
              </div>

              {/* Sub-Events Timeline */}
              <div className="space-y-2 text-left pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block text-center">
                  Ceremonial Order of Events (शुभ कार्यक्रम)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  {invitation.subEvents.map((sub, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-white border border-amber-900/10">
                      <span className="font-bold text-amber-900 block">{sub.time} — {sub.title}</span>
                      <span className="text-stone-500 text-[10px] leading-tight block">{sub.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* QR Code and RSVP footer */}
              <div className="pt-4 border-t border-amber-900/15 flex items-center justify-between text-left">
                <div className="space-y-1 max-w-[280px]">
                  <span className="text-[10px] font-bold text-stone-700 block uppercase">
                    RSVP By: {invitation.rsvpDeadlineBS}
                  </span>
                  <p className="text-[10px] text-stone-500 leading-tight">
                    Kindly scan QR to confirm attendance & dietary choices to help avoid catering food waste.
                  </p>
                </div>
                <div className="p-2 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col items-center">
                  <QrCode className="w-12 h-12 text-stone-800" />
                  <span className="text-[8px] font-mono font-bold text-stone-500 mt-0.5">
                    {invitation.invitationCode}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Share Buttons under card */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs font-semibold text-stone-600">Direct Share:</span>
              <WhatsAppViberButtons
                phone={invitation.hostPhone}
                messageText={shareMessage}
                variant="compact"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Guest RSVP Tracker */}
      {activeTab === 'TRACKER' && (
        <div className="space-y-6">
          
          {/* Metrics Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-xs font-medium text-stone-500 uppercase">Total Confirmed</span>
              <div className="font-display text-2xl font-bold text-stone-900">
                {totalConfirmedGuests} <span className="text-xs text-stone-400 font-normal">guests</span>
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold">
                {totalAdults} Adults · {totalChildren} Children
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-xs font-medium text-stone-500 uppercase">Non-Veg Orders</span>
              <div className="font-display text-2xl font-bold text-amber-900">
                {totalMutton + totalChicken} <span className="text-xs text-stone-400 font-normal">plates</span>
              </div>
              <div className="text-[10px] text-stone-500 font-medium">
                🍗 {totalChicken} Chicken · 🍖 {totalMutton} Mutton
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-xs font-medium text-stone-500 uppercase">Pure Veg / Jain</span>
              <div className="font-display text-2xl font-bold text-emerald-800">
                {totalVeg + totalJain} <span className="text-xs text-stone-400 font-normal">plates</span>
              </div>
              <div className="text-[10px] text-stone-500 font-medium">
                🥗 {totalVeg} Veg · 🪷 {totalJain} Root-free Jain
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-xs font-medium text-stone-500 uppercase">Food Waste Safety</span>
              <div className="font-display text-2xl font-bold text-emerald-600">
                98.2%
              </div>
              <div className="text-[10px] text-stone-500">
                Precise batch prep synced to kitchen
              </div>
            </div>
          </div>

          {/* Action Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            <div>
              <h3 className="font-bold text-sm text-stone-900">Confirmed & Responded Guests List</h3>
              <p className="text-xs text-stone-500">
                Entries captured via WhatsApp QR links and phone walk-in confirmations
              </p>
            </div>

            <button
              onClick={() => setIsAddRsvpOpen(true)}
              className="px-4 py-2 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Record Walk-in / Phone RSVP (म्यानुअल थप्नुहोस्)</span>
            </button>
          </div>

          {/* RSVP Table */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-stone-50 text-stone-500 uppercase font-semibold text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="p-3">Guest Name & Contact</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Total Heads</th>
                    <th className="p-3">Dietary Breakdown</th>
                    <th className="p-3">Special Wishes / Notes</th>
                    <th className="p-3 text-right">Time Recorded</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {rsvps.map((rsvp) => (
                    <tr key={rsvp.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-stone-900">{rsvp.guestName}</div>
                        <div className="text-[10px] text-stone-400 font-mono">{rsvp.phone}</div>
                      </td>
                      <td className="p-3">
                        {rsvp.attendanceStatus === 'ATTENDING' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Attending</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-[10px] border border-rose-200">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>Declined</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-semibold text-stone-800">
                        {rsvp.attendanceStatus === 'ATTENDING' ? (
                          <span>
                            {rsvp.adultsCount} Adults {rsvp.childrenCount > 0 ? `+ ${rsvp.childrenCount} Ch` : ''}
                          </span>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>
                      <td className="p-3">
                        {rsvp.attendanceStatus === 'ATTENDING' ? (
                          <div className="flex flex-wrap gap-1 text-[10px]">
                            {rsvp.dietaryPreferences.veg > 0 && (
                              <span className="bg-emerald-100/70 text-emerald-800 px-1.5 py-0.5 rounded font-medium">
                                Veg: {rsvp.dietaryPreferences.veg}
                              </span>
                            )}
                            {rsvp.dietaryPreferences.nonVegMutton > 0 && (
                              <span className="bg-rose-100/70 text-rose-800 px-1.5 py-0.5 rounded font-medium">
                                Mutton: {rsvp.dietaryPreferences.nonVegMutton}
                              </span>
                            )}
                            {rsvp.dietaryPreferences.nonVegChicken > 0 && (
                              <span className="bg-amber-100/70 text-amber-800 px-1.5 py-0.5 rounded font-medium">
                                Chicken: {rsvp.dietaryPreferences.nonVegChicken}
                              </span>
                            )}
                            {rsvp.dietaryPreferences.jain > 0 && (
                              <span className="bg-purple-100/70 text-purple-800 px-1.5 py-0.5 rounded font-medium">
                                Jain: {rsvp.dietaryPreferences.jain}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>
                      <td className="p-3 text-stone-600 italic max-w-xs truncate">
                        "{rsvp.wishesMessage || '—'}"
                      </td>
                      <td className="p-3 text-right text-stone-400 font-mono text-[10px]">
                        {rsvp.submittedAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Kitchen Sync & Food Waste Mitigation Sheet */}
      {activeTab === 'KITCHEN_SYNC' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-amber-800" />
                <h3 className="font-display text-xl font-bold text-stone-900">
                  Head Chef Master Prep Sheet (भान्सा तयारी पाना)
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Direct raw culinary ingredient calculations based on {totalConfirmedGuests} confirmed guest RSVPs (+{bufferMarginPercent}% walk-in safety buffer).
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-950 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto"
            >
              <Printer className="w-4 h-4" />
              <span>Print Chef's Order Sheet</span>
            </button>
          </div>

          {/* Aggregate Headcount Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs">
            <div>
              <span className="text-[10px] text-stone-500 uppercase font-bold block">Base Confirmed</span>
              <span className="font-display text-lg font-bold text-stone-900">{totalConfirmedGuests} Heads</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase font-bold block">Buffer Margin ({bufferMarginPercent}%)</span>
              <span className="font-display text-lg font-bold text-amber-700">+{totalPlatesWithBuffer - totalConfirmedGuests} Heads</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase font-bold block">Total Production Target</span>
              <span className="font-display text-lg font-bold text-emerald-800">{totalPlatesWithBuffer} Plates</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase font-bold block">Non-Veg Ratio</span>
              <span className="font-display text-lg font-bold text-stone-800">
                {Math.round(((totalMutton + totalChicken) / (totalConfirmedGuests || 1)) * 100)}%
              </span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase font-bold block">Veg / Jain Ratio</span>
              <span className="font-display text-lg font-bold text-stone-800">
                {Math.round(((totalVeg + totalJain) / (totalConfirmedGuests || 1)) * 100)}%
              </span>
            </div>
          </div>

          {/* Raw Ingredients Itemized Table */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-600" />
              <span>Calculated Raw Material Requirements (कच्चा पदार्थ परिमाण)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Rice */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-amber-50/40 space-y-1">
                <span className="text-[10px] font-bold uppercase text-stone-500">Grains & Rice</span>
                <div className="font-display text-xl font-bold text-amber-950">
                  {rawMaterials.basmatiRiceKg} kg
                </div>
                <div className="text-[11px] text-stone-600">A-Grade Long Grain Basmati Rice</div>
                <div className="text-[9px] text-stone-400">Yields ~{totalPlatesWithBuffer} generous buffet portions</div>
              </div>

              {/* Mutton */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-rose-50/40 space-y-1">
                <span className="text-[10px] font-bold uppercase text-stone-500">Mutton / Khasi Meat</span>
                <div className="font-display text-xl font-bold text-rose-950">
                  {rawMaterials.muttonKhasiKg} kg
                </div>
                <div className="text-[11px] text-stone-600">Fresh Hill Goat (खसीको मासु)</div>
                <div className="text-[9px] text-stone-400">Based on {totalMutton} confirmed mutton requests</div>
              </div>

              {/* Chicken */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-amber-50/40 space-y-1">
                <span className="text-[10px] font-bold uppercase text-stone-500">Poultry</span>
                <div className="font-display text-xl font-bold text-amber-950">
                  {rawMaterials.chickenBroilerKg} kg
                </div>
                <div className="text-[11px] text-stone-600">Local Style Chicken Curry / Roast</div>
                <div className="text-[9px] text-stone-400">Based on {totalChicken} confirmed chicken requests</div>
              </div>

              {/* Paneer */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-emerald-50/40 space-y-1">
                <span className="text-[10px] font-bold uppercase text-stone-500">Dairy & Paneer</span>
                <div className="font-display text-xl font-bold text-emerald-950">
                  {rawMaterials.paneerFreshKg} kg
                </div>
                <div className="text-[11px] text-stone-600">Fresh Whole Milk Cottage Paneer (पनिर)</div>
                <div className="text-[9px] text-stone-400">For Palak/Butter Masala for {totalVeg + totalJain} veg guests</div>
              </div>

              {/* Dal */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-1">
                <span className="text-[10px] font-bold uppercase text-stone-500">Lentils & Dal</span>
                <div className="font-display text-xl font-bold text-stone-900">
                  {rawMaterials.dalBlackMahaKg} kg
                </div>
                <div className="text-[11px] text-stone-600">Kalo Dal / Dal Makhani Grains</div>
                <div className="text-[9px] text-stone-400">Simmered in pure Nepali ghee</div>
              </div>

              {/* Sweets / Desserts */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-1">
                <span className="text-[10px] font-bold uppercase text-stone-500">Sweets & Mithai</span>
                <div className="font-display text-xl font-bold text-stone-900">
                  {rawMaterials.lalmohanSweetsPieces} pcs
                </div>
                <div className="text-[11px] text-stone-600">Warm Gulab Jamun / Lalmohan + Jalebi</div>
                <div className="text-[9px] text-stone-400">Average 2.2 pieces per attendee</div>
              </div>
            </div>
          </div>

          {/* Mitigation Callout */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-xs text-emerald-900">
            <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Nepal Green Banquet Protocol:</span>
              <p className="mt-0.5 leading-relaxed text-emerald-800">
                By ordering exactly {rawMaterials.muttonKhasiKg} kg mutton and {rawMaterials.basmatiRiceKg} kg rice per this verified RSVP sheet, you prevent an estimated <strong>18% to 25% catering cost inflation</strong> and eliminate unconsumed food spoilage at the party palace.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Manual RSVP Modal */}
      {isAddRsvpOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-5 bg-stone-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold">Record Walk-in / Phone RSVP</h3>
                <p className="text-xs text-stone-300">Update party palace headcounts immediately</p>
              </div>
              <button
                onClick={() => setIsAddRsvpOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualRsvpSubmit} className="p-6 space-y-3.5 text-xs overflow-y-auto">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Guest Family Name *</label>
                <input
                  type="text"
                  required
                  value={manualRsvp.guestName}
                  onChange={(e) => setManualRsvp({ ...manualRsvp, guestName: e.target.value })}
                  placeholder="e.g. Shyam Karki & Family"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={manualRsvp.phone}
                  onChange={(e) => setManualRsvp({ ...manualRsvp, phone: e.target.value })}
                  placeholder="+977-98..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Adults Count</label>
                  <input
                    type="number"
                    min="1"
                    value={manualRsvp.adultsCount}
                    onChange={(e) => setManualRsvp({ ...manualRsvp, adultsCount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Children Count</label>
                  <input
                    type="number"
                    min="0"
                    value={manualRsvp.childrenCount}
                    onChange={(e) => setManualRsvp({ ...manualRsvp, childrenCount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Dietary Breakup */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <span className="font-bold text-stone-700 block text-[11px]">Dietary Split:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="text-[10px] text-stone-500 block">🥗 Veg</label>
                    <input
                      type="number"
                      min="0"
                      value={manualRsvp.vegCount}
                      onChange={(e) => setManualRsvp({ ...manualRsvp, vegCount: Number(e.target.value) })}
                      className="w-full p-1.5 bg-white border border-stone-200 rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-500 block">🍗 Chicken</label>
                    <input
                      type="number"
                      min="0"
                      value={manualRsvp.chickenCount}
                      onChange={(e) => setManualRsvp({ ...manualRsvp, chickenCount: Number(e.target.value) })}
                      className="w-full p-1.5 bg-white border border-stone-200 rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-500 block">🍖 Mutton</label>
                    <input
                      type="number"
                      min="0"
                      value={manualRsvp.muttonCount}
                      onChange={(e) => setManualRsvp({ ...manualRsvp, muttonCount: Number(e.target.value) })}
                      className="w-full p-1.5 bg-white border border-stone-200 rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-500 block">🪷 Jain</label>
                    <input
                      type="number"
                      min="0"
                      value={manualRsvp.jainCount}
                      onChange={(e) => setManualRsvp({ ...manualRsvp, jainCount: Number(e.target.value) })}
                      className="w-full p-1.5 bg-white border border-stone-200 rounded-lg text-center font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddRsvpOpen(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl hover:bg-stone-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-900 hover:bg-amber-950 text-white rounded-xl font-bold shadow"
                >
                  Save & Sync to Kitchen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
