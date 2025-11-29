import { calculateXpFromContext, getRequiredXp } from '@/utils/xp'

export default {
  gainXp: function ({ state, commit }, payload) {
    const amount = typeof payload === 'number' ? payload : payload?.amount || 0
    commit('addXp', amount)
    // Auto-level if threshold reached
    while (state.xp >= state.xpToNext) {
      const nextLevel = state.level + 1
      commit('setLevel', nextLevel)
      commit('setXpToNext', getRequiredXp(nextLevel))
    }
  },
  awardFromContext: function ({ dispatch }, context) {
    const xp = calculateXpFromContext(context)
    dispatch('gainXp', xp)
  },
  setMissions: function ({ commit }, payload) {
    commit('setMissions', payload)
  },
  updateMissionProgress: function ({ commit }, payload) {
    commit('updateMissionProgress', payload)
  },
  completeMission: function ({ commit }, payload) {
    commit('completeMission', payload)
  },
  addAchievement: function ({ commit }, payload) {
    commit('addAchievement', payload)
  },
  grantUnlock: function ({ commit }, payload) {
    commit('grantUnlock', payload)
  }
}
