/**
 * UTSAVO - Super Administrator & Finance Settlement Dashboard
 * Section 14: Marketplace metrics, PAN/VAT KYC moderation, commission rules, payout settlements, audit trails
 */

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  ShieldCheck,
  Check,
  X,
  FileText,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Building2,
  Lock,
  ArrowUpRight,
  Filter,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { language } = useLanguage();
  const {
    venues,
    bookings,
    negotiations,
    verifyVenueStatus,
  } = useMarketplace();

  const [adminTab, setAdminTab] = useState<'OVERVIEW' | 'VERIFICATION' | 'SETTLEMENTS' | 'AUDIT_LOGS'>('OVERVIEW');

  // Compute platform marketplace metrics
  const totalGMVNpr = bookings.reduce((sum, b) => sum + b.totalAmountNpr, 0);
  const totalCommissionEarnedNpr = bookings.reduce((sum, b) => sum + b.commissionAmountNpr, 0);
  const totalDepositsCollectedNpr = bookings.reduce((sum, b) => sum + b.depositPaidNpr, 0);
  const totalVenuePayoutPendingNpr = totalDepositsCollectedNpr - totalCommissionEarnedNpr;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
            Central Administration & Marketplace Oversight
          </span>
          <h2 className="font-display text-2xl font-bold text-stone-900 mt-1">
            UTSAVO Operations & Finance Console
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Nationwide multi-vendor party palace governance, PAN/VAT KYC compliance, and automated settlements.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs font-semibold">
          <button
            onClick={() => setAdminTab('OVERVIEW')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              adminTab === 'OVERVIEW' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setAdminTab('VERIFICATION')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              adminTab === 'VERIFICATION' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            KYC Verification ({venues.length})
          </button>
          <button
            onClick={() => setAdminTab('SETTLEMENTS')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              adminTab === 'SETTLEMENTS' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Settlements & Payouts
          </button>
          <button
            onClick={() => setAdminTab('AUDIT_LOGS')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              adminTab === 'AUDIT_LOGS' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Audit Log
          </button>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-stone-200">
          <span className="text-xs text-stone-400 block">Gross Booking Volume (GMV)</span>
          <span className="text-xl font-bold font-display text-stone-900 tabular-nums">
            NPR {totalGMVNpr.toLocaleString()}
          </span>
          <span className="text-[11px] text-stone-500 block mt-1">Across 7 provinces</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200">
          <span className="text-xs text-stone-400 block">Platform Commission (5% avg)</span>
          <span className="text-xl font-bold font-display text-emerald-800 tabular-nums">
            NPR {totalCommissionEarnedNpr.toLocaleString()}
          </span>
          <span className="text-[11px] text-stone-500 block mt-1">Net marketplace take</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200">
          <span className="text-xs text-stone-400 block">Escrow Deposits Held</span>
          <span className="text-xl font-bold font-display text-amber-950 tabular-nums">
            NPR {totalDepositsCollectedNpr.toLocaleString()}
          </span>
          <span className="text-[11px] text-stone-500 block mt-1">eSewa & Khalti collections</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200">
          <span className="text-xs text-stone-400 block">Venue Payout Obligation</span>
          <span className="text-xl font-bold font-display text-blue-900 tabular-nums">
            NPR {totalVenuePayoutPendingNpr.toLocaleString()}
          </span>
          <span className="text-[11px] text-stone-500 block mt-1">Pending post-event settlement</span>
        </div>
      </div>

      {/* TAB 1: OVERVIEW METRICS & PROVINCIAL DISTRIBUTION */}
      {adminTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-stone-900">
              Active Venues by Province
            </h3>
            <div className="space-y-2.5 text-xs">
              {[
                { name: 'Bagmati Province (Kathmandu, Lalitpur, Bhaktapur, Chitwan)', count: 4, pct: 57 },
                { name: 'Gandaki Province (Pokhara, Kaski)', count: 1, pct: 15 },
                { name: 'Lumbini Province (Butwal, Rupandehi)', count: 1, pct: 14 },
                { name: 'Koshi Province (Biratnagar, Morang)', count: 1, pct: 14 },
              ].map((prov) => (
                <div key={prov.name} className="space-y-1">
                  <div className="flex justify-between text-stone-700">
                    <span className="truncate">{prov.name}</span>
                    <strong className="tabular-nums">{prov.count} Venues</strong>
                  </div>
                  <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-800 rounded-full" style={{ width: `${prov.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-stone-900">
              Commission & Pricing Policy Controls
            </h3>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span>Standard Marketplace Commission:</span>
                <strong className="text-amber-950 font-display text-sm">5.0%</strong>
              </div>
              <div className="flex justify-between items-center">
                <span>Payment Processing Gateway Fee:</span>
                <span className="font-semibold text-stone-800">1.5% (Merchant Absorption)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Nepal VAT Compliance:</span>
                <span className="font-semibold text-emerald-800">13% Output Tax Verified</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Hospitality Service Charge:</span>
                <span className="font-semibold text-stone-800">10% Standard Rate</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KYC VERIFICATION MODERATION QUEUE */}
      {adminTab === 'VERIFICATION' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Venue Partner KYC & PAN Verification Queue
              </h3>
              <p className="text-xs text-stone-500">
                Strict compliance: Unverified venues cannot collect customer deposits.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {venues.map((venue) => (
              <div
                key={venue.id}
                className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">{venue.name}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        venue.verificationStatus === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {venue.verificationStatus}
                    </span>
                  </div>

                  <div className="text-stone-600">
                    PAN: <strong>{venue.panNumber}</strong> · Reg No: <strong>{venue.businessRegNumber}</strong>
                  </div>

                  <div className="text-stone-400 text-[11px]">
                    Location: {venue.locality}, {venue.district}, {venue.province} · Contact: {venue.phone}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {venue.verificationStatus === 'VERIFIED' ? (
                    <button
                      onClick={() => verifyVenueStatus(venue.id, 'SUSPENDED')}
                      className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      Suspend Listing
                    </button>
                  ) : (
                    <button
                      onClick={() => verifyVenueStatus(venue.id, 'VERIFIED')}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve KYC</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SETTLEMENTS & PAYOUTS */}
      {adminTab === 'SETTLEMENTS' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              Merchant Settlement Ledger
            </h3>
            <p className="text-xs text-stone-500">
              Reconciled payment receipts, platform commission retention, and venue payouts.
            </p>
          </div>

          <div className="space-y-3">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-500">#{b.bookingRef}</span>
                    <span className="font-semibold text-stone-900">{b.venueName}</span>
                  </div>
                  <div className="text-stone-500">
                    Host: {b.customerName} · Event Date: {b.eventDateBS} BS ({b.shift})
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Method: {b.paymentDetails?.paymentMethod || 'PENDING'} · Txn: {b.paymentDetails?.transactionId || 'N/A'}
                  </div>
                </div>

                <div className="text-right tabular-nums space-y-0.5">
                  <div>Collected: <strong className="text-stone-900">NPR {b.depositPaidNpr.toLocaleString()}</strong></div>
                  <div className="text-[11px] text-emerald-800">Platform 5% Fee: NPR {b.commissionAmountNpr.toLocaleString()}</div>
                  <div className="text-[11px] text-stone-500">
                    Net Venue Payable: <strong>NPR {Math.max(0, b.depositPaidNpr - b.commissionAmountNpr).toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {adminTab === 'AUDIT_LOGS' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-3 text-xs font-mono">
          <h3 className="text-base font-bold text-stone-900 font-sans mb-3">
            System Security & Financial Transaction Audit Log
          </h3>
          <div className="space-y-2 text-stone-600 bg-stone-50 p-4 rounded-2xl border border-stone-200">
            <div>[2024-11-04 00:20:12] AUDIT_PAYMENT_CONFIRMED: Txn ESW-2081-98214902 validated server-side. Deposit NPR 303,969 credited.</div>
            <div>[2024-11-04 00:15:40] AUDIT_CONTRACT_SIGNED: Booking UTS-2081-4921 signed with SHA256 cryptographic hash.</div>
            <div>[2024-11-03 16:40:00] AUDIT_OFFER_ACCEPTED: Negotiation neg-102 mutually finalized between party palace and client.</div>
            <div>[2024-11-02 14:30:00] AUDIT_KYC_VERIFIED: The Regal Pavilion PAN 602918471 verified against Inland Revenue Department records.</div>
          </div>
        </div>
      )}

    </div>
  );
};
