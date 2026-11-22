/**
 * SAGUNOO — Global Event Industry & Nepal Statutory Cancellation Policy Engine
 * Covers Clients, Vendors/Venues, Cultural Artists, Event Planners, and Gig Talent Pool Staff,
 * including Past-Deadline (Date & Time Over) Resolution and Cancelling Vendor Referral Workflows.
 *
 * Grounded in Global Hospitality/Event Standards (The Knot / WeddingWire / GigSalad / Eventbrite)
 * and Nepal Statutory Law: Muluki Civil Code 2074 (Part 5 Sec. 504–544), Consumer Protection Act 2075,
 * and Nepal Labour Act 2074.
 */

import {
  CancellationPolicyPreset,
  CancellationResolutionRecord,
  CancellationStakeholderRole,
  CancellationTier,
  DynamicCancellationPolicy,
  PastDeadlineRule,
  ReferralHandoffConfig,
  VendorReferralOffer,
} from '../types';

export interface StakeholderPolicyFramework {
  role: CancellationStakeholderRole;
  title: string;
  nepaliTitle: string;
  retainerAndNoticeStandard: string;
  earlyMidLateSummary: string[];
  pastDeadlineProcess: string[];
  partnerReferralAndBackfill: string;
  legalAndGlobalBasis: string;
}

