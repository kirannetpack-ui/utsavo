/**
 * UTSAVO - Annapurna Seva: Excess Feast Food Recovery & Social Cause
 * (उत्सव अन्नपूर्णा सेवा - अतिरिक्त भोजन पुनर्वितरण सामाजिक पहल)
 * 
 * Strict Client Consent-Driven Model:
 * - 100% Voluntary. If client does not permit, zero food is touched or dispatched.
 * - Options to distribute to:
 *   1. UTSAVO Direct Rapid Rescue Van & Volunteers (उत्सव अन्नपूर्णा द्रुत सेवा)
 *   2. Registered Humanitarian Partner (Manav Sewa Ashram, Food for Life Nepal, Rokpa Nepal, Robin Hood Army)
 *   3. Host's Nominated Local Shelter / Old Age Home
 * - Nepal DFTQC (Department of Food Technology and Quality Control) Food Safety Compliance
 * - Supports all 77 districts with typing via NepalDistrictSelector
 */

import React, { useState, useMemo } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ExcessFoodRescuePledge, FoodDistributionPartnerType } from '../types';
import { REGISTERED_FOOD_CHARITY_PARTNERS } from '../data/socialCauseFoodData';
import { NepalDistrictSelector } from './NepalLocationSelector';
import {
  Heart,
  Utensils,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Truck,
  Users,
  AlertCircle,
  FileCheck,
  Award,
  Sparkles,
  Phone,
  Plus,
  X,
  ExternalLink,
  ChevronRight,
  Info,
  Check,
  ArrowRight,
} from 'lucide-react';

interface ExcessFoodRescueSocialCauseProps {
  onBackToExplore?: () => void;
  onRequestBookingVenue?: () => void;
}

