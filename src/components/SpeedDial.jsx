import React, { useState } from 'react';
import SearchBar from './SearchBar';
import BlackHole from './ui/black-hole';
import { 
  Download, 
  User, 
  MapPin, 
  Play, 
  Mail, 
  Globe, 
  ShieldCheck, 
  Sparkles, 
  Orbit, 
  Compass, 
  Radio, 
  ArrowRight,
  Maximize2,
  Minimize2,
  Zap,
  Layers
} from 'lucide-react';
import { MotionFloat, MotionFadeIn, MotionScale } from './MotionPrimitives';
import PrismLogoEntry from './PrismLogoEntry';

const DISCOVERY_CARDS = [
  {
    title: 'Gravitational Lensing',
    badge: 'Astrophysics',
    desc: 'Light bending around supermassive Schwarzschild event horizons creating Einstein rings.',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80',
    query: 'Gravitational Lensing and Einstein Rings'
  },
  {
    title: 'Keplerian Accretion Disk',
    badge: 'Relativity',
    desc: 'Superheated plasma orbiting at relativistic speeds with severe Doppler asymmetry.',
    image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    query: 'Keplerian Accretion Disk Doppler Beaming'
  },
  {
    title: 'James Webb Deep Horizon',
    badge: 'Deep Space',
    desc: 'Infrared spectroscopic scans piercing cosmic dust to inspect primordial galaxies.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    query: 'James Webb Space Telescope Discoveries'
  }
];

