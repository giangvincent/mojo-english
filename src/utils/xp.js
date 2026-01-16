const BASE_XP = 100
const PER_LEVEL = 25

export function getRequiredXp(level = 1) {
  return BASE_XP + level * PER_LEVEL
}

/**
 * Calculates XP from a gameplay context. Keep inputs optional so we can call this safely.
 * context = {
 *   correctSentence: boolean,
 *   usedAllSeven: boolean,
 *   correctTense: boolean,
 *   bonusCombos: number,
 *   finishedMatch: boolean,
 *   wonMatch: boolean,
 *   dailyReward: number,
 *   weeklyReward: number,
 *   penalties: number,
 *   multiplier: number
 * }
 */
export function calculateXpFromContext(context = {}) {
  let xp = 0
  if (context.correctSentence) xp += 10
  if (context.usedAllSeven) xp += 5
  if (context.correctTense) xp += 3
  if (context.bonusCombos) xp += context.bonusCombos * 5
  if (context.finishedMatch) xp += 15
  if (context.wonMatch) xp += 20
  if (context.dailyReward) xp += context.dailyReward
  if (context.weeklyReward) xp += context.weeklyReward

  // Penalties
  if (context.badGrammarPenalty) xp -= context.badGrammarPenalty
  if (context.invalidPlacementPenalty) xp -= context.invalidPlacementPenalty

  // Ensure XP doesn't go below 0 for a single action, unless we want to allow de-leveling (usually not)
  // But penalties are usually applied to the total sum.
  // Let's allow negative result here, but handle it in the store (e.g. don't drop below 0 total XP or level)

  const multiplier = context.multiplier || 1
  return Math.floor(xp * multiplier)
}

export function computeLevelFromXp(totalXp) {
  let level = 1
  let xpForNext = getRequiredXp(level)
  let remaining = totalXp
  while (remaining >= xpForNext) {
    remaining -= xpForNext
    level += 1
    xpForNext = getRequiredXp(level)
  }
  return { level, xpIntoLevel: remaining, xpToNext: xpForNext }
}
