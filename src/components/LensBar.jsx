import React from 'react';
import { Globe, MessageSquare, BookOpen, Scale, Code2, LayoutList, Share2, Columns, Zap, Table } from 'lucide-react';

const LENSES = [
  { id: 'all', label: 'All Lenses', icon: Globe, desc: 'Balanced & anti-SEO scored' },
  { id: 'human', label: 'Human Voices', icon: MessageSquare, desc: 'Reddit, HN, indie forums' },
  { id: 'research', label: 'Deep Research', icon: BookOpen, desc: 'ArXiv, science, preprints' },
  { id: 'perspectives', label: 'Perspectives', icon: Scale, desc: 'Dialectics & opposing debates' },
  { id: 'code', label: 'Code & Dev', icon: Code2, desc: 'Repos, docs & tech discussions' },
];

const VIEW_MODES = [
  { id: 'stream', label: 'Stream Feed', icon: LayoutList },
  { id: 'flowchart', label: 'Flow Pipeline', icon: Zap },
  { id: 'table', label: 'Comparison Matrix', icon: Table },
  { id: 'graph', label: 'Knowledge Graph', icon: Share2 },
  { id: 'split', label: 'Split Debate', icon: Columns },
];

export default function LensBar({ currentLens, onSelectLens, currentView, onSelectView }) {
  return (
    <div className="controls-header">
      {/* Lens Selector */}
      <div className="lens-bar" role="tablist" aria-label="Search Lenses">
        {LENSES.map((lens) => {
          const Icon = lens.icon;
          const isActive = currentLens === lens.id;
          return (
            <button
              key={lens.id}
              role="tab"
              aria-selected={isActive}
              className={`lens-tab ${isActive ? 'active' : ''}`}
              onClick={() => onSelectLens(lens.id)}
              title={lens.desc}
            >
              <Icon size={16} />
              <span>{lens.label}</span>
            </button>
          );
        })}
      </div>

      {/* View Switcher: Stream vs Graph vs Split */}
      <div className="view-mode-toggle">
        {VIEW_MODES.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentView === mode.id;
          return (
            <button
              key={mode.id}
              className={`view-btn ${isActive ? 'active' : ''}`}
              onClick={() => onSelectView(mode.id)}
              title={`Switch to ${mode.label}`}
            >
              <Icon size={15} />
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
