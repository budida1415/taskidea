import { useEffect, useRef } from 'react'
import { useRouter } from 'expo-router'
import NetInfo from '@react-native-community/netinfo'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAppStore } from '../store/useAppStore'
import { initDriveFolder, loadDriveFile } from '../services/sync'
import { clearAuth } from '../services/auth'
import { AuthExpiredError } from '../services/driveApi'
import { TASKS_FILE, IDEAS_FILE, CACHE_KEYS } from '../constants/config'
import { Task, Idea } from '../types'

export function useDriveSync(options: { autoSync?: boolean } = {}) {
  const {
    user,
    setTasks,
    setIdeas,
    setSyncStatus,
    setUser,
    folderId,
    setFolderId,
    setFileIds,
  } = useAppStore()

  const router = useRouter()
  const isOnline = useRef(true)

  // Only the tab layout registers the NetInfo listener (autoSync: true)
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

      // Load cache immediately for instant UI
      const [cachedTasks, cachedIdeas] = await Promise.all([
        AsyncStorage.getItem(CACHE_KEYS.TASKS),
        AsyncStorage.getItem(CACHE_KEYS.IDEAS),
      ])
      if (cachedTasks) setTasks(JSON.parse(cachedTasks))
      if (cachedIdeas) setIdeas(JSON.parse(cachedIdeas))

      if (!isOnline.current) {
        setSyncStatus('offline')
        return
      }

      const folder = folderId ?? (await initDriveFolder(user.accessToken))
      if (!folderId) setFolderId(folder)

      const [tasksResult, ideasResult] = await Promise.all([
        loadDriveFile<Task>(folder, TASKS_FILE, user.accessToken),
        loadDriveFile<Idea>(folder, IDEAS_FILE, user.accessToken),
      ])

      setTasks(tasksResult.items)
      setIdeas(ideasResult.items)
      setFileIds(tasksResult.fileId, ideasResult.fileId)

      await Promise.all([
        AsyncStorage.setItem(CACHE_KEYS.TASKS, JSON.stringify(tasksResult.items)),
        AsyncStorage.setItem(CACHE_KEYS.IDEAS, JSON.stringify(ideasResult.items)),
      ])

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
