<template>
  <div
    class="w-full h-full bg-orange-700 flex flex-wrap items-center justify-center"
  >
    <div class="px-2 py-4 flex flex-col text-white h-full">
      <span
        class="flex items-center justify-center"
        v-for="(cardContent, index) in card.content"
        :key="'content-' + index"
        >{{ cardContent.text || cardContent }}</span
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "time-card",
  props: {
    card: Object
  },
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
