<template>
  <div class="min-h-screen w-full flex flex-col items-center justify-center p-4">
    <div class="pixel-panel p-10 bg-white w-full max-w-lg flex flex-col items-center gap-6 text-center">

      <div class="animate-bounce">
        <span class="text-6xl">🔍</span>
      </div>

      <h2 class="text-2xl font-display text-pix-ink">Looking for players...</h2>

      <div class="w-full bg-gray-200 h-4 rounded-full overflow-hidden border-2 border-pix-ink relative">
        <div class="h-full bg-pix-primary animate-pulse w-full"></div>
      </div>

      <p class="font-pixel text-lg">
        Mode: <span class="font-bold uppercase text-pix-primary">{{ mode }}</span>
      </p>

      <p class="text-gray-500 font-pixel">
        Estimated wait: {{ timeLeft }}s
      </p>

      <button @click="cancelSearch" class="pixel-btn danger mt-4 w-full">
        CANCEL
      </button>

      <div v-if="error" class="text-red-500 font-bold mt-2">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import { MatchmakingService } from '@/services/matchmaking';

export default {
  name: 'WaitingRoom',
  data() {
    return {
      mode: '',
      timeLeft: 15,
      error: null,
      timer: null
    }
  },
  created() {
    this.mode = this.$route.query.mode || 'standard';
    this.startSearch();
    this.startTimer();
  },
  beforeUnmount() {
    if (this.timer) clearInterval(this.timer);
  },
  methods: {
    startTimer() {
      this.timer = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        }
      }, 1000);
    },
    async startSearch() {
      try {
        const { roomId } = await MatchmakingService.joinQuickMatch(this.mode);
        // Simulate "Players Found" delay
        setTimeout(() => {
          // Navigate to Game with roomId
          this.$router.push({
            name: 'play',
            query: { mode: this.mode, roomId: roomId, multiplayer: true }
          });
        }, 1000);
      } catch (err) {
        this.error = "Failed to find a match. Please try again.";
        console.error(err);
      }
    },
    cancelSearch() {
      // Logic to cancel request would go here
      this.$router.push('/quick-match');
    }
  }
}
</script>
