# TaskIdea - System Architecture

Complete system architecture and design patterns for TaskIdea cross-platform application.

## Architecture Overview

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface Layer                      │
├─────────────────────────────────────────────────────────────┤
│  Mobile (Expo)  │  Web (RNW)  │  Desktop (Electron)        │
└────────┬────────┴─────┬────────┴──────────────┬─────────────┘
         │              │                       │
         └──────────────┼───────────────────────┘
                        ▼
        ┌───────────────────────────────────────┐
        │    Shared Components & Screens         │
        │  (src/components, src/screens)        │
        └────────┬───────────────────────┬──────┘
                 │                       │
        ┌────────▼──────┐     ┌──────────▼─────────┐
        │  State Layer   │     │   Services Layer   │
        │  (Redux/      │     │  (Business Logic)  │
        │   Zustand)    │     │                    │
        └────────┬──────┘     └──────────┬─────────┘
                 │                       │
        ┌────────▼───────────────────────▼──────┐
        │      Google Drive API Layer            │
        │  (Authentication + Data Storage)      │
        └───────────────────────────────────────┘
                        ▼
        ┌───────────────────────────────────────┐
        │   External Services                   │
        │  - Google Drive API                  │
        │  - Google OAuth 2.0                  │
        │  - Sync Engine                       │
        └───────────────────────────────────────┘
```

## Layered Architecture

### 1. Presentation Layer

**Responsibility**: Handle UI rendering and user interactions

#### Components
```
src/
├── screens/                   # Top-level screens
│   ├── AuthScreen.tsx
│   ├── HomeScreen.tsx
│   ├── TasksScreen.tsx
│   ├── IdeasScreen.tsx
│   └── SettingsScreen.tsx
├── components/                # Reusable UI components
│   ├── TaskCard.tsx
│   ├── IdeaCard.tsx
│   ├── TaskForm.tsx
│   ├── FilterBar.tsx
│   ├── Buttons/
│   ├── Inputs/
│   ├── Dialogs/
│   └── Layout/
└── theme/                     # Design system
    ├── colors.ts
    ├── typography.ts
    └── theme.ts
```

#### Platform-Specific UI
```
mobile/
├── components/               # Mobile-only components
│   ├── BottomTabNav.tsx
│   ├── SwipeableCard.tsx
│   └── MobileHeader.tsx
└── screens/                  # Mobile-specific screens

web/
├── components/               # Web-only components
│   ├── WebNavigation.tsx
│   └── ResponsiveGrid.tsx
└── styles/                   # Web-specific styles

desktop/
├── components/               # Desktop-only components
│   ├── MenuBar.tsx
│   ├── Sidebar.tsx
│   └── SystemTray.tsx
└── main.js                   # Electron main process
```

### 2. State Management Layer

**Responsibility**: Manage application state and data flow

#### Redux Store Structure
```typescript
store = {
  auth: {
    isAuthenticated: boolean
    user: { email, name, profilePicture }
    token: string
    tokenExpiresAt: timestamp
    error: string | null
  }
  
  tasks: {
    items: Task[]
    selectedId: string | null
    loading: boolean
    error: string | null
    filters: {
      status: string[]
      priority: string[]
      category: string | null
      dateRange: { start, end }
    }
    search: string
    sort: { field, direction }
  }
  
  ideas: {
    items: Idea[]
    selectedId: string | null
    loading: boolean
    error: string | null
    filters: {
      status: string[]
      topic: string | null
      starred: boolean | null
    }
    search: string
    sort: { field, direction }
  }
  
  sync: {
    isSyncing: boolean
    lastSyncTime: timestamp
    nextSyncTime: timestamp
    syncError: string | null
    pendingChanges: {
      tasks: { creates: [], updates: [], deletes: [] }
      ideas: { creates: [], updates: [], deletes: [] }
    }
    syncHistory: []
  }
  
  settings: {
    theme: string
    notifications: {
      enabled: boolean
      reminders: boolean
      syncNotifications: boolean
    }
    sync: {
      autoSync: boolean
      syncInterval: number
    }
    preferences: {
      defaultView: string
      sortBy: string
    }
  }
}
```

#### Context API Alternative
If using Zustand instead of Redux:
```typescript
// stores/authStore.ts
export const useAuthStore = create(...)

