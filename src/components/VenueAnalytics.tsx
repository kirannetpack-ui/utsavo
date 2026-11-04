/**
 * UTSAVO - Venue Operator Analytics & Business Intelligence Dashboard
 * Powered by Recharts for real-time visualization of booking trends,
 * hourly inquiry volume, sales conversion funnel, and hall shift utilization.
 */

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Clock,
  Filter,
  Calendar,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Sparkles,
  CheckCircle2,
  Building2,
  AlertTriangle,
  Flame,
  ChevronRight,
  Award,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Venue, Booking, NegotiationThread } from '../types';

interface VenueAnalyticsProps {
  venue: Venue;
  bookings: Booking[];
  negotiations: NegotiationThread[];
}

// 12 Bikram Sambat months data reflecting Nepal's wedding seasons & festive periods
const MONTHLY_SEASON_DATA = [
  { month: 'Baisakh', bsMonth: 'बैशाख', bookings: 14, revenueLakhs: 24.5, inquiries: 42, avgPlateNpr: 1650, season: 'Spring Wedding Peak' },
  { month: 'Jestha', bsMonth: 'जेठ', bookings: 18, revenueLakhs: 31.8, inquiries: 56, avgPlateNpr: 1720, season: 'High Wedding Peak' },
  { month: 'Ashad', bsMonth: 'असार', bookings: 9, revenueLakhs: 15.2, inquiries: 28, avgPlateNpr: 1580, season: 'Monsoon / Mid' },
  { month: 'Shrawan', bsMonth: 'साउन', bookings: 4, revenueLakhs: 6.4, inquiries: 16, avgPlateNpr: 1450, season: 'Holy Month (Lagan Off)' },
  { month: 'Bhadra', bsMonth: 'भदौ', bookings: 6, revenueLakhs: 9.8, inquiries: 22, avgPlateNpr: 1500, season: 'Teej Celebrations' },
  { month: 'Ashwin', bsMonth: 'असोज', bookings: 8, revenueLakhs: 13.5, inquiries: 30, avgPlateNpr: 1550, season: 'Dashain Feasts' },
  { month: 'Kartik', bsMonth: 'कात्तिक', bookings: 12, revenueLakhs: 21.0, inquiries: 45, avgPlateNpr: 1680, season: 'Tihar & Receptions' },
  { month: 'Mangsir', bsMonth: 'मंसिर', bookings: 26, revenueLakhs: 48.6, inquiries: 84, avgPlateNpr: 1850, season: 'Super Peak Lagan' },
  { month: 'Poush', bsMonth: 'पुष', bookings: 5, revenueLakhs: 8.2, inquiries: 19, avgPlateNpr: 1500, season: 'Winter Off-Peak' },
  { month: 'Magh', bsMonth: 'माघ', bookings: 21, revenueLakhs: 37.4, inquiries: 68, avgPlateNpr: 1780, season: 'Winter Wedding Peak' },
  { month: 'Falgun', bsMonth: 'फागुन', bookings: 16, revenueLakhs: 28.0, inquiries: 51, avgPlateNpr: 1700, season: 'Spring Lagan' },
  { month: 'Chaitra', bsMonth: 'चैत', bookings: 7, revenueLakhs: 11.6, inquiries: 24, avgPlateNpr: 1550, season: 'Fiscal Year End' },
];

// Hourly inquiry distribution across the day in Nepal (06:00 to 23:00)
const HOURLY_INQUIRY_DATA = [
  { hour: '06:00', inquiries: 2, conversionRate: 15, label: 'Early Morning' },
  { hour: '07:00', inquiries: 4, conversionRate: 20, label: 'Morning' },
  { hour: '08:00', inquiries: 9, conversionRate: 28, label: 'Morning' },
  { hour: '09:00', inquiries: 16, conversionRate: 34, label: 'Work Commute' },
  { hour: '10:00', inquiries: 24, conversionRate: 36, label: 'Office Hours' },
  { hour: '11:00', inquiries: 31, conversionRate: 38, label: 'Mid-Morning' },
  { hour: '12:00', inquiries: 46, conversionRate: 42, label: 'Lunch Break' },
  { hour: '13:00', inquiries: 54, conversionRate: 44, label: 'Lunch Peak' },
  { hour: '14:00', inquiries: 38, conversionRate: 39, label: 'Afternoon' },
  { hour: '15:00', inquiries: 29, conversionRate: 35, label: 'Afternoon' },
  { hour: '16:00', inquiries: 33, conversionRate: 37, label: 'Late Afternoon' },
  { hour: '17:00', inquiries: 42, conversionRate: 40, label: 'Evening Transit' },
  { hour: '18:00', inquiries: 68, conversionRate: 49, label: 'Family Planning' },
  { hour: '19:00', inquiries: 82, conversionRate: 53, label: 'Peak Golden Hour' },
  { hour: '20:00', inquiries: 76, conversionRate: 51, label: 'Dinner / Family' },
  { hour: '21:00', inquiries: 52, conversionRate: 45, label: 'Evening' },
  { hour: '22:00', inquiries: 26, conversionRate: 32, label: 'Late Night' },
  { hour: '23:00', inquiries: 11, conversionRate: 21, label: 'Night' },
];

