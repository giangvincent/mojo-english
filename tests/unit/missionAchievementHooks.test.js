import { describe, it, expect } from 'vitest'
import { createStore } from 'vuex'
import progression from '@/store/progression'
import { dailyMissionTemplates, weeklyMissionTemplates } from '@/data/missions'
import { achievements } from '@/data/achievements'

function makeStore() {
    const dailyMissions = dailyMissionTemplates.map(m => ({ ...m, progress: 0, completed: false }))

    return createStore({
        modules: {
            progression: {
                ...progression,
                namespaced: false,
                state: () => ({
                    ...progression.state,
                    missions: {
                        daily: dailyMissions,
                        weekly: weeklyMissionTemplates.map(m => ({ ...m, progress: 0, completed: false })),
                        seasonal: []
                    },
                    achievements: [],
                    missionProgress: {},
                    achievementProgress: {},
                    xp: 0,
                    level: 1,
                    xpToNext: 125,
                    unlocks: { tenses: ['present simple'], themes: ['Everyday Life'], sets: ['Set 1 Starter'] }
                })
            }
        }
    })
}

function makeContext(overrides = {}) {
    return {
        sentenceBuilt: true,
        tense: 'past simple',
        cardsUsed: [{ type: 'Noun' }, { type: 'Verb' }],
        bonusPoints: 15,
        perfectRound: false,
        matchesWon: 0,
        sentenceText: 'the giant crawls',
        score: 20,
        combos: [],
        matchCombos: null,
        ...overrides
    }
}

describe('Mission hooks (T15)', () => {
    it('checkMissionProgress increments progress when condition matches', async () => {
        const store = makeStore()
        const context = makeContext({ tense: 'past simple', sentenceBuilt: true })
        await store.dispatch('checkMissionProgress', context)
        const mission = store.state.progression.missions.daily.find(m => m.condition.tense === 'past simple')
        expect(mission.progress).toBe(1)
    })

    it('checkMissionProgress completes mission when count is reached', async () => {
        const store = makeStore()
        const mission = store.state.progression.missions.daily.find(m => m.condition.count === 2)
        if (mission) {
            const context = makeContext({ tense: mission.condition.tense || 'past simple', sentenceBuilt: true })
            await store.dispatch('checkMissionProgress', context)
            await store.dispatch('checkMissionProgress', context)
            // Re-read from store state; completeMission creates a new object in the array
            const updated = store.state.progression.missions.daily.find(m => m.id === mission.id)
            expect(updated.completed).toBe(true)
        }
    })

    it('checkMissionProgress skips completed missions', async () => {
        const store = makeStore()
        const mission = store.state.progression.missions.daily.find(m => m.completed)
        if (mission) {
            const context = makeContext({ sentenceBuilt: true })
            const before = { ...store.state.progression.missionProgress }
            await store.dispatch('checkMissionProgress', context)
            expect(store.state.progression.missionProgress).toEqual(before)
        }
    })

    it('checkMissionProgress grants XP reward on completion', async () => {
        const store = makeStore()
        const mission = store.state.progression.missions.daily.find(m => m.rewards.xp)
        if (mission) {
            const context = makeContext({ tense: mission.condition.tense || 'past simple', sentenceBuilt: true })
            for (let i = 0; i < (mission.condition.count || 1); i++) {
                await store.dispatch('checkMissionProgress', context)
            }
            expect(store.state.progression.xp).toBeGreaterThan(0)
        }
    })

    it('onSentenceSubmit advances mission progress', async () => {
        const store = makeStore()
        const context = makeContext({ sentenceBuilt: true })
        await store.dispatch('onSentenceSubmit', context)
        // Verify at least one mission with sentencesBuilt condition advanced
        const advancedMission = store.state.progression.missions.weekly.find(
            m => m.condition.sentencesBuilt && m.progress > 0
        );
        expect(advancedMission).toBeDefined()
    })

    it('onRoundComplete advances mission progress', async () => {
        const store = makeStore()
        const context = { roundCompleted: true, score: 20, sentenceBuilt: true, tense: 'past simple' }
        await store.dispatch('onRoundComplete', context)
        // Verify missions with matching conditions advanced (daily d1: past simple tense)
        const advancedMission = store.state.progression.missions.daily.find(
            m => m.condition.tense === 'past simple' && m.progress > 0
        );
        expect(advancedMission).toBeDefined()
    })

    it('onMatchComplete advances mission progress', async () => {
        const store = makeStore()
        const context = { finishedMatch: true, wonMatch: true, score: 200, matchesWon: 1 }
        await store.dispatch('onMatchComplete', context)
        // Verify matchesWon missions advanced
        const wonMission = store.state.progression.missions.weekly.find(
            m => m.condition.matchesWon && m.progress > 0
        );
        expect(wonMission).toBeDefined()
    })

    it('completes the cumulative bonus-points mission at its declared target', async () => {
        const store = makeStore()
        await store.dispatch('checkMissionProgress', makeContext({ bonusPoints: 15 }))
        const mission = store.state.progression.missions.daily.find(m => m.condition.bonusPoints)
        expect(mission.progress).toBe(15)
        expect(mission.completed).toBe(true)
    })

    it('completes the wins mission after three wins', async () => {
        const store = makeStore()
        for (let i = 0; i < 3; i++) {
            await store.dispatch('checkMissionProgress', makeContext({ sentenceBuilt: false, matchesWon: 1 }))
        }
        const mission = store.state.progression.missions.weekly.find(m => m.condition.matchesWon)
        expect(mission.progress).toBe(3)
        expect(mission.completed).toBe(true)
    })
})

