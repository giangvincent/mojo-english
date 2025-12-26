<template>
  <div class="w-full pixel-panel border-b-0 fixed bottom-0 left-0 right-0 z-50 p-2 pb-6">
    <h3 class="text-pix-ink text-xs mb-1 text-center font-bold tracking-widest uppercase">Your Hand</h3>
    <draggable v-model="localHand" group="cards" item-key="id"
      class="flex flex-row flex-nowrap overflow-x-auto gap-4 py-4 px-4 items-center font-pixel"
      style="min-height: 240px; justify-content: flex-start;">
      <template #item="{ element, index }">
        <div class="flex-shrink-0 relative group">
          <CardComponent :card="element" :is-interactive="true" />

          <!-- Discard Button -->
          <DiscardBtn v-if="playingStep === 'arrange-card' && discardCount < 3"
            class="absolute -top-2 -left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            @click="handleDiscard(element.id)" />
        </div>
      </template>
    </draggable>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import draggable from 'vuedraggable';
import CardComponent from './CardComponent.vue';
import DiscardBtn from '@/components/cards/Buttons/DiscardBtn.vue';
import ReplaceBtn from '@/components/cards/Buttons/ReplaceBtn.vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'HandComponent',
  components: { draggable, CardComponent, DiscardBtn, ReplaceBtn },
  setup() {
    const store = useStore();

    // Two-way binding helper for Vuex state
    const localHand = computed({
      get: () => store.state.playing.hand,
      set: (val) => store.commit('setHand', val)
    });

    const playingStep = computed(() => store.state.playing.playingStep);
    const discardCount = computed(() => store.state.playing.discardCount || 0);

    const handleDiscard = (cardId) => {
      store.dispatch('discardCard', cardId);
    };

    const handleReplace = (card) => {
      store.dispatch('replaceCard', card);
    };

    return {
      localHand,
      playingStep,
      discardCount,
      handleDiscard,
      handleReplace
    };
  }
});
</script>

<style scoped>
/* Custom scrollbar for the hand */
::-webkit-scrollbar {
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--pix-paper-2);
}

::-webkit-scrollbar-thumb {
  background: var(--pix-ink);
  border: 2px solid var(--pix-paper);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--pix-primary);
}
</style>
