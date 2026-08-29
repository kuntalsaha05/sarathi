import React from 'react';
import { Clock, Navigation, Volume2, ShieldCheck, MapPin, Sparkles, AlertCircle } from 'lucide-react';

export default function RouteTimeline({
  tripPlan,
  onOpenPoiDetails,
  onTriggerSurgeDemo
}) {
  if (!tripPlan || !tripPlan.stops || tripPlan.stops.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-sandstone-200 text-center">
        <MapPin className="w-8 h-8 text-sandstone-400 mx-auto mb-2" />
        <h4 className="font-bold text-slate-800 text-sm">No Itinerary Generated Yet</h4>
        <p className="text-xs text-slate-500 mt-1">Configure your trip parameters and tap "Generate Adaptive Itinerary".</p>
      </div>
    );
  }

  const { stops, total_distance_km, total_travel_minutes } = tripPlan;
  const totalDwellMinutes = stops.reduce((acc, s) => acc + (s.visit_duration_minutes || 0), 0);
  const totalEstimatedCost = stops.reduce((acc, s) => acc + (s.entry_fee_inr || 0), 0);

  return (
    <div className="bg-white rounded-2xl p-5 border border-sandstone-200 shadow-sm space-y-5">
      
      {/* Route Summary Metric Bar */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-base">Optimized Schedule</span>
            <span className="text-xs bg-jodhpur-100 text-jodhpur-800 font-bold px-2 py-0.5 rounded-full">
              {stops.length} Stops
            </span>
          </div>

          <button
            onClick={onTriggerSurgeDemo}
            className="text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-lg transition active:scale-95 flex items-center gap-1"
            title="Simulate a real-time crowd spike to demonstrate dynamic rerouting"
          >
            <Sparkles className="w-3 h-3 text-rose-600" />
            <span>Simulate Crowd Spike</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 bg-sandstone-50 p-3 rounded-xl border border-sandstone-200 text-center">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Distance</span>
            <span className="text-sm font-black text-slate-800">{total_distance_km || 24.8} km</span>
          </div>
          <div className="border-x border-sandstone-200">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Travel Time</span>
            <span className="text-sm font-black text-slate-800">{total_travel_minutes || 80} mins</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Entry</span>
            <span className="text-sm font-black text-jodhpur-700">₹{totalEstimatedCost}</span>
          </div>
        </div>
      </div>

      {/* Timeline Stops */}
      <div className="space-y-3 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-sandstone-200">
        {stops.map((stop, index) => {
          const isSurge = stop.crowd_status === 'Surge' || stop.crowd_status === 'High';
          const isLow = stop.crowd_status === 'Low';

          return (
            <div key={stop.poi_id || index} className="relative pl-10 group">
              
              {/* Timeline Pin */}
              <div className={`absolute left-2.5 top-3 -translate-x-1/2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black shadow-md ${
                isSurge ? 'bg-rose-500 text-white' : (isLow ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-slate-950')
              }`}>
                {index + 1}
              </div>

              {/* Stop Card */}
              <div className="bg-sandstone-50/70 hover:bg-sandstone-100/90 border border-sandstone-200 rounded-xl p-3 transition-all hover:shadow-xs">
                
                {/* Header info */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-black text-slate-900">{stop.name}</span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-sandstone-200/80 text-slate-700">
                        {stop.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                      <span className="flex items-center gap-1 text-jodhpur-700 font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        {stop.eta_arrival} - {stop.eta_departure}
                      </span>
                      <span>•</span>
                      <span>Stay: {stop.visit_duration_minutes}m</span>
                    </div>
                  </div>

                  {/* Crowd & Audio Guide trigger */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSurge ? 'bg-rose-100 text-rose-800' : (isLow ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900')
                    }`}>
                      {stop.crowd_status || 'Normal'}
                    </span>

                    <button
                      onClick={() => onOpenPoiDetails(stop)}
                      className="text-[11px] font-bold text-jodhpur-700 hover:text-jodhpur-900 flex items-center gap-1 hover:underline mt-0.5"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Audio Guide</span>
                    </button>
                  </div>
                </div>

                {/* Transit duration to this stop */}
                {stop.travel_duration_from_prev_minutes && (
                  <div className="mt-2 pt-2 border-t border-sandstone-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-slate-400" />
                      <span>Drive from previous: {stop.travel_duration_from_prev_minutes} mins</span>
                    </span>
                    <span className="font-semibold text-slate-700">
                      {stop.entry_fee_inr ? `Entry: ₹${stop.entry_fee_inr}` : 'Free Entry'}
                    </span>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

