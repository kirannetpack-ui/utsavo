/**
 * UTSAVO — Customer Event Budgeting Tracker
 * Allows customers & celebration hosts to define a total event budget (NPR),
 * allocate category budgets, log & settle vendor expenses across Venue, Food,
 * Decor, Entertainment, Photo/Media, and Cultural Logistics, and sync live bookings.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Wallet,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Download,
  RefreshCw,
  Building2,
  Utensils,
  Sparkles,
  Music,
  Camera,
  Flame,
  Search,
  Check,
} from 'lucide-react';
import { Booking } from '../types';
import { sanitizeText } from '../utils/security';

export type BudgetCategoryId =
  | 'VENUE'
  | 'FOOD'
  | 'DECOR'
  | 'ENTERTAINMENT'
  | 'PHOTOGRAPHY'
  | 'TRADITIONS_LOGISTICS';

export interface BudgetExpenseItem {
  id: string;
  category: BudgetCategoryId;
  title: string;
  vendorName: string;
  quotedAmountNpr: number;
  paidAmountNpr: number;
  status: 'PAID' | 'DEPOSIT_PAID' | 'PENDING';
  notes?: string;
  linkedBookingRef?: string;
}

interface EventBudgetState {
  eventTitle: string;
  totalBudgetNpr: number;
  allocations: Record<BudgetCategoryId, number>;
  expenses: BudgetExpenseItem[];
}

interface EventBudgetTrackerProps {
  bookings: Booking[];
}

const STORAGE_KEY = 'utsavo_customer_event_budget_v1';

const CATEGORY_META: Array<{
  id: BudgetCategoryId;
  label: string;
  shortLabel: string;
  defaultSharePct: number;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'VENUE', label: 'Venue & Hall Rental', shortLabel: 'Venue & Hall', defaultSharePct: 16, icon: Building2 },
  { id: 'FOOD', label: 'Food & Catering', shortLabel: 'Food & Catering', defaultSharePct: 48, icon: Utensils },
  { id: 'DECOR', label: 'Decor & Floral Mandap', shortLabel: 'Decor & Floral', defaultSharePct: 14, icon: Sparkles },
  { id: 'ENTERTAINMENT', label: 'Entertainment & Sound', shortLabel: 'Entertainment', defaultSharePct: 9, icon: Music },
  { id: 'PHOTOGRAPHY', label: 'Photo, Video & Drone', shortLabel: 'Photo & Video', defaultSharePct: 7, icon: Camera },
  { id: 'TRADITIONS_LOGISTICS', label: 'Priest, Attire & Logistics', shortLabel: 'Priest & Logistics', defaultSharePct: 6, icon: Flame },
];

function buildDefaultBudgetState(bookings: Booking[]): EventBudgetState {
  const defaultTotal = 1800000;
  const allocations: Record<BudgetCategoryId, number> = {
    VENUE: Math.round(defaultTotal * 0.16),
    FOOD: Math.round(defaultTotal * 0.48),
    DECOR: Math.round(defaultTotal * 0.14),
    ENTERTAINMENT: Math.round(defaultTotal * 0.09),
    PHOTOGRAPHY: Math.round(defaultTotal * 0.07),
    TRADITIONS_LOGISTICS: Math.round(defaultTotal * 0.06),
  };

  const firstBooking = bookings[0];
  const initialExpenses: BudgetExpenseItem[] = [];

  if (firstBooking) {
    const cateringCost = firstBooking.agreedPerPlateNpr * firstBooking.guestCount;
    const hallAndTaxes = Math.max(0, firstBooking.totalAmountNpr - cateringCost);
    const depositRatio =
      firstBooking.totalAmountNpr > 0
        ? firstBooking.depositPaidNpr / firstBooking.totalAmountNpr
        : 0;

    initialExpenses.push(
      {
        id: 'exp-seed-venue',
        category: 'VENUE',
        title: `${firstBooking.hallName} Rental & Statutory SC/VAT`,
        vendorName: firstBooking.venueName,
        quotedAmountNpr: hallAndTaxes,
        paidAmountNpr: Math.round(hallAndTaxes * depositRatio),
        status: firstBooking.balanceDueNpr === 0 ? 'PAID' : depositRatio > 0 ? 'DEPOSIT_PAID' : 'PENDING',
        notes: `Linked from Booking #${firstBooking.bookingRef} (${firstBooking.eventDateBS})`,
        linkedBookingRef: firstBooking.bookingRef,
      },
      {
        id: 'exp-seed-food',
        category: 'FOOD',
        title: `Banquet Catering (${firstBooking.guestCount} guests × NPR ${firstBooking.agreedPerPlateNpr.toLocaleString()})`,
        vendorName: firstBooking.venueName,
        quotedAmountNpr: cateringCost,
        paidAmountNpr: Math.round(cateringCost * depositRatio),
        status: firstBooking.balanceDueNpr === 0 ? 'PAID' : depositRatio > 0 ? 'DEPOSIT_PAID' : 'PENDING',
        notes: `Menu: ${firstBooking.selectedMenuSummary.slice(0, 3).join(', ')}`,
        linkedBookingRef: firstBooking.bookingRef,
      }
    );
  } else {
    initialExpenses.push(
      {
        id: 'exp-seed-venue-default',
        category: 'VENUE',
        title: 'Main Ballroom Reservation & Setup',
        vendorName: 'The Regal Pavilion & Heritage Banquet',
        quotedAmountNpr: 220000,
        paidAmountNpr: 75000,
        status: 'DEPOSIT_PAID',
        notes: '25% advance escrow deposit settled',
      },
      {
        id: 'exp-seed-food-default',
        category: 'FOOD',
        title: 'Gold Royal Buffet Catering (450 pax)',
        vendorName: 'The Regal Pavilion Catering Kitchen',
        quotedAmountNpr: 742500,
        paidAmountNpr: 185000,
        status: 'DEPOSIT_PAID',
        notes: 'Includes live momo & juju dhau counters',
      }
    );
  }

  initialExpenses.push(
    {
      id: 'exp-seed-decor',
      category: 'DECOR',
      title: 'Marigold Mandap, Reception Floral Arch & Lighting',
      vendorName: 'Kathmandu Heritage Florals & Stageworks',
      quotedAmountNpr: 215000,
      paidAmountNpr: 60000,
      status: 'DEPOSIT_PAID',
      notes: 'Includes VIP entrance walkway & stage drape',
    },
    {
      id: 'exp-seed-ent',
      category: 'ENTERTAINMENT',
      title: 'Traditional Panche Baja Troupe & Reception Acoustic DJ',
      vendorName: 'Lalitpur Naumati Sanskar Group & Sound',
      quotedAmountNpr: 115000,
      paidAmountNpr: 35000,
      status: 'DEPOSIT_PAID',
      notes: '10:00 PM DAO sound curfew compliant',
    },
    {
      id: 'exp-seed-photo',
      category: 'PHOTOGRAPHY',
      title: 'Candid Photography, 4K Cinema Reel & Drone Coverage',
      vendorName: 'Himalayan Lens Collective',
      quotedAmountNpr: 110000,
      paidAmountNpr: 0,
      status: 'PENDING',
      notes: 'Final confirmation pending Muhurat schedule',
    },
    {
      id: 'exp-seed-trad',
      category: 'TRADITIONS_LOGISTICS',
      title: 'Bilingual Vedic Acharya, Puja Samagri & Guest Coaches',
      vendorName: 'Pashupati Samagri & Transport',
      quotedAmountNpr: 85000,
      paidAmountNpr: 25000,
      status: 'DEPOSIT_PAID',
      notes: 'Covers brass havan kund & shuttle vans',
    }
  );

  return {
    eventTitle: 'Family Wedding & Reception Celebration',
    totalBudgetNpr: defaultTotal,
    allocations,
    expenses: initialExpenses,
  };
}

export const EventBudgetTracker: React.FC<EventBudgetTrackerProps> = ({ bookings }) => {
  const [budgetState, setBudgetState] = useState<EventBudgetState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.totalBudgetNpr === 'number' && Array.isArray(parsed.expenses)) {
          return parsed;
        }
      }
    } catch {
      // ignore storage errors and fall back cleanly
    }
    return buildDefaultBudgetState(bookings);
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(budgetState));
    } catch {
      // ignore quota errors
    }
  }, [budgetState]);

  // Filters & Form UI State
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<BudgetCategoryId | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddExpenseForm, setShowAddExpenseForm] = useState(false);
  const [editingTotalBudget, setEditingTotalBudget] = useState(false);
  const [draftTotalBudget, setDraftTotalBudget] = useState<number>(budgetState.totalBudgetNpr);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // New expense inputs
  const [newExpCategory, setNewExpCategory] = useState<BudgetCategoryId>('VENUE');
  const [newExpTitle, setNewExpTitle] = useState('');
  const [newExpVendor, setNewExpVendor] = useState('');
  const [newExpQuoted, setNewExpQuoted] = useState<number>(50000);
  const [newExpPaid, setNewExpPaid] = useState<number>(0);
  const [newExpNotes, setNewExpNotes] = useState('');

  // Computed financial aggregates
  const totals = useMemo(() => {
    const totalSpentQuoted = budgetState.expenses.reduce((s, e) => s + e.quotedAmountNpr, 0);
    const totalPaid = budgetState.expenses.reduce((s, e) => s + e.paidAmountNpr, 0);
    const totalPendingDue = Math.max(0, totalSpentQuoted - totalPaid);
    const remainingBudget = budgetState.totalBudgetNpr - totalSpentQuoted;
    const utilizationPct =
      budgetState.totalBudgetNpr > 0
        ? Math.round((totalSpentQuoted / budgetState.totalBudgetNpr) * 100)
        : 0;

    return {
      totalSpentQuoted,
      totalPaid,
      totalPendingDue,
      remainingBudget,
      utilizationPct,
      isOverBudget: remainingBudget < 0,
    };
  }, [budgetState]);

  // Per-category breakdown for chart & cards
  const categoryBreakdown = useMemo(() => {
    return CATEGORY_META.map((cat) => {
      const allocated = budgetState.allocations[cat.id] || 0;
      const items = budgetState.expenses.filter((e) => e.category === cat.id);
      const spent = items.reduce((s, e) => s + e.quotedAmountNpr, 0);
      const paid = items.reduce((s, e) => s + e.paidAmountNpr, 0);
      const variance = allocated - spent;
      const pctUsed = allocated > 0 ? Math.round((spent / allocated) * 100) : spent > 0 ? 100 : 0;

      return {
        ...cat,
        shortLabel: cat.label.split('&')[0].trim(),
        allocated,
        spent,
        paid,
        variance,
        pctUsed,
        itemCount: items.length,
        isOverCategory: variance < 0,
      };
    });
  }, [budgetState]);

  // Filtered expense rows
  const filteredExpenses = useMemo(() => {
    return budgetState.expenses.filter((exp) => {
      if (selectedCategoryFilter !== 'ALL' && exp.category !== selectedCategoryFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          exp.title.toLowerCase().includes(q) ||
          exp.vendorName.toLowerCase().includes(q) ||
          (exp.notes && exp.notes.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [budgetState.expenses, selectedCategoryFilter, searchQuery]);

  // Handlers
  const handleSaveTotalBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const clamped = Math.max(50000, Math.min(100000000, Number(draftTotalBudget) || 50000));
    setBudgetState((prev) => ({
      ...prev,
      totalBudgetNpr: clamped,
    }));
    setEditingTotalBudget(false);
  };

  const handleApplyTotalPreset = (amount: number) => {
    setDraftTotalBudget(amount);
    setBudgetState((prev) => ({
      ...prev,
      totalBudgetNpr: amount,
      allocations: {
        VENUE: Math.round(amount * 0.16),
        FOOD: Math.round(amount * 0.48),
        DECOR: Math.round(amount * 0.14),
        ENTERTAINMENT: Math.round(amount * 0.09),
        PHOTOGRAPHY: Math.round(amount * 0.07),
        TRADITIONS_LOGISTICS: Math.round(amount * 0.06),
      },
    }));
    setEditingTotalBudget(false);
  };

  const handleAutoBalanceAllocations = () => {
    const total = budgetState.totalBudgetNpr;
    setBudgetState((prev) => ({
      ...prev,
      allocations: {
        VENUE: Math.round(total * 0.16),
        FOOD: Math.round(total * 0.48),
        DECOR: Math.round(total * 0.14),
        ENTERTAINMENT: Math.round(total * 0.09),
        PHOTOGRAPHY: Math.round(total * 0.07),
        TRADITIONS_LOGISTICS: Math.round(total * 0.06),
      },
    }));
    setSyncNotice('Category planned allocations balanced proportionally to your total budget.');
    setTimeout(() => setSyncNotice(null), 3000);
  };

  const handleUpdateCategoryAllocation = (catId: BudgetCategoryId, newAmount: number) => {
    const safeVal = Math.max(0, Number(newAmount) || 0);
    setBudgetState((prev) => ({
      ...prev,
      allocations: {
        ...prev.allocations,
        [catId]: safeVal,
      },
    }));
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const title = sanitizeText(newExpTitle, 140);
    const vendor = sanitizeText(newExpVendor, 120) || 'Self / Direct Vendor';
    const quoted = Math.max(0, Number(newExpQuoted) || 0);
    const paid = Math.max(0, Math.min(quoted, Number(newExpPaid) || 0));
    if (!title || quoted <= 0) return;

    const status: BudgetExpenseItem['status'] =
      paid >= quoted ? 'PAID' : paid > 0 ? 'DEPOSIT_PAID' : 'PENDING';

    const newItem: BudgetExpenseItem = {
      id: `exp-${Date.now()}`,
      category: newExpCategory,
      title,
      vendorName: vendor,
      quotedAmountNpr: quoted,
      paidAmountNpr: paid,
      status,
      notes: sanitizeText(newExpNotes, 200),
    };

    setBudgetState((prev) => ({
      ...prev,
      expenses: [newItem, ...prev.expenses],
    }));

    setNewExpTitle('');
    setNewExpVendor('');
    setNewExpQuoted(50000);
    setNewExpPaid(0);
    setNewExpNotes('');
    setShowAddExpenseForm(false);
  };

  const handleMarkFullyPaid = (expenseId: string) => {
    setBudgetState((prev) => ({
      ...prev,
      expenses: prev.expenses.map((item) =>
        item.id === expenseId
          ? { ...item, paidAmountNpr: item.quotedAmountNpr, status: 'PAID' }
          : item
      ),
    }));
  };

  const handleDeleteExpense = (expenseId: string) => {
    setBudgetState((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((item) => item.id !== expenseId),
    }));
  };

  const handleImportActiveBookings = () => {
    const activeBookings = bookings.filter((b) => b.status !== 'CANCELLED');
    if (activeBookings.length === 0) {
      setSyncNotice('No active confirmed bookings found to import.');
      setTimeout(() => setSyncNotice(null), 3000);
      return;
    }

    setBudgetState((prev) => {
      const existingRefs = new Set(
        prev.expenses.map((e) => e.linkedBookingRef).filter(Boolean)
      );
      const added: BudgetExpenseItem[] = [];

      activeBookings.forEach((b) => {
        if (existingRefs.has(b.bookingRef)) return;
        const cateringCost = b.agreedPerPlateNpr * b.guestCount;
        const hallAndTaxes = Math.max(0, b.totalAmountNpr - cateringCost);
        const ratio = b.totalAmountNpr > 0 ? b.depositPaidNpr / b.totalAmountNpr : 0;
        const status: BudgetExpenseItem['status'] =
          b.balanceDueNpr === 0 ? 'PAID' : ratio > 0 ? 'DEPOSIT_PAID' : 'PENDING';

        added.push(
          {
            id: `exp-bk-v-${b.id}`,
            category: 'VENUE',
            title: `${b.hallName} Rental & SC/VAT`,
            vendorName: b.venueName,
            quotedAmountNpr: hallAndTaxes,
            paidAmountNpr: Math.round(hallAndTaxes * ratio),
            status,
            notes: `Synced from Booking #${b.bookingRef} (${b.eventDateBS})`,
            linkedBookingRef: b.bookingRef,
          },
          {
            id: `exp-bk-f-${b.id}`,
            category: 'FOOD',
            title: `Catering (${b.guestCount} guests × NPR ${b.agreedPerPlateNpr.toLocaleString()})`,
            vendorName: b.venueName,
            quotedAmountNpr: cateringCost,
            paidAmountNpr: Math.round(cateringCost * ratio),
            status,
            notes: `Synced from Booking #${b.bookingRef}`,
            linkedBookingRef: b.bookingRef,
          }
        );
      });

      if (added.length === 0) {
        setSyncNotice('All active UTSAVO bookings are already synced in your budget ledger.');
        setTimeout(() => setSyncNotice(null), 3000);
        return prev;
      }

      setSyncNotice(`Imported ${added.length} line item(s) from your active UTSAVO bookings.`);
      setTimeout(() => setSyncNotice(null), 3000);
      return {
        ...prev,
        expenses: [...added, ...prev.expenses],
      };
    });
  };

  const handleExportCsv = () => {
    const headers = [
      'Category',
      'Expense Item',
      'Vendor',
      'Quoted Amount (NPR)',
      'Paid (NPR)',
      'Remaining Due (NPR)',
      'Status',
      'Notes',
    ];
    const rows = budgetState.expenses.map((e) => {
      const catLabel = CATEGORY_META.find((c) => c.id === e.category)?.label || e.category;
      return [
        `"${catLabel}"`,
        `"${e.title.replace(/"/g, '""')}"`,
        `"${e.vendorName.replace(/"/g, '""')}"`,
        e.quotedAmountNpr,
        e.paidAmountNpr,
        Math.max(0, e.quotedAmountNpr - e.paidAmountNpr),
        e.status,
        `"${(e.notes || '').replace(/"/g, '""')}"`,
      ];
    });
    const csv =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', 'UTSAVO_Event_Budget_Tracker.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Total Budget Setter */}
      <div className="p-6 bg-white rounded-3xl border border-stone-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
            <Wallet className="w-4 h-4 shrink-0" />
            <span>Customer Celebration Finance Planner · {budgetState.eventTitle}</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-stone-900">
            Event Budgeting Tracker (NPR)
          </h3>
          <p className="text-xs text-stone-500">
            Define your total celebration budget, track commitments across Venue, Food, Decor, and
            Entertainment, and monitor deposits paid vs. balance due.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs shrink-0">
          <button
            type="button"
            onClick={() => {
              setDraftTotalBudget(budgetState.totalBudgetNpr);
              setEditingTotalBudget((v) => !v);
            }}
            className="px-3.5 py-2 rounded-xl bg-amber-900 hover:bg-amber-950 text-white font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            {editingTotalBudget ? 'Close Budget Editor' : 'Edit Total Budget'}
          </button>

          <button
            type="button"
            onClick={handleImportActiveBookings}
            className="px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-800" />
            <span>Sync Active Bookings ({bookings.filter((b) => b.status !== 'CANCELLED').length})</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-950 text-white font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {syncNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{syncNotice}</span>
        </div>
      )}

      {/* Expandable Total Budget & Allocation Configurator */}
      {editingTotalBudget && (
        <form
          onSubmit={handleSaveTotalBudget}
          className="p-5 bg-white rounded-2xl border border-stone-200 space-y-4 text-xs"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
            <div>
              <h4 className="font-display text-sm font-bold text-stone-900">
                Define Target Total Event Budget (NPR)
              </h4>
              <p className="text-stone-500">
                Choose a celebration scale preset or enter your exact total target budget.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'Intimate (NPR 6L)', val: 600000 },
                { label: 'Classic (NPR 12L)', val: 1200000 },
                { label: 'Grand Vivah (NPR 18L)', val: 1800000 },
                { label: 'Royal (NPR 30L)', val: 3000000 },
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => handleApplyTotalPreset(p.val)}
                  className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:border-amber-800 font-semibold text-stone-800 tabular-nums whitespace-nowrap shrink-0"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="sm:col-span-1">
              <label className="block font-semibold text-stone-700 mb-1">
                Celebration Title
              </label>
              <input
                type="text"
                value={budgetState.eventTitle}
                onChange={(e) =>
                  setBudgetState((prev) => ({ ...prev, eventTitle: e.target.value }))
                }
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-stone-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Total Target Budget (NPR)
              </label>
              <input
                type="number"
                min={50000}
                step={25000}
                value={draftTotalBudget}
                onChange={(e) => setDraftTotalBudget(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl font-bold text-stone-900 tabular-nums"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold whitespace-nowrap shrink-0"
              >
                Save Total Budget
              </button>
              <button
                type="button"
                onClick={handleAutoBalanceAllocations}
                className="px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 font-semibold whitespace-nowrap shrink-0"
              >
                Auto-Balance Categories
              </button>
            </div>
          </div>
        </form>
      )}

      {/* 4-Column Budget KPI Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-1.5">
          <span className="text-xs font-medium text-stone-500 block">Total Event Budget</span>
          <div className="text-2xl font-bold font-display text-stone-900 tabular-nums">
            NPR {budgetState.totalBudgetNpr.toLocaleString()}
          </div>
          <span className="text-[11px] text-stone-500 block">
            Across {CATEGORY_META.length} celebration categories
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium">Total Committed &amp; Spent</span>
            <span className="font-bold text-stone-800 tabular-nums">{totals.utilizationPct}%</span>
          </div>
          <div className="text-2xl font-bold font-display text-amber-950 tabular-nums">
            NPR {totals.totalSpentQuoted.toLocaleString()}
          </div>
          <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                totals.isOverBudget ? 'bg-red-600' : 'bg-amber-800'
              }`}
              style={{ width: `${Math.min(100, totals.utilizationPct)}%` }}
            />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-1.5">
          <span className="text-xs font-medium text-stone-500 block">Remaining Headroom</span>
          <div
            className={`text-2xl font-bold font-display tabular-nums ${
              totals.isOverBudget ? 'text-red-700' : 'text-emerald-800'
            }`}
          >
            {totals.isOverBudget ? '-' : ''}NPR {Math.abs(totals.remainingBudget).toLocaleString()}
          </div>
          <div
            className={`text-[11px] font-semibold flex items-center gap-1 ${
              totals.isOverBudget ? 'text-red-700' : 'text-emerald-700'
            }`}
          >
            {totals.isOverBudget ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Over target budget — adjust allocations or items</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Within target budget limit</span>
              </>
            )}
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-1.5">
          <span className="text-xs font-medium text-stone-500 block">Paid Deposits vs. Balance Due</span>
          <div className="text-2xl font-bold font-display text-stone-900 tabular-nums">
            NPR {totals.totalPaid.toLocaleString()}
          </div>
          <span className="text-[11px] text-stone-600 block tabular-nums">
            Pending balance due: <strong>NPR {totals.totalPendingDue.toLocaleString()}</strong>
          </span>
        </div>
      </div>

      {/* Category Breakdown Grid + Recharts Planned vs. Actual Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Category Cards */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {categoryBreakdown.map((cat) => {
            const IconComp = cat.icon;
            const isSelected = selectedCategoryFilter === cat.id;
            return (
              <div
                key={cat.id}
                className={`p-4 rounded-2xl border bg-white space-y-2.5 transition-colors ${
                  isSelected ? 'border-amber-800 ring-1 ring-amber-800/30' : 'border-stone-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedCategoryFilter(isSelected ? 'ALL' : cat.id)
                    }
                    className="flex items-center gap-2 text-left group"
                  >
                    <IconComp className="w-4 h-4 text-amber-800 shrink-0" />
                    <span className="text-xs font-bold text-stone-900 group-hover:text-amber-900">
                      {cat.label}
                    </span>
                  </button>
                  <span className="text-[11px] text-stone-500 tabular-nums shrink-0">
                    {cat.itemCount} item{cat.itemCount === 1 ? '' : 's'}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-stone-500">Spent / Quoted:</span>
                    <strong className="text-stone-900 tabular-nums">
                      NPR {cat.spent.toLocaleString()}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-[11px] text-stone-500">
                    <span>Planned Cap:</span>
                    <input
                      type="number"
                      min={0}
                      step={5000}
                      aria-label={`Planned budget for ${cat.label}`}
                      value={cat.allocated}
                      onChange={(e) => handleUpdateCategoryAllocation(cat.id, Number(e.target.value))}
                      className="w-28 px-2 py-0.5 text-right bg-stone-50 border border-stone-200 rounded-md font-semibold text-stone-800 tabular-nums focus:outline-none focus:border-amber-800"
                    />
                  </div>
                </div>

                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      cat.isOverCategory ? 'bg-red-600' : 'bg-emerald-700'
                    }`}
                    style={{ width: `${Math.min(100, cat.pctUsed)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] tabular-nums">
                  <span className={cat.isOverCategory ? 'text-red-700 font-semibold' : 'text-emerald-800 font-semibold'}>
                    {cat.isOverCategory
                      ? `Over by NPR ${Math.abs(cat.variance).toLocaleString()}`
                      : `NPR ${cat.variance.toLocaleString()} left`}
                  </span>
                  <span className="text-stone-500">{cat.pctUsed}% used</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Recharts Planned vs. Spent Comparison Chart */}
        <div className="lg:col-span-6 p-5 sm:p-6 bg-white rounded-2xl border border-stone-200 space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h4 className="font-display text-base font-bold text-stone-900">
              Planned Allocation vs. Actual Spend by Category
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              Compare your target allocation against vendor quotes across Venue, Food, Decor, Entertainment, and Logistics.
            </p>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={290}>
              <BarChart
                data={categoryBreakdown}
                margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1ee" />
                <XAxis
                  dataKey="shortLabel"
                  tick={{ fontSize: 10, fill: '#57534e' }}
                  axisLine={{ stroke: '#e7e5e4' }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#57534e' }}
                  tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                  axisLine={{ stroke: '#e7e5e4' }}
                />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    `NPR ${Number(val).toLocaleString()}`,
                    String(name),
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Bar
                  dataKey="allocated"
                  name="Planned Budget (NPR)"
                  fill="#d6d3d1"
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />
                <Bar
                  dataKey="spent"
                  name="Quoted / Spent (NPR)"
                  fill="#92400e"
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />
                <Bar
                  dataKey="paid"
                  name="Deposits Paid (NPR)"
                  fill="#059669"
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Expense Ledger & Add New Item Section */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h4 className="font-display text-base font-bold text-stone-900">
              Itemized Event Expense Ledger
            </h4>
            <p className="text-xs text-stone-500">
              Filter by category or record new quotes, deposits, and full settlements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vendor or expense..."
                className="pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-800"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowAddExpenseForm((v) => !v)}
              className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-950 text-white font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddExpenseForm ? 'Close Form' : 'Add Expense Item'}</span>
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="px-5 py-2.5 bg-stone-50 border-b border-stone-200 flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setSelectedCategoryFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedCategoryFilter === 'ALL'
                ? 'bg-white text-stone-900 shadow-2xs border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Categories ({budgetState.expenses.length})
          </button>
          {CATEGORY_META.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedCategoryFilter === cat.id
                  ? 'bg-amber-900 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {cat.shortLabel}
            </button>
          ))}
        </div>

        {/* Add New Expense Form */}
        {showAddExpenseForm && (
          <form
            onSubmit={handleAddExpense}
            className="p-5 bg-stone-50 border-b border-stone-200 space-y-4 text-xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Category</label>
                <select
                  value={newExpCategory}
                  onChange={(e) => setNewExpCategory(e.target.value as BudgetCategoryId)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-stone-900"
                >
                  {CATEGORY_META.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Expense Description *
                </label>
                <input
                  type="text"
                  required
                  value={newExpTitle}
                  onChange={(e) => setNewExpTitle(e.target.value)}
                  placeholder="e.g. Live Chaat Counter or Mandap Florals"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Vendor / Partner Name
                </label>
                <input
                  type="text"
                  value={newExpVendor}
                  onChange={(e) => setNewExpVendor(e.target.value)}
                  placeholder="e.g. Valley Stage Decorators"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Quoted Cost (NPR) *
                </label>
                <input
                  type="number"
                  required
                  min={100}
                  step={500}
                  value={newExpQuoted}
                  onChange={(e) => setNewExpQuoted(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl font-semibold text-stone-900 tabular-nums"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Deposit Paid (NPR)
                </label>
                <input
                  type="number"
                  min={0}
                  step={500}
                  value={newExpPaid}
                  onChange={(e) => setNewExpPaid(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl font-semibold text-stone-900 tabular-nums"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <input
                type="text"
                value={newExpNotes}
                onChange={(e) => setNewExpNotes(e.target.value)}
                placeholder="Optional note (e.g. Balance due 7 days before event)"
                className="flex-1 px-3 py-2 bg-white border border-stone-300 rounded-xl text-stone-900"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold whitespace-nowrap shrink-0"
              >
                Save Expense Entry
              </button>
            </div>
          </form>
        )}

        {/* Expenses Table */}
        {filteredExpenses.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <Wallet className="w-8 h-8 text-stone-400 mx-auto" />
            <h5 className="font-display text-base font-bold text-stone-900">
              No Expenses Recorded for This Filter
            </h5>
            <p className="text-xs text-stone-500">
              Add an expense entry or switch back to All Categories to inspect your full budget.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategoryFilter('ALL');
                setSearchQuery('');
                setShowAddExpenseForm(true);
              }}
              className="px-4 py-2 rounded-xl bg-amber-900 text-white text-xs font-bold"
            >
              Add Expense Item
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-600">
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">Expense Item &amp; Vendor</th>
                  <th className="py-2.5 px-4 text-right">Quoted (NPR)</th>
                  <th className="py-2.5 px-4 text-right">Paid (NPR)</th>
                  <th className="py-2.5 px-4 text-right">Due (NPR)</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredExpenses.map((item) => {
                  const catLabel =
                    CATEGORY_META.find((c) => c.id === item.category)?.shortLabel || item.category;
                  const due = Math.max(0, item.quotedAmountNpr - item.paidAmountNpr);
                  return (
                    <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-stone-700 whitespace-nowrap">
                        {catLabel}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-stone-900">{item.title}</div>
                        <div className="text-[11px] text-stone-500">
                          {item.vendorName}
                          {item.notes ? ` · ${item.notes}` : ''}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-stone-900 tabular-nums">
                        NPR {item.quotedAmountNpr.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-emerald-800 font-semibold tabular-nums">
                        NPR {item.paidAmountNpr.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-stone-700 tabular-nums">
                        NPR {due.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`text-[11px] font-bold ${
                            item.status === 'PAID'
                              ? 'text-emerald-800'
                              : item.status === 'DEPOSIT_PAID'
                              ? 'text-amber-800'
                              : 'text-stone-600'
                          }`}
                        >
                          {item.status === 'PAID'
                            ? 'Settled'
                            : item.status === 'DEPOSIT_PAID'
                            ? 'Deposit Paid'
                            : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {item.status !== 'PAID' && (
                            <button
                              type="button"
                              onClick={() => handleMarkFullyPaid(item.id)}
                              title="Mark as fully paid"
                              className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-[11px] inline-flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              <span>Mark Paid</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteExpense(item.id)}
                            aria-label={`Delete ${item.title}`}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
