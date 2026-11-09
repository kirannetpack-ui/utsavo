/**
 * UTSAVO - Hindu Panchanga Samiti Auspicious Dates & Cultural Festivals Modal
 * Sanctioned Subha Muhurats (विवाह, व्रतबन्ध, पास्नी, गृह प्रवेश) & Ethnic Festivals of Nepal
 */

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  CULTURAL_FESTIVALS,
  NEPALI_MONTHS,
  PANCHANGA_AUSPICIOUS_MUHURATS,
} from '../data/panchangaCalendar';
import { EventType, PanchangaMuhurat } from '../types';
import { X, Calendar, Sparkles, Filter, Check, ArrowRight } from 'lucide-react';

export const PanchangaCalendarModal: React.FC = () => {
  const { language } = useLanguage();
  const { activeModal, setActiveModal, setFilters } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'MUHURATS' | 'FESTIVALS'>('MUHURATS');
  const [selectedEventType, setSelectedEventType] = useState<EventType | 'ALL'>('ALL');

  if (activeModal !== 'PANCHANGA_CALENDAR') return null;

  const filteredMuhurats = PANCHANGA_AUSPICIOUS_MUHURATS.filter((m) => {
    if (selectedEventType === 'ALL') return true;
    return m.eventType === selectedEventType;
  });

  const handleSelectMuhurat = (muhurat: PanchangaMuhurat) => {
    setFilters((prev) => ({
      ...prev,
      dateBS: muhurat.dateBS,
      dateAD: muhurat.dateAD,
      eventType: muhurat.eventType,
    }));
    setActiveModal('NONE');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{language === 'ne' ? 'नेपाल पञ्चाङ्ग निर्णायक विकास समिति स्वीकृत' : 'Nepal Panchanga Nirnayak Samiti Approved'}</span>
            </div>
            <h3 className="font-display text-2xl font-bold">
              {language === 'ne' ? 'शुभ साइत तथा चाडपर्व क्यालेन्डर (२०८१ - २०८२ BS)' : 'Hindu Panchanga Auspicious Muhurats & Festivals'}
            </h3>
            <p className="text-xs text-stone-300 mt-1">
              {language === 'ne'
                ? 'विवाह लगन, व्रतबन्ध, पास्नी तथा प्रमुख धार्मिक, सांस्कृतिक एवं जातीय उत्सवहरूको आधिकारिक तालिका।'
                : 'Sanctioned marriage lagans, sacred ceremonies, and seasonal cultural celebrations across Nepal.'}
            </p>
          </div>

          <button
            onClick={() => setActiveModal('NONE')}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-6 py-3 bg-stone-100/70 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-stone-200/80 rounded-xl">
            <button
              onClick={() => setActiveTab('MUHURATS')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'MUHURATS' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {language === 'ne' ? 'शुभ साइत तथा लगन' : 'Auspicious Muhurats (शुभ लग्न)'}
            </button>
            <button
              onClick={() => setActiveTab('FESTIVALS')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'FESTIVALS' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {language === 'ne' ? 'सांस्कृतिक चाडपर्व' : 'Festivals & Peak Seasons'}
            </button>
          </div>

          {activeTab === 'MUHURATS' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-stone-500">
                {language === 'ne' ? 'उत्सव:' : 'Occasion:'}
              </span>
              <select
                value={selectedEventType}
                onChange={(e) => setSelectedEventType(e.target.value as any)}
                className="text-xs font-medium bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-800"
              >
                <option value="ALL">{language === 'ne' ? 'सबै साइतहरू' : 'All Occasions'}</option>
                <option value="WEDDING">{language === 'ne' ? 'विवाह (Bibaha)' : 'Wedding'}</option>
                <option value="BRATABANDHA">{language === 'ne' ? 'व्रतबन्ध (Bratabandha)' : 'Bratabandha'}</option>
                <option value="PASNI">{language === 'ne' ? 'पास्नी (Pasni)' : 'Pasni / Rice Weaning'}</option>
                <option value="GRIHA_PRAVESH">{language === 'ne' ? 'गृह प्रवेश (Housewarming)' : 'Griha Pravesh'}</option>
              </select>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 max-h-[60vh]">
          {activeTab === 'MUHURATS' ? (
            <div className="space-y-3">
              {filteredMuhurats.map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-2xl border border-stone-200 p-4 hover:border-amber-400 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-amber-950 font-display">
                        {m.dateBS} BS
                      </span>
                      <span className="text-xs text-stone-400">({m.dateAD} AD)</span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200/50">
                        {m.eventType}
                      </span>
                    </div>

                    <div className="text-xs text-stone-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span><strong>Tithi:</strong> {m.tithi}</span>
                      <span>·</span>
                      <span><strong>Nakshatra:</strong> {m.nakshatra}</span>
                      <span>·</span>
                      <span><strong>Lagan Window:</strong> {m.auspiciousTime}</span>
                    </div>

                    <p className="text-xs text-stone-500 pt-0.5">
                      {m.significance}
                    </p>
                  </div>

                  <button
                    onClick={() => handleSelectMuhurat(m)}
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-950 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5"
                  >
                    <span>{language === 'ne' ? 'यो मितिका स्थल खोज्नुहोस्' : 'Explore for this Date'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {CULTURAL_FESTIVALS.map((f) => (
                <div
                  key={f.id}
                  className="bg-white rounded-2xl border border-stone-200 p-4 hover:border-stone-300 transition-all"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">
                        {f.name}
                      </h4>
                      <div className="text-xs text-stone-500">{f.nepaliName}</div>
                    </div>
                    <span className="text-xs font-semibold text-amber-900 px-2 py-0.5 bg-amber-50 rounded-md">
                      {f.dateBS} BS
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 mt-2">
                    {f.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                    <span>Cultural Tradition: <strong>{f.community}</strong></span>
                    {f.isPeakPartyPalaceSeason && (
                      <span className="text-amber-800 font-semibold">
                        ★ High Banquet & Lawn Demand
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 text-center text-xs text-stone-500">
          {language === 'ne'
            ? 'सबै शुभ लग्नहरू नेपाल पञ्चाङ्ग निर्णायक विकास समितिद्वारा प्रमाणित पञ्चाङ्गअनुसार हुन्।'
            : 'Astrological computations aligned with Nepal Panchanga Nirnayak Development Committee standards.'}
        </div>

      </div>
    </div>
  );
};
