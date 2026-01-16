<template>
  <div class="page-shell flex-col gap-4 pixel-bg text-slate-900">
    <div class="flex items-center mb-8">
      <back-btn class="mr-4 static" />
      <div>
        <h1 class="text-3xl font-bold text-white card-font uppercase tracking-wide">{{ $t('dashboard.title') }}</h1>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-4">
      <div class="pixel-panel p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs uppercase text-slate-600">{{ $t('home.level') }}</p>
            <p class="text-2xl font-bold">Lv {{ level }}</p>
          </div>
          <div class="text-right">
            <p class="text-xs uppercase text-slate-600">XP</p>
            <p class="text-xl font-semibold">{{ xp }} / {{ xpToNext }}</p>
          </div>
        </div>
        <XpBar :currentXp="xp" :xpToNext="xpToNext" :level="level" class="mt-3" />
        <p class="text-xs text-slate-700 mt-2">{{ $t('dashboard.multiplier') }}: x{{ xpMultiplier }}</p>
      </div>

      <div class="pixel-panel p-4">
        <p class="text-xs uppercase text-slate-600 mb-2">{{ $t('dashboard.billing') }}</p>
        <div class="space-y-2">
          <div class="flex items-center justify-between pixel-inset p-3">
            <div>
              <p class="font-semibold">{{ $t('dashboard.seasonal') }}</p>
              <p class="text-xs text-slate-700">$4.99/month · XP boosts & themes</p>
            </div>
            <button class="pixel-btn success text-sm">{{ $t('dashboard.subscribe') }}</button>
          </div>
          <div class="flex items-center justify-between pixel-inset p-3">
            <div>
              <p class="font-semibold">{{ $t('dashboard.teacher') }}</p>
              <p class="text-xs text-slate-700">$5–$12 per teacher · Classroom mode</p>
            </div>
            <button class="pixel-btn primary text-sm">{{ $t('dashboard.upgrade') }}</button>
          </div>
          <div class="flex items-center justify-between pixel-inset p-3">
            <div>
              <p class="font-semibold">{{ $t('dashboard.booster') }}</p>
              <p class="text-xs text-slate-700">$0.99 · x2 XP for 48h</p>
            </div>
            <button class="pixel-btn danger text-sm">{{ $t('dashboard.boost') }}</button>
          </div>
        </div>
      </div>
    </div>

    <div class="grid md:grid-cols-3 gap-4">
      <div class="pixel-panel p-4">
        <p class="text-xs uppercase text-slate-600 mb-2">{{ $t('dashboard.themes') }}</p>
        <ul class="space-y-1 max-h-48 overflow-y-auto">
          <li v-for="(theme, idx) in unlocks.themes" :key="'theme-' + idx" class="text-sm">{{ theme }}</li>
        </ul>
      </div>
      <div class="pixel-panel p-4">
        <p class="text-xs uppercase text-slate-600 mb-2">{{ $t('dashboard.card_sets') }}</p>
        <ul class="space-y-1 max-h-48 overflow-y-auto">
          <li v-for="(set, idx) in unlocks.sets" :key="'set-' + idx" class="text-sm">{{ set }}</li>
        </ul>
      </div>
      <div class="pixel-panel p-4">
        <p class="text-xs uppercase text-slate-600 mb-2">{{ $t('dashboard.tenses') }}</p>
        <ul class="space-y-1 max-h-48 overflow-y-auto">
          <li v-for="(tense, idx) in unlocks.tenses" :key="'tense-' + idx" class="text-sm">{{ tense }}</li>
        </ul>
      </div>
    </div>

    <div class="pixel-panel p-4">
      <div class="flex items-center justify-between mb-3">
        <div>
          <p class="text-xs uppercase text-slate-600">{{ $t('dashboard.achievements') }}</p>
          <p class="text-lg font-semibold">{{ $t('dashboard.keep_climbing') }}</p>
        </div>
        <span class="text-xs pixel-chip">{{ $t('dashboard.live') }}</span>
      </div>
      <div class="grid md:grid-cols-2 gap-3 max-h-72 overflow-y-auto">
        <div v-for="(ach, idx) in achievements" :key="'ach-' + idx" class="p-3 pixel-inset">
          <p class="font-semibold">{{ ach.title || ach.id || $t('dashboard.achievement') }}</p>
          <p class="text-xs text-slate-700">{{ ach.description || $t('dashboard.unlocked') }}</p>
        </div>
        <div v-if="achievements.length === 0" class="text-sm text-slate-700">{{ $t('dashboard.none') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import XpBar from '@/components/ui/XpBar.vue'
import BackBtn from '@/components/navigation/BackButton.vue'

export default {
  name: 'DashboardView',
  components: { XpBar, BackBtn },
  setup() {
    const store = useStore()
    const xp = computed(() => store.state.progression.xp)
    const xpToNext = computed(() => store.state.progression.xpToNext)
    const xpMultiplier = computed(() => store.state.progression.xpMultiplier || 1)
    const level = computed(() => store.state.progression.level)
    const unlocks = computed(() => store.state.progression.unlocks || { themes: [], sets: [], tenses: [] })
    const achievements = computed(() => store.state.progression.achievements || [])

    return {
      xp,
      xpToNext,
      xpMultiplier,
      level,
      unlocks,
      achievements
    }
  }
}
</script>
