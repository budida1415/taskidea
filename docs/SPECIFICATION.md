# TaskIdea App - Comprehensive Build Prompt (Mobile + Desktop)
## Complete Cross-Platform Implementation Specification

## Project Overview
Build a cross-platform (iOS, Android, Web, Desktop) task list and idea capture app using React Native Web + Electron. Single codebase serves all platforms. All user data is stored as JSON files in Google Drive. No separate backend server required.

## Theme & Design System

### Color Palette (Ocean Depths Theme)
- **Primary Dark**: `#1a2332` (Deep Navy)
- **Primary**: `#2d8b8b` (Teal)
- **Accent**: `#a8dadc` (Seafoam)
- **Background**: `#f1faee` (Cream)
- **Text Dark**: `#1a2332` (Deep Navy)
- **Text Light**: `#ffffff` (White)
- **Border**: `#a8dadc` (Seafoam)
- **Success**: `#4a7c59` (Fern Green)
- **Error**: `#c1666b` (Terracotta)
- **Warning**: `#f9a620` (Marigold)

### Typography
- **Headers**: DejaVu Sans Bold, size 24-32px (desktop), 20-24px (mobile)
- **Body Text**: DejaVu Sans Regular, size 14-16px (both)
- **Subheadings**: DejaVu Sans Bold, size 18-22px (desktop), 16-18px (mobile)
- **Button Text**: DejaVu Sans Bold, size 14px
- **Captions**: DejaVu Sans Regular, size 12px

## Tech Stack - Cross-Platform

### Frontend Architecture
- **Base Framework**: React Native with Expo
- **Desktop Support**: React Native Web + Electron
- **Language**: TypeScript (for type safety)
- **State Management**: Redux Toolkit or Zustand
- **Navigation**: React Navigation (works across all platforms)
- **UI Library**: React Native Paper (cross-platform compatible)
- **Authentication**: @react-native-google-signin/google-signin + react-google-login
- **Storage**: AsyncStorage (mobile/web), node-localstorage (Electron)
- **File Handling**: 
  - Mobile: AsyncStorage
  - Web: IndexedDB/LocalStorage
  - Desktop: Electron fs module + Google Drive API

### Backend
- **API**: Google Drive REST API v3
- **Authentication**: Google OAuth 2.0 (Google Sign-In)
- **Database**: JSON files in Google Drive
- **Sync**: Custom sync mechanism with conflict resolution

### Platform-Specific Setup
```
TaskIdea/
├── src/
│   ├── screens/          # Shared screens
│   ├── components/       # Shared components (responsive)
│   ├── context/          # Shared context/state
│   ├── services/         # Shared services
│   ├── utils/            # Shared utilities
│   ├── theme/            # Shared theme (Ocean Depths)
│   ├── constants/        # Shared constants
│   └── App.tsx           # Main app component
├── mobile/               # Mobile-specific (Expo)
│   ├── app.json
│   └── app.tsx
├── web/                  # Web-specific (React Native Web)
│   ├── index.html
│   └── app.tsx
├── desktop/              # Desktop-specific (Electron)
│   ├── main.js
│   ├── preload.js
│   └── App.tsx
├── package.json
└── tsconfig.json
```

## Platform-Specific Details

### Mobile (iOS/Android via Expo)
- **Build Tool**: Expo EAS Build
- **Screen Sizes**: Support 4.5" to 6.5"+ phones
- **Navigation**: Bottom tab navigation + stack navigation
- **Gestures**: Swipe, long-press, pull-to-refresh
- **Safe Areas**: SafeAreaView for notches/home buttons
- **Performance**: Optimize for lower-end devices

### Web (React Native Web)
- **Build Tool**: Webpack (configured via Expo Web)
- **Screen Sizes**: Responsive (375px - 2560px+)
- **Navigation**: Tab navigation + drawer (responsive)
- **Storage**: IndexedDB for caching
- **Browser Support**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Performance**: Code splitting, lazy loading

### Desktop (Electron)
- **Build Tool**: Electron Forge / electron-builder
- **Screen Sizes**: Responsive window (min 800x600, default 1200x800)
- **Navigation**: Menu bar + sidebar navigation
- **Storage**: Node.js file system + AsyncStorage
- **Features**:
  - Native window management
  - System tray support
  - Keyboard shortcuts
  - File system access
  - Native notifications
