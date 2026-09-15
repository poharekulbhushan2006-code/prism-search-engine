/**
 * PRISM Perspective & Debate Splitter
 * Detects whether a query involves comparison, debate, or subjective trade-offs.
 * Groups search results and community insights into competing viewpoints.
 */

export function analyzePerspectives(query, results) {
  const queryLower = query.toLowerCase();
  
  // Detect comparison patterns like "A vs B", "A or B", "pros and cons of A", "is A worth it"
  const vsMatch = queryLower.match(/(.+?)\s+(?:vs|versus|\/)\s+(.+)/i);
  const orMatch = queryLower.match(/(?:should i use|which is better|choose between)\s+(.+?)\s+or\s+(.+)/i);
  const prosConsMatch = queryLower.includes('pros and cons') || queryLower.includes('good or bad') || queryLower.includes('worth it');

  let perspectiveA = {
    title: 'Perspective A',
    subtitle: 'Primary Advantages & Proponents',
    color: '#6366f1',
    sentiment: 'positive',
    items: [],
    keyClaims: []
  };

  let perspectiveB = {
    title: 'Perspective B',
    subtitle: 'Trade-offs, Critiques & Counter-Arguments',
    color: '#06b6d4',
    sentiment: 'critical',
    items: [],
    keyClaims: []
  };

  if (vsMatch) {
    const sideA = capitalize(vsMatch[1].trim());
    const sideB = capitalize(vsMatch[2].trim());
    perspectiveA.title = sideA;
    perspectiveA.subtitle = `Arguments, Strengths & Ecosystem for ${sideA}`;
    perspectiveB.title = sideB;
    perspectiveB.subtitle = `Arguments, Strengths & Ecosystem for ${sideB}`;

    results.forEach(res => {
      const text = `${res.title} ${res.cleanSnippet || ''}`.toLowerCase();
      const mentionsA = text.includes(vsMatch[1].trim().toLowerCase());
      const mentionsB = text.includes(vsMatch[2].trim().toLowerCase());

      if (mentionsA && !mentionsB) {
        perspectiveA.items.push(res);
      } else if (mentionsB && !mentionsA) {
        perspectiveB.items.push(res);
      } else {
        // Shared or comparison article
        if (perspectiveA.items.length <= perspectiveB.items.length) {
          perspectiveA.items.push(res);
        } else {
          perspectiveB.items.push(res);
        }
      }
    });
  } else {
    // Default Dialectic: Advantages & Strengths vs Critical Skepticism / Realities
    perspectiveA.title = 'Benefits & Realized Strengths';
    perspectiveA.subtitle = 'Documented value, proven use-cases, and community recommendations';

    perspectiveB.title = 'Known Bottlenecks & Skepticism';
    perspectiveB.subtitle = 'Real-world gotchas, community complaints, and alternative approaches';

    const positiveSignals = ['great', 'fast', 'love', 'best', 'benefit', 'powerful', 'advantage', 'easy', 'recommend', 'pro'];
    const negativeSignals = ['slow', 'bad', 'issue', 'problem', 'flaw', 'con', 'avoid', 'expensive', 'overrated', 'hate', 'drawback', 'caveat'];

    results.forEach(res => {
      const text = `${res.title} ${res.cleanSnippet || ''}`.toLowerCase();
      let posScore = 0;
      let negScore = 0;

      positiveSignals.forEach(w => { if (text.includes(w)) posScore++; });
      negativeSignals.forEach(w => { if (text.includes(w)) negScore++; });

      if (posScore >= negScore) {
        perspectiveA.items.push(res);
      } else {
        perspectiveB.items.push(res);
      }
    });
  }

  // Ensure balance if one side is empty
  if (perspectiveA.items.length === 0 && perspectiveB.items.length > 0) {
    const half = Math.ceil(perspectiveB.items.length / 2);
    perspectiveA.items = perspectiveB.items.slice(0, half);
    perspectiveB.items = perspectiveB.items.slice(half);
  } else if (perspectiveB.items.length === 0 && perspectiveA.items.length > 0) {
    const half = Math.ceil(perspectiveA.items.length / 2);
    perspectiveB.items = perspectiveA.items.slice(half);
    perspectiveA.items = perspectiveA.items.slice(0, half);
  }

  // Extract key claims / bullets for each side
  perspectiveA.keyClaims = extractClaims(perspectiveA.items);
  perspectiveB.keyClaims = extractClaims(perspectiveB.items);

  return {
    isDebate: vsMatch || orMatch || prosConsMatch || results.length > 3,
    perspectiveA,
    perspectiveB
  };
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function extractClaims(items) {
  const claims = [];
  items.slice(0, 4).forEach(item => {
    const rawSnippet = item.cleanSnippet || item.snippet || item.title || '';
    // Strip telemetry badges and tags
    const text = rawSnippet
      .replace(/^★\s*[\d,]+\s*stars\s*\|\s*Forks:\s*\d+\.?/i, '')
      .replace(/^\d+\s*points\s*\|\s*\d+\s*comments\s*by\s*[^.]+\.?/i, '')
      .replace(/^\[[^\]]+\]/g, '')
      .trim();

    const sentences = text
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 25 && s.length < 150 && !/^\d+\s*points/i.test(s) && !/^★/i.test(s));

    if (sentences[0]) {
      claims.push(sentences[0]);
    } else if (item.title && item.title.length > 15) {
      const cleanTitle = item.title.replace(/^\[[^\]]+\]\s*/, '').trim();
      claims.push(cleanTitle);
    }
  });

  return Array.from(new Set(claims)).slice(0, 3);
}
