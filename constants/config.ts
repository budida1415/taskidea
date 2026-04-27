export const DRIVE_FOLDER_NAME = 'TaskIdea'
export const TASKS_FILE = 'tasks.json'
export const IDEAS_FILE = 'ideas.json'

export const DRIVE_API = 'https://www.googleapis.com/drive/v3'
export const DRIVE_UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3'
export const USERINFO_API = 'https://www.googleapis.com/userinfo/v2/me'
export const TOKEN_REVOKE_API = 'https://oauth2.googleapis.com/revoke'

export const CACHE_KEYS = {
  TASKS: 'taskidea_tasks_cache',
  IDEAS: 'taskidea_ideas_cache',
} as const

export const SECURE_STORE_KEYS = {
  ACCESS_TOKEN: 'taskidea_access_token',
  TOKEN_EXPIRES: 'taskidea_token_expires',
  USER_INFO: 'taskidea_user_info',
} as const

export const SYNC_DEBOUNCE_MS = 600
