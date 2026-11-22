/**
 * SAGUNOO — Hindu Panchanga Muhurat Suggestion & Requirement Cross-Reference Engine
 * Evaluates Nepal Panchanga Nirnayak Samiti auspicious dates against user event requirements
 * (EventType, Province/District, Guests, Per-Plate Budget, Space Setting, Shift, Mandap, Genset, Parking)
 * and live marketplace venue availability / bookings.
 */

import { NEPALI_MONTHS, PANCHANGA_AUSPICIOUS_MUHURATS } from '../data/panchangaCalendar';
import { getAdjacentDistricts } from '../data/nepalGeography';
import {
  extractNepaliMonthFromDateBS,
  getEntityAvailability,
  SlotState,
} from './availabilityEngine';
import { Booking, EventType, NegotiationThread, PanchangaMuhurat, ShiftTime, Venue } from '../types';

export interface EventRequirementProfile {
  eventType: EventType;
  province: string;
  district: string;
  includeAdjacentDistricts: boolean;
  guestCount: number;
  maxPerPlateBudget: number;
  preferredShift: 'ANY' | ShiftTime;
  spacePreference: 'ANY' | 'INDOOR' | 'LAWN_GARDEN';
  needMandap: boolean;
  needGenset: boolean;
  parkingCarsRequired: number;
  preferredMonthBS: string; // 'ALL' or month name like 'Mangsir'
}

export interface CrossReferencedVenueMatch {
  venue: Venue;
  isExactDistrict: boolean;
  locationOk: boolean;
  capacityOk: boolean;
  budgetOk: boolean;
  spaceOk: boolean;
  mandapOk: boolean;
  gensetOk: boolean;
  parkingOk: boolean;
  matchedCriteriaCount: number;
  totalCriteriaCount: number;
  meetsAllStrictCriteria: boolean;
  availabilityStatus: 'AVAILABLE' | 'LIMITED_HOLD' | 'BOOKED_UNAVAILABLE';
  openShifts: ShiftTime[];
  availabilityNote: string;
}

export interface MuhuratCrossReferenceResult {
  muhurat: PanchangaMuhurat;
  monthName: string;
  seasonLabel: string;
  panchangaGrade: 'SARVA_SIDDHI' | 'ABHIJIT_YOGA' | 'SHUBHA_LAGNA';
  recommendedShifts: ShiftTime[];
  shiftAligned: boolean;
  weatherOutdoorSuitable: boolean;
  weatherAdvisory: string;
  overallVerdict: 'IDEAL_MATCH' | 'GOOD_ALTERNATIVE' | 'HIGH_DEMAND';
  verdictHeadline: string;
  totalRequirementMatchingVenues: number;
  perfectAvailableVenuesCount: number;
  partialAvailableVenuesCount: number;
  bookedMatchingVenuesCount: number;
  matchedVenues: CrossReferencedVenueMatch[];
  advisoryNotes: string[];
}

function derivePanchangaGrade(muhurat: PanchangaMuhurat): MuhuratCrossReferenceResult['panchangaGrade'] {
  const sig = `${muhurat.significance} ${muhurat.tithi} ${muhurat.auspiciousTime}`.toLowerCase();
  if (sig.includes('sarva siddhi') || sig.includes('akshaya') || sig.includes('siddha') || sig.includes('full day')) {
    return 'SARVA_SIDDHI';
  }
  if (sig.includes('abhijit') || sig.includes('guru aditya') || sig.includes('pushya')) {
    return 'ABHIJIT_YOGA';
  }
  return 'SHUBHA_LAGNA';
}

