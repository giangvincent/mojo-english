export default {
  setCards: function(state, payload) {
    state.cards = payload;
  },
  setNounPhrase: function(state, payload) {
    state.nounPhrase.push(payload);
    state.choseWord[0] = state.nounPhrase;
  },
  setVerbPhrase: function(state, payload) {
    state.verbPhrase.push(payload);
    state.choseWord[1] = state.verbPhrase;
  },
  setObjectPhrase: function(state, payload) {
    state.objectPhrase.push(payload);
    state.choseWord[2] = state.objectPhrase;
  }
};
