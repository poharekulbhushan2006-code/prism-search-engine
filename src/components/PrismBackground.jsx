import React from 'react';
import BlackHole from './ui/black-hole';

export default function PrismBackground() {
  return (
    <div 
      className="prism-ambient-canvas-wrapper" 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: '#000000'
      }}
      aria-hidden="true"
    >
      <BlackHole />
    </div>
  );
}
