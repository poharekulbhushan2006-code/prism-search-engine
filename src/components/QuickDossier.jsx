import React from 'react';
import { ShieldCheck, Sparkles, ExternalLink, Activity, Users } from 'lucide-react';

export default function QuickDossier({ dossier, metrics, onSelectEntity }) {
  if (!dossier) return null;

  return (
    <div className="dossier-card">
      <div className="dossier-header">
        <div>
          <div className="dossier-meta">
            <Sparkles size={14} />
            <span>PRISM Intelligence Dossier</span>
          </div>
          <h2 className="dossier-title">{dossier.query}</h2>
        </div>

        {dossier.wikiThumbnail && (
          <img
            src={dossier.wikiThumbnail}
            alt={dossier.query ? `Portrait and visual summary for ${dossier.query}` : 'Entity thumbnail'}
            className="dossier-thumb"
            loading="lazy"
            decoding="async"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
      </div>

      <p className="dossier-extract">
        {dossier.summary}
      </p>

      {dossier.consensus && (
        <div style={{ margin: '0.75rem 0', fontSize: '0.86rem', color: '#94a3b8', fontStyle: 'italic', borderLeft: '2px solid #6366f1', paddingLeft: '0.75rem' }}>
          💡 <strong>Consensus Note:</strong> {dossier.consensus}
        </div>
      )}

      <div className="dossier-footer">
        {/* Connected Concepts Tags */}
        <div className="dossier-tags">
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Key Nodes:</span>
          {dossier.keyEntities?.map((entity, idx) => (
            <button
              key={idx}
              className="tag-entity"
              onClick={() => onSelectEntity && onSelectEntity(entity)}
              title={`Explore ${entity}`}
            >
              #{entity}
            </button>
          ))}
        </div>

        {/* Anti-SEO & Signal Telemetry */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem', color: '#94a3b8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={14} color="#10b981" />
            <span>Trust: <strong>{dossier.averageTrustScore || 88}%</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Activity size={14} color="#06b6d4" />
            <span>SEO Noise Blocked: <strong>{metrics?.spamFiltered || dossier.spamFiltered}</strong></span>
          </div>

          {dossier.wikiUrl && (
            <a
              href={dossier.wikiUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#818cf8' }}
            >
              <span>Encyclopedia</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
