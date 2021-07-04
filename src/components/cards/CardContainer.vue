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
export default {
  name: 'card-container',
  props: {
    canChooseWord: Boolean,
    card: Object,
    cardHeight: Number
  },
  components: {
    Noun: () => import('@/components/cards/Noun.vue'),
    Location: () => import('@/components/cards/Location.vue'),
    TimeCard: () => import('@/components/cards/TimeCard.vue'),

    Verb: () => import('@/components/cards/Verb.vue'),
    HelpingVerb: () => import('@/components/cards/HelpingVerb.vue'),

    Conj: () => import('@/components/cards/Conj.vue'),
    Prep: () => import('@/components/cards/Prep.vue'),
    Adj: () => import('@/components/cards/Adj.vue'),
    Adverb: () => import('@/components/cards/Adverb.vue'),

    ExtraInformation: () => import('@/components/cards/ExtraInformation.vue')
  },
  data () {
    return {
      cardWidth: 0
    }
  },
  created () {
    this.cardWidth = (this.cardHeight - 32) / 1.612
  },
  mounted () {},
  methods: {}
}
</script>
