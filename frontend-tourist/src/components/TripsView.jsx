import React, { useState } from 'react';
import { Calendar, Clock, Route, Ticket, Plus, SlidersHorizontal, Share2, Sparkles, Navigation, ArrowUpRight, Globe } from 'lucide-react';
import PlaceCard from './PlaceCard';
import VisualTimeline from './VisualTimeline';

export default function TripsView({
  destination,
  tripPlan,
  activePoiId,
  onHoverPoi,
  onLeavePoi,
  onSelectPoi,
  onOpenAudio,
  onOpenCustomizer,
  onOpenCreateTrip
}) {
  const [activeSubTab, setActiveSubTab] = useState('timeline');

  const stops = tripPlan?.stops || (destination?.places || []);
  const totalKm = tripPlan?.total_distance_km || 22.4;
  const totalMins = tripPlan?.total_travel_minutes || 75;
  const currency = destination?.currency || '₹';
  const totalCost = stops.reduce((sum, s) => sum + (s.entry_fee_inr || 0), 0);

  return (
    <div className="space-y-4">
      
      {/* Trip Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-jodhpur-50 text-jodhpur-700 border border-jodhpur-200">
                Active Itinerary
              </span>
              <span className="text-xs text-slate-400 font-semibold">{destination?.country || 'Universal'} · 1 Day Tour</span>
            </div>
            <h2 className="text-2xl font-black text-slate-950 flex items-center gap-2">
              <span>{destination?.name || 'Destination'}: Curated Circuit</span>
              <span className="text-xl">{destination?.flag || '🌍'}</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCustomizer}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-bold px-3.5 py-2 rounded-xl text-xs transition"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span>Modify</span>
            </button>

            <button
              onClick={onOpenCreateTrip}
              className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-white font-black px-4 py-2 rounded-xl text-xs shadow-xs active:scale-95 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Switch City</span>
            </button>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-4 divide-x divide-slate-100 bg-slate-50 rounded-2xl p-3 text-center text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Stops</span>
            <strong className="text-sm text-slate-950">{stops.length} Places</strong>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Distance</span>
            <strong className="text-sm text-slate-950">{totalKm} km</strong>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Drive Time</span>
            <strong className="text-sm text-slate-950">{totalMins} mins</strong>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Est. Cost</span>
            <strong className="text-sm text-jodhpur-700">{currency}{totalCost}</strong>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('timeline')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeSubTab === 'timeline'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Day Timeline
          </button>
          <button
            onClick={() => setActiveSubTab('schedule')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeSubTab === 'schedule'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Schedule Table
          </button>
          <button
            onClick={() => setActiveSubTab('tickets')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeSubTab === 'tickets'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Tickets & Entry Breakdown
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: Visual Timeline */}
      {activeSubTab === 'timeline' && (
        <VisualTimeline
          stops={stops}
          activePoiId={activePoiId}
          onHoverPoi={onHoverPoi}
          onLeavePoi={onLeavePoi}
          onSelectPoi={onSelectPoi}
          onOpenAudio={onOpenAudio}
        />
      )}

      {/* SUB-VIEW 2: Schedule Table */}
      {activeSubTab === 'schedule' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400">
                <th className="pb-3">Stop</th>
                <th className="pb-3">Arrival</th>
                <th className="pb-3">Departure</th>
                <th className="pb-3">Stay</th>
                <th className="pb-3">Crowd Status</th>
                <th className="pb-3">Entry Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stops.map((stop, idx) => (
                <tr
                  key={stop.poi_id || idx}
                  onClick={() => onSelectPoi(stop)}
                  className="hover:bg-slate-50/80 cursor-pointer font-semibold"
                >
                  <td className="py-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-black flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-extrabold text-slate-900">{stop.name}</span>
                  </td>
                  <td className="py-3 text-jodhpur-700 font-bold">{stop.eta_arrival || '09:30'}</td>
                  <td className="py-3 text-slate-600">{stop.eta_departure || '10:30'}</td>
                  <td className="py-3 text-slate-600">{stop.visit_duration_minutes || 60}m</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      stop.crowd_status === 'Surge' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {stop.crowd_status || 'Normal'}
                    </span>
                  </td>
                  <td className="py-3 font-bold text-slate-900">
                    {stop.entry_fee_inr ? `${currency}${stop.entry_fee_inr}` : 'Free'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SUB-VIEW 3: Tickets Breakdown */}
      {activeSubTab === 'tickets' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="font-black text-sm text-slate-900">Estimated Admission & Entry Fees</h4>
              <p className="text-xs text-slate-500">Official site tickets in {destination?.name || 'city'}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Est.</span>
              <span className="text-base font-black text-jodhpur-700">{currency}{totalCost}</span>
            </div>
          </div>

          <div className="space-y-2">
            {stops.map((stop, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-slate-900">{stop.name}</span>
                </div>
                <span className="font-extrabold text-slate-800">
                  {stop.entry_fee_inr ? `${currency}${stop.entry_fee_inr}` : 'Free'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
