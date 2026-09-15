# PRISM — Advanced Search Engine, Safari Browser & Multi-App Ecosystem

[![PRISM Architecture](https://img.shields.io/badge/PRISM-Engine_v2.0-8b5cf6.svg)](https://github.com/poharekulbhushan2006-code/prism-search-engine)
[![Vite](https://img.shields.io/badge/Vite-6.1-646cff.svg)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://react.org/)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/poharekulbhushan2006-code/prism-search-engine)

**PRISM** is an ultra-fast, privacy-first, anti-SEO search engine and browser ecosystem inspired by the clean aesthetics of Google and Apple Safari. Built with high-fidelity micro-animations, glassmorphism, and hardware-accelerated mapping.

---

## 🌟 Ecosystem Highlights

### 1. 🛰️ PRISM Maps (Google Maps-Style Real Satellite & Live GPS Tracking)
- **Sub-Meter Satellite Photography**: High-resolution ESRI World Imagery aerial photography up to **Zoom Level 18–19** where individual driving and parked vehicles, highway lanes, crosswalks, and buildings are visible.
- **Live Google Maps-Style GPS Tracking**:
  - Floating **My Location FAB** with continuous real-time `watchPosition` telemetry.
  - Blue pulsing GPS beacon with heading directional beam and translucent accuracy radius ring.
  - Reverse geocoding of real-world street and neighborhood coordinates.
- **Turn-by-Turn Live Navigation Mode**:
  - Green highway signage banner with distance countdown and maneuver instructions.
  - Real-time speedometer and ETA tracker.
- **Live Traffic Flow & Congestion HUD**:
  - Color-coded highway vectors: 🟢 Free Flow (>65 km/h), 🟡 Moderate (35–65 km/h), 🔴 Congested (<35 km/h).
  - High-density highway corridors: Times Square NYC, Shibuya Scramble Tokyo, Western Express Highway Mumbai, Sheikh Zayed Road Dubai, Arc de Triomphe Paris, LA 405 Freeway.

### 2. 📺 PRISM Tube (100% Ad-Free Live YouTube Feed)
- **Live Video Catalog Scraping**: Direct extraction of real YouTube search results via `ytInitialData` with zero API key or quota limitations.
- **User-Requested Dedicated Categories**:
  - **📺 TMKOC & Shows**: Instant access to the latest full episodes of *Taarak Mehta Ka Ooltah Chashmah* directly from Sony SAB and Sony LIV.
  - **🎞️ Cartoons & Anime**: Full compilations of *Tom & Jerry*, *Shinchan in Hindi*, *Doraemon*, *Oggy and the Cockroaches*, etc.
  - **🎵 Music & Lofi**, **✨ Technology**, **💻 Coding**, **🎮 Gaming**.
- **Ad-Free Theater Playback**: Private stream playback via `youtube-nocookie.com` with zero pre-roll ads, tracking cookies, or commercial interruptions.

### 3. ✉️ PRISM Mail (Encrypted Private Webmail)
- **Ad-Free Communications**: Cryptographically signed inbox with zero tracking pixels or injected sponsored promotions.
- **PRISM AI 1-Click Executive Summary**: Synthesizes concise bullet-point TL;DR summaries of incoming emails in under 500ms.
- **Draft Persistence & Attachments**: Save in-progress drafts to local storage, resume editing, and simulate encrypted file attachments.

### 4. 🔍 Multi-Lens Anti-SEO Search Engine
- **Visual Intelligence**: Generates interactive animated SVG process flowcharts, sortable dynamic comparison matrices, and people-also-ask accordions.
- **Anti-SEO Filtering**: Ranks authoritative, peer-reviewed, and community practitioner voices while suppressing algorithmic affiliate farms.
- **Multi-Lens Exploration**: Filter results across Academic, Developer, Executive, Community, and Raw Data lenses.

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/prism-search-engine.git
cd prism-search-engine

# Install dependencies
npm install

# Start both Vite client and Express server concurrently
npm run dev
```

The application will be accessible at `http://localhost:5000` (or `http://localhost:5173` for Vite standalone dev).

---

## 🌐 Deploy to Vercel

PRISM is pre-configured for seamless 1-click deployment to [Vercel](https://vercel.com):

1. Push your repository to **GitHub**.
2. Go to **[Vercel Dashboard](https://vercel.com/new)** and import your GitHub repository.
3. Vercel will automatically detect `vercel.json`:
   - **Framework Preset**: Vite
   - **Build Command**: `vite build`
   - **Output Directory**: `dist`
   - **API Routes**: `/api/*` handled serverlessly by `api/index.js`
4. Click **Deploy**!

Alternatively, deploy directly using the Vercel CLI:
```bash
npx vercel
```

---

## 📱 Google Play Store & PWA Installation
- **PWA Ready**: Web App Manifest (`manifest.json`) with maskable 192px/512px icons and offline service worker (`sw.js`).
- **TWA Digital Asset Links**: Pre-configured at `/.well-known/assetlinks.json` for Google Play Store packaging via Bubblewrap CLI.

---

## 📄 License
MIT License. Created for the PRISM Decentralized Search & Browser Project.
