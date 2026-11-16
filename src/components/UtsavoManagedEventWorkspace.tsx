/**
 * UTSAVO — Full-Service Managed Event Concierge ("Have UTSAVO Organize Your Whole Event")
 *
 * Features:
 * 1. Explicit Client Authority Onboarding ("Yes, let UTSAVO organize my whole event — under my control")
 * 2. Step 1 (Smart Parameter Gathering): Date (BS/AD + Panchanga Muhurat), Shift & Time window, Pax breakdown,
 *    Multi-currency Budget & Flexibility, Scope (Inside Nepal 7 Provinces / 77 Districts or Worldwide).
 * 3. Step 2 (Mandatory Vendor Functions Capture — Never Missed): All 12 core vendor functions + custom functions.
 *    Suggestive allocations & tiers pre-computed from Step 1; client retains full authority to toggle ON/OFF,
 *    pick Engagement Mode (UTSAVO Full Manage / Co-Select Marketplace / Client Has Own Vendor / Not Needed),
 *    pick Marketplace Venues/Artists directly, adjust budgets, or lock custom specs.
 * 4. Step 3 (Globally Sourced Operational & Guest Standards): Weather backup contingency, elder/wheelchair/kid care,
 *    10 PM DAO curfew & Havan fire/drone permits, genset kVA load, culinary dietary isolations, VIP welcome hampers.
 * 5. Step 4 (Smart Suggestive Blueprint — Client Editable): Calls Gemini 4 Hydrogen + Google Search grounding
 *    (/api/managed-event/suggest-blueprint) with deterministic fallback. Every timeline slot, checklist item,
 *    and note is directly editable by the client before or after locking the dossier.
 * 6. Persistent Right-Rail Direct UTSAVO Team Coordination Panel (Anytime): Two-way portal messaging, instant callback
 *    window request, WhatsApp & Viber escalation with pre-filled brief reference.
 */

import React, { useMemo, useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { PANCHANGA_AUSPICIOUS_MUHURATS } from '../data/panchangaCalendar';
import {
  buildSuggestiveBlueprint,
  buildSuggestiveVendorFunctions,
  VENDOR_FUNCTION_CATALOG,
} from '../data/managedEventTemplates';
import { NepalDistrictSelector, NepalProvinceSelector } from './NepalLocationSelector';
import { WhatsAppViberButtons } from './WhatsAppViberButtons';
import {
  CustomManagedVendorFunction,
  EventType,
  ManagedEventBlueprint,
  ManagedEventRequest,
  ManagedVendorFunctionSpec,
  ShiftTime,
  VendorFunctionMode,
  VendorServiceTier,
} from '../types';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  DollarSign,
  ExternalLink,
  Globe,
  Headphones,
  Loader2,
  Lock,
  MapPin,
  MessageSquare,
  PhoneCall,
  Plus,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Unlock,
  Users,
} from 'lucide-react';

interface UtsavoManagedEventWorkspaceProps {
  onBackToExplore?: () => void;
  onOpenDashboardManagedTab?: () => void;
}

const EVENT_TYPE_OPTIONS: Array<{
  value: ManagedEventRequest['eventType'];
  label: string;
}> = [
  { value: 'WEDDING', label: 'Wedding (Vedic / Heritage Vivah)' },
  { value: 'RECEPTION', label: 'Grand Reception Gala (Pritibhoj)' },
  { value: 'BRATABANDHA', label: 'Bratabandha / Upanayana' },
  { value: 'PASNI', label: 'Pasni / Annaprashan' },
  { value: 'ENGAGEMENT', label: 'Engagement / Tika / Sangeet' },
  { value: 'DESTINATION_WEDDING', label: 'Multi-Day Destination Wedding' },
  { value: 'CORPORATE_GALA', label: 'Corporate Summit / Gala Awards' },
  { value: 'BIRTHDAY_JUBILEE', label: 'Milestone Birthday / Jubilee' },
  { value: 'GRIHA_PRAVESH', label: 'Griha Pravesh Celebration' },
  { value: 'ANNIVERSARY_RENEWAL', label: 'Silver / Golden Anniversary' },
  { value: 'OTHER_CELEBRATION', label: 'Custom Private Celebration' },
];

const CULINARY_STYLE_OPTIONS = [
  'Royal Nepali Thakali',
  'Authentic Newari Samay Baji',
  'Mithila / Terai Traditional Feast',
  'North Indian Mughlai & Chaat',
  'Continental & Mediterranean Live Grill',
  'Pan-Asian Wok & Sushi Bar',
];

const DIETARY_SEPARATION_OPTIONS = [
  'Pure Vegetarian Island',
  'Strict Jain Counter (No Garlic/Onion)',
  'Halal Certified Station',
  'Sattvik Fasting Thali',
  'Low-Spice Elder & Kids Buffet',
  'Gluten-Free / Vegan Marked',
];

export const UtsavoManagedEventWorkspace: React.FC<
  UtsavoManagedEventWorkspaceProps
