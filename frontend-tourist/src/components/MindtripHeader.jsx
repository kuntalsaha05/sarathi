import React from 'react';
import { ChevronDown, MapPin, Calendar, Users, DollarSign, Mic, SlidersHorizontal, Plus, Share2, Compass, Globe } from 'lucide-react';

export default function MindtripHeader({
  destination,
  startTime = "09:00",
  travelers = "2 Travelers",
  budget = "Balanced (₹₹)",
  onOpenCapsuleModal,
  onOpenVoiceModal,
  onOpenCustomizer,
  onOpenCreateTrip,
  onShareTrip,
  wsConnected
}) {
  const destName = destination?.name || 'Jaipur';
  const destCountry = destination?.country || 'India';
  const destFlag = destination?.flag || '🇮🇳';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 h-16 flex items-center px-4 sm:px-6 transition-all select-none">
      <div className="w-full max-w-[1750px] mx-auto flex items-center justify-between gap-3">
        
        {/* Left: Destination Context & Quick Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex md:hidden items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-jodhpur-600 to-amber-500 flex items-center justify-center shadow-xs">
              <Compass className="w-4 h-4 text-white" />
            </div>
          </div>

          <button
            onClick={() => onOpenCapsuleModal('where')}
            className="flex items-center gap-2 hover:bg-slate-100/90 px-3 py-1.5 rounded-2xl transition border border-slate-200/60 hover:border-slate-300 text-left bg-slate-50/70"
            title="Click to switch city or country"
          >
            <div>
              <div className="flex items-center gap-1.5">
                <span>{destFlag}</span>
                <span className="font-extrabold text-sm text-slate-950 truncate max-w-[150px] sm:max-w-[200px]">
                  {destName}, {destCountry}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                <span className={`w-1.5 h-1.5 rounded-full ${wsConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
                <span>{wsConnected ? 'Live TD-VRPTW Sync' : 'Autonomous AI Routing'}</span>
              </div>
            </div>
          </button>
        </div>

        {/* Center: Universal Search Capsule Pill */}
        <div className="hidden lg:flex items-center">
          <div className="flex items-center bg-slate-50 hover:bg-slate-100/80 border border-slate-200/90 rounded-full p-1 shadow-xs text-xs font-semibold divide-x divide-slate-200 transition">
            
            <button
              onClick={() => onOpenCapsuleModal('where')}
              className="flex items-center gap-1.5 px-3.5 py-1 text-slate-800 hover:text-jodhpur-700 transition"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span className="truncate max-w-[110px]">{destName}</span>
            </button>

            <button
              onClick={() => onOpenCapsuleModal('when')}
              className="flex items-center gap-1.5 px-3.5 py-1 text-slate-800 hover:text-jodhpur-700 transition"
            >
              <Calendar className="w-3.5 h-3.5 text-jodhpur-600" />
              <span>{startTime} Departure</span>
            </button>

            <button
              onClick={() => onOpenCapsuleModal('who')}
              className="flex items-center gap-1.5 px-3.5 py-1 text-slate-800 hover:text-jodhpur-700 transition"
            >
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>{travelers}</span>
            </button>

            <button
              onClick={() => onOpenCapsuleModal('budget')}
              className="flex items-center gap-1.5 px-3.5 py-1 text-slate-800 hover:text-jodhpur-700 transition"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>{budget.split(' ')[0]}</span>
            </button>

          </div>
        </div>

        {/* Right Actions: Voice AI, Customize, Create Trip, Share */}
        <div className="flex items-center gap-2">
          
          <button
            onClick={onOpenVoiceModal}
            className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200/90 text-amber-950 font-bold px-3 py-1.5 rounded-xl text-xs transition active:scale-95 shadow-2xs"
            title="Voice Search in Hindi or English"
          >
            <Mic className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">Voice AI</span>
            <span className="text-[10px] bg-amber-200/80 px-1 py-0.2 rounded font-extrabold">
              हिंदी/EN
            </span>
          </button>

          <button
            onClick={onOpenCustomizer}
            className="hidden sm:flex items-center gap-1 text-slate-700 hover:text-slate-950 font-bold bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-xl text-xs transition active:scale-95"
            title="Customize Itinerary Constraints"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Constraints</span>
          </button>

          <button
            onClick={onOpenCreateTrip}
            className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-white font-black px-3.5 py-1.5 rounded-xl text-xs transition shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New City</span>
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
