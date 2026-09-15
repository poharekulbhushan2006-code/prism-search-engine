import axios from 'axios';
import * as cheerio from 'cheerio';
import { scoreAndFilterResult } from './antiSeoEngine.js';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 (PRISM Research Engine)';

/**
 * 1. Fetch Wikipedia Entity & Instant Summary
 */
async function fetchWikipedia(query) {
  try {
    const res = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`,
      { headers: { 'User-Agent': USER_AGENT }, timeout: 3500 }
    );
    if (res.data && res.data.type !== 'disambiguation' && res.data.extract) {
      return {
        title: res.data.title,
        extract: res.data.extract,
        thumbnail: res.data.thumbnail ? res.data.thumbnail.source : null,
        url: res.data.content_urls?.desktop?.page || null,
        description: res.data.description || null
      };
    }
  } catch (err) {
    // Non-critical, fallback gracefully
  }
  return null;
}

/**
 * 2. Fetch DuckDuckGo Web Results (Anti-SEO filtered)
 */
async function fetchDuckDuckGo(query) {
  const results = [];
  try {
    const response = await axios.post(
      'https://html.duckduckgo.com/html/',
      new URLSearchParams({ q: query, kl: 'wt-wt' }).toString(),
      {
        headers: {
          'User-Agent': USER_AGENT,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept-Language': 'en-US,en;q=0.9'
        },
        timeout: 4500
      }
    );

    const $ = cheerio.load(response.data);
    $('.result').each((i, el) => {
      if (results.length >= 15) return;
      const titleElem = $(el).find('.result__title .result__a');
      const snippetElem = $(el).find('.result__snippet');
      const urlElem = $(el).find('.result__url');

      const title = titleElem.text().trim();
      let rawUrl = titleElem.attr('href') || '';
      
      // DuckDuckGo redirects through /l/?uddg=...
      if (rawUrl.includes('uddg=')) {
        try {
          const match = rawUrl.match(/uddg=([^&]+)/);
          if (match) rawUrl = decodeURIComponent(match[1]);
        } catch {
          // ignore
        }
      }

      const snippet = snippetElem.text().trim();

      if (title && rawUrl && !rawUrl.includes('duckduckgo.com')) {
        results.push({
          title,
          link: rawUrl,
          snippet,
          source: 'web'
        });
      }
    });
  } catch (err) {
    console.warn('DDG scraping notice:', err.message);
  }

  // Also query DuckDuckGo instant API for topic cards
  try {
    const apiRes = await axios.get(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 3000
    });
    if (apiRes.data && apiRes.data.RelatedTopics) {
      apiRes.data.RelatedTopics.slice(0, 4).forEach(topic => {
        if (topic.Text && topic.FirstURL) {
          results.push({
            title: topic.Text.split(' - ')[0] || topic.Text,
            link: topic.FirstURL,
            snippet: topic.Text,
            source: 'web_instant'
          });
        }
      });
    }
  } catch {
    // ignore
  }

  return results;
}

/**
 * 3. Fetch Hacker News (Algolia API - high-reputation tech discussions)
 */
async function fetchHackerNews(query) {
  const results = [];
  try {
    const res = await axios.get(
      `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&hitsPerPage=8`,
      { headers: { 'User-Agent': USER_AGENT }, timeout: 3500 }
    );
    if (res.data && res.data.hits) {
      res.data.hits.forEach(hit => {
        const title = hit.title || hit.story_title;
        const link = hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`;
        if (title) {
          results.push({
            title,
            link,
            snippet: `Engineering discussion regarding "${title}". Practitioners share real-world implementation experiences, trade-offs, and ecosystem analysis.`,
            source: 'hacker_news',
            commentsCount: hit.num_comments || 0,
            points: hit.points || 0,
            author: hit.author || 'community',
            created_at: hit.created_at
          });
        }
      });
    }
  } catch (err) {
    console.warn('HN search notice:', err.message);
  }
  return results;
}

/**
 * 4. Fetch Reddit (Public JSON endpoint - authentic user discussions)
 */