// stores/taskStore.ts
export const useTaskStore = create(...)

// stores/ideaStore.ts
export const useIdeaStore = create(...)

// stores/syncStore.ts
export const useSyncStore = create(...)
```

### 3. Business Logic Layer

**Responsibility**: Implement core application logic

#### Service Layer
```
src/services/
├── authService.ts          # Authentication logic
│   ├── signIn()
│   ├── signOut()
│   ├── refreshToken()
│   └── getUser()
│
├── googleDriveService.ts   # Google Drive API calls
│   ├── createFile()
│   ├── updateFile()
│   ├── deleteFile()
│   ├── getFile()
│   └── listFiles()
│
├── syncService.ts          # Data synchronization
│   ├── startSync()
│   ├── syncTasks()
│   ├── syncIdeas()
│   ├── resolveConflicts()
│   └── getLastSyncTime()
│
├── storageService.ts       # Local storage operations
│   ├── saveTasks()
│   ├── getTasks()
│   ├── saveIdeas()
│   └── getIdeas()
│
├── taskService.ts          # Task business logic
│   ├── createTask()
│   ├── updateTask()
│   ├── deleteTask()
│   ├── getTask()
│   ├── getTasks()
│   ├── filterTasks()
│   └── searchTasks()
│
└── ideaService.ts          # Idea business logic
    ├── createIdea()
    ├── updateIdea()
    ├── deleteIdea()
    ├── getIdea()
    ├── getIdeas()
    ├── filterIdeas()
    └── searchIdeas()
```

#### Utilities
```
src/utils/
├── validators.ts           # Input validation
│   ├── validateTask()
│   ├── validateIdea()
│   └── validateEmail()
│
├── formatters.ts           # Data formatting
│   ├── formatDate()
│   ├── formatDateTime()
│   └── formatTask()
│
├── helpers.ts              # Helper functions
│   ├── generateUUID()
│   ├── debounce()
│   ├── throttle()
│   └── sortBy()
│
└── constants.ts            # App constants
    ├── API_BASE_URL
    ├── SYNC_INTERVAL
    └── STORAGE_KEYS
```

### 4. Data Access Layer

**Responsibility**: Handle all external data sources

#### Google Drive Integration
```
services/googleDriveService.ts
├── Authentication
│   ├── initializeAuth()
│   ├── getAccessToken()
│   └── refreshAccessToken()
│
├── File Operations
│   ├── createTaskIdeasFolder()
│   ├── uploadFile()
│   ├── downloadFile()
│   ├── updateFile()
│   └── deleteFile()
│
├── Query Operations
│   ├── findTasksFile()
│   ├── findIdeasFile()
│   └── listAllFiles()
│
└── Error Handling
    ├── handleAuthError()
    ├── handleNetworkError()
    └── handlePermissionError()
```

#### Local Storage Strategy
```
AsyncStorage (Mobile/Web) / Node.js fs (Desktop)
├── Tasks
│   ├── tasks:current        (JSON string)
│   ├── tasks:archive        (JSON string)
│   └── tasks:pending        (JSON string)
│
├── Ideas
│   ├── ideas:current        (JSON string)
│   ├── ideas:archive        (JSON string)
│   └── ideas:pending        (JSON string)
│
├── Sync
│   ├── sync:lastTime        (ISO timestamp)
│   ├── sync:queue           (JSON string)
│   └── sync:history         (JSON string)
│
└── Settings
    └── settings             (JSON string)
```

## Data Flow Architecture

### Create Task Flow
```
User Input (TaskForm)
         ↓
Input Validation (validators.ts)
         ↓
Create Action (taskService.ts)
         ↓
Update Redux State (actions/reducers)
         ↓
Local Storage (storageService.ts)
         ↓
Sync Queue (syncService.ts)
         ↓
Google Drive Upload (googleDriveService.ts)
         ↓
Update Sync Status (state)
         ↓
