import React from 'react';
import { Sun, ShieldCheck, MapPin, Clock, Route, Ticket, Sparkles, Navigation, Globe } from 'lucide-react';

export default function DestinationHero({
  destination,
  tripPlan,
  startTime = "09:00",
  maxHours = 8,
  onTriggerSurgeDemo,
  onOpenCityPicker
}) {
  const destName = destination?.name || 'Jaipur';
  const destCountry = destination?.country || 'India';
  const destFlag = destination?.flag || '🇮🇳';
  const destTagline = destination?.tagline || 'The Pink City: Forts, Palaces & Royal Heritage';
  const destImage = destination?.image || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1600&auto=format&fit=crop&q=80';
  const weather = destination?.weather || { temp: '28°C', condition: 'Clear Sky', icon: '☀️' };
  const currency = destination?.currency || '₹';

  const stopsCount = tripPlan?.stops?.length || (destination?.places?.length || 5);
  const totalKm = tripPlan?.total_distance_km || 22.4;
  const totalMins = tripPlan?.total_travel_minutes || 75;
  const totalEntry = tripPlan?.stops?.reduce((acc, s) => acc + (s.entry_fee_inr || 0), 0) || 450;

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-md border border-slate-200">
      
      {/* Background Image with Gradient Overlay */}
      <div className="relative h-48 sm:h-56 bg-slate-900 overflow-hidden">
        <img
          src={destImage}
          alt={destName}
          className="w-full h-full object-cover opacity-80 scale-105 transition-transform duration-700 hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCityPicker}
              className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm hover:bg-white transition"
              title="Click to switch destination"
            >
              <span>{destFlag}</span>
              <span>{destName}, {destCountry}</span>
              <span className="text-slate-400 font-normal">▾</span>
            </button>

            <span className="hidden sm:flex items-center gap-1 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-medium text-slate-200 border border-white/20">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>{weather.temp} · {weather.condition}</span>
            </span>
          </div>

          <button
            onClick={onTriggerSurgeDemo}
            className="flex items-center gap-1 bg-rose-500/90 hover:bg-rose-600 backdrop-blur-md text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-md transition active:scale-95 animate-pulse"
            title="Simulate a real-time crowd surge"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate Live Surge</span>
          </button>
        </div>

        {/* Title & Location Bottom Left */}
        <div className="absolute bottom-4 left-5 right-5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 mb-1 inline-block">
            Autonomous Travel Circuit
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>{destName}</span>
            <span className="text-xl">{destFlag}</span>
          </h1>
          <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
            {destTagline}
          </p>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="bg-white p-3.5 grid grid-cols-4 divide-x divide-slate-100 text-center text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Stops</span>
          <span className="text-sm font-black text-slate-900">{stopsCount} Sights</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Distance</span>
          <span className="text-sm font-black text-slate-900">{totalKm} km</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Drive Time</span>
          <span className="text-sm font-black text-slate-900">{totalMins} mins</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Cost</span>
          <span className="text-sm font-black text-jodhpur-700">{currency}{totalEntry}</span>
        </div>
      </div>

    </div>
  );
}
