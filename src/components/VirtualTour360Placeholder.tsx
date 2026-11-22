/**
 * SAGUNOO - Interactive 360° Virtual Tour Placeholder Layout
 * Helps remote hosts, NRIs, and event planners inspect halls, lawns, sightlines,
 * seating configurations, and spatial zones before an in-person site visit.
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { HallSpace, Venue } from '../types';
import {
  Compass,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Grid,
  MoveHorizontal,
  Calendar,
  Utensils,
  Camera,
  Info,
} from 'lucide-react';
import tourBallroomImg from '../assets/images/tour_ballroom_panorama_1794724251849.jpg';
import tourGardenMandapImg from '../assets/images/tour_garden_mandap_panorama_1794724252214.jpg';
import tourDiningFoyerImg from '../assets/images/tour_dining_foyer_panorama_1794724253559.jpg';

interface SpatialHotspot {
  id: string;
  label: string;
  category: string;
  xPercent: number; // 0 to 100 along the panorama width
  yPercent: number; // 0 to 100 along viewport height
  targetPanPercent: number;
  dimensions: string;
  note: string;
}

interface TourSpaceNode {
  id: string;
  name: string;
  nepaliName?: string;
  spaceKind: 'BALLROOM' | 'GARDEN_MANDAP' | 'DINING_FOYER';
  panoramaSrc: string;
  hallRef?: HallSpace;
  areaSqFt: number;
  ceilingClearance: string;
  minCapacity: number;
  maxCapacity: number;
  baseRentalNpr?: number;
  hotspots: SpatialHotspot[];
}

type LayoutPreset = 'BANQUET_ROUNDS' | 'MANDAP_THEATRE' | 'COCKTAIL_BUFFET';

interface VirtualTour360PlaceholderProps {
  venue: Venue;
  selectedHall: HallSpace;
  onSelectHall: (hall: HallSpace) => void;
  onCheckAvailability: () => void;
  onCustomizeMenu: () => void;
}

export const VirtualTour360Placeholder: React.FC<VirtualTour360PlaceholderProps> = ({
  venue,
  selectedHall,
  onSelectHall,
  onCheckAvailability,
  onCustomizeMenu,
}) => {
  // Build navigable 360° nodes from the venue's real halls + dining/foyer zone
  const tourNodes: TourSpaceNode[] = useMemo(() => {
    const hallNodes: TourSpaceNode[] = venue.halls.map((hall) => {
      const isOutdoor = hall.type === 'GARDEN_LAWN' || hall.type === 'ROOFTOP';
      if (isOutdoor) {
        return {
          id: hall.id,
          name: hall.name,
          nepaliName: hall.nepaliName,
          spaceKind: 'GARDEN_MANDAP',
          panoramaSrc: tourGardenMandapImg,
          hallRef: hall,
          areaSqFt: hall.areaSqFt || 7800,
          ceilingClearance: 'Open-Air Canopy (Tree Fairylight Rigging Ready)',
          minCapacity: hall.minCapacity,
          maxCapacity: hall.maxCapacity,
          baseRentalNpr: hall.baseRentalNpr,
          hotspots: [
            {
              id: `${hall.id}-mandap`,
              label: 'Sacred Vedic Mandap Pavilion',
              category: 'Ceremony Focal Point',
              xPercent: 50,
              yPercent: 52,
              targetPanPercent: 50,
              dimensions: '20 ft × 20 ft raised platform',
              note: 'Open-air ventilation approved for Vedic Havan fire ritual with unobstructed Baraat sightlines.',
            },
            {
              id: `${hall.id}-aisle`,
              label: 'Baraat Processional Walkway',
              category: 'Guest Arrival',
              xPercent: 50,
              yPercent: 79,
              targetPanPercent: 50,
              dimensions: '12 ft wide stone-paved aisle',
              note: 'Flush terrain suitable for elderly guests, wheelchair access, and Panche Baja welcoming.',
            },
            {
              id: `${hall.id}-seating`,
              label: 'Lawn Ceremony Seating Wing',
              category: 'Seating Zone',
              xPercent: 22,
              yPercent: 64,
              targetPanPercent: 28,
              dimensions: `${Math.round((hall.areaSqFt || 7800) * 0.45).toLocaleString()} sq. ft. lawn`,
              note: `Configured for ${hall.minCapacity}–${hall.maxCapacity} guests with weather-canopy anchor points.`,
            },
            {
              id: `${hall.id}-counters`,
              label: 'Live Culinary & Mocktail Perimeter',
              category: 'F&B Service',
              xPercent: 80,
              yPercent: 60,
              targetPanPercent: 74,
              dimensions: '4 covered service stalls',
              note: 'Positioned downwind from the mandap to keep live chaat and tandoor smoke away from guests.',
            },
          ],
        };
      }

      return {
        id: hall.id,
        name: hall.name,
        nepaliName: hall.nepaliName,
        spaceKind: 'BALLROOM',
        panoramaSrc: tourBallroomImg,
        hallRef: hall,
        areaSqFt: hall.areaSqFt || 10500,
        ceilingClearance: '22 ft Clear Span · Crystal Chandelier Truss',
        minCapacity: hall.minCapacity,
        maxCapacity: hall.maxCapacity,
        baseRentalNpr: hall.baseRentalNpr,
        hotspots: [
          {
            id: `${hall.id}-stage`,
            label: 'Main Swayamvar Stage & Backdrop',
            category: 'Stage & Production',
            xPercent: 50,
            yPercent: 53,
            targetPanPercent: 50,
            dimensions: '28 ft × 14 ft elevated stage',
            note: '3-phase 60 kW power distribution panel concealed behind stage wing for LED walls and lighting.',
          },
          {
            id: `${hall.id}-rigging`,
            label: 'Vaulted Chandelier & Acoustic Span',
            category: 'Ceiling & AV',
            xPercent: 50,
            yPercent: 24,
            targetPanPercent: 50,
            dimensions: '22 ft pillar-free ceiling',
            note: 'Supports suspended floral installations and distributed line-array audio with zero pillar obstruction.',
          },
          {
            id: `${hall.id}-tables`,
            label: 'Banquet Dining Cluster',
            category: 'Dining Layout',
            xPercent: 25,
            yPercent: 69,
            targetPanPercent: 30,
            dimensions: '60" round tables · 8–10 pax/table',
            note: `Maintains 5 ft silver-service aisles supporting up to ${hall.maxCapacity} celebration guests.`,
          },
          {
            id: `${hall.id}-bridal`,
            label: 'Bridal Suite & Green Room Corridor',
            category: 'Private Access',
            xPercent: 82,
            yPercent: 57,
            targetPanPercent: 76,
            dimensions: 'Direct step-free side entry',
            note: 'Private acoustic corridor allowing the bride and groom to enter the stage without crossing kitchen traffic.',
          },
        ],
      };
    });

    // Always append Dining & Heritage Foyer spatial node so hosts can inspect guest flow
    hallNodes.push({
      id: `${venue.id}-dining-foyer`,
      name: 'Buffet Pavilion & Heritage Foyer',
      nepaliName: 'बुफे डाइनिङ तथा स्वागत कक्ष',
      spaceKind: 'DINING_FOYER',
      panoramaSrc: tourDiningFoyerImg,
      areaSqFt: 4800,
      ceilingClearance: '16 ft Timber-Beamed Courtyard Pavilion',
      minCapacity: 150,
      maxCapacity: Math.min(600, venue.maxGuests),
      hotspots: [
        {
          id: 'foyer-torana',
          label: 'Carved Newari Welcome Entrance',
          category: 'Arrival & Photo Backdrop',
          xPercent: 18,
          yPercent: 48,
          targetPanPercent: 24,
          dimensions: '14 ft arrival vestibule',
          note: 'Traditional brass lamp welcome zone designed for Tilak reception and family portrait backdrops.',
        },
        {
          id: 'foyer-buffet',
          label: 'Dual-Sided Heated Buffet Islands',
          category: 'Catering Flow',
          xPercent: 57,
          yPercent: 66,
          targetPanPercent: 54,
          dimensions: '4 × 16 ft induction counters',
          note: 'Dual-lane service flow feeds 300+ guests in under 22 minutes without bottlenecking.',
        },
        {
          id: 'foyer-kitchen',
          label: 'Concealed Hot-Kitchen Dispatch',
          category: 'Back of House',
          xPercent: 43,
          yPercent: 52,
          targetPanPercent: 45,
          dimensions: 'Dedicated staff corridor',
          note: 'Direct pass-through from commercial banquet kitchen keeping replenishment discreet and hygienic.',
        },
        {
          id: 'foyer-courtyard',
          label: 'Evening Lounge & Glass Courtyard',
          category: 'Guest Lounge',
          xPercent: 83,
          yPercent: 54,
          targetPanPercent: 76,
          dimensions: 'Indoor-outdoor seating deck',
          note: 'Acoustic glass partition allows elders to converse comfortably while music plays inside the main hall.',
        },
      ],
    });

    return hallNodes;
  }, [venue]);

  // Active space node
  const [activeNodeId, setActiveNodeId] = useState<string>(selectedHall?.id || tourNodes[0]?.id);
  useEffect(() => {
    if (selectedHall?.id && tourNodes.some((n) => n.id === selectedHall.id)) {
      setActiveNodeId(selectedHall.id);
    }
  }, [selectedHall?.id, tourNodes]);

  const activeNode = useMemo(
    () => tourNodes.find((n) => n.id === activeNodeId) || tourNodes[0],
    [tourNodes, activeNodeId]
  );

  // Interactive 360 pan & zoom state
  // panPercent: 0..100 represents horizontal camera center across the wide panoramic canvas
  const [panPercent, setPanPercent] = useState<number>(50);
  const [pitchOffsetPx, setPitchOffsetPx] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1.15);
  const [isAutoOrbit, setIsAutoOrbit] = useState<boolean>(false);
  const [showSpatialGrid, setShowSpatialGrid] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(
    activeNode?.hotspots[0]?.id || null
  );
  const [layoutPreset, setLayoutPreset] = useState<LayoutPreset>('BANQUET_ROUNDS');
  const [imgErrorMap, setImgErrorMap] = useState<Record<string, boolean>>({});
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const dragStartRef = useRef<{ x: number; y: number; startPan: number; startPitch: number } | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Reset hotspot when space changes
  useEffect(() => {
    setPanPercent(50);
    setPitchOffsetPx(0);
    setActiveHotspotId(activeNode?.hotspots[0]?.id || null);
  }, [activeNode?.id]);

  // Respect prefers-reduced-motion for auto-orbit
  useEffect(() => {
    if (!isAutoOrbit || isDragging) return;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setIsAutoOrbit(false);
      return;
    }

    let frameId: number;
    let direction = 1;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      setPanPercent((prev) => {
        let next = prev + direction * dt * 4.5;
        if (next >= 86) {
          next = 86;
          direction = -1;
        } else if (next <= 14) {
          next = 14;
          direction = 1;
        }
        return next;
      });
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isAutoOrbit, isDragging]);

  // Pointer drag handlers for 360 panning
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    setIsAutoOrbit(false);
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startPan: panPercent,
      startPitch: pitchOffsetPx,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const width = viewportRef.current?.clientWidth || 800;

    // Dragging left moves camera right (increases panPercent)
    const panDelta = (-dx / width) * 55;
    const nextPan = Math.max(8, Math.min(92, dragStartRef.current.startPan + panDelta));
    const nextPitch = Math.max(-24, Math.min(24, dragStartRef.current.startPitch + dy * 0.25));

    setPanPercent(nextPan);
    setPitchOffsetPx(nextPitch);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    dragStartRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer already released
    }
  };

  // Convert panPercent (8..92) into 360-degree compass azimuth (0..359)
  const headingDegrees = useMemo(() => {
    const raw = Math.round(((panPercent - 50) / 42) * 180 + 180) % 360;
    return raw < 0 ? raw + 360 : raw;
  }, [panPercent]);

  const cardinalLabel = useMemo(() => {
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return dirs[Math.round(headingDegrees / 45) % 8];
  }, [headingDegrees]);

  const activeHotspot = useMemo(
    () => activeNode?.hotspots.find((h) => h.id === activeHotspotId) || null,
    [activeNode, activeHotspotId]
  );

  // Projected seating breakdown based on selected layout preset
  const layoutBreakdown = useMemo(() => {
    const area = activeNode?.areaSqFt || 8000;
    const maxCap = activeNode?.maxCapacity || 500;
    if (layoutPreset === 'BANQUET_ROUNDS') {
      const guests = Math.min(maxCap, Math.round(area / 14));
      return {
        title: 'Banquet Round Tables (8–10 pax)',
        estimatedGuests: guests,
        tableCount: Math.max(10, Math.round(guests / 9)),
        aisleWidth: '5 ft silver-service clearance',
        note: 'Ideal for formal Vivah receptions, sit-down family dining, and corporate award galas.',
      };
    }
    if (layoutPreset === 'MANDAP_THEATRE') {
      const guests = Math.min(maxCap, Math.round(area / 10));
      return {
        title: 'Wedding Mandap & Theatre Seating',
        estimatedGuests: guests,
        tableCount: Math.max(20, Math.round(guests / 2)),
        aisleWidth: '10 ft Baraat central aisle',
        note: 'Optimizes unobstructed sightlines toward the central Vedic Mandap or Swayamvar stage.',
      };
    }
    const guests = Math.min(Math.round(maxCap * 1.1), Math.round(area / 9));
    return {
      title: 'Cocktail Lounge & Free-Flow Buffet',
      estimatedGuests: guests,
      tableCount: Math.max(12, Math.round(guests / 18)),
      aisleWidth: '8 ft perimeter buffet lanes',
      note: 'Blends standing high-top tables, elder sofa clusters, and live culinary stations.',
    };
  }, [activeNode, layoutPreset]);

  const handleSelectHotspot = (spot: SpatialHotspot) => {
    setActiveHotspotId(spot.id);
    setIsAutoOrbit(false);
    setPanPercent(spot.targetPanPercent);
  };

  const handleSelectSpaceNode = (node: TourSpaceNode) => {
    setActiveNodeId(node.id);
    if (node.hallRef) {
      onSelectHall(node.hallRef);
    }
  };

  const handleResetView = () => {
    setIsAutoOrbit(false);
    setPanPercent(50);
    setPitchOffsetPx(0);
    setZoomLevel(1.15);
  };

  // Compute CSS horizontal translation inside wide canvas (canvas width = 185% of viewport)
  const panTranslateXPercent = -((panPercent / 100) * 45); // smoothly pans across 185% panorama width

  return (
    <div className="space-y-5">
      {/* Top Bar: Space Switcher & Placeholder Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
            <Compass className="w-4 h-4 text-amber-800" />
            <span>360° Virtual Walkthrough · Placeholder Layout</span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Drag horizontally to look around, zoom in on ceiling trusses, or tap spatial markers to inspect remote capacity.
          </p>
        </div>

        {/* Space / Hall Switcher */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl overflow-x-auto max-w-full">
          {tourNodes.map((node) => {
            const active = node.id === activeNode.id;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => handleSelectSpaceNode(node)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {node.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive 360° Panoramic Viewport */}
      <div
        ref={viewportRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="region"
        aria-label={`Interactive 360-degree virtual tour preview for ${activeNode.name}`}
        className={`relative w-full overflow-hidden rounded-2xl bg-stone-950 border border-stone-200 select-none touch-none ${
          isExpanded ? 'h-[62vh] min-h-[420px]' : 'h-[340px] sm:h-[400px]'
        } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        {/* Wide Panoramic Image Track (or styled fallback if asset fails) */}
        <div
          className="absolute inset-y-0 left-0 h-full will-change-transform"
          style={{
            width: '185%',
            transform: `translate3d(${panTranslateXPercent}%, ${pitchOffsetPx}px, 0) scale(${zoomLevel})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {!imgErrorMap[activeNode.id] ? (
            <img
              src={activeNode.panoramaSrc}
              alt={`${venue.name} - ${activeNode.name} 360 panoramic preview`}
              referrerPolicy="no-referrer"
              draggable={false}
              onError={() => setImgErrorMap((prev) => ({ ...prev, [activeNode.id]: true }))}
              className="w-full h-full object-cover object-center pointer-events-none"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-950 via-stone-900 to-stone-950 flex flex-col items-center justify-center text-stone-300 p-8">
              <Camera className="w-10 h-10 text-amber-400 mb-2" />
              <div className="text-sm font-semibold text-white">{activeNode.name}</div>
              <div className="text-xs text-stone-400 mt-1">
                360° Equirectangular Panorama Placeholder · {activeNode.areaSqFt.toLocaleString()} sq. ft.
              </div>
            </div>
          )}

          {/* Spatial Hotspots Placed Inside Panoramic Coordinate Space */}
          {activeNode.hotspots.map((spot) => {
            const isSelected = spot.id === activeHotspotId;
            return (
              <button
                key={spot.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectHotspot(spot);
                }}
                style={{
                  left: `${spot.xPercent}%`,
                  top: `${spot.yPercent}%`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-lg border whitespace-nowrap ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 border-amber-300 scale-105'
                    : 'bg-stone-950/80 hover:bg-stone-900 text-white border-white/25 backdrop-blur-sm'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    isSelected ? 'bg-stone-950' : 'bg-amber-400'
                  }`}
                />
                <span>{spot.label}</span>
              </button>
            );
          })}
        </div>

        {/* Measured Contrast Top & Bottom Scrims */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/70 via-black/30 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/85 via-black/45 to-transparent z-10" />

        {/* Architectural Spatial Grid & Horizon Overlay */}
        {showSpatialGrid && (
          <div className="pointer-events-none absolute inset-0 z-10 opacity-35">
            <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-amber-300/60" />
            <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-amber-300/40" />
            {/* Crosshair reticle */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-amber-300/70" />
          </div>
        )}

        {/* Top-Left Compass & Orientation Readout */}
        <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-3 text-white">
          <div className="bg-stone-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 flex items-center gap-2 text-xs">
            <Compass
              className="w-4 h-4 text-amber-400 shrink-0 transition-transform"
              style={{ transform: `rotate(${headingDegrees}deg)` }}
            />
            <span className="font-mono tabular-nums font-semibold">
              {headingDegrees}° {cardinalLabel}
            </span>
            <span className="text-stone-400" aria-hidden="true">·</span>
            <span className="text-stone-300 tabular-nums">
              {Math.round(zoomLevel * 100)}% zoom
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-stone-950/70 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/15 text-[11px] text-stone-200">
            <MoveHorizontal className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>Drag view to rotate 360°</span>
          </div>
        </div>

        {/* Top-Right Placeholder Specification Tag */}
        <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-2">
          <div className="bg-stone-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 text-[11px] font-medium text-amber-200 whitespace-nowrap">
            360° Matterport / Panorama Slot
          </div>
        </div>

        {/* Bottom-Left Active Spatial Hotspot Detail Card */}
        {activeHotspot && (
          <div className="absolute bottom-3.5 left-3.5 right-3.5 sm:right-auto sm:max-w-md z-20 bg-stone-950/88 backdrop-blur-md text-white p-3.5 rounded-xl border border-white/15 shadow-xl">
            <div className="flex items-center justify-between gap-2 text-[11px] text-amber-300 font-medium">
              <span>{activeHotspot.category}</span>
              <span className="tabular-nums text-stone-300">{activeHotspot.dimensions}</span>
            </div>
            <h5 className="font-semibold text-sm text-white mt-0.5">{activeHotspot.label}</h5>
            <p className="text-xs text-stone-300 mt-1 leading-relaxed">{activeHotspot.note}</p>
          </div>
        )}

        {/* Bottom-Right Viewport Controls */}
        <div className="hidden sm:flex items-center gap-1.5 absolute bottom-3.5 right-3.5 z-20 bg-stone-950/85 backdrop-blur-md p-1.5 rounded-xl border border-white/15 text-white">
          <button
            type="button"
            onClick={() => setIsAutoOrbit((v) => !v)}
            title={isAutoOrbit ? 'Pause 360° Pan' : 'Auto-Pan 360°'}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              isAutoOrbit ? 'bg-amber-500 text-stone-950 font-semibold' : 'hover:bg-white/10 text-stone-200'
            }`}
          >
            {isAutoOrbit ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoOrbit ? 'Pause' : 'Auto-Pan'}</span>
          </button>

          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(1.0, Number((z - 0.15).toFixed(2))))}
            title="Zoom Out"
            className="p-1.5 rounded-lg hover:bg-white/10 text-stone-200 transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(1.75, Number((z + 0.15).toFixed(2))))}
            title="Zoom In"
            className="p-1.5 rounded-lg hover:bg-white/10 text-stone-200 transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowSpatialGrid((g) => !g)}
            title="Toggle Spatial Grid"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              showSpatialGrid ? 'bg-white/15 text-amber-300' : 'hover:bg-white/10 text-stone-300'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleResetView}
            title="Reset Camera Angle"
            className="p-1.5 rounded-lg hover:bg-white/10 text-stone-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded((e) => !e)}
            title={isExpanded ? 'Collapse View' : 'Expand View'}
            className="p-1.5 rounded-lg hover:bg-white/10 text-stone-200 transition-colors cursor-pointer"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Viewport Controls Strip */}
      <div className="flex sm:hidden items-center justify-between gap-2 bg-stone-100 p-2 rounded-xl border border-stone-200 text-xs">
        <button
          type="button"
          onClick={() => setIsAutoOrbit((v) => !v)}
          className="px-3 py-1.5 bg-white border border-stone-200 rounded-lg font-medium text-stone-800 flex items-center gap-1.5"
        >
          {isAutoOrbit ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isAutoOrbit ? 'Pause' : 'Auto-Pan'}</span>
        </button>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(1.0, Number((z - 0.15).toFixed(2))))}
            className="p-2 bg-white border border-stone-200 rounded-lg text-stone-700"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(1.75, Number((z + 0.15).toFixed(2))))}
            className="p-2 bg-white border border-stone-200 rounded-lg text-stone-700"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetView}
            className="p-2 bg-white border border-stone-200 rounded-lg text-stone-700"
            aria-label="Reset camera"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Spatial Specs & Event Seating Visualizer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1">
        {/* Left: Seating Configuration Visualizer */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Remote Layout & Capacity Preview
            </h4>
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg text-xs">
              {[
                { id: 'BANQUET_ROUNDS', label: 'Banquet Rounds' },
                { id: 'MANDAP_THEATRE', label: 'Mandap Ceremony' },
                { id: 'COCKTAIL_BUFFET', label: 'Cocktail & Buffet' },
              ].map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setLayoutPreset(preset.id as LayoutPreset)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    layoutPreset === preset.id
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-stone-900">{layoutBreakdown.title}</div>
                <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{layoutBreakdown.note}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[11px] text-stone-500 block">Projected Fit</span>
                <span className="text-lg font-bold text-amber-950 font-display tabular-nums">
                  {layoutBreakdown.estimatedGuests} guests
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-stone-200/80 text-xs">
              <div>
                <span className="text-[11px] text-stone-500 block">Floor Footprint</span>
                <strong className="text-stone-900 tabular-nums">
                  {activeNode.areaSqFt.toLocaleString()} sq. ft.
                </strong>
              </div>
              <div>
                <span className="text-[11px] text-stone-500 block">Cluster Setup</span>
                <strong className="text-stone-900 tabular-nums">
                  {layoutBreakdown.tableCount} {layoutPreset === 'MANDAP_THEATRE' ? 'rows' : 'tables'}
                </strong>
              </div>
              <div>
                <span className="text-[11px] text-stone-500 block">Aisle Clearance</span>
                <strong className="text-stone-900">{layoutBreakdown.aisleWidth}</strong>
              </div>
            </div>
          </div>

          {/* Quick Jump Spatial Markers List */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-medium text-stone-500">Jump to zone:</span>
            {activeNode.hotspots.map((spot) => (
              <button
                key={spot.id}
                type="button"
                onClick={() => handleSelectHotspot(spot)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                  activeHotspotId === spot.id
                    ? 'bg-amber-50 border-amber-800 text-amber-950 font-semibold'
                    : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                }`}
              >
                {spot.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Placeholder Architecture & Next Action Card */}
        <div className="lg:col-span-5 flex flex-col justify-between p-4 bg-white rounded-2xl border border-stone-200 space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Space Specifications
              </h4>
              <span className="text-xs font-medium text-stone-600 tabular-nums">
                {activeNode.minCapacity}–{activeNode.maxCapacity} pax
              </span>
            </div>

            <div className="text-xs text-stone-600 space-y-1.5">
              <div className="flex items-center justify-between py-1 border-b border-stone-100">
                <span>Selected Space</span>
                <strong className="text-stone-900 text-right">{activeNode.name}</strong>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-stone-100">
                <span>Ceiling & Rigging</span>
                <strong className="text-stone-900 text-right">{activeNode.ceilingClearance}</strong>
              </div>
              {activeNode.baseRentalNpr && (
                <div className="flex items-center justify-between py-1 border-b border-stone-100">
                  <span>Base Hall Rental</span>
                  <strong className="text-amber-950 tabular-nums">
                    NPR {activeNode.baseRentalNpr.toLocaleString()}
                  </strong>
                </div>
              )}
              <div className="flex items-start gap-2 pt-1 text-[11px] text-stone-500 leading-relaxed">
                <Info className="w-3.5 h-3.5 text-amber-800 shrink-0 mt-0.5" />
                <span>
                  This interactive 360° layout serves as a remote spatial preview placeholder, ready for live Matterport, Kuula, or 360° equirectangular camera embeds.
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onCheckAvailability}
              className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-800" />
              <span>Check Dates</span>
            </button>
            <button
              type="button"
              onClick={onCustomizeMenu}
              className="px-3 py-2 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Utensils className="w-3.5 h-3.5 text-amber-300" />
              <span>Quote This Space</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