export const GLOBAL_STAKEHOLDER_POLICY_FRAMEWORKS: StakeholderPolicyFramework[] = [
  {
    role: 'CLIENT',
    title: 'Clients & Event Hosts (Party Booking Customers)',
    nepaliTitle: 'सेवाग्राही तथा आयोजक (ग्राहक)',
    retainerAndNoticeStandard:
      '24–48 hr Cooling-Off Grace Window for bookings made >14 days in advance, followed by tiered notice windows protecting sunk hall holds and fresh catering procurement.',
    earlyMidLateSummary: [
      'Early Notice (60–90+ Days Before Event): 75%–90% deposit refund OR 100% penalty-free date transfer to another Subha Muhurat within 12 months.',
      'Mid-Term Notice (30–59 Days Before Event): 50% of milestone deposit refunded (or 75% converted to future event credit); administrative hold retainer retained.',
      'Short-Term Notice (14–29 Days Before Event): 25% refundable or 50% date-reschedule credit; 100% pass-through refund of any unpurchased third-party add-ons.',
      'Critical Window (< 14 Days Before Event): 0% cash refund once banquet perishables, cold-chain proteins, and dedicated shift crews are locked.',
    ],
    pastDeadlineProcess: [
      'Cutoff Passed / Event Date & Time Over (Client No-Show): 0% cash refund; 100% of contracted food, hall lock, and booked staff costs are deemed consumed under Muluki Civil Code Sec. 535 (actual direct loss).',
      'Remaining Balance Settlement: Unpaid balance becomes immediately due upon confirmed hall readiness and kitchen prep logs unless waived by the vendor.',
      '48-Hour Emergency Medical / Bereavement Grace Window: If the client submits verified hospital or official emergency documentation within 48 hours after the missed date, the vendor’s dynamic goodwill credit (0%–25% off-season voucher) may be applied.',
      'Evidence Freeze: SAGUNOO locks hall readiness timestamps, KitchenPrepSheet counts, and staff clock-in records for formal mediation or District Court / Consumer Court audit.',
    ],
    partnerReferralAndBackfill:
      'If a client downsizes or cancels early, SAGUNOO prioritizes re-listing the auspicious Muhurat date; if another host books the freed slot (Mitigation of Damages rule), vendors may rebate re-booked hall rental.',
    legalAndGlobalBasis:
      'Global Banquet Tiers + Nepal Muluki Civil Code 2074 Sec. 531 (Force Majeure) & Sec. 535 (Mitigation of Actual Loss).',
  },
  {
    role: 'VENUE_VENDOR',
    title: 'Venues, Party Palaces & Banquet Vendors',
    nepaliTitle: 'पार्टी प्यालेस, होटल तथा अन्य सेवा साझेदार भेन्डर',
    retainerAndNoticeStandard:
      'High-accountability standard: Vendors hold exclusive physical inventory on peak Panchanga dates and may customize their client-facing tier percentages dynamically within statutory fairness bounds.',
    earlyMidLateSummary: [
      'Dynamic Per-Vendor Tiers: Each venue configures Flexible, Moderate Standard, or Strict Peak-Muhurat refund & reschedule windows transparently prior to booking.',
      'Vendor-Initiated Cancellation (> 30 Days Out): 100% full refund of all client escrow funds within 72 hours + mandatory Warm Peer Referral of 1–3 vetted venues.',
      'Vendor-Initiated Cancellation (< 30 Days Out): 100% refund + vendor reliability penalty + Direct Substitute Guarantee covering any last-minute price delta up to policy cap.',
      'Double-Booking / Unilateral Breach: Automatic escrow freeze, priority placement into an equal-or-higher tier hall, and DoCSCP Consumer Act compliance audit.',
    ],
    pastDeadlineProcess: [
      'Vendor No-Show / Gate Locked Past Load-In Deadline: Immediate 100% escrow refund reversal to client + 15%–25% Emergency Backfill Compensation Credit charged to defaulting partner.',
      'Deficient Delivery at Event Time (No Genset / Missing Hall): Documented via timestamped client/planner evidence within 6 hours triggers partial/full escrow holdback under Consumer Protection Act 2075 Sec. 3.',
      'Active Partner Referral Dispatch: Cancelling or distressed vendor initiates urgent peer transfer via SAGUNOO Referral Network to salvage guest reception.',
    ],
    partnerReferralAndBackfill:
      'Cancelling vendors can choose (A) Direct Equal-or-Greater Substitute under the original price, or (B) Warm Peer Referral to 1–3 matching verified venues/vendors (0% Courtesy Emergency Hand-off or 5%–10% B2B Referral Commission) with client consent & direct escrow transfer.',
    legalAndGlobalBasis:
      'Nepal Consumer Protection Act 2075 (Deficient Service Remedies & 6-month Consumer Court Window) + Global Hospitality Substitution Clause.',
  },
  {
    role: 'CULTURAL_ARTIST',
    title: 'Cultural Artists (Panche Baja, Dhime, Purohits, Photo, Makeup)',
    nepaliTitle: 'सांस्कृतिक कलाकार, बाजा समूह, पण्डित तथा फोटोग्राफर',
    retainerAndNoticeStandard:
      'Single-engagement artists turn down competing Muhurat gigs to block an auspicious date; initial booking retainers (typically 25%–30%) cover blocked exclusivity from day one.',
    earlyMidLateSummary: [
      'Client Cancels > 30 Days Before Muhurat: Booking retainer (25%) held as Muhurat date-block compensation or 100% credited to a rescheduled date; pre-paid balance refunded.',
      'Client Cancels < 14 Days Before Muhurat: Up to 75%–100% of ensemble fee retained due to lost peak-season replacement opportunity.',
      'Artist Cancels > 14 Days Before Event: Artist must refund 100% immediately OR propose an equal-caliber guild ensemble/performer for explicit client approval.',
      'Creative Client Consent Rule: Unlike generic supplies, artistic style (band, photographer, MUA) strictly requires client approval before finalizing any substitute artist.',
    ],
    pastDeadlineProcess: [
      'Artist No-Show Past Muhurat Call Time (+30 mins): Immediate 100% fee forfeiture + emergency guild backup call + reliability rating deduction and badge suspension.',
      'Client Post-Deadline Cancellation / Ceremony Overrun: If host fails to appear or cancels after ensemble has arrived at venue/temple, 100% performance fee + travel allowance is payable.',
      'Substitute Guild Hand-Off: If illness or travel blockage occurs on event morning, artist dispatches a pre-vetted Guild Partner matching instrumentation/lineage; if client declines vetted substitute, client receives 100% refund.',
    ],
    partnerReferralAndBackfill:
      'Artists maintain a Guild Sub-List by district & tradition (Panche Baja, Dhime, Vedic Purohit, Bridal MUA) enabling warm peer hand-offs with 0% emergency courtesy fees.',
    legalAndGlobalBasis:
      'Global Performing Arts / Entertainment Retainer & Creative Substitution Clause + Muluki Civil Code Sec. 538.',
  },
  {
    role: 'EVENT_PLANNER',
    title: 'Event Management Companies & Wedding Planners',
    nepaliTitle: 'इभेन्ट म्यानेजमेन्ट कम्पनी तथा वेडिङ प्लानर',
    retainerAndNoticeStandard:
      'Planners incur front-loaded creative concept, vendor sourcing, floorplan CAD, and run-of-show labor; milestone retainers compensate completed pre-event planning hours.',
    earlyMidLateSummary: [
      'Non-Refundable Planning Retainer (25%–35%): Earned upon agency onboarding, moodboarding, and initial venue/vendor locking.',
      'Mid-Term Cancellation (30–60 Days Out): Completed planning & vendor coordination milestones deducted; remaining production/decor fabrication budget refunded or credited.',
      'Late Cancellation (< 14 Days Out): 100% of custom floral imports, printed signage, AV rig bookings, and crew call sheets remain payable.',
      'External Vendor Coordination Release: When a planner refers independent third-party vendors contracted directly by client, a standard Liability Release clarifies direct vendor accountability.',
    ],
    pastDeadlineProcess: [
      'Planner / Agency No-Show Past Setup Load-In Window (-6 hrs before event): Immediate escrow freeze + automatic venue-manager escalation + liability insurance claim trigger.',
      'Client Post-Deadline Termination (Day-Of / Post-Event): All production hours, technical riders, and third-party vendor commitments already deployed are 100% billable with itemized Run-of-Show proof.',
      'Continuity Peer Agency Handover: If lead producer faces certified force majeure/medical incapacitation, agency transfers complete Run-of-Show dossier to an insured peer planner on SAGUNOO.',
    ],
    partnerReferralAndBackfill:
      'Turnkey planners may hand off or co-produce via certified partner agencies with Public Liability Insurance verification and optional 5%–10% B2B producer referral terms.',
    legalAndGlobalBasis:
      'Global Production & Turnkey Agency Retainer Standards + External Vendor Liability Waiver + Nepal Contract Act 2056.',
  },
  {
    role: 'EVENT_STAFF_POOL',
    title: 'Employment Pool Workers (Servers, Cooks, Ushers, Techs)',
    nepaliTitle: 'उत्सव जनशक्ति तथा गिग कामदार (वेटर, कुक, प्राविधिक)',
    retainerAndNoticeStandard:
      'Protects daily-wage hospitality workers from sudden shift loss while enforcing strict punctuality and automatic backfill for vendors & banquet hosts.',
    earlyMidLateSummary: [
      'Hiring Vendor Cancels > 48 Hours Before Shift: Penalty-free shift release; worker notified immediately so they can claim other shifts.',
      'Hiring Vendor / Client Cancels < 48 Hours (Late Shift Cancellation): Mandatory "Reporting / Shift Protection Pay" (50%–100% of agreed statutory minimum wage NPR 668+/shift) paid to booked workers.',
      'Worker Drops Shift > 48 Hours Prior: Clean withdrawal with no suspension; shift auto-reopened to pool.',
      'Worker Drops Shift < 24–48 Hours (Late Drop): 14-day priority cool-down and reliability score strike unless medical proof is provided.',
    ],
    pastDeadlineProcess: [
      'Worker No-Show (Failed Check-in at Call Time + 45 Mins): Instant **Auto-Backfill Pinging** dispatches emergency shift alerts to pre-vetted workers in the same district; no-show worker receives immediate account suspension/review.',
      'Client / Vendor Cancels Past Shift Start Time (Workers Already On-Site): Workers receive **100% Full Statutory Shift Wage** + return transit allowance immediately under Labour Act 2074 equity.',
      'Attendance Proof Lock: Manager sign-off & timestamped call-time check-ins settle disputes between false no-show claims and actual attendance.',
    ],
    partnerReferralAndBackfill:
      'Zero-gap marketplace backfill: If a booked banquet server, halwai, or tech drops or misses call time, nearby verified pool members receive one-tap replacement dispatch.',
    legalAndGlobalBasis:
      'Global Two-Sided Staffing Marketplace SLA (GigHire/Gigable Reporting Pay & 45-Min Auto-Backfill) + Nepal Labour Act 2074 Minimum Wage Guarantee.',
  },
];

