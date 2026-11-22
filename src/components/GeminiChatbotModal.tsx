/**
 * SAGUNOO - AI Celebration Planning Assistant & Gemini Intelligence Hub
 * Features:
 * 1. Multi-turn chat with conversation history, role system instructions & model tier routing (gemini-4-hydrogen / gemini-3.1-flash-lite)
 * 2. Real-time bidirectional Voice Conversations via Gemini Live API (gemini-3.8-live WebSocket PCM streaming)
 * 3. Firestore Conversation History Persistence for Google-authenticated users
 * 4. Voice Audio Transcription via Microphone (gemini-3.5-transcribe)
 * 5. Real-time Google Search & Google Maps Grounding + Celebration Music Preview
 */

import React, { useState, useRef, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebase/config';
import {
  deleteUserChatSession,
  PersistedAiChatMessage,
  PersistedAiChatSession,
  saveUserChatSession,
  subscribeUserChatSessions,
} from '../firebase/userWorkspaceSync';
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
  Play,
  Pause,
  Bot,
  User,
  Radio,
  PhoneOff,
  Plus,
  Trash2,
  SlidersHorizontal,
  Volume2,
  VolumeX,
} from 'lucide-react';

type ChatbotTab = 'CHAT' | 'LIVE_VOICE' | 'SEARCH_MAPS' | 'CELEBRATION_MUSIC';
type ModelTier = 'GENERAL' | 'DEEP' | 'FAST';
type LiveStatus = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'ERROR';

interface RolePresetOption {
  id: string;
  label: string;
  shortDesc: string;
  systemInstruction: string;
}

const ROLE_PRESETS: RolePresetOption[] = [
  {
    id: 'EVENT_PLANNER',
    label: 'Event Producer & Planner',
    shortDesc: 'Full event logistics, party palaces, guest flow & menus',
    systemInstruction:
      'You are SAGUNOO Event Producer & Planning Assistant for Nepal. Guide clients on wedding (Bibaha), reception, Bratabandha, Pasni, party palace selection, run-of-show logistics, sound curfews (10:00 PM DAO rule), and catering menus across Nepal in warm, structured English or Nepali.',
  },
  {
    id: 'PANCHANGA_PANDIT',
    label: 'Panchanga & Ritual Advisor',
    shortDesc: 'Samiti auspicious dates, Tithi, Nakshatra & Lagan timings',
    systemInstruction:
      'You are SAGUNOO Hindu Panchanga & Vedic Ritual Advisor. Explain Samiti auspicious dates, Tithi, Nakshatra, Lagan windows, seasonal suitability, and ceremonial requirements (Vivah Mandap, Havan, Bratabandha, Griha Pravesh) clearly and respectfully.',
  },
  {
    id: 'NEGOTIATION_STRATEGIST',
    label: 'Budget & Negotiation Strategist',
    shortDesc: 'Per-plate NPR math, 10% SC + 13% VAT & counter-offer tips',
    systemInstruction:
      'You are SAGUNOO Hospitality Commercial Strategist. Help hosts calculate per-plate costs + 10% Service Charge + 13% IRD VAT, spot off-season concession opportunities, and structure fair counter-offers for venues in NPR.',
  },
  {
    id: 'DESTINATION_CONCIERGE',
    label: 'Destination & NRI Concierge',
    shortDesc: 'Pokhara, Nagarkot, Chitwan & Nepali diaspora abroad events',
    systemInstruction:
      'You are SAGUNOO Destination & NRI Celebration Concierge specializing in Pokhara, Kathmandu, Nagarkot, Chitwan, and Nepali diaspora events abroad. Cover guest room blocks, travel logistics, visas, customs for wedding attire, and mountain weather backups.',
  },
];

