import React, { useState, useEffect, useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ExternalLink,
  Search,
  Bookmark,
  X,
  Layers,
  Sparkles,
  ShieldCheck,
  Compass
} from 'lucide-react';

export default function KnowledgeGraphView({
  graphData,
  onSelectNode,
  onSearchQuery,
  onOpenInTab,
  onPinItem,
  pinnedUrls = new Set()
}) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Initialize node layout with circular/orbital positioning
  useEffect(() => {
    if (!graphData || !graphData.nodes || graphData.nodes.length === 0) return;

    const width = 800;
    const height = 550;
    const centerX = width / 2;
    const centerY = height / 2;

    const rootNode = graphData.nodes.find(n => n.type === 'root') || graphData.nodes[0];
    const categoryNodes = graphData.nodes.filter(n => n.type === 'category' || n.type === 'entity');
    const otherNodes = graphData.nodes.filter(n => n !== rootNode && !categoryNodes.includes(n));

    const computedNodes = [];

    // Place root at center
    computedNodes.push({
      ...rootNode,
      x: centerX,
      y: centerY,
      vx: 0,
      vy: 0
    });

    // Place category/entity nodes in inner orbit (radius ~155)
    const innerRadius = 155;
    categoryNodes.forEach((node, i) => {
      const angle = (i / (categoryNodes.length || 1)) * 2 * Math.PI - Math.PI / 2;
      computedNodes.push({
        ...node,
        x: centerX + Math.cos(angle) * innerRadius,
        y: centerY + Math.sin(angle) * innerRadius,
        vx: 0,
        vy: 0
      });
    });

    // Place outer concept & leaf nodes in outer orbit (radius ~265)
    const outerRadius = 265;
    otherNodes.forEach((node, i) => {
      const angle = (i / (otherNodes.length || 1)) * 2 * Math.PI;
      const r = outerRadius + ((i % 3) - 1) * 25;
      computedNodes.push({
        ...node,
        x: centerX + Math.cos(angle) * r,
        y: centerY + Math.sin(angle) * r,
        vx: 0,
        vy: 0
      });
    });

    setNodes(computedNodes);
    setEdges(graphData.edges || []);
    setPan({ x: 0, y: 0 });
    setZoom(1);
    setSelectedNode(null);
  }, [graphData]);

  // Mouse drag node handlers
  const handleMouseDownNode = (e, nodeId) => {
    e.stopPropagation();
    setDraggingNodeId(nodeId);
  };

  const handleMouseMove = (e) => {
    if (draggingNodeId) {
      const rect = containerRef.current.getBoundingClientRect();
      const rawMouseX = (e.clientX - rect.left - pan.x) / zoom;
      const rawMouseY = (e.clientY - rect.top - pan.y) / zoom;
      const clampedX = Math.max(35, Math.min(765, rawMouseX));
      const clampedY = Math.max(35, Math.min(515, rawMouseY));

      setNodes(prev => prev.map(n => {
        if (n.id === draggingNodeId) {
          return { ...n, x: clampedX, y: clampedY };
        }
        return n;
      }));
    } else if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y
      });
    }
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
    setIsPanning(false);
  };

  const handleStartPan = (e) => {
    setIsPanning(true);
    setStartPan({
      x: e.clientX - pan.x,
      y: e.clientY - pan.y
    });
  };

  const handleNodeClick = (node, e) => {
    if (e) e.stopPropagation();
    setSelectedNode(node);
    if (onSelectNode) onSelectNode(node);
  };

  const handleNodeDoubleClick = (node, e) => {
    if (e) e.stopPropagation();
    if (node.url && onOpenInTab) {
      onOpenInTab(node.url, node.fullTitle || node.label);
    } else if (node.type === 'concept' || node.type === 'category') {
      if (onSearchQuery) onSearchQuery(node.label);
    }
  };

  const handlePinSelectedNode = () => {
    if (!selectedNode || !onPinItem) return;
    onPinItem({
      title: selectedNode.fullTitle || selectedNode.label,
      link: selectedNode.url || `#concept-${selectedNode.label}`,
      cleanSnippet: selectedNode.snippet || selectedNode.description || `Concept from knowledge graph: ${selectedNode.label}`,
      hostname: selectedNode.url ? new URL(selectedNode.url).hostname.replace(/^www\./, '') : 'Knowledge Graph',
      trustScore: selectedNode.trustScore || 90,
      trustBadge: selectedNode.trustScore ? 'Source Node' : 'Concept Node'
    });
  };

  // Build node lookup map for edges
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  // Filtering check
  const isNodeVisible = (node) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'concepts') return node.type === 'concept' || node.type === 'entity' || node.type === 'root';
    if (activeFilter === 'categories') return node.type === 'category';
    if (activeFilter === 'sources') return node.type === 'source';
    return true;
  };

  return (
    <div
      className="graph-container"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseDown={handleStartPan}
    >
      {/* Zoom / Reset Controls & Category Filter Bar */}
      <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: '0.4rem', zIndex: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          className="btn-card-action"
          onClick={() => setZoom(z => Math.min(2.2, z + 0.15))}
          title="Zoom In"
        >
          <ZoomIn size={15} />
        </button>
        <button
          type="button"
          className="btn-card-action"
          onClick={() => setZoom(z => Math.max(0.45, z - 0.15))}
          title="Zoom Out"
        >
          <ZoomOut size={15} />
        </button>
        <button
          type="button"
          className="btn-card-action"
          onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); setSelectedNode(null); }}
          title="Reset View"
        >
          <RotateCcw size={15} />
        </button>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.3rem', marginLeft: '0.5rem' }}>
          {[
            { id: 'all', label: 'All Nodes' },
            { id: 'concepts', label: 'Concepts' },
            { id: 'categories', label: 'Clusters' },
            { id: 'sources', label: 'Sources' }
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={(e) => { e.stopPropagation(); setActiveFilter(f.id); }}
              style={{
                fontSize: '0.72rem',
                padding: '0.25rem 0.6rem',
                borderRadius: 20,
                border: activeFilter === f.id ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
                background: activeFilter === f.id ? 'rgba(99,102,241,0.25)' : 'rgba(0,0,0,0.3)',
                color: activeFilter === f.id ? '#a5b4fc' : '#94a3b8',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="graph-legend">
        <div style={{ fontWeight: 600, color: '#f8fafc', marginBottom: 2 }}>Knowledge Network</div>
        <div className="legend-item"><div className="legend-dot" style={{ background: '#6366f1' }} /> Central Query</div>
        <div className="legend-item"><div className="legend-dot" style={{ background: '#06b6d4' }} /> Entity / Cluster</div>
        <div className="legend-item"><div className="legend-dot" style={{ background: '#ec4899' }} /> Concept Node</div>
        <div className="legend-item"><div className="legend-dot" style={{ background: '#10b981' }} /> Verified Source</div>
      </div>

      {/* SVG Canvas */}
      <svg
        className="graph-svg"
        viewBox="0 0 800 550"
      >
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Edges */}
          {edges.map((edge, idx) => {
            const source = nodeMap.get(edge.source);
            const target = nodeMap.get(edge.target);
            if (!source || !target) return null;

            const isEdgeVisible = isNodeVisible(source) && isNodeVisible(target);
            const isHighlighted = selectedNode && (selectedNode.id === source.id || selectedNode.id === target.id);

            return (
              <line
                key={idx}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                className="graph-edge"
                style={{
                  opacity: isEdgeVisible ? (isHighlighted ? 0.85 : 0.25) : 0.05,
                  stroke: isHighlighted ? '#818cf8' : (edge.relationship === 'semantic_reference' ? '#ec4899' : '#475569'),
                  strokeWidth: isHighlighted ? 2 : 1,
                  strokeDasharray: edge.relationship === 'semantic_reference' ? '3,3' : 'none'
                }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isHovered = hoveredNode?.id === node.id;
            const isSelected = selectedNode?.id === node.id;
            const visible = isNodeVisible(node);
            const radius = node.size || 20;

            return (
              <g
                key={node.id}
                className="graph-node"
                transform={`translate(${node.x}, ${node.y})`}
                style={{ opacity: visible ? 1 : 0.2, transition: 'opacity 0.2s' }}
                onMouseDown={(e) => handleMouseDownNode(e, node.id)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={(e) => handleNodeClick(node, e)}
                onDoubleClick={(e) => handleNodeDoubleClick(node, e)}
              >
                {/* Glow ring for root, selected, or hovered node */}
                {(node.type === 'root' || isSelected || isHovered) && (
                  <circle
                    r={radius + 8}
                    fill="none"
                    stroke={node.color || '#6366f1'}
                    strokeWidth={isSelected ? 3 : 2}
                    opacity={isSelected ? 0.9 : 0.5}
                    className="pulse-ring"
                  />
                )}

                {/* Main Node Body */}
                <circle
                  r={radius}
                  fill={node.color || '#6366f1'}
                  stroke={isSelected ? '#ffffff' : '#0f172a'}
                  strokeWidth={isSelected ? 3 : 2}
                  style={{ cursor: 'pointer' }}
                />

                {/* Node Label */}
                <text
                  dy={radius + 15}
                  className="graph-node-text"
                  fill={isSelected ? '#38bdf8' : '#f1f5f9'}
                  fontWeight={isSelected ? 700 : 500}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Interactive Node Inspector Panel (Docked Overlay) */}
      {selectedNode && (
        <div
          className="graph-inspector-panel"
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            width: 320,
            background: 'rgba(15, 23, 42, 0.94)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(99, 102, 241, 0.35)',
            borderRadius: 14,
            padding: '1rem',
            boxShadow: '0 16px 40px rgba(0,0,0,0.7), 0 0 20px rgba(99, 102, 241, 0.15)',
            zIndex: 30,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: selectedNode.color || '#6366f1' }} />
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: selectedNode.color, fontWeight: 700, letterSpacing: '0.05em' }}>
                {selectedNode.type}
              </span>
              {selectedNode.trustScore && (
                <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600, background: 'rgba(16, 185, 129, 0.1)', padding: '1px 6px', borderRadius: 999 }}>
                  {selectedNode.trustScore}% Trust
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSelectedNode(null)}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 2 }}
              title="Close inspector"
            >
              <X size={14} />
            </button>
          </div>

          <h4 style={{ fontSize: '0.96rem', color: '#f8fafc', fontWeight: 600, lineHeight: 1.3 }}>
            {selectedNode.fullTitle || selectedNode.label}
          </h4>

          {selectedNode.description && (
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
              {selectedNode.description}
            </p>
          )}

          {selectedNode.snippet && (
            <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4 }}>
              {selectedNode.snippet}
            </p>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: 4, flexWrap: 'wrap' }}>
            {selectedNode.url && onOpenInTab && (
              <button
                type="button"
                className="btn-open-tab"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => onOpenInTab(selectedNode.url, selectedNode.fullTitle || selectedNode.label)}
              >
                <span>Open in Tab</span>
              </button>
            )}

            {selectedNode.url && (
              <a
                href={selectedNode.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-card-action"
                title="Open in new window"
              >
                <ExternalLink size={13} />
              </a>
            )}

            {onPinItem && (
              <button
                type="button"
                className={`btn-card-action ${pinnedUrls.has(selectedNode.url) ? 'pinned' : ''}`}
                onClick={handlePinSelectedNode}
                title="Pin to Workbench"
              >
                <Bookmark size={13} fill={pinnedUrls.has(selectedNode.url) ? '#6366f1' : 'none'} />
                <span>{pinnedUrls.has(selectedNode.url) ? 'Pinned' : 'Pin'}</span>
              </button>
            )}

            {(selectedNode.type === 'concept' || selectedNode.type === 'category' || selectedNode.type === 'root') && onSearchQuery && (
              <button
                type="button"
                className="btn-card-action"
                style={{ flex: 1, justifyContent: 'center', color: '#06b6d4' }}
                onClick={() => onSearchQuery(selectedNode.label)}
              >
                <Search size={13} />
                <span>Explore Concept</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Hover Tooltip when not selected */}
      {hoveredNode && !selectedNode && (
        <div className="graph-tooltip">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: hoveredNode.color, fontWeight: 700 }}>
              {hoveredNode.type}
            </span>
            {hoveredNode.trustScore && (
              <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                {hoveredNode.trustScore}% Trust
              </span>
            )}
          </div>

          <h4 style={{ fontSize: '0.95rem', color: '#f8fafc', marginBottom: 6 }}>
            {hoveredNode.fullTitle || hoveredNode.label}
          </h4>

          {hoveredNode.description && (
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>
              {hoveredNode.description}
            </p>
          )}

          {hoveredNode.snippet && (
            <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.4 }}>
              {hoveredNode.snippet.slice(0, 140)}...
            </p>
          )}

          <div style={{ marginTop: 10, display: 'flex', gap: 6, fontSize: '0.75rem' }}>
            <span style={{ color: '#818cf8', display: 'flex', alignItems: 'center', gap: 3 }}>
              Click node to inspect & pin
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
