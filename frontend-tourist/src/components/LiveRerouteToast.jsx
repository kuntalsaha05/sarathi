import React from 'react';
import { AlertTriangle, Zap, RefreshCw, X, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LiveRerouteToast({
  alert,
  onDismiss,
  onApplyReroute,
  isRerouting
}) {
  if (!alert) return null;

  const payload = alert.payload || {};
  const isSpike = alert.event_type === 'crowd_spike';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full p-1 animate-slide-up">
      <div className="bg-slate-950/95 backdrop-blur-xl border border-rose-500/40 text-white rounded-3xl p-5 shadow-2xl space-y-3 relative overflow-hidden">
        
        {/* Glowing Background Accent */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-rose-500/20 rounded-full blur-2xl"></div>

        {/* Header with Close */}
        <div className="flex items-start justify-between gap-3 relative">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500 text-slate-950">
                Live Surge Telemetry
              </span>
              <h4 className="font-extrabold text-sm sm:text-base text-white mt-0.5">
                {payload.headline || 'Heavy Queue at Amber Fort'}
              </h4>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message */}
        <p className="text-xs text-slate-300 leading-relaxed relative">
          {payload.message || 'Footfall has surged by +65%. Estimated wait queue is currently ~55 mins.'}
        </p>

        {/* Comparison Box */}
        {isSpike && payload.alternative_poi_name && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs relative">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Smart Alternative</span>
              <span className="font-extrabold text-emerald-400">{payload.alternative_poi_name}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Time Saved</span>
              <span className="font-extrabold text-amber-400">~{payload.reroute_benefit_mins || 45} mins</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-1 flex items-center justify-end gap-2 relative">
          <button
            onClick={onDismiss}
            className="text-xs font-bold text-slate-400 hover:text-white px-3 py-2 rounded-xl transition"
          >
            Keep Original
          </button>

          {isSpike && payload.alternative_poi_name && (
            <button
              onClick={() => onApplyReroute(alert)}
              disabled={isRerouting}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black px-4 py-2.5 rounded-2xl text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {isRerouting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Rerouting Itinerary...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                  <span>Apply Smart Reroute</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

