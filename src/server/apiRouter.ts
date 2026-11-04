/**
 * UTSAVO - Backend API Router (Gemini AI Proxy & Endpoints)
 * Shared across standalone server (AI Studio dev) and Vercel serverless deployment
 */

import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';

export const apiRouter = Router();

// Shared GoogleGenAI client (reads GEMINI_API_KEY from environment)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check
apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'UTSAVO',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// 1. Multi-Turn Chatbot Endpoint (gemini-3.8-flash)
apiRouter.post('/chat', async (req, res) => {
  try {
    const { messages, systemInstruction } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const defaultInstruction =
      'You are UTSAVO AI, Nepal\'s premier event and celebration planning assistant. You guide users on wedding (Bibaha) customs, Bratabandha, Pasni, Newari bhoj, Terai Mithila traditions, Hindu Panchanga auspicious Muhurats, party palace selections, and catering budgets across Nepal\'s 7 provinces. Provide polite, culturally respectful, warm, and structured guidance in English and Nepali.';

    const formattedContents = messages.map((m: { role: string; text: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction || defaultInstruction,
      },
    });

    res.json({
      text: response.text || 'No response generated.',
    });
  } catch (err: any) {
    console.error('Chat API Error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate chat response' });
  }
});

// 2. Google Search Grounding Endpoint (gemini-3.8-flash with googleSearch)
apiRouter.post('/search', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'query is required' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Search and provide verified, up-to-date celebration, venue, Panchanga, or cultural information for Nepal: ${query}`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSources = groundingChunks
      .filter((c: any) => c.web)
      .map((c: any) => ({
        title: c.web.title,
        uri: c.web.uri,
      }));

    res.json({
      text: response.text || '',
      sources: webSources,
    });
  } catch (err: any) {
    console.error('Search Grounding Error:', err);
    res.status(500).json({ error: err.message || 'Failed to execute search grounding' });
  }
});

// 3. Google Maps Grounding Endpoint (gemini-3.8-flash with googleMaps)
apiRouter.post('/maps', async (req, res) => {
  try {
    const { query, latitude, longitude } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'query is required' });
    }

    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    if (latitude && longitude) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: Number(latitude),
            longitude: Number(longitude),
          },
        },
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Find celebration venues, party palaces, landmark directions, and banquet accessibility in Nepal: ${query}`,
      config,
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const mapSources = groundingChunks
      .filter((c: any) => c.maps)
      .map((c: any) => ({
        title: c.maps.title,
        uri: c.maps.uri,
      }));

    res.json({
      text: response.text || '',
      places: mapSources,
    });
  } catch (err: any) {
    console.error('Maps Grounding Error:', err);
    res.status(500).json({ error: err.message || 'Failed to execute maps grounding' });
  }
});

// 4. Audio Transcription Endpoint (gemini-3.5-transcribe)
apiRouter.post('/transcribe', async (req, res) => {
  try {
    const { audioBase64, mimeType } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: 'audioBase64 is required' });
    }

    const audioPart = {
      inlineData: {
        mimeType: mimeType || 'audio/webm',
        data: audioBase64,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          audioPart,
          { text: 'Transcribe this spoken audio accurately. It may be in Nepali, English, or mixed Nepali-English.' },
        ],
      },
    });

    res.json({
      transcription: response.text || '',
    });
  } catch (err: any) {
    console.error('Audio Transcription Error:', err);
    res.status(500).json({ error: err.message || 'Failed to transcribe audio' });
  }
});
