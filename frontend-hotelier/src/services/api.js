import {
  HOTELIER_DESTINATIONS,
  getHotelierDestinationById,
  generate48hForecast,
  generate7dForecast
} from '../data/hotelierData';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/realtime/ws';

export { HOTELIER_DESTINATIONS, getHotelierDestinationById, generate48hForecast, generate7dForecast };

export async function fetchHotelierOverview(destinationId = 'jaipur', propertyId = null) {
  const dest = getHotelierDestinationById(destinationId);
  const selectedProp = (dest.properties || []).find(p => p.id === propertyId) || dest.properties[0];

  try {
    const url = propertyId 
      ? `${BACKEND_URL}/hotelier/overview?property_id=${propertyId}`
      : `${BACKEND_URL}/hotelier/overview`;
    const res = await fetch(url);
    if (res.ok) {
      const serverData = await res.json();
      return {
        ...serverData,
        destination: dest,
        property: serverData.property || selectedProp
      };
    }
  } catch (err) {
    console.warn('Backend offline, using universal embedded hotelier dataset', err);
  }

  // Universal client-side fallback
  const forecast_7d = generate7dForecast(selectedProp.occupancy_rate_pct, selectedProp.base_adr_inr);
  const hourly_48h = generate48hForecast(selectedProp.occupancy_rate_pct, selectedProp.base_adr_inr);

  return {
    destination: dest,
    property: selectedProp,
    all_properties: dest.properties,
    all_destinations: HOTELIER_DESTINATIONS,
    kpis: {
      occupancy_rate_pct: selectedProp.occupancy_rate_pct,
      rooms_booked: selectedProp.rooms_booked,
      total_rooms: selectedProp.total_rooms,
      current_adr_inr: selectedProp.base_adr_inr,
      suggested_adr_inr: selectedProp.suggested_adr_inr,
      potential_rev_gain_inr: selectedProp.potential_rev_gain_inr,
      revpar_inr: selectedProp.revpar_inr,
      destination_influx_index: dest.destination_influx_index,
      active_alerts_count: dest.active_alerts_count
    },
    pois: dest.pois,
    forecast_7d,
    hourly_48h,
    dispersal_recommendations: dest.dispersal_recommendations
  };
}

export async function triggerSimulationEvent(eventType, payload = {}) {
  try {
    const res = await fetch(`${BACKEND_URL}/realtime/events/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: eventType,
        ...payload
      })
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Simulation API offline, simulating locally', err);
  }
  return { status: 'mock_triggered', event_type: eventType };
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
        retryTimer = setTimeout(connect, 5000);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {
      retryTimer = setTimeout(connect, 5000);
    }
  }

  connect();

  return () => {
    if (retryTimer) clearTimeout(retryTimer);
    if (ws) ws.close();
  };
}
