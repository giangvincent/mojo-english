import { VerbaCard } from "@/types/verba";

// Q4 approval: deck = 10 type files + WildCard.json; Time-full.json is a
// non-deck variant (excluded). Set 1 = 73 runtime cards, Set 2 = 60.
const CARD_FILES_BY_SET = {
  1: [
    "Noun.json", "Verb.json", "Adjective.json", "Adverb.json", "Conjuntion.json",
    "ExtraInformation.json", "HelpingVerb.json", "Location.json", "Preposition.json",
    "Time.json", "WildCard.json"
  ],
  2: [
    "Noun.json", "Verb.json", "Adjective.json", "Adverb.json", "Conjuntion.json",
    "ExtraInformation.json", "HelpingVerb.json", "Location.json", "Preposition.json",
    "Time.json", "WildCard.json"
  ]
};

const BASE_PATH_BY_SET = { 1: "/contents/cards_set_1/", 2: "/contents/cards_set_2/" };

export async function loadDeck(set: 1 | 2 = 1): Promise<VerbaCard[]> {
  const files = CARD_FILES_BY_SET[set];
  if (!files) throw new Error(`Unknown deck set: ${set}`);
  const base = BASE_PATH_BY_SET[set];
  let deck: VerbaCard[] = [];

  for (const file of files) {
    try {
      const response = await fetch(`${base}${file}`);
      if (!response.ok) {
        console.error(`Failed to load ${file}: ${response.statusText}`);
        continue;
      }
      const cards: VerbaCard[] = await response.json();

      // Post-processing: fix Conjuntion file which omits the "type" field
      cards.forEach(card => {
        if (file === "Conjuntion.json" && !card.type) card.type = "Conj";
      });

      deck = deck.concat(cards);
    } catch (error) {
      console.error(`Error loading ${file}:`, error);
    }
  }

  return deck;
}

export function shuffleDeck(deck: VerbaCard[]): VerbaCard[] {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}