- **Performance**: Optimize for all CPU architectures

## Data Structure & Google Drive Organization

### Google Drive Folder Structure
```
My Drive/
└── TaskIdea/
    ├── tasks/
    │   ├── tasks_current.json      (active tasks)
    │   ├── tasks_archive.json      (completed/archived)
    │   └── tasks_metadata.json     (sync metadata)
    ├── ideas/
    │   ├── ideas_current.json      (active ideas)
    │   ├── ideas_archive.json      (archived ideas)
    │   └── ideas_metadata.json     (sync metadata)
    └── settings.json               (user preferences)
```

### Task JSON Schema
```json
{
  "id": "task_uuid",
  "title": "string (required)",
  "description": "string (optional)",
  "dueDate": "YYYY-MM-DD (optional)",
  "priority": "high | medium | low",
  "status": "pending | in-progress | completed | blocked",
  "category": "string (optional)",
  "tags": ["string"],
  "createdAt": "ISO8601 timestamp",
  "updatedAt": "ISO8601 timestamp",
  "completedAt": "ISO8601 timestamp | null",
  "recurring": {
    "enabled": boolean,
    "frequency": "daily | weekly | monthly | null"
  },
  "platform": "ios | android | web | electron"
}
```

### Idea JSON Schema
```json
{
  "id": "idea_uuid",
  "title": "string (required)",
  "description": "string (optional)",
  "topic": "string (optional)",
  "tags": ["string"],
  "starred": boolean,
  "archived": boolean,
  "createdAt": "ISO8601 timestamp",
  "updatedAt": "ISO8601 timestamp",
  "platform": "ios | android | web | electron"
}
```

### Settings JSON Schema
```json
{
  "userId": "string",
  "userEmail": "string",
  "theme": "ocean_depths",
  "notifications": {
    "enabled": boolean,
    "reminders": boolean,
    "syncNotifications": boolean
  },
  "sync": {
    "autoSync": boolean,
    "lastSyncTime": "ISO8601 timestamp",
    "syncInterval": 30000
  },
  "preferences": {
    "defaultView": "all | pending | completed",
    "defaultCategory": "string",
    "sortBy": "dueDate | createdAt | priority"
  },
  "platform": "ios | android | web | electron"
}
```

## Authentication Flow

### Desktop-Specific Auth
1. **Web-based OAuth**: Open OAuth flow in system browser
2. **Token Management**: Store securely using OS keychain
3. **Token Refresh**: Automatic refresh before expiration
4. **Session Persistence**: Encrypt and store in secure storage

### Mobile Auth
1. User launches app
2. Check for existing authentication token
3. If not authenticated, show Google Sign-In button
4. Authenticate via Google sign-in modal
5. Store token securely
6. Initialize sync with Google Drive

### Web Auth
1. Similar to mobile but uses browser-based OAuth flow
2. Store token in encrypted localStorage
3. Handle OAuth redirect properly

## Core Features (All Platforms)

### 1. Authentication Screen
- App logo with "TaskIdea" branding
- "Sign in with Google" button (Ocean Depths styled)
- Loading indicator during authentication
- Error messages with retry
- "Offline Mode" option (limited functionality)
- Remember me checkbox (desktop/web)

### 2. Home Screen / Dashboard
- Welcome message with user's name
- Quick stats:
  - Total tasks | Pending | Completed
  - Total ideas | Starred ideas
- Quick action buttons:
  - [+ Add Task] [+ Add Idea]
- Recent activity feed
- Upcoming tasks widget
- Last sync time indicator

### 3. Tasks Management

#### Tasks List Screen
- **Mobile View**: Single column, vertical scroll
- **Desktop View**: Two columns, optional sidebar filters
- Task cards displaying:
  - Title, description preview
  - Due date (with visual indicator if overdue)
  - Priority badge (High/Medium/Low with color)
  - Status indicator
  - Category label
  - Quick action buttons (complete, delete)

#### Task Filtering & Search
- Filter toggles:
  - Status: All / Pending / In-Progress / Completed / Blocked
  - Priority: All / High / Medium / Low
  - Category: Dropdown selector
  - Date range picker
- Search input (fuzzy search on title + description)
- Sort options:
  - Due date (ascending/descending)
  - Created date
  - Priority
  - Title (A-Z)
