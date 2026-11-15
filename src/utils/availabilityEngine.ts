/**
 * UTSAVO — Real-Time Availability & Panchanga Muhurat Integration Engine
 * Provides live slot tracking (Available, Limited, Booked) for both Venues & Cultural Vendors.
 * Fully synchronized with Nepal Panchanga Nirnayak Samiti auspicious dates (2081 / 2082).
 */

import { PANCHANGA_AUSPICIOUS_MUHURATS, NEPALI_MONTHS } from '../data/panchangaCalendar';
import { PanchangaMuhurat, ShiftTime } from '../types';

export type SlotState = 'AVAILABLE' | 'HOLD' | 'BOOKED';

export interface DayAvailability {
  dateBS: string;          // e.g. "2081 Mangsir 14"
  dateAD: string;          // e.g. "2024-11-29"
  monthName: string;       // e.g. "Mangsir"
  dayNumber: number;       // e.g. 14
  dayOfWeek: string;       // e.g. "Friday"
  isAuspicious: boolean;
  muhurat?: PanchangaMuhurat;
  shifts: {
    MORNING: SlotState;
    DAY: SlotState;
    EVENING: SlotState;
    FULL_DAY: SlotState;
  };
  overallStatus: 'AVAILABLE' | 'LIMITED' | 'BOOKED';
  bookedBy?: string;
  notes?: string;
}

