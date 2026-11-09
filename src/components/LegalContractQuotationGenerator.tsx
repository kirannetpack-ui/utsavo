/**
 * UTSAVO — Downloadable Legal Contract & Official PDF Quotation Generator
 * Conforming strictly to the Nepal Contract Act 2056 (नेपाल करार ऐन २०५६)
 */

import React, { useState } from 'react';
import { LegalContractDocument, EventType, ShiftTime } from '../types';
import {
  FileText,
  Printer,
  Download,
  ShieldCheck,
  Building2,
  User,
  Scale,
  Calendar,
  Clock,
  CheckCircle,
  X,
  Stamp,
  Coins
} from 'lucide-react';

interface LegalContractQuotationGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  initialVenueData?: {
    venueName: string;
    panNumber: string;
    contactPerson: string;
    phone: string;
    email: string;
    address: string;
    cateringStartingNpr?: number;
    baseRentalStartingNpr?: number;
  };
}

export const LegalContractQuotationGenerator: React.FC<LegalContractQuotationGeneratorProps> = ({
  isOpen,
  onClose,
  initialVenueData
}) => {
  if (!isOpen) return null;

  const [documentMode, setDocumentMode] = useState<'CONTRACT' | 'QUOTATION'>('CONTRACT');

  // Document Fields State
  const [docData, setDocData] = useState({
    contractRef: `UTS-KRA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    dateIssuedBS: '2081 Mangsir 14',
    dateIssuedAD: new Date().toISOString().split('T')[0],
    
    // Party A (Venue)
    venueLegalName: initialVenueData?.venueName || 'Heritage Durbar & Grand Party Palace Pvt. Ltd.',
    venueTradeName: initialVenueData?.venueName || 'Heritage Garden Banquet',
    venuePan: initialVenueData?.panNumber || '304928172',
    venueReg: '109824/078/079',
    venueSignatory: initialVenueData?.contactPerson || 'Ganesh Man Shrestha',
    venueDesignation: 'Managing Director',
    venuePhone: initialVenueData?.phone || '+977-9851012345',
    venueAddress: initialVenueData?.address || 'Sanepa, Lalitpur, Bagmati Province',

    // Party B (Client)
    clientName: 'Er. Sandesh Pokharel',
    clientCitizenship: '27-01-74-09823 (Kathmandu)',
    clientPan: '609823412',
    clientPhone: '+977-9841987654',
    clientEmail: 'sandesh.pokharel@outlook.com',
    clientAddress: 'Baneshwor-10, Kathmandu',

    // Event Specs
    eventType: 'WEDDING' as EventType,
    eventDateBS: '2081 Magh 24 (Auspicious Vivaha Muhurat)',
    eventDateAD: '2025-02-06',
    shift: 'DAY' as ShiftTime,
    hallName: 'Kailash Ballroom & Imperial Lawn',
    guaranteedGuests: 450,
    perPlateRateNpr: initialVenueData?.cateringStartingNpr || 1450,
    hallRentalNpr: initialVenueData?.baseRentalStartingNpr || 60000,
    refundableSecurityDepositNpr: 25000,
    soundCurfew: '10:30 PM (Per District Administration Office Directive)',
    powerBackupKw: '62.5 kVA Silent Soundproof Genset',
    outsideDecoratorAllowed: true,

    // Signatures
    partyASigned: true,
    partyBSigned: true,
  });

  // Financial Calculations
  const cateringSubtotal = docData.guaranteedGuests * docData.perPlateRateNpr;
  const taxableSubtotal = cateringSubtotal + docData.hallRentalNpr;
  const vatRate = 0.13; // 13% Nepal VAT
  const vatAmount = Math.round(taxableSubtotal * vatRate);
  const grandTotal = taxableSubtotal + vatAmount;

  // Milestone Payments
  const tokenAdvance20 = Math.round(grandTotal * 0.20);
  const preEvent60 = Math.round(grandTotal * 0.60);
  const finalSettlement20 = grandTotal - tokenAdvance20 - preEvent60;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[94vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 print:max-h-none print:shadow-none print:rounded-none print:w-full">
        
        {/* Interactive Top Bar (Hidden during printing) */}
        <div className="p-4 bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <Scale className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-display text-base font-bold">
                {documentMode === 'CONTRACT' ? 'Legal Celebration Contract (करार सम्झौता पत्र)' : 'Formal Event Quotation (दरभाउ पत्र)'}
              </h3>
              <p className="text-[11px] text-stone-300">
                Governed under Nepal Contract Act 2056 · Ref #{docData.contractRef}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-white/10 p-1 rounded-xl flex items-center text-xs">
              <button
                onClick={() => setDocumentMode('CONTRACT')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  documentMode === 'CONTRACT' ? 'bg-amber-500 text-stone-950' : 'text-stone-300'
                }`}
              >
                Legal Contract
              </button>
              <button
                onClick={() => setDocumentMode('QUOTATION')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  documentMode === 'QUOTATION' ? 'bg-amber-500 text-stone-950' : 'text-stone-300'
                }`}
              >
                Price Quotation
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-white text-stone-950 hover:bg-stone-100 rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Container */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-stone-800 text-xs bg-stone-50/50 print:bg-white print:p-0 print:overflow-visible">
          
          {/* Document Sheet */}
          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-stone-200 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
            
            {/* Header Stamp */}
            <div className="flex justify-between items-start border-b-2 border-stone-800 pb-4">
              <div>
                <span className="font-display text-2xl font-bold tracking-tight text-amber-950 block">
                  UTSAVO
                </span>
                <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold block">
                  NEPAL'S SMART CELEBRATION MARKETPLACE
                </span>
                <span className="text-[9px] text-stone-400 block mt-0.5">
                  Operated in Compliance with Nepal Contract Act 2056 & Hospitality Standards
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono text-sm font-bold text-stone-900 block">
                  {docData.contractRef}
                </span>
                <span className="text-[11px] text-stone-600 block">
                  Date (BS): <strong>{docData.dateIssuedBS}</strong>
                </span>
                <span className="text-[10px] text-stone-400 block">
                  Date (AD): {docData.dateIssuedAD}
                </span>
              </div>
            </div>

            {/* Document Title Header */}
            <div className="text-center py-2 bg-amber-50/60 rounded-xl border border-amber-900/10">
              <h2 className="font-display text-base sm:text-lg font-bold text-amber-950 uppercase tracking-wide">
                {documentMode === 'CONTRACT'
                  ? 'उत्सव तथा पार्टी प्यालेस सेवा सम्झौता पत्र (LEGAL EVENT CONTRACT)'
                  : 'उत्सव दरभाउ तथा सेवा प्रस्ताव पत्र (FORMAL EVENT QUOTATION)'}
              </h2>
              <p className="text-[10px] text-stone-600 mt-0.5">
                {documentMode === 'CONTRACT'
                  ? 'द्विपक्षीय कानुनी सम्झौता: पार्टी प्यालेस (प्रथम पक्ष) र सेवाग्राही (दोस्रो पक्ष) बीच'
                  : 'Itemized Pricing, Per-Plate Catering & Hall Reservation Breakdown'}
              </p>
            </div>

            {/* The Contracting Parties Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200">
              {/* Party A */}
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-900 block">
                  प्रथम पक्ष (Party A - Venue Operator):
                </span>
                <div className="font-bold text-stone-900 text-xs">{docData.venueLegalName}</div>
                <div className="text-[11px] text-stone-600">व्यापारिक नाम: {docData.venueTradeName}</div>
                <div className="text-[10px] text-stone-500">
                  PAN / VAT नं.: <strong>{docData.venuePan}</strong> · दर्ता नं: {docData.venueReg}
                </div>
                <div className="text-[10px] text-stone-500">
                  हस्ताक्षरकर्ता: {docData.venueSignatory} ({docData.venueDesignation})
                </div>
                <div className="text-[10px] text-stone-500">ठेगाना: {docData.venueAddress}</div>
              </div>

              {/* Party B */}
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-900 block">
                  दोस्रो पक्ष (Party B - Client / Host):
                </span>
                <div className="font-bold text-stone-900 text-xs">{docData.clientName}</div>
                <div className="text-[10px] text-stone-500">
                  नागरिकता / राहदानी नं.: <strong>{docData.clientCitizenship}</strong>
                </div>
                <div className="text-[10px] text-stone-500">
                  स्थायी लेखा नं (PAN): {docData.clientPan || 'N/A'}
                </div>
                <div className="text-[10px] text-stone-500">
                  सम्पर्क: {docData.clientPhone} · {docData.clientEmail}
                </div>
                <div className="text-[10px] text-stone-500">ठेगाना: {docData.clientAddress}</div>
              </div>
            </div>

            {/* Section 1: Event Schedule & Space Reservation */}
            <div className="space-y-2">
              <span className="font-bold text-xs text-stone-900 uppercase tracking-wide block">
                १. उत्सव विवरण तथा हल आरक्षण (Event Schedule & Hall Reservation)
              </span>
              <table className="w-full text-left border-collapse border border-stone-200 text-[11px]">
                <tbody>
                  <tr className="border-b border-stone-200">
                    <td className="p-2 font-semibold bg-stone-50 w-1/3">उत्सवको प्रकार (Occasion)</td>
                    <td className="p-2">{docData.eventType}</td>
                  </tr>
                  <tr className="border-b border-stone-200">
                    <td className="p-2 font-semibold bg-stone-50">मिति (Auspicious Date BS / AD)</td>
                    <td className="p-2 font-bold text-stone-900">{docData.eventDateBS} (AD: {docData.eventDateAD})</td>
                  </tr>
                  <tr className="border-b border-stone-200">
                    <td className="p-2 font-semibold bg-stone-50">समय तथा सिफ्ट (Time Shift)</td>
                    <td className="p-2">{docData.shift === 'DAY' ? 'दिवा सिफ्ट (10:00 AM - 04:30 PM)' : 'साँझ सिफ्ट (05:00 PM - 10:30 PM)'}</td>
                  </tr>
                  <tr className="border-b border-stone-200">
                    <td className="p-2 font-semibold bg-stone-50">आरक्षित हल (Allocated Space)</td>
                    <td className="p-2">{docData.hallName}</td>
                  </tr>
                  <tr className="border-b border-stone-200">
                    <td className="p-2 font-semibold bg-stone-50">न्यूनतम ग्यारेन्टी पाहुना संख्या (Min Guests)</td>
                    <td className="p-2 font-bold text-amber-950">{docData.guaranteedGuests} Heads</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section 2: Financial Itemization & VAT */}
            <div className="space-y-2">
              <span className="font-bold text-xs text-stone-900 uppercase tracking-wide block">
                २. आर्थिक हिसाब तथा कर विवरण (Financial Breakdown & Tax)
              </span>
              <table className="w-full text-left border-collapse border border-stone-200 text-[11px]">
                <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                  <tr>
                    <th className="p-2">विवरण (Description)</th>
                    <th className="p-2 text-center">परिमाण (Qty)</th>
                    <th className="p-2 text-right">दर (Rate NPR)</th>
                    <th className="p-2 text-right">जम्मा रकम (Total NPR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  <tr>
                    <td className="p-2 font-medium">
                      शाही क्याटरिङ पर-प्लेट सेवा (Per-Plate Banquet Spread: Welcome Drink, 4 Veg Starters, 3 Non-Veg Starters, Main Course, Pulao, Bread, Sweets)
                    </td>
                    <td className="p-2 text-center">{docData.guaranteedGuests} Plates</td>
                    <td className="p-2 text-right">Rs. {docData.perPlateRateNpr.toLocaleString()}</td>
                    <td className="p-2 text-right font-semibold">Rs. {cateringSubtotal.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">
                      हल भाडा तथा मुख्य मण्डप पूर्वाधार (Main Banquet Hall, Garden Lawn & Basic AC)
                    </td>
                    <td className="p-2 text-center">१ उत्सव (1 Shift)</td>
                    <td className="p-2 text-right">Rs. {docData.hallRentalNpr.toLocaleString()}</td>
                    <td className="p-2 text-right font-semibold">Rs. {docData.hallRentalNpr.toLocaleString()}</td>
                  </tr>
                  <tr className="bg-stone-50/70">
                    <td colSpan={3} className="p-2 text-right font-semibold">करयोग्य रकम (Taxable Subtotal):</td>
                    <td className="p-2 text-right font-bold">Rs. {taxableSubtotal.toLocaleString()}</td>
                  </tr>
                  <tr className="bg-stone-50/70">
                    <td colSpan={3} className="p-2 text-right font-semibold">मूल्य अभिवृद्धि कर (13% Nepal VAT):</td>
                    <td className="p-2 text-right font-bold text-amber-900">Rs. {vatAmount.toLocaleString()}</td>
                  </tr>
                  <tr className="bg-amber-100/50 font-display">
                    <td colSpan={3} className="p-2.5 text-right font-bold text-xs text-amber-950">
                      कुल देय रकम (GRAND TOTAL WITH VAT):
                    </td>
                    <td className="p-2.5 text-right font-bold text-sm text-amber-950">
                      Rs. {grandTotal.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="text-[10px] text-stone-500 italic">
                * फिर्ता हुने धरौटी (Refundable Security Deposit): Rs. {docData.refundableSecurityDepositNpr.toLocaleString()} (उत्सव समापन पश्चात क्षति नभएमा फिर्ता हुनेछ)
              </div>
            </div>

            {/* Section 3: Milestone Payment Schedule */}
            {documentMode === 'CONTRACT' && (
              <div className="space-y-2">
                <span className="font-bold text-xs text-stone-900 uppercase tracking-wide block">
                  ३. किस्ता भुक्तानी तालिका (Payment Milestone Schedule)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                    <span className="text-[10px] font-bold text-stone-500 uppercase">१. पहिलो किस्ता (20% Token)</span>
                    <div className="font-bold text-stone-900 text-xs">Rs. {tokenAdvance20.toLocaleString()}</div>
                    <div className="text-[10px] text-stone-500">सम्झौता हस्ताक्षर गर्दा तत्काल बुझाउने</div>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                    <span className="text-[10px] font-bold text-stone-500 uppercase">२. दोस्रो किस्ता (60% Pre-Event)</span>
                    <div className="font-bold text-stone-900 text-xs">Rs. {preEvent60.toLocaleString()}</div>
                    <div className="text-[10px] text-stone-500">उत्सव सुरु हुनुभन्दा ७ दिन अगावै</div>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                    <span className="text-[10px] font-bold text-stone-500 uppercase">३. अन्तिम किस्ता (20% Final)</span>
                    <div className="font-bold text-stone-900 text-xs">Rs. {finalSettlement20.toLocaleString()}</div>
                    <div className="text-[10px] text-stone-500">उत्सव सम्पन्न भए पश्चात अन्तिम गणना गरी</div>
                  </div>
                </div>
              </div>
            )}

            {/* Section 4: Operational Clauses (Sound Curfew, Genset, Outside Event Planners) */}
            {documentMode === 'CONTRACT' && (
              <div className="space-y-1.5 text-[10px] text-stone-600 leading-relaxed border-t border-stone-200 pt-3">
                <span className="font-bold text-stone-800 uppercase block text-[11px]">
                  ४. मुख्य नीति तथा कानुनी सर्तहरू (Mandatory Legal Conditions):
                </span>
                <p>
                  <strong>४.१ ध्वनि तथा समय सीमा:</strong> स्थानीय प्रशासन (DAO) को निर्देशन बमोजिम ध्वनि उपकरणहरू राति {docData.soundCurfew} सम्म मात्र बजाउन पाइनेछ। सो समय पश्चात ध्वनि न्यून गरि कार्यक्रम सम्पन्न गर्नुपर्नेछ।
                </p>
                <p>
                  <strong>४.२ विद्युत तथा जेनेरेटर ब्याकअप:</strong> प्रथम पक्षले निरन्तर विद्युत आपूर्तिका लागि {docData.powerBackupKw} उपलब्ध गराउनेछ। मुख्य मण्डप तथा खाना काउन्टरमा बत्तीको पूर्ण प्रत्याभूति हुनेछ।
                </p>
                <p>
                  <strong>४.३ बाह्य इभेन्ट म्यानेजमेन्ट तथा सजावट:</strong> दोस्रो पक्षले बाह्य इभेन्ट डेकोरेटर ल्याउन पाउनेछ। डेकोरेटर टोलीले उत्सव सुरु हुनुभन्दा कम्तिमा ६ घण्टा अगावै सामग्री भित्राई सजावट सम्पन्न गर्नुपर्नेछ।
                </p>
                <p>
                  <strong>४.४ सम्झौता खारेजी तथा रकम फिर्ता:</strong> उत्सव हुनुभन्दा ३० दिन अगावै जानकारी दिएमा पहिलो किस्ताको ५०% फिर्ता हुनेछ। १५ दिनभित्र खारेज गरेमा अग्रिम रकम फिर्ता हुने छैन।
                </p>
                <p>
                  <strong>४.५ कानुनी क्षेत्राधिकार:</strong> यस सम्झौतामा कुनै विवाद उत्पन्न भएमा नेपाल करार ऐन २०५६ बमोजिम जिल्ला अदालत तथा नेपाल मध्यस्थता परिषद्को क्षेत्राधिकार लागू हुनेछ।
                </p>
              </div>
            )}

            {/* Section 5: Signature Boxes and Stamps */}
            <div className="pt-6 border-t-2 border-stone-800 grid grid-cols-2 gap-8 text-[11px]">
              
              {/* Party A Signature */}
              <div className="space-y-3">
                <span className="font-bold uppercase text-stone-700 block">
                  प्रथम पक्षको तर्फबाट (For Party A - Venue):
                </span>
                <div className="h-16 border-b border-dashed border-stone-400 flex items-center justify-between px-2">
                  <div className="flex items-center gap-1.5 text-emerald-800">
                    <Stamp className="w-6 h-6 text-emerald-700" />
                    <div>
                      <span className="font-bold text-[10px] block font-mono">DIGITALLY CERTIFIED</span>
                      <span className="text-[8px] text-stone-400">UTSAVO Trust Stamp · {docData.venuePan}</span>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="font-bold text-stone-900">{docData.venueSignatory}</div>
                  <div className="text-[10px] text-stone-500">{docData.venueDesignation} · {docData.venueLegalName}</div>
                </div>
              </div>

              {/* Party B Signature */}
              <div className="space-y-3">
                <span className="font-bold uppercase text-stone-700 block">
                  दोस्रो पक्षको तर्फबाट (For Party B - Client):
                </span>
                <div className="h-16 border-b border-dashed border-stone-400 flex items-center justify-between px-2">
                  <div className="flex items-center gap-1.5 text-emerald-800">
                    <ShieldCheck className="w-6 h-6 text-emerald-700" />
                    <div>
                      <span className="font-bold text-[10px] block font-mono">E-SIGNED VERIFIED</span>
                      <span className="text-[8px] text-stone-400">Citizenship #{docData.clientCitizenship.split(' ')[0]}</span>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="font-bold text-stone-900">{docData.clientName}</div>
                  <div className="text-[10px] text-stone-500">{docData.clientPhone}</div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
