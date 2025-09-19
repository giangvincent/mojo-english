<template>
  <div
    class="my-1 mx-2 bg-gray-300 rounded-md border-1 border-white overflow-hidden h-full relative"
    :style="{ width: cardWidth + 'px' }"
  >
    <div
      v-if="!canChooseWord"
      class="absolute w-full h-full top-0 left-0 bottom-0 right-0 z-50"
    ></div>
    <component :card="card" v-bind:is="card.type"></component>
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

    ExtraInformation: defineAsyncComponent(() => import('@/components/cards/ExtraInformation.vue'))
  },
  setup (props) {
    const cardWidth = computed(() => (props.cardHeight - 32) / 1.612)

    return {
      cardWidth
    }
  }
}
</script>
