import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Star,
  Send,
  FileText,
  Trash2,
  ShieldAlert,
  Search,
  Plus,
  ArrowLeft,
  Reply,
  Forward,
  Archive,
  Sparkles,
  ShieldCheck,
  Check,
  Paperclip,
  Clock,
  X,
  RotateCw,
  Lock,
  Download
} from 'lucide-react';

const SEED_EMAILS = [
  {
    id: 'mail-1',
    folder: 'inbox',
    from: 'PRISM Security Core',
    email: 'security@prism-engine.io',
    subject: 'Welcome to PRISM Mail: Ad-Free Encrypted Communications',
    snippet: 'Your decentralized PRISM Mail account is active with zero telemetry, zero trackers, and zero sponsored commercial injection...',
    body: `Hello Explorer,\n\nWelcome to PRISM Mail — the privacy-first communication layer of the PRISM Ecosystem.\n\nUnlike traditional surveillance ad-driven mail providers, PRISM Mail is engineered on three core principles:\n1. Zero Tracking & Telemetry: No behavioral fingerprinting or search history indexing.\n2. Ad-Free Forever: No sponsored promotions or injected newsletter ads in your inbox.\n3. End-to-End Cryptographic Security: All internal messages and drafts remain encrypted on your device.\n\nYou are ready to compose, read, and explore with complete peace of mind.\n\nBest regards,\nThe PRISM Security Architecture Team`,
    timestamp: '10:45 AM',
    unread: true,
    starred: true,
    tags: ['Security', 'Verified'],
    attachments: ['PRISM-Crypto-Certificate.pem']
  },
  {
    id: 'mail-2',
    folder: 'inbox',
    from: 'Google Play Console',
    email: 'noreply-developer@google.com',
    subject: 'PRISM Search Engine & Browser: TWA App Bundle Verified',
    snippet: 'Digital Asset Links verification succeeded for domain assetlinks.json. Standalone PWA and Bubblewrap bundle readiness confirmed...',
    body: `Greetings Developer,\n\nYour Trusted Web Activity (TWA) verification check for PRISM Search Engine (package: com.prism.search) has passed all automated criteria:\n\n- Digital Asset Links: Verified (/.well-known/assetlinks.json)\n- PWA Manifest: Validated (192px & 512px maskable icons present)\n- Service Worker: Active offline cache with background sync\n- Target SDK: Android 14+ (API 34)\n\nYour signed .aab artifact is ready for distribution on the Google Play Store Production track.\n\nSincerely,\nGoogle Play Developer Operations`,
    timestamp: 'Yesterday',
    unread: false,
    starred: true,
    tags: ['Play Store', 'TWA'],
    attachments: ['playstore-verification-audit.pdf']
  },
  {
    id: 'mail-3',
    folder: 'inbox',
    from: 'Taarak Mehta Club & Shows',
    email: 'tmkoc-updates@sonysab.com',
    subject: 'New Episode Alert: Gokuldham Society Comedy Special',
    snippet: 'Watch Episode 4815 in PRISM Tube 100% ad-free without pre-rolls. Jethalal, Bhide, and Champaklal return...',
    body: `Namaste Fan,\n\nTaarak Mehta Ka Ooltah Chashmah has released a new episode! Watch in full HD completely ad-free inside the new PRISM Tube:\n\n• Episode: #4815\n• Starring: Dilip Joshi (Jethalal), Amit Bhatt (Champaklal), Mandar Chandwadkar (Bhide)\n• Status: Full HD ad-free playback ready\n\nEnjoy the clean streaming experience on PRISM Tube!\n\nSony SAB Entertainment Desk`,
    timestamp: 'Sep 15',
    unread: false,
    starred: false,
    tags: ['Shows', 'PRISM Tube']
  },
  {
    id: 'mail-4',
    folder: 'inbox',
    from: 'Nature Physics Digest',
    email: 'newsletters@nature.com',
    subject: 'Breakthrough in Fault-Tolerant Topological Quantum Qubits',
    snippet: 'Researchers at the Niels Bohr Institute have published experimental results demonstrating non-Abelian anyon braiding with 99.8% fidelity...',
    body: `Dear Researcher,\n\nIn this week's issue of Nature Physics:\n\nMajorana zero modes have been experimentally isolated and manipulated in semiconductor-superconductor nanowires, demonstrating non-Abelian braiding statistics with record-low decoherence rates.\n\nThis marks a significant milestone toward error-corrected topological quantum computing at scale.\n\nRead the peer-reviewed full preprint in the PRISM Research Lens.\n\nEditorial Board, Nature Publishing Group`,
    timestamp: 'Sep 14',
    unread: false,
    starred: false,
    tags: ['Research', 'Science'],
    attachments: ['nature-physics-preprint-482.pdf']
  }
];

