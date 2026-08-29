import React, { useState } from 'react';
import { Search, Heart, Volume2, Star, Clock, Ticket, ShieldCheck, Flame, Plus, Check, MapPin, Globe } from 'lucide-react';
import { UNIVERSAL_DESTINATIONS } from '../data/destinationsData';

export default function ExploreView({
  destination,
  onSelectDestination,
  onSelectPlace,
  onToggleSaved,
  savedPoiIds = [],
  onIncludeInTrip,
  includedPoiIds = []
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const places = destination?.places || [];

  const categories = [
    'All',
    'Heritage',
    'Palaces & Forts',
    'Museums',
    'Viewpoints',
    'Bazaars'
  ];

  const filteredPlaces = places.filter((poi) => {
    const matchesCategory = selectedCategory === 'All'
      || (selectedCategory === 'Heritage' && poi.category?.toLowerCase().includes('heritage'))
      || (selectedCategory === 'Palaces & Forts' && (poi.category?.toLowerCase().includes('fort') || poi.category?.toLowerCase().includes('palace') || poi.category?.toLowerCase().includes('monument')))
      || (selectedCategory === 'Museums' && (poi.category?.toLowerCase().includes('museum') || poi.category?.toLowerCase().includes('art')))
      || (selectedCategory === 'Viewpoints' && (poi.category?.toLowerCase().includes('view') || poi.category?.toLowerCase().includes('ghat') || poi.category?.toLowerCase().includes('cliff') || poi.category?.toLowerCase().includes('park')))
      || (selectedCategory === 'Bazaars' && (poi.category?.toLowerCase().includes('bazaar') || poi.category?.toLowerCase().includes('market') || poi.category?.toLowerCase().includes('crossing')));

    const matchesSearch = searchQuery.trim() === ''
      || poi.name.toLowerCase().includes(searchQuery.toLowerCase())
      || (poi.hindi_name && poi.hindi_name.includes(searchQuery))
      || (poi.description && poi.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
      
      {/* Quick Destination Switcher Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
        <span className="text-slate-400 text-[11px] font-extrabold uppercase mr-1 flex items-center gap-1">
          <Globe className="w-3.5 h-3.5" />
          <span>City:</span>
        </span>
        {UNIVERSAL_DESTINATIONS.map((d) => (
          <button
            key={d.id}
            onClick={() => onSelectDestination(d)}
            className={`px-3 py-1.5 rounded-2xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              destination?.id === d.id
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/90 hover:border-slate-300'
            }`}
          >
            <span>{d.flag}</span>
            <span>{d.name}</span>
          </button>
        ))}
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search sights, monuments, museums in ${destination?.name || 'city'}...`}
          className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-jodhpur-600 shadow-xs"
        />
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-jodhpur-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/90'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Places */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredPlaces.map((place) => {
          const isSaved = savedPoiIds.includes(place.id);
          const isIncluded = includedPoiIds.includes(place.id);
          const capacityPct = Math.min(100, Math.round((place.current_crowd / place.max_capacity) * 100));
          const isSurge = capacityPct >= 80;
          const isLow = capacityPct < 45;

          return (
            <div
              key={place.id}
              onClick={() => onSelectPlace(place)}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 hover:border-slate-300 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Photo with Overlay Pills */}
                <div className="relative h-44 bg-slate-900 overflow-hidden">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                  {/* Top Pill Category & Bookmark */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-slate-950 shadow-xs">
                      {place.category}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSaved(place.id);
                      }}
                      className={`p-2 rounded-xl backdrop-blur-md transition ${
                        isSaved
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-950/60 text-white hover:bg-slate-950'
                      }`}
                      title={isSaved ? 'Remove from Saved' : 'Save to Favorites'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Title and Rating */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <h3 className="text-base font-black text-white leading-tight drop-shadow-sm">
                        {place.name}
                      </h3>
                      {place.hindi_name && (
                        <span className="text-xs text-amber-200 font-medium">{place.hindi_name}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 bg-white/95 px-2 py-0.5 rounded-lg text-xs font-bold text-slate-950 shadow-md">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{place.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Description & Carrying Capacity */}
                <div className="p-4 space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {place.description}
                  </p>

                  {/* Capacity Bar */}
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-semibold flex items-center gap-1">
                        {isSurge ? <Flame className="w-3 h-3 text-rose-500" /> : <ShieldCheck className="w-3 h-3 text-emerald-600" />}
                        <span>Crowd Saturation</span>
                      </span>
                      <span className={`font-extrabold ${isSurge ? 'text-rose-600' : (isLow ? 'text-emerald-600' : 'text-amber-600')}`}>
                        {capacityPct}% ({isSurge ? 'Surge' : (isLow ? 'Low' : 'Moderate')})
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isSurge ? 'bg-rose-500' : (isLow ? 'bg-emerald-500' : 'bg-amber-500')}`}
                        style={{ width: `${capacityPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 mt-2">
                <span className="text-xs font-bold text-slate-700">
                  {place.entry_fee_inr ? `${destination?.currency || '₹'}${place.entry_fee_inr}` : 'Free Entry'}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onIncludeInTrip && onIncludeInTrip(place.id);
                    }}
                    className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                      isIncluded
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-jodhpur-50 hover:bg-jodhpur-100 text-jodhpur-800'
                    }`}
                  >
                    {isIncluded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{isIncluded ? 'In Trip' : 'Add to Trip'}</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
