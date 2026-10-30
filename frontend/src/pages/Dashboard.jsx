import React, { useEffect, useState } from 'react';
import { checkHealth, fetchAllReels } from '../services/api';
import VideoStudio from '../components/VideoStudio';
import ScriptGenerator from '../components/ScriptGenerator';
import { 
  Film, 
  CheckCircle, 
  Layers, 
  Server, 
  Cpu, 
  Sparkles,
  FileText,
  BarChart3,
  Video
} from 'lucide-react';

export default function Dashboard() {
  const [healthData, setHealthData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('video');
  const [reelsList, setReelsList] = useState([]);

  useEffect(() => {
    checkHealth().then(res => {
      setIsConnected(res.connected);
      if (res.connected) setHealthData(res.data);
    });
    fetchAllReels().then(list => setReelsList(list));
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Instagram Auto-Reel Studio
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Autonomous multi-mode engine for 9:16 vertical video generation and captioning.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('video')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'video'
                ? 'bg-fuchsia-600 text-white shadow-sm shadow-fuchsia-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            Video Studio
          </button>
          <button
            onClick={() => setActiveTab('script')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'script'
                ? 'bg-fuchsia-600 text-white shadow-sm shadow-fuchsia-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Script Studio
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-fuchsia-600 text-white shadow-sm shadow-fuchsia-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Overview
          </button>
        </div>
      </div>

      {activeTab === 'video' && <VideoStudio />}
      {activeTab === 'script' && <ScriptGenerator />}

      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Reels</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Film className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 text-2xl font-bold text-white">{reelsList.length}</div>
              <p className="text-xs text-slate-500 mt-1">Rendered on this machine</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Generation Modes</span>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 text-2xl font-bold text-blue-400">3</div>
              <p className="text-xs text-slate-500 mt-1">Stock, AI, and Hybrid</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Video Engine</span>
                <div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 text-fuchsia-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 text-xl font-bold text-fuchsia-400">FFmpeg 1080x1920</div>
              <p className="text-xs text-slate-500 mt-1">Native 9:16 portrait</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Captions</span>
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 text-xl font-bold text-amber-400">Hinglish / ASS</div>
              <p className="text-xs text-slate-500 mt-1">Burned-in typography</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  Multi-Mode Architecture Overview
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Decoupled provider abstraction for stock, AI, and hybrid composition
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <div className="text-xs font-bold text-fuchsia-400 uppercase">1. STOCK Mode</div>
                  <p className="text-xs text-slate-300 mt-1">
                    Searches Pexels vertical footage or renders local canvas, synchronizes voiceover, and adds animated subtitles.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <div className="text-xs font-bold text-indigo-400 uppercase">2. AI_GENERATED Mode</div>
                  <p className="text-xs text-slate-300 mt-1">
                    Provider adapter interface for Replicate, Runway, and Luma. Fails safely when API keys are not configured.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <div className="text-xs font-bold text-emerald-400 uppercase">3. HYBRID Mode</div>
                  <p className="text-xs text-slate-300 mt-1">
                    Blends stock footage, procedural canvas animations, and AI clips when providers are available.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-emerald-400" />
                Backend Status
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <span className="text-slate-400">Connection</span>
                  <span className={isConnected ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                    {isConnected ? 'Backend connected' : 'Backend disconnected'}
                  </span>
                </div>
                {healthData && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                    <span className="text-slate-400">Uptime</span>
                    <span className="font-mono text-slate-300">{Math.floor(healthData.uptime)}s</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
