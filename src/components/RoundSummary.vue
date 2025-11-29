<template>
    <div class="fixed inset-0 bg-gray-900 bg-opacity-90 z-50 flex flex-col items-center justify-center text-white p-4">
        <div class="bg-gray-800 border-2 border-blue-500 rounded-xl p-8 max-w-md w-full text-center shadow-2xl">
            <h2 class="text-3xl font-bold mb-6 text-blue-400">Round {{ round }} Complete!</h2>

            <div class="mb-8">
                <p class="text-gray-400 mb-2">Round Score</p>
                <div class="text-5xl font-bold text-green-400 mb-4">+{{ score }}</div>

                <div class="h-px bg-gray-600 w-full my-4"></div>

                <p class="text-gray-400 mb-2">Total Score</p>
                <div class="text-3xl font-bold text-yellow-400">{{ totalScore }}</div>
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
export default {
    name: 'round-summary',
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
        }
    },
    emits: ['next-round']
}
</script>
