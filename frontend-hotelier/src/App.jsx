import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import AdminHeader from './components/AdminHeader';
import KPICards from './components/KPICards';
import DestinationHeatmap from './components/DestinationHeatmap';
import ForecastCharts from './components/ForecastCharts';
import DynamicPricing from './components/DynamicPricing';
import DispersalAdvisor from './components/DispersalAdvisor';
import LiveIncidentFeed from './components/LiveIncidentFeed';
import SimulateIncidentModal from './components/SimulateIncidentModal';
import PropertyPickerModal from './components/PropertyPickerModal';
import {
  fetchHotelierOverview,
  subscribeToRealtimeEvents,
  triggerSimulationEvent,
  HOTELIER_DESTINATIONS
} from './services/api';

export default function App() {
  // Navigation view: 'overview' | 'heatmap' | 'forecast' | 'pricing' | 'dispersal' | 'incidents'
  const [activeView, setActiveView] = useState('overview');

  // Active Destination and Property selection
  const [activeDestinationId, setActiveDestinationId] = useState('jaipur');
  const [selectedPropertyId, setSelectedPropertyId] = useState('prop-jaipur-1');

  // Loaded Dashboard Data
  const [dashboardData, setDashboardData] = useState(null);
  const [eventsList, setEventsList] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);

  // Load overview data whenever destination or property changes
  useEffect(() => {
    loadOverview(activeDestinationId, selectedPropertyId);
  }, [activeDestinationId, selectedPropertyId]);

  // Real-time WebSocket subscription
  useEffect(() => {
    const cleanup = subscribeToRealtimeEvents((event) => {
      setWsConnected(true);
      if (event.event_type && event.event_type !== 'connection_established') {
        setEventsList(prev => [event, ...prev.slice(0, 24)]);
      }
    });
    return cleanup;
  }, []);

  const loadOverview = async (destId, propId) => {
    setIsLoading(true);
    try {
      const data = await fetchHotelierOverview(destId, propId);
      setDashboardData(data);
    } catch (err) {
      console.error('Error loading hotelier data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPropertyAndDestination = (destId, propId) => {
    setActiveDestinationId(destId);
    setSelectedPropertyId(propId);
  };

  const handleTriggerSimulation = async (eventType) => {
    const simulatedPayload = {
      event_type: eventType,
      timestamp: new Date().toISOString(),
      payload: {
        headline: eventType === 'crowd_spike'
          ? 'Amber Fort Saturation Surge (92%)'
          : (eventType === 'hotel_demand_spike' ? 'Weekend Festival Demand Spike (+38%)' : 'Heatwave Advisory (41°C)'),
        message: eventType === 'crowd_spike'
          ? 'Extreme crowd density detected in Amer corridor. Rerouting suggested via Albert Hall.'
          : 'High regional hotel inquiries. Yield optimization recommended.',
        alternative_poi_name: 'Albert Hall Museum',
        reroute_benefit_mins: 45
      }
    };

    // Add directly to live feed
    setEventsList(prev => [simulatedPayload, ...prev.slice(0, 24)]);

    // Send to backend endpoint
    await triggerSimulationEvent(eventType, simulatedPayload);
  };

  const activeDestination = dashboardData?.destination || HOTELIER_DESTINATIONS[0];
  const activeProperty = dashboardData?.property || activeDestination.properties[0];

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 antialiased font-sans">
      
      {/* 1. Left Navigation Rail */}
      <Sidebar
        activeView={activeView}
        onSelectView={(v) => setActiveView(v)}
        onOpenSimulate={() => setIsSimulateModalOpen(true)}
        alertCount={eventsList.length}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col md:pl-16 lg:pl-18 min-w-0">
        
        {/* 2. Top Admin Header with Search Capsule & Status */}
        <AdminHeader
          destination={activeDestination}
          property={activeProperty}
          onOpenPropertyModal={() => setIsPropertyModalOpen(true)}
          onOpenSimulateModal={() => setIsSimulateModalOpen(true)}
          onOpenYieldOptimizer={() => setActiveView('pricing')}
          onOpenAlerts={() => setActiveView('incidents')}
          alertCount={eventsList.length}
          wsConnected={wsConnected}
        />

        {/* 3. Main Dashboard Workspace */}
        <main className="flex-1 max-w-[1750px] w-full mx-auto px-4 sm:px-6 py-5 space-y-6">
          
          {/* Executive KPI Metric Ribbon */}
          <KPICards
            kpis={dashboardData?.kpis || {}}
            property={activeProperty}
          />

          {/* VIEW 1: Full Executive Pulse (Overview) */}
          {activeView === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column (7 Cols): Heatmap & Demand Forecast Curve */}
              <div className="lg:col-span-7 space-y-6">
                <DestinationHeatmap
                  property={activeProperty}
                  pois={dashboardData?.pois || []}
                  destination={activeDestination}
                />

                <ForecastCharts
                  forecast7d={dashboardData?.forecast_7d || []}
                  hourly48h={dashboardData?.hourly_48h || []}
                />
              </div>

              {/* Right Column (5 Cols): Dynamic Yield, Dispersal & Live Ticker */}
              <div className="lg:col-span-5 space-y-6">
                <DynamicPricing
                  kpis={dashboardData?.kpis || {}}
                  property={activeProperty}
                />

                <DispersalAdvisor
                  recommendations={dashboardData?.dispersal_recommendations || []}
                />

                <LiveIncidentFeed
                  events={eventsList}
                  onOpenSimulate={() => setIsSimulateModalOpen(true)}
                />
              </div>

            </div>
          )}

          {/* VIEW 2: Dedicated Corridor Heatmap View */}
          {activeView === 'heatmap' && (
            <div className="space-y-6 animate-fade-in">
              <DestinationHeatmap
                property={activeProperty}
                pois={dashboardData?.pois || []}
                destination={activeDestination}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(dashboardData?.pois || []).map(poi => (
                  <div key={poi.id} className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400">{poi.category}</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                        poi.status === 'Surge' ? 'bg-rose-100 text-rose-800' : (poi.status === 'Moderate' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800')
                      }`}>
                        {poi.status}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900">{poi.name}</h4>
                    <div className="text-xs text-slate-500 flex items-center justify-between pt-1">
                      <span>Live Density:</span>
                      <strong className="text-slate-900">{poi.crowd.toLocaleString()} / {poi.capacity.toLocaleString()}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 3: Predictive Analytics & Demand Forecast View */}
          {activeView === 'forecast' && (
            <div className="space-y-6 animate-fade-in">
              <ForecastCharts
                forecast7d={dashboardData?.forecast_7d || []}
                hourly48h={dashboardData?.hourly_48h || []}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(dashboardData?.forecast_7d || []).slice(0, 4).map((d, i) => (
                  <div key={i} className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-slate-900">{d.day} ({d.date})</span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-jodhpur-50 text-jodhpur-800">
                        {d.demand_tier}
                      </span>
                    </div>
                    <div className="text-2xl font-black text-slate-950">{d.predicted_occupancy_pct}%</div>
                    <p className="text-xs text-slate-500 font-medium">Suggested ADR: <strong className="text-amber-700">₹{d.suggested_rate_inr.toLocaleString()}</strong></p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 4: Dynamic Yield & ADR Optimizer */}
          {activeView === 'pricing' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
              <DynamicPricing
                kpis={dashboardData?.kpis || {}}
                property={activeProperty}
              />
            </div>
          )}

          {/* VIEW 5: Dispersal Campaigns & Revenue Advisor */}
          {activeView === 'dispersal' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
              <DispersalAdvisor
                recommendations={dashboardData?.dispersal_recommendations || []}
              />
            </div>
          )}

          {/* VIEW 6: Live Incident Telemetry */}
          {activeView === 'incidents' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
              <LiveIncidentFeed
                events={eventsList}
                onOpenSimulate={() => setIsSimulateModalOpen(true)}
              />
            </div>
          )}

        </main>

      </div>

      {/* 4. Universal Modals */}
      
      {/* Property & Destination Switcher Dialog */}
      <PropertyPickerModal
        isOpen={isPropertyModalOpen}
        onClose={() => setIsPropertyModalOpen(false)}
        currentDestinationId={activeDestinationId}
        currentPropertyId={selectedPropertyId}
        onSelectPropertyAndDestination={handleSelectPropertyAndDestination}
      />

      {/* Real-Time Simulation Studio Dialog */}
      <SimulateIncidentModal
        isOpen={isSimulateModalOpen}
        onClose={() => setIsSimulateModalOpen(false)}
        onTriggerSimulation={handleTriggerSimulation}
        destinationName={activeDestination.name}
      />

    </div>
  );
}
