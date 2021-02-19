<template>
  <div
    class="w-full h-full bg-orange-700 flex flex-wrap items-center justify-center"
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
      bonusPoints: []
    };
  }
};
</script>
