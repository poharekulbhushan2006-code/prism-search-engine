import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, ArrowUpRight, Sparkles, Compass } from 'lucide-react';

export default function PeopleAlsoAsk({ peopleAlsoAsk, onSelectQuery }) {
  if (!peopleAlsoAsk || !peopleAlsoAsk.questions || peopleAlsoAsk.questions.length === 0) {
    return null;
  }

  const { title = 'People Also Ask', questions = [] } = peopleAlsoAsk;
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="prism-paa-card">
      {/* Header */}
      <div className="flowchart-topbar">
        <div className="flowchart-header-info">
          <div className="flowchart-icon-box" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
            <HelpCircle size={20} />
          </div>
          <div>
            <div className="flowchart-badge-row">
              <span className="flowchart-badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                EXPLORATION DIGEST
              </span>
            </div>
            <h3 className="flowchart-title">{title}</h3>
          </div>
        </div>
      </div>

      {/* Accordion Questions */}
      <div>
        {questions.map((qItem, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx}>
              <button
                onClick={() => toggle(idx)}
                className="paa-question-row"
              >
                <span>{qItem.question}</span>
                <span style={{ background: 'rgba(30, 41, 59, 0.8)', padding: '0.3rem', borderRadius: '50%', display: 'flex' }}>
                  {isOpen ? <ChevronUp size={15} color="#f59e0b" /> : <ChevronDown size={15} color="#94a3b8" />}
                </span>
              </button>

              {isOpen && (
                <div className="paa-expanded-drawer">
                  <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.65', margin: 0 }}>
                    {qItem.answer}
                  </p>

                  {qItem.takeaway && (
                    <div style={{ marginTop: '0.75rem', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '8px', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#fef3c7' }}>
                      <Sparkles size={14} color="#fbbf24" style={{ flexShrink: 0 }} />
                      <span><strong>Key Takeaway:</strong> {qItem.takeaway}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {qItem.sourceTitle ? (
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Source: <strong style={{ color: '#94a3b8' }}>{qItem.sourceTitle}</strong>
                      </span>
                    ) : <span />}

                    <button
                      onClick={() => onSelectQuery && onSelectQuery(qItem.question)}
                      className="flowchart-ctrl-btn"
                      style={{ color: '#22d3ee', borderColor: 'rgba(6, 182, 212, 0.3)' }}
                    >
                      <Compass size={13} />
                      <span>Explore this Query</span>
                      <ArrowUpRight size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
