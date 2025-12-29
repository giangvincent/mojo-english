import { login, register } from '@/services/auth'

export default {
  SetPlayerDataAsync: function ({ commit }, payload) {
    commit('setPlayerData', payload)
  },

  async loginPlayer({ commit }, { email, password }) {
    try {
      const result = await login(email, password)
      if (result.user) {
        const userData = {
            id: result.user.uid,
            name: result.user.displayName || 'Player',
            photo: { src: result.user.photoURL || '' },
            level: 0
        }
        commit('setPlayerData', userData)
        return true
      }
      return false
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  },

  async registerPlayer({ commit }, { email, password, name }) {
    try {
        const result = await register(email, password, name)
        if (result.user) {
            const userData = {
                id: result.user.uid,
                name: result.user.displayName || name,
                photo: { src: result.user.photoURL || '' },
                level: 0
            }
            commit('setPlayerData', userData)
            return true
        }
        return false
    } catch (error) {
        console.error('Registration failed:', error)
        throw error
    }
  },

  logoutPlayer({ commit }) {
      const defaultData = {
          id: 'guest',
          name: 'Guest Player',
          photo: null,
          level: 0
      }
      commit('setPlayerData', defaultData)
  }
}