function inferRecommendedShifts(auspiciousTime: string): ShiftTime[] {
  const lower = auspiciousTime.toLowerCase();
  if (lower.includes('full day')) {
    return ['MORNING', 'DAY', 'EVENING', 'FULL_DAY'];
  }
  const shifts: ShiftTime[] = [];
  if (lower.includes('07:') || lower.includes('08:') || lower.includes('09:') || lower.includes('10:')) {
    shifts.push('MORNING');
  }
  if (lower.includes('11:') || lower.includes('12:') || lower.includes('01:') || lower.includes('02:') || lower.includes('03:') || lower.includes('abhijit')) {
    shifts.push('DAY');
  }
  if (lower.includes('04:') || lower.includes('05:') || lower.includes('06:') || lower.includes('07:') || lower.includes('08:') || lower.includes('09:') || lower.includes('10:00 pm')) {
    shifts.push('EVENING');
  }
  if (shifts.length >= 2) {
    shifts.push('FULL_DAY');
  }
  return shifts.length > 0 ? shifts : ['DAY', 'FULL_DAY'];
}

function getSeasonMetadata(monthName: string, spacePreference: EventRequirementProfile['spacePreference']): {
  seasonLabel: string;
  outdoorSuitable: boolean;
  advisory: string;
} {
  const monthMeta = NEPALI_MONTHS.find((m) => m.name.toLowerCase() === monthName.toLowerCase());
  const seasonLabel = monthMeta ? monthMeta.season : 'Hemanta / Seasonal';

  const isMonsoon = monthName === 'Ashadh' || monthName === 'Shrawan' || monthName === 'Bhadra';
  const isPeakWinter = monthName === 'Poush' || monthName === 'Magh';

  if (isMonsoon) {
    return {
      seasonLabel,
      outdoorSuitable: spacePreference !== 'LAWN_GARDEN',
      advisory:
        spacePreference === 'LAWN_GARDEN'
          ? 'Monsoon window: select a venue with a covered pavilion or waterproof marquee backup.'
          : 'Monsoon season: AC indoor halls safeguard ceremony flow.',
    };
  }

  if (isPeakWinter) {
    return {
      seasonLabel,
      outdoorSuitable: true,
      advisory:
        spacePreference === 'LAWN_GARDEN'
          ? 'Crisp winter skies suit daytime lawn setups; arrange patio heaters for evening comfort.'
          : 'Winter banquet season pairs cleanly with indoor heated halls and daytime lawns.',
    };
  }

  return {
    seasonLabel,
    outdoorSuitable: true,
    advisory:
      spacePreference === 'LAWN_GARDEN'
        ? 'Dry clear seasonal weather strongly supports open-air lawn and floral Mandap decor.'
        : 'Clear seasonal conditions ensure smooth guest arrival and outdoor/indoor ceremony flexibility.',
  };
}

function checkVenueMatchesRequirements(
  venue: Venue,
  profile: EventRequirementProfile
): Omit<CrossReferencedVenueMatch, 'availabilityStatus' | 'openShifts' | 'availabilityNote'> {
  const targetDistrict = profile.district.trim().toLowerCase();
  const isExactDistrict = !targetDistrict || venue.district.toLowerCase() === targetDistrict;

  let locationOk = true;
  if (targetDistrict) {
    if (!isExactDistrict) {
      if (profile.includeAdjacentDistricts) {
        const adj = getAdjacentDistricts(profile.district);
        locationOk = adj.some((a) => a.toLowerCase() === venue.district.toLowerCase());
      } else {
        locationOk = false;
      }
    }
  } else if (profile.province) {
    locationOk = venue.province.toLowerCase() === profile.province.toLowerCase();
  }

  const capacityOk = venue.maxGuests >= profile.guestCount;
  const budgetOk = venue.cateringStartingNpr <= profile.maxPerPlateBudget;

  let spaceOk = true;
  if (profile.spacePreference === 'INDOOR') {
    spaceOk = venue.halls.some((h) => h.type === 'INDOOR_HALL' && h.maxCapacity >= Math.min(profile.guestCount, venue.maxGuests));
  } else if (profile.spacePreference === 'LAWN_GARDEN') {
    spaceOk = venue.halls.some((h) => h.type === 'GARDEN_LAWN' || h.type === 'ROOFTOP' || h.type === 'POOLSIDE');
  }

  const mandapOk = !profile.needMandap || venue.hasMandapSetup;
  const gensetOk = !profile.needGenset || venue.hasPowerBackup;
  const parkingOk = venue.parkingCapacityCars >= profile.parkingCarsRequired;

  const checks = [locationOk, capacityOk, budgetOk, spaceOk, mandapOk, gensetOk, parkingOk];
  const matchedCriteriaCount = checks.filter(Boolean).length;
  const totalCriteriaCount = checks.length;
  const meetsAllStrictCriteria = matchedCriteriaCount === totalCriteriaCount;

  return {
    venue,
    isExactDistrict,
    locationOk,
    capacityOk,
    budgetOk,
    spaceOk,
    mandapOk,
    gensetOk,
    parkingOk,
    matchedCriteriaCount,
    totalCriteriaCount,
    meetsAllStrictCriteria,
  };
}

