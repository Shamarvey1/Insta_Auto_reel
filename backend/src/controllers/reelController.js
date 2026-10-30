import fs from 'fs';
import path from 'path';
import { createJob, updateJob, jobsStore } from './jobController.js';
import { config } from '../config/env.js';

export const reelsStore = new Map();

export const generateReel = async (req, res, next) => {
  try {
    const { topic, duration, language, style, visualStyle, aspectRatio } = req.validatedBody;
    const reelId = `reel_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const job = createJob('REEL_GENERATION', {
      reelId,
      topic,
      duration,
      language,
      style,
      visualStyle,
      aspectRatio
    });

    const initialRecord = {
      id: reelId,
      jobId: job.id,
      topic,
      duration,
      language,
      style,
      visualStyle,
      aspectRatio,
      status: 'PENDING',
      stage: 'QUEUED',
      progress: 0,
      videoPath: null,
      videoUrl: null,
      script: null,
      scenes: [],
      error: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    reelsStore.set(reelId, initialRecord);

    res.status(202).json({
      success: true,
      message: 'Reel generation job created',
      reelId,
      jobId: job.id,
      data: initialRecord
    });
  } catch (err) {
    next(err);
  }
};

export const getReels = async (req, res, next) => {
  try {
    const list = Array.from(reelsStore.values()).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (err) {
    next(err);
  }
};

export const getReelById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reel = reelsStore.get(id);
    if (!reel) {
      return res.status(404).json({ success: false, error: `Reel ${id} not found` });
    }
    res.json({
      success: true,
      data: reel
    });
  } catch (err) {
    next(err);
  }
};

export const getReelStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reel = reelsStore.get(id);
    if (!reel) {
      return res.status(404).json({ success: false, error: `Reel ${id} not found` });
    }
    const job = reel.jobId ? jobsStore.get(reel.jobId) : null;
    res.json({
      success: true,
      reelId: id,
      status: reel.status,
      stage: job?.stage || reel.stage,
      progress: job?.progress || reel.progress,
      error: reel.error || job?.error || null,
      updatedAt: reel.updatedAt
    });
  } catch (err) {
    next(err);
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
  } catch (err) {
    next(err);
  }
};
