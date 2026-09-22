import { loadDeck, shuffleDeck } from '@/utils/deckLoader';

// Rulebook section 5: maximum discards per round, by mode and round.
// Standard: 3. 5/4 Split: 1 for rounds 1-3, up to 2 in round 4. Co-op: 1.
function maxDiscardsFor(mode, round) {
    if (mode === '5-4-split') return round >= 4 ? 2 : 1;
    if (mode === 'coop') return 1;
    return 3;
}

export default {
    async initializeGame({ commit }, mode = 'standard', set = 1) {
        let playerCount = 1;
        // If receiving an object as mode (e.g. from dispatch), extract the string
        if (typeof mode === 'object' && mode.mode) {
            set = mode.set ?? set;
            playerCount = mode.playerCount ?? playerCount;
            mode = mode.mode;
        }
        commit('setGameMode', mode);
        commit('resetGame');

        // 1. Load Deck (set 2 gated by unlock — chosen by the caller)
        const rawDeck = await loadDeck(set);
        const shuffledDeck = shuffleDeck(rawDeck);

        // 2. Deal based on mode (rulebook section 5)
        let handSize = 7;
        let communityCount = 0;
        let maxRounds;

        if (mode === '5-4-split') {
            // Mode B: hand 2→5, pool 1→4, 4 rounds
            handSize = 2;
            communityCount = 1;
            maxRounds = 4;
        } else if (mode === 'coop') {
            // Mode C: 3 per player, or 4 each in a two-player game.
            handSize = playerCount === 2 ? 4 : 3;
            maxRounds = 1;
        } else {
            maxRounds = 3;
        }

        commit('setMaxRounds', maxRounds);

        // Deal to Community (if applicable) - These persist and grow in Split mode
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
        commit('setRoundHandSize', handSize);
        commit('setDeck', currentDeck);
        commit('setMaxDiscards', maxDiscardsFor(mode, 1));
        commit('setCurrentRound', 1);
    },

    advanceRound({ commit, state }) {
        // Prepare for next round
        if (state.gameMode === '5-4-split') {
            // Mode B progressive: each round deals +1 to hand (max 5) and +1 to pool (max 4)
            let deck = [...state.deck];
            if (state.hand.length < 5 && deck.length > 0) {
                commit('addToHand', deck.shift());
            }
            if (state.communityCards.length < 4 && deck.length > 0) {
                commit('addToCommunityCards', deck.shift());
            }
            commit('setDeck', deck);
            // Track the hand size at start of each round for scoring
            const newHandSize = Math.min(5, 2 + state.currentRound);
            commit('setRoundHandSize', newHandSize);
            commit('setMaxDiscards', maxDiscardsFor('5-4-split', state.currentRound + 1));
            commit('nextRound');
            commit('setPlayingStep', 'arrange-card');
            commit('setDiscardCount', 0);
            return;
        }

        // Standard rounds are discard/draw opportunities over the same hand.
        // The player lays down one sentence after the third round.
        commit('setMaxDiscards', maxDiscardsFor('standard', state.currentRound + 1));
        commit('nextRound');
        commit('setPlayingStep', 'arrange-card');
        commit('setDiscardCount', 0);
    },

    playCard({ commit, state }, card) {
        // Remove from hand or community
        // If card is in hand, remove it.
        // If card is in community, do NOT remove it (shared cards are reusable or persistent?
        // Shared cards stay in the pool for Split mode.
        // So only remove from HAND.
        const inHand = state.hand.find(c => c.id === card.id);
        if (inHand) {
            commit('removeFromHand', card.id);
        }
    },

    discardCard({ commit, state }, cardId) {
        const card = state.hand.find(c => c.id === cardId);
        if (card && state.discardCount < state.maxDiscards) {
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

    submitCoopTurn({ commit, state }, { sentence, playerId = 'local' }) {
        const previous = state.coopSentence;
        const preservesPrefix = previous.every((card, index) => sentence[index]?.id === card.id);
        if (!preservesPrefix || sentence.length !== previous.length + 1) {
            throw new Error('Co-op turns must append exactly one card');
        }

        const appended = sentence[sentence.length - 1];
        commit('setCoopSentence', [...sentence]);
        commit('recordTurn', { playerId, cardId: appended.id });
        commit('setWinner', playerId);

        if (!state.hand.some(card => card.id === appended.id) && state.deck.length > 0) {
            const deck = [...state.deck];
            commit('addToHand', deck.shift());
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
