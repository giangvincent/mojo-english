export enum GrammaticalNumber {
    Singular,
    Plural,
    Any,
};

export enum Tense {
    Past,
    Present,
    Future,
}

export enum LocationType {
    Weather = "A",
    Small = "B",
    Medium = "C",
    Large = "D"
}

export interface Choice {
    points: number;
    text: string;
}

export interface PersonChoice extends Choice {
    grammaticalNumber: GrammaticalNumber;
}

export interface ActionChoice extends Choice {
    grammaticalNumber: GrammaticalNumber;
    tense: Tense;
}

export interface PersonCard {
    choices: [PersonChoice, PersonChoice]
}

export interface ActionCard {
    choices: [ActionChoice, ActionChoice, ActionChoice]
}

export interface LocationCard {
    points: number;
    location: LocationType;
}

export type Card = PersonCard | ActionCard | LocationCard;
