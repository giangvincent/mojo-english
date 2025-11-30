<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
        <div
            class="bg-gray-800 rounded-xl p-8 max-w-md w-full text-center border-4 border-yellow-500 shadow-2xl relative overflow-hidden">
            <!-- Confetti/Sparkle Effect (CSS based placeholder) -->
            <div class="absolute inset-0 pointer-events-none overflow-hidden">
                <div class="animate-pulse absolute top-0 left-0 w-full h-full bg-yellow-500 opacity-10"></div>
            </div>

            <h2 class="text-4xl font-bold text-yellow-400 mb-4 animate-bounce">LEVEL UP!</h2>

            <div class="relative inline-block mb-6">
                <div
                    class="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-red-500 flex items-center justify-center text-5xl font-bold text-white shadow-lg mx-auto">
                    {{ level }}
                </div>
                <div
                    class="absolute -bottom-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full border border-white">
                    New!
                </div>
            </div>

            <p class="text-gray-300 mb-6">Congratulations! You've reached Level {{ level }}!</p>

            <div v-if="unlocks && unlocks.length > 0" class="mb-6">
                <h3 class="text-xl font-bold text-white mb-3">Unlocked Rewards:</h3>
                <div class="space-y-2">
                    <div v-for="(unlock, index) in unlocks" :key="index"
                        class="bg-gray-700 p-3 rounded-lg flex items-center gap-3 border border-gray-600 transform hover:scale-105 transition-transform">
                        <div class="text-2xl">
                            <span v-if="unlock.category === 'themes'">🎨</span>
                            <span v-else-if="unlock.category === 'sets'">🎴</span>
                            <span v-else-if="unlock.category === 'tenses'">📖</span>
                            <span v-else-if="unlock.category === 'cosmetics'">🎭</span>
                            <span v-else>🎁</span>
                        </div>
                        <div class="text-left">
                            <div class="font-bold text-white">{{ unlock.item }}</div>
                            <div class="text-xs text-gray-400 uppercase">{{ unlock.category }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <button @click="$emit('close')"
                class="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition hover:-translate-y-1">
                Continue
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LevelUpModal',
    props: {
        level: {
            type: Number,
            required: true
        },
        unlocks: {
            type: Array,
            default: () => []
        }
    },
    emits: ['close']
}
</script>
