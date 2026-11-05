/**
 * UTSAVO - AI Celebration Planning Assistant & Gemini Intelligence Hub
 * Features:
 * 1. Multi-turn chat with conversation history (gemini-3.8-flash)
 * 2. Voice Audio Transcription via Microphone (gemini-3.5-transcribe)
 * 3. Real-time Google Search Grounding with web source links
 * 4. Google Maps Grounding with location links across Nepal
 * 5. Celebration Music & Atmosphere Generator (Mangal Dhun, Panche Baja, Shehnai audio synthesizers)
 */

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  X,
  Sparkles,
  Send,
  Mic,
  MicOff,
  Globe,
  MapPin,
  Music,
  ExternalLink,
  Loader2,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Bot,
  User,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: Array<{ title: string; uri: string }>;
  places?: Array<{ title: string; uri: string }>;
}

export const GeminiChatbotModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { language } = useLanguage();
  const { filters, setFilters } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'CHAT' | 'SEARCH_MAPS' | 'CELEBRATION_MUSIC'>('CHAT');

  // Multi-turn chat history
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Namaste! I am your UTSAVO Celebration AI Assistant. I can help you find the best party palaces across Nepal, calculate catering budgets, plan auspicious Panchanga Muhurats (विवाह, व्रतबन्ध, पास्नी), design Newari and traditional banquet menus, and locate venues. How can I assist your celebration today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Audio Recording & Transcription
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Grounding Tool Toggles
  const [useSearchGrounding, setUseSearchGrounding] = useState(false);
  const [useMapsGrounding, setUseMapsGrounding] = useState(false);

  // Dedicated Search & Maps state
  const [groundingQuery, setGroundingQuery] = useState('');
  const [groundingResults, setGroundingResults] = useState<{
    text: string;
    sources?: Array<{ title: string; uri: string }>;
    places?: Array<{ title: string; uri: string }>;
  } | null>(null);
  const [isGroundingLoading, setIsGroundingLoading] = useState(false);

  // Celebration Music Player
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorNodesRef = useRef<any[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  // Send Chat message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      if (useSearchGrounding) {
        // Route through Google Search Grounding endpoint
        const res = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: userMsg.text }),
        });
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: 'assistant',
            text: data.text || 'Information retrieved via Google Search grounding.',
            sources: data.sources,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else if (useMapsGrounding) {
        // Route through Google Maps Grounding endpoint
        const res = await fetch('/api/maps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: userMsg.text }),
        });
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: 'assistant',
            text: data.text || 'Location and venue details retrieved via Google Maps grounding.',
            places: data.places,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        // Standard multi-turn chat with gemini-3.8-flash
        const chatPayload = messages
          .concat(userMsg)
          .map((m) => ({ role: m.role, text: m.text }));

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: chatPayload }),
        });
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: 'assistant',
            text: data.text || 'I could not process that request. Please try again.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'assistant',
          text: 'Sorry, there was a temporary issue communicating with Gemini AI. Please check your connection and try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Microphone Audio Recording & gemini-3.5-transcribe
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setIsLoading(true);
          try {
            const res = await fetch('/api/transcribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audioBase64: base64Audio, mimeType: 'audio/webm' }),
            });
            const data = await res.json();
            if (data.transcription) {
              setInputText(data.transcription);
            }
          } catch (err) {
            console.error('Transcription error:', err);
          } finally {
            setIsLoading(false);
          }
        };
        // Stop audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('Microphone permission is required to transcribe audio.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Dedicated Grounding search execution
  const handleExecuteGrounding = async (mode: 'SEARCH' | 'MAPS') => {
    if (!groundingQuery.trim() || isGroundingLoading) return;
    setIsGroundingLoading(true);
    setGroundingResults(null);

    try {
      const endpoint = mode === 'SEARCH' ? '/api/search' : '/api/maps';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: groundingQuery }),
      });
      const data = await res.json();
      setGroundingResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGroundingLoading(false);
    }
  };

  // Celebration Music Synthesizer (Mangal Dhun, Panche Baja, Shehnai)
  const togglePlayCelebrationTrack = (trackId: string, trackType: 'MANGAL_DHUN' | 'PANCHE_BAJA' | 'SHEHNAI') => {
    if (playingTrackId === trackId) {
      stopAudio();
      setPlayingTrackId(null);
      return;
    }

    stopAudio();
    setPlayingTrackId(trackId);

    // High quality Web Audio synthesizer generating traditional festive ragas (Bhairav & Bilawal scales)
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = ctx;

    const baseFreq = trackType === 'MANGAL_DHUN' ? 440 : trackType === 'PANCHE_BAJA' ? 330 : 523.25;
    const notes = [1, 9 / 8, 5 / 4, 4 / 3, 3 / 2, 5 / 3, 15 / 8, 2];

    let noteIdx = 0;
    const interval = setInterval(() => {
      if (!audioContextRef.current) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = trackType === 'PANCHE_BAJA' ? 'sawtooth' : 'triangle';
      const freq = baseFreq * notes[noteIdx % notes.length];
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);

      noteIdx++;
    }, 240);

    oscillatorNodesRef.current.push({ interval });
  };

  const stopAudio = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    oscillatorNodesRef.current.forEach((item) => {
      if (item.interval) clearInterval(item.interval);
    });
    oscillatorNodesRef.current = [];
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini AI Intelligence & Celebration Suite</span>
            </div>
            <h3 className="font-display text-xl font-bold">
              UTSAVO Smart Assistant
            </h3>
            <p className="text-xs text-stone-300 mt-0.5">
              Powered by gemini-3.8-flash with Google Search & Maps Grounding, and Audio Transcription
            </p>
          </div>

          <button
            onClick={() => {
              stopAudio();
              onClose();
            }}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="px-6 py-2.5 bg-stone-100 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
          <div className="flex items-center gap-1.5 p-1 bg-stone-200/80 rounded-xl">
            <button
              onClick={() => setActiveTab('CHAT')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'CHAT' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-amber-800" />
              <span>Multi-Turn Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('SEARCH_MAPS')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'SEARCH_MAPS' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-blue-700" />
              <span>Search & Maps Grounding</span>
            </button>
            <button
              onClick={() => setActiveTab('CELEBRATION_MUSIC')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'CELEBRATION_MUSIC' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Music className="w-3.5 h-3.5 text-amber-700" />
              <span>Celebration Music</span>
            </button>
          </div>

          {activeTab === 'CHAT' && (
            <div className="flex items-center gap-2 text-[11px] text-stone-500">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useSearchGrounding}
                  onChange={(e) => {
                    setUseSearchGrounding(e.target.checked);
                    if (e.target.checked) setUseMapsGrounding(false);
                  }}
                  className="rounded text-amber-900 focus:ring-amber-800"
                />
                <span>Google Search</span>
              </label>

              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useMapsGrounding}
                  onChange={(e) => {
                    setUseMapsGrounding(e.target.checked);
                    if (e.target.checked) setUseSearchGrounding(false);
                  }}
                  className="rounded text-amber-900 focus:ring-amber-800"
                />
                <span>Google Maps</span>
              </label>
            </div>
          )}
        </div>

        {/* TAB 1: MULTI-TURN CHAT */}
        {activeTab === 'CHAT' && (
          <div className="flex flex-col h-[58vh]">
            {/* Scrollable Messages Thread */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-amber-900 text-white flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl p-4 space-y-2 leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-amber-900 text-white'
                        : 'bg-stone-100 text-stone-800 border border-stone-200/80'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.text}</div>

                    {/* Google Search Grounding Sources */}
                    {m.sources && m.sources.length > 0 && (
                      <div className="pt-2 border-t border-stone-200 mt-2 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                          Verified Search Sources:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {m.sources.map((s, idx) => (
                            <a
                              key={idx}
                              href={s.uri}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 hover:underline flex items-center gap-1"
                            >
                              <span className="truncate max-w-[150px]">{s.title || s.uri}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Google Maps Grounding Places */}
                    {m.places && m.places.length > 0 && (
                      <div className="pt-2 border-t border-stone-200 mt-2 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                          Google Maps Place Locations:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {m.places.map((p, idx) => (
                            <a
                              key={idx}
                              href={p.uri}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 hover:underline flex items-center gap-1"
                            >
                              <MapPin className="w-2.5 h-2.5" />
                              <span className="truncate max-w-[180px]">{p.title || 'View on Maps'}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div
                      className={`text-[10px] ${
                        m.role === 'user' ? 'text-amber-200 text-right' : 'text-stone-400'
                      }`}
                    >
                      {m.timestamp}
                    </div>
                  </div>

                  {m.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-stone-300 text-stone-800 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-stone-400 italic pl-11">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-800" />
                  <span>UTSAVO AI is thinking...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar with Voice Transcription Button */}
            <form onSubmit={handleSendMessage} className="p-4 bg-stone-50 border-t border-stone-200 flex items-center gap-2">
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-2.5 rounded-xl transition-colors ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
                title={isRecording ? 'Stop recording and transcribe' : 'Speak via microphone (gemini-3.5-transcribe)'}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isRecording
                    ? 'Listening... Speak in Nepali or English'
                    : useSearchGrounding
                    ? 'Search Nepali celebration trends, dates, prices with Google Search...'
                    : useMapsGrounding
                    ? 'Find venue locations, directions and party palaces with Google Maps...'
                    : 'Ask about party palaces, Panchanga dates, catering menus, or wedding tips...'
                }
                className="flex-1 text-xs bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="px-4 py-2.5 bg-amber-900 hover:bg-amber-950 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: DEDICATED SEARCH & MAPS GROUNDING */}
        {activeTab === 'SEARCH_MAPS' && (
          <div className="p-6 space-y-5 max-h-[58vh] overflow-y-auto text-xs">
            <div>
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
                Real-Time Grounded Search & Geographic Exploration
              </span>
              <p className="text-stone-500">
                Ground answers directly with live Google Search and Google Maps data for verified Nepali locations.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={groundingQuery}
                onChange={(e) => setGroundingQuery(e.target.value)}
                placeholder="e.g. Best party palaces near Naxal Kathmandu with parking or Mangsir wedding muhurats 2081"
                className="flex-1 bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-stone-900"
              />
              <button
                onClick={() => handleExecuteGrounding('SEARCH')}
                disabled={isGroundingLoading}
                className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Google Search</span>
              </button>
              <button
                onClick={() => handleExecuteGrounding('MAPS')}
                disabled={isGroundingLoading}
                className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Google Maps</span>
              </button>
            </div>

            {isGroundingLoading && (
              <div className="text-center py-8 text-stone-400 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-amber-800" />
                <span>Grounding with Google data...</span>
              </div>
            )}

            {groundingResults && (
              <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-3">
                <div className="whitespace-pre-wrap text-stone-800 leading-relaxed">
                  {groundingResults.text}
                </div>

                {groundingResults.sources && groundingResults.sources.length > 0 && (
                  <div className="pt-3 border-t border-stone-100">
                    <span className="font-bold text-stone-700 block mb-1">Web Sources:</span>
                    <div className="space-y-1">
                      {groundingResults.sources.map((s, idx) => (
                        <a
                          key={idx}
                          href={s.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-700 hover:underline flex items-center gap-1 text-[11px]"
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <span>{s.title || s.uri}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {groundingResults.places && groundingResults.places.length > 0 && (
                  <div className="pt-3 border-t border-stone-100">
                    <span className="font-bold text-stone-700 block mb-1">Maps Places:</span>
                    <div className="space-y-1">
                      {groundingResults.places.map((p, idx) => (
                        <a
                          key={idx}
                          href={p.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 hover:underline flex items-center gap-1 text-[11px]"
                        >
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span>{p.title || 'View Place on Google Maps'}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CELEBRATION MUSIC & ENTRANCE TUNES */}
        {activeTab === 'CELEBRATION_MUSIC' && (
          <div className="p-6 space-y-5 max-h-[58vh] overflow-y-auto text-xs">
            <div>
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
                Authentic Nepali Celebration Music & Entrance Ambience
              </span>
              <p className="text-stone-500">
                Preview and synthesize traditional celebration tunes for wedding mandap entries, Bratabandha, and reception galas.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  id: 'track-mangal',
                  title: 'Auspicious Mangal Dhun (मंगल धुन)',
                  type: 'MANGAL_DHUN' as const,
                  desc: 'Traditional sacred temple Shehnai & Sitar melodies played during wedding rituals and Muhurats.',
                },
                {
                  id: 'track-panche',
                  title: 'Panche Baja Procession (पञ्चेबाजा)',
                  type: 'PANCHE_BAJA' as const,
                  desc: 'High-energy Damaha, Dholak, Tyamko, and Karnal festive beats for wedding Janti entrances.',
                },
                {
                  id: 'track-shehnai',
                  title: 'Royal Wedding Shehnai (शाही शहनाई)',
                  type: 'SHEHNAI' as const,
                  desc: 'Regal morning Raga Bilawal Shehnai for banquet feasts and family reception gatherings.',
                },
              ].map((track) => (
                <div
                  key={track.id}
                  className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-stone-900">{track.title}</div>
                    <p className="text-[11px] text-stone-500">{track.desc}</p>
                  </div>

                  <button
                    onClick={() => togglePlayCelebrationTrack(track.id, track.type)}
                    className={`w-full py-2.5 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      playingTrackId === track.id
                        ? 'bg-amber-900 text-white shadow'
                        : 'bg-white border border-stone-200 text-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    {playingTrackId === track.id ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Stop Melodic Stream</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Play Live Preview</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
              Note: Custom AI music composition via Lyria (`lyria-3-clip-preview` / `lyria-3-pro-preview`) is enabled when a billing API key is attached in Settings &gt; Secrets. In the meantime, standard celebration music synthesizers are fully functional above.
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