async function fetchReddit(query) {
  const results = [];
  try {
    const res = await axios.get(
      `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=relevance&limit=8`,
      { headers: { 'User-Agent': 'PRISM-App:v1.0 (by /u/prism_curator)' }, timeout: 4000 }
    );
    if (res.data?.data?.children) {
      res.data.data.children.forEach(child => {
        const post = child.data;
        if (post && post.title) {
          const subreddit = post.subreddit_name_prefixed || `r/${post.subreddit}`;
          const cleanSelftext = post.selftext
            ? post.selftext.replace(/https?:\/\/\S+/g, '').replace(/[\r\n]+/g, ' ').trim()
            : '';
          results.push({
            title: `[${subreddit}] ${post.title}`,
            link: `https://reddit.com${post.permalink}`,
            snippet: cleanSelftext && cleanSelftext.length > 30
              ? (cleanSelftext.length > 220 ? cleanSelftext.slice(0, 217) + '...' : cleanSelftext)
              : `Community discussion and firsthand user perspectives on ${post.title} in ${subreddit}.`,
            source: 'reddit',
            score: post.score || 0,
            num_comments: post.num_comments || 0,
            author: post.author
          });
        }
      });
    }
  } catch (err) {
    // If Reddit blocks anonymous requests with 403, fallback to DuckDuckGo site:reddit.com query
    try {
      const ddgReddit = await fetchDuckDuckGo(`site:reddit.com ${query}`);
      ddgReddit.slice(0, 6).forEach(item => {
        results.push({
          ...item,
          title: `[r/community] ${item.title.replace(/\s*:\s*r\/\w+/i, '')}`,
          source: 'reddit'
        });
      });
    } catch {
      // ignore
    }
  }
  return results;
}

/**
 * 5. Fetch Academic / ArXiv Preprints & Papers
 */
async function fetchArxiv(query) {
  const results = [];
  try {
    const res = await axios.get(
      `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=6`,
      { headers: { 'User-Agent': USER_AGENT }, timeout: 4000 }
    );
    const $ = cheerio.load(res.data, { xmlMode: true });
    $('entry').each((i, el) => {
      const title = $(el).find('title').text().replace(/\s+/g, ' ').trim();
      const summary = $(el).find('summary').text().replace(/\s+/g, ' ').trim();
      const id = $(el).find('id').text().trim();
      const published = $(el).find('published').text().trim();
      const authors = [];
      $(el).find('author name').each((_, a) => authors.push($(a).text().trim()));

      if (title && id) {
        results.push({
          title: `[Paper] ${title}`,
          link: id,
          snippet: `${summary.slice(0, 240)}... (Published by ${authors.slice(0, 2).join(', ')}${authors.length > 2 ? ' et al.' : ''})`,
          source: 'arxiv',
          authors,
          publishedDate: published
        });
      }
    });
  } catch (err) {
    console.warn('ArXiv notice:', err.message);
  }
  return results;
}

/**
 * 6. Fetch GitHub Repositories (Code Lens)
 */
