import { Card, GrammaticalNumber, LocationType, Tense } from "./types";

export const cards: Card[] = [
    {
        choices: [
            { grammaticalNumber: GrammaticalNumber.Singular, text: "monster", points: 3 },
            { grammaticalNumber: GrammaticalNumber.Plural, text: "monsters", points: 6 },
        ]
    },
    {
        choices: [
            { tense: Tense.Present, grammaticalNumber: GrammaticalNumber.Plural, text: "play", points: 3 },
            { tense: Tense.Present, grammaticalNumber: GrammaticalNumber.Singular, text: "plays", points: 4 },
            { tense: Tense.Past, grammaticalNumber: GrammaticalNumber.Any, text: "played", points: 5 },
        ]
    },
    {
        points: 5,
        location: LocationType.Medium,
    }
];
