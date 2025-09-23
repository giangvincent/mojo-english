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
      <div class="flex w-full my-3">
        <div class="w-4 h-full">
          <div
            class="h-1/2"
            :class="'bg-' + cardColors[card]"
            v-for="(card, index) in card.previousCards"
            :key="'previousCards-' + index"
          ></div>
        </div>
        <!-- previous card colors -->
        <div
          class="w-full -ml-1 bg-white rounded-lg border-1 border-gray-700 relative"
        >
          <div class="p-1 text-sxs md:text-xs flex flex-col leading-3">
            <span
              v-for="(cardContent, index) in card.content"
              :key="'content-' + index"
            >
              {{ cardContent }}
            </span>
          </div>

          <div class="flex border-t-1 border-gray-800 text-sxs ms:text-xs">
            <div
              class="w-1/5 border-r-1 border-gray-800 flex items-center justify-center"
            >
              {{ card.id }}
            </div>
            <div class="w-4/5 flex flex-col relative pr-2 py-1 leading-3">
              <div
                v-for="(bonusContent, index) in card.bonusPoint"
                :key="'bonusPoint-' + index"
              >
                {{ bonusContent.word.join("/") }}
              </div>
              <span class="absolute right-0 mr-0.5 h-full flex items-center"
                >+{{ card.bonusPoint[0].point }}</span
              >
            </div>
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
            <div class="p-1 text-sxs md:text-xs flex flex-col">
              {{ card.content[0] }}
            </div>
          </div>
        </div>
      </div>
      <div class="flex w-full h-1/2 relative">
        <div class="absolute bottom-0 w-full">
          <!-- previous card colors -->
          <div class="w-full flex">
            <div class="w-4">
              <div
                class="h-full"
                :class="'bg-' + cardColors[card.previousCards[0]]"
              ></div>
            </div>
            <div
              class="w-full bg-white rounded-lg border-1 border-gray-700 relative -ml-1 text-sxs md:text-xs flex"
            >
              <div
                class="w-1/5 h-6 border-r-1 border-gray-800 flex items-center justify-center"
              >
                {{ card.id }}
              </div>
              <div class="w-4/5 flex items-center justify-center">
                {{ card.content[1] }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'location-card',
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  setup () {
    const store = useStore()
    const cardColors = computed(() => store.state.playing.cardColors)

    return {
      cardColors
    }
  }
}
</script>
