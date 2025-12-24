<template>
  <div class="w-full bg-blue-50 p-4 rounded-xl min-h-[200px] border-2 border-dashed border-blue-200">
     <h3 class="text-gray-500 text-sm mb-2 text-center">Sentence Builder (Drag cards here)</h3>

     <draggable
        v-model="sentence"
        group="cards"
        item-key="id"
        class="flex flex-wrap gap-2 justify-center items-center min-h-[160px]"
        @change="validate"
     >
        <template #item="{ element, index }">
           <div class="relative">
             <!-- Connector Line (Left) -->
             <div v-if="index > 0" class="absolute top-1/2 -left-3 w-4 h-1 bg-gray-300 transform -translate-y-1/2 z-0"></div>

             <CardComponent
                :card="element"
                :is-interactive="true"
                @selection-change="handleSelectionChange"
             />

             <!-- Validation Indicator -->
             <div v-if="validationErrors[index]" class="absolute -bottom-6 left-0 right-0 text-center">
                <span class="text-xs text-red-500 bg-white px-1 rounded shadow">Invalid</span>
             </div>
           </div>
        </template>
     </draggable>

     <div class="mt-4 flex justify-between items-center">
        <div class="text-sm">
            Points: <span class="font-bold text-green-600">{{ score.totalPoints }}</span>
        </div>
        <button class="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700" @click="$emit('play', sentence)">
            Play Sentence
        </button>
     </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import draggable from 'vuedraggable';
import CardComponent from './CardComponent.vue';
import { validateConnection } from '@/utils/grammarEngine';
import { calculateScore } from '@/utils/scoringEngine';

export default defineComponent({
  name: 'TableArea',
  components: { draggable, CardComponent },
  setup(props, { emit }) {
    const sentence = ref([]);
    const validationErrors = ref({});
    const score = ref({ totalPoints: 0 });

    const handleSelectionChange = (payload) => {
        const cardIndex = sentence.value.findIndex(c => c.id === payload.id);
        if (cardIndex !== -1) {
            // Update the specific card instance in the sentence array
            // This ensures the scoring engine sees the user's choice (singular/plural points)
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
            if (index === 0) return; // First card always "valid" relative to nothing

            const prev = sentence.value[index - 1];
            if (!validateConnection(prev, card)) {
                errors[index] = true;
                isValidSequence = false;
            }
        });

        validationErrors.value = errors;

        // Calculate score live
        score.value = calculateScore(sentence.value);

        emit('update:sentence', sentence.value);
    };

    watch(sentence, validate, { deep: true });

    return {
        sentence,
        validationErrors,
        score,
        validate,
        handleSelectionChange
    };
  }
});
</script>
