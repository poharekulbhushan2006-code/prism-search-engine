import React from 'react';
import SearchBar from './SearchBar';
import { Download, User, MapPin, Play, Mail, Globe, ShieldCheck } from 'lucide-react';

export default function SpeedDial({
  onSearch,
  onNavigateUrl,
  onOpenInstall,
  onOpenAuthModal,
  onLaunchApp,
  currentUser
}) {
  const handleSearchSubmit = (input) => {
    const trimmed = (input || '').trim();
    if (!trimmed) return;

    // Check if user is searching for one of the apps directly (e.g. "maps tokyo", "youtube lofi", "mail")
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

    const isUrl = /^https?:\/\//i.test(trimmed) || (trimmed.includes('.') && !trimmed.includes(' ') && trimmed.length > 4);
    if (isUrl && onNavigateUrl) {
      onNavigateUrl(trimmed);
    } else {
      onSearch(trimmed, 'all');
    }
  };

  const ECOSYSTEM_APPS = [
    { id: 'maps', name: 'Maps', icon: MapPin, color: '#10b981', type: 'maps', label: 'PRISM Maps' },
    { id: 'tube', name: 'Tube', icon: Play, color: '#ef4444', type: 'tube', label: 'PRISM Tube' },
    { id: 'browser', name: 'Browser', icon: Globe, color: '#06b6d4', type: 'browser', label: 'PRISM Browser' },
    { id: 'mail', name: 'Mail', icon: Mail, color: '#a855f7', type: 'mail', label: 'PRISM Mail' }
  ];

  return (
    <div className="masterpiece-startpage clean-homepage">
      {/* 1. PRISM SIGN: Majestic Glowing Prismatic Optical Core + Chromatic Title */}
      <div className="prism-sign-container" title="PRISM Search Engine">
        <div className="prism-optical-monolith">
          <svg viewBox="0 0 120 120" className="prism-svg-core">
            <defs>
              <linearGradient id="prismLightG" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="75%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <filter id="prismGlow" x="-25%" y="-25%" width="150%" height="150%">
                <feGaussianBlur stdDeviation="7" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Exterior Glow Triangle */}
            <polygon
              points="60,16 106,98 14,98"
              fill="none"
              stroke="url(#prismLightG)"
              strokeWidth="3.5"
              filter="url(#prismGlow)"
              className="prism-outer-ring"
            />

            {/* Internal Geometric Core */}
            <polygon
              points="60,30 93,90 27,90"
              fill="url(#prismLightG)"
              opacity="0.92"
              className="prism-inner-core"
            />

            {/* Center Specular Core Highlight */}
            <polygon
              points="60,46 78,82 42,82"
              fill="#ffffff"
              opacity="0.45"
            />
          </svg>
        </div>

        <h1 className="prism-brand-title">
          PR<span className="prism-brand-letter-i">I</span>SM
        </h1>

        {/* Item 4: Prominent CTA Above The Fold Header Banner */}
        <div className="hero-cta-pill-wrapper">
          <div className="hero-value-pill">
            <span className="pill-dot" />
            <span>⚡ 0 Ads • 100% Anti-SEO Spam Filter • Private By Default</span>
          </div>
        </div>
      </div>

      {/* 2. SEARCH TOOL BAR: Holographic Omnibar with Autocomplete & Direct Search */}
      <div className="masterpiece-search-container clean-search-container">
        <div className="conic-glow-border" />
        <div className="search-inner-wrapper">
          <SearchBar
            onSearch={handleSearchSubmit}
            placeholder="Search with PRISM or launch apps (e.g. maps, tube, mail)..."
          />
        </div>
      </div>

      {/* Quick 1-Click Trending Search Chips Above The Fold */}
      <div className="hero-quick-chips">
        <span className="quick-chips-label">Try instant search:</span>
        <button
          type="button"
          className="quick-chip-btn"
          onClick={() => handleSearchSubmit('Quantum Computing 2026')}
        >
          <span>🔬 Quantum Computing 2026</span>
        </button>
        <button
          type="button"
          className="quick-chip-btn"
          onClick={() => handleSearchSubmit('Next.js vs Vite Performance')}
        >
          <span>⚡ Next.js vs Vite</span>
        </button>
        <button
          type="button"
          className="quick-chip-btn"
          onClick={() => handleSearchSubmit('Mars Rover Discoveries')}
        >
          <span>🪐 Mars Discoveries</span>
        </button>
      </div>

      {/* 3. INSTALL & SIGN IN: Prominent Clean Action Triggers Above The Fold */}
      <div className="homepage-actions-row">
        <button
          type="button"
          className="btn-homepage-primary-cta"
          onClick={() => handleSearchSubmit('AI Reasoning Models Comparison')}
          title="Try Instant AI Search Synthesis"
          id="homepage-try-ai-btn"
        >
          <span>✨ Try AI Synthesis</span>
          <span className="cta-arrow">→</span>
        </button>

        <button
          type="button"
          className="btn-homepage-install"
          onClick={onOpenInstall}
          title="Install PRISM on Desktop, Android or iOS"
          id="homepage-install-btn"
        >
          <Download size={15} />
          <span>Install PRISM App</span>
          <span className="install-badge-pwa">Free</span>
        </button>

        {!currentUser ? (
          <button
            type="button"
            className="btn-homepage-sign"
            onClick={onOpenAuthModal}
            title="Sign In or Create Account"
            id="homepage-signin-btn"
          >
            <User size={14} />
            <span>Sign In</span>
          </button>
        ) : (
          <div className="homepage-user-status">
            <span className="user-dot-active" />
            <span>Signed in as <strong>{currentUser.username || currentUser.email}</strong></span>
          </div>
        )}
      </div>

      {/* 4. GOOGLE-STYLE APPS DOCK: Instant 1-Click Launch for PRISM Maps, Tube, Browser, Mail */}
      <div className="homepage-apps-dock">
        <div className="apps-dock-header">
          <span>PRISM Google-Equivalent Apps</span>
          <span className="apps-dock-adfree">
            <ShieldCheck size={11} color="#10b981" />
            <span>Ad-Free Ecosystem</span>
          </span>
        </div>

        <div className="apps-dock-items">
          {ECOSYSTEM_APPS.map((app) => {
            const Icon = app.icon;
            return (
              <button
                key={app.id}
                type="button"
                className="app-dock-tile"
                onClick={() => onLaunchApp && onLaunchApp(app.type)}
                title={`Launch ${app.label}`}
                id={`btn-launch-${app.id}`}
              >
                <div className="app-dock-icon-box" style={{ color: app.color, background: `${app.color}18`, borderColor: `${app.color}40` }}>
                  <Icon size={18} />
                </div>
                <span className="app-dock-title">{app.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