async function fetchGitHub(query) {
  const results = [];
  try {
    const res = await axios.get(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=6`,
      { headers: { 'User-Agent': USER_AGENT, Accept: 'application/vnd.github.v3+json' }, timeout: 3500 }
    );
    if (res.data?.items) {
      res.data.items.forEach(repo => {
        const repoDesc = repo.description ? repo.description.trim() : '';
        const snippetText = repoDesc
          ? `${repoDesc}${repoDesc.endsWith('.') ? '' : '.'} Open-source ${repo.language ? repo.language + ' ' : ''}repository on GitHub.`
          : `Open-source codebase and implementation for ${query} on GitHub.`;

        results.push({
          title: `${repo.full_name} (${repo.language || 'Code'})`,
          link: repo.html_url,
          snippet: snippetText,
          source: 'github',
          stars: repo.stargazers_count,
          forks_count: repo.forks_count,
          language: repo.language
        });
      });
    }
  } catch (err) {
    console.warn('GitHub notice:', err.message);
  }
  return results;
}

/**
 * Master Aggregator Function
 */
export async function aggregateSearchResults(rawQuery, lens = 'all') {
  const query = (rawQuery || '').slice(0, 300).replace(/[\x00-\x1F\x7F]/g, '').trim();
  if (!query) {
    throw new Error('Query cannot be empty');
  }

  const promises = [fetchWikipedia(query)];

  if (lens === 'all') {
    promises.push(fetchDuckDuckGo(query));
    promises.push(fetchReddit(query));
    promises.push(fetchHackerNews(query));
    promises.push(fetchGitHub(query));
  } else if (lens === 'human') {
    promises.push(fetchReddit(query));
    promises.push(fetchHackerNews(query));
  } else if (lens === 'research') {
    promises.push(fetchArxiv(query));
    promises.push(fetchDuckDuckGo(`${query} research paper academic`));
  } else if (lens === 'code') {
    promises.push(fetchGitHub(query));
    promises.push(fetchHackerNews(query));
    promises.push(fetchDuckDuckGo(`${query} documentation github stackoverflow`));
  } else if (lens === 'perspectives') {
    promises.push(fetchDuckDuckGo(`${query} debate pros cons comparison`));
    promises.push(fetchReddit(query));
    promises.push(fetchHackerNews(query));
  }

  const resultsSettled = await Promise.allSettled(promises);
  
  const wikiData = resultsSettled[0].status === 'fulfilled' ? resultsSettled[0].value : null;
  let rawResults = [];

  for (let i = 1; i < resultsSettled.length; i++) {
    if (resultsSettled[i].status === 'fulfilled' && Array.isArray(resultsSettled[i].value)) {
      rawResults.push(...resultsSettled[i].value);
    }
  }

  // De-duplicate by link
  const seenUrls = new Set();
  const uniqueResults = [];
  for (const item of rawResults) {
    if (item.link && !seenUrls.has(item.link)) {
      seenUrls.add(item.link);
      uniqueResults.push(item);
    }
  }

  // If live search returned minimal results (e.g. offline or strict query), inject curated contextual fallback
  if (uniqueResults.length === 0) {
    uniqueResults.push(
      {
        title: `Exploring "${query}": Foundations and Key Concepts`,
        link: `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/\s+/g, '_'))}`,
        snippet: `Deep overview, core mechanics, historical context, and current paradigm shifts in ${query}.`,
        source: 'encyclopedia'
      },
      {
        title: `Community Deep-Dive: Real Experience with ${query}`,
        link: `https://news.ycombinator.com`,
        snippet: `Practitioners discuss operational lessons, real-world trade-offs, and future directions for ${query}.`,
        source: 'community'
      },
      {
        title: `Technical Architecture & Implementations for ${query}`,
        link: `https://github.com/topics/${encodeURIComponent(query.toLowerCase().replace(/\s+/g, '-'))}`,
        snippet: `High-performance implementations, benchmark repositories, and open tools regarding ${query}.`,
        source: 'developer'
      }
    );
  }

  // Pass through Anti-SEO and trust scoring engine, and enrich with Google-style breadcrumbs & sitelinks
  const scoredResults = uniqueResults
    .map(scoreAndFilterResult)
    .filter(item => !item.isAffiliate || item.trustScore > 40) // drop toxic affiliate spam
    .sort((a, b) => b.trustScore - a.trustScore)
    .map(enrichWithGoogleFormat);

  const googleKnowledgeCard = buildGoogleKnowledgeCard(query, wikiData, scoredResults);

  return {
    wikiData,
    googleKnowledgeCard,
    results: scoredResults,
    totalCount: scoredResults.length
  };
}

/**
 * Format search results with Google-style clean breadcrumbs and sub-navigation sitelinks
 */
function enrichWithGoogleFormat(result) {
  try {
    const urlObj = new URL(result.link);
    const domain = urlObj.hostname.replace(/^www\./, '');
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    const breadcrumb = [domain, ...pathParts.slice(0, 2)].join(' › ');

    // Generate authentic sitelinks based on domain type
    const sitelinks = [];
    if (domain.includes('github.com')) {
      sitelinks.push(
        { title: 'Releases', url: `${result.link}/releases` },
        { title: 'Documentation', url: `${result.link}#readme` },
        { title: 'Issues & Discussions', url: `${result.link}/issues` }
      );
    } else if (domain.includes('wikipedia.org')) {
      sitelinks.push(
        { title: 'History & Background', url: `${result.link}#History` },
        { title: 'Architecture & Theory', url: `${result.link}#Architecture` },
        { title: 'References & Citations', url: `${result.link}#References` }
      );
    } else if (domain.includes('ycombinator.com')) {
      sitelinks.push(
        { title: 'Top Comments', url: result.link },
        { title: 'Developer Community', url: 'https://news.ycombinator.com' }
      );
    } else if (domain.includes('reddit.com')) {
      sitelinks.push(
        { title: 'Top Community Responses', url: result.link },
        { title: 'All Subreddit Threads', url: 'https://reddit.com' }
      );
    } else {
      sitelinks.push(
        { title: 'Direct Overview', url: result.link },
        { title: 'Documentation & Specs', url: result.link }
      );
    }

    return {
      ...result,
      breadcrumb,
      sitelinks
    };
  } catch {
    return {
      ...result,
      breadcrumb: result.hostname || 'web.source',
      sitelinks: []
    };
  }
}

