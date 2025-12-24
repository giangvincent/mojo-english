import { VerbaCard } from "@/types/verba";

// Mapping filenames to card types if needed, or just loading all
const CARD_FILES = [
  "Noun.json",
  "Verb.json",
  "Adjective.json",
  "Adverb.json",
  "Conjuntion.json", // Note: file name in public/contents/cards_set_1/ is "Conjuntion.json" (typo in source likely)
  "ExtraInformation.json",
  "HelpingVerb.json",
  "Location.json",
  "Preposition.json",
  "Time.json"
];

const BASE_PATH = "/contents/cards_set_1/";

export async function loadDeck(): Promise<VerbaCard[]> {
  let deck: VerbaCard[] = [];

  for (const file of CARD_FILES) {
    try {
      const response = await fetch(`${BASE_PATH}${file}`);
      if (!response.ok) {
        console.error(`Failed to load ${file}: ${response.statusText}`);
        continue;
      }
      const cards: VerbaCard[] = await response.json();

      // Post-processing if needed (e.g. assigning unique IDs if missing, though JSON seems to have them)
      // Fix specific data issues if found (like "type" casing)
      cards.forEach(card => {
          // Ensure type consistency if needed
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