// Conversion Funnel data
const FUNNEL_STAGES = [
  { stage: '1. Venue Inquiries & Leads', count: 386, rate: 100, drop: '0%', fill: '#d97706', description: 'Total catalog inquiries & date checks' },
  { stage: '2. Date & Muhurat Verified', count: 288, rate: 74.6, drop: '-25.4%', fill: '#b45309', description: 'Calendar availability confirmed' },
  { stage: '3. Physical Visit & Food Tasting', count: 184, rate: 47.7, drop: '-36.1%', fill: '#92400e', description: 'Palace walkthrough with parents' },
  { stage: '4. Negotiation & Counter-Offers', count: 128, rate: 33.2, drop: '-30.4%', fill: '#78350f', description: 'Menu per-plate & hall pricing agreed' },
  { stage: '5. Legal Agreement Drafted', count: 96, rate: 24.9, drop: '-25.0%', fill: '#451a03', description: 'Terms, DJ cutoff, & refund policy signed' },
  { stage: '6. Confirmed Advance Deposit', count: 84, rate: 21.8, drop: '-12.5%', fill: '#047857', description: 'eSewa/Khalti/Bank deposit received' },
];

// Shift breakdown
const SHIFT_PIE_DATA = [
  { name: 'Day Shift (दिउँसो)', value: 42, count: 61, color: '#f59e0b', note: '11:00 AM - 04:00 PM' },
  { name: 'Evening Shift (साँझ)', value: 36, count: 52, color: '#b45309', note: '05:00 PM - 10:30 PM' },
  { name: 'Morning Shift (बिहान)', value: 14, count: 20, color: '#10b981', note: '07:00 AM - 11:30 AM' },
  { name: 'Full Day Grand (दिनभरि)', value: 8, count: 12, color: '#78350f', note: 'All-day exclusive access' },
];

// Event Type breakdown
const EVENT_TYPE_DATA = [
  { name: 'Weddings (विवाह)', percentage: 48, revenueShare: 56, color: '#991b1b' },
  { name: 'Receptions (प्रीतिभोज)', percentage: 24, revenueShare: 25, color: '#d97706' },
  { name: 'Bratabandha / Pasni', percentage: 16, revenueShare: 11, color: '#059669' },
  { name: 'Corporate & Galas', percentage: 8, revenueShare: 6, color: '#2563eb' },
  { name: 'Birthdays & Others', percentage: 4, revenueShare: 2, color: '#7c3aed' },
];

