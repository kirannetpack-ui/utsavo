/**
 * UTSAVO - Hero Discovery & Quick Search Bar
 * Elegant celebratory aesthetic with warm neutral canvas, Panchanga shortcuts, and geographical filter
 */

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { NEPAL_PROVINCES } from '../data/nepalGeography';
import { PANCHANGA_AUSPICIOUS_MUHURATS } from '../data/panchangaCalendar';
import { EventType } from '../types';
import { MapPin, Calendar, Users, Sparkles, Search, ChevronRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { t, language } = useLanguage();
  const { filters, setFilters, setActiveModal } = useMarketplace();

  const [selectedProvince, setSelectedProvince] = useState(filters.province || '');
  const [selectedDistrict, setSelectedDistrict] = useState(filters.district || '');
  const [selectedEventType, setSelectedEventType] = useState<EventType | 'ALL'>(filters.eventType || 'ALL');
  const [guestCount, setGuestCount] = useState<number>(filters.guestCount || 350);

  // Available districts based on selected province
  const currentProvinceData = NEPAL_PROVINCES.find((p) => p.name === selectedProvince);
  const availableDistricts = currentProvinceData ? currentProvinceData.districts : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      province: selectedProvince,
      district: selectedDistrict,
      eventType: selectedEventType,
      guestCount,
    }));
  };

  const applyMuhuratShortcut = (dateBS: string, dateAD: string, eventType: EventType) => {
    setFilters((prev) => ({
      ...prev,
      dateBS,
      dateAD,
      eventType,
    }));
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-stone-100/80 via-amber-50/30 to-stone-50 border-b border-stone-200 py-12 md:py-16">
      {/* Subtle traditional architectural radial ambient background */}
      <div className="absolute top-0 inset-x-0 h-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-200/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Display Headline & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900 mb-3">
            <span>{language === 'ne' ? 'शुभ साइत · पारदर्शी वार्ता · डिजिटल सम्झौता' : 'Auspicious Muhurats · Direct Negotiation · Verified Contracts'}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-900 text-balance leading-tight">
            {t('heroTitle')}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            {t('heroSubtitle')}
          </p>
        </div>

        {/* Hero Search Box */}
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-200/80 p-4 sm:p-5 max-w-5xl mx-auto mb-8 transition-all"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Field 1: Province & District */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-600 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                <span>{language === 'ne' ? 'प्रदेश र जिल्ला' : 'Province & District'}</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setSelectedDistrict('');
                  }}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-800"
                >
                  <option value="">{language === 'ne' ? 'सबै प्रदेश' : 'All Provinces'}</option>
                  {NEPAL_PROVINCES.map((p) => (
                    <option key={p.id} value={p.name}>
                      {language === 'ne' ? p.nepaliName : p.name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedProvince}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-800 disabled:opacity-50"
                >
                  <option value="">{language === 'ne' ? 'जिल्ला छान्नुहोस्' : 'Select District'}</option>
                  {availableDistricts.map((d) => (
                    <option key={d.name} value={d.name}>
                      {language === 'ne' ? d.nepaliName : d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Field 2: Event Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>{t('searchEventType')}</span>
              </label>
              <select
                value={selectedEventType}
                onChange={(e) => setSelectedEventType(e.target.value as any)}
                className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-800"
              >
                <option value="ALL">{language === 'ne' ? 'सबै उत्सवहरू' : 'All Celebration Types'}</option>
                <option value="WEDDING">{language === 'ne' ? 'विवाह (Bibaha / Wedding)' : 'Wedding Ceremony'}</option>
                <option value="RECEPTION">{language === 'ne' ? 'प्रीतिभोज (Reception Gala)' : 'Reception Gala'}</option>
                <option value="BRATABANDHA">{language === 'ne' ? 'व्रतबन्ध (Bratabandha / Upanayana)' : 'Bratabandha'}</option>
                <option value="PASNI">{language === 'ne' ? 'पास्नी (Pasni / Annaprashan)' : 'Pasni / Rice Weaning'}</option>
                <option value="CORPORATE_GALA">{language === 'ne' ? 'कर्पोरेट भेला (Corporate Program)' : 'Corporate Program'}</option>
                <option value="BIRTHDAY_JUBILEE">{language === 'ne' ? 'जन्मोत्सव (Birthday & Jubilee)' : 'Birthday & Jubilee'}</option>
              </select>
            </div>

            {/* Field 3: Expected Guests */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-600 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-700" />
                <span>{t('searchGuests')} ({guestCount} pax)</span>
              </label>
              <input
                type="range"
                min="50"
                max="1500"
                step="25"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-900 mt-2"
              />
              <div className="flex justify-between text-[11px] text-stone-500 tabular-nums">
                <span>50</span>
                <span>350</span>
                <span>800</span>
                <span>1500+</span>
              </div>
            </div>

            {/* Field 4: Search Button & Quick Planner */}
            <div className="flex flex-col justify-end space-y-2">
              <button
                type="submit"
                className="w-full py-2.5 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-950 rounded-lg shadow transition-colors flex items-center justify-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{t('btnSearch')}</span>
              </button>
            </div>

          </div>
        </form>

        {/* Auspicious Panchanga Muhurat Shortcuts */}
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600 pt-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-700" />
              <span>{language === 'ne' ? 'नजिकका पञ्चाङ्ग शुभ लग्न:' : 'Upcoming Auspicious Muhurats:'}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {PANCHANGA_AUSPICIOUS_MUHURATS.slice(0, 4).map((m) => (
              <button
                key={m.id}
                onClick={() => applyMuhuratShortcut(m.dateBS, m.dateAD, m.eventType)}
                className="px-2.5 py-1 text-xs font-medium bg-amber-50/70 hover:bg-amber-100 text-amber-900 rounded-md border border-amber-200/60 transition-colors flex items-center gap-1"
                title={`${m.tithi} · ${m.significance}`}
              >
                <span>{m.dateBS}</span>
                <span className="text-[11px] text-amber-700 font-normal">({m.eventType === 'WEDDING' ? 'विवाह' : m.eventType === 'BRATABANDHA' ? 'व्रतबन्ध' : 'पास्नी'})</span>
              </button>
            ))}

            <button
              onClick={() => setActiveModal('PANCHANGA_CALENDAR')}
              className="text-amber-900 hover:text-amber-950 font-semibold flex items-center gap-0.5 ml-1"
            >
              <span>{language === 'ne' ? 'सबै हेर्नुहोस्' : 'View all'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Claim-to-Proof Metric Strip */}
        <div className="max-w-5xl mx-auto mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-stone-200/70 pt-6">
          <div className="text-left">
            <div className="text-xl font-bold font-display text-amber-950 tabular-nums">7 Provinces</div>
            <div className="text-xs text-stone-500 mt-0.5">Authoritative 77 districts coverage</div>
          </div>
          <div className="text-left">
            <div className="text-xl font-bold font-display text-amber-950 tabular-nums">100% Verified</div>
            <div className="text-xs text-stone-500 mt-0.5">PAN / VAT & registration verified</div>
          </div>
          <div className="text-left">
            <div className="text-xl font-bold font-display text-amber-950 tabular-nums">Panchanga Samiti</div>
            <div className="text-xs text-stone-500 mt-0.5">Official Subha Muhurat calendar</div>
          </div>
          <div className="text-left">
            <div className="text-xl font-bold font-display text-amber-950 tabular-nums">Digital Contracts</div>
            <div className="text-xs text-stone-500 mt-0.5">Binding agreement on every booking</div>
          </div>
        </div>

      </div>
    </section>
  );
};
