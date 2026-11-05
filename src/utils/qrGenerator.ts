/**
 * UTSAVO — QR Code Generation & High-Resolution Export Utility
 * Generates unique, downloadable QR codes and printable wedding card badges
 * linking directly to specific digital invitation E-Cards.
 */

import QRCode from 'qrcode';

export interface QrStylingOptions {
  color?: string; // Dark module color
  bgColor?: string; // Background color
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  size?: number; // Output pixel size (e.g. 600, 1200)
  margin?: number;
  centerSymbol?: 'OM' | 'SWASTIK' | 'KALASH' | 'RINGS' | 'NONE';
}

export interface PrintableBadgeOptions {
  celebrantsTitle: string;
  eventType: string;
  dateBS: string;
  venueName: string;
  invitationCode: string;
  url: string;
  colorTheme?: 'AMBER_GOLD' | 'CRIMSON_RED' | 'MITHILA_BROWN' | 'ROYAL_NAVY';
}

/**
 * Generate standard Base64 Data URL for a QR Code
 */
export async function generateQrDataUrl(
  url: string,
  options: QrStylingOptions = {}
): Promise<string> {
  const {
    color = '#1c1917',
    bgColor = '#ffffff',
    errorCorrectionLevel = 'H', // High error correction allows center logos
    size = 600,
    margin = 2
  } = options;

  return QRCode.toDataURL(url, {
    width: size,
    margin,
    color: {
      dark: color,
      light: bgColor
    },
    errorCorrectionLevel
  });
}

/**
 * Generate vector SVG string for lossless print scaling
 */
export async function generateQrSvgString(
  url: string,
  options: QrStylingOptions = {}
): Promise<string> {
  const {
    color = '#1c1917',
    bgColor = '#ffffff',
    errorCorrectionLevel = 'H',
    margin = 2
  } = options;

  return QRCode.toString(url, {
    type: 'svg',
    margin,
    color: {
      dark: color,
      light: bgColor
    },
    errorCorrectionLevel
  });
}

/**
 * Trigger immediate browser download of an image data URL or blob
 */
