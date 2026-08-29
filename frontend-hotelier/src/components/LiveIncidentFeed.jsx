import React from 'react';
import { Activity, AlertTriangle, Zap, ShieldCheck, Clock, RefreshCw } from 'lucide-react';

export default function LiveIncidentFeed({ events = [] }) {
  const getIcon = (type) => {
    switch (type) {
      case 'crowd_spike':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'hotel_demand_spike':
        return <Zap className="w-4 h-4 text-marigold-400" />;
      case 'weather_alert':
        return <ShieldCheck className="w-4 h-4 text-amber-400" />;
      default:
        return <Activity className="w-4 h-4 text-jodhpur-400" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-base">Live Destination Events</h3>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <p className="text-xs text-slate-400">Streaming real-time alerts from SARATHI WebSocket</p>
        </div>

        <span className="text-xs text-slate-500 font-medium">{events.length} Recorded</span>
      </div>

      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
        {events.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">
            <Activity className="w-6 h-6 mx-auto mb-1 text-slate-600 animate-spin-slow" />
            <span>Listening for city tourism events...</span>
          </div>
        ) : (
          events.map((evt, idx) => {
            const payload = evt.payload || {};
            const isSpike = evt.event_type === 'crowd_spike';

            return (
              <div
                key={evt.event_id || idx}
                className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-xs space-y-1 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-slate-200">
                    {getIcon(evt.event_type)}
                    <span className="truncate">{payload.headline || evt.event_type}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>Just now</span>
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-snug">
                  {payload.message || 'Real-time telemetry event processed.'}
                </p>

                {isSpike && payload.alternative_poi_name && (
                  <div className="text-[10px] text-emerald-400 font-semibold pt-1">
                    ↳ Reroute suggested: {payload.alternative_poi_name}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

