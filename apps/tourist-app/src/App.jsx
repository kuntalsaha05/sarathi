import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TripPlanner from './pages/TripPlanner';
import LiveGuide from './pages/LiveGuide';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plan" element={<TripPlanner />} />
        <Route path="/live" element={<LiveGuide />} />
      </Routes>
    </BrowserRouter>
  );
}
