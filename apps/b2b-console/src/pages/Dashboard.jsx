import DemandForecastChart from '../components/DemandForecastChart';
import DynamicPricingCard from '../components/DynamicPricingCard';
import { getForecast, getInventory } from '../services/api';

export default function Dashboard() {
  const [forecast, setForecast] = React.useState([]);
  const [inventory, setInventory] = React.useState([]);

  React.useEffect(() => {
    getForecast('poi-1').then(setForecast);
    getInventory().then(setInventory);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold">B2B Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DemandForecastChart data={forecast} />
        <DynamicPricingCard rooms={inventory} onUpdate={() => {}} />
      </div>
    </div>
  );
}
