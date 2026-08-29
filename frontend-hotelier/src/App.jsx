import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import KPICards from './components/KPICards';
import DestinationHeatmap from './components/DestinationHeatmap';
import ForecastCharts from './components/ForecastCharts';
import DynamicPricing from './components/DynamicPricing';
import DispersalAdvisor from './components/DispersalAdvisor';
import LiveIncidentFeed from './components/LiveIncidentFeed';
import { fetchHotelierOverview, subscribeToRealtimeEvents } from './services/api';

export default function App() {
  const [selectedPropertyId, setSelectedPropertyId] = useState('c1000000-0000-0000-0000-000000000001');
  const [dashboardData, setDashboardData] = useState(null);
  const [eventsList, setEventsList] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load dashboard overview on property change
  useEffect(() => {
    loadOverview(selectedPropertyId);
  }, [selectedPropertyId]);

  // Real-time WebSocket subscription
  useEffect(() => {
    const cleanup = subscribeToRealtimeEvents((event) => {
      setWsConnected(true);
      if (event.event_type && event.event_type !== 'connection_established') {
        setEventsList(prev => [event, ...prev.slice(0, 19)]);
      }
    });
    return cleanup;
  }, []);

  const loadOverview = async (propId) => {
    setIsLoading(true);
    try {
      const data = await fetchHotelierOverview(propId);
      setDashboardData(data);
    } catch (err) {
      console.error('Error loading hotelier data', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      
      {/* Top Navbar */}
      <Navbar
        selectedPropertyId={selectedPropertyId}
        onSelectProperty={(id) => setSelectedPropertyId(id)}
        allProperties={dashboardData?.all_properties || []}
        wsConnected={wsConnected}
        unreadAlertCount={eventsList.length}
        onOpenAlerts={() => {}}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Row 1: Executive KPI Cards */}
        <KPICards
          kpis={dashboardData?.kpis || {}}
          property={dashboardData?.property || {}}
        />

        {/* Row 2: Analytics & Operations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (7 cols): Map & Demand Charts */}
          <div className="lg:col-span-7 space-y-6">
            <DestinationHeatmap
              property={dashboardData?.property || {}}
            />

            <ForecastCharts
              forecast7d={dashboardData?.forecast_7d || []}
              hourly48h={dashboardData?.hourly_48h || []}
            />
          </div>

          {/* Right Column (5 cols): Dynamic Pricing, Dispersal Advisor & Live Ticker */}
          <div className="lg:col-span-5 space-y-6">
            <DynamicPricing
              kpis={dashboardData?.kpis || {}}
              property={dashboardData?.property || {}}
            />

            <DispersalAdvisor
              recommendations={dashboardData?.dispersal_recommendations || []}
            />

            <LiveIncidentFeed
              events={eventsList}
            />
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-center py-4 text-xs text-slate-500">
        <p>SARATHI Destination Intelligence & Yield Platform • Built for Student Innovation Hackathon 2026</p>
      </footer>

    </div>
  );
}

