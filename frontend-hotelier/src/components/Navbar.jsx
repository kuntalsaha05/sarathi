import React, { useState } from 'react';
import { Building2, Activity, Bell, ChevronDown, Sparkles, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { triggerSimulationEvent } from '../services/api';

export default function Navbar({
  selectedPropertyId,
  onSelectProperty,
  allProperties = [],
  wsConnected,
  unreadAlertCount,
  onOpenAlerts
}) {
  const [showSimMenu, setShowSimMenu] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);

  const handleTriggerSim = async (type) => {
    setIsTriggering(true);
    setShowSimMenu(false);
    await triggerSimulationEvent(type);
    setIsTriggering(false);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-marigold-500 to-amber-600 flex items-center justify-center shadow-md shadow-marigold-500/20">
            <Building2 className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-lg text-white">
                SARATHI
              </span>
              <span className="text-[10px] uppercase font-extrabold tracking-widest bg-marigold-500/20 text-marigold-300 border border-marigold-500/40 px-1.5 py-0.5 rounded">
                Hospitality Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">B2B Destination Pulse & Dynamic Yield Management</p>
          </div>
        </div>

        {/* Center: Property Selector */}
        <div className="hidden md:flex items-center gap-3">
          <label className="text-xs text-slate-400 font-semibold">Active Property:</label>
          <select
            value={selectedPropertyId || ''}
            onChange={(e) => onSelectProperty(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-marigold-500"
          >
            {allProperties.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Live Sync Status */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-full text-xs">
            <span className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span className="text-slate-300 font-medium">{wsConnected ? 'Live Pulse' : 'Forecasting Engine'}</span>
          </div>

          {/* Simulate Event Dropdown for Demo */}
          <div className="relative">
            <button
              onClick={() => setShowSimMenu(!showSimMenu)}
              disabled={isTriggering}
              className="flex items-center gap-1.5 bg-gradient-to-r from-jodhpur-600 to-jodhpur-700 hover:from-jodhpur-700 hover:to-jodhpur-800 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-md shadow-jodhpur-600/20 active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-marigold-300" />
              <span>Simulate Incident</span>
              <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>

            {showSimMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 text-xs space-y-1">
                <div className="px-3 py-1.5 font-bold uppercase tracking-wider text-[10px] text-slate-400">
                  Demo Surge Events
                </div>
                <button
                  onClick={() => handleTriggerSim('hotel_demand_spike')}
                  className="w-full text-left p-2 rounded-xl hover:bg-slate-800 text-slate-200 transition flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 text-marigold-400 flex-shrink-0" />
                  <div>
                    <strong className="block text-slate-100">Weekend Influx Surge</strong>
                    <span className="text-[10px] text-slate-400">+38% footfall in Amer corridor</span>
                  </div>
                </button>

                <button
                  onClick={() => handleTriggerSim('crowd_spike')}
                  className="w-full text-left p-2 rounded-xl hover:bg-slate-800 text-slate-200 transition flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <div>
                    <strong className="block text-slate-100">Amber Fort Saturation</strong>
                    <span className="text-[10px] text-slate-400">Trigger crowd warning (92%)</span>
                  </div>
                </button>

                <button
                  onClick={() => handleTriggerSim('weather_alert')}
                  className="w-full text-left p-2 rounded-xl hover:bg-slate-800 text-slate-200 transition flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div>
                    <strong className="block text-slate-100">Heatwave Advisory</strong>
                    <span className="text-[10px] text-slate-400">Shift guest flow to indoor POIs</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Alert Bell */}
          <button
            onClick={onOpenAlerts}
            className="relative p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition"
            title="Active Incidents"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center animate-bounce">
                {unreadAlertCount}
              </span>
            )}
          </button>

        </div>

      </div>
    </header>
  );
}

