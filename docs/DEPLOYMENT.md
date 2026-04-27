# TaskIdea - Deployment Guide

Complete platform-specific deployment guides for TaskIdea (iOS, Android, Web, Desktop).

## Table of Contents
- [iOS Deployment](#ios-deployment)
- [Android Deployment](#android-deployment)
- [Web Deployment](#web-deployment)
- [Desktop Deployment](#desktop-deployment)
- [Environment Configuration](#environment-configuration)
- [CI/CD Pipeline](#cicd-pipeline)

---

## iOS Deployment

### Prerequisites
- macOS (for building iOS apps)
- Apple Developer Account ($99/year)
- Xcode Command Line Tools: `xcode-select --install`
- EAS CLI: `npm install -g eas-cli`

### Build Process

#### 1. Create EAS Build Configuration

Create `eas.json`:
```json
{
  "build": {
    "production": {
      "ios": {
        "image": "latest",
        "resourceClass": "m-medium"
      }
    },
    "preview": {
      "ios": {
        "image": "latest",
        "resourceClass": "m-medium"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "YOUR_APP_ID",
        "appleId": "your-email@apple.com",
        "appleTeamId": "YOUR_TEAM_ID"
      }
    }
  }
}
```

#### 2. Configure App.json

```json
{
  "expo": {
    "name": "TaskIdea",
    "slug": "taskidea",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain"
    },
    "ios": {
      "supportsTabletMode": true,
      "supportsUnitTest": false,
      "bundleIdentifier": "com.taskidea.app"
    },
    "plugins": [
      "@react-native-google-signin/google-signin"
    ]
  }
}
```

#### 3. Build for App Store

```bash
# Login to EAS
eas login

# Build production iOS app
eas build --platform ios --auto-submit

# Or manual build
eas build --platform ios
```

#### 4. Submit to App Store

```bash
# Automatic submission (if configured)
eas build --platform ios --auto-submit

# Manual submission
eas submit --platform ios
```

### App Store Requirements
- ✅ Privacy Policy URL
- ✅ App icon (1024x1024)
- ✅ Screenshots (2-5 per device)
- ✅ App description (max 4000 chars)
- ✅ Support URL
- ✅ Version number
- ✅ Build number (increment each build)

### Testing on iOS Device

```bash
# Build development build
eas build --platform ios --profile preview

# Install on device
# Scan QR code with iOS camera app or Expo Go

# Or install via App Store TestFlight
# After building for App Store
```

---

## Android Deployment

### Prerequisites
- Android SDK (Android Studio or sdkmanager)
- Google Play Developer Account ($25 one-time)
- EAS CLI: `npm install -g eas-cli`
- Keystore file (for signing)

### Build Process

#### 1. Create Keystore

```bash
# Generate keystore (one-time)
keytool -genkey-and-cert-by-signer-sig-algs \
  -alias taskidea \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -keystore taskidea.keystore

# Store securely (backup this file!)
```

#### 2. Configure eas.json

```json
{
  "build": {
    "production": {
      "android": {
        "image": "latest",
        "resourceClass": "medium",
        "gradleCommand": ":app:bundleRelease",
        "env": {
          "KEYSTORE_PATH": "./taskidea.keystore",
          "KEYSTORE_PASSWORD": "YOUR_KEYSTORE_PASSWORD",
          "KEY_ALIAS": "taskidea",
          "KEY_PASSWORD": "YOUR_KEY_PASSWORD"
        }
      }
    }
  }
}
```

#### 3. Build for Google Play

```bash
# Login to EAS
eas login

# Build production Android app (AAB format)
eas build --platform android --auto-submit

# Or manual build
eas build --platform android
```

#### 4. Submit to Google Play

```bash
# Automatic submission
eas build --platform android --auto-submit

# Manual submission via Google Play Console
# 1. Go to Google Play Console
# 2. Select your app
# 3. Upload the generated AAB file
# 4. Complete store listing
# 5. Submit for review
```

### Google Play Store Requirements
- ✅ App icon (512x512)
- ✅ Screenshots (2-8 per phone/tablet)
- ✅ Short description (80 chars max)
- ✅ Full description (4000 chars max)
- ✅ Feature graphic (1024x500)
- ✅ Version number
- ✅ Minimum SDK version (Android 5.0+)
- ✅ Content rating (via questionnaire)
- ✅ Privacy policy URL
- ✅ Support URL

### Testing on Android Device

```bash
# Build preview (development) build
eas build --platform android --profile preview

# Scan QR code to install
# Or use adb to install APK
```

---

## Web Deployment

### Prerequisites
- Node.js 14+
- npm or yarn
- Hosting service (Vercel, Netlify, Firebase, AWS)

### Build Process

#### 1. Build Web Bundle

```bash
npm run web:build
```

This generates a production-optimized bundle in `dist/` folder.

#### 2. Test Build Locally

```bash
# Serve the production build locally
npm install -g serve
serve dist/
```

Visit `http://localhost:3000` to test.

### Deployment Options

#### Option A: Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Or automatic deployment from GitHub
# 1. Connect GitHub repo to Vercel
# 2. Configure build settings:
#    - Build Command: npm run web:build
#    - Output Directory: dist
# 3. Set environment variables in Vercel dashboard
# 4. Push to main branch to auto-deploy
```

**vercel.json** configuration:
```json
{
  "buildCommand": "npm run web:build",
  "outputDirectory": "dist",
  "env": {
    "GOOGLE_CLIENT_ID": "@google_client_id",
    "GOOGLE_REDIRECT_URI": "https://taskidea.vercel.app/auth/callback"
  }
}
```

#### Option B: Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Or continuous deployment
# 1. Connect GitHub repo to Netlify
# 2. Build settings:
#    - Build command: npm run web:build
#    - Publish directory: dist
# 3. Set environment variables
# 4. Auto-deploy on Git push
```

**netlify.toml** configuration:
```toml
[build]
  command = "npm run web:build"
  publish = "dist"

[context.production.environment]
  GOOGLE_CLIENT_ID = "your_client_id"
  GOOGLE_REDIRECT_URI = "https://taskidea.netlify.app/auth/callback"
```

#### Option C: Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize project
firebase init hosting

# Deploy
firebase deploy --only hosting

# Configuration: firebase.json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*"],
    "redirects": [
      {
        "source": "/auth/callback",
        "destination": "/",
        "type": 301
      }
    ]
  }
}
```

### Environment Variables for Web

Set in hosting provider dashboard:
```
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_REDIRECT_URI=https://your-domain.com/auth/callback
NODE_ENV=production
DEBUG_MODE=false
```

### Performance Optimization

```bash
# Check bundle size
npm run web:build -- --analyze

# Optimize images
npx imagemin src/assets/*.png --out-dir=src/assets

# Enable compression (configured by default in production builds)
```

---

## Desktop Deployment

### Prerequisites
- Node.js 14+
- Python 3.6+ (for building on Windows)
- Code signing certificate (optional but recommended)

### Build Process

#### 1. Build Electron App

```bash
# Build for all platforms
npm run desktop:build

# Build for specific platform
npm run desktop:build:win    # Windows
npm run desktop:build:mac    # macOS
npm run desktop:build:linux  # Linux
```

#### 2. Configure electron-builder.yml

```yaml
appId: com.taskidea.app
productName: TaskIdea
directories:
  buildResources: assets
  output: dist/electron
files:
  - from: ./dist/web
    to: app
  - node_modules
  - package.json

win:
  target:
    - nsis
    - portable
  certificateFile: ./certs/certificate.pfx
  certificatePassword: ${WIN_CSC_KEY_PASSWORD}

mac:
  target:
    - dmg
    - zip
  identity: Developer ID Application

nsis:
  oneClick: false
  allowToChangeInstallationDirectory: true
  createDesktopShortcut: true
  createStartMenuShortcut: true

linux:
  target:
    - AppImage
    - deb
```

#### 3. Code Signing (Optional)

**Windows:**
```bash
# Get code signing certificate
# Configure in electron-builder.yml
# Set environment variable
export WIN_CSC_KEY_PASSWORD=your_password
npm run desktop:build:win
```

**macOS:**
```bash
# Need Apple Developer ID
export CSC_IDENTITY_AUTO_DISCOVERY=false
export CSC_KEY_PASSWORD=your_password
npm run desktop:build:mac
```

### Distribution Options

#### Option A: Direct Download

1. Build the app
2. Host installers on GitHub Releases or your website
3. Users download and install manually

```bash
# Create GitHub release
git tag v1.0.0
git push origin v1.0.0

# Upload files to release:
# - TaskIdea-1.0.0.exe (Windows)
# - TaskIdea-1.0.0.dmg (macOS)
# - TaskIdea-1.0.0.AppImage (Linux)
```

#### Option B: Auto-Update

Configure electron-updater:

```typescript
import { autoUpdater } from 'electron-updater';

autoUpdater.checkForUpdatesAndNotify();

// In package.json
{
  "build": {
    "publish": [
      {
        "provider": "github",
        "owner": "yourusername",
        "repo": "TaskIdea"
      }
    ]
  }
}
```

### Windows Installation

Users can install via:
1. **NSIS Installer**: `TaskIdea-Setup-1.0.0.exe`
2. **Portable**: `TaskIdea-1.0.0.exe` (no installation)

### macOS Installation

```bash
# Mount and install
open TaskIdea-1.0.0.dmg
# Drag TaskIdea to Applications folder
```

### Linux Installation

```bash
# Install AppImage
chmod +x TaskIdea-1.0.0.AppImage
./TaskIdea-1.0.0.AppImage

# Or install .deb
sudo dpkg -i taskidea_1.0.0_amd64.deb
```

---

## Environment Configuration

### Development (.env)
```env
NODE_ENV=development
GOOGLE_CLIENT_ID=dev_client_id
GOOGLE_CLIENT_SECRET=dev_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
API_BASE_URL=https://www.googleapis.com/drive/v3
DEBUG_MODE=true
```

### Production (.env.production)
```env
NODE_ENV=production
GOOGLE_CLIENT_ID=prod_client_id
GOOGLE_CLIENT_SECRET=prod_client_secret
GOOGLE_REDIRECT_URI=https://taskidea.app/auth/callback
API_BASE_URL=https://www.googleapis.com/drive/v3
DEBUG_MODE=false
SENTRY_DSN=your_sentry_dsn (for error tracking)
```

### Environment Variable Management

**For mobile (EAS):**
```bash
# Store in eas.json
eas secret:create --scope project --name GOOGLE_CLIENT_ID --value your_value
```

**For web (Vercel/Netlify/Firebase):**
- Set in dashboard environment variables section
- Reference as `process.env.VARIABLE_NAME`

**For desktop (Electron):**
- Store in .env file
- Reference as `process.env.VARIABLE_NAME`

---

## CI/CD Pipeline

### GitHub Actions Example

**File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
    
    - name: Install dependencies
      run: npm install
    
    - name: Run tests
      run: npm test
    
    - name: Build web
      run: npm run web:build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        working-directory: ./
```

---

## Version Management

### Semantic Versioning

```
MAJOR.MINOR.PATCH

1.0.0
├─ MAJOR: Breaking changes
├─ MINOR: New features (backward compatible)
└─ PATCH: Bug fixes

Next version:
├─ Feature: 1.0.0 → 1.1.0
├─ Bug fix: 1.0.0 → 1.0.1
└─ Breaking: 1.0.0 → 2.0.0
```

### Update Version

**In package.json:**
```json
{
  "version": "1.0.0"
}
```

**In app.json (Expo):**
```json
{
  "expo": {
    "version": "1.0.0"
  }
}
```

**Build number (iOS):**
```
Each submission increment: 1, 2, 3, ...
```

---

## Monitoring & Analytics

### Error Tracking (Sentry)

```bash
npm install @sentry/react @sentry/tracing
```

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Crash Reporting

- **Mobile**: Sentry automatically captures crashes
- **Web**: Sentry JavaScript SDK
- **Desktop**: Electron error handlers + Sentry

---

## Post-Deployment Checklist

- [ ] Test app on all platforms
- [ ] Verify Google authentication works
- [ ] Check sync functionality
- [ ] Test offline mode
- [ ] Verify links in app work
- [ ] Check version number updated
- [ ] Monitor for errors (Sentry dashboard)
- [ ] Announce release to users
- [ ] Keep users updated on status

---

For more information, see:
- [BUILD_INSTRUCTIONS.md](../BUILD_INSTRUCTIONS.md) - Development setup
- [docs/SPECIFICATION.md](SPECIFICATION.md) - Complete specification
- [docs/API_GUIDE.md](API_GUIDE.md) - API documentation
