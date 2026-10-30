import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateReelScript } from '../services/scriptService.js';
import { generateSpeechAudio } from '../services/voiceService.js';
import { selectMediaForScenes } from '../services/media/mediaSelectionService.js';
import { renderFullReel } from '../services/video/videoCompositionService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const reelsStore = new Map();

const buildFallbackScript = ({ topic, duration, language = 'Hinglish', style = 'Educational' }) => {
  const sceneCount = duration === 15 ? 3 : duration === 60 ? 8 : 4;
  const sceneDuration = Math.round(duration / sceneCount);

  return {
    title: topic.length > 40 ? topic.substring(0, 40) : topic,
    topic,
    language,
    style,
    targetDuration: duration,
    hook: `Kya aapko pata hai ${topic} ke baare mein yeh unbelievable fact?`,
    scenes: Array.from({ length: sceneCount }, (_, i) => ({
      sceneNumber: i + 1,
      duration: sceneDuration,
      narration: `Dosto, fact number ${i + 1}: ${topic} ke bare mein yeh baat bohot kam log jaante hain. Dhyaan se suniye.`,
      visualDescription: `Cinematic vertical video of ${topic} with dynamic aesthetic motion.`,
      subtitle: `Fact ${i + 1}: ${topic}`,
      searchKeywords: [topic.split(' ')[0] || 'space', 'cinematic']
    })),
    ending: `Toh yeh tha ${topic} ka sabse hairan karne wala sach.`,
    callToAction: 'Aise hi mind-blowing facts ke liye abhi follow karein!'
  };
};

export const generateScriptOnly = async (req, res, next) => {
  try {
    const { topic, duration, language, style, isHinglish } = req.validatedBody;
    const effectiveLanguage = isHinglish || language === 'Hinglish' ? 'Hinglish' : language;

    try {
      const script = await generateReelScript({ topic, duration, language: effectiveLanguage, style });
      return res.json({ success: true, data: script });
    } catch (scriptErr) {
      if (scriptErr.statusCode === 401 && !process.env.GROQ_API_KEY) {
        const fallback = buildFallbackScript({ topic, duration, language: effectiveLanguage, style });
        return res.json({
          success: true,
          data: fallback,
          note: 'Generated with fallback schema template (Configure GROQ_API_KEY in backend/.env for live Groq LPU inference).'
        });
      }
      throw scriptErr;
    }
  } catch (error) {
    next(error);
  }
};

export const generateReel = async (req, res, next) => {
  try {
    const {
      topic,
      duration,
      language,
      style,
      mode = 'STOCK',
      visualStyle = 'Cinematic',
      isHinglish = false,
      subtitleStyle = 'Bold Pop Yellow',
      script: passedScript
    } = req.validatedBody;

    const reelId = `reel_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const effectiveLanguage = isHinglish || language === 'Hinglish' ? 'Hinglish' : language;

    let finalScript = passedScript;
    if (!finalScript) {
      try {
        finalScript = await generateReelScript({
          topic,
          duration,
          language: effectiveLanguage,
          style
        });
      } catch (err) {
        if (!process.env.GROQ_API_KEY || err.statusCode === 401) {
          finalScript = buildFallbackScript({
            topic,
            duration,
            language: effectiveLanguage,
            style
          });
        } else {
          throw err;
        }
      }
    }

    const baseOutputDir = path.join(__dirname, '../generated');
    const workDir = path.join(baseOutputDir, 'videos', reelId);
    if (!fs.existsSync(workDir)) fs.mkdirSync(workDir, { recursive: true });

    const audioItems = [];
    for (const scene of finalScript.scenes) {
      const audioPath = path.join(workDir, `audio_scene_${scene.sceneNumber}.mp3`);
      const audioResult = await generateSpeechAudio({
        text: scene.narration,
        language: effectiveLanguage,
        outputPath: audioPath
      });
      audioItems.push(audioResult);
    }

    const mediaItems = await selectMediaForScenes({
      mode,
      scenes: finalScript.scenes,
      baseOutputDir: workDir
    });

    const finalVideoPath = path.join(baseOutputDir, 'videos', `${reelId}.mp4`);
    const renderResult = await renderFullReel({
      scenes: finalScript.scenes,
      mediaItems,
      audioItems,
      subtitleStyle,
      workDir,
      outputVideoPath: finalVideoPath
    });

    const reelRecord = {
      id: reelId,
      title: finalScript.title,
      topic,
      duration: renderResult.duration,
      targetDuration: duration,
      language: effectiveLanguage,
      style,
      mode,
      visualStyle,
      subtitleStyle,
      status: 'completed',
      videoUrl: `/media/videos/${reelId}.mp4`,
      videoPath: finalVideoPath,
      downloadUrl: `/api/reels/${reelId}/download`,
      script: finalScript,
      attributions: renderResult.attributions,
      sizeBytes: renderResult.sizeBytes,
      createdAt: new Date().toISOString()
    };

    reelsStore.set(reelId, reelRecord);

    res.json({
      success: true,
      reelId,
      data: reelRecord
    });
  } catch (error) {
    next(error);
  }
};

export const getReelStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reel = reelsStore.get(id);

    if (!reel) {
      return res.status(404).json({
        success: false,
        error: `Reel with ID ${id} not found`
      });
    }

    res.json({
      success: true,
      reelId: id,
      status: reel.status,
      data: reel
    });
  } catch (error) {
    next(error);
  }
};

export const getAllReels = async (req, res, next) => {
  try {
    const reels = Array.from(reelsStore.values()).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json({
      success: true,
      count: reels.length,
      reels
    });
  } catch (error) {
    next(error);
  }
};

export const getReelById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reel = reelsStore.get(id);

    if (!reel) {
      return res.status(404).json({
        success: false,
        error: `Reel with ID ${id} not found`
      });
    }

    res.json({
      success: true,
      reel
    });
  } catch (error) {
    next(error);
  }
};

export const downloadReel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reel = reelsStore.get(id);

    if (!reel || !reel.videoPath || !fs.existsSync(reel.videoPath)) {
      return res.status(404).json({
        success: false,
        error: 'Video file not ready or not found'
      });
    }

    res.download(reel.videoPath, `${reel.id}.mp4`);
  } catch (error) {
    next(error);
  }
};
