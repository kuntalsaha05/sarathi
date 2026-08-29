import React from 'react';
import { TrendingUp, Users, DollarSign, Activity, AlertCircle, ArrowUpRight } from 'lucide-react';

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
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Current Occupancy</span>
          <div className="p-2 rounded-xl bg-jodhpur-500/10 text-jodhpur-400 border border-jodhpur-500/20">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-white">{occupancy_rate_pct}%</span>
          <span className="text-xs font-semibold text-slate-400">({rooms_booked}/{total_rooms} rooms)</span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>+12% vs last week pace</span>
        </div>
      </div>

      {/* 2. ADR & Dynamic Yield Recommendation */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Dynamic ADR (AI)</span>
          <div className="p-2 rounded-xl bg-marigold-500/10 text-marigold-400 border border-marigold-500/20">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-marigold-400">₹{suggested_adr_inr.toLocaleString()}</span>
          <span className="text-xs text-slate-500 line-through">₹{current_adr_inr.toLocaleString()}</span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-marigold-300 font-semibold">
          <span className="px-1.5 py-0.2 rounded bg-marigold-500/20 text-marigold-300 font-bold">+{adrDiffPct}%</span>
          <span>+₹{potential_rev_gain_inr.toLocaleString()} potential gain</span>
        </div>
      </div>

      {/* 3. RevPAR */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">RevPAR</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-white">₹{revpar_inr.toLocaleString()}</span>
          <span className="text-xs font-semibold text-slate-400">per avail room</span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>Optimal RevPAR ceiling</span>
        </div>
      </div>

      {/* 4. Destination Tourism Influx Index */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Jaipur Influx Index</span>
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-rose-400">{destination_influx_index}</span>
          <span className="text-xs font-semibold text-slate-400">/ 10 (Peak Demand)</span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-rose-300 font-semibold">
          <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
          <span>{active_alerts_count} active crowd/weather warnings</span>
        </div>
      </div>

    </div>
  );
}

