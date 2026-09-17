import React from 'react';
import { ShieldCheck, Lock, EyeOff, HardDrive, FileText, Mail, MapPin, Phone, ArrowLeft, Printer } from 'lucide-react';

export default function PrivacyPolicyPage({ onGoHome }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="legal-page-container">
      <div className="legal-page-header">
        <button type="button" className="btn-legal-back" onClick={onGoHome} id="btn-privacy-back">
          <ArrowLeft size={16} />
          <span>Back to PRISM</span>
        </button>
        <button type="button" className="btn-legal-print" onClick={handlePrint} id="btn-privacy-print">
          <Printer size={15} />
          <span>Print / Save PDF</span>
        </button>
      </div>

      <div className="legal-card">
        <div className="legal-title-section">
          <div className="legal-badge">
            <ShieldCheck size={16} color="#10b981" />
            <span>Zero-Telemetry Privacy Charter</span>
          </div>
          <h1 className="legal-main-title">PRISM Privacy Policy</h1>
          <p className="legal-meta">
            Effective Date: September 17, 2026 • Version 2.4 (GDPR & CCPA Compliant)
          </p>
        </div>

        {/* Highlight Executive Summary Box */}
        <div className="legal-highlight-box">
          <h3>The PRISM Core Privacy Guarantee</h3>
          <p>
            PRISM is engineered on a fundamental principle: <strong>your search queries, reading habits, and intellectual explorations belong solely to you</strong>. We do not monetize user data, we do not build tracking profiles, and we do not sell advertisement placements.
          </p>
        </div>

        {/* Section 1 */}
        <section className="legal-section">
          <h2>1. Zero-Query Logging Architecture</h2>
          <p>
            When you enter a search term into the PRISM Omnibar or execute multi-lens queries:
          </p>
          <ul>
            <li>We do not record your IP address alongside your search query.</li>
            <li>We do not create persistent search dossiers tied to individual identifiers.</li>
            <li>Queries routed to federation sources (e.g., Wikipedia, arXiv, open web indexes) are scrubbed of client headers, browser fingerprints, and referral tokens.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="legal-section">
          <h2>2. Local-First Client Storage</h2>
          <p>
            Your research workbench items (pinned citations, comparison tables, and reading lists) and application preferences (such as default lens, theme, and zoom) are saved exclusively within your browser's local sandbox (LocalStorage and IndexedDB). This information never leaves your device unless you explicitly opt into encrypted cloud sync.
          </p>
        </section>

        {/* Section 3 */}
        <section className="legal-section">
          <h2>3. Cookies & Tracking Technologies</h2>
          <p>
            PRISM does not employ third-party advertising cookies, cross-site beacons, or pixel trackers. We utilize only:
          </p>
          <ul>
            <li><strong>Strictly Essential Storage:</strong> Session tokens for authenticated users and local preferences.</li>
            <li><strong>Privacy-Preserving Telemetry (Optional):</strong> Aggregated performance metrics (latency, error rates) that are completely anonymous and immediately respect browser Do Not Track (DNT) flags.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="legal-section">
          <h2>4. User Rights (GDPR, CCPA & Global Protections)</h2>
          <p>
            Regardless of your geographic location, you retain the following statutory rights under GDPR and California Consumer Privacy Act (CCPA):
          </p>
          <ul>
            <li><strong>Right to Access:</strong> You may request disclosure of any personal data stored in your account.</li>
            <li><strong>Right to Eradication:</strong> You may delete your account and all associated synchronized data instantly at any time.</li>
            <li><strong>Right to Data Portability:</strong> You may export your research pinboard and notes as Markdown, JSON, or CSV.</li>
          </ul>
        </section>

        {/* Section 5: Real Contact Information */}
        <section className="legal-section legal-contact-section">
          <h2>5. Data Controller & Physical Contact Information</h2>
          <p>
            For questions regarding this charter, GDPR inquiries, or Data Protection Officer requests, please contact our physical headquarters or legal team:
          </p>
          <div className="legal-contact-grid">
            <div className="contact-info-block">
              <MapPin size={18} color="#6366f1" />
              <div>
                <strong>Physical Corporate Headquarters</strong>
                <p>PRISM Search Technologies, Inc.</p>
                <p>Nanded, Maharashtra 431601, India</p>
              </div>
            </div>
            <div className="contact-info-block">
              <Mail size={18} color="#06b6d4" />
              <div>
                <strong>Electronic Communications</strong>
                <p>Privacy Office: <a href="mailto:privacy@prism-search.io">privacy@prism-search.io</a></p>
                <p>General Support: <a href="mailto:support@prism-search.io">support@prism-search.io</a></p>
              </div>
            </div>
            <div className="contact-info-block">
              <Phone size={18} color="#10b981" />
              <div>
                <strong>Direct Telephone Line</strong>
                <p>+91 (02462) 254-888</p>
                <p>Hours: Mon–Fri, 9:00 AM – 6:00 PM IST</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
