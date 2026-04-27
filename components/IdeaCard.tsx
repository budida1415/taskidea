import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Idea } from '../types'
import { useAppStore } from '../store/useAppStore'
import { scheduleSyncToDrive } from '../services/driveSync'
import { TagChip } from './TagChip'
import { colors } from '../constants/colors'

interface Props {
  idea: Idea
  onEdit: (idea: Idea) => void
}

export function IdeaCard({ idea, onEdit }: Props) {
  const { togglePinIdea, deleteIdea } = useAppStore()

  function handlePin() {
    togglePinIdea(idea.id)
    scheduleSyncToDrive()
  }

  function handleDelete() {
    Alert.alert('Delete Idea', `Delete "${idea.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteIdea(idea.id)
          scheduleSyncToDrive()
        },
      },
    ])
  }

  return (
    <TouchableOpacity style={styles.card} onPress={() => onEdit(idea)} activeOpacity={0.85}>
      <View style={[styles.accentBar, { backgroundColor: idea.color }]} />
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>{idea.title}</Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={handlePin} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
              <Ionicons
                name={idea.pinned ? 'bookmark' : 'bookmark-outline'}
                size={16}
                color={idea.pinned ? idea.color : colors.text.muted}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
              <Ionicons name="trash-outline" size={15} color={colors.text.muted} />
            </TouchableOpacity>
          </View>
        </View>

        {idea.content ? (
          <Text style={styles.content} numberOfLines={4}>
            {idea.content}
          </Text>
        ) : null}

        {idea.tags.length > 0 && (
          <View style={styles.tags}>
            {idea.tags.slice(0, 3).map((tag) => (
              <TagChip key={tag} label={tag} />
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    margin: 5,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    minHeight: 140,
  },
  accentBar: {
    height: 4,
    width: '100%',
  },
  body: {
    padding: 12,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 6,
  },
  title: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  content: {
    color: colors.text.secondary,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 'auto',
  },
})
