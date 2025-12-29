<template>
  <div class="page-shell pixel-bg">
    <div class="w-full max-w-5xl">
      <!-- Header -->
      <div class="flex items-center mb-8">
        <back-btn class="mr-4 static" />
        <h1 class="text-3xl font-bold text-pix-ink card-font uppercase tracking-wide">About VerbaPix</h1>
      </div>

      <!-- Main Panel -->
      <div class="pixel-panel p-6 md:p-8 bg-pix-paper min-h-[400px]">
        <h2 class="text-2xl font-bold text-pix-ink mb-4">What is VerbaPix?</h2>
        <p class="text-lg text-pix-ink mb-6">
          VerbaPix is a language learning card game that combines the fun of pixel art with the educational power of sentence building. Collect cards, battle friends, and master grammar!
        </p>

        <div class="flex flex-col md:flex-row gap-6 mt-8">
          <div class="pixel-card p-4 flex-1">
            <h3 class="font-bold text-pix-primary mb-2">Learn</h3>
            <p class="text-sm">Improve your vocabulary and grammar skills through engaging gameplay.</p>
          </div>
          <div class="pixel-card p-4 flex-1">
             <h3 class="font-bold text-pix-success mb-2">Play</h3>
            <p class="text-sm">Challenge friends in standard matches or team up in co-op mode.</p>
          </div>
          <div class="pixel-card p-4 flex-1">
             <h3 class="font-bold text-pix-warning mb-2">Collect</h3>
            <p class="text-sm">Unlock rare pixel art cards, cosmetics, and achievements as you level up.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BackBtn from '@/components/navigation/BackButton.vue'

export default {
  name: 'AboutView',
  components: {
    BackBtn
  }
}
</script>
