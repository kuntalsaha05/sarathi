import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, MapPin, Navigation, Eye, Flame, Compass, Maximize2, ShieldCheck } from 'lucide-react';

export default function InteractiveMap({
  stops = [],
  startLocation = { lat: 26.9200, lng: 75.8225 },
  destinationName = 'Jaipur',
  activePoiId,
  onSelectPoi
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const polylineRef = useRef(null);
  const heatCirclesRef = useRef([]);

  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showRoute, setShowRoute] = useState(true);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [startLocation.lat, startLocation.lng],
        zoom: 12,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Mindtrip Voyager vector tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }
  }, []);

  // Update Markers, Heatmap, Polyline, & Fly-to on Destination change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old layers
    Object.values(markersRef.current).forEach(m => map.removeLayer(m));
    markersRef.current = {};
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }
    heatCirclesRef.current.forEach(c => map.removeLayer(c));
    heatCirclesRef.current = [];

    // Add Start Pin
    const startIcon = L.divIcon({
      className: 'custom-start-pin',
      html: `
        <div class="relative flex items-center justify-center w-8 h-8">
          <span class="absolute w-8 h-8 rounded-full bg-slate-950/20 animate-ping"></span>
          <div class="w-7 h-7 rounded-2xl bg-slate-950 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-black">
            📍
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const startMarker = L.marker([startLocation.lat, startLocation.lng], { icon: startIcon })
      .bindPopup(`<div class="p-2 text-xs font-bold text-slate-900">Center: ${destinationName}</div>`)
      .addTo(map);
    markersRef.current['start'] = startMarker;

    const coordinates = [[startLocation.lat, startLocation.lng]];

    // Add Stop Pins & Heat Circles
    stops.forEach((stop, index) => {
      if (!stop.lat || !stop.lng) return;
      const poiId = stop.poi_id || stop.id;
      coordinates.push([stop.lat, stop.lng]);

      const isSurge = stop.crowd_status === 'Surge' || stop.crowd_status === 'High';
      const isLow = stop.crowd_status === 'Low';
      const color = isSurge ? '#f43f5e' : (isLow ? '#10b981' : '#f59e0b');

      // Heat Circle
      if (showHeatmap) {
        const circle = L.circle([stop.lat, stop.lng], {
          radius: isSurge ? 1000 : (isLow ? 400 : 700),
          color: color,
          fillColor: color,
          fillOpacity: isSurge ? 0.35 : 0.2,
          weight: 1.5
        }).addTo(map);
        heatCirclesRef.current.push(circle);
      }

      // Marker Icon
      const isHighlighted = activePoiId === poiId;
      const markerIcon = L.divIcon({
        className: 'custom-poi-pin',
        html: `
          <div class="relative flex flex-col items-center group cursor-pointer transition-transform duration-300 ${
            isHighlighted ? 'scale-125 z-50' : 'scale-100'
          }">
            <div class="w-8 h-8 rounded-full border-2 border-white shadow-2xl flex items-center justify-center text-slate-950 font-black text-xs" style="background-color: ${color}">
              ${index + 1}
            </div>
            <div class="mt-1 px-2 py-0.5 rounded-md bg-slate-950/90 text-white text-[10px] font-bold shadow-md whitespace-nowrap">
              ${stop.name}
            </div>
          </div>
        `,
        iconSize: [40, 50],
        iconAnchor: [20, 25]
      });

      const marker = L.marker([stop.lat, stop.lng], { icon: markerIcon }).addTo(map);

      // Popup
      const popupHtml = `
        <div class="w-60 rounded-2xl overflow-hidden font-sans">
          <img src="${stop.image || stop.image_url || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80'}" class="w-full h-28 object-cover" />
          <div class="p-3 bg-white space-y-1.5">
            <div class="flex items-center justify-between text-[10px] font-bold">
              <span class="px-1.5 py-0.5 rounded ${isSurge ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}">
                ${stop.crowd_status || 'Normal'} Crowd
              </span>
              <span class="text-slate-500">Stop #${index + 1}</span>
            </div>
            <h4 class="font-extrabold text-sm text-slate-900 leading-tight">${stop.name}</h4>
            <div class="text-[11px] text-slate-500">
              ETA: <strong class="text-slate-800">${stop.eta_arrival || '09:30'}</strong> · Stay: <strong class="text-slate-800">${stop.visit_duration_minutes || 60}m</strong>
            </div>
            <button id="map-popup-btn-${poiId}" class="w-full mt-2 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold py-1.5 px-3 rounded-xl transition shadow-xs">
              View Guide & Details
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('popupopen', () => {
        const btn = document.getElementById(`map-popup-btn-${poiId}`);
        if (btn) {
          btn.onclick = () => onSelectPoi && onSelectPoi(stop);
        }
      });

      markersRef.current[poiId] = marker;
    });

    // Draw Polyline
    if (showRoute && coordinates.length > 1) {
      polylineRef.current = L.polyline(coordinates, {
        color: '#0284c7',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(map);
    }

    // Fly to Bounds
    if (coordinates.length > 1) {
      map.flyToBounds(L.latLngBounds(coordinates), { padding: [50, 50], duration: 1.2 });
    } else {
      map.flyTo([startLocation.lat, startLocation.lng], 13, { duration: 1.2 });
    }

  }, [stops, startLocation, showHeatmap, showRoute, activePoiId, destinationName]);

  // Recenter map handler
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      if (stops.length > 0) {
        const bounds = L.latLngBounds(stops.map(s => [s.lat, s.lng]));
        mapInstanceRef.current.flyToBounds(bounds, { padding: [50, 50] });
      } else {
        mapInstanceRef.current.flyTo([startLocation.lat, startLocation.lng], 13);
      }
    }
  };

  return (
    <div className="relative w-full h-full min-h-[550px] lg:min-h-full rounded-3xl overflow-hidden shadow-sm border border-slate-200 bg-slate-100">
      
      <div ref={mapContainerRef} className="w-full h-full min-h-[550px]" />

      {/* Floating Map Toolbar Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-lg border border-slate-200 flex flex-col gap-1 text-xs">
          <button
            onClick={() => setShowRoute(!showRoute)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-bold transition ${
              showRoute ? 'bg-jodhpur-50 text-jodhpur-800' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Route Polyline</span>
          </button>

          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-bold transition ${
              showHeatmap ? 'bg-amber-50 text-amber-800' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Crowd Heatmap</span>
          </button>
        </div>
      </div>

      {/* Recenter Button */}
      <div className="absolute bottom-6 left-4 z-20">
        <button
          onClick={handleRecenter}
          className="bg-white/95 backdrop-blur-md hover:bg-white p-2.5 rounded-2xl shadow-lg border border-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition active:scale-95"
          title={`Center on ${destinationName}`}
        >
          <Compass className="w-4 h-4 text-jodhpur-600" />
          <span>Fit {destinationName}</span>
        </button>
      </div>

      {/* Crowd Status Legend Bottom Right */}
      <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-lg border border-slate-200 text-xs flex flex-col gap-1.5">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Live Queue Index</span>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span className="text-slate-700 font-semibold">&lt;45% Low Queue</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span className="text-slate-700 font-semibold">Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
          <span className="text-rose-600 font-bold">&gt;80% Heavy Surge</span>
        </div>
      </div>

    </div>
  );
}
