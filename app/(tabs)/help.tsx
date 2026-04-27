import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../constants/colors'

interface Section {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  items: { q: string; a: string }[]
}

const SECTIONS: Section[] = [
  {
    icon: 'checkmark-circle-outline',
    title: 'Tasks',
    items: [
      {
        q: 'How do I create a task?',
        a: 'Tap the teal + button at the bottom-right of the Tasks screen. Fill in the title (required), description, priority, due date, and tags, then tap Save.',
      },
      {
        q: 'How do I complete a task?',
        a: 'Tap the circle checkbox on the left side of any task card. It turns teal and the title gets a strikethrough. Tap again to mark it incomplete.',
      },
      {
        q: 'How do I edit a task?',
        a: 'Tap anywhere on the task card (not the checkbox or trash icon) to open the edit form.',
      },
      {
        q: 'How do I delete a task?',
        a: 'Tap the trash icon on the right side of the task card and confirm the deletion.',
      },
      {
        q: 'What do the priority levels mean?',
        a: 'Low (seafoam) = nice to do. Medium (teal) = should do soon. High (amber) = urgent.',
      },
      {
        q: 'How do I filter tasks?',
        a: 'Use the All / Active / Done buttons at the top of the Tasks screen to filter by completion status.',
      },
    ],
  },
  {
    icon: 'bulb-outline',
    title: 'Ideas',
    items: [
      {
        q: 'How do I capture an idea?',
        a: 'Tap the teal + button on the Ideas screen. Add a title, notes, pick an accent color, and add tags.',
      },
      {
        q: 'How do I pin an important idea?',
        a: 'Tap the bookmark icon on an idea card to pin it. Pinned ideas always appear at the top of the board.',
      },
      {
        q: 'How do I edit an idea?',
        a: 'Tap anywhere on the idea card to open the edit form.',
      },
      {
        q: 'What are the accent colors for?',
        a: 'They are visual labels to help you group or recognize ideas at a glance. Pick any color that feels right.',
      },
      {
        q: 'How are ideas sorted?',
        a: 'Pinned ideas appear first, then the rest are sorted by most recently updated.',
      },
    ],
  },
  {
    icon: 'cloud-outline',
    title: 'Google Drive Sync',
    items: [
      {
        q: 'Where is my data stored?',
        a: 'Everything is stored in a folder called "TaskIdea" inside your own Google Drive. Nothing goes to any external server.',
      },
      {
        q: 'How does syncing work?',
        a: 'The app loads your data from Drive when it starts. Every change you make is automatically saved to Drive within 1 second.',
      },
      {
        q: 'What does the sync status bar mean?',
        a: 'Syncing… = writing to Drive. Synced = all changes saved. Offline = no internet connection. Sync failed = Drive API error (try pulling to refresh).',
      },
      {
        q: 'How do I force a manual sync?',
        a: 'Pull down on the Tasks or Ideas screen to refresh, or go to Settings and tap the refresh icon next to Sync Status.',
      },
      {
        q: 'Does it work offline?',
        a: 'Yes. The app caches your data locally so you can read and edit without internet. Changes are uploaded automatically when you reconnect.',
      },
      {
        q: 'Can I use this on multiple devices?',
        a: 'Yes. Sign in with the same Google account on each device. Data syncs through your Drive. Note: last-save wins if you edit the same item on two devices simultaneously.',
      },
    ],
  },
  {
    icon: 'settings-outline',
    title: 'Account & Settings',
    items: [
      {
        q: 'How do I sign out?',
        a: 'Go to the Settings tab and tap "Sign Out" at the bottom. Your data stays safely in your Google Drive.',
      },
      {
        q: 'What happens to my data if I sign out?',
        a: 'Nothing is deleted. Your tasks.json and ideas.json files remain in your Google Drive. Sign back in anytime to access them.',
      },
      {
        q: 'How do I see my task and idea counts?',
        a: 'The Settings screen shows your total tasks, completed tasks, and idea counts at a glance.',
      },
    ],
  },
]

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <View style={styles.item}>
      <TouchableOpacity
        style={styles.question}
        onPress={() => setOpen((v) => !v)}
        activeOpacity={0.7}
      >
        <Text style={styles.questionText}>{q}</Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={colors.text.muted}
        />
      </TouchableOpacity>
      {open && <Text style={styles.answer}>{a}</Text>}
    </View>
  )
}

export default function HelpScreen() {
  const insets = useSafeAreaInsets()

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.screenTitle}>Help</Text>
        <Text style={styles.subtitle}>Tap any question to expand</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name={section.icon} size={18} color={colors.teal[400]} />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <View style={styles.card}>
              {section.items.map((item, i) => (
                <View key={item.q}>
                  <AccordionItem q={item.q} a={item.a} />
                  {i < section.items.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Ionicons name="layers" size={24} color={colors.teal[600]} />
          <Text style={styles.footerText}>TaskIdea v1.0.0</Text>
          <Text style={styles.footerSub}>Your data lives in your Google Drive</Text>
        </View>

        <View style={{ height: insets.bottom + 20 }} />
      </ScrollView>
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
  },
  screenTitle: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.text.muted,
    fontSize: 13,
    marginTop: 2,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionTitle: {
    color: colors.teal[400],
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  question: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  questionText: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  answer: {
    color: colors.text.secondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 6,
  },
  footerText: {
    color: colors.text.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  footerSub: {
    color: colors.navy[500],
    fontSize: 12,
  },
})
