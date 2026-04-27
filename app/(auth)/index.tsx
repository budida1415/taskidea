import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, ActivityIndicator } from 'react-native'
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAppStore } from '../../store/useAppStore'
import { fetchUserInfo, saveAuth } from '../../services/auth'
import { colors } from '../../constants/colors'

WebBrowser.maybeCompleteAuthSession()

export default function SignInScreen() {
  const { setUser } = useAppStore()
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID,
    scopes: [
      'openid',
      'email',
      'profile',
      'https://www.googleapis.com/auth/drive.file',
    ],
  })

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response
      if (!authentication?.accessToken) return

      setLoading(true)
      const tokenExpiresAt =
        (authentication.issuedAt + (authentication.expiresIn ?? 3600)) * 1000

      fetchUserInfo(authentication.accessToken)
        .then((info) => {
          const user = {
            id: info.id,
            email: info.email,
            name: info.name,
            picture: info.picture,
            accessToken: authentication.accessToken,
            tokenExpiresAt,
          }
          return saveAuth(user).then(() => user)
        })
        .then((user) => {
          setUser(user)
          router.replace('/(tabs)/tasks')
        })
        .catch((err) => {
          console.error('Sign-in failed:', err)
          setLoading(false)
        })
    }
  }, [response])

  return (
    <View style={styles.root}>
      {/* Background layers for depth */}
      <View style={styles.bgLayer1} />
      <View style={styles.bgLayer2} />

      {/* Wave decoration */}
      <View style={styles.waveTop} />

      <View style={styles.center}>
        {/* App icon */}
        <View style={styles.logoWrap}>
          <Ionicons name="layers" size={52} color={colors.teal[400]} />
        </View>

        <Text style={styles.appName}>TaskIdea</Text>
        <Text style={styles.tagline}>Your thoughts. Your Drive.</Text>

        <View style={styles.featureList}>
          {[
            { icon: 'checkmark-circle-outline' as const, text: 'Manage tasks with priorities & due dates' },
            { icon: 'bulb-outline' as const, text: 'Capture ideas and keep them organized' },
            { icon: 'cloud-outline' as const, text: 'Everything stored in your Google Drive' },
          ].map((f) => (
            <View key={f.text} style={styles.featureRow}>
              <Ionicons name={f.icon} size={18} color={colors.teal[400]} />
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={[styles.googleBtn, (!request || loading) && styles.googleBtnDisabled]}
          onPress={() => promptAsync()}
          disabled={!request || loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.navy[900]} />
          ) : (
            <>
              <View style={styles.googleIconWrap}>
                <Text style={styles.googleLetter}>G</Text>
              </View>
              <Text style={styles.googleBtnText}>Sign in with Google</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Your data stays in your Google Drive.{'\n'}We never store anything on our servers.
        </Text>
      </View>

      <View style={styles.waveBottom} />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bgLayer1: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.navy[900],
  },
  bgLayer2: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: colors.navy[700],
    opacity: 0.4,
  },
  waveTop: {
    position: 'absolute',
    top: -60,
    left: -40,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.teal[700],
    opacity: 0.15,
  },
  waveBottom: {
    position: 'absolute',
    bottom: -80,
    right: -60,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.teal[600],
    opacity: 0.1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  logoWrap: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: colors.navy[700],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.teal[700],
    shadowColor: colors.teal[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  appName: {
    color: colors.text.primary,
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  tagline: {
    color: colors.teal[400],
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 48,
  },
  featureList: {
    alignSelf: 'stretch',
    gap: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    color: colors.text.secondary,
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  bottom: {
    paddingHorizontal: 32,
    paddingBottom: Platform.OS === 'ios' ? 52 : 36,
    alignItems: 'center',
    gap: 16,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 12,
    alignSelf: 'stretch',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  googleBtnDisabled: {
    opacity: 0.6,
  },
  googleIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.navy[900],
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleLetter: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  googleBtnText: {
    color: colors.navy[900],
    fontSize: 16,
    fontWeight: '700',
  },
  disclaimer: {
    color: colors.text.muted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
})