// Generate realistic calendar days for Nepali months
// Mangsir 2081 has 30 days starting on Saturday
const MONTH_LENGTHS: Record<string, { days: number; startDayIndex: number; yearBS: number; startYearAD: number; startMonthAD: number; startDayAD: number }> = {
  Mangsir: { days: 30, startDayIndex: 6, yearBS: 2081, startYearAD: 2024, startMonthAD: 11, startDayAD: 16 }, // Nov 16, 2024
  Poush: { days: 29, startDayIndex: 1, yearBS: 2081, startYearAD: 2024, startMonthAD: 12, startDayAD: 16 },
  Magh: { days: 30, startDayIndex: 3, yearBS: 2081, startYearAD: 2025, startMonthAD: 1, startDayAD: 14 },
  Falgun: { days: 30, startDayIndex: 5, yearBS: 2081, startYearAD: 2025, startMonthAD: 2, startDayAD: 13 },
  Chaitra: { days: 30, startDayIndex: 0, yearBS: 2081, startYearAD: 2025, startMonthAD: 3, startDayAD: 15 },
  Baishakh: { days: 31, startDayIndex: 2, yearBS: 2082, startYearAD: 2025, startMonthAD: 4, startDayAD: 14 },
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Generate monthly schedule with realistic seed bookings and live localStorage updates
 */
export function getEntityAvailability(entityId: string, monthName: string = 'Mangsir'): DayAvailability[] {
  const monthMeta = MONTH_LENGTHS[monthName] || MONTH_LENGTHS['Mangsir'];
  const storageKey = `utsavo_availability_${entityId}_${monthName}`;

  let storedOverrides: Record<string, any> = {};
  if (typeof window !== 'undefined') {
    try {
      const item = localStorage.getItem(storageKey);
      if (item) storedOverrides = JSON.parse(item);
    } catch (e) {
      console.error('Error reading availability', e);
    }
  }

  const days: DayAvailability[] = [];

  for (let d = 1; d <= monthMeta.days; d++) {
    const dayOfWeekIndex = (monthMeta.startDayIndex + (d - 1)) % 7;
    const dayOfWeek = DAY_NAMES[dayOfWeekIndex];
    const dateBS = `${monthMeta.yearBS} ${monthName} ${d < 10 ? '0' + d : d}`;

    // Approximate AD date
    const adDateObj = new Date(monthMeta.startYearAD, monthMeta.startMonthAD - 1, monthMeta.startDayAD + (d - 1));
    const dateAD = adDateObj.toISOString().split('T')[0];

    // Check if this date has a verified Panchanga Muhurat
    const muhurat = PANCHANGA_AUSPICIOUS_MUHURATS.find((m) => {
      // Match BS month and day or AD date
      const matchBS = m.dateBS.includes(monthName) && m.dateBS.includes(String(d));
      const matchAD = m.dateAD === dateAD;
      return matchBS || matchAD;
    });

    // Check stored user overrides
    if (storedOverrides[dateBS]) {
      days.push(storedOverrides[dateBS]);
      continue;
    }

    // Default realistic seed status:
    // Auspicious dates tend to be high demand (Limited or Booked)
    // Regular weekdays are largely Available
    let morningState: SlotState = 'AVAILABLE';
    let dayState: SlotState = 'AVAILABLE';
    let eveningState: SlotState = 'AVAILABLE';
    let fullDayState: SlotState = 'AVAILABLE';

    if (muhurat) {
      // High demand on auspicious dates: simulate popular booking pattern
      if (d === 14) {
        // e.g. Mangsir 14 (Supreme Sarva Siddhi)
        morningState = 'BOOKED';
        dayState = 'BOOKED';
        eveningState = 'HOLD';
        fullDayState = 'BOOKED';
      } else if (d === 18) {
        morningState = 'AVAILABLE';
        dayState = 'BOOKED';
        eveningState = 'BOOKED';
        fullDayState = 'HOLD';
      } else if (d === 24) {
        morningState = 'AVAILABLE';
        dayState = 'AVAILABLE';
        eveningState = 'HOLD';
        fullDayState = 'AVAILABLE';
      } else if (d === 8 || d === 22) {
        morningState = 'BOOKED';
        dayState = 'AVAILABLE';
        eveningState = 'AVAILABLE';
        fullDayState = 'AVAILABLE';
      }
    } else if (d % 6 === 0) {
      // Some weekend dates booked
      eveningState = 'BOOKED';
    }

    const isFullyBooked = morningState === 'BOOKED' && eveningState === 'BOOKED';
    const isLimited = (morningState === 'BOOKED' || eveningState === 'BOOKED' || dayState === 'BOOKED' || eveningState === 'HOLD');

    const overallStatus: 'AVAILABLE' | 'LIMITED' | 'BOOKED' = isFullyBooked
      ? 'BOOKED'
      : isLimited
      ? 'LIMITED'
      : 'AVAILABLE';

    days.push({
      dateBS,
      dateAD,
      monthName,
      dayNumber: d,
      dayOfWeek,
      isAuspicious: !!muhurat,
      muhurat,
      shifts: {
        MORNING: morningState,
        DAY: dayState,
        EVENING: eveningState,
        FULL_DAY: fullDayState,
      },
      overallStatus,
    });
  }

  return days;
}

/**
 * Real-time booking / lock slot action
 */
export function lockEntitySlot(
  entityId: string,
  monthName: string,
  dateBS: string,
  shift: ShiftTime,
  clientName: string = 'Verified Client'
): boolean {
  if (typeof window === 'undefined') return false;

  const storageKey = `utsavo_availability_${entityId}_${monthName}`;
  try {
    const currentList = getEntityAvailability(entityId, monthName);
    const day = currentList.find((d) => d.dateBS === dateBS);
    if (!day) return false;

    // Update shift state
    if (shift === 'FULL_DAY') {
      day.shifts.MORNING = 'BOOKED';
      day.shifts.DAY = 'BOOKED';
      day.shifts.EVENING = 'BOOKED';
      day.shifts.FULL_DAY = 'BOOKED';
      day.overallStatus = 'BOOKED';
    } else {
      day.shifts[shift] = 'BOOKED';
      const allBooked = day.shifts.MORNING === 'BOOKED' && day.shifts.EVENING === 'BOOKED';
      day.overallStatus = allBooked ? 'BOOKED' : 'LIMITED';
    }

    day.bookedBy = clientName;
    day.notes = `Locked for ${clientName} (${shift} Shift)`;

    // Save override
    const item = localStorage.getItem(storageKey);
    const overrides = item ? JSON.parse(item) : {};
    overrides[dateBS] = day;
    localStorage.setItem(storageKey, JSON.stringify(overrides));

    // Dispatch global storage event for instant UI re-render across all open tabs/modals
    window.dispatchEvent(new CustomEvent('utsavo:availability_updated', {
      detail: { entityId, dateBS, shift }
    }));

    return true;
  } catch (e) {
    console.error('Error locking slot', e);
    return false;
  }
}

export interface PopularVenueSlotDetail {
  venueId: string;
  venueName: string;
  district: string;
  rating: number;
  reviewCount: number;
  status: 'BOOKED_UNAVAILABLE' | 'LIMITED_HOLD' | 'AVAILABLE';
  reasonLabel: string;
  bookingRef?: string;
  availableShifts: ShiftTime[];
}

export interface MuhuratAvailabilitySummary {
  muhuratId: string;
  dateBS: string;
  dateAD: string;
  popularVenuesChecked: number;
  bookedOrUnavailableCount: number;
  limitedHoldCount: number;
  openAvailableCount: number;
  flagLevel: 'UNAVAILABLE_POPULAR' | 'HIGH_CONTENTION' | 'GOOD_AVAILABILITY';
  flagHeadline: string;
  venueBreakdown: PopularVenueSlotDetail[];
}

export function extractNepaliMonthFromDateBS(dateBS: string): string {
  const parts = dateBS.trim().split(/\s+/);
  const candidate = parts.length >= 2 ? parts[1] : 'Mangsir';
  return MONTH_LENGTHS[candidate] ? candidate : 'Mangsir';
}

/**
 * Automatically evaluates a Panchanga Muhurat date across the marketplace's most popular venues,
 * combining live confirmed/hold bookings, active negotiations, and per-venue slot availability.
 */
export function analyzeMuhuratAcrossPopularVenues(
  muhurat: PanchangaMuhurat,
  venues: Array<{ id: string; name: string; district: string; rating: number; reviewCount: number }>,
  bookings: Array<{
    venueId: string;
    eventDateBS: string;
    eventDateAD: string;
    status: string;
    shift: ShiftTime;
    bookingRef: string;
  }>,
  negotiations: Array<{
    venueId: string;
    status: string;
    versions: Array<{ dateBS: string; dateAD: string; shift: ShiftTime }>;
  }> = []
): MuhuratAvailabilitySummary {
  // Rank top 5 popular venues by rating & review count
  const popularVenues = [...venues]
    .sort((a, b) => b.rating * 100 + b.reviewCount - (a.rating * 100 + a.reviewCount))
    .slice(0, 5);

  const monthName = extractNepaliMonthFromDateBS(muhurat.dateBS);

  const venueBreakdown: PopularVenueSlotDetail[] = popularVenues.map((venue, idx) => {
    const activeBooking = bookings.find(
      (b) =>
        b.venueId === venue.id &&
        b.status !== 'CANCELLED' &&
        (b.eventDateBS === muhurat.dateBS || b.eventDateAD === muhurat.dateAD)
    );

    const activeNeg = negotiations.find(
      (n) =>
        n.venueId === venue.id &&
        n.status !== 'REJECTED' &&
        n.status !== 'EXPIRED' &&
        n.versions.some((v) => v.dateBS === muhurat.dateBS || v.dateAD === muhurat.dateAD)
    );

    const monthSchedule = getEntityAvailability(venue.id, monthName);
    const dayEntry = monthSchedule.find(
      (d) => d.dateBS === muhurat.dateBS || d.dateAD === muhurat.dateAD
    );

    const shiftsMap = dayEntry?.shifts || {
      MORNING: 'AVAILABLE' as SlotState,
      DAY: 'AVAILABLE' as SlotState,
      EVENING: 'AVAILABLE' as SlotState,
      FULL_DAY: 'AVAILABLE' as SlotState,
    };

    // Realistic contention for peak sacred Muhurats across different popular venues
    const isPeakWedding =
      muhurat.dateBS.includes('Mangsir 14') ||
      muhurat.dateBS.includes('Baishakh 19') ||
      muhurat.dateBS.includes('Magh 22');
    const isMediumDemand =
      muhurat.dateBS.includes('Mangsir 18') ||
      muhurat.dateBS.includes('Mangsir 24') ||
      muhurat.dateBS.includes('Falgun 14');

    const availableShifts: ShiftTime[] = [];
    (['MORNING', 'DAY', 'EVENING', 'FULL_DAY'] as ShiftTime[]).forEach((s) => {
      if (shiftsMap[s] === 'AVAILABLE') {
        availableShifts.push(s);
      }
    });

    if (activeBooking) {
      if (activeBooking.shift === 'FULL_DAY' || activeBooking.shift === 'DAY') {
        return {
          venueId: venue.id,
          venueName: venue.name,
          district: venue.district,
          rating: venue.rating,
          reviewCount: venue.reviewCount,
          status: 'BOOKED_UNAVAILABLE',
          reasonLabel: `Booked (${activeBooking.status.replace(/_/g, ' ')} · ${activeBooking.shift.replace('_', ' ')} #${activeBooking.bookingRef})`,
          bookingRef: activeBooking.bookingRef,
          availableShifts: [],
        };
      }
      return {
        venueId: venue.id,
        venueName: venue.name,
        district: venue.district,
        rating: venue.rating,
        reviewCount: venue.reviewCount,
        status: 'LIMITED_HOLD',
        reasonLabel: `${activeBooking.shift} booked (#${activeBooking.bookingRef}); alternate shifts open`,
        bookingRef: activeBooking.bookingRef,
        availableShifts: availableShifts.filter((s) => s !== activeBooking.shift && s !== 'FULL_DAY'),
      };
    }

    if (activeNeg) {
      return {
        venueId: venue.id,
        venueName: venue.name,
        district: venue.district,
        rating: venue.rating,
        reviewCount: venue.reviewCount,
        status: 'LIMITED_HOLD',
        reasonLabel: 'Negotiation in progress / soft hold placed by host',
        availableShifts: ['MORNING'],
      };
    }

    if (dayEntry?.overallStatus === 'BOOKED' || (isPeakWedding && idx <= 3)) {
      return {
        venueId: venue.id,
        venueName: venue.name,
        district: venue.district,
        rating: venue.rating,
        reviewCount: venue.reviewCount,
        status: 'BOOKED_UNAVAILABLE',
        reasonLabel: isPeakWedding
          ? 'Peak Lagna date reserved across main & lawn halls'
          : 'All prime celebration shifts already reserved',
        availableShifts: [],
      };
    }

    if (dayEntry?.overallStatus === 'LIMITED' || (isMediumDemand && idx <= 2)) {
      return {
        venueId: venue.id,
        venueName: venue.name,
        district: venue.district,
        rating: venue.rating,
        reviewCount: venue.reviewCount,
        status: 'LIMITED_HOLD',
        reasonLabel: 'Evening ballroom reserved · Morning slot remaining',
        availableShifts: ['MORNING'],
      };
    }

    return {
      venueId: venue.id,
      venueName: venue.name,
      district: venue.district,
      rating: venue.rating,
      reviewCount: venue.reviewCount,
      status: 'AVAILABLE',
      reasonLabel: 'All indoor & garden shifts open for booking',
      availableShifts: availableShifts.length > 0 ? availableShifts : ['MORNING', 'DAY', 'EVENING', 'FULL_DAY'],
    };
  });

  const bookedOrUnavailableCount = venueBreakdown.filter((v) => v.status === 'BOOKED_UNAVAILABLE').length;
  const limitedHoldCount = venueBreakdown.filter((v) => v.status === 'LIMITED_HOLD').length;
  const openAvailableCount = venueBreakdown.filter((v) => v.status === 'AVAILABLE').length;
  const popularVenuesChecked = venueBreakdown.length;

  let flagLevel: MuhuratAvailabilitySummary['flagLevel'] = 'GOOD_AVAILABILITY';
  let flagHeadline = `${openAvailableCount}/${popularVenuesChecked} Popular Venues Open`;

  if (popularVenuesChecked > 0 && bookedOrUnavailableCount >= Math.max(3, Math.ceil(popularVenuesChecked * 0.6))) {
    flagLevel = 'UNAVAILABLE_POPULAR';
    flagHeadline = `High Risk: ${bookedOrUnavailableCount}/${popularVenuesChecked} Popular Venues Booked`;
  } else if (bookedOrUnavailableCount + limitedHoldCount >= 2) {
    flagLevel = 'HIGH_CONTENTION';
    flagHeadline = `Limited: ${bookedOrUnavailableCount} Booked · ${limitedHoldCount} Partial Hold`;
  }

  return {
    muhuratId: muhurat.id,
    dateBS: muhurat.dateBS,
    dateAD: muhurat.dateAD,
    popularVenuesChecked,
    bookedOrUnavailableCount,
    limitedHoldCount,
    openAvailableCount,
    flagLevel,
    flagHeadline,
    venueBreakdown,
  };
}

