import React from 'react'
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAppStore } from '../store/useAppStore'
import { colors } from '../constants/colors'
import { SyncStatus } from '../types'

const STATUS_CONFIG: Record<SyncStatus, { label: string; color: string; icon?: keyof typeof Ionicons.glyphMap }> = {
  idle:    { label: '', color: colors.text.muted },
  syncing: { label: 'Syncing…', color: colors.teal[400] },
  synced:  { label: 'Synced', color: colors.success, icon: 'checkmark-circle' },
  error:   { label: 'Sync failed — tap to retry', color: colors.error, icon: 'alert-circle' },
  offline: { label: 'Offline — changes saved locally', color: colors.warning, icon: 'cloud-offline' },
}

interface Props {
  onRetry?: () => void
}

export function SyncStatusBar({ onRetry }: Props) {
  const syncStatus = useAppStore((s) => s.syncStatus)
  const cfg = STATUS_CONFIG[syncStatus]
  if (syncStatus === 'idle' || !cfg.label) return null

  const isError = syncStatus === 'error'

  return (
    <TouchableOpacity
      style={styles.bar}
      onPress={isError ? onRetry : undefined}
      activeOpacity={isError ? 0.7 : 1}
      disabled={!isError}
    >
      {syncStatus === 'syncing' ? (
        <ActivityIndicator size={12} color={cfg.color} style={styles.icon} />
      ) : cfg.icon ? (
        <Ionicons name={cfg.icon} size={13} color={cfg.color} style={styles.icon} />
      ) : null}
      <Text style={[styles.label, { color: cfg.color }]}>{cfg.label}</Text>
      {isError && (
        <Ionicons name="refresh" size={13} color={cfg.color} style={styles.retryIcon} />
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.navy[800],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  icon: { marginRight: 6 },
  retryIcon: { marginLeft: 6 },
  label: { fontSize: 12, fontWeight: '500', flex: 1 },
})
