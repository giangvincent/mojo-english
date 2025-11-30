const themeUnlocks = [
  { level: 3, item: 'Jungle Theme' },
  { level: 7, item: 'Ocean Theme' },
  { level: 10, item: 'Space Theme' },
  { level: 15, item: 'Food Theme' },
  { level: 18, item: 'Winter Theme' },
  { level: 22, item: 'Medieval Theme' },
  { level: 30, item: 'Monster Legends Theme' }
]

const setUnlocks = [
  { level: 2, item: 'Set 1 Starter' },
  { level: 6, item: 'Set 1 Advanced' },
  { level: 10, item: 'Set 2 Starter' },
  { level: 14, item: 'Set 2 Advanced' },
  { level: 20, item: 'Set 2 Bonus Characters' },
  { level: 25, item: 'Special Themes Deck' },
  { level: 30, item: 'Elite Grammar Deck' }
]

const tenseUnlocks = [
  { level: 1, item: 'present simple' },
  { level: 5, item: 'past simple' },
  { level: 8, item: 'future simple' },
  { level: 12, item: 'imperatives' },
  { level: 16, item: 'question forms' },
  { level: 20, item: 'mixed tenses' },
  { level: 25, item: 'random challenge tenses' }
]

export function getUnlocksForLevel(level) {
  const unlocks = []
  themeUnlocks.forEach(u => {
    if (u.level === level) unlocks.push({ category: 'themes', item: u.item })
  })
  setUnlocks.forEach(u => {
    if (u.level === level) unlocks.push({ category: 'sets', item: u.item })
  })
  tenseUnlocks.forEach(u => {
    if (u.level === level) unlocks.push({ category: 'tenses', item: u.item })
  })
  return unlocks
}
