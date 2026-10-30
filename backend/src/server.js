import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/env.js';
import reelRoutes from './routes/reelRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import jobRoutes from './routes/jobRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.use('/storage', express.static(config.storage.basePath));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'Instagram Auto-Reel Agent Backend',
    version: '2.0.0',
    groq: {
      configured: Boolean(config.groq.apiKey),
      model: config.groq.model
    },
    comfyui: {
      baseUrl: config.comfyui.baseUrl
    },
    tts: {
      provider: config.tts.provider,
      voice: config.tts.voice
    }
  });
});

app.use('/api/reels', reelRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/jobs', jobRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    details: err.details || null
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, config.host, () => {
    console.log(`Auto-Reel Agent Server running on http://${config.host}:${config.port}`);
  });
}

export default app;
