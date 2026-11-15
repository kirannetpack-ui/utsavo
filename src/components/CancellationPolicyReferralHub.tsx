/**
 * UTSAVO — Global Cancellation Governance, Past-Deadline Resolution & Partner Referral Hub
 * Dynamic per-vendor policies, 5-stakeholder rules, Event Date & Time Over resolution,
 * and Cancelling Vendor Peer Referral & Escrow Handoff workflows.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  CancellationPolicyPreset,
  CancellationStakeholderRole,
  DynamicCancellationPolicy,
  RecommendedReferralPartner,
  ReferralFeeModel,
} from '../types';
import {
  GLOBAL_STAKEHOLDER_POLICY_FRAMEWORKS,
  GLOBAL_REFERRAL_STANDARDS,
  createDynamicPolicyFromPreset,
  calculateCancellationOutcome,
} from '../data/cancellationPoliciesData';
import {
  Scale,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowRightLeft,
  Sliders,
  Calculator,
  CheckCircle2,
  XCircle,
  Users,
  Building2,
  Music,
  Award,
  Briefcase,
  User,
  FileCheck,
  Send,
  Phone,
  Star,
} from 'lucide-react';

interface CancellationPolicyReferralHubProps {
  onBackToExplore?: () => void;
  initialTab?: 'STANDARDS' | 'SIMULATOR' | 'VENDOR_CONFIG' | 'REFERRALS';
}

export const CancellationPolicyReferralHub: React.FC<CancellationPolicyReferralHubProps> = ({
  onBackToExplore,
  initialTab = 'STANDARDS',
}) => {
  const {
    venues,
    culturalVendors,
    organizers,
    bookings,
    getVendorCancellationPolicy,
    updateVendorCancellationPolicy,
    referralOffers,
    createVendorReferralOffer,
    respondToReferralOffer,
    cancellationRecords,
    statutoryRules,
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'STANDARDS' | 'SIMULATOR' | 'VENDOR_CONFIG' | 'REFERRALS'>(initialTab);
  const [selectedRole, setSelectedRole] = useState<CancellationStakeholderRole>('CLIENT');
  const [actionToast, setActionToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 5000);
  };

  // All configurable partners across Venues, Cultural Artists, and Event Planners
  const allConfigurablePartners = useMemo(() => {
    return [
      ...venues.map((v) => ({
        id: v.id,
        name: v.name,
        category: 'VENUE_VENDOR' as const,
        subtitle: `${v.locality}, ${v.district} · Venue Partner`,
      })),
      ...culturalVendors.slice(0, 6).map((c) => ({
        id: c.id,
        name: c.name,
        category: 'CULTURAL_ARTIST' as const,
        subtitle: `${c.district} · Cultural Artist`,
      })),
      ...organizers.map((o) => ({
        id: o.id,
        name: o.companyName,
        category: 'EVENT_PLANNER' as const,
        subtitle: `${o.district} · Event Planner`,
      })),
    ];
  }, [venues, culturalVendors, organizers]);

  // -------------------------------------------------------------
  // TAB 2: LIVE SIMULATOR STATE
  // -------------------------------------------------------------
  const [simPartnerId, setSimPartnerId] = useState<string>(venues[0]?.id || 'venue-regal-pavilion-ktm');
  const [simInitiatedBy, setSimInitiatedBy] = useState<CancellationStakeholderRole>('CLIENT');
  const [simDaysBefore, setSimDaysBefore] = useState<number>(22);
  const [simHoursSinceBooking, setSimHoursSinceBooking] = useState<number>(72);
  const [simIsPastDeadline, setSimIsPastDeadline] = useState<boolean>(false);
  const [simIsForceMajeure, setSimIsForceMajeure] = useState<boolean>(false);
  const [simMedicalProof, setSimMedicalProof] = useState<boolean>(false);
  const [simTotalAmount, setSimTotalAmount] = useState<number>(850000);
  const [simDepositPaid, setSimDepositPaid] = useState<number>(212500);
  const [simPoolStaffCount, setSimPoolStaffCount] = useState<number>(8);

  const simPartnerMeta = useMemo(
    () => allConfigurablePartners.find((p) => p.id === simPartnerId) || allConfigurablePartners[0],
    [allConfigurablePartners, simPartnerId]
  );

  const simPolicy = useMemo(
    () =>
      getVendorCancellationPolicy(
        simPartnerMeta?.id || 'venue-regal-pavilion-ktm',
        simPartnerMeta?.name,
        simPartnerMeta?.category
      ),
    [getVendorCancellationPolicy, simPartnerMeta]
  );

  const simResult = useMemo(
    () =>
      calculateCancellationOutcome({
        policy: simPolicy,
        initiatedBy: simInitiatedBy,
        daysBeforeEvent: simIsPastDeadline ? 0 : simDaysBefore,
        hoursSinceBooking: simHoursSinceBooking,
        isPastDeadline: simIsPastDeadline,
        isForceMajeure: simIsForceMajeure,
        hasEmergencyMedicalProof: simMedicalProof,
        totalAmountNpr: simTotalAmount,
        depositPaidNpr: simDepositPaid,
        bookedPoolStaffCount: simPoolStaffCount,
        staffShiftWageNpr: statutoryRules.minDailyShiftWageNpr,
      }),
    [
      simPolicy,
      simInitiatedBy,
      simDaysBefore,
      simHoursSinceBooking,
      simIsPastDeadline,
      simIsForceMajeure,
      simMedicalProof,
      simTotalAmount,
      simDepositPaid,
      simPoolStaffCount,
      statutoryRules.minDailyShiftWageNpr,
    ]
  );

  // -------------------------------------------------------------
  // TAB 3: DYNAMIC VENDOR POLICY EDITOR STATE
  // -------------------------------------------------------------
  const [editPartnerId, setEditPartnerId] = useState<string>(venues[0]?.id || 'venue-regal-pavilion-ktm');
  const editPartnerMeta = useMemo(
    () => allConfigurablePartners.find((p) => p.id === editPartnerId) || allConfigurablePartners[0],
    [allConfigurablePartners, editPartnerId]
  );
  const [draftPolicy, setDraftPolicy] = useState<DynamicCancellationPolicy>(() =>
    getVendorCancellationPolicy(editPartnerId, editPartnerMeta?.name, editPartnerMeta?.category)
  );

  useEffect(() => {
    setDraftPolicy(
      getVendorCancellationPolicy(editPartnerId, editPartnerMeta?.name, editPartnerMeta?.category)
    );
  }, [editPartnerId, editPartnerMeta, getVendorCancellationPolicy]);

  const handleApplyPresetToDraft = (preset: Exclude<CancellationPolicyPreset, 'CUSTOM'>) => {
    const regenerated = createDynamicPolicyFromPreset({
      vendorId: editPartnerId,
      vendorName: editPartnerMeta?.name || draftPolicy.vendorName,
      stakeholderCategory: editPartnerMeta?.category || draftPolicy.stakeholderCategory,
      preset,
      referralFeeModel: draftPolicy.referralConfig.referralFeeModel,
    });
    setDraftPolicy(regenerated);
  };

  const handleSaveVendorPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    updateVendorCancellationPolicy(draftPolicy);
    showToast(`Dynamic cancellation & referral policy saved live for ${draftPolicy.vendorName}.`);
  };

  // -------------------------------------------------------------
  // TAB 4: PARTNER REFERRAL WORKFLOW STATE
  // -------------------------------------------------------------
  const eligibleBookingsForReferral = bookings.filter((b) => b.status !== 'CANCELLED');
  const [refBookingId, setRefBookingId] = useState<string>(eligibleBookingsForReferral[0]?.id || bookings[0]?.id || '');
  const [refHandoffType, setRefHandoffType] = useState<'WARM_REFERRAL' | 'DIRECT_SUBSTITUTE_GUARANTEE'>('WARM_REFERRAL');
  const [refFeeModel, setRefFeeModel] = useState<ReferralFeeModel>('B2B_COMMISSION_5_PERCENT');
  const [refReason, setRefReason] = useState<string>(
    'Scheduled hall structural maintenance / unforeseen capacity conflict; referring vetted sister venues with matched dates & menus.'
  );
  const [refIncludeWaiver, setRefIncludeWaiver] = useState<boolean>(true);
  const [selectedPeerIds, setSelectedPeerIds] = useState<string[]>([]);
  const [selectedChoiceByOffer, setSelectedChoiceByOffer] = useState<Record<string, string>>({});

  const targetBooking = useMemo(
    () => bookings.find((b) => b.id === refBookingId) || bookings[0],
    [bookings, refBookingId]
  );

  const peerCandidateVenues = useMemo(() => {
    if (!targetBooking) return venues;
    return venues.filter((v) => v.id !== targetBooking.venueId);
  }, [venues, targetBooking]);

  const togglePeerSelection = (partnerId: string) => {
    setSelectedPeerIds((prev) => {
      if (prev.includes(partnerId)) return prev.filter((id) => id !== partnerId);
      if (prev.length >= 3) return prev;
      return [...prev, partnerId];
    });
  };

  const handleDispatchReferralOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBooking || selectedPeerIds.length === 0) return;

    const recommendedPartners: RecommendedReferralPartner[] = selectedPeerIds
      .map((pid) => venues.find((v) => v.id === pid))
      .filter((v): v is NonNullable<typeof v> => Boolean(v))
      .map((v) => {
        const estimatedPrice = Math.round(
          v.cateringStartingNpr * targetBooking.guestCount + v.baseRentalStartingNpr
        );
        const diff = estimatedPrice - targetBooking.totalAmountNpr;
        const priceDeltaNote =
          refHandoffType === 'DIRECT_SUBSTITUTE_GUARANTEE'
            ? 'Direct Substitute Guarantee · 100% Price-Matched to Original Contract'
            : diff <= 0
            ? `NPR ${Math.abs(diff).toLocaleString()} lower than original contract (credited)`
            : `Estimated +NPR ${diff.toLocaleString()} difference (upgraded capacity)`;

        return {
          partnerId: v.id,
          partnerName: v.name,
          partnerType: 'VENUE_VENDOR',
          district: v.district,
          categoryOrCapacity: `${v.minGuests}–${v.maxGuests} guests · ${v.halls[0]?.name || 'Grand Hall'}`,
          estimatedPriceNpr: estimatedPrice,
          priceDeltaNote,
          phone: v.phone,
          rating: v.rating,
        };
      });

    createVendorReferralOffer({
      bookingId: targetBooking.id,
      cancellingVendorId: targetBooking.venueId,
      cancellingVendorName: targetBooking.venueName,
      stakeholderRole: 'VENUE_VENDOR',
      handoffType: refHandoffType,
      recommendedPartners,
      referralFeeModel: refFeeModel,
      reason: refReason.trim() || 'Partner initiated cancellation with vetted peer hand-off.',
      includeLiabilityRelease: refIncludeWaiver,
    });

    setSelectedPeerIds([]);
    showToast(
      `Dispatched ${recommendedPartners.length} vetted peer referral(s) to ${targetBooking.customerName} for booking #${targetBooking.bookingRef}.`
    );
  };

  const roleMeta: Record<CancellationStakeholderRole, { label: string; icon: any }> = {
    CLIENT: { label: 'Clients / Hosts', icon: User },
    VENUE_VENDOR: { label: 'Venues & Vendors', icon: Building2 },
    CULTURAL_ARTIST: { label: 'Cultural Artists', icon: Music },
    EVENT_PLANNER: { label: 'Event Planners', icon: Award },
    EVENT_STAFF_POOL: { label: 'Staff Talent Pool', icon: Briefcase },
  };

  const activeFramework =
    GLOBAL_STAKEHOLDER_POLICY_FRAMEWORKS.find((f) => f.role === selectedRole) ||
    GLOBAL_STAKEHOLDER_POLICY_FRAMEWORKS[0];

  return (
    <div className="space-y-6 pb-16">
      {/* Feedback Toast */}
      {actionToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{actionToast}</span>
          </div>
          <button
            onClick={() => setActionToast(null)}
            className="text-stone-500 hover:text-stone-900 font-bold px-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Clean Editorial SaaS Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 uppercase tracking-wider">
              <Scale className="w-4 h-4 text-amber-800" />
              <span>Global Event Governance · Muluki Civil Code 2074 & Consumer Protection Act 2075</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Cancellation Policy Engine, Past-Deadline Protocol & Partner Referrals
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Standardized multi-stakeholder rules across Clients, Party Palaces, Cultural Artists, Event Planners, and Employment Pool Staff — with per-vendor dynamic terms, post-deadline resolution, and cancelling vendor peer referral transfers.
            </p>
          </div>

          {onBackToExplore && (
            <button
              onClick={onBackToExplore}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 self-start"
            >
              ← Back to Venues
            </button>
          )}
        </div>

        {/* Workspace Tab Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('STANDARDS')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'STANDARDS' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-amber-800" />
            <span>5-Role Standards & Deadline Rules</span>
          </button>

          <button
            onClick={() => setActiveTab('SIMULATOR')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'SIMULATOR' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-amber-800" />
            <span>Settlement & Past-Deadline Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('VENDOR_CONFIG')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'VENDOR_CONFIG' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-amber-800" />
            <span>Dynamic Vendor Policy Editor</span>
          </button>

          <button
            onClick={() => setActiveTab('REFERRALS')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'REFERRALS' ? 'bg-amber-900 text-white shadow-2xs font-bold' : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Partner Referral & Substitution ({referralOffers.filter((r) => r.clientDecision === 'PENDING').length} Pending)</span>
          </button>
        </div>
      </div>

      {/* ================================================================= */}
      {/* TAB 1: 5-STAKEHOLDER GLOBAL STANDARDS & DATE/TIME OVER PROCESS     */}
      {/* ================================================================= */}
      {activeTab === 'STANDARDS' && (
        <div className="space-y-6">
          {/* 5 Stakeholder Role Switcher */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {GLOBAL_STAKEHOLDER_POLICY_FRAMEWORKS.map((fw) => {
              const Icon = roleMeta[fw.role].icon;
              const isActive = selectedRole === fw.role;
              return (
                <button
                  key={fw.role}
                  onClick={() => setSelectedRole(fw.role)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isActive
                      ? 'bg-amber-900 text-white border-amber-900'
                      : 'bg-white text-stone-800 border-stone-200 hover:border-amber-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-amber-800'}`} />
                    <span className="text-xs font-bold">{roleMeta[fw.role].label}</span>
                  </div>
                  <div className={`text-[11px] truncate ${isActive ? 'text-amber-100' : 'text-stone-500'}`}>
                    {fw.nepaliTitle}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Stakeholder Policy Breakdown */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6">
            <div className="border-b border-stone-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-xl font-bold text-stone-900">{activeFramework.title}</h2>
                <p className="text-xs text-amber-900 font-medium mt-0.5">{activeFramework.nepaliTitle}</p>
              </div>
              <span className="text-[11px] text-stone-500 font-mono">{activeFramework.legalAndGlobalBasis}</span>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed">
              <strong className="text-stone-900 block mb-1 uppercase text-[11px] tracking-wider">
                Retainer & Notice Standard
              </strong>
              {activeFramework.retainerAndNoticeStandard}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tiered Notice Windows */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-800" />
                  <span>Early, Mid-Term & Late Cancellation Schedule</span>
                </h3>
                <ul className="space-y-2.5 text-xs text-stone-700">
                  {activeFramework.earlyMidLateSummary.map((item, idx) => (
                    <li key={idx} className="p-3 rounded-xl border border-stone-200 bg-white leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Event Date & Time Over (Past Deadline / No-Show) Protocol */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-700" />
                  <span>If Event Date & Time Is Over (Past-Deadline / No-Show Protocol)</span>
                </h3>
                <ul className="space-y-2.5 text-xs text-stone-700">
                  {activeFramework.pastDeadlineProcess.map((step, idx) => (
                    <li
                      key={idx}
                      className="p-3 rounded-xl border border-rose-200 bg-rose-50/40 leading-relaxed"
                    >
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Partner Referral & Backfill Summary */}
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <strong className="uppercase text-[11px] tracking-wider block">
                  Peer Referral, Substitution & Mitigation Option
                </strong>
                <p className="text-stone-700 leading-relaxed">{activeFramework.partnerReferralAndBackfill}</p>
              </div>
              <button
                onClick={() => setActiveTab('REFERRALS')}
                className="px-4 py-2 bg-amber-900 hover:bg-amber-950 text-white rounded-xl font-semibold text-xs whitespace-nowrap shrink-0"
              >
                Open Referral Workflow →
              </button>
            </div>
          </div>

          {/* Global Standard Options for Cancelling Vendors Referring Other Partners */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="font-display text-lg font-bold text-stone-900">
                Global Industry Standards: Cancelling Vendor Partner Referral & Client Choice
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                How international event marketplaces protect hosts when a booked venue, artist, or planner cancels and recommends alternate partners.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {GLOBAL_REFERRAL_STANDARDS.map((opt) => (
                <div key={opt.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2.5">
                  <div>
                    <h4 className="font-bold text-sm text-stone-900">{opt.title}</h4>
                    <p className="text-[11px] text-amber-900 font-medium mt-0.5">{opt.subtitle}</p>
                  </div>
                  <ul className="space-y-1.5 text-xs text-stone-600 list-disc pl-4">
                    {opt.points.map((pt, i) => (
                      <li key={i} className="leading-relaxed">
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* TAB 2: LIVE DYNAMIC & PAST-DEADLINE SIMULATOR                     */}
      {/* ================================================================= */}
      {activeTab === 'SIMULATOR' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Simulator Controls */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-5 space-y-4 text-xs">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="font-bold text-sm text-stone-900">Configure Scenario & Timing</h3>
              <p className="text-stone-500 text-[11px]">
                Test live calculations against each partner&apos;s dynamic policy, notice window, or post-deadline cutoff.
              </p>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Select Vendor / Partner Policy</label>
              <select
                value={simPartnerId}
                onChange={(e) => setSimPartnerId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 font-medium text-stone-900"
              >
                {allConfigurablePartners.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.subtitle})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Cancelling Stakeholder Role</label>
              <select
                value={simInitiatedBy}
                onChange={(e) => setSimInitiatedBy(e.target.value as CancellationStakeholderRole)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 font-medium text-stone-900"
              >
                <option value="CLIENT">Client / Event Host</option>
                <option value="VENUE_VENDOR">Venue / Banquet Vendor</option>
                <option value="CULTURAL_ARTIST">Cultural Artist / Baja / Purohit</option>
                <option value="EVENT_PLANNER">Event Management & Planner</option>
                <option value="EVENT_STAFF_POOL">Employment Pool Worker</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Total Contract (NPR)</label>
                <input
                  type="number"
                  value={simTotalAmount}
                  onChange={(e) => setSimTotalAmount(Number(e.target.value) || 0)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 font-mono font-bold"
                />
              </div>
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Deposit Paid (NPR)</label>
                <input
                  type="number"
                  value={simDepositPaid}
                  onChange={(e) => setSimDepositPaid(Number(e.target.value) || 0)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Days Before Event ({simIsPastDeadline ? 0 : simDaysBefore}d)
                </label>
                <input
                  type="range"
                  min={0}
                  max={120}
                  disabled={simIsPastDeadline}
                  value={simDaysBefore}
                  onChange={(e) => setSimDaysBefore(Number(e.target.value))}
                  className="w-full accent-amber-900"
                />
              </div>
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Booked Pool Staff (Workers)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={simPoolStaffCount}
                  onChange={(e) => setSimPoolStaffCount(Number(e.target.value) || 0)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Hours Elapsed Since Initial Booking</label>
              <input
                type="number"
                min={1}
                value={simHoursSinceBooking}
                onChange={(e) => setSimHoursSinceBooking(Number(e.target.value) || 1)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 font-mono"
              />
            </div>

            {/* Edge-Case Cutoffs */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-lg border border-rose-200 bg-rose-50/50 text-rose-950 font-semibold">
                <input
                  type="checkbox"
                  checked={simIsPastDeadline}
                  onChange={(e) => setSimIsPastDeadline(e.target.checked)}
                  className="rounded text-rose-700"
                />
                <span>Event Date & Time Is Over (Past Deadline / No-Show)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-lg border border-stone-200 bg-stone-50 font-medium text-stone-800">
                <input
                  type="checkbox"
                  checked={simIsForceMajeure}
                  onChange={(e) => setSimIsForceMajeure(e.target.checked)}
                  className="rounded text-amber-900"
                />
                <span>Force Majeure (Govt Strike / Bandh / Disaster — Sec. 531)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-lg border border-stone-200 bg-stone-50 font-medium text-stone-800">
                <input
                  type="checkbox"
                  checked={simMedicalProof}
                  onChange={(e) => setSimMedicalProof(e.target.checked)}
                  className="rounded text-amber-900"
                />
                <span>Verified 48h Hospital / Emergency Medical Proof</span>
              </label>
            </div>
          </div>

          {/* Calculated Resolution Output */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 space-y-5">
            <div className="border-b border-stone-100 pb-4 flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                  {simPolicy.preset.replace(/_/g, ' ')} Policy · {simPolicy.vendorName}
                </div>
                <h3 className="font-display text-lg font-bold text-stone-900 mt-1">
                  {simResult.applicableRuleTitle}
                </h3>
              </div>
              {simResult.referralAvailable && (
                <button
                  onClick={() => setActiveTab('REFERRALS')}
                  className="px-3 py-1.5 bg-amber-900 text-white rounded-lg text-xs font-semibold whitespace-nowrap shrink-0"
                >
                  Open Peer Referral Flow →
                </button>
              )}
            </div>

            {/* Numeric Financial Output Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50">
                <span className="text-[11px] text-stone-500 block">Cash Refund to Client</span>
                <strong className="text-lg font-display font-bold text-emerald-800 tabular-nums">
                  NPR {simResult.refundToClientNpr.toLocaleString()}
                </strong>
              </div>

              <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50">
                <span className="text-[11px] text-stone-500 block">Future Muhurat Credit</span>
                <strong className="text-lg font-display font-bold text-amber-900 tabular-nums">
                  NPR {simResult.rescheduleCreditNpr.toLocaleString()}
                </strong>
              </div>

              <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50">
                <span className="text-[11px] text-stone-500 block">Retained by Partner</span>
                <strong className="text-lg font-display font-bold text-stone-900 tabular-nums">
                  NPR {simResult.retainedByVendorNpr.toLocaleString()}
                </strong>
              </div>

              <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50">
                <span className="text-[11px] text-stone-500 block">Remaining Balance Invoiced</span>
                <strong className="text-base font-display font-bold text-rose-800 tabular-nums">
                  NPR {simResult.remainingBalanceDueNpr.toLocaleString()}
                </strong>
              </div>

              <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50">
                <span className="text-[11px] text-stone-500 block">Pool Staff Reporting Pay</span>
                <strong className="text-base font-display font-bold text-stone-900 tabular-nums">
                  NPR {simResult.staffReportingPayTotalNpr.toLocaleString()}
                </strong>
              </div>

              <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50">
                <span className="text-[11px] text-stone-500 block">SLA Backfill Penalty Credit</span>
                <strong className="text-base font-display font-bold text-amber-900 tabular-nums">
                  NPR {simResult.vendorReplacementCreditNpr.toLocaleString()}
                </strong>
              </div>
            </div>

            {/* Process Checklist */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Step-by-Step Resolution Workflow
              </h4>
              <ol className="space-y-2 text-xs text-stone-700">
                {simResult.processSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 p-3 rounded-xl border border-stone-200 bg-white">
                    <span className="w-5 h-5 rounded-full bg-amber-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
              <strong className="text-stone-900">Legal & Policy Basis: </strong>
              {simResult.legalBasis}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* TAB 3: DYNAMIC VENDOR POLICY EDITOR                               */}
      {/* ================================================================= */}
      {activeTab === 'VENDOR_CONFIG' && (
        <form onSubmit={handleSaveVendorPolicy} className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6 text-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h3 className="font-display text-lg font-bold text-stone-900">
                Dynamic Per-Vendor & Partner Policy Configuration
              </h3>
              <p className="text-stone-500 mt-0.5">
                Every party palace, cultural ensemble, and event planner customizes their own cancellation schedule, past-deadline forfeiture rules, and peer referral preferences.
              </p>
            </div>

            <div className="w-full md:w-80">
              <select
                value={editPartnerId}
                onChange={(e) => setEditPartnerId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-semibold text-stone-900"
              >
                {allConfigurablePartners.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Preset Selector */}
          <div className="space-y-2">
            <label className="font-bold text-stone-700 uppercase tracking-wider text-[11px] block">
              Quick Dynamic Policy Template ({draftPolicy.preset})
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(
                [
                  {
                    key: 'FLEXIBLE',
                    title: 'Flexible Policy',
                    desc: '48h cooling-off · 95% refund 30+ days out · 25% goodwill medical cap.',
                  },
                  {
                    key: 'MODERATE_STANDARD',
                    title: 'Moderate Standard (Recommended)',
                    desc: '24h cooling-off · 85% refund 60+ days out · 50% at 30–59 days.',
                  },
                  {
                    key: 'STRICT_PEAK_MUHURAT',
                    title: 'Strict Peak Subha Muhurat',
                    desc: 'High-demand wedding dates · 25% Muhurat retainer · remaining balance due on no-show.',
                  },
                ] as const
              ).map((p) => (
                <button
                  type="button"
                  key={p.key}
                  onClick={() => handleApplyPresetToDraft(p.key)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    draftPolicy.preset === p.key
                      ? 'border-amber-900 bg-amber-50/70 text-amber-950'
                      : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <div className="font-bold text-xs">{p.title}</div>
                  <div className="text-[11px] text-stone-500 mt-1 leading-relaxed">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Tier Refund Matrix */}
          <div className="space-y-2.5">
            <span className="font-bold text-stone-700 uppercase tracking-wider text-[11px] block">
              Editable Notice Window Schedule (Dynamically Synced to Booking Modals & Contracts)
            </span>
            <div className="overflow-x-auto border border-stone-200 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200">
                  <tr>
                    <th className="p-3">Notice Window</th>
                    <th className="p-3">Cash Refund (%)</th>
                    <th className="p-3">Muhurat Credit (%)</th>
                    <th className="p-3">Retained (%)</th>
                    <th className="p-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 tabular-nums">
                  {draftPolicy.tiers.map((tier, idx) => (
                    <tr key={tier.id}>
                      <td className="p-3 font-semibold text-stone-900">{tier.label}</td>
                      <td className="p-3">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={tier.refundPercent}
                          onChange={(e) => {
                            const val = Math.min(100, Math.max(0, Number(e.target.value) || 0));
                            const updatedTiers = [...draftPolicy.tiers];
                            updatedTiers[idx] = {
                              ...tier,
                              refundPercent: val,
                              retainedFeePercent: 100 - val,
                            };
                            setDraftPolicy({ ...draftPolicy, preset: 'CUSTOM', tiers: updatedTiers });
                          }}
                          className="w-20 border border-stone-300 rounded-lg px-2 py-1 font-mono font-bold"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={tier.rescheduleCreditPercent}
                          onChange={(e) => {
                            const val = Math.min(100, Math.max(0, Number(e.target.value) || 0));
                            const updatedTiers = [...draftPolicy.tiers];
                            updatedTiers[idx] = { ...tier, rescheduleCreditPercent: val };
                            setDraftPolicy({ ...draftPolicy, preset: 'CUSTOM', tiers: updatedTiers });
                          }}
                          className="w-20 border border-stone-300 rounded-lg px-2 py-1 font-mono font-bold"
                        />
                      </td>
                      <td className="p-3 font-mono text-stone-600">{tier.retainedFeePercent}%</td>
                      <td className="p-3 text-stone-500">{tier.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Past Deadline & Referral Handoff Rules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-3">
              <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px] block">
                Date & Time Over (Past-Deadline) Controls
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-600 block mb-1 font-medium">Cooling-Off Grace (hrs)</label>
                  <input
                    type="number"
                    min={0}
                    max={72}
                    value={draftPolicy.coolingOffHours}
                    onChange={(e) => setDraftPolicy({ ...draftPolicy, coolingOffHours: Number(e.target.value) || 0 })}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-stone-600 block mb-1 font-medium">Post-Deadline Forfeit (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={draftPolicy.pastDeadlineRule.forfeitPercentAfterDeadline}
                    onChange={(e) =>
                      setDraftPolicy({
                        ...draftPolicy,
                        pastDeadlineRule: {
                          ...draftPolicy.pastDeadlineRule,
                          forfeitPercentAfterDeadline: Number(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-stone-600 block mb-1 font-medium">48h Medical Goodwill Cap (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={draftPolicy.pastDeadlineRule.goodwillCreditCapPercent}
                    onChange={(e) =>
                      setDraftPolicy({
                        ...draftPolicy,
                        pastDeadlineRule: {
                          ...draftPolicy.pastDeadlineRule,
                          goodwillCreditCapPercent: Number(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-stone-600 block mb-1 font-medium">Staff &lt;48h Reporting Pay (%)</label>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={draftPolicy.pastDeadlineRule.staffReportingPayPercent}
                    onChange={(e) =>
                      setDraftPolicy({
                        ...draftPolicy,
                        pastDeadlineRule: {
                          ...draftPolicy.pastDeadlineRule,
                          staffReportingPayPercent: Number(e.target.value) || 50,
                        },
                      })
                    }
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 font-mono font-bold"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer text-stone-700 font-medium">
                <input
                  type="checkbox"
                  checked={draftPolicy.pastDeadlineRule.claimRemainingBalanceOnNoShow}
                  onChange={(e) =>
                    setDraftPolicy({
                      ...draftPolicy,
                      pastDeadlineRule: {
                        ...draftPolicy.pastDeadlineRule,
                        claimRemainingBalanceOnNoShow: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-amber-900"
                />
                <span>Claim remaining unpaid contract balance on post-deadline client no-show</span>
              </label>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-3">
              <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px] block">
                Cancelling Vendor Partner Referral Settings
              </span>

              <div>
                <label className="text-stone-600 block mb-1 font-medium">B2B Referral Commission Structure</label>
                <select
                  value={draftPolicy.referralConfig.referralFeeModel}
                  onChange={(e) =>
                    setDraftPolicy({
                      ...draftPolicy,
                      referralConfig: {
                        ...draftPolicy.referralConfig,
                        referralFeeModel: e.target.value as ReferralFeeModel,
                      },
                    })
                  }
                  className="w-full bg-white border border-stone-300 rounded-lg p-2 font-medium"
                >
                  <option value="COURTESY_ZERO_FEE">0% Emergency Courtesy Referral (Zero B2B Fee)</option>
                  <option value="B2B_COMMISSION_5_PERCENT">5% B2B Peer Referral Commission (Borne by Partner)</option>
                  <option value="B2B_COMMISSION_10_PERCENT">10% Turnkey Agency Referral Commission</option>
                </select>
              </div>

              <div className="space-y-2 pt-1 text-stone-700 font-medium">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draftPolicy.referralConfig.allowsPartnerReferral}
                    onChange={(e) =>
                      setDraftPolicy({
                        ...draftPolicy,
                        referralConfig: {
                          ...draftPolicy.referralConfig,
                          allowsPartnerReferral: e.target.checked,
                        },
                      })
                    }
                    className="rounded text-amber-900"
                  />
                  <span>Enable Warm Peer Partner Referrals on vendor cancellation</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draftPolicy.referralConfig.substitutionGuaranteeEnabled}
                    onChange={(e) =>
                      setDraftPolicy({
                        ...draftPolicy,
                        referralConfig: {
                          ...draftPolicy.referralConfig,
                          substitutionGuaranteeEnabled: e.target.checked,
                        },
                      })
                    }
                    className="rounded text-amber-900"
                  />
                  <span>Support Equal-or-Greater Substitute Guarantee</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draftPolicy.referralConfig.escrowDirectTransferAllowed}
                    onChange={(e) =>
                      setDraftPolicy({
                        ...draftPolicy,
                        referralConfig: {
                          ...draftPolicy.referralConfig,
                          escrowDirectTransferAllowed: e.target.checked,
                        },
                      })
                    }
                    className="rounded text-amber-900"
                  />
                  <span>Allow direct 100% client escrow transfer to referred partner</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-stone-100">
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-900 hover:bg-amber-950 text-white rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <FileCheck className="w-4 h-4" />
              <span>Save Dynamic Policy Live</span>
            </button>
          </div>
        </form>
      )}

      {/* ================================================================= */}
      {/* TAB 4: PARTNER REFERRAL & CLIENT HANDOFF NETWORK                  */}
      {/* ================================================================= */}
      {activeTab === 'REFERRALS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Vendor Initiates Partner Referral */}
          <form
            onSubmit={handleDispatchReferralOffer}
            className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-5 space-y-4 text-xs"
          >
            <div className="border-b border-stone-100 pb-3">
              <h3 className="font-bold text-sm text-stone-900">
                Cancelling Vendor: Refer Verified Partner(s)
              </h3>
              <p className="text-stone-500 text-[11px] mt-0.5">
                Recommend 1–3 alternate verified partners to protect the client&apos;s Subha Muhurat date and enable direct escrow transfer.
              </p>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Booking Affected</label>
              <select
                value={refBookingId}
                onChange={(e) => {
                  setRefBookingId(e.target.value);
                  setSelectedPeerIds([]);
                }}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 font-medium"
              >
                {bookings.map((b) => (
                  <option key={b.id} value={b.id}>
                    #{b.bookingRef} · {b.venueName} ({b.eventDateBS} · {b.customerName})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Handoff Mode</label>
                <select
                  value={refHandoffType}
                  onChange={(e) => setRefHandoffType(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 font-medium"
                >
                  <option value="WARM_REFERRAL">Warm Peer Referral (Client Contracts Partner)</option>
                  <option value="DIRECT_SUBSTITUTE_GUARANTEE">Direct Substitute Guarantee (Price-Matched)</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Referral Commission</label>
                <select
                  value={refFeeModel}
                  onChange={(e) => setRefFeeModel(e.target.value as ReferralFeeModel)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 font-medium"
                >
                  <option value="COURTESY_ZERO_FEE">0% Courtesy Hand-off</option>
                  <option value="B2B_COMMISSION_5_PERCENT">5% B2B Referral Fee</option>
                  <option value="B2B_COMMISSION_10_PERCENT">10% Agency Referral Fee</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">
                Select 1–3 Verified Peer Venues / Partners ({selectedPeerIds.length}/3 selected)
              </label>
              <div className="max-h-56 overflow-y-auto border border-stone-200 rounded-xl divide-y divide-stone-100">
                {peerCandidateVenues.map((v) => {
                  const checked = selectedPeerIds.includes(v.id);
                  return (
                    <label
                      key={v.id}
                      className={`p-2.5 flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                        checked ? 'bg-amber-50/70' : 'hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => togglePeerSelection(v.id)}
                          className="rounded text-amber-900"
                        />
                        <div className="truncate">
                          <div className="font-bold text-stone-900 truncate">{v.name}</div>
                          <div className="text-[11px] text-stone-500">
                            {v.district} · {v.minGuests}–{v.maxGuests} pax · Rs. {v.cateringStartingNpr.toLocaleString()}/plate
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-amber-900 shrink-0 tabular-nums">
                        {v.rating.toFixed(1)} ★
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Reason for Cancellation & Referral Note</label>
              <textarea
                rows={2}
                required
                value={refReason}
                onChange={(e) => setRefReason(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-stone-700 font-medium">
              <input
                type="checkbox"
                checked={refIncludeWaiver}
                onChange={(e) => setRefIncludeWaiver(e.target.checked)}
                className="rounded text-amber-900"
              />
              <span>Include standard Third-Party Referral Liability Release upon direct partner contracting</span>
            </label>

            <button
              type="submit"
              disabled={selectedPeerIds.length === 0}
              className="w-full py-2.5 bg-amber-900 hover:bg-amber-950 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Partner Referral Offer to Client</span>
            </button>
          </form>

          {/* Right Column: Client Decision & Escrow Transfer Inbox */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
              <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-stone-900">
                    Active & Resolved Partner Referral Handoffs ({referralOffers.length})
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Clients may accept a recommended partner and transfer 100% of held UTSAVO escrow directly, or decline for an immediate cash refund.
                  </p>
                </div>
              </div>

              {referralOffers.length === 0 ? (
                <div className="py-8 text-center text-xs text-stone-500">
                  No partner referral handoffs dispatched yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {referralOffers.map((offer) => {
                    const selectedPartnerId =
                      selectedChoiceByOffer[offer.id] || offer.recommendedPartners[0]?.partnerId;

                    return (
                      <div key={offer.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/40 space-y-3 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="font-mono font-bold text-stone-500">#{offer.bookingRef}</span>
                            <span className="mx-1.5 text-stone-300">·</span>
                            <strong className="text-stone-900">{offer.clientName}</strong>
                            <span className="mx-1.5 text-stone-300">·</span>
                            <span className="text-amber-900 font-semibold">{offer.eventDateBS}</span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                              offer.clientDecision === 'ACCEPTED_PARTNER'
                                ? 'bg-emerald-100 text-emerald-900'
                                : offer.clientDecision === 'DECLINED_REFUND_ONLY'
                                ? 'bg-stone-200 text-stone-800'
                                : 'bg-amber-100 text-amber-950'
                            }`}
                          >
                            {offer.clientDecision.replace(/_/g, ' ')}
                          </span>
                        </div>

                        <div className="text-stone-700 leading-relaxed">
                          <strong className="text-stone-900">Cancelling Partner:</strong> {offer.cancellingVendorName} · Escrow Held:{' '}
                          <strong className="font-mono tabular-nums">NPR {offer.escrowAmountNpr.toLocaleString()}</strong> ·{' '}
                          <span className="text-stone-500">{offer.referralFeeModel.replace(/_/g, ' ')}</span>
                        </div>

                        <p className="text-stone-600 bg-white p-2.5 rounded-lg border border-stone-200">
                          {offer.reason}
                        </p>

                        {/* Recommended Partners Picker */}
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">
                            Recommended Replacement Partners ({offer.recommendedPartners.length}):
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {offer.recommendedPartners.map((partner) => {
                              const isChosen =
                                offer.clientDecision === 'ACCEPTED_PARTNER'
                                  ? offer.acceptedPartnerId === partner.partnerId
                                  : selectedPartnerId === partner.partnerId;

                              return (
                                <div
                                  key={partner.partnerId}
                                  onClick={() => {
                                    if (offer.clientDecision === 'PENDING') {
                                      setSelectedChoiceByOffer((prev) => ({
                                        ...prev,
                                        [offer.id]: partner.partnerId,
                                      }));
                                    }
                                  }}
                                  className={`p-3 rounded-xl border bg-white space-y-1 transition-all ${
                                    offer.clientDecision === 'PENDING' ? 'cursor-pointer' : ''
                                  } ${
                                    isChosen ? 'border-amber-900 ring-1 ring-amber-900' : 'border-stone-200'
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <strong className="text-stone-900 truncate">{partner.partnerName}</strong>
                                    <span className="text-amber-900 font-bold tabular-nums shrink-0 flex items-center gap-0.5">
                                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                      {partner.rating.toFixed(1)}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-stone-500">
                                    {partner.district} · {partner.categoryOrCapacity}
                                  </div>
                                  <div className="text-[11px] font-mono font-semibold text-emerald-800">
                                    {partner.priceDeltaNote}
                                  </div>
                                  <div className="text-[11px] text-stone-500 flex items-center gap-1 pt-0.5">
                                    <Phone className="w-3 h-3" />
                                    <span>{partner.phone}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {offer.clientDecision === 'PENDING' ? (
                          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-stone-200">
                            <span className="text-[11px] text-stone-500">
                              {offer.includeLiabilityRelease
                                ? 'Includes standard Third-Party Referral Liability Release upon transfer.'
                                : 'Cancelling vendor remains backup guarantor.'}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  respondToReferralOffer(offer.id, 'ACCEPTED_PARTNER', selectedPartnerId);
                                  showToast(
                                    `Accepted replacement partner and transferred NPR ${offer.escrowAmountNpr.toLocaleString()} escrow.`
                                  );
                                }}
                                className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 whitespace-nowrap shrink-0"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Accept & Transfer Escrow</span>
                              </button>
                              <button
                                onClick={() => {
                                  respondToReferralOffer(offer.id, 'DECLINED_REFUND_ONLY');
                                  showToast(
                                    `Declined referrals; full NPR ${offer.escrowAmountNpr.toLocaleString()} refund unlocked for #${offer.bookingRef}.`
                                  );
                                }}
                                className="px-3.5 py-2 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 rounded-xl font-semibold text-xs flex items-center gap-1.5 whitespace-nowrap shrink-0"
                              >
                                <XCircle className="w-3.5 h-3.5 text-rose-700" />
                                <span>Decline & Claim 100% Refund</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="pt-2 border-t border-stone-200 text-[11px] font-semibold text-stone-700 flex items-center justify-between">
                            <span>
                              Escrow Resolution: <strong className="text-emerald-800">{offer.escrowAction.replace(/_/g, ' ')}</strong>
                              {offer.acceptedPartnerName ? ` → ${offer.acceptedPartnerName}` : ''}
                            </span>
                            {offer.resolvedAt && (
                              <span className="text-stone-400 font-mono">
                                {new Date(offer.resolvedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Resolved Cancellation Ledger */}
            {cancellationRecords.length > 0 && (
              <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3 text-xs">
                <h4 className="font-bold text-sm text-stone-900">
                  Recent Cancellation & Settlement Ledger ({cancellationRecords.length})
                </h4>
                <div className="divide-y divide-stone-100">
                  {cancellationRecords.map((rec) => (
                    <div key={rec.id} className="py-2.5 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <strong className="text-stone-900">#{rec.bookingRef} · {rec.venueOrPartnerName}</strong>
                        <div className="text-[11px] text-stone-500">
                          Initiated by {rec.initiatedByRole.replace(/_/g, ' ')} · {rec.isPastDeadline ? 'Past Deadline / Date Over' : 'Advance Notice'} · {rec.legalBasisSummary}
                        </div>
                      </div>
                      <div className="text-right font-mono tabular-nums">
                        <div className="text-emerald-800 font-bold">Refund: NPR {rec.refundIssuedNpr.toLocaleString()}</div>
                        <div className="text-[11px] text-stone-500">Retained: NPR {rec.retainedFeeNpr.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