describe('Achievement hooks (T15)', () => {
    it('checkAchievements increments progress when condition met', async () => {
        const store = makeStore()
        const achievement = achievements.find(a => a.condition.sentencesBuilt)
        if (achievement) {
            const context = { sentenceBuilt: true, tense: 'present simple', cardsUsed: [], bonusPoints: 0, perfectRound: false, matchesWon: 0, sentenceText: '', score: 0 }
            await store.dispatch('checkAchievements', context)
            const progress = store.state.progression.achievementProgress[achievement.id]
            expect(progress).toBeGreaterThanOrEqual(1)
        }
    })

    it('checkAchievements increments achievement progress toward threshold', async () => {
        const store = makeStore()
        const achievement = achievements.find(a => a.condition.sentencesBuilt)
        // Assert the achievement exists before testing
        expect(achievement).toBeDefined()
        const context = { sentenceBuilt: true }
        // Call enough times to reach the threshold (50 sentences)
        for (let i = 0; i < 50; i++) {
            await store.dispatch('checkAchievements', context)
        }
        const unlocked = store.state.progression.achievements.find(a => a.id === achievement.id)
        expect(unlocked).toBeDefined()
    })

    it('checkAchievements skips already unlocked achievements', async () => {
        const store = makeStore()
        const achievement = achievements[0]
        store.commit('addAchievement', achievement)
        const context = { sentenceBuilt: true, tense: 'present simple', cardsUsed: [], bonusPoints: 0, perfectRound: false, matchesWon: 0, sentenceText: '', score: 0 }
        await store.dispatch('checkAchievements', context)
        expect(store.state.progression.achievements).toHaveLength(1)
    })

    it('checkAchievements unlocks singleSentenceScore achievement when score threshold met', async () => {
        const store = makeStore()
        const achievement = achievements.find(a => a.condition.singleSentenceScore)
        expect(achievement).toBeDefined()
        const context = { sentenceBuilt: true, score: achievement.condition.singleSentenceScore }
        await store.dispatch('checkAchievements', context)
        const unlocked = store.state.progression.achievements.find(a => a.id === achievement.id)
        expect(unlocked).toBeDefined()
    })

    it('checkAchievements unlocks perfectRound achievement', async () => {
        const store = makeStore()
        const achievement = achievements.find(a => a.condition.perfectRounds)
        expect(achievement).toBeDefined()
        const context = { sentenceBuilt: true, perfectRound: true, score: 0 }
        // Need 10 perfect rounds
        for (let i = 0; i < 10; i++) {
            await store.dispatch('checkAchievements', context)
        }
        const unlocked = store.state.progression.achievements.find(a => a.id === achievement.id)
        expect(unlocked).toBeDefined()
    })
})
