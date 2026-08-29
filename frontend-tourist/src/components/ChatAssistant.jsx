import React, { useState } from 'react';
import { Sparkles, ArrowRight, Mic, Compass, Camera, ShoppingBag, Clock, Bot, User } from 'lucide-react';

export default function ChatAssistant({
  onSendMessage,
  onOpenVoiceModal,
  isLoading,
  messages = []
}) {
  const [query, setQuery] = useState('');

  const QUICK_PROMPTS = [
    { label: "🏰 Royal Heritage (Avoid Queues)", prompt: "Plan a full day Jaipur heritage tour avoiding morning crowd peaks" },
    { label: "📸 Best Photo & Sunset Spots", prompt: "Must visit best photography spots like Hawa Mahal and Nahargarh sunset" },
    { label: "🛍️ Bazaars & Traditional Crafts", prompt: "Include Johari Bazaar shopping and Lassiwala on MI Road" },
    { label: "⚡ 4-Hour Express Highlights", prompt: "Quick 4 hours trip covering top 3 must see spots in Jaipur" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    onSendMessage(query);
    setQuery('');
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-jodhpur-600 flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-950">SARATHI AI Assistant</h3>
            <p className="text-[11px] text-slate-500">Autonomous crowd-aware trip planner</p>
          </div>
        </div>

        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          ● TD-VRPTW Live
        </span>
      </div>

      {/* Message History Feed (if messages exist) */}
      {messages.length > 0 && (
        <div className="space-y-3 max-h-60 overflow-y-auto pr-1 text-xs">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role !== 'user' && (
                <div className="w-6 h-6 rounded-lg bg-jodhpur-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-slate-950 text-white rounded-br-xs'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>

              {msg.role === 'user' && (
                <div className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Where would you like to go? e.g. 'Morning Hawa Mahal, Nahargarh sunset, 6 hours'..."
          className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-2xl py-3.5 pl-4 pr-24 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-jodhpur-600 focus:border-transparent transition-all shadow-inner"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <button
            type="button"
            onClick={onOpenVoiceModal}
            className="p-2 text-slate-500 hover:text-amber-600 rounded-xl hover:bg-amber-50 transition"
            title="Voice AI in Hindi / English"
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="bg-slate-950 hover:bg-slate-800 disabled:opacity-30 text-white p-2 rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {QUICK_PROMPTS.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSendMessage(p.prompt)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-200/90 border border-slate-200 text-slate-700 hover:text-slate-950 whitespace-nowrap text-xs font-medium transition active:scale-95 flex-shrink-0"
          >
            <span>{p.label}</span>
          </button>
        ))}
      </div>

    </div>
  );
}

