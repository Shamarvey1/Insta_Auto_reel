import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReel } from '../services/api';
import {
  Sparkles,
  Clock,
  Globe,
  Palette,
  Eye,
  Smartphone,
  AlertCircle
} from 'lucide-react';

export default function CreateReel() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(30);
  const [language, setLanguage] = useState('Hinglish');
  const [style, setStyle] = useState('Educational');
  const [visualStyle, setVisualStyle] = useState('Cinematic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const samplePrompts = [
    'Explain how black holes work in simple Hinglish',
    '3 Mind tricks to stop overthinking and start doing',
    'Why airplanes do not fly in straight lines over the ocean',
    'Ocean ke sabse gehre hisse mein kya hai?'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError({ message: 'Please enter a topic or prompt for your Reel.' });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await createReel({
        topic: topic.trim(),
        duration: Number(duration),
        language,
        style,
        visualStyle,
        aspectRatio: '9:16'
      });

      if (response.success && response.jobId) {
        navigate(`/progress/${response.jobId}`);
      } else {
        throw new Error(response.error || 'Failed to initialize Reel generation');
      }
    } catch (err) {
      setError({
        message: err.message || 'An error occurred while creating the Reel.',
        details: err.details
      });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-6">
        <div className="border-b border-slate-800/80 pb-5">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Create AI Vertical Reel
            </h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Local-first AI generation using Groq LPU, Edge TTS, and FFmpeg composition.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Topic or Prompt <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Explain how black holes work in simple Hinglish."
              rows={3}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition resize-none"
            />

            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-slate-500 font-medium">Try these:</span>
              {samplePrompts.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTopic(sample)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition cursor-pointer"
                >
                  {sample.length > 38 ? sample.substring(0, 38) + '...' : sample}
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
              <div className="grid grid-cols-2 gap-1.5">
                {[15, 30, 45, 60].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setDuration(sec)}
                    className={`py-2 text-xs font-bold rounded-lg border transition cursor-pointer ${
                      duration === sec
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
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
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition"
              >
                <option value="Hinglish">Hinglish (Hindi + English)</option>
                <option value="Hindi">Hindi (Pure)</option>
                <option value="English">English</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-400" />
                Narrative Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition"
              >
                <option value="Educational">Educational</option>
                <option value="Documentary">Documentary</option>
                <option value="Cinematic">Cinematic</option>
                <option value="Storytelling">Storytelling</option>
                <option value="Motivation">Motivation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                Visual Style
              </label>
              <select
                value={visualStyle}
                onChange={(e) => setVisualStyle(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition"
              >
                <option value="Cinematic">Cinematic</option>
                <option value="Realistic">Realistic Photo</option>
                <option value="3D">3D Render</option>
                <option value="Anime">Anime Aesthetic</option>
              </select>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-400" />
              Target Output Format
            </span>
            <span className="font-mono font-bold text-slate-200">9:16 Vertical Portrait (1080 x 1920)</span>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-1">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                Failed to Create Reel
              </div>
              <p className="text-xs text-rose-300">{error.message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="w-full py-4 px-6 rounded-xl font-extrabold text-sm bg-gradient-to-r from-amber-500 via-rose-600 to-fuchsia-600 hover:opacity-95 text-slate-950 shadow-lg shadow-amber-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></span>
                <span>Initializing workflow job...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Reel</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