export const GLOBAL_REFERRAL_STANDARDS = [
  {
    id: 'ref-sub-guarantee',
    title: 'Option A: Equal-or-Greater Substitute Guarantee',
    subtitle: 'Vendor remains contractually responsible & supplies vetted equivalent',
    points: [
      'Replacement venue/partner must match or exceed hall capacity, hygiene rating, and amenities.',
      'If substitute costs less, the savings are refunded/credited to the client.',
      'If emergency last-minute substitute costs more, cancelling vendor absorbs the price difference (unless statutory Force Majeure).',
      'Mandatory explicit Client Consent for creative roles (Artists, Photographers, Planners, Bridal MUA).',
    ],
  },
  {
    id: 'ref-warm-handoff',
    title: 'Option B: Peer Partner Warm Referral (Direct Contracting)',
    subtitle: 'Cancelling vendor recommends 1–3 available peers & passes event specs',
    points: [
      'Cancelling vendor selects 1–3 vetted peers from SAGUNOO with matching date/district/capacity availability.',
      'Transparent B2B Referral Fee toggle: 0% Emergency Courtesy Hand-off (life/health emergencies) OR 5%–10% standard B2B referral commission (zero markup to client).',
      'Direct Escrow Transfer: Client can move 100% of held SAGUNOO deposit directly to the accepted referral partner without re-paying.',
      'Includes Global-Standard Referral Liability Release once the client contracts directly with the referred partner.',
    ],
  },
  {
    id: 'ref-full-refund',
    title: 'Option C: Decline Referrals & Immediate 100% Refund',
    subtitle: 'Full financial restoration when client chooses an independent search',
    points: [
      'If the client declines all recommended substitutes or referrals, 100% of escrowed deposits are unlocked for immediate refund.',
      'SAGUNOO Concierge flags client for priority standby alert on newly freed Subha Muhurat slots across nearby districts.',
    ],
  },
];

