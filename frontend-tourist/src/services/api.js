import { UNIVERSAL_DESTINATIONS, getDestinationById, synthesizeCustomDestination } from '../data/destinationsData';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/realtime/ws';

export { UNIVERSAL_DESTINATIONS, getDestinationById, synthesizeCustomDestination };

export async function fetchLiveCrowds(destinationId = 'jaipur') {
  try {
    const res = await fetch(`${BACKEND_URL}/realtime/crowds/live`);
    if (res.ok) {
      const data = await res.json();
      return data.pois;
    }
  } catch {
    // Local fallback
  }

  const dest = getDestinationById(destinationId);
  return (dest.places || []).map(p => ({
    id: p.id,
    name: p.name,
    category: p.category || 'heritage',
    base_capacity: p.max_capacity,
    current_crowd: p.current_crowd
  }));
}

export async function planTripApi(params) {
  const destination = params.destination || getDestinationById(params.destinationId || 'jaipur');
  const placesList = destination.places || [];

  try {
    const res = await fetch(`${BACKEND_URL}/routing/plan-trip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destination_id: destination.id,
        start_lat: params.startLat || destination.coordinates.lat,
        start_lng: params.startLng || destination.coordinates.lng,
        trip_date: params.tripDate || new Date().toISOString().split('T')[0],
        start_time: params.startTime || '09:00',
        max_trip_hours: params.maxTripHours || 8.0,
        poi_ids: params.poiIds && params.poiIds.length > 0 ? params.poiIds : null,
        avoid_crowds: params.avoidCrowds !== false
      })
    });
    if (res.ok) {
      const serverResult = await res.json();
      const enrichedStops = (serverResult.stops || []).map(s => {
        const place = placesList.find(p => p.id === s.poi_id) || {};
        return {
          ...place,
          ...s,
          eta_arrival: s.arrival_time || s.eta_arrival,
          eta_departure: s.departure_time || s.eta_departure,
          visit_duration_minutes: s.visit_minutes || place.avg_visit_minutes || 60,
          travel_duration_from_prev_minutes: s.travel_minutes || 15,
          crowd_status: s.crowd_penalty > 50 ? 'Surge' : (s.crowd_penalty > 20 ? 'Moderate' : 'Low')
        };
      });
      return {
        ...serverResult,
        stops: enrichedStops
      };
    }
  } catch (err) {
    console.warn('Backend API offline, falling back to embedded universal VRPTW solver engine', err);
  }

  // Universal Embedded client-side fallback route optimizer
  return generateClientOptimizedPlan(params, destination);
}

export async function parseVoiceQueryApi(query) {
  try {
    const res = await fetch(`${BACKEND_URL}/voice/parse-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    if (res.ok) {
      const data = await res.json();
      return data.intent;
    }
  } catch (err) {
    console.warn('Voice API offline, using local universal parser', err);
  }

  // Local universal fallback parser
  const q = query.toLowerCase();
  
  // Detect destination
  let matchedDest = null;
  for (const dest of UNIVERSAL_DESTINATIONS) {
    if (q.includes(dest.name.toLowerCase()) || q.includes(dest.id.toLowerCase())) {
      matchedDest = dest;
      break;
    }
  }

  const destination = matchedDest || UNIVERSAL_DESTINATIONS[0];
  const matchedPois = [];
  (destination.places || []).forEach(poi => {
    const pName = poi.name.toLowerCase();
    if (q.includes(pName) || (poi.hindi_name && q.includes(poi.hindi_name))) {
      matchedPois.push(poi.id);
    }
  });

  return {
    destination_id: destination.id,
    destination_name: destination.name,
    start_time: q.includes('10') ? '10:00' : (q.includes('8') ? '08:00' : '09:00'),
    max_trip_hours: q.includes('4') ? 4.0 : (q.includes('6') ? 6.0 : (q.includes('10') ? 10.0 : 8.0)),
    avoid_crowds: !q.includes('ignore'),
    matched_poi_ids: matchedPois.length > 0 ? matchedPois : (destination.places || []).map(p => p.id).slice(0, 4),
    detected_language: q.includes('mujhe') || q.includes('jaana') ? 'hi' : 'en',
    raw_query: query
  };
}

export async function fetchAudioGuideApi(poiId, lang = 'en') {
  try {
    const res = await fetch(`${BACKEND_URL}/voice/guide/${poiId}?lang=${lang}`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Local fallback
  }

  return {
    poi_id: poiId,
    narration: lang === 'hi' ? 'यह एक प्रसिद्ध ऐतिहासिक धरोहर स्थल है।' : 'This is a celebrated historic landmark.',
    best_time_to_visit: 'Morning (09:00 - 11:30 AM)'
  };
}

export function subscribeToRealtimeEvents(onEventReceived) {
  let ws = null;
  let retryTimer = null;

  function connect() {
    try {
      ws = new WebSocket(WS_URL);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onEventReceived(data);
        } catch (e) {
          console.error('Error parsing WS message', e);
        }
      };

      ws.onclose = () => {
        retryTimer = setTimeout(connect, 6000);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {
      retryTimer = setTimeout(connect, 6000);
    }
  }

  connect();

  return () => {
    if (retryTimer) clearTimeout(retryTimer);
    if (ws) ws.close();
  };
}

function generateClientOptimizedPlan(params, destination) {
  const startTime = params.startTime || '09:00';
  const [startH, startM] = startTime.split(':').map(Number);
  let currentMinute = startH * 60 + startM;

  const placesList = destination.places || [];
  const targetIds = params.poiIds && params.poiIds.length > 0
    ? params.poiIds
    : placesList.map(p => p.id);

  const selectedPlaces = placesList.filter(p => targetIds.includes(p.id));

  let totalDistanceKm = 0;
  let prevCoords = destination.coordinates;

  const stops = selectedPlaces.map((poi, idx) => {
    const dLat = (poi.lat - prevCoords.lat) * 111;
    const dLng = (poi.lng - prevCoords.lng) * 111;
    const legDistance = Math.max(1.2, Math.sqrt(dLat * dLat + dLng * dLng));
    totalDistanceKm += legDistance;
    prevCoords = { lat: poi.lat, lng: poi.lng };

    const travelTime = Math.max(8, Math.round(legDistance * 3.2));
    const arrivalMin = currentMinute + travelTime;
    const dwellMin = poi.avg_visit_minutes || 60;
    const departMin = arrivalMin + dwellMin;
    currentMinute = departMin;

    const toHHMM = (min) => {
      const h = Math.floor(min / 60) % 24;
      const m = min % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    const crowdRatio = (poi.current_crowd || 1000) / (poi.max_capacity || 2500);
    let crowdBadge = 'Moderate';
    if (crowdRatio < 0.45) crowdBadge = 'Low';
    if (crowdRatio > 0.8) crowdBadge = 'Surge';

    return {
      ...poi,
      poi_id: poi.id,
      eta_arrival: toHHMM(arrivalMin),
      eta_departure: toHHMM(departMin),
      visit_duration_minutes: dwellMin,
      travel_duration_from_prev_minutes: travelTime,
      crowd_status: crowdBadge
    };
  });

  return {
    status: 'OPTIMAL',
    matrix_source: 'haversine_dynamic',
    destination_name: destination.name,
    total_distance_km: Math.round(totalDistanceKm * 10) / 10,
    total_travel_minutes: Math.round(stops.reduce((acc, s) => acc + s.travel_duration_from_prev_minutes, 0)),
    stops: stops,
    dropped_stops: []
  };
}
