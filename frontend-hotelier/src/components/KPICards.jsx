import React from 'react';
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  ArrowUpRight,
  Sparkles,
  Building2
} from 'lucide-react';

export default function KPICards({ kpis = {}, property = {} }) {
  const {
    occupancy_rate_pct = 78,
    rooms_booked = 31,
    total_rooms = 40,
    current_adr_inr = 5400,
    suggested_adr_inr = 6372,
    potential_rev_gain_inr = 30140,
    revpar_inr = 4212,
    destination_influx_index = 8.4,
    active_alerts_count = 3
  } = kpis;

  const adrDiffPct = Math.round(((suggested_adr_inr - current_adr_inr) / current_adr_inr) * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* 1. Property Occupancy */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all hover:shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Live Occupancy</span>
          <div className="p-2 rounded-xl bg-jodhpur-50 text-jodhpur-700 border border-jodhpur-200/60">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-950">{occupancy_rate_pct}%</span>
            <span className="text-xs font-bold text-slate-400">({rooms_booked}/{total_rooms} rooms)</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-jodhpur-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${occupancy_rate_pct}%` }}
            ></div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg w-fit">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>+12% vs last week pace</span>
        </div>
      </div>

      {/* 2. ADR & Dynamic Yield Recommendation */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all hover:shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Dynamic ADR (AI)</span>
          <div className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/60">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-700">₹{suggested_adr_inr.toLocaleString()}</span>
            <span className="text-xs text-slate-400 line-through font-semibold">₹{current_adr_inr.toLocaleString()}</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (suggested_adr_inr / 10000) * 100)}%` }}
            ></div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-amber-900 font-bold bg-amber-50 px-2 py-0.5 rounded-lg w-fit border border-amber-200/60">
          <span className="bg-amber-200/80 px-1 py-0.2 rounded font-black text-[10px]">+{adrDiffPct}%</span>
          <span>+₹{potential_rev_gain_inr.toLocaleString()} gain</span>
        </div>
      </div>

      {/* 3. RevPAR */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all hover:shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Revenue Per Room</span>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-950">₹{revpar_inr.toLocaleString()}</span>
            <span className="text-xs font-bold text-slate-400">RevPAR</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: '82%' }}
            ></div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg w-fit">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Optimal revenue threshold</span>
        </div>
      </div>

      {/* 4. Destination Tourism Influx Index */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all hover:shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Destination Influx Index</span>
          <div className="p-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200/60">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600">{destination_influx_index}</span>
            <span className="text-xs font-bold text-slate-400">/ 10 (Peak Demand)</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-rose-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${destination_influx_index * 10}%` }}
            ></div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-rose-800 font-bold bg-rose-50 px-2 py-0.5 rounded-lg w-fit border border-rose-200/60">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
          <span>{active_alerts_count} active corridor alerts</span>
        </div>
      </div>

    </div>
  );
}
