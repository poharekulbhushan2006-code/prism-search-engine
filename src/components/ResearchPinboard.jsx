import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  Download,
  Copy,
  Check,
  FileText,
  ExternalLink,
  Search,
  BookOpen,
  Code,
  Share2
} from 'lucide-react';

export default function ResearchPinboard({
  isOpen,
  onClose,
  pinnedItems = [],
  onRemovePin,
  onClearAll,
  onOpenInTab
}) {
  const [personalNotes, setPersonalNotes] = useState(() => {
    try {
      return localStorage.getItem('prism_research_notes') || '';
    } catch {
      return '';
    }
  });

  const [filterQuery, setFilterQuery] = useState('');
  const [copiedAction, setCopiedAction] = useState(null); // 'md' | 'json' | 'citations'

  useEffect(() => {
    try {
      localStorage.setItem('prism_research_notes', personalNotes);
    } catch {
      // ignore
    }
  }, [personalNotes]);

  if (!isOpen) return null;

  // Filter pinned items
  const filteredItems = pinnedItems.filter(item => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.hostname && item.hostname.toLowerCase().includes(q)) ||
      (item.cleanSnippet && item.cleanSnippet.toLowerCase().includes(q))
    );
  });

  // 1. Markdown Dossier Generator
  const generateMarkdown = () => {
    let md = `# PRISM Research Dossier\n`;
    md += `*Generated on: ${new Date().toLocaleDateString()} via PRISM Search Engine*\n\n`;

    if (personalNotes.trim()) {
      md += `## Research Notes & Annotations\n${personalNotes.trim()}\n\n`;
    }

    md += `## Pinned Sources & Synthesized Intelligence (${pinnedItems.length})\n\n`;
    pinnedItems.forEach((item, i) => {
      md += `### ${i + 1}. [${item.title}](${item.link})\n`;
      md += `- **Source Domain**: ${item.hostname || 'Web'}\n`;
      md += `- **Trust Score**: ${item.trustScore || 85}% (${item.trustBadge || 'Verified'})\n`;
      md += `- **Key Takeaway**: ${item.cleanSnippet || item.snippet || 'No excerpt available.'}\n\n`;
    });

    return md;
  };

  // 2. JSON Dossier Generator
  const generateJSON = () => {
    const data = {
      title: 'PRISM Research Dossier',
      exportedAt: new Date().toISOString(),
      notes: personalNotes.trim(),
      totalSources: pinnedItems.length,
      sources: pinnedItems.map((item, i) => ({
        index: i + 1,
        title: item.title,
        url: item.link,
        domain: item.hostname,
        trustScore: item.trustScore,
        trustBadge: item.trustBadge,
        snippet: item.cleanSnippet || item.snippet
      }))
    };
    return JSON.stringify(data, null, 2);
  };

  // 3. Formatted Bibliography / Citations Generator (APA Style)
  const generateCitations = () => {
    const year = new Date().getFullYear();
    let text = `PRISM Research Bibliography (APA Format)\n\n`;
    pinnedItems.forEach((item, i) => {
      const author = item.author || item.hostname || 'PRISM Archive';
      text += `[${i + 1}] ${author}. (${year}). ${item.title}. Retrieved from ${item.link}\n\n`;
    });
    return text;
  };

  const handleCopy = (type, content) => {
    navigator.clipboard.writeText(content);
    setCopiedAction(type);
    setTimeout(() => setCopiedAction(null), 2000);
  };

  const handleDownload = (filename, content, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pinboard-overlay" onClick={onClose}>
      <div className="pinboard-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="pinboard-header">
          <div className="pinboard-title">
            <FileText size={18} color="#6366f1" />
            <span>Research Workbench ({pinnedItems.length})</span>
          </div>
          <button className="btn-clear" onClick={onClose} title="Close drawer">
            <X size={18} />
          </button>
        </div>

        {/* Quick Search across pinned items */}
        {pinnedItems.length > 2 && (
          <div style={{ marginBottom: '0.75rem', position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: 9, color: '#64748b' }} />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter pinned sources..."
              style={{
                width: '100%',
                padding: '0.45rem 0.6rem 0.45rem 2rem',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            />
          </div>
        )}

        {/* Auto-saved Personal Notes Area */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <label style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Personal Notes & Annotations (Auto-saved):
            </label>
            {personalNotes && (
              <span style={{ fontSize: '0.7rem', color: '#10b981' }}>Saved</span>
            )}
          </div>
          <textarea
            value={personalNotes}
            onChange={(e) => setPersonalNotes(e.target.value)}
            placeholder="Type research takeaways, hypotheses, comparisons, or thoughts..."
            style={{
              width: '100%',
              height: '75px',
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '0.5rem',
              color: '#f8fafc',
              fontSize: '0.82rem',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Pinned Items List */}
        <div className="pinboard-list">
          {pinnedItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b', fontSize: '0.85rem' }}>
              <p>No pinned sources yet.</p>
              <p style={{ marginTop: '0.4rem', fontSize: '0.78rem' }}>
                Click "Pin to Board" on search results or knowledge graph nodes to collect insights into your dossier.
              </p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b', fontSize: '0.85rem' }}>
              <p>No pinned items match "{filterQuery}".</p>
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <div key={item.link || index} className="pinned-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pinned-title"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flex: 1 }}
                  >
                    <span>{item.title}</span>
                    <ExternalLink size={12} />
                  </a>

                  {onOpenInTab && item.link?.startsWith('http') && (
                    <button
                      type="button"
                      className="btn-open-tab"
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                      onClick={() => {
                        onOpenInTab(item.link, item.title);
                        onClose();
                      }}
                      title="Open in PRISM browser tab"
                    >
                      <span>Read Tab</span>
                    </button>
                  )}
                </div>

                <p className="pinned-desc">
                  {item.cleanSnippet || item.snippet}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                  <span style={{ fontSize: '0.72rem', color: '#34d399' }}>
                    {item.trustScore || 85}% Trust • {item.hostname || 'Source'}
                  </span>

                  <button
                    type="button"
                    className="pinned-delete-btn"
                    onClick={() => onRemovePin(item.link)}
                    title="Remove from board"
                  >
                    <Trash2 size={12} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Multi-Format Export Actions */}
        {pinnedItems.length > 0 && (
          <div className="pinboard-footer" style={{ flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.4rem', width: '100%' }}>
              <button
                type="button"
                className="btn-export"
                onClick={() => handleDownload(`prism-dossier-${Date.now()}.md`, generateMarkdown(), 'text/markdown')}
                title="Download dossier as Markdown document"
                style={{ flex: 1 }}
              >
                <Download size={13} />
                <span>Export .MD</span>
              </button>

              <button
                type="button"
                className="btn-card-action"
                onClick={() => handleDownload(`prism-dossier-${Date.now()}.json`, generateJSON(), 'application/json')}
                title="Export as JSON dataset"
              >
                <Code size={13} />
                <span>JSON</span>
              </button>

              <button
                type="button"
                className="btn-card-action"
                onClick={() => handleCopy('citations', generateCitations())}
                title="Copy APA Citations to clipboard"
              >
                {copiedAction === 'citations' ? <Check size={13} color="#10b981" /> : <BookOpen size={13} />}
                <span>{copiedAction === 'citations' ? 'Copied' : 'Citations'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', width: '100%' }}>
              <button
                type="button"
                className="btn-card-action"
                onClick={() => handleCopy('md', generateMarkdown())}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {copiedAction === 'md' ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                <span>{copiedAction === 'md' ? 'Markdown Copied' : 'Copy All MD'}</span>
              </button>

              <button
                type="button"
                className="btn-card-action"
                onClick={onClearAll}
                style={{ color: '#ef4444' }}
                title="Clear all pinned items"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
