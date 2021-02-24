<template>
  <div class="flex justify-between relative h-full">
    <div class="flex flex-wrap">
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
    <div class="flex">
      <div
        class="w-16 h-24 border-2 border-dashed border-orange-800 m-2 relative rounded-lg flex items-center justify-center"
        @click="discardCard()"
      >
        <span
          class="text-orange-800 absolute w-full h-full z-10 flex items-center justify-center"
          ><svg
            class="w-8 h-8"
            :class="{ 'text-white': cardDiscarded.length > 0 }"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
        <div
          class="w-full h-full z-0 bg-orange-400 absolute border-2 rounded-lg"
          v-if="cardDiscarded.length > 0"
        ></div>
        <span
          v-if="cardDiscarded.length > 0"
          class="rounded-full bg-purple-900 text-white font-bold absolute bottom-0 left-0 w-6 h-6 -m-2"
          >{{ cardDiscarded.length }}</span
        >
      </div>
      <div class="w-16 h-24 m-2 relative">
        <div
          class="text-white font-bold absolute z-10 flex flex-wrap justify-center items-center rounded-lg bg-orange-800 w-full h-full"
        >
          Cards
        </div>

        <div
          class="absolute top-0 left-0 h-full rounded-lg border-1 border-orange-600 w-full z-0"
          style="margin: -2px 0 0 -2px"
        ></div>
        <div
          class="absolute top-0 left-0 h-full rounded-lg border-1 border-orange-500 w-full z-0"
          style="margin: -4px 0 0 -4px"
        ></div>
      </div>
    </div>

    <!-- Table -->
    <div
      class="w-full absolute bottom-0 bg-gray-700"
      :style="{ height: cardHeight + 'px' }"
    >
      <div class="absolute top-0 right-0 h-8 flex -mt-8 mr-2 items-center">
        <div
          class="bg-green-500 border-t-1 border-green-100 rounded-t-lg px-2 py-1"
        >
          Playing table
        </div>
      </div>
      <div
        ref="tablePlay"
        id="tablePlay"
        class="flex w-full h-full px-2 py-4 overflow-x-auto"
      >
        <div
          class="flex flex-row flex-no-wrap pl-2 pr-4"
          v-if="cards.length > 0"
        >
          <div
            class="flex flex-row flex-no-wrap relative duration-300 transform"
            v-for="(card, index) in cards"
            :key="'card-' + card.id"
            :class="{ '-translate-y-2': indexChange == index }"
            v-bind:style="{
              transform: translateX > 0 && index == desIndex ? desTranslate : ''
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
              :card="card"
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

function transformScroll(event) {
  if (!event.deltaY) {
    return;
  }
  event.currentTarget.scrollLeft -= event.deltaY * 10;
  event.preventDefault();
}

export default {
  name: "playing-ground",
  components: {
    CardContainer
  },
  data() {
    return {
      drag: false,
      indexChange: -1,
      stateForMoving: false,
      desIndex: -1,
      allCards: [],
      cardDiscarded: [],
      cards: [],
      cardWidth: 0,
      cardHeight: 0,
      translateX: 0,
      sourceTranslate: "",
      desTranslate: ""
    };
  },
  computed: {
    ...mapState({
      scr_height: state => state.scr_height
    })
  },
  watch: {
    indexChange: function(newVal, oldVal) {
      if (newVal >= 0) {
        this.stateForMoving = true;
      } else {
        this.stateForMoving = false;
      }
    }
  },
  created() {
    this.cardHeight = (this.scr_height * 3) / 5;
    this.cardWidth = (this.cardHeight - 32) / 1.612;
    let self = this;
    fetch("/contents/cardSet1.json")
      .then(res => res.json())
      .then(cards => {
        let randomCards = shuffleArray(cards);
        self.cards = randomCards.slice(0, 7);
        self.allCards = randomCards.slice(8, randomCards.length - 1);
        console.log(self.cards, self.allCards);
      });
  },
  mounted() {
    var element = this.$refs.tablePlay;
    element.addEventListener("wheel", transformScroll);
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
      setTimeout(function() {
        self.swapCard(self.indexChange, self.desIndex);
      }, 350);
    },
    swapCard(source, des) {
      let temp = {};
      temp = this.cards[source];
      let runLength = Math.abs(source - des);
      for (let i = 0; i < runLength; i++) {
        if (source < des) {
          this.cards[source + i] = this.cards[source + i + 1];
        } else {
          this.cards[source - i] = this.cards[source - i - 1];
        }
      }
      this.cards[des] = temp;

      this.translateX = 0;
      this.indexChange = -1;
      this.desIndex = -1;
    },
    discardCard() {
      if (this.cardDiscarded.length < 3) {
        this.cardDiscarded.push(this.cards[this.indexChange]);
        this.cards[this.indexChange] = this.allCards[0];
        this.allCards.splice(0, 1);
        this.indexChange = -1;
      }
    }
  }
};

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}
</script>

<style>
.w-1\/7 {
  width: 14.286%;
}
</style>
