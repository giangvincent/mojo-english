import { VerbaCard } from "@/types/verba";

/**
 * Grammar rules engine (plan T5) — single source of sentence validation.
 * Rulebook source: rules_nook.md §3 (Matching Colours/Symbols), §5 (modes).
 *
 * Runtime selection contract (consumed by the UI in T7):
 * cards in a sentence carry `selectedNumber` ("singular" | "plural") and
 * `selectedTense` (e.g. "past simple") when the player picked a face.
 *
 * All functions are pure. validateSentence returns an errors array keyed by
 * sentence index; empty errors = sentence is legal.
 */

export type GrammarMode = "standard" | "5-4-split" | "coop";

export interface ValidationResult {
    valid: boolean;
    errors: Record<number, string[]>;
}

export interface ValidationOptions {
    requireSelections?: boolean;
}

const WILD = "wild_card";

export const isWild = (card: VerbaCard): boolean =>
    String(card.type).toLowerCase() === WILD;

/** Number the player resolved on a card (noun face / verb form). */
export function selectedNumber(card: VerbaCard): "singular" | "plural" | null {
    const s = (card as any).selectedNumber;
    if (s === "singular" || s === "plural") return s;
    return null;
}

/** Tense the player resolved (verb form or helping verb). */
export function selectedTense(card: VerbaCard): string | null {
    const t = (card as any).selectedTense;
    return typeof t === "string" ? t : null;
}

function typesMatch(a: string, b: string): boolean {
    return a === b || a === WILD || b === WILD;
}

/** Colour/syntax chain: prev → next is allowed by nextCards/previousCards/allowCards. */
export function chainAllows(prevCard: VerbaCard, nextCard: VerbaCard): boolean {
    if (isWild(prevCard) || isWild(nextCard)) return true;

    const nextType = String(nextCard.type);
    const allowedNext = prevCard.nextCards ?? [];
    if (allowedNext.includes(nextType)) return true;

    const exceptions = prevCard.allowCards ?? [];
    if (exceptions.includes(nextType)) return true;

    const allowedPrev = nextCard.previousCards ?? [];
    return allowedPrev.includes(String(prevCard.type));
}

/**
 * Adjective icons (Person/Animal/Place) vs Noun categories / Location symbols.
 * rulebook §3B: "You must match these to the Noun/Location type."
 */
export function adjectiveFitsNoun(adj: VerbaCard, target: VerbaCard): boolean {
    if (isWild(adj) || isWild(target)) return true;

    const conditions = (adj.condition ?? []).filter(c => c.type === String(target.type));
    if (!conditions.length) return true; // adjective unrestricted

    const targetType = String(target.type);
    const targetConds = (target.condition ?? []).filter(c => c.type === "Adj");
    if (targetType === "Noun" && !targetConds.length) return true; // noun unrestricted

    return conditions.some(cond => {
        if (cond.categories?.length) {
            const targetCats = targetConds.flatMap(c => c.categories ?? []);
            return cond.categories.some(cat => targetCats.includes(cat));
        }
        if ((cond as any).symbols?.length) {
            const targetSymbols = String((target as any).symbol ?? "").split("/");
            return (cond as any).symbols.some((s: string) => targetSymbols.includes(s));
        }
        return true;
    });
}

/**
 * Smiley faces (number): singular noun face must match a verb form
 * offered for that number. rulebook §3B.
 */
export function numberAgrees(noun: VerbaCard, verb: VerbaCard): boolean {
    if (isWild(noun) || isWild(verb)) return true;

    const num = selectedNumber(noun);
    if (!num) return true; // selection missing — UI contract, checked in T7 wiring

    const verbForms = Array.isArray(verb.content) ? (verb.content as any[]) : [];
    if (!verbForms.length) return true; // verb has no numbered forms

    // Determine which verb form is selected (by index or by matching selectedConditions)
    let selectedForm: any;
    const selectedIndex = (verb as any).selectedContentIndex;
    if (selectedIndex !== undefined && selectedIndex >= 0) {
        selectedForm = verbForms[selectedIndex];
    }
    if (!selectedForm && Array.isArray((verb as any).selectedConditions)) {
        const selConds = (verb as any).selectedConditions as string[];
        selectedForm = verbForms.find(f => {
            const conds = f.condition ?? [];
            return conds.length === selConds.length && conds.every((c: string) => selConds.includes(c));
        });
    }

    // Check the SELECTED verb form
    if (selectedForm) {
        const conds: string[] = selectedForm.condition ?? [];
        return conds.includes(num) || conds.length === 0;
    }

    // Fallback: if no selection info, check if any form matches
    return verbForms.some((form) => {
        const conds: string[] = form.condition ?? [];
        return conds.includes(num) || conds.length === 0;
    });
}

/**
 * Tense squares: selected verb form tense must be offered by the Time card
 * (or match the HelpingVerb's tense). rulebook §3B.
 * Checks ALL TimeCard→Verb pairs in the sentence, not just adjacent ones.
 */
