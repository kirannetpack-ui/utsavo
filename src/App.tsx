/**
 * UTSAVO — Nepal's Smart Celebration Marketplace
 * Main Application Shell & Master Orchestration
 */

import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { VenueCatalog } from './components/VenueCatalog';
import { SmartPlannerModal } from './components/SmartPlannerModal';
import { PanchangaCalendarModal } from './components/PanchangaCalendarModal';
import { VenueDetailModal } from './components/VenueDetailModal';
import { NegotiationDrawer } from './components/NegotiationDrawer';
import { BookingAgreementModal } from './components/BookingAgreementModal';
import { PaymentModal } from './components/PaymentModal';
import { CustomerDashboard } from './components/CustomerDashboard';
import { VenueOwnerDashboard } from './components/VenueOwnerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ReviewModal } from './components/ReviewModal';
import { GeminiChatbotModal } from './components/GeminiChatbotModal';
import { VenueOnboardingModal } from './components/VenueOnboardingModal';
import { Footer } from './components/Footer';

const MainShell: React.FC = () => {
  const { currentUser, activeModal, setActiveModal } = useMarketplace();
  const [activeView, setActiveView] = useState<'EXPLORE' | 'DASHBOARD'>('EXPLORE');

  // Review modal state
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [reviewVenueId, setReviewVenueId] = useState<string | null>(null);

  const handleOpenReviewModal = (bookingId: string, venueId: string) => {
    setReviewBookingId(bookingId);
    setReviewVenueId(venueId);
  };

  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9] text-stone-900 font-sans selection:bg-amber-100 selection:text-amber-950">
      
      {/* Top Bar Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'EXPLORE' ? (
          <div>
            <HeroSection />
            <VenueCatalog />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {currentUser.role === 'CUSTOMER' && (
              <CustomerDashboard onOpenReviewModal={handleOpenReviewModal} />
            )}
            {(currentUser.role === 'VENUE_OWNER' || currentUser.role === 'VENUE_MANAGER') && (
              <VenueOwnerDashboard />
            )}
            {(currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'FINANCE_ADMIN') && (
              <AdminDashboard />
            )}
          </div>
        )}
      </main>

      {/* Interactive Modals & Drawers */}
      <SmartPlannerModal />
      <PanchangaCalendarModal />
      <VenueDetailModal />
      <NegotiationDrawer />
      <BookingAgreementModal />
      <PaymentModal />
      <GeminiChatbotModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
      />
      <ReviewModal
        bookingId={reviewBookingId}
        venueId={reviewVenueId}
        onClose={() => {
          setReviewBookingId(null);
          setReviewVenueId(null);
        }}
      />
      <VenueOnboardingModal
        isOpen={activeModal === 'VENUE_ONBOARDING'}
        onClose={() => setActiveModal('NONE')}
      />

      {/* Floating AI Assistant Trigger (Bottom Right) */}
      <button
        onClick={() => setIsAiAssistantOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-amber-900 hover:bg-amber-950 text-white p-3.5 rounded-full shadow-xl transition-transform hover:scale-105 flex items-center gap-2 border border-amber-700/50"
        title="Open UTSAVO Gemini AI Assistant"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
        </span>
        <span className="text-xs font-semibold pr-1">UTSAVO AI</span>
      </button>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <MarketplaceProvider>
        <MainShell />
      </MarketplaceProvider>
    </LanguageProvider>
  );
}