UI Refresh (TasksScreen)
```

### Sync Flow
```
Sync Trigger (timer/button/resume)
         ↓
Check Connectivity
         ↓
Get Local Changes (storageService)
         ↓
Merge with Remote (syncService)
         ↓
Resolve Conflicts (lastWriteWins)
         ↓
Download Remote Data (googleDriveService)
         ↓
Upload Local Changes (googleDriveService)
         ↓
Update Local Storage (storageService)
         ↓
Update Redux State
         ↓
Update UI Components
         ↓
Mark Sync Complete
```

### Offline Work Flow
```
User Creates Task (while offline)
         ↓
Input Validation
         ↓
Update Redux State
         ↓
Save to Local Storage
         ↓
Add to Pending Queue
         ↓
Show "Offline" Indicator
         ↓
Network Reconnected
         ↓
Trigger Auto-Sync
         ↓
Process Pending Changes (see Sync Flow above)
         ↓
Update UI
```

## Component Communication Pattern

### Props Flow (Downward)
```
App (Redux Store)
  ├── TasksScreen
  │   ├── TaskList (tasks, filters from Redux)
  │   │   └── TaskCard (task, onTap, onDelete)
  │   └── TaskForm (initialTask, onSave)
  ├── IdeasScreen
  │   └── IdeaCard (idea, onTap)
  └── SettingsScreen
      └── UserProfile (user from Redux)
```

### Events Flow (Upward)
```
TaskCard.onTap()
  → TasksScreen.handleTaskTap()
  → Redux Action: selectTask(id)
  → Navigate to TaskDetailScreen
  → TaskDetailScreen receives selectedTask from Redux
```

### Event Publishing Pattern
```
TaskForm.onSave(task)
  → Redux Dispatch: updateTask(task)
  → Redux Thunk: calls taskService.updateTask()
  → taskService: saves local + queues for sync
  → Sync Service: uploads to Google Drive
  → Sync Success Action: updateSyncStatus()
  → UI updates via Redux selectors
```

## Error Handling Architecture

### Error Boundaries
```
App
├── AuthErrorBoundary
│   └── AuthScreen
│
├── DataErrorBoundary
│   ├── TasksScreen
│   ├── IdeasScreen
│   └── SettingsScreen
│
└── SyncErrorBoundary
    └── SyncService
```

### Error Types & Handling
```
Network Errors
├── Offline → Queue changes, show indicator
├── Timeout → Retry with exponential backoff
└── API Error → Show user-friendly message

Auth Errors
├── Invalid Token → Refresh or redirect to login
├── Permission Denied → Show permission request
└── Session Expired → Force re-login

Validation Errors
├── Invalid Task → Show form errors
├── Invalid Idea → Show form errors
└── Invalid Input → Highlight field

Sync Errors
├── Conflict → Show conflict resolution UI
├── Storage Full → Show storage warning
└── Sync Failed → Retry or queue for later
```

## Performance Optimization Patterns

### Component Optimization
```typescript
// Use React.memo for expensive components
export const TaskCard = React.memo(({ task, onTap }) => ...)

// Use useMemo for expensive calculations
const sortedTasks = useMemo(
  () => tasks.sort((a, b) => a.dueDate - b.dueDate),
  [tasks]
)

// Use useCallback for stable function references
const handleDelete = useCallback((id) => {
  dispatch(deleteTask(id))
}, [dispatch])
```

### Code Splitting
```
// Lazy load screens
const TasksScreen = lazy(() => import('./screens/TasksScreen'))
const IdeasScreen = lazy(() => import('./screens/IdeasScreen'))

// Lazy load heavy components
const TaskForm = lazy(() => import('./components/TaskForm'))
```

### Caching Strategy
```
// Cache Google Drive queries
const tasksCacheKey = 'tasks:cache'
const cacheExpiration = 5 * 60 * 1000 // 5 minutes

// Cache expensive calculations
const filteredTasksSelector = (state) => {
  return selectCachedFilteredTasks(state)
}
```

## Platform-Specific Architecture

### Mobile (Expo)
```
Expo CLI
  ↓
