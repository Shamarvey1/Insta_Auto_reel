import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchReels, fetchProvidersStatus } from '../services/api';
import {
  Film,
  PlusCircle,
  Cpu,
  Layers,
  ArrowRight,
  HardDrive,
  Activity,
  Zap,
  Play,
  Volume2
} from 'lucide-react';

export default function Dashboard() {
  const [reels, setReels] = useState([]);
  const [providerStatus, setProviderStatus] = useState(null);

  useEffect(() => {
    fetchReels().then(list => setReels(list));
    fetchProvidersStatus().then(status => setProviderStatus(status));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI-Only Local-First Reel Studio
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Cost-conscious vertical Instagram Reel generation powered by Groq, Edge TTS, and FFmpeg.
          </p>
        </div>

        <Link
          to="/create"
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:opacity-95 text-slate-950 font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 shadow-lg shadow-amber-500/20 transition self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Create Reel
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Reels</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-white">{reels.length}</div>
          <p className="text-xs text-slate-500 mt-1">Generated locally on device</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">LLM Engine</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-lg font-bold text-rose-400">Groq LPU</div>
          <p className="text-xs text-slate-500 mt-1">Llama 3.3 70B Versatile</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Narration</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Volume2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-lg font-bold text-emerald-400">Edge TTS</div>
          <p className="text-xs text-slate-500 mt-1">hi-IN-MadhurNeural / Free</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Visual Engine</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-lg font-bold text-indigo-400">
            {providerStatus?.comfyui?.connected ? 'ComfyUI Online' : 'Mode A: FFmpeg Motion'}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {providerStatus?.comfyui?.connected ? 'Local Diffusion' : '1080x1920 Pan & Zoom'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Film className="w-4 h-4 text-amber-400" />
              Recent Projects
            </h3>
            <span className="text-xs text-slate-500">{reels.length} total</span>
          </div>

          {reels.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-800 bg-slate-950/40">
              <p className="text-sm text-slate-400">No reels generated yet.</p>
              <Link
                to="/create"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300"
              >
                Create your first AI Reel <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {reels.map((reel) => (
                <div
                  key={reel.id}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{reel.title || reel.topic}</h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <span>{reel.duration}s</span>
                      <span>•</span>
                      <span>{reel.language}</span>
                      <span>•</span>
                      <span className="text-amber-400">{reel.style}</span>
                    </div>
                  </div>
                  <Link
                    to={`/preview/${reel.id}`}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Preview
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-indigo-400" />
            Hardware & Local AI Feasibility
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between">
              <span className="text-slate-400">Device Hardware</span>
              <span className="font-semibold text-slate-200">Apple Silicon arm64</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between">
              <span className="text-slate-400">Unified Memory</span>
              <span className="font-semibold text-slate-200">8 GB RAM</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between">
              <span className="text-slate-400">ComfyUI (8188)</span>
              <span
                className={`font-semibold ${
                  providerStatus?.comfyui?.connected ? 'text-emerald-400' : 'text-slate-500'
                }`}
              >
                {providerStatus?.comfyui?.connected ? 'Online' : 'Offline (Mode A active)'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-slate-300 space-y-1">
              <div className="text-[11px] font-bold text-amber-400 uppercase">Architecture Note</div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                On 8GB Mac, heavy video diffusion models may swap memory. Mode A (Original AI Image + FFmpeg Motion) runs smoothly without external cost.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
