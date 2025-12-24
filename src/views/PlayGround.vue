<template>
  <div class="flex flex-col items-center min-h-screen w-full pixel-bg overflow-y-auto py-4">
    <game-mode-selector v-if="showModeSelector" @select-mode="onModeSelected" />
    <tutorial-overlay v-if="showTutorial" @close="showTutorial = false" />
    <round-summary v-if="showRoundSummary" :round="currentRound" :score="roundScores[currentRound - 1] || 0"
      :totalScore="totalScore" :sentence="finalSentence" :winner="gameMode === 'coop' ? winner : ''"
      :xpEarned="lastXpEarned" :xpContext="lastXpContext" :xpCurrent="progressionXp" :xpToNext="progressionXpToNext"
      :level="progressionLevel || playerData.level" @next-round="handleNextRound" />
    <level-up-modal v-if="showLevelUpModal" :level="newLevel" :unlocks="newUnlocks" @close="showLevelUpModal = false" />

    <!-- Round Indicator & Mode Badge -->
    <div class="w-full px-4 pt-4 flex flex-wrap justify-between items-center relative text-slate-900 gap-2">
      <!-- Help Button -->
      <div class="absolute top-4 right-4 flex gap-2 z-10">
        <button
          class="pixel-icon-btn danger"
          @click="handleResetGame" :title="$t('common.reset')">
          &#8635;
        </button>
        <button class="pixel-icon-btn" @click="openSettings" :title="$t('common.settings')">
          ⚙
        </button>
        <button
          class="pixel-icon-btn"
          @click="showTutorial = true" :title="$t('common.how_to_play')">
          ?
        </button>
      </div>

      <div class="flex items-center gap-2">
        <div class="pixel-panel px-4 py-2">
          <span class="font-bold uppercase tracking-wider">{{ $t('playing.round') }} {{ currentRound }}</span> / {{ maxRounds }}
        </div>
        <!-- Game Mode Badge -->
        <div
          class="pixel-inset px-3 py-2 text-sm font-semibold uppercase tracking-wider">
          {{ $t(`modes.${gameMode}`) }}
        </div>
      </div>

      <div class="pixel-panel px-4 py-2">
        <span class="font-bold uppercase tracking-wider">{{ $t('playing.total_score') }}:</span> {{ totalScore }}
      </div>
      <div v-if="roundScores.length > 0" class="pixel-panel px-4 py-2">
        <span class="font-bold uppercase tracking-wider">{{ $t('playing.round_score') }}:</span> {{ roundScores[currentRound - 1] || 0 }}
      </div>
    </div>

    <!-- Shared Cards Area (5/4 Split) -->
    <div v-if="gameMode === '5-4-split' && sharedCardsList.length > 0" class="w-full px-4 mt-4">
      <div class="pixel-panel p-3">
        <h3 class="text-slate-900 text-sm font-bold uppercase tracking-wider mb-2">{{ $t('playing.shared_cards') }}</h3>
        <draggable v-model="sharedCardsList" class="flex justify-center gap-2 h-24" item-key="id" :sort="false"
          :group="{ name: 'shared', pull: false, put: false }" :move="() => false">
          <template #item="{ element }">
            <div class="h-full cursor-pointer">
              <card-container :card="element" :cardHeight="100" :canChooseWord="true" />
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <div class="w-full px-4 pt-6 mb-5 text-left">
      <div class="pixel-panel p-3 w-full relative" v-if="!isDragging">
        <span class="font-bold uppercase tracking-wider">{{ $t('playing.final_sentence') }}:</span>
        <div class="ml-2 inline">
          {{ typeof nounPhrase.text !== 'undefined' ? nounPhraseText : '' }}
          {{ typeof verbPhrase.text !== 'undefined' ? verbPhrase.text : '' }}
          {{ typeof objectPhrase.text !== 'undefined' ? objectPhrase.text + '.' : '' }}
          <div class="-mt-6 w-auto absolute top-0 whitespace-no-wrap pixel-chip">{{
            $t('playing.total_point') }}: {{ totalPoint }}</div>
        </div>

      </div>
    </div>
    <!-- Table -->
    <div ref="tablePlay" id="tablePlay"
      class="flex w-full px-2 sm:px-4 flex-1 relative items-center justify-center overflow-x-auto">
      <draggable element="div" v-model="cards" v-bind="dragOptions" @change="onSortCards"
        class="flex flex-row flex-nowrap items-center justify-center gap-1 sm:gap-2 w-full h-full min-w-fit"
        v-if="cards.length > 0" :disabled="!isDragging" item-key="id" @start="onDragStart" @end="onDragEnd">
        <template #item="{ element, index }">
          <span class="flex flex-row flex-no-wrap relative duration-300 transform h-full" :class="{
            '-translate-y-3': zeroPointCards.includes(element.id) && !isDragging,
          }" :data-card-ref="element.id" v-touch:swipe="swipeCard(element.id)" v-on:click.prevent>
            <card-container :card="element" :cardHeight="cardHeight"
              :canChooseWord="!zeroPointCards.includes(element.id)" :class="{
                'opacity-25': zeroPointCards.includes(element.id),
              }"></card-container>

            <discard-btn v-if="isDragging && cardDiscarded.length < 3" @click="discardCard(index)"></discard-btn>
            <replace-btn
              v-if="zeroPointCards.includes(element.id) && (cardDiscarded.length >= 3 || playingStep == 'choose-word')"
              @changeCard="changeCard" :cardIndex="index" :cardOb="element"></replace-btn>
          </span>
        </template>
      </draggable>
    </div>
    <!-- Player table -->
    <div class="mt-5 pb-5 flex justify-center w-full">
      <button v-if="isDragging === true"
        class="pixel-btn primary m-1 whitespace-no-wrap"
        @click="lockCardPosition()">
        {{ $t('playing.confirm_position') }}
      </button>
      <button v-if="isDragging === false"
        class="pixel-btn success m-1 whitespace-no-wrap"
        :disabled="isSentenceNotReady"
        @click="submitSentence()">
        {{ $t('playing.submit_sentence') }}
      </button>
    </div>
    <game-over v-if="playingStep === 'end'" :finalSentence="finalSentence" :finalPoint="finalPoint"></game-over>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import draggable from 'vuedraggable'