export default function PrismMail({ onOpenSearch }) {
  const [emails, setEmails] = useState(() => {
    try {
      const s = localStorage.getItem('prism_mail_items');
      return s ? JSON.parse(s) : SEED_EMAILS;
    } catch {
      return SEED_EMAILS;
    }
  });

  const [activeFolder, setActiveFolder] = useState('inbox'); // inbox | starred | sent | drafts | trash | spam
  const [activeEmail, setActiveEmail] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Compose State
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [hasAttachment, setHasAttachment] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('prism_mail_items', JSON.stringify(emails));
    } catch {}
  }, [emails]);

  const toggleStar = (id, e) => {
    if (e) e.stopPropagation();
    setEmails((prev) =>
      prev.map((mail) => (mail.id === id ? { ...mail, starred: !mail.starred } : mail))
    );
    if (activeEmail && activeEmail.id === id) {
      setActiveEmail((prev) => ({ ...prev, starred: !prev.starred }));
    }
  };

  const markAsRead = (id) => {
    setEmails((prev) =>
      prev.map((mail) => (mail.id === id ? { ...mail, unread: false } : mail))
    );
  };

  const handleDelete = (id) => {
    setEmails((prev) =>
      prev.map((mail) => (mail.id === id ? { ...mail, folder: 'trash' } : mail))
    );
    setActiveEmail(null);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!composeTo.trim() || !composeSubject.trim()) {
      alert('Please provide a recipient and subject.');
      return;
    }

    const newMail = {
      id: `mail-${Date.now()}`,
      folder: 'sent',
      from: 'You (PRISM User)',
      email: composeTo.trim(),
      subject: composeSubject.trim(),
      snippet: composeBody.slice(0, 80) + '...',
      body: composeBody,
      timestamp: 'Just now',
      unread: false,
      starred: false,
      tags: ['Encrypted', 'Sent'],
      attachments: hasAttachment ? ['Confidential-Research-Attachment.pdf'] : []
    };

    setEmails((prev) => [newMail, ...prev]);
    setIsComposeOpen(false);
    resetComposeForm();
    alert('Encrypted email dispatched through PRISM secure node!');
  };

  const handleSaveDraft = () => {
    if (!composeSubject.trim() && !composeBody.trim()) {
      setIsComposeOpen(false);
      return;
    }

    const draft = {
      id: `draft-${Date.now()}`,
      folder: 'drafts',
      from: 'Draft',
      email: composeTo.trim() || 'No Recipient',
      subject: composeSubject.trim() || '(No Subject)',
      snippet: composeBody.slice(0, 80) || '(Empty draft body)',
      body: composeBody,
      timestamp: 'Saved Draft',
      unread: false,
      starred: false,
      tags: ['Draft', 'Local'],
      attachments: hasAttachment ? ['Draft-Attachment.pdf'] : []
    };

    setEmails((prev) => [draft, ...prev.filter((m) => m.id !== draft.id)]);
    setIsComposeOpen(false);
    resetComposeForm();
    alert('Draft saved to PRISM local storage!');
  };

  const resetComposeForm = () => {
    setComposeTo('');
    setComposeSubject('');
    setComposeBody('');
    setHasAttachment(false);
  };

  const openDraftToEdit = (draft) => {
    setComposeTo(draft.email === 'No Recipient' ? '' : draft.email);
    setComposeSubject(draft.subject === '(No Subject)' ? '' : draft.subject);
    setComposeBody(draft.body || '');
    setHasAttachment((draft.attachments && draft.attachments.length > 0) || false);
    setIsComposeOpen(true);
  };

  const generateAiSummary = () => {
    if (!activeEmail) return;
    setIsSummarizing(true);
    setTimeout(() => {
      setAiSummary(
        `• Core Topic: ${activeEmail.subject}\n• Sender: ${activeEmail.from} (${activeEmail.email})\n• Key Insight: ${activeEmail.snippet}\n• Privacy Seal: Cryptographically signed, 0 trackers, 0 pixel surveillance.`
      );
      setIsSummarizing(false);
    }, 500);
  };

  // Filter emails based on folder and search query
  const displayedEmails = emails.filter((mail) => {
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        mail.subject.toLowerCase().includes(q) ||
        mail.from.toLowerCase().includes(q) ||
        mail.body.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Folder filter
    if (activeFolder === 'starred') return mail.starred;
    if (activeFolder === 'spam') return mail.folder === 'spam';
    return mail.folder === activeFolder;
  });

  const unreadCount = emails.filter((m) => m.folder === 'inbox' && m.unread).length;
  const draftsCount = emails.filter((m) => m.folder === 'drafts').length;

  return (
    <div className="prism-mail-container">
      {/* 1. Left Sidebar Navigation */}
      <div className="mail-sidebar">
        {/* Brand & Compose Button */}
        <div className="mail-brand-header">
          <div className="mail-logo-pill">
            <span className="mail-logo-text">PRISM <span className="mail-sub">Mail</span></span>
          </div>
          <button
            type="button"
            className="btn-compose-mail"
            onClick={() => { resetComposeForm(); setIsComposeOpen(true); }}
          >
            <Plus size={18} />
            <span>Compose</span>
          </button>
        </div>

        {/* Folder List */}
        <div className="mail-folders-list">
          <button
            type="button"
            className={`mail-folder-item ${activeFolder === 'inbox' ? 'active' : ''}`}
            onClick={() => { setActiveFolder('inbox'); setActiveEmail(null); }}
          >
            <div className="folder-item-left">
              <Inbox size={16} />
              <span>Inbox</span>
            </div>
            {unreadCount > 0 && <span className="folder-badge">{unreadCount}</span>}
          </button>

          <button
            type="button"
            className={`mail-folder-item ${activeFolder === 'starred' ? 'active' : ''}`}
            onClick={() => { setActiveFolder('starred'); setActiveEmail(null); }}
          >
            <div className="folder-item-left">
              <Star size={16} />
              <span>Starred</span>
            </div>
          </button>

          <button
            type="button"
            className={`mail-folder-item ${activeFolder === 'sent' ? 'active' : ''}`}
            onClick={() => { setActiveFolder('sent'); setActiveEmail(null); }}
          >
            <div className="folder-item-left">
              <Send size={16} />
              <span>Sent</span>
            </div>
          </button>

          <button
            type="button"
            className={`mail-folder-item ${activeFolder === 'drafts' ? 'active' : ''}`}
            onClick={() => { setActiveFolder('drafts'); setActiveEmail(null); }}
          >
            <div className="folder-item-left">
              <FileText size={16} />
              <span>Drafts</span>
            </div>
            {draftsCount > 0 && <span className="folder-badge draft-badge">{draftsCount}</span>}
          </button>

          <button
            type="button"
            className={`mail-folder-item ${activeFolder === 'trash' ? 'active' : ''}`}
            onClick={() => { setActiveFolder('trash'); setActiveEmail(null); }}
          >
            <div className="folder-item-left">
              <Trash2 size={16} />
              <span>Trash</span>
            </div>
          </button>

          <button
            type="button"
            className={`mail-folder-item ${activeFolder === 'spam' ? 'active' : ''}`}
            onClick={() => { setActiveFolder('spam'); setActiveEmail(null); }}
          >
            <div className="folder-item-left">
              <ShieldAlert size={16} />
              <span>Spam</span>
            </div>
            <span className="folder-zero-spam">0 Ads</span>
          </button>
        </div>

        {/* Security & Storage Meter */}
        <div className="mail-storage-footer">
          <div className="storage-status">
            <Lock size={13} color="#10b981" />
            <span>Encrypted Webmail Box</span>
          </div>
          <div className="storage-bar-outer">
            <div className="storage-bar-inner" style={{ width: '8%' }} />
          </div>
          <span className="storage-text">0.12 GB of 15 GB Used</span>
        </div>
      </div>

      {/* 2. Main Content View: Email List or Email Viewer */}
      <div className="mail-main-stage">
        {/* Top Search & Filter Bar */}
        <div className="mail-top-bar">
          <div className="mail-search-box">
            <Search size={16} color="#64748b" />
            <input
              type="text"
              className="mail-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search encrypted inbox by sender, subject, keywords..."
              id="prism-mail-search-input"
            />
          </div>

          <div className="mail-top-actions">
            <button
              type="button"
              className="btn-mail-icon"
              onClick={() => {
                setSearchQuery('');
                setActiveEmail(null);
              }}
              title="Refresh Mailbox"
            >
              <RotateCw size={15} />
            </button>
          </div>
        </div>

        {/* Reading Pane OR Email List */}
        {activeEmail ? (
          /* FULL EMAIL READER VIEW */
          <div className="mail-reading-pane">
            <div className="reading-pane-toolbar">
              <button
                type="button"
                className="btn-back-to-list"
                onClick={() => { setActiveEmail(null); setAiSummary(null); }}
              >
                <ArrowLeft size={16} />
                <span>Back to {activeFolder.toUpperCase()}</span>
              </button>

              <div className="reading-pane-quick-actions">
                <button
                  type="button"
                  className="btn-pane-action"
                  onClick={(e) => toggleStar(activeEmail.id, e)}
                  title="Star Email"
                >
                  <Star size={16} fill={activeEmail.starred ? '#f59e0b' : 'none'} color={activeEmail.starred ? '#f59e0b' : '#94a3b8'} />
                </button>
                <button
                  type="button"
                  className="btn-pane-action"
                  onClick={() => handleDelete(activeEmail.id)}
                  title="Move to Trash"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="reading-mail-header">
              <h1 className="reading-mail-subject">{activeEmail.subject}</h1>

              <div className="reading-sender-row">
                <div className="sender-avatar-badge">
                  {activeEmail.from.charAt(0)}
                </div>
                <div className="sender-details">
                  <div className="sender-name-line">
                    <span className="sender-name">{activeEmail.from}</span>
                    <span className="sender-email">&lt;{activeEmail.email}&gt;</span>
                  </div>
                  <div className="sender-security-badge">
                    <ShieldCheck size={12} color="#10b981" />
                    <span>Cryptographically Verified Sender • Zero Ads</span>
                  </div>
                </div>
                <span className="reading-mail-date">{activeEmail.timestamp}</span>
              </div>
            </div>

            {/* PRISM AI Instant TL;DR Summary Box */}
            <div className="mail-ai-summary-card">
              <div className="ai-summary-header">
                <div className="summary-title-wrap">
                  <Sparkles size={15} color="#06b6d4" />
                  <span>PRISM AI Executive Summary</span>
                </div>
                {!aiSummary && (
                  <button
                    type="button"
                    className="btn-generate-tldr"
                    onClick={generateAiSummary}
                    disabled={isSummarizing}
                  >
                    {isSummarizing ? 'Synthesizing...' : 'Generate 1-Click TL;DR'}
                  </button>
                )}
              </div>
              {aiSummary && (
                <div className="ai-summary-content">
                  <pre>{aiSummary}</pre>
                </div>
              )}
            </div>

            {/* Email Message Body */}
            <div className="reading-mail-body">
              <pre className="mail-pre-text">{activeEmail.body}</pre>
            </div>

            {/* Attachments Section */}
            {activeEmail.attachments && activeEmail.attachments.length > 0 && (
              <div className="reading-attachments-box">
                <span className="attachments-title">Attachments ({activeEmail.attachments.length}):</span>
                <div className="attachments-list">
                  {activeEmail.attachments.map((att, i) => (
                    <div key={i} className="attachment-chip">
                      <Paperclip size={14} color="#38bdf8" />
                      <span>{att}</span>
                      <Download size={13} className="attachment-dl" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Reply Box */}
            <div className="reading-reply-box">
              <button
                type="button"
                className="btn-reply-action"
                onClick={() => {
                  setComposeTo(activeEmail.email);
                  setComposeSubject(`Re: ${activeEmail.subject}`);
                  setIsComposeOpen(true);
                }}
              >
                <Reply size={15} />
                <span>Reply</span>
              </button>
              <button
                type="button"
                className="btn-reply-action"
                onClick={() => {
                  setComposeSubject(`Fwd: ${activeEmail.subject}`);
                  setComposeBody(`\n\n--- Forwarded Message ---\n${activeEmail.body}`);
                  setIsComposeOpen(true);
                }}
              >
                <Forward size={15} />
                <span>Forward</span>
              </button>
            </div>
          </div>
        ) : (
          /* EMAIL LIST TABLE VIEW */
          <div className="mail-list-container">
            {displayedEmails.length === 0 ? (
              <div className="mail-empty-state">
                <Inbox size={36} color="#475569" />
                <p>No messages found in {activeFolder}.</p>
              </div>
            ) : (
              <div className="mail-items-table">
                {displayedEmails.map((mail) => (
                  <div
                    key={mail.id}
                    className={`mail-row-item ${mail.unread ? 'unread' : ''}`}
                    onClick={() => {
                      if (mail.folder === 'drafts') {
                        openDraftToEdit(mail);
                      } else {
                        setActiveEmail(mail);
                        markAsRead(mail.id);
                        setAiSummary(null);
                      }
                    }}
                  >
                    <button
                      type="button"
                      className="mail-star-btn"
                      onClick={(e) => toggleStar(mail.id, e)}
                    >
                      <Star
                        size={15}
                        fill={mail.starred ? '#f59e0b' : 'none'}
                        color={mail.starred ? '#f59e0b' : '#64748b'}
                      />
                    </button>

                    <div className="mail-col-sender">
                      <span>{mail.from}</span>
                    </div>

                    <div className="mail-col-content">
                      <span className="mail-subject-text">{mail.subject}</span>
                      <span className="mail-snippet-sep">-</span>
                      <span className="mail-snippet-text">{mail.snippet}</span>
                    </div>

                    <div className="mail-col-tags">
                      {mail.tags?.slice(0, 1).map((t, idx) => (
                        <span key={idx} className="mail-tag-pill">{t}</span>
                      ))}
                      {mail.attachments && mail.attachments.length > 0 && (
                        <Paperclip size={12} color="#94a3b8" style={{ marginLeft: '4px' }} />
                      )}
                    </div>

                    <div className="mail-col-date">
                      <span>{mail.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Compose Email Floating Modal */}
      {isComposeOpen && (
        <div className="mail-compose-modal-overlay">
          <div className="mail-compose-window">
            <div className="compose-header">
              <div className="compose-header-left">
                <Lock size={14} color="#10b981" />
                <span>New Encrypted Message</span>
              </div>
              <button
                type="button"
                className="btn-compose-close"
                onClick={() => setIsComposeOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSend} className="compose-form">
              <div className="compose-field">
                <label>To:</label>
                <input
                  type="email"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  placeholder="recipient@domain.com"
                  required
                />
              </div>

              <div className="compose-field">
                <label>Subject:</label>
                <input
                  type="text"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  placeholder="Subject..."
                  required
                />
              </div>

              <div className="compose-body-field">
                <textarea
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  placeholder="Write your encrypted message here (zero ads, zero trackers)..."
                  rows={8}
                  required
                />
              </div>

              {hasAttachment && (
                <div className="compose-attached-pill">
                  <Paperclip size={13} color="#38bdf8" />
                  <span>Confidential-Research-Attachment.pdf (1.4 MB)</span>
                  <button type="button" onClick={() => setHasAttachment(false)} className="btn-remove-att">
                    <X size={12} />
                  </button>
                </div>
              )}

              <div className="compose-footer">
                <div className="compose-footer-left">
                  <button type="submit" className="btn-send-mail">
                    <Send size={15} />
                    <span>Send</span>
                  </button>

                  <button
                    type="button"
                    className="btn-save-draft"
                    onClick={handleSaveDraft}
                    title="Save current message as draft"
                  >
                    <FileText size={14} />
                    <span>Save Draft</span>
                  </button>

                  <button
                    type="button"
                    className={`btn-attach-file ${hasAttachment ? 'active' : ''}`}
                    onClick={() => setHasAttachment(!hasAttachment)}
                    title="Attach file"
                  >
                    <Paperclip size={14} />
                    <span>{hasAttachment ? 'Attached' : 'Attach File'}</span>
                  </button>
                </div>

                <div className="compose-privacy-badge">
                  <ShieldCheck size={13} color="#10b981" />
                  <span>End-to-End Cryptographic Seal</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
