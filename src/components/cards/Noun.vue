<template>
  <div
    class="w-full h-full bg-gray-900 flex flex-wrap content-between relative"
  >
    <div
      class="w-full m-2 p-1 bg-white rounded-lg border-1 border-gray-700 relative text-sxs md:text-sm"
    >
      {{ card.singular.text }}
      <span class="absolute right-0 mr-1">{{ card.singular.point }}</span>
    </div>
    <div class="flex w-full my-3">
      <div class="w-4 h-full">
        <div
          class="h-1/3"
          :class="cardColors[card]"
          v-for="(card, index) in card.previousCards"
          :key="'previousCards-' + index"
        ></div>
      </div>
      <!-- previous card colors -->
      <div
        class="w-full -mx-1 bg-white rounded-lg border-1 border-gray-700 relative"
      >
        <div class="relative text-sxs md:text-sm">
          {{ card.plural.text }}
          <span class="absolute right-0 mr-1">{{ card.plural.point }}</span>
        </div>
        <!-- plural -->

        <div class="border-t-1 border-gray-700 text-sxs md:text-sm flex">
          <div
            class="w-1/4 border-r-1 border-gray-800 flex items-center justify-center"
          >
            {{ card.id }}
          </div>
          <div
            class="relative w-3/4 flex items-center pl-1 pr-2 py-1 leading-3"
          >
            {{ card.bonusPoint.word.join("/ ") }}
            <span class="absolute right-0 mr-1"
              >+{{ card.bonusPoint.point }}</span
            >
          </div>
        </div>
        <!-- bonus point -->
      </div>

      <div class="w-4 h-full">
        <div
          class="h-1/3"
          :class="cardColors[card]"
          v-for="(card, index) in card.nextCards"
          :key="'nextCards-' + index"
        ></div>
      </div>
      <!-- next card colors -->
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
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
    }),
  },
};
</script>
