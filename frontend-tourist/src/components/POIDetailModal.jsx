import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, X, Camera, Clock, Ticket, Sparkles, MapPin, Globe } from 'lucide-react';
import { fetchAudioGuideApi } from '../services/api';

export default function POIDetailModal({ poi, onClose }) {
  if (!poi) return null;

  const [lang, setLang] = useState('en');
  const [guideData, setGuideData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchAudioGuideApi(poi.poi_id || poi.id, lang).then(data => {
      if (isMounted) {
        setGuideData(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [poi, lang]);

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported on this browser.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const narration = guideData?.narration || `${poi.name} is a majestic heritage location in Jaipur.`;
    const utterance = new SpeechSynthesisUtterance(narration);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-sandstone-200">
        
        {/* Header Image */}
        <div className="relative h-48 bg-slate-900">
          <img
            src={poi.image_url || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80'}
            alt={poi.name}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/60 text-white hover:bg-slate-950 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-5 right-5">
            <span className="text-[10px] uppercase font-extrabold tracking-widest px-2 py-0.5 rounded bg-marigold-500 text-slate-950 mb-1 inline-block">
              {poi.category || 'Heritage'}
            </span>
            <h3 className="text-xl font-black text-white">{poi.name}</h3>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          
          {/* Language Toggle & Audio Trigger */}
          <div className="flex items-center justify-between bg-sandstone-50 p-3 rounded-2xl border border-sandstone-200">
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-jodhpur-600" />
              <button
                onClick={() => setLang('en')}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition ${
                  lang === 'en' ? 'bg-jodhpur-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition ${
                  lang === 'hi' ? 'bg-jodhpur-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिंदी (Hindi)
              </button>
            </div>

            <button
              onClick={handleToggleSpeech}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
                isPlaying
                  ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                  : 'bg-marigold-500 hover:bg-marigold-600 text-slate-950'
              }`}
            >
              {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isPlaying ? 'Stop Audio' : 'Play Narration'}</span>
            </button>
          </div>

          {/* Narration Text */}
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-sandstone-50/50 p-3.5 rounded-2xl border border-sandstone-100">
            {isLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-sandstone-200 rounded w-3/4"></div>
                <div className="h-4 bg-sandstone-200 rounded w-full"></div>
              </div>
            ) : (
              <p>{guideData?.narration}</p>
            )}
          </div>

          {/* Quick Insights (Best time, photospot, fee) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-sandstone-50 border border-sandstone-200">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                <Clock className="w-4 h-4 text-jodhpur-600" />
                <span>Best Time to Visit</span>
              </div>
              <p className="text-slate-600 text-[11px]">{guideData?.best_time_to_visit || '09:00 AM - 11:30 AM'}</p>
            </div>

            <div className="p-3 rounded-xl bg-sandstone-50 border border-sandstone-200">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                <Camera className="w-4 h-4 text-marigold-600" />
                <span>Top Photo Spot</span>
              </div>
              <p className="text-slate-600 text-[11px]">{guideData?.photospot || 'Main facade & courtyard'}</p>
            </div>
          </div>

          {/* Timings & Entry fee */}
          <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-sandstone-100">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Timings: <strong className="text-slate-800">{poi.opening_time || '09:00'} - {poi.closing_time || '17:00'}</strong></span>
            </div>
            <div className="flex items-center gap-1">
              <Ticket className="w-3.5 h-3.5 text-slate-400" />
              <span>Entry: <strong className="text-slate-800">{poi.entry_fee_inr ? `₹${poi.entry_fee_inr}` : 'Free'}</strong></span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

