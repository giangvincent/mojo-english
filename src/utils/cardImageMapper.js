/**
 * Maps card IDs to their corresponding image assets.
 *
 * Note: This mapping assumes a sequential order based on the file names.
 * Adjustments may be needed to match specific card IDs to specific images
 * if the order doesn't align perfectly.
 */

const set1Path = 'assets/cards/set1/'
const set2Path = 'assets/cards/set2/'

// Helper to generate path
const getPath = (set, number) => {
    const numStr = number.toString().padStart(2, '0')
    if (set === 1) {
        return `${set1Path}Set1RoundEdge-${numStr}.png`
    }
    return `${set2Path}Set2-RoundEdge-${numStr}.png`
}

// Manual mapping or algorithmic mapping
export const getCardImage = (cardId) => {
    if (!cardId) return null

    // Example mapping logic - this needs to be refined with actual visual verification
    // For now, we map based on a hypothetical order

    // Nouns (N)
    if (cardId.startsWith('N')) {
        // Map N1a -> 01, N1b -> 02, etc.
        // This is a placeholder logic
        return getPath(1, 1)
    }

    // Verbs (V)
    if (cardId.startsWith('V')) {
        return getPath(1, 10)
    }

    // Default fallback
    return null
}

export const getCardBackgroundStyle = (cardId) => {
    const image = getCardImage(cardId)
    if (!image) return {}
    return {
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    }
}
