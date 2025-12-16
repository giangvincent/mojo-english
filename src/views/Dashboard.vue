<template>
  <div class="min-h-screen bg-gray-900 text-white px-4 md:px-10 py-8 overflow-y-auto">
    <div class="max-w-6xl mx-auto space-y-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p class="uppercase text-xs tracking-[0.2em] text-emerald-300">{{ $t('dashboard.kicker') }}</p>
          <h1 class="text-3xl font-bold">{{ $t('dashboard.title') }}</h1>
          <p class="text-sm text-gray-300">{{ $t('dashboard.subtitle') }}</p>
        </div>
        <router-link to="/" class="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-semibold">
          ← {{ $t('dashboard.back_home') }}
        </router-link>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs uppercase text-gray-400">{{ $t('home.level') }}</p>
              <p class="text-2xl font-bold">Lv {{ level }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs uppercase text-gray-400">XP</p>
              <p class="text-xl font-semibold">{{ xp }} / {{ xpToNext }}</p>
            </div>
          </div>
          <XpBar :currentXp="xp" :xpToNext="xpToNext" :level="level" class="mt-3" />
          <p class="text-xs text-gray-300 mt-2">{{ $t('dashboard.multiplier') }}: x{{ xpMultiplier }}</p>
        </div>

        <div class="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p class="text-xs uppercase text-gray-400 mb-2">Billing & Upgrades</p>
          <div class="space-y-2">
            <div class="flex items-center justify-between bg-white/5 px-3 py-2 rounded-lg">
              <div>
                <p class="font-semibold">Seasonal Pass</p>
                <p class="text-xs text-gray-300">$4.99/month · XP boosts & themes</p>
              </div>
              <button class="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm">Subscribe</button>
            </div>
            <div class="flex items-center justify-between bg-white/5 px-3 py-2 rounded-lg">
              <div>
                <p class="font-semibold">Teacher Plan</p>
                <p class="text-xs text-gray-300">$5–$12 per teacher · Classroom mode</p>
              </div>
              <button class="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm">Upgrade</button>
            </div>
            <div class="flex items-center justify-between bg-white/5 px-3 py-2 rounded-lg">
              <div>
                <p class="font-semibold">XP Booster</p>
                <p class="text-xs text-gray-300">$0.99 · x2 XP for 48h</p>
              </div>
              <button class="px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm">Buy</button>
            </div>
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-4">
        <div class="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p class="text-xs uppercase text-gray-400 mb-2">Themes Unlocked</p>
          <ul class="space-y-1 max-h-48 overflow-y-auto">
            <li v-for="(theme, idx) in unlocks.themes" :key="'theme-' + idx" class="text-sm">{{ theme }}</li>
          </ul>
        </div>
        <div class="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p class="text-xs uppercase text-gray-400 mb-2">Card Sets</p>
          <ul class="space-y-1 max-h-48 overflow-y-auto">
            <li v-for="(set, idx) in unlocks.sets" :key="'set-' + idx" class="text-sm">{{ set }}</li>
          </ul>
        </div>
        <div class="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p class="text-xs uppercase text-gray-400 mb-2">Tenses</p>
          <ul class="space-y-1 max-h-48 overflow-y-auto">
            <li v-for="(tense, idx) in unlocks.tenses" :key="'tense-' + idx" class="text-sm">{{ tense }}</li>
          </ul>
        </div>
      </div>

      <div class="bg-white/5 border border-white/10 rounded-2xl p-4">
        <div class="flex items-center justify-between mb-3">
          <div>
            <p class="text-xs uppercase text-gray-400">Achievements</p>
            <p class="text-lg font-semibold">Keep climbing</p>
          </div>
          <span class="text-xs bg-emerald-600 px-3 py-1 rounded-full">Live</span>
        </div>
        <div class="grid md:grid-cols-2 gap-3 max-h-72 overflow-y-auto">
          <div v-for="(ach, idx) in achievements" :key="'ach-' + idx" class="p-3 rounded-lg bg-white/5 border border-white/10">
            <p class="font-semibold">{{ ach.title || ach.id || 'Achievement' }}</p>
            <p class="text-xs text-gray-300">{{ ach.description || 'Unlocked' }}</p>
          </div>
          <div v-if="achievements.length === 0" class="text-sm text-gray-300">No achievements yet. Play to unlock!</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import XpBar from '@/components/ui/XpBar.vue'

const store = useStore()
const xp = computed(() => store.state.progression.xp)
const xpToNext = computed(() => store.state.progression.xpToNext)
const xpMultiplier = computed(() => store.state.progression.xpMultiplier || 1)
const level = computed(() => store.state.progression.level)
const unlocks = computed(() => store.state.progression.unlocks || { themes: [], sets: [], tenses: [] })
const achievements = computed(() => store.state.progression.achievements || [])
</script>
