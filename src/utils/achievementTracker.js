export function checkAchievement(achievementId, progress, achievements) {
    const achievement = achievements.find(a => a.id === achievementId)
    if (!achievement) return false

    // Evaluate condition based on achievement type
    if (achievement.condition.count) {
        return progress >= achievement.condition.count
    }

    if (achievement.condition.singleSentenceScore) {
        return progress >= achievement.condition.singleSentenceScore
    }

    if (achievement.condition.allCombosInOneGame) {
        // Check if all 6 combos were used in one match
        // progress should be an array of unique combos used
        return Array.isArray(progress) && progress.length >= 6
    }

    if (achievement.condition.matchesWon) {
        return progress >= achievement.condition.matchesWon
    }

    if (achievement.condition.sentencesBuilt) {
        return progress >= achievement.condition.sentencesBuilt
    }

    if (achievement.condition.themesUnlocked) {
        return progress >= achievement.condition.themesUnlocked
    }

    if (achievement.condition.perfectRounds) {
        return progress >= achievement.condition.perfectRounds
    }

    return false
}

export function getAchievementProgress(achievementId, state) {
    // Check if state is the global state (has progression module) or local progression state
    const progressionState = state.progression || state
    return progressionState.achievementProgress?.[achievementId] || 0
}
