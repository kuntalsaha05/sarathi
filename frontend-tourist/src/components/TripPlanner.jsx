import React from 'react';
import { Clock, Sliders, ShieldCheck, Sparkles, Check, Flame, MapPin } from 'lucide-react';
import { JAIPUR_POIS } from '../services/api';

export default function TripPlanner({
  startTime,
  setStartTime,
  maxHours,
  setMaxHours,
  avoidCrowds,
  setAvoidCrowds,
  selectedPoiIds,
  setSelectedPoiIds,
  onGenerateTrip,
  isLoading
}) {
  const togglePoi = (id) => {
    if (selectedPoiIds.includes(id)) {
      if (selectedPoiIds.length > 2) {
        setSelectedPoiIds(selectedPoiIds.filter(pId => pId !== id));
      }
    } else {
      setSelectedPoiIds([...selectedPoiIds, id]);
    }
  };

  const selectAll = () => {
    setSelectedPoiIds(JAIPUR_POIS.map(p => p.id));
  };

  const selectHeritageOnly = () => {
    setSelectedPoiIds(JAIPUR_POIS.filter(p => p.category === 'heritage' || p.category === 'viewpoint').map(p => p.id));
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-sandstone-200 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-sandstone-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-jodhpur-50 text-jodhpur-700">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Itinerary Optimizer</h3>
            <p className="text-xs text-slate-500">TD-VRPTW Crowd-Aware Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>OR-Tools Powered</span>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        
        {/* Start Time & Duration */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-jodhpur-600" />
              Start Time
            </label>
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-sandstone-50 border border-sandstone-300 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-jodhpur-500"
            >
              <option value="08:00">08:00 AM (Early Bird)</option>
              <option value="09:00">09:00 AM (Recommended)</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="14:00">02:00 PM (Afternoon)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center justify-between">
              <span>Time Budget</span>
              <span className="text-jodhpur-700 font-extrabold">{maxHours} Hours</span>
            </label>
            <div className="pt-2">
              <input
                type="range"
                min="4"
                max="12"
                step="1"
                value={maxHours}
                onChange={(e) => setMaxHours(Number(e.target.value))}
                className="w-full h-2 bg-sandstone-200 rounded-lg appearance-none cursor-pointer accent-jodhpur-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
                <span>4h (Quick)</span>
                <span>8h (Full Day)</span>
                <span>12h (Max)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Avoid Crowds Toggle */}
        <div className="flex items-center justify-between bg-sandstone-50 p-3 rounded-xl border border-sandstone-200">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg ${avoidCrowds ? 'bg-marigold-100 text-marigold-800' : 'bg-slate-200 text-slate-500'}`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Avoid Crowd Surges</span>
              <span className="text-[11px] text-slate-500">Reroute around forecasted tourist peaks</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAvoidCrowds(!avoidCrowds)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${avoidCrowds ? 'bg-jodhpur-600' : 'bg-slate-300'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${avoidCrowds ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* POI Selection Filter */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Select Destinations ({selectedPoiIds.length}/{JAIPUR_POIS.length})
            </label>
            <div className="flex gap-2 text-[11px]">
              <button
                type="button"
                onClick={selectAll}
                className="text-jodhpur-700 hover:text-jodhpur-800 font-semibold underline"
              >
                All
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={selectHeritageOnly}
                className="text-jodhpur-700 hover:text-jodhpur-800 font-semibold underline"
              >
                Heritage Top
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {JAIPUR_POIS.map((poi) => {
              const isSelected = selectedPoiIds.includes(poi.id);
              return (
                <button
                  type="button"
                  key={poi.id}
                  onClick={() => togglePoi(poi.id)}
                  className={`flex items-center gap-2 p-2 rounded-xl text-left text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-jodhpur-50 border-jodhpur-400 text-jodhpur-950 shadow-xs'
                      : 'bg-white border-sandstone-200 text-slate-500 hover:border-slate-300'
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

        {/* Generate Route CTA */}
        <button
          onClick={onGenerateTrip}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-jodhpur-700 via-jodhpur-600 to-jodhpur-800 hover:from-jodhpur-800 hover:to-jodhpur-900 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-jodhpur-700/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Optimizing Route with OR-Tools...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-marigold-300" />
              <span>Generate Adaptive Itinerary</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
}

