import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Send,
  CheckCircle2,
  Tag,
  Gift,
  Clock,
  ArrowRight,
  Plus
} from 'lucide-react';

export default function DispersalAdvisor({ recommendations = [] }) {
  const [activeCampaigns, setActiveCampaigns] = useState({ 'rec-jaipur-1': true });
  const [createdVoucher, setCreatedVoucher] = useState(null);

  const toggleCampaign = (id) => {
    setActiveCampaigns(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleQuickCreateCampaign = () => {
    setCreatedVoucher({
      title: '20% Off Jal Mahal Lake Cafe & Artisan Craft High Tea',
      code: 'SARATHI-DISPERSE-20',
      discount: '20% OFF'
    });
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-4">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-950 text-base">Tourist Dispersal & Guest Flow Advisor</h3>
            <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              Authority + B2B
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">Intelligent interventions to ease city bottlenecks and optimize guest flow</p>
        </div>

        <button
          onClick={handleQuickCreateCampaign}
          className="flex items-center gap-1 bg-jodhpur-50 hover:bg-jodhpur-100 text-jodhpur-800 font-bold px-3 py-1.5 rounded-xl text-xs border border-jodhpur-200/60 transition self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Voucher</span>
        </button>
      </div>

      {createdVoucher && (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 p-3.5 rounded-2xl shadow-md flex items-center justify-between animate-fade-in text-xs">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/40 px-1.5 py-0.2 rounded">Custom Guest Offer Created</span>
            <h4 className="font-black text-sm mt-0.5">{createdVoucher.title}</h4>
            <span className="font-bold text-xs opacity-90">Promo Code: {createdVoucher.code}</span>
          </div>
          <button
            onClick={() => setCreatedVoucher(null)}
            className="bg-slate-950 text-white font-black px-3 py-1.5 rounded-xl text-xs hover:bg-slate-800 transition"
          >
            Pushed to Tourist PWA
          </button>
        </div>
      )}

      <div className="space-y-3">
        {recommendations.map((rec) => {
          const isLaunched = !!activeCampaigns[rec.id];

          return (
            <div
              key={rec.id}
              className={`border rounded-2xl p-4 transition-all space-y-2.5 ${
                isLaunched
                  ? 'bg-slate-50/70 border-jodhpur-200 shadow-xs'
                  : 'bg-white border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200/60">
                      {rec.action_type || 'Guest Voucher'}
                    </span>
                    <span className="text-xs text-slate-500 font-bold">Target: {rec.target_poi}</span>
                  </div>
                  <h4 className="font-black text-sm text-slate-950">{rec.title}</h4>
                </div>

                <button
                  onClick={() => toggleCampaign(rec.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition flex-shrink-0 active:scale-95 ${
                    isLaunched
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-950 hover:bg-slate-800 text-white shadow-xs'
                  }`}
                >
                  {isLaunched ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
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

              <p className="text-xs text-slate-600 leading-relaxed font-medium">{rec.rationale}</p>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold">
                <span className="text-emerald-700 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Impact: {rec.expected_impact}</span>
                </span>
                <span className={isLaunched ? 'text-jodhpur-700 font-extrabold' : 'text-slate-400'}>
                  {isLaunched ? '🟢 Live Broadcast to Tourist App' : '⚪ Ready to Deploy'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
