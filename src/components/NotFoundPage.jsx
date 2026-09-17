import React, { useState } from 'react';
import { Home, Search, Compass, MapPin, Play, Mail, ArrowRight, Sparkles } from 'lucide-react';

export default function NotFoundPage({ onGoHome, onSearch, onLaunchApp }) {
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="notfound-page-container">
      <div className="notfound-card">
        {/* Prismatic Dispersed Optical Graphic */}
        <div className="notfound-graphic-wrapper">
          <div className="notfound-glow" />
          <svg viewBox="0 0 160 160" className="notfound-svg">
            <defs>
              <linearGradient id="nfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            {/* Outer Broken Prism Lines */}
            <polygon points="80,18 142,126 18,126" fill="none" stroke="url(#nfGrad)" strokeWidth="3" strokeDasharray="8 6" opacity="0.8" />
            <polygon points="80,36 126,114 34,114" fill="url(#nfGrad)" opacity="0.2" />
            {/* Dispersion Rays */}
            <line x1="80" y1="18" x2="30" y2="148" stroke="#06b6d4" strokeWidth="2.5" opacity="0.6" />
            <line x1="80" y1="18" x2="80" y2="152" stroke="#a855f7" strokeWidth="2.5" opacity="0.6" />
            <line x1="80" y1="18" x2="130" y2="148" stroke="#ec4899" strokeWidth="2.5" opacity="0.6" />
            {/* Center Disconnect Node */}
            <circle cx="80" cy="88" r="14" fill="#0f172a" stroke="#f43f5e" strokeWidth="3" />
            <line x1="74" y1="82" x2="86" y2="94" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="86" y1="82" x2="74" y2="94" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* 404 Header Title */}
        <div className="notfound-badge">
          <Sparkles size={14} color="#f43f5e" />
          <span>Error 404 — Signal Disconnected</span>
        </div>

        <h1 className="notfound-title">Frequency Lost in the Prism</h1>
        <p className="notfound-description">
          The coordinates or URL you entered do not match an indexed spectrum. Re-calibrate your trajectory below or search directly.
        </p>

        {/* Integrated Quick Recovery Omnibox */}
        <form onSubmit={handleSearchSubmit} className="notfound-search-form">
          <div className="notfound-input-box">
            <Search size={18} className="notfound-search-icon" />
            <input
              type="text"
              className="notfound-input"
              placeholder="Search PRISM to find what you were looking for..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <button type="submit" className="notfound-btn-submit" aria-label="Search">
              <ArrowRight size={16} />
            </button>
          </div>
        </form>

        {/* Action Shortcuts */}
        <div className="notfound-actions">
          <button type="button" className="btn-notfound-primary" onClick={onGoHome} id="btn-404-home">
            <Home size={16} />
            <span>Return to Safe Home</span>
          </button>
          <button type="button" className="btn-notfound-secondary" onClick={() => onLaunchApp('maps')} id="btn-404-maps">
            <MapPin size={15} color="#10b981" />
            <span>Maps</span>
          </button>
          <button type="button" className="btn-notfound-secondary" onClick={() => onLaunchApp('tube')} id="btn-404-tube">
            <Play size={15} color="#ef4444" />
            <span>Tube</span>
          </button>
          <button type="button" className="btn-notfound-secondary" onClick={() => onLaunchApp('mail')} id="btn-404-mail">
            <Mail size={15} color="#a855f7" />
            <span>Mail</span>
          </button>
        </div>
      </div>
    </div>
  );
}
