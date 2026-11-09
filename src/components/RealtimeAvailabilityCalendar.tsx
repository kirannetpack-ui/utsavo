/**
 * UTSAVO — Real-Time Availability & Auspicious Panchanga Calendar Component
 * Used across both Venue Detail Modal and Cultural Vendors Directory.
 * Displays:
 * 1. Live slot availability (Available, Limited, Booked)
 * 2. Integrated Hindu Panchanga Auspicious Muhurats (विवाह, व्रतबन्ध, पास्नी, गृहप्रवेश)
 * 3. 1-click date locking and WhatsApp/Viber direct inquiry
 */

import React, { useState, useEffect } from 'react';
import {
  DayAvailability,
  getEntityAvailability,
  lockEntitySlot,
  SlotState
} from '../utils/availabilityEngine';
import { PanchangaMuhurat, ShiftTime } from '../types';
import { WhatsAppViberButtons } from './WhatsAppViberButtons';
import {
  Calendar as CalendarIcon,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Flame,
  Check,
  Send,
  Lock,
  Layers,
  Info
} from 'lucide-react';

interface RealtimeAvailabilityCalendarProps {
  entityType: 'VENUE' | 'VENDOR';
  entityId: string;
  entityName: string;
  contactPhone: string;
  initialDateBS?: string;
  onSelectSlot?: (dateBS: string, dateAD: string, shift: ShiftTime, muhurat?: PanchangaMuhurat) => void;
  onProceedToQuote?: (dateBS: string, shift: ShiftTime) => void;
}

