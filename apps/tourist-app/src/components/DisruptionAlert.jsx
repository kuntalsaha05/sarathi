import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function DisruptionAlert({ tripId }) {
  const [alert, setAlert] = React.useState(null);

  React.useEffect(() => {
    if (!tripId) return;
    socket.emit('subscribe_itinerary', tripId);
    socket.on('reroute_recommendation', (data) => setAlert(data));
    return () => socket.off('reroute_recommendation');
  }, [tripId]);

  if (!alert) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded shadow-lg">
      <strong>Disruption detected</strong>
      <p>Rerouting to avoid congestion...</p>
    </div>
  );
}
