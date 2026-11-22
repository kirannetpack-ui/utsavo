/**
 * SAGUNOO - Real-Time Favorite Venue Availability & Cancellation Alerts Panel
 * Displays live Server-Sent Events (SSE) push alerts for a customer's bookmarked favorite venues
 * whenever auspicious Panchanga calendar dates open or last-minute booking cancellations release slots.
 */

import React, { useMemo, useState } from 'react';
import {
  BellRing,
  Building2,
  Calendar,
  Check,
  CheckCheck,
  Clock,
  Compass,
  Heart,
  MapPin,
  Radio,
  RefreshCw,
  Sparkles,
  Tag,
  Zap,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useLanguage } from '../context/LanguageContext';
import { FavoriteVenueAlert, FavoriteVenueAlertKind } from '../types';

interface FavoriteVenueAlertsPanelProps {
  onNavigateView?: (
    view:
      | 'EXPLORE'
      | 'ORGANIZERS'
      | 'VENDORS'
      | 'NIMANTRANA'
      | 'DASHBOARD'
      | 'DESTINATION'
      | 'STAFF_POOL'
      | 'SOCIAL_CAUSE'
      | 'CANCELLATIONS'
  ) => void;
}

export const FavoriteVenueAlertsPanel: React.FC<FavoriteVenueAlertsPanelProps> = ({
  onNavigateView,
}) => {
  const { language } = useLanguage();
  const {
    venues,
    savedVenueIds,
    toggleSaveVenue,
    favoriteVenueAlerts,
    unreadFavoriteVenueAlertsCount,
    sseConnectionStatus,
    isScanningFavoriteVenues,
    lastFavoriteScanMessage,
    markFavoriteVenueAlertRead,
    scanFavoriteVenueAvailability,
    setSelectedVenue,
    setFilters,
  } = useMarketplace();

  const [kindFilter, setKindFilter] = useState<'ALL' | FavoriteVenueAlertKind>('ALL');
  const [venueFilterId, setVenueFilterId] = useState<string>('ALL');

  const savedVenues = useMemo(
    () => venues.filter((v) => savedVenueIds.includes(v.id)),
    [venues, savedVenueIds]
  );

  const unwatchedVenues = useMemo(
    () => venues.filter((v) => !savedVenueIds.includes(v.id)).slice(0, 4),
    [venues, savedVenueIds]
  );

  const counts = useMemo(() => {
    let panchangaCount = 0;
    let cancellationCount = 0;
    for (const a of favoriteVenueAlerts) {
      if (a.alertKind === 'PANCHANGA_DATE_OPEN') panchangaCount += 1;
      if (a.alertKind === 'LAST_MINUTE_CANCELLATION') cancellationCount += 1;
    }
    return {
      total: favoriteVenueAlerts.length,
      panchangaCount,
      cancellationCount,
    };
  }, [favoriteVenueAlerts]);

  const filteredAlerts = useMemo(() => {
    return favoriteVenueAlerts.filter((a) => {
      if (kindFilter !== 'ALL' && a.alertKind !== kindFilter) return false;
      if (venueFilterId !== 'ALL' && a.venueId !== venueFilterId) return false;
      return true;
    });
  }, [favoriteVenueAlerts, kindFilter, venueFilterId]);

  const handleInspectVenue = (alert: FavoriteVenueAlert) => {
    void markFavoriteVenueAlertRead(alert.id);
    setFilters((prev) => ({
      ...prev,
      dateBS: alert.dateBS,
      dateAD: alert.dateAD || prev.dateAD,
    }));
    const targetVenue = venues.find((v) => v.id === alert.venueId);
    if (targetVenue) {
      setSelectedVenue(targetVenue);
    } else if (onNavigateView) {
      onNavigateView('EXPLORE');
    }
  };

  const formatRelativeTime = (iso: string) => {
    const diffMs = Math.max(0, Date.now() - new Date(iso).getTime());
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return language === 'ne' ? 'भर्खरै' : 'Just now';
    if (mins < 60) return language === 'ne' ? `${mins} मिनेट अघि` : `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return language === 'ne' ? `${hrs} घण्टा अघि` : `${hrs}h ago`;
    return new Date(iso).toLocaleDateString();
  };

  return (
    <div className="space-y-5">
      {/* Header Control Bar */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
                <BellRing className="w-3.5 h-3.5 text-amber-700" />
                <span>
                  {language === 'ne'
                    ? 'मनपर्ने भेन्यु लाइभ सूचना केन्द्र'
                    : 'Favorite Venue Live Availability Stream'}
                </span>
              </span>

              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${
                  sseConnectionStatus === 'CONNECTED'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <Radio className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {sseConnectionStatus === 'CONNECTED'
                    ? language === 'ne'
                      ? 'लाइभ सर्भर जडान सक्रिय'
                      : 'Live SSE Stream Connected'
                    : sseConnectionStatus === 'CONNECTING'
                    ? 'Connecting Live Stream...'
                    : 'Reconnecting Live Stream...'}
                </span>
              </span>
            </div>

            <h3 className="font-display font-bold text-xl text-stone-900 pt-1">
              {language === 'ne'
                ? 'तपाईंले सुरक्षित गरेका भेन्युका नयाँ पञ्चाङ्ग मिति र रद्द स्लट सूचनाहरू'
                : 'Real-Time Panchanga Openings & Last-Minute Cancellations'}
            </h3>
            <p className="text-xs text-stone-600 max-w-2xl leading-relaxed">
              {language === 'ne'
                ? 'तपाईंले बुकमार्क गरेका पार्टी प्यालेसहरूमा शुभ लगनको मिति खाली हुनासाथ वा अन्य ग्राहकको बुकिङ रद्द हुनासाथ सर्भरबाट तुरुन्तै सूचना प्राप्त गर्नुहोस्।'
                : 'Receive instant server-pushed updates whenever your bookmarked favorite venues release new auspicious Panchanga dates or open up from last-minute booking cancellations.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                void scanFavoriteVenueAvailability();
              }}
              disabled={isScanningFavoriteVenues || savedVenues.length === 0}
              className="px-4 py-2.5 bg-amber-900 hover:bg-amber-950 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors whitespace-nowrap shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanningFavoriteVenues ? 'animate-spin' : ''}`} />
              <span>
                {isScanningFavoriteVenues
                  ? 'Scanning Panchanga & Holds...'
                  : 'Scan Server Availability'}
              </span>
            </button>

            {unreadFavoriteVenueAlertsCount > 0 && (
              <button
                onClick={() => {
                  void markFavoriteVenueAlertRead('ALL');
                }}
                className="px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Mark All Read ({unreadFavoriteVenueAlertsCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Summary KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="text-[11px] font-semibold text-stone-500">Watched Favorite Venues</div>
            <div className="text-xl font-bold text-stone-900 tabular-nums mt-0.5">
              {savedVenues.length}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="text-[11px] font-semibold text-stone-500">Unread Live Alerts</div>
            <div className="text-xl font-bold text-amber-900 tabular-nums mt-0.5">
              {unreadFavoriteVenueAlertsCount}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="text-[11px] font-semibold text-stone-500">Panchanga Date Openings</div>
            <div className="text-xl font-bold text-emerald-800 tabular-nums mt-0.5">
              {counts.panchangaCount}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="text-[11px] font-semibold text-stone-500">Last-Minute Cancellations</div>
            <div className="text-xl font-bold text-rose-800 tabular-nums mt-0.5">
              {counts.cancellationCount}
            </div>
          </div>
        </div>

        {lastFavoriteScanMessage && (
          <div className="px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-950 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{lastFavoriteScanMessage}</span>
          </div>
        )}
      </div>

      {/* Watched Favorite Venues Watchlist Manager */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-700 fill-rose-700" />
            <h4 className="text-sm font-bold text-stone-900">
              Watched Favorite Venues ({savedVenues.length})
            </h4>
          </div>
          <span className="text-[11px] text-stone-500">
            Click a venue chip to filter alerts or unwatch; new alerts stream automatically for any watched venue.
          </span>
        </div>

        {savedVenues.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setVenueFilterId('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 ${
                venueFilterId === 'ALL'
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              All Watched ({favoriteVenueAlerts.length})
            </button>

            {savedVenues.map((venue) => {
              const venueAlertCount = favoriteVenueAlerts.filter((a) => a.venueId === venue.id).length;
              const isSelected = venueFilterId === venue.id;
              return (
                <div
                  key={venue.id}
                  className={`inline-flex items-center rounded-xl border text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-amber-900 text-white border-amber-900'
                      : 'bg-amber-50/70 text-amber-950 border-amber-200 hover:bg-amber-100/70'
                  }`}
                >
                  <button
                    onClick={() => setVenueFilterId(isSelected ? 'ALL' : venue.id)}
                    className="px-3 py-1.5 flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{venue.name}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[10px] tabular-nums ${
                        isSelected ? 'bg-amber-800 text-amber-100' : 'bg-white text-amber-900'
                      }`}
                    >
                      {venueAlertCount}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      if (venueFilterId === venue.id) setVenueFilterId('ALL');
                      toggleSaveVenue(venue.id);
                    }}
                    title={`Remove ${venue.name} from favorites`}
                    className={`pr-2.5 pl-1 py-1.5 text-[11px] opacity-75 hover:opacity-100 ${
                      isSelected ? 'text-amber-200' : 'text-stone-500 hover:text-rose-700'
                    }`}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span>You currently have no favorite venues bookmarked. Pick one below or explore venues to start watching live slots.</span>
            {onNavigateView && (
              <button
                onClick={() => onNavigateView('EXPLORE')}
                className="px-3 py-1.5 bg-amber-900 text-white rounded-xl font-semibold text-xs whitespace-nowrap shrink-0"
              >
                Explore Party Palaces
              </button>
            )}
          </div>
        )}

        {unwatchedVenues.length > 0 && (
          <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-stone-500">Quick-Watch Venue:</span>
            {unwatchedVenues.map((v) => (
              <button
                key={v.id}
                onClick={() => toggleSaveVenue(v.id)}
                className="px-2.5 py-1 rounded-lg bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-300 text-[11px] font-medium text-stone-700 hover:text-amber-950 transition-colors whitespace-nowrap shrink-0"
              >
                + {v.name} ({v.district})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs font-semibold gap-1">
          <button
            onClick={() => setKindFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              kindFilter === 'ALL'
                ? 'bg-white text-stone-900 shadow-xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Alerts ({counts.total})
          </button>
          <button
            onClick={() => setKindFilter('PANCHANGA_DATE_OPEN')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              kindFilter === 'PANCHANGA_DATE_OPEN'
                ? 'bg-white text-emerald-900 shadow-xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            <span>Panchanga Openings ({counts.panchangaCount})</span>
          </button>
          <button
            onClick={() => setKindFilter('LAST_MINUTE_CANCELLATION')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              kindFilter === 'LAST_MINUTE_CANCELLATION'
                ? 'bg-white text-rose-900 shadow-xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-rose-700" />
            <span>Last-Minute Cancellations ({counts.cancellationCount})</span>
          </button>
        </div>

        <span className="text-xs text-stone-500 tabular-nums">
          Showing {filteredAlerts.length} of {favoriteVenueAlerts.length} live alerts
        </span>
      </div>

      {/* Real-Time Alerts Grid */}
      {filteredAlerts.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-3xl border border-stone-200 space-y-3">
          <BellRing className="w-10 h-10 text-stone-300 mx-auto" />
          <h4 className="font-display font-bold text-base text-stone-900">
            No Matching Favorite Venue Alerts Yet
          </h4>
          <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
            {savedVenues.length === 0
              ? 'Bookmark any party palace above or from the Explore page to receive instant alerts when auspicious Panchanga dates or cancellation openings become available.'
              : 'Click "Scan Server Availability" above to check live Panchanga openings and recently cancelled slots across your watched venues.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredAlerts.map((alert) => {
            const isCancellation = alert.alertKind === 'LAST_MINUTE_CANCELLATION';
            return (
              <div
                key={alert.id}
                className={`rounded-2xl border p-5 transition-colors flex flex-col justify-between gap-4 ${
                  alert.isRead
                    ? 'bg-white border-stone-200'
                    : 'bg-amber-50/40 border-amber-300 shadow-xs'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Row: Alert Type Label & Timestamp */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                        isCancellation
                          ? 'bg-rose-50 text-rose-900 border-rose-200'
                          : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                      }`}
                    >
                      {isCancellation ? (
                        <Zap className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                      ) : (
                        <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      )}
                      <span>
                        {isCancellation ? 'Last-Minute Cancellation' : 'Panchanga Opening'}
                      </span>
                    </span>

                    <div className="flex items-center gap-2 text-[11px] text-stone-500 tabular-nums">
                      {!alert.isRead && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-900 text-white font-bold text-[10px]">
                          NEW
                        </span>
                      )}
                      <span>{formatRelativeTime(alert.createdAt)}</span>
                    </div>
                  </div>

                  {/* Venue & Location */}
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
                      <Heart className="w-3.5 h-3.5 fill-amber-700 text-amber-700 shrink-0" />
                      <span>{alert.venueName}</span>
                      <span className="text-stone-300">•</span>
                      <span className="inline-flex items-center gap-0.5 text-stone-600 font-normal">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        {alert.locality ? `${alert.locality}, ` : ''}
                        {alert.district}
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-base text-stone-900 mt-1 leading-snug">
                      {alert.title}
                    </h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{alert.message}</p>
                  </div>

                  {/* Date / Shift / Hall / Panchanga Specs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs">
                    <div className="flex items-center gap-2 text-stone-800">
                      <Calendar className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold tabular-nums truncate">{alert.dateBS} BS</div>
                        <div className="text-[11px] text-stone-500 tabular-nums truncate">
                          {alert.dateAD} • {alert.shift} Shift
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-stone-800">
                      {alert.hallName ? (
                        <Building2 className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                      ) : (
                        <Compass className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="font-semibold truncate">
                          {alert.hallName || alert.tithi || 'Main Banquet Space'}
                        </div>
                        <div className="text-[11px] text-stone-500 truncate">
                          {alert.nakshatra || alert.auspiciousTime || 'Instant Inquiry Ready'}
                        </div>
                      </div>
                    </div>

                    {(alert.tithi || alert.auspiciousTime) && (
                      <div className="sm:col-span-2 pt-1.5 border-t border-stone-200/70 flex flex-wrap items-center gap-3 text-[11px] text-stone-600">
                        {alert.tithi && (
                          <span className="inline-flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-700" />
                            <span>{alert.tithi}</span>
                          </span>
                        )}
                        {alert.auspiciousTime && (
                          <span className="inline-flex items-center gap-1 tabular-nums">
                            <Clock className="w-3 h-3 text-amber-700" />
                            <span>{alert.auspiciousTime}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {alert.discountOrIncentiveNote && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-amber-950 bg-amber-50 border border-amber-200/80 px-3 py-2 rounded-xl">
                      <Tag className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>{alert.discountOrIncentiveNote}</span>
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleInspectVenue(alert)}
                    className="flex-1 bg-amber-900 hover:bg-amber-950 text-white font-semibold py-2 px-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    <Building2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span>Inspect Venue & Reserve Slot</span>
                  </button>

                  {!alert.isRead && (
                    <button
                      onClick={() => {
                        void markFavoriteVenueAlertRead(alert.id);
                      }}
                      className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors whitespace-nowrap shrink-0"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Mark Read</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
