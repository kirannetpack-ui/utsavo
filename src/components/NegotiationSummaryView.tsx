/**
 * SAGUNOO — AI Negotiation Summary View
 * Provides both customer and venue vendor with a transparent, auditable record of all
 * price counter-offers, concessions, tax breakdowns, and accepted/active agreement terms.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { NegotiationThread, OfferVersion } from '../types';
import {
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  FileCheck2,
  ArrowRight,
  AlertCircle,
  Scale,
  CheckCircle2,
} from 'lucide-react';

export interface AiNegotiationSummaryData {
  executiveOverview: string;
  priceProgressionSummary: string;
  concessionsAndAgreedTerms: string[];
  transparentAuditHighlights: string[];
  fairnessAndReadinessNote: string;
  generatedWith: string;
  generatedAt: string;
}

interface NegotiationSummaryViewProps {
  thread: NegotiationThread;
  onBackToNegotiation: () => void;
  onAcceptAndProceed?: () => void;
  onViewAgreement?: () => void;
}

function formatSignedNprDelta(delta: number): string {
  if (delta === 0) return 'No change';
  const sign = delta > 0 ? '+' : '-';
  return `${sign}NPR ${Math.abs(delta).toLocaleString()}`;
}

export const NegotiationSummaryView: React.FC<NegotiationSummaryViewProps> = ({
  thread,
  onBackToNegotiation,
  onAcceptAndProceed,
  onViewAgreement,
}) => {
  const [summaryCache, setSummaryCache] = useState<Record<string, AiNegotiationSummaryData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const cacheKey = `${thread.id}_v${thread.currentVersion}_${thread.status}`;
  const activeSummary = summaryCache[cacheKey] || null;

  const versions = thread.versions;
  const firstOffer: OfferVersion = versions[0];
  const latestOffer: OfferVersion = versions[versions.length - 1];

  const firstAmenitiesSet = useMemo(
    () => new Set(firstOffer?.includedAmenities || []),
    [firstOffer]
  );

  const addedAmenitiesInLatest = useMemo(
    () => (latestOffer?.includedAmenities || []).filter((item) => !firstAmenitiesSet.has(item)),
    [latestOffer, firstAmenitiesSet]
  );

  const totalDeltaFromInitial = latestOffer.totalNpr - firstOffer.totalNpr;
  const perPlateDeltaFromInitial =
    latestOffer.proposedPerPlateNpr - firstOffer.proposedPerPlateNpr;
  const hallDeltaFromInitial = latestOffer.hallRentalNpr - firstOffer.hallRentalNpr;

  const generateAiSummary = useCallback(
    async (forceRefresh = false) => {
      if (!forceRefresh && summaryCache[cacheKey]) return;
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const res = await fetch('/api/negotiation-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ thread }),
        });
        if (!res.ok) {
          throw new Error(`Summary request failed (${res.status})`);
        }
        const data: AiNegotiationSummaryData = await res.json();
        setSummaryCache((prev) => ({
          ...prev,
          [cacheKey]: data,
        }));
      } catch (err: any) {
        console.error('Failed to generate AI negotiation summary:', err);
        setErrorMsg('Unable to refresh remote synthesis right now. Showing live verified ledger below.');
      } finally {
        setIsLoading(false);
      }
    },
    [cacheKey, summaryCache, thread]
  );

  useEffect(() => {
    if (!summaryCache[cacheKey]) {
      generateAiSummary(false);
    }
  }, [cacheKey, summaryCache, generateAiSummary]);

  const handleCopyAuditRecord = async () => {
    const versionLines = versions
      .map(
        (v) =>
          `  - v${v.version} (${v.senderRole === 'CUSTOMER' ? 'Customer' : 'Venue'}: ${v.senderName}): NPR ${v.proposedPerPlateNpr.toLocaleString()}/plate, Hall NPR ${v.hallRentalNpr.toLocaleString()}, ${v.guestCount} guests -> Total NPR ${v.totalNpr.toLocaleString()}`
      )
      .join('\n');

    const recordText = [
      `SAGUNOO TRANSPARENT NEGOTIATION & AGREEMENT RECORD`,
      `Enquiry: #${thread.enquiryId} | Status: ${thread.status}`,
      `Venue: ${thread.venueName} | Customer: ${thread.customerName} (${thread.customerPhone})`,
      `Event: ${thread.eventType} on ${latestOffer.dateBS} BS (${latestOffer.dateAD} AD) · ${latestOffer.shift} Shift`,
      ``,
      `COUNTER-OFFER HISTORY (${versions.length} versions):`,
      versionLines,
      ``,
      `CURRENT / ACCEPTED TERMS (v${latestOffer.version}):`,
      `  - Per-Plate Rate: NPR ${latestOffer.proposedPerPlateNpr.toLocaleString()}`,
      `  - Hall Rental: NPR ${latestOffer.hallRentalNpr.toLocaleString()}`,
      `  - Guaranteed Guests: ${latestOffer.guestCount}`,
      `  - Subtotal: NPR ${latestOffer.subtotalNpr.toLocaleString()} | 10% SC: NPR ${latestOffer.serviceChargeNpr.toLocaleString()} | 13% VAT: NPR ${latestOffer.vatNpr.toLocaleString()}`,
      `  - Total Binding Consideration: NPR ${latestOffer.totalNpr.toLocaleString()} (25% Deposit: NPR ${Math.round(latestOffer.totalNpr * 0.25).toLocaleString()})`,
      `  - Included Amenities: ${latestOffer.includedAmenities.join(', ')}`,
      latestOffer.specialRequests ? `  - Special Terms/Concessions: ${latestOffer.specialRequests}` : '',
      activeSummary ? `\nAI SUMMARY:\n${activeSummary.executiveOverview}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(recordText);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    } catch (e) {
      console.error('Clipboard copy failed:', e);
    }
  };

  const isAccepted = thread.status === 'ACCEPTED';
  const isRejected = thread.status === 'REJECTED';

  return (
    <div className="p-5 sm:p-6 overflow-y-auto space-y-6 max-h-[64vh] text-xs">
      {/* Top Action & Transparency Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-stone-500">
            <span className="font-semibold text-stone-900">
              {isAccepted
                ? 'Mutually Accepted Agreement Record'
                : isRejected
                ? 'Closed Negotiation Audit Record'
                : 'Live Bilateral Negotiation Summary'}
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              {versions.length} Offer Version{versions.length > 1 ? 's' : ''}
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">Enquiry #{thread.enquiryId}</span>
          </div>
          <p className="text-[11px] text-stone-500">
            Shared transparent ledger visible identically to both {thread.customerName} and{' '}
            {thread.venueName}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => generateAiSummary(true)}
            disabled={isLoading}
            className="px-3 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-60 whitespace-nowrap shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-800 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Synthesizing...' : 'Regenerate Summary'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyAuditRecord}
            className="px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            {copiedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span className="text-emerald-800">Record Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-600" />
                <span>Copy Agreement Record</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 1. AI Synthesis Card (Flat Single-Elevation Container) */}
      <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-800 shrink-0" />
            <h4 className="font-display text-sm sm:text-base font-bold text-stone-900">
              AI Negotiation Summary
            </h4>
          </div>
          {activeSummary && (
            <span className="text-[11px] text-stone-500 tabular-nums">
              {activeSummary.generatedWith} · Updated{' '}
              {new Date(activeSummary.generatedAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-2 text-[11px]">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isLoading && !activeSummary ? (
          <div className="space-y-2.5 py-2 animate-pulse">
            <div className="h-3.5 bg-stone-200 rounded w-5/6" />
            <div className="h-3.5 bg-stone-200 rounded w-4/6" />
            <div className="h-3 bg-stone-200 rounded w-3/4 mt-3" />
          </div>
        ) : activeSummary ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs sm:text-[13px] text-stone-800 leading-relaxed font-medium">
                {activeSummary.executiveOverview}
              </p>
              <p className="text-xs text-stone-600 leading-relaxed">
                {activeSummary.priceProgressionSummary}
              </p>
            </div>

            {/* Net Price Movement Summary Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-white rounded-xl border border-stone-200">
                <span className="text-[11px] text-stone-500 block">Per-Plate Rate Movement</span>
                <strong className="text-sm font-bold text-stone-900 tabular-nums">
                  NPR {latestOffer.proposedPerPlateNpr.toLocaleString()}/plate
                </strong>
                <span
                  className={`block text-[11px] font-semibold tabular-nums mt-0.5 ${
                    perPlateDeltaFromInitial < 0
                      ? 'text-emerald-700'
                      : perPlateDeltaFromInitial > 0
                      ? 'text-amber-800'
                      : 'text-stone-500'
                  }`}
                >
                  vs v1: {formatSignedNprDelta(perPlateDeltaFromInitial)}
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-stone-200">
                <span className="text-[11px] text-stone-500 block">Hall Rental Adjustment</span>
                <strong className="text-sm font-bold text-stone-900 tabular-nums">
                  NPR {latestOffer.hallRentalNpr.toLocaleString()}
                </strong>
                <span
                  className={`block text-[11px] font-semibold tabular-nums mt-0.5 ${
                    hallDeltaFromInitial < 0
                      ? 'text-emerald-700'
                      : hallDeltaFromInitial > 0
                      ? 'text-amber-800'
                      : 'text-stone-500'
                  }`}
                >
                  vs v1: {formatSignedNprDelta(hallDeltaFromInitial)}
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-stone-200">
                <span className="text-[11px] text-stone-500 block">
                  Final Consideration (incl. VAT)
                </span>
                <strong className="text-sm font-bold text-amber-950 tabular-nums">
                  NPR {latestOffer.totalNpr.toLocaleString()}
                </strong>
                <span className="block text-[11px] text-stone-500 tabular-nums mt-0.5">
                  vs v1: {formatSignedNprDelta(totalDeltaFromInitial)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                  Counter-Offer Progression Highlights
                </span>
                <ul className="space-y-1.5 text-stone-700">
                  {activeSummary.transparentAuditHighlights.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-amber-800 font-bold tabular-nums shrink-0">
                        {String(i + 1).padStart(2, '0')}.
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                  {isAccepted ? 'Accepted Agreement Terms' : 'Proposed & Active Terms'}
                </span>
                <ul className="space-y-1.5 text-stone-700">
                  {activeSummary.concessionsAndAgreedTerms.map((term, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200 flex items-center gap-2 text-[11px] text-stone-600">
              <Scale className="w-3.5 h-3.5 text-amber-800 shrink-0" />
              <span>{activeSummary.fairnessAndReadinessNote}</span>
            </div>
          </div>
        ) : null}
      </div>

      {/* 2. Side-by-Side Price Counter-Offer History Table */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="font-display text-sm font-bold text-stone-900">
            Complete Price Counter-Offer Ledger
          </h4>
          <span className="text-[11px] text-stone-500 tabular-nums">
            Amounts in NPR · Includes 10% Service Charge &amp; 13% IRD VAT
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600">
                <th className="py-2.5 px-3">Version &amp; Party</th>
                <th className="py-2.5 px-3 text-right">Per Plate</th>
                <th className="py-2.5 px-3 text-right">Hall Rental</th>
                <th className="py-2.5 px-3 text-right">Guests</th>
                <th className="py-2.5 px-3 text-right">Total (incl. VAT)</th>
                <th className="py-2.5 px-3">Concessions / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {versions.map((ver, idx) => {
                const prevVer = idx > 0 ? versions[idx - 1] : null;
                const plateDiff = prevVer
                  ? ver.proposedPerPlateNpr - prevVer.proposedPerPlateNpr
                  : 0;
                const totalDiff = prevVer ? ver.totalNpr - prevVer.totalNpr : 0;
                const isLatest = ver.version === latestOffer.version;

                return (
                  <tr
                    key={ver.version}
                    className={isLatest ? 'bg-amber-50/40 font-medium' : 'hover:bg-stone-50/70'}
                  >
                    <td className="py-3 px-3 align-top">
                      <div className="font-bold text-stone-900">
                        v{ver.version} ·{' '}
                        {ver.senderRole === 'CUSTOMER' ? 'Customer' : 'Venue Vendor'}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {ver.senderName} ·{' '}
                        <span className="tabular-nums">
                          {new Date(ver.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      {isLatest && (
                        <div className="text-[10px] font-bold text-amber-900 mt-0.5">
                          {isAccepted ? 'Mutually Accepted Final' : 'Current Active Offer'}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right align-top tabular-nums">
                      <div className="font-semibold text-stone-900">
                        NPR {ver.proposedPerPlateNpr.toLocaleString()}
                      </div>
                      {prevVer && plateDiff !== 0 && (
                        <div
                          className={`text-[10px] font-semibold ${
                            plateDiff < 0 ? 'text-emerald-700' : 'text-amber-800'
                          }`}
                        >
                          {formatSignedNprDelta(plateDiff)}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right align-top tabular-nums text-stone-800">
                      NPR {ver.hallRentalNpr.toLocaleString()}
                    </td>

                    <td className="py-3 px-3 text-right align-top tabular-nums text-stone-800">
                      {ver.guestCount}
                    </td>

                    <td className="py-3 px-3 text-right align-top tabular-nums">
                      <div className="font-bold text-stone-950">
                        NPR {ver.totalNpr.toLocaleString()}
                      </div>
                      {prevVer && totalDiff !== 0 && (
                        <div
                          className={`text-[10px] font-semibold ${
                            totalDiff < 0 ? 'text-emerald-700' : 'text-amber-800'
                          }`}
                        >
                          {formatSignedNprDelta(totalDiff)}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 align-top text-[11px] text-stone-600 max-w-xs">
                      {ver.specialRequests || ver.notes || 'Standard venue package terms'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Final Terms & Agreed Inclusions Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl border border-stone-200 bg-white space-y-2">
          <h5 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
            Commercial Tax &amp; Payment Snapshot (v{latestOffer.version})
          </h5>
          <div className="space-y-1.5 text-xs text-stone-600 pt-1">
            <div className="flex justify-between">
              <span>Catering ({latestOffer.guestCount} × NPR {latestOffer.proposedPerPlateNpr.toLocaleString()}):</span>
              <span className="font-semibold text-stone-900 tabular-nums">
                NPR {(latestOffer.guestCount * latestOffer.proposedPerPlateNpr).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Agreed Hall Rental:</span>
              <span className="font-semibold text-stone-900 tabular-nums">
                NPR {latestOffer.hallRentalNpr.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Service Charge (10%):</span>
              <span className="tabular-nums">NPR {latestOffer.serviceChargeNpr.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Nepal VAT (13%):</span>
              <span className="tabular-nums">NPR {latestOffer.vatNpr.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-1.5 border-t border-stone-100 font-bold text-stone-950">
              <span>Total Binding Value:</span>
              <span className="tabular-nums">NPR {latestOffer.totalNpr.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-emerald-800 font-semibold">
              <span>25% Escrow Confirmation Deposit:</span>
              <span className="tabular-nums">
                NPR {Math.round(latestOffer.totalNpr * 0.25).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-stone-200 bg-white space-y-2.5">
          <h5 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
            Included Amenities &amp; Negotiated Additions
          </h5>
          <ul className="space-y-1.5 text-xs text-stone-700">
            {latestOffer.includedAmenities.map((item, idx) => {
              const isNewlyAdded = addedAmenitiesInLatest.includes(item);
              return (
                <li key={idx} className="flex items-start justify-between gap-2">
                  <span className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </span>
                  {isNewlyAdded && (
                    <span className="text-[10px] font-bold text-amber-900 shrink-0">
                      Added via Counter
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
          {latestOffer.specialRequests && (
            <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-700">
              <strong>Recorded Stipulation:</strong> {latestOffer.specialRequests}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200">
        <button
          type="button"
          onClick={onBackToNegotiation}
          className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold whitespace-nowrap shrink-0"
        >
          ← Back to Offer &amp; Counter Controls
        </button>

        <div className="flex items-center gap-2">
          {isAccepted && onViewAgreement && (
            <button
              type="button"
              onClick={onViewAgreement}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Open Signed Agreement &amp; Payment</span>
            </button>
          )}
          {!isAccepted && !isRejected && onAcceptAndProceed && (
            <button
              type="button"
              onClick={onAcceptAndProceed}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <span>Accept Terms &amp; Lock Agreement</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
