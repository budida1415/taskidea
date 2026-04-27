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
import { Idea } from '../types'
import { useAppStore } from '../store/useAppStore'
import { scheduleSyncToDrive } from '../services/driveSync'
import { TagChip } from './TagChip'
import { colors } from '../constants/colors'

interface Props {
  visible: boolean
  idea?: Idea | null
  onClose: () => void
}

const EMPTY: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '',
  content: '',
  tags: [],
  color: colors.ideaAccents[0],
  pinned: false,
}

export function AddEditIdeaModal({ visible, idea, onClose }: Props) {
  const { addIdea, updateIdea } = useAppStore()
  const [form, setForm] = useState(EMPTY)
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (idea) {
      setForm({
        title: idea.title,
        content: idea.content,
        tags: [...idea.tags],
        color: idea.color,
        pinned: idea.pinned,
      })
    } else {
      setForm(EMPTY)
    }
    setTagInput('')
  }, [idea, visible])

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
    if (idea) {
      updateIdea(idea.id, { ...form, title: form.title.trim() })
    } else {
      addIdea({
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
          <Text style={styles.headerTitle}>{idea ? 'Edit Idea' : 'New Idea'}</Text>
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
              placeholder="Name your idea"
              placeholderTextColor={colors.text.muted}
              autoFocus
            />
          </View>

          {/* Content */}
          <View style={styles.field}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              value={form.content}
              onChangeText={(v) => setForm((f) => ({ ...f, content: v }))}
              placeholder="Describe your idea…"
              placeholderTextColor={colors.text.muted}
              multiline
              numberOfLines={6}
            />
          </View>

          {/* Color */}
          <View style={styles.field}>
            <Text style={styles.label}>Accent Color</Text>
            <View style={styles.colorRow}>
              {colors.ideaAccents.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setForm((f) => ({ ...f, color: c }))}
                  style={[
                    styles.colorDot,
                    { backgroundColor: c },
                    form.color === c && styles.colorDotSelected,
                  ]}
                />
              ))}
            </View>
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
    minHeight: 120,
    textAlignVertical: 'top',
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  colorDotSelected: {
    borderWidth: 3,
    borderColor: colors.white,
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
