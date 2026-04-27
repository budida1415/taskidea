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
    // Failsafe: always become ready after 2s even if loadStoredAuth hangs
    const fallback = setTimeout(() => setIsReady(true), 2000)
    loadStoredAuth()
      .then((stored) => {
        if (stored) setUser(stored)
      })
      .catch(() => {})
      .finally(() => {
        clearTimeout(fallback)
        setIsReady(true)
      })
    return () => clearTimeout(fallback)
  }, [])

  useEffect(() => {
    if (!isReady) return
    const inAuthGroup = segments[0] === '(auth)'
    if (!user && !inAuthGroup) {
      router.replace('/(auth)')
    } else if (user && inAuthGroup) {
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
  const [fontsLoaded, fontError] = useFonts(Ionicons.font)

  // On web, Ionicons load via CSS bundle — useFonts never resolves, skip the wait
  if (Platform.OS !== 'web' && !fontsLoaded && !fontError) {
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
