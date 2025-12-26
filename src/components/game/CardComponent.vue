<template>
  <div
    class="relative w-40 h-56 pixel-card flex flex-col overflow-hidden select-none transition-transform hover:scale-105 p-1 font-pixel"
    :class="{ 'ring-4 ring-retro-primary': isSelected, 'opacity-50': isUsed }">
    <!-- Render specific card component based on type -->
    <component :is="componentName" v-if="componentName" :card="card" :cardHeight="224" :canChooseWord="isInteractive"
      @choose="handleChoice" @changeCard="handleChangeCard" class="w-full h-full" />

    <!-- Fallback for unknown types -->
    <div v-else class="w-full h-full flex items-center justify-center bg-gray-200">
      <span class="text-xs text-red-500">Unknown Type: {{ card.type }}</span>
    </div>

    <!-- Replace Button (Integrated here per user request for swapping logic) -->
    <!-- Assuming ReplaceBtn logic needs to be aware of the context.
         Legacy ReplaceBtn emits 'changeCard'. We forward this event. -->
    <!-- Note: Legacy ReplaceBtn was used inside the draggable loop in PlayGround.
         If user wants it inside the card component, we can place it here or keep it external.
         The user said: "buttons generated is not correct... re-use components prepared in components/cards".
         So we should rely on the legacy component's internal structure if possible, OR
         if proper legacy usage requires external buttons, we should support that.

         Looking at PlayGround, ReplaceBtn was a sibling to CardContainer.
         But here CardComponent IS the container.
         Let's assume the legacy specific components (Noun.vue, etc.) handle their own display.
         But ReplaceBtn logic (swapping 0-point cards) is usually external or overlay.
         Let's add it as an overlay if appropriate conditions met.
    -->
    <div v-if="showReplaceBtn" class="absolute top-2 right-2 z-50">
      <ReplaceBtn :cardOb="card" @changeCard="handleChangeCard" />
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, defineAsyncComponent } from 'vue';
import { VerbaCard } from '@/types/verba';

// Async imports for performance and circular dependency avoidance
const Noun = defineAsyncComponent(() => import('@/components/cards/Noun.vue'));
const Verb = defineAsyncComponent(() => import('@/components/cards/Verb.vue'));
const Adj = defineAsyncComponent(() => import('@/components/cards/Adj.vue'));
const Adverb = defineAsyncComponent(() => import('@/components/cards/Adverb.vue'));
const Conj = defineAsyncComponent(() => import('@/components/cards/Conj.vue'));
const Prep = defineAsyncComponent(() => import('@/components/cards/Prep.vue'));
const HelpingVerb = defineAsyncComponent(() => import('@/components/cards/HelpingVerb.vue'));
const ExtraInformation = defineAsyncComponent(() => import('@/components/cards/ExtraInformation.vue'));
const TimeCard = defineAsyncComponent(() => import('@/components/cards/TimeCard.vue'));
const Location = defineAsyncComponent(() => import('@/components/cards/Location.vue'));
const WildCard = defineAsyncComponent(() => import('@/components/cards/WildCard.vue'));
const ReplaceBtn = defineAsyncComponent(() => import('@/components/cards/Buttons/ReplaceBtn.vue'));

export default defineComponent({
  name: 'CardComponent',
  components: {
    Noun, Verb, Adj, Adverb, Conj, Prep, HelpingVerb, ExtraInformation, TimeCard, Location, WildCard, ReplaceBtn
  },
  props: {
    card: {
      type: Object as PropType<VerbaCard>,
      required: true
    },
    isInteractive: {
      type: Boolean,
      default: true
    },
    isSelected: Boolean,
    isUsed: Boolean,
    // Add logic to show replace btn? Usually based on zero points or checking logic.
    // For now, let's allow parent to control or base it on card state if possible.
    allowReplace: Boolean
  },
  setup(props, { emit }) {

    const componentName = computed(() => {
      switch (props.card.type) {
        case 'Noun': return 'Noun';
        case 'Verb': return 'Verb';
        case 'Adj': return 'Adj';
        case 'Adverb': return 'Adverb';
        case 'Conj': return 'Conj';
        case 'Prep': return 'Prep';
        case 'HelpingVerb': return 'HelpingVerb';
        case 'ExtraInformation': return 'ExtraInformation';
        case 'TimeCard': return 'TimeCard';
        case 'Location': return 'Location';
        case 'WildCard': return 'WildCard';
        default: return null;
      }
    });

    const handleChoice = (payload: any) => {
      // Legacy components emit 'choose' with various payloads.
      // We normalize this to 'selection-change' for our parent (TableArea)
      // Or specific payload structure.
      emit('selection-change', {
        id: props.card.id,
        ...payload // Pass through the legacy payload (text, point, etc.)
      });
    };

    const handleChangeCard = (payload: any) => {
      emit('changeCard', payload);
    };

    // Logic for showing replace button validation could go here
    const showReplaceBtn = computed(() => {
      // Example: Show if point is 0, or if props.allowReplace is true
      return props.allowReplace || (props.card.point === 0);
    });

    return {
      componentName,
      handleChoice,
      handleChangeCard,
      showReplaceBtn
    };
  }
});
</script>
