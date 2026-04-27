import { Platform } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { SECURE_STORE_KEYS, TOKEN_REVOKE_API, USERINFO_API } from '../constants/config'
import { User } from '../types'

async function storeItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value)
  } else {
    await SecureStore.setItemAsync(key, value)
  }
}

async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key)
  }
  return SecureStore.getItemAsync(key)
}

async function deleteItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key)
  } else {
    await SecureStore.deleteItemAsync(key)
  }
}

export async function fetchUserInfo(accessToken: string): Promise<{
  id: string
  email: string
  name: string
  picture?: string
}> {
  const res = await fetch(USERINFO_API, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error('Failed to fetch user info')
  return res.json()
}

export async function saveAuth(user: User): Promise<void> {
  await Promise.all([
    storeItem(SECURE_STORE_KEYS.ACCESS_TOKEN, user.accessToken),
    storeItem(SECURE_STORE_KEYS.TOKEN_EXPIRES, String(user.tokenExpiresAt)),
    storeItem(
      SECURE_STORE_KEYS.USER_INFO,
      JSON.stringify({ id: user.id, email: user.email, name: user.name, picture: user.picture })
    ),
  ])
}

export async function loadStoredAuth(): Promise<User | null> {
  try {
    const [accessToken, expiresStr, userJson] = await Promise.all([
      getItem(SECURE_STORE_KEYS.ACCESS_TOKEN),
      getItem(SECURE_STORE_KEYS.TOKEN_EXPIRES),
      getItem(SECURE_STORE_KEYS.USER_INFO),
    ])

    if (!accessToken || !expiresStr || !userJson) return null

    const tokenExpiresAt = Number(expiresStr)
    if (Date.now() >= tokenExpiresAt) {
      await clearAuth()
      return null
    }

    const userInfo = JSON.parse(userJson)
    return { ...userInfo, accessToken, tokenExpiresAt }
  } catch {
    return null
  }
}

export async function clearAuth(): Promise<void> {
  const stored = await getItem(SECURE_STORE_KEYS.ACCESS_TOKEN)
  if (stored) {
    try {
      await fetch(`${TOKEN_REVOKE_API}?token=${stored}`, { method: 'POST' })
    } catch {
      // revocation failure is non-critical
    }
  }
  await Promise.all([
    deleteItem(SECURE_STORE_KEYS.ACCESS_TOKEN),
    deleteItem(SECURE_STORE_KEYS.TOKEN_EXPIRES),
    deleteItem(SECURE_STORE_KEYS.USER_INFO),
  ])
}
