import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Task } from '../types'
import { useAppStore } from '../store/useAppStore'
import { scheduleSyncToDrive } from '../services/driveSync'
import { PriorityBadge } from './PriorityBadge'
import { TagChip } from './TagChip'
import { colors } from '../constants/colors'

interface Props {
  task: Task
  onEdit: (task: Task) => void
}

export function TaskCard({ task, onEdit }: Props) {
  const { toggleTask, deleteTask } = useAppStore()

  function handleToggle() {
    toggleTask(task.id)
    scheduleSyncToDrive()
  }

  function handleDelete() {
    Alert.alert('Delete Task', `Delete "${task.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteTask(task.id)
          scheduleSyncToDrive()
        },
      },
    ])
  }

  return (
    <View style={[styles.card, task.completed && styles.cardDone]}>
      <TouchableOpacity onPress={handleToggle} style={styles.checkbox} activeOpacity={0.7}>
        <View style={[styles.checkCircle, task.completed && styles.checkCircleDone]}>
          {task.completed && <Ionicons name="checkmark" size={14} color={colors.navy[900]} />}
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.content} onPress={() => onEdit(task)} activeOpacity={0.8}>
        <View style={styles.titleRow}>
          <Text
            style={[styles.title, task.completed && styles.titleDone]}
            numberOfLines={2}
          >
            {task.title}
          </Text>
          <PriorityBadge priority={task.priority} />
        </View>

        {task.description ? (
          <Text style={styles.description} numberOfLines={1}>
            {task.description}
          </Text>
        ) : null}

        <View style={styles.footer}>
          {task.dueDate ? (
            <View style={styles.dueDateRow}>
              <Ionicons name="calendar-outline" size={12} color={colors.text.muted} />
              <Text style={styles.dueDate}>{task.dueDate}</Text>
            </View>
          ) : null}
          {task.tags.length > 0 && (
            <View style={styles.tags}>
              {task.tags.slice(0, 3).map((tag) => (
                <TagChip key={tag} label={tag} />
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
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
  },
  cardDone: {
    opacity: 0.6,
  },
  checkbox: {
    paddingTop: 2,
    marginRight: 12,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.teal[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleDone: {
    backgroundColor: colors.teal[500],
    borderColor: colors.teal[500],
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
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.text.muted,
  },
  description: {
    color: colors.text.secondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  footer: {
    marginTop: 4,
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
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
