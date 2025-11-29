<template>
    <div class="fixed inset-0 bg-gray-900 bg-opacity-95 z-50 flex flex-col items-center justify-center text-white p-4">
        <h1 class="text-4xl font-bold mb-8 text-yellow-400">Select Game Mode</h1>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            <!-- Standard Mode -->
            <div class="bg-gray-800 border-2 border-blue-500 rounded-xl p-6 hover:bg-gray-700 cursor-pointer transition-all transform hover:scale-105"
                @click="selectMode('standard')">
                <div class="text-5xl mb-4 text-center">🃏</div>
                <h2 class="text-2xl font-bold mb-2 text-center text-blue-400">Standard</h2>
                <p class="text-gray-300 text-sm mb-4">
                    Classic 7-card hand. Build the best sentence you can!
                </p>
                <ul class="text-sm text-gray-400 list-disc list-inside">
                    <li>7 Cards Hand</li>
                    <li>3 Rounds</li>
                    <li>+5 Bonus for keeping cards</li>
                </ul>
            </div>

            <!-- 5/4 Split Mode -->
            <div class="bg-gray-800 border-2 border-green-500 rounded-xl p-6 hover:bg-gray-700 cursor-pointer transition-all transform hover:scale-105"
                @click="selectMode('5-4-split')">
                <div class="text-5xl mb-4 text-center">🧩</div>
                <h2 class="text-2xl font-bold mb-2 text-center text-green-400">5/4 Split</h2>
                <p class="text-gray-300 text-sm mb-4">
                    5 cards in hand + 4 shared cards. Must use shared cards!
                </p>
                <ul class="text-sm text-gray-400 list-disc list-inside">
                    <li>5 Cards Hand</li>
                    <li>4 Shared Cards</li>
                    <li>Strategic building</li>
                </ul>
            </div>

            <!-- Co-op Mode -->
            <div class="bg-gray-800 border-2 border-purple-500 rounded-xl p-6 hover:bg-gray-700 cursor-pointer transition-all transform hover:scale-105"
                @click="selectMode('coop')">
                <div class="text-5xl mb-4 text-center">🤝</div>
                <h2 class="text-2xl font-bold mb-2 text-center text-purple-400">Co-op</h2>
                <p class="text-gray-300 text-sm mb-4">
                    Work together to build sentences. No winners or losers.
                </p>
                <ul class="text-sm text-gray-400 list-disc list-inside">
                    <li>Collaborative Play</li>
                    <li>Shared Goal</li>
                    <li>Practice together</li>
                </ul>
            </div>
        </div>

        <button class="mt-12 px-6 py-2 border border-white rounded hover:bg-white hover:text-black transition-colors"
            @click="$router.push('/')">
            Back to Home
        </button>
    </div>
</template>

<script>
export default {
    name: 'game-mode-selector',
    emits: ['select-mode'],
    setup(props, { emit }) {
        const selectMode = (mode) => {
            emit('select-mode', mode)
        }

        return {
            selectMode
        }
    }
}
</script>