export function tenseAgrees(timeCard: VerbaCard, verbCard: VerbaCard): boolean {
    if (isWild(timeCard) || isWild(verbCard)) return true;

    const vTense = selectedTense(verbCard);
    if (!vTense) return true; // selection missing — UI contract

    const tTense = selectedTense(timeCard);
    if (tTense) {
        return tTense.split("/").map(t => t.trim()).includes(vTense);
    }
    return true; // time card without selected tense — no constraint yet
}

/**
 * Find all TimeCard→Verb pairs in the sentence and validate tense agreement
 * for each pair, not just adjacent ones.
 */
export function validateAllTensePairs(sentence: VerbaCard[]): string[] {
    const errors: string[] = [];
    const timeCards = sentence
        .map((card, index) => ({ card, index }))
        .filter(({ card }) => card.type === "TimeCard");

    const verbs = sentence
        .map((card, index) => ({ card, index }))
        .filter(({ card }) => card.type === "Verb");
    for (const { card: timeCard, index: timeIndex } of timeCards) {
        // Check against EVERY Verb in the sentence, not just adjacent or subsequent ones
        for (const { card: verbCard, index: verbIndex } of verbs) {
            if (!tenseAgrees(timeCard, verbCard)) {
                errors.push(`tense-mismatch:TimeCard[${timeIndex}]->Verb[${verbIndex}]`);
            }
        }
    }
    return errors;
}

/** First-card rule per mode. rulebook §5C mandates Noun-first for Co-op. */
export function firstCardAllowed(card: VerbaCard, mode: GrammarMode): boolean {
    if (isWild(card)) return true;
    if (mode === "coop") return card.type === "Noun";
    // Standard/Split: rulebook permits Time/Location at the start; a sentence
    // subject must be a Noun otherwise.
    return ["Noun", "TimeCard", "Location"].includes(String(card.type));
}

/** Adjacent pair validation (type chain + grammar-specific checks). */
export function validateConnection(prevCard: VerbaCard, nextCard: VerbaCard): string[] {
    const errors: string[] = [];
    const prevType = String(prevCard.type);
    const nextType = String(nextCard.type);

    if (!chainAllows(prevCard, nextCard)) {
        errors.push(`invalid-chain:${prevType}->${nextType}`);
    }

    if (!isWild(prevCard) && !isWild(nextCard)) {
        if (prevType === "Adj" && (nextType === "Noun" || nextType === "Location")) {
            if (!adjectiveFitsNoun(prevCard, nextCard)) errors.push("adjective-category-mismatch");
        }
        if (prevType === "Noun" && nextType === "Verb" && !numberAgrees(prevCard, nextCard)) {
            errors.push("number-agreement-mismatch");
        }
        if (prevType === "TimeCard" && nextType === "Verb" && !tenseAgrees(prevCard, nextCard)) {
            errors.push("tense-mismatch");
        }
        // Time → HelpingVerb carries the tense square forward to the verb
        if (prevType === "TimeCard" && nextType === "HelpingVerb") {
            const hv = (nextCard as any).typeWord;
            const tTense = selectedTense(prevCard);
            if (tTense && hv && !tTense.split("/").map((t: string) => t.trim()).includes(hv)) {
                errors.push("tense-mismatch");
            }
        }
    }

    return errors;
}

/** Full-sentence validation. Errors keyed by card index. */
export function validateSentence(
    sentence: VerbaCard[],
    mode: GrammarMode = "standard",
    options: ValidationOptions = {}
): ValidationResult {
    const errors: Record<number, string[]> = {};
    const add = (i: number, msgs: string[]) => {
        if (!msgs.length) return;
        errors[i] = [...(errors[i] ?? []), ...msgs];
    };

    if (sentence.length === 0) {
        return { valid: false, errors: { 0: ["empty-sentence"] } };
    }

    if (!firstCardAllowed(sentence[0], mode)) {
        add(0, [mode === "coop" ? "first-card-not-noun" : "invalid-first-card"]);
    }

    sentence.forEach((card, i) => {
        if (options.requireSelections && !isWild(card)) {
            if (card.type === "Noun" && !selectedNumber(card)) add(i, ["noun-face-required"]);
            if (card.type === "Verb") {
                if (!selectedTense(card)) add(i, ["verb-face-required"]);
                if (!Array.isArray((card as any).selectedConditions)) add(i, ["verb-number-required"]);
            }
            if (card.type === "TimeCard" && !selectedTense(card)) add(i, ["time-face-required"]);
        }
        if (i === 0) return;
        add(i, validateConnection(sentence[i - 1], card));
    });

    const verbs = sentence
        .map((card, index) => ({ card, index }))
        .filter(({ card }) => card.type === "Verb");
    for (const { card: verb, index: verbIndex } of verbs) {
        const noun = sentence.slice(0, verbIndex).reverse().find(card => card.type === "Noun");
        if (noun && !numberAgrees(noun, verb)) add(verbIndex, ["number-agreement-mismatch"]);
    }

    // Check non-adjacent TimeCard→Verb tense pairs across the full sentence
    const tenseErrors = validateAllTensePairs(sentence);
    for (const error of tenseErrors) {
        const match = error.match(/TimeCard\[(\d+)\]/);
        if (match) {
            const timeIndex = parseInt(match[1]);
            add(timeIndex, ["tense-mismatch"]);
        }
    }

    return { valid: Object.keys(errors).length === 0, errors };
}

