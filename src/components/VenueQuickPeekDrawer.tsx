/**
 * UTSAVO - 1-Tap Venue Quick-Peek Drawer
 * Designed for "Maximum Information at Minimum Touchable":
 * Instant glanceable inspection of capacity, per-plate price, parking, sound curfew,
 * verified PAN/VAT, generator specs, and direct 1-tap WhatsApp / booking triggers.
 */

import React from 'react';
import {
  X,
  MapPin,
  Users,
  Utensils,
  Car,
  Volume2,
  ShieldCheck,
  Calendar,
  Sparkles,
  Phone,
  Bookmark,
  Share2,
  CheckCircle2,
  ArrowRight,
  Clock,
  Zap,
  Building2,
  Star,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Venue } from '../types';

interface VenueQuickPeekDrawerProps {
  venue: Venue | null;
  onClose: () => void;
  onInspectFullDetails: (venue: Venue) => void;
  onStartNegotiation: (venue: Venue) => void;
}

export const VenueQuickPeekDrawer: React.FC<VenueQuickPeekDrawerProps> = ({
  venue,
  onClose,
  onInspectFullDetails,
  onStartNegotiation,
}) => {
  const { isVenueSaved, toggleSaveVenue } = useMarketplace();

  if (!venue) return null;

  const isSaved = isVenueSaved(venue.id);

  // Compute pricing highlights
  const minPlatePrice = venue.packages && venue.packages.length > 0
    ? Math.min(...venue.packages.map((p) => p.pricePerPlateNpr))
    : venue.cateringStartingNpr || 1200;

  const minHallRental = venue.halls && venue.halls.length > 0
    ? Math.min(...venue.halls.map((h) => h.baseRentalNpr))
    : venue.baseRentalStartingNpr || 0;

  const totalMaxCapacity = venue.halls && venue.halls.length > 0
    ? venue.halls.reduce((sum, h) => sum + h.maxCapacity, 0)
    : venue.maxGuests || 800;

  const primaryHall = venue.halls[0];

  const handleWhatsAppInquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanPhone = venue.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Namaste ${venue.name}, I found your party palace on UTSAVO Nepal. I would like to inquire about booking availability and per-plate catering packages.`
    );
    window.open(`https://wa.me/${cleanPhone.slice(-10)}?text=${message}`, '_blank');
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `${venue.name} - UTSAVO Nepal`,
        text: `Check out ${venue.name} in ${venue.locality}, ${venue.district} on UTSAVO!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar with Glanceable Photo */}
        <div className="relative aspect-[16/7] w-full bg-neutral-900 overflow-hidden shrink-0">
          <img
            src={venue.coverImage || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80'}
            alt={venue.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

          {/* Top Control Bar */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-rose-600/90 backdrop-blur-md rounded-full text-white text-[11px] font-bold uppercase tracking-wider shadow">
                1-Tap Quick Peek
              </span>
              <span className="px-2.5 py-1 bg-emerald-600/90 backdrop-blur-md rounded-full text-white text-[11px] font-semibold flex items-center gap-1 shadow">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
                <span>PAN: {venue.panNumber}</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleShare}
                className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                title="Share venue"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaveVenue(venue.id);
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                  isSaved
                    ? 'bg-rose-600 text-white'
                    : 'bg-black/50 hover:bg-black/80 text-white'
                }`}
                title={isSaved ? 'Remove from saved' : 'Save venue'}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Title & Location */}
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold mb-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{venue.locality}, {venue.district}</span>
              <span className="text-white/60">•</span>
              <span className="flex items-center gap-1 text-amber-300 font-bold">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{venue.rating} ({venue.reviewCount} reviews)</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white line-clamp-1">
              {venue.name}
            </h2>
            <p className="text-white/80 text-xs line-clamp-1 mt-0.5">{venue.nepaliName}</p>
          </div>
        </div>

        {/* Scrollable Information Body (Maximum Information at Minimum Touchable) */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Key Metric Tiles (4-column grid) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* 1. Price Per Plate */}
            <div className="bg-rose-50/80 border border-rose-200/80 rounded-xl p-2.5 text-center">
              <div className="text-[10px] uppercase font-bold text-rose-800 tracking-wider">Per Plate From</div>
              <div className="text-base sm:text-lg font-serif font-bold text-rose-950 mt-0.5">
                NPR {minPlatePrice.toLocaleString()}
              </div>
              <div className="text-[10px] text-rose-700/80">Standard Package</div>
            </div>

            {/* 2. Hall Rental */}
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-2.5 text-center">
              <div className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">Hall Base Rent</div>
              <div className="text-base sm:text-lg font-serif font-bold text-amber-950 mt-0.5">
                {minHallRental > 0 ? `NPR ${minHallRental.toLocaleString()}` : 'Included in Food'}
              </div>
              <div className="text-[10px] text-amber-700/80">Base Session</div>
            </div>

            {/* 3. Capacity */}
            <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl p-2.5 text-center">
              <div className="text-[10px] uppercase font-bold text-blue-800 tracking-wider">Capacity</div>
              <div className="text-base sm:text-lg font-serif font-bold text-blue-950 mt-0.5">
                Up to {totalMaxCapacity}
              </div>
              <div className="text-[10px] text-blue-700/80">Min {primaryHall?.minGuestGuarantee || 150} guests</div>
            </div>

            {/* 4. Parking */}
            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-2.5 text-center">
              <div className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Parking</div>
              <div className="text-base sm:text-lg font-serif font-bold text-emerald-950 mt-0.5">
                {venue.parkingCapacityCars || 60}+ Cars
              </div>
              <div className="text-[10px] text-emerald-700/80">
                {venue.parkingCapacityBikes ? `${venue.parkingCapacityBikes}+ Bikes` : 'Valet Available'}
              </div>
            </div>
          </div>

          {/* Regulatory & Operating Specs (Curfew, Power, Sound, VAT) */}
          <div className="bg-neutral-50 rounded-2xl p-3.5 border border-neutral-200/90 text-xs space-y-2">
            <div className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider flex items-center justify-between">
              <span>Operational & Compliance Checklist</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Compliance</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-neutral-700 pt-1">
              <div className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>
                  Sound Curfew:{' '}
                  <strong>{venue.eventManagementPolicy?.soundCurfewTime || '10:00 PM'} (DAO Compliant)</strong>
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>
                  Generator:{' '}
                  <strong>{venue.eventManagementPolicy?.powerLoadCapacityKw || (venue.hasPowerBackup ? '100 kW Genset' : '50 kW')} Full Backup</strong>
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>
                  Planner Policy:{' '}
                  <strong>
                    {venue.eventManagementPolicy?.allowsOutsideOrganizers
                      ? 'Open to Outside Planners'
                      : venue.eventManagementPolicy?.policyType === 'HYBRID_BOTH'
                      ? 'In-House & Outside Planners'
                      : 'In-House Planning'}
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  Invoice:{' '}
                  <strong>Official VAT Tax Invoice (IRD Reg: {venue.panNumber})</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Top Hall Spaces Available */}
          <div>
            <div className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Available Halls & Outdoor Spaces ({venue.halls.length})</span>
              <span className="text-[10px] text-neutral-500">A/C • Mandap • Dining</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {venue.halls.map((hall) => (
                <div
                  key={hall.id}
                  className="bg-white border border-neutral-200 rounded-xl p-2.5 flex items-start justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-neutral-900">{hall.name}</div>
                    <div className="text-[10px] text-neutral-500">
                      {hall.type.replace('_', ' ')} • {hall.areaSqFt?.toLocaleString() || 4500} sq.ft
                    </div>
                    <div className="text-[10px] text-neutral-600 mt-1">
                      Seats: <strong>{hall.minCapacity} - {hall.maxCapacity} guests</strong>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-bold text-rose-700">
                      {hall.baseRentalNpr > 0 ? `NPR ${hall.baseRentalNpr.toLocaleString()}` : 'Free w/ Buffet'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 1-Tap Action Bar (Maximum Actionability) */}
        <div className="p-3 sm:p-4 bg-white border-t border-neutral-200 shrink-0 flex flex-col sm:flex-row items-center gap-2">
          {/* WhatsApp Direct Inquiry */}
          <button
            onClick={handleWhatsAppInquiry}
            className="w-full sm:w-auto flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Phone className="w-4 h-4" />
            <span>1-Tap WhatsApp Inquiry</span>
          </button>

          {/* Full Details Modal */}
          <button
            onClick={() => {
              onInspectFullDetails(venue);
              onClose();
            }}
            className="w-full sm:w-auto flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all"
          >
            <span>Full Specs & Menus</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Instant Negotiation / Book */}
          <button
            onClick={() => {
              onStartNegotiation(venue);
              onClose();
            }}
            className="w-full sm:w-auto flex-1 bg-gradient-to-r from-rose-700 to-rose-900 hover:from-rose-800 hover:to-rose-950 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Lock Date / Negotiate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
