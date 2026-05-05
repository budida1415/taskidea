export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface Idea {
  id: string
  title: string
  content: string
  tags: string[]
  color: string
  pinned: boolean
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  name: string
  picture?: string
  accessToken: string
  tokenExpiresAt: number
}

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline'

export type TaskFilter = 'all' | 'active' | 'completed' | 'overdue' | 'recurring'

export type RecurrencePeriod = 'weekly' | 'monthly' | 'quarterly' | 'half-yearly' | 'yearly'

export interface RecurringTask {
  id: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  tags: string[]
  recurrence: RecurrencePeriod
  nextDueDate: string
  createdAt: string
  updatedAt: string
}
