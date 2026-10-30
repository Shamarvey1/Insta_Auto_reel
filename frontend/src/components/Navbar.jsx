import React from 'react';
import { Sparkles, Video, Bot } from 'lucide-react';
import StatusIndicator from './StatusIndicator';

export default function Navbar() {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-fuchsia-600 via-rose-500 to-amber-400 p-0.5 shadow-lg shadow-fuchsia-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-fuchsia-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base sm:text-lg text-white tracking-tight">
                InstaAuto<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-rose-400">Reel</span>
              </h1>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20">
                Agentic MVP
              </span>
            </div>
            <p className="text-xs text-slate-400">Autonomous Video Creation Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <StatusIndicator />
        </div>
      </div>
    </header>
  );
}

