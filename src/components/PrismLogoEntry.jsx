import React, { useState } from 'react';

/**
 * PRISM Logo Component (Netflix-Inspired Cinematic Edition)
 * Clean, majestic presentation of the PRISM Optical Monolith & Wordmark.
 * Supports clicking to trigger/replay the full Netflix-style intro animation.
 */
export default function PrismLogoEntry({
  size = 'large', // 'small' | 'medium' | 'large' | 'hero'
  showTitle = true,
  showTagline = false,
  taglineText = '⚡ 0 Ads • 100% Anti-SEO Spam Filter • Private By Default',
  interactive = true,
  className = '',
  onReplayIntro
}) {
  const [isClicked, setIsClicked] = useState(false);

  const handleLogoClick = () => {
    if (!interactive) return;
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 600);

    // Trigger Netflix intro callback or custom event
    if (onReplayIntro) {
      onReplayIntro();
    } else {
      window.dispatchEvent(new CustomEvent('prism:play-netflix-intro'));
    }
  };

  // Sizing tokens
  const sizeMap = {
    small: { svgSize: 34, titleClass: 'logo-text-sm', containerGap: '0.5rem' },
    medium: { svgSize: 56, titleClass: 'logo-text-md', containerGap: '0.75rem' },
    large: { svgSize: 96, titleClass: 'logo-text-lg', containerGap: '1.1rem' },
    hero: { svgSize: 130, titleClass: 'logo-text-hero', containerGap: '1.4rem' }
  };
  const currentSize = sizeMap[size] || sizeMap.large;

  return (
    <div
      className={`prism-logo-cinematic-container size-${size} ${className}`}
      onClick={handleLogoClick}
      title={interactive ? 'PRISM — Click to play cinematic Netflix intro' : 'PRISM'}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: currentSize.containerGap,
        cursor: interactive ? 'pointer' : 'default',
        userSelect: 'none'
      }}
    >
      {/* Optical Core Monolith */}
      <div className={`prism-cinematic-monolith ${isClicked ? 'monolith-clicked' : ''}`}>
        {/* Ambient Halo */}
        <div
          className="prism-cinematic-halo"
          style={{
            position: 'absolute',
            width: currentSize.svgSize * 1.5,
            height: currentSize.svgSize * 1.5,
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--rt-primary, #00f0ff) 0%, var(--rt-secondary, #7000ff) 50%, transparent 70%)',
            opacity: 0.45,
            filter: 'blur(20px)',
            pointerEvents: 'none'
          }}
        />

        {/* Master Optical Prism SVG */}
        <svg
          viewBox="0 0 120 120"
          width={currentSize.svgSize}
          height={currentSize.svgSize}
          className="prism-cinematic-svg"
          style={{
            position: 'relative',
            zIndex: 1,
            filter: 'drop-shadow(0 0 24px var(--rt-primary, rgba(0, 240, 255, 0.6)))'
          }}
        >
          <defs>
            <linearGradient id="prismCinemaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--rt-primary, #00f0ff)" />
              <stop offset="50%" stopColor="var(--rt-secondary, #7000ff)" />
              <stop offset="100%" stopColor="var(--rt-accent, #ec4899)" />
            </linearGradient>

            <filter id="prismCinemaGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Exterior Glow Triangle */}
          <polygon
            points="60,16 106,98 14,98"
            fill="none"
            stroke="url(#prismCinemaGrad)"
            strokeWidth="3.5"
            strokeLinejoin="round"
            filter="url(#prismCinemaGlow)"
            className="prism-cinematic-ring"
          />

          {/* Internal Geometric Core */}
          <polygon
            points="60,30 93,90 27,90"
            fill="url(#prismCinemaGrad)"
            opacity="0.92"
            className="prism-cinematic-core"
          />

          {/* Center Specular Facet Highlight */}
          <polygon
            points="60,46 78,82 42,82"
            fill="#ffffff"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      {showTitle && (
        <h1 className={`prism-cinematic-brand-title ${currentSize.titleClass}`}>
          PR<span className="prism-brand-letter-i">I</span>SM
        </h1>
      )}

      {/* Hero Value Pill / Tagline */}
      {showTagline && (
        <div className="hero-cta-pill-wrapper">
          <div className="hero-value-pill">
            <span className="pill-dot" />
            <span>{taglineText}</span>
          </div>
        </div>
      )}
    </div>
  );
}
