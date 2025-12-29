<template>
  <div class="page-shell pixel-bg">
    <div class="w-full max-w-5xl">
      <!-- Header -->
      <div class="flex items-center mb-8">
        <back-btn class="mr-4 static" />
        <h1 class="text-3xl font-bold text-pix-ink card-font uppercase tracking-wide">How to Play</h1>
      </div>

      <!-- Main Panel -->
      <div class="pixel-panel p-6 md:p-8 bg-pix-paper min-h-[400px]">
        <div class="space-y-8">

          <div class="flex gap-4 items-start">
            <div class="pixel-chip bg-pix-primary text-white text-lg w-8 h-8 flex items-center justify-center shrink-0">1</div>
            <div>
              <h3 class="text-xl font-bold text-pix-ink mb-2">Build a Sentence</h3>
              <p class="text-pix-ink">Drag cards from your hand to the table to form a grammatically correct sentence. Each card type (Noun, Verb, Adjective) has a specific color.</p>
            </div>
          </div>

          <div class="flex gap-4 items-start">
             <div class="pixel-chip bg-pix-success text-white text-lg w-8 h-8 flex items-center justify-center shrink-0">2</div>
            <div>
              <h3 class="text-xl font-bold text-pix-ink mb-2">Score Points</h3>
              <p class="text-pix-ink">Longer sentences and rarer cards earn more points. Use special bonus cards to multiply your score!</p>
            </div>
          </div>

           <div class="flex gap-4 items-start">
             <div class="pixel-chip bg-pix-warning text-white text-lg w-8 h-8 flex items-center justify-center shrink-0">3</div>
            <div>
              <h3 class="text-xl font-bold text-pix-ink mb-2">Win the Match</h3>
              <p class="text-pix-ink">Be the first to reach the target score or have the most points after 5 rounds.</p>
            </div>
          </div>

        </div>

        <div class="mt-8 text-center">
          <router-link to="/play" class="pixel-btn primary text-lg px-8">START PRACTICE</router-link>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import BackBtn from '@/components/navigation/BackButton.vue'

export default {
  name: 'TutorialView',
  components: {
    BackBtn
  }
}
</script>
