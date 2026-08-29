import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Flame, ShieldAlert, Building2, Eye } from 'lucide-react';

const JAIPUR_POIS = [
  { id: '1', name: 'Amber Fort', lat: 26.9855, lng: 75.8513, crowd: 3600, capacity: 4000, status: 'Surge' },
  { id: '2', name: 'Hawa Mahal', lat: 26.9239, lng: 75.8267, crowd: 1300, capacity: 1500, status: 'Surge' },
  { id: '3', name: 'City Palace', lat: 26.9258, lng: 75.8235, crowd: 1400, capacity: 2000, status: 'Moderate' },
  { id: '4', name: 'Jal Mahal', lat: 26.9538, lng: 75.8464, crowd: 1100, capacity: 3000, status: 'Low' },
  { id: '5', name: 'Nahargarh Fort', lat: 26.9373, lng: 75.8154, crowd: 1250, capacity: 2500, status: 'Moderate' },
  { id: '6', name: 'Johari Bazaar', lat: 26.9196, lng: 75.8267, crowd: 3900, capacity: 5000, status: 'Moderate' },
  { id: '7', name: 'Chokhi Dhani', lat: 26.7783, lng: 75.8138, crowd: 1800, capacity: 5000, status: 'Low' },
  { id: '8', name: 'Albert Hall', lat: 26.9114, lng: 75.8194, crowd: 480, capacity: 1200, status: 'Low' }
];

export default function DestinationHeatmap({ property = {} }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [26.9350, 75.8250],
        zoom: 12,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Dark Matter Map Tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    layersRef.current.forEach(layer => map.removeLayer(layer));
    layersRef.current = [];

    // Add Hotel Marker
    const hotelLat = property.location?.lat || 26.9200;
    const hotelLng = property.location?.lng || 75.8225;

    const hotelIcon = L.divIcon({
      className: 'custom-hotel-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <span class="absolute w-9 h-9 rounded-full bg-marigold-500 opacity-60 animate-ping"></span>
          <div class="w-8 h-8 rounded-xl bg-marigold-500 border-2 border-white shadow-xl flex items-center justify-center text-slate-950 font-black text-xs">
            🏨
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    const hotelMarker = L.marker([hotelLat, hotelLng], { icon: hotelIcon })
      .bindPopup(`
        <div class="p-2 text-xs">
          <span class="text-[10px] uppercase font-bold text-marigold-400">Your Property</span>
          <h4 class="font-bold text-sm text-white">${property.name || 'Pink City Heritage Stay'}</h4>
          <p class="text-slate-400 mt-1">Live Occupancy: <strong>${property.current_occupancy_pct || 78}%</strong></p>
        </div>
      `)
      .addTo(map);
    layersRef.current.push(hotelMarker);

    // Add POI Heat Circles & Markers
    JAIPUR_POIS.forEach(poi => {
      const ratio = poi.crowd / poi.capacity;
      const isSurge = ratio >= 0.8;
      const isModerate = ratio >= 0.45 && ratio < 0.8;

      const circleColor = isSurge ? '#f43f5e' : (isModerate ? '#f59e0b' : '#10b981');
      const fillColor = circleColor;

      // Radiant heat circle
      const heatCircle = L.circle([poi.lat, poi.lng], {
        radius: isSurge ? 1200 : (isModerate ? 850 : 600),
        color: circleColor,
        fillColor: fillColor,
        fillOpacity: isSurge ? 0.35 : 0.2,
        weight: 1.5
      }).addTo(map);
      layersRef.current.push(heatCircle);

      // Center pin
      const poiIcon = L.divIcon({
        className: 'custom-poi-marker',
        html: `
          <div class="w-6 h-6 rounded-full flex items-center justify-center border border-white/60 shadow-lg text-[9px] font-black text-white" style="background-color: ${circleColor}">
            ${Math.round(ratio * 100)}%
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const poiMarker = L.marker([poi.lat, poi.lng], { icon: poiIcon })
        .bindPopup(`
          <div class="p-2.5 text-xs text-white">
            <span class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
              isSurge ? 'bg-rose-500/30 text-rose-300' : 'bg-emerald-500/30 text-emerald-300'
            }">
              ${poi.status} Saturation
            </span>
            <h4 class="font-bold text-sm text-slate-100 mt-1">${poi.name}</h4>
            <div class="text-slate-400 mt-1 space-y-0.5">
              <div>Footfall: <strong class="text-white">${poi.crowd.toLocaleString()}</strong> / ${poi.capacity.toLocaleString()}</div>
              <div>Capacity: <strong class="text-white">${Math.round(ratio * 100)}%</strong></div>
            </div>
          </div>
        `)
        .addTo(map);
      layersRef.current.push(poiMarker);
    });

  }, [property]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col h-full">
      
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
        <div>
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-400" />
            <span>Destination Saturation Heatmap</span>
          </h3>
          <p className="text-xs text-slate-400">Live tourist density across Jaipur tourist corridors</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-300">&lt;45% Safe</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-slate-300">Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="text-rose-400 font-bold">&gt;80% Surge</span>
          </div>
        </div>
      </div>

      <div className="relative flex-1 min-h-[380px] rounded-xl overflow-hidden border border-slate-800">
        <div ref={mapContainerRef} className="w-full h-full min-h-[380px]" />
      </div>

    </div>
  );
}

