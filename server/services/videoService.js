import axios from 'axios';

// Bounded LRU Cache for YouTube searches (10-minute TTL)
class VideoCache {
  constructor(maxSize = 100, ttlMs = 10 * 60 * 1000) {
    this.maxSize = maxSize;
    this.ttlMs = ttlMs;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    const entry = this.cache.get(key);
    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.cache.delete(key);
      return null;
    }
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.data;
  }

  set(key, data) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) this.cache.delete(oldestKey);
    }
    this.cache.set(key, { timestamp: Date.now(), data });
  }
}

const videoCache = new VideoCache(100, 10 * 60 * 1000);

// Curated high-fidelity fallback database for offline resilience
const FALLBACK_VIDEOS = [
  {
    id: '8euzTK3GEVU',
    title: 'Ep 4815 - Why was Jethalal shocked after hearing Baghas idea? | Taarak Mehta Ka Ooltah Chashmah',
    channel: 'Taarak Mehta Ka Ooltah Chashmah',
    channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
    views: '2.1M views',
    uploadDate: '1 day ago',
    duration: '10:50',
    category: 'TMKOC & Shows',
    tags: ['tmkoc', 'jethalal', 'comedy', 'gokuldham', 'bhide'],
    thumbnail: 'https://i.ytimg.com/vi/8euzTK3GEVU/hqdefault.jpg',
    description: 'Full high-definition comedy episode of Taarak Mehta Ka Ooltah Chashmah. Jethalal, Champaklal, Bagha and the Gokuldham society in hilarious new situations.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/8euzTK3GEVU'
  },
  {
    id: 'Wf-8mDC0rFA',
    title: 'Taarak Mehta Ka Ooltah Chashmah | New Full Episode Special | Sony SAB',
    channel: 'Sony SAB',
    channelAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
    views: '1.8M views',
    uploadDate: '2 days ago',
    duration: '21:15',
    category: 'TMKOC & Shows',
    tags: ['tmkoc', 'sony sab', 'comedy', 'tv show'],
    thumbnail: 'https://i.ytimg.com/vi/Wf-8mDC0rFA/hqdefault.jpg',
    description: 'Watch the latest full episode of India’s longest-running family comedy sitcom completely uninterrupted without pre-roll commercials.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/Wf-8mDC0rFA'
  },
  {
    id: 'G6HdN1Z2Sp4',
    title: 'Taarak Mehta Ka Ooltah Chashmah | Sundar Khaman Dhokla Episode Mega Story',
    channel: 'Sony LIV Official',
    channelAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
    views: '3.4M views',
    uploadDate: '1 week ago',
    duration: '1:00:09',
    category: 'TMKOC & Shows',
    tags: ['tmkoc', 'sundar', 'jethalal', 'dhokla'],
    thumbnail: 'https://i.ytimg.com/vi/G6HdN1Z2Sp4/hqdefault.jpg',
    description: '1-Hour Mega compilation of Jethalal and Sundar Veera hilarious encounters, scheming business ideas, and Daya bhabhi.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/G6HdN1Z2Sp4'
  },
  {
    id: '_GE6zf_hH48',
    title: 'Tom and Jerry | Classic Mega Cartoon Compilation | Warner Bros.',
    channel: 'Warner Bros. Classics',
    channelAvatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=80&auto=format&fit=crop&q=80',
    views: '14.2M views',
    uploadDate: '2 months ago',
    duration: '31:45',
    category: 'Cartoons & Anime',
    tags: ['tom and jerry', 'cartoon', 'warner bros', 'classic', 'animation'],
    thumbnail: 'https://i.ytimg.com/vi/_GE6zf_hH48/hqdefault.jpg',
    description: 'Iconic cat and mouse rivalry in remastered high definition. Classic animated chase sequences, orchestral scores, and slapstick humor.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/_GE6zf_hH48'
  },
  {
    id: 't0Q2otsqC4I',
    title: 'Tom & Jerry in Full Screen | Non-Stop Laughs & Cartoon Fun | WB Kids',
    channel: 'WB Kids',
    channelAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80',
    views: '8.9M views',
    uploadDate: '3 weeks ago',
    duration: '25:12',
    category: 'Cartoons & Anime',
    tags: ['tom and jerry', 'cartoons', 'kids', 'animation'],
    thumbnail: 'https://i.ytimg.com/vi/t0Q2otsqC4I/hqdefault.jpg',
    description: 'Relive favorite episodes of Tom & Jerry as they navigate kitchen chases, backyard battles, and unexpected truces.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/t0Q2otsqC4I'
  },
  {
    id: 'jfKfPfyJRdk',
    title: 'Lofi Cyberpunk & Deep Focus Beats to Relax / Study',
    channel: 'Lofi Girl & Synth Records',
    channelAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
    views: '18.9M views',
    uploadDate: '1 year ago',
    duration: '1:45:20',
    category: 'Music & Lofi',
    tags: ['lofi', 'music', 'chill', 'beats', 'study', 'focus'],
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=640&auto=format&fit=crop&q=80',
    description: 'Continuous uninterrupted ad-free calm analog frequencies, Rhodes chords, and ambient rain textures for deep programming and focus.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/jfKfPfyJRdk'
  },
  {
    id: 'JhHMJCUmq28',
    title: 'Quantum Computing in 10 Minutes | How It Really Works',
    channel: 'Veritasium & Science Insights',
    channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
    views: '2.4M views',
    uploadDate: '3 months ago',
    duration: '11:42',
    category: 'Technology',
    tags: ['quantum', 'physics', 'computing', 'science'],
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=640&auto=format&fit=crop&q=80',
    description: 'A deep architectural dive into quantum superposition, entanglement, and how quantum processors manipulate qubits to solve intractable computational barriers.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/JhHMJCUmq28'
  },
  {
    id: 'aircAruvnKk',
    title: 'Neural Networks from Scratch: Intuition and Mathematics',
    channel: '3Blue1Brown Insights',
    channelAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
    views: '5.1M views',
    uploadDate: '6 months ago',
    duration: '18:54',
    category: 'Technology',
    tags: ['ai', 'neural networks', 'machine learning', 'deep learning'],
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=640&auto=format&fit=crop&q=80',
    description: 'Understanding deep neural network forward pass, backpropagation gradients, and loss landscape optimization with pristine animated visualizations.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/aircAruvnKk'
  },
  {
    id: 'W6NZfCO5SIk',
    title: 'Modern JavaScript & React Architecture for 2026',
    channel: 'Fireship Tech',
    channelAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80',
    views: '1.7M views',
    uploadDate: '2 weeks ago',
    duration: '12:05',
    category: 'Coding',
    tags: ['react', 'javascript', 'web dev', 'coding', 'programming'],
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&auto=format&fit=crop&q=80',
    description: 'Exploring server components, edge streaming runtimes, reactivity primitives, and why monolithic frameworks are being redesigned.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/W6NZfCO5SIk'
  },
  {
    id: 'yPYZpwSpKmA',
    title: 'Cyberpunk 2077 Full Ray Tracing Overdrive Graphics Showcase',
    channel: 'Digital Foundry',
    channelAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&auto=format&fit=crop&q=80',
    views: '4.5M views',
    uploadDate: '8 months ago',
    duration: '16:30',
    category: 'Gaming',
    tags: ['gaming', 'graphics', 'ray tracing', 'rtx', 'cyberpunk'],
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=640&auto=format&fit=crop&q=80',
    description: 'Full path tracing benchmark comparisons, indirect bounces, bounce caustics, and DLSS 3.5 ray reconstruction analysis.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/yPYZpwSpKmA'
  }
];

