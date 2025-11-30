export const achievements = [
    {
        id: 'present-pro',
        name: 'Present Pro',
        description: 'Build 20 sentences in present simple',
        category: 'grammar',
        condition: { tenseUsed: 'present simple', count: 20 },
        rewards: { xp: 50, cosmetic: 'avatar-present-badge' }
    },
    {
        id: 'past-pilot',
        name: 'Past Pilot',
        description: 'Build 20 sentences in past simple',
        category: 'grammar',
        condition: { tenseUsed: 'past simple', count: 20 },
        rewards: { xp: 50, cosmetic: 'avatar-past-badge' }
    },
    {
        id: 'tense-boss',
        name: 'Tense Boss',
        description: 'Build 100 sentences with mixed tenses',
        category: 'grammar',
        condition: { anyTense: true, count: 100 },
        rewards: { xp: 200, cosmetic: 'card-back-rainbow' }
    },
    {
        id: 'victory-lap',
        name: 'Victory Lap',
        description: 'Win 10 matches',
        category: 'gameplay',
        condition: { matchesWon: 10 },
        rewards: { xp: 100, cosmetic: 'avatar-trophy' }
    },
    {
        id: 'sentence-factory',
        name: 'Sentence Factory',
        description: 'Build 50 sentences',
        category: 'gameplay',
        condition: { sentencesBuilt: 50 },
        rewards: { xp: 150, cosmetic: 'border-factory' }
    },
    {
        id: 'bonus-hunter',
        name: 'Bonus Hunter',
        description: 'Use all 6 combo types in one game',
        category: 'gameplay',
        condition: { allCombosInOneGame: true },
        rewards: { xp: 100, cosmetic: 'card-back-combo' }
    },
    {
        id: 'explorer',
        name: 'Explorer',
        description: 'Unlock 5 themes',
        category: 'collection',
        condition: { themesUnlocked: 5 },
        rewards: { xp: 75 }
    },
    {
        id: 'art-collector',
        name: 'Art Collector',
        description: 'Unlock 10 themes',
        category: 'collection',
        condition: { themesUnlocked: 10 },
        rewards: { xp: 150, cosmetic: 'avatar-collector' }
    },
    {
        id: 'perfect-round',
        name: 'Perfect Round',
        description: 'Use all 7 original cards 10 times',
        category: 'special',
        condition: { perfectRounds: 10 },
        rewards: { xp: 200, cosmetic: 'border-perfect' }
    },
    {
        id: 'ultra-combo',
        name: 'Ultra Combo',
        description: 'Score 35+ points in one sentence',
        category: 'special',
        condition: { singleSentenceScore: 35 },
        rewards: { xp: 100, cosmetic: 'border-ultra' }
    }
]