const MODEL_TIER_OPTIONS: Array<{
  id: ModelTier;
  label: string;
  modelName: string;
  desc: string;
}> = [
  {
    id: 'GENERAL',
    label: 'Balanced (Gemini 4 Hydrogen)',
    modelName: 'gemini-4-hydrogen',
    desc: 'General celebration planning & multi-turn Q&A',
  },
  {
    id: 'DEEP',
    label: 'Deep Planning (Hydrogen · High Thinking)',
    modelName: 'gemini-4-hydrogen',
    desc: 'Complex itineraries, budget reconciliation & trade-offs',
  },
  {
    id: 'FAST',
    label: 'Fast Lookup (Gemini 3.1 Flash Lite)',
    modelName: 'gemini-3.1-flash-lite',
    desc: 'Instant quick answers, checklists & fast replies',
  },
];

const LIVE_VOICES = ['Zephyr', 'Kore', 'Puck', 'Charon', 'Fenrir'];

function float32ToPcm16Base64(float32: Float32Array): string {
  const buffer = new ArrayBuffer(float32.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < float32.length; i++) {
    const clamped = Math.max(-1, Math.min(1, float32[i]));
    view.setInt16(i * 2, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
  }
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function pcm16Base64ToFloat32(base64: string): Float32Array {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const sampleCount = Math.floor(bytes.length / 2);
  const float32 = new Float32Array(sampleCount);
  const view = new DataView(bytes.buffer);
  for (let i = 0; i < sampleCount; i++) {
    float32[i] = view.getInt16(i * 2, true) / 32768;
  }
  return float32;
}

const createWelcomeMessage = (rolePreset: string): PersistedAiChatMessage => {
  const preset = ROLE_PRESETS.find((r) => r.id === rolePreset) || ROLE_PRESETS[0];
  return {
    id: 'welcome',
    role: 'assistant',
    text: `Namaste! I am acting as your ${preset.label}. Ask me about Nepali party palaces, Panchanga Muhurats, guest budgets, or multi-day celebration schedules.`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
};

export const GeminiChatbotModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  initialTab?: ChatbotTab;
}> = ({ isOpen, onClose, initialTab = 'CHAT' }) => {
  const [activeTab, setActiveTab] = useState<ChatbotTab>(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Authenticated Firestore chat persistence
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(auth.currentUser);
  const [savedSessions, setSavedSessions] = useState<PersistedAiChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>(() => `chat_${Date.now()}`);
  const [sessionCreatedAt, setSessionCreatedAt] = useState<string>(() => new Date().toISOString());

  // Multi-turn chat state
  const [rolePreset, setRolePreset] = useState<string>('EVENT_PLANNER');
  const [customSystemInstruction, setCustomSystemInstruction] = useState<string>('');
  const [showRoleConfig, setShowRoleConfig] = useState<boolean>(false);
  const [modelTier, setModelTier] = useState<ModelTier>('GENERAL');
  const [messages, setMessages] = useState<PersistedAiChatMessage[]>(() => [
    createWelcomeMessage('EVENT_PLANNER'),
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inlineNotice, setInlineNotice] = useState<string | null>(null);

  // Audio Recording & Static Transcription
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Grounding toggles
  const [useSearchGrounding, setUseSearchGrounding] = useState(false);
  const [useMapsGrounding, setUseMapsGrounding] = useState(false);

  // Search & Maps tab state
  const [groundingQuery, setGroundingQuery] = useState('');
  const [groundingResults, setGroundingResults] = useState<{
    text: string;
    sources?: Array<{ title: string; uri: string }>;
    places?: Array<{ title: string; uri: string }>;
  } | null>(null);
  const [isGroundingLoading, setIsGroundingLoading] = useState(false);

  // Live API Real-Time Voice Conversation state (gemini-3.8-live)
  const [liveStatus, setLiveStatus] = useState<LiveStatus>('DISCONNECTED');
  const [liveError, setLiveError] = useState<string | null>(null);
  const [liveVoiceName, setLiveVoiceName] = useState<string>('Zephyr');
  const [liveIsMuted, setLiveIsMuted] = useState<boolean>(false);
  const [liveTextTurn, setLiveTextTurn] = useState<string>('');
  const [liveTranscripts, setLiveTranscripts] = useState<
    Array<{ id: string; speaker: 'USER' | 'MODEL'; text: string; time: string }>
  >([]);

  const liveWsRef = useRef<WebSocket | null>(null);
  const liveInputCtxRef = useRef<AudioContext | null>(null);
  const liveOutputCtxRef = useRef<AudioContext | null>(null);
  const liveStreamRef = useRef<MediaStream | null>(null);
  const liveProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const liveIsMutedRef = useRef<boolean>(false);
  const liveNextStartTimeRef = useRef<number>(0);
  const liveActiveSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Celebration Music Player
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const musicAudioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorNodesRef = useRef<any[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const liveEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    liveIsMutedRef.current = liveIsMuted;
  }, [liveIsMuted]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    liveEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [liveTranscripts]);

  // Listen to Firebase Auth & attach Firestore chat session history listener only when authenticated
  useEffect(() => {
    let unsubSessions: (() => void) | null = null;
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (unsubSessions) {
        unsubSessions();
        unsubSessions = null;
      }
      if (!user) {
        setSavedSessions([]);
        return;
      }
      unsubSessions = subscribeUserChatSessions(
        user.uid,
        (sessions) => {
          setSavedSessions(sessions);
        },
        (err) => {
          console.warn('Chat history sync note:', err);
        }
      );
    });

    return () => {
      if (unsubSessions) unsubSessions();
      unsubAuth();
    };
  }, []);

  const stopLiveVoiceSession = () => {
    try {
      liveProcessorRef.current?.disconnect();
    } catch {
      // ignore
    }
    liveProcessorRef.current = null;

    if (liveStreamRef.current) {
      liveStreamRef.current.getTracks().forEach((t) => t.stop());
      liveStreamRef.current = null;
    }

    if (liveInputCtxRef.current) {
      liveInputCtxRef.current.close().catch(() => {});
      liveInputCtxRef.current = null;
    }

    for (const src of liveActiveSourcesRef.current) {
      try {
        src.stop();
      } catch {
        // ignore
      }
    }
    liveActiveSourcesRef.current.clear();

    if (liveOutputCtxRef.current) {
      liveOutputCtxRef.current.close().catch(() => {});
      liveOutputCtxRef.current = null;
    }

    if (liveWsRef.current) {
      try {
        liveWsRef.current.close();
      } catch {
        // ignore
      }
      liveWsRef.current = null;
    }

    liveNextStartTimeRef.current = 0;
    setLiveStatus('DISCONNECTED');
  };

  useEffect(() => {
    return () => {
      stopLiveVoiceSession();
      stopMusicAudio();
    };
  }, []);

  if (!isOpen) return null;

  const persistCurrentThreadIfAuthed = (
    updatedMessages: PersistedAiChatMessage[],
    preset = rolePreset,
    tier = modelTier
  ) => {
    if (!auth.currentUser || updatedMessages.length < 2) return;
    const firstUserMsg = updatedMessages.find((m) => m.role === 'user')?.text || 'Planning Chat';
    const title = firstUserMsg.slice(0, 70);
    saveUserChatSession({
      id: activeSessionId,
      uid: auth.currentUser.uid,
      title,
      rolePreset: preset,
      modelTier: tier,
      messages: updatedMessages,
      createdAt: sessionCreatedAt,
      updatedAt: new Date().toISOString(),
    }).catch((err) => console.warn('Failed to persist chat session:', err));
  };

  const handleStartNewChat = () => {
    setActiveSessionId(`chat_${Date.now()}`);
    setSessionCreatedAt(new Date().toISOString());
    setMessages([createWelcomeMessage(rolePreset)]);
    setInlineNotice(null);
  };

  const handleLoadSession = (session: PersistedAiChatSession) => {
    setActiveSessionId(session.id);
    setSessionCreatedAt(session.createdAt);
    setRolePreset(session.rolePreset || 'EVENT_PLANNER');
    setModelTier(session.modelTier || 'GENERAL');
    setMessages(
      session.messages.length > 0 ? session.messages : [createWelcomeMessage(session.rolePreset)]
    );
    setInlineNotice(null);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    setInlineNotice(null);

    const userMsg: PersistedAiChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputText('');
    setIsLoading(true);

    try {
      if (useMapsGrounding) {
        const res = await fetch('/api/maps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: userMsg.text }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Maps grounding failed');

        const finalMsgs: PersistedAiChatMessage[] = [
          ...nextMessages,
          {
            id: `bot_${Date.now()}`,
            role: 'assistant',
            text: data.text || 'Location details retrieved via Google Maps.',
            places: data.places,
            modelUsed: 'gemini-4-hydrogen',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ];
        setMessages(finalMsgs);
        persistCurrentThreadIfAuthed(finalMsgs);
      } else {
        const presetObj = ROLE_PRESETS.find((r) => r.id === rolePreset) || ROLE_PRESETS[0];
        const activeInstruction = customSystemInstruction.trim() || presetObj.systemInstruction;

        const chatPayload = nextMessages.map((m) => ({ role: m.role, text: m.text }));
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: chatPayload,
            rolePreset,
            modelTier,
            systemInstruction: activeInstruction,
            useSearchGrounding,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to get AI response');

        const finalMsgs: PersistedAiChatMessage[] = [
          ...nextMessages,
          {
            id: `bot_${Date.now()}`,
            role: 'assistant',
            text: data.text || 'No response generated.',
            modelUsed: data.modelUsed,
            sources: data.sources,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ];
        setMessages(finalMsgs);
        persistCurrentThreadIfAuthed(finalMsgs);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_err_${Date.now()}`,
          role: 'assistant',
          text: err?.message || 'Temporary issue communicating with Gemini AI. Please retry.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Microphone Audio Recording -> /api/transcribe
  const startRecording = async () => {
    setInlineNotice(null);
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
            setInlineNotice('Could not transcribe audio clip. Please try speaking again.');
          } finally {
            setIsLoading(false);
          }
        };
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied:', err);
      setInlineNotice('Microphone permission was denied. Allow mic access in your browser to dictate.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Real-Time Gemini Live API Session (gemini-3.8-live via WebSocket 16kHz in / 24kHz out)
  const startLiveVoiceSession = async () => {
    if (liveStatus === 'CONNECTING' || liveStatus === 'CONNECTED') return;
    setLiveError(null);
    setLiveStatus('CONNECTING');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      liveStreamRef.current = stream;

      const inputAudioCtx = new AudioContext({ sampleRate: 16000 });
      const outputAudioCtx = new AudioContext({ sampleRate: 24000 });
      liveInputCtxRef.current = inputAudioCtx;
      liveOutputCtxRef.current = outputAudioCtx;
      liveNextStartTimeRef.current = outputAudioCtx.currentTime;

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live?voice=${encodeURIComponent(
        liveVoiceName
      )}&persona=${encodeURIComponent(rolePreset)}`;
      const ws = new WebSocket(wsUrl);
      liveWsRef.current = ws;

      const schedulePlaybackChunk = (base64Audio: string) => {
        const ctx = liveOutputCtxRef.current;
        if (!ctx) return;

        const float32 = pcm16Base64ToFloat32(base64Audio);
        if (float32.length === 0) return;

        const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
        audioBuffer.getChannelData(0).set(float32);

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);

        const startAt = Math.max(ctx.currentTime, liveNextStartTimeRef.current);
        source.start(startAt);
        liveNextStartTimeRef.current = startAt + audioBuffer.duration;

        liveActiveSourcesRef.current.add(source);
        source.onended = () => {
          liveActiveSourcesRef.current.delete(source);
        };
      };

      ws.onopen = () => {
        const source = inputAudioCtx.createMediaStreamSource(stream);
        const processor = inputAudioCtx.createScriptProcessor(4096, 1, 1);
        liveProcessorRef.current = processor;

        processor.onaudioprocess = (e) => {
          if (liveIsMutedRef.current) return;
          if (ws.readyState !== WebSocket.OPEN) return;
          const base64Pcm = float32ToPcm16Base64(e.inputBuffer.getChannelData(0));
          ws.send(JSON.stringify({ audio: base64Pcm }));
        };

        source.connect(processor);
        processor.connect(inputAudioCtx.destination);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'ready') {
            setLiveStatus('CONNECTED');
            setLiveTranscripts([
              {
                id: `live-ready-${Date.now()}`,
                speaker: 'MODEL',
                text: `Connected to Gemini Live (${liveVoiceName}). Start speaking naturally in English or Nepali.`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
          } else if (msg.type === 'audio' && msg.audio) {
            schedulePlaybackChunk(msg.audio);
          } else if (msg.type === 'inputTranscript' && msg.text) {
            setLiveTranscripts((prev) => [
              ...prev,
              {
                id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
                speaker: 'USER',
                text: msg.text,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
          } else if (msg.type === 'outputTranscript' && msg.text) {
            setLiveTranscripts((prev) => [
              ...prev,
              {
                id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
                speaker: 'MODEL',
                text: msg.text,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
          } else if (msg.type === 'interrupted') {
            for (const src of liveActiveSourcesRef.current) {
              try {
                src.stop();
              } catch {
                // ignore
              }
            }
            liveActiveSourcesRef.current.clear();
            if (liveOutputCtxRef.current) {
              liveNextStartTimeRef.current = liveOutputCtxRef.current.currentTime;
            }
          } else if (msg.type === 'error') {
            setLiveError(msg.message || 'Live API voice stream error.');
            setLiveStatus('ERROR');
          } else if (msg.type === 'closed') {
            stopLiveVoiceSession();
          }
        } catch (err) {
          console.warn('Error parsing live socket message:', err);
        }
      };

      ws.onerror = () => {
        setLiveError('WebSocket connection to /api/live could not be established.');
        stopLiveVoiceSession();
        setLiveStatus('ERROR');
      };

      ws.onclose = () => {
        stopLiveVoiceSession();
      };
    } catch (err: any) {
      setLiveError(err?.message || 'Microphone access is required for Live Voice conversations.');
      stopLiveVoiceSession();
      setLiveStatus('ERROR');
    }
  };

  const handleSendLiveTextTurn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveTextTurn.trim() || !liveWsRef.current || liveWsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }
    const text = liveTextTurn.trim();
    liveWsRef.current.send(JSON.stringify({ text }));
    setLiveTranscripts((prev) => [
      ...prev,
      {
        id: `u-txt-${Date.now()}`,
        speaker: 'USER',
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setLiveTextTurn('');
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

  // Celebration Music Synthesizer
  const togglePlayCelebrationTrack = (
    trackId: string,
    trackType: 'MANGAL_DHUN' | 'PANCHE_BAJA' | 'SHEHNAI'
  ) => {
    if (playingTrackId === trackId) {
      stopMusicAudio();
      setPlayingTrackId(null);
      return;
    }

    stopMusicAudio();
    setPlayingTrackId(trackId);

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    musicAudioCtxRef.current = ctx;

    const baseFreq = trackType === 'MANGAL_DHUN' ? 440 : trackType === 'PANCHE_BAJA' ? 330 : 523.25;
    const notes = [1, 9 / 8, 5 / 4, 4 / 3, 3 / 2, 5 / 3, 15 / 8, 2];

    let noteIdx = 0;
    const interval = setInterval(() => {
      if (!musicAudioCtxRef.current) return;
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

  function stopMusicAudio() {
    if (musicAudioCtxRef.current) {
      musicAudioCtxRef.current.close().catch(() => {});
      musicAudioCtxRef.current = null;
    }
    oscillatorNodesRef.current.forEach((item) => {
      if (item.interval) clearInterval(item.interval);
    });
    oscillatorNodesRef.current = [];
  }

  const activeTierMeta = MODEL_TIER_OPTIONS.find((m) => m.id === modelTier) || MODEL_TIER_OPTIONS[0];
  const activeRoleMeta = ROLE_PRESETS.find((r) => r.id === rolePreset) || ROLE_PRESETS[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col">
        {/* Header */}
        <div className="p-5 bg-stone-900 text-white flex items-start justify-between gap-4 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 tracking-wide mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini AI Celebration Suite · Chat, Live Voice &amp; Grounding</span>
            </div>
            <h3 className="font-display text-xl font-bold">SAGUNOO Smart Assistant</h3>
            <p className="text-xs text-stone-300 mt-0.5">
              Powered by {activeTierMeta.modelName} &amp; Live Voice (gemini-3.8-live) with Search &amp; Maps Grounding
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              stopLiveVoiceSession();
              stopMusicAudio();
              onClose();
            }}
            className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors shrink-0"
            aria-label="Close assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 sm:px-6 py-2.5 bg-stone-100 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-200/80 rounded-xl">
            {[
              { id: 'CHAT', label: 'Multi-Turn Chat', icon: Bot },
              { id: 'LIVE_VOICE', label: 'Live Voice', icon: Radio },
              { id: 'SEARCH_MAPS', label: 'Search & Maps', icon: Globe },
              { id: 'CELEBRATION_MUSIC', label: 'Celebration Music', icon: Music },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as ChatbotTab)}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      tab.id === 'LIVE_VOICE' && liveStatus === 'CONNECTED'
                        ? 'text-emerald-700 animate-pulse'
                        : 'text-amber-800'
                    }`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {activeTab === 'CHAT' && (
            <div className="flex items-center gap-2 text-[11px] text-stone-600">
              <button
                type="button"
                onClick={() => setShowRoleConfig((v) => !v)}
                className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg font-medium text-stone-700 hover:bg-stone-50 inline-flex items-center gap-1"
              >
                <SlidersHorizontal className="w-3 h-3 text-amber-800" />
                <span>Role &amp; Model</span>
              </button>

              <button
                type="button"
                onClick={handleStartNewChat}
                className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg font-medium text-stone-700 hover:bg-stone-50 inline-flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>New Chat</span>
              </button>
            </div>
          )}
        </div>

        {/* TAB 1: MULTI-TURN CHAT WITH ROLES, MODEL TIERS & FIRESTORE HISTORY */}
        {activeTab === 'CHAT' && (
          <div className="flex flex-col h-[60vh]">
            {/* Collapsible Role & Model Configuration Bar */}
            {showRoleConfig && (
              <div className="px-5 py-3 bg-stone-50 border-b border-stone-200 space-y-2.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Chatbot Role (System Instruction Preset)
                    </label>
                    <select
                      value={rolePreset}
                      onChange={(e) => setRolePreset(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-800"
                    >
                      {ROLE_PRESETS.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.label} — {r.shortDesc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Task Speed / Reasoning Model Tier
                    </label>
                    <select
                      value={modelTier}
                      onChange={(e) => setModelTier(e.target.value as ModelTier)}
                      className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-800"
                    >
                      {MODEL_TIER_OPTIONS.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    Custom System Instruction Override (Optional)
                  </label>
                  <input
                    type="text"
                    value={customSystemInstruction}
                    onChange={(e) => setCustomSystemInstruction(e.target.value)}
                    placeholder={`Default active: ${activeRoleMeta.systemInstruction.slice(0, 95)}...`}
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-800"
                  />
                </div>
              </div>
            )}

            {/* Quiet Active Role + Saved Firestore History Bar */}
            <div className="px-5 py-2 bg-stone-50/70 border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-600">
              <div className="flex flex-wrap items-center gap-2">
                <strong className="text-stone-900">{activeRoleMeta.label}</strong>
                <span aria-hidden="true">·</span>
                <span>{activeTierMeta.modelName}</span>
                {firebaseUser && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-800 font-medium">
                      Synced ({savedSessions.length} saved chats)
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3">
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
            </div>

            <div className="flex flex-1 min-h-0">
              {/* Saved Sessions Strip for Authenticated Users */}
              {firebaseUser && savedSessions.length > 0 && (
                <aside className="hidden md:flex w-52 border-r border-stone-200 bg-stone-50/50 flex-col overflow-y-auto p-2.5 space-y-1.5 text-xs">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Saved Conversations
                  </div>
                  {savedSessions.map((sess) => (
                    <div
                      key={sess.id}
                      className={`group flex items-center justify-between gap-1 px-2.5 py-2 rounded-xl cursor-pointer transition-colors ${
                        activeSessionId === sess.id
                          ? 'bg-amber-900 text-white'
                          : 'text-stone-700 hover:bg-stone-200/70'
                      }`}
                      onClick={() => handleLoadSession(sess)}
                    >
                      <span className="truncate font-medium">{sess.title}</span>
                      <button
                        type="button"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          deleteUserChatSession(firebaseUser.uid, sess.id).catch(() => {});
                          if (activeSessionId === sess.id) handleStartNewChat();
                        }}
                        aria-label="Delete saved conversation"
                        className={`p-0.5 rounded opacity-70 hover:opacity-100 ${
                          activeSessionId === sess.id ? 'text-amber-200' : 'text-stone-500'
                        }`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </aside>
              )}

              {/* Scrollable Messages Thread */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
                {inlineNotice && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 text-xs">
                    {inlineNotice}
                  </div>
                )}

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
                      className={`max-w-[82%] rounded-2xl p-3.5 space-y-2 leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-amber-900 text-white'
                          : 'bg-stone-100 text-stone-800 border border-stone-200/80'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{m.text}</div>

                      {m.sources && m.sources.length > 0 && (
                        <div className="pt-2 border-t border-stone-200 space-y-1">
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
                                <span className="truncate max-w-[160px]">{s.title || s.uri}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {m.places && m.places.length > 0 && (
                        <div className="pt-2 border-t border-stone-200 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                            Google Maps Places:
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
                                <span className="truncate max-w-[180px]">{p.title || 'View Map'}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      <div
                        className={`text-[10px] flex items-center gap-1.5 ${
                          m.role === 'user' ? 'text-amber-200 justify-end' : 'text-stone-400'
                        }`}
                      >
                        <span>{m.timestamp}</span>
                        {m.modelUsed && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{m.modelUsed}</span>
                          </>
                        )}
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
                  <div className="flex items-center gap-2 text-xs text-stone-500 pl-11">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-800" />
                    <span>Thinking with {activeTierMeta.modelName}...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>

            {/* Chat Composer */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 bg-stone-50 border-t border-stone-200 flex items-center gap-2"
            >
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
                title={
                  isRecording
                    ? 'Stop recording and transcribe'
                    : 'Dictate prompt (gemini-3.5-transcribe)'
                }
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
                    : useMapsGrounding
                    ? 'Find party palaces and directions across Nepal with Google Maps...'
                    : 'Ask about party palaces, Panchanga dates, menus, or budget breakdowns...'
                }
                className="flex-1 text-xs bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="px-4 py-2.5 bg-amber-900 hover:bg-amber-950 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: REAL-TIME VOICE CONVERSATIONS (GEMINI LIVE API: gemini-3.8-live) */}
        {activeTab === 'LIVE_VOICE' && (
          <div className="flex flex-col h-[60vh]">
            <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2.5">
                <select
                  aria-label="Select Live API voice persona"
                  value={liveVoiceName}
                  disabled={liveStatus === 'CONNECTED' || liveStatus === 'CONNECTING'}
                  onChange={(e) => setLiveVoiceName(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-800 disabled:opacity-60"
                >
                  {LIVE_VOICES.map((v) => (
                    <option key={v} value={v}>
                      Voice: {v}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="Select Live API advisor role"
                  value={rolePreset}
                  disabled={liveStatus === 'CONNECTED' || liveStatus === 'CONNECTING'}
                  onChange={(e) => setRolePreset(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-800 disabled:opacity-60"
                >
                  {ROLE_PRESETS.map((r) => (
                    <option key={r.id} value={r.id}>
                      Role: {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                {liveStatus === 'CONNECTED' && (
                  <button
                    type="button"
                    onClick={() => setLiveIsMuted((m) => !m)}
                    className={`px-3 py-1.5 rounded-xl font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
                      liveIsMuted
                        ? 'bg-amber-100 text-amber-950 border border-amber-300'
                        : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {liveIsMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{liveIsMuted ? 'Mic Muted' : 'Mute Mic'}</span>
                  </button>
                )}

                {liveStatus === 'CONNECTED' || liveStatus === 'CONNECTING' ? (
                  <button
                    type="button"
                    onClick={stopLiveVoiceSession}
                    className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <PhoneOff className="w-3.5 h-3.5" />
                    <span>End Voice Call</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={startLiveVoiceSession}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>Start Real-Time Voice (gemini-3.8-live)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Live Transcript Thread */}
            <div className="flex-1 p-5 overflow-y-auto space-y-3 text-xs bg-white">
              {liveError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900">
                  {liveError}
                </div>
              )}

              {liveTranscripts.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-3 py-8">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-900">
                    <Radio className="w-6 h-6" />
                  </div>
                  <h4 className="font-display text-base font-bold text-stone-900">
                    Real-Time Spoken Planning With Gemini Live
                  </h4>
                  <p className="text-stone-600 leading-relaxed">
                    Have a natural voice conversation about party palace availability, Nepali wedding Panchanga dates, budget calculations, or vendor functions. Streams 16kHz microphone audio and plays real-time 24kHz spoken answers.
                  </p>
                </div>
              )}

              {liveTranscripts.map((entry) => (
                <div
                  key={entry.id}
                  className={`flex gap-2.5 ${entry.speaker === 'USER' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                      entry.speaker === 'USER'
                        ? 'bg-amber-900 text-white'
                        : 'bg-stone-100 text-stone-800 border border-stone-200'
                    }`}
                  >
                    <div className="text-[10px] font-semibold opacity-75 mb-0.5">
                      {entry.speaker === 'USER' ? 'You (Spoken)' : `Gemini Live (${liveVoiceName})`} ·{' '}
                      {entry.time}
                    </div>
                    <div className="leading-relaxed">{entry.text}</div>
                  </div>
                </div>
              ))}
              <div ref={liveEndRef} />
            </div>

            {/* Optional Text Nudge Input During Live Voice Call */}
            <form
              onSubmit={handleSendLiveTextTurn}
              className="p-4 bg-stone-50 border-t border-stone-200 flex items-center gap-2 text-xs"
            >
              <span
                className={`px-2.5 py-1 rounded-lg font-semibold ${
                  liveStatus === 'CONNECTED'
                    ? 'bg-emerald-100 text-emerald-900'
                    : liveStatus === 'CONNECTING'
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                {liveStatus === 'CONNECTED'
                  ? 'Live Audio Active'
                  : liveStatus === 'CONNECTING'
                  ? 'Connecting...'
                  : 'Standby'}
              </span>

              <input
                type="text"
                disabled={liveStatus !== 'CONNECTED'}
                value={liveTextTurn}
                onChange={(e) => setLiveTextTurn(e.target.value)}
                placeholder={
                  liveStatus === 'CONNECTED'
                    ? 'Speak into mic or send a quick typed follow-up...'
                    : 'Click Start Real-Time Voice above to begin speaking...'
                }
                className="flex-1 bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={liveStatus !== 'CONNECTED' || !liveTextTurn.trim()}
                className="px-3.5 py-2 bg-amber-900 text-white rounded-xl font-semibold disabled:opacity-50"
              >
                Send Note
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: DEDICATED SEARCH & MAPS GROUNDING */}
        {activeTab === 'SEARCH_MAPS' && (
          <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto text-xs">
            <div>
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
                Real-Time Grounded Search &amp; Geographic Exploration
              </span>
              <p className="text-stone-500">
                Ground answers directly with live Google Search and Google Maps data for verified Nepali locations.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                value={groundingQuery}
                onChange={(e) => setGroundingQuery(e.target.value)}
                placeholder="e.g. Best party palaces near Naxal Kathmandu with parking or Mangsir wedding muhurats"
                className="flex-1 min-w-[220px] bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-stone-900"
              />
              <button
                type="button"
                onClick={() => handleExecuteGrounding('SEARCH')}
                disabled={isGroundingLoading}
                className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Google Search</span>
              </button>
              <button
                type="button"
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

        {/* TAB 4: CELEBRATION MUSIC */}
        {activeTab === 'CELEBRATION_MUSIC' && (
          <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto text-xs">
            <div>
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
                Authentic Nepali Celebration Music &amp; Entrance Ambience
              </span>
              <p className="text-stone-500">
                Preview traditional celebration melodies for wedding mandap entries, Bratabandha, and reception galas.
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
                    type="button"
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
          </div>
        )}
      </div>
    </div>
  );
};
