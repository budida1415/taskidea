import React, { useState } from 'react'
import { Platform, TouchableOpacity, View, Text, Modal, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../constants/colors'

interface Props {
  value: string
  onChange: (date: string) => void
}

const toDate = (iso: string) => (iso ? new Date(iso) : new Date())
const toISO = (d: Date) => d.toISOString().split('T')[0]
const fmt = (iso: string) =>
  iso
    ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Select date'

export function DatePicker({ value, onChange }: Props) {
  const [showPicker, setShowPicker] = useState(false)
  const [tempDate, setTempDate] = useState<Date>(new Date())

  if (Platform.OS === 'web') {
    return (
      <input
        type="date"
        value={value}
        onChange={(e) => onChange((e.target as HTMLInputElement).value)}
        style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: 10,
          color: value ? colors.text.primary : colors.text.muted,
          fontSize: 15,
          padding: '12px 14px',
          width: '100%',
          boxSizing: 'border-box',
          colorScheme: 'dark',
          outline: 'none',
          fontFamily: 'inherit',
          cursor: 'pointer',
        } as React.CSSProperties}
      />
    )
  }

  if (Platform.OS === 'android') {
    const RNDateTimePicker = require('@react-native-community/datetimepicker').default

    return (
      <>
        <TouchableOpacity style={styles.row} onPress={() => setShowPicker(true)} activeOpacity={0.7}>
          <Ionicons name="calendar-outline" size={18} color={colors.teal[400]} />
          <Text style={[styles.dateText, !value && styles.placeholder]}>{fmt(value)}</Text>
          {value ? (
            <TouchableOpacity
              onPress={() => onChange('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close-circle" size={16} color={colors.text.muted} />
            </TouchableOpacity>
          ) : null}
        </TouchableOpacity>

        {showPicker && (
          <RNDateTimePicker
            value={toDate(value)}
            mode="date"
            display="default"
            onChange={(_: unknown, selected?: Date) => {
              setShowPicker(false)
              if (selected) onChange(toISO(selected))
            }}
          />
        )}
      </>
    )
  }

  // iOS
  const RNDateTimePicker = require('@react-native-community/datetimepicker').default

  return (
    <>
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          setTempDate(toDate(value))
          setShowPicker(true)
        }}
        activeOpacity={0.7}
      >
        <Ionicons name="calendar-outline" size={18} color={colors.teal[400]} />
        <Text style={[styles.dateText, !value && styles.placeholder]}>{fmt(value)}</Text>
        {value ? (
          <TouchableOpacity
            onPress={() => onChange('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={16} color={colors.text.muted} />
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>

      <Modal visible={showPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.sheetHeader}>
              <TouchableOpacity onPress={() => { onChange(''); setShowPicker(false) }}>
                <Text style={styles.sheetBtn}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { onChange(toISO(tempDate)); setShowPicker(false) }}>
                <Text style={[styles.sheetBtn, styles.sheetDone]}>Done</Text>
              </TouchableOpacity>
            </View>
            <RNDateTimePicker
              value={tempDate}
              mode="date"
              display="spinner"
              themeVariant="dark"
              onChange={(_: unknown, selected?: Date) => {
                if (selected) setTempDate(selected)
              }}
              style={styles.spinner}
            />
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dateText: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 15,
  },
  placeholder: {
    color: colors.text.muted,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalSheet: {
    backgroundColor: colors.navy[800],
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 32,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sheetBtn: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  sheetDone: {
    color: colors.teal[400],
    fontWeight: '700',
  },
  spinner: {
    height: 200,
  },
})
