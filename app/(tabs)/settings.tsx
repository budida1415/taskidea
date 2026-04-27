import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAppStore } from '../../store/useAppStore'
import { useDriveSync } from '../../hooks/useDriveSync'
import { clearAuth } from '../../services/auth'
import { SyncStatusBar } from '../../components/SyncStatusBar'
import { colors } from '../../constants/colors'

export default function SettingsScreen() {
  const { user, setUser, tasks, ideas, syncStatus } = useAppStore()
  const { syncFromDrive } = useDriveSync()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const [syncing, setSyncing] = useState(false)

  async function handleManualSync() {
    setSyncing(true)
    await syncFromDrive()
    setSyncing(false)
  }

  function handleSignOut() {
    Alert.alert(
      'Sign Out',
      'Your data will remain in Google Drive. Sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await clearAuth()
            setUser(null)
            router.replace('/(auth)')
          },
        },
      ]
    )
  }

  const syncStatusLabel: Record<string, string> = {
    idle: 'Not synced yet',
    syncing: 'Syncing…',
    synced: 'Synced with Drive',
    error: 'Sync failed',
    offline: 'Offline',
  }

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.screenTitle}>Settings</Text>
      </View>

      <SyncStatusBar />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile card */}
        <View style={styles.card}>
          <View style={styles.avatarWrap}>
            {user?.picture ? (
              <Image source={{ uri: user.picture }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarLetter}>
                  {user?.name?.charAt(0).toUpperCase() ?? '?'}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name ?? '—'}</Text>
            <Text style={styles.profileEmail}>{user?.email ?? '—'}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{tasks.length}</Text>
            <Text style={styles.statLabel}>Tasks</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{tasks.filter((t) => t.completed).length}</Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{ideas.length}</Text>
            <Text style={styles.statLabel}>Ideas</Text>
          </View>
        </View>

        {/* Drive section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Google Drive</Text>

          <View style={styles.rowItem}>
            <Ionicons name="sync-outline" size={20} color={colors.teal[400]} />
            <View style={styles.rowBody}>
              <Text style={styles.rowLabel}>Sync Status</Text>
              <Text style={styles.rowValue}>{syncStatusLabel[syncStatus]}</Text>
            </View>
            <TouchableOpacity
              onPress={handleManualSync}
              disabled={syncing || syncStatus === 'syncing'}
              style={styles.syncBtn}
            >
              {syncing || syncStatus === 'syncing' ? (
                <ActivityIndicator size="small" color={colors.teal[400]} />
              ) : (
                <Ionicons name="refresh" size={20} color={colors.teal[400]} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.rowItem}>
            <Ionicons name="logo-google" size={20} color={colors.teal[400]} />
            <View style={styles.rowBody}>
              <Text style={styles.rowLabel}>Storage Location</Text>
              <Text style={styles.rowValue}>My Drive / TaskIdea</Text>
            </View>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.rowItem}>
            <Ionicons name="code-slash-outline" size={20} color={colors.text.muted} />
            <View style={styles.rowBody}>
              <Text style={styles.rowLabel}>Version</Text>
              <Text style={styles.rowValue}>1.0.0</Text>
            </View>
          </View>

          <View style={styles.rowItem}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.text.muted} />
            <View style={styles.rowBody}>
              <Text style={styles.rowLabel}>Privacy</Text>
              <Text style={styles.rowValue}>Data stored in your Drive only</Text>
            </View>
          </View>
        </View>

        {/* Sign out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: insets.bottom + 20 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  screenTitle: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarWrap: {},
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarFallback: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.teal[700],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileEmail: {
    color: colors.text.muted,
    fontSize: 13,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    color: colors.teal[400],
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    color: colors.text.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: colors.text.muted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowBody: {
    flex: 1,
  },
  rowLabel: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  rowValue: {
    color: colors.text.muted,
    fontSize: 12,
  },
  syncBtn: {
    padding: 4,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.error + '44',
  },
  signOutText: {
    color: colors.error,
    fontSize: 15,
    fontWeight: '700',
  },
})
