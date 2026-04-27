import React, { useState, useEffect } from 'react'
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { randomUUID } from 'expo-crypto'
import { Task } from '../types'
import { useAppStore } from '../store/useAppStore'
import { scheduleSyncToDrive } from '../services/driveSync'
import { TagChip } from './TagChip'
import { DatePicker } from './DatePicker'
import { colors } from '../constants/colors'

interface Props {
  visible: boolean
  task?: Task | null
  onClose: () => void
}

const PRIORITIES: Array<Task['priority']> = ['low', 'medium', 'high']
const PRIORITY_LABELS = { low: 'Low', medium: 'Medium', high: 'High' }

const EMPTY: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '',
  description: '',
  completed: false,
  priority: 'medium',
  dueDate: '',
  tags: [],
}

export function AddEditTaskModal({ visible, task, onClose }: Props) {
  const { addTask, updateTask } = useAppStore()
  const [form, setForm] = useState(EMPTY)
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description ?? '',
        completed: task.completed,
        priority: task.priority,
        dueDate: task.dueDate ?? '',
        tags: [...task.tags],
      })
    } else {
      setForm(EMPTY)
    }
    setTagInput('')
  }, [task, visible])

  function addTag() {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
    if (t && !form.tags.includes(t)) {
      setForm((f) => ({ ...f, tags: [...f.tags, t] }))
    }
    setTagInput('')
  }

  function removeTag(tag: string) {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }))
  }

  function handleSave() {
    if (!form.title.trim()) return
    const now = new Date().toISOString()
    if (task) {
      updateTask(task.id, { ...form, title: form.title.trim() })
    } else {
      addTask({
        id: randomUUID(),
        ...form,
        title: form.title.trim(),
        createdAt: now,
        updatedAt: now,
      })
    }
    scheduleSyncToDrive()
    onClose()
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.headerBtn}>
            <Text style={styles.headerBtnText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{task ? 'Edit Task' : 'New Task'}</Text>
          <TouchableOpacity
            onPress={handleSave}
            style={[styles.headerBtn, styles.saveBtn, !form.title.trim() && styles.saveBtnDisabled]}
          >
            <Text style={[styles.headerBtnText, styles.saveBtnText]}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Title */}
          <View style={styles.field}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              value={form.title}
              onChangeText={(v) => setForm((f) => ({ ...f, title: v }))}
              placeholder="What needs to be done?"
              placeholderTextColor={colors.text.muted}
              autoFocus
            />
          </View>

          {/* Description */}
          <View style={styles.field}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              value={form.description}
              onChangeText={(v) => setForm((f) => ({ ...f, description: v }))}
              placeholder="Add details…"
              placeholderTextColor={colors.text.muted}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Priority */}
          <View style={styles.field}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityRow}>
              {PRIORITIES.map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setForm((f) => ({ ...f, priority: p }))}
                  style={[
                    styles.priorityBtn,
                    {
                      borderColor: colors.priority[p],
                      backgroundColor: form.priority === p ? colors.priority[p] + '33' : 'transparent',
                    },
                  ]}
                >
                  <Text style={[styles.priorityText, { color: colors.priority[p] }]}>
                    {PRIORITY_LABELS[p]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Due Date */}
          <View style={styles.field}>
            <Text style={styles.label}>Due Date</Text>
            <DatePicker
              value={form.dueDate ?? ''}
              onChange={(v) => setForm((f) => ({ ...f, dueDate: v }))}
            />
          </View>

          {/* Tags */}
          <View style={styles.field}>
            <Text style={styles.label}>Tags</Text>
            <View style={styles.tagInputRow}>
              <TextInput
                style={[styles.input, styles.tagInput]}
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={addTag}
                placeholder="Add tag and press Enter"
                placeholderTextColor={colors.text.muted}
                returnKeyType="done"
              />
              <TouchableOpacity onPress={addTag} style={styles.addTagBtn}>
                <Text style={styles.addTagText}>Add</Text>
              </TouchableOpacity>
            </View>
            {form.tags.length > 0 && (
              <View style={styles.tagList}>
                {form.tags.map((tag) => (
                  <TagChip key={tag} label={tag} onRemove={() => removeTag(tag)} />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 56 : 16,
    paddingBottom: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  headerBtnText: {
    color: colors.text.secondary,
    fontSize: 15,
  },
  headerTitle: {
    color: colors.text.primary,
    fontSize: 17,
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: colors.accent,
  },
  saveBtnDisabled: {
    opacity: 0.4,
  },
  saveBtnText: {
    color: colors.white,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    color: colors.text.primary,
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tagInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tagInput: {
    flex: 1,
  },
  addTagBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
  },
  addTagText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
})