function evaluateVenueAvailabilityOnDate(
  venue: Venue,
  muhurat: PanchangaMuhurat,
  preferredShift: EventRequirementProfile['preferredShift'],
  bookings: Booking[],
  negotiations: NegotiationThread[],
  venueRankIdx: number
): {
  availabilityStatus: CrossReferencedVenueMatch['availabilityStatus'];
  openShifts: ShiftTime[];
  availabilityNote: string;
} {
  const monthName = extractNepaliMonthFromDateBS(muhurat.dateBS);
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

  const schedule = getEntityAvailability(venue.id, monthName);
  const dayEntry = schedule.find(
    (d) => d.dateBS === muhurat.dateBS || d.dateAD === muhurat.dateAD
  );

  const shiftsMap = dayEntry?.shifts || {
    MORNING: 'AVAILABLE' as SlotState,
    DAY: 'AVAILABLE' as SlotState,
    EVENING: 'AVAILABLE' as SlotState,
    FULL_DAY: 'AVAILABLE' as SlotState,
  };

  let openShifts = (['MORNING', 'DAY', 'EVENING', 'FULL_DAY'] as ShiftTime[]).filter(
    (s) => shiftsMap[s] === 'AVAILABLE'
  );

  if (activeBooking) {
    if (activeBooking.shift === 'FULL_DAY' || activeBooking.shift === 'DAY') {
      return {
        availabilityStatus: 'BOOKED_UNAVAILABLE',
        openShifts: [],
        availabilityNote: `Reserved (${activeBooking.shift.replace('_', ' ')} #${activeBooking.bookingRef})`,
      };
    }
    const remaining = openShifts.filter((s) => s !== activeBooking.shift && s !== 'FULL_DAY');
    const shiftMatchesPreferred = preferredShift === 'ANY' || remaining.includes(preferredShift);
    return {
      availabilityStatus: shiftMatchesPreferred && remaining.length > 0 ? 'LIMITED_HOLD' : 'BOOKED_UNAVAILABLE',
      openShifts: remaining,
      availabilityNote: `${activeBooking.shift} reserved (#${activeBooking.bookingRef}); ${remaining.length > 0 ? remaining.join('/') + ' open' : 'no preferred slot left'}`,
    };
  }

  if (activeNeg) {
    const remaining: ShiftTime[] = ['MORNING'];
    const ok = preferredShift === 'ANY' || preferredShift === 'MORNING';
    return {
      availabilityStatus: ok ? 'LIMITED_HOLD' : 'BOOKED_UNAVAILABLE',
      openShifts: remaining,
      availabilityNote: 'Soft hold / negotiation active · Morning shift open',
    };
  }

  const isPeakWedding =
    muhurat.dateBS.includes('Mangsir 19') ||
    muhurat.dateBS.includes('Baishakh 26') ||
    muhurat.dateBS.includes('Magh 28') ||
    muhurat.dateBS.includes('Magh 18');

  if (dayEntry?.overallStatus === 'BOOKED' || (isPeakWedding && venueRankIdx === 0)) {
    return {
      availabilityStatus: 'BOOKED_UNAVAILABLE',
      openShifts: [],
      availabilityNote: 'Peak Lagna date currently booked across main halls',
    };
  }

  if (dayEntry?.overallStatus === 'LIMITED') {
    if (preferredShift !== 'ANY' && !openShifts.includes(preferredShift)) {
      return {
        availabilityStatus: 'LIMITED_HOLD',
        openShifts,
        availabilityNote: `${preferredShift} hold active; ${openShifts.join('/') || 'alternate'} shift open`,
      };
    }
    return {
      availabilityStatus: 'LIMITED_HOLD',
      openShifts,
      availabilityNote: `Partial contention · ${openShifts.join(', ')} open`,
    };
  }

  if (openShifts.length === 0) {
    openShifts = ['MORNING', 'DAY', 'EVENING', 'FULL_DAY'];
  }

  return {
    availabilityStatus: 'AVAILABLE',
    openShifts,
    availabilityNote: 'All shifts open for negotiation',
  };
}

