<template>
  <div
    class="w-full h-full bg-gray-900 flex flex-wrap content-between relative"
  >
    <div
      class="absolute top-0 right-0 m-1 p-2 bg-white border-1 border-gray-800 w-6 h-6 rounded-md flex items-center justify-center"
    >
      {{ card.point }}
    </div>
    <div class="w-full"></div>
    <div class="flex w-full my-3">
      <div class="w-4 h-full">
        <div
          class="h-1/2"
          :class="cardColors[card]"
          v-for="(card, index) in card.previousCards"
          :key="'previousCards-' + index"
        ></div>
      </div>
      <!-- previous card colors -->
      <div
        class="w-full -mx-1 bg-white rounded-lg border-1 border-gray-700 relative"
      >
        <div class="p-1 text-sxs md:text-xs flex flex-col">
          <span
            v-for="(cardContent, index) in card.content"
            :key="'content-' + index"
          >
            {{ cardContent }}
          </span>
        </div>

        <div class="flex border-t-1 border-gray-800 text-sxs ms:text-xs">
          <div
            class="w-1/5 h-6 border-r-1 border-gray-800 flex items-center justify-center"
          >
            {{ card.id }}
          </div>
          <div
            class="w-4/5 h-6 flex flex-col items-center justify-center relative py-1"
          >
            <span
              v-for="(bonusContent, index) in card.bonusPoint"
              :key="'bonusPoint-' + index"
            >
              {{ bonusContent.word.join("/") }}
            </span>
            <span class="absolute right-0 mr-1"
              >+{{ card.bonusPoint[0].point }}</span
            >
          </div>
        </div>
        <!-- bonus point -->
      </div>

      <div class="w-3 h-full"></div>
      <!-- next card colors -->
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "location-card",
  props: {
    card: Object
  },
  data() {
    return {
      id: "",
      image: "",
      text: "",
      point: 0,
      previousCards: [],
      bonusPoints: []
    };
  },
  computed: {
    ...mapState({
      cardColors: state => state.playing.cardColors
    })
  }
};
</script>
