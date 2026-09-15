/**
 * PRISM User Account & Authentication Service
 * Manages user registration, authentication, session tokens, and cloud profile sync.
 * Hardened with Salted SHA-256, cryptographically random session tokens, and input validation.
 */
import crypto from 'crypto';

const users = new Map();
const sessions = new Map();

function hashPassword(password, salt) {
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

function generateSecureToken() {
  return crypto.randomBytes(32).toString('hex');
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Initialize with a default founder user
const founderSalt = 'f8a7e3b9c2d140e5';
const founderUser = {
  id: 'usr-founder-001',
  name: 'Alex Vance',
  email: 'founder@prism.ai',
  salt: founderSalt,
  passwordHash: hashPassword('prism2026', founderSalt),
  tier: 'Founder Pro',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  createdAt: new Date().toISOString(),
  searchesCount: 42,
  pinnedCount: 7,
  preferences: {
    defaultLens: 'all',
    autoReader: false,
    theme: 'obsidian'
  }
};
users.set(founderUser.email.toLowerCase(), founderUser);

export function signUp(name, email, password) {
  const normalizedEmail = (email || '').trim().toLowerCase();
  
  if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
    throw new Error('Please provide a valid email address.');
  }

  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  if (users.has(normalizedEmail)) {
    throw new Error('An account with this email address already exists.');
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);

  const newUser = {
    id: `usr-${crypto.randomBytes(8).toString('hex')}`,
    name: (name || '').trim() || 'PRISM Explorer',
    email: normalizedEmail,
    salt,
    passwordHash,
    tier: 'PRISM Pro Pioneer',
    avatarUrl: null,
    createdAt: new Date().toISOString(),
    searchesCount: 0,
    pinnedCount: 0,
    preferences: {
      defaultLens: 'all',
      autoReader: false,
      theme: 'obsidian'
    }
  };

  users.set(normalizedEmail, newUser);

  // Generate cryptographically secure 256-bit session token
  const token = generateSecureToken();
  sessions.set(token, {
    userId: newUser.id,
    createdAt: Date.now(),
    expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days TTL
  });

  return {
    user: sanitizeUser(newUser),
    token
  };
}

export function login(email, password) {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const user = users.get(normalizedEmail);

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const computedHash = hashPassword(password, user.salt);
  if (computedHash !== user.passwordHash) {
    throw new Error('Invalid email or password.');
  }

  const token = generateSecureToken();
  sessions.set(token, {
    userId: user.id,
    createdAt: Date.now(),
    expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000)
  });

  return {
    user: sanitizeUser(user),
    token
  };
}

export function getUserByToken(token) {
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;

  // Check TTL expiration
  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return null;
  }

  for (const user of users.values()) {
    if (user.id === session.userId) {
      return sanitizeUser(user);
    }
  }
  return null;
}

export function logout(token) {
  if (token) {
    sessions.delete(token);
  }
  return true;
}

export function syncUserData(token, stats = {}) {
  const user = getUserByToken(token);
  if (!user) return null;

  const targetUser = users.get(user.email.toLowerCase());
  if (targetUser) {
    if (stats.searchesCount !== undefined && typeof stats.searchesCount === 'number') {
      targetUser.searchesCount = Math.max(0, stats.searchesCount);
    }
    if (stats.pinnedCount !== undefined && typeof stats.pinnedCount === 'number') {
      targetUser.pinnedCount = Math.max(0, stats.pinnedCount);
    }
  }

  return sanitizeUser(targetUser);
}

function sanitizeUser(user) {
  if (!user) return null;
  const { passwordHash, salt, ...safe } = user;
  return safe;
}

