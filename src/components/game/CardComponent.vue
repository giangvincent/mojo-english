<template>
  <div
    class="relative w-40 h-56 pixel-card flex flex-col overflow-hidden select-none transition-transform hover:scale-105 p-1"
    :class="{ 'ring-4 ring-retro-primary': isSelected, 'opacity-50': isUsed }">
    <div class="w-full h-full border-2 border-white flex flex-col relative">
      <!-- Header: Points -->
      <div
        class="absolute top-1 right-1 bg-pix-warning text-pix-ink border border-pix-ink w-6 h-6 flex items-center justify-center text-xs font-bold z-10 card-font">
        {{ displayPoints }}
      </div>

      <!-- Image Area -->
      <div class="h-2/3 w-full bg-gray-200 overflow-hidden border-b-2 border-pix-ink">
        <img v-if="card.image" :src="`/assets/images/${card.image}`" class="w-full h-full object-cover pixelated"
          alt="card image" @error="handleImageError" />
        <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-xs card-font">No Image
        </div>
      </div>

      <!-- Content Area -->
      <div class="h-1/3 w-full flex flex-col justify-between p-2 bg-pix-paper border-t-2 border-pix-ink card-font">

        <!-- Text Selection (if multiple choices like singular/plural) -->
        <div v-if="hasChoices" class="flex flex-col gap-1 h-full justify-center">
          <div v-if="card.singular" @click.stop="selectChoice('singular')"
            class="cursor-pointer hover:bg-pix-warning p-1 text-center"
            :class="{ 'font-bold text-pix-ink underline': selectedChoice === 'singular', 'text-gray-600': selectedChoice !== 'singular' }">
            <span class="text-sm uppercase font-bold">{{ card.singular.text }}</span>
          </div>
          <div v-if="card.plural" @click.stop="selectChoice('plural')"
            class="cursor-pointer hover:bg-pix-warning p-1 text-center"
            :class="{ 'font-bold text-pix-ink underline': selectedChoice === 'plural', 'text-gray-600': selectedChoice !== 'plural' }">
            <span class="text-sm uppercase font-bold">{{ card.plural.text }}</span>
          </div>
        </div>
        <div v-else class="text-center flex items-center justify-center h-full">
          <span class="font-bold text-xl text-pix-ink leading-none break-words uppercase">{{ displayContent.text
            }}</span>
        </div>

        <!-- ID / Code -->
        <div class="text-[10px] text-gray-400 font-mono absolute bottom-1 right-1 opacity-50">{{ card.id }}</div>
      </div>

      <!-- Syntax Bars (Bottom) -->
      <!-- Simplified representation: Just a colored bar at the bottom for now -->
      <div class="h-2 w-full" :style="{ backgroundColor: syntaxColor }"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref } from 'vue';
import { VerbaCard, SyntaxColor } from '@/types/verba';

export default defineComponent({
  name: 'CardComponent',
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
    isUsed: Boolean
  },
  setup(props, { emit }) {
    const selectedChoice = ref<'singular' | 'plural'>('singular');

    const hasChoices = computed(() => {
      return !!(props.card.singular && props.card.plural);
    });

    const displayContent = computed(() => {
      if (hasChoices.value) {
        return props.card[selectedChoice.value] || { text: '?', point: 0 };
      }
      // Fallback for Verb content array (simplified: pick first)
      if (props.card.content && props.card.content.length > 0) {
        return props.card.content[0];
      }
      return { text: props.card.type, point: 0 };
    });

    const displayPoints = computed(() => displayContent.value.point);

    const syntaxColor = computed(() => {
      // Map Type to Color
      switch (props.card.type) {
        case 'Noun': return 'purple'; // Standardizing on Purple for Subject/Noun usually?
        // Actually checking states.js:
        // Noun: white (with icon), Adj: purple, Verb: green, Prep: red, Time: orange
        case 'Adj': return 'purple';
        case 'Verb': return 'green';
        case 'Prep': return 'red';
        case 'Time': return 'orange';
        case 'HelpingVerb': return 'blue';
        case 'Adverb': return 'pink';
        case 'ExtraInformation': return 'yellow';
        default: return 'gray';
      }
    });

    const selectChoice = (choice: 'singular' | 'plural') => {
      if (!props.isInteractive) return;
      selectedChoice.value = choice;
      // Emit event to notify parent of selection change
      // We pass the selection details so the parent can update the data object if needed
      const content = props.card[choice];
      if (content) {
        emit('selection-change', {
          id: props.card.id,
          choice,
          content: { ...content, grammaticalNumber: choice } // Merge choice type
        });
      }
    };

    const handleImageError = (e: Event) => {
      (e.target as HTMLImageElement).style.display = 'none';
    };

    return {
      selectedChoice,
      hasChoices,
      displayContent,
      displayPoints,
      syntaxColor,
      selectChoice,
      handleImageError
    };
  }
});
</script>
