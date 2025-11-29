<template>
    <div class="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
        @click.self="$emit('close')">
        <div
            class="bg-white text-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
                @click="$emit('close')">
                &times;
            </button>

            <div class="p-8">
                <h2 class="text-3xl font-bold mb-6 text-center text-blue-600">How to Play Mojo Family Fun</h2>

                <div class="space-y-6">
                    <section>
                        <h3 class="text-xl font-bold mb-2 flex items-center">
                            <span
                                class="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-2">1</span>
                            Goal
                        </h3>
                        <p class="text-gray-700 ml-10">
                            Build the highest scoring sentence using your cards. Match colors to ensure correct grammar!
                        </p>
                    </section>

                    <section>
                        <h3 class="text-xl font-bold mb-2 flex items-center">
                            <span
                                class="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center mr-2">2</span>
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
                                class="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center mr-2">3</span>
                            Winning
                        </h3>
                        <p class="text-gray-700 ml-10">
                            Play <strong>3 Rounds</strong>. The player with the highest total score wins!
                            <br>
                            <span class="text-sm text-gray-500">(Or reach 200 points to win instantly)</span>
                        </p>
                    </section>

                    <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-6">
                        <h4 class="font-bold text-yellow-800 mb-2">💡 Pro Tip:</h4>
                        <p class="text-yellow-700 text-sm">
                            Look for the colored bars on the sides of cards. They show you which cards can connect to
                            each other!
                        </p>
                    </div>
                </div>

                <div class="mt-8 text-center">
                    <button
                        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105"
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
