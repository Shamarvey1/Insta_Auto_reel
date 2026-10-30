import fs from 'fs';
import path from 'path';
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

export const generateSpeechAudio = async ({ text, language = 'English', outputPath }) => {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
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
