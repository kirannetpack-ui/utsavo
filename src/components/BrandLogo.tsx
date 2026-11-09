/**
 * UTSAVO — Official Brand Logo & Identity
 * Features:
 * 1. The crimson squircle emblem with Devanagari 'उ' sized to match the wordmark height
 * 2. Bold, high-contrast, polished 'UTSAVO' typography
 * 3. Subtitle: "NEPAL'S SMART CELEBRATION MARKETPLACE"
 * Highly visible, vector-sharp on Retina/High-DPI displays, and beautifully balanced.
 */

import React, { useState } from 'react';

interface BrandLogoProps {
  variant?: 'light' | 'dark' | 'icon';
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
  const [imageFailed, setImageFailed] = useState(false);

  // Sizing definitions matching icon size strictly to UTSAVO wordmark height
  const sizes = {
    sm: {
      icon: 'w-7 h-7 min-w-7 min-h-7 rounded-[9px] text-base',
      title: 'text-xl leading-tight',
      subtitle: 'text-[7px] tracking-[0.18em]',
      gap: 'gap-2.5',
    },
    md: {
      icon: 'w-9 h-9 min-w-9 min-h-9 rounded-[11px] text-xl',
      title: 'text-2xl leading-none font-black',
      subtitle: 'text-[8.5px] tracking-[0.19em]',
      gap: 'gap-2.5',
    },
    lg: {
      icon: 'w-11 h-11 min-w-11 min-h-11 rounded-[14px] text-2xl',
      title: 'text-3xl leading-none font-black',
      subtitle: 'text-[10px] tracking-[0.20em]',
      gap: 'gap-3',
    },
    xl: {
      icon: 'w-14 h-14 min-w-14 min-h-14 rounded-[18px] text-3xl',
      title: 'text-4xl leading-none font-black',
      subtitle: 'text-[12px] tracking-[0.22em]',
      gap: 'gap-3.5',
    },
  };

  const current = sizes[size];
  const isDark = variant === 'dark';

  // Vector-crisp Emblem with uploaded image fallback & ultra-high resolution styling
  const Emblem = (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none overflow-hidden transition-transform shadow-xs ${current.icon}`}
      style={{
        background: 'linear-gradient(145deg, #c51d24 0%, #a4161c 55%, #7e0e13 100%)',
        boxShadow: isDark
          ? '0 2px 8px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.28)'
          : '0 2px 6px rgba(164, 22, 28, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
      }}
      title="UTSAVO"
    >
      {/* Subtle top glossy highlight border */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-white/35" />

      {!imageFailed ? (
        <img
          src="/assets/aistudio/image_79a65c8c.png"
          alt="उ"
          className="w-full h-full object-contain p-0.5"
          style={{ imageRendering: '-webkit-optimize-contrast' }}
          onError={() => setImageFailed(true)}
        />
      ) : (
        /* Razor-sharp Devanagari typography fallback */
        <span
          className="font-serif font-black text-white leading-none transform translate-y-[-1px] drop-shadow-xs"
          style={{ fontFamily: '"Playfair Display", "Noto Serif Devanagari", serif' }}
        >
          उ
        </span>
      )}
    </div>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex shrink-0 ${className}`}>{Emblem}</div>;
  }

  return (
    <div className={`inline-flex items-center select-none ${current.gap} ${className}`}>
      {/* 1. Sized Emblem */}
      {Emblem}

      {/* 2. Wordmark + "NEPAL'S SMART CELEBRATION MARKETPLACE" */}
      <div className="flex flex-col text-left justify-center">
        <span
          className={`font-display font-extrabold tracking-tight transition-colors ${
            isDark ? 'text-white' : 'text-stone-900 group-hover:text-amber-950'
          } ${current.title}`}
        >
          UTSAVO
        </span>

        {showSubtitle && (
          <span
            className={`font-sans font-bold uppercase whitespace-nowrap mt-0.5 ${
              isDark ? 'text-amber-400/90' : 'text-stone-500'
            } ${current.subtitle}`}
          >
            Nepal's Smart Celebration Marketplace
          </span>
        )}
      </div>
    </div>
  );
};
