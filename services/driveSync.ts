import AsyncStorage from '@react-native-async-storage/async-storage'
import { TASKS_FILE, IDEAS_FILE, RECURRING_FILE, CACHE_KEYS, SYNC_DEBOUNCE_MS } from '../constants/config'
import { saveDriveFile } from './sync'

let syncTimer: ReturnType<typeof setTimeout> | null = null

export function scheduleSyncToDrive() {
  if (syncTimer) clearTimeout(syncTimer)
  syncTimer = setTimeout(performSyncToDrive, SYNC_DEBOUNCE_MS)
}

async function performSyncToDrive() {
  const { useAppStore } = await import('../store/useAppStore')
  const state = useAppStore.getState()

  if (!state.user || !state.folderId) return

  try {
    state.setSyncStatus('syncing')

    const [newTaskFileId, newIdeaFileId, newRecurringFileId] = await Promise.all([
      saveDriveFile(state.folderId, state.taskFileId, TASKS_FILE, state.tasks, state.user.accessToken),
      saveDriveFile(state.folderId, state.ideaFileId, IDEAS_FILE, state.ideas, state.user.accessToken),
      saveDriveFile(state.folderId, state.recurringFileId, RECURRING_FILE, state.recurringTasks, state.user.accessToken),
    ])

    state.setFileIds(newTaskFileId, newIdeaFileId)
    state.setRecurringFileId(newRecurringFileId)

    await Promise.all([
      AsyncStorage.setItem(CACHE_KEYS.TASKS, JSON.stringify(state.tasks)),
      AsyncStorage.setItem(CACHE_KEYS.IDEAS, JSON.stringify(state.ideas)),
      AsyncStorage.setItem(CACHE_KEYS.RECURRING, JSON.stringify(state.recurringTasks)),
    ])

    state.setSyncStatus('synced')
  } catch (e) {
    console.error('Sync to Drive failed:', e)
    state.setSyncStatus('error')
  }
}