- Save favorite filters

#### Task Detail Screen
- Full-screen edit form (mobile) or modal (desktop)
- Fields:
  - Title (required, text input)
  - Description (optional, multi-line textarea)
  - Due date (date picker with time)
  - Priority (radio selector or dropdown)
  - Status (dropdown/selector)
  - Category (autocomplete or dropdown)
  - Tags (chips input with suggestions)
  - Recurring (toggle + frequency selector)
  - Notes/attachments (expandable section)
- Action buttons:
  - Save, Cancel, Delete, Mark Complete
- Sync status indicator
- Version history (if on desktop)

#### Task Actions
- Create: FAB or button opens new task form
- Read: Tap task to view details
- Update: Edit mode for all fields
- Delete: Swipe or delete button with confirmation
- Mark Complete: Single tap on status or checkbox
- Bulk Actions (desktop): Select multiple → mark complete, delete, or change category

### 4. Ideas Management

#### Ideas List Screen
- **Mobile View**: Single column, card-based layout
- **Desktop View**: Grid layout (2-3 columns depending on screen size)
- Idea cards displaying:
  - Title
  - Topic label
  - Created date
  - Star icon (toggle favorite)
  - Tags
  - Preview text

#### Idea Filtering & Search
- Filter options:
  - Status: All / Active / Archived
  - Topic: Dropdown selector
  - Starred: Show all / starred only
- Search input (title + description)
- Sort options:
  - Created date (newest first)
  - Modified date
  - Alphabetical
  - Starred first

#### Idea Detail Screen
- Full-screen form (mobile) or modal (desktop)
- Fields:
  - Title (required)
  - Description (optional, rich text)
  - Topic (autocomplete/dropdown)
  - Tags (chips input)
  - Star toggle
  - Archive toggle
- Action buttons:
  - Save, Cancel, Delete, Archive
- Sync status

#### Idea Actions
- Create: FAB or button
- Read: Tap to view full details
- Update: Edit form
- Delete: Confirmation dialog
- Archive: Move to archive (soft delete)
- Star: Mark as favorite

### 5. Settings Screen

#### Layout Variations
- **Mobile**: Vertical scrolling list of settings sections
- **Desktop**: Sidebar navigation + main panel

#### Sections

**User Profile**
- Display name
- Email
- Profile picture (from Google account)
- Last sync time
- Account storage usage (from Google Drive)

**Data Management**
- Manual sync button with visual feedback
- Export data (JSON download)
- Import data (upload JSON file)
- Clear all data (with confirmation)
- Sync history/log (desktop only)

**App Settings**
- Theme selector (show Ocean Depths applied, expandable to show other themes)
- Notifications toggle
- Auto-sync toggle with interval selector
- Default view preference
- Sort preference
- Offline mode indicator

**Shortcuts** (Desktop only)
- Keyboard shortcuts reference
- Customizable hotkeys

**About**
- App version
- Build date
- Developer info
- Terms of Service / Privacy Policy links
- Check for updates button
- Logout button

### 6. Sync & Offline Support

#### Sync Mechanism
- **Auto-sync**: 
  - On app launch
  - Every 30 seconds (configurable)
  - On app resume from background
  - On network reconnection
- **Manual sync**: User-triggered button
- **Conflict resolution**: Last-write-wins with timestamp comparison
- **Offline support**:
  - All changes stored locally
  - Pending changes queue
  - Automatic sync on reconnection
  - Visual indicator ("Offline Mode", "Syncing...", "Synced")

#### Sync Status UI
- **Mobile**: Small indicator in header (icon + timestamp)
- **Desktop**: Status bar at bottom of window
- **Web**: Status bar at bottom of viewport
- Shows: Last sync time, sync in progress spinner, error messages

### 7. Navigation & Layout

#### Mobile Navigation
- Bottom tab bar (3-5 tabs):
  - Tasks (home icon)
  - Ideas (lightbulb icon)
  - Settings (gear icon)
  - (Optional: Calendar, Stats)
- Stack navigation within each tab
- Drawer menu (optional, accessible via hamburger)

#### Desktop Navigation
- Left sidebar with collapsible menu:
  - Dashboard (home)
  - Tasks (with filter shortcuts)
  - Ideas (with filter shortcuts)
  - Calendar/Timeline (optional)
  - Settings
