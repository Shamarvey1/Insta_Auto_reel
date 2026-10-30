import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import reelRoutes from './routes/reelRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '127.0.0.1';

app.use(cors());
app.use(express.json());

app.use('/media', express.static(path.join(__dirname, 'generated')));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'Instagram Auto-Reel Agent Backend',
    version: '1.0.0'
  });
});

app.use('/api/reels', reelRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, HOST, () => {
    console.log(`🚀 Auto-Reel Agent Server running on http://${HOST}:${PORT}`);
  });
}

export default app;
