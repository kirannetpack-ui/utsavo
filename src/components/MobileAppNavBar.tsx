/**
 * UTSAVO — Mobile App & PWA Bottom Navigation Bar
 * Specifically built for Mobile App & PWA standalone display modes.
 * Ensures the core celebration marketplace features are always 1-tap accessible.
 */

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  Building2,
  Mountain,
  Music,
  UtensilsCrossed,
  Award,
  Calendar,
  Layers,
  Sparkles,
  Briefcase,
} from 'lucide-react';

interface MobileAppNavBarProps {
  activeView: 'EXPLORE' | 'ORGANIZERS' | 'VENDORS' | 'NIMANTRANA' | 'DASHBOARD' | 'DESTINATION' | 'STAFF_POOL' | 'SOCIAL_CAUSE';
  setActiveView: (view: 'EXPLORE' | 'ORGANIZERS' | 'VENDORS' | 'NIMANTRANA' | 'DASHBOARD' | 'DESTINATION' | 'STAFF_POOL' | 'SOCIAL_CAUSE') => void;
  onOpenFeatures?: () => void;
}

export const MobileAppNavBar: React.FC<MobileAppNavBarProps> = ({
  activeView,
  setActiveView,
  onOpenFeatures,
}) => {
  const { language } = useLanguage();
  const { setActiveModal } = useMarketplace();

  const navItems = [
    {
      id: 'EXPLORE',
      label: language === 'ne' ? 'भेन्यु खोज' : 'Explore Venues',
      shortLabel: language === 'ne' ? 'भेन्यु' : 'Venues',
      icon: Building2,
      onClick: () => setActiveView('EXPLORE'),
      isActive: activeView === 'EXPLORE',
    },
    {
      id: 'DESTINATION',
      label: language === 'ne' ? 'डेस्टिनेशन' : 'Destination',
      shortLabel: 'Destination',
      icon: Mountain,
      onClick: () => setActiveView('DESTINATION'),
      isActive: activeView === 'DESTINATION',
    },
    {
      id: 'VENDORS',
      label: language === 'ne' ? 'कलाकार/बाजा' : 'Artists & Vendors',
      shortLabel: 'Vendors',
      icon: Music,
      onClick: () => setActiveView('VENDORS'),
      isActive: activeView === 'VENDORS',
    },
    {
      id: 'STAFF_POOL',
      label: language === 'ne' ? 'उत्सव जनशक्ति' : 'Staff & Gigs',
      shortLabel: language === 'ne' ? 'जनशक्ति' : 'Staff',
      icon: Briefcase,
      onClick: () => setActiveView('STAFF_POOL'),
      isActive: activeView === 'STAFF_POOL',
    },
    {
      id: 'NIMANTRANA',
      label: language === 'ne' ? 'स्मार्ट निम्तो' : 'RSVP & Kitchen',
      shortLabel: 'RSVP',
      icon: UtensilsCrossed,
      onClick: () => setActiveView('NIMANTRANA'),
      isActive: activeView === 'NIMANTRANA',
    },
    {
      id: 'ORGANIZERS',
      label: language === 'ne' ? 'अर्गनाइजर' : 'Planners',
      shortLabel: 'Planners',
      icon: Award,
      onClick: () => setActiveView('ORGANIZERS'),
      isActive: activeView === 'ORGANIZERS',
    },
  ];

  return (
    <nav
      aria-label="Mobile and PWA navigation"
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/98 backdrop-blur-lg border-t border-stone-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="grid grid-cols-6 h-15 max-w-lg mx-auto px-1 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`flex flex-col items-center justify-center py-1 transition-all relative ${
                active ? 'text-amber-950 font-bold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {active && (
                <span className="absolute top-0 w-8 h-1 rounded-full bg-amber-900" />
              )}
              <div
                className={`p-1 rounded-xl transition-transform ${
                  active ? 'bg-amber-100/70 text-amber-950 scale-105' : 'text-stone-600'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] leading-tight truncate max-w-[62px] text-center mt-0.5">
                {item.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
