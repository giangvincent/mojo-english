export const dailyMissionTemplates = [
    { id: 'd1', description: 'Build 2 past simple sentences', condition: { tense: 'past simple', count: 2 }, rewards: { xp: 30, coins: 5 } },
    { id: 'd2', description: 'Use 3 adjectives in sentences', condition: { cardType: 'Adj', count: 3 }, rewards: { xp: 40, coins: 10 } },
    { id: 'd3', description: 'Score 15 bonus points', condition: { bonusPoints: 15 }, rewards: { xp: 50, coins: 15, themeFragment: 'ocean-1' } },
    { id: 'd4', description: 'Build 1 sentence with all 7 original cards', condition: { perfectRounds: 1 }, rewards: { xp: 60, coins: 20 } }
]

export const weeklyMissionTemplates = [
    { id: 'w1', description: 'Win 3 matches', condition: { matchesWon: 3 }, rewards: { xp: 100, themePack: 'jungle' } },
    { id: 'w2', description: 'Build 15 sentences', condition: { sentencesBuilt: 15 }, rewards: { xp: 150, avatar: 'weekly-star' } },
    { id: 'w3', description: 'Get 2 Perfect Rounds', condition: { perfectRounds: 2 }, rewards: { xp: 200, xpBooster: '1.5x-24h' } }
]

export const seasonalEventTemplates = {
    christmas: {
        name: 'Winter Wonderland',
        missions: [
            { id: 's1', description: 'Use "snow", "cold", or "winter" 5 times', condition: { specificWords: ['snow', 'cold', 'winter'], count: 5 }, rewards: { xp: 300, theme: 'santa' } }
        ],
        xpBooster: 1.5
    }
}

// Helper to shuffle with a seed (simple implementation)
function shuffleWithSeed(array, seed) {
    const m = array.length
    let t, i
    const result = [...array]

    // Simple LCG for pseudo-random numbers
    const random = () => {
        seed = (seed * 9301 + 49297) % 233280
        return seed / 233280
    }

    for (i = m - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1))
        t = result[i]
        result[i] = result[j]
        result[j] = t
    }
    return result
}

// Auto-generate missions on app load or daily reset
export function generateDailyMissions(seed = Date.now()) {
    // Shuffle and pick 3 random missions based on seed
    const shuffled = shuffleWithSeed(dailyMissionTemplates, seed)
    return shuffled.slice(0, 3).map(m => ({ ...m, progress: 0, completed: false }))
}

export function generateWeeklyMissions(seed = Date.now()) {
    const shuffled = shuffleWithSeed(weeklyMissionTemplates, seed)
    return shuffled.slice(0, 2).map(m => ({ ...m, progress: 0, completed: false }))
}
