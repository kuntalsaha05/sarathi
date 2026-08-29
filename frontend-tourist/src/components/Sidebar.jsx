import React from 'react';
import { MessageSquare, Briefcase, Compass, Heart, Sparkles, Plus, User, MapPin } from 'lucide-react';

export default function Sidebar({
  activeView,
  onSelectView,
  onOpenCreateTrip,
  savedCount = 0
}) {
  const navItems = [
    { id: 'chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'trips', label: 'Trips', icon: Briefcase },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'saved', label: 'Saved', icon: Heart, badge: savedCount > 0 ? savedCount : null },
    { id: 'inspiration', label: 'Inspiration', icon: Sparkles }
  ];

  return (
    <>
      {/* Desktop Left Rail */}
      <aside className="hidden md:flex flex-col items-center justify-between w-16 lg:w-18 bg-white border-r border-slate-200/90 py-5 z-40 fixed inset-y-0 left-0 shadow-xs select-none">
        
        {/* Top: Brand Logo */}
        <div className="flex flex-col items-center gap-6">
          <button
            onClick={() => onSelectView('chat')}
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-jodhpur-600 via-jodhpur-700 to-amber-500 flex items-center justify-center shadow-md shadow-jodhpur-700/20 active:scale-95 transition"
            title="SARATHI Home"
          >
            <Compass className="w-5 h-5 text-white" />
          </button>

          {/* Quick Create Trip Button */}
          <button
            onClick={onOpenCreateTrip}
            className="w-10 h-10 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white flex items-center justify-center shadow-md active:scale-95 transition group"
            title="Create New Trip"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
          </button>

          {/* Divider */}
          <div className="w-8 h-px bg-slate-200"></div>

          {/* Nav Links */}
          <nav className="flex flex-col items-center gap-3">
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
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: User Avatar */}
        <div className="flex flex-col items-center gap-3">
          <button
            className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300/80 text-amber-900 flex items-center justify-center font-bold text-xs shadow-2xs hover:ring-2 hover:ring-jodhpur-400 transition"
            title="Traveler Account"
          >
            <User className="w-4 h-4 text-amber-800" />
          </button>
        </div>

      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 px-3 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
                isActive ? 'text-jodhpur-700 font-bold' : 'text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
