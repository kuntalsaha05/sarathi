import React from 'react';
import { Compass, Mic, Radio, Sparkles, MapPin } from 'lucide-react';

export default function Header({ onOpenVoiceModal, wsConnected }) {
  return (
    <header className="bg-slate-950 border-b border-slate-800 text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-jodhpur-600 to-marigold-500 flex items-center justify-center shadow-md shadow-jodhpur-600/30">
            <Compass className="w-6 h-6 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-xl bg-gradient-to-r from-white via-sandstone-100 to-marigold-300 bg-clip-text text-transparent">
                SARATHI
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-jodhpur-900/80 text-jodhpur-300 border border-jodhpur-700/60 px-1.5 py-0.5 rounded">
                SIH 2026
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Smart Autonomous Routing & Tourism Intelligence</p>
          </div>
        </div>

        {/* Location & Live Sync Status */}
        <div className="hidden md:flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-marigold-400" />
            <span className="font-semibold text-slate-200">Jaipur, Rajasthan</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-full">
            <span className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span className="text-slate-300 font-medium">{wsConnected ? 'Live Real-Time Sync' : 'Autonomous Engine'}</span>
          </div>
        </div>

        {/* Voice Companion Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenVoiceModal}
            className="flex items-center gap-2 bg-gradient-to-r from-marigold-500 to-marigold-600 hover:from-marigold-600 hover:to-marigold-700 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm shadow-md shadow-marigold-500/20 active:scale-95 transition-all"
          >
            <Mic className="w-4 h-4 text-slate-950" />
            <span>Voice Search</span>
            <span className="hidden sm:inline-block text-[10px] bg-slate-950/20 text-slate-950 px-1.5 py-0.2 rounded font-semibold">
              हिंदी / EN
            </span>
          </button>
        </div>

      </div>
    </header>
  );
}

