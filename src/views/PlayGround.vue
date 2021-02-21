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
      class="w-full absolute bottom-0 bg-gray-700"
      :style="{ height: cardHeight + 'px' }"
    >
      <div class="absolute top-0 right-0 h-8 flex -mt-8 mr-2 items-center">
        <div
          class="bg-green-500 border-t-1 border-green-100 rounded-t-lg px-2 py-1"
        >
          Cards
        </div>
      </div>
      <div class="flex w-full h-full px-2 py-4 overflow-x-auto">
        <div class="flex flex-row flex-no-wrap pl-2 pr-4">
          <div
            class="flex flex-row flex-no-wrap relative duration-300 transform"
            v-for="(card, index) in cardsOrder"
            :key="'card-' + index"
            :class="{ '-translate-y-2': indexChange == index }"
            v-bind:style="{
              transform:
                translateX > 0 && index == desIndex ? desTranslate : '',
              transform:
                translateX > 0 && index == indexChange ? sourceTranslate : '',
            }"
          >
            <span
              v-if="stateForMoving && index === 0 && indexChange !== 0"
              class="absolute left-0 h-full flex items-center -ml-2"
              @click="movingCard(-1)"
            >
              <svg
                class="w-8 h-8 bg-white rounded-full shadow mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            <card-container
              :card="card.type"
              :cardHeight="cardHeight"
            ></card-container>
            <span
              v-if="
                stateForMoving &&
                indexChange !== index &&
                indexChange - 1 !== index
              "
              class="absolute right-0 h-full flex items-center -mr-2"
              @click="movingCard(index)"
            >
              <svg
                class="w-8 h-8 bg-white rounded-full shadow mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            <span
              class="absolute top-0 -mt-2 mx-auto w-full"
              @click="readyToChange(index)"
            >
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
      indexChange: -1,
      stateForMoving: false,
      desIndex: -1,
      cardsOrder: [
        {
          id: "card-0",
          type: "Adj",
        },
        {
          id: "card-1",
          type: "Location",
        },
        {
          id: "card-2",
          type: "TimeCard",
        },
        {
          id: "card-3",
          type: "Prep",
        },
        {
          id: "card-4",
          type: "Adverb",
        },
        {
          id: "card-5",
          type: "HelpingVerb",
        },
        {
          id: "card-6",
          type: "Noun",
        },
      ],
      cardWidth: 0,
      cardHeight: 0,
      translateX: 0,
      sourceTranslate: "",
      desTranslate: "",
    };
  },
  computed: {
    ...mapState({
      scr_height: (state) => state.scr_height,
    }),
  },
  watch: {
    indexChange: function (newVal, oldVal) {
      if (newVal >= 0) {
        this.stateForMoving = true;
      } else {
        this.stateForMoving = false;
      }
    },
  },
  created() {
    this.cardHeight = (this.scr_height * 3) / 5;
    this.cardWidth = (this.cardHeight - 32) / 1.612;
  },
  methods: {
    readyToChange(index) {
      if (index == this.indexChange) {
        this.indexChange = -1;
        return;
      }
      this.indexChange = index;
    },
    movingCard(index) {
      this.stateForMoving = false;

      if (this.indexChange > index) {
        this.translateX = this.cardWidth * (this.indexChange - (index + 1));
        this.sourceTranslate = "translateX(-" + this.translateX + "px)";
        this.desTranslate = "translateX(" + this.translateX + "px)";
        this.desIndex = index + 1;
      } else {
        this.translateX = this.cardWidth * (index - this.indexChange);
        this.sourceTranslate = "translateX(" + this.translateX + "px)";
        this.desTranslate = "translateX(-" + this.translateX + "px)";
        this.desIndex = index;
      }

      let self = this;
      setTimeout(function () {
        self.swapCard(self.indexChange, self.desIndex);
      }, 350);
    },
    swapCard(source, des) {
      let temp = {};
      temp = this.cardsOrder[source];
      this.cardsOrder[source] = this.cardsOrder[des];
      this.cardsOrder[des] = temp;

      this.translateX = 0;
      this.indexChange = -1;
      this.desIndex = -1;
    },
  },
};
</script>

<style>
.w-1\/7 {
  width: 14.286%;
}
</style>
