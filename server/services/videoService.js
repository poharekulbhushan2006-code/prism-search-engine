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
  // ─── TMKOC & Shows ────────────────────────────────────────────
  {
    id: '8euzTK3GEVU',
    title: 'Ep 4815 - Why was Jethalal shocked after hearing Bagha\'s idea? | Taarak Mehta',
    channel: 'Taarak Mehta Ka Ooltah Chashmah',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TMKOC&backgroundColor=ef4444',
    views: '2.1M views', uploadDate: '1 day ago', duration: '10:50',
    category: 'TMKOC & Shows',
    tags: ['tmkoc', 'jethalal', 'comedy', 'gokuldham', 'bhide'],
    thumbnail: 'https://i.ytimg.com/vi/8euzTK3GEVU/hqdefault.jpg',
    description: 'Full HD comedy episode. Jethalal, Champaklal, Bagha and the Gokuldham society in hilarious new situations.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/8euzTK3GEVU'
  },
  {
    id: 'Wf-8mDC0rFA',
    title: 'Taarak Mehta Ka Ooltah Chashmah | New Full Episode | Sony SAB',
    channel: 'Sony SAB',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SonySAB&backgroundColor=e11d48',
    views: '1.8M views', uploadDate: '2 days ago', duration: '21:15',
    category: 'TMKOC & Shows',
    tags: ['tmkoc', 'sony sab', 'comedy', 'tv show'],
    thumbnail: 'https://i.ytimg.com/vi/Wf-8mDC0rFA/hqdefault.jpg',
    description: 'Watch the latest full episode of India\'s longest-running family comedy sitcom uninterrupted.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/Wf-8mDC0rFA'
  },
  {
    id: 'G6HdN1Z2Sp4',
    title: 'Jethalal vs Bhide - Best Comedy Scenes Mega Compilation | TMKOC',
    channel: 'Sony LIV Official',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SonyLIV&backgroundColor=db2777',
    views: '3.4M views', uploadDate: '1 week ago', duration: '1:00:09',
    category: 'TMKOC & Shows',
    tags: ['tmkoc', 'jethalal', 'bhide', 'comedy compilation'],
    thumbnail: 'https://i.ytimg.com/vi/G6HdN1Z2Sp4/hqdefault.jpg',
    description: '1-Hour Mega compilation of Jethalal and Bhide\'s funniest clashes, Tapu Sena mischief, and Gokuldham drama.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/G6HdN1Z2Sp4'
  },
  {
    id: 'Q1dRiT1wAfg',
    title: 'Tapu Sena Best Moments | TMKOC | Funniest Kids Compilation',
    channel: 'Taarak Mehta Ka Ooltah Chashmah',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TapuSena&backgroundColor=f59e0b',
    views: '5.7M views', uploadDate: '3 weeks ago', duration: '45:22',
    category: 'TMKOC & Shows',
    tags: ['tapu sena', 'tmkoc', 'goli', 'sonu', 'gokuldham'],
    thumbnail: 'https://i.ytimg.com/vi/Q1dRiT1wAfg/hqdefault.jpg',
    description: 'Best Tapu Sena episodes — Goli, Sonu, Gogi, Popatlal and the Gokuldham playground adventures in mega HD.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/Q1dRiT1wAfg'
  },
  {
    id: 'SuHT3_r1aMk',
    title: 'Ep 4001 - Popatlal Ki Shaadi Ka Plan | Taarak Mehta Ka Ooltah Chashmah',
    channel: 'Taarak Mehta Ka Ooltah Chashmah',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TMKOC2&backgroundColor=ef4444',
    views: '3.2M views', uploadDate: '1 month ago', duration: '22:10',
    category: 'TMKOC & Shows',
    tags: ['popatlal', 'tmkoc', 'comedy', 'gokuldham', 'shaadi'],
    thumbnail: 'https://i.ytimg.com/vi/SuHT3_r1aMk/hqdefault.jpg',
    description: 'Popatlal\'s marriage plan creates chaos in Gokuldham society in this hilarious TMKOC episode.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/SuHT3_r1aMk'
  },
  {
    id: 'Y0JkFJjy7bk',
    title: 'Babita Ji Aur Iyer Ji - Best Romantic Moments | TMKOC Compilation',
    channel: 'Sony SAB',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=BabitaJi&backgroundColor=db2777',
    views: '4.1M views', uploadDate: '2 weeks ago', duration: '28:40',
    category: 'TMKOC & Shows',
    tags: ['babita', 'iyer', 'tmkoc', 'romance', 'compilation'],
    thumbnail: 'https://i.ytimg.com/vi/Y0JkFJjy7bk/hqdefault.jpg',
    description: 'Babita Ji and Iyer Ji\'s most memorable moments from TMKOC — romantic tension and comedy gold.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/Y0JkFJjy7bk'
  },
  {
    id: 'nROJCakmYzA',
    title: 'Ep 3800 - Jethalal Fanda Main! | Taarak Mehta Ka Ooltah Chashmah | Full Episode',
    channel: 'Taarak Mehta Ka Ooltah Chashmah',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=JethalEp3800&backgroundColor=f59e0b',
    views: '2.8M views', uploadDate: '6 months ago', duration: '21:30',
    category: 'TMKOC & Shows',
    tags: ['jethalal', 'tmkoc', 'episode 3800', 'comedy', 'sony sab'],
    thumbnail: 'https://i.ytimg.com/vi/nROJCakmYzA/hqdefault.jpg',
    description: 'Jethalal lands himself in another impossibly funny situation! Full episode of TMKOC on Sony SAB.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/nROJCakmYzA'
  },
  {
    id: 'ZsBTSUfm3cg',
    title: 'Daya Bhabhi Ke Best Moments | TMKOC | Funny & Emotional Scenes',
    channel: 'Sony SAB',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=DayaBhabhi&backgroundColor=e11d48',
    views: '6.5M views', uploadDate: '1 month ago', duration: '55:18',
    category: 'TMKOC & Shows',
    tags: ['daya bhabhi', 'tmkoc', 'funny', 'emotional', 'compilation'],
    thumbnail: 'https://i.ytimg.com/vi/ZsBTSUfm3cg/hqdefault.jpg',
    description: 'Daya Bhabhi\'s best emotional and funny moments from Taarak Mehta — the heart of Gokuldham!',
    embedUrl: 'https://www.youtube-nocookie.com/embed/ZsBTSUfm3cg'
  },
  {
    id: 'BVl11nZsWwE',
    title: 'Champaklal Best Scenes | Bapu Ji Ki Comedy | TMKOC Compilation',
    channel: 'Taarak Mehta Ka Ooltah Chashmah',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Champaklal&backgroundColor=7c3aed',
    views: '3.9M views', uploadDate: '3 weeks ago', duration: '40:00',
    category: 'TMKOC & Shows',
    tags: ['champaklal', 'bapu ji', 'tmkoc', 'comedy', 'old man'],
    thumbnail: 'https://i.ytimg.com/vi/BVl11nZsWwE/hqdefault.jpg',
    description: 'Champaklal / Bapu Ji\'s most hilarious moments — his old-school wisdom and innocent mischief at its best.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/BVl11nZsWwE'
  },
  {
    id: 'A7mSJd5HOBE',
    title: 'Madhavi Bhide Best Moments | Bhide Ki Wife | TMKOC Funny Clips',
    channel: 'Sony SAB',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Madhavi&backgroundColor=0284c7',
    views: '2.4M views', uploadDate: '5 weeks ago', duration: '32:00',
    category: 'TMKOC & Shows',
    tags: ['madhavi', 'bhide', 'tmkoc', 'funny', 'madhavi bhide'],
    thumbnail: 'https://i.ytimg.com/vi/A7mSJd5HOBE/hqdefault.jpg',
    description: 'Madhavi Bhide\'s funniest scenes — her strict husband Bhide vs her friendly nature, pure comedy gold.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/A7mSJd5HOBE'
  },
  {
    id: 'Dk7UbqJNUZg',
    title: 'Ep 4750 - Gokuldham\'s New Problem! | Taarak Mehta Ka Ooltah Chashmah Full Ep',
    channel: 'Taarak Mehta Ka Ooltah Chashmah',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TMKOC4750&backgroundColor=dc2626',
    views: '1.9M views', uploadDate: '3 months ago', duration: '20:44',
    category: 'TMKOC & Shows',
    tags: ['tmkoc', 'ep 4750', 'gokuldham', 'full episode', 'sony sab'],
    thumbnail: 'https://i.ytimg.com/vi/Dk7UbqJNUZg/hqdefault.jpg',
    description: 'A brand new problem hits Gokuldham society! Full episode of Taarak Mehta — laughs guaranteed.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/Dk7UbqJNUZg'
  },
  {
    id: 'kF8HmPQrCXQ',
    title: 'TMKOC 1 Hour Non-Stop Comedy | Jethalal & Bhide Mega Laughs | Sony SAB',
    channel: 'Sony SAB',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SonySAB1Hr&backgroundColor=9333ea',
    views: '8.2M views', uploadDate: '2 months ago', duration: '1:02:30',
    category: 'TMKOC & Shows',
    tags: ['tmkoc', '1 hour', 'comedy', 'jethalal', 'bhide', 'non-stop'],
    thumbnail: 'https://i.ytimg.com/vi/kF8HmPQrCXQ/hqdefault.jpg',
    description: '1 hour of non-stop TMKOC comedy — Jethalal vs Bhide, Tapu Sena mischief, Popatlal\'s antics. Pure entertainment!',
    embedUrl: 'https://www.youtube-nocookie.com/embed/kF8HmPQrCXQ'
  },
  {
    id: 'vVaRhFyoFjY',
    title: 'Gokuldham Mein Diwali | Special Episode | Taarak Mehta Ka Ooltah Chashmah',
    channel: 'Taarak Mehta Ka Ooltah Chashmah',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TMKOCDiwali&backgroundColor=f97316',
    views: '5.1M views', uploadDate: '8 months ago', duration: '45:00',
    category: 'TMKOC & Shows',
    tags: ['tmkoc', 'diwali special', 'gokuldham', 'festival', 'special episode'],
    thumbnail: 'https://i.ytimg.com/vi/vVaRhFyoFjY/hqdefault.jpg',
    description: 'Gokuldham celebrates Diwali in the most hilarious way! Special festive episode of TMKOC.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/vVaRhFyoFjY'
  },
  {
    id: 'xvFZjo5PgG0',
    title: 'Ep 3500 - Jethalal Aur Babita Ji Ka Scene | TMKOC Full Episode',
    channel: 'Taarak Mehta Ka Ooltah Chashmah',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TMKOCEp3500&backgroundColor=16a34a',
    views: '3.7M views', uploadDate: '1 year ago', duration: '22:00',
    category: 'TMKOC & Shows',
    tags: ['tmkoc', 'ep 3500', 'jethalal', 'babita', 'comedy'],
    thumbnail: 'https://i.ytimg.com/vi/xvFZjo5PgG0/hqdefault.jpg',
    description: 'Jethalal is mesmerized by Babita Ji again! Classic TMKOC comedy in this full episode.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/xvFZjo5PgG0'
  },
  {
    id: 'GNv7-n1ZMPM',
    title: 'Bagha Best Comedy Moments | TMKOC | 30 Min Compilation',
    channel: 'Sony SAB',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Bagha&backgroundColor=84cc16',
    views: '2.1M views', uploadDate: '4 months ago', duration: '30:00',
    category: 'TMKOC & Shows',
    tags: ['bagha', 'tmkoc', 'comedy', 'gokuldham', 'funny'],
    thumbnail: 'https://i.ytimg.com/vi/GNv7-n1ZMPM/hqdefault.jpg',
    description: 'Bagha\'s most memorable comedy scenes from TMKOC — his funny friendship with Jethalal and innocent confusion.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/GNv7-n1ZMPM'
  },
  {
    id: 'CdgQyq3zEXU',
    title: 'TMKOC Best Moments 2024 | New Episodes Highlights | Sony SAB',
    channel: 'Sony SAB',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TMKOC2024&backgroundColor=2563eb',
    views: '4.4M views', uploadDate: '2 weeks ago', duration: '38:15',
    category: 'TMKOC & Shows',
    tags: ['tmkoc', '2024', 'highlights', 'best moments', 'sony sab'],
    thumbnail: 'https://i.ytimg.com/vi/CdgQyq3zEXU/hqdefault.jpg',
    description: 'TMKOC 2024 highlight reel — the funniest scenes, best characters, and iconic moments of the year.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/CdgQyq3zEXU'
  },
  {
    id: 'L_jZoKxd8HU',
    title: 'Ep 4500 - Taarak Mehta Ka Ooltah Chashmah | Jethalal Ki Dukaan Mein Lafda',
    channel: 'Taarak Mehta Ka Ooltah Chashmah',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TMKOC4500&backgroundColor=ea580c',
    views: '2.2M views', uploadDate: '5 months ago', duration: '21:00',
    category: 'TMKOC & Shows',
    tags: ['tmkoc', 'ep 4500', 'jethalal', 'dukaan', 'comedy'],
    thumbnail: 'https://i.ytimg.com/vi/L_jZoKxd8HU/hqdefault.jpg',
    description: 'Trouble at Jethalal\'s electronics shop creates big laughs in episode 4500 of TMKOC.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/L_jZoKxd8HU'
  },
  {
    id: 'dJTu-PGMdpg',
    title: 'Sodhi Best Comedy Scenes | TMKOC | Oye Oye! Punjabi Tadka Compilation',
    channel: 'Sony SAB',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Sodhi&backgroundColor=d97706',
    views: '3.3M views', uploadDate: '6 weeks ago', duration: '34:22',
    category: 'TMKOC & Shows',
    tags: ['sodhi', 'tmkoc', 'punjabi', 'comedy', 'oye oye'],
    thumbnail: 'https://i.ytimg.com/vi/dJTu-PGMdpg/hqdefault.jpg',
    description: 'Sodhi\'s Punjabi energy and Oye Oye catchphrases in the best TMKOC compilation — pure comedy!',
    embedUrl: 'https://www.youtube-nocookie.com/embed/dJTu-PGMdpg'
  },
  // ─── Cartoons & Anime ────────────────────────────────────────
  {
    id: '_GE6zf_hH48',
    title: 'Tom and Jerry | Classic Mega Cartoon Compilation | Warner Bros.',
    channel: 'Warner Bros. Classics',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=WBClassics&backgroundColor=d97706',
    views: '14.2M views', uploadDate: '2 months ago', duration: '31:45',
    category: 'Cartoons & Anime',
    tags: ['tom and jerry', 'cartoon', 'warner bros', 'classic'],
    thumbnail: 'https://i.ytimg.com/vi/_GE6zf_hH48/hqdefault.jpg',
    description: 'Iconic cat-and-mouse rivalry in remastered HD. Classic slapstick humor and orchestral scores.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/_GE6zf_hH48'
  },
  {
    id: 't0Q2otsqC4I',
    title: 'Tom & Jerry Full Screen Non-Stop Laughs | WB Kids',
    channel: 'WB Kids',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=WBKids&backgroundColor=2563eb',
    views: '8.9M views', uploadDate: '3 weeks ago', duration: '25:12',
    category: 'Cartoons & Anime',
    tags: ['tom and jerry', 'cartoons', 'kids', 'animation'],
    thumbnail: 'https://i.ytimg.com/vi/t0Q2otsqC4I/hqdefault.jpg',
    description: 'Relive favorite Tom & Jerry episodes — kitchen chases, backyard battles, unexpected truces.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/t0Q2otsqC4I'
  },
  {
    id: 'NQ9DEH2XPRE',
    title: 'Shinchan in Hindi Full Episode 2024 | Non-Stop Comedy | Cartoon Network',
    channel: 'Cartoon Network India',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CartoonNetwork&backgroundColor=7c3aed',
    views: '6.1M views', uploadDate: '5 days ago', duration: '22:30',
    category: 'Cartoons & Anime',
    tags: ['shinchan', 'hindi', 'cartoon', 'comedy', 'kids'],
    thumbnail: 'https://i.ytimg.com/vi/NQ9DEH2XPRE/hqdefault.jpg',
    description: 'Shin-chan\'s latest Hindi dubbed adventures — school mischief, Kasukabe friends, and Action Kamen fun.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/NQ9DEH2XPRE'
  },
  {
    id: 'HbzJQKGBGC0',
    title: 'Doraemon Full Episode in Hindi | Nobita\'s New Gadget | Doraemon 2024',
    channel: 'Doraemon Official India',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Doraemon&backgroundColor=0ea5e9',
    views: '9.3M views', uploadDate: '1 week ago', duration: '24:00',
    category: 'Cartoons & Anime',
    tags: ['doraemon', 'hindi', 'cartoon', 'nobita', 'gadget'],
    thumbnail: 'https://i.ytimg.com/vi/HbzJQKGBGC0/hqdefault.jpg',
    description: 'Doraemon helps Nobita with incredible futuristic gadgets in this Hindi full episode. Adventure, humor and heart!',
    embedUrl: 'https://www.youtube-nocookie.com/embed/HbzJQKGBGC0'
  },
  {
    id: 'vcvHuYzF1fw',
    title: 'Oggy and the Cockroaches | Hindi Full Episode | Cartoon Mega Compilation',
    channel: 'XillamCartoons India',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Oggy&backgroundColor=16a34a',
    views: '11.4M views', uploadDate: '2 weeks ago', duration: '35:00',
    category: 'Cartoons & Anime',
    tags: ['oggy', 'cockroaches', 'cartoon', 'hindi', 'animation'],
    thumbnail: 'https://i.ytimg.com/vi/vcvHuYzF1fw/hqdefault.jpg',
    description: 'Oggy chases Joey, Dee Dee and Marky in this epic non-stop Hindi compilation full of slapstick laughs.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/vcvHuYzF1fw'
  },
  {
    id: 'YKjSgFbcZ5k',
    title: 'Chota Bheem Full Episode | Dholakpur Ki Shaan | Green Gold Animation',
    channel: 'Green Gold Animation',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ChotaBheem&backgroundColor=84cc16',
    views: '7.8M views', uploadDate: '4 days ago', duration: '18:45',
    category: 'Cartoons & Anime',
    tags: ['chota bheem', 'hindi', 'cartoon', 'dholakpur', 'kids'],
    thumbnail: 'https://i.ytimg.com/vi/YKjSgFbcZ5k/hqdefault.jpg',
    description: 'Bheem, Chutki, Raju and Kalia protect Dholakpur in this action-packed full Hindi episode.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/YKjSgFbcZ5k'
  },
  // ─── Bollywood Songs ─────────────────────────────────────────
  {
    id: 'IJq0aryDP_Q',
    title: 'Kesariya (Full Song) - Brahmastra | Ranbir Kapoor | Alia Bhatt | Pritam | Arijit Singh',
    channel: 'Sony Music India',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SonyMusic&backgroundColor=f97316',
    views: '312M views', uploadDate: '2 years ago', duration: '4:28',
    category: 'Bollywood Songs',
    tags: ['kesariya', 'brahmastra', 'arijit singh', 'bollywood', 'ranbir'],
    thumbnail: 'https://i.ytimg.com/vi/IJq0aryDP_Q/hqdefault.jpg',
    description: 'Kesariya from Brahmastra Part One — Shiva. Sung by Arijit Singh, music by Pritam. Starring Ranbir Kapoor and Alia Bhatt.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/IJq0aryDP_Q'
  },
  {
    id: 'Umbj7yBRxTM',
    title: 'Tum Hi Ho (Full Song) - Aashiqui 2 | Aditya Roy Kapur, Shraddha Kapoor | Arijit Singh',
    channel: 'T-Series',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TSeries&backgroundColor=dc2626',
    views: '860M views', uploadDate: '11 years ago', duration: '4:45',
    category: 'Bollywood Songs',
    tags: ['tum hi ho', 'aashiqui 2', 'arijit singh', 'bollywood', 'romantic'],
    thumbnail: 'https://i.ytimg.com/vi/Umbj7yBRxTM/hqdefault.jpg',
    description: 'Tum Hi Ho — the iconic romantic anthem from Aashiqui 2. One of the most-streamed Bollywood songs ever.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/Umbj7yBRxTM'
  },
  {
    id: 'hdlkMFRLi5Q',
    title: 'Srivalli (Full Video) - Pushpa | Allu Arjun | Rashmika | Javed Ali',
    channel: 'Lahari Music',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=LahariBollywood&backgroundColor=9333ea',
    views: '520M views', uploadDate: '3 years ago', duration: '3:52',
    category: 'Bollywood Songs',
    tags: ['srivalli', 'pushpa', 'allu arjun', 'javed ali', 'bollywood'],
    thumbnail: 'https://i.ytimg.com/vi/hdlkMFRLi5Q/hqdefault.jpg',
    description: 'Srivalli — the superhit song from Pushpa: The Rise featuring Allu Arjun. Hindi version sung by Javed Ali.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/hdlkMFRLi5Q'
  },
  {
    id: 'gVBiHGp2oRg',
    title: 'Jai Jai Shiv Shankar (Full Song) - War | Hrithik Roshan, Tiger Shroff | Vishal Shekhar',
    channel: 'YRF Music',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=YRFMusic&backgroundColor=2563eb',
    views: '238M views', uploadDate: '4 years ago', duration: '3:15',
    category: 'Bollywood Songs',
    tags: ['jai jai shiv shankar', 'war movie', 'hrithik roshan', 'tiger shroff', 'bollywood'],
    thumbnail: 'https://i.ytimg.com/vi/gVBiHGp2oRg/hqdefault.jpg',
    description: 'Jai Jai Shiv Shankar from the action blockbuster WAR. High-octane beats with Hrithik Roshan and Tiger Shroff.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/gVBiHGp2oRg'
  },
  {
    id: 'PFVDFbBzucI',
    title: 'Raatan Lambiyan (Full Video) - Shershaah | Sidharth Malhotra | Kiara Advani | Jubin Nautiyal',
    channel: 'Sony Music India',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SonyMusicIN&backgroundColor=f97316',
    views: '430M views', uploadDate: '3 years ago', duration: '4:10',
    category: 'Bollywood Songs',
    tags: ['raatan lambiyan', 'shershaah', 'jubin nautiyal', 'asees kaur', 'romantic bollywood'],
    thumbnail: 'https://i.ytimg.com/vi/PFVDFbBzucI/hqdefault.jpg',
    description: 'Raatan Lambiyan from Shershaah — a heartfelt love ballad sung by Jubin Nautiyal and Asees Kaur.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/PFVDFbBzucI'
  },
  // ─── Marathi Songs ───────────────────────────────────────────
  {
    id: 'HrR9KFVS0R8',
    title: 'Zingaat (Full Video) - Sairat | Akash Thosar, Rinku Rajguru | Ajay-Atul',
    channel: 'Zee Music Company',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ZeeMusic&backgroundColor=7c3aed',
    views: '210M views', uploadDate: '8 years ago', duration: '3:38',
    category: 'Marathi Songs',
    tags: ['zingaat', 'sairat', 'marathi', 'ajay atul', 'famous marathi'],
    thumbnail: 'https://i.ytimg.com/vi/HrR9KFVS0R8/hqdefault.jpg',
    description: 'Zingaat — the iconic blockbuster Marathi song from Sairat. Music by Ajay-Atul, one of the most viral Marathi anthems.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/HrR9KFVS0R8'
  },
  {
    id: 'FUNbqWCB-0k',
    title: 'Apsara Aali (Full Song) - Natarang | Ajay-Atul | Famous Marathi Song',
    channel: 'Sony Marathi Music',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SonyMarathi&backgroundColor=16a34a',
    views: '95M views', uploadDate: '10 years ago', duration: '4:02',
    category: 'Marathi Songs',
    tags: ['apsara aali', 'natarang', 'marathi', 'ajay atul', 'folk'],
    thumbnail: 'https://i.ytimg.com/vi/FUNbqWCB-0k/hqdefault.jpg',
    description: 'Apsara Aali — the legendary Marathi folk-inspired anthem from Natarang. Music maestros Ajay-Atul at their best.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/FUNbqWCB-0k'
  },
  {
    id: 'T9WGbHjB4bA',
    title: 'Ek Taraa (Full Video) - Tu Hi Re | Marathi Devotional Song | Swapnil Bandodkar',
    channel: 'Tips Marathi',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TipsMarathi&backgroundColor=f59e0b',
    views: '52M views', uploadDate: '7 years ago', duration: '5:15',
    category: 'Marathi Songs',
    tags: ['ek taraa', 'marathi', 'swapnil bandodkar', 'devotional', 'bhajan'],
    thumbnail: 'https://i.ytimg.com/vi/T9WGbHjB4bA/hqdefault.jpg',
    description: 'Ek Taraa — a soulful Marathi spiritual song by Swapnil Bandodkar from Tu Hi Re, adored across Maharashtra.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/T9WGbHjB4bA'
  },
  {
    id: '2Y1vhD2QR5I',
    title: 'Nach Ga Ghuma (Full Song) - Marathi Item Song | Famous Marathi Dance Hit',
    channel: 'Zee Marathi Music',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ZeeMarathi&backgroundColor=ea580c',
    views: '38M views', uploadDate: '5 years ago', duration: '3:42',
    category: 'Marathi Songs',
    tags: ['nach ga ghuma', 'marathi', 'dance', 'item song', 'maharashtra'],
    thumbnail: 'https://i.ytimg.com/vi/2Y1vhD2QR5I/hqdefault.jpg',
    description: 'Nach Ga Ghuma — the ultimate high-energy Marathi dance track, perfect for every Marathi festive celebration.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/2Y1vhD2QR5I'
  },
  {
    id: 'ek1g19N0mss',
    title: 'Timepass (Full Song) - Timepass Marathi Movie | Super Hit Marathi Song',
    channel: 'Zee Music Marathi',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ZeeMusicMarathi&backgroundColor=0891b2',
    views: '29M views', uploadDate: '9 years ago', duration: '4:10',
    category: 'Marathi Songs',
    tags: ['timepass', 'marathi', 'hit song', 'romantic marathi'],
    thumbnail: 'https://i.ytimg.com/vi/ek1g19N0mss/hqdefault.jpg',
    description: 'Timepass — a beloved superhit from the blockbuster Marathi movie Timepass. Romantic and timeless Marathi melody.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/ek1g19N0mss'
  },
  // ─── English Songs ───────────────────────────────────────────
  {
    id: 'JGwWNGJdvx8',
    title: 'Ed Sheeran - Shape of You [Official Music Video]',
    channel: 'Ed Sheeran',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=EdSheeran&backgroundColor=2563eb',
    views: '6.1B views', uploadDate: '7 years ago', duration: '3:53',
    category: 'English Songs',
    tags: ['ed sheeran', 'shape of you', 'pop', 'english song', 'top hits'],
    thumbnail: 'https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg',
    description: 'Shape of You — the record-smashing pop hit by Ed Sheeran. One of the most-streamed songs in music history.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/JGwWNGJdvx8'
  },
  {
    id: 'XXYlFuWEuKI',
    title: 'The Weeknd - Blinding Lights [Official Music Video]',
    channel: 'The Weeknd',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TheWeeknd&backgroundColor=7c3aed',
    views: '1.2B views', uploadDate: '4 years ago', duration: '4:22',
    category: 'English Songs',
    tags: ['weeknd', 'blinding lights', '80s pop', 'synth', 'english hit'],
    thumbnail: 'https://i.ytimg.com/vi/XXYlFuWEuKI/hqdefault.jpg',
    description: 'Blinding Lights — The Weeknd\'s global smash hit with its iconic 80s synth-wave sound and pulsing energy.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/XXYlFuWEuKI'
  },
  {
    id: 'TUVcZfQe-Kw',
    title: 'Dua Lipa - Levitating (Official Music Video) ft. DaBaby',
    channel: 'Dua Lipa',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=DuaLipa&backgroundColor=db2777',
    views: '890M views', uploadDate: '4 years ago', duration: '3:23',
    category: 'English Songs',
    tags: ['dua lipa', 'levitating', 'disco pop', 'english', 'top english songs'],
    thumbnail: 'https://i.ytimg.com/vi/TUVcZfQe-Kw/hqdefault.jpg',
    description: 'Levitating — Dua Lipa\'s irresistible disco-pop anthem that took the world by storm. ft. DaBaby.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/TUVcZfQe-Kw'
  },
  {
    id: 'H5v3kku4y6Q',
    title: 'Harry Styles - As It Was [Official Music Video]',
    channel: 'Harry Styles',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=HarryStyles&backgroundColor=f97316',
    views: '620M views', uploadDate: '3 years ago', duration: '2:37',
    category: 'English Songs',
    tags: ['harry styles', 'as it was', 'indie pop', 'english song', 'pop hit'],
    thumbnail: 'https://i.ytimg.com/vi/H5v3kku4y6Q/hqdefault.jpg',
    description: 'As It Was — Harry Styles\' global No.1 hit from Harry\'s House. A nostalgic indie-pop anthem.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/H5v3kku4y6Q'
  },
  {
    id: '7wtfhZwyrcc',
    title: 'Imagine Dragons - Believer [Official Music Video]',
    channel: 'Imagine Dragons',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ImagineDragons&backgroundColor=d97706',
    views: '2.2B views', uploadDate: '7 years ago', duration: '3:24',
    category: 'English Songs',
    tags: ['imagine dragons', 'believer', 'rock', 'pop rock', 'english hit'],
    thumbnail: 'https://i.ytimg.com/vi/7wtfhZwyrcc/hqdefault.jpg',
    description: 'Believer — Imagine Dragons\' iconic anthemic rock song about self-discovery and strength. Over 2B views!',
    embedUrl: 'https://www.youtube-nocookie.com/embed/7wtfhZwyrcc'
  },
  // ─── Hollywood Songs ─────────────────────────────────────────
  {
    id: 'RgKAFK5djSk',
    title: 'Wiz Khalifa - See You Again ft. Charlie Puth [Official Video] Furious 7',
    channel: 'Wiz Khalifa',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=WizKhalifa&backgroundColor=1d4ed8',
    views: '6.3B views', uploadDate: '9 years ago', duration: '3:50',
    category: 'Hollywood Songs',
    tags: ['see you again', 'wiz khalifa', 'charlie puth', 'furious 7', 'hollywood'],
    thumbnail: 'https://i.ytimg.com/vi/RgKAFK5djSk/hqdefault.jpg',
    description: 'See You Again — the emotional tribute from Furious 7 soundtrack. One of the most-viewed videos in YouTube history.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/RgKAFK5djSk'
  },
  {
    id: 'PT2_F-1esPk',
    title: 'The Lion King - Circle of Life [Official HD] | Disney',
    channel: 'Disney Music',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=DisneyMusic&backgroundColor=f59e0b',
    views: '310M views', uploadDate: '5 years ago', duration: '4:08',
    category: 'Hollywood Songs',
    tags: ['lion king', 'circle of life', 'disney', 'elton john', 'hollywood soundtrack'],
    thumbnail: 'https://i.ytimg.com/vi/PT2_F-1esPk/hqdefault.jpg',
    description: 'Circle of Life from Disney\'s The Lion King — Elton John\'s timeless masterpiece that opened a generation of films.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/PT2_F-1esPk'
  },
  {
    id: 'OOxoM5rQvkk',
    title: 'Sam Smith - Writing\'s On The Wall [Official Video] - James Bond: Spectre',
    channel: 'Sam Smith',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SamSmith&backgroundColor=0f172a',
    views: '225M views', uploadDate: '8 years ago', duration: '4:32',
    category: 'Hollywood Songs',
    tags: ['sam smith', 'james bond', 'spectre', 'hollywood', 'oscar song'],
    thumbnail: 'https://i.ytimg.com/vi/OOxoM5rQvkk/hqdefault.jpg',
    description: 'Writing\'s On The Wall — Sam Smith\'s Oscar-winning James Bond theme from Spectre. Pure cinematic soul.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/OOxoM5rQvkk'
  },
  {
    id: 'Y8HOfcYWZoo',
    title: 'Avengers: Endgame - Main Theme [Epic Orchestra] | Alan Silvestri',
    channel: 'Marvel Studios Music',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MarvelMusic&backgroundColor=b91c1c',
    views: '98M views', uploadDate: '5 years ago', duration: '5:30',
    category: 'Hollywood Songs',
    tags: ['avengers endgame', 'alan silvestri', 'marvel', 'orchestra', 'hollywood soundtrack'],
    thumbnail: 'https://i.ytimg.com/vi/Y8HOfcYWZoo/hqdefault.jpg',
    description: 'The iconic Avengers: Endgame main orchestral theme by Alan Silvestri — pure cinematic power and emotion.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/Y8HOfcYWZoo'
  },
  {
    id: 'YQHsXMglC9A',
    title: 'Adele - Hello [Official Music Video] - Hollywood Pop',
    channel: 'Adele',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Adele&backgroundColor=374151',
    views: '3.6B views', uploadDate: '8 years ago', duration: '4:55',
    category: 'Hollywood Songs',
    tags: ['adele', 'hello', 'soul', 'pop', 'hollywood international'],
    thumbnail: 'https://i.ytimg.com/vi/YQHsXMglC9A/hqdefault.jpg',
    description: 'Hello — Adele\'s record-shattering comeback single. One of the most iconic ballads in modern music.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/YQHsXMglC9A'
  },
  // ─── Lofi & Beats ─────────────────────────────────────────────
  {
    id: 'jfKfPfyJRdk',
    title: 'Lofi Hip Hop Radio 24/7 🎵 Beats to Relax / Study',
    channel: 'Lofi Girl',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=LofiGirl&backgroundColor=4f46e5',
    views: '18.9M views', uploadDate: '1 year ago', duration: '1:45:20',
    category: 'Music & Lofi',
    tags: ['lofi', 'music', 'chill', 'beats', 'study', 'focus'],
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=640&auto=format&fit=crop&q=80',
    description: 'Continuous ad-free calm lofi beats, Rhodes chords, and ambient rain textures for deep focus and programming.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/jfKfPfyJRdk'
  },
  // ─── Technology ───────────────────────────────────────────────
  {
    id: 'JhHMJCUmq28',
    title: 'Quantum Computing in 10 Minutes | How It Really Works',
    channel: 'Veritasium',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Veritasium&backgroundColor=0284c7',
    views: '2.4M views', uploadDate: '3 months ago', duration: '11:42',
    category: 'Technology',
    tags: ['quantum', 'physics', 'computing', 'science'],
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=640&auto=format&fit=crop&q=80',
    description: 'Deep dive into quantum superposition, entanglement and how quantum processors tackle intractable problems.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/JhHMJCUmq28'
  },
  // ─── Coding ───────────────────────────────────────────────────
  {
    id: 'W6NZfCO5SIk',
    title: 'Modern JavaScript & React Architecture for 2026',
    channel: 'Fireship',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Fireship&backgroundColor=ea580c',
    views: '1.7M views', uploadDate: '2 weeks ago', duration: '12:05',
    category: 'Coding',
    tags: ['react', 'javascript', 'web dev', 'coding'],
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&auto=format&fit=crop&q=80',
    description: 'Server components, edge streaming, reactivity primitives and why monolithic frameworks are being redesigned.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/W6NZfCO5SIk'
  },
  // ─── Gaming ───────────────────────────────────────────────────
  {
    id: 'yPYZpwSpKmA',
    title: 'Cyberpunk 2077 Full Ray Tracing Overdrive Graphics Showcase',
    channel: 'Digital Foundry',
    channelAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=DigitalFoundry&backgroundColor=6d28d9',
    views: '4.5M views', uploadDate: '8 months ago', duration: '16:30',
    category: 'Gaming',
    tags: ['gaming', 'graphics', 'ray tracing', 'rtx', 'cyberpunk'],
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=640&auto=format&fit=crop&q=80',
    description: 'Full path tracing benchmark, DLSS 3.5 ray reconstruction and indirect bounce caustics analysis.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/yPYZpwSpKmA'
  }
];

