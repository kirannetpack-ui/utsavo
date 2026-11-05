import React from 'react';
import { MessageSquare, PhoneCall } from 'lucide-react';
import { getWhatsAppUrl, getViberUrl } from '../utils/communication';

interface WhatsAppViberButtonsProps {
  phone: string;
  messageText: string;
  label?: string;
  variant?: 'compact' | 'full' | 'badges';
  className?: string;
}

export const WhatsAppViberButtons: React.FC<WhatsAppViberButtonsProps> = ({
  phone,
  messageText,
  label = 'Inquire via WhatsApp / Viber',
  variant = 'compact',
  className = '',
}) => {
  const whatsappUrl = getWhatsAppUrl(phone, messageText);
  const viberUrl = getViberUrl(phone, messageText);

  if (variant === 'badges') {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
          title="Chat directly on WhatsApp"
        >
          <span className="font-mono text-xs">💬</span>
          <span>WhatsApp</span>
        </a>
        <a
          href={viberUrl}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-xs transition-colors"
          title="Connect on Viber"
        >
          <span className="font-mono text-xs">🟣</span>
          <span>Viber</span>
        </a>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`grid grid-cols-2 gap-2 ${className}`}>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-xs"
        >
          <span className="text-sm">💬</span>
          <span>Chat on WhatsApp</span>
        </a>
        <a
          href={viberUrl}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs transition-all shadow-xs"
        >
          <span className="text-sm">🟣</span>
          <span>Connect on Viber</span>
        </a>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-xs font-semibold transition-colors"
        title="Send Instant WhatsApp Message"
      >
        <span className="text-emerald-600">💬</span>
        <span>WhatsApp</span>
      </a>
      <a
        href={viberUrl}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 text-xs font-semibold transition-colors"
        title="Connect via Viber"
      >
        <span className="text-purple-600">🟣</span>
        <span>Viber</span>
      </a>
    </div>
  );
};
