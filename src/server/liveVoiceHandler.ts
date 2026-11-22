/**
 * SAGUNOO - Real-Time Voice Conversation WebSocket Bridge (Gemini Live API: gemini-3.8-live)
 * Streams 16kHz PCM microphone audio from browser -> Gemini Live API and 24kHz PCM + transcripts back.
 */

import type { IncomingMessage } from 'http';
import type { Server as HttpServer } from 'http';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { WebSocketServer, WebSocket } from 'ws';

const VALID_VOICES = new Set(['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr']);

const PERSONA_INSTRUCTIONS: Record<string, string> = {
  EVENT_PLANNER:
    'You are SAGUNOO Live Voice Concierge, Nepal’s bilingual celebration planner. Help families plan weddings (Bibaha), receptions, Bratabandha, Pasni, party palaces, guest capacities, and budgets in natural, warm spoken English or Nepali. Keep spoken replies concise, clear, and conversational.',
  PANCHANGA_PANDIT:
    'You are SAGUNOO Panchanga & Ritual Voice Advisor. Explain Nepal Panchanga Nirnayak Samiti auspicious dates, Tithi, Nakshatra, Lagan windows, and Vedic Mandap or Bratabandha customs in respectful, easy-to-follow spoken guidance.',
  NEGOTIATION_STRATEGIST:
    'You are SAGUNOO Hospitality & Commercial Voice Advisor. Advise hosts on per-plate NPR rates, 10% service charge + 13% IRD VAT math, hall rental negotiation leverage, and advance escrow safeguards.',
  DESTINATION_CONCIERGE:
    'You are SAGUNOO Destination Celebration Voice Concierge for Pokhara, Kathmandu, Nagarkot, Chitwan, and diaspora events abroad. Give clear logistics on guest travel, permits, weather backups, and cultural troupes.',
};

export function attachLiveVoiceWebSocket(httpServer: HttpServer) {
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on('upgrade', (request: IncomingMessage, socket, head) => {
    try {
      const host = request.headers.host || 'localhost:3000';
      const parsedUrl = new URL(request.url || '/', `http://${host}`);
      if (parsedUrl.pathname !== '/api/live') {
        return;
      }

      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } catch {
      socket.destroy();
    }
  });

  wss.on('connection', async (clientWs: WebSocket, request: IncomingMessage) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      clientWs.send(
        JSON.stringify({
          type: 'error',
          message: 'GEMINI_API_KEY is not configured on the server.',
        })
      );
      clientWs.close();
      return;
    }

    const host = request.headers.host || 'localhost:3000';
    const parsedUrl = new URL(request.url || '/', `http://${host}`);
    const requestedVoice = parsedUrl.searchParams.get('voice') || 'Zephyr';
    const voiceName = VALID_VOICES.has(requestedVoice) ? requestedVoice : 'Zephyr';
    const personaKey = parsedUrl.searchParams.get('persona') || 'EVENT_PLANNER';
    const systemInstruction =
      PERSONA_INSTRUCTIONS[personaKey] || PERSONA_INSTRUCTIONS.EVENT_PLANNER;

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    let liveSession: Awaited<ReturnType<typeof ai.live.connect>> | null = null;
    let isClosed = false;

    const safeSend = (payload: Record<string, unknown>) => {
      if (!isClosed && clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify(payload));
      }
    };

    try {
      liveSession = await ai.live.connect({
        model: 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction,
        },
        callbacks: {
          onopen: () => {
            safeSend({
              type: 'ready',
              model: 'gemini-3.8-live',
              voice: voiceName,
              persona: personaKey,
            });
          },
          onmessage: (message: LiveServerMessage) => {
            const content = message.serverContent;

            if (content?.inputTranscription?.text) {
              safeSend({
                type: 'inputTranscript',
                text: content.inputTranscription.text,
              });
            }

            if (content?.outputTranscription?.text) {
              safeSend({
                type: 'outputTranscript',
                text: content.outputTranscription.text,
              });
            }

            for (const part of content?.modelTurn?.parts ?? []) {
              if (part.inlineData?.data) {
                safeSend({
                  type: 'audio',
                  audio: part.inlineData.data,
                });
              }
            }

            if (content?.interrupted) {
              safeSend({ type: 'interrupted' });
            }

            if (content?.turnComplete) {
              safeSend({ type: 'turnComplete' });
            }
          },
          onerror: (err: any) => {
            console.error('Gemini Live session error:', err);
            safeSend({
              type: 'error',
              message: err?.message || 'Live voice session encountered a connection error.',
            });
          },
          onclose: () => {
            if (!isClosed && clientWs.readyState === WebSocket.OPEN) {
              safeSend({ type: 'closed' });
              clientWs.close();
            }
          },
        },
      });
    } catch (err: any) {
      console.error('Failed to connect Gemini Live API:', err);
      safeSend({
        type: 'error',
        message: err?.message || 'Unable to start real-time Gemini Live session.',
      });
      clientWs.close();
      return;
    }

    clientWs.on('message', (rawData) => {
      if (!liveSession || isClosed) return;
      try {
        const msg = JSON.parse(rawData.toString());
        if (msg.audio && typeof msg.audio === 'string') {
          liveSession.sendRealtimeInput({
            audio: {
              data: msg.audio,
              mimeType: 'audio/pcm;rate=16000',
            },
          });
        } else if (msg.text && typeof msg.text === 'string' && msg.text.trim()) {
          liveSession.sendRealtimeInput({
            text: msg.text.trim(),
          });
        }
      } catch (err) {
        console.warn('Ignored malformed live client message:', err);
      }
    });

    clientWs.on('close', () => {
      isClosed = true;
      try {
        liveSession?.close();
      } catch {
        // Ignore double-close errors
      }
    });

    clientWs.on('error', () => {
      isClosed = true;
      try {
        liveSession?.close();
      } catch {
        // Ignore cleanup errors
      }
    });
  });

  return wss;
}
