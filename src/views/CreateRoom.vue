<template>
  <div class="page-shell pixel-bg">
    <div class="w-full max-w-lg">
      <div class="pixel-panel p-8 bg-white flex flex-col gap-6">
        <h1 class="text-3xl font-display text-center text-pix-ink">Create Room</h1>

        <div class="space-y-4">
          <!-- Room Name -->
          <div>
            <label class="block font-bold text-pix-ink mb-2 uppercase tracking-wide text-xs">Room Name</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="e.g. VerbaMasters"
              class="w-full p-3 border-2 border-pix-ink font-pixel focus:outline-none focus:border-pix-primary rounded-none shadow-none"
            />
          </div>

          <!-- Password (Optional) -->
          <div>
            <label class="block font-bold text-pix-ink mb-2 uppercase tracking-wide text-xs">Password <span class="text-xs font-normal opacity-50 lowercase">(Optional)</span></label>
            <input
              v-model="form.password"
              type="password"
              placeholder="Leave empty for open room"
              class="w-full p-3 border-2 border-pix-ink font-pixel focus:outline-none focus:border-pix-primary rounded-none shadow-none"
            />
          </div>

          <!-- Game Mode -->
          <div>
            <label class="block font-bold text-pix-ink mb-2 uppercase tracking-wide text-xs">Game Mode</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="mode in modes"
                :key="mode.id"
                type="button"
                @click="form.gameMode = mode.id"
                class="p-2 border-2 text-sm font-bold transition-colors pixel-btn"
                :class="form.gameMode === mode.id ? 'primary border-pix-ink' : 'ghost border-pix-ink/30 text-gray-500'"
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
