import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { colors } from '../constants/colors'

interface Props {
  label: string
  onRemove?: () => void
}

export function TagChip({ label, onRemove }: Props) {
  return (
    <View style={styles.chip}>
      <Text style={styles.label}># {label}</Text>
      {onRemove && (
        <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}>
          <Text style={styles.remove}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.navy[700],
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginRight: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    color: colors.teal[400],
    fontSize: 12,
    fontWeight: '500',
  },
  remove: {
    color: colors.text.muted,
    fontSize: 16,
    marginLeft: 4,
    lineHeight: 18,
  },
})
