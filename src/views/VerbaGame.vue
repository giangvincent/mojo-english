<template>
  <div class="min-h-screen flex flex-col p-4 pb-64 relative pixel-bg">

    <!-- Navigation / Header -->
    <div class="flex items-start justify-between mb-6 sticky top-0 z-40 pt-2">
        <div class="flex flex-col gap-2">
           <button @click="$router.push('/')" class="pixel-btn danger text-xs">
              &lt; EXIT
           </button>
           <div class="pixel-chip bg-retro-paper text-retro-ink mt-2">
              <span class="font-bold">MODE:</span> {{ gameMode }}
           </div>
        </div>

        <div class="flex flex-col items-end gap-2">
            <div class="pixel-chip bg-retro-warning text-retro-ink">
               ROUND {{ round }}
            </div>
             <button @click="nextRound" class="pixel-btn text-xs">
                NEXT ROUND (Debug)
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
    <div class="mt-8 text-center text-retro-ink opacity-50 border-2 border-dashed border-retro-ink p-4 bg-white bg-opacity-20 pixel-border font-mono">
        Discard Area (Drag here to discard)
    </div>

    <!-- Hand Component -->
    <HandComponent />

    <!-- Loading State -->
    <div v-if="loading" class="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <div class="text-xl font-bold animate-pulse text-retro-primary pixel-font">Loading Deck...</div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import HandComponent from '@/components/game/HandComponent.vue';
import TableArea from '@/components/game/TableArea.vue';
import CommunityPool from '@/components/game/CommunityPool.vue';

export default defineComponent({
  name: 'VerbaGame',
  components: { HandComponent, TableArea, CommunityPool },
  setup() {
    const store = useStore();
    const router = useRouter();
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
