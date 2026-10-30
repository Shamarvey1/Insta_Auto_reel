import fs from 'fs';
import path from 'path';

const formatAssTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const centisecs = Math.floor((seconds % 1) * 100);

  const pad = (n, len = 2) => String(n).padStart(len, '0');
  return `${hrs}:${pad(mins)}:${pad(secs)}.${pad(centisecs, 2)}`;
};

const getStyleConfig = (styleName = 'Bold Pop Yellow') => {
  switch (styleName) {
    case 'Cyber Neon Green':
      return {
        primaryColor: '&H0000FF00',
        outlineColor: '&H00000000',
        backColor: '&H80000000',
        fontSize: 70,
        outline: 4,
        shadow: 2
      };
    case 'Classic Minimalist White':
      return {
        primaryColor: '&H00FFFFFF',
        outlineColor: '&H00000000',
        backColor: '&H80000000',
        fontSize: 64,
        outline: 3,
        shadow: 1
      };
    case 'Boxed Caption':
      return {
        primaryColor: '&H00FFFFFF',
        outlineColor: '&H00000000',
        backColor: '&H00000000',
        fontSize: 62,
        outline: 5,
        shadow: 0
      };
    case 'Bold Pop Yellow':
    default:
      return {
        primaryColor: '&H0000FFFF',
        outlineColor: '&H00000000',
        backColor: '&H80000000',
        fontSize: 74,
        outline: 4,
        shadow: 2
      };
  }
};

export const generateAssSubtitles = ({ scenes = [], sceneDurations = [], subtitleStyle = 'Bold Pop Yellow', outputPath }) => {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const style = getStyleConfig(subtitleStyle);

  const header = `[Script Info]
Title: Auto-Reel Subtitles
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: ReelStyle,Arial Black,${style.fontSize},${style.primaryColor},&H000000FF,${style.outlineColor},${style.backColor},-1,0,0,0,100,100,0,0,1,${style.outline},${style.shadow},2,80,80,480,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  let currentTime = 0;
  const dialogLines = [];

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const duration = sceneDurations[i] || scene.duration || 5;
    const startTime = currentTime;
    const endTime = currentTime + duration;

    const text = (scene.subtitle || scene.narration || '').replace(/[\r\n]+/g, ' ').trim();
    const cleanText = text.replace(/[{}]/g, '');

    dialogLines.push(
      `Dialogue: 0,${formatAssTime(startTime)},${formatAssTime(endTime)},ReelStyle,,0,0,0,,${cleanText.toUpperCase()}`
    );

    currentTime = endTime;
  }

  const fullContent = header + dialogLines.join('\n') + '\n';
  fs.writeFileSync(outputPath, fullContent, 'utf-8');
  return { subtitlePath: outputPath, totalDuration: currentTime };
};

