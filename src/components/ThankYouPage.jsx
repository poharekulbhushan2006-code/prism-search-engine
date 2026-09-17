import React from 'react';
import { CheckCircle2, Sparkles, Download, Search, ShieldCheck, Compass, ArrowRight } from 'lucide-react';

export default function ThankYouPage({ onGoHome, onOpenInstall, onSearch }) {
  return (
    <div className="thankyou-page-container">
      <div className="thankyou-card">
        {/* Prismatic Celebratory Core */}
        <div className="thankyou-icon-wrapper">
          <div className="thankyou-halo" />
          <div className="thankyou-icon-circle">
            <CheckCircle2 size={44} color="#10b981" />
          </div>
        </div>

        <div className="thankyou-badge">
          <Sparkles size={14} color="#10b981" />
          <span>Onboarding Complete • Welcome to the Clean Web</span>
        </div>

        <h1 className="thankyou-title">Thank You for Choosing PRISM</h1>
        <p className="thankyou-subtitle">
          You've stepped beyond advertising noise, SEO manipulation, and persistent telemetry. Here is how to make the most of your private intelligence browser:
        </p>

        {/* 3-Step Next Actions Grid */}
        <div className="thankyou-steps-grid">
          <div className="thankyou-step-card">
            <div className="step-number">01</div>
            <div className="step-content">
              <h3>Install PRISM App</h3>
              <p>Install the Progressive Web App onto your desktop dock or mobile home screen for instant 0.1s queries.</p>
              <button
                type="button"
                className="btn-step-action"
                onClick={onOpenInstall}
                id="btn-thankyou-install"
              >
                <Download size={14} />
                <span>Install Native App</span>
              </button>
            </div>
          </div>

          <div className="thankyou-step-card">
            <div className="step-number">02</div>
            <div className="step-content">
              <h3>Anti-SEO Search</h3>
              <p>Experience deep-dive syntheses with dynamic comparison tables and interactive flowcharts without sponsored clutter.</p>
              <button
                type="button"
                className="btn-step-action"
                onClick={() => onSearch('Quantum Computing 2026')}
                id="btn-thankyou-sample-search"
              >
                <Search size={14} />
                <span>Try Sample Query</span>
              </button>
            </div>
          </div>

          <div className="thankyou-step-card">
            <div className="step-number">03</div>
            <div className="step-content">
              <h3>Private Ecosystem</h3>
              <p>Explore ad-free PRISM Tube, encrypted PRISM Mail, and vector PRISM Maps without corporate surveillance.</p>
              <button
                type="button"
                className="btn-step-action"
                onClick={onGoHome}
                id="btn-thankyou-explore"
              >
                <Compass size={14} />
                <span>Explore Ecosystem</span>
              </button>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="thankyou-footer-actions">
          <button
            type="button"
            className="btn-thankyou-home"
            onClick={onGoHome}
            id="btn-thankyou-main-home"
          >
            <span>Start Searching on PRISM</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
