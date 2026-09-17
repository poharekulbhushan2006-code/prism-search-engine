import React, { useState, useEffect } from 'react';
import { ShieldCheck, Settings, X, Check, Lock } from 'lucide-react';
import { analytics } from '../utils/analytics';

export default function CookieBanner({ onOpenPrivacy }) {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // always true
    functional: true,
    analytics: false
  });

  useEffect(() => {
    window.__prismOpenCookies = () => {
      setShowCustomize(true);
      setIsVisible(true);
    };

    try {
      const consent = localStorage.getItem('prism_cookie_consent');
      if (!consent) {
        // Show after a gentle 800ms delay
        const timer = setTimeout(() => setIsVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, []);

  const saveConsent = (consentData) => {
    try {
      localStorage.setItem('prism_cookie_consent', JSON.stringify({
        ...consentData,
        timestamp: new Date().toISOString()
      }));
    } catch {
      // ignore
    }
    analytics.updateConsent(consentData.analytics);
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ essential: true, functional: true, analytics: true });
  };

  const handleNecessaryOnly = () => {
    saveConsent({ essential: true, functional: false, analytics: false });
  };

  const handleSaveCustom = () => {
    saveConsent(preferences);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner-overlay">
      <div className="cookie-banner-card" role="dialog" aria-label="Cookie and Privacy Consent">
        <div className="cookie-banner-main">
          <div className="cookie-banner-icon">
            <ShieldCheck size={22} color="#10b981" />
          </div>
          
          <div className="cookie-banner-text">
            <h4>Privacy-First Transparency</h4>
            <p>
              PRISM operates on a zero-telemetry charter. We use strictly necessary local storage to remember your tabs and preferences. We do <strong>not</strong> track you across the web or monetize your search data.{' '}
              {onOpenPrivacy && (
                <button
                  type="button"
                  className="cookie-link-btn"
                  onClick={onOpenPrivacy}
                >
                  Read Privacy Charter
                </button>
              )}
            </p>
          </div>

          <div className="cookie-banner-actions">
            <button
              type="button"
              className="btn-cookie-secondary"
              onClick={handleNecessaryOnly}
              id="btn-cookie-necessary"
            >
              Essential Only
            </button>
            <button
              type="button"
              className="btn-cookie-customize"
              onClick={() => setShowCustomize(!showCustomize)}
              id="btn-cookie-customize"
              title="Customize Preferences"
            >
              <Settings size={15} />
            </button>
            <button
              type="button"
              className="btn-cookie-primary"
              onClick={handleAcceptAll}
              id="btn-cookie-accept"
            >
              Accept All
            </button>
          </div>
        </div>

        {/* Expandable Preferences Modal / Drawer */}
        {showCustomize && (
          <div className="cookie-custom-panel">
            <div className="cookie-option-row">
              <div className="cookie-opt-meta">
                <div className="opt-title">
                  <Lock size={14} color="#10b981" />
                  <strong>Strictly Necessary (Always Active)</strong>
                </div>
                <span>Session storage for open tabs, research workbench pins, and dark mode.</span>
              </div>
              <input type="checkbox" checked disabled className="cookie-checkbox" />
            </div>

            <div className="cookie-option-row">
              <div className="cookie-opt-meta">
                <div className="opt-title">
                  <strong>Functional Preferences</strong>
                </div>
                <span>Remembers your default lens filter and layout density.</span>
              </div>
              <input
                type="checkbox"
                checked={preferences.functional}
                onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                className="cookie-checkbox"
              />
            </div>

            <div className="cookie-option-row">
              <div className="cookie-opt-meta">
                <div className="opt-title">
                  <strong>Anonymous Performance Telemetry</strong>
                </div>
                <span>Zero-PII latency and search speed monitoring to optimize servers.</span>
              </div>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                className="cookie-checkbox"
              />
            </div>

            <div className="cookie-custom-footer">
              <button
                type="button"
                className="btn-save-cookie-prefs"
                onClick={handleSaveCustom}
              >
                <Check size={14} />
                <span>Save Custom Preferences</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
