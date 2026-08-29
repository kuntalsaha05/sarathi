import { useState } from 'react';
import TouristMapView from '../components/MapView';
import ItineraryTimeline from '../components/ItineraryTimeline';
import VoiceAssistantModal from '../components/VoiceAssistantModal';
import DisruptionAlert from '../components/DisruptionAlert';
import { optimizeTrip, submitVoiceIntent } from '../services/api';

export default function TripPlanner() {
  const [stops, setStops] = useState(['Pune', 'Lonavala', 'Mahabaleshwar']);
  const [optimized, setOptimized] = React.useState(null);
  const [showVoice, setShowVoice] = React.useState(false);

  const handleTranscript = async (text) => {
    if (!text) return;
    const intent = await submitVoiceIntent(new File([], 'audio.wav'));
    console.log('Transcript:', intent);
  };

  const handleOptimize = async () => {
    const res = await optimizeTrip({
      origin: stops[0],
      destination: stops[stops.length - 1],
      waypoints: stops.slice(1, -1),
      constraints: {},
      start_time: new Date().toISOString(),
    });
    setOptimized(res);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Trip Planner</h2>
      <button onClick={() => setShowVoice(true)} className="mb-4 bg-blue-600 text-white px-4 py-2 rounded">
        🎙️ Voice Assistant
      </button>
      {showVoice && <VoiceAssistantModal onTranscript={(t) => { handleTranscript(t); setShowVoice(false); }} />}
      <ItineraryTimeline stops={stops} onReorder={() => {}} />
      <button onClick={handleOptimize} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
        Optimize Route
      </button>
      {optimized && <pre className="mt-4 bg-gray-100 p-4 rounded">{JSON.stringify(optimized, null, 2)}</pre>}
      <TouristMapView pins={[{ coords: [73.8563, 18.5204], name: 'Pune' }]} onRerouteAccepted={() => {}} />
      <DisruptionAlert tripId="demo-trip-001" />
    </div>
  );
}