- Top header with:
  - Logo / App name
  - Search bar (global search)
  - User profile menu
  - Sync status indicator
  - Notification bell

#### Web Navigation
- Responsive: Convert sidebar to hamburger menu on small screens
- Top navigation bar (always visible)
- Content area adjusts to screen size
- Drawer menu on mobile viewport

## Responsive Design Specifications

### Breakpoints
- **Mobile**: 375px - 600px (phones)
- **Tablet**: 601px - 1024px (tablets)
- **Desktop**: 1025px+ (desktops)

### Layout Adjustments
| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Navigation | Bottom tabs | Side drawer | Left sidebar |
| Task list | 1 column | 1-2 columns | 2-3 columns |
| Padding | 16px | 20px | 24px |
| Font size | -2px | Normal | +2px |
| Modal | Full screen | 80% viewport | 600px width |
| Sidebar | Hidden | Visible (collapsible) | Always visible |

### Touch vs Click
- **Mobile**: Larger touch targets (48px minimum)
- **Desktop**: Smaller UI elements (32px minimum), hover states
- **Web**: Hybrid (both touch and mouse support)

## Google Drive API Integration

### OAuth 2.0 Scopes
```
https://www.googleapis.com/auth/drive.file
https://www.googleapis.com/auth/userinfo.profile
https://www.googleapis.com/auth/userinfo.email
```

### API Operations
1. **Create TaskIdea folder**: If not exists on first auth
2. **Upload/Create file**: New task or idea
3. **Update file**: Modify existing task/idea
4. **Read file**: Fetch JSON content
5. **List files**: Query tasks/ideas with filters
6. **Delete file**: Remove tasks/ideas
7. **Sync metadata**: Track sync times and versions

### Error Handling
- Network errors: Queue and retry with exponential backoff
- Auth errors: Clear token, redirect to login
- Permission errors: Request permissions or show error
- Rate limiting: Implement backoff (max 30 requests/second)
- Offline: Queue operations, sync when online

## State Management (Zustand/Redux)

### Store Structure
```typescript
{
  auth: {
    isAuthenticated: boolean
    user: { email, name, profilePicture }
    token: string
    error: string | null
  }
  tasks: {
    items: Task[]
    loading: boolean
    error: string | null
    filters: { status, priority, category, dateRange }
    search: string
  }
  ideas: {
    items: Idea[]
    loading: boolean
    error: string | null
    filters: { status, topic, starred }
    search: string
  }
  sync: {
    isSyncing: boolean
    lastSyncTime: timestamp
    pendingChanges: { tasks: [], ideas: [] }
    error: string | null
  }
  settings: {
    theme: string
    notifications: boolean
    autoSync: boolean
    preferences: {}
  }
}
```

## Component Architecture

### Shared Components (All Platforms)
```
src/components/
├── TaskCard.tsx          # Task list item
├── IdeaCard.tsx          # Idea list item
├── TaskForm.tsx          # Task create/edit
├── IdeaForm.tsx          # Idea create/edit
├── FilterBar.tsx         # Filters UI
├── SearchInput.tsx       # Search component
├── SyncIndicator.tsx     # Sync status
├── UserProfile.tsx       # User section
├── Buttons/
│   ├── PrimaryButton.tsx
│   ├── SecondaryButton.tsx
│   └── IconButton.tsx
├── Inputs/
│   ├── TextInput.tsx
│   ├── TextArea.tsx
│   ├── DatePicker.tsx
│   └── TagInput.tsx
├── Dialogs/
│   ├── ConfirmDialog.tsx
│   └── ErrorDialog.tsx
└── Layout/
    ├── SafeArea.tsx
    └── Container.tsx
```

### Platform-Specific Components
```
mobile/components/        # Mobile-only (Expo)
├── BottomTabNav.tsx
├── SwipeableCard.tsx
└── MobileHeader.tsx

web/components/           # Web-only (React Native Web)
├── WebNavigation.tsx
└── ResponsiveGrid.tsx

desktop/components/       # Desktop-only (Electron)
├── MenuBar.tsx
├── Sidebar.tsx
├── SystemTray.tsx
└── DesktopHeader.tsx
```

## Build & Deployment

