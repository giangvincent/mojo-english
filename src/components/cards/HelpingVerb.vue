<template>
  <div
    class="w-full h-full py-2 bg-blue-700 flex flex-col content-between items-center justify-center text-white"
  >
    <div class="my-4 mx-5 absolute right-0 top-0">4</div>
    <div class="my-1 flex flex-col">
      <div
        class="my-1 flex flex-col"
        v-for="(cardContent, index) in card.content"
        :key="'content-' + index"
      >
        <div v-for="(text, index) in cardContent.texts" :key="'text-' + index">
          {{ text.text }}
        </div>
      </div>
    </div>
    <div class="my-1 flex absolute bottom-0"></div>
  </div>
</template>

<script>
export default {
  name: "helping-verb",
  props: {
    card: Object
  }
};
</script>
