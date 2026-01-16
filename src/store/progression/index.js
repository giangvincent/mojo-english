import actions from './actions'
import mutations from './mutations'
import { getRequiredXp } from '@/utils/xp'

export default {
  state: {
    xp: 0,
    level: 1,
    xpToNext: getRequiredXp(1),
    xpMultiplier: 1,
    // Unlock tracking
    unlocks: {
      tenses: ['present simple'],
      themes: ['Everyday Life'],
      sets: ['Set 1 Starter']
    },
    achievements: [],
    missions: {
      daily: [],
      weekly: [],
      seasonal: []
    },
    missionProgress: {},
    achievementProgress: {},
    cosmetics: {
      equipped: {
        cardBack: null,
        avatar: null,
        border: null
      },
      unlocked: []
    },
    lastLevelUpTime: null
  },
  mutations: mutations,
  actions: actions
}
