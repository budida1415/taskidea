# TaskIdea - Build & Development Instructions

Quick-start guide for setting up TaskIdea development environment. For comprehensive technical details, see [docs/SPECIFICATION.md](docs/SPECIFICATION.md).

## 📋 Prerequisites

- **Node.js**: v14.0 or higher
- **npm**: v6.0 or higher (comes with Node.js)
- **Git**: For version control
- **Google Cloud Project**: With Drive API enabled
- **Code Editor**: VS Code, IntelliJ, or similar

### Verify Installation
```bash
node --version    # Should be v14+
npm --version     # Should be v6+
git --version     # Should be installed
```

## 🔧 Initial Setup

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/TaskIdea.git
cd TaskIdea
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Google Cloud Credentials

#### Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (name: "TaskIdea")
3. Enable the **Google Drive API**:
   - Navigate to APIs & Services → Library
   - Search for "Google Drive API"
   - Click "Enable"
4. Create OAuth 2.0 credentials:
   - Go to APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth client ID"
   - Select "Application type"
   - For each platform you need, configure a redirect URI:
     - Web: `http://localhost:3000/auth/callback`
     - Mobile: `com.taskidea://oauth/redirect` (or your app scheme)
     - Desktop: `http://localhost:3000/auth/callback`

#### Configure Environment Variables
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your credentials
nano .env
# or open with your editor
```

**Required `.env` variables:**
```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
API_BASE_URL=https://www.googleapis.com/drive/v3
NODE_ENV=development
```

## 🚀 Development Commands

### Mobile (iOS/Android)

#### Start Development Server
```bash
npm run mobile:dev
```
This will start Expo in development mode. You'll see a QR code in the terminal.

#### On Your Device
- **iPhone**: Open "Expo Go" app → Scan QR code
- **Android**: Open "Expo Go" app → Scan QR code

#### On Simulator/Emulator
```bash
# iOS Simulator (macOS only)
npm run mobile:dev
# Press 'i' in terminal to open iOS Simulator

# Android Emulator
npm run mobile:dev
# Press 'a' in terminal to open Android Emulator
```

### Web

#### Start Web Development Server
```bash
npm run web:dev
```
App will open at `http://localhost:3000`

Features:
- Hot reload on code changes
- Browser DevTools available
- Responsive design mockup

### Desktop

#### Start Desktop Development
```bash
npm run desktop:dev
```
This starts both the web dev server and Electron window.

Features:
- Native window management
- System menu access
- DevTools available (press F12)

## 🏗️ Building for Production

### Mobile (iOS & Android)

```bash
# Build iOS
npm run mobile:build:ios

# Build Android
npm run mobile:build:android

# Build both
npm run mobile:build
```

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for app store submission details.

### Web

```bash
# Build optimized web bundle
npm run web:build

# Output in 'dist/' folder, ready to deploy
```

Deploy to Vercel, Netlify, Firebase, or your hosting provider.

### Desktop

```bash
# Build standalone installers
npm run desktop:build

# Output in 'dist/electron' folder
# Generates .exe (Windows), .dmg (macOS), .AppImage (Linux)
```

## 📁 Project Structure

```
TaskIdea/
├── src/                           # Shared code (all platforms)
│   ├── screens/
│   │   ├── AuthScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── TasksScreen.tsx
│   │   ├── IdeasScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── components/
│   │   ├── TaskCard.tsx
│   │   ├── IdeaCard.tsx
│   │   ├── TaskForm.tsx
│   │   ├── IdeaForm.tsx
│   │   └── ...
│   ├── services/
│   │   ├── authService.ts
│   │   ├── googleDriveService.ts
│   │   ├── syncService.ts
│   │   └── storageService.ts
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── DataContext.tsx
│   │   └── SyncContext.tsx
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── theme.ts
│   ├── utils/
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   └── helpers.ts
│   ├── constants/
│   │   ├── strings.ts
│   │   └── config.ts
│   └── App.tsx                    # Root component
├── mobile/                        # Mobile-specific (Expo)
│   ├── app.json                   # Expo config
│   └── app.tsx                    # Mobile entry point
├── web/                           # Web-specific (React Native Web)
│   ├── index.html
│   ├── index.css
│   └── app.tsx                    # Web entry point
├── desktop/                       # Desktop-specific (Electron)
│   ├── main.js                    # Main process
│   ├── preload.js                 # Preload script
│   └── app.tsx                    # Renderer process
├── docs/                          # Documentation
│   ├── SPECIFICATION.md           # Technical specification
│   ├── ARCHITECTURE.md
│   ├── API_GUIDE.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
├── .env.example                   # Environment template
├── package.json
├── tsconfig.json
├── app.json                       # Expo config
├── webpack.config.js              # Web bundler (if needed)
└── electron-builder.yml           # Desktop build config
```

## 🐛 Common Issues & Troubleshooting

### Issue: "Cannot find module '@react-native-google-signin/google-signin'"
**Solution**: Run `npm install` again and clear cache
```bash
npm install
npm start -- --reset-cache
```

### Issue: "Google OAuth fails to authenticate"
**Verify:**
- Correct `GOOGLE_CLIENT_ID` in `.env`
- Correct redirect URI configured in Google Cloud Console
- Internet connection is active
- Google Drive API is enabled

### Issue: "Sync not working"
**Check:**
- User is authenticated (login screen appears)
- Internet connection active
- Google Drive permissions granted
- Check browser console for errors (F12)

### Issue: "Port 3000 already in use"
```bash
# Kill process using port 3000
# macOS/Linux:
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: "Expo QR code won't scan"
**Solution:**
- Make sure phone and computer are on same WiFi
- Try restarting Expo: Press 'r' in terminal
- Try refreshing Expo Go app
- Check firewall settings

## 📚 Development Workflow

### Code Changes
1. Edit files in `src/` folder
2. Platform-specific changes in `mobile/`, `web/`, `desktop/`
3. Changes hot-reload automatically during development

### Testing During Development
```bash
# Start dev server (all platforms use same source)
npm run mobile:dev    # Test on device/simulator
npm run web:dev       # Test in browser
npm run desktop:dev   # Test in Electron window
```

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: description of changes"

# Push to remote
git push origin feature/your-feature-name

# Create pull request on GitHub
```

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm test

# E2E tests (mobile)
npm run test:e2e:mobile

# E2E tests (web)
npm run test:e2e:web

# E2E tests (desktop)
npm run test:e2e:desktop
```

## 📖 Next Steps

1. **Read the specification**: [docs/SPECIFICATION.md](docs/SPECIFICATION.md)
2. **Understand architecture**: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
3. **Learn API integration**: [docs/API_GUIDE.md](docs/API_GUIDE.md)
4. **Start coding**: Create your first feature!

## 🆘 Need Help?

- 📖 **Documentation**: See `/docs` folder
- 🐛 **Bugs**: Open GitHub Issue with details
- 💡 **Questions**: Check FAQ in [docs/SPECIFICATION.md](docs/SPECIFICATION.md)
- 📧 **Email**: hbudida@gmail.com

## 🔗 Useful Links

- [Google Cloud Console](https://console.cloud.google.com)
- [Google Drive API Docs](https://developers.google.com/drive/api)
- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [Electron Documentation](https://www.electronjs.org)

---

**Happy coding!** 🚀

For detailed technical information, always refer to [docs/SPECIFICATION.md](docs/SPECIFICATION.md)