/**
 * Scrapes real YouTube search results directly via ytInitialData
 */
async function scrapeYouTube(searchQuery) {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    },
    timeout: 5000
  });

  const html = response.data;
  const match = html.match(/ytInitialData\s*=\s*({.+?});<\/script>/s);
  if (!match) return [];

  const ytData = JSON.parse(match[1]);
  const sectionList = ytData.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];
  
  const parsedVideos = [];

  for (const section of sectionList) {
    const items = section.itemSectionRenderer?.contents || [];
    for (const item of items) {
      const v = item.videoRenderer;
      if (!v || !v.videoId) continue;

      const videoId = v.videoId;
      const title = v.title?.runs?.map((r) => r.text).join('') || v.title?.simpleText || 'PRISM Video';
      const channel = v.ownerText?.runs?.[0]?.text || v.shortBylineText?.runs?.[0]?.text || 'Verified Creator';
      const views = v.viewCountText?.simpleText || v.shortViewCountText?.simpleText || '1.2M views';
      const uploadDate = v.publishedTimeText?.simpleText || 'Recently';
      const duration = v.lengthText?.simpleText || '14:20';
      const thumbnail = v.thumbnail?.thumbnails?.slice(-1)[0]?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
      const description = v.detailedMetadataSnippets?.[0]?.snippetText?.runs?.map((r) => r.text).join('') ||
                          v.descriptionSnippet?.runs?.map((r) => r.text).join('') ||
                          `Watch ${title} on PRISM Tube with 100% ad-free private streaming.`;

      // Deterministic colorful avatar based on channel name
      const channelAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(channel)}&backgroundColor=0284c7,2563eb,7c3aed,db2777`;

      parsedVideos.push({
        id: videoId,
        title,
        channel,
        channelAvatar,
        views,
        uploadDate,
        duration,
        category: inferCategory(title, searchQuery),
        tags: [channel.toLowerCase(), ...title.toLowerCase().split(/\s+/).slice(0, 4)],
        thumbnail,
        description,
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`
      });

      if (parsedVideos.length >= 24) break;
    }
    if (parsedVideos.length >= 24) break;
  }

  return parsedVideos;
}

