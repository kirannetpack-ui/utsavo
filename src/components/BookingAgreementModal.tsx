/**
 * UTSAVO - Digital Booking Agreement & Contract Modal
 * Section 10: Legal terms, PAN/VAT disclosures, schedule clauses, and digital signature
 */

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  X,
  FileText,
  ShieldCheck,
  CheckCircle,
  Printer,
  Download,
  CreditCard,
  Stamp,
  Lock,
} from 'lucide-react';

export const BookingAgreementModal: React.FC = () => {
  const { language } = useLanguage();
  const {
    activeModal,
    setActiveModal,
    activeBookingId,
    bookings,
    signAgreement,
  } = useMarketplace();

  if (activeModal !== 'AGREEMENT' || !activeBookingId) return null;

  const currentBooking = bookings.find((b) => b.id === activeBookingId);
  if (!currentBooking) return null;

  const [hasAgreedTerms, setHasAgreedTerms] = useState(false);
  const isSigned = !!currentBooking.signedAgreementHash;

  const handleSignContract = () => {
    signAgreement(currentBooking.id);
  };

  const handleProceedToPayment = () => {
    setActiveModal('PAYMENT');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official Event Reservation Agreement · Ref #{currentBooking.bookingRef}</span>
            </div>
            <h3 className="font-display text-xl font-bold">
              Digital Celebration Contract & Invoice
            </h3>
            <p className="text-xs text-stone-300 mt-0.5">
              Binding legal agreement between {currentBooking.customerName} and {currentBooking.venueName}
            </p>
          </div>

          <button
            onClick={() => setActiveModal('NONE')}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Printable Document Area */}
        <div className="p-6 overflow-y-auto space-y-6 max-h-[62vh] bg-stone-50/50 text-stone-800 text-xs">
          
          {/* Printable Document Box */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5">
            
            {/* Header Stamp */}
            <div className="flex justify-between items-start border-b border-stone-200 pb-4">
              <div>
                <span className="font-display text-xl font-bold text-amber-950">UTSAVO</span>
                <div className="text-[11px] text-stone-500">Nepal's Smart Celebration Marketplace</div>
                <div className="text-[11px] text-stone-400">Electronic Commerce & Hospitality Act Compliant</div>
              </div>
              <div className="text-right">
                <span className="font-bold text-stone-900 text-sm block">Agreement #{currentBooking.bookingRef}</span>
                <span className="text-[11px] text-stone-500">Date Issued: {new Date(currentBooking.createdAt).toLocaleDateString()}</span>
                <span className="text-[10px] text-emerald-700 font-semibold block mt-1">Status: {currentBooking.status}</span>
              </div>
            </div>

            {/* Parties Summary */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-stone-50 rounded-xl border border-stone-100">
              <div>
                <span className="text-[10px] font-bold uppercase text-stone-400 block mb-1">Party A (The Venue):</span>
                <div className="font-bold text-stone-900">{currentBooking.venueName}</div>
                <div className="text-stone-500">Hall: {currentBooking.hallName}</div>
                <div className="text-stone-400">PAN / VAT: Registered Verified Venue</div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-stone-400 block mb-1">Party B (The Event Organizer):</span>
                <div className="font-bold text-stone-900">{currentBooking.customerName}</div>
                <div className="text-stone-500">Phone: {currentBooking.customerPhone}</div>
                <div className="text-stone-400">Email: {currentBooking.customerEmail}</div>
              </div>
            </div>

            {/* Event Specification Schedule */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-2">
                1. Event Schedule & Hall Allocation
              </span>
              <table className="w-full text-left border-collapse border border-stone-200">
                <tbody>
                  <tr className="border-b border-stone-200">
                    <td className="p-2 font-semibold bg-stone-50 w-1/3">Occasion Type</td>
                    <td className="p-2">{currentBooking.eventType}</td>
                  </tr>
                  <tr className="border-b border-stone-200">
                    <td className="p-2 font-semibold bg-stone-50">Event Date</td>
                    <td className="p-2 font-bold text-amber-950">
                      {currentBooking.eventDateBS} BS ({currentBooking.eventDateAD} AD)
                    </td>
                  </tr>
                  <tr className="border-b border-stone-200">
                    <td className="p-2 font-semibold bg-stone-50">Reserved Shift</td>
                    <td className="p-2">{currentBooking.shift}</td>
                  </tr>
                  <tr className="border-b border-stone-200">
                    <td className="p-2 font-semibold bg-stone-50">Guaranteed Minimum Guests</td>
                    <td className="p-2 tabular-nums">{currentBooking.guestCount} guests</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold bg-stone-50">Agreed Catering Rate</td>
                    <td className="p-2 tabular-nums">NPR {currentBooking.agreedPerPlateNpr.toLocaleString()} / plate</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Financial Consideration & Milestone Schedule */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block mb-2">
                2. Commercial Consideration & Payment Schedule
              </span>
              <div className="space-y-1.5 p-3.5 bg-stone-50 rounded-xl border border-stone-200 tabular-nums">
                <div className="flex justify-between">
                  <span>Total Agreed Value (incl. 10% Service Charge & 13% VAT):</span>
                  <span className="font-bold text-stone-900 text-sm">NPR {currentBooking.totalAmountNpr.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-amber-900 font-semibold">
                  <span>Initial Booking Hold Deposit (25%):</span>
                  <span>NPR {currentBooking.depositRequiredNpr.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Deposit Amount Paid to Date:</span>
                  <span className={currentBooking.depositPaidNpr > 0 ? 'text-emerald-700 font-bold' : ''}>
                    NPR {currentBooking.depositPaidNpr.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-stone-500 border-t border-stone-200 pt-1">
                  <span>Remaining Balance (Due 7 days prior to event):</span>
                  <span className="font-bold">NPR {currentBooking.balanceDueNpr.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Standard Legal Clauses */}
            <div className="space-y-2 text-[11px] text-stone-600 border-t border-stone-200 pt-3">
              <span className="font-bold text-stone-800 uppercase block">3. Statutory & Operating Clauses</span>
              <p>
                <strong>3.1 Noise Ordinance:</strong> In accordance with local municipal regulations, amplified sound and live music volume must be lowered to ambient levels after 10:00 PM.
              </p>
              <p>
                <strong>3.2 Vedic Fire & Mandap Safety:</strong> Traditional Vivaha Homa and Hawan are authorized exclusively in designated fire-retardant mandap zones with venue security presence.
              </p>
              <p>
                <strong>3.3 Food Safety & Leftover Policy:</strong> All catering is prepared fresh on the event date. In compliance with Nepal consumer protection directives, leftover buffet food removal is subject to client safety waivers.
              </p>
            </div>

            {/* Cryptographic Signature Stamp */}
            {isSigned ? (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-emerald-950 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-bold flex items-center gap-1.5 text-xs">
                    <Lock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Digitally Signed & Timestamped</span>
                  </div>
                  <div className="text-[10px] text-stone-500 font-mono">
                    Hash: {currentBooking.signedAgreementHash}
                  </div>
                  <div className="text-[10px] text-stone-500">
                    Signed at: {currentBooking.agreementSignedAt}
                  </div>
                </div>
                <Stamp className="w-10 h-10 text-emerald-600 opacity-60" />
              </div>
            ) : (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                <label className="flex items-center gap-2 text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasAgreedTerms}
                    onChange={(e) => setHasAgreedTerms(e.target.checked)}
                    className="rounded text-amber-900 focus:ring-amber-800"
                  />
                  <span>
                    I confirm that I have reviewed all terms, date constraints, and financial considerations and agree to sign this digital agreement.
                  </span>
                </label>
              </div>
            )}

          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-white border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Contract</span>
          </button>

          <div className="flex items-center gap-3">
            {!isSigned ? (
              <button
                onClick={handleSignContract}
                disabled={!hasAgreedTerms}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-950 disabled:opacity-50 rounded-xl shadow transition-colors flex items-center gap-1.5"
              >
                <Stamp className="w-3.5 h-3.5" />
                <span>Digitally Sign Agreement</span>
              </button>
            ) : currentBooking.depositPaidNpr === 0 ? (
              <button
                onClick={handleProceedToPayment}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow transition-colors flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Proceed to Pay 25% Deposit (NPR {currentBooking.depositRequiredNpr.toLocaleString()}) →</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Deposit Paid & Booking Confirmed!</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
