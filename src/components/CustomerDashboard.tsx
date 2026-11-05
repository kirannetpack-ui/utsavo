/**
 * UTSAVO - Customer & Event Organizer Dashboard
 * Section 12: Upcoming celebrations, active negotiations, signed contracts, and verified reviews
 */

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  Calendar,
  Clock,
  ShieldCheck,
  FileText,
  Star,
  ArrowRight,
  CreditCard,
  MessageSquare,
  CheckCircle,
} from 'lucide-react';

interface CustomerDashboardProps {
  onOpenReviewModal: (bookingId: string, venueId: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onOpenReviewModal }) => {
  const { language } = useLanguage();
  const {
    currentUser,
    bookings,
    negotiations,
    setActiveModal,
    setActiveNegotiationId,
    setActiveBookingId,
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'BOOKINGS' | 'NEGOTIATIONS'>('BOOKINGS');

  const myBookings = bookings;
  const myNegotiations = negotiations;

  return (
    <div className="space-y-6">
      
      {/* Dashboard Top Welcome Banner */}
      <div className="p-6 bg-white rounded-3xl border border-stone-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
            {language === 'ne' ? 'ग्राहक तथा आयोजक ड्यासबोर्ड' : 'Customer & Event Host Portal'}
          </span>
          <h2 className="font-display text-2xl font-bold text-stone-900 mt-1">
            Namaste, {currentUser.name}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage your banquet negotiations, digital legal agreements, and upcoming celebration schedules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs font-semibold flex">
            <button
              onClick={() => setActiveTab('BOOKINGS')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                activeTab === 'BOOKINGS' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              My Bookings ({myBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('NEGOTIATIONS')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                activeTab === 'NEGOTIATIONS' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Active Negotiations ({myNegotiations.length})
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: BOOKINGS & AGREEMENTS */}
      {activeTab === 'BOOKINGS' && (
        <div className="space-y-4">
          {myBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold font-mono text-stone-400">#{b.bookingRef}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      b.status === 'CONFIRMED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.status === 'COMPLETED'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {b.status}
                  </span>
                  <span className="text-xs font-semibold text-amber-950 px-2 py-0.5 bg-amber-50 rounded">
                    {b.eventType}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    {b.venueName}
                  </h3>
                  <div className="text-xs text-stone-500">
                    Hall: <strong>{b.hallName}</strong> · Reserved for: <strong>{b.guestCount} guests</strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600">
                  <span className="flex items-center gap-1 text-amber-950 font-bold">
                    <Calendar className="w-3.5 h-3.5 text-amber-700" />
                    <span>{b.eventDateBS} BS ({b.eventDateAD} AD)</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>{b.shift} Shift</span>
                  </span>
                </div>
              </div>

              {/* Financial Snapshot & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t md:border-t-0 md:border-l border-stone-100 pt-4 md:pt-0 md:pl-6">
                <div className="text-left sm:text-right text-xs">
                  <span className="text-stone-400 block text-[11px]">Total Agreed Consideration</span>
                  <span className="text-base font-bold font-display text-amber-950 tabular-nums block">
                    NPR {b.totalAmountNpr.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-stone-500 tabular-nums">
                    Paid: <strong className="text-emerald-700">NPR {b.depositPaidNpr.toLocaleString()}</strong> · Due: NPR {b.balanceDueNpr.toLocaleString()}
                  </span>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setActiveBookingId(b.id);
                      setActiveModal('AGREEMENT');
                    }}
                    className="px-4 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Agreement</span>
                  </button>

                  {b.depositPaidNpr === 0 && (
                    <button
                      onClick={() => {
                        setActiveBookingId(b.id);
                        setActiveModal('PAYMENT');
                      }}
                      className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Pay Deposit</span>
                    </button>
                  )}

                  {b.status === 'COMPLETED' && (
                    <button
                      onClick={() => onOpenReviewModal(b.id, b.venueId)}
                      className="px-4 py-2 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-600" />
                      <span>Write Verified Review</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: ACTIVE NEGOTIATIONS */}
      {activeTab === 'NEGOTIATIONS' && (
        <div className="space-y-4">
          {myNegotiations.map((neg) => {
            const latest = neg.versions[neg.versions.length - 1];

            return (
              <div
                key={neg.id}
                className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-stone-400">Enquiry #{neg.enquiryId}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        neg.status === 'COUNTER_BY_VENUE'
                          ? 'bg-amber-100 text-amber-900'
                          : neg.status === 'ACCEPTED'
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {neg.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-stone-400">· Version {neg.currentVersion}</span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900">
                    {neg.venueName}
                  </h3>
                  <div className="text-xs text-stone-600">
                    Proposed Rate: <strong>NPR {latest.proposedPerPlateNpr.toLocaleString()} / plate</strong> · Guaranteed: <strong>{latest.guestCount} guests</strong>
                  </div>

                  <div className="text-xs text-stone-500">
                    Target Date: {latest.dateBS} BS · Shift: {latest.shift}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right text-xs">
                    <span className="text-stone-400 block text-[11px]">Binding Total Amount</span>
                    <span className="text-base font-bold font-display text-amber-950 tabular-nums">
                      NPR {latest.totalNpr.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveNegotiationId(neg.id);
                      setActiveModal('NEGOTIATION');
                    }}
                    className="px-4 py-2.5 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-950 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <span>Open Negotiation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
