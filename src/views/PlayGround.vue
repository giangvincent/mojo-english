<template>
  <div
    class="flex flex-col justify-center items-center h-full w-full bg-gray-800"
  >
    <div class="w-full px-4 mb-5 text-left">
      <div
        class="p-2 border-2 border-white text-white rounded-lg w-full"
        v-if="!isDragging"
      >
        {{ $t('playing')['final_sentence'] }}:
        <div class="ml-2 inline">
          {{ typeof nounPhrase.text !== 'undefinded' ? nounPhrase.text : '' }}
          {{ typeof verbPhrase.text !== 'undefined' ? verbPhrase.text : '' }}
          {{ typeof objectPhrase.text !== 'undefined' ? objectPhrase.text : '' }}
        </div>

      </div>
    </div>
    <!-- Table -->
    <div
      ref="tablePlay"
      id="tablePlay"
      class="flex w-full h-1/2 relative items-center justify-center relative"
    >
      <draggable
        element="div"
        v-model="cards"
        v-bind="dragOptions"
        ghost-class="ghost"
        @change="onSortCards"
        class="flex flex-row flex-no-wrap items-center justify-center w-full h-full"
        v-if="cards.length > 0"
        :disabled="!isDragging"
      >
        <div
          class="flex flex-row flex-no-wrap relative duration-300 transform h-full"
          v-for="(card, index) in cards"
          :key="'card-' + card.id"
          :class="{
            '-translate-y-3': zeroPointCards.includes(card.id) && !isDragging,
          }"
        >
          <card-container
            :card="card"
            :cardHeight="cardHeight"
            :canChooseWord="!zeroPointCards.includes(card.id)"
            :class="{
              'opacity-25': zeroPointCards.includes(card.id),
            }"
          ></card-container>

          <discard-btn
            v-if="isDragging && cardDiscarded.length < 3"
            @click="discardCard(index)"
          ></discard-btn>
          <replace-btn
            v-if="zeroPointCards.includes(card.id) && (cardDiscarded.length >= 3 || playingStep == 'choose-word')"
            @changeCard="changeCard"
            :cardIndex="index"
            :cardOb="card"
          ></replace-btn>
        </div>
      </draggable>
    </div>
    <!-- Player table -->
    <div class="mt-5 flex">
      <button
        v-if="isDragging == true"
        class="px-3 py-2 m-1 border-b-4 border-l-2 shadow-lg bg-teal-700 border-teal-900 text-white"
        @click="lockCardPosition()"
      >
        {{ $t('playing')['confirm_position'] }}
      </button>
      <button
        v-if="isDragging == false"
        class="px-3 py-2 m-1 border-b-4 border-l-2 shadow-lg bg-teal-700 border-teal-900 text-white"
        :disabled="isSentenceNotReady"
        :class="{ 'opacity-50 cursor-not-allowed': isSentenceNotReady }"
        @click="submitSentence()"
      >
        {{ $t('playing')['submit_sentence'] }}
      </button>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import CardContainer from "@/components/cards/CardContainer";
