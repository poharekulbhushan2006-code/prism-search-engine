import React from 'react';
import { Scale, ShieldAlert, BookOpen, AlertCircle, MapPin, Mail, Phone, ArrowLeft, Printer } from 'lucide-react';

export default function TermsPage({ onGoHome }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="legal-page-container">
      <div className="legal-page-header">
        <button type="button" className="btn-legal-back" onClick={onGoHome} id="btn-terms-back">
          <ArrowLeft size={16} />
          <span>Back to PRISM</span>
        </button>
        <button type="button" className="btn-legal-print" onClick={handlePrint} id="btn-terms-print">
          <Printer size={15} />
          <span>Print / Save PDF</span>
        </button>
      </div>

      <div className="legal-card">
        <div className="legal-title-section">
          <div className="legal-badge">
            <Scale size={16} color="#6366f1" />
            <span>Operational Master Agreement</span>
          </div>
          <h1 className="legal-main-title">PRISM Terms and Conditions</h1>
          <p className="legal-meta">
            Last Revised: September 17, 2026 • Governing Law: State of California, USA
          </p>
        </div>

        {/* Highlight Summary */}
        <div className="legal-highlight-box">
          <h3>Welcome to the PRISM Ecosystem</h3>
          <p>
            By accessing or using PRISM Search, PRISM Reader, PRISM Maps, PRISM Tube, or PRISM Mail, you agree to comply with and be bound by the terms outlined below.
          </p>
        </div>

        {/* Section 1 */}
        <section className="legal-section">
          <h2>1. Permitted Use & Service Purpose</h2>
          <p>
            PRISM provides private web search, anti-SEO indexing, generative AI synthesis, and distraction-free document reading. You agree to use these services solely for lawful, research, educational, and personal information discovery purposes.
          </p>
          <p>
            You agree NOT to:
          </p>
          <ul>
            <li>Conduct automated denial-of-service, high-frequency scraping, or abusive stress tests against PRISM search endpoints.</li>
            <li>Utilize PRISM APIs to train non-consensual surveillance, biometric profiling, or phishing models.</li>
            <li>Attempt to bypass security headers, rate limits, or CORS policies.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="legal-section">
          <h2>2. Anti-SEO Scoring & Aggregated Fair-Use Indexing</h2>
          <p>
            PRISM employs an algorithmic anti-SEO ranking engine that penalizes affiliate spam, programmatic keyword stuffing, and sponsored content farms. All search index entries, snippets, and thumbnail previews are indexed under fair use doctrine (17 U.S.C. § 107) with direct attribution and links to original publishers.
          </p>
        </section>

        {/* Section 3 */}
        <section className="legal-section">
          <h2>3. AI Overview Synthesis & Source Grounding</h2>
          <p>
            PRISM AI Synthesizer aggregates verifiable statements from multiple citations into interactive flowcharts, comparison matrices, and executive summaries. While PRISM enforces ground truth cross-verification, AI syntheses are informational aids. Users should consult primary citations for mission-critical medical, legal, or financial decisions.
          </p>
        </section>

        {/* Section 4 */}
        <section className="legal-section">
          <h2>4. Intellectual Property & Brand Rights</h2>
          <p>
            "PRISM", the PRISM optical refraction logo, and associated browser software UI elements are proprietary trademarks and trade dress of PRISM Search Technologies, Inc.
          </p>
        </section>

        {/* Section 5: Real Contact Information */}
        <section className="legal-section legal-contact-section">
          <h2>5. Legal Notices & Corporate Contacts</h2>
          <p>
            Legal inquiries, copyright DMCA notifications, or partnership notices should be addressed to our corporate counsel:
          </p>
          <div className="legal-contact-grid">
            <div className="contact-info-block">
              <MapPin size={18} color="#6366f1" />
              <div>
                <strong>PRISM Search Technologies, Inc.</strong>
                <p>Legal Counsel & Compliance Division</p>
                <p>548 Market Street, Suite 79421</p>
                <p>San Francisco, CA 94104-5401, United States</p>
              </div>
            </div>
            <div className="contact-info-block">
              <Mail size={18} color="#06b6d4" />
              <div>
                <strong>Legal Electronic Mail</strong>
                <p>General Counsel: <a href="mailto:legal@prism-search.io">legal@prism-search.io</a></p>
                <p>DMCA Agent: <a href="mailto:dmca@prism-search.io">dmca@prism-search.io</a></p>
              </div>
            </div>
            <div className="contact-info-block">
              <Phone size={18} color="#10b981" />
              <div>
                <strong>Direct Line</strong>
                <p>+1 (415) 890-7746</p>
                <p>Mon–Fri, 9:00 AM – 6:00 PM PST</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
