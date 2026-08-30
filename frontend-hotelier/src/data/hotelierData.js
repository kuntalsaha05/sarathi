export const HOTELIER_DESTINATIONS = [
  {
    id: 'jaipur',
    name: 'Jaipur',
    country: 'India',
    flag: '🇮🇳',
    region: 'Rajasthan',
    tagline: 'The Pink City: Forts, Palaces & Royal Heritage',
    coordinates: { lat: 26.9200, lng: 75.8225 },
    zoom: 12,
    destination_influx_index: 8.4,
    active_alerts_count: 3,
    properties: [
      {
        id: 'prop-jaipur-1',
        name: 'Pink City Heritage Stay',
        star_rating: 4,
        total_rooms: 40,
        rooms_booked: 31,
        occupancy_rate_pct: 78,
        base_adr_inr: 5400,
        suggested_adr_inr: 6372,
        potential_rev_gain_inr: 30140,
        revpar_inr: 4212,
        corridor: 'Old City & Hawa Mahal Corridor',
        location: { lat: 26.9200, lng: 75.8225 },
        amenities: ['Rooftop Heritage Dining', 'Ayurvedic Spa', 'Free High-Speed Wi-Fi', 'Swimming Pool', 'Curated Heritage Walks'],
        channels: [
          { name: 'Direct Website', share_pct: 35, adr_inr: 5400, status: 'Synced' },
          { name: 'Booking.com', share_pct: 30, adr_inr: 5600, status: 'Synced' },
          { name: 'MakeMyTrip', share_pct: 25, adr_inr: 5450, status: 'Synced' },
          { name: 'Agoda / OTA', share_pct: 10, adr_inr: 5500, status: 'Synced' }
        ]
      },
      {
        id: 'prop-jaipur-2',
        name: 'Amber Boutique Palace & Spa',
        star_rating: 5,
        total_rooms: 32,
        rooms_booked: 28,
        occupancy_rate_pct: 88,
        base_adr_inr: 8200,
        suggested_adr_inr: 9840,
        potential_rev_gain_inr: 52480,
        revpar_inr: 7216,
        corridor: 'Amer & Maota Lake Corridor',
        location: { lat: 26.9820, lng: 75.8495 },
        amenities: ['Fort View Suites', 'Infinity Pool', 'Royal Dining Hall', 'Valet Parking', 'Airport Chauffeur'],
        channels: [
          { name: 'Direct Website', share_pct: 42, adr_inr: 8200, status: 'Synced' },
          { name: 'Booking.com', share_pct: 32, adr_inr: 8500, status: 'Synced' },
          { name: 'MakeMyTrip', share_pct: 18, adr_inr: 8300, status: 'Synced' },
          { name: 'Agoda / OTA', share_pct: 8, adr_inr: 8400, status: 'Synced' }
        ]
      },
      {
        id: 'prop-jaipur-3',
        name: 'Nahargarh Sunset Haveli',
        star_rating: 3,
        total_rooms: 24,
        rooms_booked: 19,
        occupancy_rate_pct: 79,
        base_adr_inr: 3800,
        suggested_adr_inr: 4480,
        potential_rev_gain_inr: 16320,
        revpar_inr: 3002,
        corridor: 'Aravalli Hills Ridge Corridor',
        location: { lat: 26.9360, lng: 75.8170 },
        amenities: ['Panoramic Ridge Terrace', 'Folk Music Nights', 'Wi-Fi', 'Cafe & Bar'],
        channels: [
          { name: 'Direct Website', share_pct: 28, adr_inr: 3800, status: 'Synced' },
          { name: 'Booking.com', share_pct: 38, adr_inr: 3950, status: 'Synced' },
          { name: 'MakeMyTrip', share_pct: 24, adr_inr: 3850, status: 'Synced' },
          { name: 'Agoda / OTA', share_pct: 10, adr_inr: 3900, status: 'Synced' }
        ]
      }
    ],
    pois: [
      { id: '1', name: 'Amber Fort & Palace', lat: 26.9855, lng: 75.8513, crowd: 3600, capacity: 4000, status: 'Surge', category: 'Heritage Fort' },
      { id: '2', name: 'Hawa Mahal (Palace of Winds)', lat: 26.9239, lng: 75.8267, crowd: 1350, capacity: 1500, status: 'Surge', category: 'Heritage Monument' },
      { id: '3', name: 'City Palace & Museums', lat: 26.9258, lng: 75.8235, crowd: 1400, capacity: 2000, status: 'Moderate', category: 'Royal Palace' },
      { id: '4', name: 'Jal Mahal (Water Palace)', lat: 26.9538, lng: 75.8464, crowd: 1100, capacity: 3000, status: 'Low', category: 'Lake Promenade' },
      { id: '5', name: 'Nahargarh Fort', lat: 26.9373, lng: 75.8154, crowd: 1450, capacity: 2500, status: 'Moderate', category: 'Scenic Fort' },
      { id: '6', name: 'Johari & Bapu Bazaar', lat: 26.9196, lng: 75.8267, crowd: 4100, capacity: 5000, status: 'Moderate', category: 'Artisan Market' },
      { id: '7', name: 'Albert Hall State Museum', lat: 26.9114, lng: 75.8194, crowd: 480, capacity: 1200, status: 'Low', category: 'Indo-Saracenic Museum' },
      { id: '8', name: 'Chokhi Dhani Ethnic Resort', lat: 26.7783, lng: 75.8138, crowd: 1800, capacity: 5000, status: 'Low', category: 'Cultural Village' }
    ],
    dispersal_recommendations: [
      {
        id: 'rec-jaipur-1',
        title: 'Incentivize Albert Hall visits with 15% Afternoon High-Tea voucher',
        target_poi: 'Albert Hall Museum',
        rationale: 'Amber Fort and Hawa Mahal will experience extreme saturation (90%+) between 11 AM - 3 PM. Diverting hotel guests to Albert Hall eases regional traffic and increases guest satisfaction.',
        expected_impact: 'Reduces guest wait times by 40 mins & generates +₹18,000 F&B spend.',
        action_type: 'Guest Voucher',
        badge_color: 'amber',
        status: 'active'
      },
      {
        id: 'rec-jaipur-2',
        title: 'Implement Dynamic Surge Pricing for Friday-Sunday (+18%)',
        target_poi: 'Amer-Jaipur Corridor',
        rationale: 'Prophet model forecasts a 38% increase in regional tourist arrivals due to the upcoming weekend festival spike.',
        expected_impact: '+₹42,500 estimated incremental room revenue over the weekend.',
        action_type: 'Yield Surge',
        badge_color: 'jodhpur',
        status: 'ready'
      },
      {
        id: 'rec-jaipur-3',
        title: 'Promote Sunset Rooftop Cultural Showcase during Nahargarh Peak',
        target_poi: 'Nahargarh Fort',
        rationale: 'Nahargarh road experiences heavy sunset congestion. Offering an in-house Rajasthani music showcase captures 25+ resident guests on-property.',
        expected_impact: 'Eases evening taxi gridlock and enhances direct guest reviews.',
        action_type: 'In-House Event',
        badge_color: 'emerald',
        status: 'draft'
      }
    ]
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    country: 'India',
    flag: '🇮🇳',
    region: 'Uttar Pradesh',
    tagline: 'The Spiritual Capital: Ghats, Temples & Ganga Aarti',
    coordinates: { lat: 25.3176, lng: 82.9739 },
    zoom: 13,
    destination_influx_index: 9.1,
    active_alerts_count: 4,
    properties: [
      {
        id: 'prop-vns-1',
        name: 'Ganges View Heritage Retreat',
        star_rating: 4,
        total_rooms: 28,
        rooms_booked: 25,
        occupancy_rate_pct: 89,
        base_adr_inr: 6200,
        suggested_adr_inr: 7450,
        potential_rev_gain_inr: 35000,
        revpar_inr: 5518,
        corridor: 'Main Ghats & Godowlia Corridor',
        location: { lat: 25.3050, lng: 83.0080 },
        amenities: ['Ganga Aarti View Terrace', 'Vegetarian Gourmet Dining', 'Private Boat Charter', 'Yoga Sessions'],
        channels: [
          { name: 'Direct Website', share_pct: 40, adr_inr: 6200, status: 'Synced' },
          { name: 'Booking.com', share_pct: 35, adr_inr: 6500, status: 'Synced' },
          { name: 'MakeMyTrip', share_pct: 20, adr_inr: 6300, status: 'Synced' },
          { name: 'Agoda / OTA', share_pct: 5, adr_inr: 6400, status: 'Synced' }
        ]
      },
      {
        id: 'prop-vns-2',
        name: 'Sarnath Peace Sanctuary',
        star_rating: 3,
        total_rooms: 20,
        rooms_booked: 14,
        occupancy_rate_pct: 70,
        base_adr_inr: 3400,
        suggested_adr_inr: 3900,
        potential_rev_gain_inr: 10000,
        revpar_inr: 2380,
        corridor: 'Sarnath Buddhist Heritage Corridor',
        location: { lat: 25.3810, lng: 83.0225 },
        amenities: ['Meditation Gardens', 'Library & Cafe', 'Wi-Fi', 'Monastery Shuttle'],
        channels: [
          { name: 'Direct Website', share_pct: 30, adr_inr: 3400, status: 'Synced' },
          { name: 'Booking.com', share_pct: 40, adr_inr: 3550, status: 'Synced' },
          { name: 'MakeMyTrip', share_pct: 25, adr_inr: 3450, status: 'Synced' },
          { name: 'Agoda / OTA', share_pct: 5, adr_inr: 3500, status: 'Synced' }
        ]
      }
    ],
    pois: [
      { id: 'v1', name: 'Dashashwamedh Ghat (Aarti)', lat: 25.3076, lng: 83.0105, crowd: 4800, capacity: 5000, status: 'Surge', category: 'Sacred Ghat' },
      { id: 'v2', name: 'Kashi Vishwanath Corridor', lat: 25.3109, lng: 83.0107, crowd: 5900, capacity: 6000, status: 'Surge', category: 'Jyotirlinga Temple' },
      { id: 'v3', name: 'Assi Ghat', lat: 25.2905, lng: 83.0068, crowd: 1800, capacity: 3000, status: 'Moderate', category: 'Cultural Ghat' },
      { id: 'v4', name: 'Manikarnika Ghat', lat: 25.3108, lng: 83.0146, crowd: 2200, capacity: 3500, status: 'Moderate', category: 'Historical Ghat' },
      { id: 'v5', name: 'Dhamek Stupa & Sarnath', lat: 25.3811, lng: 83.0245, crowd: 650, capacity: 2000, status: 'Low', category: 'Buddhist Monument' }
    ],
    dispersal_recommendations: [
      {
        id: 'rec-vns-1',
        title: 'Promote Early Morning Subah-e-Banaras at Assi Ghat over Evening Dashashwamedh',
        target_poi: 'Assi Ghat',
        rationale: 'Dashashwamedh Ghat exceeds 95% capacity by 5:30 PM. Promoting sunrise aarti and yoga at Assi spreads guest footfall seamlessly.',
        expected_impact: 'Reduces peak crush by 30% and improves guest ratings.',
        action_type: 'Time-Shift Offer',
        badge_color: 'jodhpur',
        status: 'active'
      },
      {
        id: 'rec-vns-2',
        title: 'Offer Sarnath Afternoon Excursions with Complimentary High Tea',
        target_poi: 'Sarnath Archaeological Site',
        rationale: 'Spiritual corridor is at surge capacity. Sarnath is at under 35% utilization during midday.',
        expected_impact: 'Captures +₹22,000 day tour revenue per weekend.',
        action_type: 'Dispersal Tour',
        badge_color: 'emerald',
        status: 'ready'
      }
    ]
  },
  {
    id: 'goa',
    name: 'Goa',
    country: 'India',
    flag: '🇮🇳',
    region: 'West Coast',
    tagline: 'Sun, Sand, Heritage Forts & Coastal Delights',
    coordinates: { lat: 15.4989, lng: 73.8278 },
    zoom: 12,
    destination_influx_index: 8.7,
    active_alerts_count: 2,
    properties: [
      {
        id: 'prop-goa-1',
        name: 'Candolim Sands Coastal Resort',
        star_rating: 5,
        total_rooms: 60,
        rooms_booked: 54,
        occupancy_rate_pct: 90,
        base_adr_inr: 9500,
        suggested_adr_inr: 11400,
        potential_rev_gain_inr: 114000,
        revpar_inr: 8550,
        corridor: 'North Goa Beach Belt',
        location: { lat: 15.5180, lng: 73.7650 },
        amenities: ['Direct Beach Access', 'Infinity Lagoon Pool', 'Seafood Grill', 'Sunset Lounge'],
        channels: [
          { name: 'Direct Website', share_pct: 45, adr_inr: 9500, status: 'Synced' },
          { name: 'Booking.com', share_pct: 30, adr_inr: 9900, status: 'Synced' },
          { name: 'MakeMyTrip', share_pct: 20, adr_inr: 9600, status: 'Synced' },
          { name: 'Agoda / OTA', share_pct: 5, adr_inr: 9800, status: 'Synced' }
        ]
      }
    ],
    pois: [
      { id: 'g1', name: 'Baga & Calangute Beach', lat: 15.5553, lng: 73.7517, crowd: 6200, capacity: 6500, status: 'Surge', category: 'Coastal Beach' },
      { id: 'g2', name: 'Fort Aguada & Lighthouse', lat: 15.4925, lng: 73.7736, crowd: 2400, capacity: 2800, status: 'Surge', category: 'Portuguese Fort' },
      { id: 'g3', name: 'Basilica of Bom Jesus (Old Goa)', lat: 15.5009, lng: 73.9116, crowd: 1500, capacity: 3000, status: 'Moderate', category: 'UNESCO Heritage' },
      { id: 'g4', name: 'Fontainhas Latin Quarter', lat: 15.4989, lng: 73.8320, crowd: 850, capacity: 2000, status: 'Low', category: 'Heritage Quarter' }
    ],
    dispersal_recommendations: [
      {
        id: 'rec-goa-1',
        title: 'Promote Fontainhas Heritage Walk + Cafe Crawl as Alternative to Crowded Baga',
        target_poi: 'Fontainhas Latin Quarter',
        rationale: 'Baga traffic is in full saturation (>95%). Latin quarter provides high-satisfaction boutique photography and cafe experiences.',
        expected_impact: 'Diverts 60+ guests from North coastal congestion.',
        action_type: 'Culture Push',
        badge_color: 'jodhpur',
        status: 'active'
      }
    ]
  }
];

