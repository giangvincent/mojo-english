import { calculateXpFromContext, getRequiredXp } from '@/utils/xp'
import { getUnlocksForLevel } from '@/utils/unlocks'
import { generateDailyMissions, generateWeeklyMissions } from '@/data/missions'
import { achievements } from '@/data/achievements'
import { checkAchievement, getAchievementProgress } from '@/utils/achievementTracker'

function getWeekIdentifier() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7))
  const yearStart = new Date(d.getFullYear(), 0, 1)
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  return d.getFullYear() + '-W' + weekNo
}

function getMissionType(mission, missionsState) {
  if (missionsState.daily.find(m => m.id === mission.id)) return 'daily'
  if (missionsState.weekly.find(m => m.id === mission.id)) return 'weekly'
  if (missionsState.seasonal.find(m => m.id === mission.id)) return 'seasonal'
  return null
}

export default {
  gainXp: function ({ state, commit }, payload) {
    const amount = typeof payload === 'number' ? payload : payload?.amount || 0
    const startingLevel = state.level

    // Don't allow negative total XP (though penalties might reduce round XP)
    if (amount < 0 && state.xp + amount < 0) {
      commit('setXp', 0)
    } else {
      commit('addXp', amount)
    }

    // Auto-level if threshold reached
    while (state.xp >= state.xpToNext) {
      const nextLevel = state.level + 1
      commit('setLevel', nextLevel)
      commit('setXpToNext', getRequiredXp(nextLevel))

      // Grant unlocks for each new level
      const unlocks = getUnlocksForLevel(nextLevel)
      unlocks.forEach(unlock => commit('grantUnlock', unlock))

      // Dispatch level up event (could be used for UI)
      console.log(`Level Up! ${state.level} -> ${nextLevel}`)
    }

    // If we crossed multiple levels, ensure we didn't skip unlocks
    for (let lvl = startingLevel + 1; lvl <= state.level; lvl++) {
      const unlocks = getUnlocksForLevel(lvl)
      unlocks.forEach(unlock => commit('grantUnlock', unlock))
    }
  },

  awardFromContext: function ({ dispatch }, context) {
    const xp = calculateXpFromContext(context)
    dispatch('gainXp', xp)
  },

  initializeMissions({ commit, state }) {
    const today = new Date().toDateString()
    const lastDaily = localStorage.getItem('lastDailyReset')

    if (lastDaily !== today) {
      const dailyMissions = generateDailyMissions()
      commit('setMissions', { ...state.missions, daily: dailyMissions })
      localStorage.setItem('lastDailyReset', today)
    }

    const thisWeek = getWeekIdentifier()
    const lastWeekly = localStorage.getItem('lastWeeklyReset')

    if (lastWeekly !== thisWeek) {
      const weeklyMissions = generateWeeklyMissions()
      commit('setMissions', { ...state.missions, weekly: weeklyMissions })
      localStorage.setItem('lastWeeklyReset', thisWeek)
    }
  },

  checkMissionProgress({ state, commit, dispatch }, context) {
    // context = { sentenceBuilt: true, tense: 'past simple', cardsUsed: [...], bonusPoints: 10, perfectRound: true, matchesWon: 1 }

    const allMissions = [...state.missions.daily, ...state.missions.weekly, ...state.missions.seasonal]

    allMissions.forEach(mission => {
      if (mission.completed) return

      let shouldIncrement = false
      let incrementAmount = 1

      if (mission.condition.tense && context.tense === mission.condition.tense && context.sentenceBuilt) {
        shouldIncrement = true
      }

      if (mission.condition.cardType && context.cardsUsed?.some(c => c.type === mission.condition.cardType)) {
        shouldIncrement = true
      }

      if (mission.condition.bonusPoints && context.bonusPoints >= mission.condition.bonusPoints) {
        shouldIncrement = true
      }

      if (mission.condition.perfectRounds && context.perfectRound) {
        shouldIncrement = true
      }

      if (mission.condition.matchesWon && context.matchesWon) {
        shouldIncrement = true
      }

      if (mission.condition.sentencesBuilt && context.sentenceBuilt) {
        shouldIncrement = true
      }

      if (mission.condition.specificWords && context.sentenceText) {
        const found = mission.condition.specificWords.some(word => context.sentenceText.toLowerCase().includes(word.toLowerCase()))
        if (found) shouldIncrement = true
      }

      if (shouldIncrement) {
        const type = getMissionType(mission, state.missions)
        // We track progress in the mission object itself now via mutations
        const newProgress = (mission.progress || 0) + incrementAmount

        if (type === 'daily') commit('updateDailyMissionProgress', { missionId: mission.id, progress: newProgress })
        if (type === 'weekly') commit('updateWeeklyMissionProgress', { missionId: mission.id, progress: newProgress })
        if (type === 'seasonal') commit('updateSeasonalMissionProgress', { missionId: mission.id, progress: newProgress })

        if (newProgress >= mission.condition.count) {
          commit('completeMission', { id: mission.id, type })
          // Grant rewards
          if (mission.rewards.xp) dispatch('gainXp', mission.rewards.xp)
          if (mission.rewards.cosmetic) commit('grantUnlock', { category: 'cosmetics', item: mission.rewards.cosmetic })
          if (mission.rewards.theme) commit('grantUnlock', { category: 'themes', item: mission.rewards.theme })

          console.log(`Mission Completed: ${mission.description}`)
        }
      }
    })
  },

  checkAchievements({ state, commit, dispatch }, context) {
    achievements.forEach(achievement => {
      // Skip if already unlocked
      if (state.achievements.find(a => a.id === achievement.id)) return

      let progressUpdate = 0
      let shouldCheck = false

      // Grammar achievements
      if (achievement.category === 'grammar') {
        if (achievement.condition.tenseUsed && context.tense === achievement.condition.tenseUsed) {
          progressUpdate = 1
          shouldCheck = true
        }
        if (achievement.condition.anyTense && context.sentenceBuilt) {
          progressUpdate = 1
          shouldCheck = true
        }
      }

      // Gameplay achievements
      if (achievement.category === 'gameplay') {
        if (achievement.condition.matchesWon && context.matchesWon) {
          progressUpdate = 1
          shouldCheck = true
        }
        if (achievement.condition.sentencesBuilt && context.sentenceBuilt) {
          progressUpdate = 1
          shouldCheck = true
        }
        if (achievement.condition.allCombosInOneGame && context.combos) {
          // Special case: progress is array of combos
          // We need to merge with existing combos for this match
          // This logic assumes context.combos is passed per sentence, but for "one game" we need to track it in store or pass cumulative
          // Simplified: assume context.matchCombos is passed at end of match
          if (context.matchCombos) {
            // Set progress to the array of combos
            commit('incrementAchievementProgress', { achievementId: achievement.id, progress: context.matchCombos })
            // Check immediately
            if (checkAchievement(achievement.id, context.matchCombos, achievements)) {
              dispatch('unlockAchievement', achievement)
            }
            return
          }
        }
      }

      // Special achievements
      if (achievement.category === 'special') {
        if (achievement.condition.perfectRounds && context.perfectRound) {
          progressUpdate = 1
          shouldCheck = true
        }
        if (achievement.condition.singleSentenceScore && context.score >= achievement.condition.singleSentenceScore) {
          // Instant unlock, no progress tracking needed really, but we can set it
          dispatch('unlockAchievement', achievement)
          return
        }
      }

      // Collection achievements (checked on unlock)
      if (achievement.category === 'collection') {
        if (achievement.condition.themesUnlocked) {
          const themes = state.unlocks.themes?.length || 0
          if (themes >= achievement.condition.themesUnlocked) {
            dispatch('unlockAchievement', achievement)
          }
          return
        }
      }

      if (shouldCheck && progressUpdate > 0) {
        commit('incrementAchievementProgress', { achievementId: achievement.id, progress: progressUpdate })
        const currentProgress = getAchievementProgress(achievement.id, state) + progressUpdate // State update might not be immediate in same tick if we read back, but here we just calculated it

        // Actually, mutation updates state immediately in Vuex
        const updatedProgress = state.achievementProgress[achievement.id]

        if (checkAchievement(achievement.id, updatedProgress, achievements)) {
          dispatch('unlockAchievement', achievement)
        }
      }
    })
  },

  unlockAchievement({ commit, dispatch }, achievement) {
    commit('addAchievement', achievement)
    if (achievement.rewards.xp) dispatch('gainXp', achievement.rewards.xp)
    if (achievement.rewards.cosmetic) commit('grantUnlock', { category: 'cosmetics', item: achievement.rewards.cosmetic })
    console.log(`Achievement Unlocked: ${achievement.name}`)
  },

  // Event Hooks
  onSentenceSubmit({ dispatch }, context) {
    dispatch('checkMissionProgress', context)
    dispatch('checkAchievements', context)
  },

  onRoundComplete({ dispatch }, context) {
    dispatch('checkMissionProgress', context)
    dispatch('checkAchievements', context)
  },

  onMatchComplete({ dispatch }, context) {
    dispatch('checkMissionProgress', context)
    dispatch('checkAchievements', context)
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
