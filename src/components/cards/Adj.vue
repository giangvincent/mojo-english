<template>
  <div
    class="w-full h-full bg-purple-700 flex justify-center text-white relative"
  >
    <div class="absolute top-0 right-0 m-2">{{ card.point }}</div>
    <div class="pt-3 h-full flex flex-col">
      <div class="text-lg">
        <span class="border-b-1 border-white">{{ card.content.main }}</span>
      </div>
      <div class="text-xs flex flex-col my-1">
        <span
          v-for="(synonym, index) in card.content.additional.synonym"
          :key="'synonym-' + index"
          >{{ synonym }}</span
        >
      </div>
      <div class="text-xs flex flex-col border-1 border-white rounded-md p-0.5">
        <span
          v-for="(antonym, index) in card.content.additional.antonym"
          :key="'antonym-' + index"
          >{{ antonym }}</span
        >
      </div>
    </div>
    <div class="h-5">
      <!-- <div>B</div> -->
    </div>
    <div
      class="flex absolute bottom-0 w-full -mr-1 border-1 border-gray-800 rounded-l-lg text-center text-black bg-white"
    >
      <div
        class="w-1/5 text-sxs border-r-1 border-gray-800 flex items-center justify-center"
      >
        {{ card.id }}
      </div>
      <div
        class="relative w-3/5 pl-1 pr-2 py-0.5 text-sxs border-r-1 border-gray-800 flex items-center leading-3"
      >
        {{ card.bonusPoint[0].content.join(" /") }}
        <span class="absolute right-0 mr-0.5"
          >+{{ card.bonusPoint[0].point }}</span
        >
      </div>
      <div class="w-1/5 flex items-center relative">
        <svg
          v-if="card.nextCards.includes('Location')"
          class="w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          :class="{
            'absolute top-0 -mt-5 bg-white border-1 border-black':
              card.nextCards.length > 1,
          }"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <svg
          v-if="card.nextCards.includes('Noun')"
          class="w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'adjective-card',
  props: {
    card: {}
  },
  data () {
    return {
      id: '',
      texts: [],
      point: 0,
      useFor: [],
      extraPoint: []
    }
  }
}
</script>
