import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function CrowdHeatmap({ data }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Crowd Density Heatmap</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#dc2626" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
