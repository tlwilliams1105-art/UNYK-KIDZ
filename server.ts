import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Cache for generated audio clips to ensure instant subsequent playback
const audioCache = new Map<string, string>();

app.post('/api/tts', async (req, res) => {
  try {
    const {
      text,
      voiceName = 'Puck',
      style = 'Friendly, warm, cheerful, and expressive preschool cartoon show character and narrator named MP',
    } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text string is required' });
    }

    const cleanText = text.trim();
    if (!cleanText) {
      return res.status(400).json({ error: 'Text cannot be empty' });
    }

    const cacheKey = `${voiceName}:${cleanText}`;
    if (audioCache.has(cacheKey)) {
      return res.json({
        audio: audioCache.get(cacheKey),
        mimeType: 'audio/wav',
        cached: true,
        voice: voiceName,
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'Gemini API key not configured' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            // 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
            prebuiltVoiceConfig: { voiceName: voiceName || 'Puck' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'No audio returned from Gemini TTS' });
    }

    audioCache.set(cacheKey, base64Audio);
    // Keep cache reasonable
    if (audioCache.size > 150) {
      const firstKey = audioCache.keys().next().value;
      if (firstKey) audioCache.delete(firstKey);
    }

    res.json({
      audio: base64Audio,
      mimeType: 'audio/wav',
      voice: voiceName,
    });
  } catch (error: any) {
    console.error('TTS generation error:', error?.message || error);
    res.status(500).json({ error: error?.message || 'TTS generation failed' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`MP Kids Show full-stack server running on http://0.0.0.0:${port}`);
  });
}

startServer();
