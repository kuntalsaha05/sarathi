import React, { useState } from 'react';
import {
  DollarSign,
  Zap,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Sliders,
  ShieldCheck,
  Globe2
} from 'lucide-react';

export default function DynamicPricing({ kpis = {}, property = {} }) {
  const [isApplied, setIsApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [customSurgeMultiplier, setCustomSurgeMultiplier] = useState(1.18);

  const baseRate = property.base_adr_inr || kpis.current_adr_inr || 5400;
  const suggestedRate = Math.round(baseRate * customSurgeMultiplier);
  const surgePct = Math.round((customSurgeMultiplier - 1) * 100);
  const gain = Math.round(baseRate * (customSurgeMultiplier - 1) * (property.total_rooms || 40) * 0.85);

  const channels = property.channels || [
    { name: 'Direct Website', share_pct: 35, adr_inr: baseRate, status: 'Synced' },
    { name: 'Booking.com', share_pct: 30, adr_inr: Math.round(baseRate * 1.04), status: 'Synced' },
    { name: 'MakeMyTrip', share_pct: 25, adr_inr: Math.round(baseRate * 1.02), status: 'Synced' },
    { name: 'Agoda / OTA', share_pct: 10, adr_inr: Math.round(baseRate * 1.03), status: 'Synced' }
  ];

  const handleApplyRate = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setIsApplied(true);
      setTimeout(() => setIsApplied(false), 4000);
    }, 700);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-4">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-950 text-base">AI Dynamic Rate Optimizer</h3>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60">
              Yield Management
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">Automated ADR adjustments correlated with regional footfall surges</p>
        </div>

        <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60">
          <Zap className="w-5 h-5" />
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">Standard Published Rate</span>
          <span className="text-2xl font-black text-slate-800">₹{baseRate.toLocaleString()}</span>
          <span className="text-xs text-slate-400 block mt-1 font-medium">Direct / OTA Base</span>
        </div>

        <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/90 relative">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 block mb-1">AI Recommended ADR</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-900">₹{suggestedRate.toLocaleString()}</span>
            <span className="text-xs font-black text-emerald-600 bg-emerald-100 px-1.5 py-0.2 rounded">+{surgePct}%</span>
          </div>
          <span className="text-xs text-amber-800/80 block mt-1 font-medium">Corridor Demand Surge</span>
        </div>

        <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 block mb-1">Projected Influx Gain</span>
          <span className="text-2xl font-black text-emerald-700">+₹{gain.toLocaleString()}</span>
          <span className="text-xs text-emerald-800/80 block mt-1 font-medium">Net incremental revenue</span>
        </div>

      </div>

      {/* Interactive Yield Multiplier Slider */}
      <div className="bg-slate-50/90 p-3.5 rounded-2xl border border-slate-200/70 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-jodhpur-600" />
            <span>Surge Aggressiveness Multiplier</span>
          </span>
          <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-900 font-extrabold">
            +{surgePct}% ({customSurgeMultiplier.toFixed(2)}x)
          </span>
        </div>
        <input
          type="range"
          min="1.0"
          max="1.4"
          step="0.02"
          value={customSurgeMultiplier}
          onChange={(e) => setCustomSurgeMultiplier(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
          <span>Base Published (1.0x)</span>
          <span>Moderate Surge (1.2x)</span>
          <span>Aggressive Festival (1.4x)</span>
        </div>
      </div>

      {/* Distribution Channels Status */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Connected OTA & PMS Channels</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {channels.map(ch => (
            <div key={ch.name} className="bg-white border border-slate-200 p-2.5 rounded-xl text-xs space-y-0.5">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span className="truncate">{ch.name}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </div>
              <div className="text-[11px] text-slate-500">Rate: <strong>₹{Math.round(ch.adr_inr * (customSurgeMultiplier / 1.18)).toLocaleString()}</strong></div>
              <div className="text-[10px] text-slate-400">{ch.share_pct}% room share</div>
            </div>
          ))}
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <Globe2 className="w-3.5 h-3.5 text-jodhpur-600" />
          <span>Real-time dynamic parity with Booking.com, MakeMyTrip & PMS</span>
        </div>

        <button
          onClick={handleApplyRate}
          disabled={isApplying || isApplied}
          className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition shadow-sm ${
            isApplied
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-950 hover:bg-slate-800 text-white active:scale-95'
          }`}
        >
          {isApplied ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Applied to All Distribution Channels!</span>
            </>
          ) : (
            <>
              <span>Apply Dynamic Surge Rates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

    </div>
  );
}
