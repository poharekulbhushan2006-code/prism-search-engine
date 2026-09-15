import React, { useState } from 'react';
import GoogleKnowledgePanel from './GoogleKnowledgePanel';
import { ExternalLink, Bookmark, Check, Copy, MessageCircle, Star, ShieldCheck, Clock, Compass } from 'lucide-react';

export default function ResultsStream({
  results,
  onPinItem,
  pinnedUrls = new Set(),
  onOpenInTab,
  googleKnowledgeCard,
  onSearchQuery
}) {
  const [copiedUrl, setCopiedUrl] = useState(null);

  const handleCopy = (url, e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  if (!results || results.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#94a3b8' }}>
        <p>No results found for this lens. Try switching to "All Lenses" or broadening your terms.</p>
      </div>
    );
  }

  return (
    <div className="results-layout-container">
      {/* Primary Results Stream Column */}
      <div className="results-stream-column">
        <div className="results-grid">
          {results.map((item, index) => {
            const isPinned = pinnedUrls.has(item.link);
            const trustClass =
              item.trustScore >= 90
                ? 'badge-trust-high'
                : item.trustScore >= 75
                ? 'badge-trust-med'
                : 'badge-trust-community';

            return (
              <article key={item.link || index} className="result-card">
                {/* Google-Style Breadcrumb & Source Identity */}
                <div className="google-breadcrumb-row">
                  <div className="google-source-badge">
                    <span className="google-source-dot" />
                    <span className="google-breadcrumb-text">{item.breadcrumb || item.hostname}</span>
                  </div>

                  <div className={`trust-badge-pill ${trustClass}`} title="Calculated Authenticity & Signal-to-Noise Score">
                    <ShieldCheck size={12} />
                    <span>{item.trustScore}% {item.trustBadge}</span>
                  </div>
                </div>

                {/* Title & Link */}
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="result-title"
                >
                  {item.title}
                </a>

                {/* Clean Anti-SEO Snippet */}
                <p className="result-snippet">
                  {item.cleanSnippet || item.snippet}
                </p>

                {/* Google-Style Sitelinks Sub-navigation */}
                {item.sitelinks && item.sitelinks.length > 0 && (
                  <div className="google-sitelinks-container">
                    {item.sitelinks.map((sl, sIdx) => (
                      <a
                        key={sIdx}
                        href={sl.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="google-sitelink-chip"
                        onClick={(e) => {
                          if (onOpenInTab && sl.url.startsWith('http')) {
                            e.preventDefault();
                            onOpenInTab(sl.url, `${sl.title} — ${item.title}`);
                          }
                        }}
                      >
                        <span>{sl.title}</span>
                        <ExternalLink size={10} className="sitelink-arrow" />
                      </a>
                    ))}
                  </div>
                )}

                {/* Community Discussions & Real Voices */}
                {(item.commentsCount !== undefined || item.stars !== undefined || item.num_comments !== undefined) && (
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                    {item.commentsCount !== undefined && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MessageCircle size={13} color="#f59e0b" />
                        {item.commentsCount} HN comments
                      </span>
                    )}
                    {item.num_comments !== undefined && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MessageCircle size={13} color="#f43f5e" />
                        {item.num_comments} Reddit replies ({item.score || 0} upvotes)
                      </span>
                    )}
                    {item.stars !== undefined && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Star size={13} color="#fbbf24" fill="#fbbf24" />
                        {item.stars.toLocaleString()} GitHub stars
                      </span>
                    )}
                  </div>
                )}

                {/* Footer Actions */}
                <div className="result-footer-actions">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <button
                      type="button"
                      className="btn-open-tab"
                      onClick={() => onOpenInTab && onOpenInTab(item.link, item.title)}
                      title="Open in a new PRISM browser tab"
                    >
                      <span>Open in Tab</span>
                    </button>

                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#94a3b8' }}
                    >
                      <span>External</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn-action-icon"
                      onClick={(e) => handleCopy(item.link, e)}
                      title="Copy link to clipboard"
                    >
                      {copiedUrl === item.link ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                    </button>

                    <button
                      type="button"
                      className={`btn-action-icon ${isPinned ? 'pinned' : ''}`}
                      onClick={() => onPinItem(item)}
                      title={isPinned ? 'Remove from Research Workbench' : 'Pin to Research Workbench'}
                    >
                      <Bookmark size={14} fill={isPinned ? '#6366f1' : 'none'} color={isPinned ? '#818cf8' : 'currentColor'} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Right Column: Google Knowledge Graph Panel */}
      {googleKnowledgeCard && (
        <div className="results-sidebar-column">
          <GoogleKnowledgePanel
            cardData={googleKnowledgeCard}
            onSearchQuery={onSearchQuery}
          />
        </div>
      )}
    </div>
  );
}
