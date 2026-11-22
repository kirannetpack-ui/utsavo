/**
 * SAGUNOO — Venue Performance Tab (Past 6 Months Recharts Analytics)
 * Visualizes 6-month booking trends, inquiry volume, and average negotiation outcomes
 * (acceptance rate, initial vs. final agreed per-plate NPR, and counter-offer spread).
 */

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  MessageSquare,
  Handshake,
  Download,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { Booking, NegotiationThread, Venue } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface VenuePerformanceTabProps {
  venue: Venue;
  bookings: Booking[];
  negotiations: NegotiationThread[];
  onOpenNegotiationInbox?: () => void;
}

interface SixMonthPerfPoint {
  monthKey: string;
  monthLabel: string;
  bsMonth: string;
  inquiries: number;
  bookings: number;
  conversionRatePct: number;
  revenueLakhs: number;
  acceptedNegotiations: number;
  counterActiveNegotiations: number;
  declinedNegotiations: number;
  totalNegotiations: number;
  acceptanceRatePct: number;
  avgInitialPlateNpr: number;
  avgCounterPlateNpr: number;
  avgAgreedPlateNpr: number;
  avgConcessionPct: number;
  avgRoundsToClose: number;
}

const AD_TO_BS_MONTH: Record<number, string> = {
  0: 'Poush/Magh',
  1: 'Magh/Falgun',
  2: 'Falgun/Chaitra',
  3: 'Chaitra/Baisakh',
  4: 'Baisakh/Jestha',
  5: 'Jestha/Ashad',
  6: 'Ashad/Shrawan',
  7: 'Shrawan/Bhadra',
  8: 'Bhadra/Ashwin',
  9: 'Ashwin/Kartik',
  10: 'Kartik/Mangsir',
  11: 'Mangsir/Poush',
};

// Realistic Nepal seasonality weights by AD month index (0 = Jan .. 11 = Dec)
const MONTH_SEASON_BASELINE: Record<
  number,
  {
    inquiries: number;
    bookings: number;
    revenueLakhs: number;
    acceptedNeg: number;
    counterNeg: number;
    declinedNeg: number;
    initialRatio: number;
    agreedRatio: number;
    avgRounds: number;
  }
> = {
  0: { inquiries: 46, bookings: 13, revenueLakhs: 23.4, acceptedNeg: 12, counterNeg: 3, declinedNeg: 4, initialRatio: 0.9, agreedRatio: 0.99, avgRounds: 2.1 },
  1: { inquiries: 54, bookings: 16, revenueLakhs: 28.8, acceptedNeg: 14, counterNeg: 3, declinedNeg: 4, initialRatio: 0.91, agreedRatio: 1.0, avgRounds: 2.0 },
  2: { inquiries: 32, bookings: 9, revenueLakhs: 15.2, acceptedNeg: 8, counterNeg: 2, declinedNeg: 3, initialRatio: 0.88, agreedRatio: 0.95, avgRounds: 2.3 },
  3: { inquiries: 48, bookings: 14, revenueLakhs: 25.1, acceptedNeg: 13, counterNeg: 3, declinedNeg: 3, initialRatio: 0.91, agreedRatio: 0.99, avgRounds: 2.1 },
  4: { inquiries: 62, bookings: 19, revenueLakhs: 34.6, acceptedNeg: 17, counterNeg: 4, declinedNeg: 4, initialRatio: 0.92, agreedRatio: 1.02, avgRounds: 1.9 },
  5: { inquiries: 41, bookings: 11, revenueLakhs: 19.8, acceptedNeg: 10, counterNeg: 2, declinedNeg: 3, initialRatio: 0.89, agreedRatio: 0.96, avgRounds: 2.2 },
  6: { inquiries: 24, bookings: 6, revenueLakhs: 10.4, acceptedNeg: 6, counterNeg: 2, declinedNeg: 2, initialRatio: 0.86, agreedRatio: 0.92, avgRounds: 2.5 },
  7: { inquiries: 29, bookings: 8, revenueLakhs: 13.8, acceptedNeg: 7, counterNeg: 2, declinedNeg: 2, initialRatio: 0.87, agreedRatio: 0.94, avgRounds: 2.3 },
  8: { inquiries: 38, bookings: 10, revenueLakhs: 18.2, acceptedNeg: 9, counterNeg: 3, declinedNeg: 2, initialRatio: 0.89, agreedRatio: 0.96, avgRounds: 2.2 },
  9: { inquiries: 52, bookings: 15, revenueLakhs: 27.6, acceptedNeg: 14, counterNeg: 3, declinedNeg: 3, initialRatio: 0.91, agreedRatio: 0.99, avgRounds: 2.0 },
  10: { inquiries: 78, bookings: 24, revenueLakhs: 44.5, acceptedNeg: 22, counterNeg: 5, declinedNeg: 4, initialRatio: 0.92, agreedRatio: 1.04, avgRounds: 1.8 },
  11: { inquiries: 64, bookings: 18, revenueLakhs: 33.0, acceptedNeg: 16, counterNeg: 4, declinedNeg: 4, initialRatio: 0.9, agreedRatio: 1.0, avgRounds: 2.0 },
};

