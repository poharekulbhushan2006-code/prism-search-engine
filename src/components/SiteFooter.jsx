import React from 'react';
import { ShieldCheck, MapPin, Mail, Phone, Lock, Heart, Globe, ExternalLink, Sparkles } from 'lucide-react';

export default function SiteFooter({
  onNavigatePage,
  onOpenCookies,
  onLaunchApp
}) {
  return (
    <footer className="prism-site-footer">
      <div className="footer-top-grid">
        {/* Brand & Mission Column */}
        <div className="footer-brand-col">
          <div className="footer-brand-title">
            <span className="footer-prism-logo">PR<span style={{ color: '#06b6d4' }}>I</span>SM</span>
            <span className="footer-brand-tag">v1.4 Enterprise</span>
          </div>
          <p className="footer-brand-desc">
            The hybrid search engine & private browser designed for truth, synthesis, and deep research. Engineered with real-time process flowcharts, multi-lens comparison matrices, and zero advertising noise.
          </p>
          <div className="footer-trust-badges">
            <span className="footer-badge">
              <ShieldCheck size={13} color="#10b981" />
              <span>0% Ad Clutter</span>
            </span>
            <span className="footer-badge">
              <Lock size={13} color="#06b6d4" />
              <span>Zero-Telemetry</span>
            </span>
            <span className="footer-badge">
              <Sparkles size={13} color="#ec4899" />
              <span>Anti-SEO Audited</span>
            </span>
          </div>
        </div>

        {/* Ecosystem Links */}
        <div className="footer-links-col">
          <h4>Ecosystem Apps</h4>
          <ul>
            <li>
              <button type="button" onClick={() => onLaunchApp && onLaunchApp('maps')}>
                PRISM Maps (Vector Geospatial)
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onLaunchApp && onLaunchApp('tube')}>
                PRISM Tube (Ad-Free Video)
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onLaunchApp && onLaunchApp('mail')}>
                PRISM Mail (Encrypted Client)
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onLaunchApp && onLaunchApp('browser')}>
                PRISM Hybrid Browser
              </button>
            </li>
          </ul>
        </div>

        {/* Legal & Governance */}
        <div className="footer-links-col">
          <h4>Legal & Security</h4>
          <ul>
            <li>
              <button type="button" onClick={() => onNavigatePage && onNavigatePage('privacy')} id="footer-link-privacy">
                Privacy Policy & Charter
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onNavigatePage && onNavigatePage('terms')} id="footer-link-terms">
                Terms and Conditions
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onNavigatePage && onNavigatePage('thank-you')} id="footer-link-thankyou">
                Thank You & Onboarding
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onNavigatePage && onNavigatePage('404')} id="footer-link-404">
                404 Diagnostic Test
              </button>
            </li>
            <li>
              <button type="button" onClick={onOpenCookies} id="footer-link-cookies">
                Cookie & Storage Preferences
              </button>
            </li>
            <li>
              <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="footer-external-link">
                <span>XML Sitemap</span>
                <ExternalLink size={12} />
              </a>
            </li>
          </ul>
        </div>

        {/* Real Physical Contact Information (Item 19) */}
        <div className="footer-contact-col">
          <h4>Corporate Headquarters</h4>
          <address className="footer-address">
            <div className="footer-contact-item">
              <MapPin size={16} className="contact-icon" />
              <div>
                <strong>PRISM Search Technologies, Inc.</strong>
                <p>Nanded, Maharashtra 431601, India</p>
              </div>
            </div>

            <div className="footer-contact-item">
              <Phone size={15} className="contact-icon" />
              <div>
                <span>Direct: +91 (02462) 254-888</span>
                <span className="contact-sub">Mon–Fri, 9:00 AM – 6:00 PM IST</span>
              </div>
            </div>

            <div className="footer-contact-item">
              <Mail size={15} className="contact-icon" />
              <div>
                <a href="mailto:support@prism-search.io">support@prism-search.io</a>
                <a href="mailto:legal@prism-search.io" style={{ display: 'block', color: '#94a3b8' }}>legal@prism-search.io</a>
              </div>
            </div>
          </address>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-left">
          <span>© 2026 PRISM Search Technologies, Inc. All rights reserved.</span>
          <span className="footer-dot">•</span>
          <span>Delivering the Clean Web Protocol</span>
        </div>
        <div className="footer-bottom-right">
          <span>Encrypted with TLS 1.3</span>
          <span className="footer-dot">•</span>
          <span>Designed with High-Signal Aesthetics</span>
        </div>
      </div>
    </footer>
  );
}
