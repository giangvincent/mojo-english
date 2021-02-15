<template>
  <div class="w-full h-full bg-gray-900 flex flex-wrap content-between">
    <div
      class="w-full m-1 p-1 bg-white rounded-lg border-1 border-gray-700 relative text-xs xs:text-sm sm:text-md"
    >
      the zombie
    </div>
    <div
      class="w-full m-1 p-1 bg-white rounded-lg border-1 border-gray-700 relative text-xs xs:text-sm sm:text-md"
    >
      (the) zombies
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
        text: "",
        point: 0,
      },
      plural: {
        text: "",
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