<template>
  <div class="page-shell flex-col pixel-bg text-slate-900">
    <!-- Header -->
    <div class="flex items-center mb-8">
      <back-btn class="mr-4 static" />
      <h1 class="text-3xl font-bold text-white card-font uppercase tracking-wide">{{ $t('progress.title') }}</h1>
    </div>

    <!-- Content -->
    <div class="page-panel w-full p-6 md:p-8 space-y-8">


      <!-- Level & XP Card -->
      <div class="pixel-panel p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <div class="text-slate-600 text-sm uppercase tracking-wider">{{ $t('progress.current_level') }}</div>
            <div class="text-4xl font-bold text-amber-600">{{ level }}</div>
          </div>
          <div class="w-16 h-16 pixel-inset flex items-center justify-center text-2xl">
            🏆
          </div>
        </div>

        <div class="mb-2 flex justify-between text-sm">
          <span>{{ $t('progress.xp_progress') }}</span>
          <span>{{ xp }} / {{ xpToNext }} XP</span>
        </div>
        <div class="w-full pixel-inset h-4 overflow-hidden">
          <div class="bg-blue-500 h-full transition-all duration-500" :style="{ width: xpPercentage + '%' }">
          </div>
        </div>
        <div class="mt-2 text-xs text-slate-600 text-right">
          {{ xpToNext - xp }} {{ $t('progress.to_next_level') }}
        </div>
      </div>

      <!-- Missions Section -->
      <div class="space-y-4">
        <h2 class="text-xl font-bold flex items-center gap-2">
          <span>📜</span> {{ $t('progress.missions') }}
        </h2>

        <!-- Daily -->
        <div class="space-y-3">
          <h3 class="text-sm text-slate-600 uppercase font-bold">{{ $t('progress.daily_missions') }}</h3>
          <div v-for="mission in missions.daily" :key="mission.id" class="pixel-panel p-4 relative overflow-hidden"
            :class="{ 'border-green-500': mission.completed }">
            <div v-if="mission.completed" class="absolute top-0 right-0 pixel-chip">
              {{ $t('progress.completed') }}
            </div>
            <div class="flex justify-between items-start mb-2">
              <div class="font-medium">{{ mission.description }}</div>
              <div class="text-xs pixel-chip">
                +{{ mission.rewards.xp }} XP
              </div>
            </div>
            <div class="w-full pixel-inset h-2">
              <div class="bg-green-500 h-full transition-all duration-500"
                :style="{ width: Math.min(100, (mission.progress / mission.condition.count) * 100) + '%' }">
              </div>
            </div>
            <div class="mt-1 text-xs text-right text-slate-600">
              {{ mission.progress }} / {{ mission.condition.count }}
            </div>
          </div>
        </div>

        <!-- Weekly -->
        <div class="space-y-3">
          <h3 class="text-sm text-slate-600 uppercase font-bold">{{ $t('progress.weekly_missions') }}</h3>
          <div v-for="mission in missions.weekly" :key="mission.id" class="pixel-panel p-4 relative overflow-hidden"
            :class="{ 'border-purple-500': mission.completed }">
            <div v-if="mission.completed" class="absolute top-0 right-0 pixel-chip">
              {{ $t('progress.completed') }}
            </div>
            <div class="flex justify-between items-start mb-2">
              <div class="font-medium">{{ mission.description }}</div>
              <div class="text-xs pixel-chip">
                +{{ mission.rewards.xp }} XP
              </div>
            </div>
            <div class="w-full pixel-inset h-2">
              <div class="bg-purple-500 h-full transition-all duration-500"
                :style="{ width: Math.min(100, (mission.progress / mission.condition.count) * 100) + '%' }">
              </div>
            </div>
            <div class="mt-1 text-xs text-right text-slate-600">
              {{ mission.progress }} / {{ mission.condition.count }}
            </div>
          </div>
        </div>
      </div>

      <!-- Achievements Section -->
      <div class="space-y-4">
        <h2 class="text-xl font-bold flex items-center gap-2">
          <span>🏅</span> {{ $t('dashboard.achievements') }}
        </h2>
        <div class="grid grid-cols-1 gap-4">
          <div v-for="achievement in allAchievements" :key="achievement.id"
            class="pixel-panel p-4 flex items-center gap-4" :class="{ 'opacity-60': !isUnlocked(achievement.id) }">
            <div class="w-12 h-12 pixel-inset flex items-center justify-center text-2xl"
              :class="isUnlocked(achievement.id) ? 'bg-amber-400 text-white' : 'bg-slate-200 text-slate-500'">
              {{ isUnlocked(achievement.id) ? '✓' : '🔒' }}
            </div>
            <div class="flex-1">
              <div class="font-bold" :class="isUnlocked(achievement.id) ? 'text-slate-900' : 'text-slate-500'">
                {{ achievement.name }}
              </div>
              <div class="text-sm text-slate-600">{{ achievement.description }}</div>

              <!-- Progress Bar for incremental achievements -->
              <div v-if="!isUnlocked(achievement.id) && achievement.condition.count" class="mt-2">
                <div class="w-full pixel-inset h-1.5">
                  <div class="bg-yellow-500 h-full"
                    :style="{ width: Math.min(100, (getProgress(achievement.id) / achievement.condition.count) * 100) + '%' }">
                  </div>
                </div>
                <div class="text-xs text-right text-slate-600 mt-0.5">
                  {{ getProgress(achievement.id) }} / {{ achievement.condition.count }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { achievements } from '@/data/achievements'
import BackBtn from '@/components/navigation/BackButton.vue'

export default {
  name: 'ProgressScreen',
  components: { BackBtn },
  data() {
    return {
      allAchievements: achievements
    }
  },
  computed: {
    ...mapState({
      level: state => state.progression.level,
      xp: state => state.progression.xp,
      xpToNext: state => state.progression.xpToNext,
      missions: state => state.progression.missions,
      unlockedAchievements: state => state.progression.achievements,
      achievementProgress: state => state.progression.achievementProgress
    }),
    xpPercentage() {
      // Calculate progress into current level
      // This is simplified; ideally we'd know XP at start of level to show 0-100% for just this level
      // But xpToNext is total cumulative XP required.
      // Let's approximate:
      // We need a helper to get XP for *current* level start.
      // For now, just show raw percentage of total required (which will be high)
      // Better: use a utility to get range.
      // Let's just use raw ratio for now, or assume linear progress from previous level cap.
      return (this.xp / this.xpToNext) * 100
    }
  },
  methods: {
    isUnlocked(id) {
      return this.unlockedAchievements.some(a => a.id === id)
    },
    getProgress(id) {
      const progress = this.achievementProgress[id]
      if (Array.isArray(progress)) return progress.length
      return progress || 0
    }
  }
}
</script>
