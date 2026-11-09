/**
 * UTSAVO — Bulk WhatsApp & Viber Invitation Dispatcher & Real-Time Guest Status Tracker
 * Supports:
 * 1. CSV / Excel (.xlsx, .xls) bulk contact imports
 * 2. Downloadable CSV sample template
 * 3. 4-State Real-Time Guest Status Tracker:
 *    - INVITED (Dispatched via WhatsApp/Viber)
 *    - REPLIED (E-card opened / viewed)
 *    - ATTENDING (Confirmed with headcount & dietary preference)
 *    - DECLINED (Sent blessings from afar)
 * 4. Kitchen headcount auto-sync
 */

import React, { useState, useRef } from 'react';
import { DigitalInvitation } from '../types';
import { getWhatsAppUrl, getViberUrl, sanitizeNepalPhone, getPublicInvitationUrl } from '../utils/communication';
import * as XLSX from 'xlsx';
import {
  Users,
  Send,
  CheckCircle,
  Clock,
  Plus,
  Trash2,
  Copy,
  Upload,
  Sparkles,
  Phone,
  MessageSquare,
  Share2,
  FileSpreadsheet,
  AlertCircle,
  Download,
  CheckCircle2,
  Eye,
  UserCheck,
  UserX,
  RefreshCw,
  Utensils
} from 'lucide-react';

export type GuestStatus = 'INVITED' | 'REPLIED' | 'ATTENDING' | 'DECLINED';

export interface GuestContact {
  id: string;
  name: string;
  phone: string;
  group: 'FAMILY' | 'RELATIVES' | 'FRIENDS' | 'COLLEAGUES' | 'VIP';
  status: GuestStatus;
  headcount: number;
  diet?: 'VEG' | 'NON_VEG';
  notes?: string;
  sentTimestamp?: string;
  lastUpdated?: string;
}

interface BulkNimantranaDispatcherProps {
  invitation: DigitalInvitation;
}

const sampleContacts: GuestContact[] = [
  { id: 'c1', name: 'Ramesh & Parbati Sharma', phone: '+977-9841234567', group: 'RELATIVES', status: 'ATTENDING', headcount: 3, diet: 'VEG', sentTimestamp: 'Today 10:15 AM', lastUpdated: '10 mins ago' },
  { id: 'c2', name: 'Er. Deepak Adhikari', phone: '+977-9851098765', group: 'FRIENDS', status: 'REPLIED', headcount: 2, diet: 'NON_VEG', sentTimestamp: 'Today 10:20 AM', lastUpdated: '25 mins ago' },
  { id: 'c3', name: 'Mama Ghar (Mukunda Karki)', phone: '+977-9801234567', group: 'FAMILY', status: 'INVITED', headcount: 4, sentTimestamp: 'Yesterday 4:00 PM' },
  { id: 'c4', name: 'Dr. Sunita Shrestha', phone: '+977-9841556677', group: 'VIP', status: 'ATTENDING', headcount: 2, diet: 'VEG', sentTimestamp: 'Today 09:00 AM', lastUpdated: 'Just now' },
  { id: 'c5', name: 'Bikash Gurung (Office Team)', phone: '+977-9851088776', group: 'COLLEAGUES', status: 'DECLINED', headcount: 0, notes: 'Traveling abroad, sending hearty blessings', sentTimestamp: 'Yesterday 3:30 PM', lastUpdated: '1 hour ago' },
  { id: 'c6', name: 'Sasurali Khala (Anil Joshi)', phone: '+977-9849112233', group: 'FAMILY', status: 'INVITED', headcount: 2, sentTimestamp: 'Today 11:00 AM' },
];

