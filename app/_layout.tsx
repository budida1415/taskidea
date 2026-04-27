import React, { useEffect, useState } from 'react'
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native'
import { Stack, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font'
import { Ionicons } from '@expo/vector-icons'
import { useAppStore } from '../store/useAppStore'
import { loadStoredAuth } from '../services/auth'
import { colors } from '../constants/colors'

function AuthGuard() {
  const { user, setUser } = useAppStore()
  const router = useRouter()
  const segments = useSegments()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    console.log('[AuthGuard] mount — starting auth load')
    const fallback = setTimeout(() => {
      console.log('[AuthGuard] fallback fired — forcing ready')
      setIsReady(true)
    }, 2000)
    loadStoredAuth()
      .then((stored) => {
        console.log('[AuthGuard] loadStoredAuth resolved, hasUser:', !!stored)
        if (stored) setUser(stored)
      })
      .catch((e) => console.error('[AuthGuard] loadStoredAuth error:', e))
      .finally(() => {
        console.log('[AuthGuard] finally — setting ready')
        clearTimeout(fallback)
        setIsReady(true)
      })
    return () => clearTimeout(fallback)
  }, [])

  useEffect(() => {
    console.log('[AuthGuard] nav effect — isReady:', isReady, 'segments:', segments, 'user:', !!user)
    if (!isReady) return
    const inAuthGroup = segments[0] === '(auth)'
    if (!user && !inAuthGroup) {
      console.log('[AuthGuard] redirecting to /(auth)')
      router.replace('/(auth)')
    } else if (user && inAuthGroup) {
      console.log('[AuthGuard] redirecting to /(tabs)/tasks')
      router.replace('/(tabs)/tasks')
    }
  }, [user, segments, isReady])

  if (!isReady) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={colors.teal[500]} />
      </View>
    )
  }

  return null
}

export default function RootLayout() {
  // On web, Ionicons load via CSS — passing {} resolves instantly and avoids OTS font errors
  const [fontsLoaded] = useFonts(Platform.OS === 'web' ? {} : Ionicons.font)

  if (!fontsLoaded) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={colors.teal[500]} />
      </View>
    )
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AuthGuard />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  splash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
})
