import axios from 'axios';
import { config } from '../config/env.js';

export const getProvidersStatus = async (req, res) => {
  let comfyReachable = false;
  let comfyModels = [];

  try {
    const checkRes = await axios.get(`${config.comfyui.baseUrl}/system_stats`, { timeout: 1500 });
    comfyReachable = checkRes.status === 200;
  } catch {
    comfyReachable = false;
  }

  res.json({
    success: true,
    data: {
      comfyui: {
        url: config.comfyui.baseUrl,
        connected: comfyReachable,
        status: comfyReachable ? 'RUNNING' : 'OFFLINE'
      },
      hardware: {
        architecture: 'arm64 (Apple Silicon)',
        totalMemory: '8 GB Unified Memory',
        diskAvailable: '134 GB',
        videoModelFeasibility: 'LIMITED_BY_RAM (8GB unified memory may cause high swap with full 14B/SVD models; Mode A Image Animation recommended)'
      },
      modes: {
        modeA_imageAnimation: {
          name: 'AI-Generated Image Animation',
          description: 'Generates original AI image and animates via FFmpeg pan/zoom/cinematic effects',
          available: true
        },
        modeB_videoGeneration: {
          name: 'AI-Generated Video Clip',
          description: 'Direct text-to-video / image-to-video generation through local ComfyUI',
          available: comfyReachable,
          note: comfyReachable ? 'ComfyUI is online' : 'ComfyUI is not currently running on 127.0.0.1:8188'
        }
      }
    }
  });
};

export const getComfyUIModels = async (req, res) => {
  try {
    const modelsRes = await axios.get(`${config.comfyui.baseUrl}/object_info`, { timeout: 2000 });
    res.json({
      success: true,
      data: modelsRes.data
    });
  } catch (err) {
    res.json({
      success: false,
      connected: false,
      error: 'ComfyUI is not reachable at ' + config.comfyui.baseUrl,
      models: []
    });
  }
};

export const generateImage = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }
    res.json({
      success: true,
      message: 'Local image generation request registered',
      prompt
    });
  } catch (err) {
    next(err);
  }
};

export const generateVideo = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }
    res.json({
      success: true,
      message: 'Local video generation request registered',
      prompt
    });
  } catch (err) {
    next(err);
  }
};
