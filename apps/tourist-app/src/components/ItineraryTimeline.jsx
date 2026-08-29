export default function ItineraryTimeline({ stops, onReorder }) {
  return (
    <div className="border rounded p-4 shadow">
      <h3 className="font-bold mb-2">Itinerary Timeline</h3>
      <ol className="list-decimal pl-5 space-y-1">
        {stops.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>
      <button className="mt-3 text-blue-600 underline" onClick={onReorder}>
        Re-order stops
      </button>
    </div>
  );
}
