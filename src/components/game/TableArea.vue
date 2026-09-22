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

    <div v-if="sentencePrefix.length" class="flex flex-wrap gap-2 justify-center mb-3">
      <CardComponent v-for="card in sentencePrefix" :key="`prefix-${card.id}`" :card="card"
        :is-interactive="false" class="opacity-75" />
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
      <button v-if="!isLocked" class="pixel-btn pixel-chip primary" :disabled="!sentenceValid"
        :title="sentenceValid ? '' : 'Fix invalid cards before locking'" @click="$emit('lock')">
        Confirm Position
      </button>
      <button v-else class="pixel-btn pixel-chip success" @click="$emit('play', combinedSentence)">
        Submit Sentence
      </button>
      <span v-if="!sentenceValid" class="text-xs text-red-500 ml-2">
        {{ invalidReason }}
      </span>

    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch, computed } from 'vue';
import draggable from 'vuedraggable';
import CardComponent from './CardComponent.vue';
import { validateSentence } from '@/utils/grammarEngine';
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
    },
    gameMode: {
      type: String,
      default: 'standard'
    },
    handSizeAtStart: {
      type: Number,
      default: 7
    },
    sentencePrefix: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {
    const sentence = ref([]);
    const validationErrors = ref({});
    const score = ref({ totalPoints: 0 });

    const isLocked = computed(() => {
      return props.playingStep !== 'arrange-card';
    });

    const waitingForOthers = computed(() => props.playingStep === 'waiting');
    const combinedSentence = computed(() => [...props.sentencePrefix, ...sentence.value]);

    const sentenceText = computed(() => {
      return combinedSentence.value.map(c => {
        // Prefer selected text, then content text, then fallback
        if (c.selectedText) return c.selectedText;
        if (c.word) return c.word; // Simple cards
        // Legacy complex structures
        if (c.singular && c.singular.text) return c.singular.text;
        return '...';
      }).join(' ');
    });

    const handleSelectionChange = (payload) => {
      // Only allow selection changes while locked.
      if (!isLocked.value) return;

      console.log(payload)

      const cardIndex = sentence.value.findIndex(c => c.id === payload.id);
      if (cardIndex !== -1) {
        // Update the specific card instance in the sentence array
        const card = sentence.value[cardIndex];
        card.selectedPoint = payload.point;
        card.selectedText = payload.text;
        // Engine contract (T5): number from noun faces, tense from verb/time faces
        if (payload.subType === 'singular' || payload.subType === 'plural') {
          card.selectedNumber = payload.subType;
        }
        if (typeof payload.tense === 'string') {
          card.selectedTense = payload.tense;
        }
        if (Array.isArray(payload.condition)) {
          card.selectedConditions = [...payload.condition];
        }

        // Re-validate and score
        validate();
      }
    };

    const sentenceValid = computed(() => {
      if (props.gameMode === 'coop' && sentence.value.length !== 1) return false;
      return validateSentence(combinedSentence.value, props.gameMode).valid;
    });
    const invalidReason = computed(() => {
      if (props.gameMode === 'coop' && sentence.value.length !== 1) return 'Add exactly one card this turn';
      const result = validateSentence(combinedSentence.value, props.gameMode);
      const count = Object.keys(result.errors).length;
      return count ? `${count} invalid card(s)` : '';
    });

    const validate = () => {
      const result = validateSentence(combinedSentence.value, props.gameMode);
      const errors = {};
      Object.entries(result.errors).forEach(([idx, msgs]) => {
        const localIndex = Number(idx) - props.sentencePrefix.length;
        if (localIndex >= 0) errors[localIndex] = msgs;
      });

      validationErrors.value = errors;
      score.value = calculateScore(combinedSentence.value, props.handSizeAtStart);
      emit('update:sentence', combinedSentence.value);
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
      combinedSentence,
      validationErrors,
      score,
      validate,
      handleSelectionChange,
      isLocked,
      sentenceText,
      sentenceValid,
      invalidReason,
      waitingForOthers
    };
  }
});
</script>
