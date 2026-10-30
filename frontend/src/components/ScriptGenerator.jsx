import React, { useState } from 'react';
import { generateScript } from '../services/api';
import {
  Sparkles,
  Clock,
  Globe,
  Palette,
  AlertCircle,
  Check,
  Copy,
  RotateCcw,
  Film,
  Zap,
  Tag,
  Eye,
  Volume2,
  Subtitles,
  KeyRound
} from 'lucide-react';

export default function ScriptGenerator() {
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(30);
  const [language, setLanguage] = useState('English');
  const [style, setStyle] = useState('Educational');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scriptData, setScriptData] = useState(null);
  const [copied, setCopied] = useState(false);

  const sampleTopics = [
    'Facts about Black Holes that will blow your mind',
    '3 Psychological habits of hyper-productive people',
    'Why airplanes don\'t fly in straight lines',
    'The mystery behind the deepest place on Earth'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError({ message: 'Please enter a topic or concept for your reel.' });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await generateScript({
        topic: topic.trim(),
        duration: Number(duration),
        language,
        style
      });

      if (response.success && response.data) {
        setScriptData(response.data);
      } else {
        throw new Error(response.error || 'Failed to generate script');
      }
    } catch (err) {
      setError({
        message: err.message || 'An error occurred during script generation',
        status: err.status,
        details: err.details
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setScriptData(null);
    setError(null);
  };

  const handleCopy = () => {
    if (!scriptData) return;
    navigator.clipboard.writeText(JSON.stringify(scriptData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {!scriptData ? (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">
                  <Sparkles className="w-5 h-5" />
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Claude AI Script Studio
                </h3>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Generate high-retention, scene-by-scene Reel scripts powered by Anthropic Claude.
              </p>
            </div>
            <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Milestone 2
            </span>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Topic or Niche Concept <span className="text-rose-400">*</span>
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., What happens if you fall into a supermassive black hole?"
                rows={3}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500 transition resize-none"
              />

              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Quick ideas:</span>
                {sampleTopics.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTopic(sample)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition"
                  >
                    {sample.length > 32 ? sample.substring(0, 32) + '...' : sample}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  Target Duration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[15, 30, 60].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setDuration(sec)}
                      className={`py-2.5 text-xs font-bold rounded-xl border transition ${
                        duration === sec
                          ? 'bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-300 shadow-sm shadow-fuchsia-500/20'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
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
                  Video Style
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500 transition"
                >
                  <option value="Educational">Educational</option>
                  <option value="Storytelling">Storytelling</option>
                  <option value="Motivational">Motivational</option>
                  <option value="Entertainment">Entertainment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-400" />
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500 transition"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-2">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-rose-200">
                      {error.status === 401 ? 'Anthropic API Key Required' : 'Script Generation Error'}
                    </h4>
                    <p className="text-xs text-rose-300 mt-0.5">{error.message}</p>
                    {error.status === 401 && (
                      <div className="mt-2 text-xs bg-slate-950/60 p-2.5 rounded-lg border border-rose-500/20 text-slate-300">
                        <span className="text-rose-400 font-semibold">How to fix:</span> Open{' '}
                        <code className="text-fuchsia-400">backend/.env</code> and add your key:
                        <pre className="mt-1 font-mono text-[11px] text-slate-200">
                          ANTHROPIC_API_KEY=sk-ant-api03-...
                        </pre>
                      </div>
                    )}
                    {error.details && (
                      <ul className="mt-2 list-disc list-inside text-[11px] text-rose-400/90 space-y-0.5">
                        {Array.isArray(error.details) ? (
                          error.details.map((d, i) => (
                            <li key={i}>{typeof d === 'string' ? d : `${d.field}: ${d.message}`}</li>
                          ))
                        ) : (
                          <li>{JSON.stringify(error.details)}</li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-fuchsia-600 to-rose-600 hover:from-fuchsia-500 hover:to-rose-500 text-white shadow-lg shadow-fuchsia-600/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Claude is crafting viral script & scenes...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Reel Script</span>
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold px-2 py-0.5 rounded-full bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">
                    {scriptData.style}
                  </span>
                  <span className="text-xs uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {scriptData.targetDuration}s Target
                  </span>
                  <span className="text-xs uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {scriptData.language}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
                  {scriptData.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-2 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy JSON'}
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 py-2 rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-xs font-semibold text-fuchsia-300 transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  New Script
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-rose-500/5 to-transparent border border-amber-500/20">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Zap className="w-4 h-4" />
                Opening Hook (First 3 Seconds)
              </div>
              <p className="text-sm font-medium text-slate-200 mt-1 italic">
                "{scriptData.hook}"
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Film className="w-4 h-4 text-indigo-400" />
                Scene Breakdown ({scriptData.scenes.length} Scenes)
              </h4>
              <span className="text-xs text-slate-500">
                Total duration: ~{scriptData.scenes.reduce((acc, s) => acc + (s.duration || 0), 0)}s
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scriptData.scenes.map((scene) => (
                <div
                  key={scene.sceneNumber}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      Scene 0{scene.sceneNumber}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {scene.duration}s
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                        Narration
                      </div>
                      <p className="text-sm text-slate-200 mt-1 font-medium leading-relaxed">
                        {scene.narration}
                      </p>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-blue-400" />
                        Visual Description
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 italic">
                        {scene.visualDescription}
                      </p>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Subtitles className="w-3.5 h-3.5 text-amber-400" />
                        Subtitle Text
                      </div>
                      <p className="text-xs text-amber-300 font-semibold mt-0.5">
                        "{scene.subtitle}"
                      </p>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                        <Tag className="w-3.5 h-3.5 text-fuchsia-400" />
                        Asset Keywords
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {scene.searchKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-400"
                          >
                            #{kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Ending Thought
              </div>
              <p className="text-sm text-slate-200 mt-1 font-medium">{scriptData.ending}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Call to Action
              </div>
              <p className="text-sm text-fuchsia-300 mt-1 font-semibold">{scriptData.callToAction}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
