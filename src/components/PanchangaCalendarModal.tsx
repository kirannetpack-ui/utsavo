/**
 * SAGUNOO - Hindu Panchanga Samiti Auspicious Dates & Cultural Festivals Modal
 * Sanctioned Subha Muhurats (विवाह, व्रतबन्ध, पास्नी, गृह प्रवेश) & Ethnic Festivals of Nepal
 * Automatically evaluates Muhurat dates against popular venues, confirmed bookings & soft holds.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  CULTURAL_FESTIVALS,
  PANCHANGA_AUSPICIOUS_MUHURATS,
} from '../data/panchangaCalendar';
import {
  analyzeMuhuratAcrossPopularVenues,
  MuhuratAvailabilitySummary,
} from '../utils/availabilityEngine';
import { EventType, PanchangaMuhurat } from '../types';
import {
  X,
  Calendar,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Building2,
  MapPin,
  Star,
  Ban,
} from 'lucide-react';

export const PanchangaCalendarModal: React.FC = () => {
  const { language } = useLanguage();
  const {
    activeModal,
    setActiveModal,
    setFilters,
    venues,
    bookings,
    negotiations,
    setSelectedVenue,
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'MUHURATS' | 'FESTIVALS'>('MUHURATS');
  const [selectedEventType, setSelectedEventType] = useState<EventType | 'ALL'>('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState<'ALL' | 'FLAGGED_BUSY' | 'OPEN_VENUES'>('ALL');
  const [expandedMuhuratId, setExpandedMuhuratId] = useState<string | null>(null);
  const [availabilityRefreshTick, setAvailabilityRefreshTick] = useState(0);

  // Re-evaluate automatically whenever availability overrides change across tabs/modals
  useEffect(() => {
    const onUpdated = () => setAvailabilityRefreshTick((n) => n + 1);
    window.addEventListener('sagunoo:availability_updated', onUpdated);
    return () => window.removeEventListener('sagunoo:availability_updated', onUpdated);
  }, []);

  // Automatic availability analysis across top popular venues for every Muhurat
  const muhuratSummaryMap = useMemo(() => {
    const map: Record<string, MuhuratAvailabilitySummary> = {};
    PANCHANGA_AUSPICIOUS_MUHURATS.forEach((m) => {
      map[m.id] = analyzeMuhuratAcrossPopularVenues(m, venues, bookings, negotiations);
    });
    return map;
  }, [venues, bookings, negotiations, availabilityRefreshTick]);

  // Nearest open alternate Muhurat lookup by eventType
  const nearestOpenByEventType = useMemo(() => {
    const bestMap: Record<string, PanchangaMuhurat> = {};
    PANCHANGA_AUSPICIOUS_MUHURATS.forEach((m) => {
      const s = muhuratSummaryMap[m.id];
      if (s && s.flagLevel !== 'UNAVAILABLE_POPULAR' && !bestMap[m.eventType]) {
        bestMap[m.eventType] = m;
      }
    });
    return bestMap;
  }, [muhuratSummaryMap]);

  // Summary counts for top KPI strip
  const flagStats = useMemo(() => {
    const list = Object.values(muhuratSummaryMap);
    return {
      total: list.length,
      flaggedUnavailable: list.filter((s) => s.flagLevel === 'UNAVAILABLE_POPULAR').length,
      highContention: list.filter((s) => s.flagLevel === 'HIGH_CONTENTION').length,
      goodOpen: list.filter((s) => s.flagLevel === 'GOOD_AVAILABILITY').length,
    };
  }, [muhuratSummaryMap]);

  if (activeModal !== 'PANCHANGA_CALENDAR') return null;

  const filteredMuhurats = PANCHANGA_AUSPICIOUS_MUHURATS.filter((m) => {
    if (selectedEventType !== 'ALL' && m.eventType !== selectedEventType) return false;
    const summary = muhuratSummaryMap[m.id];
    if (!summary) return true;
    if (availabilityFilter === 'FLAGGED_BUSY') {
      return summary.flagLevel === 'UNAVAILABLE_POPULAR' || summary.flagLevel === 'HIGH_CONTENTION';
    }
    if (availabilityFilter === 'OPEN_VENUES') {
      return summary.openAvailableCount > 0;
    }
    return true;
  });

  const handleSelectMuhurat = (muhurat: PanchangaMuhurat) => {
    setFilters((prev) => ({
      ...prev,
      dateBS: muhurat.dateBS,
      dateAD: muhurat.dateAD,
      eventType: muhurat.eventType,
    }));
    setActiveModal('NONE');
  };

  const handleJumpToAvailableVenue = (venueId: string, muhurat: PanchangaMuhurat) => {
    const target = venues.find((v) => v.id === venueId);
    if (!target) return;
    setFilters((prev) => ({
      ...prev,
      dateBS: muhurat.dateBS,
      dateAD: muhurat.dateAD,
      eventType: muhurat.eventType,
    }));
    setSelectedVenue(target);
    setActiveModal('NONE');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 text-white flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {language === 'ne'
                  ? 'नेपाल पञ्चाङ्ग निर्णायक विकास समिति स्वीकृत'
                  : 'Nepal Panchanga Nirnayak Samiti · Live Venue Contention Check'}
              </span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold">
              {language === 'ne'
                ? 'शुभ साइत र लोकप्रिय स्थल उपलब्धता (२०८३–२०८५ BS)'
                : 'Auspicious Muhurats & Popular Venue Availability'}
            </h3>
            <p className="text-xs text-stone-300 mt-1">
              {language === 'ne'
                ? 'प्रत्येक शुभ लगनमा नेपालका शीर्ष लोकप्रिय पार्टी प्यालेसहरूको वास्तविक बुकिङ अवस्था स्वतः जाँच गरिएको छ।'
                : 'Automatically cross-checks every Subha Muhurat against live confirmed bookings and holds across top popular venues.'}
            </p>
          </div>

          <button
            onClick={() => setActiveModal('NONE')}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            aria-label="Close calendar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Filter Controls */}
        <div className="px-5 sm:px-6 py-3 bg-stone-100/80 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-stone-200/80 rounded-xl">
            <button
              onClick={() => setActiveTab('MUHURATS')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'MUHURATS' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {language === 'ne' ? 'शुभ साइत तथा लगन' : 'Auspicious Muhurats (शुभ लग्न)'}
            </button>
            <button
              onClick={() => setActiveTab('FESTIVALS')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'FESTIVALS' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {language === 'ne' ? 'सांस्कृतिक चाडपर्व' : 'Festivals & Peak Seasons'}
            </button>
          </div>

          {activeTab === 'MUHURATS' && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200 text-[11px] font-semibold">
                <button
                  onClick={() => setAvailabilityFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    availabilityFilter === 'ALL' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  All Dates ({flagStats.total})
                </button>
                <button
                  onClick={() => setAvailabilityFilter('FLAGGED_BUSY')}
                  className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 ${
                    availabilityFilter === 'FLAGGED_BUSY'
                      ? 'bg-rose-800 text-white'
                      : 'text-rose-800 hover:bg-rose-50'
                  }`}
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>Flagged Busy ({flagStats.flaggedUnavailable + flagStats.highContention})</span>
                </button>
                <button
                  onClick={() => setAvailabilityFilter('OPEN_VENUES')}
                  className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 ${
                    availabilityFilter === 'OPEN_VENUES'
                      ? 'bg-emerald-800 text-white'
                      : 'text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Open Slots ({flagStats.goodOpen + flagStats.highContention})</span>
                </button>
              </div>

              <select
                value={selectedEventType}
                onChange={(e) => setSelectedEventType(e.target.value as any)}
                className="text-xs font-medium bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-800"
              >
                <option value="ALL">{language === 'ne' ? 'सबै साइतहरू' : 'All Occasions'}</option>
                <option value="WEDDING">{language === 'ne' ? 'विवाह (Bibaha)' : 'Wedding'}</option>
                <option value="BRATABANDHA">{language === 'ne' ? 'व्रतबन्ध (Bratabandha)' : 'Bratabandha'}</option>
                <option value="PASNI">{language === 'ne' ? 'पास्नी (Pasni)' : 'Pasni / Rice Weaning'}</option>
                <option value="GRIHA_PRAVESH">{language === 'ne' ? 'गृह प्रवेश (Housewarming)' : 'Griha Pravesh'}</option>
              </select>
            </div>
          )}
        </div>

        {/* Automatic Venue Contention Strip */}
        {activeTab === 'MUHURATS' && (
          <div className="px-5 sm:px-6 py-2.5 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-600">
            <div className="flex flex-wrap items-center gap-3 tabular-nums">
              <span className="font-semibold text-stone-800 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-amber-800" />
                <span>Auto-checked against Top 5 Popular Venues</span>
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-rose-800 font-semibold">
                {flagStats.flaggedUnavailable} Mostly Booked / Sold Out
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-amber-800 font-semibold">
                {flagStats.highContention} Partial Hold / Limited
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-emerald-800 font-semibold">
                {flagStats.goodOpen} Wide Availability
              </span>
            </div>
            <button
              onClick={() => {
                setActiveModal('STAR_HOTEL_REQUEST');
              }}
              className="text-amber-900 hover:text-amber-950 font-bold underline whitespace-nowrap shrink-0"
            >
              Date Sold Out? Request a Star Hotel →
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-3.5 max-h-[60vh]">
          {activeTab === 'MUHURATS' ? (
            filteredMuhurats.length === 0 ? (
              <div className="text-center py-10 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-500">
                No Muhurat dates match the current filter selection. Reset filters to view all auspicious dates.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredMuhurats.map((m) => {
                  const summary = muhuratSummaryMap[m.id];
                  const isExpanded = expandedMuhuratId === m.id;
                  const altMuhurat = nearestOpenByEventType[m.eventType];

                  const isUnavailablePopular = summary?.flagLevel === 'UNAVAILABLE_POPULAR';
                  const isHighContention = summary?.flagLevel === 'HIGH_CONTENTION';

                  return (
                    <div
                      key={m.id}
                      className={`rounded-2xl border p-4 transition-all space-y-3 ${
                        isUnavailablePopular
                          ? 'bg-rose-50/40 border-rose-200'
                          : isHighContention
                          ? 'bg-amber-50/35 border-amber-200'
                          : 'bg-white border-stone-200 hover:border-amber-400'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-bold text-amber-950 font-display tabular-nums">
                              {m.dateBS} BS
                            </span>
                            <span className="text-xs text-stone-400 tabular-nums">({m.dateAD} AD)</span>
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-200">
                              {m.eventType}
                            </span>

                            {/* Automatic Venue Flag Badge */}
                            {summary && (
                              <span
                                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md inline-flex items-center gap-1 tabular-nums border ${
                                  isUnavailablePopular
                                    ? 'bg-rose-100 text-rose-900 border-rose-300'
                                    : isHighContention
                                    ? 'bg-amber-100 text-amber-950 border-amber-300'
                                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                }`}
                              >
                                {isUnavailablePopular ? (
                                  <Ban className="w-3 h-3 text-rose-700" />
                                ) : isHighContention ? (
                                  <Clock className="w-3 h-3 text-amber-700" />
                                ) : (
                                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                )}
                                <span>{summary.flagHeadline}</span>
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-stone-600 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                            <span>
                              <strong>Tithi:</strong> {m.tithi}
                            </span>
                            <span className="text-stone-300">·</span>
                            <span>
                              <strong>Nakshatra:</strong> {m.nakshatra}
                            </span>
                            <span className="text-stone-300">·</span>
                            <span className="tabular-nums">
                              <strong>Lagan:</strong> {m.auspiciousTime}
                            </span>
                          </div>

                          <p className="text-xs text-stone-500">{m.significance}</p>

                          {/* Unavailability Advisory & Alternate Open Muhurat Suggestion */}
                          {summary && isUnavailablePopular && (
                            <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px] text-rose-900 font-medium">
                              <span>
                                Booked across{' '}
                                <strong>
                                  {summary.venueBreakdown
                                    .filter((v) => v.status === 'BOOKED_UNAVAILABLE')
                                    .map((v) => v.venueName)
                                    .slice(0, 2)
                                    .join(', ')}
                                  {summary.bookedOrUnavailableCount > 2
                                    ? ` +${summary.bookedOrUnavailableCount - 2} more`
                                    : ''}
                                </strong>
                                .
                              </span>
                              {altMuhurat && altMuhurat.id !== m.id && (
                                <button
                                  type="button"
                                  onClick={() => handleSelectMuhurat(altMuhurat)}
                                  className="text-amber-900 font-bold underline hover:text-amber-950"
                                >
                                  Switch to Open Muhurat ({altMuhurat.dateBS}) →
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                          <button
                            onClick={() => handleSelectMuhurat(m)}
                            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5 ${
                              isUnavailablePopular
                                ? 'bg-stone-800 hover:bg-stone-950 text-white'
                                : 'bg-amber-900 hover:bg-amber-950 text-white'
                            }`}
                          >
                            <span>
                              {language === 'ne'
                                ? 'उपलब्ध स्थल खोज्नुहोस्'
                                : isUnavailablePopular
                                ? 'Find Remaining Venues'
                                : 'Explore for this Date'}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setExpandedMuhuratId(isExpanded ? null : m.id)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-stone-700 hover:text-amber-950 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
                          >
                            <span>
                              Inspect Popular Venues ({summary?.popularVenuesChecked || 0})
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Per-Venue Live Availability Breakdown */}
                      {isExpanded && summary && (
                        <div className="pt-3 border-t border-stone-200/80 space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                            <span>Live Popular Venue Status for {m.dateBS} BS</span>
                            <span className="tabular-nums font-normal text-stone-500">
                              {summary.openAvailableCount} Open · {summary.limitedHoldCount} Partial Hold · {summary.bookedOrUnavailableCount} Unavailable
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {summary.venueBreakdown.map((vb) => (
                              <div
                                key={vb.venueId}
                                className="p-2.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between gap-2 text-xs"
                              >
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <strong className="text-stone-900 truncate">{vb.venueName}</strong>
                                    <span className="text-[10px] text-amber-800 font-bold tabular-nums shrink-0 inline-flex items-center gap-0.5">
                                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                      {vb.rating.toFixed(1)}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-stone-500 flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                                    <span className="truncate">{vb.district}</span>
                                    <span>·</span>
                                    <span
                                      className={`truncate font-medium ${
                                        vb.status === 'BOOKED_UNAVAILABLE'
                                          ? 'text-rose-700'
                                          : vb.status === 'LIMITED_HOLD'
                                          ? 'text-amber-800'
                                          : 'text-emerald-700'
                                      }`}
                                    >
                                      {vb.reasonLabel}
                                    </span>
                                  </div>
                                </div>

                                {vb.status !== 'BOOKED_UNAVAILABLE' ? (
                                  <button
                                    type="button"
                                    onClick={() => handleJumpToAvailableVenue(vb.venueId, m)}
                                    className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-[10px] font-bold whitespace-nowrap shrink-0"
                                  >
                                    {vb.status === 'LIMITED_HOLD' ? 'Book Open Shift' : 'Open Venue'}
                                  </button>
                                ) : (
                                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold whitespace-nowrap shrink-0">
                                    Unavailable
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="space-y-3">
              {CULTURAL_FESTIVALS.map((f) => (
                <div
                  key={f.id}
                  className="bg-white rounded-2xl border border-stone-200 p-4 hover:border-stone-300 transition-all"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">{f.name}</h4>
                      <div className="text-xs text-stone-500">{f.nepaliName}</div>
                    </div>
                    <span className="text-xs font-semibold text-amber-900 px-2 py-0.5 bg-amber-50 rounded-md tabular-nums">
                      {f.dateBS} BS
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 mt-2">{f.description}</p>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                    <span>
                      Cultural Tradition: <strong>{f.community}</strong>
                    </span>
                    {f.isPeakPartyPalaceSeason && (
                      <span className="text-amber-800 font-semibold">High Banquet &amp; Lawn Demand</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500">
          <span>
            {language === 'ne'
              ? 'सबै शुभ लग्नहरू नेपाल पञ्चाङ्ग निर्णायक विकास समितिद्वारा प्रमाणित पञ्चाङ्गअनुसार हुन्।'
              : 'Astrological computations aligned with Nepal Panchanga Nirnayak Development Committee standards.'}
          </span>
          <button
            type="button"
            onClick={() => setActiveModal('STAR_HOTEL_REQUEST')}
            className="text-amber-900 font-bold hover:underline whitespace-nowrap shrink-0"
          >
            Need a 3★–5★ Hotel Venue instead? Request Admin Sourcing →
          </button>
        </div>
      </div>
    </div>
  );
};
