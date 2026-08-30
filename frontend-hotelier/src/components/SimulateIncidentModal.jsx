import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  AlertTriangle,
  ShieldCheck,
  X,
  ArrowRight,
  CheckCircle2,
  Activity
} from 'lucide-react';

export default function SimulateIncidentModal({
  isOpen,
  onClose,
  onTriggerSimulation,
  destinationName = 'Jaipur'
}) {
  const [selectedType, setSelectedType] = useState('crowd_spike');
  const [isTriggering, setIsTriggering] = useState(false);
  const [triggeredSuccess, setTriggeredSuccess] = useState(false);

  if (!isOpen) return null;

  const simulationOptions = [
    {
      id: 'crowd_spike',
      icon: AlertTriangle,
      title: 'Amber Fort & Corridor Crowd Saturation (92%)',
      desc: 'Simulates 3,500+ tourist influx. Triggers automatic VRPTW dynamic reroute suggestions for tourists and high yield recommendations for hoteliers.',
      badge: 'Crowd Surge (+72%)',
      color: 'rose'
    },
    {
      id: 'hotel_demand_spike',
      icon: Zap,
      title: 'Weekend Influx Demand Spike (+38%)',
      desc: 'Simulates sudden festival/holiday traveler rush in Amer-Jaipur corridor, activating AI dynamic ADR surge pricing suggestions (+18%).',
      badge: 'Demand Surge',
      color: 'amber'
    },
    {
      id: 'weather_alert',
      icon: ShieldCheck,
      title: 'Afternoon Heatwave Advisory (41°C)',
      desc: 'Emits a localized weather warning advising tourists to prioritize indoor heritage museums (Albert Hall) over outdoor fort climbs.',
      badge: 'Weather Advisory',
      color: 'jodhpur'
    }
  ];

  const handleExecute = async () => {
    setIsTriggering(true);
    await onTriggerSimulation(selectedType);
    setIsTriggering(false);
    setTriggeredSuccess(true);
    setTimeout(() => {
      setTriggeredSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-950 text-base">Real-Time Simulation Studio</h3>
              <p className="text-xs text-slate-500 font-medium">Broadcast live telemetry alerts to test dual-interface sync</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preset Options */}
        <div className="space-y-2.5">
          {simulationOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedType === opt.id;

            return (
              <div
                key={opt.id}
                onClick={() => setSelectedType(opt.id)}
                className={`border rounded-2xl p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-jodhpur-600 bg-jodhpur-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl ${
                      opt.color === 'rose' ? 'bg-rose-100 text-rose-700' : (opt.color === 'amber' ? 'bg-amber-100 text-amber-800' : 'bg-jodhpur-100 text-jodhpur-800')
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-950">{opt.title}</h4>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md inline-block mt-0.5 ${
                        opt.color === 'rose' ? 'bg-rose-100 text-rose-800' : (opt.color === 'amber' ? 'bg-amber-100 text-amber-900' : 'bg-jodhpur-100 text-jodhpur-900')
                      }`}>
                        {opt.badge}
                      </span>
                    </div>
                  </div>

                  <input
                    type="radio"
                    checked={isSelected}
                    onChange={() => setSelectedType(opt.id)}
                    className="mt-1 accent-jodhpur-600"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">{opt.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>Broadcasts to both B2B and Tourist App</span>
          </div>

          <button
            onClick={handleExecute}
            disabled={isTriggering || triggeredSuccess}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition shadow-sm ${
              triggeredSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-950 hover:bg-slate-800 text-white active:scale-95'
            }`}
          >
            {triggeredSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Simulated! Check Live Toast</span>
              </>
            ) : (
              <>
                <span>{isTriggering ? 'Broadcasting...' : 'Emit Event Now'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

