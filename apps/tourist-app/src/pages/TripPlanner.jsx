import { useState } from 'react';
import MapView from '../components/MapView';
import VoiceInput from '../components/VoiceInput';
import ItineraryCard from '../components/ItineraryCard';
import { optimizeTrip, submitVoiceIntent } from '../services/api';

export default function TripPlanner() {
  const [stops, setStops] = useState(['Pune', 'Lonavala', 'Mahabaleshwar']);
  const [optimized, setOptimized] = useState(null);

  const handleTranscript = async (text) => {
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
      <VoiceInput onTranscript={handleTranscript} />
      <ItineraryCard stops={stops} onReorder={() => {}} />
      <button onClick={handleOptimize} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
        Optimize Route
      </button>
      {optimized && <pre className="mt-4 bg-gray-100 p-4 rounded">{JSON.stringify(optimized, null, 2)}</pre>}
      <MapView pins={[{ coords: [73.8563, 18.5204], name: 'Pune' }]} />
    </div>
  );
}
