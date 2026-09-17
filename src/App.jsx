import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BrowserChrome from './components/BrowserChrome';
import SpeedDial from './components/SpeedDial';
import LensBar from './components/LensBar';
import QuickDossier from './components/QuickDossier';
import ResultsStream from './components/ResultsStream';
import KnowledgeGraphView from './components/KnowledgeGraphView';
import PerspectiveSplitView from './components/PerspectiveSplitView';
import ReaderView from './components/ReaderView';
import ResearchPinboard from './components/ResearchPinboard';
import SourceRail from './components/SourceRail';
import AIAnswerSection from './components/AIAnswerSection';
import FollowUpChat from './components/FollowUpChat';
import RelatedExploration from './components/RelatedExploration';
import PrismBackground from './components/PrismBackground';
import AuthModal from './components/AuthModal';
import ErrorBoundary from './components/ErrorBoundary';
import AnimatedFlowchart from './components/AnimatedFlowchart';
import AnimatedComparisonTable from './components/AnimatedComparisonTable';
import PeopleAlsoAsk from './components/PeopleAlsoAsk';
import InstallModal from './components/InstallModal';
import SafariBottomBar from './components/SafariBottomBar';
import PrismMaps from './components/PrismMaps';
import PrismTube from './components/PrismTube';
import PrismMail from './components/PrismMail';
import NotFoundPage from './components/NotFoundPage';
import ThankYouPage from './components/ThankYouPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsPage from './components/TermsPage';
import CookieBanner from './components/CookieBanner';
import StickyMobileCTA from './components/StickyMobileCTA';
import ResultsSkeleton from './components/ResultsSkeleton';
import SiteFooter from './components/SiteFooter';
import { RealtimeColorsProvider } from './components/RealtimeColors';
import { HaikeiLayeredWaves, HaikeiFluidBlobs } from './components/HaikeiBackgrounds';
import { MotionFadeIn, MotionScale } from './components/MotionPrimitives';
import AppOpeningSplash from './components/AppOpeningSplash';
import { updatePageMetadata } from './utils/seo';
import { analytics } from './utils/analytics';
import { ShieldAlert, Sparkles, Filter, Clock } from 'lucide-react';

const INITIAL_TAB = {
  id: 'tab-init',
  title: 'PRISM Browser',
  url: '',
  type: 'home', // 'home' | 'search' | 'reader' | 'privacy' | 'terms' | 'thank-you' | '404'
  data: null,
  history: [{ type: 'home', url: '', title: 'PRISM Browser' }],
  historyIndex: 0
};

function getInitialTabFromLocation() {
  if (typeof window === 'undefined') return INITIAL_TAB;

  const path = window.location.pathname.toLowerCase();
  const searchParams = new URLSearchParams(window.location.search);
  const q = searchParams.get('q');

  if (q) {
    return {
      id: 'tab-init',
      title: `${q} — PRISM Search`,
      url: q,
      type: 'search',
      data: null,
      history: [{ type: 'search', url: q, title: `${q} — PRISM Search` }],
      historyIndex: 0
    };
  }

  if (path === '/' || path === '') {
    return INITIAL_TAB;
  }
  if (path === '/privacy') {
    return {
      id: 'tab-init',
      title: 'Privacy Policy',
      url: 'prism://privacy',
      type: 'privacy',
      data: null,
      history: [{ type: 'privacy', url: 'prism://privacy', title: 'Privacy Policy' }],
      historyIndex: 0
    };
  }
  if (path === '/terms') {
    return {
      id: 'tab-init',
      title: 'Terms and Conditions',
      url: 'prism://terms',
      type: 'terms',
      data: null,
      history: [{ type: 'terms', url: 'prism://terms', title: 'Terms and Conditions' }],
      historyIndex: 0
    };
  }
  if (path === '/thank-you') {
    return {
      id: 'tab-init',
      title: 'Thank You',
      url: 'prism://thank-you',
      type: 'thank-you',
      data: null,
      history: [{ type: 'thank-you', url: 'prism://thank-you', title: 'Thank You' }],
      historyIndex: 0
    };
  }
  if (path === '/maps') {
    return {
      id: 'tab-init',
      title: 'PRISM Maps',
      url: 'Tokyo',
      type: 'maps',
      data: null,
      history: [{ type: 'maps', url: 'Tokyo', title: 'PRISM Maps' }],
      historyIndex: 0
    };
  }
  if (path === '/tube') {
    return {
      id: 'tab-init',
      title: 'PRISM Tube',
      url: '',
      type: 'tube',
      data: null,
      history: [{ type: 'tube', url: '', title: 'PRISM Tube' }],
      historyIndex: 0
    };
  }
  if (path === '/mail') {
    return {
      id: 'tab-init',
      title: 'PRISM Mail',
      url: 'prism://mail',
      type: 'mail',
      data: null,
      history: [{ type: 'mail', url: 'prism://mail', title: 'PRISM Mail' }],
      historyIndex: 0
    };
  }
  // Unknown route -> 404
  return {
    id: 'tab-init',
    title: '404 Page Not Found',
    url: 'prism://404',
    type: '404',
    data: null,
    history: [{ type: '404', url: 'prism://404', title: '404 Page Not Found' }],
    historyIndex: 0
  };
}

