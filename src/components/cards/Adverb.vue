<template>
  <div
    class="relative w-full h-full py-2 bg-pink-700 flex flex-col content-between items-center justify-center text-white"
  >
    <div class="m-2 absolute left-0 top-0">{{ card.symbol }}</div>
    <div class="m-2 absolute right-0 top-0">{{ card.point }}</div>
    <div class="my-1 flex flex-col" v-if="card.content[0].text">
      <div
        class="my-1 pb-1 border-b-1 border-black flex flex-col justify-center"
      >
        <span
          v-for="(content, index) in card.content[0].text"
          :key="'content-' + index"
          >{{ content }}</span
        >
        <div class="flex justify-center">
          <meaning-type
            :type="type"
            v-for="(type, index) in card.content[0].type"
            :key="'type-' + index"
          ></meaning-type>
        </div>
      </div>
      <div class="my-1 flex flex-col justify-center text-xs">
        <div class="flex justify-center">
          <meaning-type
            :type="type"
            v-for="(type, index) in card.content[1].type"
            :key="'type-' + index"
          ></meaning-type>
        </div>
        <span
          v-for="(content, index) in card.content[1].text"
          :key="'content-' + index"
          >{{ content }}</span
        >
      </div>
    </div>
    <div
      class="my-1 flex flex-col"
      v-if="typeof card.content[0].text === 'undefined'"
    >
      <div
        class="my-1"
        v-for="(content, index) in card.content"
        :key="'content-' + index"
      >
        <span>{{ content }}</span>
      </div>
    </div>

    <div
      class="my-0.5 w-full flex justify-between items-center absolute bottom-0 left-0 z-10"
    >
      <div class="flex relative">
        <span
          class="w-5 h-5 -mt-5 absolute bg-white text-black flex items-center justify-center border-t-1 border-r-1 border-black rounded-tr-md"
          v-if="card.previousCards[0]"
          ><svg
            class="w-4 h-4"
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
            /></svg
        ></span>
        <span
          class="w-3"
          v-if="card.previousCards[1]"
          :class="'bg-' + cardColors[card.previousCards[1]]"
        ></span>
        <span
          class="-ml-1 p-0.5 bg-gray-200 rounded-md border-1 border-black text-black text-sxs md:text-xs"
          >{{ card.id }}</span
        >
      </div>
      <div
        class="h-3 w-3 border-1 border-black"
        v-if="card.tense == 'simple'"
      ></div>
      <div
        class="w-5 h-5 -mr-0.5 border-1 border-black"
        v-if="card.nextCards[0]"
        :class="'bg-' + cardColors[card.nextCards[0]]"
      ></div>
    </div>
  </div>
</template>

<script>
import MeaningType from "@/components/cards/TypeSentence/Meaning.vue";
import Meaning from "./TypeSentence/Meaning.vue";
import { mapState } from "vuex";
export default {
  name: "adverb",
  props: {
    card: Object,
  },
  components: {
    MeaningType,
  },
  computed: {
    ...mapState({
      cardColors: (state) => state.playing.cardColors,
    }),
  },
};

Meaning;
</script>
