import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Smartphone, 
  Apple, 
  Monitor, 
  CheckCircle2, 
  Share, 
  PlusSquare, 
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';

export default function InstallModal({ isOpen, onClose, deferredPrompt, onInstallSuccess }) {
  const [activeTab, setActiveTab] = useState('android');
  const [isInstalling, setIsInstalling] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('Native install prompt is ready when visiting via supported browser (Chrome, Edge, Android). You can also add to home screen via your browser menu!');
      return;
    }

    try {
      setIsInstalling(true);
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        if (onInstallSuccess) onInstallSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Install prompt error:', err);
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <div className="install-modal-overlay" onClick={onClose}>
      <div 
        className="install-modal-dialog"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '1.25rem',
            top: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '0.4rem',
            borderRadius: '50%'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{
            position: 'relative',
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #06b6d4, #6366f1, #a855f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            fontWeight: '900',
            color: '#fff',
            boxShadow: '0 8px 24px rgba(6, 182, 212, 0.3)',
            flexShrink: 0
          }}>
            P
            <div style={{
              position: 'absolute',
              bottom: '-4px',
              right: '-4px',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: '#10b981',
              color: '#fff',
              fontSize: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>✓</div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span className="flowchart-badge">PWA & PLAY STORE READY</span>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Standalone App</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#fff', margin: 0 }}>
              Install PRISM Search Engine
            </h2>
          </div>
        </div>

        {/* 1-Click Native Install Prompt if available */}
        {deferredPrompt ? (
          <div style={{
            background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.15), rgba(99, 102, 241, 0.15))',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            borderRadius: '14px',
            padding: '1rem 1.25rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#67e8f9' }}>Device Ready for Direct Install</div>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>Install as a native full-screen standalone application.</div>
            </div>
            <button
              onClick={handleInstallClick}
              disabled={isInstalling}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
                border: 'none',
                borderRadius: '10px',
                padding: '0.6rem 1.2rem',
                color: '#fff',
                fontSize: '0.84rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(6, 182, 212, 0.35)'
              }}
            >
              <Download size={15} />
              <span>{isInstalling ? 'Installing...' : 'Install Now'}</span>
            </button>
          </div>
        ) : (
          <div style={{
            background: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem',
            fontSize: '0.82rem',
            color: '#cbd5e1',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <Sparkles size={20} color="#38bdf8" style={{ flexShrink: 0 }} />
            <span>
              PRISM is built with Google Play Store TWA and Progressive Web App standards for instant install on all mobile and desktop devices:
            </span>
          </div>
        )}

        {/* Platform Tabs */}
        <div className="install-tab-group">
          <button
            onClick={() => setActiveTab('android')}
            className={`install-tab-btn ${activeTab === 'android' ? 'active' : ''}`}
          >
            <Smartphone size={14} />
            <span>Android & Play Store</span>
          </button>

          <button
            onClick={() => setActiveTab('ios')}
            className={`install-tab-btn ${activeTab === 'ios' ? 'active' : ''}`}
          >
            <Apple size={14} />
            <span>iOS Safari</span>
          </button>

          <button
            onClick={() => setActiveTab('desktop')}
            className={`install-tab-btn ${activeTab === 'desktop' ? 'active' : ''}`}
          >
            <Monitor size={14} />
            <span>Desktop (PC / Mac)</span>
          </button>
        </div>

        {/* Tab Guides */}
        <div>
          {activeTab === 'android' && (
            <div>
              <div className="install-step-card">
                <span className="install-step-num">1</span>
                <div>
                  <strong style={{ color: '#fff', display: 'block' }}>Direct 1-Tap Browser Install</strong>
                  <span style={{ color: '#94a3b8' }}>
                    Open PRISM in Chrome, Edge, or Samsung Internet, tap browser menu (⋮), and tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                  </span>
                </div>
              </div>

              <div className="install-step-card">
                <span className="install-step-num">2</span>
                <div>
                  <strong style={{ color: '#fff', display: 'block' }}>Google Play Store Bundle Deployment</strong>
                  <span style={{ color: '#94a3b8' }}>
                    PRISM includes pre-configured <code style={{ color: '#22d3ee' }}>twa-manifest.json</code> and <code style={{ color: '#22d3ee' }}>assetlinks.json</code>. Generate your signed Android App Bundle (<code style={{ color: '#818cf8' }}>.aab</code>) via Google Bubblewrap:
                  </span>
                  <div style={{ marginTop: '0.4rem', background: '#000', padding: '0.5rem 0.75rem', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.76rem', color: '#22d3ee' }}>
                    npx @bubblewrap/cli build
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ios' && (
            <div>
              <div className="install-step-card">
                <span className="install-step-num">1</span>
                <div>
                  <strong style={{ color: '#fff', display: 'block' }}>Open in Apple Safari</strong>
                  <span style={{ color: '#94a3b8' }}>
                    Open PRISM on your iPhone or iPad using the Safari browser.
                  </span>
                </div>
              </div>

              <div className="install-step-card">
                <span className="install-step-num">2</span>
                <div>
                  <strong style={{ color: '#fff', display: 'block' }}>Tap the Safari Share Icon</strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8' }}>
                    <span>Tap Share</span>
                    <Share size={13} color="#22d3ee" />
                    <span>in the bottom toolbar.</span>
                  </div>
                </div>
              </div>

              <div className="install-step-card">
                <span className="install-step-num">3</span>
                <div>
                  <strong style={{ color: '#fff', display: 'block' }}>Select "Add to Home Screen"</strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8' }}>
                    <span>Scroll down and tap</span>
                    <PlusSquare size={13} color="#10b981" />
                    <strong style={{ color: '#fff' }}>"Add to Home Screen"</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'desktop' && (
            <div>
              <div className="install-step-card">
                <span className="install-step-num">1</span>
                <div>
                  <strong style={{ color: '#fff', display: 'block' }}>Omnibox Install Icon</strong>
                  <span style={{ color: '#94a3b8' }}>
                    Click the download / computer monitor icon on the far right of the address bar.
                  </span>
                </div>
              </div>

              <div className="install-step-card">
                <span className="install-step-num">2</span>
                <div>
                  <strong style={{ color: '#fff', display: 'block' }}>Standalone Desktop Window</strong>
                  <span style={{ color: '#94a3b8' }}>
                    PRISM launches in a borderless native window with keyboard navigation and OS dock integration.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Benefits Footer */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', fontSize: '0.74rem', color: '#94a3b8' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
            <Zap size={16} color="#06b6d4" />
            <span>Instant Launch</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
            <ShieldCheck size={16} color="#10b981" />
            <span>Offline Ready</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
            <CheckCircle2 size={16} color="#818cf8" />
            <span>Zero Trackers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
