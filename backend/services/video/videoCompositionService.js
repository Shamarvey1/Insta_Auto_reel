import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import { generateAssSubtitles } from './subtitleService.js';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

const prepareSegment = ({ videoPath, duration, outputPath }) => {
  return new Promise((resolve, reject) => {
    const vf = 'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,fps=30';

    ffmpeg(videoPath)
      .inputOptions(['-stream_loop -1'])
      .outputOptions([
        '-vf', vf,
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-pix_fmt', 'yuv420p',
        `-t ${duration}`,
        '-an'
      ])
      .save(outputPath)
      .on('end', resolve)
      .on('error', reject);
  });
};

const concatAudioTracks = ({ audioPaths, outputAudioPath }) => {
  return new Promise((resolve, reject) => {
    const listFilePath = outputAudioPath + '.txt';
    const fileContent = audioPaths.map(p => `file '${path.resolve(p)}'`).join('\n');
    fs.writeFileSync(listFilePath, fileContent, 'utf-8');

    ffmpeg()
      .input(listFilePath)
      .inputOptions(['-f', 'concat', '-safe', '0'])
      .outputOptions(['-c:a', 'libmp3lame', '-q:a', '2'])
      .save(outputAudioPath)
      .on('end', () => {
        if (fs.existsSync(listFilePath)) fs.unlinkSync(listFilePath);
        resolve();
      })
      .on('error', (err) => {
        if (fs.existsSync(listFilePath)) fs.unlinkSync(listFilePath);
        reject(err);
      });
  });
};

const concatVideoSegments = ({ segmentPaths, outputVideoPath }) => {
  return new Promise((resolve, reject) => {
    const listFilePath = outputVideoPath + '.txt';
    const fileContent = segmentPaths.map(p => `file '${path.resolve(p)}'`).join('\n');
    fs.writeFileSync(listFilePath, fileContent, 'utf-8');

    ffmpeg()
      .input(listFilePath)
      .inputOptions(['-f', 'concat', '-safe', '0'])
      .outputOptions(['-c', 'copy'])
      .save(outputVideoPath)
      .on('end', () => {
        if (fs.existsSync(listFilePath)) fs.unlinkSync(listFilePath);
        resolve();
      })
      .on('error', (err) => {
        if (fs.existsSync(listFilePath)) fs.unlinkSync(listFilePath);
        reject(err);
      });
  });
};

const mergeVideoAudioAndSubtitles = ({ videoPath, audioPath, subtitlePath, outputPath }) => {
  return new Promise((resolve, reject) => {
    const escapedSubPath = subtitlePath.replace(/\\/g, '/').replace(/:/g, '\\:');
    const vf = `ass='${escapedSubPath}'`;

    ffmpeg()
      .input(videoPath)
      .input(audioPath)
      .outputOptions([
        '-vf', vf,
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-shortest',
        '-movflags', '+faststart',
        '-pix_fmt', 'yuv420p'
      ])
      .save(outputPath)
      .on('end', resolve)
      .on('error', (err) => {
        ffmpeg()
          .input(videoPath)
          .input(audioPath)
          .outputOptions([
            '-c:v', 'copy',
            '-c:a', 'aac',
            '-b:a', '192k',
            '-shortest',
            '-movflags', '+faststart'
          ])
          .save(outputPath)
          .on('end', resolve)
          .on('error', reject);
      });
  });
};

export const renderFullReel = async ({
  scenes = [],
  mediaItems = [],
  audioItems = [],
  subtitleStyle = 'Bold Pop Yellow',
  workDir,
  outputVideoPath
}) => {
  if (!fs.existsSync(workDir)) fs.mkdirSync(workDir, { recursive: true });

  const segmentPaths = [];
  const audioPaths = [];
  const sceneDurations = [];

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const media = mediaItems[i];
    const audio = audioItems[i];

    const duration = audio?.duration || scene.duration || 5;
    sceneDurations.push(duration);
    audioPaths.push(audio.audioPath);

    const segmentPath = path.join(workDir, `segment_${scene.sceneNumber}.mp4`);
    await prepareSegment({
      videoPath: media.videoPath,
      duration,
      outputPath: segmentPath
    });
    segmentPaths.push(segmentPath);
  }

  const rawMasterVideo = path.join(workDir, 'master_video_raw.mp4');
  await concatVideoSegments({ segmentPaths, outputVideoPath: rawMasterVideo });

  const rawMasterAudio = path.join(workDir, 'master_audio_raw.mp3');
  await concatAudioTracks({ audioPaths, outputAudioPath: rawMasterAudio });

  const subPath = path.join(workDir, 'captions.ass');
  generateAssSubtitles({
    scenes,
    sceneDurations,
    subtitleStyle,
    outputPath: subPath
  });

  await mergeVideoAudioAndSubtitles({
    videoPath: rawMasterVideo,
    audioPath: rawMasterAudio,
    subtitlePath: subPath,
    outputPath: outputVideoPath
  });

  const stats = fs.statSync(outputVideoPath);
  const totalDuration = sceneDurations.reduce((a, b) => a + b, 0);

  return {
    videoPath: outputVideoPath,
    duration: Math.round(totalDuration * 10) / 10,
    sizeBytes: stats.size,
    resolution: '1080x1920',
    attributions: mediaItems.map(m => m.attribution)
  };
};

