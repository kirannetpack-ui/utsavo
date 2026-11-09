/**
 * UTSAVO - Professional Event Organizers & Production Directory
 * Connects event hosts, wedding couples, and corporate clients with certified Event Planners.
 * Integrates global success standards (Liability Insurance, Run-of-Show, Tech Riders),
 * and cross-matches with venues that welcome external event organizers.
 */

import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { EventOrganizer, OrganizerSpecialization } from '../types';
import {
  Sparkles,
  Award,
  ShieldCheck,
  Clock,
  Zap,
  HeartHandshake,
  Users,
  MapPin,
  Phone,
  Mail,
  Video,
  Image as ImageIcon,
  Building2,
  ExternalLink,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Star,
  ArrowRight,
  X,
} from 'lucide-react';

interface EventOrganizersDirectoryProps {
  onOpenRegisterModal: () => void;
}

export const EventOrganizersDirectory: React.FC<EventOrganizersDirectoryProps> = ({
  onOpenRegisterModal,
}) => {
  const { language } = useLanguage();
  const { organizers, venues, openOrganizerRegistration, setSelectedOrganizer, setSelectedVenue } = useMarketplace();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<OrganizerSpecialization | 'ALL'>('ALL');
  const [insuranceOnly, setInsuranceOnly] = useState(false);
  const [activeMediaModalItem, setActiveMediaModalItem] = useState<{ url: string; title: string; type: 'PHOTO' | 'VIDEO' } | null>(null);
  const [selectedOrganizerDetail, setSelectedOrganizerDetail] = useState<EventOrganizer | null>(null);

  // Venues that allow outside event management
  const outsideAllowedVenues = useMemo(() => {
    return venues.filter((v) => v.eventManagementPolicy?.allowsOutsideOrganizers);
  }, [venues]);

  // Filtered organizers
  const filteredOrganizers = useMemo(() => {
    return organizers.filter((org) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = org.companyName.toLowerCase().includes(q);
        const matchNepali = org.nepaliName?.toLowerCase().includes(q);
        const matchDistrict = org.district.toLowerCase().includes(q);
        const matchBio = org.bio.toLowerCase().includes(q);
        if (!matchName && !matchNepali && !matchDistrict && !matchBio) return false;
      }

      if (selectedSpecialization !== 'ALL') {
        if (!org.specializations.includes(selectedSpecialization)) return false;
      }

      if (insuranceOnly) {
        if (!org.successStandards?.hasPublicLiabilityInsurance) return false;
      }

      return true;
    });
  }, [organizers, searchQuery, selectedSpecialization, insuranceOnly]);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'ne' ? 'प्रमाणित इभेन्ट अर्गनाइजर डाइरेक्टरी' : 'Global Certified Event Organizers Network'}</span>
          </div>

          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight">
            {language === 'ne'
              ? 'उत्कृष्ट इभेन्ट म्यानेजर तथा वेडिङ प्लानरहरूसँग सहकार्य गर्नुहोस्'
              : 'Partner with Verified Event Planners & Production Specialists'}
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            {language === 'ne'
              ? 'अन्तर्राष्ट्रिय मापदण्ड (दायित्व बिमा, रन-अफ-शो समयतालिका, र प्राविधिक राइडर) पालना गर्ने आधिकारिक इभेन्ट कम्पनीहरू। बाह्य आयोजक स्वीकार्ने पार्टी प्यालेसहरूसँग सहज तालमेल।'
              : 'Access top event management companies compliant with global standards (Public Liability Insurance, Run-of-Show Minute Schedules, and Technical AV Riders) seamlessly paired with venues welcoming outside planners.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenRegisterModal}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-transform hover:scale-102 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ne' ? 'इभेन्ट अर्गनाइजरको रूपमा दर्ता हुनुहोस्' : 'Register as an Event Organizer'}</span>
            </button>

            <div className="text-xs text-stone-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{organizers.length} Verified Agencies Active</span>
              <span>·</span>
              <span>{outsideAllowedVenues.length} Palaces Welcoming Outside Planners</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ne' ? 'अर्गनाइजर वा सहर खोज्नुहोस्...' : 'Search organizer, city, or specialty...'}
            className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
          />
        </div>

        {/* Specialization Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {[
            { key: 'ALL', label: 'All Services' },
            { key: 'WEDDING_PLANNING', label: 'Weddings' },
            { key: 'CORPORATE_SUMMIT', label: 'Corporate Galas' },
            { key: 'STAGE_LIGHTING_AV', label: 'Stage & AV' },
            { key: 'DECOR_AND_FLORAL', label: 'Floral & Decor' },
            { key: 'DESTINATION_MANAGEMENT', label: 'Destinations' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setSelectedSpecialization(item.key as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedSpecialization === item.key
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Toggle Insurance Filter */}
        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 shrink-0">
          <input
            type="checkbox"
            checked={insuranceOnly}
            onChange={(e) => setInsuranceOnly(e.target.checked)}
            className="rounded border-emerald-400 text-emerald-700 focus:ring-emerald-600"
          />
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Liability Insured Only</span>
        </label>
      </div>

      {/* Cross-Network Feature Strip: Venues Welcoming Outside Event Planners */}
      <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-800 text-white rounded-xl shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
              {language === 'ne' ? 'बाह्य इभेन्ट म्यानेजर स्वीकार्ने भेन्युहरू' : 'Venues Welcoming Outside Event Management'}
            </h4>
            <p className="text-xs text-amber-900 mt-0.5">
              {outsideAllowedVenues.length} celebration palaces in Kathmandu, Lalitpur, and Pokhara officially permit outside organizers with transparent guidelines and zero/low royalty fees.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {outsideAllowedVenues.slice(0, 3).map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedVenue(v)}
              className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-amber-300 text-amber-950 rounded-lg hover:bg-amber-100 transition-colors shadow-2xs truncate max-w-[150px]"
              title={v.name}
            >
              {v.name.split(' ')[0]}...
            </button>
          ))}
        </div>
      </div>

      {/* Organizers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredOrganizers.map((org) => {
          const standards = org.successStandards;
          return (
            <div
              key={org.id}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                {/* Top Badge & Verified Mark */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-amber-800 font-semibold mb-1">
                      <Award className="w-4 h-4 text-amber-700" />
                      <span>{org.pricingModel.replace(/_/g, ' ')}</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-stone-900">
                      {org.companyName}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium">{org.nepaliName}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-700" />
                      <span>{org.verificationStatus}</span>
                    </span>
                    <div className="flex items-center gap-1 justify-end text-xs font-bold text-amber-500 mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{org.rating.toFixed(1)}</span>
                      <span className="text-stone-400 font-normal">({org.reviewCount})</span>
                    </div>
                  </div>
                </div>

                {/* Location and PAN info */}
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <MapPin className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                  <span className="truncate">{org.address}, {org.district}</span>
                  <span>·</span>
                  <span className="font-mono text-[11px] text-stone-400">PAN: {org.panNumber}</span>
                </div>

                {/* Tagline & Bio */}
                <p className="text-xs text-stone-600 line-clamp-2 italic">
                  "{org.tagline}"
                </p>

                {/* Global Success Standards Checklist */}
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5 text-[11px]">
                  <span className="font-bold text-stone-700 block uppercase tracking-wider text-[10px]">
                    Verified Global Success Standards:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-stone-700">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Public Liability Insured</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>Run-of-Show Minute Protocol</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                      <span>Tech AV & Generator Rider</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Eco Waste & Fire Certified</span>
                    </div>
                  </div>
                </div>

                {/* Portfolio Visual Thumbnails Preview */}
                {org.portfolioMedia && org.portfolioMedia.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                      Portfolio Showcase ({org.portfolioMedia.length} Media Items):
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {org.portfolioMedia.map((media) => (
                        <button
                          key={media.id}
                          onClick={() => setActiveMediaModalItem(media)}
                          className="relative h-16 w-24 rounded-xl overflow-hidden shrink-0 border border-stone-200 group/item hover:border-amber-700 transition-colors"
                          title={media.title}
                        >
                          {media.type === 'PHOTO' ? (
                            <img src={media.url} alt={media.title} className="w-full h-full object-cover group-hover/item:scale-105 transition-transform" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900 text-white text-[10px]">
                              <Video className="w-4 h-4 text-amber-400 mb-0.5" />
                              <span className="text-[9px]">Video</span>
                            </div>
                          )}
                          <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded text-[8px] font-bold bg-stone-900/80 text-white uppercase">
                            {media.type}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Card Footer */}
              <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-stone-400 block">Planning Fee Starts</span>
                  <span className="text-base font-bold font-display text-amber-950 tabular-nums">
                    NPR {org.startingPriceNpr.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-stone-500 block">{org.yearsOfExperience}+ yrs exp · {org.teamSize} crew</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedOrganizerDetail(org)}
                    className="px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    View Specs
                  </button>
                  <button
                    onClick={() => {
                      alert(`Direct enquiry sent to ${org.companyName} (${org.phone}). Their lead coordinator will reach out shortly.`);
                    }}
                    className="px-3.5 py-1.5 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <span>Connect Planner</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Media Lightbox Modal */}
      {activeMediaModalItem && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-400 uppercase font-semibold">
                  {activeMediaModalItem.type === 'PHOTO' ? 'Event Photo Showcase' : 'Event Video Feature'}
                </span>
                <h4 className="font-bold text-sm">{activeMediaModalItem.title}</h4>
              </div>
              <button
                onClick={() => setActiveMediaModalItem(null)}
                className="p-1 rounded-full text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-stone-950 flex items-center justify-center min-h-[300px]">
              {activeMediaModalItem.type === 'PHOTO' ? (
                <img
                  src={activeMediaModalItem.url}
                  alt={activeMediaModalItem.title}
                  className="max-h-[60vh] object-contain rounded-xl"
                />
              ) : (
                <div className="w-full text-center space-y-3">
                  <Video className="w-12 h-12 text-amber-400 mx-auto" />
                  <p className="text-xs text-stone-300 font-mono">{activeMediaModalItem.url}</p>
                  <a
                    href={activeMediaModalItem.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-md transition-colors"
                  >
                    <span>Open in YouTube / Video Player</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Organizer Specs Modal */}
      {selectedOrganizerDetail && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-amber-800 font-semibold mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Verified Operational Specifications</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-stone-900">
                  {selectedOrganizerDetail.companyName}
                </h3>
                <p className="text-xs text-stone-500">
                  {selectedOrganizerDetail.founderOrContact} · {selectedOrganizerDetail.phone}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrganizerDetail(null)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <strong className="text-stone-900 block mb-1">Company Profile & Execution Ethos:</strong>
                <p className="text-stone-600 leading-relaxed">{selectedOrganizerDetail.bio}</p>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                <span className="font-bold text-emerald-950 block">Risk & Insurance Verification:</span>
                <div className="text-emerald-900 space-y-1">
                  <div>• Public Liability Policy: <strong>{selectedOrganizerDetail.successStandards?.insurancePolicyNumber || 'Active Corporate Coverage'}</strong></div>
                  <div>• Technical Power Load Calculation: <strong>Full Single-Line Electrical Diagram Provided</strong></div>
                  <div>• Master Run-of-Show Protocol: <strong>Minute-by-minute cue sheet provided to banquet manager 48h prior</strong></div>
                </div>
              </div>

              <div>
                <strong className="text-stone-900 block mb-1">Specializations & Preferred Venue Types:</strong>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedOrganizerDetail.specializations.map((s) => (
                    <span key={s} className="px-2.5 py-1 bg-stone-100 rounded-lg text-stone-700 font-semibold text-[11px]">
                      {s.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
              <button
                onClick={() => setSelectedOrganizerDetail(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Direct contact request sent to ${selectedOrganizerDetail.companyName}.`);
                  setSelectedOrganizerDetail(null);
                }}
                className="px-5 py-2 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-semibold"
              >
                Request Proposal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
