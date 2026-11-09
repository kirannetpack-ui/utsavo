/**
 * UTSAVO - Advanced Catering & Menu Customizer Engine
 * Priority Feature 8: Dynamic dishes selection, live counters, and NPR tax calculations
 */

import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { HallSpace, Venue, MenuItem } from '../types';
import { MASTER_MENU_ITEMS, STANDARD_CATERING_PACKAGES, calculateCateringQuotation } from '../data/menuCatalog';
import { Utensils, Sparkles, Check, Plus, AlertCircle, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

interface MenuCustomizerProps {
  venue: Venue;
  selectedHall: HallSpace;
  onProceedToNegotiation: (quotationData: any) => void;
}

export const MenuCustomizer: React.FC<MenuCustomizerProps> = ({
  venue,
  selectedHall,
  onProceedToNegotiation,
}) => {
  const { language } = useLanguage();
  const { filters } = useMarketplace();

  // Package & Guest State
  const [selectedPackageId, setSelectedPackageId] = useState<string>('pkg-gold');
  const [guestCount, setGuestCount] = useState<number>(filters.guestCount || 350);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([
    'wd-1', // Mint Lemonade
    'vs-1', // Paneer Tikka
    'vs-2', // Butter Corn
    'nvs-1', // Chicken Sekuwa
    'nvs-2', // Mutton Choila
    'tn-1', // Khasi ko Kalo Masu
    'mc-1', // Shahi Paneer
    'mc-2', // Dal Makhani
    'rb-1', // Jeera Pulao
    'rb-3', // Tandoori Roti & Naan
    'lc-1', // Live Momo Bar
    'ds-1', // Juju Dhau
    'ds-2', // Gulab Jamun
  ]);

  const activePackage = useMemo(() => {
    return STANDARD_CATERING_PACKAGES.find((p) => p.id === selectedPackageId) || STANDARD_CATERING_PACKAGES[1];
  }, [selectedPackageId]);

  // Recalculate quotation dynamically
  const quotation = useMemo(() => {
    return calculateCateringQuotation({
      packageId: selectedPackageId,
      guestCount,
      hallRentalNpr: selectedHall.baseRentalNpr,
      selectedItemIds,
    });
  }, [selectedPackageId, guestCount, selectedHall, selectedItemIds]);

  const toggleItemSelection = (item: MenuItem) => {
    if (selectedItemIds.includes(item.id)) {
      setSelectedItemIds((prev) => prev.filter((id) => id !== item.id));
    } else {
      setSelectedItemIds((prev) => [...prev, item.id]);
    }
  };

  // Group items by category for clean visual presentation
  const categorizedItems = useMemo(() => {
    const categories: { [key: string]: MenuItem[] } = {
      'Welcome Drinks': MASTER_MENU_ITEMS.filter((i) => i.category === 'WELCOME_DRINK'),
      'Veg Starters': MASTER_MENU_ITEMS.filter((i) => i.category === 'VEG_STARTER'),
      'Non-Veg Starters': MASTER_MENU_ITEMS.filter((i) => i.category === 'NON_VEG_STARTER'),
      'Traditional Nepali Cultural Dishes': MASTER_MENU_ITEMS.filter((i) => i.category === 'TRADITIONAL_NEPALI'),
      'Main Courses': MASTER_MENU_ITEMS.filter((i) => i.category.startsWith('MAIN_COURSE')),
      'Rice, Breads & Staples': MASTER_MENU_ITEMS.filter((i) => i.category === 'RICE_AND_BREAD'),
      'Live Food Counters': MASTER_MENU_ITEMS.filter((i) => i.category === 'LIVE_COUNTER'),
      'Desserts': MASTER_MENU_ITEMS.filter((i) => i.category === 'DESSERT'),
    };
    return categories;
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Left Column (8 cols): Package Selection & Category Item Picker */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Tier Packages Selector */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2">
            1. {language === 'ne' ? 'बुफे प्याकेज छनोट गर्नुहोस्' : 'Select Catering Package Tier'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {STANDARD_CATERING_PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPackageId(pkg.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                  selectedPackageId === pkg.id
                    ? 'border-amber-900 bg-amber-50/70 shadow-sm'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                {pkg.id === 'pkg-gold' && (
                  <span className="absolute -top-2 right-3 px-2 py-0.5 text-[10px] font-bold uppercase bg-amber-800 text-white rounded-full">
                    Popular
                  </span>
                )}
                <div className="font-semibold text-xs text-stone-900">
                  {pkg.name}
                </div>
                <div className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                  {pkg.nepaliName}
                </div>
                <div className="mt-2 text-base font-bold font-display text-amber-950 tabular-nums">
                  NPR {pkg.pricePerPlateNpr.toLocaleString()}
                  <span className="text-[11px] font-normal text-stone-500"> /plate</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Guest Count Slider for Live Calculation */}
        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-stone-700">
              2. {language === 'ne' ? 'ग्यारेन्टी अतिथि संख्या (Guaranteed Guests)' : 'Guaranteed Guest Count'}
            </span>
            <span className="text-sm font-bold text-amber-950 tabular-nums">
              {guestCount} Guests
            </span>
          </div>
          <input
            type="range"
            min={selectedHall.minGuestGuarantee}
            max={selectedHall.maxCapacity}
            step="10"
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
            className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-900"
          />
          <div className="flex justify-between text-[11px] text-stone-400 mt-1 tabular-nums">
            <span>Min: {selectedHall.minGuestGuarantee}</span>
            <span>Hall Max: {selectedHall.maxCapacity}</span>
          </div>
        </div>

        {/* Item Selection by Category */}
        <div className="space-y-6">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-600">
            3. {language === 'ne' ? 'परिकारहरू छनोट र थपथाप (Customize Dishes)' : 'Customize Dishes & Live Counters'}
          </div>

          {Object.entries(categorizedItems).map(([catTitle, items]) => (
            <div key={catTitle} className="border border-stone-200 rounded-2xl p-4 bg-white">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-amber-800" />
                  <span>{catTitle}</span>
                </h4>
                <span className="text-[11px] text-stone-400">
                  {items.filter((i) => selectedItemIds.includes(i.id)).length} selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {items.map((item) => {
                  const isSelected = selectedItemIds.includes(item.id);

                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleItemSelection(item)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'border-amber-900 bg-amber-50/60 text-stone-900'
                          : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50 text-stone-600'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              item.isVegetarian ? 'bg-emerald-600' : 'bg-red-600'
                            }`}
                            title={item.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                          />
                          <span className="line-clamp-1">{item.name}</span>
                        </div>
                        <div className="text-[11px] text-stone-500 line-clamp-1">
                          {item.nepaliName}
                        </div>
                        {item.description && (
                          <div className="text-[10px] text-stone-400 line-clamp-1">
                            {item.description}
                          </div>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        {item.extraPriceNpr ? (
                          <span className="text-[10px] font-semibold text-amber-800 block tabular-nums">
                            +NPR {item.extraPriceNpr}
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-700 block">
                            Included
                          </span>
                        )}
                        <span
                          className={`inline-block mt-1 p-0.5 rounded ${
                            isSelected ? 'bg-amber-900 text-white' : 'bg-stone-200 text-stone-500'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Right Column (5 cols): Live Transparent Quotation Calculator */}
      <div className="lg:col-span-5">
        <div className="sticky top-24 bg-white rounded-2xl border border-stone-200/90 p-5 shadow-lg space-y-4">
          
          <div className="border-b border-stone-200 pb-3">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-800">
              Live Commercial Quotation
            </span>
            <h3 className="text-base font-bold text-stone-900 mt-0.5">
              {venue.name}
            </h3>
            <div className="text-xs text-stone-500">
              Hall: <strong>{selectedHall.name}</strong>
            </div>
          </div>

          {/* Quotation Breakdown Items */}
          <div className="space-y-2.5 text-xs text-stone-600">
            <div className="flex justify-between items-center">
              <span>Selected Tier:</span>
              <span className="font-semibold text-stone-900">{quotation.package.name}</span>
            </div>

            <div className="flex justify-between items-center">
              <span>Per-Plate Rate (incl. add-ons):</span>
              <span className="font-semibold text-stone-900 tabular-nums">
                NPR {quotation.effectivePerPlateNpr.toLocaleString()} / plate
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span>Catering Subtotal ({guestCount} guests):</span>
              <span className="font-semibold text-stone-900 tabular-nums">
                NPR {quotation.cateringSubtotalNpr.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span>Hall Base Rental:</span>
              <span className="font-semibold text-stone-900 tabular-nums">
                NPR {quotation.hallRentalNpr.toLocaleString()}
              </span>
            </div>

            <div className="pt-2 border-t border-stone-100 flex justify-between items-center">
              <span>Subtotal:</span>
              <span className="font-medium text-stone-800 tabular-nums">
                NPR {quotation.rawSubtotalNpr.toLocaleString()}
              </span>
            </div>

            {/* Tax Transparency Breakdown */}
            <div className="flex justify-between items-center text-stone-500">
              <span>Service Charge (10%):</span>
              <span className="tabular-nums">+ NPR {quotation.serviceChargeNpr.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center text-stone-500">
              <span>Nepal VAT (13%):</span>
              <span className="tabular-nums">+ NPR {quotation.vatNpr.toLocaleString()}</span>
            </div>

            {/* Total Estimated or Binding Amount */}
            <div className="pt-3 border-t border-stone-200 flex justify-between items-end">
              <div>
                <span className="text-xs font-bold uppercase text-stone-900 block">Total Quotation</span>
                <span className="text-[11px] text-stone-500">All taxes & services included</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold font-display text-amber-950 tabular-nums block">
                  NPR {quotation.totalNpr.toLocaleString()}
                </span>
                <span className="text-[11px] text-emerald-700 font-medium tabular-nums">
                  25% Deposit: NPR {quotation.depositRequiredNpr.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Request Binding Quote / Negotiate */}
          <div className="pt-3 space-y-2">
            <button
              onClick={() =>
                onProceedToNegotiation({
                  ...quotation,
                  hallId: selectedHall.id,
                  guestCount,
                  selectedItemNames: selectedItemIds.map(
                    (id) => MASTER_MENU_ITEMS.find((i) => i.id === id)?.name || id
                  ),
                })
              }
              className="w-full py-3 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-950 rounded-xl shadow transition-colors flex items-center justify-center gap-2"
            >
              <span>{language === 'ne' ? 'मूल्य वार्ता / प्रति-प्रस्ताव पेश गर्नुहोस्' : 'Propose Offer & Start Negotiation'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[11px] text-stone-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Transparent commercial quote · Zero spam guarantee</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
