import DisruptionAlert from '../components/DisruptionAlert';

export default function LiveGuide() {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Live Guide</h2>
      <p className="text-gray-600">Real-time rerouting and disruption updates will appear here.</p>
      <DisruptionAlert tripId="demo-trip-001" />
    </div>
  );
}
