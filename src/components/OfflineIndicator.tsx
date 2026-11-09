/**
 * UTSAVO — PWA Offline Indicator
 * Notifies users when they lose internet connectivity, assuring them that cached venues,
 * downloaded quotation drafts, and saved invitations remain accessible offline.
 */

import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline && !showReconnected) return null;

  return (
    <aside
      aria-label="Network status"
      className="fixed bottom-4 left-4 z-50 animate-in slide-in-from-bottom-3 duration-300 pointer-events-none"
    >
      {isOffline ? (
        <div className="bg-stone-900/95 text-white px-3.5 py-2 rounded-xl shadow-lg border border-stone-700/80 flex items-center gap-2.5 text-xs backdrop-blur-md">
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <span className="font-semibold block text-stone-100">Offline Mode Active</span>
            <span className="text-[10px] text-stone-400">Cached venues & invitations remain accessible</span>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-900/95 text-white px-3.5 py-2 rounded-xl shadow-lg border border-emerald-700/80 flex items-center gap-2.5 text-xs backdrop-blur-md">
          <Wifi className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold text-stone-100">Back Online — Synced with Cloud</span>
        </div>
      )}
    </aside>
  );
};
