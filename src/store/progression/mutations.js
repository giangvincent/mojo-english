export default {
  setXp: function (state, payload) {
    state.xp = payload
  },
  addXp: function (state, payload) {
    state.xp += payload
  },
  setLevel: function (state, payload) {
    state.level = payload
  },
  setXpToNext: function (state, payload) {
    state.xpToNext = payload
  },
  setMissions: function (state, payload) {
    state.missions = payload
  },
  updateMissionProgress: function (state, payload) {
    const { id, progress } = payload
    state.missionProgress = { ...state.missionProgress, [id]: progress }
  },
  completeMission: function (state, payload) {
    state.missions = {
      ...state.missions,
      [payload.type]: state.missions[payload.type]?.map(m =>
        m.id === payload.id ? { ...m, completed: true } : m
      ) || []
    }
  },
  addAchievement: function (state, payload) {
    if (!state.achievements.find(a => a.id === payload.id)) {
      state.achievements.push(payload)
    }
  },
  grantUnlock: function (state, payload) {
    const { category, item } = payload
    if (!state.unlocks[category]) {
      state.unlocks[category] = []
    }
    if (!state.unlocks[category].includes(item)) {
      state.unlocks[category].push(item)
    }
  }
},
setXpMultiplier: function (state, payload) {
  state.xpMultiplier = payload
},
incrementAchievementProgress: function (state, { achievementId, progress }) {
  // Handle both numeric and array progress (for unique combos)
  if (Array.isArray(progress)) {
    state.achievementProgress = { ...state.achievementProgress, [achievementId]: progress }
  } else {
    const current = state.achievementProgress[achievementId] || 0
    state.achievementProgress = { ...state.achievementProgress, [achievementId]: current + progress }
  }
},
updateDailyMissionProgress: function (state, { missionId, progress }) {
  state.missions.daily = state.missions.daily.map(m =>
    m.id === missionId ? { ...m, progress } : m
  )
},
updateWeeklyMissionProgress: function (state, { missionId, progress }) {
  state.missions.weekly = state.missions.weekly.map(m =>
    m.id === missionId ? { ...m, progress } : m
  )
},
updateSeasonalMissionProgress: function (state, { missionId, progress }) {
  state.missions.seasonal = state.missions.seasonal.map(m =>
    m.id === missionId ? { ...m, progress } : m
  )
},
equipCosmetic: function (state, { type, id }) {
  state.cosmetics.equipped[type] = id
}
}
