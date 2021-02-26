<template>
  <div
    class="w-full h-full py-2 bg-green-700 flex flex-col content-between items-center justify-center text-white"
  >
    <div
      class="h-1/3 flex flex-col"
      v-for="(cardContent, index) in card.content"
      :key="'content-' + index"
    >
      <div>
        {{ cardContent.text }}
      </div>
    </div>
    <div class="my-1 flex absolute bottom-0">
      <div>B</div>
      <div>queen/princess</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "verb-card",
  props: {
    card: Object,
  },
};
</script>
