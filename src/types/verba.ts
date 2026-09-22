// src/types/verba.ts

export enum CardType {
    Noun = "Noun",
    Verb = "Verb",
    Location = "Location",
    Preposition = "Prep", // Matching existing "Prep" logic or JSON
    HelpingVerb = "HelpingVerb",
    Time = "Time", // or TimeCard
    Adjective = "Adj",
    Adverb = "Adverb",
    ExtraInformation = "ExtraInformation",
    Conjunction = "Conj",
    Wild = "Wild",
    PvP = "PvP",
    Animal = "Animal" // Saw in Noun.json condition
}

// Based on visual bars in rulebook.
// Purple, Green, Red, White, Orange, Blue, Yellow
// But in code (store/playing/index.js), it uses Tailwind colors:
// Noun: white (with icon), Adj: purple, Verb: green, Prep: red, Time: orange, Helper: blue
export enum SyntaxColor {
    Purple = "purple",
    Green = "green",
    Red = "red",
    White = "white",
    Orange = "orange",
    Blue = "blue",
    Yellow = "yellow",
    Pink = "pink", // Adverb
    None = "none"
}

export enum GameMode {
    Standard = "standard",
    Split54 = "5-4-split",
    CoOp = "coop"
}

export interface BonusCondition {
    type: string; // "Verb", "Adj", etc.
    word?: string[]; // Specific words
    content?: string[]; // Specific words (Adjective/ExtraInfo JSON uses this key)
    point: number;
    categories?: string[]; // e.g., ["person", "animal"]
}

export interface CardContent {
    text: string;
    point: number;
    tense?: string; // "present simple", etc.
    grammaticalNumber?: string; // "singular", "plural" - inferred from JSON structure which has singular/plural objects
    condition?: string[]; // ["singular", "plural", "repeat"] seen in Verb.json
}

export interface CardCondition {
    type: string; // "Adj", "Prep", etc.
    categories?: string[]; // "person", "animal"
    content?: string[]; // specific words allowed
    symbol?: string; // "F" for Frequency Adverb
    desc?: string;
}

export interface AdjectiveAdditional {
    synonym?: string[];
    antonym?: string[];
}

export interface AdjectiveContent {
    main: string;
    additional?: AdjectiveAdditional;
}

export interface AdverbContentGroup {
    type?: string[];
    text?: string[];
}

export interface ExtraInfoBonus {
    content: string[];
    point: number;
}

// Main Card Interface
export interface VerbaCard {
    id: string;
    type: CardType | string; // Type string from JSON
    image?: string;

    // Noun-specific
    singular?: CardContent;
    plural?: CardContent;

    // Verb-specific (Verb.json has 'content' array)
    // Also used for Adverb, Conj, HelpingVerb, ExtraInfo(top/bottom text)
    // Updated to allow AdjectiveContent, AdverbContentGroup
    content?: CardContent[] | AdjectiveContent | AdverbContentGroup[] | any;

    // General matching rules
    previousCards?: string[]; // List of types
    nextCards?: string[];     // List of types
    allowCards?: string[];    // "Conj", "Adverb"
    condition?: CardCondition[];

    // Bonus
    bonusPoint?: BonusCondition[]; // Extra Info bonus uses the same {type, content/word, point} shape

    // Simple cards (Prep, WildCard, etc.) carry a top-level point value
    point?: number;

    // Runtime selection state (attached by the UI when the player picks a face)
    selectedPoint?: number;
    selectedText?: string;
    selectedNumber?: 'singular' | 'plural';
    selectedTense?: string;
    selectedConditions?: string[];
}

export interface Player {
    id: string;
    name: string;
    hand: VerbaCard[];
    score: number;
}
