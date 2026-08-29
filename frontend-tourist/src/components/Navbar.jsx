import React from 'react';
import { Compass, Sparkles, Mic, SlidersHorizontal, Share2, MapPin, Radio } from 'lucide-react';

export default function Navbar({
  onOpenVoiceModal,
  onOpenCustomizer,
  onShareTrip,
  wsConnected
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand + Destination pill */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-jodhpur-600 via-jodhpur-700 to-amber-500 flex items-center justify-center shadow-md shadow-jodhpur-700/20">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-xl text-slate-950">
                  SARATHI
                </span>
                <span className="text-[10px] font-extrabold tracking-widest bg-jodhpur-50 text-jodhpur-700 border border-jodhpur-200 px-1.5 py-0.5 rounded-md uppercase">
                  Adaptive AI
                </span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1.5 bg-slate-100/90 hover:bg-slate-200/70 transition cursor-pointer border border-slate-200 px-3 py-1.5 rounded-full text-xs text-slate-800 font-semibold">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span>Jaipur, India</span>
            <span className="text-slate-400 font-normal ml-1">· Rajasthan</span>
          </div>
        </div>

        {/* Center: Live Real-time Telemetry Pill */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full text-xs">
          <span className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
          <span className="text-slate-700 font-medium">{wsConnected ? 'Live Crowd Sync Active' : 'Autonomous TD-VRPTW'}</span>
        </div>

        {/* Right Actions: Voice Assistant, Customize, Share */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenVoiceModal}
            className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-amber-900 font-bold px-3 py-2 rounded-xl text-xs transition active:scale-95 shadow-2xs"
            title="Voice Search in Hindi or English"
          >
            <Mic className="w-3.5 h-3.5 text-amber-700 animate-bounce-slow" />
            <span className="hidden sm:inline">Voice AI</span>
            <span className="text-[10px] bg-amber-200/80 text-amber-950 px-1.5 py-0.2 rounded font-semibold">
              हिंदी / EN
            </span>
          </button>

          <button
            onClick={onOpenCustomizer}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-sm active:scale-95"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-300" />
            <span>Customize Trip</span>
          </button>

          <button
            onClick={onShareTrip}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition"
            title="Share Itinerary"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}

