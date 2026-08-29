import React, { useState } from 'react';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, Calendar, Clock, Sparkles } from 'lucide-react';

export default function ForecastCharts({ forecast7d = [], hourly48h = [] }) {
  const [activeTab, setActiveTab] = useState('hourly'); // 'hourly' or '7day'

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      
      {/* Header & Tab Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-base">Demand & Footfall Intelligence</h3>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-jodhpur-950 text-jodhpur-300 border border-jodhpur-800">
              Prophet + LightGBM
            </span>
          </div>
          <p className="text-xs text-slate-400">Recursive multi-step time-series forecasting</p>
        </div>

        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('hourly')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'hourly'
                ? 'bg-gradient-to-r from-jodhpur-600 to-jodhpur-700 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>48h Footfall Curve</span>
          </button>

          <button
            onClick={() => setActiveTab('7day')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === '7day'
                ? 'bg-gradient-to-r from-jodhpur-600 to-jodhpur-700 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>7-Day Occupancy</span>
          </button>
        </div>
      </div>

      {/* Charts Body */}
      <div className="h-72 w-full pt-2">
        {activeTab === 'hourly' ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourly48h} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorFootfall" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorUpper" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="upper_bound" stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 3" fillOpacity={1} fill="url(#colorUpper)" name="Upper Confidence Band" />
              <Area type="monotone" dataKey="predicted_footfall" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorFootfall)" name="Predicted Footfall" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecast7d} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[40, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              <Line type="monotone" dataKey="predicted_occupancy_pct" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} name="Predicted Occupancy (%)" />
              <Line type="monotone" dataKey="predicted_city_footfall_k" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: '#f59e0b' }} name="City Footfall (k)" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
}

