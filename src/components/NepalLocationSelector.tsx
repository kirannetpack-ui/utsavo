/**
 * UTSAVO - Universal Nepal Location Selector (State & District Combobox)
 * Strict Compliance:
 * 1. Lists all 77 districts across Nepal so any district can be chosen directly.
 * 2. Provides full free-form typing input with instant fuzzy search in Nepali & English.
 * 3. Supports province selection and auto-linking.
 */

import React, { useState, useRef, useEffect, useId } from 'react';
import { MapPin, Search, ChevronDown, X, Check, Globe } from 'lucide-react';
import {
  ALL_77_DISTRICTS,
  ALL_7_PROVINCES,
  NEPAL_PROVINCES,
} from '../data/nepalGeography';

export interface NepalDistrictSelectorProps {
  value: string;
  onChange: (districtName: string, provinceName?: string) => void;
  selectedProvince?: string;
  provinceFilter?: string;
  onSelectProvince?: (provinceName: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
  inputClassName?: string;
  language?: string;
  showProvinceBadge?: boolean;
  id?: string;
}

export const NepalDistrictSelector: React.FC<NepalDistrictSelectorProps> = ({
  value,
  onChange,
  selectedProvince,
  provinceFilter,
  onSelectProvince,
  placeholder = 'Type or choose any of Nepal\'s 77 districts...',
  label,
  required = false,
  className = '',
  inputClassName,
  language,
  showProvinceBadge = true,
  id,
}) => {
  const effectiveProvince = selectedProvince || provinceFilter;
  const generatedId = useId();
  const inputId = id || generatedId;
  const datalistId = `datalist-districts-${inputId}`;

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || '');
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync internal search with external value
  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter districts based on typed term
  const filteredDistricts = ALL_77_DISTRICTS.filter((d) => {
    if (!searchTerm.trim()) {
      if (effectiveProvince && effectiveProvince.trim() !== '') {
        return d.provinceName.toLowerCase() === effectiveProvince.toLowerCase();
      }
      return true;
    }
    const q = searchTerm.toLowerCase().trim();
    const matchesName = d.name.toLowerCase().includes(q);
    const matchesNepali = d.nepaliName.includes(searchTerm.trim());
    const matchesProvince = d.provinceName.toLowerCase().includes(q) || d.provinceNepaliName.includes(searchTerm.trim());
    return matchesName || matchesNepali || matchesProvince;
  });

