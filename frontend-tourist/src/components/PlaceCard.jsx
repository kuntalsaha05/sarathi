import React from 'react';
import { Star, Clock, Ticket, Volume2, Camera, Navigation, ArrowUpRight, Flame, ShieldCheck, Check } from 'lucide-react';

export default function PlaceCard({
  place,
  index,
  isActive,
  onHover,
  onLeave,
  onSelect,
  onOpenAudio
}) {
  const isSurge = place.crowd_status === 'Surge' || place.crowd_status === 'High';
  const isLow = place.crowd_status === 'Low';
  const capacityPct = place.current_crowd && place.max_capacity 
    ? Math.min(100, Math.round((place.current_crowd / place.max_capacity) * 100))
    : (isSurge ? 88 : (isLow ? 35 : 62));

  return (
    <div
      onMouseEnter={() => onHover && onHover(place.id || place.poi_id)}
      onMouseLeave={() => onLeave && onLeave()}
      className={`group relative bg-white rounded-3xl p-4 border transition-all duration-200 cursor-pointer shadow-xs ${
        isActive
          ? 'border-jodhpur-600 ring-2 ring-jodhpur-500/20 shadow-md translate-x-1'
          : 'border-slate-200/90 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        
        {/* Left Thumbnail with Category Badge & Stop Number */}
        <div className="relative w-full sm:w-40 h-36 sm:h-36 rounded-2xl overflow-hidden bg-slate-900 flex-shrink-0">
          <img
            src={place.image || place.image_url || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop&q=80'}
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>

          {/* Stop Number Pin */}
          {index !== undefined && (
            <div className="absolute top-2.5 left-2.5 w-7 h-7 rounded-xl bg-slate-950/90 backdrop-blur-md border border-white/40 text-white flex items-center justify-center text-xs font-black shadow-md">
              {index + 1}
            </div>
          )}

          {/* Category Pill */}
          <div className="absolute bottom-2.5 left-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-slate-900 shadow-xs">
              {place.category || 'Heritage'}
            </span>
          </div>
        </div>

        {/* Right Info Section */}
        <div className="flex-1 flex flex-col justify-between space-y-2">
          
          <div>
            {/* Top Rating & ETA */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-slate-900">{place.rating || 4.7}</span>
                <span className="text-slate-400 text-[11px]">({(place.reviews_count || 12400).toLocaleString()})</span>
              </div>

              {place.eta_arrival && (
                <div className="flex items-center gap-1 text-xs font-extrabold text-jodhpur-700 bg-jodhpur-50 px-2.5 py-0.5 rounded-full border border-jodhpur-200">
                  <Clock className="w-3 h-3" />
                  <span>{place.eta_arrival} - {place.eta_departure}</span>
                </div>
              )}
            </div>

            {/* Place Title */}
            <h3 className="text-base font-black text-slate-950 mt-1 group-hover:text-jodhpur-700 transition">
              {place.name}
            </h3>
            {place.hindi_name && (
              <span className="text-xs text-slate-400 font-medium block">
                {place.hindi_name}
              </span>
            )}
            <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
              {place.description || 'Iconic royal destination with rich historical heritage and authentic architecture.'}
            </p>
          </div>

          {/* Live Crowd Saturation Bar */}
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-semibold flex items-center gap-1">
                {isSurge ? (
                  <Flame className="w-3 h-3 text-rose-500" />
                ) : (
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                )}
                <span>Live Crowd Capacity</span>
              </span>
              <span className={`font-extrabold ${
                isSurge ? 'text-rose-600' : (isLow ? 'text-emerald-600' : 'text-amber-600')
              }`}>
                {capacityPct}% ({isSurge ? 'Heavy Surge' : (isLow ? 'Low Queue' : 'Moderate')})
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isSurge ? 'bg-rose-500' : (isLow ? 'bg-emerald-500' : 'bg-amber-500')
                }`}
                style={{ width: `${capacityPct}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <div className="text-slate-500 font-semibold text-[11px]">
              Entry: <strong className="text-slate-900">{place.entry_fee_inr ? `₹${place.entry_fee_inr}` : 'Free'}</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenAudio && onOpenAudio(place);
                }}
                className="flex items-center gap-1 text-jodhpur-700 hover:text-jodhpur-800 font-bold bg-jodhpur-50 hover:bg-jodhpur-100 px-2.5 py-1 rounded-lg transition"
              >
                <Volume2 className="w-3 h-3" />
                <span>Audio Guide</span>
              </button>

              <button
                onClick={() => onSelect && onSelect(place)}
                className="flex items-center gap-1 text-slate-700 hover:text-slate-950 font-bold bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition"
              >
                <span>Details</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Transit Connector to Next Stop */}
      {place.travel_duration_from_prev_minutes && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <Navigation className="w-3 h-3 text-jodhpur-600" />
            <span>Drive from previous: <strong>{place.travel_duration_from_prev_minutes} mins</strong></span>
          </span>
          <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
            Smooth Traffic
          </span>
        </div>
      )}

    </div>
  );
}

