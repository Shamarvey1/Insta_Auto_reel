import path from 'path';
import { fetchStockFootageForScene } from './stockMediaService.js';
import { generateAIVideoClip, getAIVideoProvider, UnavailableVideoProvider } from './aiVideoService.js';

export const selectMediaForScenes = async ({ mode = 'STOCK', scenes = [], baseOutputDir }) => {
  const normalizedMode = mode.toUpperCase();
  const mediaResults = [];

  if (normalizedMode === 'AI_GENERATED') {
    const provider = getAIVideoProvider();
    if (provider instanceof UnavailableVideoProvider) {
      const error = new Error('AI_GENERATED mode is selected, but no AI video provider is configured in backend/.env.');
      error.statusCode = 503;
      error.details = {
        mode: 'AI_GENERATED',
        resolution: 'Set AI_VIDEO_PROVIDER and AI_VIDEO_API_KEY in backend/.env, or select STOCK mode.'
      };
      throw error;
    }
  }

  for (const scene of scenes) {
    const targetPath = path.join(baseOutputDir, `scene_${scene.sceneNumber}_raw.mp4`);

    if (normalizedMode === 'STOCK') {
      const stockResult = await fetchStockFootageForScene({
        keywords: scene.searchKeywords || [],
        duration: scene.duration || 5,
        targetPath,
        sceneNumber: scene.sceneNumber
      });
      mediaResults.push({
        sceneNumber: scene.sceneNumber,
        videoPath: stockResult.videoPath,
        attribution: stockResult.attribution,
        sourceMode: 'STOCK'
      });
    } else if (normalizedMode === 'AI_GENERATED') {
      const aiResult = await generateAIVideoClip({
        prompt: scene.visualDescription,
        duration: scene.duration || 5,
        targetPath
      });
      mediaResults.push({
        sceneNumber: scene.sceneNumber,
        videoPath: aiResult.videoPath || targetPath,
        attribution: { source: 'AI Generated', provider: aiResult.provider },
        sourceMode: 'AI_GENERATED'
      });
    } else if (normalizedMode === 'HYBRID') {
      const provider = getAIVideoProvider();
      const hasAI = !(provider instanceof UnavailableVideoProvider);

      if (hasAI && scene.sceneNumber === 1) {
        const aiResult = await generateAIVideoClip({
          prompt: scene.visualDescription,
          duration: scene.duration || 5,
          targetPath
        });
        mediaResults.push({
          sceneNumber: scene.sceneNumber,
          videoPath: aiResult.videoPath || targetPath,
          attribution: { source: 'AI Generated', provider: aiResult.provider },
          sourceMode: 'AI_GENERATED'
        });
      } else {
        const stockResult = await fetchStockFootageForScene({
          keywords: scene.searchKeywords || [],
          duration: scene.duration || 5,
          targetPath,
          sceneNumber: scene.sceneNumber
        });
        mediaResults.push({
          sceneNumber: scene.sceneNumber,
          videoPath: stockResult.videoPath,
          attribution: stockResult.attribution,
          sourceMode: 'STOCK_HYBRID'
        });
      }
    } else {
      throw new Error(`Unsupported video generation mode: ${mode}`);
    }
  }

  return mediaResults;
};

