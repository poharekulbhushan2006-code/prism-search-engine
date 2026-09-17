import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Activity, 
  Zap, 
  Info,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export default function AnimatedFlowchart({ flowchart, query }) {
  if (!flowchart || !flowchart.stages || flowchart.stages.length === 0) {
    return null;
  }

  const { title, subtitle, stages = [] } = flowchart;
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-advance stages when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStageIndex(prev => (prev + 1) % stages.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isPlaying, stages.length]);

  const activeStage = stages[activeStageIndex] || stages[0];

  return (
    <div className="prism-flowchart-card">
      {/* 1. Header Bar */}
      <div className="flowchart-topbar">
        <div className="flowchart-header-info">
          <div className="flowchart-icon-box">
            <Zap size={22} className="spinning" />
          </div>
          <div>
            <div className="flowchart-badge-row">
              <span className="flowchart-badge">DYNAMIC FLOW PIPELINE</span>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                {stages.length} Connected Stages
              </span>
            </div>
            <h3 className="flowchart-title">{title}</h3>
          </div>
        </div>

        {/* Play / Step Controls */}
        <div className="flowchart-controls-row">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flowchart-ctrl-btn"
            title={isPlaying ? 'Pause Auto-Progression' : 'Auto-Play Pipeline Flow'}
          >
            {isPlaying ? (
              <>
                <Pause size={13} color="#f59e0b" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play size={13} color="#10b981" />
                <span>Play Flow</span>
              </>
            )}
          </button>
          <button
            onClick={() => {
              setActiveStageIndex(0);
              setIsPlaying(true);
            }}
            className="flowchart-ctrl-btn"
            style={{ padding: '0.4rem 0.5rem' }}
            title="Reset Pipeline"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {subtitle && (
        <div className="flowchart-subtitle-bar">
          <Info size={14} color="#06b6d4" style={{ flexShrink: 0 }} />
          <span>{subtitle}</span>
        </div>
      )}

      {/* 2. SVG Flow Line & Stage Buttons */}
      <div className="flowchart-body">
        {/* Stages Selector Grid */}
        <div className="flowchart-stages-grid">
          {stages.map((stg, idx) => {
            const isActive = idx === activeStageIndex;
            const isPast = idx < activeStageIndex;
            return (
              <button
                key={stg.id || idx}
                onClick={() => {
                  setActiveStageIndex(idx);
                  setIsPlaying(false);
                }}
                className={`flowchart-stage-btn ${isActive ? 'active' : ''}`}
              >
                <div className="stage-num-badge">
                  {isPast ? <CheckCircle size={15} color="#10b981" /> : idx + 1}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8' }}>
                    {stg.stage || `Stage ${idx + 1}`}
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '600', color: isActive ? '#fff' : '#e2e8f0', overflowWrap: 'break-word', wordBreak: 'break-word', lineHeight: 1.35 }}>
                    {stg.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* 3. Deep-Dive Stage Detail Box */}
        <div className="flowchart-deepdive-box">
          <div className="flowchart-deepdive-main">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span className="flowchart-phase-chip">
                <Activity size={13} className="spinning" />
                Phase {activeStage.step || activeStageIndex + 1} of {stages.length}: {activeStage.stage}
              </span>
              {activeStage.status && (
                <span style={{ fontSize: '0.74rem', fontWeight: '600', color: '#34d399', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.2rem 0.55rem', borderRadius: '6px' }}>
                  ● {activeStage.status}
                </span>
              )}
            </div>

            <h4 className="flowchart-stage-h">{activeStage.title}</h4>
            <p className="flowchart-stage-desc">{activeStage.description}</p>

            {activeStage.technicalDetail && (
              <div className="flowchart-tech-note">
                <strong style={{ color: '#818cf8' }}>Mechanics & Architecture: </strong>
                {activeStage.technicalDetail}
              </div>
            )}
          </div>

          {/* Right Metrics & Navigation Box */}
          <div className="flowchart-side-panel">
            {activeStage.metricLabel && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.3rem' }}>
                  <span style={{ color: '#94a3b8' }}>{activeStage.metricLabel}</span>
                  <span style={{ color: '#22d3ee', fontWeight: '700' }}>{activeStage.metricValue}%</span>
                </div>
                <div className="metric-bar-wrapper">
                  <div
                    className="metric-bar-fill"
                    style={{ width: `${Math.min(100, Math.max(10, activeStage.metricValue || 85))}%` }}
                  />
                </div>
              </div>
            )}

            {activeStage.nextTransition && (
              <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                <span style={{ display: 'block', fontSize: '0.68rem', textTransform: 'uppercase', color: '#64748b', fontWeight: '700', marginBottom: '0.2rem' }}>
                  Pipeline Transition
                </span>
                <span style={{ color: '#67e8f9', fontWeight: '600' }}>{activeStage.nextTransition}</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                disabled={activeStageIndex === 0}
                onClick={() => {
                  setActiveStageIndex(prev => Math.max(0, prev - 1));
                  setIsPlaying(false);
                }}
                className="flowchart-ctrl-btn"
                style={{ flex: 1, justifyContent: 'center', opacity: activeStageIndex === 0 ? 0.35 : 1 }}
              >
                ← Back
              </button>
              <button
                disabled={activeStageIndex === stages.length - 1}
                onClick={() => {
                  setActiveStageIndex(prev => Math.min(stages.length - 1, prev + 1));
                  setIsPlaying(false);
                }}
                className="flowchart-ctrl-btn"
                style={{ flex: 1, justifyContent: 'center', background: 'linear-gradient(90deg, #0891b2, #4f46e5)', color: '#fff', opacity: activeStageIndex === stages.length - 1 ? 0.35 : 1 }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
