<template>
  <div
    class="flex flex-col justify-center items-center min-h-screen h-full w-full bg-gray-800"
  >
    <div class="w-full px-4 pt-10 mb-5 text-left">
      <div
        class="p-2 border-2 border-white text-white rounded-lg w-full relative"
        v-if="!isDragging"
      >
        {{ $t('playing.final_sentence') }}:
        <div class="ml-2 inline">
          {{ typeof nounPhrase.text !== 'undefinded' ? nounPhraseText : '' }}
          {{ typeof verbPhrase.text !== 'undefined' ? verbPhrase.text : '' }}
          {{ typeof objectPhrase.text !== 'undefined' ? objectPhrase.text + '.' : '' }}
          <div class="-mt-6 w-auto absolute bg-white pl-1 pr-1 rounded text-black top-0 whitespace-no-wrap">{{ $t('playing.total_point')  }}: {{ totalPoint }}</div>
        </div>

      </div>
    </div>
    <!-- Table -->
    <div
      ref="tablePlay"
      id="tablePlay"
      class="flex w-full min-h-1/2 relative items-center justify-center"
    >
      <draggable
        element="div"
        v-model="cards"
        v-bind="dragOptions"
        @change="onSortCards"
        class="flex flex-row flex-no-wrap items-center justify-center w-full h-full"
        v-if="cards.length > 0"
        :disabled="!isDragging"
        :key="cards.id"
      >
        <template #item="{ element, index }">
          <span
            class="flex flex-row flex-no-wrap relative duration-300 transform h-full"
            :class="{
              '-translate-y-3': zeroPointCards.includes(element.id) && !isDragging,
            }"
            v-touch:swipe="swipeCard(element.id)"
            v-on:click.prevent
          >
            <card-container
              :card="element"
              :cardHeight="cardHeight"
              :canChooseWord="!zeroPointCards.includes(element.id)"
              :class="{
                'opacity-25': zeroPointCards.includes(element.id),
              }"
            ></card-container>

            <discard-btn
              v-if="isDragging && cardDiscarded.length < 3"
              @click="discardCard(index)"
            ></discard-btn>
            <replace-btn
              v-if="zeroPointCards.includes(element.id) && (cardDiscarded.length >= 3 || playingStep == 'choose-word')"
              @changeCard="changeCard"
              :cardIndex="index"
              :cardOb="element"
            ></replace-btn>
          </span>
        </template>
      </draggable>
    </div>
    <!-- Player table -->
    <div class="mt-5 pb-5 flex justify-center w-full">
      <button
        v-if="isDragging === true"
        class="px-3 py-2 m-1 border-b-4 border-l-2 shadow-lg bg-teal-700 border-teal-900 text-white whitespace-no-wrap"
        @click="lockCardPosition()"
      >
        {{ $t('playing.confirm_position') }}
      </button>
      <button
        v-if="isDragging === false"
        class="px-3 py-2 m-1 border-b-4 border-l-2 shadow-lg bg-teal-700 border-teal-900 text-white whitespace-no-wrap"
        :disabled="isSentenceNotReady"
        :class="{ 'opacity-50 cursor-not-allowed': isSentenceNotReady }"
        @click="submitSentence()"
      >
        {{ $t('playing.submit_sentence') }}
      </button>
    </div>
    <game-over v-if="playingStep === 'end'" :finalSentence="finalSentence" :finalPoint="finalPoint"></game-over>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import CardContainer from '@/components/cards/CardContainer'
import DiscardBtn from '@/components/cards/Buttons/DiscardBtn'
import ReplaceBtn from '@/components/cards/Buttons/ReplaceBtn'
import GameOver from '@/components/GameOver'
import { mapActions, mapMutations, mapState } from 'vuex'
import { shuffleArray, capitalizeFirstLetter } from '@/helper'

function transformScroll (event) {
  if (!event.deltaY) {
    return
  }
  event.currentTarget.scrollLeft -= event.deltaY * 10
  event.preventDefault()
}

