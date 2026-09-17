import React, { useState, useEffect } from 'react';
import { Sparkles, Download, X } from 'lucide-react';

export default function StickyMobileCTA({ onOpenInstall, onFocusSearch }) {
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('prism_mobile_cta_dismissed') === '1';
    } catch {
      return false;
    }
  });
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 180);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  const handleDismiss = (e) => {
    e.stopPropagation();
    setIsDismissed(true);
    try {
      sessionStorage.setItem('prism_mobile_cta_dismissed', '1');
    } catch {
      // ignore
    }
  };

  // Only render when on mobile, user has scrolled past top fold, and not dismissed
  if (!isMobile || !isScrolled || isDismissed) return null;

  return (
    <div className="sticky-mobile-cta-wrapper">
      <div className="sticky-mobile-cta-card">
        <button
          type="button"
          className="sticky-cta-dismiss"
          onClick={handleDismiss}
          aria-label="Dismiss banner"
          title="Dismiss"
        >
          <X size={13} />
        </button>

        <div className="sticky-cta-content" onClick={onOpenInstall}>
          <div className="sticky-cta-icon-box">
            <Sparkles size={15} color="#6366f1" />
          </div>
          <div className="sticky-cta-text">
            <strong>Install PRISM App</strong>
            <span>0 Ads • 0.1s anti-SEO search</span>
          </div>
        </div>

        <button
          type="button"
          className="sticky-cta-btn"
          onClick={onOpenInstall}
          id="btn-sticky-mobile-install"
        >
          <Download size={13} />
          <span>Get App</span>
        </button>
      </div>
    </div>
  );
}