export default function App() {
  const [tabs, setTabs] = useState(() => [getInitialTabFromLocation()]);
  const [activeTabId, setActiveTabId] = useState('tab-init');
  const [currentLens, setCurrentLens] = useState(() => {
    try {
      const savedUser = localStorage.getItem('prism_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        if (u?.preferences?.defaultLens) return u.preferences.defaultLens;
      }
    } catch {}
    return 'all';
  });
  const [currentView, setCurrentView] = useState('stream'); // 'stream' | 'graph' | 'split'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // User Authentication & Cloud Account State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('prism_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('prism_token') || null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchesCount, setSearchesCount] = useState(() => {
    return parseInt(localStorage.getItem('prism_searches_count') || '14', 10);
  });

  // PWA Device Installation State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleAuthSuccess = (user, token) => {
    setCurrentUser(user);
    setAuthToken(token);
    try {
      localStorage.setItem('prism_user', JSON.stringify(user));
      localStorage.setItem('prism_token', token);
    } catch {
      // ignore
    }
  };

  const handleLogout = async () => {
    if (authToken) {
      try {
        await axios.post('/api/auth/logout', {}, { headers: { Authorization: `Bearer ${authToken}` } });
      } catch {
        // ignore
      }
    }
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem('prism_user');
    localStorage.removeItem('prism_token');
  };

  // Pinboard Workbench State with LocalStorage
  const [pinnedItems, setPinnedItems] = useState(() => {
    try {
      const saved = localStorage.getItem('prism_pinned_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isPinboardOpen, setIsPinboardOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('prism_pinned_items', JSON.stringify(pinnedItems));
    } catch {
      // ignore
    }
  }, [pinnedItems]);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const handleLaunchApp = (appType, query = '') => {
    let title = 'PRISM App';
    let url = query || '';
    if (appType === 'maps') {
      title = query ? `Maps: ${query}` : 'PRISM Maps';
      url = query || 'Tokyo';
    } else if (appType === 'tube') {
      title = query ? `Tube: ${query}` : 'PRISM Tube';
      url = query || '';
    } else if (appType === 'mail') {
      title = 'PRISM Mail';
      url = 'prism://mail';
    } else if (appType === 'home' || appType === 'browser') {
      title = 'PRISM Browser';
      url = '';
    }

    const newTab = {
      id: `tab-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title,
      url,
      type: appType === 'browser' ? 'home' : appType,
      data: null,
      history: [{ type: appType === 'browser' ? 'home' : appType, url, title }],
      historyIndex: 0
    };

    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  // 0a. Execute initial search if ?q= was provided on load
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const initialQ = searchParams.get('q');
    if (initialQ) {
      executeSearchInTab(initialQ, currentLens);
    }
  }, []);

  // 0b. Synchronize document title, meta descriptions, Open Graph tags & URL (Items 2, 3, 18)
  useEffect(() => {
    if (!activeTab) return;

    let path = '/';
    let dynamicParam = '';

    if (activeTab.type === 'home') {
      path = '/';
    } else if (activeTab.type === 'search') {
      path = `/search?q=${encodeURIComponent(activeTab.url || '')}`;
      dynamicParam = activeTab.url || '';
    } else if (activeTab.type === 'reader') {
      path = '/reader';
      dynamicParam = activeTab.data?.title || activeTab.url || '';
    } else if (activeTab.type === 'privacy') {
      path = '/privacy';
    } else if (activeTab.type === 'terms') {
      path = '/terms';
    } else if (activeTab.type === 'thank-you') {
      path = '/thank-you';
    } else if (activeTab.type === '404') {
      path = '/404';
    } else if (activeTab.type === 'maps') {
      path = '/maps';
    } else if (activeTab.type === 'tube') {
      path = '/tube';
    } else if (activeTab.type === 'mail') {
      path = '/mail';
    }

    if (window.location.pathname + window.location.search !== path) {
      window.history.pushState({ tabId: activeTab.id, type: activeTab.type }, '', path);
    }

    updatePageMetadata(activeTab.type, dynamicParam);
    analytics.trackPageView(path);
  }, [activeTabId, activeTab?.type, activeTab?.url, activeTab?.data?.title]);

  // 0c. Listen to browser Back/Forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const initTab = getInitialTabFromLocation();
      setTabs((prev) => {
        const found = prev.find((t) => t.type === initTab.type);
        if (found) {
          setActiveTabId(found.id);
          return prev;
        } else {
          return [...prev, initTab];
        }
      });
      if (initTab.type === 'search' && initTab.url) {
        executeSearchInTab(initTab.url, currentLens);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentLens]);

  // 0d. Page Navigation Helper (for Footer, Omnibox, Buttons)
  const handleNavigatePage = (pageType) => {
    let title = 'PRISM';
    let url = `prism://${pageType}`;

    if (pageType === 'privacy') {
      title = 'Privacy Policy';
    } else if (pageType === 'terms') {
      title = 'Terms and Conditions';
    } else if (pageType === 'thank-you') {
      title = 'Thank You';
    } else if (pageType === '404') {
      title = '404 Page Not Found';
    } else if (pageType === 'home') {
      handleGoHome();
      return;
    }

    const existing = tabs.find((t) => t.type === pageType);
    if (existing) {
      setActiveTabId(existing.id);
      return;
    }

    const newTab = {
      id: `tab-${Date.now()}`,
      title,
      url,
      type: pageType,
      data: null,
      history: [{ type: pageType, url, title }],
      historyIndex: 0
    };

    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  useEffect(() => {
    window.__prismSearch = (q, l) => executeSearchInTab(q, l || currentLens);
    window.__prismOpenInstall = () => setIsInstallModalOpen(true);
    window.__prismLaunchApp = (type, q) => handleLaunchApp(type, q);
    window.__prismNavigatePage = (page) => handleNavigatePage(page);
  }, [activeTabId, currentLens]);

  // 1. Omnibox Submit Handler: Detects App Commands vs URL vs Search Query
  const handleOmniboxSubmit = (input) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const lower = trimmed.toLowerCase();
    if (lower === 'privacy' || lower === 'privacy policy') {
      handleNavigatePage('privacy');
      return;
    }
    if (lower === 'terms' || lower === 'terms and conditions') {
      handleNavigatePage('terms');
      return;
    }
    if (lower === 'thank you' || lower === 'thank-you' || lower === 'thanks') {
      handleNavigatePage('thank-you');
      return;
    }
    if (lower === '404' || lower === 'not found') {
      handleNavigatePage('404');
      return;
    }
    if (lower.startsWith('maps') || lower.startsWith('map ')) {
      const loc = trimmed.replace(/^maps?\s*/i, '');
      handleLaunchApp('maps', loc || 'Tokyo');
      return;
    }
    if (lower.startsWith('youtube') || lower.startsWith('tube') || lower.startsWith('video ')) {
      const q = trimmed.replace(/^(youtube|tube|video)\s*/i, '');
      handleLaunchApp('tube', q);
      return;
    }
    if (lower === 'mail' || lower === 'gmail' || lower === 'email') {
      handleLaunchApp('mail');
      return;
    }

    // Check if input looks like a direct URL or domain
    const isUrl = /^https?:\/\//i.test(trimmed) || (trimmed.includes('.') && !trimmed.includes(' ') && trimmed.length > 4);

    if (isUrl) {
      handleNavigateUrl(trimmed);
    } else {
      executeSearchInTab(trimmed, currentLens);
    }
  };

  // 2. Search Execution in Tab
  const executeSearchInTab = async (query, lens = currentLens) => {
    setIsLoading(true);
    setError(null);
    setCurrentLens(lens);

    // Increment searches count and sync with cloud if signed in
    setSearchesCount(prev => {
      const nextCount = prev + 1;
      localStorage.setItem('prism_searches_count', nextCount.toString());
      if (authToken) {
        axios.post('/api/auth/sync', { searchesCount: nextCount }, {
          headers: { Authorization: `Bearer ${authToken}` }
        }).catch(() => {});
      }
      return nextCount;
    });

    try {
      const res = await axios.get(`/api/search?q=${encodeURIComponent(query)}&lens=${lens}`);
      const searchData = res.data;

      // Update current tab
      setTabs((prevTabs) =>
        prevTabs.map((tab) => {
          if (tab.id === activeTabId) {
            const nextHistory = [
              ...tab.history.slice(0, tab.historyIndex + 1),
              { type: 'search', url: query, title: `${query} — PRISM Search`, data: searchData }
            ];
            return {
              ...tab,
              title: `${query}`,
              url: query,
              type: 'search',
              data: searchData,
              history: nextHistory,
              historyIndex: nextHistory.length - 1
            };
          }
          return tab;
        })
      );
    } catch (err) {
      console.error('Search error:', err);
      setError('Unable to fetch search results. Please verify connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Direct URL / Reader Mode in Tab
  const handleNavigateUrl = async (targetUrl, openInNewTab = false) => {
    let cleanUrl = targetUrl.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }

    setIsLoading(true);
    setError(null);

    let tabTargetId = activeTabId;
    if (openInNewTab) {
      const newId = `tab-${Date.now()}`;
      const newTabObj = {
        id: newId,
        title: cleanUrl.replace(/^https?:\/\/(www\.)?/, ''),
        url: cleanUrl,
        type: 'reader',
        data: null,
        history: [{ type: 'reader', url: cleanUrl, title: cleanUrl }],
        historyIndex: 0
      };
      setTabs((prev) => [...prev, newTabObj]);
      setActiveTabId(newId);
      tabTargetId = newId;
    }

    try {
      const res = await axios.get(`/api/read?url=${encodeURIComponent(cleanUrl)}`);
      const pageData = res.data;

      setTabs((prevTabs) =>
        prevTabs.map((tab) => {
          if (tab.id === tabTargetId) {
            const nextHistory = [
              ...tab.history.slice(0, tab.historyIndex + 1),
              { type: 'reader', url: cleanUrl, title: pageData.title || cleanUrl, data: pageData }
            ];
            return {
              ...tab,
              title: pageData.title || cleanUrl,
              url: cleanUrl,
              type: 'reader',
              data: pageData,
              history: nextHistory,
              historyIndex: nextHistory.length - 1
            };
          }
          return tab;
        })
      );
    } catch (err) {
      console.error('Reader error:', err);
      setError(`Could not load page: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Tab Operations: New Tab, Close Tab, Switch
  const handleNewTab = () => {
    const newId = `tab-${Date.now()}`;
    const newTab = {
      id: newId,
      title: 'New Tab',
      url: '',
      type: 'home',
      data: null,
      history: [{ type: 'home', url: '', title: 'New Tab' }],
      historyIndex: 0
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);
  };

  const handleCloseTab = (tabId) => {
    if (tabs.length <= 1) {
      handleGoHome();
      return;
    }

    const tabIndex = tabs.findIndex((t) => t.id === tabId);
    const remaining = tabs.filter((t) => t.id !== tabId);
    setTabs(remaining);

    if (activeTabId === tabId) {
      const nextActive = remaining[Math.max(0, tabIndex - 1)];
      setActiveTabId(nextActive.id);
    }
  };

  // 5. History Navigation: Back, Forward, Reload, Home
  const handleNavigateBack = () => {
    if (!activeTab || activeTab.historyIndex <= 0) return;
    const prevIndex = activeTab.historyIndex - 1;
    const prevEntry = activeTab.history[prevIndex];

    setTabs((prevTabs) =>
      prevTabs.map((tab) => {
        if (tab.id === activeTabId) {
          return {
            ...tab,
            type: prevEntry.type,
            title: prevEntry.title,
            url: prevEntry.url,
            data: prevEntry.data,
            historyIndex: prevIndex
          };
        }
        return tab;
      })
    );
  };

  const handleNavigateForward = () => {
    if (!activeTab || activeTab.historyIndex >= activeTab.history.length - 1) return;
    const nextIndex = activeTab.historyIndex + 1;
    const nextEntry = activeTab.history[nextIndex];

    setTabs((prevTabs) =>
      prevTabs.map((tab) => {
        if (tab.id === activeTabId) {
          return {
            ...tab,
            type: nextEntry.type,
            title: nextEntry.title,
            url: nextEntry.url,
            data: nextEntry.data,
            historyIndex: nextIndex
          };
        }
        return tab;
      })
    );
  };

  const handleReload = () => {
    if (activeTab.type === 'search' && activeTab.url) {
      executeSearchInTab(activeTab.url, currentLens);
    } else if (activeTab.type === 'reader' && activeTab.url) {
      handleNavigateUrl(activeTab.url);
    }
  };

  const handleGoHome = () => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => {
        if (tab.id === activeTabId) {
          const nextHistory = [
            ...tab.history.slice(0, tab.historyIndex + 1),
            { type: 'home', url: '', title: 'PRISM Browser' }
          ];
          return {
            ...tab,
            title: 'PRISM Browser',
            url: '',
            type: 'home',
            data: null,
            history: nextHistory,
            historyIndex: nextHistory.length - 1
          };
        }
        return tab;
      })
    );
  };

  // 6. Workbench Pinning
  const handlePinItem = (item) => {
    setPinnedItems((prev) => {
      const exists = prev.some((p) => p.link === item.link);
      if (exists) {
        return prev.filter((p) => p.link !== item.link);
      } else {
        return [item, ...prev];
      }
    });
  };

  const handleRemovePin = (link) => {
    setPinnedItems((prev) => prev.filter((p) => p.link !== link));
  };

  const handleClearAllPins = () => {
    if (window.confirm('Clear all items from your workbench?')) {
      setPinnedItems([]);
    }
  };

  const pinnedUrls = new Set(pinnedItems.map((p) => p.link));

  return (
    <RealtimeColorsProvider>
      {/* Cinematic Logo Opening Sequence on App Open */}
      <AppOpeningSplash />

      <div className="browser-shell">
        {/* Dynamic Interactive Prism Particles Canvas */}
        <PrismBackground />

      {/* 1. Complete Browser Window Chrome (Tabs + Nav + Omnibox) */}
      <BrowserChrome
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={setActiveTabId}
        onNewTab={handleNewTab}
        onCloseTab={handleCloseTab}
        onNavigateBack={handleNavigateBack}
        onNavigateForward={handleNavigateForward}
        onReload={handleReload}
        onGoHome={handleGoHome}
        onOmniboxSubmit={handleOmniboxSubmit}
        currentLens={currentLens}
        onSelectLens={(lens) => {
          setCurrentLens(lens);
          if (activeTab.type === 'search' && activeTab.url) {
            executeSearchInTab(activeTab.url, lens);
          }
        }}
        onOpenWorkbench={() => setIsPinboardOpen(true)}
        pinnedCount={pinnedItems.length}
        isLoading={isLoading}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        searchesCount={searchesCount}
        onOpenInstall={() => setIsInstallModalOpen(true)}
        onLaunchApp={handleLaunchApp}
      />
      {/* 2. Active Tab Content Canvas */}
      <main style={{ flex: 1, position: 'relative' }} className="prism-main-canvas">
        <ErrorBoundary key={activeTabId} onReset={() => handleGoHome()}>
          {/* VIEW A: PRISM Clean Minimalist Start Page */}
          {activeTab.type === 'home' && (
            <div style={{ position: 'relative', width: '100%', minHeight: '100%' }}>
              <HaikeiLayeredWaves opacity={0.7} />
              <HaikeiFluidBlobs opacity={0.35} />
              <MotionFadeIn duration={0.6}>
                <SpeedDial
                  onSearch={(q, lens) => executeSearchInTab(q, lens || 'all')}
                  onNavigateUrl={(url) => handleNavigateUrl(url, false)}
                  onOpenInstall={() => setIsInstallModalOpen(true)}
                  onOpenAuthModal={() => setIsAuthModalOpen(true)}
                  onLaunchApp={handleLaunchApp}
                  currentUser={currentUser}
                />
              </MotionFadeIn>
            </div>
          )}

          {/* VIEW B: In-Browser Distraction-Free Reader View */}
          {activeTab.type === 'reader' && (
            <ReaderView
              pageData={activeTab.data}
              onPinItem={handlePinItem}
              isPinned={pinnedUrls.has(activeTab.url)}
            />
          )}

          {/* VIEW D: PRISM Maps (Google Maps Equivalent) */}
          {activeTab.type === 'maps' && (
            <PrismMaps
              initialQuery={activeTab.url || 'Tokyo'}
              onOpenSearch={(q) => executeSearchInTab(q, currentLens)}
            />
          )}

          {/* VIEW E: PRISM Tube (YouTube Equivalent) */}
          {activeTab.type === 'tube' && (
            <PrismTube
              initialQuery={activeTab.url || ''}
              onOpenSearch={(q) => executeSearchInTab(q, currentLens)}
            />
          )}

          {/* VIEW F: PRISM Mail (Gmail Equivalent) */}
          {activeTab.type === 'mail' && (
            <PrismMail
              onOpenSearch={(q) => executeSearchInTab(q, currentLens)}
            />
          )}

          {/* VIEW G: Privacy Policy & Zero-Telemetry Charter (Item 15) */}
          {activeTab.type === 'privacy' && (
            <PrivacyPolicyPage onGoHome={handleGoHome} />
          )}

          {/* VIEW H: Terms and Conditions Agreement (Item 16) */}
          {activeTab.type === 'terms' && (
            <TermsPage onGoHome={handleGoHome} />
          )}

          {/* VIEW I: Thank You & Onboarding Page (Item 14) */}
          {activeTab.type === 'thank-you' && (
            <ThankYouPage
              onGoHome={handleGoHome}
              onOpenInstall={() => setIsInstallModalOpen(true)}
              onSearch={(q) => executeSearchInTab(q, currentLens)}
            />
          )}

          {/* VIEW J: Custom 404 Disconnected Spectrum Page (Item 1) */}
          {activeTab.type === '404' && (
            <NotFoundPage
              onGoHome={handleGoHome}
              onSearch={(q) => executeSearchInTab(q, currentLens)}
              onLaunchApp={handleLaunchApp}
            />
          )}

          {/* SKELETON LOADING STATE (Item 12) */}
          {activeTab.type === 'search' && isLoading && (
            <ResultsSkeleton query={activeTab.url} />
          )}

          {/* VIEW C: PRISM Multi-Lens Search Results */}
          {activeTab.type === 'search' && activeTab.data && !isLoading && (
            <div className="main-content" style={{ position: 'relative' }}>
              <HaikeiLayeredWaves opacity={0.35} />
              <MotionFadeIn duration={0.5}>
                {/* Top Source Transparency Rail */}
                <SourceRail
                  sources={activeTab.data.aiOverview?.citedSources || activeTab.data.results?.slice(0, 5)}
                  onOpenInTab={(link, title) => handleNavigateUrl(link, true)}
                />

              {/* Quick Dossier Executive Summary & Key Entity Hashtags */}
              {activeTab.data.dossier && (
                <QuickDossier
                  dossier={activeTab.data.dossier}
                  metrics={activeTab.data.metrics}
                  onSelectEntity={(entity) => executeSearchInTab(entity, currentLens)}
                />
              )}

              {/* AI Answer Section (Reasoning Trace + Grounded Answer + Inline Citations) */}
              {activeTab.data.aiOverview && (
                <AIAnswerSection
                  query={activeTab.url}
                  aiOverview={activeTab.data.aiOverview}
                  onPinAnswer={() =>
                    handlePinItem({
                      title: `AI Overview: ${activeTab.url}`,
                      link: activeTab.url,
                      cleanSnippet: activeTab.data.aiOverview?.directAnswer?.slice(0, 200),
                      hostname: 'PRISM AI',
                      trustScore: 99,
                      trustBadge: 'AI Synthesis'
                    })
                  }
                  isPinned={pinnedUrls.has(activeTab.url)}
                  onOpenInTab={(link, title) => handleNavigateUrl(link, true)}
                />
              )}

              {/* Multi-Lens Controls & View Switcher */}
              <LensBar
                currentLens={currentLens}
                onSelectLens={(lens) => executeSearchInTab(activeTab.url, lens)}
                currentView={currentView}
                onSelectView={setCurrentView}
              />

              {/* Metrics Bar */}
              {activeTab.data.metrics && !isLoading && (
                <div className="search-metrics-bar">
                  <div className="metrics-pills">
                    <span className="metric-tag">
                      <Sparkles size={13} color="#06b6d4" />
                      <span>{activeTab.data.metrics.totalResults} High-Signal Results</span>
                    </span>
                    <span className="metric-tag">
                      <Filter size={13} color="#10b981" />
                      <span>{activeTab.data.metrics.spamFiltered} Noise Blocked</span>
                    </span>
                    <span className="metric-tag">
                      <Clock size={13} color="#6366f1" />
                      <span>{activeTab.data.metrics.latency}</span>
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Audited via PRISM Multi-Source Federation
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 12, padding: '1.25rem', color: '#fca5a5', display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <ShieldAlert size={20} />
                  <span>{error}</span>
                </div>
              )}

              {/* Sub-view 1: Stream Feed with Google Knowledge Graph Panel & Visual Data */}
              {currentView === 'stream' && (
                <div>
                  {/* Dynamic Interactive Process Flowchart */}
                  {activeTab.data.flowchart && (
                    <AnimatedFlowchart
                      flowchart={activeTab.data.flowchart}
                      query={activeTab.url}
                    />
                  )}

                  {/* Google-Style People Also Ask Accordion */}
                  {activeTab.data.peopleAlsoAsk && (
                    <PeopleAlsoAsk
                      peopleAlsoAsk={activeTab.data.peopleAlsoAsk}
                      onSelectQuery={(q) => executeSearchInTab(q, currentLens)}
                    />
                  )}

                  {/* Multi-Paradigm Structured Comparison Matrix */}
                  {activeTab.data.comparisonTable && (
                    <AnimatedComparisonTable
                      comparisonTable={activeTab.data.comparisonTable}
                      query={activeTab.url}
                    />
                  )}

                  {/* Standard Search Stream & Google Knowledge Panel */}
                  <ResultsStream
                    results={activeTab.data.results}
                    onPinItem={handlePinItem}
                    pinnedUrls={pinnedUrls}
                    onOpenInTab={(link, title) => handleNavigateUrl(link, true)}
                    googleKnowledgeCard={activeTab.data.googleKnowledgeCard}
                    onSearchQuery={(q) => executeSearchInTab(q, currentLens)}
                  />
                </div>
              )}

              {/* Sub-view 1b: Dedicated Flowchart Pipeline View */}
              {currentView === 'flowchart' && (
                <div>
                  <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#f8fafc' }}>
                      Interactive Flow Pipeline Mechanics
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      Multi-phase sequence architecture • Real-time stage progression
                    </span>
                  </div>
                  <AnimatedFlowchart
                    flowchart={activeTab.data.flowchart}
                    query={activeTab.url}
                  />
                </div>
              )}

              {/* Sub-view 1c: Dedicated Structured Comparison Matrix View */}
              {currentView === 'table' && (
                <div>
                  <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#f8fafc' }}>
                      Cross-Paradigm Comparison Matrix
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      Sortable dimensions • Performance metrics • Architectural trade-offs
                    </span>
                  </div>
                  <AnimatedComparisonTable
                    comparisonTable={activeTab.data.comparisonTable}
                    query={activeTab.url}
                  />
                </div>
              )}

              {/* Sub-view 2: Knowledge Graph */}
              {currentView === 'graph' && (
                <div>
                  <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#f8fafc' }}>
                      Visual Concept & Node Network
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      Drag nodes • Click concepts to pivot • Select node to inspect
                    </span>
                  </div>
                  <KnowledgeGraphView
                    graphData={activeTab.data.knowledgeGraph}
                    onSearchQuery={(q) => executeSearchInTab(q, currentLens)}
                    onOpenInTab={(link, title) => handleNavigateUrl(link, true)}
                    onPinItem={handlePinItem}
                    pinnedUrls={pinnedUrls}
                  />
                </div>
              )}

              {/* Sub-view 3: Split Perspectives */}
              {currentView === 'split' && (
                <PerspectiveSplitView
                  perspectives={activeTab.data.perspectives}
                  onPinItem={handlePinItem}
                  pinnedUrls={pinnedUrls}
                  onOpenInTab={(link, title) => handleNavigateUrl(link, true)}
                />
              )}

              {/* Bottom Conversational Follow-Up Thread */}
              <FollowUpChat
                originalQuery={activeTab.url}
                followUps={activeTab.data.aiOverview?.followUps || []}
                previousAnswer={activeTab.data.aiOverview?.directAnswer || ''}
                results={activeTab.data.results || []}
                onOpenInTab={(link, title) => handleNavigateUrl(link, true)}
              />

              {/* Related Questions, Searches, and Deep Dives */}
              <RelatedExploration
                query={activeTab.url}
                relatedInformation={activeTab.data.aiOverview?.relatedInformation}
                onSearchQuery={(q) => executeSearchInTab(q, currentLens)}
                onSelectLens={(lens) => executeSearchInTab(activeTab.url, lens)}
                onOpenInTab={(link, title) => handleNavigateUrl(link, true)}
              />
              </MotionFadeIn>
            </div>
          )}
        </ErrorBoundary>

        {/* Site-Wide Footer with Real Corporate Contact Address (Items 15, 16, 19) */}
        <SiteFooter
          onNavigatePage={handleNavigatePage}
          onOpenCookies={() => {
            if (window.__prismOpenCookies) window.__prismOpenCookies();
          }}
          onLaunchApp={handleLaunchApp}
        />
      </main>

      {/* 3. Slide-out Research Workbench Drawer */}
      <ResearchPinboard
        isOpen={isPinboardOpen}
        onClose={() => setIsPinboardOpen(false)}
        pinnedItems={pinnedItems}
        onRemovePin={handleRemovePin}
        onClearAll={handleClearAllPins}
        onOpenInTab={(link, title) => handleNavigateUrl(link, true)}
      />

      {/* 4. Glassmorphic User Account Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* 5. Mobile Safari Floating Bottom Navigation Bar */}
      <SafariBottomBar
        onOpenInstall={() => setIsInstallModalOpen(true)}
        onOpenTabs={() => {}}
        onToggleReader={() => {
          if (activeTab.type === 'search' && activeTab.data?.results?.[0]?.link) {
            handleNavigateUrl(activeTab.data.results[0].link, false);
          } else if (activeTab.type === 'reader') {
            handleGoHome();
          }
        }}
        isReaderOpen={activeTab.type === 'reader'}
        canGoBack={activeTab.historyIndex > 0}
        onGoBack={handleNavigateBack}
        activeLens={currentLens}
      />

      {/* 6. Device Installation & Play Store Modal */}
      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onInstallSuccess={() => setDeferredPrompt(null)}
      />

      {/* 7. Mobile Sticky Floating CTA Bar (Item 11) */}
      <StickyMobileCTA
        onOpenInstall={() => setIsInstallModalOpen(true)}
        onFocusSearch={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const omni = document.querySelector('.browser-omnibox-input') || document.querySelector('.search-input');
          if (omni) omni.focus();
        }}
      />

      {/* 8. GDPR & ePrivacy Cookie Consent Banner (Item 17) */}
      <CookieBanner
        onOpenPrivacy={() => handleNavigatePage('privacy')}
      />
    </div>
    </RealtimeColorsProvider>
  );
}
