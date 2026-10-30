import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateReelScript } from '../services/scriptService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const reelsStore = new Map();

export const generateScriptOnly = async (req, res, next) => {
  try {
    const { topic, duration, language, style } = req.validatedBody;
    const script = await generateReelScript({ topic, duration, language, style });

    res.json({
      success: true,
      data: script
    });
  } catch (error) {
    next(error);
  }
};

export const generateReel = async (req, res, next) => {
  try {
    const { topic, duration, language, style, count } = req.validatedBody;
    const reelId = `reel_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    const initialRecord = {
      id: reelId,
      topic,
      duration,
      language,
      style,
      count,
      status: 'queued',
      stage: 'initiating',
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      script: null,
      scenes: [],
      audioPath: null,
      videoPath: null,
      error: null
    };

    reelsStore.set(reelId, initialRecord);

    res.status(202).json({
      success: true,
      message: 'Reel generation job initiated',
      reelId,
      status: 'queued'
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
      stage: reel.stage,
      progress: reel.progress,
      updatedAt: reel.updatedAt,
      error: reel.error
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

    res.download(reel.videoPath, `reel_${id}.mp4`);
  } catch (error) {
    next(error);
  }
};
