const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/realtime/ws';

export async function fetchHotelierOverview(propertyId = null) {
  try {
    const url = propertyId 
      ? `${BACKEND_URL}/hotelier/overview?property_id=${propertyId}`
      : `${BACKEND_URL}/hotelier/overview`;
    const res = await fetch(url);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend offline, using embedded hotelier data', err);
  }

  // Fallback mock
  return getFallbackHotelierData(propertyId);
}

export async function triggerSimulationEvent(eventType, payload = {}) {
  try {
    const res = await fetch(`${BACKEND_URL}/realtime/events/trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: eventType,
        custom_payload: payload
      })
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Error triggering event', err);
  }
  return { status: 'mock_triggered' };
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

function getFallbackHotelierData(propertyId) {
  const isAmber = propertyId === 'c1000000-0000-0000-0000-000000000002';
  const prop = isAmber ? {
    id: 'c1000000-0000-0000-0000-000000000002',
    name: 'Amber Boutique Hotel',
    destination_id: 'a1a1a1a1-0000-0000-0000-000000000001',
    total_rooms: 25,
    star_rating: 3,
    base_adr_inr: 3800,
    current_occupancy_pct: 84,
    location: { lat: 26.9800, lng: 75.8490 },
    amenities: ['wifi', 'parking', 'garden_cafe', 'fort_view'],
    nearby_pois: ['Amber Fort', 'Jal Mahal']
  } : {
    id: 'c1000000-0000-0000-0000-000000000001',
    name: 'Pink City Heritage Stay',
    destination_id: 'a1a1a1a1-0000-0000-0000-000000000001',
    total_rooms: 40,
    star_rating: 4,
    base_adr_inr: 5400,
    current_occupancy_pct: 78,
    location: { lat: 26.9200, lng: 75.8225 },
    amenities: ['wifi', 'pool', 'breakfast', 'rooftop_restaurant', 'heritage_walks'],
    nearby_pois: ['Hawa Mahal', 'City Palace', 'Johari Bazaar']
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const forecast_7d = days.map((d, i) => ({
    date: `2026-09-${15 + i}`,
    day: d,
    predicted_occupancy_pct: d === 'Sat' || d === 'Sun' ? 94 : 75 + (i * 3 % 10),
    predicted_city_footfall_k: d === 'Sat' || d === 'Sun' ? 18.5 : 12.2,
    suggested_rate_inr: d === 'Sat' || d === 'Sun' ? Math.round(prop.base_adr_inr * 1.25) : Math.round(prop.base_adr_inr * 1.05),
    demand_tier: d === 'Sat' || d === 'Sun' ? 'Peak' : 'Normal'
  }));

  const hourly_48h = Array.from({ length: 24 }).map((_, h) => {
    const isPeak = (h >= 10 && h <= 13) || (h >= 16 && h <= 19);
    const footfall = isPeak ? 2100 + (h * 40 % 300) : 650 + (h * 20 % 200);
    return {
      timestamp: `2026-09-15 ${String(h).padStart(2, '0')}:00`,
      hour: `${String(h).padStart(2, '0')}:00`,
      predicted_footfall: footfall,
      upper_bound: Math.round(footfall * 1.15),
      lower_bound: Math.round(footfall * 0.85),
      crowd_risk: footfall > 1800 ? 'High' : (footfall > 1000 ? 'Moderate' : 'Low')
    };
  });

  return {
    property: prop,
    all_properties: [
      { id: 'c1000000-0000-0000-0000-000000000001', name: 'Pink City Heritage Stay' },
      { id: 'c1000000-0000-0000-0000-000000000002', name: 'Amber Boutique Hotel' }
    ],
    kpis: {
      occupancy_rate_pct: prop.current_occupancy_pct,
      rooms_booked: Math.round(prop.total_rooms * (prop.current_occupancy_pct / 100)),
      total_rooms: prop.total_rooms,
      current_adr_inr: prop.base_adr_inr,
      suggested_adr_inr: Math.round(prop.base_adr_inr * 1.18),
      potential_rev_gain_inr: Math.round(prop.base_adr_inr * 0.18 * prop.total_rooms * 0.8),
      revpar_inr: Math.round(prop.base_adr_inr * (prop.current_occupancy_pct / 100)),
      destination_influx_index: 8.4,
      active_alerts_count: 3
    },
    forecast_7d,
    hourly_48h,
    dispersal_recommendations: [
      {
        id: 'rec-1',
        title: 'Incentivize Albert Hall visits with 15% Afternoon High-Tea voucher',
        target_poi: 'Albert Hall Museum',
        rationale: 'Amber Fort and Hawa Mahal will experience extreme saturation (90%+) between 11 AM - 3 PM. Diverting hotel guests to Albert Hall eases regional traffic and increases guest satisfaction.',
        expected_impact: 'Reduces guest wait times by 40 mins & generates +₹18,000 F&B spend.',
        action_type: 'promotion',
        status: 'active'
      },
      {
        id: 'rec-2',
        title: 'Implement Dynamic Surge Pricing for Friday-Sunday (+18%)',
        target_poi: 'Amer-Jaipur Corridor',
        rationale: 'Prophet model forecasts a 38% increase in regional tourist arrivals due to the upcoming weekend festival spike.',
        expected_impact: '+₹42,500 estimated incremental room revenue over the weekend.',
        action_type: 'pricing',
        status: 'ready'
      },
      {
        id: 'rec-3',
        title: 'Promote Sunset Rooftop Cultural Showcase during Nahargarh Peak',
        target_poi: 'Nahargarh Fort',
        rationale: 'Nahargarh road experiences heavy sunset congestion. Offering an in-house Rajasthani music showcase captures 25+ resident guests on-property.',
        expected_impact: 'Eases evening taxi gridlock and enhances direct guest reviews.',
        action_type: 'experience',
        status: 'draft'
      }
    ]
  };
}

