import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/**
 * NetflixPrismIntro
 * Authentic cinematic "Ta-Dum" opening animation for PRISM:
 * 1. Deep Cinema Black Canvas
 * 2. Rising Neon Ribbons forming the PRISM optical monolith
 * 3. The "Ta-Dum" Apex Impact with high-energy flare
 * 4. 3D Chromatic Light Tunnel: 36 spectral light ribbons rushing past camera
 * 5. Zero-asset Web Audio API "Ta-Dum" sub-bass & metallic chord synthesis
 * 6. Smooth dissolve into the workspace & instant skip
 */
export default function NetflixPrismIntro({ onComplete }) {
  const [phase, setPhase] = useState('rising'); // 'rising' | 'impact' | 'tunnel' | 'exiting' | 'hidden'
  const [isMuted, setIsMuted] = useState(false);
  const audioPlayedRef = useRef(false);

  // Play browser-native synthesized "Ta-Dum" sound
  const playTaDumSound = () => {
    if (isMuted || audioPlayedRef.current) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      audioPlayedRef.current = true;

      // Note 1: Sub-bass "Ta" impact (55Hz sine with rapid exponential decay)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(58, ctx.currentTime);
      subOsc.frequency.exponentialRampToValueAtTime(32, ctx.currentTime + 0.45);

      subGain.gain.setValueAtTime(0.8, ctx.currentTime);
      subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start();
      subOsc.stop(ctx.currentTime + 0.6);

      // Note 2: Metallic resonant "DUM" chord at 180ms
      setTimeout(() => {
        try {
          const chordFreqs = [110, 164.81, 220, 277.18, 440];
          chordFreqs.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = idx % 2 === 0 ? 'triangle' : 'sawtooth';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            // Shimmer detune
            osc.detune.setValueAtTime(idx * 4 - 8, ctx.currentTime);

            gain.gain.setValueAtTime(0.22, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.4);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 1.4);
          });
        } catch (e) {}
      }, 160);
    } catch (e) {
      // Audio context blocked by browser autoplay policy - silent fallback
    }
  };

  useEffect(() => {
    // Attempt sound on impact (or when user interacts)
    const impactTimer = setTimeout(() => {
      setPhase('impact');
      playTaDumSound();
    }, 650);

    // Light tunnel explosion into 3D space
    const tunnelTimer = setTimeout(() => {
      setPhase('tunnel');
    }, 1150);

    // Exit transition
    const exitTimer = setTimeout(() => {
      setPhase('exiting');
    }, 2100);

    // Finish & unmount
    const doneTimer = setTimeout(() => {
      setPhase('hidden');
      if (onComplete) onComplete();
    }, 2500);

    // Instant skip on keypress
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        dismissIntro();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(impactTimer);
      clearTimeout(tunnelTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  const dismissIntro = () => {
    setPhase('exiting');
    setTimeout(() => {
      setPhase('hidden');
      if (onComplete) onComplete();
    }, 300);
  };

  if (phase === 'hidden') return null;

  // 36 Chromatic light ribbons for the Netflix 3D spectrum explosion
  const SPECTRUM_COLORS = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
    '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#ffffff'
  ];

  return (
    <div
      className={`netflix-intro-overlay ${phase}`}
      onClick={dismissIntro}
      title="Click to skip intro"
    >
      {/* Sound Mute Toggle */}
      <button
        className="netflix-sound-toggle"
        onClick={(e) => {
          e.stopPropagation();
          setIsMuted(!isMuted);
        }}
        title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>

      {/* Cinematic Vignette */}
      <div className="netflix-cinema-vignette" />

      {/* Phase 1 & 2: Rising Ribbons & Central PRISM Monolith */}
      <div className={`netflix-hero-stage ${phase}`}>
        {/* Optical Monolith */}
        <div className="netflix-monolith-box">
          {/* Left Ribbon (Violet) */}
          <div className="netflix-ribbon ribbon-left" />
          {/* Center Ribbon (Cyan) */}
          <div className="netflix-ribbon ribbon-center" />
          {/* Right Ribbon (Magenta) */}
          <div className="netflix-ribbon ribbon-right" />

          {/* SVG Optical Prism Core */}
          <svg viewBox="0 0 120 120" className="netflix-prism-svg">
            <defs>
              <linearGradient id="nfxPrismG" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="50%" stopColor="#7000ff" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
              <filter id="nfxGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Glowing Triangle */}
            <polygon
              points="60,16 106,98 14,98"
              fill="none"
              stroke="url(#nfxPrismG)"
              strokeWidth="4"
              strokeLinejoin="round"
              filter="url(#nfxGlow)"
              className="netflix-svg-polygon"
            />
            {/* Inner Core */}
            <polygon
              points="60,30 93,90 27,90"
              fill="url(#nfxPrismG)"
              opacity="0.9"
              className="netflix-svg-core"
            />
            {/* Specular Center */}
            <polygon
              points="60,46 78,82 42,82"
              fill="#ffffff"
              opacity="0.6"
            />
          </svg>

          {/* Apex "Ta-Dum" Light Flash */}
          <div className={`netflix-apex-flash ${phase === 'impact' ? 'flash-active' : ''}`} />
        </div>

        {/* PRISM Brand Wordmark */}
        <h1 className="netflix-brand-title">
          PR<span className="nfx-letter-i">I</span>SM
        </h1>
      </div>

      {/* Phase 3: 3D Chromatic Light Tunnel (Netflix Ribbon Explosion) */}
      <div className={`netflix-light-tunnel ${phase === 'tunnel' || phase === 'exiting' ? 'tunnel-active' : ''}`}>
        {Array.from({ length: 36 }).map((_, i) => {
          const color = SPECTRUM_COLORS[i % SPECTRUM_COLORS.length];
          const leftPercent = (i * 2.75).toFixed(1);
          const width = 2 + (i % 4) * 2;
          const delay = (i * 0.015).toFixed(3);
          const zDepth = 600 + (i % 6) * 120;

          return (
            <div
              key={i}
              className="netflix-light-beam"
              style={{
                left: `${leftPercent}%`,
                width: `${width}px`,
                background: `linear-gradient(180deg, transparent 0%, ${color} 35%, #ffffff 50%, ${color} 65%, transparent 100%)`,
                boxShadow: `0 0 16px ${color}, 0 0 32px ${color}`,
                animationDelay: `${delay}s`,
                '--z-target': `${zDepth}px`
              }}
            />
          );
        })}
      </div>

      {/* Skip Hint */}
      <div className="netflix-skip-badge">
        <span>Click anywhere to enter</span>
      </div>
    </div>
  );
}
