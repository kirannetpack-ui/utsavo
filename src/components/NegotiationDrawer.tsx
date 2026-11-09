/**
 * UTSAVO - Structured Negotiation & Counter-Offer System
 * Section 9: Tamper-evident negotiation versions, itemized concessions, counter-proposals, and acceptance flow
 */

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { OfferVersion } from '../types';
import {
  X,
  MessageSquare,
  Sparkles,
  Check,
  Send,
  Clock,
  Shield,
  FileCheck,
  ArrowRight,
  TrendingDown,
  AlertTriangle,
} from 'lucide-react';

export const NegotiationDrawer: React.FC = () => {
  const { language } = useLanguage();
  const {
    activeModal,
    setActiveModal,
    activeNegotiationId,
    setActiveNegotiationId,
    negotiations,
    currentUser,
    submitCounterOffer,
    acceptOffer,
    rejectOffer,
    createBookingFromOffer,
  } = useMarketplace();

  if (activeModal !== 'NEGOTIATION' || !activeNegotiationId) return null;

  const currentThread = negotiations.find((t) => t.id === activeNegotiationId);
  if (!currentThread) return null;

  const latestOffer: OfferVersion = currentThread.versions[currentThread.versions.length - 1];
  const isVenueOperator = currentUser.role === 'VENUE_OWNER' || currentUser.role === 'VENUE_MANAGER';

  // Counter-offer form states
  const [showCounterForm, setShowCounterForm] = useState(false);
  const [counterPerPlate, setCounterPerPlate] = useState(latestOffer.proposedPerPlateNpr);
  const [counterRental, setCounterRental] = useState(latestOffer.hallRentalNpr);
  const [counterGuests, setCounterGuests] = useState(latestOffer.guestCount);
  const [counterMessage, setCounterMessage] = useState('');
  const [counterConcession, setCounterConcession] = useState('');

  const handleSendCounter = (e: React.FormEvent) => {
    e.preventDefault();

    const rawSubtotal = counterPerPlate * counterGuests + counterRental;
    const serviceCharge = Math.round(rawSubtotal * 0.10);
    const vat = Math.round((rawSubtotal + serviceCharge) * 0.13);
    const totalNpr = rawSubtotal + serviceCharge + vat;

    submitCounterOffer(
      currentThread.id,
      {
        proposedPerPlateNpr: counterPerPlate,
        hallRentalNpr: counterRental,
        guestCount: counterGuests,
        specialRequests: counterConcession || latestOffer.specialRequests,
        subtotalNpr: rawSubtotal,
        serviceChargeNpr: serviceCharge,
        vatNpr: vat,
        totalNpr: totalNpr,
      },
      counterMessage || `Updated proposal: NPR ${counterPerPlate.toLocaleString()}/plate for ${counterGuests} guests.`
    );

    setShowCounterForm(false);
    setCounterMessage('');
  };

  const handleAcceptAndProceedToBooking = () => {
    acceptOffer(currentThread.id);
    const booking = createBookingFromOffer(currentThread.id);
    setActiveModal('AGREEMENT');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
              <Shield className="w-3.5 h-3.5" />
              <span>Structured Commercial Negotiation Engine · Enquiry #{currentThread.enquiryId}</span>
            </div>
            <h3 className="font-display text-2xl font-bold">
              {currentThread.venueName}
            </h3>
            <p className="text-xs text-stone-300 mt-1">
              Client: <strong>{currentThread.customerName}</strong> ({currentThread.customerPhone}) · {currentThread.eventType}
            </p>
          </div>

          <button
            onClick={() => {
              setActiveModal('NONE');
              setActiveNegotiationId(null);
            }}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Strip & Validity Countdown */}
        <div className="px-6 py-3 bg-stone-100 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-600">Current Status:</span>
            <span
              className={`px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider text-[10px] ${
                currentThread.status === 'ACCEPTED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : currentThread.status === 'REJECTED'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {currentThread.status.replace(/_/g, ' ')}
            </span>
            <span className="text-stone-400">· Version {currentThread.currentVersion}</span>
          </div>

          <div className="flex items-center gap-1.5 text-stone-500">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>Offer Valid Until: <strong>{new Date(latestOffer.validUntil).toLocaleDateString()}</strong></span>
          </div>
        </div>

        {/* Main Body (Split into Versions History on Left, Latest Active Terms on Right) */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[60vh]">
          
          {/* Left Column (5 cols): Tamper-evident Offer Version History & Chat */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Audit Version Trail ({currentThread.versions.length} versions)
            </div>

            <div className="space-y-3">
              {currentThread.versions.map((ver, idx) => (
                <div
                  key={ver.version}
                  className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                    ver.version === currentThread.currentVersion
                      ? 'border-amber-900 bg-amber-50/50 shadow-sm'
                      : 'border-stone-200 bg-stone-50/50 opacity-80'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-stone-900">
                      Version {ver.version} ({ver.senderRole === 'CUSTOMER' ? 'Customer Proposed' : 'Venue Counter'})
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {new Date(ver.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="text-stone-600">
                    Proposed: <strong className="text-stone-900 tabular-nums">NPR {ver.proposedPerPlateNpr.toLocaleString()}</strong>/plate · <span className="tabular-nums">{ver.guestCount} guests</span>
                  </div>

                  <div className="text-[11px] text-amber-950 font-bold tabular-nums">
                    Total: NPR {ver.totalNpr.toLocaleString()} (incl. VAT)
                  </div>

                  {ver.specialRequests && (
                    <div className="p-2 bg-white rounded-lg border border-stone-200 text-[11px] text-stone-600 italic mt-1">
                      "{ver.specialRequests}"
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Structured Negotiation Messages */}
            <div className="pt-2 border-t border-stone-200">
              <span className="text-[11px] font-bold uppercase text-stone-500 block mb-2">
                Discussion Thread
              </span>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {currentThread.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-2.5 rounded-xl text-xs ${
                      m.senderRole === 'CUSTOMER' ? 'bg-stone-100 text-stone-800' : 'bg-amber-50 text-amber-950'
                    }`}
                  >
                    <div className="flex justify-between text-[10px] text-stone-400 mb-0.5">
                      <strong>{m.senderName}</strong>
                      <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div>{m.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Latest Active Quotation Breakdown & Action Controls */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-start border-b border-stone-100 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-amber-900 uppercase">Current Active Offer (v{latestOffer.version})</span>
                  <h4 className="text-base font-bold text-stone-900 mt-0.5">
                    {latestOffer.guestCount} Guests · {latestOffer.shift} Shift
                  </h4>
                  <span className="text-xs text-stone-500">{latestOffer.dateBS} BS ({latestOffer.dateAD} AD)</span>
                </div>

                <div className="text-right">
                  <span className="text-xs text-stone-400 block">Total Binding Amount</span>
                  <span className="text-xl font-bold font-display text-amber-950 tabular-nums block">
                    NPR {latestOffer.totalNpr.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold tabular-nums">
                    Deposit: NPR {Math.round(latestOffer.totalNpr * 0.25).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Itemized Terms Checklist */}
              <div className="space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Per-Plate Agreed Price:</span>
                  <strong className="text-stone-900 tabular-nums">NPR {latestOffer.proposedPerPlateNpr.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Hall Rental Fee:</span>
                  <strong className="text-stone-900 tabular-nums">NPR {latestOffer.hallRentalNpr.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="tabular-nums">NPR {latestOffer.subtotalNpr.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Service Charge (10%):</span>
                  <span className="tabular-nums">+ NPR {latestOffer.serviceChargeNpr.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Nepal VAT (13%):</span>
                  <span className="tabular-nums">+ NPR {latestOffer.vatNpr.toLocaleString()}</span>
                </div>
              </div>

              {/* Included Amenities & Concessions */}
              <div>
                <span className="text-[11px] font-bold uppercase text-stone-500 block mb-1">
                  Agreed Inclusions & Concessions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {latestOffer.includedAmenities.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 text-[11px] bg-stone-100 text-stone-700 rounded-md border border-stone-200"
                    >
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Counter-Offer Form (if toggled) */}
              {showCounterForm && (
                <form onSubmit={handleSendCounter} className="p-4 bg-stone-50 rounded-2xl border border-amber-300 space-y-3">
                  <div className="text-xs font-bold text-amber-950 flex items-center justify-between">
                    <span>Draft Counter-Offer (Version {currentThread.currentVersion + 1})</span>
                    <button
                      type="button"
                      onClick={() => setShowCounterForm(false)}
                      className="text-stone-400 hover:text-stone-600"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 block mb-1">Proposed Per-Plate (NPR)</label>
                      <input
                        type="number"
                        value={counterPerPlate}
                        onChange={(e) => setCounterPerPlate(Number(e.target.value))}
                        className="w-full text-xs bg-white border border-stone-200 rounded-lg p-2 font-semibold text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 block mb-1">Hall Rental (NPR)</label>
                      <input
                        type="number"
                        value={counterRental}
                        onChange={(e) => setCounterRental(Number(e.target.value))}
                        className="w-full text-xs bg-white border border-stone-200 rounded-lg p-2 font-semibold text-stone-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">Concessions / Complimentary Perks</label>
                    <input
                      type="text"
                      placeholder="e.g. Free Welcome Drinks or Free AC Surcharge waiver"
                      value={counterConcession}
                      onChange={(e) => setCounterConcession(e.target.value)}
                      className="w-full text-xs bg-white border border-stone-200 rounded-lg p-2 text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">Message Note to Party</label>
                    <textarea
                      rows={2}
                      placeholder="Provide reasoning for this adjusted counter-offer..."
                      value={counterMessage}
                      onChange={(e) => setCounterMessage(e.target.value)}
                      className="w-full text-xs bg-white border border-stone-200 rounded-lg p-2 text-stone-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-950 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Binding Counter-Offer (v{currentThread.currentVersion + 1})</span>
                  </button>
                </form>
              )}

              {/* Action Buttons */}
              {!showCounterForm && currentThread.status !== 'ACCEPTED' && currentThread.status !== 'REJECTED' && (
                <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={handleAcceptAndProceedToBooking}
                    className="flex-1 py-3 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept Terms & Sign Agreement</span>
                  </button>

                  <button
                    onClick={() => setShowCounterForm(true)}
                    className="px-4 py-3 text-xs font-semibold text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl transition-colors"
                  >
                    Submit Counter-Offer
                  </button>

                  <button
                    onClick={() => rejectOffer(currentThread.id)}
                    className="px-3 py-3 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                  >
                    Decline
                  </button>
                </div>
              )}

              {currentThread.status === 'ACCEPTED' && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-700" />
                    <span>This negotiation has been mutually accepted and finalized!</span>
                  </div>
                  <button
                    onClick={() => {
                      createBookingFromOffer(currentThread.id);
                      setActiveModal('AGREEMENT');
                    }}
                    className="px-3 py-1.5 text-xs font-bold bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 transition-colors"
                  >
                    View Agreement & Pay →
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
