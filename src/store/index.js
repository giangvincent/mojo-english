import { createStore } from 'vuex'
import mutations from './mutations.js'
import actions from './actions.js'
import states from './states.js'

import playing from './playing'
import player from './player'
import progression from './progression'
import multiplayer from './multiplayer'

export default createStore({
  state: states,
  mutations: mutations,
  actions: actions,
  modules: {
    playing,
    player,
    progression,
    multiplayer
  }
})
