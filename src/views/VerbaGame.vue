<template>
    <div class="w-screen min-h-screen flex flex-col p-4 pb-64 relative pixel-bg transition-colors duration-700 ease-in-out"
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

        <!-- Table Area (Sentence Builder) -->
        <TableArea @play="handlePlaySentence" @update:sentence="updateBackgroundParams" />

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
import { useStore, mapMutations, mapActions } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import HandComponent from '@/components/game/HandComponent.vue';
import TableArea from '@/components/game/TableArea.vue';
import CommunityPool from '@/components/game/CommunityPool.vue';
import SoundManager from '@/utils/soundManager';
import { applyPvpEffect } from '@/utils/pvpEffects';
import { calculateXpFromContext } from '@/utils/xp';

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
        // PlayGround uses mapState: currentRound: state => state.playing.currentRound
        // Let's use robust computed getters
        const currentRound = computed(() => store.state.playing.currentRound);
        const round = currentRound; // Alias for compatibility with template
        const maxRounds = computed(() => store.state.playing.maxRounds);
        const totalScore = computed(() => store.state.playing.totalScore);
        const roundScores = computed(() => store.state.playing.roundScores);
        const winner = computed(() => store.state.playing.winner);

        const progressionLevel = computed(() => store.state.progression.level);
        const progressionXp = computed(() => store.state.progression.xp);
        const progressionXpToNext = computed(() => store.state.progression.xpToNext);
        const playerData = computed(() => store.state.player.playerData);

        const sharedCards = computed(() => store.state.playing.communityCards || []); // Fallback

        // Validations state
        const initialSharedCardIds = computed(() => store.state.playing.initialSharedCardIds || []);
        const usedSharedCardIds = computed(() => store.state.playing.usedSharedCardIds || []);

        // Tracking
        const matchCombos = ref([]);
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
                SoundManager.play('click'); // Or a specific discard sound
                // Clear the local list immediately so it looks like it was consumed
                discardList.value = [];
            }
        };

        onMounted(async () => {
            // Initialize Game (Standard by default for now, or fetch from route params)
            const mode = route.query.mode || 'standard';
            console.log('Initializing game with mode:', mode);
            await store.dispatch('initializeGame', mode);
            loading.value = false;
        });

        const handleNextRound = () => {
            showRoundSummary.value = false;
            store.dispatch('advanceRound');
            console.log(`Starting Round ${currentRound.value}`);
        };

        const handleResetGame = () => {
            store.commit('resetGame');
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
                    SoundManager.play('win');
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

        const handlePlaySentence = async (sentence) => {
            console.log("Playing Sentence:", sentence);

            // 1. Validation for Split Mode
            if (gameMode.value === '5-4-split') {
                // Check if ANY shared card is used
                // Assuming community pool cards are in store.state.playing.communityCards
                // and we need to verify usage.
                if (store.state.playing.communityCards && store.state.playing.communityCards.length > 0) { // Simple check if pool exists
                    const usedIds = sentence.map(c => c.id);
                    const communityIds = store.state.playing.communityCards.map(c => c.id);
                    const hasShared = usedIds.some(id => communityIds.includes(id));

                    if (!hasShared) {
                        alert("You must use at least one card from the Community Pool!");
                        SoundManager.play('error');
                        return;
                    }
                }
            }

            SoundManager.play('success');

            // 2. Score Calculation
            let roundScore = 0;
            // Base points from cards
            sentence.forEach(card => {
                // If CardComponent logic worked, card.selectedPoint should be set?
                // Or fallback to default logic.
                // TableArea sets card.selectedPoint on selection-change.
                roundScore += (card.selectedPoint !== undefined ? card.selectedPoint : (card.point || 0));
            });

            // Sentence Length Bonus (+5 for 7 cards)
            // Assuming standard deck size 7.
            // In PlayGround: cards.length === 7. Here 'sentence' is the array of used cards.
            // If they used 7 cards, they filled the slot? Or is it based on hand?
            // "use all 7 original cards without discarding" -> Harder to track here without hand state.
            // Let's rely on sentence length for now.
            if (sentence.length >= 7) {
                roundScore += 5;
            }

            // 3. Commit Score
            store.commit('addRoundScore', roundScore);

            // 4. XP Calculation
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
            await store.dispatch('awardFromContext', xpContext);
            await store.dispatch('gainXp', lastXpEarned.value);

            // 5. Finalize Round
            finalSentence.value = xpContext.sentenceText;
            finalPoint.value = roundScore;

            // Check Win/End
            if (totalScore.value >= 200 || currentRound.value >= maxRounds.value) {
                store.commit('setPlayingStep', 'end'); // Trigger Game Over
                SoundManager.play('win');
                // Save Match Stats
                await store.dispatch('onMatchComplete', {
                    finishedMatch: true,
                    wonMatch: totalScore.value >= 200,
                    score: totalScore.value
                });
            } else {
                showRoundSummary.value = true;
            }
        };

        return {
            gameMode,
            round: currentRound,
            currentRound,
            maxRounds,
            totalScore,
            roundScores,
            loading,
            handleNextRound,
            handlePlaySentence,
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
