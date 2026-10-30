import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as googleTTS from 'google-tts-api';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';

const execAsync = promisify(exec);

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

export const getAudioDuration = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      const duration = metadata.format?.duration || 0;
      resolve(Number(duration));
    });
  });
};

const mapLanguageCode = (lang = 'English') => {
  const normalized = lang.toLowerCase();
  if (normalized.includes('hindi') || normalized.includes('hinglish')) return 'hi';
  if (normalized.includes('spanish')) return 'es';
  if (normalized.includes('french')) return 'fr';
  if (normalized.includes('german')) return 'de';
  return 'en';
};

const generateWithElevenLabs = async ({ text, voiceId, apiKey, modelId, outputPath }) => {
  const response = await axios({
    method: 'POST',
    url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg'
    },
    data: {
      text,
      model_id: modelId || 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8
      }
    },
    responseType: 'arraybuffer',
    timeout: 30000
  });

  fs.writeFileSync(outputPath, Buffer.from(response.data));
  const duration = await getAudioDuration(outputPath);
  return { audioPath: outputPath, duration };
};

export const generateSpeechAudio = async ({ text, language = 'Hinglish', outputPath }) => {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const elevenLabsKey = process.env.ELEVENLABS_API_KEY?.trim();
  const voiceId = process.env.ELEVENLABS_VOICE_ID?.trim() || '21m00Tcm4TlvDq8ikWAM';
  const modelId = process.env.ELEVENLABS_MODEL_ID?.trim() || 'eleven_multilingual_v2';

  if (elevenLabsKey && elevenLabsKey !== 'your_api_key') {
    try {
      return await generateWithElevenLabs({ text, voiceId, apiKey: elevenLabsKey, modelId, outputPath });
    } catch {
    }
  }

  const langCode = mapLanguageCode(language);

  try {
    const base64 = await googleTTS.getAudioBase64(text, {
      lang: langCode,
      slow: false,
      timeout: 8000
    });
    fs.writeFileSync(outputPath, Buffer.from(base64, 'base64'));
    const duration = await getAudioDuration(outputPath);
    return { audioPath: outputPath, duration };
  } catch (onlineError) {
    const aiffPath = outputPath.replace(/\.mp3$/, '.aiff');
    const sanitizedText = text.replace(/["\\]/g, ' ');
    const voiceFlag = langCode === 'hi' ? '-v Aman' : '-v Samantha';

    try {
      await execAsync(`say ${voiceFlag} -o "${aiffPath}" "${sanitizedText}"`);
      await new Promise((resolve, reject) => {
        ffmpeg(aiffPath)
          .toFormat('mp3')
          .on('end', () => {
            if (fs.existsSync(aiffPath)) fs.unlinkSync(aiffPath);
            resolve();
          })
          .on('error', (err) => reject(err))
          .save(outputPath);
      });
      const duration = await getAudioDuration(outputPath);
      return { audioPath: outputPath, duration };
    } catch (fallbackError) {
      const error = new Error(`Audio synthesis failed: ${onlineError.message}; Fallback: ${fallbackError.message}`);
      error.statusCode = 500;
      throw error;
    }
  }
};