import CardContainer from '@/components/cards/CardContainer.vue'
import DiscardBtn from '@/components/cards/Buttons/DiscardBtn.vue'
import ReplaceBtn from '@/components/cards/Buttons/ReplaceBtn.vue'
import GameOver from '@/components/GameOver.vue'
import { mapActions, mapMutations, mapState } from 'vuex'
import { shuffleArray, capitalizeFirstLetter } from '@/helper'

function transformScroll(event) {
  if (!event.deltaY) {
    return
  }
  event.currentTarget.scrollLeft -= event.deltaY * 10
  event.preventDefault()
}

import SoundManager from '@/utils/soundManager'
import { getTimeSymbol } from '@/utils/timeRules'
import { applyPvpEffect } from '@/utils/pvpEffects'
import { calculateXpFromContext } from '@/utils/xp'

export default {
  name: 'PlayGround',
  components: {
    CardContainer,
    DiscardBtn,
    ReplaceBtn,
    draggable,
    GameOver,
    GameModeSelector: defineAsyncComponent(() => import('@/components/GameModeSelector.vue')),
    RoundSummary: defineAsyncComponent(() => import('@/components/RoundSummary.vue')),
    TutorialOverlay: defineAsyncComponent(() => import('@/components/TutorialOverlay.vue')),
    LevelUpModal: defineAsyncComponent(() => import('@/components/LevelUpModal.vue')),
  },
  data() {
    return {
      numCardAllow: 7,
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
      dragging: false,
      sentenceStartAllowed: ['TimeCard', 'Location'],
      sentenceStartFollowups: ['Noun', 'Adj', 'HelpingVerb'],
      discardLimit: 3,
      draggedCardRef: null,
      lastXpEarned: 0,
      lastXpContext: {},
      invalidPlacementWarnings: 0,
      invalidWarningLocked: false,

      // Round tracking
      originalCardsSnapshot: null,
      cardsModified: false,

      // Game Mode
      showModeSelector: true,
      showRoundSummary: false,
      showTutorial: false,
      sharedCardsList: [],
      initialSharedCardIds: [],
      usedSharedCardIds: [],

      // Economy & Progression
      matchCombos: [], // Track unique combos used in match
      badGrammarPenalties: 0,
      invalidPlacementPenaltyCount: 0,
      penaltyThreshold: 3,
      penaltyAmount: 5,

      // Level Up
      showLevelUpModal: false,
      newLevel: 1,
      newUnlocks: []
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
      playingStep: state => state.playing.playingStep,
      // Game mode & rounds
      gameMode: state => state.playing.gameMode,
      currentRound: state => state.playing.currentRound,
      maxRounds: state => state.playing.maxRounds,
      roundScores: state => state.playing.roundScores,
      totalScore: state => state.playing.totalScore,
      usedOriginalCards: state => state.playing.usedOriginalCards,
      sharedCards: state => state.playing.sharedCards,
      trackTurnOrder: state => state.playing.trackTurnOrder,
      turnHistory: state => state.playing.turnHistory,
      lastPlayerWhoAddedCard: state => state.playing.lastPlayerWhoAddedCard,
      winner: state => state.playing.winner,
      progressionLevel: state => state.progression.level,
      progressionXp: state => state.progression.xp,
      progressionXpToNext: state => state.progression.xpToNext
    }),
    dragOptions() {
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
    nounPhrase() {
      this.caculatePoint()
      this.checkSentenceReady()
      this.noteCardPlayed(this.nounPhrase)
    },
    verbPhrase() {
      this.caculatePoint()
      this.checkSentenceReady()
      this.noteCardPlayed(this.verbPhrase)
    },
    objectPhrase() {
      this.caculatePoint()
      this.checkSentenceReady()
      this.noteCardPlayed(this.objectPhrase)
    },
    isDragging(newValue) {
      if (newValue) {
        this.delayedDragging = true
        this.checkPositionOfCards()
        return
      }
      this.$nextTick(() => {
        this.delayedDragging = false
      })
    },
    progressionLevel(newVal, oldVal) {
      if (newVal > oldVal && oldVal > 0) {
        this.newLevel = newVal
        // Fetch unlocks for this level (we need a helper or just get from store if we tracked 'new' unlocks)
        // For now, let's just use the utility directly or assume store has them.
        // We can import getUnlocksForLevel here or add a getter.
        // Let's import the utility.
        import('@/utils/unlocks').then(({ getUnlocksForLevel }) => {
          this.newUnlocks = getUnlocksForLevel(newVal)
          this.showLevelUpModal = true
          SoundManager.play('win') // Reuse win sound or add levelup sound
        })
      }
    }
  },
  created() {
    // Calculate card dimensions based on viewport
    const screenHeight = this.scr_height
    const screenWidth = window.innerWidth

    // For 7 cards, we need to calculate width that fits comfortably
    // Card aspect ratio is ~1.6:1 (width:height)
    const maxCardWidth = (screenWidth * 0.85) / 7
    const maxCardHeight = screenHeight * 0.55

    // Use the smaller dimension to ensure cards fit properly
    this.cardHeight = Math.min(maxCardHeight, maxCardWidth * 1.6)
    this.cardWidth = this.cardHeight / 1.6

    // Don't distribute immediately, wait for mode selection
    // this.distributeCards(this.originalCards)

    // Track original cards for bonus calculation
    this.cardsModified = false

    // Initialize missions
    this.initializeMissions()
  },
  mounted() {
    const element = this.$refs.tablePlay
    element.addEventListener('wheel', transformScroll)
  },
  methods: {
    ...mapMutations(['SET_MODAL', 'setPlayingStep', 'resetSentence', 'addRoundScore', 'nextRound', 'resetGame', 'setUsedOriginalCards', 'setGameMode', 'setSharedCards', 'setTrackTurnOrder', 'recordTurn', 'resetTurns', 'setWinner']),
    ...mapActions(['SetPlayerDataAsync', 'awardFromContext', 'gainXp', 'initializeMissions', 'onSentenceSubmit', 'onRoundComplete', 'onMatchComplete']),

    openSettings() {
      this.SET_MODAL(true)
    },

    onModeSelected(mode) {
      this.setGameMode(mode)
      this.setTrackTurnOrder(mode === 'coop')
      this.resetTurns()
      this.setWinner(null)
      this.showModeSelector = false

      // Show tutorial on first load (could be persisted)
      this.showTutorial = true

      this.syncNumCardsWithMode()

      // Reset discard counter per round explicitly for clarity
      this.cardDiscarded = []
      this.discardLimit = 3
      this.usedSharedCardIds = []

      this.distributeCards(this.originalCards)
    },

    submitSentence() {
      const usedCardIds = this.getUsedCardIdsInSentence()
      // Validation for 5/4 Split Mode
      if (this.gameMode === '5-4-split') {
        const sharedUsedThisSentence = usedCardIds.filter(id => this.initialSharedCardIds.includes(id))
        const hasSharedCard = sharedUsedThisSentence.length > 0

        if (!hasSharedCard) {
          alert(this.$t('playing.must_use_shared'))
          SoundManager.play('error')
          return
        }

        // Track shared usage across rounds and enforce all shared cards by final round
        sharedUsedThisSentence.forEach(id => {
          if (!this.usedSharedCardIds.includes(id)) {
            this.usedSharedCardIds.push(id)
          }
        })

        if (this.currentRound >= this.maxRounds) {
          const missingShared = this.initialSharedCardIds.filter(id => !this.usedSharedCardIds.includes(id))
          if (missingShared.length > 0) {
          alert(this.$t('playing.must_use_all_shared'))
          SoundManager.play('error')
          return
        }
        }
      }

      SoundManager.play('success')
      let roundScore = this.totalPoint

      // +5 bonus if player used all 7 original cards without discarding
      if (!this.cardsModified && this.cards.length === 7) {
        roundScore += 5
        console.log('Bonus +5 for using all 7 original cards!')
      }

      // Apply PvP card effects if present in the built sentence
      usedCardIds.forEach(id => {
        const card = this.findCardById(id)
        if (card && card.pvpEffect) {
          roundScore = applyPvpEffect(card.pvpEffect, {
            roundScore,
            cards: this.cards,
            sharedCards: this.sharedCardsList,
            discarded: this.cardDiscarded
          })
        }
      })

      // Add this round's score (after PvP effects)
      this.addRoundScore(roundScore)

      // Calculate Combos
      const usedCards = usedCardIds.map(id => this.findCardById(id))
      const currentCombos = this.detectCombos(usedCards)

      // Add unique combos to match tracking
      currentCombos.forEach(c => {
        if (!this.matchCombos.includes(c)) {
          this.matchCombos.push(c)
        }
      })

      // Calculate Penalties
      let penalties = 0
      // Bad grammar penalty (placeholder for now, would come from API check)
      // if (badGrammar) penalties += 2

      // Invalid placement penalty
      if (this.invalidPlacementWarnings >= this.penaltyThreshold) {
        penalties += this.penaltyAmount
        // Reset warnings after penalty? Or keep punishing? Spec says "3x invalid placement warning -5".
        // Usually implies per match or per occurrence. Let's assume once per threshold hit.
        // For now, we just subtract. Logic in checkPositionOfCards handles incrementing warnings.
        // We might want to track if penalty already applied for this set of warnings.
        // Simplified: Just calculate total penalty based on count / 3
        const penaltyCount = Math.floor(this.invalidPlacementWarnings / this.penaltyThreshold)
        if (penaltyCount > this.invalidPlacementPenaltyCount) {
          penalties += (penaltyCount - this.invalidPlacementPenaltyCount) * this.penaltyAmount
          this.invalidPlacementPenaltyCount = penaltyCount
        }
      }

      const xpContext = {
        correctSentence: true, // Assumed if submitted successfully (client-side validation passed)
        usedAllSeven: !this.cardsModified && this.cards.length === 7,
        correctTense: true, // Placeholder: need to validate against requested tense if applicable
        bonusCombos: currentCombos.length,
        finishedMatch: false,
        wonMatch: false,
        dailyReward: 0,
        weeklyReward: 0,
        penalties: penalties,
        badGrammarPenalty: 0,
        invalidPlacementPenalty: penalties,
        multiplier: this.$store.state.progression.xpMultiplier || 1,

        // Context for missions/achievements
        sentenceBuilt: true,
        tense: this.curTense, // Assuming this tracks the current tense
        cardsUsed: usedCards,
        bonusPoints: roundScore - this.totalPoint, // Approx bonus
        perfectRound: !this.cardsModified && this.cards.length === 7,
        sentenceText: this.finalSentence,
        combos: currentCombos
      }

      this.lastXpEarned = calculateXpFromContext(xpContext)
      this.lastXpContext = xpContext
      this.awardFromContext(xpContext)

      // Dispatch events
      this.onSentenceSubmit(xpContext)
      this.onRoundComplete(xpContext)

      // Store sentence for display
      this.finalSentence = this.nounPhraseText + ' ' + this.verbPhrase.text + ' ' + this.objectPhrase.text + '.'
      this.finalPoint = roundScore

      if (this.gameMode === 'coop' && this.trackTurnOrder) {
        this.setWinner(this.lastPlayerWhoAddedCard || (this.player?.name || 'local-player'))
      }

      // Check win conditions
      if (this.totalScore >= 200) {
        // Player reached 200 points
        console.log('Game Over! Reached 200 points!')
        this.endGame(true)
      } else if (this.currentRound >= this.maxRounds) {
        // Completed all rounds
        console.log('Game Over! Completed all rounds!')
        SoundManager.play('win')
        this.endGame(true)
      } else {
        // Continue to next round
        console.log(`Round ${this.currentRound} complete! Score: ${roundScore}`)
        SoundManager.play('success')
        this.showRoundSummaryAndContinue()
      }
    },
    handleResetGame() {
      this.resetGame()
      this.cards = []
      this.allCards = []
      this.sharedCardsList = []
      this.initialSharedCardIds = []
      this.usedSharedCardIds = []
      this.zeroPointCards = []
      this.cardDiscarded = []
      this.showModeSelector = true
      this.showRoundSummary = false
      this.showTutorial = false
      this.isDragging = true
      this.numCardAllow = 7
      this.setTrackTurnOrder(false)
      this.resetTurns()
      this.setWinner(null)
      this.invalidPlacementWarnings = 0
      this.invalidWarningLocked = false
    },
    showRoundSummaryAndContinue() {
      // Show round summary modal
      this.showRoundSummary = true
    },
    handleNextRound() {
      this.showRoundSummary = false
      this.startNextRound()
    },
    startNextRound() {
      // Advance to next round
      this.nextRound()

      // Reset game state for new round
      this.resetSentence()
      this.totalPoint = 0
      this.isSentenceNotReady = true
      this.isDragging = true
      this.cardDiscarded = []
      this.zeroPointCards = []
      this.setWinner(null)
      this.invalidPlacementWarnings = 0
      this.invalidWarningLocked = false
      this.syncNumCardsWithMode()

      // Deal new cards
      this.distributeCards(this.originalCards)

      console.log(`Starting Round ${this.currentRound}`)
    },
    endGame(isWin = false) {
      // Update player total points
      this.SetPlayerDataAsync({ point: this.player.point + this.totalScore })

      const context = {
        finishedMatch: true,
        wonMatch: isWin,
        matchesWon: isWin ? 1 : 0,
        score: this.totalScore,
        matchCombos: this.matchCombos
      }

      this.onMatchComplete(context)

      // Show game over screen
      this.setPlayingStep('end')
    },
    caculatePoint() {
      this.totalPoint = 0
      this.addPoint(this.nounPhrase)
      this.addPoint(this.verbPhrase)
      this.addPoint(this.objectPhrase)
    },
    addPoint(objPhrase) {
      if (objPhrase && Object.keys(objPhrase).length > 0 && objPhrase.constructor === Object) {
        this.totalPoint += objPhrase.point ? objPhrase.point : 0
        this.caculateBonusPoint(objPhrase.bonus ? objPhrase.bonus : [])
      }
    },
    caculateBonusPoint(bonusObj) {
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
      function canAddBonusPoint(word, type) {
        let cardString = ''
        self.cards.forEach(card => {
          if (self.getEffectiveCardType(card) === type && !self.zeroPointCards.includes(card.id)) {
            cardString = JSON.stringify(card)
          }
        })

        if (cardString.indexOf(word) > -1) {
          return true
        }
        return false
      }
    },
    detectCombos(cards) {
      const combos = []

      // Check for Noun + ExtraInformation
      if (cards.some(c => c.type === 'Noun') && cards.some(c => c.type === 'ExtraInformation')) {
        combos.push('Noun+Extra')
      }

      // Check for Verb + Adverb
      if (cards.some(c => c.type === 'Verb') && cards.some(c => c.type === 'Adverb')) {
        combos.push('Verb+Adverb')
      }

      // Check for Verb + Location
      if (cards.some(c => c.type === 'Verb') && cards.some(c => c.type === 'Location')) {
        combos.push('Verb+Location')
      }

      // Check for Adjective + Noun
      if (cards.some(c => c.type === 'Adj') && cards.some(c => c.type === 'Noun')) {
        combos.push('Adj+Noun')
      }

      // Check for TimeCard + Location
      if (cards.some(c => c.type === 'TimeCard') && cards.some(c => c.type === 'Location')) {
        combos.push('Time+Location')
      }

      // Check for HelpingVerb + Verb
      if (cards.some(c => c.type === 'HelpingVerb') && cards.some(c => c.type === 'Verb')) {
        combos.push('Helping+Verb')
      }

      return combos
    },
    checkSentenceReady() {
      if (
        this.nounPhrase && Object.keys(this.nounPhrase).length > 0 &&
        this.verbPhrase && Object.keys(this.verbPhrase).length > 0 &&
        this.objectPhrase && Object.keys(this.objectPhrase).length > 0
      ) {
        this.isSentenceNotReady = false
      } else this.isSentenceNotReady = true
    },
    swipeCard(param) {
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
    changeCard(value) {
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
    setPointToZero(card) {
      const zeroPointCard = { ...card }

      // Cards with content array containing point property
      const cardTypesWithContentPoint = ['TimeCard', 'Verb', 'HelpingVerb', 'Conj']
      if (cardTypesWithContentPoint.includes(card.type) && card.content) {
        zeroPointCard.content = card.content.map(content => ({
          ...content,
          point: 0,
          // Handle nested texts array in HelpingVerb
          texts: content.texts ? content.texts.map(t => ({ ...t })) : undefined
        }))
      }

      // Cards with single point property
      const cardTypesWithSinglePoint = ['Location', 'Adj', 'Adverb', 'ExtraInformation', 'Prep']
      if (cardTypesWithSinglePoint.includes(card.type)) {
        zeroPointCard.point = 0
      }

      // Noun cards with singular and plural points
      if (card.type === 'Noun') {
        zeroPointCard.singular = { ...card.singular, point: 0 }
        zeroPointCard.plural = { ...card.plural, point: 0 }
      }

      return zeroPointCard
    },
    onSortCards(evt) {
      this.logDragReference(evt)
      if (evt && evt.moved && evt.moved.element) {
        this.ensureWildAssignment(evt.moved.element, evt.moved.newIndex)
      }
      if (evt && evt.added && evt.added.element) {
        this.ensureWildAssignment(evt.added.element, evt.added.newIndex)
      }
      this.checkPositionOfCards()
    },
    onDragStart(evt) {
      this.draggedCardRef = this.extractDragRef(evt)
      if (this.draggedCardRef) {
        console.log(`Dragging card: ${this.draggedCardRef}`)
      }
    },
    onDragEnd(evt) {
      const ref = this.extractDragRef(evt) || this.draggedCardRef
      if (ref) {
        console.log(`Dropped card: ${ref}`)
      }
      this.draggedCardRef = null
    },
    lockCardPosition() {
      console.log('Lock cards position')
      this.isDragging = false
      this.setPlayingStep('choose-word')
    },
    autoArrangeOnce() {
      let temp = null
      this.cards.forEach((card, index) => {
        if (
          this.sentenceStartAllowed.includes(card.type) &&
          index !== 0 &&
          !this.sentenceStartAllowed.includes(this.cards[0].type)
        ) {
          temp = this.cards[0]
          this.cards[0] = card
          this.cards[index] = temp
        }
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
    checkPositionOfCards() {
      const previousCards = []
      this.zeroPointCards = []
      this.illegalCardPosition = []
      this.cards.forEach((card, index) => {
        this.hydrateCardRules(card)
        this.ensureWildAssignment(card, index)
        if (this.isIllegalCard(card, index, previousCards)) {
          this.zeroPointCards.push(card.id)
          this.illegalCardPosition.push(index)
          if (!this.invalidWarningLocked) {
            this.invalidPlacementWarnings += 1
            this.invalidWarningLocked = true
          }
        } else {
          this.illegalCardPosition.push(index)
        }

        previousCards.push(card)
      })
      if (this.zeroPointCards.length === 0) {
        this.invalidWarningLocked = false
      }
      // this.zeroPointCards = this.zeroPointCards.filter(onlyUnique);
    },
    isIllegalCard(card, index, previousCards) {
      const effectiveType = this.getEffectiveCardType(card)
      const isStartAllowed = this.sentenceStartAllowed.includes(effectiveType)
      if (index > 0 && index < this.numCardAllow - 1) {
        return (
          this.isPreviousCardsIllegal(card, index, previousCards) &&
          this.isNextCardsIllegal(card, index)
        )
      } else {
        if (index === 0) {
          return this.isNextCardsIllegal(card, index, isStartAllowed)
        }
        if (index === this.numCardAllow - 1) {
          /**
           * check the last card
           * if all the previous cards is allowed and the last card must be Location, Time or Extra Information
           * else check last card like a normal card
           */
          if (
            ['Location', 'TimeCard', 'ExtraInformation'].includes(effectiveType) &&
            this.player.level > 1
          ) {
            const foundPreviousCard = previousCards.some(
              (previousCard) =>
                card.previousCards && this.matchesAllowedType(card.previousCards, previousCard)
            )
            return !foundPreviousCard
          } else return this.isPreviousCardsIllegal(card, index, previousCards)
        }
      }
      return false
    },
    // check previous card legal or not
    isPreviousCardsIllegal(card, index, previousCards = []) {
      const previousCard = this.cards[index - 1]
      if (!previousCard) { return false }
      if (!this.isModifierAllowed(previousCard, card) || !this.isModifierAllowed(card, previousCard)) { return true }

      if (this.matchesAllowedType(card.previousCards, previousCard)) {
        return !this.areTimeSymbolsCompatible(previousCard, card)
      }
      if (this.matchesAllowedType(card.allowCards, previousCard)) {
        return !this.areTimeSymbolsCompatible(previousCard, card)
      }

      // Allow inversion if the sentence starts with a time/location card
      if (
        index - 1 === 0 &&
        this.sentenceStartAllowed.includes(this.getEffectiveCardType(previousCard)) &&
        this.sentenceStartFollowups.includes(this.getEffectiveCardType(card))
      ) {
        return false
      }

      // Multi-match support: allow any earlier card that satisfies the rule
      if (this.cardSupportsMultiMatch(card)) {
        const earlierMatch = previousCards.some(
          prev => this.matchesAllowedType(card.previousCards, prev) || this.matchesAllowedType(card.allowCards, prev)
        )
        if (earlierMatch) { return false }
      }

      return true
    },
    isNextCardsIllegal(card, index, fromSentenceStart = false) {
      const nextCard = this.cards[index + 1]
      if (!nextCard) { return false }
      if (!this.isModifierAllowed(nextCard, card) || !this.isModifierAllowed(card, nextCard)) { return true }

      if (fromSentenceStart &&
        this.sentenceStartFollowups.includes(this.getEffectiveCardType(nextCard))) {
        return false
      }
      if (this.matchesAllowedType(card.nextCards, nextCard)) {
        return !this.areTimeSymbolsCompatible(card, nextCard)
      }
      if (this.matchesAllowedType(card.allowCards, nextCard)) {
        return !this.areTimeSymbolsCompatible(card, nextCard)
      }

      if (this.cardSupportsMultiMatch(card)) {
        const futureMatch = this.cards.slice(index + 1).some(
          futureCard => this.matchesAllowedType(card.nextCards, futureCard) || this.matchesAllowedType(card.allowCards, futureCard)
        )
        if (futureMatch) { return false }
      }

      return true
    },

    discardCard(index) {
      SoundManager.play('click')
      if (this.cardDiscarded.length >= this.discardLimit) {
        SoundManager.play('error')
        return
      }
      if (!this.cards[index]) {
        SoundManager.play('error')
        return
      }
      this.cardDiscarded.push(this.cards[index])
      const replacement = this.allCards.shift()
      if (replacement) {
        this.cards[index] = replacement
      }

      // Mark that cards have been modified (no +5 bonus)
      this.cardsModified = true
      this.checkPositionOfCards()
    },
    hydrateCardRules(card) {
      if (!card || card._rulesHydrated) return
      if (Array.isArray(card.condition)) {
        const adverbConditions = card.condition.filter(cond => cond.type === 'Adverb' && cond.symbol)
        if (adverbConditions.length) {
          const allowed = new Set(card.allowedModifiers || [])
          adverbConditions.forEach(cond => allowed.add(cond.symbol))
          card.allowedModifiers = Array.from(allowed)
        }
      }
      card._rulesHydrated = true
    },
    cardSupportsMultiMatch(card) {
      return !!(
        card &&
        (
          (Array.isArray(card.previousCards) && card.previousCards.some(Array.isArray)) ||
          (Array.isArray(card.nextCards) && card.nextCards.some(Array.isArray)) ||
          card.allowMultiMatch === true
        )
      )
    },
    normalizeCardType(type) {
      return (type || '').toString().trim().toLowerCase()
    },
    getEffectiveCardType(card) {
      if (!card) return ''
      return card.assignedType || card.type || ''
    },
    matchesAllowedType(allowedTypes, neighborCard) {
      if (!allowedTypes || !neighborCard) { return false }
      const neighborType = this.normalizeCardType(this.getEffectiveCardType(neighborCard))
      const rules = Array.isArray(allowedTypes) ? allowedTypes : [allowedTypes]
      return rules.some(rule => {
        if (!rule) return false
        if (Array.isArray(rule)) {
          return rule.some(r => this.normalizeCardType(r) === neighborType)
        }
        if (typeof rule === 'object' && rule.any) {
          return rule.any.some(r => this.normalizeCardType(r) === neighborType)
        }
        return this.normalizeCardType(rule) === neighborType
      })
    },
    isWildCard(card) {
      return card && (card.type === 'Wild' || card.type === 'WildCard')
    },
    ensureWildAssignment(card, index) {
      if (!this.isWildCard(card)) { return }
      if (card.assignedType) { return }
      const neighbors = []
      if (this.cards[index - 1]) neighbors.push(this.getEffectiveCardType(this.cards[index - 1]))
      if (this.cards[index + 1]) neighbors.push(this.getEffectiveCardType(this.cards[index + 1]))
      const allowedTypes = [
        ...(Array.isArray(card.previousCards) ? card.previousCards : (card.previousCards ? [card.previousCards] : [])),
        ...(Array.isArray(card.nextCards) ? card.nextCards : (card.nextCards ? [card.nextCards] : [])),
        ...(Array.isArray(card.allowCards) ? card.allowCards : (card.allowCards ? [card.allowCards] : []))
      ]
      const candidate = neighbors.find(type => this.matchesAllowedType(allowedTypes, { type }))
        || (allowedTypes.length > 0 ? allowedTypes[0] : neighbors[0])
      card.assignedType = Array.isArray(candidate) ? candidate[0] : candidate || 'Noun'
    },
    isModifierAllowed(modifierCard, targetCard) {
      if (!modifierCard || !targetCard) { return true }
      const modifierType = this.getEffectiveCardType(modifierCard)
      if (modifierType !== 'Adverb') { return true }
      const adverbSymbol = modifierCard.symbol
      const allowedModifiers = targetCard.allowedModifiers || []
      const adverbConditions = Array.isArray(targetCard.condition) ? targetCard.condition.filter(cond => cond.type === 'Adverb') : []
      if (allowedModifiers.length > 0) {
        return allowedModifiers.includes(adverbSymbol)
      }
      if (adverbConditions.length > 0) {
        return adverbConditions.some(cond => !cond.symbol || cond.symbol === adverbSymbol)
      }
      return true
    },
    areTimeSymbolsCompatible(cardA, cardB) {
      if (!cardA || !cardB) return true
      const symbolA = getTimeSymbol(cardA.timeSymbol || cardA.tense || cardA.curTense)
      const symbolB = getTimeSymbol(cardB.timeSymbol || cardB.tense || cardB.curTense)
      if (!symbolA || !symbolB) return true
      return symbolA === symbolB
    },
    extractDragRef(evt) {
      if (!evt || !evt.item) return null
      if (evt.item.dataset && evt.item.dataset.cardRef) {
        return evt.item.dataset.cardRef
      }
      if (evt.item.__draggable_context && evt.item.__draggable_context.element) {
        return evt.item.__draggable_context.element.id
      }
      return evt.item.id || null
    },
    logDragReference(evt) {
      const ref = (evt && evt.moved && evt.moved.element && evt.moved.element.id) ||
        (evt && evt.added && evt.added.element && evt.added.element.id)
      if (ref) {
        this.draggedCardRef = ref
        console.log(`Reordered card: ${ref}`)
      }
    },
    getUsedCardIdsInSentence() {
      return [
        this.nounPhrase?.cardId,
        this.verbPhrase?.cardId,
        this.objectPhrase?.cardId
      ].filter(Boolean)
    },
    findCardById(id) {
      if (!id) return null
      return this.cards.find(c => c.id === id) ||
        this.sharedCardsList.find(c => c.id === id) ||
        this.allCards.find(c => c.id === id) ||
        null
    },
    noteCardPlayed(phrase) {
      if (!this.trackTurnOrder || !phrase || !phrase.cardId) return
      const playerId = this.player?.name || this.player?.id || 'local-player'
      this.recordTurn({
        playerId,
        cardId: phrase.cardId,
        round: this.currentRound,
        timestamp: Date.now()
      })
    },
    /**
     * distribute Cards
     * get random cards into playtable
     */
    distributeCards(cards) {
      SoundManager.play('deal')
      shuffleArray(cards)

      this.syncNumCardsWithMode()

      if (this.gameMode === '5-4-split') {
        if (this.initialSharedCardIds.length === 0) {
          // First deal: set shared cards
          this.sharedCardsList = cards.slice(5, 9)
          this.initialSharedCardIds = this.sharedCardsList.map(c => c.id)
          this.usedSharedCardIds = []
          this.setSharedCards(this.sharedCardsList)
        }

        // Remove shared cards from the draw pile to keep them immutable
        const remainingDeck = cards.filter(card => !this.initialSharedCardIds.includes(card.id))
        this.cards = remainingDeck.slice(0, 5)
        this.allCards = remainingDeck.slice(5)
      } else {
        // Standard / Co-op: Deal 7 to hand
        this.cards = cards.slice(0, this.numCardAllow)
        this.allCards = cards.slice(this.cards.length)
        this.initialSharedCardIds = []
        this.sharedCardsList = []
        this.setSharedCards([])
      }

      this.autoArrangeOnce()
    },
    syncNumCardsWithMode() {
      this.numCardAllow = this.gameMode === '5-4-split' ? 5 : 7
    },
    buildXpContext(roundScore) {
      const correctSentence = !this.isSentenceNotReady && this.zeroPointCards.length === 0
      const usedAllSeven = this.numCardAllow === 7 && !this.cardsModified
      const correctTense = !!this.verbPhrase
      const bonusCombos = [
        this.nounPhrase?.bonus,
        this.objectPhrase?.bonus,
        this.verbPhrase?.bonus
      ].filter(Boolean).length
      const finishedMatch = this.currentRound >= this.maxRounds
      const wonMatch = finishedMatch // single-player or co-op treated as completion
      const grammarPenalties = correctSentence ? 0 : 2
      const placementPenalties = Math.floor(this.invalidPlacementWarnings / 3) * 5
      const penalties = grammarPenalties + placementPenalties

      return {
        correctSentence,
        usedAllSeven,
        correctTense,
        bonusCombos,
        finishedMatch,
        wonMatch,
        penalties,
        finishedRoundScore: roundScore,
        multiplier: this.$store.state.progression?.xpMultiplier || 1
      }
    }
  }
}

</script>

<style scoped>
.flip-list-move {
  transition: transform 0.5s;
}

.flip-list-enter-active,
.flip-list-leave-active {
  transition: all 0.5s ease;
}

.flip-list-enter-from,
.flip-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>

<style>
.w-1\/7 {
  width: 14.286%;
}
</style>