// Safe Demo Circuit Breaker: prevents aggressive requests, throttles, or terms breaches
let scrapingCooldownUntil = 0;

/**
 * Scrapes YouTube search metadata for educational demo browsing.
 * If throttled or unavailable, safely backs off to the curated verified library.
 */
async function scrapeYouTube(searchQuery, forcedCategory = null) {
  if (Date.now() < scrapingCooldownUntil) {
    return [];
  }

  try {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: 3500
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

      const channelAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(channel)}&backgroundColor=0284c7,2563eb,7c3aed,db2777,f97316,16a34a`;

      // Use forcedCategory (from active category click) or infer from title/query
      const category = forcedCategory || inferCategory(title, searchQuery);

      parsedVideos.push({
        id: videoId,
        title,
        channel,
        channelAvatar,
        views,
        uploadDate,
        duration,
        category,
        tags: [channel.toLowerCase(), ...title.toLowerCase().split(/\s+/).slice(0, 5)],
        thumbnail,
        description,
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`
      });

      if (parsedVideos.length >= 24) break;
    }
    if (parsedVideos.length >= 24) break;
  }

    return parsedVideos;
  } catch (err) {
    if (err.response?.status === 429 || err.code === 'ECONNABORTED' || err.response?.status === 403) {
      scrapingCooldownUntil = Date.now() + (3 * 60 * 1000); // 3-minute backoff
      console.warn('YouTube rate-limit notice. Engaging 3-min safe fallback cooldown.');
    }
    return [];
  }
}

