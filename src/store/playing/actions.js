import { loadDeck, shuffleDeck } from '@/utils/deckLoader';

export default {
    async initializeGame({ commit }, mode = 'standard') {
        // If receiving an object as mode (e.g. from dispatch), extract the string
        if (typeof mode === 'object' && mode.mode) {
            mode = mode.mode;
        }
        commit('setGameMode', mode);
        commit('resetGame');

        // 1. Load Deck
        const rawDeck = await loadDeck();
        const shuffledDeck = shuffleDeck(rawDeck);

        // 2. Deal based on mode
        let handSize = 7;
        let communityCount = 0;

        if (mode === '5-4-split') {
            handSize = 5;
            communityCount = 4;
        } else if (mode === 'coop') {
            handSize = 7;
        }

        // Deal to Community (if applicable) - These are persistent for the match in Split mode
        let currentDeck = [...shuffledDeck];
        if (communityCount > 0) {
            const communityCards = currentDeck.slice(0, communityCount);
            currentDeck = currentDeck.slice(communityCount);
            commit('setCommunityCards', communityCards);
        } else {
            commit('setCommunityCards', []);
        }

        // Deal to Player
        const playerHand = currentDeck.slice(0, handSize);
        currentDeck = currentDeck.slice(handSize);

        commit('setHand', playerHand);
        commit('setDeck', currentDeck);
        commit('setCurrentRound', 1);
    },

    advanceRound({ commit, state }) {
        // Prepare for next round: Deal new hand
        let handSize = 7;
        if (state.gameMode === '5-4-split') {
            handSize = 5;
            // Community cards persist, so we don't change them
        }

        const deck = [...state.deck];

        // Check if enough cards
        if (deck.length < handSize) {
            console.warn("Not enough cards in deck for next round!");
            // Optionally reshape discard pile into deck here
            return;
        }

        const newHand = deck.slice(0, handSize);
        const remainingDeck = deck.slice(handSize);

        commit('setHand', newHand);
        commit('setDeck', remainingDeck);
        commit('nextRound');

        // Reset step to arrange-card
        commit('setPlayingStep', 'arrange-card');
        commit('setDiscardCount', 0);
    },

    playCard({ commit, state }, card) {
        // Remove from hand or community
        // If card is in hand, remove it.
        // If card is in community, do NOT remove it (shared cards are reusable or persistent?
        // PlayGround logic: "immutable" shared cards list. They stay in the pool.
        // So only remove from HAND.
        const inHand = state.hand.find(c => c.id === card.id);
        if (inHand) {
            commit('removeFromHand', card.id);
        }
    },

    discardCard({ commit, state }, cardId) {
        const card = state.hand.find(c => c.id === cardId);
        if (card) {
            // commit('removeFromHand', cardId);
            commit('addToDiscardPile', card);
            commit('incrementDiscardCount');

            if (state.deck.length > 0) {
                const deck = [...state.deck];
                const newCard = deck.shift();
                const hand = [...state.hand];
                const cardIndex = state.hand.findIndex(c => c.id === cardId);
                hand[cardIndex] = newCard;
                commit('setHand', hand);
                commit('setDeck', deck);
            } else {
                console.warn("Deck empty, cannot replace.");
            }
        }
    },

    replaceCard({ commit, state }, cardOb) {
        // Logic: Swap old card with new one from deck
        // 1. Remove old
        commit('removeFromHand', cardOb.cardOb.id);

        // 2. Draw new
        if (state.deck.length > 0) {
            const cardsSameType = state.deck.filter(c => c.type === cardOb.cardType)
            const newCard = cardsSameType[0];
            const hand = [...state.hand];
            hand[cardOb.index] = newCard;
            commit('setHand', hand);
            commit('setDeck', state.deck.filter(c => c.id !== newCard.id));
        } else {
            console.warn("Deck empty, cannot replace.");
        }
    },

    drawCard({ commit, state }) {
        if (state.deck.length > 0) {
            const deck = [...state.deck];
            const card = deck.shift();
            commit('addToHand', card);
            commit('setDeck', deck);
        }
    },

    async saveSentenceToVault({ state }, sentenceData) {
        try {
            // Lazy load the service to avoid circular dependencies if any
            const gvPixelService = (await import('@/services/gvPixel')).default;

            const sentenceText = typeof sentenceData === 'string'
                ? sentenceData
                : (Array.isArray(sentenceData) ? sentenceData.map(c => c.word).join(' ') : String(sentenceData));

            const result = await gvPixelService.saveToVault(sentenceText, {
                gameMode: state.gameMode,
                round: state.currentRound
            });

            console.log('Sentence saved to Vault:', result);
            return true;
        } catch (error) {
            console.error('Failed to save sentence:', error);
            return false;
        }
    }
}
