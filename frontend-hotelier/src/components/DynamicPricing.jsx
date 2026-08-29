import React, { useState } from 'react';
import { DollarSign, Zap, CheckCircle2, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

export default function DynamicPricing({ kpis = {}, property = {} }) {
  const [isApplied, setIsApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const baseRate = kpis.current_adr_inr || 5400;
  const suggestedRate = kpis.suggested_adr_inr || 6372;
  const gain = kpis.potential_rev_gain_inr || 30140;
  const surgePct = Math.round(((suggestedRate - baseRate) / baseRate) * 100);

  const handleApplyRate = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setIsApplied(true);
      setTimeout(() => setIsApplied(false), 4000);
    }, 800);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-base">AI Dynamic Rate Optimizer</h3>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-marigold-500/20 text-marigold-300 border border-marigold-500/30">
              Yield Management
            </span>
          </div>
          <p className="text-xs text-slate-400">Automated ADR adjustments correlated with regional footfall surges</p>
        </div>

        <div className="p-2 rounded-xl bg-marigold-500/10 text-marigold-400 border border-marigold-500/20">
          <Zap className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Standard Published Rate</span>
          <span className="text-xl font-extrabold text-slate-300">₹{baseRate.toLocaleString()}</span>
          <span className="text-xs text-slate-500 block mt-1">Direct / OTA Base</span>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-marigold-500/40 relative">
          <span className="text-[10px] font-bold uppercase tracking-wider text-marigold-400 block mb-1">AI Recommended ADR</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-marigold-400">₹{suggestedRate.toLocaleString()}</span>
            <span className="text-xs font-bold text-emerald-400">+{surgePct}%</span>
          </div>
          <span className="text-xs text-slate-400 block mt-1">Based on weekend Amer rush</span>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">Projected Influx Gain</span>
          <span className="text-xl font-black text-emerald-400">+₹{gain.toLocaleString()}</span>
          <span className="text-xs text-slate-500 block mt-1">Net incremental yield</span>
        </div>

      </div>

      {/* Action CTA */}
      <div className="pt-2 flex items-center justify-between">
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-marigold-400" />
          <span>Synced with Booking.com, MakeMyTrip & PMS</span>
        </div>

        <button
          onClick={handleApplyRate}
          disabled={isApplying || isApplied}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-md ${
            isApplied
              ? 'bg-emerald-600 text-white'
              : 'bg-gradient-to-r from-marigold-500 to-marigold-600 hover:from-marigold-600 hover:to-marigold-700 text-slate-950 shadow-marigold-500/20 active:scale-95'
          }`}
        >
          {isApplied ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Applied to PMS Channels!</span>
            </>
          ) : (
            <>
              <span>Apply Dynamic Surge Rate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

    </div>
  );
}

