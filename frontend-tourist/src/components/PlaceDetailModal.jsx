import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, X, Camera, Clock, Ticket, Star, MapPin, Globe, Sparkles, Check, ArrowRight } from 'lucide-react';
import { fetchAudioGuideApi } from '../services/api';

export default function PlaceDetailModal({ place, onClose, onToggleInclude, isIncluded }) {
  if (!place) return null;

  const [lang, setLang] = useState('en');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const gallery = place.gallery || [
    place.image || place.image_url || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=900&auto=format&fit=crop&q=80'
  ];

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [place]);

  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const textToSpeak = lang === 'hi'
      ? (place.audio_hi || `${place.name} जयपुर का प्रसिद्ध और ऐतिहासिक धरोहर स्थल है।`)
      : (place.audio_en || `${place.name} is one of the most celebrated royal heritage sites in Jaipur.`);

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Top Photo Gallery with Thumbnails */}
        <div className="relative h-64 sm:h-72 bg-slate-950 flex-shrink-0">
          <img
            src={gallery[activePhotoIdx]}
            alt={place.name}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/70 text-white hover:bg-slate-950 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Category Pill & Title Over Photo */}
          <div className="absolute bottom-4 left-5 right-5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 mb-1.5 inline-block">
              {place.category || 'Heritage Landmark'}
            </span>
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">{place.name}</h2>
                {place.hindi_name && (
                  <span className="text-xs text-amber-200 font-medium">{place.hindi_name}</span>
                )}
              </div>
              <div className="flex items-center gap-1 bg-white/95 px-2.5 py-1 rounded-xl text-xs font-bold text-slate-950 shadow-md">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{place.rating || 4.8}</span>
              </div>
            </div>
          </div>

          {/* Gallery Indicator Pills */}
          {gallery.length > 1 && (
            <div className="absolute top-4 left-4 flex gap-1.5">
              {gallery.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    activePhotoIdx === idx ? 'w-6 bg-white' : 'w-2 bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-800">
          
          {/* Audio Guide Bar */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-jodhpur-600" />
              <button
                onClick={() => setLang('en')}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition ${
                  lang === 'en' ? 'bg-jodhpur-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English Audio
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition ${
                  lang === 'hi' ? 'bg-jodhpur-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिंदी Audio
              </button>
            </div>

            <button
              onClick={handleToggleAudio}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
                isPlaying
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
              }`}
            >
              {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause Audio' : 'Play Narration'}</span>
            </button>
          </div>

          {/* Backstory & Overview */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
              Historical Backstory & Architecture
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {lang === 'hi' ? (place.audio_hi || place.description) : (place.description || place.audio_en)}
            </p>
          </div>

          {/* Highlights & Best Photo Angle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                <Clock className="w-4 h-4 text-jodhpur-600" />
                <span>Best Time Today</span>
              </div>
              <p className="text-slate-600 text-[11px]">{place.best_time || 'Morning (09:00 AM - 11:30 AM)'}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70">
              <div className="flex items-center gap-1.5 font-bold text-amber-950 mb-1">
                <Camera className="w-4 h-4 text-amber-700" />
                <span>Instagram Photo Spot</span>
              </div>
              <p className="text-amber-900 text-[11px]">{place.photo_tip || 'Main royal facade & reflective courtyards'}</p>
            </div>
          </div>

          {/* Timings & Entry Ticket Details */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Timings: <strong className="text-slate-900">{place.opening_time || '09:00'} - {place.closing_time || '17:00'}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Ticket className="w-4 h-4 text-slate-400" />
              <span>Indian: <strong className="text-slate-900">{place.entry_fee_inr ? `₹${place.entry_fee_inr}` : 'Free'}</strong></span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