const MONTH_TABS = [
  { id: 'Mangsir', label: 'Mangsir (मंसिर)', season: 'Peak Wedding Season 2081' },
  { id: 'Poush', label: 'Poush (पुष)', season: 'Winter Ceremonies 2081' },
  { id: 'Magh', label: 'Magh (माघ)', season: 'Basanta Panchami 2081' },
  { id: 'Falgun', label: 'Falgun (फागुन)', season: 'Spring Vivaha Lagan 2081' },
  { id: 'Chaitra', label: 'Chaitra (चैत)', season: 'Chaitra Navaratri 2081' },
  { id: 'Baishakh', label: 'Baishakh (वैशाख)', season: 'Akshaya Tritiya 2082' },
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const RealtimeAvailabilityCalendar: React.FC<RealtimeAvailabilityCalendarProps> = ({
  entityType,
  entityId,
  entityName,
  contactPhone,
  initialDateBS,
  onSelectSlot,
  onProceedToQuote,
}) => {
  const [selectedMonth, setSelectedMonth] = useState('Mangsir');
  const [onlyAuspicious, setOnlyAuspicious] = useState(false);
  const [days, setDays] = useState<DayAvailability[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayAvailability | null>(null);
  const [selectedShift, setSelectedShift] = useState<ShiftTime>('EVENING');
  const [lockFeedback, setLockFeedback] = useState<string | null>(null);

  // Load live availability
  const refreshAvailability = () => {
    const data = getEntityAvailability(entityId, selectedMonth);
    setDays(data);

    // Pick first auspicious day or initial day if not selected
    if (!selectedDay || selectedDay.monthName !== selectedMonth) {
      const match = data.find((d) => d.dateBS === initialDateBS) ||
                    data.find((d) => d.isAuspicious) ||
                    data[0];
      setSelectedDay(match || null);
    } else {
      // Refresh current day from data
      const updated = data.find((d) => d.dateBS === selectedDay.dateBS);
      if (updated) setSelectedDay(updated);
    }
  };

  useEffect(() => {
    refreshAvailability();
  }, [entityId, selectedMonth]);

  // Listen for real-time booking events across tabs or components
  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail?.entityId === entityId) {
        refreshAvailability();
      }
    };
    window.addEventListener('utsavo:availability_updated', handleUpdate);
    return () => window.removeEventListener('utsavo:availability_updated', handleUpdate);
  }, [entityId, selectedMonth]);

  const handleSelectDay = (day: DayAvailability) => {
    setSelectedDay(day);
    if (onSelectSlot) {
      onSelectSlot(day.dateBS, day.dateAD, selectedShift, day.muhurat);
    }
  };

  const handleLockSlot = () => {
    if (!selectedDay) return;
    const ok = lockEntitySlot(entityId, selectedMonth, selectedDay.dateBS, selectedShift, 'Client (You)');
    if (ok) {
      setLockFeedback(`Slot reserved successfully for ${selectedDay.dateBS}!`);
      refreshAvailability();
      setTimeout(() => setLockFeedback(null), 3500);
      if (onSelectSlot) {
        onSelectSlot(selectedDay.dateBS, selectedDay.dateAD, selectedShift, selectedDay.muhurat);
      }
    }
  };

  // Filtered days
  const filteredDays = days.filter((d) => {
    if (onlyAuspicious) return d.isAuspicious;
    return true;
  });

  // Calculate month statistics
  const totalDays = days.length;
  const auspiciousDaysCount = days.filter((d) => d.isAuspicious).length;
  const availableDaysCount = days.filter((d) => d.overallStatus === 'AVAILABLE').length;
  const limitedDaysCount = days.filter((d) => d.overallStatus === 'LIMITED').length;
  const bookedDaysCount = days.filter((d) => d.overallStatus === 'BOOKED').length;

  // WhatsApp Inquiry message for selected date
  const waInquiryMessage = selectedDay
    ? `🙏 *UTSAVO Real-Time Booking Inquiry* 🙏

Hello ${entityName},

I am inquiring about availability for *${selectedDay.dateBS} BS (${selectedDay.dateAD} AD)*.
${selectedDay.muhurat ? `✨ Auspicious Occasion: *${selectedDay.muhurat.eventType}* (${selectedDay.muhurat.auspiciousTime})` : ''}
⏰ Preferred Shift: *${selectedShift}*

Kindly confirm reservation terms and pricing. Thank you!`
    : '';

  return (
    <div className="space-y-6">
      
      {/* Month Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-200">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
            Select Hindu Panchanga Month (२०८१ / २०८२)
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            {MONTH_TABS.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMonth(m.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  selectedMonth === m.id
                    ? 'bg-amber-950 text-white shadow-xs'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Toggle: Only Auspicious Dates */}
        <button
          onClick={() => setOnlyAuspicious(!onlyAuspicious)}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
            onlyAuspicious
              ? 'bg-amber-100 text-amber-950 border border-amber-300 shadow-2xs'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>{onlyAuspicious ? 'Showing Auspicious Dates' : 'Highlight Auspicious Muhurats'}</span>
        </button>
      </div>

      {/* Real-time Status Legend & Summary Counter */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-amber-50/40 rounded-2xl border border-amber-200/60 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
          <div>
            <span className="font-bold text-stone-900 block">{availableDaysCount} Dates Free</span>
            <span className="text-[10px] text-stone-500">All shifts available</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
          <div>
            <span className="font-bold text-stone-900 block">{limitedDaysCount} Limited</span>
            <span className="text-[10px] text-stone-500">Morning or Evening open</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
          <div>
            <span className="font-bold text-stone-900 block">{bookedDaysCount} Booked</span>
            <span className="text-[10px] text-stone-500">Fully locked</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-amber-200/70 text-amber-900">
            <Sparkles className="w-3 h-3 text-amber-800" />
          </div>
          <div>
            <span className="font-bold text-amber-950 block">{auspiciousDaysCount} Auspicious</span>
            <span className="text-[10px] text-amber-800">Panchanga Samiti dates</span>
          </div>
        </div>
      </div>

      {/* Main Calendar Matrix & Selected Date Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: 7-Day Week Calendar Grid */}
        <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-amber-800" />
              <h4 className="font-display font-bold text-stone-900 text-sm">
                {selectedMonth} 2081 Schedule & Auspicious Dates
              </h4>
            </div>
            <span className="text-[11px] font-semibold text-stone-500">
              {filteredDays.length} days listed
            </span>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] uppercase font-bold text-stone-400 py-1">
            {WEEKDAYS.map((wd) => (
              <span key={wd}>{wd}</span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {filteredDays.map((day) => {
              const isSelected = selectedDay?.dateBS === day.dateBS;

              let statusColor = 'bg-emerald-500';
              if (day.overallStatus === 'LIMITED') statusColor = 'bg-amber-500';
              if (day.overallStatus === 'BOOKED') statusColor = 'bg-rose-500';

              return (
                <button
                  key={day.dateBS}
                  onClick={() => handleSelectDay(day)}
                  className={`min-h-[72px] p-1.5 rounded-2xl border text-left transition-all flex flex-col justify-between relative group ${
                    isSelected
                      ? 'border-amber-950 bg-amber-50/80 shadow-md ring-2 ring-amber-900/30'
                      : day.isAuspicious
                      ? 'border-amber-300 bg-amber-50/30 hover:border-amber-400 hover:bg-amber-50'
                      : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50'
                  }`}
                >
                  {/* Auspicious Glowing Ring */}
                  {day.isAuspicious && (
                    <span className="absolute -top-1 -right-1 text-xs select-none" title="Panchanga Auspicious Muhurat">
                      ✨
                    </span>
                  )}

                  {/* Day numbers */}
                  <div className="flex items-start justify-between w-full">
                    <span className="font-display font-bold text-sm text-stone-900">
                      {day.dayNumber}
                    </span>
                    <span className="text-[9px] text-stone-400 font-mono">
                      {day.dateAD.split('-')[2]}
                    </span>
                  </div>

                  {/* Auspicious Event Tag or Status */}
                  <div className="w-full mt-1">
                    {day.muhurat ? (
                      <span className="text-[9px] font-bold text-amber-900 bg-amber-200/70 px-1 py-0.5 rounded block truncate text-center">
                        {day.muhurat.eventType === 'WEDDING' ? 'विवाह' : day.muhurat.eventType}
                      </span>
                    ) : (
                      <span className="text-[9px] text-stone-400 block truncate">
                        {day.dayOfWeek.slice(0, 3)}
                      </span>
                    )}
                  </div>

                  {/* Real-time Status Dots */}
                  <div className="flex items-center justify-between w-full pt-1">
                    <div className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${statusColor}`} />
                      <span className="text-[8px] font-semibold text-stone-500 uppercase">
                        {day.overallStatus === 'BOOKED' ? 'Booked' : day.overallStatus === 'LIMITED' ? 'Limited' : 'Free'}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 text-[11px] text-stone-400 flex items-center justify-between">
            <span>✨ Golden badges indicate official Nepal Panchanga Samiti dates</span>
            <span className="text-stone-500 font-medium">Bikram Sambat 2081 / 2082</span>
          </div>
        </div>

        {/* Right: Selected Date Detail & Live Booking Card */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-5">
          {selectedDay ? (
            <div className="space-y-4">
              
              {/* Card Header */}
              <div className="border-b border-stone-100 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-stone-400">
                    Selected Celebration Date
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedDay.overallStatus === 'AVAILABLE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedDay.overallStatus === 'LIMITED'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {selectedDay.overallStatus === 'AVAILABLE'
                      ? '● Fully Available'
                      : selectedDay.overallStatus === 'LIMITED'
                      ? '◐ Limited Slots'
                      : '✕ Fully Booked'}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-stone-900 mt-1">
                  {selectedDay.dateBS} BS
                </h3>
                <p className="text-xs text-stone-500">
                  {selectedDay.dayOfWeek} · {selectedDay.dateAD} AD
                </p>
              </div>

              {/* Toast Feedback */}
              {lockFeedback && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{lockFeedback}</span>
                </div>
              )}

              {/* Auspicious Panchanga Muhurat Information Card */}
              {selectedDay.muhurat ? (
                <div className="p-4 bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-100/40 rounded-2xl border border-amber-300 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-950 flex items-center gap-1.5 uppercase text-[10px]">
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                      <span>Approved Panchanga Muhurat</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full shadow-2xs">
                      {selectedDay.muhurat.eventType}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-stone-500 block">Tithi (तिथि):</span>
                      <strong className="text-stone-800">{selectedDay.muhurat.tithi}</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Nakshatra (नक्षत्र):</span>
                      <strong className="text-stone-800">{selectedDay.muhurat.nakshatra}</strong>
                    </div>
                  </div>

                  <div className="p-2 bg-white/80 rounded-xl border border-amber-200/80 text-[11px]">
                    <span className="text-amber-900 font-bold block">Auspicious Time Window:</span>
                    <span className="font-mono text-stone-800 font-semibold">{selectedDay.muhurat.auspiciousTime}</span>
                  </div>

                  <p className="text-[10px] text-stone-600 italic leading-relaxed pt-1">
                    "{selectedDay.muhurat.significance}"
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 flex items-center gap-2">
                  <Info className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>Standard celebration date. Custom Purohit astrological consultation available.</span>
                </div>
              )}

              {/* Real-time Shift Slots Picker */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-stone-800 block">
                  Select Real-Time Shift Slot:
                </span>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'MORNING', label: 'Morning Slot', time: '07:00 AM - 11:30 AM', state: selectedDay.shifts.MORNING },
                    { id: 'DAY', label: 'Day Feast', time: '11:30 AM - 04:30 PM', state: selectedDay.shifts.DAY },
                    { id: 'EVENING', label: 'Evening Reception', time: '05:00 PM - 10:30 PM', state: selectedDay.shifts.EVENING },
                    { id: 'FULL_DAY', label: 'Full Day Sacred', time: 'Full Day Auspicious', state: selectedDay.shifts.FULL_DAY },
                  ].map((s) => {
                    const isSelectedShift = selectedShift === s.id;
                    const isBooked = s.state === 'BOOKED';
                    const isHold = s.state === 'HOLD';

                    return (
                      <button
                        key={s.id}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setSelectedShift(s.id as ShiftTime)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isBooked
                            ? 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed opacity-60'
                            : isSelectedShift
                            ? 'bg-amber-950 text-white border-amber-950 shadow-sm'
                            : 'bg-white border-stone-200 text-stone-800 hover:border-amber-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-[11px]">{s.label}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            isBooked
                              ? 'bg-rose-100 text-rose-800'
                              : isHold
                              ? 'bg-amber-100 text-amber-900'
                              : isSelectedShift
                              ? 'bg-white/20 text-white'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {isBooked ? 'Booked' : isHold ? 'On Hold' : 'Free'}
                          </span>
                        </div>
                        <span className={`text-[10px] block ${isSelectedShift ? 'text-stone-300' : 'text-stone-500'}`}>
                          {s.time}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons: 1-Click Lock + Direct Chat */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleLockSlot}
                  className="w-full py-2.5 px-4 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-300" />
                  <span>Lock {selectedShift} Slot for {selectedDay.dayNumber} {selectedMonth}</span>
                </button>

                {onProceedToQuote && (
                  <button
                    type="button"
                    onClick={() => onProceedToQuote(selectedDay.dateBS, selectedShift)}
                    className="w-full py-2 px-4 bg-stone-900 hover:bg-stone-950 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Configure Menu & Quotation for this Date →</span>
                  </button>
                )}

                {/* Direct Instant Chat */}
                <div className="pt-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1 text-center">
                    Direct WhatsApp / Viber Inquiries
                  </span>
                  <WhatsAppViberButtons
                    phone={contactPhone}
                    messageText={waInquiryMessage}
                    variant="full"
                  />
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-stone-400 text-xs">
              Select a date from the calendar to inspect real-time availability.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
