import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { RecurringTask } from '../types'
import { useAppStore } from '../store/useAppStore'
import { scheduleSyncToDrive } from '../services/driveSync'
import { PriorityBadge } from './PriorityBadge'
import { TagChip } from './TagChip'
import { colors } from '../constants/colors'

interface Props {
  task: RecurringTask
  onEdit: (task: RecurringTask) => void
}

const RECURRENCE_LABELS: Record<RecurringTask['recurrence'], string> = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  'half-yearly': 'Half-Yearly',
  yearly: 'Yearly',
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function RecurringTaskCard({ task, onEdit }: Props) {
  const { deleteRecurring } = useAppStore()

  function handleDelete() {
    if (Platform.OS === 'web') {
      if (window.confirm(`Delete "${task.title}"?`)) {
        deleteRecurring(task.id)
        scheduleSyncToDrive()
      }
      return
    }
    Alert.alert('Delete Recurring Task', `Delete "${task.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteRecurring(task.id)
          scheduleSyncToDrive()
        },
      },
    ])
  }

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.content} onPress={() => onEdit(task)} activeOpacity={0.8}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>{task.title}</Text>
          <PriorityBadge priority={task.priority} />
        </View>

        {task.description ? (
          <Text style={styles.description} numberOfLines={1}>{task.description}</Text>
        ) : null}

        <View style={styles.footer}>
          <View style={styles.recurrenceBadge}>
            <Ionicons name="refresh-circle-outline" size={13} color={colors.teal[400]} />
            <Text style={styles.recurrenceText}>{RECURRENCE_LABELS[task.recurrence]}</Text>
          </View>
          <View style={styles.dueDateRow}>
            <Ionicons name="calendar-outline" size={12} color={colors.text.muted} />
            <Text style={styles.dueDate}>Next: {fmtDate(task.nextDueDate)}</Text>
          </View>
        </View>

        {task.tags.length > 0 && (
          <View style={styles.tags}>
            {task.tags.slice(0, 3).map((tag) => (
              <TagChip key={tag} label={tag} />
            ))}
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleDelete}
        style={styles.deleteBtn}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="trash-outline" size={16} color={colors.text.muted} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
    borderLeftColor: colors.teal[500],
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 4,
  },
  title: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 21,
  },
  description: {
    color: colors.text.secondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
    marginBottom: 6,
  },
  recurrenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.teal[700],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  recurrenceText: {
    color: colors.teal[300],
    fontSize: 11,
    fontWeight: '600',
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDate: {
    color: colors.text.muted,
    fontSize: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  deleteBtn: {
    paddingLeft: 8,
    paddingTop: 2,
  },
})
