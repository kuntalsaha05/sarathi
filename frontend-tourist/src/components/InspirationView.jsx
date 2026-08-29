import React from 'react';
import { Sparkles, Camera, Compass, Utensils, Sunset, ArrowRight, Plus, Globe } from 'lucide-react';
import { UNIVERSAL_DESTINATIONS } from '../data/destinationsData';

export default function InspirationView({ onApplyInspirationStory, onSelectDestination }) {
  const stories = [
    {
      id: 'story-jaipur',
      destId: 'jaipur',
      title: 'The Royal Forts Loop: Amber, Jaigarh & Nahargarh',
      subtitle: 'Panoramic ramparts, underground tunnels & sunset overlooking the Pink City',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=900&auto=format&fit=crop&q=80',
      icon: Compass,
      tag: 'Heritage Trail · Jaipur 🇮🇳',
      duration: '6-8 Hours',
      description: 'Journey through Rajput military architecture perched high on the Aravalli hills, avoiding peak queues with early morning departure.'
    },
    {
      id: 'story-paris',
      destId: 'paris',
      title: 'Parisian Grandeur: Louvre, Eiffel & Montmartre Sunset',
      subtitle: 'World masterpiece galleries, Seine cruise views, and Bohemian hill vistas',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&auto=format&fit=crop&q=80',
      icon: Camera,
      tag: 'Art & Romance · Paris 🇫🇷',
      duration: '6-8 Hours',
      description: 'Experience the City of Light with smart time-window optimization avoiding mid-afternoon Louvre crowds.'
    },
    {
      id: 'story-tokyo',
      destId: 'tokyo',
      title: 'Tokyo Contrast: Ancient Shrines to Cyberpunk Neon',
      subtitle: 'Asakusa 7th-century temples, sacred Yoyogi forest & Shibuya Sky observatory',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=900&auto=format&fit=crop&q=80',
      icon: Sparkles,
      tag: 'Futurism & Tradition · Tokyo 🇯🇵',
      duration: '7 Hours',
      description: 'Weave through centuries of Japanese evolution with high-speed transit connectors and digital art pavilions.'
    },
    {
      id: 'story-varanasi',
      destId: 'varanasi',
      title: 'Spiritual Banaras: Morning Subah-e-Banaras & Evening Aarti',
      subtitle: 'Boat cruises past ancient ghats, Golden Temple corridor & Sarnath stupa',
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=900&auto=format&fit=crop&q=80',
      icon: Sunset,
      tag: 'Spiritual Awakening · Varanasi 🇮🇳',
      duration: '6 Hours',
      description: 'Witness the continuous 3,000-year sacred rhythm along Mother Ganga with optimized temple queue passes.'
    },
    {
      id: 'story-rome',
      destId: 'rome',
      title: 'Gladiators & Popes: Colosseum, Trevi & Vatican Splendor',
      subtitle: 'Flavian amphitheater, Baroque coin-toss fountains, and Michelangelo dome',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=900&auto=format&fit=crop&q=80',
      icon: Compass,
      tag: 'Classical Antiquity · Rome 🇮🇹',
      duration: '8 Hours',
      description: 'Explore the cradle of Western civilization with crowd-avoidance sequencing across Rome historic centro.'
    }
  ];

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-jodhpur-950 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-amber-500/20 rounded-full blur-2xl"></div>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 mb-1.5 flex items-center gap-1">
          <Globe className="w-3.5 h-3.5" />
          <span>Global & Pan-India Editorial Guides</span>
        </span>
        <h2 className="text-xl sm:text-2xl font-black">Universal Travel Inspiration</h2>
        <p className="text-xs text-slate-300 max-w-lg mt-1">
          Curated thematic circuits tailored for crowd avoidance, photography, and cultural immersion across the world.
        </p>
      </div>

      {/* Stories Feed */}
      <div className="space-y-4">
        {stories.map((story) => {
          const Icon = story.icon;
          const targetDest = UNIVERSAL_DESTINATIONS.find(d => d.id === story.destId) || UNIVERSAL_DESTINATIONS[0];

          return (
            <div
              key={story.id}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 hover:border-slate-300 hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row"
            >
              {/* Left Photo */}
              <div className="relative w-full sm:w-64 h-48 sm:h-auto bg-slate-900 flex-shrink-0">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-slate-950 shadow-xs">
                    {story.tag}
                  </span>
                </div>
              </div>

              {/* Right Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-bold mb-1">
                    <Icon className="w-3.5 h-3.5 text-jodhpur-600" />
                    <span>{story.duration}</span>
                    <span>·</span>
                    <span>{targetDest.places?.length || 4} Key Sights</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-950 group-hover:text-jodhpur-700 transition">
                    {story.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">
                    {story.subtitle}
                  </p>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {story.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-400">
                    City: <strong className="text-slate-800">{targetDest.name}, {targetDest.country}</strong>
                  </span>

                  <button
                    onClick={() => {
                      onSelectDestination(targetDest);
                      const poiIds = (targetDest.places || []).map(p => p.id);
                      onApplyInspirationStory(poiIds, story.title);
                    }}
                    className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs active:scale-95 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Explore This City Circuit</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
