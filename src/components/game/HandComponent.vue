<template>
  <div class="w-full bg-gray-100 p-4 rounded-t-xl fixed bottom-0 left-0 right-0 z-50 shadow-up">
     <h3 class="text-gray-500 text-xs mb-1 text-center">Your Hand</h3>
     <draggable
        v-model="localHand"
        group="cards"
        item-key="id"
        class="flex flex-nowrap overflow-x-auto gap-2 py-2 px-4 justify-center"
     >
        <template #item="{ element }">
           <CardComponent :card="element" :is-interactive="true" />
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
  name: 'HandComponent',
  components: { draggable, CardComponent },
  setup() {
    const store = useStore();

    // Two-way binding helper for Vuex state
    const localHand = computed({
        get: () => store.state.hand,
        set: (val) => store.commit('setHand', val)
    });

    return { localHand };
  }
});
</script>

<style scoped>
.shadow-up {
    box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
}
</style>
