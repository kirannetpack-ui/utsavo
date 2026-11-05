/**
 * UTSAVO - Resilient Venue Image Visual
 * Rich domain illustrations and fallback graphics for Nepali celebration venues
 */

import React from 'react';

interface VenueVisualProps {
  type: string;
  name: string;
  className?: string;
}

export const VenueImageVisual: React.FC<VenueVisualProps> = ({ type, name, className = 'h-52 w-full' }) => {
  // Bespoke styled architectural and festive visuals representing Nepal's party palaces
  if (type.includes('heritage') || type.includes('lalitpur') || type.includes('durbar') || type.includes('bhaktapur')) {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 flex flex-col justify-end p-5 text-white ${className}`}>
        {/* Cultural Brick & Mandala Background Texture */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Architectural Newari Window / Torana SVG Silhouette */}
        <div className="absolute top-4 right-5 opacity-25">
          <svg width="90" height="90" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 5 L90 35 L80 90 L20 90 L10 35 Z" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="50" cy="45" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M50 25 L50 65 M30 45 L70 45" stroke="currentColor" strokeWidth="1.5" />
            <path d="M40 75 L60 75 M45 82 L55 82" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        {/* Chandelier / Ambient Glow */}
        <div className="absolute -top-10 left-1/3 w-40 h-40 bg-amber-500/20 rounded-full blur-2xl" />

        <div className="relative z-10">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-300">
            Heritage Royal Banquet
          </span>
          <h4 className="text-base font-semibold text-white truncate drop-shadow-sm mt-0.5">
            {name}
          </h4>
        </div>
      </div>
    );
  }

  if (type.includes('garden') || type.includes('lakeside') || type.includes('green') || type.includes('lawn')) {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 flex flex-col justify-end p-5 text-white ${className}`}>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:18px_18px]" />

        {/* Mountain Silhouette & Lawn Canopy */}
        <div className="absolute top-3 right-5 opacity-25">
          <svg width="100" height="70" viewBox="0 0 120 80" fill="currentColor">
            <path d="M10 75 L45 25 L65 50 L85 15 L115 75 Z" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="95" cy="20" r="4" fill="currentColor" opacity="0.6" />
          </svg>
        </div>

        <div className="absolute top-0 right-1/4 w-44 h-44 bg-teal-500/15 rounded-full blur-3xl" />

        <div className="relative z-10">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-300">
            Open-Air Lawn & Mountain Vista
          </span>
          <h4 className="text-base font-semibold text-white truncate drop-shadow-sm mt-0.5">
            {name}
          </h4>
        </div>
      </div>
    );
  }

  // Grand Imperial Ballroom
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 flex flex-col justify-end p-5 text-white ${className}`}>
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="absolute top-4 right-5 opacity-20">
        <svg width="80" height="80" viewBox="0 0 100 100" fill="currentColor">
          <rect x="20" y="20" width="60" height="60" rx="8" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="50" cy="50" r="16" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="absolute top-0 left-1/4 w-36 h-36 bg-purple-500/20 rounded-full blur-2xl" />

      <div className="relative z-10">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-purple-300">
          Air-Conditioned Grand Ballroom
        </span>
        <h4 className="text-base font-semibold text-white truncate drop-shadow-sm mt-0.5">
          {name}
        </h4>
      </div>
    </div>
  );
};