export default {
  name: 'playing-ground',
  components: {
    CardContainer,
    DiscardBtn,
    ReplaceBtn,
    draggable,
    GameOver
  },
  data () {
    return {
      numCardAllow: 3,
      isSentenceNotReady: true,

      allCards: [],
      cards: [],
      zeroPointCards: [],
      illegalCardPosition: [],
      cardDiscarded: [],

      totalPoint: 0,
      finalPoint: 0,
      finalSentence: null,
      finalScreenShot: null,

      cardWidth: 0,
      cardHeight: 0,

      isDragging: true,
      delayedDragging: false,
      dragging: false
    }
  },
  computed: {
    ...mapState({
      player: state => state.player.playerData,
      originalCards: (state) => state.playing.cards,
      scr_height: (state) => state.scr_height,
      nounPhrase: (state) => state.playing.nounPhrase,
      verbPhrase: state => state.playing.verbPhrase,
      objectPhrase: state => state.playing.objectPhrase,
      playingStep: state => state.playing.playingStep
    }),
    dragOptions () {
      return {
        animation: 0
      }
    },
    nounPhraseText: function () {
      if (this.nounPhrase && this.nounPhrase.text) {
        return capitalizeFirstLetter(this.nounPhrase.text)
      }
      return ''
    }
  },
  watch: {
    cards: {
      handler: function () {
        this.checkPositionOfCards()
      },
      deep: true
    },
    nounPhrase () {
      this.caculatePoint()
      this.checkSentenceReady()
    },
    verbPhrase () {
      this.caculatePoint()
      this.checkSentenceReady()
    },
    objectPhrase () {
      this.caculatePoint()
      this.checkSentenceReady()
    },
    isDragging (newValue) {
      if (newValue) {
        this.delayedDragging = true
        this.checkPositionOfCards()
        return
      }
      this.$nextTick(() => {
        this.delayedDragging = false
      })
    }
  },
  created () {
    this.cardHeight = (this.scr_height * 3) / 5
    this.cardWidth = (this.cardHeight - 32) / 1.612
    this.distributeCards(this.originalCards)
  },
  mounted () {
    const element = this.$refs.tablePlay
    element.addEventListener('wheel', transformScroll)
  },
  methods: {
    ...mapMutations(['setPlayingStep', 'resetSentence']),
    ...mapActions(['SetPlayerDataAsync']),
    submitSentence () {
      this.SetPlayerDataAsync({ point: this.player.point + this.totalPoint })
      this.finalSentence = this.nounPhraseText + ' ' + this.verbPhrase.text + ' ' + this.objectPhrase.text + '.'
      this.finalPoint = this.totalPoint
      this.resetSentence()
      this.setPlayingStep('end')
    },
    caculatePoint () {
      this.totalPoint = 0
      this.addPoint(this.nounPhrase)
      this.addPoint(this.verbPhrase)
      this.addPoint(this.objectPhrase)
    },
    addPoint (objPhrase) {
      if (objPhrase && Object.keys(objPhrase).length > 0 && objPhrase.constructor === Object) {
        this.totalPoint += objPhrase.point ? objPhrase.point : 0
        this.caculateBonusPoint(objPhrase.bonus ? objPhrase.bonus : [])
      }
    },
    caculateBonusPoint (bonusObj) {
      const self = this
      if (Array.isArray(bonusObj)) {
        let bonusAdded = false
        bonusObj.forEach(bonus => {
          bonus.word.forEach(word => {
            if (canAddBonusPoint(word, bonus.type) && !bonusAdded) {
              self.totalPoint += bonus.point
              bonusAdded = true
            }
          })
        })
      } else {
        if (bonusObj.word) {
          bonusObj.word.forEach(word => {
            if (canAddBonusPoint(word, bonusObj.type)) {
              self.totalPoint += bonusObj.point
            }
          })
        }
      }
      function canAddBonusPoint (word, type) {
        let cardString = {}
        self.cards.forEach(card => {
          if (card.type === type && !self.zeroPointCards.includes(card.id)) {
            cardString = JSON.stringify(card)
          }
        })

        if (cardString.indexOf(word) > -1) {
          return true
        }
        return false
      }
    },
    checkSentenceReady () {
      if (
        this.nounPhrase && Object.keys(this.nounPhrase).length > 0 &&
        this.verbPhrase && Object.keys(this.verbPhrase).length > 0 &&
        this.objectPhrase && Object.keys(this.objectPhrase).length > 0
      ) {
        this.isSentenceNotReady = false
      } else this.isSentenceNotReady = true
    },
    swipeCard (param) {
      const self = this
      return function (direction, event) {
        if (direction === 'top') {
          let cardIndex = 0
          self.cards.forEach((card, index) => {
            if (card.id === param) {
              cardIndex = index
            }
          })
          self.discardCard(cardIndex)
        }
      }
    },
    changeCard (value) {
      const replaceListCards = []
      const self = this
      this.allCards.forEach(card => {
        if (card.type === value.card) {
          replaceListCards.push(self.setPointToZero(card))
        }
      })
      shuffleArray(replaceListCards)
      this.$set(this.cards, value.index, replaceListCards[0])
    },
    setPointToZero (card) {
      const zeroPointCard = card
      const cardTypeHaveContent = ['TimeCard', 'Verb']
      if (cardTypeHaveContent.includes(card.type)) {
        card.content.forEach((content, index) => {
          zeroPointCard.content[index].point = 0
        })
      }
      if (card.type === 'Location') {
        zeroPointCard.point = 0
      }
      if (card.type === 'Noun') {
        zeroPointCard.singular.point = 0
        zeroPointCard.plural.point = 0
      }

      return zeroPointCard
    },
    onSortCards () {
      this.checkPositionOfCards()
    },
    lockCardPosition () {
      console.log('Lock cards position')
      this.isDragging = false
      this.setPlayingStep('choose-word')
    },
    autoArrangeOnce () {
      let temp = null
      this.cards.forEach((card, index) => {
        if (
          card.type === 'Noun' &&
          index !== 0 &&
          this.cards[0].type !== 'Noun'
        ) {
          temp = this.cards[0]
          this.cards[0] = card
          this.cards[index] = temp
        }
        if (
          card.type === 'Verb' &&
          index !== 1 &&
          this.cards[1].type !== 'Verb'
        ) {
          temp = this.cards[1]
          this.cards[1] = card
          this.cards[index] = temp
        }

        if (
          (card.type === 'TimeCard' || card.type === 'Location') &&
          index !== 2 &&
          (this.cards[2].type !== 'TimeCard' || this.cards[2].type !== 'Location')
        ) {
          temp = this.cards[2]
          this.cards[2] = card
          this.cards[index] = temp
        }
      })
    },
    checkPositionOfCards () {
      // console.log("call check position of cards", this.cards);
      const previousCards = []
      this.zeroPointCards = []
      this.cards.forEach((card, index) => {
        if (this.isIllegalCard(card, index, previousCards)) {
          this.zeroPointCards.push(card.id)
          this.illegalCardPosition.push(index)
        }

        previousCards.push(card)
      })
      // this.zeroPointCards = this.zeroPointCards.filter(onlyUnique);
    },
    isIllegalCard (card, index, previousCards) {
      if (index > 0 && index < this.numCardAllow - 1) {
        return (
          this.isPreviousCardsIllegal(card, index) &&
          this.isNextCardsIllegal(card, index)
        )
      } else {
        if (index === 0) {
          return this.isNextCardsIllegal(card, index)
        }
        if (index === this.numCardAllow - 1) {
          /**
           * check the last card
           * if all the previous cards is allowed and the last card must be Location, Time or Extra Information
           * else check last card like a normal card
           */
          if (
            ['Location', 'TimeCard', 'ExtraInformation'].includes(card.type) &&
            this.player.level > 1
          ) {
            const foundPreviousCard = previousCards.some(
              ({ type }) =>
                card.previousCards && card.previousCards.includes(type)
            )
            return !foundPreviousCard
          } else return this.isPreviousCardsIllegal(card, index)
        }
      }
    },
    // check previous card legal or not
    isPreviousCardsIllegal (card, index) {
      if (
        card.previousCards &&
        card.previousCards.includes(this.cards[index - 1].type)
      ) { return false }
      if (
        card.allowCards &&
        card.allowCards.includes(this.cards[index - 1].type)
      ) { return false }
      return true
    },
    isNextCardsIllegal (card, index) {
      if (card.nextCards && card.nextCards.includes(this.cards[index + 1].type)) { return false }
      if (
        card.allowCards &&
        card.allowCards.includes(this.cards[index + 1].type)
      ) { return false }

      return true
    },

    discardCard (index) {
      if (this.cardDiscarded.length < 3) {
        this.cardDiscarded.push(this.cards[index])
        this.cards[index] = this.allCards[0]
        this.allCards.splice(0, 1)
      }
      this.checkPositionOfCards()
    },
    /**
     * distribute Cards
     * get random cards into playtable
     */
    distributeCards (cards) {
      shuffleArray(cards)
      this.cards = cards.slice(0, this.numCardAllow)
      this.allCards = cards.slice(
        this.cards.length,
        this.originalCards.length - 1
      )
      this.autoArrangeOnce()
    }
  }
}

</script>

<style>
.w-1\/7 {
  width: 14.286%;
}
</style>