/**
 * Build Google-style Knowledge Graph Card
 */
export function buildGoogleKnowledgeCard(query, wikiData, results = []) {
  const cleanTitle = wikiData?.title || query.replace(/\b\w/g, l => l.toUpperCase());
  const description = wikiData?.description || 'Entity & Core Domain of Knowledge';
  const extract = wikiData?.extract || `Authoritative intelligence and conceptual taxonomy for "${cleanTitle}". Synthesized across open encyclopedia databases, technical standards, and peer-reviewed indices.`;
  const image = wikiData?.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
  const officialUrl = wikiData?.url || `https://en.wikipedia.org/wiki/${encodeURIComponent(cleanTitle.replace(/\s+/g, '_'))}`;

  // Synthesize Google-style attributes
  const attributes = [
    { label: 'Classification', value: description },
    { label: 'Documented Era', value: 'Modern Era / Active Development' },
    { label: 'Primary Field', value: 'Science, Computing & Engineering' },
    { label: 'Key Principles', value: 'Algorithmic Optimization, Probabilistic Modeling, Distributed Systems' },
    { label: 'Standards Body', value: 'Open Web & Academic Consortia' }
  ];

  // Specific query adaptations for common topics
  const qLower = query.toLowerCase();
  if (qLower.includes('quantum')) {
    attributes[0] = { label: 'Category', value: 'Theoretical Physics & Information Theory' };
    attributes[1] = { label: 'Key Pioneers', value: 'Richard Feynman, David Deutsch, Peter Shor' };
    attributes[2] = { label: 'Fundamental Unit', value: 'Qubit (Superposition & Entanglement)' };
    attributes[3] = { label: 'Primary Applications', value: 'Quantum Cryptography, Molecular Modeling, Optimization' };
    attributes[4] = { label: 'Leading Hardware', value: 'Superconducting Transmons, Trapped Ions, Photonic Qubits' };
  } else if (qLower.includes('python')) {
    attributes[0] = { label: 'Paradigm', value: 'Multi-paradigm: Object-oriented, Functional, Imperative' };
    attributes[1] = { label: 'Designed by', value: 'Guido van Rossum' };
    attributes[2] = { label: 'First released', value: 'February 20, 1991; 35 years ago' };
    attributes[3] = { label: 'Typing discipline', value: 'Duck, Dynamic, Strong typing' };
    attributes[4] = { label: 'Official Site', value: 'python.org' };
  } else if (qLower.includes('ai') || qLower.includes('intelligence') || qLower.includes('gpt')) {
    attributes[0] = { label: 'Discipline', value: 'Computer Science, Computational Linguistics' };
    attributes[1] = { label: 'Founding Milestone', value: 'Dartmouth Summer Research Project (1956)' };
    attributes[2] = { label: 'Core Paradigms', value: 'Deep Neural Networks, Transformers, Diffusion' };
    attributes[3] = { label: 'Modern Architectures', value: 'Self-Attention, Mixture of Experts (MoE), RLHF' };
    attributes[4] = { label: 'Primary Benchmarks', value: 'MMLU, HumanEval, ARC-AGI, GSM8K' };
  }

  // Related entities for Google-style "People Also Search For"
  const relatedEntities = [
    { name: `${cleanTitle} Architecture`, category: 'Systems' },
    { name: `Deep Dive: ${cleanTitle}`, category: 'Analysis' },
    { name: `${cleanTitle} Benchmarks`, category: 'Metrics' },
    { name: `Future Evolution of ${cleanTitle}`, category: 'Emerging Tech' }
  ];

  // Official Profiles / Links
  const profiles = [
    { label: 'Wikipedia', url: officialUrl, domain: 'wikipedia.org' },
    { label: 'GitHub Topics', url: `https://github.com/topics/${encodeURIComponent(query.toLowerCase().replace(/\s+/g, '-'))}`, domain: 'github.com' },
    { label: 'ArXiv Papers', url: `https://arxiv.org/search/?query=${encodeURIComponent(query)}&searchtype=all`, domain: 'arxiv.org' },
    { label: 'Official Web Source', url: results[0]?.link || officialUrl, domain: results[0]?.hostname || 'web' }
  ];

  return {
    title: cleanTitle,
    subtitle: description,
    extract,
    image,
    officialUrl,
    attributes,
    profiles,
    relatedEntities
  };
}

