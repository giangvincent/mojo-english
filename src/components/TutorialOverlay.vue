<template>
    <div class="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
        @click.self="$emit('close')">
        <div
            class="pixel-panel max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button class="absolute top-4 right-4 pixel-icon-btn"
                @click="$emit('close')">
                &times;
            </button>

            <div class="p-8">
                <h2 class="text-2xl md:text-3xl font-bold mb-6 text-center">How to Play</h2>

                <div class="space-y-6">
                    <section>
                        <h3 class="text-xl font-bold mb-2 flex items-center">
                            <span
                                class="pixel-inset w-9 h-9 flex items-center justify-center mr-2 font-black">1</span>
                            Goal
                        </h3>
                        <p class="text-gray-700 ml-10">
                            Build the highest scoring sentence using your cards. Match colors to ensure correct grammar!
                        </p>
                    </section>

                    <section>
                        <h3 class="text-xl font-bold mb-2 flex items-center">
                            <span
                                class="pixel-inset w-9 h-9 flex items-center justify-center mr-2 font-black">2</span>
                            Gameplay
                        </h3>
                        <ul class="list-disc ml-14 text-gray-700 space-y-1">
                            <li>You start with <strong>7 cards</strong> (Standard Mode).</li>
                            <li>Drag cards to arrange them into a sentence.</li>
                            <li>Discard up to 3 cards to get new ones.</li>
                            <li><strong>+5 Bonus Points</strong> if you keep all your original cards!</li>
                        </ul>
                    </section>

                    <section>
                        <h3 class="text-xl font-bold mb-2 flex items-center">
                            <span
                                class="pixel-inset w-9 h-9 flex items-center justify-center mr-2 font-black">3</span>
                            Winning
                        </h3>
                        <p class="text-gray-700 ml-10">
                            Play <strong>3 Rounds</strong>. The player with the highest total score wins!
                            <br>
                            <span class="text-sm text-gray-500">(Or reach 200 points to win instantly)</span>
                        </p>
                    </section>

                    <div class="pixel-inset p-4 mt-6">
                        <h4 class="font-bold mb-2 uppercase tracking-wider">Pro Tip</h4>
                        <p class="text-sm text-slate-700">
                            Look for the colored bars on the sides of cards. They show you which cards can connect to
                            each other!
                        </p>
                    </div>
                </div>

                <div class="mt-8 text-center">
                    <button
                        class="pixel-btn primary"
                        @click="$emit('close')">
                        Got it! Let's Play
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'tutorial-overlay',
    emits: ['close']
}
</script>