export const BulkNimantranaDispatcher: React.FC<BulkNimantranaDispatcherProps> = ({ invitation }) => {
  const [contacts, setContacts] = useState<GuestContact[]>(sampleContacts);
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | GuestStatus>('ALL');
  const [bulkPasteText, setBulkPasteText] = useState('');
  const [showBulkPasteModal, setShowBulkPasteModal] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [importNotification, setImportNotification] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Single Contact Entry Form
  const [singleName, setSingleName] = useState('');
  const [singlePhone, setSinglePhone] = useState('');
  const [singleGroup, setSingleGroup] = useState<GuestContact['group']>('RELATIVES');
  const [singleHeadcount, setSingleHeadcount] = useState(2);

  // Filtering
  const filteredContacts = contacts.filter((c) => {
    const matchesGroup = selectedGroupFilter === 'ALL' || c.group === selectedGroupFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || c.status === selectedStatusFilter;
    return matchesGroup && matchesStatus;
  });

  // Real-time Tracker Calculations
  const invitedCount = contacts.filter((c) => c.status === 'INVITED').length;
  const repliedCount = contacts.filter((c) => c.status === 'REPLIED').length;
  const attendingCount = contacts.filter((c) => c.status === 'ATTENDING').length;
  const declinedCount = contacts.filter((c) => c.status === 'DECLINED').length;

  const totalConfirmedPlates = contacts
    .filter((c) => c.status === 'ATTENDING')
    .reduce((sum, c) => sum + (c.headcount || 1), 0);

  const totalVegPlates = contacts
    .filter((c) => c.status === 'ATTENDING' && c.diet === 'VEG')
    .reduce((sum, c) => sum + (c.headcount || 1), 0);

  const totalNonVegPlates = totalConfirmedPlates - totalVegPlates;

  const handleAddSingleContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singlePhone.trim()) return;

    const newContact: GuestContact = {
      id: `contact-${Date.now()}`,
      name: singleName.trim() || 'Guest Family',
      phone: singlePhone.trim(),
      group: singleGroup,
      status: 'INVITED',
      headcount: singleHeadcount || 1,
      sentTimestamp: 'Just added',
    };

    setContacts([newContact, ...contacts]);
    setSingleName('');
    setSinglePhone('');
    setSingleHeadcount(2);
  };

  // CSV / Excel File Upload Parser
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (rows.length <= 1) {
          setImportNotification('File is empty or contains no records.');
          setTimeout(() => setImportNotification(null), 3000);
          return;
        }

        const parsedContacts: GuestContact[] = [];

        // Check header row (row 0)
        // Expected columns: Name, Phone, Group, Headcount, Status
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || !row[0]) continue;

          const name = String(row[0] || '').trim();
          const phone = String(row[1] || '').trim();
          if (!name && !phone) continue;

          const groupRaw = String(row[2] || 'RELATIVES').toUpperCase().trim();
          const validGroup = (['FAMILY', 'RELATIVES', 'FRIENDS', 'COLLEAGUES', 'VIP'].includes(groupRaw)
            ? groupRaw
            : 'RELATIVES') as GuestContact['group'];

          const headcountRaw = parseInt(String(row[3] || '2'), 10);
          const headcount = isNaN(headcountRaw) || headcountRaw < 1 ? 2 : headcountRaw;

          const statusRaw = String(row[4] || 'INVITED').toUpperCase().trim();
          const validStatus = (['INVITED', 'REPLIED', 'ATTENDING', 'DECLINED'].includes(statusRaw)
            ? statusRaw
            : 'INVITED') as GuestStatus;

          parsedContacts.push({
            id: `import-${Date.now()}-${i}`,
            name: name || `Guest ${i}`,
            phone: phone || '+977-9800000000',
            group: validGroup,
            status: validStatus,
            headcount,
            diet: validStatus === 'ATTENDING' ? 'NON_VEG' : undefined,
            sentTimestamp: 'Imported',
            lastUpdated: 'Just now',
          });
        }

        if (parsedContacts.length > 0) {
          setContacts((prev) => [...parsedContacts, ...prev]);
          setImportNotification(`Successfully imported ${parsedContacts.length} guest contacts!`);
          setTimeout(() => setImportNotification(null), 4000);
        } else {
          setImportNotification('No valid contacts detected in file.');
          setTimeout(() => setImportNotification(null), 3000);
        }
      } catch (err) {
        console.error('File parsing error:', err);
        setImportNotification('Failed to parse file. Please verify CSV or Excel format.');
        setTimeout(() => setImportNotification(null), 4000);
      }
    };

    reader.readAsBinaryString(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Download Sample CSV Template
  const handleDownloadTemplate = () => {
    const csvContent =
      'Name,Phone,Group,Headcount,Status\n' +
      'Ramesh & Parbati Sharma,9841234567,RELATIVES,3,ATTENDING\n' +
      'Deepak Adhikari,9851098765,FRIENDS,2,INVITED\n' +
      'Sita Thapa (Family),9801234567,FAMILY,4,REPLIED\n' +
      'Dr. Sunita Shrestha,9841556677,VIP,2,ATTENDING\n' +
      'Gopal Shrestha,9851011223,COLLEAGUES,1,DECLINED\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'utsavo-nimantrana-guest-template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkParseAndAdd = () => {
    if (!bulkPasteText.trim()) return;

    const lines = bulkPasteText.split('\n');
    const parsed: GuestContact[] = [];

    lines.forEach((line, idx) => {
      const cleanLine = line.trim();
      if (!cleanLine) return;

      if (cleanLine.includes(',') || cleanLine.includes('\t')) {
        const parts = cleanLine.split(/,|\t/);
        const name = parts[0]?.trim() || `Guest ${idx + 1}`;
        const phone = parts[1]?.trim() || '';
        if (phone) {
          parsed.push({
            id: `bulk-${Date.now()}-${idx}`,
            name,
            phone,
            group: 'RELATIVES',
            status: 'INVITED',
            headcount: 2,
            sentTimestamp: 'Just imported',
          });
        }
      } else {
        parsed.push({
          id: `bulk-${Date.now()}-${idx}`,
          name: `Guest Family ${idx + 1}`,
          phone: cleanLine,
          group: 'FRIENDS',
          status: 'INVITED',
          headcount: 2,
          sentTimestamp: 'Just imported',
        });
      }
    });

    if (parsed.length > 0) {
      setContacts([...parsed, ...contacts]);
      setBulkPasteText('');
      setShowBulkPasteModal(false);
      setImportNotification(`Added ${parsed.length} contacts from clipboard!`);
      setTimeout(() => setImportNotification(null), 3000);
    }
  };

  const updateContactStatus = (contactId: string, newStatus: GuestStatus, headcount?: number) => {
    setContacts(
      contacts.map((c) =>
        c.id === contactId
          ? {
              ...c,
              status: newStatus,
              headcount: headcount !== undefined ? headcount : c.headcount,
              lastUpdated: 'Just now',
            }
          : c
      )
    );
  };

  const markContactSent = (contactId: string) => {
    setContacts(
      contacts.map((c) =>
        c.id === contactId
          ? {
              ...c,
              sentTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              lastUpdated: 'Link dispatched',
            }
          : c
      )
    );
  };

  const getPersonalizedMessage = (contactName: string) => {
    const publicUrl = getPublicInvitationUrl(invitation.invitationCode);
    return `🙏 *हार्दिक निमन्त्रणा (CORDIAL INVITATION)* 🙏

नमस्ते *${contactName}* जी,

We warmly invite you and your family to grace the auspicious *${invitation.eventType === 'WEDDING' ? 'शुभ विवाह' : invitation.eventType}* of *${invitation.celebrantsTitle}*.

📅 *शुभ मिति*: ${invitation.dateBS} (${invitation.dateAD})
⏰ *मुहूर्त समय*: ${invitation.muhuratTime}
📍 *स्थान*: ${invitation.venueName} · ${invitation.locationAddress}

Kindly open our interactive Digital E-Card & confirm your attendance (RSVP) here:
👉 ${publicUrl}

(Your early RSVP automatically syncs with our venue kitchen to guarantee zero food wastage)
निमन्त्रक: *${invitation.hostName}*
धन्यवाद!`;
  };

  const handleCopyBroadcastText = () => {
    const text = getPersonalizedMessage('Family & Friends');
    navigator.clipboard.writeText(text);
    setCopyFeedback('Broadcast Message Copied!');
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  const handleCopyAllPhoneNumbers = () => {
    const numbers = contacts.map((c) => sanitizeNepalPhone(c.phone)).join(', ');
    navigator.clipboard.writeText(numbers);
    setCopyFeedback(`Copied ${contacts.length} Phone Numbers!`);
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  // Simulate an incoming response from a guest
  const simulateGuestResponse = () => {
    const invitedList = contacts.filter((c) => c.status === 'INVITED');
    if (invitedList.length === 0) return;
    const randomGuest = invitedList[Math.floor(Math.random() * invitedList.length)];
    const isAttending = Math.random() > 0.3;
    const newStatus: GuestStatus = isAttending ? 'ATTENDING' : 'DECLINED';
    updateContactStatus(randomGuest.id, newStatus, isAttending ? Math.floor(Math.random() * 3) + 2 : 0);
    setImportNotification(`Real-time update: ${randomGuest.name} marked as ${newStatus}!`);
    setTimeout(() => setImportNotification(null), 4000);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
      
      {/* Toast Notification */}
      {importNotification && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{importNotification}</span>
          </div>
          <button onClick={() => setImportNotification(null)} className="text-emerald-700 hover:text-emerald-950">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-rose-800" />
            <h3 className="font-display text-xl font-bold text-stone-900">
              Bulk Dispatcher & Real-Time Guest Tracker (बल्क निमन्त्रणा र ट्रयाकर)
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Dispatch personalized invitations via WhatsApp & Viber in bulk, import CSV/Excel spreadsheets, and monitor live RSVP states.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv, .xlsx, .xls, .tsv"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Import Excel or CSV guest contacts spreadsheet"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-rose-700" />
            <span>Import CSV / Excel</span>
          </button>

          <button
            onClick={handleDownloadTemplate}
            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
            title="Download CSV template format"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Template</span>
          </button>

          <button
            onClick={() => setShowBulkPasteModal(true)}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Bulk Paste</span>
          </button>

          <button
            onClick={handleCopyBroadcastText}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
            title="Copy formatted broadcast message for WhatsApp Broadcast List"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copyFeedback || 'Copy Broadcast'}</span>
          </button>
        </div>
      </div>

      {/* 4-State Real-Time Guest Status Tracker Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>Real-Time Guest Status Tracker (४-चरण लाइभ स्थिति)</span>
          </span>
          <button
            onClick={simulateGuestResponse}
            className="text-[11px] font-semibold text-rose-800 hover:text-rose-950 flex items-center gap-1"
            title="Simulate incoming guest RSVP update"
          >
            <RefreshCw className="w-3 h-3 text-rose-600" />
            <span>Simulate Incoming RSVP</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* State 1: INVITED */}
          <button
            onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'INVITED' ? 'ALL' : 'INVITED')}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              selectedStatusFilter === 'INVITED'
                ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-400'
                : 'bg-amber-50/60 border-amber-200 hover:bg-amber-100/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-amber-800 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>1. Invited (पठाइएको)</span>
              </span>
              <span className="font-mono text-xs font-bold text-amber-900 bg-amber-200/60 px-1.5 py-0.5 rounded-md">
                {contacts.length > 0 ? Math.round((invitedCount / contacts.length) * 100) : 0}%
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-bold text-amber-950">{invitedCount}</span>
              <span className="text-[11px] text-amber-800">awaiting view</span>
            </div>
          </button>

          {/* State 2: REPLIED */}
          <button
            onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'REPLIED' ? 'ALL' : 'REPLIED')}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              selectedStatusFilter === 'REPLIED'
                ? 'bg-blue-100 border-blue-400 ring-2 ring-blue-400'
                : 'bg-blue-50/60 border-blue-200 hover:bg-blue-100/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-blue-800 flex items-center gap-1">
                <Eye className="w-3 h-3 text-blue-600" />
                <span>2. Replied (हेरेको)</span>
              </span>
              <span className="font-mono text-xs font-bold text-blue-900 bg-blue-200/60 px-1.5 py-0.5 rounded-md">
                {contacts.length > 0 ? Math.round((repliedCount / contacts.length) * 100) : 0}%
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-bold text-blue-950">{repliedCount}</span>
              <span className="text-[11px] text-blue-800">engaged</span>
            </div>
          </button>

          {/* State 3: ATTENDING */}
          <button
            onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'ATTENDING' ? 'ALL' : 'ATTENDING')}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              selectedStatusFilter === 'ATTENDING'
                ? 'bg-emerald-100 border-emerald-400 ring-2 ring-emerald-400'
                : 'bg-emerald-50/60 border-emerald-200 hover:bg-emerald-100/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-emerald-800 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-emerald-600" />
                <span>3. Attending (आउने)</span>
              </span>
              <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-200/60 px-1.5 py-0.5 rounded-md">
                {contacts.length > 0 ? Math.round((attendingCount / contacts.length) * 100) : 0}%
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-bold text-emerald-950">{attendingCount}</span>
              <span className="text-[11px] font-semibold text-emerald-800">({totalConfirmedPlates} guests)</span>
            </div>
          </button>

          {/* State 4: DECLINED */}
          <button
            onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'DECLINED' ? 'ALL' : 'DECLINED')}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              selectedStatusFilter === 'DECLINED'
                ? 'bg-rose-100 border-rose-400 ring-2 ring-rose-400'
                : 'bg-rose-50/60 border-rose-200 hover:bg-rose-100/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-rose-800 flex items-center gap-1">
                <UserX className="w-3 h-3 text-rose-600" />
                <span>4. Declined (नभ्याउने)</span>
              </span>
              <span className="font-mono text-xs font-bold text-rose-900 bg-rose-200/60 px-1.5 py-0.5 rounded-md">
                {contacts.length > 0 ? Math.round((declinedCount / contacts.length) * 100) : 0}%
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-bold text-rose-950">{declinedCount}</span>
              <span className="text-[11px] text-rose-800">sent blessings</span>
            </div>
          </button>
        </div>

        {/* Live Kitchen Headcount Sync Pill */}
        <div className="p-3 bg-stone-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-emerald-400">Kitchen Headcount Sync: </span>
              <span className="text-stone-300">
                {totalConfirmedPlates} Verified Plates Confirmed ({totalVegPlates} Veg · {totalNonVegPlates} Non-Veg)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-stone-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Zero Food Wastage Buffer Active</span>
          </div>
        </div>
      </div>

      {/* Add Single Contact Inline Form */}
      <form onSubmit={handleAddSingleContact} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 text-xs">
        <span className="font-bold text-stone-800 block text-xs flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5 text-rose-800" />
          <span>Quick Add Individual Contact</span>
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <input
            type="text"
            required
            value={singleName}
            onChange={(e) => setSingleName(e.target.value)}
            placeholder="Guest / Family Name (e.g. Ramesh Sharma)"
            className="p-2.5 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none col-span-2"
          />

          <input
            type="tel"
            required
            value={singlePhone}
            onChange={(e) => setSinglePhone(e.target.value)}
            placeholder="Phone (+977-98...)"
            className="p-2.5 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none font-mono"
          />

          <select
            value={singleGroup}
            onChange={(e) => setSingleGroup(e.target.value as GuestContact['group'])}
            className="p-2.5 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none font-semibold text-stone-700"
          >
            <option value="FAMILY">Family (परिवार)</option>
            <option value="RELATIVES">Relatives (नातागोता)</option>
            <option value="FRIENDS">Friends (साथीभाइ)</option>
            <option value="COLLEAGUES">Colleagues (सहकर्मी)</option>
            <option value="VIP">VIP / Dignitaries</option>
          </select>

          <button
            type="submit"
            className="py-2.5 px-4 bg-stone-900 hover:bg-stone-950 text-white rounded-xl font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Book</span>
          </button>
        </div>
      </form>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap border-t border-stone-100 pt-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-stone-400 mr-1">Group:</span>
          {['ALL', 'FAMILY', 'RELATIVES', 'FRIENDS', 'COLLEAGUES', 'VIP'].map((grp) => (
            <button
              key={grp}
              onClick={() => setSelectedGroupFilter(grp)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all text-xs ${
                selectedGroupFilter === grp
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {grp}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {selectedStatusFilter !== 'ALL' && (
            <button
              onClick={() => setSelectedStatusFilter('ALL')}
              className="text-xs text-rose-800 font-bold hover:underline"
            >
              Reset Status Filter ({selectedStatusFilter})
            </button>
          )}

          <button
            onClick={handleCopyAllPhoneNumbers}
            className="text-xs text-stone-700 hover:text-stone-900 font-bold flex items-center gap-1"
          >
            <Phone className="w-3.5 h-3.5 text-stone-500" />
            <span>Copy All ({contacts.length}) Numbers</span>
          </button>
        </div>
      </div>

      {/* Contacts List Table */}
      <div className="rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-stone-50 text-stone-500 uppercase font-semibold text-[10px] border-b border-stone-200">
              <tr>
                <th className="p-3">Recipient Name</th>
                <th className="p-3">Phone Number</th>
                <th className="p-3">Category Group</th>
                <th className="p-3">RSVP Status</th>
                <th className="p-3">Pax Headcount</th>
                <th className="p-3 text-right">Quick Send & Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-400 text-xs">
                    No contacts found matching the active filter.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => {
                  const personalizedMsg = getPersonalizedMessage(contact.name);
                  const waUrl = getWhatsAppUrl(contact.phone, personalizedMsg);
                  const viberUrl = getViberUrl(contact.phone);

                  return (
                    <tr key={contact.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="p-3">
                        <span className="font-bold text-stone-900 block">{contact.name}</span>
                        {contact.notes && (
                          <span className="text-[10px] text-stone-400 block italic">{contact.notes}</span>
                        )}
                      </td>
                      <td className="p-3 font-mono text-stone-600">
                        {contact.phone}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-semibold text-[10px]">
                          {contact.group}
                        </span>
                      </td>
                      <td className="p-3">
                        {/* 4-State Badge & Switcher */}
                        <div className="inline-flex items-center gap-1.5">
                          {contact.status === 'ATTENDING' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>Attending ({contact.headcount} pax)</span>
                            </span>
                          )}
                          {contact.status === 'REPLIED' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[11px]">
                              <Eye className="w-3 h-3 text-blue-600" />
                              <span>Replied / Viewed</span>
                            </span>
                          )}
                          {contact.status === 'INVITED' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold text-[11px]">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>Invited</span>
                            </span>
                          )}
                          {contact.status === 'DECLINED' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold text-[11px]">
                              <UserX className="w-3 h-3 text-rose-600" />
                              <span>Declined</span>
                            </span>
                          )}

                          {/* Quick dropdown to change status */}
                          <select
                            value={contact.status}
                            onChange={(e) => updateContactStatus(contact.id, e.target.value as GuestStatus)}
                            className="text-[10px] bg-transparent text-stone-400 hover:text-stone-700 border-none focus:outline-none cursor-pointer"
                            title="Update guest RSVP status"
                          >
                            <option value="INVITED">Mark Invited</option>
                            <option value="REPLIED">Mark Replied</option>
                            <option value="ATTENDING">Mark Attending</option>
                            <option value="DECLINED">Mark Declined</option>
                          </select>
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-stone-700">
                        {contact.status === 'ATTENDING' ? (
                          <span className="flex items-center gap-1 font-mono text-emerald-700 font-bold">
                            <span>{contact.headcount}</span>
                            <span className="text-[10px] text-stone-400 font-normal">
                              ({contact.diet || 'Mixed'})
                            </span>
                          </span>
                        ) : contact.status === 'DECLINED' ? (
                          <span className="text-stone-400 font-mono">0</span>
                        ) : (
                          <span className="text-stone-500 font-mono">~{contact.headcount}</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          {/* WhatsApp Send Button */}
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => markContactSent(contact.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-2xs"
                            title="Open WhatsApp chat with personalized invitation"
                          >
                            <span className="text-xs">💬</span>
                            <span>WhatsApp</span>
                          </a>

                          {/* Viber Send Button */}
                          <a
                            href={viberUrl}
                            onClick={() => markContactSent(contact.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition-colors shadow-2xs"
                            title="Open Viber to send invite"
                          >
                            <span className="text-xs">🟣</span>
                            <span>Viber</span>
                          </a>

                          {/* Delete contact */}
                          <button
                            onClick={() => setContacts(contacts.filter((c) => c.id !== contact.id))}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
                            title="Remove from list"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Paste Modal */}
      {showBulkPasteModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 border border-stone-200">
            <div className="p-5 bg-stone-900 text-white flex items-center justify-between">
              <div>
                <h4 className="font-display text-base font-bold">Bulk Paste Guest Contacts</h4>
                <p className="text-xs text-stone-300">Paste names and phone numbers from WhatsApp or Excel</p>
              </div>
              <button
                onClick={() => setShowBulkPasteModal(false)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950">
                <span className="font-bold block mb-1">Supported Format:</span>
                <p className="font-mono text-[11px] text-stone-600">
                  Ramesh Sharma, 9841223344<br />
                  Deepak Adhikari, 9851098765<br />
                  9801234567
                </p>
              </div>

              <textarea
                rows={8}
                value={bulkPasteText}
                onChange={(e) => setBulkPasteText(e.target.value)}
                placeholder="Paste your contact list here (one per line)..."
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowBulkPasteModal(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl hover:bg-stone-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBulkParseAndAdd}
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-950 text-white rounded-xl font-bold shadow"
                >
                  Import All Contacts
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
