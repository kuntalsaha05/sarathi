import React from 'react';
import { Sliders, Clock, ShieldCheck, Check, X, Sparkles, MapPin } from 'lucide-react';

export default function TripCustomizerModal({
  isOpen,
  onClose,
  destination,
  startTime,
  setStartTime,
  maxHours,
  setMaxHours,
  avoidCrowds,
  setAvoidCrowds,
  selectedPoiIds,
  setSelectedPoiIds,
  onApply
}) {
  if (!isOpen) return null;

  const places = destination?.places || [];

  const togglePoi = (id) => {
    if (selectedPoiIds.includes(id)) {
      if (selectedPoiIds.length > 2) {
        setSelectedPoiIds(selectedPoiIds.filter(pId => pId !== id));
      }
    } else {
      setSelectedPoiIds([...selectedPoiIds, id]);
    }
  };

  const selectAll = () => setSelectedPoiIds(places.map(p => p.id));
  const selectHeritage = () => {
    const heritageIds = places.filter(p => p.category?.toLowerCase().includes('heritage') || p.category?.toLowerCase().includes('fort') || p.category?.toLowerCase().includes('monument')).map(p => p.id);
    setSelectedPoiIds(heritageIds.length > 0 ? heritageIds : places.map(p => p.id));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-jodhpur-50 text-jodhpur-700">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-950">Trip Constraints & Optimization</h3>
              <p className="text-xs text-slate-500">TD-VRPTW Parameters for {destination?.name || 'Destination'}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="py-4 space-y-5 overflow-y-auto pr-1 flex-1">
          
          {/* Start Time & Budget Hours */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-jodhpur-600" />
                Departure Time
              </label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-jodhpur-500 focus:outline-none"
              >
                <option value="08:00">08:00 AM (Early Bird)</option>
                <option value="09:00">09:00 AM (Recommended)</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="14:00">02:00 PM (Afternoon Tour)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                <span>Time Budget</span>
                <span className="text-jodhpur-700 font-extrabold">{maxHours} Hours</span>
              </div>
              <input
                type="range"
                min="4"
                max="12"
                step="1"
                value={maxHours}
                onChange={(e) => setMaxHours(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-jodhpur-600 mt-2"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
                <span>4h (Quick)</span>
                <span>8h (Standard)</span>
                <span>12h (Full)</span>
              </div>
            </div>
          </div>

          {/* Avoid Crowd Surges AI Switch */}
          <div className="flex items-center justify-between bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/60">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${avoidCrowds ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-500'}`}>
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">Avoid Crowd Surges (Prophet Model)</span>
                <span className="text-[11px] text-slate-500">Weight routes around predicted queue spikes</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setAvoidCrowds(!avoidCrowds)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                avoidCrowds ? 'bg-jodhpur-600' : 'bg-slate-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                avoidCrowds ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {/* Destination Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Selected Sights in {destination?.name} ({selectedPoiIds.length}/{places.length})
              </label>
              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={selectAll}
                  className="text-jodhpur-700 hover:text-jodhpur-800 font-bold underline"
                >
                  All ({places.length})
                </button>
                <span className="text-slate-300">·</span>
                <button
                  type="button"
                  onClick={selectHeritage}
                  className="text-jodhpur-700 hover:text-jodhpur-800 font-bold underline"
                >
                  Top Sights
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
              {places.map((poi) => {
                const isSelected = selectedPoiIds.includes(poi.id);
                return (
                  <button
                    type="button"
                    key={poi.id}
                    onClick={() => togglePoi(poi.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-left text-xs font-bold border transition-all ${
                      isSelected
                        ? 'bg-jodhpur-50 border-jodhpur-400 text-jodhpur-950 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center border text-[10px] ${
                      isSelected ? 'bg-jodhpur-600 border-jodhpur-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="truncate">{poi.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 px-3 py-2"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onApply();
              onClose();
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-jodhpur-700 to-jodhpur-800 hover:from-jodhpur-800 hover:to-jodhpur-900 text-white font-black px-5 py-2.5 rounded-xl text-xs shadow-md shadow-jodhpur-700/20 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Generate Optimized Route</span>
          </button>
        </div>

      </div>
    </div>
  );
}
