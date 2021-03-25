<template>
  <div class="flex flex-col justify-center items-center h-full w-full">
    <div class="w-full px-4 mb-5 text-left">
      <div class="p-2 border-2 border-gray-800 rounded-lg w-full">
        Sentence:
      </div>
    </div>
    <!-- Table -->
    <div
      ref="tablePlay"
      id="tablePlay"
      class="flex w-full h-1/2 relative items-center justify-center relative"
    >
      <div
        class="flex flex-row flex-no-wrap items-center justify-center w-full h-full"
        v-if="cards.length > 0"
      >
        <div
          class="flex flex-row flex-no-wrap  relative duration-300 transform h-full"
          v-for="(card, index) in cards"
          :key="'card-' + card.id"
          :class="{ '-translate-y-2': indexChange == index }"
          v-bind:style="{
            transform: translateX > 0 && index == desIndex ? desTranslate : ''
          }"
        >
          <span
            v-if="stateForMoving && index === 0 && indexChange !== 0"
            class="absolute left-0 h-full flex items-center -ml-2 z-10"
            @click="movingCard(-1)"
          >
            <fill-card-in-btn></fill-card-in-btn>
          </span>
          <card-container
            :card="card"
            :cardHeight="cardHeight"
            :class="{
              'opacity-25': zeroPointCards.includes(card.id)
            }"
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
            <fill-card-in-btn></fill-card-in-btn>
          </span>

          <position-state-btn
            @click="readyToChange(index)"
          ></position-state-btn>
        </div>
      </div>
    </div>
    <!-- Player table -->
    <div class="mt-5 flex">
      <button
        class="rounded px-3 py-2 m-1 border-b-4 border-l-2 shadow-lg bg-orange-700 border-orange-900 text-white"
      >
        Confirm card position
      </button>
    </div>
  </div>
</template>

