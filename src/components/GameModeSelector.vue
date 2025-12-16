<template>
    <div class="fixed inset-0 pixel-bg z-50 flex flex-col items-center justify-center text-slate-900 p-4">
        <h1 class="pixel-panel px-6 py-3 text-2xl md:text-3xl font-bold mb-8">{{ $t('common.select_mode') }}</h1>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            <!-- Standard Mode -->
            <div class="pixel-panel p-6 cursor-pointer transition-transform hover:-translate-y-1"
                @click="selectMode('standard')">
                <div class="text-5xl mb-4 text-center">🃏</div>
                <h2 class="text-2xl font-bold mb-2 text-center">{{ $t('modes.standard') }}</h2>
                <p class="text-slate-700 text-sm mb-4">{{ $t('home.mode_standard_body') }}</p>
                <ul class="text-sm text-slate-700 list-disc list-inside">
                    <li>{{ $t('home.pill_hand') }}</li>
                    <li>{{ $t('home.rounds_sprint') }}</li>
                    <li>+5</li>
                </ul>
            </div>

            <!-- 5/4 Split Mode -->
            <div class="pixel-panel p-6 cursor-pointer transition-transform hover:-translate-y-1"
                @click="selectMode('5-4-split')">
                <div class="text-5xl mb-4 text-center">🧩</div>
                <h2 class="text-2xl font-bold mb-2 text-center">{{ $t('modes.5-4-split') }}</h2>
                <p class="text-slate-700 text-sm mb-4">{{ $t('home.mode_split_body') }}</p>
                <ul class="text-sm text-slate-700 list-disc list-inside">
                    <li>{{ $t('home.pill_shared') }}</li>
                    <li>{{ $t('playing.shared_cards') }}</li>
                </ul>
            </div>

            <!-- Co-op Mode -->
            <div class="pixel-panel p-6 cursor-pointer transition-transform hover:-translate-y-1"
                @click="selectMode('coop')">
                <div class="text-5xl mb-4 text-center">🤝</div>
                <h2 class="text-2xl font-bold mb-2 text-center">{{ $t('modes.coop') }}</h2>
                <p class="text-slate-700 text-sm mb-4">{{ $t('home.mode_coop_body') }}</p>
            </div>
        </div>

        <button class="mt-12 pixel-btn ghost"
            @click="$router.push('/')">
            {{ $t('game_over.home') }}
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
