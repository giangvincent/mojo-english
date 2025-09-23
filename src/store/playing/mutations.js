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
  }
}
