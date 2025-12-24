<template>
  <div class="min-h-screen bg-gray-50 flex flex-col p-4 pb-40">
    <!-- Header / Stats -->
    <div class="flex justify-between items-center mb-4">
        <div>
            <h1 class="text-xl font-bold text-gray-800">VerbaPix Game</h1>
            <div class="text-sm text-gray-500">Mode: {{ gameMode }} | Round: {{ round }}</div>
        </div>
        <div class="text-right">
             <button @click="nextRound" class="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300">
                Advance Round (Debug)
             </button>
        </div>
    </div>

    <!-- Community Pool (Only for Split 5/4 or if needed) -->
    <div v-if="gameMode === '5-4-split'" class="mb-4">
        <CommunityPool />
    </div>

    <!-- Table Area (Sentence Builder) -->
    <TableArea @play="handlePlaySentence" />

    <!-- Discard Area (Placeholder) -->
    <div class="mt-8 text-center text-gray-400 border-2 border-dashed border-gray-300 rounded p-4">
        Discard Area (Drag here to discard)
    </div>

    <!-- Hand Component -->
    <HandComponent />

    <!-- Loading State -->
    <div v-if="loading" class="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        <div class="text-xl font-bold animate-pulse">Loading Deck...</div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import HandComponent from '@/components/game/HandComponent.vue';
import TableArea from '@/components/game/TableArea.vue';
import CommunityPool from '@/components/game/CommunityPool.vue';

export default defineComponent({
  name: 'VerbaGame',
  components: { HandComponent, TableArea, CommunityPool },
  setup() {
    const store = useStore();
    const loading = ref(true);

    const gameMode = computed(() => store.state.gameMode);
    const round = computed(() => store.state.currentRound);

    onMounted(async () => {
        // Initialize Game (Standard by default for now, or fetch from route params)
        await store.dispatch('initializeGame', '5-4-split'); // Testing the complex mode
        loading.value = false;
    });

    const nextRound = () => {
        store.dispatch('advanceRound');
    };

    const handlePlaySentence = (sentence) => {
        console.log("Playing Sentence:", sentence);
        // Dispatch action to finalize turn, score, etc.
        // store.dispatch('completeTurn', sentence);
        alert(`Played sentence with ${sentence.length} cards!`);
    };

    return {
        gameMode,
        round,
        loading,
        nextRound,
        handlePlaySentence
    };
  }
});
</script>
