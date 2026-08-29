import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MindtripHeader from './components/MindtripHeader';
import ChatAssistant from './components/ChatAssistant';
import DestinationHero from './components/DestinationHero';
import VisualTimeline from './components/VisualTimeline';
import ExploreView from './components/ExploreView';
import SavedView from './components/SavedView';
import InspirationView from './components/InspirationView';
import TripsView from './components/TripsView';
import InteractiveMap from './components/InteractiveMap';
import LiveRerouteToast from './components/LiveRerouteToast';
import PlaceDetailModal from './components/PlaceDetailModal';
import TripCustomizerModal from './components/TripCustomizerModal';
import SearchCapsuleModal from './components/SearchCapsuleModal';
import VoiceModal from './components/VoiceModal';
import { UNIVERSAL_DESTINATIONS, getDestinationById, planTripApi, subscribeToRealtimeEvents, parseVoiceQueryApi, synthesizeCustomDestination } from './services/api';

export default function App() {
  // Navigation view state: 'chat' | 'trips' | 'explore' | 'saved' | 'inspiration'
  const [activeView, setActiveView] = useState('chat');

  // Active Universal Destination (defaults to Jaipur, easily switches to any world/Indian city)
  const [activeDestination, setActiveDestination] = useState(UNIVERSAL_DESTINATIONS[0]);

  // Search capsule & trip constraints state
  const [startTime, setStartTime] = useState('09:00');
  const [maxHours, setMaxHours] = useState(8);
  const [travelers, setTravelers] = useState('2 Travelers');
  const [budget, setBudget] = useState('Balanced (₹₹)');
  const [avoidCrowds, setAvoidCrowds] = useState(true);

  // Selected POIs in current active itinerary
  const [selectedPoiIds, setSelectedPoiIds] = useState(
    (UNIVERSAL_DESTINATIONS[0].places || []).map(p => p.id)
  );

  // Saved / Bookmarked POIs across all destinations
  const [savedPoiIds, setSavedPoiIds] = useState([
    UNIVERSAL_DESTINATIONS[0].places[0].id,
    UNIVERSAL_DESTINATIONS[1].places[0].id,
    UNIVERSAL_DESTINATIONS[2].places[0].id
  ]);

  // Chat message stream
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      text: `Namaste & Welcome! I am SARATHI, your universal AI travel companion. I have loaded an optimized crowd-weighted itinerary for ${UNIVERSAL_DESTINATIONS[0].name}, ${UNIVERSAL_DESTINATIONS[0].country}. You can switch to any destination worldwide (Paris, Tokyo, Rome, Varanasi, New York, Goa...) anytime!`
    }
  ]);

  const [tripPlan, setTripPlan] = useState(null);
  const [activePoiId, setActivePoiId] = useState(null);
  const [selectedPlaceModal, setSelectedPlaceModal] = useState(null);
  
  // Modals visibility
  const [isCapsuleModalOpen, setIsCapsuleModalOpen] = useState(false);
  const [capsuleInitialTab, setCapsuleInitialTab] = useState('where');
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  
  // Real-time telemetry & reroute state
  const [activeAlert, setActiveAlert] = useState(null);
  const [isRerouting, setIsRerouting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);

  // Initial plan load
  useEffect(() => {
    handleGeneratePlan(activeDestination, selectedPoiIds);
  }, []);

  // Real-time WebSocket telemetry listener
  useEffect(() => {
    const cleanup = subscribeToRealtimeEvents((event) => {
      setWsConnected(true);
      if (event.event_type === 'crowd_spike' || event.event_type === 'weather_alert') {
        setActiveAlert(event);
      }
    });
    return cleanup;
  }, []);

  const handleSelectDestination = (newDest) => {
    setActiveDestination(newDest);
    const newPoiIds = (newDest.places || []).map(p => p.id);
    setSelectedPoiIds(newPoiIds);
    handleGeneratePlan(newDest, newPoiIds);

    setChatMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        text: `🌍 Switched destination to ${newDest.name} (${newDest.country} ${newDest.flag}). Generated a localized, crowd-optimized circuit with ${newPoiIds.length} top sights!`
      }
    ]);
  };

  const handleGeneratePlan = async (destinationToUse = activeDestination, customPois = null) => {
    setIsLoading(true);
    try {
      const plan = await planTripApi({
        destination: destinationToUse,
        startTime,
        maxTripHours: maxHours,
        avoidCrowds,
        poiIds: customPois || selectedPoiIds
      });
      setTripPlan(plan);
    } catch (err) {
      console.error('Failed to generate trip plan', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyReroute = async (alert) => {
    if (!alert?.payload?.alternative_poi_id) return;
    setIsRerouting(true);

    const crowdedPoiId = alert.poi_id;
    const newPoiId = alert.payload.alternative_poi_id;

    const updated = selectedPoiIds
      .filter(id => id !== crowdedPoiId)
      .concat(newPoiId);

    setSelectedPoiIds(updated);

    try {
      const newPlan = await planTripApi({
        destination: activeDestination,
        startTime,
        maxTripHours: maxHours,
        avoidCrowds: true,
        poiIds: updated
      });
      setTripPlan(newPlan);
      setActiveAlert(null); // Dismiss toast on reroute success

      setChatMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `⚡ Adaptive Reroute Applied in ${activeDestination.name}: Replaced ${alert.poi_name} with ${alert.payload.alternative_poi_name}. Saved ~${alert.payload.reroute_benefit_mins || 45} mins of queue waiting!`
        }
      ]);
    } catch (err) {
      console.error('Reroute failed', err);
    } finally {
      setIsRerouting(false);
    }
  };

  const handleChatQuery = async (queryText) => {
    setChatMessages(prev => [...prev, { role: 'user', text: queryText }]);
    setIsLoading(true);

    try {
      const intent = await parseVoiceQueryApi(queryText);
      
      // If query specifies a new destination, switch to it
      let currentDest = activeDestination;
      if (intent.destination_id && intent.destination_id !== activeDestination.id) {
        const found = getDestinationById(intent.destination_id);
        if (found) {
          currentDest = found;
          setActiveDestination(found);
        }
      }

      if (intent.start_time) setStartTime(intent.start_time);
      if (intent.max_trip_hours) setMaxHours(intent.max_trip_hours);
      if (intent.avoid_crowds !== undefined) setAvoidCrowds(intent.avoid_crowds);

      const poisToRun = intent.matched_poi_ids && intent.matched_poi_ids.length > 0
        ? intent.matched_poi_ids
        : (currentDest.places || []).map(p => p.id);

      setSelectedPoiIds(poisToRun);
      await handleGeneratePlan(currentDest, poisToRun);

      setChatMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `✨ I've tailored your itinerary for ${currentDest.name}! Included ${poisToRun.length} sights, departure set to ${intent.start_time || startTime}, optimized with TD-VRPTW crowd penalties.`
        }
      ]);
      setActiveView('chat');
    } catch (err) {
      console.error('Error processing chat query', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSaved = (poiId) => {
    if (savedPoiIds.includes(poiId)) {
      setSavedPoiIds(savedPoiIds.filter(id => id !== poiId));
    } else {
      setSavedPoiIds([...savedPoiIds, poiId]);
    }
  };

  const handleIncludeInTrip = (poiId) => {
    if (selectedPoiIds.includes(poiId)) {
      if (selectedPoiIds.length > 1) {
        const updated = selectedPoiIds.filter(id => id !== poiId);
        setSelectedPoiIds(updated);
        handleGeneratePlan(activeDestination, updated);
      }
    } else {
      const updated = [...selectedPoiIds, poiId];
      setSelectedPoiIds(updated);
      handleGeneratePlan(activeDestination, updated);
    }
  };

  const handleApplyInspirationStory = (poiIds, storyTitle) => {
    setSelectedPoiIds(poiIds);
    handleGeneratePlan(activeDestination, poiIds);
    setChatMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        text: `🧭 Applied Circuit: "${storyTitle}". Loaded ${poiIds.length} sights for ${activeDestination.name} into your synchronized timeline.`
      }
    ]);
    setActiveView('chat');
  };

  const handleOpenCapsule = (tab) => {
    setCapsuleInitialTab(tab);
    setIsCapsuleModalOpen(true);
  };

  const triggerSimulatedSurge = () => {
    const firstPlace = activeDestination.places?.[0] || { name: 'Main Landmark', id: 'poi_1' };
    const secondPlace = activeDestination.places?.[1] || { name: 'Alternative Sight', id: 'poi_2' };

    setActiveAlert({
      event_type: 'crowd_spike',
      poi_id: firstPlace.id,
      poi_name: firstPlace.name,
      payload: {
        headline: `Sudden Influx at ${firstPlace.name} (+72%)`,
        message: `Footfall has spiked past carrying capacity. SARATHI suggests rerouting via ${secondPlace.name}.`,
        alternative_poi_name: secondPlace.name,
        alternative_poi_id: secondPlace.id,
        reroute_benefit_mins: 40
      }
    });
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 antialiased font-sans">
      
      {/* 1. Universal Left Navigation Rail */}
      <Sidebar
        activeView={activeView}
        onSelectView={(v) => setActiveView(v)}
        onOpenCreateTrip={() => handleOpenCapsule('where')}
        savedCount={savedPoiIds.length}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col md:pl-16 lg:pl-18 min-w-0">
        
        {/* 2. Universal Top Header with Search Capsule */}
        <MindtripHeader
          destination={activeDestination}
          startTime={startTime}
          travelers={travelers}
          budget={budget}
          onOpenCapsuleModal={handleOpenCapsule}
          onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
          onOpenCreateTrip={() => handleOpenCapsule('where')}
          onShareTrip={() => alert(`Trip to ${activeDestination.name} copied! Ready to share with fellow travelers.`)}
          wsConnected={wsConnected}
        />

        {/* 3. Universal Split-Screen Container */}
        <main className="flex-1 max-w-[1750px] w-full mx-auto px-4 sm:px-6 py-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT FEED PANEL (7 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* VIEW 1: AI Chat & Dynamic Itinerary */}
              {activeView === 'chat' && (
                <>
                  <ChatAssistant
                    onSendMessage={handleChatQuery}
                    onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
                    isLoading={isLoading}
                    messages={chatMessages}
                  />

                  <DestinationHero
                    destination={activeDestination}
                    tripPlan={tripPlan}
                    startTime={startTime}
                    maxHours={maxHours}
                    onTriggerSurgeDemo={triggerSimulatedSurge}
                    onOpenCityPicker={() => handleOpenCapsule('where')}
                  />

                  <VisualTimeline
                    stops={tripPlan?.stops || []}
                    activePoiId={activePoiId}
                    onHoverPoi={(id) => setActivePoiId(id)}
                    onLeavePoi={() => setActivePoiId(null)}
                    onSelectPoi={(place) => setSelectedPlaceModal(place)}
                    onOpenAudio={(place) => setSelectedPlaceModal(place)}
                  />
                </>
              )}

              {/* VIEW 2: Trips Management Dashboard */}
              {activeView === 'trips' && (
                <TripsView
                  destination={activeDestination}
                  tripPlan={tripPlan}
                  activePoiId={activePoiId}
                  onHoverPoi={(id) => setActivePoiId(id)}
                  onLeavePoi={() => setActivePoiId(null)}
                  onSelectPoi={(place) => setSelectedPlaceModal(place)}
                  onOpenAudio={(place) => setSelectedPlaceModal(place)}
                  onOpenCustomizer={() => setIsCustomizerOpen(true)}
                  onOpenCreateTrip={() => handleOpenCapsule('where')}
                />
              )}

              {/* VIEW 3: Explore All Places Catalog */}
              {activeView === 'explore' && (
                <ExploreView
                  destination={activeDestination}
                  onSelectDestination={handleSelectDestination}
                  onSelectPlace={(place) => setSelectedPlaceModal(place)}
                  onToggleSaved={handleToggleSaved}
                  savedPoiIds={savedPoiIds}
                  onIncludeInTrip={handleIncludeInTrip}
                  includedPoiIds={selectedPoiIds}
                />
              )}

              {/* VIEW 4: Saved Favorites Wishlist */}
              {activeView === 'saved' && (
                <SavedView
                  savedPoiIds={savedPoiIds}
                  onRemoveSaved={handleToggleSaved}
                  onSelectPlace={(place) => setSelectedPlaceModal(place)}
                  onGeneratePlanFromSaved={() => {
                    const savedPlacesInActive = (activeDestination.places || []).filter(p => savedPoiIds.includes(p.id));
                    const toRun = savedPlacesInActive.length > 0 ? savedPlacesInActive.map(p => p.id) : selectedPoiIds;
                    setSelectedPoiIds(toRun);
                    handleGeneratePlan(activeDestination, toRun);
                    setActiveView('chat');
                  }}
                />
              )}

              {/* VIEW 5: Travel Inspiration & Thematic Stories */}
              {activeView === 'inspiration' && (
                <InspirationView
                  onSelectDestination={handleSelectDestination}
                  onApplyInspirationStory={handleApplyInspirationStory}
                />
              )}

            </div>

            {/* RIGHT STICKY FULL-HEIGHT INTERACTIVE MAP (5 Cols) */}
            <div className="lg:col-span-5 lg:sticky lg:top-20 h-[550px] lg:h-[calc(100vh-6.5rem)]">
              <InteractiveMap
                stops={tripPlan?.stops || []}
                startLocation={activeDestination.coordinates}
                destinationName={activeDestination.name}
                activePoiId={activePoiId}
                onSelectPoi={(place) => setSelectedPlaceModal(place)}
              />
            </div>

          </div>
        </main>

      </div>

      {/* 4. Universal Modals & Floating Drawers */}

      {/* Search Capsule Dialog */}
      <SearchCapsuleModal
        isOpen={isCapsuleModalOpen}
        onClose={() => setIsCapsuleModalOpen(false)}
        initialTab={capsuleInitialTab}
        destination={activeDestination}
        onSelectDestination={handleSelectDestination}
        startTime={startTime}
        setStartTime={setStartTime}
        maxHours={maxHours}
        setMaxHours={setMaxHours}
        travelers={travelers}
        setTravelers={setTravelers}
        budget={budget}
        setBudget={setBudget}
        onApplySearch={() => handleGeneratePlan(activeDestination)}
      />

      {/* Floating Live Reroute Alert Drawer */}
      <LiveRerouteToast
        alert={activeAlert}
        onDismiss={() => setActiveAlert(null)}
        onApplyReroute={handleApplyReroute}
        isRerouting={isRerouting}
      />

      {/* Place Deep-Dive Sheet Modal */}
      <PlaceDetailModal
        place={selectedPlaceModal}
        onClose={() => setSelectedPlaceModal(null)}
      />

      {/* Trip Customizer Modal */}
      <TripCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        destination={activeDestination}
        startTime={startTime}
        setStartTime={setStartTime}
        maxHours={maxHours}
        setMaxHours={setMaxHours}
        avoidCrowds={avoidCrowds}
        setAvoidCrowds={setAvoidCrowds}
        selectedPoiIds={selectedPoiIds}
        setSelectedPoiIds={setSelectedPoiIds}
        onApply={() => handleGeneratePlan(activeDestination)}
      />

      {/* Voice Assistant Modal */}
      <VoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onApplyIntent={(intent) => {
          if (intent.raw_query) handleChatQuery(intent.raw_query);
        }}
      />

    </div>
  );
}
