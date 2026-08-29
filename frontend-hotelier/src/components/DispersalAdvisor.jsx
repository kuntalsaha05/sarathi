import React, { useState } from 'react';
import { Compass, Sparkles, Send, CheckCircle2, ShieldCheck, Tag, Coffee } from 'lucide-react';

export default function DispersalAdvisor({ recommendations = [] }) {
  const [activeCampaigns, setActiveCampaigns] = useState({});

  const toggleCampaign = (id) => {
    setActiveCampaigns(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-base">Tourist Dispersal & Revenue Advisor</h3>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              Authority + B2B
            </span>
          </div>
          <p className="text-xs text-slate-400">Intelligent interventions to ease city bottlenecks and optimize guest flow</p>
        </div>

        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Compass className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => {
          const isLaunched = !!activeCampaigns[rec.id];

          return (
            <div
              key={rec.id}
              className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition space-y-2.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-jodhpur-950 text-jodhpur-300 border border-jodhpur-800">
                      {rec.action_type || 'Promotion'}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">Target: {rec.target_poi}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-100">{rec.title}</h4>
                </div>

                <button
                  onClick={() => toggleCampaign(rec.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition flex-shrink-0 ${
                    isLaunched
                      ? 'bg-emerald-600/20 border border-emerald-500 text-emerald-300'
                      : 'bg-jodhpur-600 hover:bg-jodhpur-700 text-white'
                  }`}
                >
                  {isLaunched ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Campaign Active</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Deploy Push</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{rec.rationale}</p>

              <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px]">
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Impact: {rec.expected_impact}</span>
                </span>
                <span className="text-slate-500">Status: {isLaunched ? 'Live Broadcast' : 'Ready'}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

