<template>
    <div class="fixed inset-0 bg-gray-900 bg-opacity-90 z-50 flex flex-col items-center justify-center text-white p-4">
        <div class="bg-gray-800 border-2 border-blue-500 rounded-xl p-8 max-w-md w-full text-center shadow-2xl">
            <h2 class="text-3xl font-bold mb-6 text-blue-400">Round {{ round }} Complete!</h2>

            <div class="mb-8">
                <p class="text-gray-400 mb-2">Round Score</p>
                <div class="text-5xl font-bold text-green-400 mb-2">+{{ score }}</div>
                <div class="text-sm text-emerald-200 font-bold mb-2">+{{ xpEarned }} XP</div>

                <!-- XP Breakdown -->
                <div class="text-xs text-left bg-gray-700 p-3 rounded space-y-1 mb-4">
                    <div v-if="xpContext.correctSentence" class="flex justify-between text-green-300">
                        <span>Correct Sentence</span><span>+10</span>
                    </div>
                    <div v-if="xpContext.usedAllSeven" class="flex justify-between text-yellow-300">
                        <span>Full 7 Cards</span><span>+5</span>
                    </div>
                    <div v-if="xpContext.correctTense" class="flex justify-between text-blue-300">
                        <span>Correct Tense</span><span>+3</span>
                    </div>
                    <div v-if="xpContext.bonusCombos" class="flex justify-between text-purple-300">
                        <span>Combos ({{ xpContext.bonusCombos }})</span><span>+{{ xpContext.bonusCombos * 5 }}</span>
                    </div>
                    <div v-if="xpContext.penalties" class="flex justify-between text-red-400">
                        <span>Penalties</span><span>-{{ xpContext.penalties }}</span>
                    </div>
                    <div v-if="xpContext.multiplier > 1"
                        class="flex justify-between text-yellow-400 font-bold border-t border-gray-600 pt-1 mt-1">
                        <span>Multiplier</span><span>x{{ xpContext.multiplier }}</span>
                    </div>
                </div>

                <div class="h-px bg-gray-600 w-full my-4"></div>

                <p class="text-gray-400 mb-2">Total Score</p>
                <div class="text-3xl font-bold text-yellow-400 mb-3">{{ totalScore }}</div>

                <div v-if="xpToNext && level" class="mt-3 text-left">
                    <p class="text-xs uppercase text-gray-400 mb-1">XP Progress</p>
                    <XpBar :currentXp="xpCurrent" :xpToNext="xpToNext" :level="level" />
                </div>
            </div>

            <div v-if="winner" class="mb-4 text-left bg-purple-700 bg-opacity-40 p-3 rounded-lg">
                <p class="text-xs text-purple-200 uppercase tracking-wide">Co-op Leader</p>
                <p class="text-lg font-semibold text-purple-100">{{ winner }}</p>
            </div>

            <div class="mb-6 text-left bg-gray-700 p-4 rounded-lg" v-if="sentence">
                <p class="text-xs text-gray-400 mb-1">Your Sentence:</p>
                <p class="text-lg italic">"{{ sentence }}"</p>
            </div>

            <button
                class="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors transform hover:scale-105"
                @click="$emit('next-round')">
                Start Round {{ round + 1 }} ➡️
            </button>
        </div>
    </div>
</template>

<script>
import XpBar from '@/components/ui/XpBar.vue'
export default {
    name: 'round-summary',
    components: { XpBar },
    props: {
        round: {
            type: Number,
            required: true
        },
        score: {
            type: Number,
            required: true
        },
        totalScore: {
            type: Number,
            required: true
        },
        sentence: {
            type: String,
            default: ''
        },
        winner: {
            type: String,
            default: ''
        },
        xpEarned: {
            type: Number,
            default: 0
        },
        xpContext: {
            type: Object,
            default: () => ({})
        },
        xpCurrent: {
            type: Number,
            default: 0
        },
        xpToNext: {
            type: Number,
            default: 0
        },
        level: {
            type: Number,
            default: 1
        }
    },
    emits: ['next-round']
}
</script>
