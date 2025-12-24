import { VerbaCard, CardContent } from "@/types/verba";

interface ScoredSentence {
    totalPoints: number;
    breakdown: {
        cardPoints: number;
        bonusPoints: number;
        handBonus: number;
    };
}

export function calculateScore(sentence: VerbaCard[], handSizeAtStart: number = 7): ScoredSentence {
    let cardPoints = 0;
    let bonusPoints = 0;

    // 1. Base Points
    // We need to know which content was selected (singular/plural/tense).
    // The card objects in 'sentence' should ideally be "resolved" copies
    // where 'point' is at the top level, or we default to a basic check.
    // Assuming the drag-drop operation creates a simplified object
    // OR we inspect the 'selectedContent' property if we add it to the type.

    // Limitation: The current VerbaCard type has `singular` and `plural` with points inside.
    // We need to know WHICH one is active.
    // For now, let's assume the UI attaches a `selectedPoint` property to the card instance in the sentence.
    // If not, we take the max point as a fallback or 0.

    sentence.forEach(card => {
        // @ts-ignore: Assuming runtime extension of the object
        const p = typeof card.selectedPoint === 'number' ? card.selectedPoint : 0;

        // If 0, try to guess from structure
        if (p === 0) {
           // Fallback logic could go here
        }

        cardPoints += p;
    });

    // 2. Bonus Points
    // "Bottom of the card lists specific combinations that award extra points"
    sentence.forEach(card => {
        if (card.bonusPoint) {
            const requiredType = card.bonusPoint.type; // e.g., "Verb"
            const specificWords = card.bonusPoint.word; // e.g., ["run", "walk"]

            // Check if any OTHER card in the sentence matches
            const match = sentence.some(other => {
                if (other === card) return false; // Don't match self

                const typeMatch = other.type === requiredType;

                let wordMatch = true;
                if (specificWords && specificWords.length > 0) {
                     // Check if selected text matches
                     // Again, relies on knowing the selected text.
                     // @ts-ignore
                     const text = other.selectedText || "";
                     wordMatch = specificWords.includes(text);
                }

                return typeMatch && wordMatch;
            });

            if (match) {
                bonusPoints += card.bonusPoint.point;
            }
        }
    });

    // 3. Hand Bonus
    // "If a player uses all 7 cards in their hand... +5 points"
    let handBonus = 0;
    if (sentence.length === handSizeAtStart && handSizeAtStart === 7) {
        handBonus = 5;
    }

    return {
        totalPoints: cardPoints + bonusPoints + handBonus,
        breakdown: {
            cardPoints,
            bonusPoints,
            handBonus
        }
    };
}