React Native
  ├── Native Modules
  │   ├── Google Sign-In (native iOS/Android)
  │   ├── AsyncStorage (native storage)
  │   └── Permissions (native)
  ├── Shared Code (src/)
  └── Mobile Specific (mobile/)
  
Build Output: iOS (.ipa), Android (.apk)
```

### Web (React Native Web)
```
Webpack Dev Server
  ↓
React Native Web (transforms to DOM)
  ├── DOM Elements
  ├── Web APIs
  │   ├── localStorage
  │   ├── IndexedDB
  │   └── Fetch API
  └── Shared Code (src/)

Build Output: Static files (HTML, JS, CSS)
```

### Desktop (Electron)
```
Electron Main Process (Node.js)
  ├── Window Management
  ├── File System Access
  ├── System Tray
  └── Menu

Electron Renderer Process (Chromium)
  ├── React App (web code)
  ├── IPC Communication
  ├── NodeJS Integration
  └── Shared Code (src/)

Build Output: Standalone executables
```

## Security Architecture

### Authentication Flow
```
Login Screen
  ↓
Google OAuth Popup
  ↓
User Authorizes
  ↓
Receive Auth Code
  ↓
Exchange for Access Token
  ↓
Store Token Securely
  │ Mobile: Keychain/Keystore
  │ Web: Encrypted localStorage
  │ Desktop: OS keychain
  ↓
API Requests (with token)
  ↓
Token Refresh (before expiration)
```

### Data Protection
```
Local Storage
├── Encryption: AES-256 at rest
├── Access: App only, no export
└── Clearing: Secure wipe on logout

API Communication
├── HTTPS: All requests
├── Headers: Authorization Bearer token
└── CORS: Properly configured

Google Drive
├── OAuth Scopes: Minimal required
├── User Data: Encrypted by Google
└── Permissions: Request on demand
```

## Testing Architecture

### Test Pyramid
```
        △
       /|\     End-to-End Tests
      / | \    (Critical user flows)
     /  |  \
    /───┼───\   Integration Tests
   /    |    \  (Services, APIs, state)
  /─────┼─────\ Unit Tests
 /      |      \ (Functions, utilities)
/───────┴───────\
```

### Test Organization
```
__tests__/
├── unit/
│   ├── utils/
│   ├── services/
│   └── formatters/
│
├── integration/
│   ├── googleDriveService.test.ts
│   ├── syncService.test.ts
│   └── taskService.test.ts
│
├── e2e/
│   ├── mobile/ (Detox)
│   ├── web/ (Cypress)
│   └── desktop/ (Spectron)
│
└── __mocks__/
    ├── googleDrive.ts
    ├── asyncStorage.ts
    └── auth.ts
```

## Deployment Architecture

### Build Pipeline
```
Source Code (Git)
  ↓
Install Dependencies
  ↓
TypeScript Compilation
  ↓
Unit Tests
  ↓
Build per Platform
  ├── Mobile: EAS Build
  ├── Web: Webpack
  └── Desktop: Electron Builder
  ↓
E2E Tests
  ↓
Production Build Artifacts
  ├── iOS: .ipa (App Store)
  ├── Android: .apk (Google Play)
  ├── Web: Static files (CDN)
  └── Desktop: .exe/.dmg/.AppImage
```

### Environment Management
```
.env (local development)
.env.production (production)
.env.test (testing)

Variables:
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GOOGLE_REDIRECT_URI
- API_BASE_URL
- NODE_ENV
- DEBUG_MODE
```

## Scaling Considerations

### Horizontal Scaling
- Multiple instances behind load balancer (future if needed)
- CDN for static assets
- Regional endpoints for API calls

### Vertical Scaling
- Database indexing (when database is added)
- Query optimization
- Caching strategy improvements

### Data Growth
- Archive old tasks/ideas
- Pagination for large lists
- Compression for local storage

---

For more details on specific components, see:
- [docs/SPECIFICATION.md](SPECIFICATION.md) - Complete specification
- [docs/API_GUIDE.md](API_GUIDE.md) - API documentation
- Source code comments and inline documentation
