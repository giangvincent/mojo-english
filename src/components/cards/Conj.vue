<template>
  <div
    class="w-full h-full bg-white flex flex-wrap items-center justify-center relative"
  >
    <div class="pb-10 flex flex-col w-full h-32">
      <div
        class="h-1/2 flex flex-col items-center justify-center relative"
        v-for="(cardContent, index) in card.content"
        :key="'content-' + index"
      >
        <span class="flex items-center justify-center h-full text-2xl">{{
          cardContent.text
        }}</span>
        <div
          class="absolute right-0 m-2"
          :class="{ 'top-0': index == 0, 'bottom-0': index == 1 }"
        >
          {{ cardContent.point }}
        </div>
        <hr v-if="index == 0" class="w-2/5 border-1 border-black" />
      </div>
    </div>
    <div class="my-1 flex absolute bottom-0 w-full text-black">
      <div class="w-8 -ml-0.5 border-r-1 border-black">
        <div
          class="h-3 p-0.5 border-t-1 border-black flex items-center justify-end"
        >
          <svg
            class="w-3 h-3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
            />
          </svg>
        </div>
        <div
          class="h-3 p-0.5 border-t-1 border-black flex items-center justify-end"
        >
          <svg
            class="w-3 h-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div class="h-3 border-t-1 border-black bg-purple-800"></div>
        <div class="h-3 border-t-1 border-black bg-yellow-800"></div>
        <div class="h-3 border-t-1 border-b-1 border-black bg-green-800"></div>
      </div>
      <!-- previous card colors -->
      <div class="flex items-end w-full -mx-2 relative">
        <div
          class="flex w-full justify-center absolute top-0 mx-auto text-white"
        >
          <span
            class="h-5 w-5 bg-blue-900 border-1 border-black flex items-center justify-center mr-0.5"
            >?</span
          >
          <span
            class="h-5 w-5 bg-blue-900 border-1 border-black flex items-center justify-center"
            >-</span
          >
        </div>
        <div
          class="p-1 border-1 border-gray-800 rounded-md bg-gray-400 flex items-center justify-center text-xs"
        >
          {{ card.id }}
        </div>
        <!-- bonus point -->
      </div>

      <div class="w-8 -mr-0.5 border-l-1 border-black">
        <div
          class="h-3 p-0.5 border-t-1 border-black flex items-center justify-start"
        >
          <svg
            class="w-3 h-3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
            />
          </svg>
        </div>
        <div
          class="h-3 p-0.5 border-t-1 border-black flex items-center justify-start"
        >
          <svg
            class="w-3 h-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div class="h-3 border-t-1 border-black bg-purple-800"></div>
        <div class="h-3 border-t-1 border-black bg-yellow-800"></div>
        <div class="h-3 border-t-1 border-b-1 border-black bg-green-800"></div>
      </div>
      <!-- next card colors -->
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
