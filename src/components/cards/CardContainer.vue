<template>
  <div class="my-1 mx-2 bg-gray-300 rounded-md border-1 border-white overflow-hidden h-full relative flex"
    :style="{ width: cardWidth + 'px' }">
    <!-- Left Color Bar -->
    <div class="w-2 h-full" :class="getBarColor(card.type)"></div>

    <div class="flex-1 flex flex-col h-full relative overflow-hidden">
      <div v-if="!canChooseWord" class="absolute w-full h-full top-0 left-0 bottom-0 right-0 z-50"></div>

      <!-- Header: Reference Code -->
      <div class="w-full bg-gray-200 text-xs px-1 flex justify-between items-center h-4">
        <span class="font-bold text-gray-700">{{ card.id }}</span>
      </div>

      <!-- Card Body -->
      <div class="flex-1 relative overflow-hidden">
        <component :card="card" v-bind:is="card.type"></component>
      </div>

      <!-- Footer: Symbols -->
      <div class="bg-gray-200 h-4 w-full">
        <card-symbols :card="card" />
      </div>
    </div>

    <!-- Right Color Bar -->
    <div class="w-2 h-full" :class="getBarColor(card.type)"></div>
  </div>
</template>

<script>
import { computed, defineAsyncComponent } from 'vue'

export default {
  name: 'card-container',
  props: {
    canChooseWord: {
      type: Boolean,
      default: true
    },
    card: {
      type: Object,
      required: true
    },
    cardHeight: {
      type: Number,
      required: true
    }
  },
  components: {
    Noun: defineAsyncComponent(() => import('@/components/cards/Noun.vue')),
    Location: defineAsyncComponent(() => import('@/components/cards/Location.vue')),
    TimeCard: defineAsyncComponent(() => import('@/components/cards/TimeCard.vue')),

    Verb: defineAsyncComponent(() => import('@/components/cards/Verb.vue')),
    HelpingVerb: defineAsyncComponent(() => import('@/components/cards/HelpingVerb.vue')),

    Conj: defineAsyncComponent(() => import('@/components/cards/Conj.vue')),
    Prep: defineAsyncComponent(() => import('@/components/cards/Prep.vue')),
    Adj: defineAsyncComponent(() => import('@/components/cards/Adj.vue')),
    Adverb: defineAsyncComponent(() => import('@/components/cards/Adverb.vue')),

    ExtraInformation: defineAsyncComponent(() => import('@/components/cards/ExtraInformation.vue')),
    CardSymbols: defineAsyncComponent(() => import('@/components/cards/CardSymbols.vue'))
  },
  setup(props) {
    const cardWidth = computed(() => (props.cardHeight - 32) / 1.612)

    const getBarColor = (type) => {
      const colors = {
        Noun: 'bg-white',
        Verb: 'bg-green-700',
        TimeCard: 'bg-orange-700',
        Location: 'bg-white',
        Prep: 'bg-red-700',
        Adj: 'bg-purple-700',
        Adverb: 'bg-pink-700',
        HelpingVerb: 'bg-blue-700',
        ExtraInformation: 'bg-yellow-700',
        Conj: 'bg-white'
      }
      return colors[type] || 'bg-gray-400'
    }

    return {
      cardWidth,
      getBarColor
    }
  }
}
</script>