const TIERS_BY_PRESET: Record<Exclude<CancellationPolicyPreset, 'CUSTOM'>, CancellationTier[]> = {
  FLEXIBLE: [
    {
      id: 'tier-flex-1',
      label: 'Early Notice (30+ Days Before Event)',
      minDaysBefore: 30,
      refundPercent: 95,
      rescheduleCreditPercent: 100,
      retainedFeePercent: 5,
      notes: '95% cash refund (5% admin processing retained) or 100% free date shift.',
    },
    {
      id: 'tier-flex-2',
      label: 'Mid-Term Notice (15–29 Days Before)',
      minDaysBefore: 15,
      maxDaysBefore: 29,
      refundPercent: 75,
      rescheduleCreditPercent: 100,
      retainedFeePercent: 25,
      notes: '75% cash refund or 100% applied toward an alternate date within 12 months.',
    },
    {
      id: 'tier-flex-3',
      label: 'Late Notice (3–14 Days Before)',
      minDaysBefore: 3,
      maxDaysBefore: 14,
      refundPercent: 40,
      rescheduleCreditPercent: 75,
      retainedFeePercent: 60,
      notes: '40% refund; 75% date-reschedule credit before perishables are ordered.',
    },
    {
      id: 'tier-flex-4',
      label: 'Critical Window (0–2 Days Before)',
      minDaysBefore: 0,
      maxDaysBefore: 2,
      refundPercent: 0,
      rescheduleCreditPercent: 25,
      retainedFeePercent: 100,
      notes: '0% cash refund; up to 25% venue rental credit minus fresh catering commitments.',
    },
  ],
  MODERATE_STANDARD: [
    {
      id: 'tier-mod-1',
      label: 'Early Notice (60+ Days Before Event)',
      minDaysBefore: 60,
      refundPercent: 85,
      rescheduleCreditPercent: 100,
      retainedFeePercent: 15,
      notes: '85% deposit refund (15% Muhurat hold retainer) or 100% one-time date transfer.',
    },
    {
      id: 'tier-mod-2',
      label: 'Mid-Term Notice (30–59 Days Before)',
      minDaysBefore: 30,
      maxDaysBefore: 59,
      refundPercent: 50,
      rescheduleCreditPercent: 85,
      retainedFeePercent: 50,
      notes: '50% refund of paid deposit or 85% credit valid for 12 months.',
    },
    {
      id: 'tier-mod-3',
      label: 'Short-Term Notice (15–29 Days Before)',
      minDaysBefore: 15,
      maxDaysBefore: 29,
      refundPercent: 25,
      rescheduleCreditPercent: 50,
      retainedFeePercent: 75,
      notes: '25% cash refund or 50% off-peak credit; vendor seeks backfill client.',
    },
    {
      id: 'tier-mod-4',
      label: 'Critical Window (< 15 Days Before)',
      minDaysBefore: 0,
      maxDaysBefore: 14,
      refundPercent: 0,
      rescheduleCreditPercent: 0,
      retainedFeePercent: 100,
      notes: 'No cash refund within 14 days as food, decor, and shift staffing are committed.',
    },
  ],
  STRICT_PEAK_MUHURAT: [
    {
      id: 'tier-strict-1',
      label: 'Long-Term Notice (90+ Days Before)',
      minDaysBefore: 90,
      refundPercent: 75,
      rescheduleCreditPercent: 100,
      retainedFeePercent: 25,
      notes: '25% non-refundable peak Muhurat retainer; balance refunded or 100% transferable.',
    },
    {
      id: 'tier-strict-2',
      label: 'Peak Season Notice (30–89 Days Before)',
      minDaysBefore: 30,
      maxDaysBefore: 89,
      refundPercent: 35,
      rescheduleCreditPercent: 70,
      retainedFeePercent: 65,
      notes: '35% refundable (rebated up to 70% if another host books the freed Muhurat slot).',
    },
    {
      id: 'tier-strict-3',
      label: 'Final Month (< 30 Days Before)',
      minDaysBefore: 0,
      maxDaysBefore: 29,
      refundPercent: 0,
      rescheduleCreditPercent: 20,
      retainedFeePercent: 100,
      notes: '0% cash refund due to lost prime wedding date; 20% off-season goodwill credit.',
    },
  ],
};

