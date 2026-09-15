import React, { useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Bookmark,
  Share2,
  CheckCircle2,
  Cpu,
  ExternalLink
} from 'lucide-react';

export default function AIAnswerSection({
  query,
  aiOverview,
  onPinAnswer,
  isPinned,
  onOpenInTab
}) {
  const [showReasoning, setShowReasoning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeCitation, setActiveCitation] = useState(null);

  if (!aiOverview) return null;

  const { reasoningSteps = [], citedSources = [], directAnswer = '', takeaways = [] } = aiOverview;

  const handleCopy = () => {
    navigator.clipboard.writeText(`## PRISM AI Overview: ${query}\n\n${directAnswer}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render text with interactive inline citation badges [1], [2]
  const renderFormattedText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\[\d+\])/g);

    return parts.map((part, index) => {
      const citationMatch = part.match(/\[(\d+)\]/);
      if (citationMatch) {
        const citationNum = parseInt(citationMatch[1], 10);
        const matchedSource = citedSources.find((s) => s.citationIndex === citationNum);

        return (
          <button
            key={index}
            type="button"
            className={`inline-citation-badge ${activeCitation?.citationIndex === citationNum ? 'active' : ''}`}
            onClick={() => {
              if (matchedSource && onOpenInTab) {
                onOpenInTab(matchedSource.url, matchedSource.title);
              }
            }}
            onMouseEnter={() => matchedSource && setActiveCitation(matchedSource)}
            onMouseLeave={() => setActiveCitation(null)}
            title={matchedSource ? `[${citationNum}] ${matchedSource.title} (${matchedSource.hostname})` : `Source [${citationNum}]`}
          >
            {citationNum}
          </button>
        );
      }

      // Handle bold markdown **text**
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span key={index}>
          {boldParts.map((bp, bIdx) => {
            if (bp.startsWith('**') && bp.endsWith('**')) {
              return <strong key={bIdx} style={{ color: '#f8fafc' }}>{bp.slice(2, -2)}</strong>;
            }
            return bp;
          })}
        </span>
      );
    });
  };

  return (
    <section className="ai-answer-container">
      {/* 1. Reasoning Steps Bar (Thinking Process) */}
      {reasoningSteps.length > 0 && (
        <div className="reasoning-accordion">
          <button
            type="button"
            className="reasoning-toggle-btn"
            onClick={() => setShowReasoning(!showReasoning)}
          >
            <div className="reasoning-label-row">
              <Cpu size={15} color="#06b6d4" className="pulse-icon" />
              <span>AI Multi-Step Reasoning Trace ({reasoningSteps.length} Steps Completed)</span>
            </div>
            {showReasoning ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showReasoning && (
            <div className="reasoning-steps-body">
              {reasoningSteps.map((step) => (
                <div key={step.step} className="reasoning-step-item">
                  <div className="reasoning-step-num">{step.step}</div>
                  <div className="reasoning-step-content">
                    <div className="reasoning-step-title">{step.title}</div>
                    <div className="reasoning-step-desc">{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Main AI Overview Card */}
      <div className="ai-overview-card">
        <div className="ai-overview-header">
          <div className="ai-overview-brand">
            <Sparkles size={18} color="#6366f1" />
            <span>PRISM AI Synthesis</span>
          </div>

          <div className="ai-overview-actions">
            <button
              type="button"
              className="btn-card-action"
              onClick={handleCopy}
              title="Copy synthesized answer"
            >
              {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              className={`btn-card-action ${isPinned ? 'pinned' : ''}`}
              onClick={onPinAnswer}
              title="Save synthesis to Workbench"
            >
              <Bookmark size={13} fill={isPinned ? '#818cf8' : 'none'} />
              <span>{isPinned ? 'Saved' : 'Save to Board'}</span>
            </button>
          </div>
        </div>

        {/* Answer Content */}
        <div className="ai-answer-text">
          {directAnswer.split('\n\n').map((paragraph, pIdx) => (
            <p key={pIdx} style={{ marginBottom: '1rem', lineHeight: 1.75 }}>
              {renderFormattedText(paragraph)}
            </p>
          ))}
        </div>

        {/* Active Citation Floating Preview Tooltip */}
        {activeCitation && (
          <div className="citation-preview-pill">
            <span style={{ color: '#06b6d4', fontWeight: 700 }}>[{activeCitation.citationIndex}]</span>
            <span style={{ fontWeight: 600, color: '#f8fafc' }}>{activeCitation.hostname}:</span>
            <span style={{ color: '#cbd5e1' }}>{activeCitation.title.slice(0, 70)}...</span>
            <span style={{ color: '#818cf8', display: 'flex', alignItems: 'center', gap: 3 }}>
              Click to Open Tab <ExternalLink size={11} />
            </span>
          </div>
        )}

        {/* 3. Structured Key Takeaways Grid */}
        {takeaways.length > 0 && (
          <div className="takeaways-box">
            <div className="takeaways-header">
              <CheckCircle2 size={15} color="#10b981" />
              <span>Key Takeaways & Consensus</span>
            </div>
            <div className="takeaways-grid">
              {takeaways.map((item, idx) => (
                <div key={idx} className="takeaway-item">
                  <div className="takeaway-bullet" />
                  <div className="takeaway-text">{renderFormattedText(item)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