<script>
import CardContainer from "@/components/cards/CardContainer";
import PositionStateBtn from "@/components/cards/Buttons/PositionStateBtn";
import FillCardInBtn from "@/components/cards/Buttons/FillCardInBtn";
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
    CardContainer,
    PositionStateBtn,
    FillCardInBtn
  },
  data() {
    return {
      numCardAllow: 3,

      indexChange: -1,
      stateForMoving: false,
      desIndex: -1,

      allCards: [],
      cardDiscarded: [],
      cards: [],

      zeroPointCards: [],
      nounPharse: [],
      objectPhrase: [],
      verbPhrase: [],
      isQuestion: false,

      cardWidth: 0,
      cardHeight: 0,
      translateX: 0,
      sourceTranslate: "",
      desTranslate: ""
    };
  },
  computed: {
    ...mapState({
      originalCards: state => state.playing.cards,
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
    },
    stateForMoving: function(newVal, oldVal) {
      if (newVal !== oldVal || newVal) {
        this.checkPositionOfCards();
      }
    }
  },
  created() {
    this.cardHeight = (this.scr_height * 3) / 5;
    this.cardWidth = (this.cardHeight - 32) / 1.612;
    console.log(this.originalCards);
    this.distributeCards(this.originalCards);
  },
  mounted() {
    var element = this.$refs.tablePlay;
    element.addEventListener("wheel", transformScroll);
  },
  methods: {
    finishSentence() {
      this.translateX = 0;
      this.indexChange = -1;
      this.desIndex = -1;
      this.cardDiscarded = [];
      this.distributeCards(this.originalCards);
    },
    detectNounPhrase() {
      this.nounPharse = [];
      let isNounPhrase = false;
      this.cards.forEach((card, index) => {
        if ((card.type == "Adj" || card.type == "Noun") && !isNounPhrase) {
          isNounPhrase = true;
        }
        if (
          (card.type == "ExtraInformation" || card.type == "Noun") &&
          isNounPhrase
        ) {
          isNounPhrase = true;
        }
      });
    },
    detectObjectPhrase() {
      this.objectPhrase = [];
      this.cards.forEach((card, index) => {});
    },
    autoArrangeOnce() {
      let temp = null;
      console.log(this.cards);
      this.cards.forEach((card, index) => {
        if (
          card.type == "Noun" &&
          index !== 0 &&
          this.cards[0].type != "Noun"
        ) {
          temp = this.cards[0];
          this.cards[0] = card;
          this.cards[index] = temp;
        }
        if (
          card.type == "Verb" &&
          index !== 1 &&
          this.cards[1].type != "Verb"
        ) {
          temp = this.cards[1];
          this.cards[1] = card;
          this.cards[index] = temp;
        }

        if (
          (card.type == "TimeCard" || card.type == "Location") &&
          index !== 2 &&
          (this.cards[2].type != "TimeCard" || this.cards[2].type != "Location")
        ) {
          temp = this.cards[2];
          this.cards[2] = card;
          this.cards[index] = temp;
        }
      });
    },
    checkPositionOfCards() {
      let previousCards = [];
      this.zeroPointCards = [];
      this.cards.forEach((card, index) => {
        if (this.isIllegalCard(card, index, previousCards)) {
          this.zeroPointCards.push(card.id);
        }

        previousCards.push(card);
      });
      this.zeroPointCards = this.zeroPointCards.filter(onlyUnique);
    },
    isIllegalCard(card, index, previousCards) {
      if (index > 0 && index < this.numCardAllow) {
        console.log(
          index,
          this.isPreviousCardsIllegal(card, index) &&
            this.isNextCardsIllegal(card, index)
        );
        return (
          this.isPreviousCardsIllegal(card, index) &&
          this.isNextCardsIllegal(card, index)
        );
      } else {
        if (index == 0) {
          console.log(index, this.isNextCardsIllegal(card, index));
          return this.isNextCardsIllegal(card, index);
        }
        if (index == 6) {
          /**
           * check the last card
           * if all the previous cards is allowed and the last card must be Location, Time or Extra Information
           * else check last card like a normal card
           */
          console.log(
            index,
            card.type,
            this.isPreviousCardsIllegal(card, index)
          );
          if (
            ["Location", "TimeCard", "ExtraInformation"].includes(card.type)
          ) {
            const foundPreviousCard = previousCards.some(
              ({ type }) =>
                card.previousCards && card.previousCards.includes(type)
            );
            console.log(foundPreviousCard);
            return !foundPreviousCard;
          } else return this.isPreviousCardsIllegal(card, index);
        }
      }
    },
    // check previous card legal or not
    isPreviousCardsIllegal(card, index) {
      if (
        card.previousCards &&
        !card.previousCards.includes(this.cards[index - 1].type) &&
        card.allowCards &&
        !card.allowCards.includes(this.cards[index - 1].type)
      )
        return true;
      return false;
    },
    isNextCardsIllegal(card, index) {
      if (
        card.nextCards &&
        !card.nextCards.includes(this.cards[index + 1].type) &&
        card.allowCards &&
        !card.allowCards.includes(this.cards[index + 1].type)
      )
        return true;
      return false;
    },
    /**
     * chia bài
     */
    distributeCards(cards) {
      shuffleArray(cards);
      this.cards = cards.slice(0, this.numCardAllow);
      this.allCards = cards.slice(
        this.originalCards.length - 1,
        cards.length - 1
      );
      this.autoArrangeOnce();
      this.checkPositionOfCards();
    },
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
      this.checkPositionOfCards();
    },
    discardCard() {
      if (this.cardDiscarded.length < 3 && this.indexChange >= 0) {
        this.cardDiscarded.push(this.cards[this.indexChange]);
        shuffleArray(this.allCards);
        // this.allCards = shuffleArray(this.allCards);
        this.cards[this.indexChange] = this.allCards[0];
        this.allCards.splice(0, 1);
        this.indexChange = -1;
        this.checkPositionOfCards();
      }
    }
  }
};
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
// Fisher–Yates Shuffle Faster version
function shuffleArray(a, b, c, d) {
  //array,placeholder,placeholder,placeholder
  c = a.length;
  while (c)
    (b = (Math.random() * c--) | 0), (d = a[c]), (a[c] = a[b]), (a[b] = d);
}
// Fisher–Yates Shuffle
function shuffleArray1(array) {
  var m = array.length,
    t,
    i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}
</script>

<style>
.w-1\/7 {
  width: 14.286%;
}
</style>
