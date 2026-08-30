import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Zap,
  ShieldCheck,
  Clock,
  Sparkles,
  Filter,
  CheckCircle2
} from 'lucide-react';

export default function LiveIncidentFeed({ events = [], onOpenSimulate }) {
  const [filterType, setFilterType] = useState('ALL');

  const getIcon = (type) => {
    switch (type) {
      case 'crowd_spike':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'hotel_demand_spike':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'weather_alert':
        return <ShieldCheck className="w-4 h-4 text-jodhpur-600" />;
      default:
        return <Activity className="w-4 h-4 text-jodhpur-600" />;
    }
  };

  const filteredEvents = events.filter(e => {
    if (filterType === 'ALL') return true;
    return e.event_type === filterType;
  });

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-950 text-base">Live Destination Incident Telemetry</h3>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <p className="text-xs text-slate-500 font-medium">Streaming real-time alerts from SARATHI WebSocket telemetry engine</p>
        </div>

        <button
          onClick={onOpenSimulate}
          className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 font-bold px-3 py-1.5 rounded-xl text-xs transition self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Simulate Surge</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 text-[11px] font-bold overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'ALL', label: 'All Events' },
          { id: 'crowd_spike', label: 'Crowd Surges' },
          { id: 'hotel_demand_spike', label: 'Demand Spikes' },
          { id: 'weather_alert', label: 'Weather Advisories' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
              filterType === tab.id
                ? 'bg-slate-950 text-white font-black shadow-2xs'
                : 'bg-slate-100/80 text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Events Stream List */}
      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs space-y-2">
            <Activity className="w-7 h-7 mx-auto text-slate-300 animate-pulse" />
            <p className="font-semibold text-slate-500">Listening on WebSocket (`/realtime/ws`)...</p>
            <p className="text-[11px]">Click "Simulate Surge" above to generate synthetic crowd surges & weather alerts.</p>
          </div>
        ) : (
          filteredEvents.map((evt, idx) => {
            const payload = evt.payload || {};
            const isSpike = evt.event_type === 'crowd_spike';

            return (
              <div
                key={evt.event_id || idx}
                className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3.5 text-xs space-y-1.5 hover:border-slate-300 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-extrabold text-slate-900">
                    {getIcon(evt.event_type)}
                    <span className="truncate max-w-[200px] sm:max-w-[280px]">
                      {payload.headline || evt.event_type}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>Just now</span>
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 leading-snug font-medium">
                  {payload.message || 'Real-time telemetry event processed across destination nodes.'}
                </p>

                {isSpike && payload.alternative_poi_name && (
                  <div className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200/60 w-fit">
                    ↳ Reroute suggested: <strong>{payload.alternative_poi_name}</strong> (-{payload.reroute_benefit_mins || 40} mins queue)
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
