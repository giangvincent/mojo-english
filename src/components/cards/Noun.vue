<template>
  <div
    class="w-full h-full bg-gray-900 flex flex-wrap content-between relative bg-cover bg-no-repeat"
    :style="{ 'background-image': 'url(assets/images/' + card.image + ')' }"
  >
    <div
      class="w-full m-2 p-1 rounded-lg border-1 border-gray-700 relative"
      :class="{'bg-white': nounType == null || nounType === 'plural', 'bg-gray-500': nounType && nounType === 'singular'}"
      @click="chooseNoun('singular')"
    >
      {{ card.singular.text }}
      <span
        class="absolute right-0 top-0 bg-white w-5 h-5 border-1 border-black rounded-full flex items-center justify-center -m-2 text-sm"
        >+{{ card.singular.point }}</span
      >
    </div>
    <div class="flex w-full m-2">
      <div class="w-full bg-white rounded-lg border-1 border-gray-700 relative">
        <div class="relative p-1 rounded-t-md" :class="{'bg-gray-500': nounType && nounType === 'plural'}" @click="chooseNoun('plural')">
          {{ card.plural.text }}
          <span
            class="absolute right-0 top-0 bg-white w-5 h-5 border-1 border-black rounded-full flex items-center justify-center -m-2 text-sm"
            >+{{ card.plural.point }}</span
          >
        </div>
        <!-- plural -->

        <div
          class="border-t-1 border-gray-700 flex items-center justify-center rounded-b-md"
          :class="'bg-' + cardColors[card.bonusPoint.type]"
        >
          {{ card.bonusPoint.word.join("/ ") }}
          <span
            class="absolute right-0 bottom-0 bg-white w-5 h-5 border-1 border-black rounded-full flex items-center justify-center -m-2 text-sm"
            >+{{ card.bonusPoint.point }}</span
          >
        </div>
        <!-- bonus point -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  name: "noun",
  props: {
    card: Object,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      cardColors: (state) => state.playing.cardColors,
      nounPhrase: (state) => state.playing.nounPhrase,
      nounType: (state) => state.playing.nounType,
      playingStep: (state) => state.playing.playingStep,
    }),
  },
  methods: {
    ...mapMutations(["setNounPhrase", "setNounType"]),
    chooseNoun(type) {
      // console.log(this.card[type]);
      if (this.playingStep === "choose-word") {
        this.setNounType(type);
        let nounPhrase = this.card[type];
        nounPhrase.bonus = this.card.bonusPoint
        this.setNounPhrase(this.card[type]);
      }
    },
  },
};
</script>
