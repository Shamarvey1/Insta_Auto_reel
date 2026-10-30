import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchReelById } from '../services/api';
import {
  Download,
  RotateCcw,
  Film,
  FileText,
  Subtitles,
  Clock,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function Preview() {
  const { id } = useParams();
  const [reel, setReel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('scenes');

  useEffect(() => {
    fetchReelById(id).then(data => {
      setReel(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <span className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin inline-block"></span>
        <p className="text-xs text-slate-400">Loading Reel details...</p>
      </div>
    );
  }

  if (!reel) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Reel Not Found</h3>
        <p className="text-xs text-slate-400">The requested Reel does not exist.</p>
        <Link
          to="/"
          className="inline-block px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-white"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const videoHost = 'http://localhost:5000';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {reel.language}
            </span>
            <span className="text-xs uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {reel.duration}s Target
            </span>
            <span className="text-xs uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {reel.style}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-2">
            {reel.title || reel.topic}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {reel.videoUrl && (
            <a
              href={`${videoHost}/api/reels/${reel.id}/download`}
              download
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:opacity-95 text-slate-950 text-xs font-black tracking-wider uppercase shadow-md shadow-amber-500/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download MP4
            </a>
          )}
          <Link
            to="/create"
            className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New Reel
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-[320px] rounded-2xl overflow-hidden border-2 border-slate-700 bg-black shadow-2xl shadow-amber-950/20 aspect-[9/16] flex items-center justify-center relative">
            {reel.videoUrl ? (
              <video
                src={`${videoHost}${reel.videoUrl}`}
                controls
                playsInline
                className="w-full h-full object-cover bg-black"
              >
                Your browser does not support video playback.
              </video>
            ) : (
              <div className="text-center p-6 space-y-3">
                <Film className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400 font-medium">
                  Video render queued / pending local generation.
                </p>
                <div className="text-[11px] font-mono text-amber-400">
                  Status: {reel.status}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('scenes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'scenes'
                  ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Scene Breakdown
            </button>
            <button
              onClick={() => setActiveTab('script')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'script'
                  ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Full Script
            </button>
            <button
              onClick={() => setActiveTab('captions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'captions'
                  ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Subtitles className="w-3.5 h-3.5" />
              Captions
            </button>
          </div>

          {activeTab === 'scenes' && (
            <div className="space-y-3">
              {(reel.script?.scenes || reel.scenes || []).length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 rounded-xl bg-slate-950/40 border border-slate-800">
                  Scenes will appear as the workflow progresses.
                </div>
              ) : (
                (reel.script?.scenes || reel.scenes).map((scene) => (
                  <div
                    key={scene.sceneNumber}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400">
                        Scene 0{scene.sceneNumber}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {scene.duration}s
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-500 block">Narration</span>
                      <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">{scene.narration}</p>
                    </div>

                    {scene.visualPrompt && (
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-500 block">Visual Prompt</span>
                        <p className="text-xs text-slate-400 mt-0.5 italic">{scene.visualPrompt}</p>
                      </div>
                    )}

                    {scene.subtitle && (
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-500 block">Subtitle</span>
                        <p className="text-xs text-amber-300 font-semibold mt-0.5">{scene.subtitle}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'script' && (
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
              {reel.script?.hook && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <span className="text-[10px] font-bold uppercase text-amber-400 block">Hook</span>
                  <p className="text-xs font-semibold text-slate-200 mt-1 italic">"{reel.script.hook}"</p>
                </div>
              )}

              {reel.script?.ending && (
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Ending Thought</span>
                  <p className="text-xs text-slate-300 mt-1">{reel.script.ending}</p>
                </div>
              )}

              {reel.script?.callToAction && (
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Call to Action</span>
                  <p className="text-xs text-amber-400 font-bold mt-1">{reel.script.callToAction}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'captions' && (
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              {(reel.script?.scenes || reel.scenes || []).map((scene) => (
                <div
                  key={scene.sceneNumber}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between text-xs"
                >
                  <span className="font-mono text-slate-500">Scene {scene.sceneNumber}</span>
                  <span className="font-bold text-amber-300 uppercase">"{scene.subtitle || scene.narration}"</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
