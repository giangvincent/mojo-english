<template>
    <div class="fixed inset-0 pixel-bg z-50 flex flex-col items-center justify-center text-slate-900 p-4">
        <h1 class="pixel-panel px-6 py-3 text-2xl md:text-3xl font-bold mb-8">Select Game Mode</h1>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            <!-- Standard Mode -->
            <div class="pixel-panel p-6 cursor-pointer transition-transform hover:-translate-y-1"
                @click="selectMode('standard')">
                <div class="text-5xl mb-4 text-center">🃏</div>
                <h2 class="text-2xl font-bold mb-2 text-center">Standard</h2>
                <p class="text-slate-700 text-sm mb-4">
                    Classic 7-card hand. Build the best sentence you can!
                </p>
                <ul class="text-sm text-slate-700 list-disc list-inside">
                    <li>7 Cards Hand</li>
                    <li>3 Rounds</li>
                    <li>+5 Bonus for keeping cards</li>
                </ul>
            </div>

            <!-- 5/4 Split Mode -->
            <div class="pixel-panel p-6 cursor-pointer transition-transform hover:-translate-y-1"
                @click="selectMode('5-4-split')">
                <div class="text-5xl mb-4 text-center">🧩</div>
                <h2 class="text-2xl font-bold mb-2 text-center">5/4 Split</h2>
                <p class="text-slate-700 text-sm mb-4">
                    5 cards in hand + 4 shared cards. Must use shared cards!
                </p>
                <ul class="text-sm text-slate-700 list-disc list-inside">
                    <li>5 Cards Hand</li>
                    <li>4 Shared Cards</li>
                    <li>Strategic building</li>
                </ul>
            </div>

            <!-- Co-op Mode -->
            <div class="pixel-panel p-6 cursor-pointer transition-transform hover:-translate-y-1"
                @click="selectMode('coop')">
                <div class="text-5xl mb-4 text-center">🤝</div>
                <h2 class="text-2xl font-bold mb-2 text-center">Co-op</h2>
                <p class="text-slate-700 text-sm mb-4">
                    Work together to build sentences. Last card played wins the round.
                </p>
                <ul class="text-sm text-slate-700 list-disc list-inside">
                    <li>Collaborative Play with turn tracking</li>
                    <li>Winner = last player to add a card</li>
                    <li>Practice together</li>
                </ul>
            </div>
        </div>

        <button class="mt-12 pixel-btn ghost"
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
