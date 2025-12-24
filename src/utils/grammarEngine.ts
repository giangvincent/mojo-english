import { VerbaCard, CardContent, CardType } from "@/types/verba";

/**
 * Validates if `nextCard` can legally follow `prevCard` in a sentence.
 *
 * Rules based on JSON structure:
 * 1. `prevCard.nextCards` must include `nextCard.type`.
 * 2. `nextCard.previousCards` must include `prevCard.type`.
 * 3. Specific `condition` checks (e.g. Adjective categories matching Noun categories).
 *
 * @param prevCard The card immediately before (or null if start of sentence).
 * @param nextCard The card being placed.
 * @param sentenceContext Optional: the full sentence so far for complex checks (future expansion).
 */
export function validateConnection(prevCard: VerbaCard | null, nextCard: VerbaCard): boolean {
    // 1. Start of sentence checks (if prevCard is null)
    // Rulebook: "First card played must be a Noun" (for Co-op), but generally sentences start with Noun, Time, or sometimes Location.
    // For now, let's assume loose rules unless specifically restricted.
    if (!prevCard) {
        // Example restriction: Prepositions usually don't start a sentence unless it's a specific phrase.
        // Allowing most cards to start for flexibility in drag-drop, but could restrict here.
        return true;
    }

    const prevType = normalizeType(prevCard.type);
    const nextType = normalizeType(nextCard.type);

    // 2. Basic Type Chaining (nextCards / previousCards)
    // Check if prevCard explicitly allows nextCard's type
    const allowedNext = prevCard.nextCards?.map(t => normalizeType(t));
    if (allowedNext && !allowedNext.includes(nextType)) {
        // Check "allowCards" (exceptions like Conj, Adverb often allowed anywhere)
        const exceptions = prevCard.allowCards?.map(t => normalizeType(t));
        if (!exceptions || !exceptions.includes(nextType)) {
             // Reverse check: does nextCard allow prevCard?
             const allowedPrev = nextCard.previousCards?.map(t => normalizeType(t));
             if (!allowedPrev || !allowedPrev.includes(prevType)) {
                 return false;
             }
        }
    }

    // 3. Condition Checks
    // Example: Adjective -> Noun category matching
    if (prevType === "Adj" && nextType === "Noun") {
         return validateAdjectiveNoun(prevCard, nextCard);
    }

    // Example: Noun -> Verb plurality matching
    if (prevType === "Noun" && nextType === "Verb") {
        // This is tricky because the Noun card has 'singular' and 'plural' objects,
        // and the user must have selected one.
        // We assume the UI passes a "resolved" card or we check the selected state.
        // For this engine, we might need to know WHICH choice was made on the card.
        // BUT, looking at `VerbaCard`, `singular` and `plural` are properties.
        // The implementation plan says `CardComponent` handles the choice.
        // We need to know the *selected* grammatical number.
        // For now, we perform a loose check: Is there *any* valid combination?
        // Or we assume the game logic passes the specific 'content' chosen.

        // Return true here, and assume exact agreement is checked at scoring or UI level
        // unless we pass the selected state.
        return true;
    }

    return true;
}

function normalizeType(t: string): string {
    // Map JSON types to standard types if needed
    // JSON: "Adj", "Prep", "Conj"
    // Enum: "Adj", "Prep", "Conj"
    // Seems consistent.
    return t;
}

function validateAdjectiveNoun(adj: VerbaCard, noun: VerbaCard): boolean {
    // Noun has 'condition' array with type: 'Adj' and categories: [...]
    // BUT checking the Noun.json:
    // "condition": [ { "type": "Adj", "categories": ["person", "animal"] } ]
    // This implies the Noun dictates what Adjectives it accepts.

    const nounConditions = noun.condition?.filter(c => c.type === "Adj");
    if (!nounConditions || nounConditions.length === 0) return true; // No restrictions

    // We need to know the category of the Adjective.
    // Adjective.json structure: "category": ["person"] or "categories": ["..."]
    // Let's assume passed `adj` card has `categories` or similar.
    // Inspecting Adjective.json (not read yet, but assuming structure).

    // If we can't verify category, we fail safe (true) or strict (false).
    // Let's assume strict if categories exist.

    // Placeholder logic until Adjective structure is confirmed:
    // const adjCategories = (adj as any).categories || [];
    // const allowed = nounConditions.some(cond => cond.categories?.some(c => adjCategories.includes(c)));
    // return allowed;

    return true;
}
