<template>
  <div
    class="w-full h-full bg-orange-700 flex flex-wrap items-center justify-center relative"
  >
    <div class="mt-0.5 ml-1 absolute left-0 top-0 text-white">
      {{ card.symbol }}
    </div>
    <div class="py-3 flex flex-col text-white text-sxs w-full h-full">
      <div
        class="flex flex-col items-center justify-center h-1/4 relative"
        v-for="(cardContent, index) in card.content"
        :key="'content-' + index"
        :class="{
          'border-b-1 border-black': index == 0 || index == 2,
          'border-1 border-black mx-1 pl-2': index == 1,
        }"
      >
        <div
          v-if="index === 1"
          class="px-1 h-full bg-pink-800 absolute left-0 flex items-center"
        >
          F
        </div>
        <span class="leading-3">{{ cardContent.text }}</span>
        <div class="flex">
          <div
            class="flex items-center"
            v-for="(point, pindex) in cardContent.point"
            :key="pindex"
            :class="{ 'pl-2 text-black': index === 2 }"
          >
            {{ index === 2 && pindex === "simple tense" ? "( " : "" }}
            <span
              class="w-3 h-3 border-1 border-black mr-1"
              :class="{
                'bg-black': pindex === 'past simple tense',
                'bg-white': pindex === 'present simple tense',
                'bg-gray-500 flex items-center justify-center text-black pb-2':
                  pindex === 'future simple tense',
              }"
              >{{ pindex === "future simple tense" ? "." : "" }}</span
            >
            <span>{{ point }}</span>
            {{ index === 2 && pindex === "simple tense" ? " )" : "" }}
          </div>
        </div>
      </div>
    </div>
    <div class="my-1 flex absolute bottom-0 w-full text-black">
      <div class="w-4 -ml-0.5 border-r-1 border-black">
        <div
          class="h-full border-t-1 border-b-1 border-black bg-green-800"
        ></div>
      </div>
      <!-- previous card colors -->
      <div class="flex items-end w-full -mx-2 relative">
        <div
          class="p-0.5 border-1 border-gray-800 rounded-md bg-gray-400 flex items-center justify-center text-sxs md:text-xs"
        >
          {{ card.id }}
        </div>
        <!-- bonus point -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'time-card',
  props: {
    card: {}
  },
  data () {
    return {
      id: '',
      image: '',
      text: '',
      point: 0,
      previousCards: [],
      bonusPoints: []
    }
  }
}
</script>
