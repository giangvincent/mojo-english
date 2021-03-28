<template>
  <div class="w-full h-full">
    <div
      class="w-full h-full bg-gray-900 flex flex-wrap content-between relative bg-cover bg-no-repeat"
      v-if="typeof card.image === 'string'"
      :style="{ 'background-image': 'url(assets/images/' + card.image + ')' }"
    >
      <div
        class="absolute top-0 right-0 m-1 p-2 bg-white border-1 border-gray-800 w-6 h-6 rounded-md flex items-center justify-center"
      >
        {{ card.point }}
      </div>
      <div class="w-full"></div>
      <div class="flex w-full">
        <div
          class="w-full bg-white rounded-lg border-1 border-gray-700 relative"
        >
          <div class="p-1 flex flex-col leading-5">
            <span
              v-for="(cardContent, index) in card.content"
              :key="'content-' + index"
            >
              {{ cardContent }}
            </span>
          </div>

          <div class="flex flex-col border-t-1 border-gray-800 relative">
            <div
              v-for="(bonusContent, index) in card.bonusPoint"
              :key="'bonusPoint-' + index"
              :class="{ 'text-green-700': bonusContent.type == 'Verb' }"
            >
              {{ bonusContent.word.join("/") }}
            </div>
            <span
              class="absolute right-0 bottom-0 bg-white w-5 h-5 border-1 border-black rounded-full flex items-center justify-center -m-0.5 text-sm"
              >+{{ card.bonusPoint[0].point }}</span
            >
          </div>
          <!-- bonus point -->
        </div>
      </div>
    </div>
    <div
      class="w-full h-full bg-gray-900 flex flex-wrap justify-between relative"
      v-if="typeof card.image === 'object'"
    >
      <div
        class="absolute top-0 right-0 m-1 p-2 bg-white border-1 border-gray-800 w-6 h-6 rounded-md flex flex-col items-center justify-center"
      >
        {{ card.point }}
      </div>
      <div class="w-full h-1/2 relative">
        <div class="absolute bottom-0 w-full">
          <div
            class="w-full -mx-1 bg-white rounded-lg border-1 border-gray-700 relative"
          >
            <div class="p-1 flex flex-col">
              {{ card.content[0] }}
            </div>
          </div>
        </div>
      </div>
      <div class="flex w-full h-1/2 relative">
        <div
          class="absolute bottom-0 w-full bg-white rounded-lg border-1 border-gray-700 px-0.5"
        >
          {{ card.content[1] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "location-card",
  props: {
    card: Object,
  },
  data() {
    return {
      id: "",
      image: "",
      text: "",
      point: 0,
      previousCards: [],
      bonusPoints: [],
    };
  },
  computed: {
    ...mapState({
      cardColors: (state) => state.playing.cardColors,
    }),
  },
};
</script>
