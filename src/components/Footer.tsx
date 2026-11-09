/**
 * UTSAVO - Clean Footer
 * Follows anti-slop restraint: quiet copyright, trust notes, and links
 */

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  const { language } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-400 text-xs py-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-800">
          
          <div className="space-y-3 md:col-span-1">
            <BrandLogo variant="dark" size="md" />
            <p className="text-stone-400 text-xs leading-relaxed mt-1">
              {language === 'ne'
                ? 'नेपालको स्मार्ट उत्सव, पार्टी प्यालेस खोज तथा डिजिटल बुकिङ बजार।'
                : "Nepal's Smart Celebration Marketplace for party palace discovery, menu customization, and transparent bookings."}
            </p>
            <div className="text-[11px] text-stone-500">
              PAN: 609281740 · Kathmandu, Nepal
            </div>
          </div>

          <div>
            <div className="font-semibold text-white uppercase text-[11px] tracking-wider mb-3">
              Provinces & Hubs
            </div>
            <ul className="space-y-2 text-stone-400">
              <li>Bagmati (Kathmandu, Lalitpur, Bhaktapur, Chitwan)</li>
              <li>Gandaki (Pokhara, Tanahun)</li>
              <li>Lumbini (Butwal, Bhairahawa, Nepalgunj)</li>
              <li>Koshi (Biratnagar, Dharan, Itahari)</li>
              <li>Madhesh, Karnali & Sudurpashchim</li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-white uppercase text-[11px] tracking-wider mb-3">
              Marketplace Guarantees
            </div>
            <ul className="space-y-2 text-stone-400">
              <li>Verified PAN & Business Registration</li>
              <li>Hindu Panchanga Samiti Muhurats</li>
              <li>Digital Contracts & Invoices</li>
              <li>eSewa & Khalti Escrow Reconciled</li>
              <li>Zero Hidden Fees Policy</li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-white uppercase text-[11px] tracking-wider mb-3">
              Statutory Compliance
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              Operating in compliance with Nepal's Electronic Transactions Act, Consumer Protection Directives, and Hospitality Guidelines.
            </p>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <div>
            © {new Date().getFullYear()} UTSAVO Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-stone-400 cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-stone-400 cursor-pointer">Privacy & Data Consent</span>
            <span>·</span>
            <span className="hover:text-stone-400 cursor-pointer">Dispute Policy</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
