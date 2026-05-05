import { useEffect, useRef } from 'react'
import { useRouter } from 'expo-router'
import NetInfo from '@react-native-community/netinfo'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { randomUUID } from 'expo-crypto'
import { useAppStore } from '../store/useAppStore'
import { initDriveFolder, loadDriveFile } from '../services/sync'
import { scheduleSyncToDrive } from '../services/driveSync'
import { clearAuth } from '../services/auth'
import { AuthExpiredError } from '../services/driveApi'
import { TASKS_FILE, IDEAS_FILE, RECURRING_FILE, CACHE_KEYS } from '../constants/config'
import { Task, Idea, RecurringTask, RecurrencePeriod } from '../types'

function advanceDate(iso: string, period: RecurrencePeriod): string {
  const d = new Date(iso)
  if (period === 'weekly') d.setDate(d.getDate() + 7)
  if (period === 'monthly') d.setMonth(d.getMonth() + 1)
  if (period === 'quarterly') d.setMonth(d.getMonth() + 3)
  if (period === 'half-yearly') d.setMonth(d.getMonth() + 6)
  if (period === 'yearly') d.setFullYear(d.getFullYear() + 1)
  return d.toISOString().split('T')[0]
}

function generateDueTasks(recurring: RecurringTask[], today: string) {
  const nowISO = new Date().toISOString()
  const newTasks: Task[] = []
  const updatedRecurring = recurring.map((rt) => {
    let next = rt.nextDueDate
    while (next <= today) {
      newTasks.push({
        id: randomUUID(),
        title: rt.title,
        description: rt.description,
        completed: false,
        priority: rt.priority,
        dueDate: next,
        tags: rt.tags,
        createdAt: nowISO,
        updatedAt: nowISO,
      })
      next = advanceDate(next, rt.recurrence)
    }
    return next !== rt.nextDueDate ? { ...rt, nextDueDate: next, updatedAt: nowISO } : rt
  })
  return { newTasks, updatedRecurring }
}

export function useDriveSync(options: { autoSync?: boolean } = {}) {
  const {
    user,
    setTasks,
    setIdeas,
    setRecurringTasks,
    setSyncStatus,
    setUser,
    folderId,
    setFolderId,
    setFileIds,
    setRecurringFileId,
    addTask,
  } = useAppStore()

  const router = useRouter()
  const isOnline = useRef(true)

  useEffect(() => {
    if (!options.autoSync) return
    const unsub = NetInfo.addEventListener((state) => {
      const online = state.isConnected ?? false
      isOnline.current = online
      if (!online) setSyncStatus('offline')
    })
    return () => unsub()
  }, [])

  async function syncFromDrive() {
    if (!user) return

    try {
      setSyncStatus('syncing')

      const [cachedTasks, cachedIdeas, cachedRecurring] = await Promise.all([
        AsyncStorage.getItem(CACHE_KEYS.TASKS),
        AsyncStorage.getItem(CACHE_KEYS.IDEAS),
        AsyncStorage.getItem(CACHE_KEYS.RECURRING),
      ])
      if (cachedTasks) setTasks(JSON.parse(cachedTasks))
      if (cachedIdeas) setIdeas(JSON.parse(cachedIdeas))
      if (cachedRecurring) setRecurringTasks(JSON.parse(cachedRecurring))

      if (!isOnline.current) {
        setSyncStatus('offline')
        return
      }

      const folder = folderId ?? (await initDriveFolder(user.accessToken))
      if (!folderId) setFolderId(folder)

      const [tasksResult, ideasResult, recurringResult] = await Promise.all([
        loadDriveFile<Task>(folder, TASKS_FILE, user.accessToken),
        loadDriveFile<Idea>(folder, IDEAS_FILE, user.accessToken),
        loadDriveFile<RecurringTask>(folder, RECURRING_FILE, user.accessToken),
      ])

      setTasks(tasksResult.items)
      setIdeas(ideasResult.items)
      setRecurringTasks(recurringResult.items)
      setFileIds(tasksResult.fileId, ideasResult.fileId)
      setRecurringFileId(recurringResult.fileId)

      await Promise.all([
        AsyncStorage.setItem(CACHE_KEYS.TASKS, JSON.stringify(tasksResult.items)),
        AsyncStorage.setItem(CACHE_KEYS.IDEAS, JSON.stringify(ideasResult.items)),
        AsyncStorage.setItem(CACHE_KEYS.RECURRING, JSON.stringify(recurringResult.items)),
      ])

      const today = new Date().toISOString().split('T')[0]
      const { newTasks, updatedRecurring } = generateDueTasks(recurringResult.items, today)

      if (newTasks.length > 0 || updatedRecurring.some((rt, i) => rt !== recurringResult.items[i])) {
        newTasks.forEach((t) => addTask(t))
        setRecurringTasks(updatedRecurring)
        scheduleSyncToDrive()
      }

      setSyncStatus('synced')
    } catch (e) {
      if (e instanceof AuthExpiredError) {
        await clearAuth()
        setUser(null)
        router.replace('/(auth)')
        return
      }
      console.error('syncFromDrive failed:', e)
      setSyncStatus('error')
    }
  }

  useEffect(() => {
    if (options.autoSync && user) syncFromDrive()
  }, [user?.id])

  return { syncFromDrive }
}
