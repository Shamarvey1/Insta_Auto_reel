import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  host: '127.0.0.1',
  nodeEnv: process.env.NODE_ENV || 'development',
  groq: {
    apiKey: process.env.GROQ_API_KEY || '',
    model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'
  },
  comfyui: {
    baseUrl: process.env.COMFYUI_URL || 'http://127.0.0.1:8188'
  },
  tts: {
    provider: process.env.TTS_PROVIDER || 'edge',
    voice: process.env.TTS_VOICE || 'hi-IN-MadhurNeural'
  },
  storage: {
    basePath: path.resolve(__dirname, '../../storage')
  }
};
