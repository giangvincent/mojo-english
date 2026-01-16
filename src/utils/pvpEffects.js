// Lightweight PvP effect handler. These actions are intentionally conservative so they can
// be wired into the UI without breaking single-player behaviour.
export const PVP_EFFECTS = {
  take: ({ cards = [], discarded = [], roundScore }) => {
    if (discarded.length > 0) {
      const recovered = discarded.pop()
      cards.push(recovered)
      console.log('[PvP] take -> recovered card', recovered.id)
    }
    return roundScore
  },
  'double points': ({ roundScore }) => {
    console.log('[PvP] double points')
    return roundScore * 2
  },
  'double points plus': ({ roundScore }) => {
    console.log('[PvP] double points plus')
    return roundScore * 2 + 5
  },
  'bring back': ({ cards = [], discarded = [], roundScore }) => {
    if (discarded.length > 0) {
      const restored = discarded.pop()
      cards.push(restored)
      console.log('[PvP] bring back -> restored', restored.id)
    }
    return roundScore
  },
  'seeing double': ({ cards = [], roundScore }) => {
    if (cards.length > 0) {
      const clone = { ...cards[cards.length - 1], id: `${cards[cards.length - 1].id}-copy` }
      cards.push(clone)
      console.log('[PvP] seeing double -> duplicated', clone.id)
    }
    return roundScore
  },
  swap: ({ cards = [], roundScore }) => {
    if (cards.length > 1) {
      const first = cards[0]
      cards[0] = cards[cards.length - 1]
      cards[cards.length - 1] = first
      console.log('[PvP] swap -> swapped first/last')
    }
    return roundScore
  },
  'time warp': ({ roundScore }) => {
    console.log('[PvP] time warp -> bonus applied')
    return roundScore + 5
  },
  super: ({ roundScore }) => {
    console.log('[PvP] super -> triple points')
    return roundScore * 3
  }
}

export function applyPvpEffect(effect, context = {}) {
  if (!effect) return context.roundScore
  const effectKey = typeof effect === 'string' ? effect.toLowerCase() : effect.name?.toLowerCase()
  const handler = PVP_EFFECTS[effectKey]
  if (!handler) return context.roundScore
  return handler(context)
}
