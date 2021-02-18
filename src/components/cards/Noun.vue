<template>
  <div class="w-full h-full bg-gray-900 flex flex-wrap content-between">
    <div
      class="w-full m-2 p-1 bg-white rounded-lg border-1 border-gray-700 relative text-xs xs:text-sm sm:text-md"
    >
      {{ singular.text[Math.floor(Math.random() * singular.text.length)] }}
    </div>
    <div class="flex w-full my-3">
      <div class="w-3 h-full">
        <div class="bg-green-500 h-1/3"></div>
        <div class="bg-red-500 h-1/3"></div>
        <div class="bg-pink-500 h-1/3"></div>
      </div>
      <!-- previous card colors -->
      <div
        class="w-full -m-1 p-1 bg-white rounded-lg border-1 border-gray-700 relative"
      >
        <div class="text-xs xs:text-sm sm:text-md">
          {{ plural.text[Math.floor(Math.random() * plural.text.length)] }}
        </div>
        <!-- plural -->

        <div class="border-t-1 border-gray-700 text-xs xs:text-sm">
          run/jump <span>+5</span>
        </div>
        <!-- bonus point -->
      </div>

      <div class="w-3 h-full">
        <div class="bg-blue-500 h-1/3"></div>
        <div class="bg-purple-500 h-1/3"></div>
        <div class="bg-yellow-500 h-1/3"></div>
      </div>
      <!-- next card colors -->
    </div>
  </div>
</template>

<script>
export default {
  name: "noun",
  data() {
    return {
      id: "",
      image: "",
      singular: {
        text: ["the zombie", "the king", "the knight"],
        point: 0,
      },
      plural: {
        text: ["(the) zombies", "(the) kings", "(the) knights"],
        point: 0,
      },
      finalPoint: 0,
      type: "",
      previousCards: [],
      nextCards: [],
      bonusPoint: [],
    };
  },
};
</script>