export default function SpeedDial({
  onSearch,
  onNavigateUrl,
  onOpenInstall,
  onOpenAuthModal,
  onLaunchApp,
  currentUser
}) {
  const [isCinematic, setIsCinematic] = useState(false);

  const handleSearchSubmit = (input) => {
    const trimmed = (input || '').trim();
    if (!trimmed) return;

    const lower = trimmed.toLowerCase();
    if (lower.startsWith('maps') || lower.startsWith('map ')) {
      const loc = trimmed.replace(/^maps?\s*/i, '');
      if (onLaunchApp) onLaunchApp('maps', loc || 'Tokyo');
      return;
    }
    if (lower.startsWith('youtube') || lower.startsWith('tube') || lower.startsWith('video ')) {
      const vidQuery = trimmed.replace(/^(youtube|tube|video)\s*/i, '');
      if (onLaunchApp) onLaunchApp('tube', vidQuery);
      return;
    }
    if (lower === 'mail' || lower === 'gmail' || lower === 'email') {
      if (onLaunchApp) onLaunchApp('mail');
      return;
    }
    if (lower === 'singularity' || lower === 'black hole') {
      if (onLaunchApp) onLaunchApp('singularity');
      return;
    }

    const isUrl = /^https?:\/\//i.test(trimmed) || (trimmed.includes('.') && !trimmed.includes(' ') && trimmed.length > 4);
    if (isUrl && onNavigateUrl) {
      onNavigateUrl(trimmed);
    } else {
      onSearch(trimmed, 'all');
    }
  };

  const ECOSYSTEM_APPS = [
    { id: 'singularity', name: 'Singularity', icon: Orbit, color: '#f43f5e', type: 'singularity', label: 'PRISM Singularity' },
    { id: 'maps', name: 'Maps', icon: MapPin, color: '#10b981', type: 'maps', label: 'PRISM Maps' },
    { id: 'tube', name: 'Tube', icon: Play, color: '#ef4444', type: 'tube', label: 'PRISM Tube' },
    { id: 'mail', name: 'Mail', icon: Mail, color: '#a855f7', type: 'mail', label: 'PRISM Mail' },
    { id: 'browser', name: 'Browser', icon: Globe, color: '#06b6d4', type: 'browser', label: 'PRISM Browser' }
  ];

  return (
    <div className="masterpiece-startpage clean-homepage relative z-10">
      {/* 1. Interactive Centerpiece: Black Hole Orbit Canvas Viewport */}
      <MotionFadeIn direction="up" delay={0.05} duration={0.6}>
        <div className="w-full max-w-4xl mx-auto mb-6 relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/60 backdrop-blur-xl group">
          {/* 3D Black Hole Canvas with orbit drag control */}
          <div className={`w-full transition-all duration-500 relative ${isCinematic ? 'h-[65vh]' : 'h-64 sm:h-80'}`}>
            <BlackHole />
            
            {/* Ambient Radial Gradient Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

            {/* Orbit Drag Instruction Overlay */}
            <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1 bg-black/60 border border-white/10 backdrop-blur-md rounded-full text-[11px] font-mono text-indigo-300 pointer-events-none">
              <Sparkles size={12} className="text-indigo-400" />
              <span>Drag canvas to orbit relativistic event horizon</span>
            </div>

            <div className="absolute top-3 right-3 flex items-center gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={() => setIsCinematic(!isCinematic)}
                className="px-2.5 py-1 bg-black/60 hover:bg-black/80 text-white text-[11px] font-mono rounded-lg border border-white/15 backdrop-blur-md transition-all flex items-center gap-1.5"
                title={isCinematic ? "Compact View" : "Cinematic Deep Space View"}
              >
                {isCinematic ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                <span>{isCinematic ? "Compact" : "Cinematic"}</span>
              </button>
            </div>

            {/* Telemetry pill at bottom of canvas */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-400 pointer-events-none px-2">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>WebGPU / WebGL Lensing Engine</span>
              </span>
              <span className="hidden sm:inline text-slate-400">
                Null Geodesics • Keplerian Accretion • HDR Bloom
              </span>
            </div>
          </div>
        </div>
      </MotionFadeIn>

      {/* 2. PRISM Core Brand Heading */}
      <div className="prism-sign-container mb-4" title="PRISM Search Engine">
        <PrismLogoEntry
          size="large"
          showTitle={true}
          showTagline={true}
          taglineText="⚡ Anti-SEO Knowledge Singularity • Zero Ad Noise • Private By Default"
          autoAnimate={true}
          interactive={true}
        />
      </div>

      {/* 3. Holographic Omnibar */}
      <MotionFadeIn direction="up" delay={0.12} duration={0.5}>
        <div className="masterpiece-search-container clean-search-container w-full max-w-2xl mx-auto">
          <div className="conic-glow-border" />
          <div className="search-inner-wrapper">
            <SearchBar
              onSearch={handleSearchSubmit}
              placeholder="Search beyond the noise or launch apps (maps, tube, mail, singularity)..."
            />
          </div>
        </div>

        {/* Quick 1-Click Trending Search Chips */}
        <div className="hero-quick-chips flex flex-wrap items-center justify-center gap-2 mt-3">
          <span className="quick-chips-label text-slate-400 text-xs flex items-center gap-1">
            <Zap size={13} className="text-amber-400" /> Explore:
          </span>
          {[
            { label: '🔬 Quantum Machine Learning', q: 'Quantum Machine Learning algorithms' },
            { label: '🔭 James Webb Lensing', q: 'James Webb Space Telescope gravitational lensing' },
            { label: '⚡ Next.js vs Vite', q: 'Next.js vs Vite performance 2026' },
            { label: '🪐 Schwarzschild Singularity', q: 'Schwarzschild Black Hole physics' }
          ].map((chip, idx) => (
            <button
              key={idx}
              type="button"
              className="quick-chip-btn text-xs px-3 py-1 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-full border border-white/10 backdrop-blur-md transition-all"
              onClick={() => handleSearchSubmit(chip.q)}
            >
              <span>{chip.label}</span>
            </button>
          ))}
        </div>
      </MotionFadeIn>

      {/* 4. Cosmic Discovery Cards with Unsplash Photography */}
      <MotionFadeIn direction="up" delay={0.18} duration={0.5}>
        <div className="w-full max-w-4xl mx-auto mt-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-left">
            {DISCOVERY_CARDS.map((card, i) => (
              <div 
                key={i}
                onClick={() => handleSearchSubmit(card.query)}
                className="group cursor-pointer relative overflow-hidden rounded-xl bg-slate-950/70 border border-white/10 hover:border-indigo-500/50 backdrop-blur-xl p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    className="w-14 h-14 object-cover rounded-lg border border-white/10 group-hover:scale-105 transition-transform duration-300 shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider font-mono font-semibold text-indigo-400">
                        {card.badge}
                      </span>
                      <ArrowRight size={12} className="text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
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
        </div>
      </MotionFadeIn>

      {/* 5. Google-Style Apps Dock (Maps, Tube, Mail, Browser, Singularity) */}
      <MotionFadeIn direction="up" delay={0.24} duration={0.5}>
        <div className="homepage-apps-dock w-full max-w-2xl mx-auto rounded-2xl bg-slate-950/60 border border-white/10 p-4 backdrop-blur-xl mb-6">
          <div className="apps-dock-header flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-semibold text-slate-300">PRISM Ad-Free Ecosystem</span>
            <span className="apps-dock-adfree text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
              <ShieldCheck size={12} color="#10b981" />
              <span>100% Private & Ad-Free</span>
            </span>
          </div>

          <div className="apps-dock-items flex items-center justify-around gap-2 pt-3">
            {ECOSYSTEM_APPS.map((app) => {
              const Icon = app.icon;
              return (
                <button
                  key={app.id}
                  type="button"
                  className="app-dock-tile flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/5 transition-all group"
                  onClick={() => onLaunchApp && onLaunchApp(app.type)}
                  title={`Launch ${app.label}`}
                  id={`btn-launch-${app.id}`}
                >
                  <div 
                    className="app-dock-icon-box w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110 shadow-lg" 
                    style={{ 
                      color: app.color, 
                      background: `${app.color}15`, 
                      borderColor: `${app.color}40`,
                      boxShadow: `0 4px 14px ${app.color}20`
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <span className="app-dock-title text-[11px] font-medium text-slate-300 group-hover:text-white">
                    {app.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </MotionFadeIn>

      {/* 6. INSTALL & SIGN IN Actions */}
      <MotionFadeIn direction="up" delay={0.3} duration={0.5}>
        <div className="homepage-actions-row flex items-center justify-center gap-3">
          <button
            type="button"
            className="btn-homepage-primary-cta flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all"
            onClick={() => handleSearchSubmit('AI Multi-Lens Knowledge Synthesis')}
            title="Try Instant AI Search Synthesis"
            id="homepage-try-ai-btn"
          >
            <span>✨ Try AI Synthesis</span>
            <span className="cta-arrow">→</span>
          </button>

          <button
            type="button"
            className="btn-homepage-install flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white text-xs font-semibold rounded-xl border border-white/10 backdrop-blur-md transition-all"
            onClick={onOpenInstall}
            title="Install PRISM on Desktop, Android or iOS"
            id="homepage-install-btn"
          >
            <Download size={14} />
            <span>Install PRISM App</span>
            <span className="install-badge-pwa text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded font-mono">Free</span>
          </button>

          {!currentUser ? (
            <button
              type="button"
              className="btn-homepage-sign flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white text-xs font-semibold rounded-xl border border-white/10 backdrop-blur-md transition-all"
              onClick={onOpenAuthModal}
              title="Sign In or Create Account"
              id="homepage-signin-btn"
            >
              <User size={14} />
              <span>Sign In</span>
            </button>
          ) : (
            <div className="homepage-user-status text-xs text-slate-300 flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10">
              <span className="user-dot-active w-2 h-2 rounded-full bg-emerald-400" />
              <span>Signed in as <strong>{currentUser.username || currentUser.email}</strong></span>
            </div>
          )}
        </div>
      </MotionFadeIn>
    </div>
  );
}
