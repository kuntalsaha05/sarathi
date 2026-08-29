import React from 'react';
import { AlertTriangle, Zap, RefreshCw, X, ShieldAlert, Sparkles } from 'lucide-react';

export default function LiveAlertBanner({ activeAlert, onDismiss, onApplyReroute, isRerouting }) {
  if (!activeAlert) return null;

  const isSpike = activeAlert.event_type === 'crowd_spike';
  const payload = activeAlert.payload || {};

  return (
    <div className="bg-gradient-to-r from-rose-900/90 via-slate-900 to-amber-950 border-y border-rose-500/30 text-white px-4 py-3 shadow-xl backdrop-blur transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        
        {/* Alert Description */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 mt-0.5 sm:mt-0 flex-shrink-0 animate-pulse">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-500 text-slate-950">
                Live Alert
              </span>
              <h4 className="font-bold text-sm sm:text-base text-rose-100">
                {payload.headline || 'Real-Time Crowd Warning'}
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              {payload.message || 'Footfall levels are currently peaking on your planned route.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
          {isSpike && payload.alternative_poi_name && (
            <button
              onClick={() => onApplyReroute(activeAlert)}
              disabled={isRerouting}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs sm:text-sm shadow-md shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {isRerouting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Rerouting...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
                  <span>Reroute to {payload.alternative_poi_name}</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={onDismiss}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
            title="Dismiss Alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

