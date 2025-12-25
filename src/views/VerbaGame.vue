<template>
    <div class="min-h-screen flex flex-col p-4 pb-64 relative pixel-bg transition-colors duration-700 ease-in-out"
        :style="backgroundStyle">

        <!-- Navigation / Header -->
        <div
            class="flex items-start justify-between mb-6 sticky top-0 z-[100] p-3 bg-pix-paper border-b-4 border-pix-ink shadow-lg">
            <div class="flex flex-col gap-2">
                <button @click="$router.push('/')" class="pixel-btn danger text-sm font-bold tracking-wider">
                    &lt; EXIT GAME
                </button>
                <div class="pixel-chip bg-pix-paper text-pix-ink mt-2 font-pixel text-xs">
                    <span class="font-bold">MODE:</span> {{ gameMode }}
                </div>
            </div>

            <div class="flex flex-col items-end gap-2">
                <div class="pixel-chip bg-pix-warning text-pix-ink font-pixel text-lg">
                    ROUND {{ round }}
                </div>
                <!-- Debug button removed or made smaller/hidden if not needed for user -->
            </div>
        </div>

        <!-- Community Pool (Only for Split 5/4 or if needed) -->
        <div v-if="gameMode === '5-4-split'" class="mb-4">
            <CommunityPool />
        </div>

        <!-- Table Area (Sentence Builder) -->
        <TableArea @play="handlePlaySentence" @update:sentence="updateBackgroundParams" />

        <!-- Discard Area (Placeholder) -->
        <div
            class="mt-8 text-center text-pix-ink opacity-50 border-2 border-dashed border-pix-ink p-4 bg-white bg-opacity-20 pixel-border font-mono">
            Discard Area (Drag here to discard)
        </div>

        <!-- Hand Component -->
        <HandComponent />

        <!-- Loading State -->
        <div v-if="loading" class="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
            <div class="text-xl font-bold animate-pulse text-pix-primary font-pixel">Loading Deck...</div>
        </div>
    </div>
</template>

<script>
import { defineComponent, computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import HandComponent from '@/components/game/HandComponent.vue';
import TableArea from '@/components/game/TableArea.vue';
import CommunityPool from '@/components/game/CommunityPool.vue';

export default defineComponent({
    name: 'VerbaGame',
    components: { HandComponent, TableArea, CommunityPool },
    setup() {
        const store = useStore();
        const router = useRouter();
        const loading = ref(true);

        const gameMode = computed(() => store.state.gameMode);
        const round = computed(() => store.state.currentRound);

        onMounted(async () => {
            // Initialize Game (Standard by default for now, or fetch from route params)
            await store.dispatch('initializeGame', '5-4-split'); // Testing the complex mode
            loading.value = false;
        });

        const nextRound = () => {
            store.dispatch('advanceRound');
        };

        const handlePlaySentence = (sentence) => {
            console.log("Playing Sentence:", sentence);
            // Dispatch action to finalize turn, score, etc.
            // store.dispatch('completeTurn', sentence);
            alert(`Played sentence with ${sentence.length} cards!`);
        };

        // Dynamic Background Logic
        const currentBg = ref('url("/assets/images/pixel_default_bg.jpg")'); // Default Space

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
            // Debugging: Check if this function is called and what checks are properly detected
            console.log('updateBackgroundParams called with sentence:', sentence);
            const locationCard = sentence.find(c => c.type === 'Location');
            console.log('Location Card Found:', locationCard);

            if (locationCard) {
                // Determine the text to match against: prefer selectedText (if user made a choice), detection fallback to content[0]
                let text = '';
                if (locationCard.selectedText) {
                    text = locationCard.selectedText.toLowerCase();
                } else if (Array.isArray(locationCard.content) && locationCard.content.length > 0) {
                    // Check if content is string or object
                    const firstContent = locationCard.content[0];
                    text = (typeof firstContent === 'string' ? firstContent : firstContent.text).toLowerCase();
                }
                console.log("Checking background for text:", text);

                if (text.includes('cave')) currentBg.value = bgDefinitions['cave'];
                else if (text.includes('mountain')) currentBg.value = bgDefinitions['mountain'];
                else if (text.includes('island')) currentBg.value = bgDefinitions['island'];
                else if (text.includes('jungle')) currentBg.value = bgDefinitions['jungle'];
                else if (text.includes('forest') || text.includes('wood')) currentBg.value = bgDefinitions['forest'];
                else if (text.includes('snow')) currentBg.value = bgDefinitions['snow'];
                else if (text.includes('rain')) currentBg.value = bgDefinitions['rain'];
                else currentBg.value = bgDefinitions['default'];

                console.log("Set background to:", currentBg.value);

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
                animation: isImage ? 'none' : 'gradientBG 15s ease infinite',
                color: 'white'
            };
        });

        return {
            gameMode,
            round,
            loading,
            nextRound,
            handlePlaySentence,
            backgroundStyle,
            updateBackgroundParams
        };
    }
});
</script>
