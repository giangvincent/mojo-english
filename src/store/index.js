import Vue from "vue";
import Vuex from "vuex";
import mutations from "./mutations.js"
import actions from "./actions.js"
import states from "./states.js"

import playing from "./playing"
import player from "./player"

Vue.use(Vuex);

export default new Vuex.Store({
  state: states,
  mutations: mutations,
  actions: actions,
  modules: {
    playing,
    player
  }
});
