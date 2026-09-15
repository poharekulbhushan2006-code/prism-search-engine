import React from 'react';
import { ExternalLink, ShieldCheck, Globe } from 'lucide-react';

export default function SourceRail({ sources = [], onOpenInTab }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="source-rail-container">
      <div className="source-rail-label">
        <span>Sources Cited in AI Synthesis</span>
        <span className="source-count-pill">{sources.length} Verified</span>
      </div>

      <div className="source-rail-scroll">
        {sources.map((src, idx) => (
          <div
            key={idx}
            className="source-rail-card"
            onClick={() => onOpenInTab && onOpenInTab(src.url, src.title)}
            title={`Read ${src.title} in PRISM Reader`}
          >
            <div className="source-rail-header">
              <span className="source-citation-num">[{src.citationIndex || idx + 1}]</span>
              <span className="source-hostname">{src.hostname}</span>
              <ShieldCheck size={12} color="#10b981" />
            </div>

            <div className="source-rail-title">{src.title}</div>

            <div className="source-rail-footer">
              <span className="source-trust-score">{src.trustScore || 90}% Trust</span>
              <span className="source-open-hint">Open Tab →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
