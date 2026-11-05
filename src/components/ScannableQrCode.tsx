/**
 * UTSAVO — Scannable Real QR Code Component
 * Generates an authentic scannable QR code linking directly to the guest invitation card.
 */

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { ExternalLink, QrCode as QrIcon, Download } from 'lucide-react';
import { triggerFileDownload } from '../utils/qrGenerator';

interface ScannableQrCodeProps {
  url: string;
  size?: number;
  code?: string;
  label?: string;
  onClick?: () => void;
  className?: string;
  showDownloadButton?: boolean;
}

export const ScannableQrCode: React.FC<ScannableQrCodeProps> = ({
  url,
  size = 120,
  code,
  label = 'Scan to RSVP',
  onClick,
  className = '',
  showDownloadButton = true
}) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(
      url,
      {
        width: Math.max(size * 4, 800), // High DPI 800px+ for crisp scanning and downloading
        margin: 1,
        color: {
          dark: '#1c1917', // Stone 900
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      },
      (err, result) => {
        if (!err && isMounted && result) {
          setDataUrl(result);
        }
      }
    );
    return () => {
      isMounted = false;
    };
  }, [url, size]);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (dataUrl) {
      triggerFileDownload(dataUrl, `UTSAVO-QR-${code || 'invitation'}.png`);
    }
  };

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      title="Click to open or test this invitation card"
      className={`group relative flex flex-col items-center justify-center p-2 bg-white rounded-2xl border border-stone-200 shadow-xs transition-all hover:border-amber-600 hover:shadow-md cursor-pointer ${className}`}
    >
      {/* Quick Download Overlay Button */}
      {showDownloadButton && dataUrl && (
        <button
          type="button"
          onClick={handleDownload}
          title="Download High-Res QR PNG"
          className="absolute top-1.5 right-1.5 p-1 bg-amber-900/90 hover:bg-amber-950 text-white rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <Download className="w-3 h-3" />
        </button>
      )}

      {dataUrl ? (
        <img
          src={dataUrl}
          alt={`QR Code for ${url}`}
          style={{ width: size, height: size }}
          className="rounded-lg object-contain transition-transform group-hover:scale-[1.02]"
        />
      ) : (
        <div
          style={{ width: size, height: size }}
          className="flex items-center justify-center bg-stone-100 rounded-lg text-stone-400"
        >
          <QrIcon className="w-8 h-8 animate-pulse" />
        </div>
      )}

      {code && (
        <div className="mt-1 flex items-center gap-1 text-[9px] font-mono font-bold text-stone-600 group-hover:text-amber-800">
          <span>{code}</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
        </div>
      )}

      {label && (
        <span className="text-[8px] text-stone-400 uppercase tracking-wider font-semibold">
          {label}
        </span>
      )}
    </div>
  );
};
