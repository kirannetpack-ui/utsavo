/**
 * UTSAVO - Auspicious Push Notification Toast Banner
 * Simulated native push-notification sliding in from top-right / top-center
 * alerting users to upcoming highly-auspicious dates based on their Panchanga preferences.
 */

import React, { useEffect } from 'react';
import {
  Bell,
  X,
  Sparkles,
  Calendar,
  Building2,
  Clock,
  Compass,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useLanguage } from '../context/LanguageContext';

interface AuspiciousPushNotificationToastProps {
  onNavigateToCatalog?: () => void;
}

export const AuspiciousPushNotificationToast: React.FC<AuspiciousPushNotificationToastProps> = ({
  onNavigateToCatalog,
}) => {
  const { language } = useLanguage();
  const {
    activePushToast,
    dismissPushToast,
    markAlertAsRead,
    setFilters,
    setActiveModal,
  } = useMarketplace();

  // Auto-dismiss after 10 seconds
  useEffect(() => {
    if (!activePushToast) return;
    const timer = setTimeout(() => {
      dismissPushToast();
    }, 10000);
    return () => clearTimeout(timer);
  }, [activePushToast]);

  if (!activePushToast) return null;

  const handleExploreVenues = () => {
    markAlertAsRead(activePushToast.id);
    setFilters((prev) => ({
      ...prev,
      dateBS: activePushToast.dateBS,
      eventType: activePushToast.eventType,
    }));
    dismissPushToast();
    if (onNavigateToCatalog) {
      onNavigateToCatalog();
    } else {
      const el = document.getElementById('venues-catalog');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewPanchanga = () => {
    markAlertAsRead(activePushToast.id);
    dismissPushToast();
    setActiveModal('PANCHANGA_CALENDAR');
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-[calc(100vw-2rem)] sm:w-96 animate-bounce-in">
      <div className="bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-amber-400/80 overflow-hidden text-neutral-900 ring-4 ring-black/5">
        {/* Simulated Native OS Header */}
        <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-stone-900 px-4 py-2.5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-[10px] animate-pulse">
              <Bell className="w-3 h-3 fill-stone-950" />
            </div>
            <span className="text-xs font-bold tracking-tight text-amber-200">
              UTSAVO Panchanga Alert • शुभ साइत सूचना
            </span>
          </div>

          <button
            onClick={() => {
              markAlertAsRead(activePushToast.id);
              dismissPushToast();
            }}
            className="text-stone-300 hover:text-white p-1 rounded-md transition-colors"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notification Body */}
        <div className="p-4 space-y-3">
          {/* Badge & Date */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-950 border border-amber-300">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Sarva Siddhi Muhurat</span>
            </span>
            <span className="text-xs font-bold text-amber-900 font-serif">
              {activePushToast.dateBS}
            </span>
          </div>

          <div>
            <h4 className="font-serif font-bold text-sm text-stone-900 leading-snug">
              {language === 'ne' ? activePushToast.titleNepali : activePushToast.title}
            </h4>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              {language === 'ne' ? activePushToast.messageNepali : activePushToast.message}
            </p>
          </div>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200/80 text-[11px] text-stone-700">
            <div className="flex items-center gap-1.5 truncate">
              <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span className="truncate">{activePushToast.auspiciousTime}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Compass className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span className="truncate">{activePushToast.nakshatra}</span>
            </div>
          </div>

          {/* 1-Tap Action Buttons */}
          <div className="pt-1 flex items-center gap-2">
            <button
              onClick={handleExploreVenues}
              className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Find Venues</span>
            </button>

            <button
              onClick={handleViewPanchanga}
              className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl text-xs transition-colors flex items-center gap-1"
            >
              <Calendar className="w-3.5 h-3.5 text-stone-600" />
              <span>Panchanga</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
