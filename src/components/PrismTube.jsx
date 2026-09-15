import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Play,
  Search,
  Flame,
  Clock,
  ThumbsUp,
  Share2,
  Bookmark,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Volume2,
  Maximize2,
  CheckCircle2,
  ListVideo,
  Tv,
  Film,
  Music,
  Code,
  Gamepad2,
  Compass,
  Radio
} from 'lucide-react';

const CATEGORIES = [
  { id: 'All', label: 'All Content', icon: Compass },
  { id: 'TMKOC & Shows', label: 'TMKOC & Shows', icon: Tv },
  { id: 'Cartoons & Anime', label: 'Cartoons & Anime', icon: Film },
  { id: 'Music & Lofi', label: 'Music & Lofi', icon: Music },
  { id: 'Technology', label: 'Technology', icon: Sparkles },
  { id: 'Coding', label: 'Coding', icon: Code },
  { id: 'Gaming', label: 'Gaming', icon: Gamepad2 }
];

const POPULAR_QUICK_TAGS = [
  'TMKOC Latest Episode',
  'Tom and Jerry',
  'Shinchan in Hindi',
  'Doraemon Full',
  'Lofi Study Beats',
  'MrBeast',
  'React Architecture 2026',
  'Cyberpunk 4K'
];

export default function PrismTube({ initialQuery = '', onOpenSearch }) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState('All');
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sourceTag, setSourceTag] = useState('youtube-live');
  const [likedVideos, setLikedVideos] = useState(() => new Set());
  const [savedVideos, setSavedVideos] = useState(() => {
    try {
      const s = localStorage.getItem('prism_tube_saved');
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    fetchVideos(initialQuery, activeCategory);
  }, [initialQuery, activeCategory]);

  const fetchVideos = async (q, cat) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/videos?q=${encodeURIComponent(q || '')}&category=${encodeURIComponent(cat || 'All')}`);
      if (res.data?.videos) {
        setVideos(res.data.videos);
        setSourceTag(res.data.source || 'youtube-live');
        // If initial query was given or single video, auto open if not set
        if (q && res.data.videos.length > 0 && !activeVideo) {
          setActiveVideo(res.data.videos[0]);
        }
      }
    } catch (err) {
      console.error('Video fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchVideos(searchQuery, activeCategory);
  };

  const handleLikeToggle = (videoId) => {
    setLikedVideos((prev) => {
      const next = new Set(prev);
      if (next.has(videoId)) next.delete(videoId);
      else next.add(videoId);
      return next;
    });
  };

  const handleSaveToggle = (video) => {
    const exists = savedVideos.some((v) => v.id === video.id);
    let next;
    if (exists) {
      next = savedVideos.filter((v) => v.id !== video.id);
    } else {
      next = [...savedVideos, video];
    }
    setSavedVideos(next);
    try {
      localStorage.setItem('prism_tube_saved', JSON.stringify(next));
    } catch {}
  };

  return (
    <div className="prism-tube-container">
      {/* 1. PRISM Tube Top Header Bar */}
      <div className="tube-header-bar">
        <div className="tube-brand" onClick={() => { setActiveVideo(null); setSearchQuery(''); setActiveCategory('All'); fetchVideos('', 'All'); }}>
          <div className="tube-logo-icon">
            <Play size={18} fill="#ef4444" color="#ef4444" />
          </div>
          <span className="tube-title">PRISM <span className="tube-title-sub">Tube</span></span>
          <span className="tube-adfree-pill">
            <ShieldCheck size={12} />
            <span>100% Ad-Free • Zero Video Ads</span>
          </span>
        </div>

        {/* Central Video Search */}
        <form onSubmit={handleSearchSubmit} className="tube-search-box">
          <input
            type="text"
            className="tube-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search YouTube videos, TMKOC episodes, cartoons, music..."
            id="prism-tube-search-input"
          />
          <button type="submit" className="btn-tube-search" title="Search Videos">
            <Search size={16} />
          </button>
        </form>

        {/* Right Status */}
        <div className="tube-header-right">
          <div className="tube-privacy-tag">
            <Radio size={13} color="#22c55e" />
            <span>Live Stream Mode</span>
          </div>
        </div>
      </div>

      {/* 2. Category Filter Ribbon */}
      <div className="tube-categories-row">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              className={`tube-cat-pill ${isActive ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory(cat.id);
                fetchVideos(searchQuery, cat.id);
              }}
            >
              <Icon size={14} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2.1 Quick Tags Ribbon (TMKOC, Cartoons, etc.) */}
      <div className="tube-quick-tags-row">
        <span className="quick-tag-label">Popular:</span>
        {POPULAR_QUICK_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            className="tube-quick-tag-btn"
            onClick={() => {
              setSearchQuery(tag);
              fetchVideos(tag, activeCategory);
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* 3. Loading Indicator */}
      {isLoading && (
        <div className="tube-loading-indicator">
          <div className="tube-loading-spinner" />
          <span>Searching live video streams...</span>
        </div>
      )}

      {/* 4. Main Stage: Theater Video Player OR Video Grid */}
      {activeVideo ? (
        /* THEATER PLAYER VIEW */
        <div className="tube-theater-layout">
          <div className="theater-main-column">
            {/* Back Button */}
            <button
              type="button"
              className="btn-back-to-browse"
              onClick={() => setActiveVideo(null)}
            >
              <ArrowLeft size={16} />
              <span>Back to Feed</span>
            </button>

            {/* Ad-Free Embed Player Frame */}
            <div className="tube-video-viewport">
              <iframe
                key={activeVideo.id}
                className="tube-iframe"
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video Metadata & Actions */}
            <div className="theater-video-details">
              <h1 className="theater-video-title">{activeVideo.title}</h1>

              <div className="theater-author-row">
                <div className="channel-info">
                  <img src={activeVideo.channelAvatar} alt={activeVideo.channel} className="channel-avatar" />
                  <div>
                    <div className="channel-name-wrap">
                      <span className="channel-name">{activeVideo.channel}</span>
                      <CheckCircle2 size={13} color="#38bdf8" />
                    </div>
                    <span className="channel-subscribers">Official Channel • High Definition</span>
                  </div>
                </div>

                {/* Interaction Buttons */}
                <div className="theater-actions-bar">
                  <button
                    type="button"
                    className={`btn-theater-action ${likedVideos.has(activeVideo.id) ? 'active' : ''}`}
                    onClick={() => handleLikeToggle(activeVideo.id)}
                  >
                    <ThumbsUp size={15} fill={likedVideos.has(activeVideo.id) ? '#38bdf8' : 'none'} />
                    <span>{likedVideos.has(activeVideo.id) ? 'Liked' : 'Like'}</span>
                  </button>

                  <button
                    type="button"
                    className={`btn-theater-action ${savedVideos.some((v) => v.id === activeVideo.id) ? 'active' : ''}`}
                    onClick={() => handleSaveToggle(activeVideo)}
                  >
                    <Bookmark size={15} fill={savedVideos.some((v) => v.id === activeVideo.id) ? '#06b6d4' : 'none'} />
                    <span>{savedVideos.some((v) => v.id === activeVideo.id) ? 'Saved' : 'Save'}</span>
                  </button>

                  <button
                    type="button"
                    className="btn-theater-action"
                    onClick={() => {
                      navigator.clipboard?.writeText(`https://www.youtube.com/watch?v=${activeVideo.id}`);
                      alert('Ad-free video link copied to clipboard!');
                    }}
                  >
                    <Share2 size={15} />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Description Box */}
              <div className="theater-description-box">
                <div className="desc-stats">
                  <span>{activeVideo.views}</span>
                  <span>•</span>
                  <span>{activeVideo.uploadDate}</span>
                  <span>•</span>
                  <span className="desc-cat-badge">{activeVideo.category}</span>
                </div>
                <p className="desc-text">{activeVideo.description}</p>
              </div>
            </div>
          </div>

          {/* Related / Up Next Sidebar */}
          <div className="theater-sidebar-column">
            <div className="sidebar-queue-header">
              <ListVideo size={16} color="#38bdf8" />
              <span>Up Next (Ad-Free Queue)</span>
            </div>

            <div className="related-videos-list">
              {videos.filter((v) => v.id !== activeVideo.id).map((video) => (
                <div
                  key={video.id}
                  className="related-video-card"
                  onClick={() => {
                    setActiveVideo(video);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <div className="related-thumb-wrap">
                    <img src={video.thumbnail} alt={video.title} className="related-thumb" />
                    <span className="video-duration">{video.duration}</span>
                  </div>
                  <div className="related-meta">
                    <div className="related-title" title={video.title}>{video.title}</div>
                    <div className="related-channel">{video.channel}</div>
                    <div className="related-views">{video.views} • {video.uploadDate}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* BROWSE GRID VIEW */
        <div className="tube-browse-grid">
          {videos.map((video) => (
            <div
              key={video.id}
              className="tube-video-card"
              onClick={() => setActiveVideo(video)}
            >
              {/* Thumbnail Container */}
              <div className="video-thumb-container">
                <img src={video.thumbnail} alt={video.title} className="video-thumb-img" loading="lazy" />
                <span className="video-duration">{video.duration}</span>
                <div className="video-play-overlay">
                  <div className="play-button-circle">
                    <Play size={20} fill="#ffffff" color="#ffffff" style={{ marginLeft: '2px' }} />
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="video-card-body">
                <img src={video.channelAvatar} alt={video.channel} className="video-channel-avatar" />
                <div className="video-card-info">
                  <h3 className="video-card-title" title={video.title}>{video.title}</h3>
                  <div className="video-card-channel">
                    <span>{video.channel}</span>
                    <CheckCircle2 size={12} color="#38bdf8" />
                  </div>
                  <div className="video-card-stats">
                    <span>{video.views}</span>
                    <span>•</span>
                    <span>{video.uploadDate}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
