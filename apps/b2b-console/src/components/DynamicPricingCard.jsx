export default function DynamicPricingCard({ rooms, onUpdate }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Dynamic Pricing & Allocation</h3>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="p-2">Room Type</th>
            <th className="p-2">Available</th>
            <th className="p-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((r, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{r.type}</td>
              <td className="p-2">{r.available}</td>
              <td className="p-2">₹{r.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={onUpdate} className="mt-3 bg-blue-600 text-white px-3 py-1 rounded text-sm">
        Refresh Prices
      </button>
    </div>
  );
}
