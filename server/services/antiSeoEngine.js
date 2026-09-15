/**
 * PRISM Anti-SEO & Authenticity Scoring Engine
 * Analyzes domains, query strings, title patterns, and content signals
 * to strip affiliate spam, de-rank content farms, and score authentic human/technical knowledge.
 */

// Known low-value content farms, ad-heavy aggregators, affiliate syndicates
const LOW_TRUST_PATTERNS = [
  /top\d+best/i,
  /best.*reviews?\d{4}/i,
  /affiliate/i,
  /coupon/i,
  /promo.*code/i,
  /expert.*reviews?\./i,
  /buying.*guide/i,
  /geeksforgeeks/i, // often aggressive SEO scrape summaries
  /w3schools/i,     // often shallow SEO ranking
  /softonic/i,
  /pinterest/i      // search pollution
];

// High-trust community, academic, independent, and developer domains
const TRUSTED_DOMAINS = {
  // Developer & Open Source
  'github.com': { trust: 98, badge: 'Code & Dev', category: 'developer' },
  'gitlab.com': { trust: 95, badge: 'Code & Dev', category: 'developer' },
  'stackoverflow.com': { trust: 94, badge: 'Community Dev', category: 'developer' },
  'developer.mozilla.org': { trust: 99, badge: 'Official Docs', category: 'documentation' },
  'docs.python.org': { trust: 99, badge: 'Official Docs', category: 'documentation' },
  'nodejs.org': { trust: 98, badge: 'Official Docs', category: 'documentation' },
  'react.dev': { trust: 99, badge: 'Official Docs', category: 'documentation' },
  'news.ycombinator.com': { trust: 96, badge: 'Human Voices', category: 'community' },
  'lobste.rs': { trust: 97, badge: 'Human Voices', category: 'community' },

  // Human Discussions & Forums
  'reddit.com': { trust: 92, badge: 'Human Voices', category: 'community' },
  'old.reddit.com': { trust: 94, badge: 'Human Voices', category: 'community' },
  'subcta.com': { trust: 88, badge: 'Indie Voice', category: 'indie' },
  'substack.com': { trust: 89, badge: 'Indie Voice', category: 'indie' },
  'medium.com': { trust: 75, badge: 'Articles', category: 'articles' },

  // Research & Science
  'arxiv.org': { trust: 99, badge: 'Academic Research', category: 'academic' },
  'nature.com': { trust: 99, badge: 'Peer Reviewed', category: 'academic' },
  'sciencedirect.com': { trust: 97, badge: 'Peer Reviewed', category: 'academic' },
  'semanticscholar.org': { trust: 98, badge: 'Academic Index', category: 'academic' },
  'wikipedia.org': { trust: 94, badge: 'Encyclopedia', category: 'encyclopedic' },
  'en.wikipedia.org': { trust: 94, badge: 'Encyclopedia', category: 'encyclopedic' }
};

export function scoreAndFilterResult(item) {
  const url = item.link || item.url || '';
  const title = item.title || '';
  const snippet = item.snippet || item.description || '';

  let hostname = '';
  try {
    hostname = new URL(url).hostname.replace(/^www\./, '');
  } catch {
    hostname = url.split('/')[2] || url;
  }

  let baseTrust = 70; // baseline for neutral web
  let badge = 'Web Source';
  let category = 'web';
  let isAffiliate = false;
  let seoSpamPenalty = 0;

  // 1. Check known domain registry
  if (TRUSTED_DOMAINS[hostname]) {
    baseTrust = TRUSTED_DOMAINS[hostname].trust;
    badge = TRUSTED_DOMAINS[hostname].badge;
    category = TRUSTED_DOMAINS[hostname].category;
  } else if (hostname.endsWith('.edu') || hostname.endsWith('.gov')) {
    baseTrust = 95;
    badge = 'Verified Institutional';
    category = 'institutional';
  } else if (hostname.endsWith('.org')) {
    baseTrust = 82;
    badge = 'Non-Profit / Org';
    category = 'organization';
  } else if (hostname.endsWith('.io') || hostname.endsWith('.dev') || hostname.endsWith('.me')) {
    baseTrust = 80;
    badge = 'Indie / Tech Web';
    category = 'indie';
  }

  // 2. Detect affiliate & SEO spam patterns in title & URL
  for (const pattern of LOW_TRUST_PATTERNS) {
    if (pattern.test(title) || pattern.test(url)) {
      seoSpamPenalty += 35;
      isAffiliate = true;
      break;
    }
  }

  // Check URL query parameters for affiliate tags
  if (url.includes('aff=') || url.includes('affiliate') || url.includes('ref=') || url.includes('tag=')) {
    seoSpamPenalty += 25;
    isAffiliate = true;
  }

  // Check snippet for clickbait / spam keywords
  const spamSignals = [
    'buy now', 'huge discount', 'our top pick', 'click here for', 'best price guaranteed',
    'sponsored', 'disclosure: this post contains'
  ];
  for (const signal of spamSignals) {
    if (snippet.toLowerCase().includes(signal)) {
      seoSpamPenalty += 20;
      break;
    }
  }

  // 3. Human discourse bonus
  if (hostname.includes('reddit.com') || hostname.includes('ycombinator.com') || hostname.includes('forum')) {
    category = 'community';
    badge = 'Human Voices';
    baseTrust = Math.max(baseTrust, 88);
  }

  const finalScore = Math.max(10, Math.min(100, baseTrust - seoSpamPenalty));

  // Extract key takeaways or clean highlights
  const cleanSnippet = cleanText(snippet);
  const readingTimeMinutes = Math.max(1, Math.round(cleanSnippet.split(' ').length / 35));

  return {
    ...item,
    hostname,
    trustScore: finalScore,
    trustBadge: badge,
    category,
    isAffiliate,
    readingTime: `${readingTimeMinutes} min read`,
    cleanSnippet: cleanSnippet.length > 250 ? cleanSnippet.slice(0, 247) + '...' : cleanSnippet
  };
}

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '') // remove html tags
    .replace(/^★\s*[\d,]+\s*stars\s*\|\s*Forks:\s*\d+\.\s*/i, '') // strip stars/forks prefix if present
    .replace(/^\d+\s*points\s*\|\s*\d+\s*comments\s*by\s*[^.]+\.\s*/i, '') // strip points/comments prefix if present
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}
