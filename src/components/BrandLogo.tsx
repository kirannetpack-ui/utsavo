/**
 * SAGUNOO (सगुनो) — International-Standard Brand Logo & Identity System
 * Design System: "The Himalayan Diya & Unity Crest"
 * - Royal Sindoor Crimson (#7A0E26) & Burnished Marigold Gold (#EAB308) luxury palette
 * - Faceted Nepali mandala octagon + Twin Himalayan peaks + Sacred Diyo flame + Interlocking OO unity rings
 * - Supports Light, Dark, Monochrome (legal contracts/print), and Icon-only variants
 * - Guaranteed zero-broken-image policy with pure geometric inline SVG fallback
 */

import React, { useId, useState } from 'react';

interface BrandLogoProps {
  variant?: 'light' | 'dark' | 'icon' | 'monochrome';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'light',
  size = 'md',
  className = '',
  showSubtitle = true,
}) => {
  const uid = useId().replace(/:/g, '');
  const [imgFailed, setImgFailed] = useState(false);

  const sizes = {
    sm: {
      icon: 'w-8 h-8 min-w-8 min-h-8 rounded-lg',
      title: 'text-lg leading-none tracking-[0.06em]',
      subtitle: 'text-[7.5px] tracking-[0.16em]',
      gap: 'gap-2.5',
    },
    md: {
      icon: 'w-9 h-9 min-w-9 min-h-9 rounded-[10px]',
      title: 'text-[21px] leading-none tracking-[0.07em]',
      subtitle: 'text-[8.5px] tracking-[0.17em]',
      gap: 'gap-2.5',
    },
    lg: {
      icon: 'w-11 h-11 min-w-11 min-h-11 rounded-xl',
      title: 'text-2xl sm:text-3xl leading-none tracking-[0.08em]',
      subtitle: 'text-[9.5px] tracking-[0.18em]',
      gap: 'gap-3',
    },
    xl: {
      icon: 'w-14 h-14 min-w-14 min-h-14 rounded-2xl',
      title: 'text-3xl sm:text-4xl leading-none tracking-[0.08em]',
      subtitle: 'text-[11px] tracking-[0.2em]',
      gap: 'gap-3.5',
    },
  };

  const current = sizes[size];
  const isDark = variant === 'dark';
  const isMono = variant === 'monochrome';

  const bgGradId = `sgn-bg-${uid}`;
  const goldGradId = `sgn-gold-${uid}`;

  const VectorFallback = (
    <svg
      viewBox="0 0 512 512"
      className="w-full h-full block"
      role="img"
      aria-label="SAGUNOO Himalayan Diya and Unity Crest"
    >
      <defs>
        <linearGradient id={bgGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isMono ? '#1C1917' : '#881337'} />
          <stop offset="100%" stopColor={isMono ? '#0C0A09' : '#650A20'} />
        </linearGradient>
        <linearGradient id={goldGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isMono ? '#F5F5F4' : '#FDE68A'} />
          <stop offset="50%" stopColor={isMono ? '#D6D3D1' : '#EAB308'} />
          <stop offset="100%" stopColor={isMono ? '#A8A29E' : '#CA8A04'} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="512" height="512" fill={`url(#${bgGradId})`} />
      <path
        d="M170 46 L342 46 L466 170 L466 342 L342 466 L170 466 L46 342 L46 170 Z"
        fill="none"
        stroke={`url(#${goldGradId})`}
        strokeWidth="12"
      />
      <path
        d="M256 108 C276 140 288 164 288 184 C288 206 274 222 256 222 C238 222 224 206 224 184 C224 164 236 140 256 108 Z"
        fill="none"
        stroke={`url(#${goldGradId})`}
        strokeWidth="12"
      />
      <path
        d="M204 206 L308 206 C296 236 276 248 256 248 C236 248 216 236 204 206 Z"
        fill="none"
        stroke={`url(#${goldGradId})`}
        strokeWidth="11"
        strokeLinejoin="round"
      />
      <path
        d="M92 316 L196 216 L284 304 M420 316 L316 216 L228 304"
        fill="none"
        stroke={`url(#${goldGradId})`}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="222" cy="364" r="48" fill="none" stroke={`url(#${goldGradId})`} strokeWidth="12" />
      <circle cx="290" cy="364" r="48" fill="none" stroke={`url(#${goldGradId})`} strokeWidth="12" />
    </svg>
  );

  const Emblem = (
    <span
      className={`relative inline-flex items-center justify-center shrink-0 select-none overflow-hidden ring-1 ${
        isDark ? 'ring-amber-300/35' : isMono ? 'ring-stone-800/30' : 'ring-rose-950/15'
      } shadow-xs ${current.icon}`}
      title="SAGUNOO — Nepal's Auspicious Celebration Platform"
    >
      {!imgFailed && !isMono ? (
        <img
          src="/sagunoo-icon.png"
          alt="SAGUNOO Crest"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover block"
          onError={() => setImgFailed(true)}
        />
      ) : (
        VectorFallback
      )}
    </span>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex shrink-0 ${className}`}>{Emblem}</div>;
  }

  return (
    <div className={`inline-flex items-center select-none ${current.gap} ${className}`}>
      {Emblem}

      <div className="flex flex-col text-left justify-center">
        <span
          className={`font-display font-bold whitespace-nowrap transition-colors ${
            isDark
              ? 'text-white'
              : isMono
              ? 'text-stone-900'
              : 'text-stone-900 group-hover:text-rose-950'
          } ${current.title}`}
        >
          SAGUN
          <span className={isDark ? 'text-amber-300' : isMono ? 'text-stone-700' : 'text-rose-900'}>
            OO
          </span>
        </span>

        {showSubtitle && (
          <span
            className={`font-sans font-semibold uppercase whitespace-nowrap mt-1 ${
              isDark ? 'text-amber-300/85' : 'text-stone-500'
            } ${current.subtitle}`}
          >
            Nepal&apos;s Celebration Platform
          </span>
        )}
      </div>
    </div>
  );
};
