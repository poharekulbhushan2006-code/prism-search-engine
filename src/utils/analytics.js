/**
 * PRISM Privacy-First Analytics Engine
 * Zero cookies, zero personal identifiers, strict adherence to Do Not Track (DNT)
 * and GDPR/ePrivacy consent.
 */

class PrismAnalytics {
  constructor() {
    this.initialized = false;
    this.optedOut = false;
    this.sessionStartTime = Date.now();
  }

  init() {
    if (typeof window === 'undefined') return;

    // Respect Do Not Track
    if (
      window.doNotTrack === '1' ||
      navigator.doNotTrack === 'yes' ||
      navigator.doNotTrack === '1' ||
      navigator.msDoNotTrack === '1'
    ) {
      this.optedOut = true;
      console.log('[PRISM Analytics] Do Not Track honored — tracking disabled.');
      return;
    }

    // Check user cookie / tracking consent
    try {
      const consent = localStorage.getItem('prism_cookie_consent');
      if (consent) {
        const parsed = JSON.parse(consent);
        if (parsed && parsed.analytics === false) {
          this.optedOut = true;
          return;
        }
      }
    } catch {
      // ignore
    }

    this.initialized = true;
    console.log('[PRISM Analytics] Privacy-preserving telemetry initialized.');
  }

  trackPageView(path) {
    if (!this.initialized || this.optedOut) return;

    const payload = {
      type: 'pageview',
      path: path || window.location.pathname,
      referrer: document.referrer ? new URL(document.referrer).hostname : 'direct',
      timestamp: new Date().toISOString(),
      screen: `${window.innerWidth}x${window.innerHeight}`
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('[PRISM Analytics Pageview]', payload);
    }
  }

  trackEvent(eventName, properties = {}) {
    if (!this.initialized || this.optedOut) return;

    const payload = {
      type: 'event',
      name: eventName,
      properties,
      timestamp: new Date().toISOString()
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('[PRISM Analytics Event]', eventName, payload);
    }
  }

  updateConsent(allowAnalytics) {
    this.optedOut = !allowAnalytics;
    if (allowAnalytics && !this.initialized) {
      this.init();
    }
  }
}

export const analytics = new PrismAnalytics();
analytics.init();
