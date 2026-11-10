/**
 * UTSAVO - Auspicious Notification Center & Panchanga Preferences Drawer
 * Manages upcoming auspicious alerts, push simulation, and profile preferences.
 */

import React, { useState } from 'react';
import {
  Bell,
  X,
  Sparkles,
  Calendar,
  Building2,
  Clock,
  Compass,
  CheckCircle2,
  Trash2,
  Sliders,
  Volume2,
  VolumeX,
  Play,
  ArrowRight,
  Filter,
  Check,
  ShieldAlert,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useLanguage } from '../context/LanguageContext';
import { EventType } from '../types';
import { NEPALI_MONTHS } from '../data/panchangaCalendar';

interface AuspiciousNotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToExplore?: () => void;
}

export const AuspiciousNotificationCenter: React.FC<AuspiciousNotificationCenterProps> = ({
  isOpen,
  onClose,
  onNavigateToExplore,
}) => {
  const { language } = useLanguage();
  const {
    pushAlerts,
    markAlertAsRead,
    clearAllAlerts,
    simulatePushAlert,
    panchangaPreferences,
    updatePanchangaPreferences,
    setFilters,
    setActiveModal,
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'ALERTS' | 'PREFERENCES'>('ALERTS');

  if (!isOpen) return null;

  const handleSelectDateForVenues = (dateBS: string, eventType: EventType) => {
    setFilters((prev) => ({
      ...prev,
      dateBS,
      eventType,
    }));
    onClose();
    if (onNavigateToExplore) {
      onNavigateToExplore();
    } else {
      const el = document.getElementById('venues-catalog');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenPanchanga = () => {
    onClose();
    setActiveModal('PANCHANGA_CALENDAR');
  };

  const eventTypeOptions: { id: EventType; label: string; nepali: string }[] = [
    { id: 'WEDDING', label: 'Wedding (Bibaha)', nepali: 'विवाह लगन' },
    { id: 'BRATABANDHA', label: 'Bratabandha / Upanayan', nepali: 'व्रतबन्ध / उपनयन' },
    { id: 'PASNI', label: 'Pasni / Annaprashan', nepali: 'पास्नी / अन्नप्राशन' },
    { id: 'ENGAGEMENT', label: 'Engagement / Tika', nepali: 'टीका / मगनी' },
    { id: 'GRIHA_PRAVESH', label: 'Griha Pravesh', nepali: 'गृह प्रवेश' },
  ];

  const handleToggleEventType = (type: EventType) => {
    const current = panchangaPreferences.eventTypes;
    const next = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    updatePanchangaPreferences({ eventTypes: next });
  };

  const handleToggleMonth = (monthName: string) => {
    const current = panchangaPreferences.preferredMonthsBS;
    const next = current.includes(monthName)
      ? current.filter((m) => m !== monthName)
      : [...current, monthName];
    updatePanchangaPreferences({ preferredMonthsBS: next });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-stone-900 p-4 text-white shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-white">
                Panchanga Alerts & Muhurats
              </h3>
              <p className="text-[11px] text-amber-200/80">
                शुभ साइत तथा पञ्चाङ्ग प्राथमिकता सूचना
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher & Quick Test Button */}
        <div className="p-3 bg-stone-100 border-b border-stone-200 shrink-0 flex items-center justify-between gap-2">
          <div className="inline-flex rounded-xl bg-stone-200/80 p-1 text-xs font-semibold text-stone-600">
            <button
              onClick={() => setActiveTab('ALERTS')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'ALERTS' ? 'bg-white text-stone-900 shadow-sm' : 'hover:text-stone-900'
              }`}
            >
              <Bell className="w-3.5 h-3.5 text-amber-700" />
              <span>Alerts ({pushAlerts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('PREFERENCES')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'PREFERENCES' ? 'bg-white text-stone-900 shadow-sm' : 'hover:text-stone-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-amber-700" />
              <span>Preferences</span>
            </button>
          </div>

          {/* Simulate Push Notification Trigger */}
          <button
            onClick={() => simulatePushAlert()}
            className="px-2.5 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl text-[11px] flex items-center gap-1 shadow-sm transition-all"
            title="Simulate an instant auspicious push notification"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>Simulate Push</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'ALERTS' ? (
            <div>
              {pushAlerts.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div className="w-12 h-12 bg-amber-50 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-3 border border-amber-200">
                    <Bell className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-stone-800 text-sm">No Active Auspicious Alerts</h4>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                    We will notify you when auspicious dates matching your preferred months and event types approach.
                  </p>
                  <button
                    onClick={() => simulatePushAlert()}
                    className="mt-4 px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold"
                  >
                    Generate Test Auspicious Alert
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-500 px-1">
                    <span>Showing {pushAlerts.length} auspicious alerts</span>
                    <button
                      onClick={clearAllAlerts}
                      className="text-stone-500 hover:text-red-700 font-medium flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear all</span>
                    </button>
                  </div>

                  {pushAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        alert.isRead
                          ? 'bg-stone-50/80 border-stone-200 opacity-90'
                          : 'bg-amber-50/60 border-amber-300/80 shadow-xs ring-1 ring-amber-400/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                          <span className="text-xs font-bold text-amber-950 font-serif">
                            {alert.dateBS}
                          </span>
                          <span className="text-[10px] text-stone-400">({alert.dateAD})</span>
                        </div>

                        {!alert.isRead && (
                          <button
                            onClick={() => markAlertAsRead(alert.id)}
                            className="text-[10px] text-amber-800 font-semibold hover:underline"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>

                      <h4 className="font-serif font-bold text-sm text-stone-900 mt-1">
                        {language === 'ne' ? alert.titleNepali : alert.title}
                      </h4>
                      <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                        {language === 'ne' ? alert.messageNepali : alert.message}
                      </p>

                      {/* Astrological coordinates */}
                      <div className="mt-2 grid grid-cols-2 gap-1.5 text-[10px] text-stone-600 bg-white/80 p-2 rounded-lg border border-stone-200/60">
                        <div className="truncate">Tithi: <strong>{alert.tithi}</strong></div>
                        <div className="truncate">Window: <strong>{alert.auspiciousTime}</strong></div>
                      </div>

                      {/* Reason tag */}
                      {alert.matchedPreferenceReason && (
                        <div className="text-[10px] text-amber-800 italic mt-1.5">
                          ✓ {alert.matchedPreferenceReason}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center gap-2">
                        <button
                          onClick={() => handleSelectDateForVenues(alert.dateBS, alert.eventType)}
                          className="flex-1 bg-amber-900 hover:bg-amber-950 text-white font-semibold py-1.5 px-2.5 rounded-lg text-xs flex items-center justify-center gap-1 transition-colors"
                        >
                          <Building2 className="w-3 h-3 text-amber-300" />
                          <span>Check Venues</span>
                        </button>

                        <button
                          onClick={handleOpenPanchanga}
                          className="px-2.5 py-1.5 bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 rounded-lg text-xs font-medium"
                        >
                          Calendar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* PREFERENCES CONFIGURATION TAB */
            <div className="space-y-5">
              {/* Master Push Toggle */}
              <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-amber-950">Auspicious Push Alerts</div>
                  <div className="text-xs text-amber-800/80">
                    Notify me when highly auspicious dates approach
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={panchangaPreferences.enabled}
                    onChange={(e) => updatePanchangaPreferences({ enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>

              {/* Event Types of Interest */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Occasions You Are Planning (उत्सव विधा)
                </label>
                <div className="space-y-2">
                  {eventTypeOptions.map((opt) => {
                    const isChecked = panchangaPreferences.eventTypes.includes(opt.id);
                    return (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => handleToggleEventType(opt.id)}
                        className={`w-full p-2.5 rounded-xl border text-xs flex items-center justify-between text-left transition-colors ${
                          isChecked
                            ? 'bg-amber-50 border-amber-300 text-amber-950 font-semibold'
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <div>
                          <div>{opt.label}</div>
                          <div className="text-[10px] text-stone-400">{opt.nepali}</div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                            isChecked
                              ? 'bg-amber-600 border-amber-600 text-white'
                              : 'border-stone-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Nepali Months */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Target Auspicious Months (नेपाली महिना)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {NEPALI_MONTHS.map((mo) => {
                    const isSelected = panchangaPreferences.preferredMonthsBS.includes(mo.name);
                    return (
                      <button
                        type="button"
                        key={mo.id}
                        onClick={() => handleToggleMonth(mo.name)}
                        className={`p-2 rounded-xl text-center border text-xs transition-colors ${
                          isSelected
                            ? 'bg-amber-900 text-white border-amber-950 font-bold shadow-2xs'
                            : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <div className="truncate">{mo.nepaliName}</div>
                        <div className="text-[10px] opacity-80 truncate">{mo.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Lead Time & Sound Chime */}
              <div className="space-y-3 pt-2 border-t border-stone-200">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Alert Lead-Time Notice</span>
                    <span className="text-amber-800 font-bold">{panchangaPreferences.leadTimeDays} days before</span>
                  </label>
                  <select
                    value={panchangaPreferences.leadTimeDays}
                    onChange={(e) => updatePanchangaPreferences({ leadTimeDays: Number(e.target.value) })}
                    className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none"
                  >
                    <option value={7}>7 Days (1 week notice)</option>
                    <option value={14}>14 Days (2 weeks notice)</option>
                    <option value={30}>30 Days (1 month ahead for banquet reservation)</option>
                    <option value={60}>60 Days (2 months advance peak-season notice)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="flex items-center gap-2">
                    {panchangaPreferences.pushSoundEnabled ? (
                      <Volume2 className="w-4 h-4 text-amber-700" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-stone-400" />
                    )}
                    <div>
                      <div className="text-xs font-bold text-stone-800">Simulate Audio Chime</div>
                      <div className="text-[10px] text-stone-500">Play harmonic bell chime on notification</div>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={panchangaPreferences.pushSoundEnabled}
                    onChange={(e) => updatePanchangaPreferences({ pushSoundEnabled: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 shrink-0 flex items-center justify-between text-xs">
          <span className="text-stone-500">
            Source: <strong>Nepal Panchanga Nirnayak Samiti</strong>
          </span>
          <button
            onClick={handleOpenPanchanga}
            className="text-amber-900 font-bold hover:underline flex items-center gap-1"
          >
            <span>Full Calendar</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
