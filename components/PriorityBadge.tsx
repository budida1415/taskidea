import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../constants/colors'

interface Props {
  priority: 'low' | 'medium' | 'high'
}

const LABELS = { low: 'Low', medium: 'Med', high: 'High' }

export function PriorityBadge({ priority }: Props) {
  return (
    <View style={[styles.badge, { backgroundColor: colors.priority[priority] + '22', borderColor: colors.priority[priority] }]}>
      <Text style={[styles.text, { color: colors.priority[priority] }]}>
        {LABELS[priority]}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
})
