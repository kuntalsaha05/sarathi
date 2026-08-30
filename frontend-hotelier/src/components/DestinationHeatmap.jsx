import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Flame, Building2, MapPin, Users, ShieldAlert, ArrowUpRight, Sparkles, Navigation } from 'lucide-react';

export default function DestinationHeatmap({ property = {}, pois = [], destination = {} }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef([]);
  const [selectedPoi, setSelectedPoi] = useState(null);

  const activePois = pois.length > 0 ? pois : [
    { id: '1', name: 'Amber Fort & Palace', lat: 26.9855, lng: 75.8513, crowd: 3600, capacity: 4000, status: 'Surge', category: 'Heritage Fort' },
    { id: '2', name: 'Hawa Mahal', lat: 26.9239, lng: 75.8267, crowd: 1350, capacity: 1500, status: 'Surge', category: 'Heritage Monument' },
    { id: '3', name: 'City Palace', lat: 26.9258, lng: 75.8235, crowd: 1400, capacity: 2000, status: 'Moderate', category: 'Royal Palace' },
    { id: '4', name: 'Jal Mahal', lat: 26.9538, lng: 75.8464, crowd: 1100, capacity: 3000, status: 'Low', category: 'Lake Promenade' },
    { id: '5', name: 'Nahargarh Fort', lat: 26.9373, lng: 75.8154, crowd: 1450, capacity: 2500, status: 'Moderate', category: 'Scenic Fort' },
    { id: '6', name: 'Johari Bazaar', lat: 26.9196, lng: 75.8267, crowd: 4100, capacity: 5000, status: 'Moderate', category: 'Artisan Market' },
    { id: '7', name: 'Albert Hall Museum', lat: 26.9114, lng: 75.8194, crowd: 480, capacity: 1200, status: 'Low', category: 'Museum' }
  ];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const centerLat = property.location?.lat || destination.coordinates?.lat || 26.9350;
    const centerLng = property.location?.lng || destination.coordinates?.lng || 75.8250;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: destination.zoom || 12,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Clean Light CartoDB Voyager Tile Layer matching Tourist Companion
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([centerLat, centerLng], destination.zoom || 12);
    }

    const map = mapInstanceRef.current;
    layersRef.current.forEach(layer => map.removeLayer(layer));
    layersRef.current = [];

    // Add Hotel Marker with Ripple Effect
    const hotelLat = property.location?.lat || 26.9200;
    const hotelLng = property.location?.lng || 75.8225;

    const hotelIcon = L.divIcon({
      className: 'custom-hotel-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <span class="absolute w-10 h-10 rounded-full bg-amber-400 opacity-60 animate-ping"></span>
          <div class="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 border-2 border-white shadow-xl flex items-center justify-center text-white font-black text-sm">
            🏨
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    const hotelMarker = L.marker([hotelLat, hotelLng], { icon: hotelIcon })
      .bindPopup(`
        <div class="p-3 text-xs font-sans">
          <span class="text-[10px] uppercase font-black text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">Your Hotel</span>
          <h4 class="font-extrabold text-sm text-slate-900 mt-1">${property.name || 'Pink City Heritage Stay'}</h4>
          <p class="text-slate-500 mt-1">Live Occupancy: <strong class="text-slate-900">${property.occupancy_rate_pct || 78}%</strong></p>
        </div>
      `)
      .addTo(map);
    layersRef.current.push(hotelMarker);

    // Add POI Saturation Heat Circles & Pins
    activePois.forEach(poi => {
      const ratio = poi.crowd / poi.capacity;
      const isSurge = ratio >= 0.8;
      const isModerate = ratio >= 0.45 && ratio < 0.8;

      const circleColor = isSurge ? '#f43f5e' : (isModerate ? '#f59e0b' : '#10b981');

      // Radiant heat circle
      const heatCircle = L.circle([poi.lat, poi.lng], {
        radius: isSurge ? 1100 : (isModerate ? 750 : 500),
        color: circleColor,
        fillColor: circleColor,
        fillOpacity: isSurge ? 0.3 : 0.15,
        weight: 1.5
      }).addTo(map);
      layersRef.current.push(heatCircle);

      // Center Pin
      const poiIcon = L.divIcon({
        className: 'custom-poi-marker',
        html: `
          <div class="w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-md text-[10px] font-black text-white cursor-pointer active:scale-95 transition" style="background-color: ${circleColor}">
            ${Math.round(ratio * 100)}%
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const poiMarker = L.marker([poi.lat, poi.lng], { icon: poiIcon })
        .on('click', () => setSelectedPoi(poi))
        .bindPopup(`
          <div class="p-3 text-xs font-sans">
            <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
              isSurge ? 'bg-rose-100 text-rose-800' : (isModerate ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800')
            }">
              ${poi.status} (${Math.round(ratio * 100)}%)
            </span>
            <h4 class="font-extrabold text-sm text-slate-900 mt-1">${poi.name}</h4>
            <div class="text-slate-500 mt-1 space-y-0.5">
              <div>Live Footfall: <strong class="text-slate-900">${poi.crowd.toLocaleString()}</strong> / ${poi.capacity.toLocaleString()}</div>
              <div>Category: <span class="text-slate-700">${poi.category || 'Sight'}</span></div>
            </div>
          </div>
        `)
        .addTo(map);
      layersRef.current.push(poiMarker);
    });

  }, [property, destination]);

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex flex-col h-full space-y-4">
      
      {/* Header & Map Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-slate-950 text-base flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-500" />
            <span>Destination Saturation Heatmap</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">Real-time crowd saturation index across major attraction corridors</p>
        </div>

        {/* Legend Chips */}
        <div className="flex items-center gap-2.5 text-[11px] font-bold">
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2 py-1 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>&lt;45% Safe</span>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-1 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-1.5 bg-rose-50 text-rose-800 border border-rose-200/60 px-2 py-1 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span>&gt;80% Surge</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative flex-1 min-h-[380px] lg:min-h-[420px] rounded-2xl overflow-hidden border border-slate-200/80 shadow-inner">
        <div ref={mapContainerRef} className="w-full h-full min-h-[380px] lg:min-h-[420px]" />

        {/* Quick POI Inspector Overlay */}
        {selectedPoi && (
          <div className="absolute top-3 left-3 z-500 bg-white/95 backdrop-blur-md border border-slate-200 p-3.5 rounded-2xl shadow-xl max-w-xs animate-fade-in text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-500">{selectedPoi.category}</span>
              <button
                onClick={() => setSelectedPoi(null)}
                className="text-slate-400 hover:text-slate-700 font-black p-0.5"
              >
                ✕
              </button>
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">{selectedPoi.name}</h4>
            <div className="flex items-center justify-between text-slate-600 pt-1">
              <span>Carrying Capacity:</span>
              <strong className="text-slate-900">{Math.round((selectedPoi.crowd / selectedPoi.capacity) * 100)}% Saturation</strong>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Current Footfall:</span>
              <strong className="text-slate-900">{selectedPoi.crowd.toLocaleString()} / {selectedPoi.capacity.toLocaleString()}</strong>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
