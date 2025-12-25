<template>
   <div class="w-full bg-orange-50 p-2 rounded-lg border-2 border-orange-200 mb-2">
      <h3 class="text-orange-800 text-xs font-bold text-center mb-1">Community Pool</h3>
      <draggable v-model="localCommunity" group="cards" item-key="id" class="flex flex-wrap gap-2 justify-center">
         <template #item="{ element }">
            <CardComponent :card="element" />
         </template>
      </draggable>
   </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import draggable from 'vuedraggable';
import CardComponent from './CardComponent.vue';
import { useStore } from 'vuex';

export default defineComponent({
   name: 'CommunityPool',
   components: { draggable, CardComponent },
   setup() {
      const store = useStore();

      const localCommunity = computed({
         get: () => store.state.playing.communityCards,
         set: (val) => store.commit('setCommunityCards', val)
      });

      return { localCommunity };
   }
});
</script>