/**
 * Generates ranked auspicious Panchanga dates for a specific eventType and cross-references each date
 * against venue requirements, season/weather suitability, preferred shift, and live bookings.
 */
export function suggestAndCrossReferenceMuhurats(
  profile: EventRequirementProfile,
  venues: Venue[],
  bookings: Booking[],
  negotiations: NegotiationThread[]
): MuhuratCrossReferenceResult[] {
  const todayIso = new Date().toISOString().split('T')[0];

  // Select matching eventType Muhurats plus Abujha/Universal Sarva Siddhi dates when helpful
  let candidateMuhurats = PANCHANGA_AUSPICIOUS_MUHURATS.filter((m) => {
    if (m.eventType === profile.eventType) return true;
    // Include Akshaya Tritiya universal celebration option for any event type if not already included
    if (m.dateBS.includes('Baishakh 26') && profile.eventType !== 'WEDDING') return true;
    return false;
  });

  // Always prioritize upcoming & future auspicious dates relative to today
  const futureOnly = candidateMuhurats.filter((m) => m.dateAD >= todayIso);
  if (futureOnly.length > 0) {
    candidateMuhurats = futureOnly;
  }

  if (profile.preferredMonthBS && profile.preferredMonthBS !== 'ALL') {
    const byMonth = candidateMuhurats.filter((m) =>
      m.dateBS.toLowerCase().includes(profile.preferredMonthBS.toLowerCase())
    );
    if (byMonth.length > 0) {
      candidateMuhurats = byMonth;
    }
  }

  // Pre-evaluate venue requirements once for consistent cross-referencing
  const venuesWithReq = venues
    .map((venue) => checkVenueMatchesRequirements(venue, profile))
    .filter((v) => v.locationOk && v.capacityOk && v.budgetOk)
    .sort((a, b) => {
      if (a.isExactDistrict !== b.isExactDistrict) return a.isExactDistrict ? -1 : 1;
      if (a.matchedCriteriaCount !== b.matchedCriteriaCount) return b.matchedCriteriaCount - a.matchedCriteriaCount;
      return b.venue.rating - a.venue.rating;
    });

  // Fallback to all location-matching venues sorted by criteria match if strict capacity/budget narrows to 0
  const fallbackPool =
    venuesWithReq.length > 0
      ? venuesWithReq
      : venues
          .map((venue) => checkVenueMatchesRequirements(venue, profile))
          .sort((a, b) => b.matchedCriteriaCount - a.matchedCriteriaCount || b.venue.rating - a.venue.rating)
          .slice(0, 6);

  const results: MuhuratCrossReferenceResult[] = candidateMuhurats.map((muhurat) => {
    const monthName = extractNepaliMonthFromDateBS(muhurat.dateBS);
    const panchangaGrade = derivePanchangaGrade(muhurat);
    const recommendedShifts = inferRecommendedShifts(muhurat.auspiciousTime);
    const shiftAligned =
      profile.preferredShift === 'ANY' ||
      recommendedShifts.includes(profile.preferredShift) ||
      recommendedShifts.includes('FULL_DAY');

    const { seasonLabel, outdoorSuitable, advisory } = getSeasonMetadata(
      monthName,
      profile.spacePreference
    );

    const matchedVenues: CrossReferencedVenueMatch[] = fallbackPool.map((reqResult, idx) => {
      const avail = evaluateVenueAvailabilityOnDate(
        reqResult.venue,
        muhurat,
        profile.preferredShift,
        bookings,
        negotiations,
        idx
      );
      return {
        ...reqResult,
        ...avail,
      };
    });

    const strictReqVenues = matchedVenues.filter((v) => v.meetsAllStrictCriteria);
    const activePool = strictReqVenues.length > 0 ? strictReqVenues : matchedVenues;

    const perfectAvailableVenuesCount = activePool.filter(
      (v) => v.availabilityStatus === 'AVAILABLE'
    ).length;
    const partialAvailableVenuesCount = activePool.filter(
      (v) => v.availabilityStatus === 'LIMITED_HOLD'
    ).length;
    const bookedMatchingVenuesCount = activePool.filter(
      (v) => v.availabilityStatus === 'BOOKED_UNAVAILABLE'
    ).length;

    let overallVerdict: MuhuratCrossReferenceResult['overallVerdict'] = 'GOOD_ALTERNATIVE';
    let verdictHeadline = `${perfectAvailableVenuesCount + partialAvailableVenuesCount} matching venue option(s) open`;

    if (
      perfectAvailableVenuesCount > 0 &&
      shiftAligned &&
      outdoorSuitable &&
      strictReqVenues.some((v) => v.availabilityStatus === 'AVAILABLE')
    ) {
      overallVerdict = 'IDEAL_MATCH';
      verdictHeadline = `Ideal Fit · ${perfectAvailableVenuesCount} exact venue(s) open on this Muhurat`;
    } else if (perfectAvailableVenuesCount === 0 && partialAvailableVenuesCount === 0) {
      overallVerdict = 'HIGH_DEMAND';
      verdictHeadline = `High Contention · ${bookedMatchingVenuesCount} matching venue(s) booked`;
    } else if (!shiftAligned || !outdoorSuitable) {
      overallVerdict = 'GOOD_ALTERNATIVE';
      verdictHeadline = `${perfectAvailableVenuesCount + partialAvailableVenuesCount} open · Check shift or space note`;
    }

    const advisoryNotes: string[] = [advisory];
    if (!shiftAligned && profile.preferredShift !== 'ANY') {
      advisoryNotes.push(
        `Lagna window (${muhurat.auspiciousTime}) favors ${recommendedShifts.join('/')} rather than ${profile.preferredShift} shift.`
      );
    }
    if (strictReqVenues.length === 0) {
      advisoryNotes.push(
        `No single venue in ${profile.district || 'selected area'} meets all 7 strict specs; showing closest requirement matches.`
      );
    }

    return {
      muhurat,
      monthName,
      seasonLabel,
      panchangaGrade,
      recommendedShifts,
      shiftAligned,
      weatherOutdoorSuitable: outdoorSuitable,
      weatherAdvisory: advisory,
      overallVerdict,
      verdictHeadline,
      totalRequirementMatchingVenues: activePool.length,
      perfectAvailableVenuesCount,
      partialAvailableVenuesCount,
      bookedMatchingVenuesCount,
      matchedVenues,
      advisoryNotes,
    };
  });

  // Sort results: IDEAL_MATCH first, then GOOD_ALTERNATIVE, then HIGH_DEMAND
  const verdictWeight: Record<MuhuratCrossReferenceResult['overallVerdict'], number> = {
    IDEAL_MATCH: 3,
    GOOD_ALTERNATIVE: 2,
    HIGH_DEMAND: 1,
  };

  return results.sort((a, b) => {
    if (verdictWeight[a.overallVerdict] !== verdictWeight[b.overallVerdict]) {
      return verdictWeight[b.overallVerdict] - verdictWeight[a.overallVerdict];
    }
    if (a.perfectAvailableVenuesCount !== b.perfectAvailableVenuesCount) {
      return b.perfectAvailableVenuesCount - a.perfectAvailableVenuesCount;
    }
    return a.muhurat.dateAD.localeCompare(b.muhurat.dateAD);
  });
}
