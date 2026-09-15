import React from 'react';
import {
  ShieldCheck,
  ExternalLink,
  Globe,
  BookOpen,
  Code,
  GraduationCap,
  Sparkles,
  Search,
  Layers,
  Info
} from 'lucide-react';

export default function GoogleKnowledgePanel({ cardData, onSearchQuery }) {
  if (!cardData) return null;

  const {
    title,
    subtitle,
    extract,
    image,
    officialUrl,
    attributes = [],
    profiles = [],
    relatedEntities = []
  } = cardData;

  const getProfileIcon = (domain) => {
    if (domain.includes('wikipedia')) return <BookOpen size={13} color="#38bdf8" />;
    if (domain.includes('github')) return <Code size={13} color="#a855f7" />;
    if (domain.includes('arxiv')) return <GraduationCap size={13} color="#34d399" />;
    return <Globe size={13} color="#818cf8" />;
  };

  return (
    <aside className="google-knowledge-card">
      {/* Header Banner */}
      <div className="gk-header">
        <div className="gk-header-badge">
          <Info size={13} color="#6366f1" />
          <span>Knowledge Graph • Verified Entity</span>
        </div>
      </div>

      {/* Image and Entity Identification */}
      <div className="gk-hero-section">
        {image && (
          <div className="gk-image-wrapper">
            <img src={image} alt={title} className="gk-image" />
          </div>
        )}
        <div className="gk-entity-meta">
          <h2 className="gk-title">{title}</h2>
          <div className="gk-subtitle">{subtitle}</div>
        </div>
      </div>

      {/* Summary Extract */}
      {extract && (
        <div className="gk-extract-section">
          <p className="gk-extract-text">{extract}</p>
          {officialUrl && (
            <a
              href={officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="gk-source-link"
            >
              <span>Wikipedia & Verified Records</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      )}

      {/* Key Attributes & Fact Grid (Google-Style) */}
      {attributes.length > 0 && (
        <div className="gk-attributes-section">
          <h4 className="gk-section-label">Key Specifications & Details</h4>
          <dl className="gk-attributes-list">
            {attributes.map((attr, idx) => (
              <div key={idx} className="gk-attr-row">
                <dt className="gk-attr-name">{attr.label}</dt>
                <dd className="gk-attr-val">{attr.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Official Profiles & Authoritative Links */}
      {profiles.length > 0 && (
        <div className="gk-profiles-section">
          <h4 className="gk-section-label">Authoritative Profiles & Links</h4>
          <div className="gk-profiles-grid">
            {profiles.map((prof, idx) => (
              <a
                key={idx}
                href={prof.url}
                target="_blank"
                rel="noopener noreferrer"
                className="gk-profile-chip"
              >
                {getProfileIcon(prof.domain || '')}
                <span>{prof.label}</span>
                <ExternalLink size={11} className="gk-external-icon" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* People Also Search For (Google-Style Carousel) */}
      {relatedEntities.length > 0 && (
        <div className="gk-related-section">
          <h4 className="gk-section-label">People Also Search For</h4>
          <div className="gk-related-chips">
            {relatedEntities.map((ent, idx) => (
              <button
                key={idx}
                type="button"
                className="gk-related-chip"
                onClick={() => onSearchQuery && onSearchQuery(ent.name)}
                title={`Search for "${ent.name}"`}
              >
                <Search size={11} color="#94a3b8" />
                <span className="gk-related-name">{ent.name}</span>
                <span className="gk-related-cat">{ent.category}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
