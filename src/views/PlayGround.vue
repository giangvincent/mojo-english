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
      class="flex absolute bottom-0 w-full p-2 bg-gray-700 overflow-x-auto"
      :style="{ height: playingHeight }"
    >
      <div class="flex flex-row flex-no-wrap">
        <div class="absolute top-0 -mt-10 left-0 right-0">
          <div>Cards</div>
        </div>
        <card-container
          v-for="(card, index) in cardsOrder"
          :key="'card-' + index"
          :card="card.type"
          :cardHeight="playingHeight"
        ></card-container>
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
    CardContainer,
  },
  data() {
    return {
      drag: false,
      cardsOrder: [
        {
          type: "Noun",
        },
        {
          type: "Location",
        },
        {
          type: "TimeCard",
        },
        {
          type: "Noun",
        },
        {
          type: "Noun",
        },
        {
          type: "Noun",
        },
        {
          type: "Noun",
        },
      ],
      playingHeight: 0,
    };
  },
  computed: {
    ...mapState({
      scr_height: (state) => state.scr_height,
    }),
  },
  created() {
    this.playingHeight = (this.scr_height * 3) / 5;
  },
};
</script>

<style>
.w-1\/7 {
  width: 14.286%;
}
</style>
