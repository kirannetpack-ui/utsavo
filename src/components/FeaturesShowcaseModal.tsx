/**
 * UTSAVO — Comprehensive Feature Showcase & Quick Navigator
 * Shows all features of the App & PWA in one organized, interactive matrix.
 */

import React from 'react';
import {
  Building2,
  Mountain,
  Music,
  UtensilsCrossed,
  Award,
  Calendar,
  FileText,
  TrendingUp,
  Smartphone,
  Share2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  X,
  FileSpreadsheet,
  QrCode,
  Bookmark,
  Briefcase,
} from 'lucide-react';

interface FeaturesShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: 'EXPLORE' | 'DESTINATION' | 'VENDORS' | 'NIMANTRANA' | 'ORGANIZERS' | 'DASHBOARD' | 'STAFF_POOL') => void;
  onOpenModal: (modal: 'PANCHANGA_CALENDAR' | 'LEGAL_CONTRACT' | 'VENUE_ONBOARDING' | 'EVENT_ORGANIZER_REGISTER') => void;
}

export const FeaturesShowcaseModal: React.FC<FeaturesShowcaseModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenModal,
}) => {
  if (!isOpen) return null;

  const featureList = [
    {
      id: 'venues',
      category: 'Venue Discovery',
      title: 'Smart Venue & Party Palace Catalog',
      nepali: 'पार्टी प्यालेस तथा भेन्यु खोज',
      description: 'Filter across Kathmandu, Pokhara, Lalitpur, Chitwan with per-plate pricing, guest capacity, and live muhurat availability.',
      icon: Building2,
      badge: 'Core Engine',
      actionLabel: 'Browse Venues',
      action: () => {
        onNavigate('EXPLORE');
        onClose();
      },
    },
    {
      id: 'saved_venues',
      category: 'Customer Dashboard',
      title: 'Saved Venues & Vendors (Bookmarks)',
      nepali: 'सुरक्षित मनपर्ने भेन्यु तथा सेवाहरू',
      description: 'Bookmark favorite party palaces and cultural artists, compare capacity and pricing side-by-side, and check Panchanga availability.',
      icon: Bookmark,
      badge: 'Favorites Hub',
      actionLabel: 'View Saved Bookmarks',
      action: () => {
        onNavigate('DASHBOARD');
        onClose();
      },
    },
    {
      id: 'destination',
      category: 'Destination Weddings',
      title: 'Destination Celebration Hub',
      nepali: 'डेस्टिनेशन नेपाल उत्सव केन्द्र',
      description: 'Curated mountain-view celebrations in Pokhara Annapurna, Muktinath Pilgrimage, Nagarkot Cloudline, and Everest Panorama.',
      icon: Mountain,
      badge: 'Signature',
      actionLabel: 'Explore Destinations',
      action: () => {
        onNavigate('DESTINATION');
        onClose();
      },
    },
    {
      id: 'vendors',
      category: 'Cultural Marketplace',
      title: 'Vedic Purohits & Cultural Artists',
      nepali: 'पञ्चेबाजा, पुरोहित तथा कलाकार',
      description: 'Book verified traditional Panche Baja, Newari Dhime bands, certified Purohits, wedding photographers, bridal makeup, and chariots.',
      icon: Music,
      badge: 'Heritage',
      actionLabel: 'View Artists & Vendors',
      action: () => {
        onNavigate('VENDORS');
        onClose();
      },
    },
    {
      id: 'nimantrana',
      category: 'Digital RSVP & Kitchen',
      title: 'Digital Nimantrana Suite & QR Sync',
      nepali: 'डिजिटल निम्तो र भान्सा सिङ्क',
      description: '100% editable ceremonial E-Cards, scannable high-DPI QR codes, 300 DPI badges, and real-time headcounts to prevent food wastage.',
      icon: UtensilsCrossed,
      badge: 'Zero Food Waste',
      actionLabel: 'Open Nimantrana Suite',
      action: () => {
        onNavigate('NIMANTRANA');
        onClose();
      },
    },
    {
      id: 'bulk',
      category: 'Invitations & Guest Tracker',
      title: 'Bulk WhatsApp/Viber & CSV/Excel Import',
      nepali: 'बल्क निमन्त्रणा र रियल-टाइम ट्रयाकर',
      description: 'Import guest contact spreadsheets (.csv, .xlsx) and track 4-state real-time status: Invited, Replied, Attending, and Declined.',
      icon: Share2,
      badge: 'Real-time Tracker',
      actionLabel: 'Manage Guest Dispatch',
      action: () => {
        onNavigate('NIMANTRANA');
        onClose();
      },
    },
    {
      id: 'organizers',
      category: 'Event Production',
      title: 'Certified Event Organizers Directory',
      nepali: 'इभेन्ट अर्गनाइजर डाइरेक्टरी',
      description: 'Verified full-scale event agencies adhering to international run-of-show protocols, safety clearances, and production standards.',
      icon: Award,
      badge: 'Global Standards',
      actionLabel: 'View Planners',
      action: () => {
        onNavigate('ORGANIZERS');
        onClose();
      },
    },
    {
      id: 'staff_pool',
      category: 'Workforce & Employment',
      title: 'Celebration Staff & Gig Talent Pool',
      nepali: 'उत्सव जनशक्ति तथा गिग कार्यथलो',
      description: 'Open, unrestricted workforce pool for banquet servers, kitchen halwais, ushers, and decorators with direct hiring and verified vendor ratings.',
      icon: Briefcase,
      badge: 'Gig Economy',
      actionLabel: 'Explore Talent Pool',
      action: () => {
        onNavigate('STAFF_POOL');
        onClose();
      },
    },
    {
      id: 'panchanga',
      category: 'Auspicious Muhurats',
      title: 'Hindu Panchanga Auspicious Calendar',
      nepali: 'पञ्चाङ्ग शुभ मुहूर्त (विवाह/व्रतबन्ध)',
      description: 'Verified auspicious dates for 2081/2082 approved under Nepal Panchanga Nirnayak Samiti with Sarva Siddhi Muhurat guidance.',
      icon: Calendar,
      badge: 'Samiti Approved',
      actionLabel: 'View Muhurats',
      action: () => {
        onOpenModal('PANCHANGA_CALENDAR');
        onClose();
      },
    },
    {
      id: 'legal',
      category: 'Statutory Compliance',
      title: 'Downloadable Legal Contract & PDF Quotations',
      nepali: 'आधिकारिक कानुनी सम्झौता र कोटेशन',
      description: 'Generate statutory PDF quotations and legal hospitality agreements with PAN registration, force majeure, and refund schedules.',
      icon: FileText,
      badge: 'Official PDF',
      actionLabel: 'Generate Contract',
      action: () => {
        onOpenModal('LEGAL_CONTRACT');
        onClose();
      },
    },
    {
      id: 'analytics',
      category: 'Venue Owner Tech',
      title: 'Venue Performance & Recharts Analytics',
      nepali: 'भेन्यु सञ्चालक ड्यासबोर्ड',
      description: 'Visual analytics displaying monthly inquiries, successful bookings, and revenue trends to help party palace operators optimize.',
      icon: TrendingUp,
      badge: 'Recharts Visuals',
      actionLabel: 'Open Dashboard',
      action: () => {
        onNavigate('DASHBOARD');
        onClose();
      },
    },
    {
      id: 'pwa',
      category: 'Mobile & Desktop App',
      title: 'Progressive Web App (PWA) & Offline Mode',
      nepali: 'प्रोग्रेसिभ वेब एप (PWA)',
      description: 'Install UTSAVO to your mobile home screen. Fast, responsive, and keeps cached venues & invitations accessible without internet.',
      icon: Smartphone,
      badge: 'Installable PWA',
      actionLabel: 'App Features Active',
      action: () => {
        onClose();
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-stone-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-xl font-bold">UTSAVO Feature Matrix</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-200 text-[10px] uppercase font-bold tracking-wider">
                  Complete Suite
                </span>
              </div>
              <p className="text-xs text-amber-200/80 mt-0.5">
                All features available in the Web App & Progressive Web App (PWA)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Grid */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featureList.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-stone-200 hover:border-rose-300 hover:shadow-xs transition-all bg-[#fbfbf9] flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-rose-50 text-rose-900 border border-rose-100">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400 block">
                            {item.category}
                          </span>
                          <h4 className="font-display text-sm font-bold text-stone-900 group-hover:text-rose-950 transition-colors">
                            {item.title}
                          </h4>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 whitespace-nowrap">
                        {item.badge}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed pl-1">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-2 border-t border-stone-200/60 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-rose-900">
                      {item.nepali}
                    </span>
                    <button
                      onClick={item.action}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-rose-950 text-white text-xs font-semibold transition-all group-hover:shadow-xs"
                    >
                      <span>{item.actionLabel}</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Built for Nepal: Panche Baja, Purohits, Venues, Panchanga 2081/2082 & PWA</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-xl transition-colors"
          >
            Close Overview
          </button>
        </div>

      </div>
    </div>
  );
};
