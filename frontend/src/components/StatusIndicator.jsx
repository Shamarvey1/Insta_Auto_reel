import React, { useEffect, useState } from 'react';
import { checkHealth } from '../services/api';
import { Activity, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

export default function StatusIndicator() {
  const [status, setStatus] = useState({
    loading: true,
    connected: false,
    data: null,
    error: null
  });

  const fetchStatus = async () => {
    setStatus(prev => ({ ...prev, loading: true }));
    const result = await checkHealth();
    setStatus({
      loading: false,
      connected: result.connected,
      data: result.data || null,
      error: result.error || null
    });
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold tracking-wide transition-all ${
          status.connected
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}
      >
        <span className="relative flex h-2 w-2">
          {status.connected && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              status.connected ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
          ></span>
        </span>

        {status.connected ? (
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Backend connected
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" />
            Backend disconnected
          </span>
        )}
      </div>

      <button
        onClick={fetchStatus}
        disabled={status.loading}
        title="Refresh backend status"
        className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700 transition"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${status.loading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
}

