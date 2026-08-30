import React, { useState } from 'react';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, Calendar, Clock, Sparkles, AlertCircle } from 'lucide-react';

export default function ForecastCharts({ forecast7d = [], hourly48h = [] }) {
  const [activeTab, setActiveTab] = useState('hourly'); // 'hourly' or '7day'

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-4">
      
      {/* Header & Tab Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-950 text-base">Demand & Footfall Intelligence</h3>
            <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-jodhpur-50 text-jodhpur-800 border border-jodhpur-200/60">
              Prophet + LightGBM
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">Recursive multi-step time-series forecasting with diurnal confidence intervals</p>
        </div>

        <div className="flex items-center bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('hourly')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'hourly'
                ? 'bg-white text-slate-950 shadow-xs font-black'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-jodhpur-600" />
            <span>48h Footfall Curve</span>
          </button>

          <button
            onClick={() => setActiveTab('7day')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === '7day'
                ? 'bg-white text-slate-950 shadow-xs font-black'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span>7-Day Macro Outlook</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full pt-1">
        {activeTab === 'hourly' ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourly48h} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorFootfall" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorUpper" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="hour" stroke="#94a3b8" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '16px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                  color: '#0f172a'
                }}
                labelStyle={{ fontWeight: 800, color: '#0f172a' }}
              />
              <Area type="monotone" dataKey="upper_bound" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="3 3" fillOpacity={1} fill="url(#colorUpper)" name="Upper Confidence Band" />
              <Area type="monotone" dataKey="predicted_footfall" stroke="#0284c7" strokeWidth={3} fillOpacity={1} fill="url(#colorFootfall)" name="Predicted Hourly Footfall" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecast7d} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} domain={[50, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '16px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                  color: '#0f172a'
                }}
                labelStyle={{ fontWeight: 800, color: '#0f172a' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }} />
              <Line type="monotone" dataKey="predicted_occupancy_pct" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} name="Predicted Occupancy (%)" />
              <Line type="monotone" dataKey="predicted_city_footfall_k" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: '#f59e0b' }} name="City Footfall (in 10k)" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer Insight Ribbon */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 text-jodhpur-800 font-bold bg-jodhpur-50 px-2.5 py-1 rounded-lg">
          <Sparkles className="w-3.5 h-3.5 text-jodhpur-600" />
          <span>Peak Demand Surge Expected: 11:30 AM & 5:00 PM</span>
        </div>
        <span className="text-slate-400 font-semibold">Updated 2 mins ago via Real-Time Telemetry</span>
      </div>

    </div>
  );
}
