<template>
    <div class="w-screen h-full min-h-screen flex flex-col p-4 mb-64 relative pixel-bg transition-colors duration-700 ease-in-out"
        :style="backgroundStyle">

        <!-- Navigation / Header -->
        <div
            class="grid md:grid-cols-2 bg-pix-paper border-b-4 border-pix-ink items-center justify-center gap-2 md:justify-between mb-6 p-3 shadow-lg sticky top-0 z-[100]">
            <div class="flex flex-1 flex-row justify-center md:justify-start items-center gap-2">
                <button @click="$router.push('/')" class="pixel-btn font-pixel danger text-sm">
                    &lt; EXIT
                </button>
                <div class="flex gap-2">
                    <button class="pixel-icon-btn danger text-xl" @click="handleResetGame" title="Reset Game">
                        &#8635;
                    </button>
                    <button class="pixel-icon-btn text-xl" @click="openSettings" title="Settings">
                        ⚙
                    </button>
                    <button class="pixel-icon-btn text-xl" @click="showTutorial = true" title="How to Play">
                        ?
                    </button>
                </div>
            </div>

            <div class="flex flex-1 flex-row gap-2 items-center justify-end">
                <div class="pixel-chip bg-pix-paper text-pix-ink font-pixel text-lg">
                    <span class="font-bold">MODE:</span> {{ gameMode }}
                </div>
                <div class="pixel-chip bg-pix-warning text-pix-ink font-pixel text-lg">
                    ROUND {{ round }}
                </div>
            </div>
        </div>

        <!-- Community Pool (Only for Split 5/4 or if needed) -->
        <div v-if="gameMode === '5-4-split'" class="mb-4">
            <CommunityPool />
        </div>

        <div v-if="!canBuildSentence" class="pixel-panel bg-pix-paper p-6 mb-4 text-center">
            <h2 class="font-display text-2xl mb-2">{{ $t('playing.exchange_round', { round, max: maxRounds }) }}</h2>
            <p class="font-pixel mb-4">{{ $t('playing.discard_then_continue', { count: maxDiscards }) }}</p>
            <button class="pixel-btn primary" @click="handleAdvancePreparation">{{ $t('playing.finish_exchange') }}</button>
        </div>

        <!-- Table Area (Sentence Builder is available after preparation rounds) -->
        <TableArea v-else :key="tableKey" :playing-step="playingStep" :round="round" :game-mode="gameMode"
            :sentence-prefix="gameMode === 'coop' ? coopSentence : []"
            :hand-size-at-start="roundHandSize" @play="handlePlaySentence" @lock="handleLockSentence"
            @update:sentence="updateBackgroundParams" />

        <button v-if="gameMode === 'coop' && coopSentence.length" class="pixel-btn danger mx-auto mb-4"
            @click="finishCoopGame">{{ $t('playing.end_coop') }}</button>

        <!-- Hand Component -->
        <HandComponent />

        <!-- Modals -->
        <round-summary v-if="showRoundSummary" :round="round" :score="roundScores[round - 1] || 0"
            :totalScore="totalScore" :sentence="finalSentence" :winner="gameMode === 'coop' ? winner : ''"
            :xpEarned="lastXpEarned" :xpContext="lastXpContext" :xpCurrent="progressionXp"
            :xpToNext="progressionXpToNext" :level="progressionLevel || playerData.level"
            @next-round="handleNextRound" />

        <level-up-modal v-if="showLevelUpModal" :level="newLevel" :unlocks="newUnlocks"
            @close="showLevelUpModal = false" />

        <game-over v-if="playingStep === 'end'" :finalSentence="finalSentence" :finalPoint="finalPoint"></game-over>
        <tutorial-overlay v-if="showTutorial" @close="showTutorial = false" />

        <!-- Loading State -->
        <div v-if="loading" class="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
            <div class="text-xl font-bold animate-pulse text-pix-primary font-pixel">Loading Deck...</div>
        </div>

    </div>
</template>

