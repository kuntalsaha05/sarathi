import React from 'react';
import { Heart, Sparkles, Plus, Trash2, ArrowRight, Star, MapPin } from 'lucide-react';
import { UNIVERSAL_DESTINATIONS } from '../data/destinationsData';

export default function SavedView({
  savedPoiIds = [],
  onRemoveSaved,
  onSelectPlace,
  onGeneratePlanFromSaved
}) {
  // Collect all POIs across all universal destinations
  const allUniversalPlaces = UNIVERSAL_DESTINATIONS.flatMap(d => (d.places || []).map(p => ({ ...p, destinationName: d.name, flag: d.flag })));
  const savedPlaces = allUniversalPlaces.filter(p => savedPoiIds.includes(p.id));

  if (savedPlaces.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
          <Heart className="w-6 h-6" />
        </div>
        <h3 className="text-base font-black text-slate-900">No Saved Places Yet</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Tap the heart icon on any landmark, palace, shrine, or museum in Explore to bookmark them into your universal wishlist.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header & Bulk Actions */}
      <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h3 className="text-sm font-black text-slate-950">Universal Saved Places ({savedPlaces.length})</h3>
          <p className="text-xs text-slate-500">Your global travel wishlist across all cities</p>
        </div>

        <button
          onClick={onGeneratePlanFromSaved}
          className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-white font-black px-4 py-2 rounded-xl text-xs shadow-md active:scale-95 transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Optimize Route ({savedPlaces.length})</span>
        </button>
      </div>

      {/* Grid of Saved Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {savedPlaces.map((place) => (
          <div
            key={place.id}
            onClick={() => onSelectPlace(place)}
            className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="relative h-40 bg-slate-900">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-white/90 text-slate-950 shadow-xs flex items-center gap-1">
                    <span>{place.flag}</span>
                    <span>{place.destinationName}</span>
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveSaved(place.id);
                    }}
                    className="p-2 rounded-xl bg-slate-950/70 hover:bg-rose-500 text-white transition"
                    title="Remove from Saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <h4 className="text-sm font-extrabold text-white leading-tight">{place.name}</h4>
                  <div className="flex items-center gap-1 bg-white/95 px-2 py-0.5 rounded-lg text-xs font-bold text-slate-950">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{place.rating}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <p className="text-xs text-slate-600 line-clamp-2">{place.description}</p>
                <div className="text-[11px] text-slate-500">
                  Category: <strong className="text-slate-800">{place.category}</strong>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-slate-100 flex justify-end">
              <span className="text-xs font-bold text-jodhpur-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>View Details</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
