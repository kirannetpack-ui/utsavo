/**
 * UTSAVO - Top Navigation Bar
 * Follows Strict Top Bar Contract: 3 Zones, single-line typography, no decorative clutter
 */

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { UserRole } from '../types';
import { Calendar, Sparkles, Building2, Shield, User, Globe, ChevronDown, Check, LogIn, LogOut, Bot, Award, Mountain, Tag, Music, UtensilsCrossed, FileText, Layers, Bookmark, Briefcase } from 'lucide-react';
import { auth, loginWithGoogle, logoutUser, testFirestoreConnection } from '../firebase/config';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { BrandLogo } from './BrandLogo';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  activeView: 'EXPLORE' | 'ORGANIZERS' | 'VENDORS' | 'NIMANTRANA' | 'DASHBOARD' | 'DESTINATION' | 'STAFF_POOL';
  setActiveView: (view: 'EXPLORE' | 'ORGANIZERS' | 'VENDORS' | 'NIMANTRANA' | 'DASHBOARD' | 'DESTINATION' | 'STAFF_POOL') => void;
  onOpenAiAssistant: () => void;
  onOpenFeatures?: () => void;
  onOpenLegalContract?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  onOpenAiAssistant,
  onOpenFeatures,
  onOpenLegalContract,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const {
    currentUser,
    setCurrentRole,
    setActiveModal,
    openVenueOnboarding,
    openOrganizerRegistration,
    savedVenueIds,
    savedVendorIds,
    customerDashboardTab,
    setCustomerDashboardTab,
  } = useMarketplace();
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
    { role: 'EVENT_ORGANIZER', label: language === 'ne' ? 'इभेन्ट अर्गनाइजर' : 'Event Organizer', icon: Award },
    { role: 'SUPER_ADMIN', label: t('roleSuperAdmin'), icon: Shield },
    { role: 'FINANCE_ADMIN', label: t('roleFinanceAdmin'), icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-18">
          
          {/* Zone 1: Official Brand Identity */}
          <button
            onClick={() => setActiveView('EXPLORE')}
            className="flex items-center text-left focus:outline-none group cursor-pointer"
            title="UTSAVO — Nepal's Smart Celebration Marketplace"
          >
            <BrandLogo variant="light" size="md" />
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-stone-600">
            <button
              onClick={() => setActiveView('EXPLORE')}
              className={`hover:text-amber-900 transition-colors whitespace-nowrap shrink-0 ${
                activeView === 'EXPLORE' ? 'text-amber-950 font-bold' : ''
              }`}
            >
              {t('navExplore')}
            </button>
            <button
              onClick={() => setActiveView('DESTINATION')}
              className={`hover:text-amber-900 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeView === 'DESTINATION' ? 'text-amber-950 font-bold bg-amber-50 px-2 py-1 rounded-lg' : 'text-stone-700'
              }`}
            >
              <Mountain className="w-4 h-4 text-amber-700" />
              <span>{language === 'ne' ? 'डेस्टिनेशन नेपाल' : 'Destination Nepal'}</span>
            </button>
            <button
              onClick={() => setActiveView('VENDORS')}
              className={`hover:text-amber-900 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeView === 'VENDORS' ? 'text-amber-950 font-bold bg-amber-50 px-2 py-1 rounded-lg' : 'text-stone-700'
              }`}
            >
              <Music className="w-4 h-4 text-amber-700" />
              <span>{language === 'ne' ? 'कलाकार तथा बाजा' : 'Artists & Vendors'}</span>
            </button>
            <button
              onClick={() => setActiveView('STAFF_POOL')}
              className={`hover:text-amber-900 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeView === 'STAFF_POOL' ? 'text-amber-950 font-bold bg-amber-50 px-2 py-1 rounded-lg' : 'text-stone-700'
              }`}
            >
              <Briefcase className="w-4 h-4 text-amber-700" />
              <span>{language === 'ne' ? 'उत्सव जनशक्ति' : 'Staff & Gigs'}</span>
              <span className="px-1.5 py-0.2 text-[9px] bg-amber-600 text-white font-bold rounded-full">New</span>
            </button>
            <button
              onClick={() => setActiveView('NIMANTRANA')}
              className={`hover:text-amber-900 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeView === 'NIMANTRANA' ? 'text-amber-950 font-bold bg-amber-50 px-2 py-1 rounded-lg' : 'text-stone-700'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4 text-amber-700" />
              <span>{language === 'ne' ? 'स्मार्ट निम्तो र भान्सा' : 'RSVP & Kitchen'}</span>
            </button>
            <button
              onClick={() => setActiveView('ORGANIZERS')}
              className={`hover:text-amber-900 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeView === 'ORGANIZERS' ? 'text-amber-950 font-semibold' : ''
              }`}
            >
              <Award className="w-4 h-4 text-amber-700" />
              <span>{language === 'ne' ? 'इभेन्ट अर्गनाइजर' : 'Planners'}</span>
            </button>
            <button
              onClick={() => setActiveModal('PANCHANGA_CALENDAR')}
              className="hover:text-amber-900 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Calendar className="w-4 h-4 text-amber-700" />
              <span>{t('navMuhurats')}</span>
            </button>
            <button
              onClick={() => setActiveView('DASHBOARD')}
              className={`hover:text-amber-900 transition-colors whitespace-nowrap shrink-0 ${
                activeView === 'DASHBOARD' && customerDashboardTab !== 'SAVED' ? 'text-amber-950 font-semibold' : ''
              }`}
            >
              {t('navDashboard')}
            </button>
            <button
              onClick={() => {
                setCustomerDashboardTab('SAVED');
                setActiveView('DASHBOARD');
              }}
              className={`hover:text-amber-900 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 px-2.5 py-1 rounded-lg ${
                activeView === 'DASHBOARD' && customerDashboardTab === 'SAVED'
                  ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300 shadow-2xs'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
              title="Saved Venues & Vendors (सुरक्षित मनपर्नेहरू)"
            >
              <Bookmark className={`w-3.5 h-3.5 ${activeView === 'DASHBOARD' && customerDashboardTab === 'SAVED' ? 'fill-amber-900 text-amber-900' : 'text-amber-800'}`} />
              <span>{language === 'ne' ? 'सुरक्षित' : 'Saved'}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-900 text-white">
                {savedVenueIds.length + savedVendorIds.length}
              </span>
            </button>
            {onOpenFeatures && (
              <button
                onClick={onOpenFeatures}
                className="hover:text-rose-900 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-900 font-bold border border-rose-200/80 shadow-2xs hover:bg-rose-100"
                title="View complete UTSAVO feature matrix"
              >
                <Layers className="w-3.5 h-3.5 text-rose-700" />
                <span>{language === 'ne' ? 'सबै सुविधाहरू' : 'All Features'}</span>
              </button>
            )}
          </nav>

          {/* Zone 3: 1 Primary Action + Role/Language/Firebase Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* PWA Install Button */}
            <PWAInstallButton variant="header" />

            {/* Official PDF Quotation & Contract Generator Trigger */}
            {onOpenLegalContract && (
              <button
                onClick={onOpenLegalContract}
                className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                title="Generate statutory quotation & hospitality legal contract PDF"
              >
                <FileText className="w-3.5 h-3.5 text-stone-600" />
                <span>PDF Contract</span>
              </button>
            )}

            {/* Quick List Venue CTA for Venue Operators */}
            <button
              onClick={() => openVenueOnboarding(null)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-stone-900 hover:bg-stone-950 text-white rounded-lg shadow-xs transition-colors"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{language === 'ne' ? 'भेन्यु दर्ता' : 'List Venue'}</span>
            </button>

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
                    : currentUser.role === 'EVENT_ORGANIZER'
                    ? 'Event Planner'
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

      {/* Mobile & PWA Feature Navigation Strip (Visible on Mobile, Tablet & PWA) */}
      <div className="lg:hidden border-t border-stone-200/90 bg-[#fbfbf9]/98 backdrop-blur-md px-3 py-2 overflow-x-auto no-scrollbar flex items-center gap-2">
        {/* Explore Venues */}
        <button
          onClick={() => setActiveView('EXPLORE')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
            activeView === 'EXPLORE'
              ? 'bg-amber-950 text-white font-bold shadow-xs'
              : 'text-stone-700 bg-white border border-stone-200 hover:bg-stone-100'
          }`}
        >
          <span>{language === 'ne' ? 'भेन्यु खोज' : 'Explore Venues'}</span>
        </button>

        {/* Destination Nepal */}
        <button
          onClick={() => setActiveView('DESTINATION')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
            activeView === 'DESTINATION'
              ? 'bg-amber-950 text-white font-bold shadow-xs'
              : 'text-stone-700 bg-white border border-stone-200 hover:bg-stone-100'
          }`}
        >
          <Mountain className="w-3.5 h-3.5 text-amber-700" />
          <span>{language === 'ne' ? 'डेस्टिनेशन नेपाल' : 'Destination Nepal'}</span>
        </button>

        {/* Artists & Vendors */}
        <button
          onClick={() => setActiveView('VENDORS')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
            activeView === 'VENDORS'
              ? 'bg-amber-950 text-white font-bold shadow-xs'
              : 'text-stone-700 bg-white border border-stone-200 hover:bg-stone-100'
          }`}
        >
          <Music className="w-3.5 h-3.5 text-amber-700" />
          <span>{language === 'ne' ? 'कलाकार तथा बाजा' : 'Artists & Vendors'}</span>
        </button>

        {/* RSVP & Kitchen */}
        <button
          onClick={() => setActiveView('NIMANTRANA')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
            activeView === 'NIMANTRANA'
              ? 'bg-amber-950 text-white font-bold shadow-xs'
              : 'text-stone-700 bg-white border border-stone-200 hover:bg-stone-100'
          }`}
        >
          <UtensilsCrossed className="w-3.5 h-3.5 text-amber-700" />
          <span>{language === 'ne' ? 'स्मार्ट निम्तो र भान्सा' : 'RSVP & Kitchen'}</span>
        </button>

        {/* Planners */}
        <button
          onClick={() => setActiveView('ORGANIZERS')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
            activeView === 'ORGANIZERS'
              ? 'bg-amber-950 text-white font-bold shadow-xs'
              : 'text-stone-700 bg-white border border-stone-200 hover:bg-stone-100'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-700" />
          <span>{language === 'ne' ? 'इभेन्ट अर्गनाइजर' : 'Planners'}</span>
        </button>

        {/* Saved Venues & Vendors */}
        <button
          onClick={() => {
            setCustomerDashboardTab('SAVED');
            setActiveView('DASHBOARD');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
            activeView === 'DASHBOARD' && customerDashboardTab === 'SAVED'
              ? 'bg-amber-950 text-white font-bold shadow-xs'
              : 'text-stone-700 bg-white border border-stone-200 hover:bg-stone-100'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${activeView === 'DASHBOARD' && customerDashboardTab === 'SAVED' ? 'fill-amber-300 text-amber-300' : 'text-amber-800'}`} />
          <span>{language === 'ne' ? 'सुरक्षित' : 'Saved'}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-900 text-white">
            {savedVenueIds.length + savedVendorIds.length}
          </span>
        </button>

        {/* Muhurats */}
        <button
          onClick={() => setActiveModal('PANCHANGA_CALENDAR')}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 text-stone-700 bg-white border border-stone-200 hover:bg-stone-100 transition-all flex items-center gap-1.5"
        >
          <Calendar className="w-3.5 h-3.5 text-amber-700" />
          <span>{t('navMuhurats')}</span>
        </button>

        {/* All Features Matrix */}
        {onOpenFeatures && (
          <button
            onClick={onOpenFeatures}
            className="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 text-rose-900 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-all flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-rose-700" />
            <span>All Features</span>
          </button>
        )}
      </div>
    </header>
  );
};
