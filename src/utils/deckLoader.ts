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

// Base path pattern
const GET_BASE_PATH = (setId: number | string) => `/contents/cards_set_${setId}/`;

export async function loadDeck(setId: number | string = 1): Promise<VerbaCard[]> {
  let deck: VerbaCard[] = [];
  const basePath = GET_BASE_PATH(setId);

  for (const file of CARD_FILES) {
    try {
      const response = await fetch(`${basePath}${file}`);
      if (!response.ok) {
        console.error(`Failed to load ${file} from Set ${setId}: ${response.statusText}`);
        continue;
      }
      const cards: VerbaCard[] = await response.json();

      // Post-processing
      cards.forEach(card => {
          // Tag with Set ID for tracking
          // @ts-ignore
          card.setId = Number(setId);

          // Ensure type consistency if needed
          if (file === "Conjuntion.json" && !card.type) card.type = "Conj";
      });

      deck = deck.concat(cards);
    } catch (error) {
      console.error(`Error loading ${file} from Set ${setId}:`, error);
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
