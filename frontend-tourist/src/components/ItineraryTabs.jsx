import React from 'react';
import { Calendar, Compass, Volume2, Activity, Grid } from 'lucide-react';

export default function ItineraryTabs({ activeTab, onTabChange, placesCount = 12 }) {
  const tabs = [
    { id: 'itinerary', label: 'Timeline & Schedule', icon: Calendar },
    { id: 'places', label: `Explore Places (${placesCount})`, icon: Grid },
    { id: 'audio', label: 'Audio Guides', icon: Volume2 },
    { id: 'pulse', label: 'Live City Pulse', icon: Activity }
  ];

  return (
    <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              isActive
                ? 'bg-white text-slate-950 shadow-xs scale-100'
                : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-jodhpur-600' : 'text-slate-400'}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

