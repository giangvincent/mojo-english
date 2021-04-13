export default {
  setCards: function (state, payload) {
    state.cards = payload;
  },
  setPlayingStep: function (state, payload) {
    state.playingStep = payload
  },
  setTense: function (state, payload) {
    state.curTense = payload
  },
  setNounType: function (state, payload) {

    state.nounType = payload
  },
  setNounPhrase: function (state, payload) {
    state.nounPhrase = payload
    // state.nounPhrase.push(payload);
    state.choseWords[0] = state.nounPhrase;
    console.log(state.choseWords)
  },
  setVerbPhrase: function (state, payload) {
    state.verbPhrase = payload
    // state.verbPhrase.push(payload);
    state.choseWords[1] = state.verbPhrase;
    console.log(state.choseWords)
  },
  setObjectPhrase: function (state, payload) {
    state.objectPhrase = payload
    // state.objectPhrase.push(payload);
    state.choseWords[2] = state.objectPhrase;
  }
};
