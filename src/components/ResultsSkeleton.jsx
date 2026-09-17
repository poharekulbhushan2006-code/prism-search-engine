import React from 'react';
import { Sparkles, Bot, Loader2 } from 'lucide-react';

export default function ResultsSkeleton({ query }) {
  return (
    <div className="results-skeleton-container" aria-busy="true" aria-label="Loading search results">
      {/* 1. Reasoning Pulse Indicator */}
      <div className="skeleton-reasoning-bar">
        <div className="skeleton-reasoning-icon">
          <Sparkles size={16} className="skeleton-spin-pulse" />
        </div>
        <div className="skeleton-reasoning-text">
          <span className="reasoning-title">
            Synthesizing Multi-Source Spectrum for "{query || 'Search'}"
          </span>
          <span className="reasoning-sub">
            Filtering SEO noise • Cross-referencing encyclopedic & peer citations • Parsing data points...
          </span>
        </div>
        <div className="skeleton-progress-track">
          <div className="skeleton-progress-bar" />
        </div>
      </div>

      {/* 2. Quick Dossier Skeleton Card */}
      <div className="skeleton-card skeleton-dossier">
        <div className="skeleton-dossier-top">
          <div className="skeleton-avatar skeleton-shimmer" />
          <div className="skeleton-dossier-header-lines">
            <div className="skeleton-line-title skeleton-shimmer" />
            <div className="skeleton-line-sub skeleton-shimmer" />
          </div>
        </div>
        <div className="skeleton-body-lines">
          <div className="skeleton-line-full skeleton-shimmer" />
          <div className="skeleton-line-full skeleton-shimmer" />
          <div className="skeleton-line-three-quarter skeleton-shimmer" />
        </div>
      </div>

      {/* 3. AI Overview Synthesis Skeleton */}
      <div className="skeleton-card skeleton-ai-card">
        <div className="skeleton-ai-header">
          <div className="skeleton-ai-badge skeleton-shimmer" />
          <div className="skeleton-pill skeleton-shimmer" />
        </div>
        <div className="skeleton-body-lines">
          <div className="skeleton-line-full skeleton-shimmer" />
          <div className="skeleton-line-full skeleton-shimmer" />
          <div className="skeleton-line-half skeleton-shimmer" />
        </div>
      </div>

      {/* 4. Search Results Stream Skeletons */}
      <div className="skeleton-stream-list">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton-result-item skeleton-shimmer">
            <div className="skeleton-res-top">
              <div className="skeleton-favicon skeleton-shimmer" />
              <div className="skeleton-domain skeleton-shimmer" />
              <div className="skeleton-score-badge skeleton-shimmer" />
            </div>
            <div className="skeleton-res-title skeleton-shimmer" />
            <div className="skeleton-res-snippet skeleton-shimmer" />
            <div className="skeleton-res-snippet skeleton-res-snippet-short skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}
