<template>
  <div class="flex flex-col relative h-full">
    <div class="flex flex-wrap content-center items-center">
      <div class="m-2">
        <figure>
          <img
            class="w-20 rounded-md border-2 border-gray-500"
            src="@/assets/images/default-avatar.jpg"
            alt=""
            srcset=""
          />
        </figure>
        player 1
      </div>
      <div class="m-2">
        <figure>
          <img
            class="w-20 rounded-md border-2 border-gray-500"
            src="@/assets/images/default-avatar.jpg"
            alt=""
            srcset=""
          />
        </figure>
        player 2
      </div>
      <div class="m-2">
        <figure>
          <img
            class="w-20 rounded-md border-2 border-gray-500"
            src="@/assets/images/default-avatar.jpg"
            alt=""
            srcset=""
          />
        </figure>
        player 3
      </div>
    </div>
    <!-- Other players -->

    <!-- Table -->

    <div
      class="flex absolute bottom-0 w-full px-2 py-4 bg-gray-700 overflow-x-auto"
      :style="{ height: playingHeight }"
    >
      <div class="flex flex-row flex-no-wrap">
        <div class="absolute top-0 -mt-10 left-0 right-0">
          <div>Cards</div>
        </div>
        <div
          class="flex flex-row flex-no-wrap relative"
          v-for="(card, index) in cardsOrder"
          :key="'card-' + index"
        >
          <card-container
            :card="card.type"
            :cardHeight="playingHeight"
          ></card-container>
          <span class="absolute top-0 -mt-2 mx-auto w-full">
            <svg
              class="w-6 h-6 bg-white rounded-full p-1 shadow mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
    <!-- Player table -->
  </div>
</template>

<script>
import CardContainer from "@/components/cards/CardContainer";
import { mapState } from "vuex";

export default {
  name: "playing-ground",
  components: {
    CardContainer
  },
  data() {
    return {
      drag: false,
      cardsOrder: [
        {
          type: "Adj"
        },
        {
          type: "Location"
        },
        {
          type: "TimeCard"
        },
        {
          type: "Prep"
        },
        {
          type: "Adverb"
        },
        {
          type: "HelpingVerb"
        },
        {
          type: "Noun"
        }
      ],
      playingHeight: 0
    };
  },
  computed: {
    ...mapState({
      scr_height: state => state.scr_height
    })
  },
  created() {
    this.playingHeight = (this.scr_height * 3) / 5;
  }
};
</script>

<style>
.w-1\/7 {
  width: 14.286%;
}
</style>
