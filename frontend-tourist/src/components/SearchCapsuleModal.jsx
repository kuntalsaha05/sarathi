import React, { useState } from 'react';
import { MapPin, Calendar, Users, DollarSign, X, Sparkles, Check, Search, Globe } from 'lucide-react';
import { UNIVERSAL_DESTINATIONS, searchDestinations, synthesizeCustomDestination } from '../data/destinationsData';

export default function SearchCapsuleModal({
  isOpen,
  onClose,
  initialTab = 'where',
  destination,
  onSelectDestination,
  startTime = '09:00',
  setStartTime,
  maxHours = 8,
  setMaxHours,
  travelers = '2 Travelers',
  setTravelers,
  budget = 'Balanced (₹₹)',
  setBudget,
  onApplySearch
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [citySearch, setCitySearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('All');

  if (!isOpen) return null;

  const filteredDestinations = UNIVERSAL_DESTINATIONS.filter(d => {
    const matchesSearch = citySearch.trim() === ''
      || d.name.toLowerCase().includes(citySearch.toLowerCase())
      || d.country.toLowerCase().includes(citySearch.toLowerCase())
      || d.region.toLowerCase().includes(citySearch.toLowerCase());

    const matchesCountry = countryFilter === 'All'
      || (countryFilter === 'India' && d.country === 'India')
      || (countryFilter === 'Global' && d.country !== 'India');

    return matchesSearch && matchesCountry;
  });

  const handleCustomCitySubmit = (e) => {
    e.preventDefault();
    if (!citySearch.trim()) return;
    const customDest = synthesizeCustomDestination(citySearch.trim());
    onSelectDestination(customDest);
    setActiveTab('when');
  };

  const partyOptions = [
    { label: 'Solo Traveler', icon: '👤', count: '1 Traveler' },
    { label: 'Couple / Pair', icon: '👥', count: '2 Travelers' },
    { label: 'Family with Kids', icon: '👨‍👩‍👧', count: '3-5 Family' },
    { label: 'Group Friends', icon: '🎉', count: '6+ Group' }
  ];

  const budgetOptions = [
    { label: 'Budget Friendly', tier: 'Economy (₹)', desc: 'Standard entry, public / auto transit' },
    { label: 'Balanced Experience', tier: 'Balanced (₹₹)', desc: 'Cab transit, palace audio guides, dining' },
    { label: 'Royal & Luxury', tier: 'Luxury (₹₹₹)', desc: 'Private AC chauffeur, VIP palace access' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-start justify-center pt-16 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Tab Capsule Header */}
        <div className="bg-slate-50 p-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 text-xs font-bold w-full max-w-md">
            <button
              onClick={() => setActiveTab('where')}
              className={`flex-1 py-1.5 px-3 rounded-xl transition ${
                activeTab === 'where' ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Where
            </button>
            <button
              onClick={() => setActiveTab('when')}
              className={`flex-1 py-1.5 px-3 rounded-xl transition ${
                activeTab === 'when' ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              When
            </button>
            <button
              onClick={() => setActiveTab('who')}
              className={`flex-1 py-1.5 px-3 rounded-xl transition ${
                activeTab === 'who' ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Who
            </button>
            <button
              onClick={() => setActiveTab('budget')}
              className={`flex-1 py-1.5 px-3 rounded-xl transition ${
                activeTab === 'budget' ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Budget
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 transition ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          
          {/* TAB 1: WHERE (Universal Destination Search) */}
          {activeTab === 'where' && (
            <div className="space-y-4">
              
              {/* Search Bar */}
              <form onSubmit={handleCustomCitySubmit} className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  placeholder="Search any destination worldwide (e.g. Paris, Tokyo, Varanasi, Goa, Rome)..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-24 text-xs sm:text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-jodhpur-600"
                />
                {citySearch.trim() && (
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-950 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl hover:bg-slate-800 transition"
                  >
                    Go →
                  </button>
                )}
              </form>

              {/* Country Region Filter Chips */}
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <button
                  onClick={() => setCountryFilter('All')}
                  className={`px-3 py-1 rounded-full transition ${
                    countryFilter === 'All' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Destinations
                </button>
                <button
                  onClick={() => setCountryFilter('India')}
                  className={`px-3 py-1 rounded-full transition ${
                    countryFilter === 'India' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  🇮🇳 Incredible India
                </button>
                <button
                  onClick={() => setCountryFilter('Global')}
                  className={`px-3 py-1 rounded-full transition ${
                    countryFilter === 'Global' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  🌍 World Capitals
                </button>
              </div>

              {/* Destinations Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {filteredDestinations.map((d) => {
                  const isSelected = destination?.id === d.id;
                  return (
                    <div
                      key={d.id}
                      onClick={() => {
                        onSelectDestination(d);
                        setActiveTab('when');
                      }}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-jodhpur-50 border-jodhpur-500 ring-2 ring-jodhpur-500/20 shadow-xs'
                          : 'bg-slate-50 hover:bg-white border-slate-200/90 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={d.image} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-xs text-slate-900">{d.name}</span>
                            <span className="text-xs">{d.flag}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 block">{d.region}, {d.country}</span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-jodhpur-600" />}
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 2: WHEN */}
          {activeTab === 'when' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Departure Time ({destination?.name})
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['08:00', '09:00', '10:00', '14:00'].map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setStartTime(time)}
                      className={`p-3 rounded-2xl font-bold border transition ${
                        startTime === time
                          ? 'bg-jodhpur-50 border-jodhpur-500 text-jodhpur-950 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {time === '08:00' && '🌅 08:00 AM (Early)'}
                      {time === '09:00' && '☀️ 09:00 AM (Optimal)'}
                      {time === '10:00' && '☕ 10:00 AM'}
                      {time === '14:00' && '🌇 02:00 PM (Afternoon)'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-slate-500 uppercase tracking-wider">Duration Budget</span>
                  <span className="text-jodhpur-700 font-extrabold">{maxHours} Hours</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="12"
                  step="1"
                  value={maxHours}
                  onChange={(e) => setMaxHours(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-jodhpur-600"
                />
              </div>
            </div>
          )}

          {/* TAB 3: WHO */}
          {activeTab === 'who' && (
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                Travel Party
              </label>
              {partyOptions.map((party, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTravelers(party.count)}
                  className={`w-full p-3 rounded-2xl border text-left text-xs font-bold transition flex items-center justify-between ${
                    travelers === party.count
                      ? 'bg-jodhpur-50 border-jodhpur-500 text-jodhpur-950 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{party.icon}</span>
                    <span>{party.label}</span>
                  </div>
                  {travelers === party.count && <Check className="w-4 h-4 text-jodhpur-600" />}
                </button>
              ))}
            </div>
          )}

          {/* TAB 4: BUDGET */}
          {activeTab === 'budget' && (
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                Budget Tier ({destination?.currency || '₹'})
              </label>
              {budgetOptions.map((b, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setBudget(b.tier)}
                  className={`w-full p-3 rounded-2xl border text-left text-xs transition flex items-center justify-between ${
                    budget === b.tier
                      ? 'bg-jodhpur-50 border-jodhpur-500 text-jodhpur-950 shadow-xs font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <h4 className="font-extrabold text-slate-900">{b.label} ({b.tier})</h4>
                    <p className="text-[11px] text-slate-500 font-normal">{b.desc}</p>
                  </div>
                  {budget === b.tier && <Check className="w-4 h-4 text-jodhpur-600" />}
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Footer CTA */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 px-3 py-2"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onApplySearch();
              onClose();
            }}
            className="flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-white font-black px-5 py-2.5 rounded-2xl text-xs shadow-md active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Generate Itinerary in {destination?.name || 'City'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
