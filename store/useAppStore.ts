import { create } from 'zustand'
import { Task, Idea, User, SyncStatus } from '../types'

interface AppState {
  user: User | null
  tasks: Task[]
  ideas: Idea[]
  syncStatus: SyncStatus
  folderId: string | null
  taskFileId: string | null
  ideaFileId: string | null

  setUser: (user: User | null) => void
  setTasks: (tasks: Task[]) => void
  setIdeas: (ideas: Idea[]) => void
  setSyncStatus: (status: SyncStatus) => void
  setFolderId: (id: string) => void
  setFileIds: (taskFileId: string | null, ideaFileId: string | null) => void

  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void
  deleteTask: (id: string) => void
  toggleTask: (id: string) => void

  addIdea: (idea: Idea) => void
  updateIdea: (id: string, updates: Partial<Omit<Idea, 'id' | 'createdAt'>>) => void
  deleteIdea: (id: string) => void
  togglePinIdea: (id: string) => void
}

const now = () => new Date().toISOString()

export const useAppStore = create<AppState>((set) => ({
  user: null,
  tasks: [],
  ideas: [],
  syncStatus: 'idle',
  folderId: null,
  taskFileId: null,
  ideaFileId: null,

  setUser: (user) => set({ user }),
  setTasks: (tasks) => set({ tasks }),
  setIdeas: (ideas) => set({ ideas }),
  setSyncStatus: (syncStatus) => set({ syncStatus }),
  setFolderId: (folderId) => set({ folderId }),
  setFileIds: (taskFileId, ideaFileId) => set({ taskFileId, ideaFileId }),

  addTask: (task) => set((s) => ({ tasks: [...s.tasks, task] })),
  updateTask: (id, updates) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: now() } : t)),
    })),
  deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
  toggleTask: (id) =>
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed, updatedAt: now() } : t
      ),
    })),

  addIdea: (idea) => set((s) => ({ ideas: [...s.ideas, idea] })),
  updateIdea: (id, updates) =>
    set((s) => ({
      ideas: s.ideas.map((i) => (i.id === id ? { ...i, ...updates, updatedAt: now() } : i)),
    })),
  deleteIdea: (id) => set((s) => ({ ideas: s.ideas.filter((i) => i.id !== id) })),
  togglePinIdea: (id) =>
    set((s) => ({
      ideas: s.ideas.map((i) =>
        i.id === id ? { ...i, pinned: !i.pinned, updatedAt: now() } : i
      ),
    })),
}))
