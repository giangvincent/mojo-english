export default {
  setCards: function (state, payload) {
    state.cards = payload;
  },
  setNounType: function (state, payload) {
    state.nounType = payload
  },
  setNounPhrase: function (state, payload) {
    state.nounPhrase.push(payload);
    state.choseWords[0] = state.nounPhrase;
  },
  setVerbPhrase: function (state, payload) {
    state.verbPhrase.push(payload);
    state.choseWords[1] = state.verbPhrase;
  },
  setObjectPhrase: function (state, payload) {
    state.objectPhrase.push(payload);
    state.choseWords[2] = state.objectPhrase;
  }
};
