import { login, register } from '@/services/auth'

export default {
  SetPlayerDataAsync: function ({ commit }, payload) {
    commit('setPlayerData', payload)
  },

  async loginPlayer({ commit }, { email, password }) {
    try {
      const result = await login({ email, password })
      if (result.user) {
        const userData = {
          id: result.user.id || result.user.uid, // Handle potential differences in API (ID vs UID)
          name: result.user.name || result.user.displayName || 'Player',
          photo: { src: result.user.photoURL || result.user.avatar || '' },
          level: result.user.level || 0
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
      const result = await register({ email, password, name })
      // Register usually returns the user same as login, or we might need to auto-login
      if (result.user) {
        const userData = {
          id: result.user.id || result.user.uid,
          name: result.user.name || result.user.displayName || name,
          photo: { src: result.user.photoURL || result.user.avatar || '' },
          level: result.user.level || 0
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

  async logoutPlayer({ commit }) {
    await logout()
    const defaultData = {
      id: 'guest',
      name: 'Guest Player',
      photo: null,
      level: 0
    }
    commit('setPlayerData', defaultData)
  },

  async checkAuth({ commit }) {
    try {
      // we need to dynamic import checkAuth because I didn't verify if I can import it in the top of file yet
      // (actually I can just add it to the import list)
      const { checkAuth } = await import('@/services/auth');
      const result = await checkAuth();
      if (result && (result.user || result.id)) {
        // Adapting to probable response structure based on login return
        const user = result.user || result;
        const userData = {
          id: user.id || user.uid,
          name: user.name || user.displayName || 'Player',
          photo: { src: user.photoURL || user.avatar || '' },
          level: user.level || 0
        }
        commit('setPlayerData', userData)
        return true
      }
      return false;
    } catch (error) {
      // console.debug('Check auth failed or not logged in', error);
      return false;
    }
  }
}
