<template>
  <div class="w-full h-full bg-gray-700 text-white flex flex-col items-center justify-center gap-2 p-2">
    <div class="text-sm font-bold uppercase">Wild Card</div>
    <select v-model="selectedType" @change="assignType"
      class="bg-white text-black rounded px-2 py-1 text-xs focus:outline-none">
      <option disabled value="">Choose type</option>
      <option v-for="type in assignableTypes" :key="type" :value="type">{{ type }}</option>
    </select>
    <div v-if="selectedType" class="text-xs text-green-300">
      Assigned as: {{ selectedType }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  card: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['assign'])

const assignableTypes = [
  'Noun',
  'Verb',
  'Adj',
  'Adverb',
  'Location',
  'TimeCard',
  'ExtraInformation',
  'Prep',
  'HelpingVerb',
  'Conj'
]
const selectedType = ref(props.card.assignedType || '')

const assignType = () => {
  props.card.assignedType = selectedType.value
  emit('assign', selectedType.value)
}

watch(() => props.card.assignedType, (val) => {
  if (val && val !== selectedType.value) {
    selectedType.value = val
  }
})
</script>
