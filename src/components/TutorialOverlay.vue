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
                <h2 class="text-2xl md:text-3xl font-bold mb-6 text-center">{{ $t('tutorial.title') }}</h2>

                <div class="space-y-6">
                    <section>
                        <h3 class="text-xl font-bold mb-2 flex items-center">
                            <span
                                class="pixel-inset w-9 h-9 flex items-center justify-center mr-2 font-black">1</span>
                            {{ $t('tutorial.goal_title') }}
                        </h3>
                        <p class="text-gray-700 ml-10">
                            {{ $t('tutorial.goal_body') }}
                        </p>
                    </section>

                    <section>
                        <h3 class="text-xl font-bold mb-2 flex items-center">
                            <span
                                class="pixel-inset w-9 h-9 flex items-center justify-center mr-2 font-black">2</span>
                            {{ $t('tutorial.gameplay_title') }}
                        </h3>
                        <ul class="list-disc ml-14 text-gray-700 space-y-1">
                            <li>{{ $t('tutorial.rule_start_cards') }}</li>
                            <li>{{ $t('tutorial.rule_drag') }}</li>
                            <li>{{ $t('tutorial.rule_discard') }}</li>
                            <li>{{ $t('tutorial.rule_bonus') }}</li>
                        </ul>
                    </section>

                    <section>
                        <h3 class="text-xl font-bold mb-2 flex items-center">
                            <span
                                class="pixel-inset w-9 h-9 flex items-center justify-center mr-2 font-black">3</span>
                            {{ $t('tutorial.winning_title') }}
                        </h3>
                        <p class="text-gray-700 ml-10">
                            {{ $t('tutorial.winning_body') }}
                            <br>
                            <span class="text-sm text-gray-500">{{ $t('tutorial.winning_hint') }}</span>
                        </p>
                    </section>

                    <div class="pixel-inset p-4 mt-6">
                        <h4 class="font-bold mb-2 uppercase tracking-wider">{{ $t('tutorial.pro_tip_title') }}</h4>
                        <p class="text-sm text-slate-700">
                            {{ $t('tutorial.pro_tip_body') }}
                        </p>
                    </div>
                </div>

                <div class="mt-8 text-center">
                    <button
                        class="pixel-btn primary"
                        @click="$emit('close')">
                        {{ $t('tutorial.cta') }}
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
