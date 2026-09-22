<template>
  <div class="pixel-card card-font my-1 mx-2 overflow-hidden h-full relative flex"
    :style="{ width: cardWidth + 'px' }">
    <!-- Left Color Bar -->
    <div class="w-2 h-full" :class="getBarColor(card.type)"></div>

    <div class="flex-1 flex flex-col h-full relative overflow-hidden">
      <div v-if="!canChooseWord" class="absolute w-full h-full top-0 left-0 bottom-0 right-0 z-50"></div>

      <!-- Header: Reference Code -->
      <div class="w-full bg-slate-200 text-[10px] px-1 flex justify-between items-center h-5 border-b-2 border-black">
        <span class="font-bold text-gray-700">{{ card.id }}</span>
      </div>

      <!-- Card Body -->
      <div class="flex-1 relative overflow-hidden bg-cover bg-center bg-no-repeat" :style="backgroundStyle">
        <component :card="card" v-bind:is="card.type"></component>
      </div>

      <!-- Footer: Symbols -->
      <div class="bg-slate-200 h-5 w-full border-t-2 border-black">
        <card-symbols :card="card" />
      </div>
    </div>

    <!-- Right Color Bar -->
    <div class="w-2 h-full" :class="getBarColor(card.type)"></div>
  </div>
</template>

<script>
import { computed, defineAsyncComponent } from 'vue'
import { getCardBackgroundStyle } from '@/utils/cardImageMapper'

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
    CardSymbols: defineAsyncComponent(() => import('@/components/cards/CardSymbols.vue')),
    WildCard: defineAsyncComponent(() => import('@/components/cards/WildCard.vue')),
    Wild: defineAsyncComponent(() => import('@/components/cards/WildCard.vue'))
  },
  setup(props) {
    const cardWidth = computed(() => (props.cardHeight - 32) / 1.612)

    // Dynamic import to avoid issues if file doesn't exist yet in some environments
    const backgroundStyle = computed(() => {
      try {
        return getCardBackgroundStyle(props.card.id)
      } catch (_e) {
        return {}
      }
    })

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
        Conj: 'bg-white',
        WildCard: 'bg-gray-500',
        Wild: 'bg-gray-500'
      }
      return colors[type] || 'bg-gray-400'
    }

    return {
      cardWidth,
      getBarColor,
      backgroundStyle
    }
  }
}
</script>
