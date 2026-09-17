/**
 * PRISM Page Metadata & Dynamic SEO Engine
 * Manages document title, meta descriptions, and Open Graph tags per page/view.
 */

const BASE_URL = 'https://prism-search.vercel.app';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

export const PAGE_SEO_CONFIGS = {
  home: {
    title: 'PRISM — Next-Gen AI Search & Private Hybrid Browser',
    description: 'PRISM is a next-gen hybrid AI search engine and private browser featuring zero-SEO noise, interactive flowcharts, dynamic comparison tables, and ad-free utilities.',
    canonical: `${BASE_URL}/`
  },
  search: {
    title: (query) => query ? `"${query}" — PRISM Search` : 'Search — PRISM',
    description: (query) => query
      ? `Audited, anti-SEO search intelligence and AI overview synthesis for "${query}" on PRISM.`
      : 'Explore audited, high-signal search results on PRISM.',
    canonical: `${BASE_URL}/search`
  },
  reader: {
    title: (pageTitle) => pageTitle ? `${pageTitle} — PRISM Reader` : 'Reader View — PRISM',
    description: 'Distraction-free, zero-ad article reader with executive dossier and citation auditing.',
    canonical: `${BASE_URL}/reader`
  },
  maps: {
    title: 'PRISM Maps — Real-Time Geospatial Intelligence',
    description: 'Interactive vector mapping, privacy-preserving location search, and route navigation on PRISM.',
    canonical: `${BASE_URL}/maps`
  },
  tube: {
    title: 'PRISM Tube — Ad-Free High-Signal Video Discovery',
    description: 'Ad-free video streaming, chapter breakdown, and timeline takeaway extraction on PRISM Tube.',
    canonical: `${BASE_URL}/tube`
  },
  mail: {
    title: 'PRISM Mail — Encrypted Private Communication',
    description: 'Zero-telemetry encrypted email client with AI composing assistance and complete privacy.',
    canonical: `${BASE_URL}/mail`
  },
  privacy: {
    title: 'Privacy Policy & Zero-Telemetry Charter — PRISM',
    description: 'PRISM zero-telemetry charter: no tracking cookies, no search history monetization, local storage encryption, and GDPR/CCPA compliance.',
    canonical: `${BASE_URL}/privacy`
  },
  terms: {
    title: 'Terms of Service & Operational Agreement — PRISM',
    description: 'Terms governing usage of PRISM search, browser features, AI synthesis tools, and fair-use indexing.',
    canonical: `${BASE_URL}/terms`
  },
  'thank-you': {
    title: 'Thank You & Onboarding — PRISM',
    description: 'Thank you for choosing PRISM. Explore next-generation private search, apps, and browser features.',
    canonical: `${BASE_URL}/thank-you`
  },
  404: {
    title: '404 — Page Not Found | PRISM',
    description: 'The requested page or query vector could not be found on PRISM.',
    canonical: `${BASE_URL}/404`
  }
};

/**
 * Dynamically updates document title, description, and social meta tags in the DOM
 */
export function updatePageMetadata(pageType, dynamicParam = '', customOverrides = {}) {
  const config = PAGE_SEO_CONFIGS[pageType] || PAGE_SEO_CONFIGS.home;

  let title = typeof config.title === 'function' ? config.title(dynamicParam) : config.title;
  let description = typeof config.description === 'function' ? config.description(dynamicParam) : config.description;
  let canonical = config.canonical || BASE_URL;
  let ogImage = customOverrides.ogImage || DEFAULT_OG_IMAGE;

  if (customOverrides.title) title = customOverrides.title;
  if (customOverrides.description) description = customOverrides.description;

  // 1. Update document title
  document.title = title;

  // 2. Helper to set or create meta tags
  const setMeta = (nameOrProperty, value, isProperty = false) => {
    const attr = isProperty ? 'property' : 'name';
    let element = document.querySelector(`meta[${attr}="${nameOrProperty}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attr, nameOrProperty);
      document.head.appendChild(element);
    }
    element.setAttribute('content', value);
  };

  // 3. Update Standard Meta Description
  setMeta('description', description);

  // 4. Update Open Graph Tags
  setMeta('og:title', title, true);
  setMeta('og:description', description, true);
  setMeta('og:url', canonical, true);
  setMeta('og:image', ogImage, true);

  // 5. Update Twitter Cards
  setMeta('twitter:title', title);
  setMeta('twitter:description', description);
  setMeta('twitter:image', ogImage);

  // 6. Update Canonical Link
  let canonicalEl = document.querySelector('link[rel="canonical"]');
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', canonical);
}