> = ({ onBackToExplore, onOpenDashboardManagedTab }) => {
  const {
    currentUser,
    venues,
    culturalVendors,
    managedEventRequests,
    submitManagedEventRequest,
    updateManagedEventByClient,
    sendManagedEventMessage,
  } = useMarketplace();

  // Wizard step (1..4) + active existing dossier mode
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [wantsUtsavoFullManagement, setWantsUtsavoFullManagement] = useState(true);
  const [activeDossierId, setActiveDossierId] = useState<string | null>(
    managedEventRequests[0]?.id || null
  );
  const [viewMode, setViewMode] = useState<'BUILDER' | 'TRACKER'>('BUILDER');

  // Step 1: Client Contact & Core Event Parameters
  const [clientName, setClientName] = useState(currentUser.name || '');
  const [clientEmail, setClientEmail] = useState(currentUser.email || '');
  const [clientPhone, setClientPhone] = useState(currentUser.phone || '');
  const [preferredContactChannel, setPreferredContactChannel] =
    useState<ManagedEventRequest['preferredContactChannel']>('PORTAL_AND_WHATSAPP');
  const [preferredCallbackWindow, setPreferredCallbackWindow] = useState(
    'Today, 4:00 PM - 7:00 PM NPT'
  );

  const [eventTitle, setEventTitle] = useState('Royal Heritage Celebration Gala');
  const [eventType, setEventType] =
    useState<ManagedEventRequest['eventType']>('WEDDING');
  const [eventScope, setEventScope] =
    useState<'INSIDE_NEPAL' | 'OUTSIDE_NEPAL'>('INSIDE_NEPAL');
  const [province, setProvince] = useState('Bagmati Province');
  const [district, setDistrict] = useState('Kathmandu');
  const [cityOrLocality, setCityOrLocality] = useState('Baluwatar / Sanepa');
  const [country, setCountry] = useState('Nepal');

  const [eventDateBS, setEventDateBS] = useState('2081 Magh 22');
  const [eventDateAD, setEventDateAD] = useState('2025-02-04');
  const [isDateFlexible, setIsDateFlexible] = useState(false);
  const [muhuratPreference, setMuhuratPreference] = useState(
    'Abhijit / Sarva Siddhi Shubha Muhurat'
  );
  const [shift, setShift] = useState<ShiftTime>('FULL_DAY');
  const [startTime, setStartTime] = useState('09:30 AM');
  const [endTime, setEndTime] = useState('10:00 PM');
  const [multiDayCount, setMultiDayCount] = useState(1);

  const [totalPax, setTotalPax] = useState(400);
  const [eldersCount, setEldersCount] = useState(30);
  const [childrenCount, setChildrenCount] = useState(30);
  const [vipCount, setVipCount] = useState(15);
  const [roomsNeededCount, setRoomsNeededCount] = useState(25);

  const [budgetCurrency, setBudgetCurrency] =
    useState<ManagedEventRequest['budgetCurrency']>('NPR');
  const [totalBudget, setTotalBudget] = useState(1800000);
  const [budgetFlexibility, setBudgetFlexibility] =
    useState<ManagedEventRequest['budgetFlexibility']>('FLEXIBLE_15_PERCENT');
  const [venueSettingPreference, setVenueSettingPreference] =
    useState<ManagedEventRequest['venueSettingPreference']>('HYBRID_INDOOR_OUTDOOR');

  // Step 2: Mandatory Vendor Functions Matrix (initialized suggestively, customizable cleanly)
  const [vendorFunctions, setVendorFunctions] = useState<ManagedVendorFunctionSpec[]>(() =>
    buildSuggestiveVendorFunctions('WEDDING', 1800000, 400)
  );
  const [customVendorFunctions, setCustomVendorFunctions] = useState<
    CustomManagedVendorFunction[]
  >([]);
  const [newCustomTitle, setNewCustomTitle] = useState('');
  const [newCustomBudget, setNewCustomBudget] = useState(35000);
  const [newCustomSpecs, setNewCustomSpecs] = useState('');

  // Track if Step 2 was reviewed so client is reminded never to skip vendor functions
  const [vendorFunctionsReviewed, setVendorFunctionsReviewed] = useState(false);

  // Step 3: Globally Sourced Production & Guest Standards
  const [weatherBackupContingency, setWeatherBackupContingency] = useState<
    ManagedEventRequest['globalStandards']['weatherBackupContingency']
  >('INDOOR_BACKUP_HALL');
  const [accessibilityEldersKidsPlan, setAccessibilityEldersKidsPlan] = useState(
    'Step-free ramps, 2 wheelchairs standby, shaded elders sofa lounge & quiet nursing/kids corner.'
  );
  const [permitsAndCurfewCompliance, setPermitsAndCurfewCompliance] = useState(true);
  const [powerBackupAndSafetySpecs, setPowerBackupAndSafetySpecs] = useState(
    'Minimum 65 kVA acoustic generator backup + CO2 kitchen & Havan fire marshals.'
  );
  const [vipProtocolAndWelcomeKits, setVipProtocolAndWelcomeKits] = useState(
    'Express valet parking tags + Dhaka pouch & Ilam tea welcome kits for key guests.'
  );
  const [ecoZeroWastePreference, setEcoZeroWastePreference] = useState(true);
  const [hybridLivestreamNeeds, setHybridLivestreamNeeds] = useState(true);
  const [culinaryStyles, setCulinaryStyles] = useState<string[]>([
    'Royal Nepali Thakali',
    'Authentic Newari Samay Baji',
    'North Indian Mughlai & Chaat',
  ]);
  const [dietarySeparations, setDietarySeparations] = useState<string[]>([
    'Pure Vegetarian Island',
    'Strict Jain Counter (No Garlic/Onion)',
    'Low-Spice Elder & Kids Buffet',
  ]);
  const [barPolicy, setBarPolicy] = useState<
    ManagedEventRequest['globalStandards']['barPolicy']
  >('SIGNATURE_COCKTAILS');
  const [themeAndColorPalette, setThemeAndColorPalette] = useState(
    'Marigold Gold, Deep Crimson Silk & Heritage Brass'
  );
  const [specialDreamsAndNonNegotiables, setSpecialDreamsAndNonNegotiables] = useState('');

  // Step 4: Suggestive Blueprint (Client Editable)
  const [blueprint, setBlueprint] = useState<ManagedEventBlueprint>(() =>
    buildSuggestiveBlueprint({
      eventTitle: 'Royal Heritage Celebration Gala',
      eventType: 'WEDDING',
      eventScope: 'INSIDE_NEPAL',
      locationLabel: 'Baluwatar / Sanepa, Kathmandu, Bagmati Province',
      eventDateBS: '2081 Magh 22',
      eventDateAD: '2025-02-04',
      shift: 'FULL_DAY',
      startTime: '09:30 AM',
      endTime: '10:00 PM',
      totalPax: 400,
      budgetCurrency: 'NPR',
      totalBudget: 1800000,
      vendorFunctions: buildSuggestiveVendorFunctions('WEDDING', 1800000, 400),
    })
  );
  const [isGeneratingBlueprint, setIsGeneratingBlueprint] = useState(false);

  // New custom run-of-show slot draft
  const [newSlotTime, setNewSlotTime] = useState('');
  const [newSlotActivity, setNewSlotActivity] = useState('');
  const [newSlotOwner, setNewSlotOwner] = useState('UTSAVO Event Director');

  // Pre-submission & Live Coordination Messaging
  const [pendingClientNotes, setPendingClientNotes] = useState<
    Array<{ id: string; text: string; channel: 'PORTAL_CHAT' | 'CALLBACK_REQUEST'; time: string }>
  >([]);
  const [coordDraftMessage, setCoordDraftMessage] = useState('');
  const [submittedNotice, setSubmittedNotice] = useState<string | null>(null);

  const activeSubmittedDossier = useMemo(
    () => managedEventRequests.find((r) => r.id === activeDossierId) || null,
    [managedEventRequests, activeDossierId]
  );

  // Dynamic computations
  const locationDisplayLabel = useMemo(() => {
    if (eventScope === 'INSIDE_NEPAL') {
      return [cityOrLocality, district, province, 'Nepal'].filter(Boolean).join(', ');
    }
    return [cityOrLocality, country].filter(Boolean).join(', ') || 'International Destination';
  }, [eventScope, cityOrLocality, district, province, country]);

  const totalAllocatedVendorBudget = useMemo(() => {
    const coreSum = vendorFunctions
      .filter((vf) => vf.isEnabled && vf.mode !== 'NOT_NEEDED')
      .reduce((acc, vf) => acc + (Number(vf.allocatedBudgetAmount) || 0), 0);
    const customSum = customVendorFunctions
      .filter((c) => c.mode !== 'NOT_NEEDED')
      .reduce((acc, c) => acc + (Number(c.budgetAmount) || 0), 0);
    return coreSum + customSum;
  }, [vendorFunctions, customVendorFunctions]);

  const budgetDelta = totalBudget - totalAllocatedVendorBudget;
  const activeVendorFunctionsCount = vendorFunctions.filter(
    (vf) => vf.isEnabled && vf.mode !== 'NOT_NEEDED'
  ).length;
  const perGuestEstimate = Math.round(totalBudget / Math.max(1, totalPax));

  // Re-apply smart suggestive shares whenever client asks or updates Step 1 (respecting clientAuthorityLocked!)
  const recalculateUnlockedVendorSuggestions = (
    nextEventType: ManagedEventRequest['eventType'] = eventType,
    nextBudget: number = totalBudget,
    nextPax: number = totalPax
  ) => {
    const freshDefaults = buildSuggestiveVendorFunctions(
      nextEventType,
      nextBudget,
      nextPax
    );
    setVendorFunctions((prev) =>
      prev.map((vf) => {
        if (vf.clientAuthorityLocked) return vf;
        const matched = freshDefaults.find((d) => d.key === vf.key);
        return matched
          ? {
              ...matched,
              preferredVendorOrVenueName: vf.preferredVendorOrVenueName || matched.preferredVendorOrVenueName,
            }
          : vf;
      })
    );
  };

  const handleApplyMuhurat = (muhuratId: string) => {
    const found = PANCHANGA_AUSPICIOUS_MUHURATS.find((m) => m.id === muhuratId);
    if (!found) return;
    setEventDateBS(found.dateBS);
    setEventDateAD(found.dateAD);
    setMuhuratPreference(`${found.tithi} · ${found.nakshatra} (${found.auspiciousTime})`);
    if (found.eventType) {
      setEventType(found.eventType);
      recalculateUnlockedVendorSuggestions(found.eventType, totalBudget, totalPax);
    }
  };

  const updateVendorFunction = (
    key: ManagedVendorFunctionSpec['key'],
    patch: Partial<ManagedVendorFunctionSpec>
  ) => {
    setVendorFunctionsReviewed(true);
    setVendorFunctions((prev) =>
      prev.map((vf) =>
        vf.key === key
          ? {
              ...vf,
              ...patch,
              clientAuthorityLocked: true,
            }
          : vf
      )
    );
  };

  const handleAddCustomVendorFunction = () => {
    const title = newCustomTitle.trim();
    if (!title) return;
    setVendorFunctionsReviewed(true);
    setCustomVendorFunctions((prev) => [
      ...prev,
      {
        id: `cvf-${Date.now()}`,
        title,
        mode: 'UTSAVO_FULL_MANAGE',
        budgetAmount: Number(newCustomBudget) || 0,
        specifications: newCustomSpecs.trim() || 'Coordinated by UTSAVO Team per client brief',
      },
    ]);
    setNewCustomTitle('');
    setNewCustomSpecs('');
  };

  const toggleGlobalArrayItem = (
    list: string[],
    val: string,
    setter: (next: string[]) => void
  ) => {
    setter(list.includes(val) ? list.filter((i) => i !== val) : [...list, val]);
  };

  // Trigger Gemini 4 Hydrogen + Google Search Global Sourcing Blueprint
  const handleGenerateSmartBlueprint = async () => {
    setIsGeneratingBlueprint(true);
    try {
      const res = await fetch('/api/managed-event/suggest-blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventTitle,
          eventType,
          eventScope,
          province,
          district,
          cityOrLocality,
          country,
          eventDateBS,
          eventDateAD,
          shift,
          startTime,
          endTime,
          totalPax,
          paxBreakdown: {
            adults: Math.max(0, totalPax - eldersCount - childrenCount),
            eldersRequiringAccess: eldersCount,
            children: childrenCount,
            vipHeads: vipCount,
            outstationGuestsNeedingRooms: roomsNeededCount,
          },
          budgetCurrency,
          totalBudget,
          budgetFlexibility,
          vendorFunctions,
          globalStandards: {
            weatherBackupContingency,
            dietarySeparations,
            barPolicy,
          },
        }),
      });
      const data = await res.json();
      setBlueprint({
        executiveSummary: data.executiveSummary || blueprint.executiveSummary,
        panchangaAndTimingAdvice: data.panchangaAndTimingAdvice || blueprint.panchangaAndTimingAdvice,
        recommendedRunOfShow: Array.isArray(data.recommendedRunOfShow)
          ? data.recommendedRunOfShow
          : blueprint.recommendedRunOfShow,
        vendorCoordinationPlaybook: Array.isArray(data.vendorCoordinationPlaybook)
          ? data.vendorCoordinationPlaybook
          : blueprint.vendorCoordinationPlaybook,
        globalRiskAndPermitsChecklist: Array.isArray(data.globalRiskAndPermitsChecklist)
          ? data.globalRiskAndPermitsChecklist
          : blueprint.globalRiskAndPermitsChecklist,
        webSources: Array.isArray(data.webSources) ? data.webSources : [],
        generatedWith: data.generatedWith || 'Gemini 4 Hydrogen + Global Search Grounding',
        generatedAt: data.generatedAt || new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Blueprint generation fell back to deterministic synthesizer:', err);
      setBlueprint(
        buildSuggestiveBlueprint({
          eventTitle,
          eventType,
          eventScope,
          locationLabel: locationDisplayLabel,
          eventDateBS,
          eventDateAD,
          shift,
          startTime,
          endTime,
          totalPax,
          budgetCurrency,
          totalBudget,
          vendorFunctions,
        })
      );
    } finally {
      setIsGeneratingBlueprint(false);
    }
  };

  // Submit & Lock Full-Service Managed Event Dossier
  const handleSubmitFullDossier = () => {
    const adultsCount = Math.max(0, totalPax - eldersCount - childrenCount);
    const created = submitManagedEventRequest({
      wantsUtsavoFullManagement,
      clientName: clientName || currentUser.name,
      clientEmail: clientEmail || currentUser.email,
      clientPhone: clientPhone || currentUser.phone,
      preferredContactChannel,
      preferredCallbackWindow,
      eventTitle: eventTitle.trim() || `${eventType} Celebration`,
      eventType,
      eventScope,
      province: eventScope === 'INSIDE_NEPAL' ? province : 'International',
      district: eventScope === 'INSIDE_NEPAL' ? district : cityOrLocality,
      cityOrLocality,
      country: eventScope === 'INSIDE_NEPAL' ? 'Nepal' : country,
      eventDateBS,
      eventDateAD,
      isDateFlexible,
      muhuratPreference,
      shift,
      startTime,
      endTime,
      multiDayCount,
      totalPax,
      paxBreakdown: {
        adults: adultsCount,
        eldersRequiringAccess: eldersCount,
        children: childrenCount,
        vipHeads: vipCount,
        outstationGuestsNeedingRooms: roomsNeededCount,
      },
      budgetCurrency,
      totalBudget,
      budgetFlexibility,
      venueSettingPreference,
      vendorFunctions,
      customVendorFunctions,
      globalStandards: {
        weatherBackupContingency,
        accessibilityEldersKidsPlan,
        permitsAndCurfewCompliance,
        powerBackupAndSafetySpecs,
        vipProtocolAndWelcomeKits,
        ecoZeroWastePreference,
        hybridLivestreamNeeds,
        culinaryStyles,
        dietarySeparations,
        barPolicy,
        themeAndColorPalette,
        specialDreamsAndNonNegotiables,
      },
      blueprint,
      status: 'BRIEF_SUBMITTED',
      assignedCoordinatorName: 'Aarav Shrestha (Senior UTSAVO Event Director)',
      assignedCoordinatorPhone: '+977-9801122334',
      initialMessage:
        pendingClientNotes.length > 0
          ? pendingClientNotes.map((n) => n.text).join(' | ')
          : undefined,
    });

    setPendingClientNotes([]);
    setActiveDossierId(created.id);
    setViewMode('TRACKER');
    setSubmittedNotice(
      `Dossier #${created.requestRef} assigned to UTSAVO Producer ${created.assignedCoordinatorName}. You maintain 100% edit authority and direct chat access anytime.`
    );
  };

  // Send Direct Coordination Message Anytime (Before OR After submission!)
  const handleSendDirectMessage = (channel: 'PORTAL_CHAT' | 'CALLBACK_REQUEST' = 'PORTAL_CHAT') => {
    const trimmed =
      channel === 'CALLBACK_REQUEST' && !coordDraftMessage.trim()
        ? `Urgent Callback Requested for ${eventTitle} (${eventDateBS}, ${totalPax} pax). Preferred window: ${preferredCallbackWindow}`
        : coordDraftMessage.trim();

    if (!trimmed) return;

    if (viewMode === 'TRACKER' && activeSubmittedDossier) {
      sendManagedEventMessage(activeSubmittedDossier.id, {
        senderRole: 'CLIENT',
        senderName: clientName || currentUser.name,
        channel,
        text: trimmed,
      });
    } else {
      setPendingClientNotes((prev) => [
        ...prev,
        {
          id: `pre-msg-${Date.now()}`,
          text: trimmed,
          channel,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
    setCoordDraftMessage('');
  };

  const whatsappBriefText = encodeURIComponent(
    `Namaste UTSAVO Team! Reference: ${
      activeSubmittedDossier?.requestRef || 'NEW-MANAGED-BRIEF'
    } | Event: ${eventTitle} | Date: ${eventDateBS} BS (${eventDateAD}) | Pax: ${totalPax} | Budget: ${budgetCurrency} ${totalBudget.toLocaleString()} | Active Vendor Functions: ${activeVendorFunctionsCount}. Requesting direct coordinator discussion.`
  );

  return (
    <div className="space-y-6">
      {/* Top Editorial Header */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 rounded-3xl p-6 sm:p-8 text-white border border-amber-500/20 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-amber-300">
              {onBackToExplore && (
                <button
                  type="button"
                  onClick={onBackToExplore}
                  className="inline-flex items-center gap-1 text-stone-300 hover:text-white mr-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Explore Venues</span>
                </button>
              )}
              <span>UTSAVO Full-Service Event Production</span>
              <span className="text-amber-500/70">·</span>
              <span>Global Best Practices + Client Full Authority</span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Let UTSAVO Organize Your Entire Event — On Your Terms
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Our smart planner first gathers your Date, Time, Pax, Budget &amp; every required{' '}
              <strong className="text-white">Vendor Function</strong> upfront, generates globally
              sourced suggestive recommendations, and keeps{' '}
              <strong className="text-amber-300">100% selection authority in your hands</strong>{' '}
              with direct UTSAVO Director coordination anytime.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('BUILDER')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                viewMode === 'BUILDER'
                  ? 'bg-amber-400 text-amber-950 shadow'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              + Plan New Managed Event
            </button>
            <button
              type="button"
              onClick={() => setViewMode('TRACKER')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                viewMode === 'TRACKER'
                  ? 'bg-amber-400 text-amber-950 shadow'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              My Managed Briefs ({managedEventRequests.length})
            </button>
          </div>
        </div>

        {/* Explicit Consent & Authority Bar */}
        <div className="mt-5 pt-4 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={wantsUtsavoFullManagement}
              onChange={(e) => setWantsUtsavoFullManagement(e.target.checked)}
              className="w-4 h-4 rounded border-amber-400 text-amber-500 focus:ring-amber-400"
            />
            <span className="font-semibold text-amber-100">
              Yes, I authorize UTSAVO to coordinate and organize my whole event — while keeping final approval &amp; override authority with me.
            </span>
          </label>
          <span className="text-[11px] text-stone-300 tabular-nums shrink-0">
            {activeVendorFunctionsCount} / {vendorFunctions.length} Vendor Functions Active · Est.{' '}
            {budgetCurrency} {perGuestEstimate.toLocaleString()}/guest
          </span>
        </div>
      </div>

      {/* Confirmation Notice */}
      {submittedNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-950">
          <div className="flex items-center gap-2.5 font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>{submittedNotice}</span>
          </div>
          {onOpenDashboardManagedTab && (
            <button
              type="button"
              onClick={onOpenDashboardManagedTab}
              className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold whitespace-nowrap shrink-0"
            >
              Open in Customer Dashboard →
            </button>
          )}
        </div>
      )}

      {/* Main Layout: Left Content (Builder or Live Dossier Tracker) + Right Direct Coordination Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {viewMode === 'BUILDER' ? (
            <>
              {/* Stepper Navigation */}
              <div className="bg-white rounded-2xl border border-stone-200 p-2 grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                {[
                  { step: 1 as const, title: '1. Time, Pax & Budget', sub: 'Core intake' },
                  {
                    step: 2 as const,
                    title: '2. Vendor Functions',
                    sub: `${activeVendorFunctionsCount} configured`,
                  },
                  { step: 3 as const, title: '3. Global Standards', sub: 'Permits & dining' },
                  { step: 4 as const, title: '4. Smart Blueprint', sub: 'Full authority' },
                ].map((s) => {
                  const isActive = activeStep === s.step;
                  return (
                    <button
                      key={s.step}
                      type="button"
                      onClick={() => {
                        if (s.step === 2) setVendorFunctionsReviewed(true);
                        setActiveStep(s.step);
                      }}
                      className={`p-3 rounded-xl text-left transition-colors ${
                        isActive
                          ? 'bg-amber-900 text-white'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-800'
                      }`}
                    >
                      <div className="font-bold truncate">{s.title}</div>
                      <div
                        className={`text-[11px] truncate ${
                          isActive ? 'text-amber-200' : 'text-stone-500'
                        }`}
                      >
                        {s.sub}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* ================================================================= */}
              {/* STEP 1: SMART CORE PARAMETER INTAKE (TIME, DATE, PAX, BUDGET)     */}
              {/* ================================================================= */}
              {activeStep === 1 && (
                <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 space-y-6 text-xs">
                  <div className="border-b border-stone-100 pb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="font-display text-lg font-bold text-stone-900">
                        Step 1: Date, Time, Guest Count, Budget &amp; Event Scope
                      </h2>
                      <p className="text-stone-500 mt-0.5">
                        Enter your baseline numbers first. UTSAVO suggests smart allocations next,
                        and you control every choice.
                      </p>
                    </div>
                  </div>

                  {/* Event Title & Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">
                        Celebration / Event Title *
                      </label>
                      <input
                        type="text"
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                        placeholder="e.g. Aarav & Priya's Royal Vivah / Annual Tech Gala"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">
                        Occasion Type *
                      </label>
                      <select
                        value={eventType}
                        onChange={(e) => {
                          const next = e.target.value as ManagedEventRequest['eventType'];
                          setEventType(next);
                          recalculateUnlockedVendorSuggestions(next, totalBudget, totalPax);
                        }}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium"
                      >
                        {EVENT_TYPE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Location Scope (Inside Nepal vs Outside Nepal Worldwide) */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-stone-900 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-amber-800" />
                        <span>Location Scope</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEventScope('INSIDE_NEPAL');
                            setCountry('Nepal');
                            setBudgetCurrency('NPR');
                          }}
                          className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                            eventScope === 'INSIDE_NEPAL'
                              ? 'bg-amber-900 text-white'
                              : 'bg-white border border-stone-300 text-stone-700'
                          }`}
                        >
                          Inside Nepal (77 Districts)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEventScope('OUTSIDE_NEPAL');
                            setCountry('Thailand');
                            setBudgetCurrency('USD');
                          }}
                          className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                            eventScope === 'OUTSIDE_NEPAL'
                              ? 'bg-amber-900 text-white'
                              : 'bg-white border border-stone-300 text-stone-700'
                          }`}
                        >
                          Outside Nepal (International)
                        </button>
                      </div>
                    </div>

                    {eventScope === 'INSIDE_NEPAL' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <NepalProvinceSelector
                          label="Province (प्रदेश)"
                          value={province}
                          onChange={(p) => setProvince(p)}
                        />
                        <NepalDistrictSelector
                          label="District (जिल्ला)"
                          value={district}
                          selectedProvince={province}
                          onChange={(d, p) => {
                            setDistrict(d);
                            if (p) setProvince(p);
                          }}
                        />
                        <div>
                          <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                            Preferred Area / Locality
                          </label>
                          <input
                            type="text"
                            value={cityOrLocality}
                            onChange={(e) => setCityOrLocality(e.target.value)}
                            placeholder="e.g. Baluwatar, Lakeside, Sanepa..."
                            className="w-full px-2.5 py-2 bg-white border border-stone-200 rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                            Target Country
                          </label>
                          <input
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="e.g. Thailand, UAE, India, Italy, UK..."
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                            Target City / Region
                          </label>
                          <input
                            type="text"
                            value={cityOrLocality}
                            onChange={(e) => setCityOrLocality(e.target.value)}
                            placeholder="e.g. Phuket, Udaipur, Dubai Marina, Lake Como..."
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Date, Panchanga Muhurat & Time Window */}
                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/90 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-amber-950 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-amber-800" />
                        <span>Date, Time &amp; Panchanga Subha Muhurat Alignment</span>
                      </span>
                      <select
                        defaultValue=""
                        onChange={(e) => handleApplyMuhurat(e.target.value)}
                        className="px-2.5 py-1 bg-white border border-amber-300 rounded-lg text-[11px] font-semibold text-amber-950"
                      >
                        <option value="" disabled>
                          Quick Pick Samiti Muhurat...
                        </option>
                        {PANCHANGA_AUSPICIOUS_MUHURATS.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.dateBS} BS ({m.eventType}) — {m.tithi}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                          Bikram Sambat Date (BS)
                        </label>
                        <input
                          type="text"
                          value={eventDateBS}
                          onChange={(e) => setEventDateBS(e.target.value)}
                          placeholder="e.g. 2081 Magh 22"
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                          Gregorian Date (AD)
                        </label>
                        <input
                          type="date"
                          value={eventDateAD}
                          onChange={(e) => setEventDateAD(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                          Duration (Days)
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={7}
                          value={multiDayCount}
                          onChange={(e) => setMultiDayCount(Math.max(1, Number(e.target.value)))}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl tabular-nums"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                          Event Shift
                        </label>
                        <select
                          value={shift}
                          onChange={(e) => setShift(e.target.value as ShiftTime)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl"
                        >
                          <option value="MORNING">Morning Lagna (07:00 AM - 01:00 PM)</option>
                          <option value="DAY">Day Celebration (10:00 AM - 04:00 PM)</option>
                          <option value="EVENING">Evening Gala (05:00 PM - 10:30 PM)</option>
                          <option value="FULL_DAY">Full Day Ceremony + Reception</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                          Guest Arrival Start Time
                        </label>
                        <input
                          type="text"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl tabular-nums"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                          Event Wrap-Up Time
                        </label>
                        <input
                          type="text"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl tabular-nums"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <span className="text-amber-900 font-medium">
                        Selected Muhurat / Timing Note: {muhuratPreference}
                      </span>
                      <label className="flex items-center gap-1.5 cursor-pointer text-stone-700">
                        <input
                          type="checkbox"
                          checked={isDateFlexible}
                          onChange={(e) => setIsDateFlexible(e.target.checked)}
                          className="rounded text-amber-900"
                        />
                        <span>Dates are +/- 3 days flexible for best venue rates</span>
                      </label>
                    </div>
                  </div>

                  {/* Guest Count (Pax) Breakdown & Budget Ceiling */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl border border-stone-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <strong className="text-stone-900 flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-amber-800" />
                          <span>Total Expected Guests (Pax)</span>
                        </strong>
                        <span className="font-display font-bold text-base text-amber-950 tabular-nums">
                          {totalPax.toLocaleString()} pax
                        </span>
                      </div>

                      <input
                        type="range"
                        min={30}
                        max={2500}
                        step={10}
                        value={totalPax}
                        onChange={(e) => {
                          const next = Number(e.target.value);
                          setTotalPax(next);
                          recalculateUnlockedVendorSuggestions(eventType, totalBudget, next);
                        }}
                        className="w-full accent-amber-900"
                      />

                      <div className="grid grid-cols-2 gap-2.5 tabular-nums">
                        <div>
                          <label className="text-[10px] text-stone-500 block">
                            Exact Guest Count
                          </label>
                          <input
                            type="number"
                            min={20}
                            value={totalPax}
                            onChange={(e) => {
                              const next = Math.max(20, Number(e.target.value));
                              setTotalPax(next);
                              recalculateUnlockedVendorSuggestions(eventType, totalBudget, next);
                            }}
                            className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-stone-500 block">
                            Elders (Mobility Care)
                          </label>
                          <input
                            type="number"
                            min={0}
                            value={eldersCount}
                            onChange={(e) => setEldersCount(Math.max(0, Number(e.target.value)))}
                            className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-stone-500 block">
                            Children (Kids Corner)
                          </label>
                          <input
                            type="number"
                            min={0}
                            value={childrenCount}
                            onChange={(e) => setChildrenCount(Math.max(0, Number(e.target.value)))}
                            className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-stone-500 block">
                            Hotel Rooms Needed
                          </label>
                          <input
                            type="number"
                            min={0}
                            value={roomsNeededCount}
                            onChange={(e) =>
                              setRoomsNeededCount(Math.max(0, Number(e.target.value)))
                            }
                            className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border border-stone-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <strong className="text-stone-900 flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4 text-amber-800" />
                          <span>Target All-In Event Budget</span>
                        </strong>
                        <span className="text-[11px] font-bold text-amber-900 tabular-nums">
                          ~{budgetCurrency} {perGuestEstimate.toLocaleString()} / guest
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] text-stone-500 block">Currency</label>
                          <select
                            value={budgetCurrency}
                            onChange={(e) =>
                              setBudgetCurrency(
                                e.target.value as ManagedEventRequest['budgetCurrency']
                              )
                            }
                            className="w-full px-2.5 py-2 bg-stone-50 border border-stone-300 rounded-xl font-bold"
                          >
                            <option value="NPR">NPR</option>
                            <option value="USD">USD</option>
                            <option value="INR">INR</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="AUD">AUD</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="text-[10px] text-stone-500 block">
                            Total Budget Target
                          </label>
                          <input
                            type="number"
                            min={10000}
                            step={25000}
                            value={totalBudget}
                            onChange={(e) => {
                              const next = Math.max(1000, Number(e.target.value));
                              setTotalBudget(next);
                              recalculateUnlockedVendorSuggestions(eventType, next, totalPax);
                            }}
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-bold text-amber-950 tabular-nums"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[10px] text-stone-500 block">
                            Budget Posture
                          </label>
                          <select
                            value={budgetFlexibility}
                            onChange={(e) =>
                              setBudgetFlexibility(
                                e.target.value as ManagedEventRequest['budgetFlexibility']
                              )
                            }
                            className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg"
                          >
                            <option value="STRICT_CEILING">Strict Ceiling</option>
                            <option value="FLEXIBLE_15_PERCENT">+/- 15% Value Flexible</option>
                            <option value="VALUE_OPTIMIZED">ROI &amp; Quality Optimized</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-stone-500 block">
                            Venue Style Preference
                          </label>
                          <select
                            value={venueSettingPreference}
                            onChange={(e) =>
                              setVenueSettingPreference(
                                e.target.value as ManagedEventRequest['venueSettingPreference']
                              )
                            }
                            className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg"
                          >
                            <option value="HYBRID_INDOOR_OUTDOOR">Ballroom + Garden Lawn</option>
                            <option value="INDOOR_BANQUET">AC Indoor Party Palace</option>
                            <option value="STAR_HOTEL">5-Star Hotel Ballroom</option>
                            <option value="HERITAGE_PALACE">Heritage Courtyard Palace</option>
                            <option value="GARDEN_LAWN">Open-Air Garden Estate</option>
                            <option value="DESTINATION_RESORT">Resort Full Buyout</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Client Direct Contact & Coordinator Callback Window */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-stone-100">
                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                        Client Full Name *
                      </label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="text"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                        Best Callback Time
                      </label>
                      <input
                        type="text"
                        value={preferredCallbackWindow}
                        onChange={(e) => setPreferredCallbackWindow(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-stone-500">
                      Next: Mandatory Vendor Functions &amp; Client Authority Configuration
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setVendorFunctionsReviewed(true);
                        setActiveStep(2);
                      }}
                      className="px-5 py-2.5 bg-amber-900 hover:bg-amber-950 text-white rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0"
                    >
                      <span>Continue to Vendor Functions</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* STEP 2: MANDATORY VENDOR FUNCTIONS CAPTURE (NEVER MISSED!)        */}
              {/* ================================================================= */}
              {activeStep === 2 && (
                <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 space-y-5 text-xs">
                  <div className="border-b border-stone-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                        Mandatory Capture · Client Full Authority
                      </span>
                      <h2 className="font-display text-lg font-bold text-stone-900">
                        Step 2: Vendor Functions &amp; Service Ownership Matrix
                      </h2>
                      <p className="text-stone-500 mt-0.5">
                        Tell UTSAVO which vendor functions you want us to manage end-to-end,
                        co-select with you, or sync with your own appointed vendor. Suggestive
                        allocations below adapt automatically to your {budgetCurrency}{' '}
                        {totalBudget.toLocaleString()} budget &amp; {totalPax} guests.
                      </p>
                    </div>

                    <div className="text-right tabular-nums shrink-0 p-3 rounded-2xl bg-stone-50 border border-stone-200">
                      <span className="text-[10px] text-stone-500 block uppercase font-bold">
                        Allocated Across Vendors
                      </span>
                      <strong className="font-display text-base text-stone-900">
                        {budgetCurrency} {totalAllocatedVendorBudget.toLocaleString()}
                      </strong>
                      <div
                        className={`text-[11px] font-semibold ${
                          budgetDelta < 0 ? 'text-rose-700' : 'text-emerald-800'
                        }`}
                      >
                        {budgetDelta >= 0
                          ? `Remaining buffer: ${budgetCurrency} ${budgetDelta.toLocaleString()}`
                          : `Over target by ${budgetCurrency} ${Math.abs(budgetDelta).toLocaleString()}`}
                      </div>
                    </div>
                  </div>

                  {/* Quick Reset Suggestions Action */}
                  <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-amber-50/70 rounded-2xl border border-amber-200">
                    <span className="text-amber-950 font-medium">
                      Smart Suggestive Mode populated all 12 UTSAVO vendor functions. Lock, tweak,
                      swap modes, or pick existing marketplace partners freely.
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setVendorFunctions(
                          buildSuggestiveVendorFunctions(eventType, totalBudget, totalPax)
                        )
                      }
                      className="px-3 py-1.5 bg-white hover:bg-amber-100 border border-amber-300 text-amber-950 rounded-lg font-bold whitespace-nowrap shrink-0"
                    >
                      Re-Apply Smart Suggestions
                    </button>
                  </div>

                  {/* All 12 Vendor Function Rows */}
                  <div className="space-y-3">
                    {vendorFunctions.map((vf) => {
                      const catalogMeta = VENDOR_FUNCTION_CATALOG.find((c) => c.key === vf.key);
                      const isVenueRow = vf.key === 'VENUE_AND_HALL';
                      const isArtistRow =
                        vf.key === 'CULTURAL_ARTISTS_MUSIC' ||
                        vf.key === 'VEDIC_PUROHIT_RITUALS' ||
                        vf.key === 'PHOTOGRAPHY_CINEMA_DRONE' ||
                        vf.key === 'DECOR_MANDAP_FLORAL';

                      return (
                        <div
                          key={vf.key}
                          className={`p-4 rounded-2xl border transition-colors ${
                            vf.isEnabled && vf.mode !== 'NOT_NEEDED'
                              ? 'bg-white border-stone-300'
                              : 'bg-stone-50/70 border-stone-200 opacity-75'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                            <label className="flex items-start gap-2.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={vf.isEnabled && vf.mode !== 'NOT_NEEDED'}
                                onChange={(e) =>
                                  updateVendorFunction(vf.key, {
                                    isEnabled: e.target.checked,
                                    mode: e.target.checked ? 'UTSAVO_FULL_MANAGE' : 'NOT_NEEDED',
                                  })
                                }
                                className="mt-0.5 w-4 h-4 rounded text-amber-900"
                              />
                              <div>
                                <div className="font-bold text-sm text-stone-900 flex flex-wrap items-center gap-2">
                                  <span>{vf.label}</span>
                                  {vf.clientAuthorityLocked && (
                                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-900 font-semibold">
                                      <Lock className="w-3 h-3" /> Client Customized
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-stone-500">
                                  {vf.nepaliLabel} · {catalogMeta?.summaryHint}
                                </div>
                              </div>
                            </label>

                            {/* Budget Share & Amount (Editable) */}
                            {vf.isEnabled && vf.mode !== 'NOT_NEEDED' && (
                              <div className="flex items-center gap-2 shrink-0 tabular-nums">
                                <span className="text-[11px] text-stone-500">
                                  Suggested {vf.suggestedBudgetSharePercent}%:
                                </span>
                                <input
                                  type="number"
                                  min={0}
                                  step={5000}
                                  value={vf.allocatedBudgetAmount}
                                  onChange={(e) =>
                                    updateVendorFunction(vf.key, {
                                      allocatedBudgetAmount: Math.max(0, Number(e.target.value)),
                                    })
                                  }
                                  className="w-28 px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-bold text-stone-900 text-right"
                                />
                              </div>
                            )}
                          </div>

                          {vf.isEnabled && vf.mode !== 'NOT_NEEDED' && (
                            <div className="pt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                              {/* Ownership Mode */}
                              <div>
                                <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">
                                  Who Executes This Function?
                                </label>
                                <select
                                  value={vf.mode}
                                  onChange={(e) =>
                                    updateVendorFunction(vf.key, {
                                      mode: e.target.value as VendorFunctionMode,
                                    })
                                  }
                                  className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-semibold text-stone-800"
                                >
                                  <option value="UTSAVO_FULL_MANAGE">
                                    UTSAVO Sources &amp; Manages Full Turnkey
                                  </option>
                                  <option value="CO_SELECT_MARKETPLACE">
                                    Shortlist Options &amp; Client Approves Final
                                  </option>
                                  <option value="CLIENT_HAS_OWN_VENDOR">
                                    Client Already Has Own Vendor (UTSAVO Coordinates)
                                  </option>
                                </select>
                              </div>

                              {/* Tier + Marketplace Picker */}
                              <div>
                                <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">
                                  Quality Tier / Preferred Partner Name
                                </label>
                                <div className="flex gap-1.5">
                                  <select
                                    value={vf.selectedTier}
                                    onChange={(e) =>
                                      updateVendorFunction(vf.key, {
                                        selectedTier: e.target.value as VendorServiceTier,
                                      })
                                    }
                                    className="w-28 px-2 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-medium shrink-0"
                                  >
                                    <option value="ESSENTIAL">Essential</option>
                                    <option value="PREMIUM">Premium</option>
                                    <option value="ROYAL_LUXURY">Royal</option>
                                    <option value="CUSTOM">Custom</option>
                                  </select>
                                  <input
                                    type="text"
                                    value={vf.preferredVendorOrVenueName}
                                    onChange={(e) =>
                                      updateVendorFunction(vf.key, {
                                        preferredVendorOrVenueName: e.target.value,
                                      })
                                    }
                                    placeholder={
                                      vf.mode === 'CLIENT_HAS_OWN_VENDOR'
                                        ? 'Your vendor name & phone...'
                                        : 'Optional preferred partner...'
                                    }
                                    className="flex-1 min-w-0 px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg"
                                  />
                                </div>
                                {/* Live UTSAVO Catalog Picker for Venue / Cultural Artists */}
                                {(isVenueRow || isArtistRow) && (
                                  <select
                                    value=""
                                    onChange={(e) => {
                                      if (!e.target.value) return;
                                      updateVendorFunction(vf.key, {
                                        preferredVendorOrVenueName: e.target.value,
                                      });
                                    }}
                                    className="mt-1.5 w-full px-2 py-1 bg-amber-50/70 border border-amber-200 rounded-md text-[11px] text-amber-950 font-medium"
                                  >
                                    <option value="">
                                      + Quick-pick verified UTSAVO{' '}
                                      {isVenueRow ? 'Party Palace / Venue' : 'Artist / Ensemble'}...
                                    </option>
                                    {isVenueRow
                                      ? venues.map((v) => (
                                          <option key={v.id} value={`${v.name} (${v.district})`}>
                                            {v.name} — {v.district} (NPR{' '}
                                            {v.cateringStartingNpr.toLocaleString()}/plate)
                                          </option>
                                        ))
                                      : culturalVendors.map((cv) => (
                                          <option key={cv.id} value={`${cv.name} (${cv.district})`}>
                                            {cv.name} — {cv.category.replace(/_/g, ' ')} (NPR{' '}
                                            {cv.startingPriceNpr.toLocaleString()})
                                          </option>
                                        ))}
                                  </select>
                                )}
                              </div>

                              {/* Specifications */}
                              <div>
                                <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">
                                  Client Specifications &amp; Deliverables
                                </label>
                                <input
                                  type="text"
                                  value={vf.specifications}
                                  onChange={(e) =>
                                    updateVendorFunction(vf.key, { specifications: e.target.value })
                                  }
                                  className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Custom Vendor Function */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                    <strong className="text-stone-900 block">
                      + Add Custom / Specialized Vendor Function (Anything Else Needed)
                    </strong>
                    {customVendorFunctions.length > 0 && (
                      <div className="space-y-2">
                        {customVendorFunctions.map((cvf) => (
                          <div
                            key={cvf.id}
                            className="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between gap-3"
                          >
                            <div>
                              <strong className="text-stone-900">{cvf.title}</strong>
                              <div className="text-[11px] text-stone-500">
                                {cvf.mode.replace(/_/g, ' ')} · {cvf.specifications}
                              </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0 tabular-nums">
                              <span className="font-bold text-amber-950">
                                {budgetCurrency} {cvf.budgetAmount.toLocaleString()}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setCustomVendorFunctions((prev) =>
                                    prev.filter((item) => item.id !== cvf.id)
                                  )
                                }
                                className="text-stone-400 hover:text-rose-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <input
                        type="text"
                        value={newCustomTitle}
                        onChange={(e) => setNewCustomTitle(e.target.value)}
                        placeholder="Custom function (e.g. Heli Barat / Emcee / Kids Carnival)"
                        className="sm:col-span-2 px-3 py-2 bg-white border border-stone-300 rounded-xl"
                      />
                      <input
                        type="number"
                        min={0}
                        value={newCustomBudget}
                        onChange={(e) => setNewCustomBudget(Number(e.target.value))}
                        placeholder="Allocated budget"
                        className="px-3 py-2 bg-white border border-stone-300 rounded-xl tabular-nums"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomVendorFunction}
                        className="px-4 py-2 bg-stone-900 hover:bg-stone-950 text-white rounded-xl font-bold flex items-center justify-center gap-1 whitespace-nowrap shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Function</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={newCustomSpecs}
                      onChange={(e) => setNewCustomSpecs(e.target.value)}
                      placeholder="Optional specifications for your custom vendor function..."
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveStep(1)}
                      className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-semibold"
                    >
                      ← Back to Parameters
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setVendorFunctionsReviewed(true);
                        setActiveStep(3);
                      }}
                      className="px-5 py-2.5 bg-amber-900 hover:bg-amber-950 text-white rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0"
                    >
                      <span>Continue to Global Standards</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* STEP 3: GLOBALLY SOURCED OPERATIONAL, CULINARY & GUEST CARE       */}
              {/* ================================================================= */}
              {activeStep === 3 && (
                <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 space-y-5 text-xs">
                  <div className="border-b border-stone-100 pb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                      International Event Production Benchmarks
                    </span>
                    <h2 className="font-display text-lg font-bold text-stone-900">
                      Step 3: Contingency, Permits, Culinary Isolation &amp; Guest Experience
                    </h2>
                    <p className="text-stone-500 mt-0.5">
                      Inspired by global event production standards so zero critical details get
                      overlooked on celebration day.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">
                        Weather &amp; Rain Contingency Protocol
                      </label>
                      <select
                        value={weatherBackupContingency}
                        onChange={(e) =>
                          setWeatherBackupContingency(
                            e.target.value as ManagedEventRequest['globalStandards']['weatherBackupContingency']
                          )
                        }
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                      >
                        <option value="INDOOR_BACKUP_HALL">
                          Reserved Adjacent Indoor Backup Hall (48h switch trigger)
                        </option>
                        <option value="WATERPROOF_MARQUEE">
                          Clear-Span Waterproof German Hanger Marquee Standby
                        </option>
                        <option value="FLEXIBLE_SHIFT">
                          Shift Time Adjustment Flex
                        </option>
                        <option value="NONE">Fully Indoor Venue (No Weather Risk)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 block mb-1">
                        Beverage &amp; Bar Policy
                      </label>
                      <select
                        value={barPolicy}
                        onChange={(e) =>
                          setBarPolicy(
                            e.target.value as ManagedEventRequest['globalStandards']['barPolicy']
                          )
                        }
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                      >
                        <option value="NON_ALCOHOLIC">
                          Mocktails, Herbal Infusions &amp; Traditional Beverages Only
                        </option>
                        <option value="SIGNATURE_COCKTAILS">
                          Curated Signature Cocktails + Fresh Juice Bar
                        </option>
                        <option value="OPEN_PREMIUM_BAR">Full Open Premium Bar with Sommelier</option>
                        <option value="BYOB_CORKAGE">Client Supplied Beverages (Corkage Negotiated)</option>
                      </select>
                    </div>
                  </div>

                  {/* Culinary Styles & Dietary Separations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                      <strong className="text-stone-900 block">
                        Preferred Cuisines (Select all wanted)
                      </strong>
                      <div className="space-y-1.5">
                        {CULINARY_STYLE_OPTIONS.map((item) => (
                          <label key={item} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={culinaryStyles.includes(item)}
                              onChange={() =>
                                toggleGlobalArrayItem(culinaryStyles, item, setCulinaryStyles)
                              }
                              className="rounded text-amber-900"
                            />
                            <span className="text-stone-700">{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                      <strong className="text-stone-900 block">
                        Strict Dietary &amp; Kitchen Separation Standards
                      </strong>
                      <div className="space-y-1.5">
                        {DIETARY_SEPARATION_OPTIONS.map((item) => (
                          <label key={item} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={dietarySeparations.includes(item)}
                              onChange={() =>
                                toggleGlobalArrayItem(
                                  dietarySeparations,
                                  item,
                                  setDietarySeparations
                                )
                              }
                              className="rounded text-amber-900"
                            />
                            <span className="text-stone-700">{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Elders Accessibility, Power/Safety, VIP Hampers, Theme */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">
                        Elders, Wheelchair &amp; Children Comfort Plan
                      </label>
                      <textarea
                        rows={2}
                        value={accessibilityEldersKidsPlan}
                        onChange={(e) => setAccessibilityEldersKidsPlan(e.target.value)}
                        className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">
                        Generator Load &amp; Fire/Havan Safety Specs
                      </label>
                      <textarea
                        rows={2}
                        value={powerBackupAndSafetySpecs}
                        onChange={(e) => setPowerBackupAndSafetySpecs(e.target.value)}
                        className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">
                        VIP Protocol &amp; Welcome Hampers
                      </label>
                      <input
                        type="text"
                        value={vipProtocolAndWelcomeKits}
                        onChange={(e) => setVipProtocolAndWelcomeKits(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">
                        Theme, Floral Aesthetics &amp; Color Palette
                      </label>
                      <input
                        type="text"
                        value={themeAndColorPalette}
                        onChange={(e) => setThemeAndColorPalette(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Operational Checkboxes */}
                  <div className="flex flex-wrap gap-4 p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-800">
                      <input
                        type="checkbox"
                        checked={permitsAndCurfewCompliance}
                        onChange={(e) => setPermitsAndCurfewCompliance(e.target.checked)}
                        className="rounded text-amber-900"
                      />
                      <span>DAO Curfew (10 PM), Drone &amp; Municipal Permits Managed</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-800">
                      <input
                        type="checkbox"
                        checked={hybridLivestreamNeeds}
                        onChange={(e) => setHybridLivestreamNeeds(e.target.checked)}
                        className="rounded text-amber-900"
                      />
                      <span>4K Hybrid Broadcast for Global Family</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-800">
                      <input
                        type="checkbox"
                        checked={ecoZeroWastePreference}
                        onChange={(e) => setEcoZeroWastePreference(e.target.checked)}
                        className="rounded text-amber-900"
                      />
                      <span>Zero-Plastic &amp; Annapurna Food Rescue Eligible</span>
                    </label>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Client Non-Negotiables &amp; Special Dreams
                    </label>
                    <textarea
                      rows={2}
                      value={specialDreamsAndNonNegotiables}
                      onChange={(e) => setSpecialDreamsAndNonNegotiables(e.target.value)}
                      placeholder="Any emotional moments, family customs, surprise reveals, or strict rules our producers must guarantee..."
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-semibold"
                    >
                      ← Back to Vendor Functions
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveStep(4);
                        void handleGenerateSmartBlueprint();
                      }}
                      className="px-5 py-2.5 bg-amber-900 hover:bg-amber-950 text-white rounded-xl font-bold flex items-center gap-2 whitespace-nowrap shrink-0"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Generate Smart Suggestive Blueprint →</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* STEP 4: SMART SUGGESTIVE BLUEPRINT WITH 100% CLIENT AUTHORITY     */}
              {/* ================================================================= */}
              {activeStep === 4 && (
                <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 space-y-5 text-xs">
                  <div className="border-b border-stone-100 pb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                        Suggestive AI Blueprint · Full Client Edit Authority
                      </span>
                      <h2 className="font-display text-lg font-bold text-stone-900">
                        Step 4: Review, Customize &amp; Lock Your Master Execution Blueprint
                      </h2>
                      <p className="text-stone-500 mt-0.5">
                        Source Engine: {blueprint.generatedWith} · Edit any timeline slot, toggle
                        any checklist item, or adjust vendor allocations before submitting.
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isGeneratingBlueprint}
                      onClick={() => void handleGenerateSmartBlueprint()}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-950 text-white rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 disabled:opacity-60"
                    >
                      {isGeneratingBlueprint ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Sourcing Globally...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Re-Source via Web Search</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Executive Summary & Timing Advice (Client Editable) */}
                  <div className="space-y-3">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">
                        Executive Production Summary (Editable)
                      </label>
                      <textarea
                        rows={3}
                        value={blueprint.executiveSummary}
                        onChange={(e) =>
                          setBlueprint((prev) => ({ ...prev, executiveSummary: e.target.value }))
                        }
                        className="w-full p-3 bg-amber-50/40 border border-amber-200 rounded-xl text-stone-800 leading-relaxed"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">
                        Muhurat, Weather &amp; Curfew Timing Note
                      </label>
                      <textarea
                        rows={2}
                        value={blueprint.panchangaAndTimingAdvice}
                        onChange={(e) =>
                          setBlueprint((prev) => ({
                            ...prev,
                            panchangaAndTimingAdvice: e.target.value,
                          }))
                        }
                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-700"
                      />
                    </div>
                  </div>

                  {/* Run of Show Timeline (Client Editable) */}
                  <div className="space-y-3">
                    <strong className="text-stone-900 block">
                      Run-of-Show Choreography ({blueprint.recommendedRunOfShow.filter((s) => s.included).length} active slots)
                    </strong>
                    <div className="space-y-2">
                      {blueprint.recommendedRunOfShow.map((slot) => (
                        <div
                          key={slot.id}
                          className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            slot.included
                              ? 'bg-white border-stone-200'
                              : 'bg-stone-50 border-stone-200 opacity-60'
                          }`}
                        >
                          <div className="flex items-start gap-2.5 flex-1">
                            <input
                              type="checkbox"
                              checked={slot.included}
                              onChange={(e) =>
                                setBlueprint((prev) => ({
                                  ...prev,
                                  recommendedRunOfShow: prev.recommendedRunOfShow.map((s) =>
                                    s.id === slot.id ? { ...s, included: e.target.checked } : s
                                  ),
                                }))
                              }
                              className="mt-1 rounded text-amber-900"
                            />
                            <div className="flex-1 space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono font-bold text-amber-900 tabular-nums">
                                  {slot.timeSlot}
                                </span>
                                <span className="text-stone-300">·</span>
                                <span className="font-bold text-stone-900">{slot.activity}</span>
                              </div>
                              <div className="text-[11px] text-stone-500">
                                Lead: <strong>{slot.leadOwner}</strong> — {slot.notes}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Custom Timeline Slot */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
                      <input
                        type="text"
                        value={newSlotTime}
                        onChange={(e) => setNewSlotTime(e.target.value)}
                        placeholder="Time (e.g. 04:00 PM)"
                        className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg"
                      />
                      <input
                        type="text"
                        value={newSlotActivity}
                        onChange={(e) => setNewSlotActivity(e.target.value)}
                        placeholder="Add custom ceremony / moment..."
                        className="sm:col-span-2 px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newSlotActivity.trim()) return;
                          setBlueprint((prev) => ({
                            ...prev,
                            recommendedRunOfShow: [
                              ...prev.recommendedRunOfShow,
                              {
                                id: `slot-custom-${Date.now()}`,
                                timeSlot: newSlotTime.trim() || 'Flexible Slot',
                                activity: newSlotActivity.trim(),
                                leadOwner: newSlotOwner,
                                notes: 'Added directly under client authority.',
                                included: true,
                              },
                            ],
                          }));
                          setNewSlotTime('');
                          setNewSlotActivity('');
                        }}
                        className="px-3 py-1.5 bg-stone-900 text-white rounded-lg font-bold whitespace-nowrap shrink-0"
                      >
                        + Add Slot
                      </button>
                    </div>
                  </div>

                  {/* Permits & Global Risk Checklist */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                    <strong className="text-stone-900 block">
                      Permits, Curfew &amp; Operational Readiness Checklist
                    </strong>
                    <div className="space-y-1.5">
                      {blueprint.globalRiskAndPermitsChecklist.map((chk) => (
                        <label
                          key={chk.id}
                          className="flex items-start gap-2 cursor-pointer text-stone-700"
                        >
                          <input
                            type="checkbox"
                            checked={chk.completed}
                            onChange={(e) =>
                              setBlueprint((prev) => ({
                                ...prev,
                                globalRiskAndPermitsChecklist:
                                  prev.globalRiskAndPermitsChecklist.map((c) =>
                                    c.id === chk.id ? { ...c, completed: e.target.checked } : c
                                  ),
                              }))
                            }
                            className="mt-0.5 rounded text-emerald-700"
                          />
                          <span>
                            <strong className="text-[10px] text-amber-900 mr-1.5">
                              [{chk.category.replace(/_/g, ' ')}]
                            </strong>
                            {chk.item}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Verified Web Grounding Sources (when generated via Google Search) */}
                  {blueprint.webSources.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-1.5">
                      <span className="font-bold text-amber-950 block">
                        Globally Sourced References (Google Search Grounding):
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {blueprint.webSources.map((src, i) => (
                          <a
                            key={i}
                            href={src.uri}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-amber-200 rounded-lg text-[11px] font-semibold text-amber-900 hover:bg-amber-100"
                          >
                            <span>{src.title}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer Submit */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-200">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveStep(3)}
                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-semibold"
                      >
                        ← Back
                      </button>
                      {!vendorFunctionsReviewed && (
                        <button
                          type="button"
                          onClick={() => setActiveStep(2)}
                          className="px-3 py-2 text-amber-900 underline font-semibold"
                        >
                          Verify Vendor Functions Matrix First
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleSubmitFullDossier}
                      className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold shadow flex items-center gap-2 whitespace-nowrap shrink-0"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit Dossier &amp; Engage UTSAVO Team</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* ================================================================= */
            /* TRACKER MODE: VIEW & EDIT SUBMITTED MANAGED EVENT DOSSIERS        */
            /* ================================================================= */
            <div className="space-y-4">
              {/* Dossier Selector Tabs */}
              <div className="bg-white rounded-2xl border border-stone-200 p-3 flex flex-wrap gap-2 text-xs">
                {managedEventRequests.map((req) => (
                  <button
                    key={req.id}
                    type="button"
                    onClick={() => setActiveDossierId(req.id)}
                    className={`px-3.5 py-2 rounded-xl font-bold transition-colors text-left ${
                      activeSubmittedDossier?.id === req.id
                        ? 'bg-amber-900 text-white'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                    }`}
                  >
                    <div className="font-mono text-[10px] opacity-80">#{req.requestRef}</div>
                    <div className="truncate max-w-[200px]">{req.eventTitle}</div>
                  </button>
                ))}
              </div>

              {activeSubmittedDossier ? (
                <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 space-y-5 text-xs">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-100 pb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                        <span className="font-mono text-stone-500">
                          #{activeSubmittedDossier.requestRef}
                        </span>
                        <span className="text-stone-300">·</span>
                        <span className="text-emerald-800">
                          {activeSubmittedDossier.status.replace(/_/g, ' ')}
                        </span>
                        <span className="text-stone-300">·</span>
                        <span className="text-amber-900">
                          Lead Director: {activeSubmittedDossier.assignedCoordinatorName}
                        </span>
                      </div>
                      <h3 className="font-display text-xl font-bold text-stone-900 mt-1">
                        {activeSubmittedDossier.eventTitle}
                      </h3>
                      <div className="text-stone-600 mt-1 tabular-nums">
                        {activeSubmittedDossier.eventDateBS} BS ({activeSubmittedDossier.eventDateAD}) ·{' '}
                        {activeSubmittedDossier.shift} ({activeSubmittedDossier.startTime}–
                        {activeSubmittedDossier.endTime}) · {activeSubmittedDossier.totalPax} Guests ·{' '}
                        {activeSubmittedDossier.budgetCurrency}{' '}
                        {activeSubmittedDossier.totalBudget.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Team Action Updates Feed */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                    <strong className="text-emerald-950 block">
                      Live UTSAVO Team Progress Updates ({activeSubmittedDossier.teamActionUpdates.length})
                    </strong>
                    <ul className="space-y-1 text-emerald-900">
                      {activeSubmittedDossier.teamActionUpdates.map((upd, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                          <span>{upd}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Client Full-Authority Override Matrix on Submitted Dossier */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <strong className="text-stone-900 text-sm">
                        Vendor Functions Authorizations (Client May Edit Anytime)
                      </strong>
                      <span className="text-[11px] text-stone-500">
                        {
                          activeSubmittedDossier.vendorFunctions.filter(
                            (v) => v.isEnabled && v.mode !== 'NOT_NEEDED'
                          ).length
                        }{' '}
                        Active
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {activeSubmittedDossier.vendorFunctions.map((vf) => (
                        <div
                          key={vf.key}
                          className="p-3 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-900">
                              <input
                                type="checkbox"
                                checked={vf.isEnabled && vf.mode !== 'NOT_NEEDED'}
                                onChange={(e) => {
                                  const nextVfs = activeSubmittedDossier.vendorFunctions.map((item) =>
                                    item.key === vf.key
                                      ? {
                                          ...item,
                                          isEnabled: e.target.checked,
                                          mode: (e.target.checked
                                            ? 'UTSAVO_FULL_MANAGE'
                                            : 'NOT_NEEDED') as VendorFunctionMode,
                                          clientAuthorityLocked: true,
                                        }
                                      : item
                                  );
                                  updateManagedEventByClient(activeSubmittedDossier.id, {
                                    vendorFunctions: nextVfs,
                                  });
                                }}
                                className="rounded text-amber-900"
                              />
                              <span className="truncate">{vf.label}</span>
                            </label>
                            <span className="font-mono font-bold text-amber-950 tabular-nums shrink-0">
                              {activeSubmittedDossier.budgetCurrency}{' '}
                              {vf.allocatedBudgetAmount.toLocaleString()}
                            </span>
                          </div>

                          {vf.isEnabled && vf.mode !== 'NOT_NEEDED' && (
                            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                              <select
                                value={vf.mode}
                                onChange={(e) => {
                                  const nextVfs = activeSubmittedDossier.vendorFunctions.map((item) =>
                                    item.key === vf.key
                                      ? {
                                          ...item,
                                          mode: e.target.value as VendorFunctionMode,
                                          clientAuthorityLocked: true,
                                        }
                                      : item
                                  );
                                  updateManagedEventByClient(activeSubmittedDossier.id, {
                                    vendorFunctions: nextVfs,
                                  });
                                }}
                                className="px-2 py-1 bg-white border border-stone-300 rounded-md font-medium"
                              >
                                <option value="UTSAVO_FULL_MANAGE">UTSAVO Full Manage</option>
                                <option value="CO_SELECT_MARKETPLACE">Co-Select Marketplace</option>
                                <option value="CLIENT_HAS_OWN_VENDOR">Client Own Vendor</option>
                              </select>
                              <span className="text-stone-500 truncate max-w-[180px]">
                                {vf.preferredVendorOrVenueName || vf.selectedTier}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-white rounded-3xl border border-stone-200 text-xs">
                  No managed briefs found yet. Switch to "+ Plan New Managed Event" to begin.
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* RIGHT RAIL (4 cols): DIRECT UTSAVO TEAM COORDINATION ANYTIME      */}
        {/* ================================================================= */}
        <aside className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
          <div className="bg-white rounded-3xl border border-stone-200 p-5 space-y-4 text-xs shadow-sm">
            <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                  Available Anytime · Pre or Post Brief
                </span>
                <h3 className="font-display text-base font-bold text-stone-900">
                  Direct UTSAVO Coordination Desk
                </h3>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Lead Producer:{' '}
                  <strong>
                    {activeSubmittedDossier?.assignedCoordinatorName ||
                      'Aarav Shrestha (Senior Producer)'}
                  </strong>
                </p>
              </div>
              <Headphones className="w-5 h-5 text-amber-800 shrink-0" />
            </div>

            {/* Instant Summary of Client Requirements */}
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1 text-[11px] tabular-nums">
              <div className="flex justify-between">
                <span className="text-stone-500">Occasion &amp; Pax:</span>
                <strong className="text-stone-900">
                  {activeSubmittedDossier?.totalPax || totalPax} Guests
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Target Date:</span>
                <strong className="text-stone-900">
                  {activeSubmittedDossier?.eventDateBS || eventDateBS} BS
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Vendor Functions:</span>
                <strong className="text-amber-900">
                  {activeSubmittedDossier
                    ? activeSubmittedDossier.vendorFunctions.filter(
                        (v) => v.isEnabled && v.mode !== 'NOT_NEEDED'
                      ).length
                    : activeVendorFunctionsCount}{' '}
                  Active
                </strong>
              </div>
            </div>

            {/* Two-Way Live Messages */}
            <div className="space-y-2">
              <span className="font-bold text-stone-700 block">
                Direct Team Message Thread
              </span>

              <div className="max-h-72 overflow-y-auto space-y-2 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                {viewMode === 'TRACKER' && activeSubmittedDossier ? (
                  activeSubmittedDossier.coordinationMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-2.5 rounded-xl text-[11px] leading-relaxed ${
                        msg.senderRole === 'CLIENT'
                          ? 'bg-amber-900 text-white ml-4'
                          : 'bg-white border border-stone-200 text-stone-800 mr-4'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-[10px] opacity-80 mb-0.5">
                        <strong>{msg.senderName}</strong>
                        <span>
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div>{msg.text}</div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="p-2.5 rounded-xl text-[11px] bg-white border border-stone-200 text-stone-800">
                      <strong className="block text-[10px] text-amber-900 mb-0.5">
                        Aarav Shrestha (UTSAVO Event Director)
                      </strong>
                      Namaste {clientName || 'Host'}! Fill in your date, pax, budget, and vendor
                      functions — or send us any question right here anytime while planning.
                    </div>
                    {pendingClientNotes.map((n) => (
                      <div
                        key={n.id}
                        className="p-2.5 rounded-xl text-[11px] bg-amber-900 text-white ml-4"
                      >
                        <div className="text-[10px] opacity-80 mb-0.5">
                          You · {n.time} (Attached to Brief)
                        </div>
                        <div>{n.text}</div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={coordDraftMessage}
                  onChange={(e) => setCoordDraftMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSendDirectMessage('PORTAL_CHAT');
                    }
                  }}
                  placeholder="Coordinate directly with UTSAVO team..."
                  className="flex-1 px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleSendDirectMessage('PORTAL_CHAT')}
                  className="px-3.5 py-2 bg-amber-900 hover:bg-amber-950 text-white rounded-xl font-bold shrink-0"
                  title="Send message to UTSAVO Coordination Desk"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Instant Callback & Direct WhatsApp/Viber Escalation */}
            <div className="pt-3 border-t border-stone-100 space-y-2.5">
              <button
                type="button"
                onClick={() => handleSendDirectMessage('CALLBACK_REQUEST')}
                className="w-full py-2 px-3 bg-stone-900 hover:bg-stone-950 text-white rounded-xl font-bold flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
                <span>Request Immediate Producer Callback</span>
              </button>

              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-[11px] font-semibold text-stone-500">
                  Instant Messaging:
                </span>
                <WhatsAppViberButtons
                  phone={
                    activeSubmittedDossier?.assignedCoordinatorPhone || '+977-9801122334'
                  }
                  messageText={decodeURIComponent(whatsappBriefText)}
                  variant="badges"
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
