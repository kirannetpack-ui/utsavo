/**
 * UTSAVO — Bulk WhatsApp & Viber Invitation Dispatcher
 * Solves: "Contact to be sent via whatsapp & viber should also allow multiple and bulk"
 * Enables hosts to manage guest phone books, bulk paste contacts, and dispatch personalized invites.
 */

import React, { useState } from 'react';
import { DigitalInvitation } from '../types';
import { getWhatsAppUrl, getViberUrl, sanitizeNepalPhone } from '../utils/communication';
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
  AlertCircle
} from 'lucide-react';

export interface GuestContact {
  id: string;
  name: string;
  phone: string;
  group: 'FAMILY' | 'RELATIVES' | 'FRIENDS' | 'COLLEAGUES' | 'VIP';
  status: 'PENDING' | 'SENT';
  sentTimestamp?: string;
}

interface BulkNimantranaDispatcherProps {
  invitation: DigitalInvitation;
}

const sampleContacts: GuestContact[] = [
  { id: 'c1', name: 'Ramesh & Parbati Sharma', phone: '+977-9841234567', group: 'RELATIVES', status: 'SENT', sentTimestamp: 'Today 10:15 AM' },
  { id: 'c2', name: 'Er. Deepak Adhikari', phone: '+977-9851098765', group: 'FRIENDS', status: 'SENT', sentTimestamp: 'Today 10:20 AM' },
  { id: 'c3', name: 'Mama Ghar (Mukunda Karki)', phone: '+977-9801234567', group: 'FAMILY', status: 'PENDING' },
  { id: 'c4', name: 'Dr. Sunita Shrestha', phone: '+977-9841556677', group: 'VIP', status: 'PENDING' },
  { id: 'c5', name: 'Bikash Gurung (Office Team)', phone: '+977-9851088776', group: 'COLLEAGUES', status: 'PENDING' },
  { id: 'c6', name: 'Sasurali Khala (Anil Joshi)', phone: '+977-9849112233', group: 'FAMILY', status: 'PENDING' },
];

