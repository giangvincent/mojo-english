<template>
  <div
    class="w-full h-full bg-gray-900 flex flex-wrap items-center content-center"
  >
    <div class="px-2 py-4 flex flex-col text-white h-full">
      <span class="h-1/3 flex items-center justify-center">tomorrow</span>
      <span class="h-1/3 flex items-center justify-center">yesterday</span>
      <span class="h-1/3 flex items-center justify-center">in the morning</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "location-card",
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
};
</script>