export function createDynamicPolicyFromPreset(params: {
  vendorId: string;
  vendorName: string;
  stakeholderCategory: 'VENUE_VENDOR' | 'CULTURAL_ARTIST' | 'EVENT_PLANNER';
  preset: Exclude<CancellationPolicyPreset, 'CUSTOM'>;
  referralFeeModel?: ReferralHandoffConfig['referralFeeModel'];
}): DynamicCancellationPolicy {
  const isFlexible = params.preset === 'FLEXIBLE';
  const isStrict = params.preset === 'STRICT_PEAK_MUHURAT';

  const pastDeadlineRule: PastDeadlineRule = {
    forfeitPercentAfterDeadline: 100,
    claimRemainingBalanceOnNoShow: isStrict,
    allowEmergencyMedicalReviewHours: 48,
    goodwillCreditCapPercent: isFlexible ? 25 : isStrict ? 10 : 15,
    staffReportingPayPercent: isStrict ? 100 : 75,
    vendorNoShowPenaltyCreditPercent: 20,
    evidenceLockRequired: true,
  };

  const referralConfig: ReferralHandoffConfig = {
    allowsPartnerReferral: true,
    substitutionGuaranteeEnabled: true,
    referralFeeModel: params.referralFeeModel || (isStrict ? 'B2B_COMMISSION_5_PERCENT' : 'COURTESY_ZERO_FEE'),
    clientMustApproveSubstitute: params.stakeholderCategory !== 'VENUE_VENDOR' || true,
    escrowDirectTransferAllowed: true,
    liabilityReleaseIncluded: true,
  };

  return {
    vendorId: params.vendorId,
    vendorName: params.vendorName,
    stakeholderCategory: params.stakeholderCategory,
    preset: params.preset,
    coolingOffHours: isFlexible ? 48 : 24,
    retainerNonRefundablePercent: isFlexible ? 10 : isStrict ? 25 : 15,
    tiers: TIERS_BY_PRESET[params.preset].map((t) => ({ ...t })),
    pastDeadlineRule,
    referralConfig,
    forceMajeureCreditMonths: 12,
    updatedAt: new Date().toISOString(),
  };
}

export const SEED_VENDOR_CANCELLATION_POLICIES: Record<string, DynamicCancellationPolicy> = {
  'venue-regal-pavilion-ktm': createDynamicPolicyFromPreset({
    vendorId: 'venue-regal-pavilion-ktm',
    vendorName: 'The Regal Pavilion & Heritage Banquet',
    stakeholderCategory: 'VENUE_VENDOR',
    preset: 'MODERATE_STANDARD',
    referralFeeModel: 'B2B_COMMISSION_5_PERCENT',
  }),
  'venue-lalitpur-royal-palace': createDynamicPolicyFromPreset({
    vendorId: 'venue-lalitpur-royal-palace',
    vendorName: 'Lalitpur Royal Palace & Convention Center',
    stakeholderCategory: 'VENUE_VENDOR',
    preset: 'STRICT_PEAK_MUHURAT',
    referralFeeModel: 'B2B_COMMISSION_5_PERCENT',
  }),
  'venue-pokhara-lakeside-resort': createDynamicPolicyFromPreset({
    vendorId: 'venue-pokhara-lakeside-resort',
    vendorName: 'Pokhara Lakeside Majestic Garden & Convention',
    stakeholderCategory: 'VENUE_VENDOR',
    preset: 'FLEXIBLE',
    referralFeeModel: 'COURTESY_ZERO_FEE',
  }),
  'venue-bhaktapur-durbar-banquet': createDynamicPolicyFromPreset({
    vendorId: 'venue-bhaktapur-durbar-banquet',
    vendorName: 'Bhaktapur Durbar Banquet & Juju Dhau Pavilion',
    stakeholderCategory: 'VENUE_VENDOR',
    preset: 'MODERATE_STANDARD',
    referralFeeModel: 'COURTESY_ZERO_FEE',
  }),
  'vendor-panche-01': createDynamicPolicyFromPreset({
    vendorId: 'vendor-panche-01',
    vendorName: 'Shree Bhairab Panche & Naumati Baja Ensemble',
    stakeholderCategory: 'CULTURAL_ARTIST',
    preset: 'STRICT_PEAK_MUHURAT',
    referralFeeModel: 'COURTESY_ZERO_FEE',
  }),
  'org-shree-celebrations': createDynamicPolicyFromPreset({
    vendorId: 'org-shree-celebrations',
    vendorName: 'Shree Celebrations & Turnkey Wedding Studio',
    stakeholderCategory: 'EVENT_PLANNER',
    preset: 'MODERATE_STANDARD',
    referralFeeModel: 'B2B_COMMISSION_10_PERCENT',
  }),
};