export function triggerFileDownload(dataUrl: string, fileName: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Download SVG file directly
 */
export function downloadSvgFile(svgContent: string, fileName: string): void {
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  triggerFileDownload(url, fileName);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Render a high-resolution, print-ready ceremonial wedding card QR badge (300 DPI)
 * Ideal for giving to physical printing presses or printing tabletop reception standees.
 */
export async function generatePrintableCeremonyCardBadge(
  options: PrintableBadgeOptions
): Promise<string> {
  const {
    celebrantsTitle,
    eventType,
    dateBS,
    venueName,
    invitationCode,
    url,
    colorTheme = 'AMBER_GOLD'
  } = options;

  // Theme palettes
  const themes = {
    AMBER_GOLD: {
      primary: '#92400e',
      border: '#b45309',
      bgGradientTop: '#fffdf7',
      bgGradientBottom: '#fef3c7',
      accent: '#d97706',
      subText: '#78350f',
      symbolText: 'ॐ श्री गणेशाय नमः'
    },
    CRIMSON_RED: {
      primary: '#881337',
      border: '#be123c',
      bgGradientTop: '#fffbfa',
      bgGradientBottom: '#ffe4e6',
      accent: '#e11d48',
      subText: '#9f1239',
      symbolText: '卐 श्री गणेशाय नमः 卐'
    },
    MITHILA_BROWN: {
      primary: '#451a03',
      border: '#78350f',
      bgGradientTop: '#faf5f0',
      bgGradientBottom: '#f5ebe0',
      accent: '#92400e',
      subText: '#5c2b09',
      symbolText: '🦚 ॐ श्री गणेशाय नमः 🦚'
    },
    ROYAL_NAVY: {
      primary: '#0f172a',
      border: '#334155',
      bgGradientTop: '#f8fafc',
      bgGradientBottom: '#e2e8f0',
      accent: '#2563eb',
      subText: '#1e293b',
      symbolText: '🏔️ ॐ नमो भगवते वासुदेवाय 🏔️'
    }
  };

  const theme = themes[colorTheme] || themes.AMBER_GOLD;

  // Dimensions: 1200 x 1600 (High-res 300 DPI 4x5.3" standard card size)
  const width = 1200;
  const height = 1600;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');

  // 1. Background gradient
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, theme.bgGradientTop);
  grad.addColorStop(1, theme.bgGradientBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // 2. Outer Ornate Border
  ctx.strokeStyle = theme.border;
  ctx.lineWidth = 14;
  ctx.strokeRect(36, 36, width - 72, height - 72);

  // Inner decorative border
  ctx.lineWidth = 4;
  ctx.strokeRect(56, 56, width - 112, height - 112);

  // Ornate Corner Accents
  ctx.fillStyle = theme.primary;
  ctx.font = 'bold 36px serif';
  ctx.textAlign = 'center';
  ctx.fillText('✥', 76, 84);
  ctx.fillText('✥', width - 76, 84);
  ctx.fillText('✥', 76, height - 74);
  ctx.fillText('✥', width - 76, height - 74);

  // 3. Spiritual Invocation Header
  ctx.font = 'bold 44px "Cinzel", "Noto Serif Devanagari", Georgia, serif';
  ctx.fillStyle = theme.primary;
  ctx.fillText(theme.symbolText, width / 2, 170);

  // 4. Occasion Tagline
  ctx.font = '600 28px "Cinzel", "Noto Sans Devanagari", sans-serif';
  ctx.fillStyle = theme.subText;
  ctx.fillText(
    `${eventType === 'WEDDING' ? 'शुभ विवाह' : eventType} · हार्दिक निमन्त्रणा`,
    width / 2,
    230
  );

  // 5. Celebrants Title
  ctx.font = 'bold 74px "Playfair Display", "Cinzel", Georgia, serif';
  ctx.fillStyle = theme.primary;
  ctx.fillText(celebrantsTitle, width / 2, 340);

  // Decorative divider
  ctx.beginPath();
  ctx.moveTo(350, 390);
  ctx.lineTo(850, 390);
  ctx.strokeStyle = theme.border;
  ctx.lineWidth = 3;
  ctx.stroke();

  // 6. Date & Venue
  ctx.font = '600 36px "Noto Sans Devanagari", sans-serif';
  ctx.fillStyle = '#292524';
  ctx.fillText(`📅 ${dateBS}`, width / 2, 460);

  ctx.font = '500 32px "Noto Sans Devanagari", sans-serif';
  ctx.fillStyle = '#44403c';
  ctx.fillText(`📍 ${venueName}`, width / 2, 520);

  // 7. Center High-Res QR Code
  const qrSize = 580;
  const qrDataUrl = await QRCode.toDataURL(url, {
    width: qrSize,
    margin: 1,
    color: {
      dark: theme.primary,
      light: '#ffffff'
    },
    errorCorrectionLevel: 'H'
  });

  const qrImg = new Image();
  await new Promise<void>((resolve, reject) => {
    qrImg.onload = () => resolve();
    qrImg.onerror = reject;
    qrImg.src = qrDataUrl;
  });

  // White Card backing behind QR
  const qrX = (width - qrSize) / 2;
  const qrY = 590;
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.12)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 12;

  // Rounded rectangle for QR frame
  roundRect(ctx, qrX - 24, qrY - 24, qrSize + 48, qrSize + 48, 32);
  ctx.fill();
  ctx.shadowColor = 'transparent'; // Reset shadow

  ctx.lineWidth = 4;
  ctx.strokeStyle = theme.border;
  roundRect(ctx, qrX - 24, qrY - 24, qrSize + 48, qrSize + 48, 32);
  ctx.stroke();

  // Draw QR
  ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

  // 8. Instructions & Pass Code
  ctx.font = 'bold 36px "Cinzel", "Noto Sans Devanagari", sans-serif';
  ctx.fillStyle = theme.primary;
  ctx.fillText('SCAN WITH PHONE CAMERA TO RSVP', width / 2, 1260);

  ctx.font = '500 28px "Noto Sans Devanagari", sans-serif';
  ctx.fillStyle = '#57534e';
  ctx.fillText('निमन्त्रणा पत्र हेर्न तथा उपस्थिति भोजन रोजाइ दर्ता गर्न', width / 2, 1315);

  // Pass Code Badge
  ctx.fillStyle = theme.primary;
  roundRect(ctx, width / 2 - 220, 1370, 440, 68, 20);
  ctx.fill();

  ctx.font = 'bold 32px monospace';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`PASS: ${invitationCode}`, width / 2, 1416);

  // 9. Footer
  ctx.font = '500 24px sans-serif';
  ctx.fillStyle = '#78716c';
  ctx.fillText('UTSAVO — Nepal\'s Smart Celebration Marketplace', width / 2, 1500);

  return canvas.toDataURL('image/png');
}

/**
 * Helper to draw rounded rectangle on canvas
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
