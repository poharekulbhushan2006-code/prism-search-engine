import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  LogOut,
  Sparkles,
  ShieldCheck,
  Bookmark,
  History,
  Settings,
  ChevronDown
} from 'lucide-react';

export default function UserProfileMenu({ user, onLogout, onOpenWorkbench, searchesCount, pinnedCount }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'P';

  return (
    <div className="user-profile-wrapper" ref={menuRef}>
      <button
        type="button"
        className="user-avatar-trigger"
        onClick={() => setIsOpen(!isOpen)}
        title={`${user?.name || 'User'} (${user?.tier || 'Free Tier'})`}
      >
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name} className="user-avatar-img" />
        ) : (
          <div className="user-initials-badge">{initials}</div>
        )}
        <span className="user-trigger-name">{user?.name?.split(' ')[0] || 'Account'}</span>
        <ChevronDown size={12} className={`trigger-arrow ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="user-profile-dropdown"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: 300,
            background: 'rgba(13, 17, 26, 0.98)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: 16,
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(99, 102, 241, 0.15)',
            padding: '1.2rem',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}
        >
          {/* Header Info */}
          <div
            className="profile-dropdown-header"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              paddingBottom: '0.85rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div
              className="profile-name-row"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <span style={{ fontSize: '0.96rem', fontWeight: 700, color: '#f8fafc' }}>
                {user?.name || 'PRISM User'}
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 9999,
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.15))',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  color: '#fbbf24',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                {user?.tier || 'Pro Member'}
              </span>
            </div>
            <div style={{ fontSize: '0.76rem', color: '#94a3b8', wordBreak: 'break-all' }}>
              {user?.email}
            </div>
          </div>

          {/* Cloud Sync Telemetry */}
          <div
            className="profile-sync-stats"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}
          >
            <div
              className="sync-stat-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 0.65rem',
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                fontSize: '0.75rem',
                color: '#cbd5e1'
              }}
            >
              <History size={13} color="#818cf8" />
              <span><strong>{searchesCount || user?.searchesCount || 0}</strong> Searches</span>
            </div>
            <div
              className="sync-stat-item clickable"
              onClick={() => {
                setIsOpen(false);
                if (onOpenWorkbench) onOpenWorkbench();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 0.65rem',
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                fontSize: '0.75rem',
                color: '#cbd5e1',
                cursor: 'pointer'
              }}
            >
              <Bookmark size={13} color="#22d3ee" />
              <span><strong>{pinnedCount || user?.pinnedCount || 0}</strong> Dossiers</span>
            </div>
          </div>

          {/* Cloud Status */}
          <div
            className="profile-cloud-status"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.45rem 0.65rem',
              borderRadius: 8,
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              fontSize: '0.72rem',
              color: '#a7f3d0'
            }}
          >
            <ShieldCheck size={14} color="#10b981" />
            <span>Encrypted Cloud Sync: <strong style={{ color: '#34d399' }}>Active</strong></span>
          </div>

          {/* Menu Items */}
          <div
            className="profile-menu-actions"
            style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}
          >
            <button
              type="button"
              className="profile-menu-btn"
              onClick={() => {
                setIsOpen(false);
                if (onOpenWorkbench) onOpenWorkbench();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#cbd5e1',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <Bookmark size={14} color="#818cf8" />
              <span>Open Research Workbench</span>
            </button>

            <button
              type="button"
              className="profile-menu-btn logout"
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: 8,
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#fca5a5',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <LogOut size={14} color="#f87171" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
