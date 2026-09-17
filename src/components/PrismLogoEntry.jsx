import React, { useState, useEffect } from 'react';

/**
 * PRISM Logo Entry Animation Component
 * High-aesthetic opening animation featuring:
 * 1. SVG Polygon Outer Stroke Draw (stroke-dashoffset physics)
 * 2. Prismatic Optical Core Bloom & Elastic Scale
 * 3. Radiating Spectral Light Ray Beams
 * 4. Refraction Gleam Sweep across facets
 * 5. Staggered Spring Reveal for letters (P - R - I - S - M)
 * 6. Interactive Click/Hover Replay
 */
export default function PrismLogoEntry({
  size = 'large', // 'small' | 'medium' | 'large' | 'hero'
  showTitle = true,
  showTagline = false,
  taglineText = '⚡ 0 Ads • 100% Anti-SEO Spam Filter • Private By Default',
  autoAnimate = true,
  interactive = true,
  className = '',
  onComplete
}) {
  const [animState, setAnimState] = useState(autoAnimate ? 'initial' : 'settled');
  const [gleamCount, setGleamCount] = useState(0);

  useEffect(() => {
    if (!autoAnimate) {
      setAnimState('settled');
      return;
    }

    // Step 1: Start stroke draw and core bloom immediately on mount
    const timer1 = setTimeout(() => {
      setAnimState('drawing');
    }, 40);

    // Step 2: Ignite refraction beams & light rays
    const timer2 = setTimeout(() => {
      setAnimState('igniting');
    }, 450);

    // Step 3: Letters spring into place
    const timer3 = setTimeout(() => {
      setAnimState('letters');
    }, 700);

    // Step 4: Fully settled into smooth ambient levitation
    const timer4 = setTimeout(() => {
      setAnimState('settled');
      if (onComplete) onComplete();
    }, 1400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [autoAnimate, onComplete]);

  const handleLogoClick = () => {
    if (!interactive) return;
    setGleamCount((prev) => prev + 1);
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
      className={`prism-logo-entry-container size-${size} ${animState} ${className}`}
      onClick={handleLogoClick}
      title={interactive ? 'PRISM — Click to refract optical light' : 'PRISM'}
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
      {/* Optical Core Monolith with Opening Animation */}
      <div
        className={`prism-optical-monolith-wrapper ${animState} ${gleamCount > 0 ? 're-gleam' : ''}`}
        key={`gleam-${gleamCount}`}
      >
        {/* Ambient Halo Burst behind Prism */}
        <div
          className={`prism-opening-halo ${animState}`}
          style={{
            position: 'absolute',
            width: currentSize.svgSize * 1.7,
            height: currentSize.svgSize * 1.7,
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--rt-primary, #00f0ff) 0%, var(--rt-secondary, #7000ff) 45%, transparent 70%)',
            opacity: animState === 'initial' ? 0 : animState === 'igniting' ? 0.75 : 0.35,
            filter: 'blur(24px)',
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: animState === 'initial' ? 'scale(0.3)' : animState === 'igniting' ? 'scale(1.35)' : 'scale(1)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        {/* Radiating Spectral Rays (Visible during opening & gleam) */}
        <svg
          className={`prism-opening-rays ${animState}`}
          viewBox="0 0 200 200"
          style={{
            position: 'absolute',
            width: currentSize.svgSize * 2,
            height: currentSize.svgSize * 2,
            pointerEvents: 'none',
            zIndex: 0,
            opacity: animState === 'igniting' ? 0.9 : 0,
            transform: animState === 'initial' ? 'scale(0.2) rotate(-45deg)' : animState === 'igniting' ? 'scale(1.2) rotate(15deg)' : 'scale(1) rotate(0deg)',
            transition: 'opacity 0.7s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <defs>
            <radialGradient id="rayGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="40%" stopColor="var(--rt-primary, #00f0ff)" stopOpacity="0.5" />
              <stop offset="80%" stopColor="var(--rt-secondary, #7000ff)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* 8 Spectral Ray Beams */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <line
              key={i}
              x1="100"
              y1="100"
              x2={100 + 85 * Math.cos((angle * Math.PI) / 180)}
              y2={100 + 85 * Math.sin((angle * Math.PI) / 180)}
              stroke="url(#rayGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity={0.7}
            />
          ))}
        </svg>

        {/* Master Optical Prism SVG */}
        <svg
          viewBox="0 0 120 120"
          width={currentSize.svgSize}
          height={currentSize.svgSize}
          className={`prism-svg-opening-core ${animState}`}
          style={{
            position: 'relative',
            zIndex: 1,
            filter: 'drop-shadow(0 0 24px var(--rt-primary, rgba(0, 240, 255, 0.55)))'
          }}
        >
          <defs>
            <linearGradient id="prismLightOpeningG" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--rt-primary, #6366f1)" />
              <stop offset="40%" stopColor="var(--rt-secondary, #a855f7)" />
              <stop offset="75%" stopColor="var(--rt-accent, #ec4899)" />
              <stop offset="100%" stopColor="var(--rt-primary, #06b6d4)" />
            </linearGradient>

            <filter id="prismOpeningGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Exterior Glow Triangle with Stroke Drawing Animation */}
          <polygon
            points="60,16 106,98 14,98"
            fill="none"
            stroke="url(#prismLightOpeningG)"
            strokeWidth="3.5"
            strokeLinejoin="round"
            filter="url(#prismOpeningGlow)"
            className={`prism-opening-outer-ring ${animState}`}
          />

          {/* 2. Internal Geometric Core with Spring Expansion */}
          <polygon
            points="60,30 93,90 27,90"
            fill="url(#prismLightOpeningG)"
            opacity={animState === 'initial' ? 0 : 0.92}
            className={`prism-opening-inner-core ${animState}`}
          />

          {/* 3. Center Specular Facet Highlight */}
          <polygon
            points="60,46 78,82 42,82"
            fill="#ffffff"
            opacity={animState === 'initial' ? 0 : animState === 'igniting' ? 0.95 : 0.45}
            className={`prism-opening-center-specular ${animState}`}
          />

          {/* 4. Prismatic Apex Refraction Point */}
          <circle
            cx="60"
            cy="16"
            r={animState === 'igniting' ? 4 : 2}
            fill="#ffffff"
            opacity={animState === 'initial' ? 0 : 0.9}
            style={{
              transition: 'r 0.4s ease, opacity 0.4s ease',
              filter: 'drop-shadow(0 0 8px #ffffff)'
            }}
          />
        </svg>
      </div>

      {/* Brand Typography with Staggered Letter Reveal */}
      {showTitle && (
        <h1 className={`prism-brand-title-opening ${currentSize.titleClass} ${animState}`}>
          {['P', 'R', 'I', 'S', 'M'].map((letter, idx) => {
            const isI = letter === 'I';
            // Staggered delays: 0.15s, 0.22s, 0.30s, 0.38s, 0.46s
            const letterDelay = (0.15 + idx * 0.075).toFixed(3);
            return (
              <span
                key={idx}
                className={`brand-letter-wrapper ${isI ? 'letter-i' : ''} ${animState}`}
                style={{
                  display: 'inline-block',
                  animationDelay: `${letterDelay}s`,
                  transitionDelay: `${letterDelay}s`
                }}
              >
                {letter}
              </span>
            );
          })}
        </h1>
      )}

      {/* Hero Value Pill / Tagline (Staggers in last) */}
      {showTagline && (
        <div className={`hero-cta-pill-wrapper-opening ${animState}`}>
          <div className="hero-value-pill">
            <span className="pill-dot" />
            <span>{taglineText}</span>
          </div>
        </div>
      )}
    </div>
  );
}
