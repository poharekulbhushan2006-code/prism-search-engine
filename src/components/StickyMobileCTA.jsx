import React, { useState, useEffect } from 'react';
import { Sparkles, Download, X, Search, ArrowRight } from 'lucide-react';

export default function StickyMobileCTA({ onOpenInstall, onFocusSearch }) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile || isDismissed) return null;

  return (
    <div className="sticky-mobile-cta-wrapper">
      <div className="sticky-mobile-cta-card">
        <button
          type="button"
          className="sticky-cta-dismiss"
          onClick={() => setIsDismissed(true)}
          aria-label="Dismiss banner"
        >
          <X size={14} />
        </button>

        <div className="sticky-cta-content" onClick={onOpenInstall}>
          <div className="sticky-cta-icon-box">
            <Sparkles size={16} color="#6366f1" />
          </div>
          <div className="sticky-cta-text">
            <strong>Install PRISM App</strong>
            <span>Zero ads • 0.1s anti-SEO search</span>
          </div>
        </div>

        <button
          type="button"
          className="sticky-cta-btn"
          onClick={onOpenInstall}
          id="btn-sticky-mobile-install"
        >
          <Download size={14} />
          <span>Get App</span>
        </button>
      </div>
    </div>
  );
}
