import CrowdHeatmap from '../components/CrowdHeatmap';

export default function Analytics() {
  const data = Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, count: Math.floor(Math.random() * 500) + 100 }));
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Analytics</h2>
      <CrowdHeatmap data={data} />
    </div>
  );
}
