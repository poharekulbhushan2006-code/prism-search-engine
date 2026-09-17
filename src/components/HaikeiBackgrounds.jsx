import React from 'react';

/**
 * Haikei Generative SVG Backgrounds (haikei.app inspired)
 * Precision mathematical SVG curve generators: Layered Waves, Fluid Blobs, Topo Contours & Poly Mesh
 * All SVG gradients dynamically tap into PRISM's Realtime Colors variables.
 */

// 1. HaikeiLayeredWaves: Smooth multi-tiered sinusoidal wave horizon
export function HaikeiLayeredWaves({ className = '', opacity = 0.85, animate = true }) {
  return (
    <div
      className={`haikei-svg-container haikei-layered-waves ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        opacity
      }}
    >
      <svg
        viewBox="0 0 1440 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      >
        <defs>
          <linearGradient id="haikeiWaveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--rt-primary, #6366f1)" stopOpacity="0.18" />
            <stop offset="50%" stopColor="var(--rt-secondary, #06b6d4)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--rt-accent, #f43f5e)" stopOpacity="0.05" />
          </linearGradient>

          <linearGradient id="haikeiWaveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--rt-secondary, #06b6d4)" stopOpacity="0.15" />
            <stop offset="50%" stopColor="var(--rt-primary, #6366f1)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--rt-surface-1, #0f172a)" stopOpacity="0.0" />
          </linearGradient>

          <linearGradient id="haikeiWaveGrad3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--rt-accent, #f43f5e)" stopOpacity="0.1" />
            <stop offset="70%" stopColor="var(--rt-primary, #6366f1)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Back Wave Layer */}
        <path
          d="M0,220 C240,310 480,140 720,240 C960,340 1200,160 1440,260 L1440,600 L0,600 Z"
          fill="url(#haikeiWaveGrad1)"
          className={animate ? 'haikei-wave-path-1' : ''}
        />

        {/* Mid Wave Layer */}
        <path
          d="M0,320 C320,200 560,380 840,280 C1120,180 1320,340 1440,290 L1440,600 L0,600 Z"
          fill="url(#haikeiWaveGrad2)"
          className={animate ? 'haikei-wave-path-2' : ''}
        />

        {/* Front Wave Layer */}
        <path
          d="M0,420 C280,360 520,490 800,430 C1080,370 1280,480 1440,410 L1440,600 L0,600 Z"
          fill="url(#haikeiWaveGrad3)"
          className={animate ? 'haikei-wave-path-3' : ''}
        />
      </svg>
    </div>
  );
}

// 2. HaikeiFluidBlobs: Organic morphing ambient liquid blobs
export function HaikeiFluidBlobs({ className = '', opacity = 0.75 }) {
  return (
    <div
      className={`haikei-svg-container haikei-fluid-blobs ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        opacity
      }}
    >
      <svg
        viewBox="0 0 1000 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      >
        <defs>
          <filter id="haikeiGooFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="60" result="blur" />
          </filter>

          <radialGradient id="haikeiBlobGrad1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--rt-primary, #6366f1)" stopOpacity="0.32" />
            <stop offset="60%" stopColor="var(--rt-secondary, #06b6d4)" stopOpacity="0.14" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="haikeiBlobGrad2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--rt-accent, #f43f5e)" stopOpacity="0.25" />
            <stop offset="70%" stopColor="var(--rt-primary, #6366f1)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="haikeiBlobGrad3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--rt-secondary, #06b6d4)" stopOpacity="0.28" />
            <stop offset="80%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g filter="url(#haikeiGooFilter)">
          {/* Blob 1: Top Right */}
          <path
            d="M750,180 C840,140 920,240 880,330 C840,420 720,440 650,380 C580,320 660,220 750,180 Z"
            fill="url(#haikeiBlobGrad1)"
            className="haikei-morph-blob-1"
          />

          {/* Blob 2: Bottom Left */}
          <path
            d="M240,420 C320,380 410,460 380,550 C350,640 230,660 160,600 C90,540 160,460 240,420 Z"
            fill="url(#haikeiBlobGrad2)"
            className="haikei-morph-blob-2"
          />

          {/* Blob 3: Center Mid */}
          <circle
            cx="500"
            cy="300"
            r="180"
            fill="url(#haikeiBlobGrad3)"
            className="haikei-morph-blob-3"
          />
        </g>
      </svg>
    </div>
  );
}

// 3. HaikeiTopoContours: Topographical elevation curves for geospatial / technical UI
export function HaikeiTopoContours({ className = '', opacity = 0.25 }) {
  return (
    <div
      className={`haikei-svg-container haikei-topo-contours ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        opacity
      }}
    >
      <svg
        viewBox="0 0 1200 800"
        fill="none"
        stroke="var(--rt-primary, #6366f1)"
        strokeWidth="1.2"
        strokeDasharray="4 6"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      >
        <path d="M100,700 C300,600 500,750 700,650 C900,550 1050,700 1200,600" opacity="0.6" />
        <path d="M50,620 C280,520 480,670 680,580 C880,490 1020,630 1200,530" opacity="0.5" />
        <path d="M0,540 C250,440 450,590 650,510 C850,430 990,560 1200,460" opacity="0.4" />
        <path d="M0,460 C220,360 420,510 620,440 C820,370 960,490 1200,390" opacity="0.3" />
        <path d="M0,380 C190,280 390,430 590,370 C790,310 930,420 1200,320" opacity="0.2" />
      </svg>
    </div>
  );
}

// 4. HaikeiPolygonMesh: Geometric polygonal mesh background
export function HaikeiPolygonMesh({ className = '', opacity = 0.2 }) {
  return (
    <div
      className={`haikei-svg-container haikei-poly-mesh ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        opacity
      }}
    >
      <svg
        viewBox="0 0 1200 600"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <polygon points="0,0 200,80 150,220 0,180" fill="var(--rt-primary)" fillOpacity="0.08" stroke="rgba(255,255,255,0.04)" />
        <polygon points="200,80 420,40 380,200 150,220" fill="var(--rt-secondary)" fillOpacity="0.06" stroke="rgba(255,255,255,0.04)" />
        <polygon points="420,40 680,90 620,230 380,200" fill="var(--rt-primary)" fillOpacity="0.09" stroke="rgba(255,255,255,0.04)" />
        <polygon points="680,90 920,30 890,190 620,230" fill="var(--rt-accent)" fillOpacity="0.05" stroke="rgba(255,255,255,0.04)" />
        <polygon points="920,30 1200,0 1200,180 890,190" fill="var(--rt-primary)" fillOpacity="0.07" stroke="rgba(255,255,255,0.04)" />
        <polygon points="0,180 150,220 120,400 0,380" fill="var(--rt-secondary)" fillOpacity="0.05" stroke="rgba(255,255,255,0.04)" />
        <polygon points="150,220 380,200 340,390 120,400" fill="var(--rt-primary)" fillOpacity="0.08" stroke="rgba(255,255,255,0.04)" />
        <polygon points="380,200 620,230 580,410 340,390" fill="var(--rt-secondary)" fillOpacity="0.06" stroke="rgba(255,255,255,0.04)" />
        <polygon points="620,230 890,190 850,380 580,410" fill="var(--rt-primary)" fillOpacity="0.09" stroke="rgba(255,255,255,0.04)" />
        <polygon points="890,190 1200,180 1200,360 850,380" fill="var(--rt-accent)" fillOpacity="0.07" stroke="rgba(255,255,255,0.04)" />
      </svg>
    </div>
  );
}