/**
 * Runs multiple YouTube searches IN PARALLEL to gather a larger pool of episodes.
 * Uses Promise.allSettled so one failure does not block others.
 * Total time = max(individual times) not sum — safe within Vercel's 10s limit.
 */
async function scrapeYouTubeMulti(queries, forcedCategory) {
  const results = await Promise.allSettled(
    queries.map((q) => scrapeYouTube(q, forcedCategory))
  );
  const seen = new Set();
  const all = [];
  for (const result of results) {
    if (result.status === 'fulfilled' && Array.isArray(result.value)) {
      for (const v of result.value) {
        if (!seen.has(v.id)) {
          seen.add(v.id);
          all.push(v);
        }
      }
    }
  }
  return all;
}

function inferCategory(title = '', query = '') {
  const t = `${title} ${query}`.toLowerCase();
  if (t.includes('taarak') || t.includes('tmkoc') || t.includes('jetha') || t.includes('episode') || t.includes('jethalal') || t.includes('bhide') || t.includes('tapu sena') || t.includes('gokuldham')) return 'TMKOC & Shows';
  if (t.includes('cartoon') || t.includes('tom and jerry') || t.includes('shinchan') || t.includes('doraemon') || t.includes('anime') || t.includes('oggy') || t.includes('chota bheem') || t.includes('dragon ball')) return 'Cartoons & Anime';
  if (t.includes('bollywood') || t.includes('hindi song') || t.includes('arijit') || t.includes('kesariya') || t.includes('tum hi ho') || t.includes('srivalli') || t.includes('raatan') || t.includes('pushpa') || t.includes('filmy song')) return 'Bollywood Songs';
  if (t.includes('marathi') || t.includes('zingaat') || t.includes('sairat') || t.includes('apsara aali') || t.includes('ajay atul') || t.includes('lavani') || t.includes('nach ga')) return 'Marathi Songs';
  if (t.includes('english song') || t.includes('ed sheeran') || t.includes('weeknd') || t.includes('dua lipa') || t.includes('harry styles') || t.includes('imagine dragons') || t.includes('pop song') || t.includes('believer') || t.includes('blinding lights')) return 'English Songs';
  if (t.includes('hollywood') || t.includes('movie soundtrack') || t.includes('sam smith') || t.includes('james bond') || t.includes('wiz khalifa') || t.includes('see you again') || t.includes('adele') || t.includes('marvel') || t.includes('disney music') || t.includes('avengers')) return 'Hollywood Songs';
  if (t.includes('lofi') || t.includes('beats') || t.includes('chill music') || t.includes('study music')) return 'Music & Lofi';
  if (t.includes('song') || t.includes('music')) return 'Music & Lofi';
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
      effectiveQuery = 'taarak mehta ka ooltah chashmah latest full episode sony sab jethalal';
    } else if (cleanCat === 'Cartoons & Anime') {
      effectiveQuery = 'tom and jerry hindi cartoon full compilation shinchan doraemon oggy';
    } else if (cleanCat === 'Bollywood Songs') {
      effectiveQuery = 'best bollywood songs 2024 hindi hit songs arijit singh top 10';
    } else if (cleanCat === 'Marathi Songs') {
      effectiveQuery = 'famous marathi songs zingaat sairat ajay atul top marathi hits';
    } else if (cleanCat === 'English Songs') {
      effectiveQuery = 'top english songs 2024 ed sheeran weeknd dua lipa harry styles hits';
    } else if (cleanCat === 'Hollywood Songs') {
      effectiveQuery = 'hollywood famous songs movie soundtrack adele see you again wiz khalifa';
    } else if (cleanCat === 'Music & Lofi') {
      effectiveQuery = 'lofi hip hop radio beats to relax study';
    } else if (cleanCat === 'Coding') {
      effectiveQuery = 'react javascript coding full tutorial 2026';
    } else if (cleanCat === 'Gaming') {
      effectiveQuery = 'top gaming trailers 4k 60fps walkthrough';
    } else if (cleanCat === 'Technology') {
      effectiveQuery = 'cutting edge technology documentary veritasium';
    } else {
      effectiveQuery = 'trending youtube videos 2024';
    }
  } else {
    // If category is specific and user typed a generic query
    if (cleanCat === 'TMKOC & Shows' && !cleanQ.toLowerCase().includes('tmkoc') && !cleanQ.toLowerCase().includes('taarak')) {
      effectiveQuery = `tmkoc ${cleanQ}`;
    } else if (cleanCat === 'Cartoons & Anime' && !cleanQ.toLowerCase().includes('cartoon')) {
      effectiveQuery = `cartoon ${cleanQ}`;
    } else if (cleanCat === 'Bollywood Songs' && !cleanQ.toLowerCase().includes('bollywood')) {
      effectiveQuery = `bollywood song ${cleanQ}`;
    } else if (cleanCat === 'Marathi Songs' && !cleanQ.toLowerCase().includes('marathi')) {
      effectiveQuery = `marathi song ${cleanQ}`;
    } else if (cleanCat === 'English Songs' && !cleanQ.toLowerCase().includes('english')) {
      effectiveQuery = `english hit song ${cleanQ}`;
    } else if (cleanCat === 'Hollywood Songs' && !cleanQ.toLowerCase().includes('hollywood')) {
      effectiveQuery = `hollywood movie song ${cleanQ}`;
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

  // 2. Scrape live YouTube results — multi-query for TMKOC to get lots of episodes
  try {
    let liveVideos = [];
    const forced = cleanCat !== 'All' ? cleanCat : null;

    if (cleanCat === 'TMKOC & Shows') {
      // Run 3 targeted queries to fetch maximum TMKOC episodes
      liveVideos = await scrapeYouTubeMulti([
        'taarak mehta ka ooltah chashmah latest full episode sony sab',
        'tmkoc new episode 2024 jethalal bhide comedy full',
        'taarak mehta episodes gokuldham jethalal tapu sena'
      ], forced);
    } else {
      liveVideos = await scrapeYouTube(effectiveQuery, forced);
    }

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