import DiscardBtn from "@/components/cards/Buttons/DiscardBtn";
import ReplaceBtn from "@/components/cards/Buttons/ReplaceBtn";
import FillCardInBtn from "@/components/cards/Buttons/FillCardInBtn";
import { mapMutations, mapState } from "vuex";

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
    DiscardBtn,
    ReplaceBtn,
    FillCardInBtn,
    draggable,
  },
  data() {
    return {
      numCardAllow: 3,
      isSentenceNotReady: true,

      allCards: [],
      cards: [],
      zeroPointCards: [],
      illegalCardPosition: [],
      cardDiscarded: [],

      cardsWord: [],

      cardWidth: 0,
      cardHeight: 0,

      editable: true,
      isDragging: true,
      delayedDragging: false,
    };
  },
  computed: {
    ...mapState({
      player: state => state.player.playerData,
      originalCards: (state) => state.playing.cards,
      scr_height: (state) => state.scr_height,
      choseWords: (state) => {
        console.log(state.playing.choseWords)
        return state.playing.choseWords
      },
      nounPhrase: (state) => state.playing.nounPhrase,
      verbPhrase: state => state.playing.verbPhrase,
      objectPhrase: state => state.playing.objectPhrase,
      playingStep: state => state.playing.playingStep
    }),
    dragOptions() {
      return {
        animation: 1,
        group: "description",
        disabled: !this.editable,
        ghostClass: "ghost",
      };
    },
  },
  watch: {
    isDragging(newValue) {
      if (newValue) {
        this.delayedDragging = true;
        this.checkPositionOfCards();
        return;
      }
      this.$nextTick(() => {
        this.delayedDragging = false;
      });
    },
    choseWords: {
      handler: function(val) {
        console.log(val)
        this.cardsWord = val
      },
      deep: true
    }
  },
  created() {
    this.cardHeight = (this.scr_height * 3) / 5;
    this.cardWidth = (this.cardHeight - 32) / 1.612;
    this.distributeCards(this.originalCards);
  },
  mounted() {
    var element = this.$refs.tablePlay;
    element.addEventListener("wheel", transformScroll);
  },
  methods: {
    ...mapMutations(["playingStep", "setPlayingStep"]),
    changeCard(value) {
      console.log(value);
    },
    onSortCards() {
      this.checkPositionOfCards();
    },
    lockCardPosition() {
      this.isDragging = false;
      this.setPlayingStep("choose-word")
    },
    autoArrangeOnce() {
      let temp = null;
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
      // console.log("call check position of cards", this.cards);
      let previousCards = [];
      this.zeroPointCards = [];
      this.cards.forEach((card, index) => {
        if (this.isIllegalCard(card, index, previousCards)) {
          this.zeroPointCards.push(card.id);
          this.illegalCardPosition.push(index);
        }

        previousCards.push(card);
      });
      // this.zeroPointCards = this.zeroPointCards.filter(onlyUnique);
    },
    isIllegalCard(card, index, previousCards) {
      if (index > 0 && index < this.numCardAllow - 1) {
        return (
          this.isPreviousCardsIllegal(card, index) &&
          this.isNextCardsIllegal(card, index)
        );
      } else {
        if (index == 0) {
          return this.isNextCardsIllegal(card, index);
        }
        if (index == this.numCardAllow - 1) {
          /**
           * check the last card
           * if all the previous cards is allowed and the last card must be Location, Time or Extra Information
           * else check last card like a normal card
           */
          if (
            ["Location", "TimeCard", "ExtraInformation"].includes(card.type) &&
            this.player['level'] > 1
          ) {
            const foundPreviousCard = previousCards.some(
              ({ type }) =>
                card.previousCards && card.previousCards.includes(type)
            );
            return !foundPreviousCard;
          } else return this.isPreviousCardsIllegal(card, index);
        }
      }
    },
    // check previous card legal or not
    isPreviousCardsIllegal(card, index) {
      if (
        card.previousCards &&
        card.previousCards.includes(this.cards[index - 1].type)
      )
        return false;
      if (
        card.allowCards &&
        card.allowCards.includes(this.cards[index - 1].type)
      )
        return false;
      return true;
    },
    isNextCardsIllegal(card, index) {
      if (card.nextCards && card.nextCards.includes(this.cards[index + 1].type))
        return false;
      if (
        card.allowCards &&
        card.allowCards.includes(this.cards[index + 1].type)
      )
        return false;

      return true;
    },

    discardCard(index) {
      if (this.cardDiscarded.length < 3) {
        this.cardDiscarded.push(this.cards[index]);
        // shuffleArray(this.allCards);
        // this.allCards = shuffleArray(this.allCards);
        this.cards[index] = this.allCards[0];
        this.allCards.splice(0, 1);
        this.checkPositionOfCards();
      }
    },
    /**
     * distribute Cards
     * get random cards into playtable
     */
    distributeCards(cards) {
      shuffleArray(cards);
      this.cards = cards.slice(0, this.numCardAllow);
      this.allCards = cards.slice(
        this.cards.length,
        this.originalCards.length - 1
      );
      this.autoArrangeOnce();
      this.checkPositionOfCards();
    },
  },
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
