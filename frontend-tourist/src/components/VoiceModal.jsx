import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Sparkles, X, ArrowRight, Volume2, Globe } from 'lucide-react';
import { parseVoiceQueryApi } from '../services/api';

export default function VoiceModal({ isOpen, onClose, onApplyIntent }) {
  if (!isOpen) return null;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLang, setSelectedLang] = useState('hi-IN');

  const SAMPLE_PROMPTS = [
    {
      text: "Mujhe subah Hawa Mahal aur shaam ko Jal Mahal jaana hai, 6 ghante ka plan banao",
      lang: "Hinglish"
    },
    {
      text: "Plan a full day heritage tour starting at 9 AM and avoid crowded places",
      lang: "English"
    },
    {
      text: "Amber Fort dekhna hai aur Johari Bazaar me shopping karni hai",
      lang: "Hindi"
    },
    {
      text: "4 hours trip covering City Palace and Albert Hall museum",
      lang: "English"
    }
  ];

  const handleStartListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser. You can type or click the sample prompts below!");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = selectedLang;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let current = '';
      for (let i = 0; i < event.results.length; i++) {
        current += event.results[i][0].transcript;
      }
      setTranscript(current);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleProcessQuery = async (queryText) => {
    const textToRun = queryText || transcript;
    if (!textToRun.trim()) return;

    setIsProcessing(true);
    try {
      const intent = await parseVoiceQueryApi(textToRun);
      onApplyIntent(intent);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-marigold-500 to-jodhpur-500 mx-auto flex items-center justify-center shadow-lg shadow-marigold-500/20 mb-3">
            <Sparkles className="w-6 h-6 text-slate-950" />
          </div>
          <h3 className="font-extrabold text-xl">SARATHI Voice Companion</h3>
          <p className="text-xs text-slate-400 mt-1">Speak or type your custom itinerary wish in any Indian language</p>
        </div>

        {/* Voice Recording Mic Bubble */}
        <div className="flex flex-col items-center justify-center py-4">
          <button
            onClick={isListening ? () => setIsListening(false) : handleStartListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all ${
              isListening
                ? 'bg-rose-500 shadow-rose-500/50 scale-110 animate-pulse'
                : 'bg-gradient-to-r from-marigold-500 to-marigold-600 hover:scale-105 shadow-marigold-500/30'
            }`}
          >
            {isListening ? (
              <MicOff className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-8 h-8 text-slate-950" />
            )}
          </button>
          <span className="text-xs font-semibold text-slate-400 mt-3">
            {isListening ? 'Listening to speech... (Tap to stop)' : 'Tap mic to speak (Hindi or English)'}
          </span>
        </div>

        {/* Query Input Box */}
        <div className="mt-4">
          <div className="relative">
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="e.g. 'Mujhe subah 9 baje Hawa Mahal aur Amber Fort jaana hai, bheed avoid karo'"
              rows={2}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-marigold-500"
            />
            {transcript && (
              <button
                onClick={() => handleProcessQuery(transcript)}
                disabled={isProcessing}
                className="absolute right-3 bottom-3 bg-marigold-500 hover:bg-marigold-600 text-slate-950 font-bold p-2 rounded-xl text-xs transition disabled:opacity-50 flex items-center gap-1"
              >
                <span>Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Sample Prompt Chips */}
        <div className="mt-5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-marigold-400" />
            <span>Try Quick Prompts</span>
          </div>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {SAMPLE_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTranscript(p.text);
                  handleProcessQuery(p.text);
                }}
                className="w-full text-left p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs text-slate-200 transition flex items-center justify-between group"
              >
                <span className="truncate pr-2">"{p.text}"</span>
                <span className="text-[10px] font-bold text-marigold-400 bg-slate-950 px-1.5 py-0.5 rounded flex-shrink-0">
                  {p.lang}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

