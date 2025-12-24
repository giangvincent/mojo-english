import { loadDeck, shuffleDeck } from '@/utils/deckLoader';

export default {
  async initializeGame({ commit }, mode = 'standard') {
    commit('setGameMode', mode);
    commit('resetGame');

    // 1. Load Deck
    const rawDeck = await loadDeck();
    const shuffledDeck = shuffleDeck(rawDeck);

    // 2. Deal based on mode
    let handSize = 7;
    let communityCount = 0;

    if (mode === '5-4-split') {
        handSize = 2;
        communityCount = 1;
    } else if (mode === 'coop') {
        handSize = 3; // or 4 if 2 players
    }

    // Deal to Player
    const playerHand = shuffledDeck.slice(0, handSize);
    let remainingDeck = shuffledDeck.slice(handSize);

    commit('setHand', playerHand);

    // Deal to Community (if applicable)
    if (communityCount > 0) {
        const communityCards = remainingDeck.slice(0, communityCount);
        remainingDeck = remainingDeck.slice(communityCount);
        commit('setCommunityCards', communityCards);
    } else {
        commit('setCommunityCards', []);
    }

    commit('setDeck', remainingDeck);
    commit('setCurrentRound', 1);
  },

  advanceRound({ commit, state }) {
    if (state.gameMode === '5-4-split') {
        if (state.currentRound >= 4) {
            // End game logic or stay
            return;
        }

        // Logic from Rulebook:
        // Round 1: 1 Middle, 2 Hand (Already set by init)
        // Round 2: +1 Middle, +1 Hand
        // Round 3: +1 Middle, +1 Hand
        // Round 4: +1 Middle, +1 Hand

        const deck = [...state.deck];
        if (deck.length < 2) {
            console.warn("Deck empty!");
            return;
        }

        const newCommunity = deck.shift();
        const newHand = deck.shift();

        commit('addToCommunityCards', newCommunity);
        commit('addToHand', newHand);
        commit('setDeck', deck);
        commit('nextRound');
    } else {
        // Standard round progression
        commit('nextRound');
    }
  },

  playCard({ commit, state }, card) {
    // Remove from hand or community
    // If we track source, we can be more specific.
    // For now, assume player plays from hand mainly
    commit('removeFromHand', card.id);
    // Add to table logic would be handled by UI state (nounPhrase etc)
    // or we can add a 'table' state if needed.
  },

  discardCard({ commit, state }, cardId) {
     const card = state.hand.find(c => c.id === cardId);
     if (card) {
         commit('removeFromHand', cardId);
         commit('addToDiscardPile', card);
     }
  },

  drawCard({ commit, state }) {
      if (state.deck.length > 0) {
          const deck = [...state.deck];
          const card = deck.shift();
          commit('addToHand', card);
          commit('setDeck', deck);
      }
  }
}
