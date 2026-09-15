import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  ExternalLink,
  Compass,
  ArrowRight,
  Share2,
  BookOpen,
  MessageSquare
} from 'lucide-react';

export default function RelatedExploration({
  query,
  relatedInformation,
  onSearchQuery,
  onSelectLens,
  onOpenInTab
}) {
  const [openIndex, setOpenIndex] = useState(0); // first item open by default for immediate value

  if (!relatedInformation) return null;

  const { relatedQuestions = [], relatedSearches = [] } = relatedInformation;

  const toggleQuestion = (idx) => {
    setOpenIndex((prev) => (prev === idx ? -1 : idx));
  };

  return (
    <section className="related-exploration-container">
      {/* 1. People Also Inquire Section (Expandable Instant AI Answers) */}
      {relatedQuestions.length > 0 && (
        <div className="related-block">
          <div className="related-header">
            <HelpCircle size={17} color="#38bdf8" />
            <h3 className="related-title">People Also Inquire & Deep Dives</h3>
          </div>

          <div className="related-questions-list">
            {relatedQuestions.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className={`related-q-card ${isOpen ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="related-q-trigger"
                    onClick={() => toggleQuestion(idx)}
                  >
                    <span className="related-q-text">{item.question}</span>
                    {isOpen ? <ChevronUp size={16} color="#818cf8" /> : <ChevronDown size={16} color="#64748b" />}
                  </button>

                  {isOpen && (
                    <div className="related-q-body">
                      <p className="related-q-answer">{item.answer}</p>
                      {item.sourceTitle && (
                        <div className="related-q-source">
                          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Source:</span>
                          {item.sourceUrl ? (
                            <button
                              type="button"
                              className="related-source-link"
                              onClick={() => onOpenInTab && onOpenInTab(item.sourceUrl, item.sourceTitle)}
                            >
                              <span>{item.sourceTitle}</span>
                              <ExternalLink size={11} />
                            </button>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{item.sourceTitle}</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Related Searches & Exploration Chips */}
      {relatedSearches.length > 0 && (
        <div className="related-block">
          <div className="related-header">
            <Search size={16} color="#10b981" />
            <h3 className="related-title">Related Searches & Rabbit Holes</h3>
          </div>

          <div className="related-searches-grid">
            {relatedSearches.map((term, idx) => (
              <button
                key={idx}
                type="button"
                className="related-search-tile"
                onClick={() => onSearchQuery(term)}
                title={`Search for "${term}"`}
              >
                <div className="related-search-inner">
                  <Compass size={14} color="#6366f1" />
                  <span className="related-term-text">{term}</span>
                </div>
                <ArrowRight size={13} className="related-arrow-icon" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Cross-Lens Quick Pivots */}
      <div className="lens-pivot-bar">
        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Explore "{query}" through other lenses:</span>
        <div className="lens-pivot-buttons">
          <button
            type="button"
            className="btn-pivot-chip"
            onClick={() => onSelectLens('human')}
          >
            <MessageSquare size={13} color="#f59e0b" />
            <span>Human Voices</span>
          </button>
          <button
            type="button"
            className="btn-pivot-chip"
            onClick={() => onSelectLens('research')}
          >
            <BookOpen size={13} color="#10b981" />
            <span>Deep Research</span>
          </button>
          <button
            type="button"
            className="btn-pivot-chip"
            onClick={() => onSelectLens('perspectives')}
          >
            <Share2 size={13} color="#ec4899" />
            <span>Split Perspectives</span>
          </button>
        </div>
      </div>
    </section>
  );
}