function inferCategory(title = '', query = '') {
  const t = `${title} ${query}`.toLowerCase();
  if (t.includes('taarak') || t.includes('tmkoc') || t.includes('jetha') || t.includes('episode') || t.includes('serial')) return 'TMKOC & Shows';
  if (t.includes('cartoon') || t.includes('tom and jerry') || t.includes('shinchan') || t.includes('doraemon') || t.includes('anime')) return 'Cartoons & Anime';
  if (t.includes('lofi') || t.includes('song') || t.includes('music') || t.includes('beats')) return 'Music & Lofi';
  if (t.includes('game') || t.includes('playthrough') || t.includes('rtx') || t.includes('cyberpunk')) return 'Gaming';
  if (t.includes('code') || t.includes('react') || t.includes('javascript') || t.includes('python')) return 'Coding';
  return 'Technology';
}

/**
 * Searches videos by query and category, executing live YouTube queries with caching
 */
export async function searchVideos(query = '', category = 'All') {
  const cleanQ = (query || '').trim();
  const cleanCat = (category || 'All').trim();

  // 1. Determine effective search query for YouTube
  let effectiveQuery = cleanQ;
  if (!effectiveQuery) {
    if (cleanCat === 'TMKOC & Shows') {
      effectiveQuery = 'taarak mehta ka ooltah chashmah latest full episode sony sab';
    } else if (cleanCat === 'Cartoons & Anime') {
      effectiveQuery = 'tom and jerry hindi cartoon full compilation shinchan doraemon';
    } else if (cleanCat === 'Music & Lofi') {
      effectiveQuery = 'lofi hip hop radio beats to relax study';
    } else if (cleanCat === 'Coding') {
      effectiveQuery = 'react javascript coding full tutorial 2026';
    } else if (cleanCat === 'Gaming') {
      effectiveQuery = 'top gaming trailers 4k 60fps walkthrough';
    } else if (cleanCat === 'Technology') {
      effectiveQuery = 'cutting edge technology documentary veritasium';
    } else {
      effectiveQuery = 'trending youtube videos';
    }
  } else {
    // If category is specific and user typed a generic query
    if (cleanCat === 'TMKOC & Shows' && !cleanQ.toLowerCase().includes('tmkoc') && !cleanQ.toLowerCase().includes('taarak')) {
      effectiveQuery = `tmkoc ${cleanQ}`;
    } else if (cleanCat === 'Cartoons & Anime' && !cleanQ.toLowerCase().includes('cartoon')) {
      effectiveQuery = `cartoon ${cleanQ}`;
    }
  }

  const cacheKey = `${cleanCat.toLowerCase()}::${effectiveQuery.toLowerCase()}`;
  const cached = videoCache.get(cacheKey);
  if (cached) {
    return {
      query: cleanQ,
      category: cleanCat,
      totalCount: cached.length,
      videos: cached,
      source: 'cache'
    };
  }

  // 2. Scrape live YouTube results
  try {
    const liveVideos = await scrapeYouTube(effectiveQuery);
    if (liveVideos && liveVideos.length > 0) {
      videoCache.set(cacheKey, liveVideos);
      return {
        query: cleanQ,
        category: cleanCat,
        totalCount: liveVideos.length,
        videos: liveVideos,
        source: 'youtube-live'
      };
    }
  } catch (err) {
    console.warn('Live YouTube scraper notice, using curated fallback:', err.message);
  }

  // 3. Resilient Fallback Matching
  let filtered = [...FALLBACK_VIDEOS];
  if (cleanCat && cleanCat !== 'All') {
    filtered = filtered.filter((v) => v.category.toLowerCase() === cleanCat.toLowerCase());
  }

  if (cleanQ) {
    const qTokens = cleanQ.toLowerCase().split(/\s+/);
    const matched = filtered.filter((v) => {
      const text = `${v.title} ${v.channel} ${v.tags.join(' ')} ${v.description}`.toLowerCase();
      return qTokens.some((t) => text.includes(t));
    });
    if (matched.length > 0) filtered = matched;
  }

  return {
    query: cleanQ,
    category: cleanCat,
    totalCount: filtered.length,
    videos: filtered,
    source: 'fallback'
  };
}
