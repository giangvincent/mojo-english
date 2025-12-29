<template>
  <div class="w-full bg-blue-50 p-4 rounded-xl min-h-[200px] border-2 border-dashed border-blue-200">
    <h3 class="text-gray-500 text-sm mb-2 text-center" v-if="!isLocked && !waitingForOthers">Sentence Builder (Drag cards here)</h3>

    <div v-if="waitingForOthers" class="flex flex-col items-center justify-center min-h-[160px]">
        <div class="animate-pulse text-xl font-bold text-pix-primary mb-2">Submitted!</div>
        <p class="text-gray-500">Waiting for other players...</p>
        <!-- Optional: Show hidden/miniature version of their submitted sentence here -->
    </div>

    <div v-else-if="isLocked" class="text-center mb-4">
      <h3 class="text-gray-500 text-sm mb-1">Final Sentence Preview</h3>
      <div
        class="pixel-panel p-3 bg-white text-lg font-bold text-pix-primary min-h-[3rem] flex items-center justify-center">
        {{ sentenceText || '...' }}
      </div>
    </div>

    <draggable v-if="!waitingForOthers" v-model="sentence" group="cards" item-key="id" :disabled="isLocked"
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

    <div v-if="!waitingForOthers" class="mt-4 flex justify-between items-center">
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
import { useStore } from 'vuex';
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
    },
    round: {
      type: Number,
      default: 1
    }
  },
  setup(props, { emit }) {
    const store = useStore();
    const sentence = ref([]);
    const validationErrors = ref({});
    const score = ref({ totalPoints: 0 });

    const isLocked = computed(() => {
      return props.playingStep !== 'arrange-card';
    });

    const waitingForOthers = computed(() => {
        return store.state.playing.roundPhase === 'waiting';
    });

    const sentenceText = computed(() => {
      return sentence.value.map(c => {
        // Prefer selected text, then content text, then fallback
        if (c.selectedText) return c.selectedText;
        if (c.word) return c.word; // Simple cards
        // Legacy complex structures
        if (c.singular && c.singular.text) return c.singular.text;
        return '...';
      }).join(' ');
    });

    const handleSelectionChange = (payload) => {
      // Only allow selection changes if locked (or if logic permits interactions during arrange, but usually choose-word is for this)
      // PlayGround allows toggling synonyms etc during choose-word step.
      if (!isLocked.value) return;

      console.log(payload)

      const cardIndex = sentence.value.findIndex(c => c.id === payload.id);
      if (cardIndex !== -1) {
        // Update the specific card instance in the sentence array
        sentence.value[cardIndex].selectedPoint = payload.point;
        sentence.value[cardIndex].selectedText = payload.text;

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

    watch(() => props.round, () => {
      // Reset sentence when round changes
      sentence.value = [];
      validationErrors.value = {};
      score.value = { totalPoints: 0 };
    });

    return {
      sentence,
      validationErrors,
      score,
      validate,
      handleSelectionChange,
      isLocked,
      sentenceText
    };
  }
});
</script>