### Development Setup
```bash
# Install dependencies
npm install

# Run on specific platform
npm run mobile:dev      # Expo (iOS/Android)
npm run web:dev         # Web (localhost:3000)
npm run desktop:dev     # Electron (localhost:3000 + window)

# Build for production
npm run mobile:build    # EAS build
npm run web:build       # Production web bundle
npm run desktop:build   # Electron installer
```

### Configuration Files
- `.env`: API keys, OAuth credentials
- `app.json`: Expo configuration
- `electron-builder.yml`: Desktop build config
- `tsconfig.json`: TypeScript settings
- `webpack.config.js`: Web bundler config (if needed)

### Deployment Targets
- **iOS**: App Store (via EAS Build)
- **Android**: Google Play Store (via EAS Build)
- **Web**: Vercel, Netlify, or Firebase Hosting
- **Desktop**: GitHub Releases, or installer packages

## Performance Optimization

### Mobile/Web
- Lazy load components with React.lazy()
- Code splitting by platform and feature
- Image optimization
- Memoization (useMemo, useCallback)
- Virtual scrolling for large lists

### Desktop
- Worker threads for sync operations
- Caching strategy for Google Drive
- Local database (SQLite) as cache layer
- Progressive sync (background)

## Security Considerations

- **Token Storage**:
  - Mobile: Secure storage (Keychain/Keystore)
  - Web: httpOnly cookies or encrypted localStorage
  - Desktop: OS keychain
- **Data Encryption**: All local data encrypted at rest
- **API Keys**: Never exposed in client code
- **HTTPS**: All API calls over HTTPS
- **CORS**: Proper CORS headers for web
- **No sensitive data** in logs/console

## Testing Requirements

- **Unit Tests**: Services, utilities, reducers
- **Integration Tests**: API interactions
- **E2E Tests**: Critical user flows
- **Platform-specific Tests**:
  - Mobile: Detox (Expo)
  - Web: Cypress / Playwright
  - Desktop: Spectron

## Documentation

- README with platform-specific setup
- API documentation for services
- Component storybook (optional)
- Deployment guides per platform
- User guide / FAQ

## Deliverables

### Code
- ✅ Complete cross-platform source code
- ✅ All four platforms working (Mobile, Web, Desktop)
- ✅ Ocean Depths theme applied consistently
- ✅ Full authentication flow
- ✅ Complete task/idea CRUD operations
- ✅ Google Drive integration
- ✅ Sync mechanism with offline support
- ✅ Settings & preferences
- ✅ Responsive design for all screen sizes
- ✅ Error handling & edge cases

### Documentation
- ✅ README.md with setup for all platforms
- ✅ Contributing guidelines
- ✅ Architecture overview
- ✅ API documentation
- ✅ Deployment guides

### Ready to Deploy
- ✅ iOS build ready for App Store
- ✅ Android build ready for Google Play
- ✅ Web build deployable to Vercel/Netlify
- ✅ Desktop package ready for distribution

## Acceptance Criteria

- ✅ App builds and runs on iOS, Android, Web, and Desktop
- ✅ Google Sign-In works seamlessly on all platforms
- ✅ All CRUD operations work (tasks and ideas)
- ✅ Data syncs to Google Drive in real-time
- ✅ Offline mode works with background sync
- ✅ Ocean Depths theme applied throughout
- ✅ UI is responsive and native-feeling on each platform
- ✅ Search and filters work correctly
- ✅ Settings screen functional
- ✅ No console errors or warnings
- ✅ Loading states and error handling visible
- ✅ Keyboard shortcuts work on desktop

---

## FINAL INSTRUCTION FOR CLAUDE CODE

**"Build TaskIdea as a complete, production-ready cross-platform application supporting iOS, Android, Web, and Desktop (Electron). Use React Native with Expo as the base, React Native Web for web, and Electron for desktop. Use a single shared codebase with platform-specific implementations only where necessary. Implement ALL specifications above exactly. Use Ocean Depths colors and typography. Include complete Google Drive integration, sync mechanism, offline support, and responsive design for all platforms. Do not ask clarifying questions—this specification is comprehensive and complete. Deliver a fully functional, deployable application ready for all four platforms."**

---

**Platform Support**: iOS, Android, Web (Browser), Desktop (Windows/macOS/Linux)  
**Theme**: Ocean Depths  
**Backend**: Google Drive API  
**Data Storage**: 100% in user's Google Drive  
**Created**: April 25, 2026
