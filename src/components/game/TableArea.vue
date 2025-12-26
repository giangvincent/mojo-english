<template>
  <div class="w-full bg-blue-50 p-4 rounded-xl min-h-[200px] border-2 border-dashed border-blue-200">
    <h3 class="text-gray-500 text-sm mb-2 text-center" v-if="!isLocked">Sentence Builder (Drag cards here)</h3>
    <h3 class="text-gray-500 text-sm mb-2 text-center" v-else>Choose Words & Adjust Sentence</h3>

    <draggable v-model="sentence" group="cards" item-key="id" :disabled="isLocked"
      class="flex flex-wrap gap-3 justify-center items-center min-h-[160px] font-pixel" @change="validate">
      <template #item="{ element, index }">
        <div class="relative">
          <CardComponent :card="element" :is-interactive="isLocked" @selection-change="handleSelectionChange" />

          <!-- Validation Indicator -->
          <div v-if="validationErrors[index]" class="absolute -bottom-6 left-0 right-0 text-center">
            <span class="text-xs text-red-500 bg-white px-1 rounded shadow">Invalid</span>
          </div>
        </div>
      </template>
    </draggable>

    <div class="mt-4 flex justify-between items-center">
      <div class="pixel-card px-2">
        Points: <span class="font-bold text-green-600">{{ score.totalPoints }}</span>
      </div>

      <!-- Button Logic -->
      <button v-if="!isLocked" class="pixel-btn pixel-chip primary" @click="$emit('lock')">
        Confirm Position
      </button>
      <button v-else class="pixel-btn pixel-chip success" @click="$emit('play', sentence)">
        Submit Sentence
      </button>

    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch, computed } from 'vue';
import draggable from 'vuedraggable';
import CardComponent from './CardComponent.vue';
import { validateConnection } from '@/utils/grammarEngine';
import { calculateScore } from '@/utils/scoringEngine';

export default defineComponent({
  name: 'TableArea',
  components: { draggable, CardComponent },
  props: {
    playingStep: {
      type: String,
      default: 'arrange-card'
    }
  },
  setup(props, { emit }) {
    const sentence = ref([]);
    const validationErrors = ref({});
    const score = ref({ totalPoints: 0 });

    const isLocked = computed(() => {
      return props.playingStep !== 'arrange-card';
    });

    const handleSelectionChange = (payload) => {
      // Only allow selection changes if locked (or if logic permits interactions during arrange, but usually choose-word is for this)
      // PlayGround allows toggling synonyms etc during choose-word step.
      if (!isLocked.value) return;

      const cardIndex = sentence.value.findIndex(c => c.id === payload.id);
      if (cardIndex !== -1) {
        // Update the specific card instance in the sentence array
        sentence.value[cardIndex].selectedPoint = payload.content.point;
        sentence.value[cardIndex].selectedText = payload.content.text;

        // Re-validate and score
        validate();
      }
    };

    const validate = () => {
      const errors = {};
      let isValidSequence = true;

      sentence.value.forEach((card, index) => {
        if (index === 0) return;

        const prev = sentence.value[index - 1];
        if (!validateConnection(prev, card)) {
          errors[index] = true;
          isValidSequence = false;
        }
      });

      validationErrors.value = errors;
      score.value = calculateScore(sentence.value);
      emit('update:sentence', sentence.value);
    };

    watch(sentence, validate, { deep: true });

    return {
      sentence,
      validationErrors,
      score,
      validate,
      handleSelectionChange,
      isLocked
    };
  }
});
</script>