<script>
import { defineComponent, computed, onMounted, ref, defineAsyncComponent, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import HandComponent from '@/components/game/HandComponent.vue';
import TableArea from '@/components/game/TableArea.vue';
import CommunityPool from '@/components/game/CommunityPool.vue';
import { calculateXpFromContext } from '@/utils/xp';
import { calculateScore } from '@/utils/scoringEngine';
import { validateSentence } from '@/utils/grammarEngine';

export default defineComponent({
    name: 'VerbaGame',
    components: {
        HandComponent,
        TableArea,
        CommunityPool,
        RoundSummary: defineAsyncComponent(() => import('@/components/RoundSummary.vue')),
        TutorialOverlay: defineAsyncComponent(() => import('@/components/TutorialOverlay.vue')),
        LevelUpModal: defineAsyncComponent(() => import('@/components/LevelUpModal.vue')),
        GameOver: defineAsyncComponent(() => import('@/components/GameOver.vue')),
    },
    setup() {
        const store = useStore();
        const router = useRouter();
        const route = useRoute();
        const loading = ref(true);

        const showRoundSummary = ref(false);
        const showLevelUpModal = ref(false);
        const showTutorial = ref(false);
        const newLevel = ref(1);
        const newUnlocks = ref([]);

        // Mapped State
        const gameMode = computed(() => store.state.playing.gameMode);
        // Use robust computed getters for the active game view.
        const currentRound = computed(() => store.state.playing.currentRound);
        const maxRounds = computed(() => store.state.playing.maxRounds);
        const maxDiscards = computed(() => store.state.playing.maxDiscards);
        const canBuildSentence = computed(() => gameMode.value === 'coop' || currentRound.value > maxRounds.value);
        const totalScore = computed(() => store.state.playing.totalScore);
        const roundScores = computed(() => store.state.playing.roundScores);
        const roundHandSize = computed(() => store.state.playing.roundHandSize);
        const coopSentence = computed(() => store.state.playing.coopSentence);
        const tableKey = ref(0);
        const winner = computed(() => store.state.playing.winner);

        const isMultiplayer = computed(() => store.state.playing.isMultiplayer);

        const progressionLevel = computed(() => store.state.progression.level);
        const progressionXp = computed(() => store.state.progression.xp);
        const progressionXpToNext = computed(() => store.state.progression.xpToNext);
        const playerData = computed(() => store.state.player.playerData);

        // Tracking
        const lastXpEarned = ref(0);
        const lastXpContext = ref({});
        const finalSentence = ref('');
        const playingStep = computed(() => store.state.playing.playingStep);
        const finalPoint = ref(0);

        // Discard Logic
        const discardList = ref([]); // Temporary list for drag target
        const handleDiscard = (evt) => {
            if (evt.added) {
                const card = evt.added.element;
                console.log("Discarding:", card);
                store.dispatch('discardCard', card.id);
                // Clear the local list immediately so it looks like it was consumed
                discardList.value = [];
            }
        };

        onMounted(async () => {
            // Initialize Game (Standard by default for now, or fetch from route params)
            const mode = route.query.mode || 'standard';
            const isMp = route.query.multiplayer === 'true' || route.query.isHost === 'true'; // Basic check

            // T13: deck set gated by progression unlock (Set 2 triggered by the 'Set 2 Starter' unlock / level 10+)
            const unlockedSets = store.state.progression?.unlocks?.sets ?? ['Set 1 Starter'];
            const hasSet2 = unlockedSets.some(s => String(s).includes('Set 2') || String(s).includes('Bonus Characters'));
            const set = (route.query.set === '2' || hasSet2) ? 2 : 1;

            console.log('Initializing game with mode:', mode, 'Multiplayer:', isMp);

            if (isMp) {
                const mpState = store.state.multiplayer || {};
                const playersReady = mpState.gameStatus === 'playing' &&
                    Array.isArray(mpState.players) &&
                    mpState.players.length > 0 &&
                    mpState.players.every(p => p.ready);
                store.commit('setMultiplayerState', {
                    isMultiplayer: true,
                    playersReady: playersReady
                });
            }

            const playerCount = isMp ? Math.max((store.state.multiplayer.players?.length || 1), 1) : 1;
            await store.dispatch('initializeGame', { mode, set, playerCount });
            loading.value = false;
        });

        const handleNextRound = () => {
            showRoundSummary.value = false;
            if (currentRound.value >= maxRounds.value) {
                store.commit('setPlayingStep', 'end');
                return;
            }
            store.dispatch('advanceRound');
        };

        const handleAdvancePreparation = () => {
            store.dispatch('advanceRound');
        };

        const handleResetGame = () => {
            store.commit('resetGame');
            store.dispatch('onMatchComplete', {
                finishedMatch: true,
                wonMatch: false,
                score: store.state.playing.totalScore
            });
            router.push('/');
        };

        const openSettings = () => {
            store.commit('SET_MODAL', true);
        };

        // Watch for Level Up
        watch(progressionLevel, (newVal, oldVal) => {
            if (newVal > oldVal && oldVal > 0) {
                newLevel.value = newVal;
                import('@/utils/unlocks').then(({ getUnlocksForLevel }) => {
                    newUnlocks.value = getUnlocksForLevel(newVal);
                    showLevelUpModal.value = true;
                });
            }
        });

        // Dynamic Background Logic (keep existing)
        const currentBg = ref('url("/assets/images/pixel_default_bg.jpg")');
        const bgDefinitions = {
            'default': 'url("/assets/images/pixel_default_bg.jpg")',
            'space': 'url("/assets/images/pixel_space_fun.jpg")',
            'cave': 'url("/assets/images/pixel_cave.jpg")',
            'mountain': 'url("/assets/images/pixel_mountain.jpg")',
            'island': 'url("/assets/images/pixel_island.jpg")',
            'jungle': 'url("/assets/images/pixel_jungle.jpg")',
            'forest': 'url("/assets/images/pixel_forest.jpg")',
            'snow': 'url("/assets/images/pixel_snow.jpg")',
            'rain': 'url("/assets/images/pixel_rain.png")'
        };

        const updateBackgroundParams = (sentence) => {
            const locationCard = sentence.find(c => c.type === 'Location');
            if (locationCard) {
                let text = locationCard.selectedText ||
                    (Array.isArray(locationCard.content) && locationCard.content[0] ? (typeof locationCard.content[0] === 'string' ? locationCard.content[0] : locationCard.content[0].text) : '');
                text = text.toLowerCase();

                if (text.includes('cave')) currentBg.value = bgDefinitions['cave'];
                else if (text.includes('mountain')) currentBg.value = bgDefinitions['mountain'];
                else if (text.includes('island')) currentBg.value = bgDefinitions['island'];
                else if (text.includes('jungle')) currentBg.value = bgDefinitions['jungle'];
                else if (text.includes('forest') || text.includes('wood')) currentBg.value = bgDefinitions['forest'];
                else if (text.includes('snow')) currentBg.value = bgDefinitions['snow'];
                else if (text.includes('rain')) currentBg.value = bgDefinitions['rain'];
                else currentBg.value = bgDefinitions['default'];
            } else {
                currentBg.value = bgDefinitions['space'];
            }
        };

        const backgroundStyle = computed(() => {
            const isImage = currentBg.value.includes('url');
            return {
                background: currentBg.value,
                backgroundSize: isImage ? 'cover' : '400% 400%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                animation: isImage ? 'none' : 'gradientBG 15s ease infinite'
            };
        });

        const handleLockSentence = () => {
            store.commit('setPlayingStep', 'choose-word');
        };

        const handlePlaySentence = async (sentence) => {
            console.log("Playing Sentence:", sentence);

            // 0. Rulebook validation backstop (engine is the single source)
            const validation = validateSentence(sentence, gameMode.value, { requireSelections: true });
            if (!validation.valid) {
                alert('Sentence is not valid: ' + Object.values(validation.errors).flat().join(', '));
                return;
            }

            if (gameMode.value === 'coop') {
                const playerId = store.state.player.playerData.id || 'local';
                await store.dispatch('submitCoopTurn', { sentence, playerId });
                if (isMultiplayer.value) {
                    await store.dispatch('multiplayer/submitTurn', [sentence[sentence.length - 1].id]);
                }
                finalSentence.value = sentence.map(c => c.selectedText || c.word || 'card').join(' ');
                finalPoint.value = calculateScore(sentence, roundHandSize.value).totalPoints;
                store.commit('setPlayingStep', 'arrange-card');
                tableKey.value += 1;
                return;
            }

            // 1. Score Calculation — single source: scoringEngine (rulebook §4)
            const handSizeAtStart = roundHandSize.value;
            const { totalPoints: roundScore, breakdown } = calculateScore(sentence, handSizeAtStart);

            // 2. Commit Score
            store.commit('addRoundScore', roundScore);

            // 3. XP Calculation
            const xpContext = {
                correctSentence: true,
                score: roundScore,
                cardsUsed: sentence,
                sentenceText: sentence.map(c => c.selectedText || c.content?.main || c.content?.[0] || 'card').join(' '),
                multiplier: store.state.progression.xpMultiplier || 1,
                // Add more context as needed
            };

            lastXpEarned.value = calculateXpFromContext(xpContext);
            lastXpContext.value = xpContext;
            // XP exactly once: awardFromContext already dispatches gainXp internally (T8)
            await store.dispatch('awardFromContext', xpContext);

            // T15: advance mission/achievement hooks from normal play
            const wonThisRound = totalScore.value >= 200;
            await store.dispatch('onSentenceSubmit', {
                sentenceBuilt: true,
                tense: sentence.find(c => c.selectedTense)?.selectedTense || null,
                cardsUsed: sentence,
                bonusPoints: breakdown.bonusPoints,
                perfectRound: breakdown.handBonus > 0,
                matchesWon: wonThisRound ? 1 : 0,
                sentenceText: xpContext.sentenceText,
                score: roundScore
            });

            // 4. Finalize Round
            finalSentence.value = xpContext.sentenceText;
            finalPoint.value = roundScore;

            if (isMultiplayer.value) {
                store.commit('setRoundPhase', 'waiting');
                await store.dispatch('multiplayer/submitTurn', sentence.map(card => card.id));
                store.commit('setRoundPhase', 'revealing');
                showRoundSummary.value = true;
            } else {
                // Check Win/End
                if (totalScore.value >= 200 || currentRound.value >= maxRounds.value) {
                    store.commit('setPlayingStep', 'end'); // Trigger Game Over
                    // Save Match Stats
                    await store.dispatch('onMatchComplete', {
                        finishedMatch: true,
                        wonMatch: totalScore.value >= 200,
                        matchesWon: totalScore.value >= 200 ? 1 : 0,
                        score: totalScore.value
                    });
                } else {
                    showRoundSummary.value = true;
                }
            }
        };

        const finishCoopGame = async () => {
            const sentence = coopSentence.value;
            const { totalPoints, breakdown } = calculateScore(sentence, roundHandSize.value);
            finalSentence.value = sentence.map(c => c.selectedText || c.word || 'card').join(' ');
            finalPoint.value = totalPoints;
            store.commit('addRoundScore', totalPoints);
            await store.dispatch('awardFromContext', {
                correctSentence: true,
                score: totalPoints,
                cardsUsed: sentence,
                sentenceText: finalSentence.value,
                bonusCombos: breakdown.bonusPoints > 0 ? 1 : 0,
                finishedMatch: true,
                multiplier: store.state.progression.xpMultiplier || 1
            });
            store.commit('setPlayingStep', 'end');
        };

        return {
            gameMode,
            isMultiplayer,
            round: currentRound,
            currentRound,
            maxRounds,
            maxDiscards,
            canBuildSentence,
            totalScore,
            roundScores,
            roundHandSize,
            coopSentence,
            tableKey,
            loading,
            handleNextRound,
            handleAdvancePreparation,
            handlePlaySentence,
            finishCoopGame,
            handleLockSentence,
            handleResetGame,
            openSettings,
            discardList,
            handleDiscard,
            backgroundStyle,
            updateBackgroundParams,
            showRoundSummary,
            showLevelUpModal,
            showTutorial,
            newLevel,
            newUnlocks,
            lastXpEarned,
            lastXpContext,
            progressionLevel,
            progressionXp,
            progressionXpToNext,
            finalSentence,
            winner,
            playingStep,
            finalPoint,
            playerData
        };
    }
});
</script>
