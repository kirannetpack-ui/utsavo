/**
 * UTSAVO — Downloadable QR Code Generation & Print Suite
 * Solves: "Integrate a QR code generation utility into the Digital Nimantrana Suite that creates
 * a unique, downloadable QR code for every invitation, which links directly to the specific editable E-card URL."
 */

import React, { useState, useEffect } from 'react';
import { DigitalInvitation } from '../types';
import {
  X,
  QrCode,
  Download,
  Printer,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Layers,
  FileImage,
  Palette,
  Maximize2,
  Share2
} from 'lucide-react';
import {
  generateQrDataUrl,
  generateQrSvgString,
  triggerFileDownload,
  downloadSvgFile,
  generatePrintableCeremonyCardBadge
} from '../utils/qrGenerator';
import { getPublicInvitationUrl } from '../utils/communication';

interface NimantranaQrCodeUtilityProps {
  isOpen: boolean;
  onClose: () => void;
  invitation: DigitalInvitation;
}

export const NimantranaQrCodeUtility: React.FC<NimantranaQrCodeUtilityProps> = ({
  isOpen,
  onClose,
  invitation
}) => {
  if (!isOpen) return null;

  // Configuration options
  const [targetType, setTargetType] = useState<'GUEST_INVITATION' | 'EDITABLE_SUITE'>('GUEST_INVITATION');
  const [selectedColor, setSelectedColor] = useState('#92400e'); // Amber 800
  const [themeName, setThemeName] = useState<'AMBER_GOLD' | 'CRIMSON_RED' | 'MITHILA_BROWN' | 'ROYAL_NAVY'>('AMBER_GOLD');
  const [previewMode, setPreviewMode] = useState<'QR_ONLY' | 'PRINTABLE_BADGE'>('PRINTABLE_BADGE');

  // Generated assets
  const [qrPngUrl, setQrPngUrl] = useState<string>('');
  const [badgePngUrl, setBadgePngUrl] = useState<string>('');
  const [isGeneratingBadge, setIsGeneratingBadge] = useState<boolean>(true);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Derive target URL
  const publicGuestUrl = getPublicInvitationUrl(invitation.invitationCode);
  const editableSuiteUrl = typeof window !== 'undefined' && window.location?.origin
    ? `${window.location.origin}/?view=NIMANTRANA&code=${invitation.invitationCode}`
    : `https://utsavo.com/?view=NIMANTRANA&code=${invitation.invitationCode}`;

  const currentTargetUrl = targetType === 'GUEST_INVITATION' ? publicGuestUrl : editableSuiteUrl;

  // Generate QR PNG
  useEffect(() => {
    let isMounted = true;
    generateQrDataUrl(currentTargetUrl, {
      color: selectedColor,
      size: 1200,
      margin: 1
    }).then((dataUrl) => {
      if (isMounted) setQrPngUrl(dataUrl);
    });
    return () => {
      isMounted = false;
    };
  }, [currentTargetUrl, selectedColor]);

  // Generate Printable Badge Canvas
  useEffect(() => {
    let isMounted = true;
    setIsGeneratingBadge(true);
    generatePrintableCeremonyCardBadge({
      celebrantsTitle: invitation.celebrantsTitle,
      eventType: invitation.eventType,
      dateBS: invitation.dateBS,
      venueName: invitation.venueName,
      invitationCode: invitation.invitationCode,
      url: currentTargetUrl,
      colorTheme: themeName
    })
      .then((badgeUrl) => {
        if (isMounted) {
          setBadgePngUrl(badgeUrl);
          setIsGeneratingBadge(false);
        }
      })
      .catch((err) => {
        console.error('Badge generation error', err);
        if (isMounted) setIsGeneratingBadge(false);
      });

    return () => {
      isMounted = false;
    };
  }, [invitation, currentTargetUrl, themeName]);

  const handleDownloadQrPng = () => {
    if (!qrPngUrl) return;
    triggerFileDownload(
      qrPngUrl,
      `UTSAVO-QR-${invitation.invitationCode}-${targetType.toLowerCase()}.png`
    );
  };

  const handleDownloadQrSvg = async () => {
    const svgString = await generateQrSvgString(currentTargetUrl, {
      color: selectedColor,
      margin: 1
    });
    downloadSvgFile(
      svgString,
      `UTSAVO-Vector-QR-${invitation.invitationCode}.svg`
    );
  };

  const handleDownloadBadge = () => {
    if (!badgePngUrl) return;
    const cleanTitle = invitation.celebrantsTitle.replace(/[^a-zA-Z0-9]/g, '-');
    triggerFileDownload(
      badgePngUrl,
      `UTSAVO-${cleanTitle}-Print-Wedding-Badge-300DPI.png`
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentTargetUrl);
    setCopyFeedback('Link Copied to Clipboard!');
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  const handlePrint = () => {
    if (!badgePngUrl) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Ceremonial QR Badge — ${invitation.celebrantsTitle}</title>
          <style>
            @page { size: auto; margin: 10mm; }
            body { margin: 0; display: flex; align-items: center; justify-content: center; height: 100vh; background: #fff; }
            img { max-width: 100%; max-height: 95vh; object-fit: contain; }
          </style>
        </head>
        <body>
          <img src="${badgePngUrl}" onload="window.print(); window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[96vh]">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-xl border border-amber-400/30 text-amber-300">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-white">
                  Invitation QR Code & Print Suite
                </h3>
                <span className="text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                  {invitation.invitationCode}
                </span>
              </div>
              <p className="text-xs text-stone-300">
                High-resolution downloadable QR code & print-ready wedding cards badge
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Customization & Parameters */}
          <div className="lg:col-span-5 space-y-5 text-xs">
            
            {/* Target URL Selector */}
            <div className="space-y-1.5">
              <label className="font-bold text-stone-800 block">
                1. Select Target Destination Link
              </label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setTargetType('GUEST_INVITATION')}
                  className={`w-full p-3 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    targetType === 'GUEST_INVITATION'
                      ? 'border-amber-900 bg-amber-50/80 text-amber-950 font-bold shadow-xs'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <span className="block text-xs">Public Guest E-Card & RSVP</span>
                    <span className="block text-[10px] text-stone-500 font-normal">
                      Opens full ceremonial card for guests to view & submit dietary counts
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetType('EDITABLE_SUITE')}
                  className={`w-full p-3 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    targetType === 'EDITABLE_SUITE'
                      ? 'border-amber-900 bg-amber-50/80 text-amber-950 font-bold shadow-xs'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <ExternalLink className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <span className="block text-xs">Specific Editable E-Card URL</span>
                    <span className="block text-[10px] text-stone-500 font-normal">
                      Direct link to the Nimantrana Suite with this specific invitation loaded
                    </span>
                  </div>
                </button>
              </div>

              {/* URL Display Box */}
              <div className="mt-2 p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between gap-2">
                <span className="truncate font-mono text-[10px] text-stone-600">
                  {currentTargetUrl}
                </span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-2 py-1 bg-white hover:bg-stone-100 rounded text-[10px] font-bold text-stone-700 border border-stone-200 shrink-0"
                >
                  {copyFeedback ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Color Palette Selector */}
            <div className="space-y-1.5 pt-2 border-t border-stone-100">
              <label className="font-bold text-stone-800 block flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-700" />
                <span>2. Ceremonial Color Motif</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'AMBER_GOLD', name: 'Amber Gold', hex: '#92400e' },
                  { id: 'CRIMSON_RED', name: 'Nepali Crimson', hex: '#881337' },
                  { id: 'MITHILA_BROWN', name: 'Mithila Ochre', hex: '#451a03' },
                  { id: 'ROYAL_NAVY', name: 'Himalayan Slate', hex: '#0f172a' }
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedColor(c.hex);
                      setThemeName(c.id as any);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                      themeName === c.id
                        ? 'border-amber-900 bg-amber-50 text-amber-950 font-bold'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview View Mode Switcher */}
            <div className="space-y-1.5 pt-2 border-t border-stone-100">
              <label className="font-bold text-stone-800 block flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-700" />
                <span>3. Output Format Type</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewMode('PRINTABLE_BADGE')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    previewMode === 'PRINTABLE_BADGE'
                      ? 'border-amber-900 bg-amber-50 text-amber-950 font-bold'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  Printable Wedding Badge
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('QR_ONLY')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    previewMode === 'QR_ONLY'
                      ? 'border-amber-900 bg-amber-50 text-amber-950 font-bold'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  Raw QR Code (Square)
                </button>
              </div>
            </div>

            {/* Instant Download Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-stone-100">
              <span className="font-bold text-stone-800 block">Download Options</span>

              <button
                type="button"
                onClick={handleDownloadBadge}
                disabled={isGeneratingBadge}
                className="w-full py-3 px-4 bg-amber-900 hover:bg-amber-950 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download Print-Ready Badge (300 DPI PNG)</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDownloadQrPng}
                  className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-stone-200 transition-colors"
                >
                  <FileImage className="w-3.5 h-3.5" />
                  <span>Download QR PNG</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadQrSvg}
                  className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-stone-200 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Vector SVG</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handlePrint}
                className="w-full py-2.5 px-4 bg-white hover:bg-stone-50 text-stone-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-stone-200 shadow-xs transition-colors"
              >
                <Printer className="w-4 h-4 text-stone-600" />
                <span>Print Tabletop Standee / Reception Card</span>
              </button>
            </div>

          </div>

          {/* Right Column: Live High-DPI Visualizer */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-stone-50/80 p-6 rounded-3xl border border-stone-200 relative min-h-[460px]">
            
            {previewMode === 'PRINTABLE_BADGE' ? (
              <div className="flex flex-col items-center space-y-3">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  Ceremonial Print Badge Preview (300 DPI Ready)
                </span>

                {isGeneratingBadge ? (
                  <div className="w-64 h-80 flex flex-col items-center justify-center bg-white rounded-2xl border border-stone-200 shadow-lg text-stone-400">
                    <QrCode className="w-10 h-10 animate-spin text-amber-700" />
                    <span className="text-xs font-bold text-stone-600 mt-2">Rendering 300 DPI Canvas...</span>
                  </div>
                ) : (
                  <div className="relative group">
                    <img
                      src={badgePngUrl}
                      alt="Ceremonial Print Badge"
                      className="w-72 sm:w-80 h-auto rounded-2xl shadow-2xl border border-amber-900/20 object-contain transition-transform group-hover:scale-[1.01]"
                    />
                    <div className="absolute inset-0 bg-stone-950/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
                      <button
                        onClick={handleDownloadBadge}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download PNG</span>
                      </button>
                    </div>
                  </div>
                )}
                <span className="text-[10px] text-stone-500 text-center max-w-xs">
                  Give this PNG directly to your wedding card printer or press.
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  High-DPI QR Code Preview
                </span>
                
                <div className="p-6 bg-white rounded-3xl shadow-xl border-2 border-stone-200 flex flex-col items-center">
                  {qrPngUrl ? (
                    <img
                      src={qrPngUrl}
                      alt={`QR for ${currentTargetUrl}`}
                      className="w-56 h-56 rounded-xl object-contain"
                    />
                  ) : (
                    <div className="w-56 h-56 flex items-center justify-center bg-stone-100 rounded-xl text-stone-400">
                      <QrCode className="w-10 h-10 animate-pulse" />
                    </div>
                  )}

                  <div className="mt-3 text-center">
                    <span className="text-xs font-mono font-bold text-amber-900 block">
                      {invitation.invitationCode}
                    </span>
                    <span className="text-[10px] text-stone-400 font-semibold block uppercase">
                      Links to {targetType === 'GUEST_INVITATION' ? 'Guest E-Card' : 'Editable Suite'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadQrPng}
                    className="px-4 py-2 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PNG (1200px)</span>
                  </button>
                  <button
                    onClick={handleDownloadQrSvg}
                    className="px-4 py-2 border border-stone-200 hover:bg-white rounded-xl text-xs font-bold text-stone-800 flex items-center gap-1.5"
                  >
                    <span>Download SVG</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Guaranteed permanent link to your celebration card and live kitchen headcount sync</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-xl transition-colors"
          >
            Close Utility
          </button>
        </div>

      </div>
    </div>
  );
};
