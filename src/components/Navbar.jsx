import React from 'react';
import SearchBar from './SearchBar';
import { ShieldCheck, Bookmark } from 'lucide-react';

export default function Navbar({ query, onSearch, onReset, onOpenPinboard, pinnedCount, hasSearched }) {
  return (
    <header className="navbar">
      {/* Brand */}
      <div className="nav-brand" onClick={onReset} title="PRISM Home">
        <svg className="nav-logo-prism" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="navG" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          <polygon points="50,12 92,86 8,86" fill="none" stroke="url(#navG)" strokeWidth="8" />
          <polygon points="50,26 80,80 20,80" fill="url(#navG)" opacity="0.85" />
        </svg>
        <span>PRISM</span>
      </div>

      {/* Center Search bar if user has searched */}
      {hasSearched && (
        <div className="nav-center">
          <SearchBar query={query} onSearch={(q) => onSearch(q)} />
        </div>
      )}

      {/* Right actions */}
      <div className="nav-actions">
        <div className="badge-anti-seo" title="Anti-SEO algorithm active: Ads & affiliate spam stripped">
          <ShieldCheck size={14} />
          <span>Anti-SEO Active</span>
        </div>

        <button
          className="btn-pinboard-trigger"
          onClick={onOpenPinboard}
          title="Open Research Workbench"
        >
          <Bookmark size={15} />
          <span>Workbench</span>
          {pinnedCount > 0 && <span className="pin-count-badge">{pinnedCount}</span>}
        </button>
      </div>
    </header>
  );
}
