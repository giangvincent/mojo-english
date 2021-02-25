<template>
  <div
    class="w-full h-full bg-purple-700 flex flex-col items-center justify-center text-white relative"
  >
    <div class="absolute top-0 right-0 m-2">{{ card.point }}</div>
    <div class="my-1 flex flex-col">
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
      <div class="text-xs flex flex-col border-1 border-white rounded-md">
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
      class="flex absolute bottom-0 w-full md:m-2 border-1 border-gray-800 rounded-lg  text-center text-black bg-white
      "
    >
      <div
        class="w-1/5 h-6 text-sxs border-r-1 border-gray-800 flex items-center justify-center"
      >
        {{ card.id }}
      </div>
      <div
        class="w-3/5 h-6 text-sxs border-r-1 border-gray-800 flex items-center justify-center"
      >
        {{ card.bonusPoint[0].content.join("/") }}
        +{{ card.bonusPoint[0].point }}
      </div>
      <div class="w-1/5 h-6 flex justify-center">
        <svg
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
  name: "adjective-card",
  props: {
    card: Object
  },
  data() {
    return {
      id: "",
      texts: [],
      point: 0,
      useFor: [],
      extraPoint: []
    };
  }
};
</script>
