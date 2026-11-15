/**
 * UTSAVO - Real-Time Favorite Venue SSE Toast Notification
 * Slides in whenever an SSE push event delivers a newly opened Panchanga date
 * or last-minute cancellation slot for a venue saved in the customer's favorites.
 */

import React, { useEffect } from 'react';
import { BellRing, Building2, Calendar, Heart, X, Zap } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

interface FavoriteVenueAlertToastProps {
  onOpenCustomerAlerts: () => void;
}

export const FavoriteVenueAlertToast: React.FC<FavoriteVenueAlertToastProps> = ({
  onOpenCustomerAlerts,
}) => {
  const {
    venues,
    activeFavoriteVenueToast,
    dismissFavoriteVenueToast,
    markFavoriteVenueAlertRead,
    setSelectedVenue,
    setFilters,
  } = useMarketplace();

  useEffect(() => {
    if (!activeFavoriteVenueToast) return;
    const timer = setTimeout(() => {
      dismissFavoriteVenueToast();
    }, 9000);
    return () => clearTimeout(timer);
  }, [activeFavoriteVenueToast, dismissFavoriteVenueToast]);

  if (!activeFavoriteVenueToast) return null;

  const isCancellation = activeFavoriteVenueToast.alertKind === 'LAST_MINUTE_CANCELLATION';

  const handleInspect = () => {
    void markFavoriteVenueAlertRead(activeFavoriteVenueToast.id);
    setFilters((prev) => ({
      ...prev,
      dateBS: activeFavoriteVenueToast.dateBS,
      dateAD: activeFavoriteVenueToast.dateAD || prev.dateAD,
    }));
    const targetVenue = venues.find((v) => v.id === activeFavoriteVenueToast.venueId);
    dismissFavoriteVenueToast();
    if (targetVenue) {
      setSelectedVenue(targetVenue);
    } else {
      onOpenCustomerAlerts();
    }
  };

  const handleViewFeed = () => {
    dismissFavoriteVenueToast();
    onOpenCustomerAlerts();
  };

  return (
    <div className="fixed top-20 right-4 z-50 max-w-md w-[calc(100vw-2rem)] sm:w-96">
      <div className="bg-white rounded-2xl shadow-xl border border-amber-300 overflow-hidden text-stone-900">
        <div className="bg-stone-900 px-4 py-2.5 text-white flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <BellRing className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-bold tracking-tight text-amber-200 truncate">
              Favorite Venue Live Alert
            </span>
          </div>
          <button
            onClick={() => {
              void markFavoriteVenueAlertRead(activeFavoriteVenueToast.id);
              dismissFavoriteVenueToast();
            }}
            className="text-stone-300 hover:text-white p-1 rounded-md transition-colors shrink-0"
            title="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${
                isCancellation
                  ? 'bg-rose-50 text-rose-900 border-rose-200'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-200'
              }`}
            >
              {isCancellation ? (
                <Zap className="w-3 h-3 text-rose-700" />
              ) : (
                <Calendar className="w-3 h-3 text-emerald-700" />
              )}
              <span>{isCancellation ? 'Last-Minute Cancellation' : 'Panchanga Opening'}</span>
            </span>
            <span className="text-xs font-bold text-amber-900 tabular-nums">
              {activeFavoriteVenueToast.dateBS} BS
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
              <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600 shrink-0" />
              <span className="truncate">{activeFavoriteVenueToast.venueName}</span>
            </div>
            <h4 className="font-display font-bold text-sm text-stone-900 mt-1 leading-snug">
              {activeFavoriteVenueToast.title}
            </h4>
            <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
              {activeFavoriteVenueToast.message}
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleInspect}
              className="flex-1 bg-amber-900 hover:bg-amber-950 text-white font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Inspect Venue</span>
            </button>
            <button
              onClick={handleViewFeed}
              className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl text-xs transition-colors whitespace-nowrap shrink-0"
            >
              All Alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
