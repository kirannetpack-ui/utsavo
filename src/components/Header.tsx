/**
 * UTSAVO - Top Navigation Bar
 * Follows Strict Top Bar Contract: 3 Zones, single-line typography, no decorative clutter
 */

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { UserRole } from '../types';
import { Calendar, Sparkles, Building2, Shield, User, Globe, ChevronDown, Check, LogIn, LogOut, Bot } from 'lucide-react';
import { auth, loginWithGoogle, logoutUser, testFirestoreConnection } from '../firebase/config';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface HeaderProps {
  activeView: 'EXPLORE' | 'DASHBOARD';
  setActiveView: (view: 'EXPLORE' | 'DASHBOARD') => void;
  onOpenAiAssistant: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeView, setActiveView, onOpenAiAssistant }) => {
  const { language, setLanguage, t } = useLanguage();
  const { currentUser, setCurrentRole, setActiveModal } = useMarketplace();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    testFirestoreConnection();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error('Google Login error:', err);
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const roles: { role: UserRole; label: string; icon: any }[] = [
    { role: 'CUSTOMER', label: t('roleCustomer'), icon: User },
    { role: 'VENUE_OWNER', label: t('roleVenueOwner'), icon: Building2 },
    { role: 'SUPER_ADMIN', label: t('roleSuperAdmin'), icon: Shield },
    { role: 'FINANCE_ADMIN', label: t('roleFinanceAdmin'), icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          
          {/* Zone 1: Single Wordmark */}
          <button
            onClick={() => setActiveView('EXPLORE')}
            className="flex items-center text-left focus:outline-none"
          >
            <span className="font-display text-2xl font-bold tracking-tight text-amber-950 whitespace-nowrap shrink-0">
              UTSAVO
            </span>
          </button>

          {/* Zone 2: 4-5 Concise Single-Line Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            <button
              onClick={() => setActiveView('EXPLORE')}
              className={`hover:text-amber-900 transition-colors whitespace-nowrap shrink-0 ${
                activeView === 'EXPLORE' ? 'text-amber-950 font-semibold' : ''
              }`}
            >
              {t('navExplore')}
            </button>
            <button
              onClick={() => setActiveModal('PANCHANGA_CALENDAR')}
              className="hover:text-amber-900 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Calendar className="w-4 h-4 text-amber-700" />
              <span>{t('navMuhurats')}</span>
            </button>
            <button
              onClick={onOpenAiAssistant}
              className="hover:text-amber-900 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 text-amber-900 font-semibold"
            >
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>AI Assistant</span>
            </button>
            <button
              onClick={() => setActiveView('DASHBOARD')}
              className={`hover:text-amber-900 transition-colors whitespace-nowrap shrink-0 ${
                activeView === 'DASHBOARD' ? 'text-amber-950 font-semibold' : ''
              }`}
            >
              {t('navDashboard')}
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action + Role/Language/Firebase Controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Language Toggle (EN / नेपाली) */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ne' : 'en')}
              className="px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              title="Toggle Nepali / English"
            >
              <Globe className="w-3.5 h-3.5 text-stone-500" />
              <span>{language === 'en' ? 'नेपाली' : 'English'}</span>
            </button>

            {/* Firebase Auth Google Sign-in */}
            {firebaseUser ? (
              <div className="flex items-center gap-1.5 bg-stone-100 py-1 px-2.5 rounded-lg border border-stone-200 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Connected to Firebase Auth" />
                <span className="max-w-[100px] truncate text-stone-800 font-medium">
                  {firebaseUser.displayName || firebaseUser.email?.split('@')[0]}
                </span>
                <button
                  onClick={handleGoogleSignOut}
                  className="text-stone-400 hover:text-stone-700 ml-1"
                  title="Sign out of Google"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                className="px-2.5 py-1.5 text-xs font-semibold text-stone-800 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-xs"
                title="Google Sign-in with Firebase Auth"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-800" />
                <span>Google Login</span>
              </button>
            )}

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="px-2.5 py-1.5 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
              >
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                <span className="max-w-[100px] truncate">
                  {currentUser.role === 'CUSTOMER'
                    ? 'Customer'
                    : currentUser.role === 'VENUE_OWNER'
                    ? 'Venue Owner'
                    : currentUser.role === 'SUPER_ADMIN'
                    ? 'Admin'
                    : 'Finance'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-stone-200 py-1.5 z-50">
                  <div className="px-3 py-1.5 border-b border-stone-100 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    Switch Test Persona
                  </div>
                  {roles.map(({ role, label, icon: Icon }) => (
                    <button
                      key={role}
                      onClick={() => {
                        setCurrentRole(role);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-stone-50 transition-colors ${
                        currentUser.role === role ? 'font-semibold text-amber-900 bg-amber-50/50' : 'text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Icon className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                        <span className="truncate">{label}</span>
                      </div>
                      {currentUser.role === role && <Check className="w-3.5 h-3.5 text-amber-700 shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <button
              onClick={onOpenAiAssistant}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-950 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Planner</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