export function getHotelierDestinationById(destId = 'jaipur') {
  return HOTELIER_DESTINATIONS.find(d => d.id === destId) || HOTELIER_DESTINATIONS[0];
}

export function generate48hForecast(baseOccupancy = 78, baseAdr = 5400) {
  const currentHour = new Date().getHours();
  return Array.from({ length: 24 }).map((_, i) => {
    const h = (currentHour + i) % 24;
    const isPeak = (h >= 10 && h <= 13) || (h >= 16 && h <= 20);
    const footfall = isPeak ? 2200 + ((i * 73) % 450) : 750 + ((i * 41) % 250);
    const upper = Math.round(footfall * 1.18);
    const lower = Math.round(footfall * 0.82);

    return {
      timestamp: `${String(h).padStart(2, '0')}:00`,
      hour: `${String(h).padStart(2, '0')}:00`,
      predicted_footfall: footfall,
      upper_bound: upper,
      lower_bound: lower,
      crowd_risk: footfall > 2100 ? 'Surge Risk' : (footfall > 1200 ? 'Moderate' : 'Safe'),
      recommended_adr_surge_pct: isPeak ? 18 : 5
    };
  });
}

export function generate7dForecast(baseOccupancy = 78, baseAdr = 5400) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayIdx = new Date().getDay();
  
  return Array.from({ length: 7 }).map((_, idx) => {
    const dayName = days[(todayIdx + idx) % 7];
    const isWeekend = dayName === 'Sat' || dayName === 'Sun' || dayName === 'Fri';
    const occ = isWeekend ? Math.min(96, baseOccupancy + 14 + (idx % 3)) : Math.max(65, baseOccupancy - (idx % 5));
    const footfallK = isWeekend ? 19.4 : 12.8;
    const suggestedRate = isWeekend ? Math.round(baseAdr * 1.22) : Math.round(baseAdr * 1.05);

    return {
      date: `Day ${idx + 1}`,
      day: dayName,
      predicted_occupancy_pct: occ,
      predicted_city_footfall_k: footfallK,
      suggested_rate_inr: suggestedRate,
      demand_tier: isWeekend ? 'Peak Surge' : 'Stable'
    };
  });
}

