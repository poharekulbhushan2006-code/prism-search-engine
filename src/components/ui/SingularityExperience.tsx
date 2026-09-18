import React, { useState } from 'react';
import BlackHole from '@/components/ui/black-hole';
import { 
  Sparkles, 
  Orbit, 
  Search, 
  Compass, 
  Radio, 
  ExternalLink, 
  ChevronRight, 
  Maximize2, 
  Minimize2,
  Layers,
  ArrowLeft
} from 'lucide-react';

interface SingularityExperienceProps {
  onSearch?: (query: string) => void;
  onBack?: () => void;
}

const DISCOVERY_CARDS = [
  {
    title: 'Gravitational Lensing',
    badge: 'Astrophysics',
    desc: 'Light rays from background stars bend around Schwarzschild event horizons creating Einstein rings.',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80',
    tag: 'Keplerian Orbit'
  },
  {
    title: 'Relativistic Doppler Beaming',
    badge: 'Quantum Field',
    desc: 'The side of the accretion disk orbiting toward the observer appears violently brighter and blueshifted.',
    image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    tag: 'c = 299,792 km/s'
  },
  {
    title: 'James Webb Deep Horizon',
    badge: 'Deep Space',
    desc: 'Infrared spectroscopic scans piercing dust clouds to analyze primordial supermassive singularities.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    tag: 'JWST NIRCam'
  }
];

export default function SingularityExperience({ onSearch, onBack }: SingularityExperienceProps) {
  const [query, setQuery] = useState('');
  const [hudVisible, setHudVisible] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query.trim());
    }
  };

  const handleChipClick = (term: string) => {
    setQuery(term);
    if (onSearch) {
      onSearch(term);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-slate-100 select-none">
      {/* 1. Underlying WebGPU / WebGL Black Hole simulation */}
      <div className="absolute inset-0 z-0">
        <BlackHole />
      </div>

      {/* 2. Ambient Spacetime Grid Overlay */}
      <div 
        className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_70%,rgba(0,0,0,0.85)_100%)]" 
      />

      {/* 3. Top Glassmorphic Navigation HUD */}
      <header className="relative z-20 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-slate-950/40 border-b border-white/10">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white rounded-lg border border-white/10 transition-all duration-200"
              title="Return to PRISM Search"
            >
              <ArrowLeft size={14} />
              <span>Standard PRISM</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <Orbit size={18} className="text-white animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tracking-wider uppercase text-white">PRISM Singularity</span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono tracking-wide bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                  EVENT HORIZON
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Multi-Pass Relativistic Raymarcher</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-white/10 rounded-full text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Telemetry: 60 FPS • Lensing Active</span>
          </div>

          <button
            onClick={() => setHudVisible(!hudVisible)}
            className="p-2 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all"
            title={hudVisible ? "Hide HUD (Cinematic View)" : "Show HUD"}
          >
            {hudVisible ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </header>

      {/* 4. Interactive HUD Body */}
      {hudVisible && (
        <main className="relative z-20 flex flex-col justify-between h-[calc(100vh-69px)] p-6 pointer-events-none">
          {/* Centered Cosmic Search HUD */}
          <div className="w-full max-w-2xl mx-auto mt-6 text-center pointer-events-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-3 backdrop-blur-md">
              <Sparkles size={13} className="text-indigo-400" />
              <span>Drag canvas anywhere to rotate relativistic orbit</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-amber-200 drop-shadow-md">
              Peer Through The Singularity
            </h1>
            <p className="text-xs sm:text-sm text-slate-300/80 mt-1 max-w-md mx-auto">
              Simulating photons orbiting supermassive Schwarzschild metrics with Doppler boost and HDR bloom.
            </p>

            {/* Omnibox input */}
            <form onSubmit={handleSubmit} className="mt-5 relative max-w-xl mx-auto">
              <div className="relative flex items-center group">
                <Search size={18} className="absolute left-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search deep cosmic knowledge, quantum fields, or research papers..."
                  className="w-full pl-11 pr-24 py-3 bg-slate-950/70 border border-white/15 rounded-xl text-sm text-white placeholder-slate-400 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-2xl"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white text-xs font-medium rounded-lg transition-all flex items-center gap-1 shadow-md"
                >
                  <span>Query</span>
                  <ChevronRight size={13} />
                </button>
              </div>

              {/* Quick Orbit Chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs">
                <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <Radio size={11} className="text-amber-400" /> Orbits:
                </span>
                {[
                  'Schwarzschild Metric',
                  'James Webb Deep Space',
                  'Hawking Radiation',
                  'Accretion Disk Doppler'
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleChipClick(chip)}
                    className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-md border border-white/10 text-[11px] backdrop-blur-md transition-all"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </form>
          </div>

          {/* Bottom Cosmic Discovery Cards with Unsplash Photography */}
          <div className="w-full max-w-5xl mx-auto pointer-events-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DISCOVERY_CARDS.map((card, i) => (
                <div 
                  key={i}
                  onClick={() => handleChipClick(card.title)}
                  className="group cursor-pointer relative overflow-hidden rounded-xl bg-slate-950/60 border border-white/10 hover:border-indigo-500/50 backdrop-blur-xl p-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={card.image} 
                      alt={card.title} 
                      className="w-14 h-14 object-cover rounded-lg border border-white/10 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider font-mono font-semibold text-indigo-400">
                          {card.badge}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {card.tag}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 truncate mt-0.5">
                        {card.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Micro footer disclaimer */}
            <div className="flex items-center justify-between mt-3 text-[11px] text-slate-400 px-2 font-mono">
              <span className="flex items-center gap-1">
                <Compass size={12} className="text-indigo-400" />
                PRISM Engine • Geodesic Null-Ray Traversal
              </span>
              <span>Coordinates: (r = 21.0, M = 1.0)</span>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