export const SEED_VENDOR_REFERRAL_OFFERS: VendorReferralOffer[] = [
  {
    id: 'ref-offer-seed-1',
    bookingId: 'book-uts-1003',
    bookingRef: 'SGN-2083-3918',
    eventDateBS: '2083 Falgun 18',
    eventDateAD: '2027-03-02',
    clientName: 'Sunita Prajapati',
    cancellingVendorId: 'venue-bhaktapur-durbar-banquet',
    cancellingVendorName: 'Bhaktapur Durbar Banquet & Juju Dhau Pavilion',
    stakeholderRole: 'VENUE_VENDOR',
    handoffType: 'WARM_REFERRAL',
    recommendedPartners: [
      {
        partnerId: 'venue-regal-pavilion-ktm',
        partnerName: 'The Regal Pavilion & Heritage Banquet',
        partnerType: 'VENUE_VENDOR',
        district: 'Kathmandu',
        categoryOrCapacity: '250–900 guests · Grand Kailash Hall',
        estimatedPriceNpr: 472500,
        priceDeltaNote: 'NPR 7,750 lower (credited to client balance)',
        phone: '+977-9851099112',
        rating: 4.9,
      },
      {
        partnerId: 'venue-lalitpur-royal-palace',
        partnerName: 'Lalitpur Royal Palace & Convention Center',
        partnerType: 'VENUE_VENDOR',
        district: 'Lalitpur',
        categoryOrCapacity: '200–750 guests · Patan Durbar Hall',
        estimatedPriceNpr: 480250,
        priceDeltaNote: '100% Price-Matched to Original Contract',
        phone: '+977-9851188300',
        rating: 4.8,
      },
    ],
    referralFeeModel: 'B2B_COMMISSION_5_PERCENT',
    reason: 'Municipal heritage paving schedule near Suryabinayak courtyard requires temporary entrance diversion on Falgun 14 morning; offering two verified nearby palaces with matched Samay Baji kitchen support.',
    includeLiabilityRelease: true,
    clientDecision: 'PENDING',
    escrowAction: 'HELD_FOR_TRANSFER',
    escrowAmountNpr: 120063,
    createdAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
  },
];

export const SEED_CANCELLATION_RECORDS: CancellationResolutionRecord[] = [];

export interface CancellationCalculationInput {
  policy: DynamicCancellationPolicy;
  initiatedBy: CancellationStakeholderRole;
  daysBeforeEvent: number;
  hoursSinceBooking: number;
  isPastDeadline: boolean;
  isForceMajeure: boolean;
  hasEmergencyMedicalProof: boolean;
  totalAmountNpr: number;
  depositPaidNpr: number;
  bookedPoolStaffCount: number;
  staffShiftWageNpr: number;
}

export interface CancellationCalculationResult {
  applicableRuleTitle: string;
  refundToClientNpr: number;
  rescheduleCreditNpr: number;
  retainedByVendorNpr: number;
  remainingBalanceDueNpr: number;
  vendorReplacementCreditNpr: number;
  staffReportingPayTotalNpr: number;
  legalBasis: string;
  processSteps: string[];
  referralAvailable: boolean;
}

