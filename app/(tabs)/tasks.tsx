import React, { useState, useMemo } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useAppStore } from '../../store/useAppStore'
import { useDriveSync } from '../../hooks/useDriveSync'
import { TaskCard } from '../../components/TaskCard'
import { RecurringTaskCard } from '../../components/RecurringTaskCard'
import { AddEditTaskModal } from '../../components/AddEditTaskModal'
import { AddEditRecurringModal } from '../../components/AddEditRecurringModal'
import { EmptyState } from '../../components/EmptyState'
import { colors } from '../../constants/colors'
import { Task, RecurringTask, TaskFilter } from '../../types'

const FILTERS: { key: TaskFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Done' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'recurring', label: 'Recurring' },
]

function SyncIndicator({ onRetry }: { onRetry: () => void }) {
  const syncStatus = useAppStore((s) => s.syncStatus)
  if (syncStatus === 'idle' || syncStatus === 'synced') return null
  if (syncStatus === 'syncing') {
    return <ActivityIndicator size={14} color={colors.teal[400]} />
  }
  if (syncStatus === 'error') {
    return (
      <TouchableOpacity onPress={onRetry} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="alert-circle" size={17} color={colors.error} />
      </TouchableOpacity>
    )
  }
  if (syncStatus === 'offline') {
    return <Ionicons name="cloud-offline-outline" size={17} color={colors.warning} />
  }
  return null
}

export default function TasksScreen() {
  const tasks = useAppStore((s) => s.tasks)
  const recurringTasks = useAppStore((s) => s.recurringTasks)
  const { syncFromDrive } = useDriveSync()
  const insets = useSafeAreaInsets()

  const [filter, setFilter] = useState<TaskFilter>('all')
  const [refreshing, setRefreshing] = useState(false)
  const [taskModalVisible, setTaskModalVisible] = useState(false)
  const [recurringModalVisible, setRecurringModalVisible] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editingRecurring, setEditingRecurring] = useState<RecurringTask | null>(null)

  const today = new Date().toISOString().split('T')[0]
  const activeCount = tasks.filter((t) => !t.completed).length
  const overdueCount = tasks.filter(
    (t) => !t.completed && !!t.dueDate && t.dueDate < today
  ).length

  const filteredTasks = useMemo(() => {
    const sorted = [...tasks].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    if (filter === 'active') return sorted.filter((t) => !t.completed)
    if (filter === 'completed') return sorted.filter((t) => t.completed)
    if (filter === 'overdue') return sorted.filter((t) => !t.completed && !!t.dueDate && t.dueDate < today)
    return sorted
  }, [tasks, filter, today])

  const sortedRecurring = useMemo(
    () => [...recurringTasks].sort((a, b) => a.nextDueDate.localeCompare(b.nextDueDate)),
    [recurringTasks]
  )

  async function handleRefresh() {
    setRefreshing(true)
    await syncFromDrive()
    setRefreshing(false)
  }

  function handleEditTask(task: Task) {
    setEditingTask(task)
    setTaskModalVisible(true)
  }

  function handleEditRecurring(task: RecurringTask) {
    setEditingRecurring(task)
    setRecurringModalVisible(true)
  }

  function openNew() {
    if (filter === 'recurring') {
      setEditingRecurring(null)
      setRecurringModalVisible(true)
    } else {
      setEditingTask(null)
      setTaskModalVisible(true)
    }
  }

  const isRecurring = filter === 'recurring'

  return (
    <View style={styles.root}>
      {/* Header — title + inline stats + icons all on one row */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.titleLine}>
          <Text style={styles.screenTitle}>Tasks</Text>
          {!isRecurring && activeCount > 0 && (
            <Text style={styles.statRemaining}>{activeCount} remaining</Text>
          )}
          {!isRecurring && overdueCount > 0 && (
            <Text style={styles.statOverdue}>{overdueCount} overdue</Text>
          )}
          {isRecurring && (
            <Text style={styles.statRemaining}>
              {recurringTasks.length} template{recurringTasks.length !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
        <View style={styles.headerIcons}>
          <SyncIndicator onRetry={syncFromDrive} />
          <TouchableOpacity
            onPress={() => setFilter('recurring')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name="refresh-circle-outline"
              size={26}
              color={isRecurring ? colors.teal[400] : colors.text.muted}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter tabs — horizontal scroll so all 5 fit on any screen */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((f) => {
          const isActive = filter === f.key
          const isOverdueBtn = f.key === 'overdue'
          return (
            <TouchableOpacity
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[
                styles.filterBtn,
                isActive && (isOverdueBtn ? styles.filterBtnOverdue : styles.filterBtnActive),
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  isActive && (isOverdueBtn ? styles.filterTextOverdue : styles.filterTextActive),
                ]}
              >
                {f.label}
                {isOverdueBtn && overdueCount > 0 && !isActive ? ` (${overdueCount})` : ''}
              </Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      {/* List */}
      {isRecurring ? (
        <FlatList
          data={sortedRecurring}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RecurringTaskCard task={item} onEdit={handleEditRecurring} />
          )}
          contentContainerStyle={[
            styles.list,
            sortedRecurring.length === 0 && styles.listEmpty,
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
              icon="refresh-circle-outline"
              title="No recurring tasks"
              subtitle="Tap + to add a bill or obligation that repeats"
            />
          }
        />
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TaskCard task={item} onEdit={handleEditTask} />}
          contentContainerStyle={[
            styles.list,
            filteredTasks.length === 0 && styles.listEmpty,
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
              icon={filter === 'overdue' ? 'checkmark-circle-outline' : 'checkmark-circle-outline'}
              title={
                filter === 'completed' ? 'No completed tasks'
                : filter === 'overdue' ? 'No overdue tasks'
                : 'No tasks yet'
              }
              subtitle={
                filter === 'all' ? 'Tap + to create your first task'
                : filter === 'active' ? 'All tasks are complete!'
                : filter === 'overdue' ? "You're all caught up!"
                : 'Complete some tasks to see them here'
              }
            />
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 72 }]}
        onPress={openNew}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color={colors.white} />
      </TouchableOpacity>

      <AddEditTaskModal
        visible={taskModalVisible}
        task={editingTask}
        onClose={() => setTaskModalVisible(false)}
      />
      <AddEditRecurringModal
        visible={recurringModalVisible}
        task={editingRecurring}
        onClose={() => setRecurringModalVisible(false)}
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: colors.background,
  },
  titleLine: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: 8,
    marginRight: 12,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 6,
  },
  screenTitle: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statRemaining: {
    color: colors.teal[400],
    fontSize: 13,
    fontWeight: '500',
  },
  statOverdue: {
    color: colors.warning,
    fontSize: 13,
    fontWeight: '600',
  },
  filterRow: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 8,
    flexDirection: 'row',
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
  filterBtnOverdue: {
    backgroundColor: colors.warning + '22',
    borderColor: colors.warning,
  },
  filterText: {
    color: colors.text.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  filterTextActive: {
    color: colors.teal[300],
  },
  filterTextOverdue: {
    color: colors.warning,
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
