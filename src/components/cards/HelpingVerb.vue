<template>
  <div
    class="w-full h-full py-2 bg-blue-700 flex flex-col content-between items-center justify-center text-white relative"
  >
    <div class="mb-5 flex flex-col h-full w-full">
      <div
        class="my-1 h-full flex flex-col justify-center items-center relative"
        :class="card.content.length > 1 ? 'h-1/2' : ''"
        v-for="(cardContent, index) in card.content"
        :key="'content-' + index"
      >
        <div class="absolute left-0 ml-1">
          <span v-if="cardContent.type == 'plural'">
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </span>
          <span v-if="cardContent.type == 'singular'">
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
          </span>
        </div>
        <div
          class="flex flex-col justify-center w-full h-full items-center relative"
          :class="card.content.length === 1 ? 'h-1/2' : ''"
          v-for="(text, textIndex) in cardContent.texts"
          :key="'text-' + textIndex"
        >
          <div
            class="h-full flex flex-wrap px-5 items-center justify-center"
            v-html="text.text"
          ></div>

          <hr
            v-if="textIndex == 0 && card.content.length === 1"
            class="w-2/3 border-t-1 border-black"
          />
        </div>
        <div
          class="w-5 h-5 absolute top-0 right-0 mr-0.5 border-1 border-white rounded-full flex items-center justify-center"
        >
          {{ cardContent.point }}
        </div>
        <hr
          v-if="index == 0 && card.content.length > 1"
          class="w-2/3 border-1 border-black"
        />
      </div>
    </div>
    <div class="my-1 flex absolute bottom-0 w-full text-black">
      <div class="w-4 bg-white -mt-0.5 rounded-tr-sm">
        <div class="h-full p-0.5">
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
      </div>
      <!-- previous card colors -->
      <div class="w-full -mx-2 relative">
        <div
          v-if="card.typeWord.indexOf('present') >= 0"
          class="bg-white w-3 h-3 border-1 border-black mx-auto"
        ></div>
        <div
          v-if="card.typeWord.indexOf('future') >= 0"
          class="bg-gray-500 flex items-center justify-center w-3 h-3 border-1 border-black mx-auto pb-2"
        >
          .
        </div>
        <div
          v-if="card.typeWord.indexOf('past') >= 0"
          class="bg-transparent w-3 h-3 border-1 border-black mx-auto bg-black"
        ></div>
        <!-- plural -->
        <div
          class="text-sxs md:text-sm flex bg-white rounded-md border-1 border-gray-700"
        >
          <div
            class="w-1/4 border-r-1 border-gray-800 flex items-center justify-center"
          >
            {{ card.id }}
          </div>
          <div class="relative w-3/4 flex items-center p-0.5">
            {{ card.typeWord }}
          </div>
        </div>
        <!-- bonus point -->
      </div>

      <div class="w-4 bg-green-800 -mt-0.5 rounded-tl-sm">
        <div class="h-full text-sxs">A</div>
      </div>
      <!-- next card colors -->
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'helping-verb',
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  setup () {
    const store = useStore()
    const cardColors = computed(() => store.state.playing.cardColors)

    return {
      cardColors
    }
  }
}
</script>
