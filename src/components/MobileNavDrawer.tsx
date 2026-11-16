/**
 * UTSAVO — Swipe-to-Dismiss Mobile Navigation Drawer
 * Enables smooth mobile navigation across all 10 event management sections, planning tools,
 * and Gemini AI / Live Voice suites with 1:1 horizontal swipe-left-to-dismiss touch physics.
 */

import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { BrandLogo } from './BrandLogo';
import {
  Award,
  Bookmark,
  Bot,
  Briefcase,
  Building2,
  Calendar,
  ChevronLeft,
  Compass,
  Heart,
  LayoutDashboard,
  Mic,
  Mountain,
  Music,
  Scale,
  SlidersHorizontal,
  Sparkles,
  UtensilsCrossed,
  X,
} from 'lucide-react';

export type AppActiveView =
  | 'EXPLORE'
  | 'MANAGED_EVENT'
  | 'ORGANIZERS'
  | 'VENDORS'
  | 'NIMANTRANA'
  | 'DASHBOARD'
  | 'DESTINATION'
  | 'STAFF_POOL'
  | 'SOCIAL_CAUSE'
  | 'CANCELLATIONS';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: AppActiveView;
  setActiveView: (view: AppActiveView) => void;
  onOpenAiChat: () => void;
  onOpenLiveVoice: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  activeView,
  setActiveView,
  onOpenAiChat,
  onOpenLiveVoice,
}) => {
  const { language, setLanguage } = useLanguage();
  const {
    currentUser,
    setActiveModal,
    savedVenueIds,
    savedVendorIds,
    customerDashboardTab,
    setCustomerDashboardTab,
  } = useMarketplace();

  const drawerRef = useRef<HTMLDivElement | null>(null);
  const [dragOffsetX, setDragOffsetX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isDismissing, setIsDismissing] = useState<boolean>(false);

  const gestureRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    lastX: number;
    lastTime: number;
    velocityX: number;
    axis: 'none' | 'horizontal' | 'vertical';
  }>({
    active: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastTime: 0,
    velocityX: 0,
    axis: 'none',
  });

  // Lock body scroll & handle Escape while drawer is open
  useEffect(() => {
    if (!isOpen) {
      setDragOffsetX(0);
      setIsDragging(false);
      setIsDismissing(false);
      return;
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const beginDrag = (clientX: number, clientY: number) => {
    gestureRef.current = {
      active: true,
      startX: clientX,
      startY: clientY,
      lastX: clientX,
      lastTime: performance.now(),
      velocityX: 0,
      axis: 'none',
    };
  };

  const moveDrag = (clientX: number, clientY: number) => {
    const g = gestureRef.current;
    if (!g.active) return;

    const totalDx = clientX - g.startX;
    const totalDy = clientY - g.startY;

    if (g.axis === 'none') {
      if (Math.abs(totalDx) < 8 && Math.abs(totalDy) < 8) {
        return;
      }
      if (Math.abs(totalDx) > Math.abs(totalDy) * 1.15) {
        g.axis = 'horizontal';
        setIsDragging(true);
      } else {
        g.axis = 'vertical';
        g.active = false;
        return;
      }
    }

    if (g.axis === 'horizontal') {
      const now = performance.now();
      const dt = Math.max(8, now - g.lastTime);
      g.velocityX = (clientX - g.lastX) / dt;
      g.lastX = clientX;
      g.lastTime = now;

      // Full 1:1 tracking leftward; subtle damped resistance rightward
      const nextOffset = totalDx <= 0 ? totalDx : Math.min(14, totalDx * 0.18);
      setDragOffsetX(nextOffset);
    }
  };

  const endDrag = () => {
    const g = gestureRef.current;
    if (!g.active && !isDragging) return;
    g.active = false;
    setIsDragging(false);

    const drawerWidth = drawerRef.current?.offsetWidth || 320;
    const distanceRatio = Math.abs(Math.min(0, dragOffsetX)) / drawerWidth;
    const shouldDismiss =
      dragOffsetX <= -88 ||
      distanceRatio >= 0.3 ||
      (dragOffsetX < -24 && g.velocityX <= -0.42);

    if (shouldDismiss) {
      setIsDismissing(true);
      setDragOffsetX(-drawerWidth - 24);
      window.setTimeout(() => {
        setIsDismissing(false);
        setDragOffsetX(0);
        onClose();
      }, 190);
    } else {
      setDragOffsetX(0);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    beginDrag(t.clientX, t.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    moveDrag(t.clientX, t.clientY);
  };

  const handleTouchEnd = () => {
    endDrag();
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Avoid double tracking with touch events on mobile browsers
    if (e.pointerType === 'touch') return;
    beginDrag(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    moveDrag(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    endDrag();
  };

  const navigateToSection = (view: AppActiveView, savedTab?: boolean) => {
    if (savedTab) {
      setCustomerDashboardTab('SAVED');
    } else if (view === 'DASHBOARD' && customerDashboardTab === 'SAVED') {
      setCustomerDashboardTab('BOOKINGS');
    }
    setActiveView(view);
    onClose();
  };

  const planningSections: Array<{
    id: AppActiveView;
    label: string;
    nepali: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'EXPLORE', label: 'Explore Venues & Palaces', nepali: 'भेन्यु खोज', icon: Compass },
    { id: 'MANAGED_EVENT', label: 'UTSAVO Full-Service Event', nepali: 'UTSAVO सेवा', icon: Sparkles },
    { id: 'DESTINATION', label: 'Destination Nepal & Abroad', nepali: 'डेस्टिनेशन उत्सव', icon: Mountain },
    { id: 'VENDORS', label: 'Cultural Artists & Vendors', nepali: 'कलाकार तथा बाजा', icon: Music },
    { id: 'ORGANIZERS', label: 'Verified Event Planners', nepali: 'इभेन्ट अर्गनाइजर', icon: Award },
  ];

  const operationsSections: Array<{
    id: AppActiveView;
    label: string;
    nepali: string;
    icon: React.ComponentType<{ className?: string }>;
    isSaved?: boolean;
  }> = [
    { id: 'DASHBOARD', label: 'My Bookings & Workspace', nepali: 'मेरो ड्यासबोर्ड', icon: LayoutDashboard },
    {
      id: 'DASHBOARD',
      label: `Saved Shortlist (${savedVenueIds.length + savedVendorIds.length})`,
      nepali: 'सुरक्षित मनपर्नेहरू',
      icon: Bookmark,
      isSaved: true,
    },
    { id: 'NIMANTRANA', label: 'Digital Nimantrana & Kitchen', nepali: 'स्मार्ट निम्तो र भान्सा', icon: UtensilsCrossed },
    { id: 'STAFF_POOL', label: 'Event Staff & Gig Pool', nepali: 'उत्सव जनशक्ति', icon: Briefcase },
    { id: 'SOCIAL_CAUSE', label: 'Annapurna Seva (Food Rescue)', nepali: 'अन्नपूर्णा सेवा', icon: Heart },
    { id: 'CANCELLATIONS', label: 'Cancellation & Referral Hub', nepali: 'रद्द र सन्दर्भ नीति', icon: Scale },
  ];

  const progress = Math.min(1, Math.abs(Math.min(0, dragOffsetX)) / 300);
  const backdropOpacity = Math.max(0, 0.55 * (1 - progress));

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden flex"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile event navigation drawer"
    >
      {/* Interactive Backdrop */}
      <div
        onClick={onClose}
        style={{ backgroundColor: `rgba(28, 25, 23, ${backdropOpacity})` }}
        className="fixed inset-0 transition-opacity duration-200 backdrop-blur-[2px]"
      />

      {/* Swipe-to-Dismiss Left Drawer Panel */}
      <div
        ref={drawerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          transform: `translateX(${dragOffsetX}px)`,
          transition: isDragging
            ? 'none'
            : isDismissing
            ? 'transform 190ms cubic-bezier(0.32, 0, 0.67, 0)'
            : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
          touchAction: 'pan-y',
        }}
        className="relative z-10 w-[86vw] max-w-[330px] h-full bg-white shadow-2xl border-r border-stone-200 flex flex-col select-none"
      >
        {/* Top Brand Header + Close */}
        <div className="px-4 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => navigateToSection('EXPLORE')}
            className="text-left focus:outline-none"
          >
            <BrandLogo variant="light" size="sm" />
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation drawer"
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-200/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Swipe Affordance Strip */}
        <div className="px-4 py-1.5 bg-amber-50/70 border-b border-amber-200/60 flex items-center justify-between text-[11px] text-amber-900 font-medium">
          <span className="inline-flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5 text-amber-800" />
            <span>{language === 'ne' ? 'बन्द गर्न बायाँ तर्फ स्वाइप गर्नुहोस्' : 'Swipe left to dismiss menu'}</span>
          </span>
          <span className="text-[10px] text-stone-500 capitalize">
            {currentUser.role.toLowerCase().replace('_', ' ')}
          </span>
        </div>

        {/* Scrollable Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {/* Planning & Discovery */}
          <div className="space-y-1">
            <div className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-stone-400">
              {language === 'ne' ? 'योजना र बजार' : 'Planning & Discovery'}
            </div>
            {planningSections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeView === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => navigateToSection(sec.id)}
                  className={`w-full px-3 py-2.5 rounded-xl text-left text-xs flex items-center gap-3 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-amber-900 text-white font-semibold'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-amber-200' : 'text-amber-800'
                    }`}
                  />
                  <span className="truncate">
                    {language === 'ne' ? sec.nepali : sec.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Operations & Workspace */}
          <div className="space-y-1 pt-3 border-t border-stone-200">
            <div className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-stone-400">
              {language === 'ne' ? 'कार्यक्रम व्यवस्थापन' : 'Event Operations'}
            </div>
            {operationsSections.map((sec, idx) => {
              const Icon = sec.icon;
              const isActive = sec.isSaved
                ? activeView === 'DASHBOARD' && customerDashboardTab === 'SAVED'
                : activeView === sec.id &&
                  !(sec.id === 'DASHBOARD' && customerDashboardTab === 'SAVED');
              return (
                <button
                  key={`${sec.id}-${idx}`}
                  type="button"
                  onClick={() => navigateToSection(sec.id, sec.isSaved)}
                  className={`w-full px-3 py-2.5 rounded-xl text-left text-xs flex items-center gap-3 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-amber-900 text-white font-semibold'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-amber-200' : 'text-amber-800'
                    }`}
                  />
                  <span className="truncate">
                    {language === 'ne' ? sec.nepali : sec.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Smart Tools & Gemini AI */}
          <div className="space-y-1.5 pt-3 border-t border-stone-200">
            <div className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-stone-400">
              {language === 'ne' ? 'स्मार्ट र एआई उपकरणहरू' : 'Smart Tools & Gemini AI'}
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveModal('SMART_PLANNER');
                onClose();
              }}
              className="w-full px-3 py-2.5 rounded-xl text-left text-xs text-stone-800 bg-stone-50 hover:bg-stone-100 border border-stone-200 flex items-center gap-3 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-800 shrink-0" />
              <span className="font-medium truncate">SmartPlanner &amp; Panchanga Dates</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveModal('PANCHANGA_CALENDAR');
                onClose();
              }}
              className="w-full px-3 py-2.5 rounded-xl text-left text-xs text-stone-800 bg-stone-50 hover:bg-stone-100 border border-stone-200 flex items-center gap-3 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-amber-800 shrink-0" />
              <span className="font-medium truncate">Hindu Panchanga Calendar</span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAiChat();
                }}
                className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-amber-900 hover:bg-amber-950 text-white flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>AI Chat</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLiveVoice();
                }}
                className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-950 text-white flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5 text-amber-300" />
                <span>Live Voice</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Quick Language Switch */}
        <div className="px-4 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-2 text-xs">
          <button
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'ne' : 'en')}
            className="px-3 py-1.5 bg-white border border-stone-200 rounded-lg font-medium text-stone-700 hover:bg-stone-100"
          >
            {language === 'en' ? 'नेपालीमा हेर्नुहोस्' : 'Switch to English'}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveModal('VENUE_ONBOARDING');
              onClose();
            }}
            className="px-3 py-1.5 text-amber-900 font-semibold hover:underline inline-flex items-center gap-1"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>List Venue</span>
          </button>
        </div>
      </div>
    </div>
  );
};
