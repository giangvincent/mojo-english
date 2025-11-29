export default {
  setCards: function (state, payload) {
    state.cards = payload
  },
  setPlayingStep: function (state, payload) {
    state.playingStep = payload
  },
  setTense: function (state, payload) {
    if (payload !== state.curTense) {
      state.curTense = payload
      state.verbPhrase = []
      state.objectPhrase = []
    }
  },
  setNounType: function (state, payload) {
    if (payload !== state.nounType) {
      state.nounType = payload
      state.verbPhrase = []
      state.objectPhrase = []
    }
  },
  setNounPhrase: function (state, payload) {
    state.nounPhrase = payload
  },
  setVerbPhrase: function (state, payload) {
    state.verbPhrase = payload
  },
  setObjectPhrase: function (state, payload) {
    state.objectPhrase = payload
  },
  resetSentence: function (state, payload) {
    state.playingStep = 'arrange-card'
    state.nounPhrase = []
    state.verbPhrase = []
    state.objectPhrase = []
    state.nounType = null
    state.curTense = null
  },
  // Game Mode & Round Management
  setGameMode: function (state, payload) {
    state.gameMode = payload
  },
  setCurrentRound: function (state, payload) {
    state.currentRound = payload
  },
  addRoundScore: function (state, payload) {
    state.roundScores.push(payload)
    state.totalScore = state.roundScores.reduce((sum, score) => sum + score, 0)
  },
  nextRound: function (state) {
    state.currentRound += 1
    // Reset for next round
    state.nounPhrase = []
    state.verbPhrase = []
    state.objectPhrase = []
    state.nounType = null
    state.curTense = null
    state.playingStep = 'arrange-card'
    state.turnHistory = []
    state.lastPlayerWhoAddedCard = null
  },
  resetGame: function (state) {
    state.currentRound = 1
    state.roundScores = []
    state.totalScore = 0
    state.nounPhrase = []
    state.verbPhrase = []
    state.objectPhrase = []
    state.nounType = null
    state.curTense = null
    state.playingStep = 'arrange-card'
    state.usedOriginalCards = true
    state.turnHistory = []
    state.lastPlayerWhoAddedCard = null
    state.winner = null
  },
  setUsedOriginalCards: function (state, payload) {
    state.usedOriginalCards = payload
  },
  setOriginalCardsHash: function (state, payload) {
    state.originalCardsHash = payload
  },
  setSharedCards: function (state, payload) {
    state.sharedCards = payload
  },
  // Turn / winner tracking (Co-op & PvP)
  setTrackTurnOrder: function (state, payload) {
    state.trackTurnOrder = payload
  },
  recordTurn: function (state, payload) {
    state.turnHistory.push(payload)
    state.lastPlayerWhoAddedCard = payload.playerId
  },
  resetTurns: function (state) {
    state.turnHistory = []
    state.lastPlayerWhoAddedCard = null
  },
  setWinner: function (state, payload) {
    state.winner = payload
  }
}
