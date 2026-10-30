import React, { useState } from 'react';
import { generateReelVideo } from '../services/api';
import {
  Video,
  Film,
  Sparkles,
  Layers,
  Clock,
  Palette,
  Subtitles,
  Download,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Flame,
  Languages
} from 'lucide-react';

export default function VideoStudio() {
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(15);
  const [style, setStyle] = useState('Educational');
  const [mode, setMode] = useState('STOCK');
  const [visualStyle, setVisualStyle] = useState('Cinematic');
  const [isHinglish, setIsHinglish] = useState(false);
  const [subtitleStyle, setSubtitleStyle] = useState('Bold Pop Yellow');
  const [loading, setLoading] = useState(false);
  const [progressStage, setProgressStage] = useState('');
  const [error, setError] = useState(null);
  const [completedReel, setCompletedReel] = useState(null);

  const sampleTopics = [
    'Amazing space facts that sound fake',
    '3 Habits that double your focus',
    'Why the deep ocean is terrifying',
    'How gravity actually bends time'
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError({ message: 'Please enter a topic for your reel.' });
      return;
    }

    setLoading(true);
    setError(null);
    setProgressStage('Crafting script & structured scenes...');

    const stageTimer1 = setTimeout(() => {
      setProgressStage('Synthesizing high-clarity voiceover audio...');
    }, 2500);

    const stageTimer2 = setTimeout(() => {
      setProgressStage(`Retrieving ${mode} vertical footage & B-roll...`);
    }, 6000);

    const stageTimer3 = setTimeout(() => {
      setProgressStage('Composing 1080x1920 MP4 & burning animated captions...');
    }, 11000);

    try {
      const response = await generateReelVideo({
        topic: topic.trim(),
        duration: Number(duration),
        style,
        mode,
        visualStyle,
        isHinglish,
        subtitleStyle
      });

      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);

      if (response.success && response.data) {
        setCompletedReel(response.data);
      } else {
        throw new Error(response.error || 'Failed to render reel');
      }
    } catch (err) {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);
      setError({
        message: err.message || 'An error occurred during video rendering',
        status: err.status,
        details: err.details
      });
    } finally {
      setLoading(false);
      setProgressStage('');
    }
  };

  const handleReset = () => {
    setCompletedReel(null);
    setError(null);
  };

  const videoHost = 'http://localhost:5000';

  return (
    <div className="space-y-6">
      {!completedReel ? (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <Video className="w-5 h-5" />
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Multi-Mode Video Generation Studio
                </h3>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Render 9:16 vertical Instagram Reels with narration, B-roll footage, and subtitles.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                Milestone 4 Engine
              </span>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="mt-6 space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                1. Select Video Generation Mode <span className="text-rose-400">*</span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  {
                    id: 'STOCK',
                    title: 'Stock Footage',
                    badge: 'Recommended',
                    desc: 'Vertical Pexels B-roll clips matched to scene keywords with AI voiceover and captions.',
                    icon: Film,
                    color: 'fuchsia'
                  },
                  {
                    id: 'AI_GENERATED',
                    title: 'AI Generated',
                    badge: 'Provider API',
                    desc: 'Direct AI video generation via configured provider (Replicate, Runway, or Luma).',
                    icon: Sparkles,
                    color: 'indigo'
                  },
                  {
                    id: 'HYBRID',
                    title: 'Hybrid Mode',
                    badge: 'Multi-Source',
                    desc: 'Combines stock footage, procedural canvas animations, and AI clips when available.',
                    icon: Layers,
                    color: 'emerald'
                  }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = mode === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMode(item.id)}
                      className={`p-4 rounded-xl border text-left transition relative flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-fuchsia-500/10 border-fuchsia-500 shadow-md shadow-fuchsia-500/10'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 font-bold text-sm text-white">
                            <Icon className={`w-4 h-4 ${isSelected ? 'text-fuchsia-400' : 'text-slate-400'}`} />
                            {item.title}
                          </div>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              isSelected
                                ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                2. Topic or Concept <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Mind-bending facts about black holes"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500 transition"
              />

              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-500 font-medium">Quick topics:</span>
                {sampleTopics.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTopic(sample)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition cursor-pointer"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  Duration
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[15, 30, 60].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setDuration(sec)}
                      className={`py-2 text-xs font-bold rounded-lg border transition cursor-pointer ${
                        duration === sec
                          ? 'bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-300'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-indigo-400" />
                  Visual Style
                </label>
                <select
                  value={visualStyle}
                  onChange={(e) => setVisualStyle(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition"
                >
                  <option value="Cinematic">Cinematic</option>
                  <option value="Minimalist">Minimalist</option>
                  <option value="Vibrant">Vibrant & Punchy</option>
                  <option value="Moody / Dark">Moody & Dark</option>
                  <option value="Aesthetic">Aesthetic Gradient</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                  <Subtitles className="w-3.5 h-3.5 text-indigo-400" />
                  Subtitle Style
                </label>
                <select
                  value={subtitleStyle}
                  onChange={(e) => setSubtitleStyle(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition"
                >
                  <option value="Bold Pop Yellow">Bold Pop Yellow</option>
                  <option value="Classic Minimalist White">Classic Minimalist White</option>
                  <option value="Cyber Neon Green">Cyber Neon Green</option>
                  <option value="Boxed Caption">Boxed Caption</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-indigo-400" />
                  Hinglish Narration
                </label>
                <button
                  type="button"
                  onClick={() => setIsHinglish(!isHinglish)}
                  className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                    isHinglish
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Hinglish Mode</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isHinglish ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'
                    }`}
                  ></span>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-2">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-rose-200">
                      {error.status === 503 ? 'AI Video Provider Not Configured' : 'Video Generation Failed'}
                    </h4>
                    <p className="text-xs text-rose-300 mt-0.5">{error.message}</p>
                    {error.details?.resolution && (
                      <p className="text-xs text-rose-400 font-medium mt-1">
                        👉 {error.details.resolution}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="w-full py-4 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-fuchsia-600 via-rose-600 to-amber-500 hover:opacity-95 text-white shadow-lg shadow-fuchsia-600/25 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>{progressStage || 'Rendering vertical 9:16 Reel...'}</span>
                </>
              ) : (
                <>
                  <Video className="w-4 h-4" />
                  <span>Generate & Render Full Reel ({mode} Mode)</span>
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Rendered Successfully
                  </span>
                  <span className="text-xs uppercase font-bold px-2 py-0.5 rounded-full bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">
                    {completedReel.mode} Mode
                  </span>
                  <span className="text-xs uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {completedReel.duration}s MP4
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
                  {completedReel.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`${videoHost}${completedReel.downloadUrl}`}
                  download
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-rose-600 hover:from-fuchsia-500 hover:to-rose-500 text-xs font-bold text-white shadow-md shadow-fuchsia-600/20 transition flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download MP4
                </a>
                <button
                  onClick={handleReset}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  New Reel
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-[320px] rounded-2xl overflow-hidden border-2 border-slate-700 bg-black shadow-2xl shadow-fuchsia-950/50">
                  <video
                    src={`${videoHost}${completedReel.videoUrl}`}
                    controls
                    playsInline
                    className="w-full h-auto aspect-[9/16] object-cover bg-black"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Resolution</span>
                    <div className="text-sm font-bold text-white mt-0.5">1080 x 1920 (9:16)</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Duration</span>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5">
                      {completedReel.duration}s
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400">File Size</span>
                    <div className="text-sm font-bold text-indigo-400 mt-0.5">
                      {Math.round(completedReel.sizeBytes / 1024)} KB
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Footage Attribution & Licensing
                  </h4>
                  <div className="space-y-1.5">
                    {completedReel.attributions?.map((attr, idx) => (
                      <div key={idx} className="text-xs text-slate-400 flex items-center justify-between">
                        <span>
                          Scene {idx + 1}: {attr.source} ({attr.photographer || 'Creator'})
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 uppercase">
                          {attr.license || 'Free to use'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {completedReel.script?.hook && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20">
                    <div className="text-xs font-bold uppercase text-amber-400">Opening Hook</div>
                    <p className="text-sm text-slate-200 mt-1 italic">
                      "{completedReel.script.hook}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

