import React from 'react';
import { 
  ChevronLeft, 
  BookOpen, 
  Download, 
  Layers, 
  Compass
} from 'lucide-react';

export default function SafariBottomBar({
  onOpenInstall,
  onOpenTabs,
  onToggleReader,
  isReaderOpen,
  canGoBack,
  onGoBack,
  activeLens
}) {
  return (
    <div className="safari-mobile-dock">
      {/* Back Navigation */}
      <button
        onClick={onGoBack}
        disabled={!canGoBack}
        style={{
          background: 'transparent',
          border: 'none',
          color: canGoBack ? '#fff' : '#475569',
          padding: '0.4rem',
          cursor: canGoBack ? 'pointer' : 'default',
          display: 'flex'
        }}
        title="Back"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Reader Mode */}
      <button
        onClick={onToggleReader}
        style={{
          background: isReaderOpen ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
          border: isReaderOpen ? '1px solid rgba(6, 182, 212, 0.4)' : 'none',
          borderRadius: '8px',
          color: isReaderOpen ? '#22d3ee' : '#94a3b8',
          padding: '0.4rem',
          cursor: 'pointer',
          display: 'flex'
        }}
        title="Reader Mode"
      >
        <BookOpen size={18} />
      </button>

      {/* Active Lens Pill */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        background: 'rgba(30, 41, 59, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '9999px',
        padding: '0.3rem 0.75rem',
        fontSize: '0.75rem',
        fontWeight: '600',
        color: '#38bdf8'
      }}>
        <Compass size={13} />
        <span style={{ textTransform: 'capitalize' }}>{activeLens || 'All'} Lens</span>
      </div>

      {/* Install App */}
      <button
        onClick={onOpenInstall}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#38bdf8',
          padding: '0.4rem',
          cursor: 'pointer',
          display: 'flex'
        }}
        title="Install PRISM App"
      >
        <Download size={18} />
      </button>

      {/* Tabs */}
      <button
        onClick={onOpenTabs}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          background: 'rgba(30, 41, 59, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '8px',
          padding: '0.25rem 0.5rem',
          color: '#e2e8f0',
          fontSize: '0.74rem',
          fontWeight: '700',
          cursor: 'pointer'
        }}
        title="Lenses & Tabs"
      >
        <Layers size={13} />
        <span>5</span>
      </button>
    </div>
  );
}
