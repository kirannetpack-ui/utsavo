/**
 * UTSAVO — PWA Install Button & Modal
 * Provides seamless installation across Android, Chrome, Edge, and iOS Safari.
 */

import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Share, PlusSquare, Check, X, Sparkles } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'header' | 'banner' | 'pill';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'header',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, installApp } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  // If already installed, hide or show quiet checkmark
  if (isInstalled && !justInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (isInstallable) {
      const success = await installApp();
      if (success) {
        setJustInstalled(true);
        setTimeout(() => setJustInstalled(false), 4000);
      }
    } else {
      // In case beforeinstallprompt hasn't fired yet or browser is generic, show installation guide
      setShowIOSModal(true);
    }
  };

  return (
    <>
      {variant === 'header' && (
        <button
          onClick={handleInstallClick}
          className={`px-2.5 py-1.5 text-xs font-semibold text-rose-950 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-2xs ${className}`}
          title="Install UTSAVO App on your phone or desktop"
        >
          <Smartphone className="w-3.5 h-3.5 text-rose-700" />
          <span className="hidden sm:inline">Install App</span>
          <span className="sm:hidden">App</span>
        </button>
      )}

      {variant === 'banner' && (
        <div className={`p-4 bg-gradient-to-r from-amber-900 via-amber-950 to-stone-900 rounded-2xl text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display text-sm font-bold flex items-center gap-1.5">
                <span>Install UTSAVO Mobile App (PWA)</span>
                <span className="px-1.5 py-0.5 rounded-full bg-rose-500/30 text-rose-200 text-[10px] uppercase font-bold">
                  Fast & Offline
                </span>
              </h4>
              <p className="text-xs text-rose-200/90 mt-0.5">
                Access your venue bookings, digital guest RSVPs, and Panchanga calendar right from your home screen.
              </p>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="px-4 py-2 bg-white text-rose-950 hover:bg-rose-50 font-bold rounded-xl text-xs transition-colors shrink-0 flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4 text-rose-700" />
            <span>Install to Home Screen</span>
          </button>
        </div>
      )}

      {variant === 'pill' && (
        <button
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-900 text-white hover:bg-rose-950 text-xs font-bold transition-all shadow-xs ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5 text-rose-300" />
          <span>Get Free App</span>
        </button>
      )}

      {/* iOS Safari / Browser Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 border border-stone-200">
            <div className="p-5 bg-gradient-to-br from-amber-900 to-stone-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold">Install UTSAVO App</h4>
                  <span className="text-[10px] text-amber-200">Progressive Web App (PWA)</span>
                </div>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="text-stone-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-stone-700">
              <p className="leading-relaxed">
                Install UTSAVO on your iPhone, iPad, or Android for the best full-screen celebration planning experience:
              </p>

              <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-900 font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-stone-900">Tap the Share icon</p>
                    <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                      <span>Located in Safari / browser navigation bar</span>
                      <Share className="w-3.5 h-3.5 text-stone-700 inline" />
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-900 font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-stone-900">Select "Add to Home Screen"</p>
                    <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                      <span>Look for</span>
                      <PlusSquare className="w-3.5 h-3.5 text-stone-700 inline" />
                      <span>in the action menu</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-900 font-bold flex items-center justify-center shrink-0 text-xs">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-stone-900">Tap "Add" in top-right</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      The official UTSAVO icon will appear instantly on your phone's home screen!
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => setShowIOSModal(false)}
                  className="w-full py-2.5 bg-stone-900 hover:bg-stone-950 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
