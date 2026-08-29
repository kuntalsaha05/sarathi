import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function TouristMapView({ pois, onRerouteAccepted }) {
  const [poiData, setPoiData] = useState(pois);
  const [activeAlert, setActiveAlert] = useState(null);

  useEffect(() => {
    socket.on('crowd_update', (update) => {
      setPoiData((prev) =>
        prev.map((p) => (p.id === update.poiId ? { ...p, congestionRatio: update.newCongestionRatio } : p))
      );
    });

    socket.on('reroute_recommendation', (alert) => {
      setActiveAlert(alert);
    });

    return () => {
      socket.off('crowd_update');
      socket.off('reroute_recommendation');
    };
  }, []);

  const getPinColor = (ratio) => {
    if (ratio < 0.5) return 'bg-emerald-500 ring-emerald-300';
    if (ratio <= 0.85) return 'bg-amber-500 ring-amber-300';
    return 'bg-rose-600 ring-rose-300 animate-pulse';
  };

  return (
    <div className="relative w-full h-[550px] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
      {activeAlert && (
        <div className="absolute top-4 left-4 right-4 z-50 bg-rose-950/90 border border-rose-500/50 backdrop-blur-md text-white p-4 rounded-xl shadow-2xl flex items-center justify-between animate-bounce">
          <div>
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded-full bg-rose-500"></span>
              <h4 className="font-bold text-sm uppercase tracking-wide">Live Crowd Surge Detected</h4>
            </div>
            <p className="text-xs text-rose-200 mt-1">{activeAlert.message}</p>
          </div>
          <button
            onClick={() => {
              onRerouteAccepted(activeAlert);
              setActiveAlert(null);
            }}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 font-semibold text-xs rounded-lg text-white shadow-lg transition"
          >
            Accept Reroute
          </button>
        </div>
      )}

      <div className="absolute bottom-4 left-4 right-4 bg-slate-800/90 backdrop-blur-md p-4 rounded-xl border border-slate-700 text-white">
        <h3 className="text-xs font-semibold uppercase text-slate-400 mb-2">Live Circuit Capacity Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {poiData.map((poi) => (
            <div key={poi.id} className="flex items-center space-x-2 bg-slate-900/80 p-2 rounded-lg border border-slate-700/50">
              <span className={`w-3 h-3 rounded-full ring-4 ${getPinColor(poi.congestionRatio)}`} />
              <div className="truncate">
                <p className="text-xs font-medium truncate">{poi.name}</p>
                <p className="text-[10px] text-slate-400">{(poi.congestionRatio * 100).toFixed(0)}% full</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
