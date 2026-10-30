import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchJobStatus } from '../services/api';
import {
  FileText,
  Layers,
  Image,
  Volume2,
  Subtitles,
  Film,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ArrowRight
} from 'lucide-react';

export default function Progress() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);

  const stages = [
    { key: 'SCRIPT_GENERATION', label: 'Generating script', icon: FileText },
    { key: 'SCENE_PLANNING', label: 'Planning scenes', icon: Layers },
    { key: 'VISUAL_GENERATION', label: 'Generating AI visuals', icon: Image },
    { key: 'AUDIO_GENERATION', label: 'Generating narration', icon: Volume2 },
    { key: 'SUBTITLE_GENERATION', label: 'Creating subtitles', icon: Subtitles },
    { key: 'RENDERING', label: 'Rendering final video', icon: Film }
  ];

  useEffect(() => {
    let interval = null;

    const poll = async () => {
      try {
        const data = await fetchJobStatus(jobId);
        if (data) {
          setJob(data);
          if (data.status === 'COMPLETED' && data.payload?.reelId) {
            navigate(`/preview/${data.payload.reelId}`);
          }
          if (data.status === 'FAILED') {
            setError(data.error || 'Job failed during execution');
          }
        }
      } catch (err) {
        setError(err.message);
      }
    };

    poll();
    interval = setInterval(poll, 2500);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [jobId, navigate]);

  const getCurrentStageIndex = () => {
    if (!job) return 0;
    const stageMap = {
      'QUEUED': 0,
      'INITIALIZING': 0,
      'SCRIPT_GENERATION': 0,
      'SCENE_PLANNING': 1,
      'VISUAL_GENERATION': 2,
      'AUDIO_GENERATION': 3,
      'SUBTITLE_GENERATION': 4,
      'RENDERING': 5,
      'COMPLETED': 6
    };
    return stageMap[job.stage] || 0;
  };

  const currentIndex = getCurrentStageIndex();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400">
            Job ID: {jobId}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Generation Progress
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Topic: <span className="text-slate-200 font-medium">{job?.payload?.topic || 'Loading...'}</span>
          </p>
        </div>

        <div className="space-y-3">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isDone = currentIndex > idx;
            const isCurrent = currentIndex === idx && job?.status !== 'FAILED';

            return (
              <div
                key={stage.key}
                className={`p-4 rounded-xl border transition flex items-center justify-between ${
                  isDone
                    ? 'bg-slate-950/60 border-emerald-500/30 text-emerald-400'
                    : isCurrent
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                    : 'bg-slate-950/30 border-slate-800/50 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : isCurrent
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-slate-800/40 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">
                      Stage {idx + 1}: {stage.label}
                    </span>
                    <span className="text-[11px] opacity-75">
                      {isDone ? 'Completed' : isCurrent ? 'In progress...' : 'Pending'}
                    </span>
                  </div>
                </div>

                <div>
                  {isDone && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  {isCurrent && (
                    <span className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin block"></span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              Generation Error
            </div>
            <p className="text-xs text-rose-300">{error}</p>
            <div className="pt-2">
              <Link
                to="/create"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Try creating another Reel
              </Link>
            </div>
          </div>
        )}

        {job?.payload?.reelId && (
          <div className="pt-2 flex justify-end">
            <Link
              to={`/preview/${job.payload.reelId}`}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition flex items-center gap-1.5"
            >
              View Reel Details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
