import React, { useEffect, useState } from 'react';
import { checkHealth } from '../services/api';
import ScriptGenerator from '../components/ScriptGenerator';
import { 
  Film, 
  CheckCircle, 
  AlertTriangle, 
  Layers, 
  Server, 
  Cpu, 
  Sparkles,
  FileText,
  BarChart3
} from 'lucide-react';

export default function Dashboard() {
  const [healthData, setHealthData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('script');

  useEffect(() => {
    checkHealth().then(res => {
      setIsConnected(res.connected);
      if (res.connected) setHealthData(res.data);
    });
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Instagram Auto-Reel Studio
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Autonomous multi-agent orchestration for viral vertical video generation.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
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
            System Overview
          </button>
        </div>
      </div>

      {activeTab === 'script' ? (
        <ScriptGenerator />
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Scripts</span>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 text-2xl font-bold text-white">Active</div>
              <p className="text-xs text-slate-500 mt-1">Ready for scene planning</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Reels</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Film className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 text-2xl font-bold text-emerald-400">0</div>
              <p className="text-xs text-slate-500 mt-1">Pending video engine</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">AI Model</span>
                <div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 text-fuchsia-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 text-xl font-bold text-fuchsia-400">Claude 3.5 Sonnet</div>
              <p className="text-xs text-slate-500 mt-1">Official Anthropic SDK</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Workflow Nodes</span>
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 text-2xl font-bold text-indigo-400">6</div>
              <p className="text-xs text-slate-500 mt-1">Multi-agent architecture</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-indigo-400" />
                    Multi-Agent Workflow Architecture
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    The 6 autonomous nodes orchestrated via LangGraph.js
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { id: '1', title: 'Content Idea Agent', desc: 'Viral hooks & angles' },
                  { id: '2', title: 'Script Writing Agent', desc: 'Claude structured JSON' },
                  { id: '3', title: 'Scene Planning Agent', desc: 'Visual storyboard' },
                  { id: '4', title: 'Voiceover Agent', desc: 'Neural TTS generation' },
                  { id: '5', title: 'Video Engine', desc: 'FFmpeg 9:16 composition' },
                  { id: '6', title: 'Quality Control', desc: 'Integrity & audio check' }
                ].map(agent => (
                  <div
                    key={agent.id}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                        Node 0{agent.id}
                      </div>
                      <div className="text-sm font-semibold text-slate-200 mt-1">{agent.title}</div>
                    </div>
                    <div className="text-xs text-slate-500 mt-2">{agent.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-emerald-400" />
                Backend Connection
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs">
                  <span className="text-slate-400">Endpoint</span>
                  <span className="font-mono text-slate-200">http://localhost:5000/api/health</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs">
                  <span className="text-slate-400">Connection State</span>
                  <span
                    className={`font-semibold ${
                      isConnected ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isConnected ? 'Backend connected' : 'Backend disconnected'}
                  </span>
                </div>

                {healthData && (
                  <>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs">
                      <span className="text-slate-400">Service</span>
                      <span className="font-medium text-slate-200">{healthData.service}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs">
                      <span className="text-slate-400">Uptime</span>
                      <span className="font-mono text-slate-300">
                        {Math.floor(healthData.uptime)}s
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
