import React from 'react';
import PlaceCard from './PlaceCard';
import { Sun, Sunset, Moon, Sparkles, Navigation, Clock } from 'lucide-react';

export default function VisualTimeline({
  stops = [],
  activePoiId,
  onHoverPoi,
  onLeavePoi,
  onSelectPoi,
  onOpenAudio
}) {
  if (!stops || stops.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-2">
        <Sparkles className="w-8 h-8 text-amber-500 mx-auto" />
        <h4 className="font-bold text-slate-800 text-sm">No Itinerary Generated</h4>
        <p className="text-xs text-slate-500">Ask the SARATHI AI assistant or tap Customize Trip to generate your schedule.</p>
      </div>
    );
  }

  // Bucket stops by arrival hour
  const morningStops = [];
  const afternoonStops = [];
  const eveningStops = [];

  stops.forEach((stop, index) => {
    const item = { ...stop, originalIndex: index };
    const arrHour = parseInt((stop.eta_arrival || '09:00').split(':')[0], 10);
    if (arrHour < 12) {
      morningStops.push(item);
    } else if (arrHour < 17) {
      afternoonStops.push(item);
    } else {
      eveningStops.push(item);
    }
  });

  const renderBucket = (title, icon, bucketStops, badge) => {
    if (bucketStops.length === 0) return null;
    const Icon = icon;

    return (
      <div className="space-y-3">
        {/* Bucket Header */}
        <div className="flex items-center justify-between pt-2 pb-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-800">
              <Icon className="w-4 h-4 text-jodhpur-700" />
            </div>
            <h4 className="font-black text-sm text-slate-900">{title}</h4>
          </div>
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
            {badge}
          </span>
        </div>

        {/* List of cards */}
        <div className="space-y-3">
          {bucketStops.map((stop) => (
            <PlaceCard
              key={stop.poi_id || stop.id || stop.originalIndex}
              place={stop}
              index={stop.originalIndex}
              isActive={activePoiId === (stop.poi_id || stop.id)}
              onHover={onHoverPoi}
              onLeave={onLeavePoi}
              onSelect={onSelectPoi}
              onOpenAudio={onOpenAudio}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderBucket("Morning Exploration", Sun, morningStops, "09:00 AM - 12:00 PM")}
      {renderBucket("Afternoon Heritage & Bazaars", Sun, afternoonStops, "12:00 PM - 05:00 PM")}
      {renderBucket("Evening Vista & Royal Dinner", Sunset, eveningStops, "05:00 PM - 09:00 PM")}
    </div>
  );
}

