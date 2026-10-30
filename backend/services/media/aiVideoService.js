import fs from 'fs';
import path from 'path';
import axios from 'axios';

export class BaseVideoProvider {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async generateClip({ prompt, duration, targetPath }) {
    throw new Error('generateClip must be implemented by the provider adapter');
  }

  async getStatus(jobId) {
    throw new Error('getStatus must be implemented by the provider adapter');
  }
}

export class ReplicateVideoProvider extends BaseVideoProvider {
  async generateClip({ prompt, duration, targetPath }) {
    if (!this.apiKey) {
      const error = new Error('Replicate API token is missing. Configure AI_VIDEO_API_KEY in backend/.env');
      error.statusCode = 401;
      throw error;
    }

    const response = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version: 'minimax/video-01',
        input: { prompt, prompt_optimizer: true }
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    const predictionId = response.data?.id;
    if (!predictionId) {
      throw new Error('Failed to initiate Replicate video generation job');
    }

    return { jobId: predictionId, provider: 'replicate', status: 'processing' };
  }
}

export class RunwayVideoProvider extends BaseVideoProvider {
  async generateClip({ prompt, duration, targetPath }) {
    if (!this.apiKey) {
      const error = new Error('Runway API key is missing. Configure AI_VIDEO_API_KEY in backend/.env');
      error.statusCode = 401;
      throw error;
    }

    const error = new Error('Runway Gen-3 Alpha API adapter is registered but requires verified enterprise webhook credentials.');
    error.statusCode = 501;
    throw error;
  }
}

export class LumaVideoProvider extends BaseVideoProvider {
  async generateClip({ prompt, duration, targetPath }) {
    if (!this.apiKey) {
      const error = new Error('Luma Dream Machine API key is missing. Configure AI_VIDEO_API_KEY in backend/.env');
      error.statusCode = 401;
      throw error;
    }

    const error = new Error('Luma Dream Machine API adapter is registered but requires active production subscription.');
    error.statusCode = 501;
    throw error;
  }
}

export class UnavailableVideoProvider extends BaseVideoProvider {
  async generateClip({ prompt, duration, targetPath }) {
    const error = new Error(
      'AI_GENERATED mode is currently unavailable. No active AI Video Provider credentials exist. Please configure AI_VIDEO_PROVIDER (replicate, runway, or luma) and AI_VIDEO_API_KEY in backend/.env, or switch to STOCK or HYBRID mode.'
    );
    error.statusCode = 503;
    error.details = {
      selectedMode: 'AI_GENERATED',
      supportedProviders: ['replicate', 'runway', 'luma'],
      currentStatus: 'Unconfigured'
    };
    throw error;
  }
}

export const getAIVideoProvider = () => {
  const providerName = (process.env.AI_VIDEO_PROVIDER || 'none').toLowerCase().trim();
  const apiKey = process.env.AI_VIDEO_API_KEY?.trim();

  if (!apiKey || providerName === 'none') {
    return new UnavailableVideoProvider();
  }

  switch (providerName) {
    case 'replicate':
      return new ReplicateVideoProvider(apiKey);
    case 'runway':
      return new RunwayVideoProvider(apiKey);
    case 'luma':
      return new LumaVideoProvider(apiKey);
    default:
      return new UnavailableVideoProvider();
  }
};

export const generateAIVideoClip = async ({ prompt, duration, targetPath }) => {
  const provider = getAIVideoProvider();
  return await provider.generateClip({ prompt, duration, targetPath });
};

