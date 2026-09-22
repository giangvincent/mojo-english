import { createStore } from 'vuex'
import mutations from './mutations.js'
import actions from './actions.js'
import states from './states.js'

import playing from './playing'
import player from './player'
import progression from './progression'
import multiplayer from './multiplayer'
import prefs from './prefs'
import { createLocalPersist } from './persist'

const store = createStore({
  state: states,
  mutations: mutations,
  actions: actions,
  modules: {
    playing,
    player,
    progression,
    multiplayer,
    prefs
  }
})

// T16: local-first persistence — restore before first render, persist on change.
const { persist, restore } = createLocalPersist(store)
restore()
store.subscribe(() => persist())

export default store
