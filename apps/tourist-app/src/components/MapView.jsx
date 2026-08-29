import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

export default function MapView({ pins, center }) {
  const mapContainer = React.useRef(null);
  const [map, setMap] = React.useState(null);

  React.useEffect(() => {
    if (!mapContainer.current) return;
    const m = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center || [73.8563, 18.5204],
      zoom: 10,
    });
    m.addControl(new mapboxgl.NavigationControl());
    setMap(m);
    return () => m.remove();
  }, []);

  React.useEffect(() => {
    if (!map) return;
    pins.forEach((pin) => {
      new mapboxgl.Marker({ color: pin.color || 'red' })
        .setLngLat(pin.coords)
        .setPopup(new mapboxgl.Popup().setHTML(`<b>${pin.name}</b>`))
        .addTo(map);
    });
  }, [map, pins]);

  return <div ref={mapContainer} className="w-full h-96 rounded-lg shadow" />;
}
