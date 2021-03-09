<template>
  <div
    class="w-full h-full bg-white flex flex-wrap items-center justify-center"
  >
    <div class="px-2 pb-6 flex flex-col w-full h-32">
      <div
        class="h-1/2 flex flex-col items-center justify-center relative"
        v-for="(cardContent, index) in card.content"
        :key="'content-' + index"
      >
        <span class="flex items-center justify-center h-full">{{
          cardContent.text
        }}</span>
        <div
          class="absolute right-0 m-2"
          :class="{ 'top-0': index == 0, 'bottom-0': index == 1 }"
        >
          {{ cardContent.point }}
        </div>
        <hr v-if="index == 0" class="w-2/3 border-1 border-black" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "conjunction-card",
  props: {
    card: Object
  },
  data() {
    return {};
  }
};
</script>
