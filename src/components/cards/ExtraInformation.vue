<template>
  <div
    class="w-full h-full bg-yellow-700 flex flex-wrap items-center justify-center"
  >
    <div class="px-2 py-4 flex flex-col h-full">
      <span
        class="h-1/2 flex items-center justify-center"
        v-for="(cardContent, index) in card.content"
        :key="'content-' + index"
        >{{ cardContent.text || cardContent }}</span
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "Extra-Information-card",
  props: {
    card: Object
  },
  data() {
    return {};
  }
};
</script>
