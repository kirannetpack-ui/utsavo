/**
 * UTSAVO - Backend Server & AI Studio Proxy Routes
 * Runs Express on Port 3000 with Vite middleware in dev
 */

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '20mb' }));

// Shared GoogleGenAI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// 1. Multi-Turn Chatbot Endpoint (gemini-3.8-flash)
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, systemInstruction } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const defaultInstruction =
      'You are UTSAVO AI, Nepal\'s leading event and celebration expert. You guide users on wedding (Bibaha) customs, Bratabandha, Pasni, Newari feasts, Terai traditions, Hindu Panchanga auspicious Muhurats, party palace hall selections, and catering budgets across Nepal\'s 7 provinces. Provide polite, culturally respectful, warm, and structured guidance in English and Nepali.';

    // Format chat history for @google/genai
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
app.post('/api/search', async (req, res) => {
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
app.post('/api/maps', async (req, res) => {
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
app.post('/api/transcribe', async (req, res) => {
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

// Mount Vite or serve static dist
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`UTSAVO Server running on http://0.0.0.0:${port}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
