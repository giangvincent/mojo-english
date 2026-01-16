export const TIME_SYMBOL = {
  present: 'green',
  past: 'red',
  future: 'yellow'
}

export function getTimeSymbol(tense) {
  if (!tense) return null
  const normalized = tense.toLowerCase()
  if (normalized.includes('past')) return TIME_SYMBOL.past
  if (normalized.includes('future')) return TIME_SYMBOL.future
  return TIME_SYMBOL.present
}

export function timeSymbolsMatch(firstTense, secondTense) {
  const firstSymbol = getTimeSymbol(firstTense)
  const secondSymbol = getTimeSymbol(secondTense)
  if (!firstSymbol || !secondSymbol) return true
  return firstSymbol === secondSymbol
}
