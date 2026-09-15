import axios from 'axios';
import * as cheerio from 'cheerio';
import net from 'net';
import dns from 'dns';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 (PRISM Browser Reader)';

function isBlockedIP(ip) {
  if (!ip) return true;
  if (ip === '127.0.0.1' || ip === '::1' || ip === '0.0.0.0') return true;
  
  if (net.isIPv4(ip)) {
    const parts = ip.split('.').map(Number);
    if (parts[0] === 10) return true; // 10.0.0.0/8
    if (parts[0] === 127) return true; // 127.0.0.0/8
    if (parts[0] === 169 && parts[1] === 254) return true; // 169.254.0.0/16 Link-local & cloud metadata
    if (parts[0] === 172 && (parts[1] >= 16 && parts[1] <= 31)) return true; // 172.16.0.0/12
    if (parts[0] === 192 && parts[1] === 168) return true; // 192.168.0.0/16
    if (parts[0] === 0) return true;
  } else if (net.isIPv6(ip)) {
    const normalized = ip.toLowerCase();
    if (normalized === '::1' || normalized.startsWith('fe80:') || normalized.startsWith('fc') || normalized.startsWith('fd')) {
      return true;
    }
  }
  return false;
}

async function validateUrlSafety(targetUrl) {
  let formattedUrl = targetUrl.trim();
  if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
    formattedUrl = 'https://' + formattedUrl;
  }

  let parsed;
  try {
    parsed = new URL(formattedUrl);
  } catch {
    throw new Error('Malformed URL format.');
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Only HTTP and HTTPS protocols are permitted.');
  }

  const hostname = parsed.hostname.toLowerCase();
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname === '::1' ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.local') ||
    hostname === 'metadata.google.internal' ||
    hostname === 'instance-data'
  ) {
    throw new Error('Access to private or internal infrastructure addresses is prohibited.');
  }

  if (net.isIP(hostname)) {
    if (isBlockedIP(hostname)) {
      throw new Error('Access to private or internal IP addresses is prohibited.');
    }
  } else {
    try {
      const lookupResult = await dns.promises.lookup(hostname);
      if (isBlockedIP(lookupResult.address)) {
        throw new Error('Domain resolves to a prohibited internal or private IP address.');
      }
    } catch (err) {
      if (err.message.includes('prohibited')) throw err;
      throw new Error(`Domain resolution failed for "${hostname}".`);
    }
  }

  return { formattedUrl, hostname: parsed.hostname.replace(/^www\./, '') };
}

export async function extractReadablePage(targetUrl) {
  let validation;
  try {
    validation = await validateUrlSafety(targetUrl);
  } catch (validationErr) {
    return {
      success: false,
      url: targetUrl,
      hostname: 'Security Blocked',
      title: 'Request Blocked by Security Policy',
      error: validationErr.message,
      fallbackUrl: null
    };
  }

  const { formattedUrl, hostname } = validation;

  try {
    const res = await axios.get(formattedUrl, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      timeout: 5000,
      maxRedirects: 4,
      maxContentLength: 3 * 1024 * 1024 // 3MB max payload protection
    });

    const $ = cheerio.load(res.data);

    // Remove noise elements
    $('script, style, noscript, iframe, svg, nav, footer, header, form, [role="banner"], [role="navigation"], .ads, .ad, .advertisement, .cookie-banner, .popup, #comments').remove();

    const title = $('meta[property="og:title"]').attr('content') ||
                  $('title').text().trim() ||
                  $('h1').first().text().trim() ||
                  hostname;

    const description = $('meta[property="og:description"]').attr('content') ||
                        $('meta[name="description"]').attr('content') ||
                        '';

    const leadImage = $('meta[property="og:image"]').attr('content') || null;
    const author = $('meta[name="author"]').attr('content') ||
                   $('meta[property="article:author"]').attr('content') ||
                   null;

    // Extract main text content from article, main, or high-density p tags
    let mainContainer = $('article, main, .post-content, .article-content, .entry-content').first();
    if (!mainContainer.length) {
      mainContainer = $('body');
    }

    const paragraphs = [];
    mainContainer.find('p, h2, h3, blockquote, li').each((_, el) => {
      const tag = el.tagName.toLowerCase();
      const text = $(el).text().replace(/\s+/g, ' ').trim();
      if (text.length > 25) {
        paragraphs.push({ tag, text });
      }
    });

    // Estimate read time
    const totalWords = paragraphs.reduce((acc, p) => acc + p.text.split(' ').length, 0);
    const readTime = Math.max(1, Math.round(totalWords / 200));

    return {
      success: true,
      url: formattedUrl,
      hostname,
      title: cleanText(title),
      description: cleanText(description),
      author,
      leadImage,
      paragraphs: paragraphs.slice(0, 50),
      readTime: `${readTime} min read`,
      totalWords
    };
  } catch (err) {
    console.warn(`Reader extraction notice for ${formattedUrl}:`, err.message);
    return {
      success: false,
      url: formattedUrl,
      hostname,
      title: hostname,
      error: `Could not load page directly (${err.message}). The site may prevent external reader extraction or timed out.`,
      fallbackUrl: formattedUrl
    };
  }
}

function cleanText(text) {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim();
}

