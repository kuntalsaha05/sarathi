import React from 'react';
import {
  LayoutDashboard,
  Flame,
  TrendingUp,
  DollarSign,
  Compass,
  Activity,
  Building2,
  Sparkles,
  UserCheck
} from 'lucide-react';

export default function Sidebar({
  activeView,
  onSelectView,
  onOpenSimulate,
  alertCount = 0
}) {
  const navItems = [
    { id: 'overview', label: 'Executive Pulse', icon: LayoutDashboard },
    { id: 'heatmap', label: 'Corridor Heatmap', icon: Flame },
    { id: 'forecast', label: 'Demand Forecasts', icon: TrendingUp },
    { id: 'pricing', label: 'Dynamic Yield', icon: DollarSign },
    { id: 'dispersal', label: 'Dispersal Campaigns', icon: Compass },
    { id: 'incidents', label: 'Live Telemetry', icon: Activity, badge: alertCount > 0 ? alertCount : null }
  ];

  return (
    <>
      {/* Desktop Left Rail */}
      <aside className="hidden md:flex flex-col items-center justify-between w-16 lg:w-18 bg-white border-r border-slate-200/90 py-5 z-40 fixed inset-y-0 left-0 shadow-xs select-none">
        
        {/* Top: Brand Logo & Quick Action */}
        <div className="flex flex-col items-center gap-5">
          <button
            onClick={() => onSelectView('overview')}
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-jodhpur-600 via-jodhpur-700 to-amber-500 flex items-center justify-center shadow-md shadow-jodhpur-700/20 active:scale-95 transition"
            title="SARATHI Hospitality Intelligence"
          >
            <Building2 className="w-5 h-5 text-white" />
          </button>

          {/* Quick Incident Simulation Button */}
          <button
            onClick={onOpenSimulate}
            className="w-10 h-10 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/20 active:scale-95 transition group"
            title="Simulate Real-Time City Surge"
          >
            <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
          </button>

          {/* Subtle Divider */}
          <div className="w-8 h-px bg-slate-200"></div>

          {/* Navigation Links */}
          <nav className="flex flex-col items-center gap-2.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  className={`relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-jodhpur-50 text-jodhpur-800 shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                  title={item.label}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                  
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-jodhpur-600 rounded-r-full"></span>
                  )}

                  {item.badge && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Hotelier Account Avatar */}
        <div className="flex flex-col items-center gap-3">
          <button
            className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shadow-2xs hover:ring-2 hover:ring-jodhpur-400 transition"
            title="Admin / Hotelier Profile"
          >
            <UserCheck className="w-4 h-4 text-jodhpur-700" />
          </button>
        </div>

      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 px-2 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition ${
                isActive ? 'text-jodhpur-700 font-bold' : 'text-slate-500'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] truncate max-w-[55px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