export const ExcessFoodRescueSocialCause: React.FC<ExcessFoodRescueSocialCauseProps> = ({
  onBackToExplore,
}) => {
  const { foodRescuePledges, addFoodRescuePledge, updateFoodRescueConsent, updateFoodRescueStatus } =
    useMarketplace();

  // Modal State for New Event Food Rescue Pledge
  const [isPledgeModalOpen, setIsPledgeModalOpen] = useState(false);
  const [selectedPledgeForDetail, setSelectedPledgeForDetail] = useState<ExcessFoodRescuePledge | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [celebrationTitle, setCelebrationTitle] = useState('');
  const [venueName, setVenueName] = useState('The Regal Pavilion & Royal Banquets');
  const [venueDistrict, setVenueDistrict] = useState('Kathmandu');
  const [clientHostName, setClientHostName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [partnerType, setPartnerType] = useState<FoodDistributionPartnerType>('UTSAVO_DIRECT_RESCUE');
  const [selectedOrgName, setSelectedOrgName] = useState('UTSAVO Annapurna Seva (उत्सव अन्नपूर्णा सेवा)');
  const [customOrgName, setCustomOrgName] = useState('');
  const [estimatedSurplusPortions, setEstimatedSurplusPortions] = useState(80);
  const [foodCategory, setFoodCategory] = useState<ExcessFoodRescuePledge['foodCategory']>('TRADITIONAL_NEPALI_FEAST');
  const [eventEndTime, setEventEndTime] = useState('21:00');
  const [safeWindowHours, setSafeWindowHours] = useState(3);
  const [clientConsentGiven, setClientConsentGiven] = useState(true); // Must be explicitly consented
  const [consentDeclarationText, setConsentDeclarationText] = useState(
    'म/हामी उत्सव आयोजकको हैसियतले हाम्रो उत्सवमा बाँकी रहेको ताजा, अछूतो तथा स्वच्छ भोजन गरिब, असहाय तथा वृद्ध आश्रमका दाजुभाइ दिदीबहिनीहरूलाई स्वच्छ कन्टेनरमा सुरक्षित वितरण गर्न स्वेच्छाले पूर्ण सहमति प्रदान गर्दछौं।'
  );

  // Stats calculation
  const totalPortionsFed = useMemo(() => {
    return foodRescuePledges.reduce((sum, p) => sum + (p.beneficiariesFedCount || p.estimatedSurplusPortions || 0), 0);
  }, [foodRescuePledges]);

  const activePledgesCount = useMemo(() => {
    return foodRescuePledges.filter((p) => p.status !== 'SAFELY_SERVED' && p.status !== 'CONSENT_WITHDRAWN').length;
  }, [foodRescuePledges]);

  const completedPledgesCount = useMemo(() => {
    return foodRescuePledges.filter((p) => p.status === 'SAFELY_SERVED').length;
  }, [foodRescuePledges]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientConsentGiven) {
      alert('अगाडि बढ्न ग्राहकको स्वेच्छिक सहमति अनिवार्य छ। (Client consent is mandatory for surplus food rescue).');
      return;
    }

    const orgToUse =
      partnerType === 'UTSAVO_DIRECT_RESCUE'
        ? 'UTSAVO Annapurna Seva (उत्सव अन्नपूर्णा सेवा)'
        : partnerType === 'REGISTERED_ORGANIZATION'
        ? selectedOrgName
        : customOrgName.trim() || 'Host Nominated Local Ashram / Community Shelter';

    const newPledge = addFoodRescuePledge({
      celebrationTitle: celebrationTitle.trim() || 'Grand Celebration Feast',
      venueName: venueName.trim() || 'Celebration Banquet Venue',
      venueDistrict: venueDistrict.trim() || 'Kathmandu',
      clientHostName: clientHostName.trim() || 'Event Host Family',
      clientPhone: clientPhone.trim() || '+977-9800000000',
      clientConsentGiven: true,
      clientConsentTimestamp: new Date().toISOString(),
      clientConsentDeclaration: consentDeclarationText,
      partnerType,
      organizationName: orgToUse,
      estimatedSurplusPortions: Number(estimatedSurplusPortions) || 50,
      foodCategory,
      eventEndTime,
      safeWindowHours: Number(safeWindowHours) || 3,
      status: 'CONSENT_GRANTED',
    });

    setIsPledgeModalOpen(false);
    showToast(
      `धन्यवाद! "${newPledge.celebrationTitle}" को लागि अन्नपूर्णा सेवा संकल्प सफलतापूर्वक दर्ता भयो। ग्राहकको स्वेच्छिक सहमति सुरक्षित छ।`
    );
  };

  const handleToggleConsent = (pledge: ExcessFoodRescuePledge) => {
    const nextConsent = !pledge.clientConsentGiven;
    updateFoodRescueConsent(
      pledge.id,
      nextConsent,
      nextConsent
        ? 'ग्राहकद्वारा स्वेच्छिक सहमति पुनः नवीकरण गरिएको।'
        : 'ग्राहकको विशेष अनुरोधमा अतिरिक्त भोजन वितरण सहमति फिर्ता लिइएको।'
    );
    showToast(
      nextConsent
        ? 'ग्राहकको स्वेच्छिक सहमति सक्रिय भयो। अतिरिक्त भोजन वितरण अघि बढ्नेछ।'
        : 'ग्राहकको सहमति फिर्ता लिइयो। कुनै पनि भोजन परिसर बाहिर लगिने छैन।'
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-24 text-stone-900 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-md bg-stone-900 text-white p-4 rounded-2xl shadow-2xl border border-stone-700 animate-slide-in flex items-start gap-3">
          <Heart className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold text-rose-300 block mb-0.5">अन्नपूर्णा सेवा अपडेट</span>
            {toastMessage}
          </div>
        </div>
      )}

      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 text-white overflow-hidden py-16 px-4 sm:px-6">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-semibold">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>UTSAVO Social Cause · सामाजिक उत्तरदायित्व पहल</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                उत्सव अन्नपूर्णा सेवा
                <span className="block text-amber-300 text-xl sm:text-2xl font-sans font-normal mt-1">
                  Surplus Feast Food Recovery & Dignified Redistribution
                </span>
              </h1>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                नेपाली उत्सवहरूको भव्यता र परिकारको प्रशस्ततालाई सम्मान गर्दै, विवाह तथा भोजमा बाँकी रहेको <strong>अछूतो, ताजा भोजन</strong>लाई असहाय, वृद्धआश्रम तथा गरिब बस्तीहरूमा पुर्‍याउने पवित्र सेवा।
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={() => setIsPledgeModalOpen(true)}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold rounded-2xl shadow-xl hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Pledge Excess Food / भोजन पुनर्वितरण संकल्प</span>
              </button>
              {onBackToExplore && (
                <button
                  onClick={onBackToExplore}
                  className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/20 transition-all text-sm font-semibold text-center"
                >
                  Back to Explore
                </button>
              )}
            </div>
          </div>

          {/* Key Impact Counter Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10">
            <div className="bg-white/5 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
              <span className="text-[11px] font-medium text-amber-200 block uppercase tracking-wider">Beneficiaries Fed</span>
              <strong className="text-2xl sm:text-3xl font-display font-bold text-white mt-1 block">
                {totalPortionsFed.toLocaleString()}+
              </strong>
              <span className="text-[10px] text-stone-400 mt-0.5 block">ताजा भोजन प्राप्त व्यक्तिहरू</span>
            </div>

            <div className="bg-white/5 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
              <span className="text-[11px] font-medium text-emerald-200 block uppercase tracking-wider">Completed Rescues</span>
              <strong className="text-2xl sm:text-3xl font-display font-bold text-emerald-300 mt-1 block">
                {completedPledgesCount}
              </strong>
              <span className="text-[10px] text-stone-400 mt-0.5 block">सफल वितरण भएका भोजहरू</span>
            </div>

            <div className="bg-white/5 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
              <span className="text-[11px] font-medium text-rose-200 block uppercase tracking-wider">Client Consent</span>
              <strong className="text-2xl sm:text-3xl font-display font-bold text-rose-300 mt-1 block">
                100%
              </strong>
              <span className="text-[10px] text-stone-400 mt-0.5 block">पूर्ण स्वेच्छिक अनुमति</span>
            </div>

            <div className="bg-white/5 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
              <span className="text-[11px] font-medium text-sky-200 block uppercase tracking-wider">Safety Window</span>
              <strong className="text-2xl sm:text-3xl font-display font-bold text-sky-300 mt-1 block">
                &lt; 3 Hours
              </strong>
              <span className="text-[10px] text-stone-400 mt-0.5 block">DFTQC खाद्य स्वच्छता मापदण्ड</span>
            </div>
          </div>
        </div>
      </section>

      {/* Strict Client Consent Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 relative z-20">
        <div className="bg-amber-50 rounded-3xl p-5 sm:p-6 border-2 border-amber-300 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-200 flex items-center justify-center text-amber-900 shrink-0 mt-0.5">
              <ShieldCheck className="w-6 h-6 text-amber-800" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-amber-950 flex items-center gap-2">
                <span>स्वेच्छिक ग्राहक सहमति सिद्धान्त (Strict Voluntary Client Consent Model)</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-200 text-amber-900 font-bold uppercase">
                  Non-Mandatory
                </span>
              </h3>
              <p className="text-xs text-amber-900 leading-relaxed mt-1">
                यो सेवा <strong>पूर्णतः ऐच्छिक</strong> हो। उत्सव आयोजक (क्लाइन्ट) को <strong>स्पष्ट सहमति नभएसम्म कुनै पनि भोजन परिसर बाहिर लैजान निषेध</strong> छ। क्लाइन्टले चाहेमा उत्सव सुरू हुनुभन्दा अघि वा पछि जुनसुकै बेला आफ्नो सहमति फिर्ता लिन सक्नुहुन्छ।
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPledgeModalOpen(true)}
            className="shrink-0 px-4 py-2 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-bold transition-all"
          >
            Manage Consent & Pledge
          </button>
        </div>
      </section>

      {/* Main Content Area: Options & Verified Partners */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        
        {/* How It Works with 2 Core Distribution Paths */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
              Distribution Channels / पुनर्वितरणका विकल्पहरू
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
              भोजन व्यवस्थापन कसरी गरिन्छ?
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              क्लाइन्टको अनुमति अनुसार भोजनलाई दुई मुख्य माध्यमबाट सम्मानजनक रूपमा वितरण गरिन्छ:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Option 1: UTSAVO Direct Rescue */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-900 mb-4">
                <Truck className="w-6 h-6 text-amber-800" />
              </div>
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">विकल्प १ (Direct Channel)</span>
              <h3 className="font-display text-xl font-bold text-stone-900 mt-1">
                UTSAVO Direct Rapid Rescue Van (उत्सव प्रत्यक्ष द्रुत टोली)
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed mt-2.5">
                उत्सवले आफैं स्ट्यान्डबाइमा राखेको विशेष खाद्य भ्यान र स्वयंसेवकहरूले भोज समापन भएको २ घण्टाभित्रै पार्टी प्यालेसको भान्साबाट अछूतो भोजन स्टेनलेस स्टिलका तातो बक्सहरूमा प्याक गरी नजिकका आश्रमहरूमा पुर्‍याउँछ।
              </p>
              <ul className="space-y-2 mt-4 text-xs text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>तापक्रम सुरक्षित स्टेनलेस इन्सुलेटेड बक्सहरूको प्रयोग</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>काठमाडौँ, ललितपुर, भक्तपुर, पोखरा, चितवनमा उपलब्ध</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>क्लाइन्टलाई तत्काल डिजिटल पावती र फोटो रिपोर्टिङ</span>
                </li>
              </ul>
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-500">Zero Cost to Host</span>
                <button
                  onClick={() => {
                    setPartnerType('UTSAVO_DIRECT_RESCUE');
                    setIsPledgeModalOpen(true);
                  }}
                  className="text-xs font-bold text-amber-900 hover:text-amber-700 flex items-center gap-1"
                >
                  <span>Select UTSAVO Direct</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Option 2: Registered Humanitarian Organization */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-900 mb-4">
                <Users className="w-6 h-6 text-rose-800" />
              </div>
              <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">विकल्प २ (Partner Channel)</span>
              <h3 className="font-display text-xl font-bold text-stone-900 mt-1">
                मान्यता प्राप्त सामाजिक संस्था वा आश्रम (Registered NGO / Shelter)
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed mt-2.5">
                क्लाइन्टको इच्छा अनुसार मानव सेवा आश्रम, फूड फर लाइफ नेपाल, रोक्पा नेपाल वा क्लाइन्टले तोकेको कुनै पनि स्थानीय अनाथालय/वृद्धाश्रमका आधिकारिक प्रतिनिधिहरूलाई सिधै जिम्मा लगाइन्छ।
              </p>
              <ul className="space-y-2 mt-4 text-xs text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>मानव सेवा आश्रम, फूड फर लाइफ, रोबिन हुड आर्मी नेपालसँग सहकार्य</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>क्लाइन्टले आफ्नो मनपर्ने स्थानीय आश्रम तोक्न सक्ने सुविधा</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>संस्थाको आधिकारिक छाप सहितको प्राप्ति रसिद</span>
                </li>
              </ul>
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-500">Verified Charity Partners</span>
                <button
                  onClick={() => {
                    setPartnerType('REGISTERED_ORGANIZATION');
                    setIsPledgeModalOpen(true);
                  }}
                  className="text-xs font-bold text-rose-900 hover:text-rose-700 flex items-center gap-1"
                >
                  <span>Select Partner Org</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Verified Food Charity Network Directory */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-700" />
                <h3 className="font-display text-xl font-bold text-stone-900">
                  नेपालका प्रमाणित परोपकारी साझेदार संस्थाहरू
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Nepal DFTQC स्वच्छता मापदण्ड बमोजिम नियमित अनुगमन गरिने भरपर्दो संस्थाहरू
              </p>
            </div>
            <button
              onClick={() => setIsPledgeModalOpen(true)}
              className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors shrink-0"
            >
              + Submit Food Rescue Request
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {REGISTERED_FOOD_CHARITY_PARTNERS.map((partner) => (
              <div
                key={partner.id}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-amber-400 transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-xs text-stone-900 leading-snug">
                    {partner.name}
                  </h4>
                  {partner.isUtsavoDirect ? (
                    <span className="px-2 py-0.5 rounded text-[9px] bg-amber-200 text-amber-900 font-bold shrink-0">
                      UTSAVO Direct
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-100 text-emerald-800 font-bold shrink-0">
                      Verified NGO
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {partner.description}
                </p>
                <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <span>{partner.coverageDistricts.slice(0, 3).join(', ')}</span>
                  </span>
                  <span className="font-mono text-stone-700 font-medium">{partner.contactPhone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Pledges & Consent Tracking Dashboard */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-xl font-bold text-stone-900 flex items-center gap-2">
                <span>हालका अन्नपूर्णा सेवा संकल्प तथा सहमति अभिलेख</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                  {foodRescuePledges.length} Pledges
                </span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                क्लाइन्टको स्वेच्छिक सहमति, संस्था छनोट, र वितरण स्थितिको पारदर्शी ट्र्याकिङ
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {foodRescuePledges.map((pledge) => (
              <div
                key={pledge.id}
                className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Status & Category */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                        pledge.status === 'SAFELY_SERVED'
                          ? 'bg-emerald-100 text-emerald-900'
                          : pledge.status === 'CONSENT_GRANTED'
                          ? 'bg-sky-100 text-sky-900'
                          : pledge.status === 'CONSENT_WITHDRAWN'
                          ? 'bg-stone-200 text-stone-700'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {pledge.status === 'SAFELY_SERVED' && <CheckCircle2 className="w-3 h-3 text-emerald-700" />}
                      {pledge.status === 'CONSENT_GRANTED' && <ShieldCheck className="w-3 h-3 text-sky-700" />}
                      {pledge.status === 'CONSENT_WITHDRAWN' && <X className="w-3 h-3 text-stone-500" />}
                      <span>
                        {pledge.status === 'SAFELY_SERVED'
                          ? 'Safely Distributed (वितरित)'
                          : pledge.status === 'CONSENT_GRANTED'
                          ? 'Consent Active (सहमति कायम)'
                          : pledge.status === 'CONSENT_WITHDRAWN'
                          ? 'Consent Revoked (सहमति फिर्ता)'
                          : 'Scheduled for Rescue'}
                      </span>
                    </span>

                    <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                      ~{pledge.estimatedSurplusPortions} Meals
                    </span>
                  </div>

                  {/* Title & Venue */}
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 leading-snug line-clamp-1">
                      {pledge.celebrationTitle}
                    </h4>
                    <div className="text-xs text-stone-500 mt-1 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                      <span className="truncate">{pledge.venueName} · {pledge.venueDistrict}</span>
                    </div>
                  </div>

                  {/* Client Consent Details */}
                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-stone-500 font-medium">Event Host:</span>
                      <strong className="text-stone-900">{pledge.clientHostName}</strong>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-stone-500 font-medium">Designated Partner:</span>
                      <strong className="text-amber-900 truncate max-w-[170px]">{pledge.organizationName}</strong>
                    </div>
                    {pledge.acknowledgementReceiptId && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-stone-500 font-medium">Receipt ID:</span>
                        <span className="font-mono text-emerald-800 font-bold">{pledge.acknowledgementReceiptId}</span>
                      </div>
                    )}
                  </div>

                  {/* Story / Distribution note */}
                  {pledge.recipientStoryNotes && (
                    <p className="text-[11px] text-stone-600 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 leading-relaxed italic">
                      "{pledge.recipientStoryNotes}"
                    </p>
                  )}
                </div>

                {/* Consent Action Bar */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-[11px]">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        pledge.clientConsentGiven ? 'bg-emerald-500' : 'bg-red-400'
                      }`}
                    />
                    <span className="text-stone-600">
                      {pledge.clientConsentGiven ? 'Consent Granted' : 'Consent Revoked'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleConsent(pledge)}
                    className={`text-[11px] font-bold px-3 py-1 rounded-lg border transition-colors ${
                      pledge.clientConsentGiven
                        ? 'text-stone-600 hover:text-red-700 border-stone-200 hover:border-red-300'
                        : 'text-emerald-800 hover:text-emerald-950 border-emerald-300 bg-emerald-50'
                    }`}
                  >
                    {pledge.clientConsentGiven ? 'Revoke Consent' : 'Re-grant Consent'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety & Nepal DFTQC Norms */}
        <div className="p-6 sm:p-8 bg-stone-900 text-stone-200 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Info className="w-4 h-4" />
            <span>Nepal DFTQC Food Safety & Quality Standards (खाद्य प्रविधि तथा गुण नियन्त्रण विभाग मापदण्ड)</span>
          </div>
          <h3 className="font-display text-xl font-bold text-white">
            हाम्रो खाद्य स्वच्छता तथा सुरक्षा मापदण्ड
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs leading-relaxed text-stone-300">
            <div className="p-3.5 bg-stone-800/80 rounded-2xl border border-stone-700">
              <strong className="text-white block mb-1">१. भान्साको अछूतो भोजन मात्र (Virgin Surplus Only)</strong>
              बुफे टेबलमा ग्राहकले जूठो हालेको वा लामो समय खुला राखिएको भोजन कहिल्यै लगिँदैन। भान्सामा सुरक्षित राखिएका तातो भाँडाहरूबाट मात्र भोजन संकलन गरिन्छ।
            </div>
            <div className="p-3.5 bg-stone-800/80 rounded-2xl border border-stone-700">
              <strong className="text-white block mb-1">२. २-३ घण्टाभित्र द्रुत वितरण (Strict Window)</strong>
              भोज समाप्त भएको बढीमा २ देखि ३ घण्टाभित्रै तातो इन्सुलेटेड बक्सहरूमा प्याक गरी लक्षित आश्रममा पुर्‍याइन्छ ताकि ब्याक्टेरियाको कुनै जोखिम नरहोस्।
            </div>
            <div className="p-3.5 bg-stone-800/80 rounded-2xl border border-stone-700">
              <strong className="text-white block mb-1">३. पूर्ण कानुनी तथा स्वेच्छिक सहमति (Full Consent)</strong>
              क्लाइन्टको स्पष्ट सहमति विना कुनै पनि कार्य गरिँदैन। यो सेवा कुनै अनिवार्य सरकारी कर वा दायित्व होइन, नितान्त स्वेच्छिक परोपकार हो।
            </div>
          </div>
        </div>
      </section>

      {/* PLEDGE MODAL: EVENT SURPLUS FOOD RECOVERY WITH CLIENT CONSENT */}
      {isPledgeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                  <Heart className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold">भोजन पुनर्वितरण संकल्प (Food Rescue Pledge)</h3>
                  <span className="text-xs text-amber-200 block">
                    Voluntary Client Consent Driven · Annapurna Seva
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsPledgeModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handlePledgeSubmit} className="p-6 space-y-5 overflow-y-auto text-xs">
              
              {/* Event & Venue Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Celebration Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={celebrationTitle}
                    onChange={(e) => setCelebrationTitle(e.target.value)}
                    placeholder="e.g. Bibaha Vivah of Rohan & Sneha"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Banquet Venue / Party Palace *
                  </label>
                  <input
                    type="text"
                    required
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    placeholder="e.g. The Regal Pavilion & Banquet"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Universal 77-District Selector */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Venue District (नेपालका ७७ जिल्ला वा टाइप गर्नुहोस्) *
                </label>
                <NepalDistrictSelector
                  value={venueDistrict}
                  onChange={(dist) => setVenueDistrict(dist)}
                  placeholder="Select from all 77 districts or type district name..."
                  inputClassName="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                />
              </div>

              {/* Host Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Client / Host Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientHostName}
                    onChange={(e) => setClientHostName(e.target.value)}
                    placeholder="e.g. Kiran Sharma (Host / Father)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Host Contact Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="e.g. +977-9851000000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Partner Channel Selection */}
              <div className="space-y-2 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <label className="block font-bold text-stone-900 text-xs">
                  कसलाई भोजन वितरण गराउन चाहनुहुन्छ? (Select Distribution Partner) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      partnerType === 'UTSAVO_DIRECT_RESCUE'
                        ? 'bg-amber-100/70 border-amber-600 text-amber-950 font-bold ring-1 ring-amber-600'
                        : 'bg-white border-stone-300 text-stone-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="partnerType"
                      checked={partnerType === 'UTSAVO_DIRECT_RESCUE'}
                      onChange={() => setPartnerType('UTSAVO_DIRECT_RESCUE')}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-1.5 mb-1">
                      <Truck className="w-3.5 h-3.5 text-amber-800" />
                      <span className="text-xs">UTSAVO Direct</span>
                    </div>
                    <span className="text-[10px] text-stone-500 block font-normal">
                      उत्सवको आफ्नै द्रुत उद्धार भ्यान तथा स्वयंसेवक
                    </span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      partnerType === 'REGISTERED_ORGANIZATION'
                        ? 'bg-amber-100/70 border-amber-600 text-amber-950 font-bold ring-1 ring-amber-600'
                        : 'bg-white border-stone-300 text-stone-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="partnerType"
                      checked={partnerType === 'REGISTERED_ORGANIZATION'}
                      onChange={() => setPartnerType('REGISTERED_ORGANIZATION')}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-1.5 mb-1">
                      <Users className="w-3.5 h-3.5 text-amber-800" />
                      <span className="text-xs">Partner NGO</span>
                    </div>
                    <span className="text-[10px] text-stone-500 block font-normal">
                      मानव सेवा आश्रम वा फूड फर लाइफ नेपाल
                    </span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      partnerType === 'LOCAL_SHELTER_ASHRAM'
                        ? 'bg-amber-100/70 border-amber-600 text-amber-950 font-bold ring-1 ring-amber-600'
                        : 'bg-white border-stone-300 text-stone-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="partnerType"
                      checked={partnerType === 'LOCAL_SHELTER_ASHRAM'}
                      onChange={() => setPartnerType('LOCAL_SHELTER_ASHRAM')}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-1.5 mb-1">
                      <Heart className="w-3.5 h-3.5 text-amber-800" />
                      <span className="text-xs">Nominated Shelter</span>
                    </div>
                    <span className="text-[10px] text-stone-500 block font-normal">
                      क्लाइन्टको आफ्नै रोजाइको स्थानीय आश्रम
                    </span>
                  </label>
                </div>

                {/* Sub-choice for Registered Organization */}
                {partnerType === 'REGISTERED_ORGANIZATION' && (
                  <div className="pt-2">
                    <label className="block font-semibold text-stone-700 mb-1">
                      संस्था छनोट गर्नुहोस् (Choose Partner Organization)
                    </label>
                    <select
                      value={selectedOrgName}
                      onChange={(e) => setSelectedOrgName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                    >
                      {REGISTERED_FOOD_CHARITY_PARTNERS.filter((p) => !p.isUtsavoDirect).map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name} ({p.category})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Sub-choice for Host Nominated Shelter */}
                {partnerType === 'LOCAL_SHELTER_ASHRAM' && (
                  <div className="pt-2">
                    <label className="block font-semibold text-stone-700 mb-1">
                      तोक्न चाहेको आश्रम वा अनाथालयको नाम र ठेगाना
                    </label>
                    <input
                      type="text"
                      required
                      value={customOrgName}
                      onChange={(e) => setCustomOrgName(e.target.value)}
                      placeholder="उदा: पशुपति वृद्धाश्रम, मैती नेपाल, स्थानीय वडा आश्रयस्थल"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                    />
                  </div>
                )}
              </div>

              {/* Surplus Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    अनुमानित प्लेट संख्या (Portions)
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="1000"
                    value={estimatedSurplusPortions}
                    onChange={(e) => setEstimatedSurplusPortions(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Food Category
                  </label>
                  <select
                    value={foodCategory}
                    onChange={(e) => setFoodCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="TRADITIONAL_NEPALI_FEAST">Traditional Nepali Feast (दाल/भात/तरकारी/मासु)</option>
                    <option value="VEGETARIAN_SATVIK">Pure Vegetarian Satvik (शुद्ध शाकाहारी)</option>
                    <option value="BUFFET_VARIETY">Buffet Variety (नानी/पुलाव/ग्रेभी)</option>
                    <option value="SWEETS_MITHAI">Sweets & Mithai (मिठाई/मिष्ठान्न)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    भोज समापन हुने समय (End Time)
                  </label>
                  <input
                    type="time"
                    value={eventEndTime}
                    onChange={(e) => setEventEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  />
                </div>
              </div>

              {/* MANDATORY CLIENT CONSENT DECLARATION */}
              <div className="p-4 bg-rose-50/80 rounded-2xl border-2 border-rose-300 space-y-3">
                <div className="flex items-center gap-2 text-rose-950 font-bold">
                  <ShieldCheck className="w-4 h-4 text-rose-700" />
                  <span>ग्राहकको स्पष्ट स्वेच्छिक सहमति घोषणा (Mandatory Voluntary Client Consent)</span>
                </div>

                <p className="text-[11px] text-rose-900 leading-relaxed font-serif bg-white p-3 rounded-xl border border-rose-200">
                  "{consentDeclarationText}"
                </p>

                <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={clientConsentGiven}
                    onChange={(e) => setClientConsentGiven(e.target.checked)}
                    className="rounded border-rose-400 text-rose-800 focus:ring-rose-500 w-4 h-4 mt-0.5"
                    required
                  />
                  <span className="text-xs font-bold text-rose-950 leading-snug">
                    म/हामी यस उत्सवका आयोजक/क्लाइन्टको रूपमा अतिरिक्त भोजन वितरणका लागि स्वेच्छाले पूर्ण सहमति प्रदान गर्दछौं। यदि यो बक्स चयन नभएमा कुनै पनि भोजन वितरण गरिने छैन।
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsPledgeModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!clientConsentGiven}
                  className={`px-6 py-2.5 rounded-xl font-bold shadow-md transition-all flex items-center gap-2 ${
                    clientConsentGiven
                      ? 'bg-amber-900 hover:bg-amber-950 text-white'
                      : 'bg-stone-300 cursor-not-allowed text-stone-500'
                  }`}
                >
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>संकल्प दर्ता गर्नुहोस् (Pledge with Consent)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
