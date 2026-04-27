# TaskIdea - Cross-Platform Task & Idea Management App

A modern, production-ready task list and idea capture application built with React Native, available on **iOS**, **Android**, **Web**, and **Desktop** platforms. All your data is stored securely in your Google Drive with real-time synchronization.

## 🎯 Features

### Core Functionality
- ✅ **Task Management**: Create, organize, track, and complete tasks with priorities and due dates
- ✅ **Idea Capture**: Quickly capture and organize ideas with topics and tags
- ✅ **Google Drive Integration**: Seamless data storage in your personal Google Drive
- ✅ **Real-time Sync**: Automatic synchronization across all devices
- ✅ **Offline Support**: Works offline with automatic sync when connectivity returns
- ✅ **Advanced Filtering**: Search, filter, and sort tasks and ideas by multiple criteria
- ✅ **Cross-Platform**: Native experience on iOS, Android, Web, and Desktop

### Design
- **Theme**: Ocean Depths (Professional, calm maritime color scheme)
- **Responsive**: Optimized layouts for phones, tablets, and desktops
- **Accessible**: Keyboard shortcuts, proper contrast, and touch-friendly targets

## 🚀 Quick Start

1. **Read the specification**: Start with [docs/SPECIFICATION.md](docs/SPECIFICATION.md)
2. **Install dependencies**: `npm install`
3. **Configure Google OAuth**: Set up `.env` with credentials
4. **Start development**:
   ```bash
   npm run mobile:dev      # iOS/Android (Expo)
   npm run web:dev         # Web browser
   npm run desktop:dev     # Desktop (Electron)
   ```

For detailed setup instructions, see [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md)

## 📋 Documentation

- **[SPECIFICATION.md](docs/SPECIFICATION.md)** - Complete technical specification (START HERE)
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System architecture and design patterns
- **[API_GUIDE.md](docs/API_GUIDE.md)** - Google Drive API integration details
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Platform-specific deployment guides
- **[CONTRIBUTING.md](docs/CONTRIBUTING.md)** - Guidelines for contributors
- **[BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md)** - Developer quick start

## 🛠️ Tech Stack

### Frontend
- **React Native** + Expo (mobile base)
- **React Native Web** (web platform)
- **Electron** (desktop platform)
- **TypeScript** for type safety
- **Redux Toolkit** or **Zustand** for state management
- **React Navigation** for cross-platform navigation

### Backend
- **Google Drive REST API v3**
- **Google OAuth 2.0**
- **JSON file storage** (no database server)

### Platform Support
| Platform | Status | Build Tool |
|----------|--------|-----------|
| iOS | ✅ Supported | Expo EAS Build |
| Android | ✅ Supported | Expo EAS Build |
| Web | ✅ Supported | Webpack (Expo Web) |
| Desktop | ✅ Supported | Electron Forge |

## 🎨 Design System

### Colors (Ocean Depths Theme)
- **Primary Dark**: `#1a2332` (Deep Navy)
- **Primary**: `#2d8b8b` (Teal)
- **Accent**: `#a8dadc` (Seafoam)
- **Background**: `#f1faee` (Cream)

### Typography
- **Headers**: DejaVu Sans Bold
- **Body**: DejaVu Sans Regular

## 📦 Project Structure

```
TaskIdea/
├── docs/                          # Documentation
│   ├── SPECIFICATION.md          # Complete technical spec
│   ├── ARCHITECTURE.md           # System architecture
│   ├── API_GUIDE.md              # API documentation
│   ├── DEPLOYMENT.md             # Deployment guides
│   └── CONTRIBUTING.md           # Contributing guidelines
├── src/                           # Shared source code
│   ├── screens/                  # App screens
│   ├── components/               # Reusable components
│   ├── services/                 # Business logic
│   ├── context/                  # State management
│   ├── theme/                    # Design system
│   └── utils/                    # Helper functions
├── mobile/                        # Mobile-specific (Expo)
├── web/                           # Web-specific (React Native Web)
├── desktop/                       # Desktop-specific (Electron)
├── .env.example                   # Environment variables template
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── README.md                      # This file
└── BUILD_INSTRUCTIONS.md          # Development setup
```

## 🔐 Security & Privacy

- **Data Ownership**: 100% of your data stays in your Google Drive
- **No Third-party Access**: Direct Google OAuth, no intermediary servers
- **Encryption**: All local data encrypted at rest
- **No Tracking**: No analytics or user tracking
- **Open Standards**: Uses standard OAuth 2.0 and Google Drive API

## 🚀 Development

### Prerequisites
- Node.js 14+
- npm or yarn
- Google Cloud Project with Drive API enabled
- Mobile device or emulator (optional, for mobile testing)

### Getting Started

```bash
# Clone repository
git clone <repo-url>
cd TaskIdea

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure Google OAuth credentials in .env
# Edit .env with your Google Cloud credentials

# Start development server
npm run mobile:dev    # For iOS/Android
npm run web:dev       # For Web
npm run desktop:dev   # For Desktop
```

See [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md) for detailed setup per platform.

## 📚 Learning Resources

- [React Native Documentation](https://reactnative.dev)
- [Expo Documentation](https://docs.expo.dev)
- [Google Drive API Guide](https://developers.google.com/drive/api)
- [Electron Documentation](https://www.electronjs.org/docs)

## 🤝 Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines on:
- Code style
- Pull request process
- Bug reporting
- Feature requests

## 📄 License

MIT License - See LICENSE file for details

## 👤 Author

**Hariswar Budida**
- Email: hbudida@gmail.com

## 📞 Support

- 📖 Check [docs/SPECIFICATION.md](docs/SPECIFICATION.md) for detailed information
- 🐛 Report issues via GitHub Issues
- 💡 Suggest features via GitHub Discussions
- 📧 Contact: hbudida@gmail.com

## 🎯 Roadmap

### Version 1.0 (Current)
- ✅ Cross-platform support (iOS, Android, Web, Desktop)
- ✅ Task management with priorities and dates
- ✅ Idea capture and organization
- ✅ Google Drive integration
- ✅ Real-time sync with offline support
- ✅ Search and filtering

### Future Enhancements
- 🔄 Collaborative lists (shared tasks)
- 📊 Task analytics and insights
- 🔔 Push notifications
- 🎯 Goal tracking
- 📁 File attachments
- 🗣️ Voice-to-text capture

---

**Last Updated**: April 25, 2026  
**Status**: Development Ready  
**Version**: 1.0.0-alpha
