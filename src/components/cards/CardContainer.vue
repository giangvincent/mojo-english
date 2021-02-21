<template>
  <div
    class="my-1 mx-2 bg-gray-300 rounded-md border-1 border-white overflow-hidden"
  >
    <div class="h-full" :style="{ width: cardWidth + 'px' }">
      <component v-bind:is="card"></component>
    </div>
  </div>
</template>

<script>
export default {
  name: "card-container",
  props: {
    card: String,
    cardHeight: Number,
  },
  components: {
    Noun: () => import("@/components/cards/Noun.vue"),
    Location: () => import("@/components/cards/Location.vue"),
    TimeCard: () => import("@/components/cards/TimeCard.vue"),

    Verb: () => import("@/components/cards/Verb.vue"),
    HelpingVerb: () => import("@/components/cards/HelpingVerb.vue"),

    Conj: () => import("@/components/cards/Conj.vue"),
    Prep: () => import("@/components/cards/Prep.vue"),
    Adj: () => import("@/components/cards/Adj.vue"),
    Adverb: () => import("@/components/cards/Adverb.vue"),
  },
  data() {
    return {
      cardWidth: 0,
    };
  },
  created() {
    this.cardWidth = (this.cardHeight - 32) / 1.612;
  },
  mounted() {},
  methods: {},
};
</script>
