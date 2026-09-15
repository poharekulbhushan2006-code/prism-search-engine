import React from 'react';
import SearchBar from './SearchBar';
import { ShieldCheck, MessageSquare, Share2, Scale, Zap, Sparkles } from 'lucide-react';

const SUGGESTED_CHIPS = [
  { label: 'RISC-V vs ARM architectures', lens: 'perspectives' },
  { label: 'SQLite in high-scale production', lens: 'code' },
  { label: 'James Webb Space Telescope findings', lens: 'research' },
  { label: 'Best espresso machine under $500', lens: 'human' },
  { label: 'Quantum Machine Learning algorithms', lens: 'research' },
  { label: 'React vs Svelte performance', lens: 'perspectives' },
];

export default function HeroState({ onSearch }) {
  return (
    <div className="hero-container">
      {/* Prismatic Top Pill */}
      <div className="hero-pill">
        <Sparkles size={14} />
        <span>The Anti-SEO, Multi-Lens Knowledge Engine</span>
      </div>

      {/* Main Headline */}
      <h1 className="hero-title">
        Search beyond the noise.<br />
        <span className="gradient-text">Unfiltered human wisdom.</span>
      </h1>

      <p className="hero-subtitle">
        Google and Yahoo drown you in sponsored ads, SEO content farms, and 10 blue links.
        PRISM cuts through the noise with real human discussions, interactive knowledge graphs, and zero affiliate spam.
      </p>

      {/* Hero Search Bar */}
      <div className="hero-search-wrapper">
        <SearchBar onSearch={(q) => onSearch(q, 'all')} />
      </div>

      {/* Trending / Click-to-Explore Prompts */}
      <div className="trending-section">
        <div className="trending-heading">
          <Zap size={14} color="#f59e0b" />
          <span>Curious minds are searching:</span>
        </div>
        <div className="trending-chips">
          {SUGGESTED_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              className="chip"
              onClick={() => onSearch(chip.label, chip.lens)}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Why PRISM Beats Google & Yahoo */}
      <div className="comparison-grid">
        <div className="feature-card">
          <div className="feature-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <ShieldCheck size={24} />
          </div>
          <h3 className="feature-title">Zero Ads & Anti-SEO</h3>
          <p className="feature-desc">
            Algorithmic scoring that eliminates affiliate spam, fake reviews, and SEO keyword farms. Only authentic signal remains.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <MessageSquare size={24} />
          </div>
          <h3 className="feature-title">"Human Voices" Lens</h3>
          <p className="feature-desc">
            Instantly filter for lived human experiences from Reddit, Hacker News, niche forums, and personal developer blogs.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <Share2 size={24} />
          </div>
          <h3 className="feature-title">Interactive Graph Explorer</h3>
          <p className="feature-desc">
            Don't just read links. Explore topics as interactive node networks, discover unexpected connections, and dive into rabbit holes.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrapper" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8' }}>
            <Scale size={24} />
          </div>
          <h3 className="feature-title">Perspective Split-View</h3>
          <p className="feature-desc">
            For debates and comparisons, PRISM clusters evidence side-by-side: strengths, tradeoffs, and documented counter-arguments.
          </p>
        </div>
      </div>
    </div>
  );
}
