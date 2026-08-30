import React from 'react';
import {
  ChevronDown,
  Building2,
  Calendar,
  Users,
  DollarSign,
  Sparkles,
  Bell,
  Share2,
  SlidersHorizontal,
  TrendingUp,
  DownloadCloud
} from 'lucide-react';

export default function AdminHeader({
  destination,
  property,
  onOpenPropertyModal,
  onOpenSimulateModal,
  onOpenYieldOptimizer,
  onOpenAlerts,
  alertCount = 0,
  wsConnected = false
}) {
  const destName = destination?.name || 'Jaipur';
  const destCountry = destination?.country || 'India';
  const destFlag = destination?.flag || '🇮🇳';
  const propName = property?.name || 'Pink City Heritage Stay';
  const occupancy = property?.occupancy_rate_pct || 78;
  const suggestedAdr = property?.suggested_adr_inr || 6372;
  const baseAdr = property?.base_adr_inr || 5400;
  const surgePct = Math.round(((suggestedAdr - baseAdr) / baseAdr) * 100);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 h-16 flex items-center px-4 sm:px-6 transition-all select-none">
      <div className="w-full max-w-[1750px] mx-auto flex items-center justify-between gap-3">
        
        {/* Left: Destination & Property Selector Pill */}
        <div className="flex items-center gap-3">
          <div className="flex md:hidden items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-jodhpur-600 to-amber-500 flex items-center justify-center shadow-xs">
              <Building2 className="w-4 h-4 text-white" />
            </div>
          </div>

          <button
            onClick={onOpenPropertyModal}
            className="flex items-center gap-2 hover:bg-slate-100/90 px-3 py-1.5 rounded-2xl transition border border-slate-200/60 hover:border-slate-300 text-left bg-slate-50/70"
            title="Click to switch property or destination"
          >
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base">{destFlag}</span>
                <span className="font-extrabold text-sm text-slate-950 truncate max-w-[140px] sm:max-w-[200px]">
                  {propName}
                </span>
                <span className="hidden sm:inline text-xs text-slate-400 font-semibold">• {destName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                <span className={`w-1.5 h-1.5 rounded-full ${wsConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
                <span>{wsConnected ? 'Live PostGIS & Prophet Sync' : 'Forecasting Engine Ready'}</span>
              </div>
            </div>
          </button>
        </div>

        {/* Center: Search Capsule Pill (Admin / Hotelier Context) */}
        <div className="hidden xl:flex items-center">
          <div className="flex items-center bg-slate-50 hover:bg-slate-100/80 border border-slate-200/90 rounded-full p-1 shadow-xs text-xs font-semibold divide-x divide-slate-200 transition">
            
            <button
              onClick={onOpenPropertyModal}
              className="flex items-center gap-1.5 px-3.5 py-1 text-slate-800 hover:text-jodhpur-700 transition"
              title="Destination Corridor"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-500" />
              <span className="truncate max-w-[120px]">{property?.corridor?.split(' ')[0] || destName} Hub</span>
            </button>

            <div className="flex items-center gap-1.5 px-3.5 py-1 text-slate-800">
              <Calendar className="w-3.5 h-3.5 text-jodhpur-600" />
              <span>48h / 7-Day Horizon</span>
            </div>

            <div className="flex items-center gap-1.5 px-3.5 py-1 text-slate-800">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>{occupancy}% Occupancy</span>
            </div>

            <button
              onClick={onOpenYieldOptimizer}
              className="flex items-center gap-1.5 px-3.5 py-1 text-slate-800 hover:text-emerald-700 transition"
              title="Click to view Dynamic Yield"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-bold">Surge +{surgePct}% ADR</span>
            </button>

          </div>
        </div>

        {/* Right Actions: Simulate Incident, Live Alerts, Apply Yield, Export */}
        <div className="flex items-center gap-2">
          
          {/* Simulate Incident Button */}
          <button
            onClick={onOpenSimulateModal}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-xs transition active:scale-95 shadow-xs shadow-amber-500/20"
            title="Simulate Footfall Surge, Saturation, or Weather Advisory"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Simulate Surge</span>
          </button>

          {/* Quick Yield Optimizer Button */}
          <button
            onClick={onOpenYieldOptimizer}
            className="hidden sm:flex items-center gap-1.5 text-slate-700 hover:text-slate-950 font-bold bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-xl text-xs transition active:scale-95"
            title="Dynamic Pricing Settings"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
            <span>Yield</span>
          </button>

          {/* Alerts Bell */}
          <button
            onClick={onOpenAlerts}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition"
            title="Active Incidents & Alerts"
          >
            <Bell className="w-4 h-4" />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center animate-bounce">
                {alertCount}
              </span>
            )}
          </button>

          {/* Export / Share */}
          <button
            onClick={() => alert(`Exported B2B Intelligence Summary for ${propName} (${destName})!`)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition"
            title="Export Intelligence Report"
          >
            <DownloadCloud className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
}

