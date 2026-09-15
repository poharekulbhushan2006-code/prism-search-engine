# PRISM — Device Installation & Google Play Store Deployment Guide

This guide details how to install PRISM on users' devices (phones, tablets, desktops) and how to publish PRISM to the **Google Play Store** as a verified Android App (`.apk` / `.aab`).

---

## 1. Direct Installation on User Devices (PWA)

PRISM is configured as a standalone **Progressive Web App (PWA)** that can be installed directly from the browser onto any device with full native app integration (home screen icon, standalone window, splash screen, offline capability).

### Android (Chrome, Edge, Brave, Samsung Internet):
1. Open the PRISM search engine in the mobile browser.
2. An **"Install PRISM"** floating pill banner or menu button will appear.
3. Tap **"Install PRISM"** or tap the browser menu (⋮) -> **"Install App"** (or "Add to Home screen").
4. PRISM will be installed into the Android app drawer and home screen just like any native Google Play Store app!

### iOS / iPadOS (Apple Safari):
1. Open PRISM in **Safari**.
2. Tap the **Share** button (the box with an upward arrow at the bottom of Safari).
3. Scroll down and tap **"Add to Home Screen"**.
4. Tap **Add**. PRISM will appear as a native app icon on the iPhone/iPad home screen with custom splash screen and distraction-free standalone window!

### Windows & macOS (Chrome, Edge, Safari):
1. Open PRISM in the browser.
2. Click the **Install** icon in the address bar (or click "Install PRISM" in the top chrome).
3. The app opens in its own frameless window and adds a shortcut to the Windows Start Menu / macOS Launchpad.

---

## 2. Deploying to Google Play Store (TWA — Trusted Web Activity)

Google officially supports deploying PWAs directly to the **Google Play Store** using **Trusted Web Activity (TWA)**. This produces a native Android App Bundle (`.aab`) that you upload directly to the Google Play Console.

### Method A: Using Google's Official CLI (Bubblewrap)

1. **Install Bubblewrap CLI**:
   ```bash
   npm install -g @bubblewrap/cli
   ```

2. **Verify Java & Android SDK**:
   Bubblewrap will automatically download Android build tools if needed:
   ```bash
   bubblewrap doctor
   ```

3. **Initialize the Android Project**:
   ```bash
   bubblewrap init --manifest=https://your-domain.com/manifest.json
   ```
   Or use the pre-configured [twa-manifest.json](file:///c:/Users/kulbhushan/OneDrive/Attachments/Desktop/projects/project%201/project2/twa-manifest.json) in this project root:
   ```bash
   bubblewrap build
   ```

4. **Output**:
   This generates:
   - `app-release-bundle.aab` (Signed Android App Bundle ready for Google Play Store upload)
   - `app-release.apk` (Signed APK for direct sideloading or alternative app stores)

---

### Method B: Using Microsoft PWABuilder (Zero-Setup Web GUI)

1. Deploy PRISM to your production domain (e.g. Vercel, Render, AWS, or your VPS).
2. Go to [https://www.pwabuilder.com](https://www.pwabuilder.com).
3. Enter your PRISM URL and click **Start**.
4. Click **Package for Stores** -> **Google Play**.
5. Configure your Package ID (e.g. `ai.prism.browser`) and app name.
6. Download the generated `.zip` package containing your signed `.aab` file!

---

## 3. Uploading to Google Play Console

1. Log in to [Google Play Console](https://play.google.com/console).
2. Click **Create app**:
   - App name: **PRISM Search & Safari Browser**
   - Default language: **English (US)**
   - App or game: **App**
   - Free or paid: **Free**
3. Under **Release** -> **Production** (or Internal Testing), upload `app-release-bundle.aab`.
4. Fill out Store Listing details (screenshots, descriptions, icon).
5. Submit for Google review!