export function calculateCancellationOutcome(
  input: CancellationCalculationInput
): CancellationCalculationResult {
  const {
    policy,
    initiatedBy,
    daysBeforeEvent,
    hoursSinceBooking,
    isPastDeadline,
    isForceMajeure,
    hasEmergencyMedicalProof,
    totalAmountNpr,
    depositPaidNpr,
    bookedPoolStaffCount,
    staffShiftWageNpr,
  } = input;

  const isStaffLateWindow = isPastDeadline || daysBeforeEvent <= 2;

  // 1. Force Majeure (Nepal Muluki Civil Code Sec. 531)
  if (isForceMajeure) {
    const credit = depositPaidNpr;
    const partialCash = Math.round(depositPaidNpr * 0.5);
    return {
      applicableRuleTitle: `Statutory Force Majeure Discharge (${policy.forceMajeureCreditMonths}-Month Full Credit Option)`,
      refundToClientNpr: partialCash,
      rescheduleCreditNpr: credit,
      retainedByVendorNpr: 0,
      remainingBalanceDueNpr: 0,
      vendorReplacementCreditNpr: 0,
      staffReportingPayTotalNpr: isPastDeadline
        ? bookedPoolStaffCount * staffShiftWageNpr
        : 0,
      legalBasis:
        'Nepal Muluki Civil Code 2074 Sec. 531 (Supervening Impossibility / Force Majeure): Future performance discharged without punitive damages; advance adjusted fairly or held as 100% 12-month credit.',
      processSteps: [
        'Verify official natural disaster, strike/bandh, curfew, or government shutdown notice.',
        `Lock 100% of NPR ${depositPaidNpr.toLocaleString()} paid deposit into a ${policy.forceMajeureCreditMonths}-month transferable SAGUNOO date credit (or mutually agree on unincurred cost refund).`,
        'Issue Force Majeure Reschedule Addendum under Contract Act 2056 without penalty.',
      ],
      referralAvailable: policy.referralConfig.allowsPartnerReferral,
    };
  }

  // 2. Vendor / Artist / Planner initiates cancellation (any timing)
  if (
    initiatedBy === 'VENUE_VENDOR' ||
    initiatedBy === 'CULTURAL_ARTIST' ||
    initiatedBy === 'EVENT_PLANNER'
  ) {
    const penaltyCredit = isPastDeadline || daysBeforeEvent <= 14
      ? Math.round(depositPaidNpr * (policy.pastDeadlineRule.vendorNoShowPenaltyCreditPercent / 100))
      : 0;
    const staffPay = isStaffLateWindow
      ? Math.round(bookedPoolStaffCount * staffShiftWageNpr * (policy.pastDeadlineRule.staffReportingPayPercent / 100))
      : 0;

    return {
      applicableRuleTitle: isPastDeadline
        ? 'Partner Past-Deadline Default / No-Show SLA Triggered'
        : `Partner-Initiated Cancellation (${daysBeforeEvent} Days Notice) · Referral Eligible`,
      refundToClientNpr: depositPaidNpr,
      rescheduleCreditNpr: depositPaidNpr + penaltyCredit,
      retainedByVendorNpr: 0,
      remainingBalanceDueNpr: 0,
      vendorReplacementCreditNpr: penaltyCredit,
      staffReportingPayTotalNpr: staffPay,
      legalBasis:
        'Nepal Consumer Protection Act 2075 (Deficient Service Remedy) + Muluki Civil Code Sec. 538 (Rescission & Actual Loss) + Global Substitution & Warm Referral Clause.',
      processSteps: [
        isPastDeadline
          ? 'Freeze vendor escrow payout immediately at Load-In/Call-Time + 45 mins; issue 100% refund + emergency backfill SLA credit.'
          : 'Cancelling partner opens Warm Peer Referral or Equal-or-Greater Substitute Guarantee for Client approval.',
        'Client may transfer 100% of held escrow directly to an accepted peer partner (0% courtesy or 5%–10% B2B finder fee borne by vendor, never the client) OR claim full cash refund.',
        isStaffLateWindow && bookedPoolStaffCount > 0
          ? `Disburse ${policy.pastDeadlineRule.staffReportingPayPercent}% late-cancel reporting pay (NPR ${staffPay.toLocaleString()}) to ${bookedPoolStaffCount} booked pool staff.`
          : 'Release booked pool staff shifts with advance notification.',
      ],
      referralAvailable: policy.referralConfig.allowsPartnerReferral,
    };
  }

  // 3. Employment Pool Worker drops shift
  if (initiatedBy === 'EVENT_STAFF_POOL') {
    const isEmergencyBackfill = isPastDeadline || daysBeforeEvent <= 2;
    return {
      applicableRuleTitle: isPastDeadline
        ? 'Pool Staff No-Show (+45 Min Call-Time) · Auto-Backfill Triggered'
        : isEmergencyBackfill
        ? 'Late Staff Shift Drop (< 48 Hours)'
        : 'Standard Staff Shift Release (> 48 Hours Notice)',
      refundToClientNpr: 0,
      rescheduleCreditNpr: 0,
      retainedByVendorNpr: 0,
      remainingBalanceDueNpr: 0,
      vendorReplacementCreditNpr: isEmergencyBackfill ? staffShiftWageNpr : 0,
      staffReportingPayTotalNpr: 0,
      legalBasis:
        'Global Two-Sided Staffing SLA & Marketplace Replacement Guarantee + Nepal Labour Act 2074 Shift Reliability Terms.',
      processSteps: isPastDeadline
        ? [
            'At Call-Time + 45 mins without GPS/manager check-in, trigger instant Auto-Backfill push to verified standby workers in the same district.',
            'Forfeit worker pending shift payout for the missed assignment and place temporary 28-day pool suspension pending review.',
            'Credit hiring vendor 100% of missing shift wage if no replacement arrives within 60 minutes.',
          ]
        : isEmergencyBackfill
        ? [
            'Apply reliability score strike (-0.5) and 14-day priority cooldown unless medical emergency proof is uploaded.',
            'Auto-broadcast open shift at statutory wage + urgent bonus to pool.',
          ]
        : [
            'Accept early shift withdrawal without penalty and immediately re-open slot to available talent pool.',
          ],
      referralAvailable: true,
    };
  }

  // 4. Client Initiates Cancellation — PAST DEADLINE (Event Date & Time Over / No-Show)
  if (isPastDeadline) {
    const forfeitPct = policy.pastDeadlineRule.forfeitPercentAfterDeadline;
    const retained = Math.round((depositPaidNpr * forfeitPct) / 100);
    const unpaidBalance = Math.max(0, totalAmountNpr - depositPaidNpr);
    const remainingDue = policy.pastDeadlineRule.claimRemainingBalanceOnNoShow ? unpaidBalance : 0;
    const goodwill = hasEmergencyMedicalProof
      ? Math.round((depositPaidNpr * policy.pastDeadlineRule.goodwillCreditCapPercent) / 100)
      : 0;
    const staffPay = bookedPoolStaffCount * staffShiftWageNpr; // 100% shift wage protected when event time passes

    return {
      applicableRuleTitle: hasEmergencyMedicalProof
        ? `Past-Deadline Client No-Show with ${policy.pastDeadlineRule.allowEmergencyMedicalReviewHours}h Verified Medical Exception`
        : 'Event Date & Time Over (Past-Deadline Cutoff) · Client No-Show Protocol',
      refundToClientNpr: Math.max(0, depositPaidNpr - retained),
      rescheduleCreditNpr: goodwill,
      retainedByVendorNpr: retained,
      remainingBalanceDueNpr: remainingDue,
      vendorReplacementCreditNpr: 0,
      staffReportingPayTotalNpr: staffPay,
      legalBasis:
        'Muluki Civil Code 2074 Sec. 535 (Actual Sunken Catering, Hall Lock & Labour Losses) + Nepal Labour Act 2074 (100% On-Site Shift Pay Protection).',
      processSteps: [
        `Lock digital hall readiness, KitchenPrepSheet raw material prep, and check-in evidence timestamps.`,
        `${forfeitPct}% of paid deposit (NPR ${retained.toLocaleString()}) is retained to cover perished ingredients, blocked hall revenue, and committed crew.`,
        remainingDue > 0
          ? `Remaining unpaid contract balance of NPR ${remainingDue.toLocaleString()} is invoiced under Strict No-Show clause.`
          : 'No additional unpaid balance invoiced beyond deposited booking hold.',
        bookedPoolStaffCount > 0
          ? `100% full shift wages (NPR ${staffPay.toLocaleString()}) protected and released to ${bookedPoolStaffCount} hired pool staff.`
          : 'Release standby service staff with documented no-show log.',
        hasEmergencyMedicalProof
          ? `48-hour emergency review approved: Issue ${policy.pastDeadlineRule.goodwillCreditCapPercent}% goodwill future venue credit (NPR ${goodwill.toLocaleString()}).`
          : `Client may still upload verified medical/bereavement proof within ${policy.pastDeadlineRule.allowEmergencyMedicalReviewHours} hours to request up to ${policy.pastDeadlineRule.goodwillCreditCapPercent}% goodwill off-season credit.`,
      ],
      referralAvailable: false,
    };
  }

  // 5. Client Cooling-Off Grace Period (within coolingOffHours AND >14 days out)
  if (hoursSinceBooking <= policy.coolingOffHours && daysBeforeEvent > 14) {
    return {
      applicableRuleTitle: `${policy.coolingOffHours}-Hour Cooling-Off Grace Window (Free Cancellation)`,
      refundToClientNpr: depositPaidNpr,
      rescheduleCreditNpr: depositPaidNpr,
      retainedByVendorNpr: 0,
      remainingBalanceDueNpr: 0,
      vendorReplacementCreditNpr: 0,
      staffReportingPayTotalNpr: 0,
      legalBasis: 'Global Consumer Grace Standard (>14 days prior & within cooling-off window).',
      processSteps: [
        'Confirm booking timestamp is within cooling-off grace window and event is >14 days away.',
        `Issue 100% full refund (NPR ${depositPaidNpr.toLocaleString()}) back to original eSewa/Khalti/Bank source.`,
        'Immediately reopen hall shift & Muhurat slot on public calendar.',
      ],
      referralAvailable: false,
    };
  }

  // 6. Standard Client Tiered Cancellation
  const sortedTiers = [...policy.tiers].sort((a, b) => b.minDaysBefore - a.minDaysBefore);
  const matchedTier =
    sortedTiers.find((t) => daysBeforeEvent >= t.minDaysBefore) ||
    sortedTiers[sortedTiers.length - 1];

  const refundNpr = Math.round((depositPaidNpr * matchedTier.refundPercent) / 100);
  const creditNpr = Math.round((depositPaidNpr * matchedTier.rescheduleCreditPercent) / 100);
  const retainedNpr = Math.max(0, depositPaidNpr - refundNpr);
  const staffPay =
    daysBeforeEvent <= 2 && bookedPoolStaffCount > 0
      ? Math.round(
          bookedPoolStaffCount *
            staffShiftWageNpr *
            (policy.pastDeadlineRule.staffReportingPayPercent / 100)
        )
      : 0;

  return {
    applicableRuleTitle: `${policy.vendorName} · ${matchedTier.label}`,
    refundToClientNpr: refundNpr,
    rescheduleCreditNpr: creditNpr,
    retainedByVendorNpr: retainedNpr,
    remainingBalanceDueNpr: 0,
    vendorReplacementCreditNpr: 0,
    staffReportingPayTotalNpr: staffPay,
    legalBasis: `${policy.preset.replace(/_/g, ' ')} Dynamic Tiered Schedule · Contract Act 2056.`,
    processSteps: [
      `Tier Applied: ${matchedTier.label} (${matchedTier.notes})`,
      `Refundable Amount: NPR ${refundNpr.toLocaleString()} cash refund OR NPR ${creditNpr.toLocaleString()} future Muhurat credit.`,
      `Retained Allocation: NPR ${retainedNpr.toLocaleString()} covers blocked date inventory and preparation costs.`,
      staffPay > 0
        ? `Late staff protection triggered (<48h): NPR ${staffPay.toLocaleString()} allocated to ${bookedPoolStaffCount} booked pool staff.`
        : 'Reopen venue shift on Panchanga availability calendar.',
    ],
    referralAvailable: false,
  };
}
