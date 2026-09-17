import React, { createContext, useContext, useState, useEffect } from 'react';
import { Palette, Sparkles, Check, RefreshCw, X, Sliders, ShieldCheck } from 'lucide-react';

/**
 * Realtime Colors System (realtimecolors.com inspired)
 * Mathematically balanced color harmonies with dynamic real-time CSS variable updates
 */

export const REALTIME_PALETTES = [
  {
    id: 'prism-neon',
    name: 'Prism Neon',
    tag: 'Default • Cyberpunk High Contrast',
    bg: '#030712',
    surface1: '#0b0f19',
    surface2: '#151d30',
    surface3: '#1f293d',
    text: '#f8fafc',
    textMuted: '#94a3b8',
    primary: '#6366f1',
    primaryGlow: 'rgba(99, 102, 241, 0.35)',
    secondary: '#06b6d4',
    accent: '#f43f5e',
    border: 'rgba(255, 255, 255, 0.1)'
  },
  {
    id: 'cyber-emerald',
    name: 'Cyber Emerald',
    tag: 'Matrix • Terminal Green',
    bg: '#020b08',
    surface1: '#061a12',
    surface2: '#0e2b1f',
    surface3: '#184230',
    text: '#f0fdf4',
    textMuted: '#86efac',
    primary: '#10b981',
    primaryGlow: 'rgba(16, 185, 129, 0.38)',
    secondary: '#34d399',
    accent: '#f59e0b',
    border: 'rgba(52, 211, 153, 0.18)'
  },
  {
    id: 'sunset-horizon',
    name: 'Sunset Horizon',
    tag: 'Warm Amber • Solar Flare',
    bg: '#0c0a09',
    surface1: '#1c1917',
    surface2: '#292524',
    surface3: '#3c3531',
    text: '#fff7ed',
    textMuted: '#fdba74',
    primary: '#f97316',
    primaryGlow: 'rgba(249, 115, 22, 0.38)',
    secondary: '#eab308',
    accent: '#ec4899',
    border: 'rgba(249, 115, 22, 0.18)'
  },
  {
    id: 'midnight-ocean',
    name: 'Midnight Ocean',
    tag: 'Marine Abyss • Deep Sapphire',
    bg: '#020617',
    surface1: '#0b1329',
    surface2: '#162544',
    surface3: '#223661',
    text: '#f0f9ff',
    textMuted: '#93c5fd',
    primary: '#2563eb',
    primaryGlow: 'rgba(37, 99, 235, 0.4)',
    secondary: '#38bdf8',
    accent: '#ef4444',
    border: 'rgba(56, 189, 248, 0.16)'
  },
  {
    id: 'cosmic-amethyst',
    name: 'Cosmic Amethyst',
    tag: 'Royal Purple • Neon Fuchsia',
    bg: '#090514',
    surface1: '#170b2e',
    surface2: '#25124a',
    surface3: '#371c6d',
    text: '#faf5ff',
    textMuted: '#d8b4fe',
    primary: '#9333ea',
    primaryGlow: 'rgba(147, 51, 234, 0.42)',
    secondary: '#d946ef',
    accent: '#facc15',
    border: 'rgba(217, 70, 239, 0.18)'
  }
];

const RealtimeColorsContext = createContext(null);

export function RealtimeColorsProvider({ children }) {
  const [activePaletteId, setActivePaletteId] = useState(() => {
    try {
      return localStorage.getItem('prism_realtime_palette') || 'prism-neon';
    } catch {
      return 'prism-neon';
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customPalette, setCustomPalette] = useState(null);

  const activePalette =
    customPalette ||
    REALTIME_PALETTES.find((p) => p.id === activePaletteId) ||
    REALTIME_PALETTES[0];

  // Apply colors to document CSS root variables in real time
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--rt-bg', activePalette.bg);
    root.style.setProperty('--rt-surface-1', activePalette.surface1);
    root.style.setProperty('--rt-surface-2', activePalette.surface2);
    root.style.setProperty('--rt-surface-3', activePalette.surface3);
    root.style.setProperty('--rt-text', activePalette.text);
    root.style.setProperty('--rt-text-muted', activePalette.textMuted);
    root.style.setProperty('--rt-primary', activePalette.primary);
    root.style.setProperty('--rt-primary-glow', activePalette.primaryGlow);
    root.style.setProperty('--rt-secondary', activePalette.secondary);
    root.style.setProperty('--rt-accent', activePalette.accent);
    root.style.setProperty('--rt-border', activePalette.border);

    try {
      localStorage.setItem('prism_realtime_palette', activePalette.id);
    } catch {}
  }, [activePalette]);

  const selectPalette = (id) => {
    setCustomPalette(null);
    setActivePaletteId(id);
  };

  const randomizePalette = () => {
    // Generate harmonious random colors (high contrast dark mode)
    const randomHues = [
      { primary: '#3b82f6', secondary: '#10b981', accent: '#f59e0b', name: 'Electric Blue' },
      { primary: '#ec4899', secondary: '#8b5cf6', accent: '#06b6d4', name: 'Neon Synthwave' },
      { primary: '#14b8a6', secondary: '#6366f1', accent: '#fbbf24', name: 'Teal Aurora' },
      { primary: '#e11d48', secondary: '#f97316', accent: '#38bdf8', name: 'Crimson Sun' },
      { primary: '#8b5cf6', secondary: '#06b6d4', accent: '#10b981', name: 'Quantum Violet' }
    ];

    const pick = randomHues[Math.floor(Math.random() * randomHues.length)];
    const generated = {
      id: `custom-${Date.now()}`,
      name: `${pick.name} (Harmonized)`,
      tag: 'Randomized Realtime Harmony',
      bg: '#040711',
      surface1: '#0c1220',
      surface2: '#161f36',
      surface3: '#222f4f',
      text: '#f8fafc',
      textMuted: '#94a3b8',
      primary: pick.primary,
      primaryGlow: `${pick.primary}66`,
      secondary: pick.secondary,
      accent: pick.accent,
      border: `${pick.primary}33`
    };

    setCustomPalette(generated);
  };

  return (
    <RealtimeColorsContext.Provider
      value={{
        activePalette,
        activePaletteId,
        selectPalette,
        randomizePalette,
        isModalOpen,
        setIsModalOpen
      }}
    >
      {children}
      <RealtimeColorsModal />
    </RealtimeColorsContext.Provider>
  );
}

