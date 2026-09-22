import { logout } from '@/services/auth'

export default {
  SetPlayerDataAsync: function ({ commit }, payload) {
    commit('setPlayerData', payload)
  },

  async logoutPlayer({ commit }) {
    try {
      await logout()
    } catch(_e) {
      // ignore
    }
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
      const { checkAuth } = await import('@/services/auth');
      const result = await checkAuth();
      if (result && (result.user || result.id)) {
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
    } catch (_error) {
      return false;
    }
  }
}
