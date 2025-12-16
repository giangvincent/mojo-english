<template>
    <div class="min-h-screen bg-gray-900 text-white p-4 pb-20">
        <!-- Header -->
        <div class="flex items-center mb-6">
            <button @click="$router.push('/')" class="mr-4 p-2 bg-gray-800 rounded-full hover:bg-gray-700">
                ←
            </button>
            <h1 class="text-2xl font-bold">{{ $t('progress.title') }}</h1>
        </div>

        <!-- Level & XP Card -->
        <div class="bg-gray-800 rounded-xl p-6 mb-6 shadow-lg border border-gray-700">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <div class="text-gray-400 text-sm uppercase tracking-wider">{{ $t('progress.current_level') }}</div>
                    <div class="text-4xl font-bold text-yellow-400">{{ level }}</div>
                </div>
                <div class="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-2xl">
                    🏆
                </div>
            </div>

            <div class="mb-2 flex justify-between text-sm">
                <span>{{ $t('progress.xp_progress') }}</span>
                <span>{{ xp }} / {{ xpToNext }} XP</span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                <div class="bg-blue-500 h-full transition-all duration-500" :style="{ width: xpPercentage + '%' }">
                </div>
            </div>
            <div class="mt-2 text-xs text-gray-500 text-right">
                {{ xpToNext - xp }} {{ $t('progress.to_next_level') }}
            </div>
        </div>

        <!-- Missions Section -->
        <div class="mb-8">
            <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
                <span>📜</span> {{ $t('progress.missions') }}
            </h2>

            <!-- Daily -->
            <div class="mb-4">
                <h3 class="text-sm text-gray-400 uppercase mb-2 font-bold">{{ $t('progress.daily_missions') }}</h3>
                <div class="space-y-3">
                    <div v-for="mission in missions.daily" :key="mission.id"
                        class="bg-gray-800 p-4 rounded-lg border border-gray-700 relative overflow-hidden"
                        :class="{ 'border-green-500': mission.completed }">
                        <div v-if="mission.completed"
                            class="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-bl">
                            {{ $t('progress.completed') }}
                        </div>
                        <div class="flex justify-between items-start mb-2">
                            <div class="font-medium">{{ mission.description }}</div>
                            <div class="text-xs bg-gray-700 px-2 py-1 rounded text-yellow-300">
                                +{{ mission.rewards.xp }} XP
                            </div>
                        </div>
                        <div class="w-full bg-gray-700 rounded-full h-2">
                            <div class="bg-green-500 h-full transition-all duration-500"
                                :style="{ width: Math.min(100, (mission.progress / mission.condition.count) * 100) + '%' }">
                            </div>
                        </div>
                        <div class="mt-1 text-xs text-right text-gray-400">
                            {{ mission.progress }} / {{ mission.condition.count }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Weekly -->
            <div>
                <h3 class="text-sm text-gray-400 uppercase mb-2 font-bold">Weekly Missions</h3>
                <div class="space-y-3">
                    <div v-for="mission in missions.weekly" :key="mission.id"
                        class="bg-gray-800 p-4 rounded-lg border border-gray-700 relative overflow-hidden"
                        :class="{ 'border-purple-500': mission.completed }">
                        <div v-if="mission.completed"
                            class="absolute top-0 right-0 bg-purple-500 text-white text-xs px-2 py-1 rounded-bl">
                            COMPLETED
                        </div>
                        <div class="flex justify-between items-start mb-2">
                            <div class="font-medium">{{ mission.description }}</div>
                            <div class="text-xs bg-gray-700 px-2 py-1 rounded text-yellow-300">
                                +{{ mission.rewards.xp }} XP
                            </div>
                        </div>
                        <div class="w-full bg-gray-700 rounded-full h-2">
                            <div class="bg-purple-500 h-full transition-all duration-500"
                                :style="{ width: Math.min(100, (mission.progress / mission.condition.count) * 100) + '%' }">
                            </div>
                        </div>
                        <div class="mt-1 text-xs text-right text-gray-400">
                            {{ mission.progress }} / {{ mission.condition.count }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Achievements Section -->
        <div>
            <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
                <span>🏅</span> Achievements
            </h2>
            <div class="grid grid-cols-1 gap-4">
                <div v-for="achievement in allAchievements" :key="achievement.id"
                    class="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center gap-4"
                    :class="{ 'opacity-60': !isUnlocked(achievement.id), 'border-yellow-500 bg-gray-750': isUnlocked(achievement.id) }">
                    <div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                        :class="isUnlocked(achievement.id) ? 'bg-yellow-500 text-white' : 'bg-gray-700 text-gray-500'">
                        {{ isUnlocked(achievement.id) ? '✓' : '🔒' }}
                    </div>
                    <div class="flex-1">
                        <div class="font-bold" :class="isUnlocked(achievement.id) ? 'text-white' : 'text-gray-400'">
                            {{ achievement.name }}
                        </div>
                        <div class="text-sm text-gray-400">{{ achievement.description }}</div>

                        <!-- Progress Bar for incremental achievements -->
                        <div v-if="!isUnlocked(achievement.id) && achievement.condition.count" class="mt-2">
                            <div class="w-full bg-gray-700 rounded-full h-1.5">
                                <div class="bg-yellow-600 h-full"
                                    :style="{ width: Math.min(100, (getProgress(achievement.id) / achievement.condition.count) * 100) + '%' }">
                                </div>
                            </div>
                            <div class="text-xs text-right text-gray-500 mt-0.5">
                                {{ getProgress(achievement.id) }} / {{ achievement.condition.count }}
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

export default {
    name: 'ProgressScreen',
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