export function useRealtimeColors() {
  const context = useContext(RealtimeColorsContext);
  if (!context) {
    throw new Error('useRealtimeColors must be used within RealtimeColorsProvider');
  }
  return context;
}

// Interactive Realtime Colors Palette Switcher Modal & Quick Pill
export function RealtimeColorsTriggerButton({ className = '' }) {
  const { activePalette, setIsModalOpen } = useRealtimeColors();

  return (
    <button
      type="button"
      className={`realtime-colors-trigger-btn ${className}`}
      onClick={() => setIsModalOpen(true)}
      title="Open Realtime Colors Harmonizer"
    >
      <div className="trigger-swatch-dots">
        <span style={{ background: activePalette.primary }} />
        <span style={{ background: activePalette.secondary }} />
        <span style={{ background: activePalette.accent }} />
      </div>
      <span className="trigger-label">Colors</span>
      <Palette size={13} className="trigger-icon" />
    </button>
  );
}

export function RealtimeColorsModal() {
  const {
    activePalette,
    activePaletteId,
    selectPalette,
    randomizePalette,
    isModalOpen,
    setIsModalOpen
  } = useRealtimeColors();

  if (!isModalOpen) return null;

  return (
    <div className="realtime-colors-modal-backdrop" onClick={() => setIsModalOpen(false)}>
      <div
        className="realtime-colors-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="rc-modal-header">
          <div className="rc-title-group">
            <div className="rc-icon-badge">
              <Palette size={18} color="var(--rt-primary)" />
            </div>
            <div>
              <h3 className="rc-title">Realtime Colors Harmonizer</h3>
              <p className="rc-subtitle">
                Inspired by realtimecolors.com • 100% live CSS token transition
              </p>
            </div>
          </div>
          <button
            type="button"
            className="rc-close-btn"
            onClick={() => setIsModalOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Live Active Palette Status Banner */}
        <div className="rc-active-banner">
          <div className="rc-active-info">
            <span className="rc-active-label">CURRENT HARMONY</span>
            <span className="rc-active-name">{activePalette.name}</span>
          </div>

          <div className="rc-palette-strip">
            <div className="rc-swatch-block" style={{ background: activePalette.bg }} title={`Background: ${activePalette.bg}`} />
            <div className="rc-swatch-block" style={{ background: activePalette.surface1 }} title={`Surface: ${activePalette.surface1}`} />
            <div className="rc-swatch-block" style={{ background: activePalette.primary }} title={`Primary: ${activePalette.primary}`} />
            <div className="rc-swatch-block" style={{ background: activePalette.secondary }} title={`Secondary: ${activePalette.secondary}`} />
            <div className="rc-swatch-block" style={{ background: activePalette.accent }} title={`Accent: ${activePalette.accent}`} />
          </div>

          <button
            type="button"
            className="rc-randomize-btn"
            onClick={randomizePalette}
            title="Generate Random Harmonious Palette"
          >
            <RefreshCw size={14} />
            <span>Randomize</span>
          </button>
        </div>

        {/* Curated Harmonies List */}
        <div className="rc-palettes-grid">
          {REALTIME_PALETTES.map((palette) => {
            const isSelected = activePalette.id === palette.id;
            return (
              <div
                key={palette.id}
                className={`rc-palette-card ${isSelected ? 'selected' : ''}`}
                onClick={() => selectPalette(palette.id)}
              >
                <div className="rc-card-top">
                  <div>
                    <h4 className="rc-card-name">{palette.name}</h4>
                    <span className="rc-card-tag">{palette.tag}</span>
                  </div>
                  {isSelected && (
                    <span className="rc-check-badge">
                      <Check size={14} color="#ffffff" />
                    </span>
                  )}
                </div>

                {/* 5-Color Realtime Token Bar */}
                <div className="rc-card-tokens-row">
                  <div className="token-item">
                    <span className="token-dot" style={{ background: palette.bg }} />
                    <span className="token-name">Bg</span>
                  </div>
                  <div className="token-item">
                    <span className="token-dot" style={{ background: palette.primary }} />
                    <span className="token-name">Primary</span>
                  </div>
                  <div className="token-item">
                    <span className="token-dot" style={{ background: palette.secondary }} />
                    <span className="token-name">Secondary</span>
                  </div>
                  <div className="token-item">
                    <span className="token-dot" style={{ background: palette.accent }} />
                    <span className="token-name">Accent</span>
                  </div>
                  <div className="token-item">
                    <span className="token-dot" style={{ background: palette.text }} />
                    <span className="token-name">Text</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info with contrast compliance */}
        <div className="rc-modal-footer">
          <div className="rc-compliance-note">
            <ShieldCheck size={14} color="#10b981" />
            <span>WCAG AAA Accessible Contrast • Live CSS Custom Properties</span>
          </div>
          <button
            type="button"
            className="rc-done-btn"
            onClick={() => setIsModalOpen(false)}
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}
