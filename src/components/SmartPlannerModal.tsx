/**
 * UTSAVO - Smart Conversational Event Planning Assistant
 * Flexible discovery with zero mandatory roadblocks, ranges, and complete user autonomy
 */

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { NEPAL_PROVINCES } from '../data/nepalGeography';
import { PANCHANGA_AUSPICIOUS_MUHURATS } from '../data/panchangaCalendar';
import { EventType } from '../types';
import { X, Sparkles, ArrowRight, RotateCcw, Check, ChevronRight, HelpCircle } from 'lucide-react';
import { NepalDistrictSelector, NepalProvinceSelector } from './NepalLocationSelector';

export const SmartPlannerModal: React.FC = () => {
  const { language } = useLanguage();
  const { activeModal, setActiveModal, setFilters } = useMarketplace();

  // Multi-step flexible questionnaire
  const [step, setStep] = useState<number>(1);

  // User planning state
  const [eventType, setEventType] = useState<EventType>('WEDDING');
  const [selectedProvince, setSelectedProvince] = useState<string>('Bagmati Province');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Kathmandu');
  const [preferredSeason, setPreferredSeason] = useState<string>('Mangsir (Nov-Dec)');
  const [guestRange, setGuestRange] = useState<number>(400);
  const [perPlateBudget, setPerPlateBudget] = useState<number>(1800);

  // Optional preferences (never mandatory)
  const [spacePreference, setSpacePreference] = useState<'ANY' | 'INDOOR' | 'LAWN_GARDEN'>('ANY');
  const [needMandap, setNeedMandap] = useState<boolean>(true);
  const [needGenset, setNeedGenset] = useState<boolean>(true);
  const [parkingCarsRequired, setParkingCarsRequired] = useState<number>(80);
  const [wantFoodRescueConsent, setWantFoodRescueConsent] = useState<boolean>(false);

  if (activeModal !== 'SMART_PLANNER') return null;

  const currentProvinceData = NEPAL_PROVINCES.find((p) => p.name === selectedProvince);
  const availableDistricts = currentProvinceData ? currentProvinceData.districts : [];

  const handleFinishAndShowVenues = () => {
    setFilters((prev) => ({
      ...prev,
      province: selectedProvince,
      district: selectedDistrict,
      eventType,
      guestCount: guestRange,
      maxPerPlateBudget: perPlateBudget,
      includeAdjacentDistricts: true,
    }));
    setActiveModal('NONE');
  };

  const handleStartOver = () => {
    setStep(1);
    setEventType('WEDDING');
    setSelectedProvince('Bagmati Province');
    setSelectedDistrict('Kathmandu');
    setGuestRange(400);
    setPerPlateBudget(1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ne' ? 'स्मार्ट उत्सव योजनाकार' : 'UTSAVO Smart Planning Assistant'}</span>
            </div>
            <h3 className="font-display text-xl font-bold">
              {language === 'ne' ? 'तपाईंको उत्सवको आवश्यकता अनुसार स्थल छान्नुहोस्' : 'Tailor Your Celebration Step-by-Step'}
            </h3>
            <p className="text-xs text-stone-300 mt-1">
              {language === 'ne'
                ? 'कुनै पनि प्रश्न अनिवार्य छैन। तपाईं कुनै पनि समयमा स्थलहरू हेर्न सक्नुहुन्छ।'
                : 'Customer autonomy first. Skip anytime or view all venues immediately.'}
            </p>
          </div>

          <button
            onClick={() => setActiveModal('NONE')}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Step Bar */}
        <div className="px-6 py-2.5 bg-stone-100 border-b border-stone-200 flex items-center justify-between text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-900 tabular-nums">Step {step} of 3</span>
            <span>·</span>
            <span>
              {step === 1
                ? 'Event Type & Location'
                : step === 2
                ? 'Guests & Budget Range'
                : 'Optional Ambience & Facilities'}
            </span>
          </div>

          <button
            onClick={handleFinishAndShowVenues}
            className="text-amber-900 font-semibold hover:underline"
          >
            {language === 'ne' ? 'सिधै स्थलहरू हेर्नुहोस् (Skip)' : 'Skip to Venues →'}
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-2">
                  1. {language === 'ne' ? 'कुन उत्सवको तयारी गर्दै हुनुहुन्छ?' : 'What event are you planning?'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'WEDDING', label: 'विवाह (Wedding Ceremony)', icon: '💍' },
                    { id: 'RECEPTION', label: 'प्रीतिभोज (Reception Gala)', icon: '🥂' },
                    { id: 'BRATABANDHA', label: 'व्रतबन्ध (Bratabandha)', icon: '📿' },
                    { id: 'PASNI', label: 'पास्नी (Rice Weaning)', icon: '🥣' },
                    { id: 'CORPORATE_GALA', label: 'कर्पोरेट भेला (Corporate)', icon: '🏛️' },
                    { id: 'BIRTHDAY_JUBILEE', label: 'जन्मोत्सव (Birthday / Jubilee)', icon: '🎂' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setEventType(item.id as any)}
                      className={`p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center gap-2 ${
                        eventType === item.id
                          ? 'border-amber-900 bg-amber-50/80 text-amber-950 font-semibold shadow-sm'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-2">
                  2. {language === 'ne' ? 'कहाँ आयोजना गर्न चाहनुहुन्छ? (प्रदेश र जिल्ला)' : 'Where in Nepal do you want to organize it? (Choose or type)'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <NepalProvinceSelector
                      label="Province (प्रदेश)"
                      value={selectedProvince}
                      onChange={(p) => setSelectedProvince(p)}
                      placeholder="Type or pick state..."
                    />
                  </div>

                  <div>
                    <NepalDistrictSelector
                      label="District (जिल्ला)"
                      value={selectedDistrict}
                      selectedProvince={selectedProvince}
                      onChange={(d, prov) => {
                        setSelectedDistrict(d);
                        if (prov && !selectedProvince) setSelectedProvince(prov);
                      }}
                      placeholder="Type or pick from 77 districts..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-stone-700">
                    3. {language === 'ne' ? 'अपेक्षित अतिथि संख्या (Guest Count Range)' : 'Expected Guests Range'}
                  </label>
                  <span className="text-sm font-bold text-amber-950 font-display tabular-nums">
                    ~ {guestRange} Guests
                  </span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="1200"
                  step="25"
                  value={guestRange}
                  onChange={(e) => setGuestRange(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-900"
                />
                <div className="flex justify-between text-[11px] text-stone-400 mt-1 tabular-nums">
                  <span>80 (Intimate)</span>
                  <span>400 (Medium Banquet)</span>
                  <span>800 (Grand)</span>
                  <span>1200+ (Royal)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-stone-700">
                    4. {language === 'ne' ? 'प्रति-प्लेट बजेट सीमा (Approximate Per-Plate Budget)' : 'Approximate Per-Plate Budget'}
                  </label>
                  <span className="text-sm font-bold text-amber-950 font-display tabular-nums">
                    NPR {perPlateBudget.toLocaleString()} / plate
                  </span>
                </div>
                <input
                  type="range"
                  min="1100"
                  max="3500"
                  step="50"
                  value={perPlateBudget}
                  onChange={(e) => setPerPlateBudget(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-900"
                />
                <div className="flex justify-between text-[11px] text-stone-400 mt-1 tabular-nums">
                  <span>NPR 1,100 (Standard)</span>
                  <span>NPR 1,800 (Royal Feast)</span>
                  <span>NPR 3,500 (VIP Luxury)</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-2">
                  5. {language === 'ne' ? 'स्थलको शैली (Hall or Garden Space)' : 'Preferred Venue Setting'}
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'ANY', label: 'कुनै पनि (Flexible)' },
                    { id: 'INDOOR', label: 'वातानुकूलित हल (AC Ballroom)' },
                    { id: 'LAWN_GARDEN', label: 'खुला लन तथा बगैंचा (Open Lawn)' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSpacePreference(s.id as any)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        spacePreference === s.id
                          ? 'border-amber-900 bg-amber-50 text-amber-950 font-semibold'
                          : 'border-stone-200 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-2">
                  6. {language === 'ne' ? 'विशेष आवश्यकताहरू (Amenities)' : 'Key Facilities'}
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={needMandap}
                      onChange={(e) => setNeedMandap(e.target.checked)}
                      className="rounded text-amber-900 focus:ring-amber-800"
                    />
                    <span>{language === 'ne' ? 'विवाह मण्डप तथा होमको अनुमति आवश्यक' : 'Vedic Mandap & Sacred Fire Setup Required'}</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={needGenset}
                      onChange={(e) => setNeedGenset(e.target.checked)}
                      className="rounded text-amber-900 focus:ring-amber-800"
                    />
                    <span>{language === 'ne' ? '१००% पावर ब्याकअप जेनेरेटर सुनिश्चित हुनुपर्ने' : 'Uninterrupted Generator Power Backup'}</span>
                  </label>

                  <div className="pt-2 border-t border-stone-200">
                    <label className="flex items-start gap-2 text-xs text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={wantFoodRescueConsent}
                        onChange={(e) => setWantFoodRescueConsent(e.target.checked)}
                        className="rounded text-rose-800 focus:ring-rose-700 mt-0.5"
                      />
                      <span>
                        <strong className="text-rose-950 font-bold block">
                          {language === 'ne'
                            ? '✨ अन्नपूर्णा सेवा (स्वेच्छिक): बाँकी रहेको भोजन वृद्धआश्रम वा संस्थामार्फत वितरण गर्ने'
                            : '✨ Social Cause (Optional): Pledge surplus feast food to verified shelters with consent'}
                        </strong>
                        <span className="text-[11px] text-stone-500 block mt-0.5 leading-snug">
                          {language === 'ne'
                            ? 'क्लाइन्टको पूर्ण सहमतिमा मात्र ताजा भान्साको भोजन संकलन गरिनेछ (नितान्त ऐच्छिक)।'
                            : '100% voluntary client consent: Untouched kitchen food dispatched safely under DFTQC norms.'}
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleStartOver}
              className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'ne' ? 'सुरुबाट' : 'Start Over'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
              >
                {language === 'ne' ? 'अघिल्लो' : 'Back'}
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-950 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <span>{language === 'ne' ? 'अर्को' : 'Continue'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinishAndShowVenues}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{language === 'ne' ? 'स्थलहरू देखाउनुहोस्' : 'Show Matching Venues'}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
