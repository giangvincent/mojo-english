<template>
  <div class="min-h-screen bg-pix-paper flex items-center justify-center p-4">
    <div class="pixel-panel p-8 bg-white max-w-lg w-full flex flex-col gap-6">
      <h1 class="text-3xl font-display text-center text-pix-ink">Create Room</h1>

      <div class="space-y-4">
        <!-- Room Name -->
        <div>
          <label class="block font-bold text-pix-ink mb-2">Room Name</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="e.g. VerbaMasters"
            class="w-full p-3 border-2 border-pix-ink font-pixel focus:outline-none focus:border-pix-primary"
          />
        </div>

        <!-- Password (Optional) -->
        <div>
          <label class="block font-bold text-pix-ink mb-2">Password <span class="text-xs font-normal text-gray-500">(Optional)</span></label>
          <input
            v-model="form.password"
            type="password"
            placeholder="Leave empty for open room"
            class="w-full p-3 border-2 border-pix-ink font-pixel focus:outline-none focus:border-pix-primary"
          />
        </div>

        <!-- Game Mode -->
        <div>
          <label class="block font-bold text-pix-ink mb-2">Game Mode</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="mode in modes"
              :key="mode.id"
              type="button"
              @click="form.gameMode = mode.id"
              class="p-2 border-2 text-sm font-bold transition-colors"
              :class="form.gameMode === mode.id ? 'bg-pix-primary text-white border-pix-ink' : 'bg-white text-gray-500 border-gray-300'"
            >
              {{ mode.name }}
            </button>
          </div>
        </div>
      </div>

      <div class="flex gap-4 mt-6">
        <button @click="$router.push('/')" class="pixel-btn danger flex-1">CANCEL</button>
        <button
          @click="createRoom"
          :disabled="!form.name"
          class="pixel-btn success flex-1"
          :class="{ 'opacity-50 cursor-not-allowed': !form.name }"
        >
          CREATE
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { MatchmakingService } from '@/services/matchmaking';

export default {
  name: 'CreateRoom',
  data() {
    return {
      form: {
        name: '',
        password: '',
        gameMode: 'standard'
      },
      modes: [
        { id: 'standard', name: 'Standard' },
        { id: '5-4-split', name: '5/4 Split' },
        { id: 'coop', name: 'Co-op' }
      ]
    }
  },
  methods: {
    async createRoom() {
      if (!this.form.name) return;

      try {
        const { roomId } = await MatchmakingService.createRoom(this.form);
        // Navigate to Lobby (reusing existing Lobby component or new one if specified)
        // User mentioned "Host will have responsibility to start".
        // Existing Lobby likely handles this.
        this.$router.push({
          name: 'lobby',
          query: { roomId: roomId, isHost: 'true' }
        });
      } catch (err) {
        console.error("Failed to create room:", err);
        alert("Failed to create room.");
      }
    }
  }
}
</script>
