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
import { TaskCard } from '../../components/TaskCard'
import { AddEditTaskModal } from '../../components/AddEditTaskModal'
import { SyncStatusBar } from '../../components/SyncStatusBar'
import { EmptyState } from '../../components/EmptyState'
import { colors } from '../../constants/colors'
import { Task, TaskFilter } from '../../types'

const FILTERS: { key: TaskFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Done' },
]

export default function TasksScreen() {
  const tasks = useAppStore((s) => s.tasks)
  const { syncFromDrive } = useDriveSync()
  const insets = useSafeAreaInsets()

  const [filter, setFilter] = useState<TaskFilter>('all')
  const [refreshing, setRefreshing] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const filtered = useMemo(() => {
    const sorted = [...tasks].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    if (filter === 'active') return sorted.filter((t) => !t.completed)
    if (filter === 'completed') return sorted.filter((t) => t.completed)
    return sorted
  }, [tasks, filter])

  const activeCount = tasks.filter((t) => !t.completed).length

  async function handleRefresh() {
    setRefreshing(true)
    await syncFromDrive()
    setRefreshing(false)
  }

  function handleEdit(task: Task) {
    setEditingTask(task)
    setModalVisible(true)
  }

  function openNew() {
    setEditingTask(null)
    setModalVisible(true)
  }

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View>
          <Text style={styles.screenTitle}>Tasks</Text>
          {activeCount > 0 && (
            <Text style={styles.subtitle}>{activeCount} remaining</Text>
          )}
        </View>
      </View>

      <SyncStatusBar onRetry={syncFromDrive} />

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            onPress={() => setFilter(f.key)}
            style={[styles.filterBtn, filter === f.key && styles.filterBtnActive]}
          >
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaskCard task={item} onEdit={handleEdit} />}
        contentContainerStyle={[
          styles.list,
          filtered.length === 0 && styles.listEmpty,
        ]}
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
            icon="checkmark-circle-outline"
            title={filter === 'completed' ? 'No completed tasks' : 'No tasks yet'}
            subtitle={
              filter === 'all'
                ? 'Tap + to create your first task'
                : filter === 'active'
                ? 'All tasks are complete!'
                : 'Complete some tasks to see them here'
            }
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

      <AddEditTaskModal
        visible={modalVisible}
        task={editingTask}
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
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.navy[700],
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterBtnActive: {
    backgroundColor: colors.teal[700],
    borderColor: colors.teal[500],
  },
  filterText: {
    color: colors.text.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  filterTextActive: {
    color: colors.teal[300],
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 120,
  },
  listEmpty: {
    flex: 1,
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
