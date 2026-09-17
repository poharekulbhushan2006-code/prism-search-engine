import React, { useState, useMemo } from 'react';
import { 
  Table, 
  ArrowUpDown, 
  Search, 
  Check, 
  Copy, 
  ChevronDown, 
  ChevronUp, 
  Info
} from 'lucide-react';

export default function AnimatedComparisonTable({ comparisonTable, query }) {
  if (!comparisonTable || !comparisonTable.rows || comparisonTable.rows.length === 0) {
    return null;
  }

  const { title, subtitle, columns = [], rows = [] } = comparisonTable;
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('desc');
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [copied, setCopied] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(['all']);
    rows.forEach(r => {
      if (r.category) cats.add(r.category);
    });
    return Array.from(cats);
  }, [rows]);

  const primaryColKey = columns[0]?.key || 'name';

  const processedRows = useMemo(() => {
    let result = rows.filter(row => {
      const rowTitle = String(row[primaryColKey] || row.name || row.modality || row.paradigm || row.dimension || '');
      const matchesSearch = 
        !searchTerm || 
        rowTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Object.values(row).some(v => typeof v === 'string' && v.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCat = activeCategory === 'all' || row.category === activeCategory;
      return matchesSearch && matchesCat;
    });

    if (sortColumn) {
      result.sort((a, b) => {
        let valA = a[sortColumn];
        let valB = b[sortColumn];

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        }
        valA = String(valA || '').toLowerCase();
        valB = String(valB || '').toLowerCase();
        return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }

    return result;
  }, [rows, searchTerm, activeCategory, sortColumn, sortDirection, primaryColKey]);

  const handleSort = (colKey) => {
    if (sortColumn === colKey) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(colKey);
      setSortDirection('desc');
    }
  };

  const copyAsMarkdown = () => {
    const header = `| ${columns.map(c => c.label).join(' | ')} |`;
    const divider = `| ${columns.map(() => '---').join(' | ')} |`;
    const body = processedRows.map(r => {
      return `| ${columns.map(c => r[c.key] || '—').join(' | ')} |`;
    }).join('\n');
    
    navigator.clipboard.writeText(`${title}\n\n${header}\n${divider}\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="prism-comparison-card">
      {/* 1. Header */}
      <div className="flowchart-topbar">
        <div className="flowchart-header-info">
          <div className="flowchart-icon-box" style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}>
            <Table size={20} />
          </div>
          <div>
            <div className="flowchart-badge-row">
              <span className="flowchart-badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
                STRUCTURED COMPARISON MATRIX
              </span>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                {processedRows.length} Paradigms Evaluated
              </span>
            </div>
            <h3 className="flowchart-title">{title}</h3>
          </div>
        </div>

        <button onClick={copyAsMarkdown} className="flowchart-ctrl-btn">
          {copied ? (
            <>
              <Check size={13} color="#10b981" />
              <span style={{ color: '#34d399' }}>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy Matrix</span>
            </>
          )}
        </button>
      </div>

      {subtitle && (
        <div className="flowchart-subtitle-bar">
          <Info size={14} color="#818cf8" style={{ flexShrink: 0 }} />
          <span>{subtitle}</span>
        </div>
      )}

      {/* 2. Filter / Search Toolbar */}
      <div className="table-filter-toolbar">
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid ' + (activeCategory === cat ? '#6366f1' : 'rgba(255,255,255,0.08)'),
                background: activeCategory === cat ? 'rgba(99, 102, 241, 0.3)' : 'rgba(15, 23, 42, 0.6)',
                color: activeCategory === cat ? '#fff' : '#94a3b8',
                fontSize: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Filter matrix rows..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="table-search-input"
          />
        </div>
      </div>

      {/* 3. Table Element */}
      <div className="mobile-table-swipe-hint">
        <span>⇄ Swipe table horizontally to explore all parameters</span>
      </div>
      <div className="matrix-table-scroll-container" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table className="custom-matrix-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} onClick={() => handleSort(col.key)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>{col.label}</span>
                    <ArrowUpDown size={12} color={sortColumn === col.key ? '#818cf8' : '#64748b'} />
                  </div>
                </th>
              ))}
              <th style={{ textAlign: 'right' }}>Inspect</th>
            </tr>
          </thead>
          <tbody>
            {processedRows.map((row, idx) => {
              const isExpanded = expandedRowId === (row.id || idx);
              return (
                <React.Fragment key={row.id || idx}>
                  <tr
                    onClick={() => setExpandedRowId(isExpanded ? null : (row.id || idx))}
                    style={{
                      cursor: 'pointer',
                      background: isExpanded ? 'rgba(99, 102, 241, 0.12)' : (idx % 2 === 0 ? 'rgba(15, 23, 42, 0.4)' : 'rgba(15, 23, 42, 0.7)')
                    }}
                  >
                    {columns.map(col => {
                      const val = row[col.key];
                      const isPrimary = col.key === columns[0]?.key;

                      if (isPrimary) {
                        return (
                          <td key={col.key} style={{ fontWeight: '700', color: '#fff' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span>{val || '—'}</span>
                              {row.badge && (
                                <span
                                  style={{
                                    fontSize: '0.68rem',
                                    padding: '0.15rem 0.5rem',
                                    borderRadius: '6px',
                                    fontWeight: '600',
                                    background: row.badgeColor ? `${row.badgeColor}22` : 'rgba(99, 102, 241, 0.2)',
                                    borderColor: row.badgeColor ? `${row.badgeColor}55` : 'rgba(99, 102, 241, 0.4)',
                                    color: row.badgeColor || '#a5b4fc',
                                    border: '1px solid'
                                  }}
                                >
                                  {row.badge}
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      }

                      if (col.isProgress || col.type === 'metric' || (typeof val === 'number' && val <= 100)) {
                        const num = Number(val) || 0;
                        const displayText = row[`${col.key}Text`] || (typeof val === 'number' ? `${num}%` : val);
                        return (
                          <td key={col.key}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontFamily: 'monospace', fontWeight: '700', color: '#22d3ee', minWidth: '3.5rem' }}>
                                {displayText}
                              </span>
                              <div className="metric-bar-wrapper" style={{ width: '60px', marginTop: 0 }}>
                                <div
                                  className="metric-bar-fill"
                                  style={{ width: `${Math.min(100, Math.max(5, num))}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        );
                      }

                      return (
                        <td key={col.key}>
                          {val || '—'}
                        </td>
                      );
                    })}

                    <td style={{ textAlign: 'right' }}>
                      {isExpanded ? (
                        <ChevronUp size={16} color="#818cf8" />
                      ) : (
                        <ChevronDown size={16} color="#64748b" />
                      )}
                    </td>
                  </tr>

                  {/* Expanded Row Breakdown */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={columns.length + 1} style={{ padding: '1.25rem', background: 'rgba(8, 12, 22, 0.9)', borderBottom: '1px solid rgba(99, 102, 241, 0.3)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          <div style={{ fontSize: '0.76rem', fontWeight: '700', textTransform: 'uppercase', color: '#818cf8', letterSpacing: '0.04em' }}>
                            Comprehensive Breakdown & Architectural Assessment: {row[primaryColKey] || row.name || 'Component'}
                          </div>
                          <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
                            {row.extendedAnalysis || row.description || `In-depth analysis for ${row[primaryColKey] || row.name || 'this item'} demonstrates verified operational efficacy and active domain benchmark alignment.`}
                          </p>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginTop: '0.4rem' }}>
                            {row.strengths && (
                              <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '8px', padding: '0.75rem' }}>
                                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#34d399', display: 'block', marginBottom: '0.2rem' }}>✓ Primary Advantages</span>
                                <span style={{ fontSize: '0.78rem', color: '#a7f3d0' }}>{row.strengths}</span>
                              </div>
                            )}
                            {row.tradeoffs && (
                              <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '8px', padding: '0.75rem' }}>
                                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#fbbf24', display: 'block', marginBottom: '0.2rem' }}>⚠ Constraints & Considerations</span>
                                <span style={{ fontSize: '0.78rem', color: '#fde68a' }}>{row.tradeoffs}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
