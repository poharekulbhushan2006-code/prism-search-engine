import React from 'react';
import { ExternalLink, Bookmark, Clock, User, ShieldCheck, FileText } from 'lucide-react';

export default function ReaderView({ pageData, onPinItem, isPinned }) {
  if (!pageData) return null;

  if (!pageData.success) {
    return (
      <div className="reader-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#f8fafc', marginBottom: '1rem' }}>
          External Web View
        </h2>
        <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
          {pageData.error || 'This page does not allow automated reader extraction.'}
        </p>
        <a
          href={pageData.fallbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-search-submit"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <span>Open in New Window</span>
          <ExternalLink size={14} />
        </a>
      </div>
    );
  }

  return (
    <article className="reader-container">
      {/* Header Meta */}
      <div className="reader-header">
        <div className="reader-badge-row">
          <div className="reader-domain-pill">
            <ShieldCheck size={13} />
            <span>{pageData.hostname} (Distraction-Free)</span>
          </div>

          <div className="reader-actions">
            <button
              type="button"
              className={`btn-card-action ${isPinned ? 'pinned' : ''}`}
              onClick={() => onPinItem({
                title: pageData.title,
                link: pageData.url,
                cleanSnippet: pageData.description || pageData.paragraphs?.[0]?.text,
                hostname: pageData.hostname,
                trustScore: 95,
                trustBadge: 'Reader Mode'
              })}
            >
              <Bookmark size={13} />
              <span>{isPinned ? 'Pinned' : 'Pin to Board'}</span>
            </button>

            <a
              href={pageData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-card-action"
            >
              <ExternalLink size={13} />
              <span>Open Source</span>
            </a>
          </div>
        </div>

        <h1 className="reader-title">{pageData.title}</h1>

        <div className="reader-meta-row">
          {pageData.author && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <User size={13} />
              {pageData.author}
            </span>
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={13} />
            {pageData.readTime}
          </span>
          <span>{pageData.totalWords?.toLocaleString()} words</span>
        </div>
      </div>

      {/* Lead Image if available */}
      {pageData.leadImage && (
        <img
          src={pageData.leadImage}
          alt={pageData.title ? `Lead article illustration for ${pageData.title}` : 'Article lead illustration'}
          className="reader-lead-image"
          loading="lazy"
          decoding="async"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}

      {/* Clean Paragraphs */}
      <div className="reader-content">
        {pageData.paragraphs?.map((item, idx) => {
          if (item.tag === 'h2') {
            return <h2 key={idx}>{item.text}</h2>;
          }
          if (item.tag === 'h3') {
            return <h3 key={idx}>{item.text}</h3>;
          }
          if (item.tag === 'blockquote') {
            return <blockquote key={idx}>{item.text}</blockquote>;
          }
          return <p key={idx}>{item.text}</p>;
        })}
      </div>
    </article>
  );
}
