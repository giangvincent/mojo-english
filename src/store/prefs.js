/**
 * Preferences module (T16). Local-first language preference only.
 * Audio is out of scope (Q6); no server calls.
 */
export default {
  namespaced: true,
  state: {
    language: 'en'
  },
  getters: {
    language: state => state.language
  },
  mutations: {
    setLanguage(state, value) {
      state.language = value;
    }
  },
  actions: {
    setLanguage({ commit }, value) { commit('setLanguage', value); }
  }
};