export const BulkNimantranaDispatcher: React.FC<BulkNimantranaDispatcherProps> = ({ invitation }) => {
  const [contacts, setContacts] = useState<GuestContact[]>(sampleContacts);
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('ALL');
  const [bulkPasteText, setBulkPasteText] = useState('');
  const [showBulkPasteModal, setShowBulkPasteModal] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Single Contact Entry Form
  const [singleName, setSingleName] = useState('');
  const [singlePhone, setSinglePhone] = useState('');
  const [singleGroup, setSingleGroup] = useState<GuestContact['group']>('RELATIVES');

  const filteredContacts = contacts.filter((c) => {
    if (selectedGroupFilter === 'ALL') return true;
    return c.group === selectedGroupFilter;
  });

  const sentCount = contacts.filter((c) => c.status === 'SENT').length;
  const pendingCount = contacts.length - sentCount;
  const dispatchProgress = contacts.length > 0 ? Math.round((sentCount / contacts.length) * 100) : 0;

  const handleAddSingleContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singlePhone.trim()) return;

    const newContact: GuestContact = {
      id: `contact-${Date.now()}`,
      name: singleName.trim() || 'Guest Family',
      phone: singlePhone.trim(),
      group: singleGroup,
      status: 'PENDING'
    };

    setContacts([newContact, ...contacts]);
    setSingleName('');
    setSinglePhone('');
  };

  const handleBulkParseAndAdd = () => {
    if (!bulkPasteText.trim()) return;

    const lines = bulkPasteText.split('\n');
    const parsed: GuestContact[] = [];

    lines.forEach((line, idx) => {
      const cleanLine = line.trim();
      if (!cleanLine) return;

      // Check if comma or tab separated (e.g. "Name, 9841...")
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
            status: 'PENDING'
          });
        }
      } else {
        // Just phone number
        parsed.push({
          id: `bulk-${Date.now()}-${idx}`,
          name: `Guest Family ${idx + 1}`,
          phone: cleanLine,
          group: 'FRIENDS',
          status: 'PENDING'
        });
      }
    });

    if (parsed.length > 0) {
      setContacts([...parsed, ...contacts]);
      setBulkPasteText('');
      setShowBulkPasteModal(false);
    }
  };

  const markContactSent = (contactId: string) => {
    setContacts(
      contacts.map((c) =>
        c.id === contactId
          ? { ...c, status: 'SENT', sentTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          : c
      )
    );
  };

  const getPersonalizedMessage = (contactName: string) => {
    return `🙏 *हार्दिक निमन्त्रणा (CORDIAL INVITATION)* 🙏

नमस्ते *${contactName}* जी,

We warmly invite you and your family to grace the auspicious *${invitation.eventType === 'WEDDING' ? 'शुभ विवाह' : invitation.eventType}* of *${invitation.celebrantsTitle}*.

📅 *शुभ मिति*: ${invitation.dateBS} (${invitation.dateAD})
⏰ *मुहूर्त समय*: ${invitation.muhuratTime}
📍 *स्थान*: ${invitation.venueName} · ${invitation.locationAddress}

Kindly open our interactive Digital E-Card & confirm your attendance (RSVP) here:
👉 https://utsavo.com/invite/${invitation.invitationCode}

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

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-800" />
            <h3 className="font-display text-xl font-bold text-stone-900">
              Bulk WhatsApp & Viber Invitation Dispatcher (बल्क निमन्त्रणा केन्द्र)
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Send personalized digital invitations to hundreds of family members, relatives, and colleagues without creating messy group chats.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBulkPasteModal(true)}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Bulk Import / Paste (बल्क थप्नुहोस्)</span>
          </button>

          <button
            onClick={handleCopyBroadcastText}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
            title="Copy formatted broadcast message for WhatsApp Broadcast List"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copyFeedback || 'Copy Broadcast Text'}</span>
          </button>
        </div>
      </div>

      {/* Dispatch Statistics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-200">
        <div>
          <span className="text-[10px] uppercase font-bold text-stone-500 block">Total Guest Contacts</span>
          <span className="font-display text-xl font-bold text-stone-900">{contacts.length} recipients</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-stone-500 block">Sent / Dispatched</span>
          <span className="font-display text-xl font-bold text-emerald-700">{sentCount} completed</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-stone-500 block">Pending Dispatch</span>
          <span className="font-display text-xl font-bold text-amber-800">{pendingCount} remaining</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-stone-500 block">Progress</span>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 bg-stone-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${dispatchProgress}%` }}
              />
            </div>
            <span className="font-mono text-xs font-bold text-stone-700">{dispatchProgress}%</span>
          </div>
        </div>
      </div>

      {/* Add Single Contact Inline Form */}
      <form onSubmit={handleAddSingleContact} className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/60 space-y-3 text-xs">
        <span className="font-bold text-stone-800 block text-xs flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5 text-amber-800" />
          <span>Quick Add Individual Contact</span>
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            required
            value={singleName}
            onChange={(e) => setSingleName(e.target.value)}
            placeholder="Guest / Family Name (e.g. Ramesh Sharma)"
            className="p-2.5 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />

          <input
            type="tel"
            required
            value={singlePhone}
            onChange={(e) => setSinglePhone(e.target.value)}
            placeholder="Phone (+977-98...)"
            className="p-2.5 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
          />

          <select
            value={singleGroup}
            onChange={(e) => setSingleGroup(e.target.value as GuestContact['group'])}
            className="p-2.5 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-semibold text-stone-700"
          >
            <option value="FAMILY">Family (परिवार)</option>
            <option value="RELATIVES">Relatives (नातागोता / मामाघर)</option>
            <option value="FRIENDS">Friends (साथीभाइ)</option>
            <option value="COLLEAGUES">Colleagues (सहकर्मी)</option>
            <option value="VIP">VIP / Dignitaries</option>
          </select>

          <button
            type="submit"
            className="py-2.5 px-4 bg-amber-900 hover:bg-amber-950 text-white rounded-xl font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Book</span>
          </button>
        </div>
      </form>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {['ALL', 'FAMILY', 'RELATIVES', 'FRIENDS', 'COLLEAGUES', 'VIP'].map((grp) => (
            <button
              key={grp}
              onClick={() => setSelectedGroupFilter(grp)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                selectedGroupFilter === grp
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {grp}
            </button>
          ))}
        </div>

        <button
          onClick={handleCopyAllPhoneNumbers}
          className="text-xs text-amber-900 hover:underline font-bold flex items-center gap-1"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Copy All {contacts.length} Numbers</span>
        </button>
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
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Send via WhatsApp / Viber</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredContacts.map((contact) => {
                const personalizedMsg = getPersonalizedMessage(contact.name);
                const waUrl = getWhatsAppUrl(contact.phone, personalizedMsg);
                const viberUrl = getViberUrl(contact.phone);

                return (
                  <tr key={contact.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="p-3">
                      <span className="font-bold text-stone-900 block">{contact.name}</span>
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
                      {contact.status === 'SENT' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Sent ({contact.sentTimestamp || 'Done'})</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Pending</span>
                        </span>
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
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-2xs"
                          title="Open WhatsApp chat with personalized invitation"
                        >
                          <span className="text-sm">💬</span>
                          <span>WhatsApp</span>
                        </a>

                        {/* Viber Send Button */}
                        <a
                          href={viberUrl}
                          onClick={() => markContactSent(contact.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition-colors shadow-2xs"
                          title="Open Viber to send invite"
                        >
                          <span className="text-sm">🟣</span>
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
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Paste Modal */}
      {showBulkPasteModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95">
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
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
                  className="px-5 py-2 bg-amber-900 hover:bg-amber-950 text-white rounded-xl font-bold shadow"
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
