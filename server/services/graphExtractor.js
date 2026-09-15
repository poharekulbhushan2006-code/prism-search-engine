/**
 * PRISM Knowledge Graph Extractor
 * Derives dynamic semantic nodes, entity relationships, sub-themes, and rabbit holes
 * from query context, Wikipedia relations, and search result clusters.
 */

export function buildKnowledgeGraph(query, results, wikiData = null) {
  const nodes = [];
  const edges = [];
  const seenNodes = new Set();

  // 1. Root / Center Node
  const rootId = 'root';
  nodes.push({
    id: rootId,
    label: query,
    type: 'root',
    size: 40,
    color: '#6366f1',
    description: `Central search query: "${query}"`
  });
  seenNodes.add(rootId);

  // 2. Wikipedia Concept Nodes (High-order entities)
  if (wikiData && wikiData.title) {
    const wikiId = `wiki-${slugify(wikiData.title)}`;
    if (!seenNodes.has(wikiId)) {
      nodes.push({
        id: wikiId,
        label: wikiData.title,
        type: 'entity',
        size: 28,
        color: '#06b6d4',
        description: wikiData.extract || 'Knowledge entity from open encyclopedic records.',
        url: wikiData.content_urls?.desktop?.page || null
      });
      edges.push({ source: rootId, target: wikiId, relationship: 'definition' });
      seenNodes.add(wikiId);
    }
  }

  // 3. Sub-themes extracted from result groupings and categories
  const categories = {};
  results.forEach(res => {
    const cat = res.category || 'web';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(res);
  });

  const categoryConfigs = {
    community: { label: 'Human Discussions', color: '#f59e0b', type: 'category' },
    academic: { label: 'Research & Papers', color: '#10b981', type: 'category' },
    developer: { label: 'Code & Systems', color: '#a855f7', type: 'category' },
    documentation: { label: 'Official Standards', color: '#3b82f6', type: 'category' },
    indie: { label: 'Independent Blogs', color: '#ec4899', type: 'category' },
    web: { label: 'Web Insights', color: '#64748b', type: 'category' }
  };

  Object.entries(categories).forEach(([catKey, catResults]) => {
    if (catResults.length === 0) return;
    const catConfig = categoryConfigs[catKey] || categoryConfigs.web;
    const catNodeId = `cat-${catKey}`;

    if (!seenNodes.has(catNodeId)) {
      nodes.push({
        id: catNodeId,
        label: catConfig.label,
        type: catConfig.type,
        size: 24,
        color: catConfig.color,
        description: `${catResults.length} verified sources in this domain.`
      });
      edges.push({ source: rootId, target: catNodeId, relationship: 'domain' });
      seenNodes.add(catNodeId);
    }

    // Attach top 2-3 specific sources to this category
    catResults.slice(0, 3).forEach((item, idx) => {
      const leafId = `leaf-${catKey}-${idx}`;
      if (!seenNodes.has(leafId)) {
        nodes.push({
          id: leafId,
          label: truncate(item.title, 32),
          fullTitle: item.title,
          type: 'source',
          size: 16,
          color: item.trustScore > 85 ? '#10b981' : '#94a3b8',
          trustScore: item.trustScore,
          url: item.link || item.url,
          snippet: item.cleanSnippet || item.snippet
        });
        edges.push({ source: catNodeId, target: leafId, relationship: 'source' });
        seenNodes.add(leafId);
      }
    });
  });

  // 4. Extract Common Keywords / Entities for Cross-connections
  const keywords = extractKeywords(query, results);
  keywords.slice(0, 5).forEach((kw) => {
    const kwId = `kw-${slugify(kw)}`;
    if (!seenNodes.has(kwId)) {
      nodes.push({
        id: kwId,
        label: capitalize(kw),
        type: 'concept',
        size: 22,
        color: '#ec4899',
        description: `Core semantic concept identified across sources regarding "${query}".`
      });
      edges.push({ source: rootId, target: kwId, relationship: 'related_concept' });
      seenNodes.add(kwId);

      // Connect concept to matching leaf sources for realistic semantic graph clustering
      nodes.filter(n => n.type === 'source').slice(0, 3).forEach(sourceNode => {
        const sourceText = `${sourceNode.label} ${sourceNode.snippet || ''}`.toLowerCase();
        if (sourceText.includes(kw.toLowerCase())) {
          edges.push({ source: kwId, target: sourceNode.id, relationship: 'semantic_reference' });
        }
      });
    }
  });

  return { nodes, edges };
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 20);
}

function truncate(str, len) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len - 3) + '...' : str;
}

function extractKeywords(query, results) {
  const stopWords = new Set([
    // Grammar & structural
    'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'for', 'of', 'in', 'to', 'with', 'by',
    'what', 'how', 'why', 'when', 'where', 'best', 'vs', 'under', 'from', 'this', 'that', 'are', 'was',
    'were', 'been', 'have', 'has', 'had', 'will', 'would', 'could', 'should', 'into', 'onto', 'over',
    'after', 'before', 'about', 'more', 'most', 'some', 'such', 'only', 'also', 'their', 'there', 'they',
    'them', 'these', 'those', 'your', 'than', 'then', 'very', 'each', 'both', 'between', 'during', 'through',
    // Scraper & web telemetry noise words
    'points', 'comments', 'comment', 'authentic', 'discussion', 'discussions', 'developer', 'developers',
    'practitioners', 'source', 'sources', 'github', 'reddit', 'stars', 'star', 'forks', 'fork', 'hacker',
    'news', 'arxiv', 'paper', 'papers', 'published', 'author', 'authors', 'summary', 'overview', 'official',
    'codebase', 'repository', 'experiences', 'tradeoffs', 'ecosystem', 'analysis', 'engineering', 'thread',
    'threads', 'regarding', 'share', 'shares', 'real-world', 'firsthand', 'community', 'replies', 'upvotes'
  ]);

  const queryTokens = new Set(query.toLowerCase().split(/\s+/));
  const counts = {};

  results.forEach(res => {
    const text = `${res.title} ${res.cleanSnippet || ''}`.toLowerCase();
    const words = text.match(/[a-z]{4,}/g) || [];
    words.forEach(w => {
      if (!stopWords.has(w) && !queryTokens.has(w)) {
        counts[w] = (counts[w] || 0) + 1;
      }
    });
  });

  return Object.entries(counts)
    .filter(([_, count]) => count >= 1)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
}
