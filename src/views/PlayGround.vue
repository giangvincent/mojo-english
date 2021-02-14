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
    <div class="absolute top-0 -mt-10 left-0 right-0">
      <div>Cards</div>
    </div>
    <div
      class="flex absolute bottom-0 w-full p-2 bg-gray-700 overflow-x-auto"
      :style="{ height: playingHeight }"
    >
      <div class="flex flex-row flex-no-wrap">
        <div
          class="m-1 bg-gray-300 rounded-md border-2 border-white"
          style="width: 116px"
        >
          <card-container card="Noun"></card-container>
        </div>
        <div
          class="m-1 bg-gray-300 rounded-md border-2 border-white"
          style="width: 116px"
        >
          <card-container card="Noun"></card-container>
        </div>
        <div
          class="m-1 bg-gray-300 rounded-md border-2 border-white"
          style="width: 116px"
        >
          <card-container card="Noun"></card-container>
        </div>
        <div
          class="m-1 bg-gray-300 rounded-md border-2 border-white"
          style="width: 116px"
        >
          <card-container card="Noun"></card-container>
        </div>
        <div
          class="m-1 bg-gray-300 rounded-md border-2 border-white"
          style="width: 116px"
        >
          <card-container card="Noun"></card-container>
        </div>
        <div
          class="m-1 bg-gray-300 rounded-md border-2 border-white"
          style="width: 116px"
        >
          <card-container card="Noun"></card-container>
        </div>
        <div
          class="m-1 bg-gray-300 rounded-md border-2 border-white"
          style="width: 116px"
        >
          <card-container card="Noun"></card-container>
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
    CardContainer,
  },
  data() {
    return {
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
