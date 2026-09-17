import React, { useState, useEffect } from 'react';
import PrismLogoEntry from './PrismLogoEntry';

/**
 * AppOpeningSplash
 * Cinematic opening sequence for PRISM.
 * Smoothly displays on site open, refracts light, and dissolves cleanly into the workspace.
 * Features instant click-to-dismiss and zero blocking of user input after dissolution.
 */
export default function AppOpeningSplash({ onComplete }) {
  const [stage, setStage] = useState('active'); // 'active' | 'exiting' | 'hidden'

  useEffect(() => {
    // 1. Stage: Exiting fade after 1.15s
    const exitTimer = setTimeout(() => {
      setStage('exiting');
    }, 1150);

    // 2. Stage: Hidden & unmounted after exit animation (1.55s total)
    const hideTimer = setTimeout(() => {
      setStage('hidden');
      if (onComplete) onComplete();
    }, 1550);

    // Allow click or keypress to immediately skip splash
    const handleQuickDismiss = () => {
      setStage('exiting');
      setTimeout(() => {
        setStage('hidden');
        if (onComplete) onComplete();
      }, 350);
    };

    window.addEventListener('keydown', handleQuickDismiss);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
      window.removeEventListener('keydown', handleQuickDismiss);
    };
  }, [onComplete]);

  if (stage === 'hidden') return null;

  const handleBackdropClick = () => {
    setStage('exiting');
    setTimeout(() => {
      setStage('hidden');
      if (onComplete) onComplete();
    }, 350);
  };

  return (
    <div
      className={`prism-app-opening-splash ${stage}`}
      onClick={handleBackdropClick}
      title="Click to enter PRISM"
    >
      {/* Dynamic Background Light Dispersion */}
      <div className="splash-ambient-glow" />

      {/* Incident Light Beam (travels from left to strike the prism) */}
      <div className="splash-incident-beam" />

      {/* Centered Optical Logo with Entry Animation */}
      <div className="splash-logo-card">
        <PrismLogoEntry
          size="hero"
          showTitle={true}
          showTagline={false}
          autoAnimate={true}
          interactive={false}
        />

        <div className="splash-tagline-container">
          <p className="splash-tagline-text">
            Private Hybrid Browser & Autonomous AI Engine
          </p>
          <div className="splash-loading-track">
            <div className="splash-loading-fill" />
          </div>
          <span className="splash-skip-hint">Click anywhere to skip</span>
        </div>
      </div>
    </div>
  );
}
