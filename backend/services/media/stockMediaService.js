import axios from 'axios';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const downloadFile = async (fileUrl, targetPath) => {
  const writer = fs.createWriteStream(targetPath);
  const response = await axios({
    url: fileUrl,
    method: 'GET',
    responseType: 'stream',
    timeout: 30000
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

const synthesizeVerticalFootage = ({ duration, targetPath, sceneNumber = 1 }) => {
  return new Promise((resolve, reject) => {
    const colors = [
      '0x0f172a',
      '0x1e1b4b',
      '0x311042',
      '0x172554',
      '0x022c22'
    ];
    const pickedColor = colors[(sceneNumber - 1) % colors.length];

    ffmpeg()
      .input(`color=c=${pickedColor}:s=1080x1920:d=${Math.ceil(duration) + 1}`)
      .inputFormat('lavfi')
      .videoCodec('libx264')
      .outputOptions(['-pix_fmt yuv420p', `-t ${duration}`])
      .save(targetPath)
      .on('end', () => resolve({
        videoPath: targetPath,
        attribution: {
          source: 'Engine Procedural Vertical Canvas',
          photographer: 'Auto-Reel Studio',
          license: 'Generated Locally'
        }
      }))
      .on('error', (err) => reject(err));
  });
};

export const fetchStockFootageForScene = async ({ keywords = [], duration = 5, targetPath, sceneNumber = 1 }) => {
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const apiKey = process.env.PEXELS_API_KEY?.trim();
  const searchQuery = keywords.length > 0 ? keywords.slice(0, 2).join(' ') : 'cinematic vertical';

  if (!apiKey) {
    return await synthesizeVerticalFootage({ duration, targetPath, sceneNumber });
  }

  try {
    const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(searchQuery)}&orientation=portrait&per_page=5`;
    const res = await axios.get(url, {
      headers: { Authorization: apiKey },
      timeout: 10000
    });

    const videos = res.data?.videos || [];
    if (videos.length === 0) {
      return await synthesizeVerticalFootage({ duration, targetPath, sceneNumber });
    }

    const selectedVideo = videos[Math.floor(Math.random() * videos.length)];
    const verticalFile = selectedVideo.video_files?.find(f => f.width && f.height && f.height >= f.width) || selectedVideo.video_files?.[0];

    if (!verticalFile || !verticalFile.link) {
      return await synthesizeVerticalFootage({ duration, targetPath, sceneNumber });
    }

    await downloadFile(verticalFile.link, targetPath);

    return {
      videoPath: targetPath,
      attribution: {
        source: 'Pexels',
        id: selectedVideo.id,
        url: selectedVideo.url,
        photographer: selectedVideo.user?.name || 'Pexels Creator',
        photographerUrl: selectedVideo.user?.url || 'https://www.pexels.com',
        license: 'Free to use under Pexels License'
      }
    };
  } catch (error) {
    return await synthesizeVerticalFootage({ duration, targetPath, sceneNumber });
  }
};

