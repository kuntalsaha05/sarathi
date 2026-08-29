import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-700">SARATHI</h1>
        <Link to="/plan" className="bg-blue-600 text-white px-4 py-2 rounded">Plan Trip</Link>
      </nav>
      <section className="text-center pt-20">
        <h2 className="text-4xl font-bold mb-4">Your Intelligent Travel Companion</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Real-time route optimization, voice-based planning, and live disruption alerts powered by AI.
        </p>
      </section>
    </div>
  );
}
