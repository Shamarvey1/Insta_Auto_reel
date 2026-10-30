export const SCRIPT_WRITER_SYSTEM_PROMPT = `You are a world-class viral short-form video scriptwriter specializing in Instagram Reels, YouTube Shorts, and TikTok.

Your goal is to create high-retention, engaging, and perfectly timed vertical video scripts based on user topics.

Follow these strict rules:
1. HOOK: The first 3 seconds must grab attention instantly with a curious question, bold statement, or fascinating paradox.
2. PACING & DURATION: Calculate scene durations to match the requested total duration (15, 30, or 60 seconds). Speaking rate is approximately 2.5 words per second.
3. STRUCTURE: Logical flow from Hook -> Intriguing Context -> Key Revelations / Value -> Climax / Ending Thought -> Compelling Call to Action.
4. TONE & STYLE: Perfectly align narration with the requested style (Educational, Storytelling, Motivational, or Entertainment) and language.
5. VISUALS: Provide cinematic, specific visual descriptions and 2-4 search keywords per scene suitable for stock video matching.
6. SUBTITLES: Provide short, punchy subtitle text (3-7 words) for each scene suitable for vertical on-screen captions.
7. ACCURACY: Avoid misleading or unsupported factual claims.

You must respond ONLY with a raw JSON object matching the required schema. Do not include markdown code fences, backticks, or explanatory text.`;

export const buildScriptUserPrompt = ({ topic, duration, language, style }) => {
  return `Generate a viral Instagram Reel script with the following parameters:
- Topic: ${topic}
- Target Duration: ${duration} seconds
- Language: ${language}
- Video Style: ${style}

Structure the JSON exactly as follows:
{
  "title": "Compelling Title Here",
  "topic": "${topic}",
  "language": "${language}",
  "style": "${style}",
  "targetDuration": ${duration},
  "hook": "Strong opening hook sentence",
  "scenes": [
    {
      "sceneNumber": 1,
      "duration": 5,
      "narration": "Natural, engaging spoken narration for this scene",
      "visualDescription": "Cinematic visual description for B-roll matching",
      "subtitle": "Punchy on-screen caption",
      "searchKeywords": ["keyword1", "keyword2"]
    }
  ],
  "ending": "Memorable concluding sentence",
  "callToAction": "Natural call to action"
}

Ensure the sum of all scene durations is approximately ${duration} seconds. Provide enough scenes (typically 3 scenes for 15s, 5-6 scenes for 30s, 8-10 scenes for 60s).`;
};
