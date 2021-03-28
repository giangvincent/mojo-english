<template>
  <div
    class="w-full h-full pb-6 bg-green-700 flex flex-col text-white relative"
  >
    <div
      class="h-1/3 flex flex-col items-center"
      v-for="(cardContent, index) in card.content"
      :key="'content-' + index"
    >
      <div class="w-full h-full flex justify-between items-center text-xs">
        <div class="flex flex-col text-sxs px-1">
          <span v-if="index == 0"
            ><svg
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
              /></svg
          ></span>
          <span v-if="index == 0">
            <svg
              class="w-3 h-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
          <span v-if="index == 1"
            ><svg
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
              /></svg
          ></span>
          <span v-if="index == 2"
            ><svg
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
              /></svg
          ></span>
        </div>
        <div class="px-1 leading-3" v-html="cardContent.text"></div>
        <div class="px-1 flex flex-col items-center">
          <span>{{ cardContent.point }}</span>
          <span
            v-if="index < 2"
            class="w-3 h-3 border-1 border-black bg-white"
          ></span>
          <span
            v-if="index == 2"
            class="w-3 h-3 border-1 border-black bg-black"
          ></span>
        </div>
      </div>

      <hr v-if="index == 0" class="w-3/5 border-black" />
      <hr v-if="index == 1" class="w-2/3 border-black" />
    </div>

    <div
      class="my-0.5 w-full flex justify-between items-center absolute bottom-0 left-0 z-10"
    >
      <div class="flex relative z-10">
        <span
          class="w-5 h-4 -mt-4 absolute bg-white text-black flex items-center justify-center border-t-1 border-r-1 border-black rounded-tr-md"
          v-if="card.previousCards[0]"
          ><svg
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
            /></svg
        ></span>
        <div class="w-3 flex flex-col">
          <span
            class="w-full h-1/2"
            :class="'bg-' + cardColors[card.previousCards[1]]"
          ></span>
          <span
            style="font-size: xx-small"
            class="w-full h-1/2"
            :class="'bg-' + cardColors[card.previousCards[2]]"
            >F</span
          >
        </div>
        <span
          class="-ml-1 p-0.5 bg-gray-200 rounded-md border-1 border-black text-black text-sxs md:text-xs"
          >{{ card.id }}</span
        >
      </div>

      <div
        class="w-full h-4 -mx-2 border-1 border-black text-sxs px-2 relative"
        :class="'bg-' + cardColors['Prep']"
      >
        <span class="w-full overflow-hidden">{{
          card.condition[0].content.join("/")
        }}</span>
        <div class="absolute flex right-0 top-0 h-3 -mt-4 text-black mr-2">
          <span
            class="h-full px-1"
            :class="'bg-' + cardColors['Adverb']"
            v-if="card.nextCards[0] === 'Prep'"
            >away</span
          >{{ card.nextCards[0] === "Prep" ? " /" : "" }}
          <span
            ><svg
              class="h-3 w-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
              /></svg
          ></span>
          /
          <span
            class="h-3 w-3 border-1 border-black text-sxs"
            :class="'bg-' + cardColors['TimeCard']"
            >T</span
          >
          /
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "verb-card",
  props: {
    card: Object,
  },
  computed: {
    ...mapState({
      cardColors: (state) => state.playing.cardColors,
    }),
  },
};
</script>
