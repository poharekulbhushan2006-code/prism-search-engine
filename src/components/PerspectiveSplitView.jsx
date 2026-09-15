import React from 'react';
import { CheckCircle2, AlertCircle, ExternalLink, Bookmark } from 'lucide-react';

export default function PerspectiveSplitView({ perspectives, onPinItem, pinnedUrls = new Set(), onOpenInTab }) {
  if (!perspectives || !perspectives.perspectiveA || !perspectives.perspectiveB) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
        <p>No multi-perspective debate detected for this topic. Switch to Stream Feed or Knowledge Graph.</p>
      </div>
    );
  }

  const { perspectiveA, perspectiveB } = perspectives;

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', marginBottom: '0.3rem' }}>
          Dialectic & Perspective Split
        </h3>
        <p style={{ fontSize: '0.86rem', color: '#94a3b8' }}>
          Comparing arguments, documented real-world trade-offs, and community consensus side-by-side.
        </p>
      </div>

      <div className="perspective-split-container">
        {/* Column A */}
        <div className="perspective-column side-a">
          <div className="perspective-col-header">
            <h4 className="perspective-col-title" style={{ color: '#818cf8' }}>
              {perspectiveA.title}
            </h4>
            <p className="perspective-col-sub">{perspectiveA.subtitle}</p>
          </div>

          {/* Key Claims */}
          {perspectiveA.keyClaims && perspectiveA.keyClaims.length > 0 && (
            <div className="claims-box">
              <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#818cf8', fontWeight: 700 }}>
                Core Documented Arguments
              </div>
              {perspectiveA.keyClaims.map((claim, idx) => (
                <div key={idx} className="claim-bullet">
                  <CheckCircle2 size={14} color="#10b981" style={{ flexShrink: 0, marginTop: 3 }} />
                  <span>{claim}</span>
                </div>
              ))}
            </div>
          )}

          {/* Source Articles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
              Supporting Sources & Threads
            </div>
            {perspectiveA.items.map((item, idx) => {
              const isPinned = pinnedUrls.has(item.link);
              return (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.9rem', color: '#60a5fa', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, flex: 1 }}
                    >
                      <span>{item.title}</span>
                      <ExternalLink size={12} />
                    </a>
                    {onOpenInTab && (
                      <button
                        type="button"
                        className="btn-open-tab"
                        style={{ padding: '0.18rem 0.45rem', fontSize: '0.7rem' }}
                        onClick={() => onOpenInTab(item.link, item.title)}
                        title="Open in PRISM tab"
                      >
                        <span>Tab</span>
                      </button>
                    )}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 4 }}>
                    {item.cleanSnippet?.slice(0, 130)}...
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, fontSize: '0.72rem' }}>
                    <span style={{ color: '#34d399' }}>{item.trustScore}% Trust</span>
                    <button
                      type="button"
                      onClick={() => onPinItem(item)}
                      style={{ color: isPinned ? '#818cf8' : '#94a3b8', display: 'flex', alignItems: 'center', gap: 3, cursor: 'pointer', background: 'transparent', border: 'none' }}
                    >
                      <Bookmark size={11} fill={isPinned ? '#818cf8' : 'none'} />
                      <span>{isPinned ? 'Pinned' : 'Pin'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column B */}
        <div className="perspective-column side-b">
          <div className="perspective-col-header">
            <h4 className="perspective-col-title" style={{ color: '#38bdf8' }}>
              {perspectiveB.title}
            </h4>
            <p className="perspective-col-sub">{perspectiveB.subtitle}</p>
          </div>

          {/* Key Claims */}
          {perspectiveB.keyClaims && perspectiveB.keyClaims.length > 0 && (
            <div className="claims-box">
              <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 700 }}>
                Trade-offs & Critical Counterpoints
              </div>
              {perspectiveB.keyClaims.map((claim, idx) => (
                <div key={idx} className="claim-bullet">
                  <AlertCircle size={14} color="#f59e0b" style={{ flexShrink: 0, marginTop: 3 }} />
                  <span>{claim}</span>
                </div>
              ))}
            </div>
          )}

          {/* Source Articles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
              Counter-Evidence & Skepticism
            </div>
            {perspectiveB.items.map((item, idx) => {
              const isPinned = pinnedUrls.has(item.link);
              return (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.9rem', color: '#38bdf8', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, flex: 1 }}
                    >
                      <span>{item.title}</span>
                      <ExternalLink size={12} />
                    </a>
                    {onOpenInTab && (
                      <button
                        type="button"
                        className="btn-open-tab"
                        style={{ padding: '0.18rem 0.45rem', fontSize: '0.7rem' }}
                        onClick={() => onOpenInTab(item.link, item.title)}
                        title="Open in PRISM tab"
                      >
                        <span>Tab</span>
                      </button>
                    )}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 4 }}>
                    {item.cleanSnippet?.slice(0, 130)}...
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, fontSize: '0.72rem' }}>
                    <span style={{ color: '#34d399' }}>{item.trustScore}% Trust</span>
                    <button
                      type="button"
                      onClick={() => onPinItem(item)}
                      style={{ color: isPinned ? '#818cf8' : '#94a3b8', display: 'flex', alignItems: 'center', gap: 3, cursor: 'pointer', background: 'transparent', border: 'none' }}
                    >
                      <Bookmark size={11} fill={isPinned ? '#818cf8' : 'none'} />
                      <span>{isPinned ? 'Pinned' : 'Pin'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
