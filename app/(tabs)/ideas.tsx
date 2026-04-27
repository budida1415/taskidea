import React, { useState, useMemo } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useAppStore } from '../../store/useAppStore'
import { useDriveSync } from '../../hooks/useDriveSync'
import { IdeaCard } from '../../components/IdeaCard'
import { AddEditIdeaModal } from '../../components/AddEditIdeaModal'
import { SyncStatusBar } from '../../components/SyncStatusBar'
import { EmptyState } from '../../components/EmptyState'
import { colors } from '../../constants/colors'
import { Idea } from '../../types'

export default function IdeasScreen() {
  const ideas = useAppStore((s) => s.ideas)
  const { syncFromDrive } = useDriveSync()
  const insets = useSafeAreaInsets()

  const [refreshing, setRefreshing] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null)

  const sorted = useMemo(() => {
    return [...ideas].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  }, [ideas])

  async function handleRefresh() {
    setRefreshing(true)
    await syncFromDrive()
    setRefreshing(false)
  }

  function handleEdit(idea: Idea) {
    setEditingIdea(idea)
    setModalVisible(true)
  }

  function openNew() {
    setEditingIdea(null)
    setModalVisible(true)
  }

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View>
          <Text style={styles.screenTitle}>Ideas</Text>
          {ideas.length > 0 && (
            <Text style={styles.subtitle}>{ideas.length} captured</Text>
          )}
        </View>
      </View>

      <SyncStatusBar onRetry={syncFromDrive} />

      {/* Ideas grid */}
      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => <IdeaCard idea={item} onEdit={handleEdit} />}
        contentContainerStyle={[
          styles.list,
          sorted.length === 0 && styles.listEmpty,
        ]}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.teal[400]}
            colors={[colors.teal[400]]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="bulb-outline"
            title="No ideas yet"
            subtitle="Tap + to capture your first idea"
          />
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 72 }]}
        onPress={openNew}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color={colors.white} />
      </TouchableOpacity>

      <AddEditIdeaModal
        visible={modalVisible}
        idea={editingIdea}
        onClose={() => setModalVisible(false)}
      />
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
    backgroundColor: colors.background,
  },
  screenTitle: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.teal[400],
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  list: {
    paddingHorizontal: 11,
    paddingTop: 4,
    paddingBottom: 120,
  },
  listEmpty: {
    flex: 1,
  },
  row: {
    justifyContent: 'space-between',
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.teal[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
})
