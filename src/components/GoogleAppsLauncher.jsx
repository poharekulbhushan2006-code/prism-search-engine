import React, { useState, useRef, useEffect } from 'react';
import {
  Grid,
  Search,
  MapPin,
  Play,
  Mail,
  Globe,
  Bookmark,
  ShieldCheck,
  ExternalLink,
  Orbit
} from 'lucide-react';

export const PRISM_APPS = [
  {
    id: 'search',
    name: 'PRISM Search',
    tagline: 'AI Knowledge Engine',
    icon: Search,
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.15)',
    type: 'home'
  },
  {
    id: 'singularity',
    name: 'PRISM Singularity',
    tagline: 'Cosmic Black Hole Engine',
    icon: Orbit,
    color: '#f43f5e',
    bg: 'rgba(244, 63, 94, 0.15)',
    type: 'singularity'
  },
  {
    id: 'maps',
    name: 'PRISM Maps',
    tagline: 'Private World Maps',
    icon: MapPin,
    color: '#10b981',
    bg: 'rgba(168, 85, 247, 0.15)',
    type: 'maps'
  },
  {
    id: 'tube',
    name: 'PRISM Tube',
    tagline: 'Ad-Free Video Streams',
    icon: Play,
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.15)',
    type: 'tube'
  },
  {
    id: 'mail',
    name: 'PRISM Mail',
    tagline: 'Encrypted Webmail',
    icon: Mail,
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.15)',
    type: 'mail'
  },
  {
    id: 'browser',
    name: 'PRISM Browser',
    tagline: 'Multi-Tab Web Engine',
    icon: Globe,
    color: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.15)',
    type: 'home'
  },
  {
    id: 'workbench',
    name: 'Workbench',
    tagline: 'Research Pinboard',
    icon: Bookmark,
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.15)',
    type: 'workbench'
  }
];

export default function GoogleAppsLauncher({ onLaunchApp, onOpenWorkbench }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const handleAppClick = (app) => {
    setIsOpen(false);
    if (app.id === 'workbench') {
      if (onOpenWorkbench) onOpenWorkbench();
    } else {
      if (onLaunchApp) onLaunchApp(app.type, app.name);
    }
  };

  return (
    <div className="google-apps-launcher-wrapper" ref={containerRef}>
      <button
        type="button"
        className={`btn-apps-waffle ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="PRISM Apps (Google-style App Launcher)"
        id="btn-google-apps-waffle"
      >
        <Grid size={18} />
      </button>

      {isOpen && (
        <div className="apps-waffle-dropdown">
          <div className="waffle-dropdown-header">
            <span className="waffle-brand-title">PRISM Ecosystem</span>
            <span className="waffle-adfree-badge">
              <ShieldCheck size={11} color="#10b981" />
              <span>100% Ad-Free</span>
            </span>
          </div>

          <div className="waffle-apps-grid">
            {PRISM_APPS.map((app) => {
              const Icon = app.icon;
              return (
                <div
                  key={app.id}
                  className="waffle-app-card"
                  onClick={() => handleAppClick(app)}
                  title={`Launch ${app.name}`}
                >
                  <div className="waffle-app-icon-wrap" style={{ background: app.bg, color: app.color, borderColor: `${app.color}40` }}>
                    <Icon size={22} />
                  </div>
                  <span className="waffle-app-name">{app.name}</span>
                  <span className="waffle-app-sub">{app.tagline}</span>
                </div>
              );
            })}
          </div>

          <div className="waffle-dropdown-footer">
            <span>Powered by PRISM Decentralized Architecture</span>
          </div>
        </div>
      )}
    </div>
  );
}
