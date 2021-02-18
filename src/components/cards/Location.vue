<template>
  <div class="w-full h-full bg-gray-900 flex flex-wrap content-between">
    <div class="w-full"></div>
    <div class="flex w-full my-3">
      <div class="w-3 h-full">
        <div class="bg-green-500 h-1/2"></div>
        <div class="bg-red-500 h-1/2"></div>
      </div>
      <!-- previous card colors -->
      <div
        class="w-full -m-1 p-1 bg-white rounded-lg border-1 border-gray-700 relative"
      >
        <div class="text-xs xs:text-sm sm:text-md">in a cave</div>
        <!-- plural -->

        <div class="border-t-1 border-gray-700 text-xs xs:text-sm">
          run/jump <span>+5</span>
        </div>
        <!-- bonus point -->
      </div>

      <div class="w-3 h-full"></div>
      <!-- next card colors -->
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