  const handleSelect = (districtName: string, provinceName: string) => {
    setSearchTerm(districtName);
    onChange(districtName, provinceName);
    if (onSelectProvince) {
      onSelectProvince(provinceName);
    }
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearchTerm(text);
    // Find exact match if any
    const match = ALL_77_DISTRICTS.find(
      (d) =>
        d.name.toLowerCase() === text.toLowerCase().trim() ||
        d.nepaliName === text.trim()
    );
    const resolvedProv = match ? match.provinceName : undefined;
    onChange(text, resolvedProv);
    if (resolvedProv && onSelectProvince) {
      onSelectProvince(resolvedProv);
    }
    setIsOpen(true);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchTerm('');
    onChange('', undefined);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Input container allowing typing OR dropdown selection */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
          <MapPin className="w-4 h-4 text-amber-700" />
        </div>

        <input
          id={inputId}
          type="text"
          list={datalistId}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          className={
            inputClassName ||
            "w-full pl-9 pr-16 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition-all shadow-2xs"
          }
        />

        {/* Standard HTML datalist fallback for browser-native autocomplete */}
        <datalist id={datalistId}>
          {ALL_77_DISTRICTS.map((d) => (
            <option key={d.name} value={d.name}>
              {d.nepaliName} • {d.provinceName}
            </option>
          ))}
        </datalist>

        <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-stone-400 hover:text-stone-700 rounded transition-colors"
              title="Clear district"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-stone-400 hover:text-stone-700 rounded transition-colors"
            title="Show all 77 districts"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Dropdown list of all 77 districts with typing live filter */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-2xl shadow-xl border border-stone-200/90 max-h-64 overflow-y-auto divide-y divide-stone-100 animate-fade-in text-xs">
          <div className="p-2 bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center justify-between sticky top-0 z-10">
            <span>
              {selectedProvince ? `Districts in ${selectedProvince} (${filteredDistricts.length})` : `All 77 Districts of Nepal (${filteredDistricts.length})`}
            </span>
            <span className="text-[10px] text-amber-800 font-normal">
              Type or select
            </span>
          </div>

          {filteredDistricts.length === 0 ? (
            <div className="p-4 text-center text-stone-500">
              No matching district found for "{searchTerm}". You can keep typing custom location.
            </div>
          ) : (
            filteredDistricts.map((d) => {
              const isSelected = value.toLowerCase() === d.name.toLowerCase() || value === d.nepaliName;
              return (
                <button
                  type="button"
                  key={d.name}
                  onClick={() => handleSelect(d.name, d.provinceName)}
                  className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-amber-50/70 transition-colors cursor-pointer ${
                    isSelected ? 'bg-amber-50 font-bold text-amber-950' : 'text-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-semibold text-stone-900">{d.name}</span>
                    <span className="text-stone-500 font-normal font-sans">({d.nepaliName})</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {showProvinceBadge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200/60 truncate max-w-[120px]">
                        {d.provinceName.replace(' Province', '')}
                      </span>
                    )}
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-800 shrink-0" />}
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export interface NepalProvinceSelectorProps {
  value: string;
  onChange: (provinceName: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
  inputClassName?: string;
  language?: string;
  id?: string;
  includeAllOption?: boolean;
  allOptionLabel?: string;
}

export const NepalProvinceSelector: React.FC<NepalProvinceSelectorProps> = ({
  value,
  onChange,
  placeholder = 'Type or choose state / province...',
  label,
  required = false,
  className = '',
  inputClassName,
  language,
  id,
  includeAllOption = false,
  allOptionLabel = 'All Provinces (सबै प्रदेश)',
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const datalistId = `datalist-provinces-${inputId}`;

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || '');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const filteredProvinces = ALL_7_PROVINCES.filter((p) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(q) ||
      p.nepaliName.includes(searchTerm.trim()) ||
      `province ${p.id}`.toLowerCase().includes(q)
    );
  });

  const handleSelect = (provinceName: string) => {
    setSearchTerm(provinceName);
    onChange(provinceName);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearchTerm(text);
    onChange(text);
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
          <Globe className="w-4 h-4 text-amber-700" />
        </div>

        <input
          id={inputId}
          type="text"
          list={datalistId}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          className={
            inputClassName ||
            "w-full pl-9 pr-14 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition-all shadow-2xs"
          }
        />

        <datalist id={datalistId}>
          {includeAllOption && <option value="">{allOptionLabel}</option>}
          {ALL_7_PROVINCES.map((p) => (
            <option key={p.id} value={p.name}>
              {p.nepaliName}
            </option>
          ))}
        </datalist>

        <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                onChange('');
              }}
              className="p-1 text-stone-400 hover:text-stone-700 rounded transition-colors"
              title="Clear province"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-stone-400 hover:text-stone-700 rounded transition-colors"
            title="Show all provinces"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-2xl shadow-xl border border-stone-200/90 max-h-60 overflow-y-auto divide-y divide-stone-100 animate-fade-in text-xs">
          {includeAllOption && (
            <button
              type="button"
              onClick={() => handleSelect('')}
              className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-stone-50 font-medium ${
                !value ? 'bg-amber-50 text-amber-950 font-bold' : 'text-stone-700'
              }`}
            >
              <span>{allOptionLabel}</span>
              {!value && <Check className="w-3.5 h-3.5 text-amber-800" />}
            </button>
          )}

          {filteredProvinces.map((p) => {
            const isSelected = value.toLowerCase() === p.name.toLowerCase();
            return (
              <button
                type="button"
                key={p.id}
                onClick={() => handleSelect(p.name)}
                className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-amber-50/70 transition-colors ${
                  isSelected ? 'bg-amber-50 font-bold text-amber-950' : 'text-stone-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{p.name}</span>
                  <span className="text-stone-500 font-normal">({p.nepaliName})</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-800" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