export const VenueAnalytics: React.FC<VenueAnalyticsProps> = ({
  venue,
  bookings,
  negotiations,
}) => {
  const { language } = useLanguage();
  const isNepali = language === 'ne';

  // Timeframe filter state
  const [timeRange, setTimeRange] = useState<'FY_2081_82' | 'PEAK_SEASON' | 'LAST_6_MONTHS' | 'ALL_TIME'>('FY_2081_82');
  const [trendMetric, setTrendMetric] = useState<'revenue' | 'bookings' | 'inquiries'>('revenue');
  const [selectedHall, setSelectedHall] = useState<string>('ALL');
  const [reportExported, setReportExported] = useState(false);

  // Filtered dataset for monthly trends
  const filteredMonthlyData = useMemo(() => {
    if (timeRange === 'PEAK_SEASON') {
      return MONTHLY_SEASON_DATA.filter((m) =>
        ['Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun'].includes(m.month)
      );
    }
    if (timeRange === 'LAST_6_MONTHS') {
      return MONTHLY_SEASON_DATA.slice(6);
    }
    return MONTHLY_SEASON_DATA;
  }, [timeRange]);

  // Aggregate numbers
  const totalAnnualRevenueLakhs = filteredMonthlyData.reduce((acc, m) => acc + m.revenueLakhs, 0);
  const totalAnnualBookings = filteredMonthlyData.reduce((acc, m) => acc + m.bookings, 0);
  const totalAnnualInquiries = filteredMonthlyData.reduce((acc, m) => acc + m.inquiries, 0);
  const overallConversionPct = ((totalAnnualBookings / totalAnnualInquiries) * 100).toFixed(1);

  const handleExportCSV = () => {
    const headers = ['Month (BS)', 'Month (AD)', 'Season', 'Bookings', 'Revenue (NPR Lakhs)', 'Inquiries', 'Avg Plate Rate (NPR)'];
    const rows = filteredMonthlyData.map((d) => [
      d.bsMonth,
      d.month,
      `"${d.season}"`,
      d.bookings,
      d.revenueLakhs,
      d.inquiries,
      d.avgPlateNpr,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `UTSAVO_Analytics_${venue.name.replace(/\s+/g, '_')}_2081.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setReportExported(true);
    setTimeout(() => setReportExported(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Controls Bar */}
      <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              {isNepali ? 'व्यापारिक विश्लेषण र भविष्यवाणी' : 'Venue Intelligence & Predictive Analytics'}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
              BS 2081/82
            </span>
          </div>
          <h3 className="font-display text-xl font-bold text-stone-900 mt-1">
            {isNepali ? `${venue.nepaliName || venue.name} को कार्यसम्पादन रिपोर्ट` : `${venue.name} Performance Dashboard`}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {isNepali
              ? 'लगन सिजनको ट्रेन्ड, सोधपुछ समय, र कन्भर्सन दरको प्रत्यक्ष तथ्याङ्क'
              : 'Real-time charts tracking Muhurat season surge, inquiry peak hours, and negotiation-to-booking conversions.'}
          </p>
        </div>

        {/* Global Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Timeframe Selector */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => setTimeRange('FY_2081_82')}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                timeRange === 'FY_2081_82' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {isNepali ? 'आ.व. २०८१/८२' : 'FY 2081/82'}
            </button>
            <button
              onClick={() => setTimeRange('PEAK_SEASON')}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                timeRange === 'PEAK_SEASON' ? 'bg-amber-900 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Flame className="w-3 h-3 text-amber-400" />
              <span>{isNepali ? 'लगन सिजन (मंसिर-फागुन)' : 'Wedding Season'}</span>
            </button>
            <button
              onClick={() => setTimeRange('LAST_6_MONTHS')}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                timeRange === 'LAST_6_MONTHS' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {isNepali ? 'पछिल्लो ६ महिना' : 'Last 6 Months'}
            </button>
          </div>

          {/* Hall Selector */}
          <select
            value={selectedHall}
            onChange={(e) => setSelectedHall(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-stone-800 font-semibold focus:outline-none"
          >
            <option value="ALL">{isNepali ? 'सबै हल तथा लन (All Halls)' : 'All Halls & Lawns'}</option>
            {venue.halls.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>

          {/* Export Report CSV */}
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-stone-900 hover:bg-black text-white rounded-xl font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            title="Download CSV report for accountant / auditor"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{reportExported ? (isNepali ? 'डाउनलोड भयो!' : 'Downloaded!') : isNepali ? 'निर्यात (CSV)' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Gross Revenue */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-50 to-amber-100/30 rounded-bl-full -z-0" />
          <div className="relative z-10 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {isNepali ? 'कुल अनुमानित आम्दानी' : 'Gross Event Revenue'}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +28.4%
              </span>
            </div>
            <div className="text-2xl font-bold font-display text-amber-950 tabular-nums">
              NPR {totalAnnualRevenueLakhs.toFixed(1)} Lakhs
            </div>
            <div className="text-[11px] text-stone-500 flex items-center justify-between pt-1">
              <span>NPR {(totalAnnualRevenueLakhs * 100000).toLocaleString()} total</span>
              <span className="text-emerald-700 font-semibold">vs 2080: +NPR 38L</span>
            </div>
          </div>
        </div>

        {/* Card 2: Confirmed Bookings */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="relative z-10 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {isNepali ? 'सम्पन्न तथा पक्का बुकिङ' : 'Confirmed Events'}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +19.2%
              </span>
            </div>
            <div className="text-2xl font-bold font-display text-amber-950 tabular-nums">
              {totalAnnualBookings} {isNepali ? 'उत्सवहरू' : 'Celebrations'}
            </div>
            <div className="text-[11px] text-stone-500 flex items-center justify-between pt-1">
              <span>Avg {Math.round(totalAnnualBookings / filteredMonthlyData.length)} events / mo</span>
              <span className="text-amber-800 font-semibold">Mangsir peak: 26</span>
            </div>
          </div>
        </div>

        {/* Card 3: Overall Conversion Rate */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="relative z-10 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {isNepali ? 'सोधपुछ-बुकिङ सफलता दर' : 'Lead-to-Booking Rate'}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                Top 5% Palace
              </span>
            </div>
            <div className="text-2xl font-bold font-display text-amber-950 tabular-nums">
              {overallConversionPct}%
            </div>
            <div className="text-[11px] text-stone-500 flex items-center justify-between pt-1">
              <span>{totalAnnualInquiries} total inquiries received</span>
              <span className="text-emerald-700 font-semibold">Market Avg: 16%</span>
            </div>
          </div>
        </div>

        {/* Card 4: Average Plate Realization */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="relative z-10 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {isNepali ? 'औसत प्रतिप्लेट दर' : 'Avg Plate Realization'}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +NPR 180
              </span>
            </div>
            <div className="text-2xl font-bold font-display text-amber-950 tabular-nums">
              NPR 1,720 <span className="text-xs font-normal text-stone-500">/ plate</span>
            </div>
            <div className="text-[11px] text-stone-500 flex items-center justify-between pt-1">
              <span>Gold Package most popular</span>
              <span className="text-amber-800 font-semibold">450 avg guests</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: BOOKING & REVENUE SEASONAL TRENDS CHART */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-800" />
              <h4 className="text-base font-bold text-stone-900">
                {isNepali ? '१. महिनागत बुकिङ तथा आम्दानी ट्रेन्ड (वि.सं. पात्रो अनुसार)' : '1. Monthly Booking & Revenue Trends (Bikram Sambat Calendar)'}
              </h4>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {isNepali
                ? 'नेपाली लगन (विवाह मुहूर्त) अनुसार मंसिर, माघ, जेठ र वैशाखमा देखिने उच्च चाप र आम्दानी'
                : 'Tracks booking volume, plate realization rates, and gross revenue across Nepal\'s auspicious muhurat calendar.'}
            </p>
          </div>

          {/* Metric Toggle */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setTrendMetric('revenue')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                trendMetric === 'revenue' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {isNepali ? 'आम्दानी (NPR Lakhs)' : 'Revenue (Lakhs NPR)'}
            </button>
            <button
              onClick={() => setTrendMetric('bookings')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                trendMetric === 'bookings' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {isNepali ? 'बुकिङ संख्या' : 'Bookings Count'}
            </button>
            <button
              onClick={() => setTrendMetric('inquiries')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                trendMetric === 'inquiries' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {isNepali ? 'सोधपुछ संख्या' : 'Inquiries'}
            </button>
          </div>
        </div>

        {/* Recharts Area / Bar Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            {trendMetric === 'revenue' ? (
              <AreaChart data={filteredMonthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b45309" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#b45309" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="plateGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#047857" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#047857" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1ee" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#78716c' }}
                  tickFormatter={(val, idx) => `${val} (${filteredMonthlyData[idx]?.bsMonth || ''})`}
                  axisLine={{ stroke: '#e7e5e4' }}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: '#78716c' }}
                  unit="L"
                  axisLine={{ stroke: '#e7e5e4' }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11, fill: '#78716c' }}
                  unit=" pts"
                  axisLine={{ stroke: '#e7e5e4' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-stone-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-stone-800">
                          <div className="font-bold flex items-center justify-between gap-3 border-b border-stone-800 pb-1">
                            <span className="text-amber-400 font-display text-sm">{data.month} ({data.bsMonth})</span>
                            <span className="text-[10px] text-stone-400 bg-stone-800 px-1.5 py-0.5 rounded">{data.season}</span>
                          </div>
                          <div className="text-emerald-400 font-semibold flex items-center justify-between">
                            <span>Revenue:</span>
                            <span className="tabular-nums font-bold">NPR {data.revenueLakhs} Lakhs</span>
                          </div>
                          <div className="text-stone-300 flex items-center justify-between">
                            <span>Events Booked:</span>
                            <span className="tabular-nums font-bold text-white">{data.bookings}</span>
                          </div>
                          <div className="text-stone-300 flex items-center justify-between">
                            <span>Avg Rate / Plate:</span>
                            <span className="tabular-nums font-bold text-amber-200">NPR {data.avgPlateNpr}</span>
                          </div>
                          <div className="text-stone-400 text-[10px] pt-1">
                            Inquiries received: {data.inquiries}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: 12, fontSize: 11 }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenueLakhs"
                  name="Gross Revenue (NPR Lakhs)"
                  stroke="#92400e"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revenueGrad)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="bookings"
                  name="Events Booked"
                  stroke="#047857"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#047857' }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            ) : trendMetric === 'bookings' ? (
              <BarChart data={filteredMonthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1ee" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#78716c' }}
                  tickFormatter={(val, idx) => `${val} (${filteredMonthlyData[idx]?.bsMonth || ''})`}
                  axisLine={{ stroke: '#e7e5e4' }}
                />
                <YAxis tick={{ fontSize: 11, fill: '#78716c' }} axisLine={{ stroke: '#e7e5e4' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-stone-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1">
                          <div className="font-bold text-amber-400">{data.month} ({data.bsMonth})</div>
                          <div className="text-white">Booked Events: <strong className="text-emerald-400">{data.bookings}</strong></div>
                          <div className="text-stone-300">Season: {data.season}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="bookings" name="Confirmed Bookings" fill="#b45309" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : (
              <BarChart data={filteredMonthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1ee" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#78716c' }}
                  tickFormatter={(val, idx) => `${val} (${filteredMonthlyData[idx]?.bsMonth || ''})`}
                  axisLine={{ stroke: '#e7e5e4' }}
                />
                <YAxis tick={{ fontSize: 11, fill: '#78716c' }} axisLine={{ stroke: '#e7e5e4' }} />
                <Tooltip />
                <Bar dataKey="inquiries" name="Customer Inquiries" fill="#d97706" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Insight Callout */}
        <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 flex items-start gap-3 text-xs text-amber-950">
          <Sparkles className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block">
              {isNepali ? 'मुहूर्त विश्लेषण र राजस्व सल्लाह:' : 'Seasonal Muhurat Strategy Insight:'}
            </span>
            <p className="text-amber-900 leading-relaxed">
              {isNepali
                ? 'मंसिर र माघ महिनामा कुल वार्षिक आम्दानीको ५२% उत्पन्न हुन्छ। यी महिनाहरूका शुभ लगन मितिहरूमा प्रतिप्लेट दर कम्तिमा NPR १८५० कायम गरी हल भाडा पूर्ण लिन सिफारिस गरिन्छ। अर्कोतर्फ, साउन र पुसको अफ-सिजनमा व्रतबन्ध र पास्नीका लागि विशेष प्याकेज दिनुहोस्।'
                : 'Mangsir and Magh drive 52% of total annual palace revenue. For these high-lagan dates, maintain a minimum plate price of NPR 1,850 and enforce non-negotiable hall minimums. For off-peak Shrawan and Poush, offer customized Bratabandha and Pasni packages to maximize hall utilization.'}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2 & 3 GRID: PEAK INQUIRY HOURS & CONVERSION FUNNEL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 2: PEAK INQUIRY HOURS */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-5">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-800" />
              <h4 className="text-base font-bold text-stone-900">
                {isNepali ? '२. दैनिक सोधपुछ समय र ग्राहक चाप' : '2. Peak Inquiry Hours & Golden Response Window'}
              </h4>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {isNepali
                ? 'ग्राहकहरूले कुन समयमा पार्टी प्यालेस खोज्छन्? (दिउँसो १ बजे र साँझ ७-९ बजे उच्च चाप)'
                : 'Hourly inquiry volume vs. conversion rate. Highlights prime times when families plan events.'}
            </p>
          </div>

          {/* Hourly Bar + Line Chart */}
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={260}>
              <BarChart data={HOURLY_INQUIRY_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1ee" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#78716c' }} axisLine={{ stroke: '#e7e5e4' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#78716c' }} axisLine={{ stroke: '#e7e5e4' }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#78716c' }} unit="%" axisLine={{ stroke: '#e7e5e4' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      const isPeak = d.inquiries >= 60;
                      return (
                        <div className="bg-stone-900 text-white p-2.5 rounded-xl text-xs space-y-1 shadow-lg">
                          <div className="font-bold flex items-center justify-between gap-2">
                            <span>{d.hour}</span>
                            {isPeak && <span className="bg-amber-500 text-black px-1.5 py-0.2 text-[9px] font-bold rounded">HIGH PEAK</span>}
                          </div>
                          <div className="text-stone-300">Phase: <strong>{d.label}</strong></div>
                          <div className="text-amber-400 font-semibold">Inquiries: {d.inquiries} leads</div>
                          <div className="text-emerald-400 font-semibold">Visit Conversion: {d.conversionRate}%</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="inquiries"
                  name="Inquiries Received"
                  radius={[4, 4, 0, 0]}
                >
                  {HOURLY_INQUIRY_DATA.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.inquiries >= 65 ? '#92400e' : entry.inquiries >= 40 ? '#d97706' : '#e7e5e4'}
                    />
                  ))}
                </Bar>
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="conversionRate"
                  name="Conversion Rate %"
                  stroke="#047857"
                  strokeWidth={2}
                  dot={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Actionable Time Guidance */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                {isNepali ? 'गोल्डेन समय: साँझ ६:०० देखि ९:०० सम्म' : 'Golden Hours: 6:00 PM – 9:00 PM'}
              </span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                53% Conv. Rate
              </span>
            </div>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              {isNepali
                ? 'नेपाली परिवारहरू बेलुकीको खाना खाने समयमा विवाहको छलफल गर्छन्। यस समयमा आउने सोधपुछलाई २० मिनेटभित्र काउन्टर अफर पठाउँदा बुकिङ पक्का हुने सम्भावना ३ गुणा बढी हुन्छ।'
                : 'Nepali families gather after work/dinner to finalize wedding details. Replying with an official counter-offer within 20 minutes between 6-9 PM yields a 3x higher booking rate before competitors respond.'}
            </p>
          </div>
        </div>

        {/* CHART 3: CONVERSION FUNNEL */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-amber-800" />
                <h4 className="text-base font-bold text-stone-900">
                  {isNepali ? '३. बुकिङ फनेल तथा कन्भर्सन दर' : '3. Lead-to-Confirmed Booking Funnel'}
                </h4>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                {isNepali
                  ? 'सोधपुछ देखि बैना (Deposit) सम्मको चरणबद्ध सफलता दर'
                  : 'Stage-by-stage drop-off tracking from initial interest to eSewa/Khalti deposit lock.'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-400 block">{isNepali ? 'समग्र सफलता दर' : 'Net Conversion'}</span>
              <span className="text-lg font-bold font-display text-emerald-700">21.8%</span>
            </div>
          </div>

          {/* Visual Step-by-Step Funnel Bars */}
          <div className="space-y-3 pt-1">
            {FUNNEL_STAGES.map((step, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: step.fill }} />
                    {step.stage}
                  </span>
                  <div className="flex items-center gap-2 tabular-nums">
                    <span className="font-bold text-stone-900">{step.count}</span>
                    <span className="text-[11px] font-bold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                      {step.rate}%
                    </span>
                    {idx > 0 && (
                      <span className="text-[10px] text-rose-600 font-medium">
                        {step.drop}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Track */}
                <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden flex">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${step.rate}%`,
                      backgroundColor: step.fill,
                    }}
                  />
                </div>
                <div className="text-[10px] text-stone-400 pl-3">
                  {step.description}
                </div>
              </div>
            ))}
          </div>

          {/* Funnel Bottleneck Insight */}
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1 text-emerald-950">
            <div className="font-bold flex items-center gap-1.5 text-emerald-900">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>{isNepali ? 'उच्चतम प्रभाव बिन्दु:' : 'Highest Leverage Conversion Point:'}</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              {isNepali
                ? 'प्रत्यक्ष भेटघाट (Physical Visit) गरेका ग्राहकहरूमध्ये ६८% ले सम्झौतामा हस्ताक्षर गर्छन्। अनलाइन सोधपुछ आउनासाथ निःशुल्क फूड टेस्टिङ (Food Tasting) को लागि बोलाउनुहोस्।'
                : '68% of customers who attend an in-person hall walkthrough proceed to digital contract signing. Offer a complimentary food tasting preview right from the chat to double walk-in conversions.'}
            </p>
          </div>
        </div>

      </div>

      {/* SECTION 4: SHIFT UTILIZATION & EVENT CATEGORIES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SHIFT DISTRIBUTION DONUT CHART */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div>
            <h4 className="text-base font-bold text-stone-900">
              {isNepali ? '४. सिफ्ट उपयोगिता (Shift Share)' : '4. Hall Shift Distribution'}
            </h4>
            <p className="text-xs text-stone-500">
              {isNepali ? 'दिउँसो, साँझ, बिहान र दिनभरिको अनुपात' : 'Share of bookings by morning, day, evening, and full day.'}
            </p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%" minHeight={200}>
              <PieChart>
                <Pie
                  data={SHIFT_PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {SHIFT_PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-stone-900 text-white p-2.5 rounded-xl text-xs space-y-1">
                          <div className="font-bold text-amber-400">{d.name}</div>
                          <div>Share: <strong>{d.value}%</strong> ({d.count} events)</div>
                          <div className="text-[10px] text-stone-400">{d.note}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs">
            {SHIFT_PIE_DATA.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-stone-100 pb-1.5 last:border-none">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-stone-800">{item.name}</span>
                </div>
                <div className="tabular-nums font-semibold text-stone-900">
                  {item.value}% <span className="text-[11px] font-normal text-stone-400">({item.count} events)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EVENT TYPE BREAKDOWN */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div>
            <h4 className="text-base font-bold text-stone-900">
              {isNepali ? '५. उत्सवको प्रकार अनुसार आम्दानी' : '5. Event Type Revenue Share'}
            </h4>
            <p className="text-xs text-stone-500">
              {isNepali ? 'विवाह, रिसेप्शन, व्रतबन्ध र अन्य उत्सव' : 'Weddings remain the primary revenue driver at 56%.'}
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {EVENT_TYPE_DATA.map((evt, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-800">{evt.name}</span>
                  <span className="tabular-nums font-bold text-stone-900">
                    {evt.revenueShare}% <span className="text-[10px] text-stone-400 font-normal">({evt.percentage}% bookings)</span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${evt.revenueShare}%`,
                      backgroundColor: evt.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500">
            {isNepali
              ? 'टिप: व्रतबन्ध र पास्नीका लागि बिहानको खाली सिफ्ट (Morning Shift) प्रवर्द्धन गरी हलको आम्दानी बढाउनुहोस्।'
              : 'Pro Tip: Bundle Bratabandha & Pasni packages for unused Morning shifts to capture extra revenue without clashing with evening weddings.'}
          </div>
        </div>

        {/* VENUE BENCHMARKING & HEALTH SCORE */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div>
            <h4 className="text-base font-bold text-stone-900">
              {isNepali ? '६. बजार प्रतिस्पर्धा र मूल्याङ्कन' : '6. Marketplace Benchmark'}
            </h4>
            <p className="text-xs text-stone-500">
              {isNepali ? 'काठमाडौँ उपत्यकाका पार्टी प्यालेसहरूसँग तुलना' : 'Comparison against Kathmandu Valley top banquets.'}
            </p>
          </div>

          <div className="space-y-3.5 pt-2">
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-700">Response Speed Score</span>
                <span className="font-bold text-emerald-700">96 / 100</span>
              </div>
              <div className="text-[11px] text-stone-500">Avg reply in 38 mins (Benchmark: 2.4 hrs)</div>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-700">Menu Customization Index</span>
                <span className="font-bold text-amber-800">4.9 ★</span>
              </div>
              <div className="text-[11px] text-stone-500">Live chat counters & traditional Nepali cuisine</div>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-700">Audit & VAT Compliance</span>
                <span className="font-bold text-emerald-800">Verified 100%</span>
              </div>
              <div className="text-[11px] text-stone-500">IRD Nepal e-billing & PAN invoice integration ready</div>
            </div>

            <div className="p-3 bg-amber-900 text-white rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-amber-200 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-300" /> Super Palace Status
                </span>
                <span className="text-[10px] bg-amber-800 px-2 py-0.5 rounded font-bold">ACTIVE</span>
              </div>
              <p className="text-[11px] text-amber-100">
                Your venue appears in the top 3 promoted spots on UTSAVO for wedding searches.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
