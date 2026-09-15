import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const res = await axios.post('/api/auth/signup', { name, email, password });
        onAuthSuccess(res.data.user, res.data.token);
        onClose();
      } else {
        const res = await axios.post('/api/auth/login', { email, password });
        onAuthSuccess(res.data.user, res.data.token);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // One-click demo login simulation
  const handleQuickDemoLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/auth/login', {
        email: 'founder@prism.ai',
        password: 'prism2026'
      });
      onAuthSuccess(res.data.user, res.data.token);
      onClose();
    } catch (err) {
      setError('Could not connect to demo profile.');
    } finally {
      setIsLoading(false);
    }
  };

  // One-click simulated Google / GitHub OAuth
  const handleSocialOAuth = async (provider) => {
    setIsLoading(true);
    setTimeout(async () => {
      try {
        const randomId = Math.floor(Math.random() * 900) + 100;
        const res = await axios.post('/api/auth/signup', {
          name: `${provider} Explorer`,
          email: `${provider.toLowerCase()}.${randomId}@prism.ai`,
          password: 'oauth_secure_pass'
        });
        onAuthSuccess(res.data.user, res.data.token);
        onClose();
      } catch {
        // Fallback login
        handleQuickDemoLogin();
      } finally {
        setIsLoading(false);
      }
    }, 450);
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button type="button" className="auth-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="auth-modal-header">
          <div className="auth-brand-monogram">
            <Sparkles size={22} color="#6366f1" />
          </div>
          <h2 className="auth-title">
            {mode === 'signin' ? 'Sign In to PRISM' : 'Create Your PRISM Account'}
          </h2>
          <p className="auth-subtitle">
            {mode === 'signin'
              ? 'Access cloud-synced research dossiers, custom lenses, and zero-ad search.'
              : 'Join the next generation of search without SEO noise, tracking, or sponsored junk.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="auth-tab-switch">
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'signin' ? 'active' : ''}`}
            onClick={() => { setMode('signin'); setError(null); }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => { setMode('signup'); setError(null); }}
          >
            Create Account
          </button>
        </div>

        {/* Quick Social OAuth Buttons */}
        <div className="auth-social-row">
          <button
            type="button"
            className="btn-social-auth"
            onClick={() => handleSocialOAuth('Google')}
            disabled={isLoading}
          >
            <span style={{ fontSize: '1.1rem' }}>🌐</span>
            <span>Continue with Google</span>
          </button>
          <button
            type="button"
            className="btn-social-auth"
            onClick={() => handleSocialOAuth('GitHub')}
            disabled={isLoading}
          >
            <span style={{ fontSize: '1.1rem' }}>🐙</span>
            <span>Continue with GitHub</span>
          </button>
        </div>

        <div className="auth-divider">
          <span>or continue with email</span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="auth-error-box">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <div className="auth-field-group">
              <label className="auth-label">Full Name</label>
              <div className="auth-input-wrapper">
                <User size={15} className="auth-field-icon" />
                <input
                  type="text"
                  className="auth-input"
                  placeholder="e.g. Alex Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="auth-field-group">
            <label className="auth-label">Email Address</label>
            <div className="auth-input-wrapper">
              <Mail size={15} className="auth-field-icon" />
              <input
                type="email"
                className="auth-input"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-field-group">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrapper">
              <Lock size={15} className="auth-field-icon" />
              <input
                type="password"
                className="auth-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-auth-submit"
            disabled={isLoading}
          >
            <span>{isLoading ? 'Connecting...' : mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        {/* One-Click Quick Demo Login */}
        <div className="auth-demo-shortcut">
          <button
            type="button"
            className="btn-demo-login"
            onClick={handleQuickDemoLogin}
            disabled={isLoading}
          >
            <ShieldCheck size={14} color="#10b981" />
            <span>One-Click Quick Login: Alex Vance (Founder Pro)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
