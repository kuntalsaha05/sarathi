import DynamicPricingCard from '../components/DynamicPricingCard';

export default function Operations() {
  const rooms = [
    { type: 'Deluxe', available: 12, price: 4500 },
    { type: 'Suite', available: 4, price: 8000 },
  ];
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Operations</h2>
      <DynamicPricingCard rooms={rooms} onUpdate={() => {}} />
    </div>
  );
}
