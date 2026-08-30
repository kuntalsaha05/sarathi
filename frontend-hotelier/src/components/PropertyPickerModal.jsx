import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  X,
  Star,
  Users,
  DollarSign,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { HOTELIER_DESTINATIONS } from '../data/hotelierData';

export default function PropertyPickerModal({
  isOpen,
  onClose,
  currentDestinationId = 'jaipur',
  currentPropertyId = 'prop-jaipur-1',
  onSelectPropertyAndDestination
}) {
  const [selectedDestId, setSelectedDestId] = useState(currentDestinationId);

  if (!isOpen) return null;

  const activeDest = HOTELIER_DESTINATIONS.find(d => d.id === selectedDestId) || HOTELIER_DESTINATIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-slide-up max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-jodhpur-50 border border-jodhpur-200 text-jodhpur-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-950 text-base">Select Destination & Property</h3>
              <p className="text-xs text-slate-500 font-medium">Switch between monitored hospitality corridors and PMS properties</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Destination Tabs */}
        <div>
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
            1. Select Monitored Destination
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {HOTELIER_DESTINATIONS.map((dest) => {
              const isSelected = dest.id === selectedDestId;
              return (
                <button
                  key={dest.id}
                  onClick={() => setSelectedDestId(dest.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                    isSelected
                      ? 'border-jodhpur-600 bg-jodhpur-50 text-jodhpur-900 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
                  }`}
                >
                  <span className="text-2xl">{dest.flag}</span>
                  <div>
                    <h4 className="font-black text-xs text-slate-950">{dest.name}</h4>
                    <span className="text-[10px] text-slate-500 font-semibold">{dest.region}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Properties in Selected Destination */}
        <div>
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
            2. Choose Hospitality Asset in {activeDest.name}
          </label>
          <div className="space-y-2.5">
            {activeDest.properties.map((prop) => {
              const isCurrent = prop.id === currentPropertyId;

              return (
                <div
                  key={prop.id}
                  onClick={() => {
                    onSelectPropertyAndDestination(selectedDestId, prop.id);
                    onClose();
                  }}
                  className={`border rounded-2xl p-4 cursor-pointer transition-all hover:shadow-sm ${
                    isCurrent
                      ? 'border-jodhpur-600 bg-jodhpur-50/40 shadow-xs ring-1 ring-jodhpur-500/30'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-950">{prop.name}</span>
                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: prop.star_rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{prop.corridor}</p>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-auto">
                      <div className="text-right">
                        <div className="text-xs font-black text-slate-900">₹{prop.base_adr_inr.toLocaleString()} ADR</div>
                        <div className="text-[10px] text-emerald-700 font-bold">{prop.occupancy_rate_pct}% Occupancy</div>
                      </div>

                      <button className="bg-slate-950 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition">
                        Select Asset
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

