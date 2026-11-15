/**
 * UTSAVO — System Admin Concierge Sourcing & Worldwide Fulfillment Panel
 * Manages:
 * 1. Client Star Hotel Venue Requests (scouting availability, quoting rates, & 1-click publishing into live Venues)
 * 2. Outside-Nepal Worldwide Celebrations Dossiers (updating milestone stages, logging deliverables & coordinator notes)
 */

import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  OutsideNepalDestinationRequest,
  StarHotelSourcingRequest,
} from '../types';
import {
  Building2,
  Globe,
  CheckCircle2,
  Plus,
  Sparkles,
  Calendar,
  Users,
  BedDouble,
} from 'lucide-react';

interface AdminConciergeSourcingTabProps {
  onToast?: (message: string) => void;
}

export const AdminConciergeSourcingTab: React.FC<AdminConciergeSourcingTabProps> = ({
  onToast,
}) => {
  const {
    starHotelRequests,
    updateStarHotelRequestByAdmin,
    publishStarHotelAsVenue,
    outsideNepalRequests,
    updateOutsideNepalRequestByAdmin,
  } = useMarketplace();

  const [subTab, setSubTab] = useState<'STAR_HOTELS' | 'OUTSIDE_NEPAL'>('STAR_HOTELS');

  // Local draft inputs per star hotel request
  const [hotelNotesDraft, setHotelNotesDraft] = useState<Record<string, string>>({});
  const [proposalHotelName, setProposalHotelName] = useState<Record<string, string>>({});
  const [proposalStarLabel, setProposalStarLabel] = useState<Record<string, string>>({});
  const [proposalPlateRate, setProposalPlateRate] = useState<Record<string, number>>({});
  const [proposalHallRate, setProposalHallRate] = useState<Record<string, number>>({});
  const [proposalRoomRate, setProposalRoomRate] = useState<Record<string, number>>({});
  const [proposalNote, setProposalNote] = useState<Record<string, string>>({});

  // Local draft inputs per outside-Nepal dossier
  const [intlNotesDraft, setIntlNotesDraft] = useState<Record<string, string>>({});
  const [intlDeliverableDraft, setIntlDeliverableDraft] = useState<Record<string, string>>({});

  const notify = (msg: string) => {
    if (onToast) onToast(msg);
  };

  const handleSaveStarHotelStatus = (
    req: StarHotelSourcingRequest,
    newStatus: StarHotelSourcingRequest['status']
  ) => {
    updateStarHotelRequestByAdmin(req.id, {
      status: newStatus,
      adminWorkNotes: hotelNotesDraft[req.id] ?? req.adminWorkNotes,
    });
    notify(`Updated #${req.requestRef} (${req.clientName}) to ${newStatus.replace(/_/g, ' ')}.`);
  };

  const handleAddHotelProposal = (req: StarHotelSourcingRequest) => {
    const hName = (proposalHotelName[req.id] || '').trim();
    if (!hName) return;

    updateStarHotelRequestByAdmin(req.id, {
      status: 'PROPOSAL_AND_RATES_SHARED',
      adminWorkNotes: hotelNotesDraft[req.id] ?? req.adminWorkNotes,
      newProposal: {
        hotelName: hName,
        starCategory: proposalStarLabel[req.id]?.trim() || '5-Star Luxury Hotel',
        districtOrCity: req.districtOrCity,
        quotedPerPlateNprOrUsd: Number(proposalPlateRate[req.id]) || (req.targetBudgetCurrency === 'USD' ? 85 : 4200),
        quotedHallRentalNprOrUsd: Number(proposalHallRate[req.id]) || (req.targetBudgetCurrency === 'USD' ? 2500 : 165000),
        roomBlockRateNprOrUsd: Number(proposalRoomRate[req.id]) || (req.targetBudgetCurrency === 'USD' ? 190 : 18500),
        currency: req.targetBudgetCurrency,
        availabilityNote:
          proposalNote[req.id]?.trim() ||
          `Confirmed ballroom & block availability for ${req.eventDateBS} BS.`,
      },
    });

    setProposalHotelName((prev) => ({ ...prev, [req.id]: '' }));
    setProposalNote((prev) => ({ ...prev, [req.id]: '' }));
    notify(`Shared corporate rate quote for "${hName}" on #${req.requestRef}.`);
  };

  const handleSaveIntlUpdate = (
    req: OutsideNepalDestinationRequest,
    newStatus: OutsideNepalDestinationRequest['status']
  ) => {
    const newDel = (intlDeliverableDraft[req.id] || '').trim();
    updateOutsideNepalRequestByAdmin(req.id, {
      status: newStatus,
      adminCoordinatorNotes: intlNotesDraft[req.id] ?? req.adminCoordinatorNotes,
      newDeliverable: newDel || undefined,
    });
    if (newDel) {
      setIntlDeliverableDraft((prev) => ({ ...prev, [req.id]: '' }));
    }
    notify(`Updated Outside-Nepal Dossier #${req.requestRef} (${newStatus.replace(/_/g, ' ')}).`);
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation bar */}
      <div className="p-4 bg-white rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setSubTab('STAR_HOTELS')}
            className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              subTab === 'STAR_HOTELS'
                ? 'bg-amber-900 text-white font-bold'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Star Hotel Venue Requests ({starHotelRequests.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('OUTSIDE_NEPAL')}
            className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              subTab === 'OUTSIDE_NEPAL'
                ? 'bg-amber-900 text-white font-bold'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Outside-Nepal Global Celebrations ({outsideNepalRequests.length})</span>
          </button>
        </div>

        <span className="text-xs text-stone-500">
          Admin Concierge fulfillment updates sync immediately to Customer Dashboard
        </span>
      </div>

      {/* PANEL 1: STAR HOTEL VENUE REQUESTS */}
      {subTab === 'STAR_HOTELS' && (
        <div className="space-y-4">
          {starHotelRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 space-y-4 text-xs"
            >
              {/* Header row */}
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-100 pb-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-stone-500">#{req.requestRef}</span>
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-950 font-bold text-[10px]">
                      {req.starTier.replace(/_/g, ' ')}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-800 font-bold text-[10px]">
                      {req.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h4 className="font-display text-lg font-bold text-stone-900">
                    {req.preferredHotelNames}
                  </h4>
                  <div className="text-stone-600 flex flex-wrap items-center gap-x-2.5 gap-y-1 tabular-nums">
                    <span>
                      <strong>Client:</strong> {req.clientName} ({req.clientPhone})
                    </span>
                    <span className="text-stone-300">·</span>
                    <span>
                      <strong>Location:</strong> {req.districtOrCity}, {req.country}
                    </span>
                    <span className="text-stone-300">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-800" />
                      {req.eventDateBS} BS ({req.shift})
                    </span>
                    <span className="text-stone-300">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-amber-800" />
                      {req.estimatedGuests} Guests
                    </span>
                    {req.roomBlockNeeded && (
                      <>
                        <span className="text-stone-300">·</span>
                        <span className="inline-flex items-center gap-1">
                          <BedDouble className="w-3.5 h-3.5 text-amber-800" />
                          {req.roomsCount} Rooms
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-right tabular-nums shrink-0">
                  <span className="text-[10px] text-stone-400 block uppercase">Target Budget</span>
                  <strong className="font-display text-base font-bold text-stone-900">
                    {req.targetBudgetCurrency} {req.targetBudgetAmount.toLocaleString()}
                  </strong>
                  <div className="text-[11px] text-stone-500">
                    {req.banquetSetting.replace(/_/g, ' ')}
                  </div>
                </div>
              </div>

              {req.specialHospitalityNotes && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-700">
                  <strong>Client Requirements:</strong> {req.specialHospitalityNotes}
                </div>
              )}

              {/* Admin Progress Notes & Workflow Status Buttons */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block font-bold text-stone-700">
                    Admin Coordinator Notes &amp; Hotel Contact Log
                  </label>
                  <textarea
                    rows={2}
                    value={hotelNotesDraft[req.id] ?? req.adminWorkNotes ?? ''}
                    onChange={(e) =>
                      setHotelNotesDraft((prev) => ({ ...prev, [req.id]: e.target.value }))
                    }
                    placeholder="Log hotel sales contact, ballroom hold expiration, negotiated corporate discounts..."
                    className="w-full p-2.5 border border-stone-300 rounded-xl bg-white"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {(
                      [
                        ['ADMIN_SCOUTING_HOTELS', 'Mark Scouting'],
                        ['PROPOSAL_AND_RATES_SHARED', 'Quotes Shared'],
                        ['HOTEL_SECURED', 'Mark Secured'],
                      ] as const
                    ).map(([statusKey, label]) => (
                      <button
                        key={statusKey}
                        type="button"
                        onClick={() => handleSaveStarHotelStatus(req, statusKey)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-[11px] whitespace-nowrap shrink-0 transition-colors ${
                          req.status === statusKey
                            ? 'bg-amber-900 text-white'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add New Verified Star Hotel Quote */}
                <div className="p-3.5 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-2.5">
                  <div className="font-bold text-amber-950 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Sourced Star Hotel Option &amp; Corporate Quote</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={proposalHotelName[req.id] || ''}
                      onChange={(e) =>
                        setProposalHotelName((prev) => ({ ...prev, [req.id]: e.target.value }))
                      }
                      placeholder="Secured Hotel Name (e.g. Kathmandu Marriott)"
                      className="px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg"
                    />
                    <input
                      type="text"
                      value={proposalStarLabel[req.id] || ''}
                      onChange={(e) =>
                        setProposalStarLabel((prev) => ({ ...prev, [req.id]: e.target.value }))
                      }
                      placeholder="Tier (e.g. 5-Star Luxury)"
                      className="px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 tabular-nums">
                    <div>
                      <span className="text-[10px] text-stone-500 block">
                        Plate ({req.targetBudgetCurrency})
                      </span>
                      <input
                        type="number"
                        value={
                          proposalPlateRate[req.id] ??
                          (req.targetBudgetCurrency === 'USD' ? 85 : 4200)
                        }
                        onChange={(e) =>
                          setProposalPlateRate((prev) => ({
                            ...prev,
                            [req.id]: Number(e.target.value),
                          }))
                        }
                        className="w-full px-2 py-1 bg-white border border-stone-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 block">
                        Hall ({req.targetBudgetCurrency})
                      </span>
                      <input
                        type="number"
                        value={
                          proposalHallRate[req.id] ??
                          (req.targetBudgetCurrency === 'USD' ? 2500 : 165000)
                        }
                        onChange={(e) =>
                          setProposalHallRate((prev) => ({
                            ...prev,
                            [req.id]: Number(e.target.value),
                          }))
                        }
                        className="w-full px-2 py-1 bg-white border border-stone-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 block">
                        Room ({req.targetBudgetCurrency})
                      </span>
                      <input
                        type="number"
                        value={
                          proposalRoomRate[req.id] ??
                          (req.targetBudgetCurrency === 'USD' ? 190 : 18500)
                        }
                        onChange={(e) =>
                          setProposalRoomRate((prev) => ({
                            ...prev,
                            [req.id]: Number(e.target.value),
                          }))
                        }
                        className="w-full px-2 py-1 bg-white border border-stone-300 rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={proposalNote[req.id] || ''}
                      onChange={(e) =>
                        setProposalNote((prev) => ({ ...prev, [req.id]: e.target.value }))
                      }
                      placeholder="Availability & corporate perk note..."
                      className="flex-1 px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddHotelProposal(req)}
                      className="px-3.5 py-1.5 bg-amber-900 hover:bg-amber-950 text-white rounded-lg font-bold whitespace-nowrap shrink-0"
                    >
                      Save Quote
                    </button>
                  </div>
                </div>
              </div>

              {/* Existing Sourced Proposals with 1-Click Marketplace Publish */}
              {req.sourcedHotelProposals && req.sourcedHotelProposals.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <span className="font-bold text-stone-700 uppercase text-[11px] tracking-wider block">
                    Admin Sourced Proposals ({req.sourcedHotelProposals.length})
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {req.sourcedHotelProposals.map((prop) => (
                      <div
                        key={prop.id}
                        className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50 flex flex-col justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <strong className="text-stone-900">{prop.hotelName}</strong>
                            <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                              {prop.starCategory}
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-600 mt-1 tabular-nums">
                            Plate: <strong>{prop.currency} {prop.quotedPerPlateNprOrUsd.toLocaleString()}</strong> · Hall:{' '}
                            <strong>{prop.currency} {prop.quotedHallRentalNprOrUsd.toLocaleString()}</strong>
                            {prop.roomBlockRateNprOrUsd
                              ? ` · Room: ${prop.currency} ${prop.roomBlockRateNprOrUsd.toLocaleString()}/night`
                              : ''}
                          </div>
                          <p className="text-[11px] text-stone-500 mt-1">{prop.availabilityNote}</p>
                        </div>

                        <div className="flex items-center justify-end pt-1">
                          {prop.publishedVenueId ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Published in Live Venues Catalog</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const created = publishStarHotelAsVenue(req.id, prop);
                                if (created) {
                                  notify(
                                    `Published "${created.name}" into the live Party Palaces & Venues marketplace!`
                                  );
                                }
                              }}
                              className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold text-[11px] whitespace-nowrap shrink-0"
                            >
                              Publish Secured Hotel to Venues →
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* PANEL 2: OUTSIDE-NEPAL GLOBAL CELEBRATIONS */}
      {subTab === 'OUTSIDE_NEPAL' && (
        <div className="space-y-4">
          {outsideNepalRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 space-y-4 text-xs"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-100 pb-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-stone-500">#{req.requestRef}</span>
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-950 font-bold text-[10px]">
                      {req.status.replace(/_/g, ' ')}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-800 font-bold text-[10px]">
                      {req.accommodationArchetype.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h4 className="font-display text-lg font-bold text-stone-900">
                    {req.targetCityOrRegion}, {req.targetCountry} — {req.clientName}
                  </h4>
                  <div className="text-stone-600 tabular-nums">
                    {req.estimatedGuests} Guests · {req.celebrationDaysCount} Days · Window:{' '}
                    {req.preferredDateWindowAD} · Rooms: {req.roomBlockCount}
                  </div>
                </div>

                <div className="text-right tabular-nums shrink-0">
                  <span className="text-[10px] text-stone-400 block uppercase">Allocated Budget</span>
                  <strong className="font-display text-base font-bold text-stone-900">
                    {req.currency} {req.budgetAmount.toLocaleString()}
                  </strong>
                  <div className="text-[11px] text-stone-500">{req.clientPhone}</div>
                </div>
              </div>

              {/* Gathered Global Dossier Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <strong className="block text-stone-900">Flights &amp; Visas</strong>
                  <div>Origins: {req.originCities}</div>
                  <div>Passports: {req.guestPassportNationalities}</div>
                  <div>
                    Group Visa Desk: <strong>{req.needGroupVisaConcierge ? 'Yes' : 'No'}</strong>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <strong className="block text-stone-900">Nepal Cultural Bridge &amp; Diet</strong>
                  <div>
                    Rituals: {req.ceremonialRitualsIncluded.length} events ·{' '}
                    {req.culturalBridgeNeeds.bilingualVedicOrBuddhistPriest ? 'Bilingual Acharya · ' : ''}
                    {req.culturalBridgeNeeds.flyPancheBajaOrFolkTroupe ? 'Panchai Baja · ' : ''}
                    {req.culturalBridgeNeeds.liveBroadcastBackToNepal ? '4K Stream to Nepal' : ''}
                  </div>
                  <div>
                    Culinary: {req.culinaryDesign.dietaryProfiles.join(', ')}
                    {req.culinaryDesign.flyNepaliMaharajChef ? ' (Fly Maharaj Chef)' : ''}
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <strong className="block text-stone-900">Memorable Touches &amp; Care</strong>
                  <div>Palette: {req.aestheticColorPalette}</div>
                  <div>Elders/Kids: {req.eldersAndKidsAccessibilityNotes || 'Standard access'}</div>
                  <div>
                    Highlights: {req.memorableSignatureExperiences.slice(0, 2).join(' · ')}
                  </div>
                </div>
              </div>

              {/* Admin Fulfillment Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
                <div className="space-y-2">
                  <label className="block font-bold text-stone-700">
                    Global Concierge Notes &amp; Milestone Status
                  </label>
                  <textarea
                    rows={2}
                    value={intlNotesDraft[req.id] ?? req.adminCoordinatorNotes ?? ''}
                    onChange={(e) =>
                      setIntlNotesDraft((prev) => ({ ...prev, [req.id]: e.target.value }))
                    }
                    placeholder="Record resort buyout holds, group visa dossier updates, Maharaj flight confirmations..."
                    className="w-full p-2.5 border border-stone-300 rounded-xl bg-white"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {(
                      [
                        ['PARTNER_HOTEL_SCOUTING', 'Hotel Scouting'],
                        ['MEMORABLE_PROPOSAL_READY', 'Proposal Ready'],
                        ['ARRANGEMENTS_CONFIRMED', 'Confirm Arrangements'],
                      ] as const
                    ).map(([statusKey, label]) => (
                      <button
                        key={statusKey}
                        type="button"
                        onClick={() => handleSaveIntlUpdate(req, statusKey)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-[11px] whitespace-nowrap shrink-0 transition-colors ${
                          req.status === statusKey
                            ? 'bg-amber-900 text-white'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <label className="block font-bold text-stone-700">
                    Arranged Deliverables Checklist ({req.arrangedDeliverables?.length || 0})
                  </label>
                  {req.arrangedDeliverables && req.arrangedDeliverables.length > 0 && (
                    <ul className="space-y-1 text-[11px] text-emerald-900">
                      {req.arrangedDeliverables.map((d, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={intlDeliverableDraft[req.id] || ''}
                      onChange={(e) =>
                        setIntlDeliverableDraft((prev) => ({ ...prev, [req.id]: e.target.value }))
                      }
                      placeholder="Add completed deliverable (e.g. Resort soft-hold confirmed)..."
                      className="flex-1 px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveIntlUpdate(req, req.status)}
                      className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold whitespace-nowrap shrink-0"
                    >
                      Add Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
