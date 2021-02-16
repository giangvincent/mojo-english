<template>
  <div class="w-full h-full bg-gray-900 flex flex-wrap content-between">
    <div
      class="w-full m-1 p-1 bg-white rounded-lg border-1 border-gray-700 relative text-xs xs:text-sm sm:text-md"
    >
      {{ singular.text[Math.floor(Math.random() * singular.text.length)] }}
    </div>
    <div
      class="w-full m-1 p-1 bg-white rounded-lg border-1 border-gray-700 relative text-xs xs:text-sm sm:text-md"
    >
      {{ plural.text[Math.floor(Math.random() * plural.text.length)] }}
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