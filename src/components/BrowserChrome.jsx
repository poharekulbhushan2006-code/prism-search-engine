import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import UserProfileMenu from './UserProfileMenu';
import GoogleAppsLauncher from './GoogleAppsLauncher';
import { RealtimeColorsTriggerButton } from './RealtimeColors';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Lock,
  Plus,
  X,
  Search,
  Bookmark,
  ShieldCheck,
  Layers,
  Sparkles,
  User,
  Download
} from 'lucide-react';

export default function BrowserChrome({
  tabs,
  activeTabId,
  onSelectTab,
  onNewTab,
  onCloseTab,
  onNavigateBack,
  onNavigateForward,
  onReload,
  onGoHome,
  onOmniboxSubmit,
  currentLens,
  onSelectLens,
  onOpenWorkbench,
  pinnedCount,
  isLoading,
  currentUser,
  onOpenAuthModal,
  onLogout,
  searchesCount,
  onOpenInstall,
  onLaunchApp
}) {
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const [omniboxVal, setOmniboxVal] = useState('');
  const [showLensMenu, setShowLensMenu] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSugIndex, setSelectedSugIndex] = useState(-1);

  useEffect(() => {
    if (!isFocused && activeTab) {
      if (activeTab.type === 'search') {
        setOmniboxVal(activeTab.url || activeTab.title || '');
      } else if (activeTab.type === 'reader') {
        setOmniboxVal(activeTab.url || '');
      } else if (activeTab.type === 'maps') {
        setOmniboxVal(activeTab.url ? `maps ${activeTab.url}` : 'prism://maps');
      } else if (activeTab.type === 'tube') {
        setOmniboxVal(activeTab.url ? `tube ${activeTab.url}` : 'prism://tube');
      } else if (activeTab.type === 'mail') {
        setOmniboxVal('prism://mail');
      } else {
        setOmniboxVal('');
      }
    }
  }, [activeTabId, activeTab?.url, activeTab?.type, isFocused]);

  // Live autocomplete suggestions in Omnibox
  useEffect(() => {
    if (!omniboxVal || omniboxVal.trim().length < 2 || !isFocused) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Skip suggestion fetch if user is typing a direct URL
    if (/^https?:\/\//i.test(omniboxVal) || (omniboxVal.includes('.') && !omniboxVal.includes(' '))) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(`/api/suggestions?q=${encodeURIComponent(omniboxVal.trim())}`);
        if (res.data?.suggestions && res.data.suggestions.length > 0) {
          setSuggestions(res.data.suggestions.slice(0, 5));
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [omniboxVal, isFocused]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (omniboxVal.trim()) {
      setShowSuggestions(false);
      setSelectedSugIndex(-1);
      onOmniboxSubmit(omniboxVal.trim());
    }
  };

  const handleSelectSuggestion = (text) => {
    setOmniboxVal(text);
    setShowSuggestions(false);
    setSelectedSugIndex(-1);
    onOmniboxSubmit(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedSugIndex(-1);
    } else if (e.key === 'ArrowDown') {
      if (suggestions.length > 0) {
        e.preventDefault();
        setSelectedSugIndex((prev) => (prev + 1) % suggestions.length);
      }
    } else if (e.key === 'ArrowUp') {
      if (suggestions.length > 0) {
        e.preventDefault();
        setSelectedSugIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
      }
    } else if (e.key === 'Enter') {
      if (selectedSugIndex >= 0 && suggestions[selectedSugIndex]) {
        e.preventDefault();
        handleSelectSuggestion(suggestions[selectedSugIndex]);
      }
    }
  };

  const getTabIcon = (tab) => {
    if (tab.type === 'reader') return '📖';
    if (tab.type === 'search') return '🔍';
    if (tab.type === 'maps') return '🗺️';
    if (tab.type === 'tube') return '▶️';
    if (tab.type === 'mail') return '✉️';
    return '💎';
  };

  const LENSES = [
    { id: 'all', label: 'All Lenses' },
    { id: 'human', label: 'Human Voices' },
    { id: 'research', label: 'Deep Research' },
    { id: 'perspectives', label: 'Perspectives' },
    { id: 'code', label: 'Code & Dev' }
  ];

  return (
    <div className="browser-header-chrome">
      {/* 1. Window Controls & Tab Strip */}
      <div className="chrome-tab-row">
        {/* macOS Traffic Lights */}
        <div className="traffic-lights">
          <div className="light-dot light-red" title="Close Window" onClick={onGoHome} />
          <div className="light-dot light-yellow" title="Minimize" />
          <div className="light-dot light-green" title="Full Screen" />
        </div>

        {/* Dynamic Tabs */}
        <div className="tabs-scroll-wrapper">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                className={`browser-tab ${isActive ? 'active' : ''}`}
                onClick={() => onSelectTab(tab.id)}
                title={tab.title}
              >
                <span className="tab-favicon">{getTabIcon(tab)}</span>
                <span className="tab-title">{tab.title || 'New Tab'}</span>
                {tabs.length > 1 && (
                  <button
                    type="button"
                    className="btn-tab-close"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab(tab.id);
                    }}
                    title="Close tab"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            );
          })}

          {/* New Tab Button */}
          <button
            type="button"
            className="btn-new-tab"
            onClick={onNewTab}
            title="Open new tab"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* 2. Navigation Bar & Omnibox Strip */}
      <div className="chrome-nav-row">
        {/* Nav Controls */}
        <div className="nav-buttons-group">
          <button
            type="button"
            className="btn-chrome-nav"
            onClick={onNavigateBack}
            disabled={activeTab?.historyIndex <= 0}
            title="Click to go back"
          >
            <ArrowLeft size={14} />
          </button>
          <button
            type="button"
            className="btn-chrome-nav"
            onClick={onNavigateForward}
            disabled={!activeTab?.history || activeTab.historyIndex >= activeTab.history.length - 1}
            title="Click to go forward"
          >
            <ArrowRight size={14} />
          </button>
          <button
            type="button"
            className="btn-chrome-nav"
            onClick={onReload}
            title="Reload this page"
          >
            <RotateCw size={13} className={isLoading ? 'spinning' : ''} />
          </button>
          <button
            type="button"
            className="btn-chrome-nav"
            onClick={onGoHome}
            title="Open PRISM Start Page"
          >
            <Home size={14} />
          </button>
        </div>

        {/* Omnibox (Unified URL & Search) */}
        <div className="omnibox-wrapper">
          <form onSubmit={handleSubmit} className="omnibox-container">
            <div className="omnibox-security">
              <Lock size={12} />
              <span>Secure</span>
            </div>

            <input
              type="text"
              className="omnibox-input"
              value={omniboxVal}
              onChange={(e) => setOmniboxVal(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setTimeout(() => setIsFocused(false), 200);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search anything or enter web address (e.g. github.com)..."
              id="prism-omnibox-input"
            />

            {/* Live Omnibox Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && isFocused && (
              <div
                className="omnibox-suggestions-dropdown"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  right: 0,
                  background: 'rgba(15, 23, 42, 0.96)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(99, 102, 241, 0.35)',
                  borderRadius: '12px',
                  boxShadow: '0 16px 40px rgba(0,0,0,0.85), 0 0 20px rgba(99, 102, 241, 0.15)',
                  zIndex: 1000,
                  overflow: 'hidden',
                  padding: '0.35rem'
                }}
              >
                {suggestions.map((sug, idx) => (
                  <div
                    key={idx}
                    className={`omnibox-suggestion-item ${selectedSugIndex === idx ? 'active' : ''}`}
                    onMouseDown={() => handleSelectSuggestion(sug)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.5rem 0.8rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: selectedSugIndex === idx ? '#38bdf8' : '#e2e8f0',
                      background: selectedSugIndex === idx ? 'rgba(99, 102, 241, 0.22)' : 'transparent',
                      fontSize: '0.84rem'
                    }}
                  >
                    <Search size={13} color="#818cf8" />
                    <span>{sug}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Lens Selector Chip inside Omnibox */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="omnibox-lens-badge"
                onClick={() => setShowLensMenu(!showLensMenu)}
                title="Current Search Lens"
              >
                <Sparkles size={11} />
                <span>{LENSES.find((l) => l.id === currentLens)?.label || 'Lens'}</span>
              </button>

              {showLensMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    background: 'rgba(15, 19, 28, 0.96)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '10px',
                    padding: '0.4rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
                    zIndex: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: '150px'
                  }}
                >
                  {LENSES.map((lens) => (
                    <button
                      key={lens.id}
                      type="button"
                      onClick={() => {
                        onSelectLens(lens.id);
                        setShowLensMenu(false);
                      }}
                      style={{
                        padding: '0.4rem 0.75rem',
                        textAlign: 'left',
                        fontSize: '0.8rem',
                        color: currentLens === lens.id ? '#60a5fa' : '#cbd5e1',
                        borderRadius: '6px',
                        background: currentLens === lens.id ? 'rgba(99,102,241,0.18)' : 'transparent'
                      }}
                    >
                      {lens.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Right Tools: Google Apps Waffle, Install App, Workbench & User Account Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Google 9-dots Apps Launcher */}
          <GoogleAppsLauncher
            onLaunchApp={onLaunchApp}
            onOpenWorkbench={onOpenWorkbench}
          />

          {/* Realtime Colors Harmonizer */}
          <RealtimeColorsTriggerButton />

          <button
            type="button"
            className="btn-install-trigger"
            onClick={onOpenInstall}
            title="Install PRISM on Device / Google Play Store"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.42rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid rgba(6, 182, 212, 0.35)',
              background: 'rgba(6, 182, 212, 0.12)',
              color: '#38bdf8',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Download size={13} />
            <span>Install</span>
          </button>

          <button
            type="button"
            className="btn-pinboard-trigger"
            onClick={onOpenWorkbench}
            title="Open Research Workbench"
          >
            <Bookmark size={14} />
            <span>Workbench</span>
            {pinnedCount > 0 && <span className="pin-count-badge">{pinnedCount}</span>}
          </button>

          {currentUser ? (
            <UserProfileMenu
              user={currentUser}
              onLogout={onLogout}
              onOpenWorkbench={onOpenWorkbench}
              searchesCount={searchesCount}
              pinnedCount={pinnedCount}
            />
          ) : (
            <button
              type="button"
              className="btn-signin-trigger"
              onClick={onOpenAuthModal}
              title="Sign In or Create Account"
            >
              <User size={13} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Laser Sweep Progress Bar */}
      {isLoading && (
        <div className="chrome-progress-bar">
          <div className="progress-indicator" />
        </div>
      )}
    </div>
  );
}