export const VenuePerformanceTab: React.FC<VenuePerformanceTabProps> = ({
  venue,
  bookings,
  negotiations,
  onOpenNegotiationInbox,
}) => {
  const { language } = useLanguage();
  const isNepali = language === 'ne';

  const [selectedHallId, setSelectedHallId] = useState<string>('ALL');
  const [trendMode, setTrendMode] = useState<'VOLUME' | 'REVENUE' | 'CONVERSION'>('VOLUME');
  const [csvExported, setCsvExported] = useState(false);

  const selectedHall = useMemo(
    () => venue.halls.find((h) => h.id === selectedHallId) || null,
    [venue.halls, selectedHallId]
  );

  // Build rolling Past 6 Months data combining venue baseline + live session bookings & negotiations
  const sixMonthData: SixMonthPerfPoint[] = useMemo(() => {
    const hallScale =
      selectedHallId === 'ALL'
        ? 1
        : Math.max(0.35, 1 / Math.max(1, venue.halls.length));

    const basePlate = venue.cateringStartingNpr || 1650;
    const now = new Date();
    const points: SixMonthPerfPoint[] = [];

    // Filter live bookings and negotiations if scoped to a single hall
    const scopedBookings = bookings.filter(
      (b) =>
        b.status !== 'CANCELLED' &&
        (selectedHallId === 'ALL' || b.hallId === selectedHallId)
    );
    const scopedNegotiations = negotiations.filter((n) => {
      if (selectedHallId === 'ALL') return true;
      const latest = n.versions[n.versions.length - 1];
      return latest?.hallId === selectedHallId;
    });

    for (let offset = 5; offset >= 0; offset--) {
      const dt = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      const monthIdx = dt.getMonth();
      const yearNum = dt.getFullYear();
      const monthShort = dt.toLocaleString('en-US', { month: 'short' });
      const monthKey = `${yearNum}-${String(monthIdx + 1).padStart(2, '0')}`;
      const base = MONTH_SEASON_BASELINE[monthIdx];

      // Check live records falling in this calendar month (or attribute live session activity to current month if outside past 6m window)
      const isCurrentMonth = offset === 0;
      const matchingBookings = scopedBookings.filter((b) => {
        const d = new Date(b.createdAt);
        if (isNaN(d.getTime())) return isCurrentMonth;
        const bKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        return bKey === monthKey || (isCurrentMonth && d.getFullYear() < yearNum - 1);
      });

      const matchingNegs = scopedNegotiations.filter((n) => {
        const d = new Date(n.updatedAt || n.createdAt);
        if (isNaN(d.getTime())) return isCurrentMonth;
        const nKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        return nKey === monthKey || (isCurrentMonth && d.getFullYear() < yearNum - 1);
      });

      const liveBookingCount = matchingBookings.length;
      const liveRevenueLakhs = matchingBookings.reduce(
        (sum, b) => sum + (b.totalAmountNpr || 0) / 100000,
        0
      );

      const liveAcceptedNeg = matchingNegs.filter((n) => n.status === 'ACCEPTED').length;
      const liveActiveNeg = matchingNegs.filter(
        (n) =>
          n.status === 'SUBMITTED_TO_VENUE' ||
          n.status === 'COUNTER_BY_VENUE' ||
          n.status === 'COUNTER_BY_CUSTOMER'
      ).length;
      const liveDeclinedNeg = matchingNegs.filter(
        (n) => n.status === 'REJECTED' || n.status === 'EXPIRED'
      ).length;

      const inquiries = Math.round(base.inquiries * hallScale) + matchingNegs.length;
      const confirmedBookings = Math.round(base.bookings * hallScale) + liveBookingCount;
      const revenueLakhs = Number(
        (base.revenueLakhs * hallScale + liveRevenueLakhs).toFixed(1)
      );

      const acceptedNegotiations =
        Math.round(base.acceptedNeg * hallScale) + liveAcceptedNeg;
      const counterActiveNegotiations =
        Math.round(base.counterNeg * hallScale) + liveActiveNeg;
      const declinedNegotiations =
        Math.round(base.declinedNeg * hallScale) + liveDeclinedNeg;
      const totalNegotiations =
        acceptedNegotiations + counterActiveNegotiations + declinedNegotiations;

      // Blend live negotiation price outcomes when available
      let avgInitialPlateNpr = Math.round((basePlate * base.initialRatio) / 10) * 10;
      let avgAgreedPlateNpr = Math.round((basePlate * base.agreedRatio) / 10) * 10;
      const avgCounterPlateNpr = Math.round((avgInitialPlateNpr + avgAgreedPlateNpr) / 2);

      if (matchingNegs.length > 0) {
        const liveInitialAvg =
          matchingNegs.reduce((acc, n) => acc + (n.versions[0]?.proposedPerPlateNpr || basePlate), 0) /
          matchingNegs.length;
        const liveFinalAvg =
          matchingNegs.reduce(
            (acc, n) =>
              acc + (n.versions[n.versions.length - 1]?.proposedPerPlateNpr || basePlate),
            0
          ) / matchingNegs.length;
        avgInitialPlateNpr = Math.round((avgInitialPlateNpr * 0.7 + liveInitialAvg * 0.3) / 10) * 10;
        avgAgreedPlateNpr = Math.round((avgAgreedPlateNpr * 0.7 + liveFinalAvg * 0.3) / 10) * 10;
      }

      const concessionPct =
        avgAgreedPlateNpr > 0
          ? Number((((avgAgreedPlateNpr - avgInitialPlateNpr) / avgAgreedPlateNpr) * 100).toFixed(1))
          : 0;

      points.push({
        monthKey,
        monthLabel: `${monthShort} ${String(yearNum).slice(-2)}`,
        bsMonth: AD_TO_BS_MONTH[monthIdx] || '',
        inquiries,
        bookings: confirmedBookings,
        conversionRatePct: inquiries > 0 ? Number(((confirmedBookings / inquiries) * 100).toFixed(1)) : 0,
        revenueLakhs,
        acceptedNegotiations,
        counterActiveNegotiations,
        declinedNegotiations,
        totalNegotiations,
        acceptanceRatePct:
          totalNegotiations > 0
            ? Number(((acceptedNegotiations / totalNegotiations) * 100).toFixed(1))
            : 0,
        avgInitialPlateNpr,
        avgCounterPlateNpr,
        avgAgreedPlateNpr,
        avgConcessionPct: concessionPct,
        avgRoundsToClose: base.avgRounds,
      });
    }

    return points;
  }, [venue, bookings, negotiations, selectedHallId]);

  // 6-Month Aggregate KPIs
  const summaryKpis = useMemo(() => {
    const totalInquiries = sixMonthData.reduce((s, d) => s + d.inquiries, 0);
    const totalBookings = sixMonthData.reduce((s, d) => s + d.bookings, 0);
    const totalRevenueLakhs = sixMonthData.reduce((s, d) => s + d.revenueLakhs, 0);
    const totalAccepted = sixMonthData.reduce((s, d) => s + d.acceptedNegotiations, 0);
    const totalNegotiations = sixMonthData.reduce((s, d) => s + d.totalNegotiations, 0);

    const avgAgreedPlate = Math.round(
      sixMonthData.reduce((s, d) => s + d.avgAgreedPlateNpr, 0) / sixMonthData.length
    );
    const avgInitialPlate = Math.round(
      sixMonthData.reduce((s, d) => s + d.avgInitialPlateNpr, 0) / sixMonthData.length
    );
    const avgRounds = (
      sixMonthData.reduce((s, d) => s + d.avgRoundsToClose, 0) / sixMonthData.length
    ).toFixed(1);

    const peakMonth = [...sixMonthData].sort((a, b) => b.bookings - a.bookings)[0];

    return {
      totalInquiries,
      totalBookings,
      conversionPct: totalInquiries > 0 ? ((totalBookings / totalInquiries) * 100).toFixed(1) : '0.0',
      totalRevenueLakhs: totalRevenueLakhs.toFixed(1),
      acceptanceRatePct:
        totalNegotiations > 0 ? ((totalAccepted / totalNegotiations) * 100).toFixed(1) : '0.0',
      totalAccepted,
      totalNegotiations,
      avgAgreedPlate,
      avgInitialPlate,
      avgPlateSpreadNpr: avgAgreedPlate - avgInitialPlate,
      avgRounds,
      peakMonth,
    };
  }, [sixMonthData]);

  const handleExportCsv = () => {
    const headers = [
      'Month',
      'BS Period',
      'Inquiries',
      'Confirmed Bookings',
      'Conversion (%)',
      'Revenue (NPR Lakhs)',
      'Accepted Negotiations',
      'Counter/Active Negotiations',
      'Declined/Expired',
      'Acceptance Rate (%)',
      'Avg Initial Rate (NPR/plate)',
      'Avg Agreed Rate (NPR/plate)',
      'Avg Rounds',
    ];
    const rows = sixMonthData.map((d) => [
      d.monthLabel,
      d.bsMonth,
      d.inquiries,
      d.bookings,
      d.conversionRatePct,
      d.revenueLakhs,
      d.acceptedNegotiations,
      d.counterActiveNegotiations,
      d.declinedNegotiations,
      d.acceptanceRatePct,
      d.avgInitialPlateNpr,
      d.avgAgreedPlateNpr,
      d.avgRoundsToClose,
    ]);
    const csv =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute(
      'download',
      `SAGUNOO_Venue_Performance_6M_${venue.name.replace(/\s+/g, '_')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCsvExported(true);
    setTimeout(() => setCsvExported(false), 2500);
  };

  if (sixMonthData.length === 0) {
    return (
      <div className="p-10 bg-white rounded-3xl border border-stone-200 text-center space-y-3">
        <BarChart3 className="w-8 h-8 text-stone-400 mx-auto" />
        <h3 className="font-display text-lg font-bold text-stone-900">
          No 6-Month Performance Data Available
        </h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Once customer inquiries, bookings, or counter-offers arrive for your venue, 6-month charts
          will populate automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="p-5 sm:p-6 bg-white rounded-2xl border border-stone-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
            <span className="font-semibold text-amber-800 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{isNepali ? 'भेन्यु कार्यसम्पादन (६ महिना)' : 'Venue Performance · Past 6 Months'}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>{selectedHall ? selectedHall.name : `All ${venue.halls.length} Halls`}</span>
          </div>
          <h3 className="font-display text-xl font-bold text-stone-900">
            {venue.name} — 6-Month Bookings, Inquiries &amp; Negotiation Outcomes
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <select
            aria-label="Filter performance by hall"
            value={selectedHallId}
            onChange={(e) => setSelectedHallId(e.target.value)}
            className="px-3 py-2 bg-white border border-stone-200 rounded-xl font-semibold text-stone-800 focus:outline-none focus:border-amber-800"
          >
            <option value="ALL">All Halls &amp; Lawns ({venue.halls.length})</option>
            {venue.halls.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>

          {onOpenNegotiationInbox && (
            <button
              type="button"
              onClick={onOpenNegotiationInbox}
              className="px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-800" />
              <span>Open Leads Inbox</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-950 text-white font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{csvExported ? 'Exported CSV' : 'Export 6M CSV'}</span>
          </button>
        </div>
      </div>

      {/* 4-Column KPI Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium">6M Confirmed Bookings</span>
            <Calendar className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold font-display text-stone-900 tabular-nums">
            {summaryKpis.totalBookings} Events
          </div>
          <div className="text-[11px] text-stone-500 tabular-nums">
            NPR {summaryKpis.totalRevenueLakhs}L rev · Peak: {summaryKpis.peakMonth?.monthLabel} ({summaryKpis.peakMonth?.bookings})
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium">6M Inquiry Volume</span>
            <TrendingUp className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-bold font-display text-stone-900 tabular-nums">
            {summaryKpis.totalInquiries} Leads
          </div>
          <div className="text-[11px] text-stone-500 tabular-nums">
            Lead-to-booking conversion: <strong className="text-emerald-800">{summaryKpis.conversionPct}%</strong>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium">Negotiation Close Rate</span>
            <Handshake className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold font-display text-stone-900 tabular-nums">
            {summaryKpis.acceptanceRatePct}%
          </div>
          <div className="text-[11px] text-stone-500 tabular-nums">
            {summaryKpis.totalAccepted}/{summaryKpis.totalNegotiations} accepted · Avg {summaryKpis.avgRounds} rounds
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium">Avg Agreed Plate Outcome</span>
            <CheckCircle2 className="w-4 h-4 text-amber-800" />
          </div>
          <div className="text-2xl font-bold font-display text-stone-900 tabular-nums">
            NPR {summaryKpis.avgAgreedPlate.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-500 tabular-nums">
            vs avg initial ask NPR {summaryKpis.avgInitialPlate.toLocaleString()} (+NPR{' '}
            {Math.abs(summaryKpis.avgPlateSpreadNpr).toLocaleString()} recovered)
          </div>
        </div>
      </div>

      {/* Chart 1: 6-Month Booking Trends & Inquiry Volume */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <h4 className="font-display text-base font-bold text-stone-900">
              01. Booking Trends &amp; Inquiry Volume (Past 6 Months)
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              Monthly customer inquiries received alongside confirmed bookings, revenue (NPR Lakhs), and conversion efficiency.
            </p>
          </div>

          <div className="inline-flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs font-semibold shrink-0">
            <button
              type="button"
              onClick={() => setTrendMode('VOLUME')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                trendMode === 'VOLUME' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Inquiries &amp; Bookings
            </button>
            <button
              type="button"
              onClick={() => setTrendMode('REVENUE')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                trendMode === 'REVENUE' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Revenue Curve
            </button>
            <button
              type="button"
              onClick={() => setTrendMode('CONVERSION')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                trendMode === 'CONVERSION' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Conversion %
            </button>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            {trendMode === 'VOLUME' ? (
              <ComposedChart data={sixMonthData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1ee" />
                <XAxis
                  dataKey="monthLabel"
                  tick={{ fontSize: 11, fill: '#57534e' }}
                  axisLine={{ stroke: '#e7e5e4' }}
                />
                <YAxis
                  yAxisId="counts"
                  tick={{ fontSize: 11, fill: '#57534e' }}
                  axisLine={{ stroke: '#e7e5e4' }}
                />
                <YAxis
                  yAxisId="rev"
                  orientation="right"
                  unit="L"
                  tick={{ fontSize: 11, fill: '#57534e' }}
                  axisLine={{ stroke: '#e7e5e4' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload as SixMonthPerfPoint;
                    return (
                      <div className="bg-stone-900 text-white p-3.5 rounded-xl text-xs space-y-1.5 border border-stone-800 shadow-lg min-w-[210px]">
                        <div className="font-bold text-amber-300 border-b border-stone-800 pb-1">
                          {d.monthLabel} · {d.bsMonth}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-amber-300">Inquiry Volume:</span>
                          <strong className="tabular-nums">{d.inquiries} leads</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-emerald-400">Confirmed Bookings:</span>
                          <strong className="tabular-nums">{d.bookings} events</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-300">Conversion Rate:</span>
                          <strong className="tabular-nums">{d.conversionRatePct}%</strong>
                        </div>
                        <div className="flex justify-between border-t border-stone-800 pt-1">
                          <span className="text-stone-300">Booking Revenue:</span>
                          <strong className="tabular-nums">NPR {d.revenueLakhs} Lakhs</strong>
                        </div>
                      </div>
                    );
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Bar
                  yAxisId="counts"
                  dataKey="inquiries"
                  name="Inquiry Volume"
                  fill="#d97706"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                <Bar
                  yAxisId="counts"
                  dataKey="bookings"
                  name="Confirmed Bookings"
                  fill="#059669"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                <Line
                  yAxisId="rev"
                  type="monotone"
                  dataKey="revenueLakhs"
                  name="Booking Revenue (NPR Lakhs)"
                  stroke="#78350f"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#78350f' }}
                />
              </ComposedChart>
            ) : trendMode === 'REVENUE' ? (
              <ComposedChart data={sixMonthData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <defs>
                  <linearGradient id="perfRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#92400e" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#92400e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1ee" />
                <XAxis dataKey="monthLabel" tick={{ fontSize: 11, fill: '#57534e' }} axisLine={{ stroke: '#e7e5e4' }} />
                <YAxis unit="L" tick={{ fontSize: 11, fill: '#57534e' }} axisLine={{ stroke: '#e7e5e4' }} />
                <Tooltip formatter={(val: any) => [`NPR ${val} Lakhs`, 'Revenue']} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Area
                  type="monotone"
                  dataKey="revenueLakhs"
                  name="Gross Booking Revenue (NPR Lakhs)"
                  stroke="#92400e"
                  strokeWidth={2.5}
                  fill="url(#perfRevGrad)"
                />
              </ComposedChart>
            ) : (
              <LineChart data={sixMonthData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1ee" />
                <XAxis dataKey="monthLabel" tick={{ fontSize: 11, fill: '#57534e' }} axisLine={{ stroke: '#e7e5e4' }} />
                <YAxis unit="%" domain={[0, 60]} tick={{ fontSize: 11, fill: '#57534e' }} axisLine={{ stroke: '#e7e5e4' }} />
                <Tooltip formatter={(val: any) => [`${val}%`, 'Conversion Rate']} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Line
                  type="monotone"
                  dataKey="conversionRatePct"
                  name="Inquiry-to-Booking Conversion (%)"
                  stroke="#059669"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#059669' }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts 2 & 3 Grid: Negotiation Outcomes & Price Realization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 2: Negotiation Outcomes Breakdown & Close Rate */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h4 className="font-display text-base font-bold text-stone-900">
              02. Negotiation Outcomes Breakdown (6 Months)
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              Accepted agreements vs. countering/active vs. declined threads with monthly acceptance %.
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={270}>
              <BarChart data={sixMonthData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1ee" />
                <XAxis dataKey="monthLabel" tick={{ fontSize: 11, fill: '#57534e' }} axisLine={{ stroke: '#e7e5e4' }} />
                <YAxis yAxisId="negCount" tick={{ fontSize: 11, fill: '#57534e' }} axisLine={{ stroke: '#e7e5e4' }} />
                <YAxis
                  yAxisId="pct"
                  orientation="right"
                  unit="%"
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: '#57534e' }}
                  axisLine={{ stroke: '#e7e5e4' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload as SixMonthPerfPoint;
                    return (
                      <div className="bg-stone-900 text-white p-3 rounded-xl text-xs space-y-1 border border-stone-800 shadow-lg">
                        <div className="font-bold text-amber-300 pb-1 border-b border-stone-800">
                          {d.monthLabel} · {d.totalNegotiations} Threads
                        </div>
                        <div className="flex justify-between gap-4 text-emerald-400">
                          <span>Accepted:</span>
                          <strong className="tabular-nums">{d.acceptedNegotiations}</strong>
                        </div>
                        <div className="flex justify-between gap-4 text-amber-300">
                          <span>Countering / Open:</span>
                          <strong className="tabular-nums">{d.counterActiveNegotiations}</strong>
                        </div>
                        <div className="flex justify-between gap-4 text-rose-400">
                          <span>Declined / Expired:</span>
                          <strong className="tabular-nums">{d.declinedNegotiations}</strong>
                        </div>
                        <div className="flex justify-between gap-4 border-t border-stone-800 pt-1">
                          <span>Acceptance Rate:</span>
                          <strong className="tabular-nums">{d.acceptanceRatePct}%</strong>
                        </div>
                      </div>
                    );
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                <Bar
                  yAxisId="negCount"
                  dataKey="acceptedNegotiations"
                  stackId="outcomes"
                  name="Accepted"
                  fill="#059669"
                />
                <Bar
                  yAxisId="negCount"
                  dataKey="counterActiveNegotiations"
                  stackId="outcomes"
                  name="Countering / Active"
                  fill="#d97706"
                />
                <Bar
                  yAxisId="negCount"
                  dataKey="declinedNegotiations"
                  stackId="outcomes"
                  name="Declined / Expired"
                  fill="#dc2626"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="pct"
                  type="monotone"
                  dataKey="acceptanceRatePct"
                  name="Acceptance Rate %"
                  stroke="#1c1917"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#1c1917' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Average Negotiation Price Realization (Initial Proposal vs Agreed Rate) */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h4 className="font-display text-base font-bold text-stone-900">
              03. Average Negotiation Rate Outcomes (NPR / Plate)
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              Compares monthly customer initial per-plate ask against venue counter-offers and final agreed rate.
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={270}>
              <LineChart data={sixMonthData} margin={{ top: 10, right: 15, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1ee" />
                <XAxis dataKey="monthLabel" tick={{ fontSize: 11, fill: '#57534e' }} axisLine={{ stroke: '#e7e5e4' }} />
                <YAxis
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 11, fill: '#57534e' }}
                  tickFormatter={(v) => `${v}`}
                  axisLine={{ stroke: '#e7e5e4' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload as SixMonthPerfPoint;
                    const uplift = d.avgAgreedPlateNpr - d.avgInitialPlateNpr;
                    return (
                      <div className="bg-stone-900 text-white p-3 rounded-xl text-xs space-y-1 border border-stone-800 shadow-lg">
                        <div className="font-bold text-amber-300 pb-1 border-b border-stone-800">
                          {d.monthLabel} Avg Pricing Outcome
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-stone-300">Client Initial Ask:</span>
                          <strong className="tabular-nums">
                            NPR {d.avgInitialPlateNpr.toLocaleString()}
                          </strong>
                        </div>
                        <div className="flex justify-between gap-4 text-amber-300">
                          <span>Mid Counter-Offer:</span>
                          <strong className="tabular-nums">
                            NPR {d.avgCounterPlateNpr.toLocaleString()}
                          </strong>
                        </div>
                        <div className="flex justify-between gap-4 text-emerald-400">
                          <span>Final Agreed Rate:</span>
                          <strong className="tabular-nums">
                            NPR {d.avgAgreedPlateNpr.toLocaleString()}
                          </strong>
                        </div>
                        <div className="flex justify-between gap-4 border-t border-stone-800 pt-1 text-stone-200">
                          <span>Net Counter Recovery:</span>
                          <strong className="tabular-nums">
                            {uplift >= 0 ? '+' : ''}NPR {uplift.toLocaleString()}/plate ({d.avgRoundsToClose} rounds)
                          </strong>
                        </div>
                      </div>
                    );
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                <Line
                  type="monotone"
                  dataKey="avgAgreedPlateNpr"
                  name="Final Agreed (NPR)"
                  stroke="#059669"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#059669' }}
                />
                <Line
                  type="monotone"
                  dataKey="avgCounterPlateNpr"
                  name="Counter-Offer Avg (NPR)"
                  stroke="#d97706"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#d97706' }}
                />
                <Line
                  type="monotone"
                  dataKey="avgInitialPlateNpr"
                  name="Client Initial Ask (NPR)"
                  stroke="#78716c"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#78716c' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* High-Density 6-Month Summary Ledger Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <h4 className="font-display text-sm sm:text-base font-bold text-stone-900">
            6-Month Venue Performance &amp; Negotiation Ledger
          </h4>
          <span className="text-xs text-stone-500 tabular-nums">All monetary figures in NPR</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600">
                <th className="py-2.5 px-4">Month</th>
                <th className="py-2.5 px-4 text-right">Inquiries</th>
                <th className="py-2.5 px-4 text-right">Bookings</th>
                <th className="py-2.5 px-4 text-right">Conv. Rate</th>
                <th className="py-2.5 px-4 text-right">Neg. Accepted / Total</th>
                <th className="py-2.5 px-4 text-right">Avg Initial Ask</th>
                <th className="py-2.5 px-4 text-right">Avg Agreed Rate</th>
                <th className="py-2.5 px-4 text-right">Avg Rounds</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sixMonthData.map((row) => (
                <tr key={row.monthKey} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-stone-900">
                    <div>{row.monthLabel}</div>
                    <div className="text-[11px] font-normal text-stone-500">{row.bsMonth}</div>
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-stone-800">{row.inquiries}</td>
                  <td className="py-3 px-4 text-right tabular-nums font-bold text-emerald-800">
                    {row.bookings}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-stone-700">
                    {row.conversionRatePct}%
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-stone-800">
                    {row.acceptedNegotiations} / {row.totalNegotiations} ({row.acceptanceRatePct}%)
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-stone-600">
                    NPR {row.avgInitialPlateNpr.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums font-bold text-stone-950">
                    NPR {row.avgAgreedPlateNpr.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-stone-600">
                    {row.avgRoundsToClose}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
