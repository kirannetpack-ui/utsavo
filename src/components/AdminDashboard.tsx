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
  Tag,
  Clock,
  Sparkles,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { language } = useLanguage();
  const {
    venues,
    bookings,
    negotiations,
    verifyVenueStatus,
    customCategories,
    reviewCustomCategory,
    culturalVendors,
  } = useMarketplace();

  const [adminTab, setAdminTab] = useState<'OVERVIEW' | 'VERIFICATION' | 'CATEGORIES' | 'SETTLEMENTS' | 'AUDIT_LOGS'>('OVERVIEW');
  const [categoryFilterStatus, setCategoryFilterStatus] = useState<'ALL' | 'PENDING' | 'PERMANENT' | 'TEMPORARY'>('ALL');

  const pendingProposalsCount = customCategories.filter(c => c.status === 'PENDING').length;

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
            onClick={() => setAdminTab('CATEGORIES')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              adminTab === 'CATEGORIES' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>Artist Categories</span>
            {pendingProposalsCount > 0 ? (
              <span className="px-1.5 py-0.5 text-[10px] bg-amber-600 text-white font-bold rounded-full animate-pulse">
                {pendingProposalsCount}
              </span>
            ) : (
              <span className="px-1.5 py-0.2 text-[10px] bg-stone-200 text-stone-700 font-bold rounded-full">
                {customCategories.length}
              </span>
            )}
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

      {/* TAB: ARTIST & VENDOR CATEGORIES MODERATION */}
      {adminTab === 'CATEGORIES' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                    Dynamic Category Governance
                  </span>
                  {pendingProposalsCount > 0 && (
                    <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-100 text-amber-900 rounded-full border border-amber-300">
                      {pendingProposalsCount} Action Required
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-stone-900 mt-1">
                  Artist & Vendor Categories & Proposals (विधा व्यवस्थापन)
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  When performers register under "OTHER", their proposed celebration category arrives here. As Admin, approve them as <strong>Permanently Visible</strong> (available platform-wide forever) or <strong>Temporary</strong> (seasonal festival run), or decline them.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs">
                {(['ALL', 'PENDING', 'PERMANENT', 'TEMPORARY'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setCategoryFilterStatus(status)}
                    className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                      categoryFilterStatus === status
                        ? 'bg-white text-stone-900 shadow-sm font-bold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {status === 'ALL' && `All (${customCategories.length})`}
                    {status === 'PENDING' && `Pending (${pendingProposalsCount})`}
                    {status === 'PERMANENT' && `Permanent (${customCategories.filter(c => c.status === 'PERMANENT').length})`}
                    {status === 'TEMPORARY' && `Temporary (${customCategories.filter(c => c.status === 'TEMPORARY').length})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Proposals List */}
            <div className="space-y-3">
              {customCategories
                .filter((cat) => {
                  if (categoryFilterStatus === 'ALL') return true;
                  return cat.status === categoryFilterStatus;
                })
                .map((cat) => {
                  return (
                    <div
                      key={cat.id}
                      className="p-5 rounded-2xl border border-stone-200 bg-stone-50/60 hover:bg-white transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-11 h-11 rounded-xl bg-amber-100/70 border border-amber-200 flex items-center justify-center text-xl shrink-0">
                            {cat.icon || '✨'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-stone-900 text-base">{cat.name}</h4>
                              {cat.nepaliName && (
                                <span className="text-xs text-stone-500 font-medium">({cat.nepaliName})</span>
                              )}
                              <span
                                className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                                  cat.status === 'PERMANENT'
                                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                    : cat.status === 'TEMPORARY'
                                    ? 'bg-blue-100 text-blue-900 border-blue-300'
                                    : cat.status === 'PENDING'
                                    ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                                    : 'bg-stone-200 text-stone-700 border-stone-300'
                                }`}
                              >
                                {cat.status === 'PERMANENT' && '✓ Permanently Visible (स्थायी)'}
                                {cat.status === 'TEMPORARY' && '⏱ Temporary Seasonal (अस्थायी)'}
                                {cat.status === 'PENDING' && '● Pending Admin Decision'}
                                {cat.status === 'REJECTED' && '✕ Declined'}
                              </span>
                            </div>

                            <p className="text-xs text-stone-600 mt-1 max-w-3xl leading-relaxed">
                              {cat.description || 'No description provided by the applicant.'}
                            </p>

                            <div className="flex items-center gap-4 text-[11px] text-stone-400 mt-2">
                              <span>Proposed by: <strong className="text-stone-700">{cat.proposedByVendorName || cat.proposedByVendorId || 'Registered Artist'}</strong></span>
                              <span>·</span>
                              <span>Category ID: <code className="text-stone-600 font-mono">{cat.categoryKey}</code></span>
                              <span>·</span>
                              <span>Date: {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString() : 'Recent'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Admin Action Decision Buttons */}
                        <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                          <button
                            onClick={() => reviewCustomCategory(cat.id, 'PERMANENT')}
                            title="Make permanently visible across public search tabs and registration dropdowns"
                            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                              cat.status === 'PERMANENT'
                                ? 'bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-600/30'
                                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{cat.status === 'PERMANENT' ? 'Permanently Visible' : 'Make Permanently Visible'}</span>
                          </button>

                          <button
                            onClick={() => reviewCustomCategory(cat.id, 'TEMPORARY')}
                            title="Approve as temporary/seasonal for current event cycles"
                            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                              cat.status === 'TEMPORARY'
                                ? 'bg-blue-800 text-white shadow-sm ring-2 ring-blue-600/30'
                                : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>{cat.status === 'TEMPORARY' ? 'Approved as Temporary' : 'Approve as Temporary'}</span>
                          </button>

                          {cat.status !== 'REJECTED' && (
                            <button
                              onClick={() => reviewCustomCategory(cat.id, 'REJECTED')}
                              title="Reject proposed category"
                              className="px-2.5 py-1.5 text-xs font-medium text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

              {customCategories.length === 0 && (
                <div className="p-8 text-center text-xs text-stone-500 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                  No custom categories proposed yet. Artists who select "OTHER" during registration will appear here.
                </div>
              )}
            </div>
          </div>

          {/* Standard Guild Categories Reference */}
          <div className="bg-stone-50 rounded-3xl border border-stone-200 p-6 space-y-3">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-800" />
              <span>Core Platform Guild Standards (Pre-Configured)</span>
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              These 10 canonical celebration categories represent Nepal's cultural heritage pillars and cannot be deleted. Any custom category approved above as <strong>Permanently Visible</strong> or <strong>Temporary</strong> will dynamically blend alongside these in both public user filters and talent registration:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-2 text-xs">
              {[
                { name: 'Panche Baaja Ensemble', ne: 'पञ्चे बाजा' },
                { name: 'Dhime & Bansuri Guild', ne: 'धिमे तथा बाँसुरी' },
                { name: 'Vedic Acharya & Pundit', ne: 'वैदिक पण्डित' },
                { name: 'Bridal Mehndi & Makeup', ne: 'मेहेन्दी तथा शृङ्गार' },
                { name: 'Newari Paubha & Mandap', ne: 'मण्डप सज्जा' },
                { name: 'Deuda & Folk Troupe', ne: 'देउडा तथा लोक' },
                { name: 'Ghatu & Gurung Folk', ne: 'घाटु नृत्य' },
                { name: 'Traditional Sarangi', ne: 'सारङ्गी' },
                { name: 'Mithila Vivah Mandap', ne: 'मिथिला मण्डप' },
                { name: 'Modern Brass & DJ', ne: 'ब्रास ब्यान्ड / डीजे' },
              ].map((std) => (
                <div key={std.name} className="p-2.5 bg-white rounded-xl border border-stone-200">
                  <div className="font-semibold text-stone-900 text-[11px] truncate">{std.name}</div>
                  <div className="text-[10px] text-amber-900 font-medium">{std.ne}</div>
                  <div className="text-[9px] text-stone-400 mt-1 uppercase font-mono">Standard Core</div>
                </div>
              ))}
            </div>
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
