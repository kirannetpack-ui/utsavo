/**
 * UTSAVO - Venue Owner & Manager Business Portal
 * Section 13: Multi-hall scheduling, lead pipeline, negotiation inbox, and walk-in offline reservation entry
 */

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { Booking, HallSpace, ShiftTime, Venue } from '../types';
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
} from 'lucide-react';
import { VenueAnalytics } from './VenueAnalytics';

export const VenueOwnerDashboard: React.FC = () => {
  const { language } = useLanguage();
  const {
    venues,
    bookings,
    negotiations,
    createWalkInBooking,
    openVenueOnboarding,
    setActiveModal,
    setActiveNegotiationId,
  } = useMarketplace();

  // Active venue for the logged-in venue operator
  const myVenue: Venue = venues[0]; // The Regal Pavilion & Heritage Banquet

  const [activeTab, setActiveTab] = useState<'CALENDAR' | 'INBOX' | 'WALK_IN' | 'ANALYTICS'>('CALENDAR');
  const [selectedHallId, setSelectedHallId] = useState<string>(myVenue.halls[0].id);

  // Walk-in booking state form
  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInGuests, setWalkInGuests] = useState(300);
  const [walkInDateBS, setWalkInDateBS] = useState('2081 Mangsir 20');
  const [walkInShift, setWalkInShift] = useState<ShiftTime>('DAY');
  const [walkInRate, setWalkInRate] = useState(1650);
  const [walkInDeposit, setWalkInDeposit] = useState(150000);
  const [walkInSuccessMsg, setWalkInSuccessMsg] = useState(false);

  const venueBookings = bookings.filter((b) => b.venueId === myVenue.id);
  const venueNegotiations = negotiations.filter((n) => n.venueId === myVenue.id);

  // Financial KPIs
  const totalRevenueNpr = venueBookings.reduce((sum, b) => sum + (b.depositPaidNpr || 0), 0);
  const totalBookedGuests = venueBookings.reduce((sum, b) => sum + (b.guestCount || 0), 0);

  const handleCreateWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName || !walkInPhone) return;

    const rawSubtotal = walkInGuests * walkInRate + 50000;
    const vatTotal = Math.round(rawSubtotal * 1.23); // 10% sc + 13% vat approx

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

  return (
    <div className="space-y-6">
      
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
          </div>
          <h2 className="font-display text-2xl font-bold text-stone-900 mt-1">
            {myVenue.name}
          </h2>
          <div className="text-xs text-stone-500 mt-0.5">
            PAN: <strong>{myVenue.panNumber}</strong> · {myVenue.locality}, {myVenue.district} · {myVenue.halls.length} Halls Registered · {myVenue.maxGuests} max pax
          </div>
        </div>

        {/* Action Controls & Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => openVenueOnboarding(myVenue)}
            className="px-3.5 py-1.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            title="Edit Halls, Menus, Pricing, Policies & Info"
          >
            <Building2 className="w-3.5 h-3.5 text-amber-800" />
            <span>Edit Venue Details & Halls</span>
          </button>

          <button
            onClick={() => openVenueOnboarding(null)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            title="Register a new Palace or Branch"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register New Palace</span>
          </button>

          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs font-semibold">
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          <span className="text-xs text-stone-400 block">Response Rate</span>
          <span className="text-xl font-bold font-display text-emerald-700 tabular-nums">
            {myVenue.responseRatePercent}%
          </span>
          <span className="text-[11px] text-stone-500 block mt-1">Average response &lt; 2 hours</span>
        </div>
      </div>

      {/* TAB 1: HALL INVENTORY CALENDAR */}
      {activeTab === 'CALENDAR' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Multi-Hall Shift Scheduling Matrix
              </h3>
              <p className="text-xs text-stone-500">
                Manage morning, day, evening, and full day blocks across your spaces.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-600">Select Hall:</span>
              <select
                value={selectedHallId}
                onChange={(e) => setSelectedHallId(e.target.value)}
                className="text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-800 focus:outline-none"
              >
                {myVenue.halls.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.maxCapacity} cap)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reserved Schedule Items List */}
          <div className="space-y-3">
            {venueBookings.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-950 font-display">
                      {b.eventDateBS} BS
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                      {b.shift} Shift
                    </span>
                    <span className="text-xs text-stone-400">Ref: #{b.bookingRef}</span>
                  </div>

                  <div className="text-xs text-stone-800">
                    Host: <strong>{b.customerName}</strong> ({b.customerPhone}) · {b.eventType} · <span className="tabular-nums">{b.guestCount} guests</span>
                  </div>

                  <div className="text-[11px] text-stone-500">
                    Hall: {b.hallName} · Rate: NPR {b.agreedPerPlateNpr.toLocaleString()}/plate
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-emerald-700 font-bold block">
                    Deposit Paid: NPR {b.depositPaidNpr.toLocaleString()}
                  </span>
                  <span className="text-stone-400 text-[11px]">
                    Total: NPR {b.totalAmountNpr.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: LEADS & OFFERS INBOX */}
      {activeTab === 'INBOX' && (
        <div className="space-y-4">
          {venueNegotiations.map((neg) => {
            const latest = neg.versions[neg.versions.length - 1];

            return (
              <div
                key={neg.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-stone-400">#{neg.enquiryId}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        neg.status === 'COUNTER_BY_CUSTOMER'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {neg.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-stone-400">v{neg.currentVersion}</span>
                  </div>

                  <div className="text-sm font-bold text-stone-900">
                    {neg.customerName} · {neg.eventType}
                  </div>

                  <div className="text-xs text-stone-600">
                    Target Date: {latest.dateBS} BS · Shift: {latest.shift} · {latest.guestCount} guests
                  </div>

                  <div className="text-xs text-amber-900 font-semibold">
                    Proposed Rate: NPR {latest.proposedPerPlateNpr.toLocaleString()}/plate (Total: NPR {latest.totalNpr.toLocaleString()})
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveNegotiationId(neg.id);
                    setActiveModal('NEGOTIATION');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-950 rounded-xl transition-colors shrink-0"
                >
                  Review & Counter-Offer →
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: WALK-IN OFFLINE RESERVATION ENTRY */}
      {activeTab === 'WALK_IN' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-5 max-w-2xl">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              Record Direct Walk-in / Offline Booking
            </h3>
            <p className="text-xs text-stone-500">
              For event hosts who visit your party palace in person. Locks the calendar inventory instantly.
            </p>
          </div>

          {walkInSuccessMsg && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              <span>Walk-in booking successfully recorded and inventory locked!</span>
            </div>
          )}

          <form onSubmit={handleCreateWalkIn} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Host / Organizer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Adhikari"
                  value={walkInName}
                  onChange={(e) => setWalkInName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-900"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Mobile Contact</label>
                <input
                  type="text"
                  required
                  placeholder="+977-98..."
                  value={walkInPhone}
                  onChange={(e) => setWalkInPhone(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Event Date (BS)</label>
                <input
                  type="text"
                  value={walkInDateBS}
                  onChange={(e) => setWalkInDateBS(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-900 font-semibold"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Shift</label>
                <select
                  value={walkInShift}
                  onChange={(e) => setWalkInShift(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-900"
                >
                  <option value="MORNING">Morning Shift</option>
                  <option value="DAY">Day Shift</option>
                  <option value="EVENING">Evening Shift</option>
                  <option value="FULL_DAY">Full Day</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Guests</label>
                <input
                  type="number"
                  value={walkInGuests}
                  onChange={(e) => setWalkInGuests(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-900 font-semibold"
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
                <label className="font-semibold text-stone-700 block mb-1">Cash / Check Deposit Collected (NPR)</label>
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

      {/* TAB 4: ADVANCED RECHARTS ANALYTICS & MARKET INTELLIGENCE */}
      {activeTab === 'ANALYTICS' && (
        <VenueAnalytics
          venue={myVenue}
          bookings={venueBookings}
          negotiations={venueNegotiations}
        />
      )}

    </div>
  );
};
