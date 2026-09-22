<template>
  <div class="page-shell pixel-bg">
    <div class="w-full max-w-5xl">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6 px-4">
        <div class="flex items-center gap-4 cursor-pointer" @click="$router.push('/')">
          <button class="pixel-icon-btn">
            <span class="text-2xl">&lt;</span>
          </button>
          <div>
            <h1 class="inline-flex text-xl font-bold leading-tight md:text-2xl card-font text-white">Multiplayer Lobby
            </h1>
          </div>
        </div>
      </div>

      <div class="pixel-panel p-6 md:p-8 bg-pix-paper min-h-[500px]">

        <!-- Tab Navigation -->
        <div class="flex gap-4 mb-8 border-b-4 border-pix-ink pb-4">
          <button @click="activeTab = 'standard'" class="pixel-btn"
            :class="activeTab === 'standard' ? 'primary' : 'ghost border-2 border-pix-ink'">
            Standard Room
          </button>
          <button @click="activeTab = 'quick'" class="pixel-btn"
            :class="activeTab === 'quick' ? 'primary' : 'ghost border-2 border-pix-ink'">
            Quick Match
          </button>
        </div>

        <!-- STANDARD MODE -->
        <section v-if="activeTab === 'standard'">
          <div v-if="!roomCode" class="grid gap-8 md:grid-cols-2">
            <!-- Create Room -->
            <div class="pixel-inset bg-white p-6 flex flex-col items-center text-center">
              <h3 class="text-xl font-display mb-4 text-pix-ink">Create Room</h3>
              <p class="mb-6 text-sm text-pix-ink">Start a new game and invite your friends.</p>
              <div class="w-full mb-4 text-left">
                <label class="block font-bold text-pix-ink mb-2 uppercase text-xs">Room Name</label>
                <input v-model="createRoomName" type="text"
                  class="w-full p-2 border-2 border-pix-ink font-pixel rounded-none focus:outline-none focus:border-pix-primary"
                  placeholder="My Game Room" />
              </div>
              <button @click="handleCreateRoom" class="pixel-btn primary w-full">Create Room</button>
            </div>

            <!-- Join Room -->
            <div class="pixel-inset bg-white p-6 flex flex-col items-center text-center">
              <h3 class="text-xl font-display mb-4 text-pix-ink">Join Room</h3>
              <p class="mb-6 text-sm text-pix-ink">Enter a code to join an existing game.</p>
              <div class="w-full mb-4 text-left">
                <label class="block font-bold text-pix-ink mb-2 uppercase text-xs">Room Code</label>
                <input v-model="joinRoomCode" type="text"
                  class="w-full p-2 border-2 border-pix-ink font-pixel rounded-none focus:outline-none focus:border-pix-primary"
                  placeholder="ABC-123" />
              </div>
              <button @click="handleJoinRoom" class="pixel-btn ghost border-2 border-pix-ink w-full">Join Room</button>
            </div>
          </div>

          <!-- Lobby View (Inside Room) -->
          <div v-else class="flex flex-col gap-6">
            <div class="flex justify-between items-center border-b-2 border-pix-ink pb-4">
              <div>
                <p class="text-xs uppercase font-bold text-pix-ink opacity-70">Room Code</p>
                <h2 class="text-4xl font-display text-pix-primary">{{ roomCode }}</h2>
              </div>
              <button @click="handleLeaveRoom" class="pixel-btn danger">LEAVE</button>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <div v-for="player in players" :key="player.id"
                class="pixel-card p-4 flex items-center gap-4 bg-white relative">
                <img :src="player.photo?.src || 'https://placehold.co/64x64?text=Player'"
                  class="w-12 h-12 border-2 border-pix-ink" />
                <div class="flex-1">
                  <p class="font-bold text-pix-ink">{{ player.name }}</p>
                  <p class="text-xs text-pix-ink opacity-70">{{ player.isHost ? 'Host' : 'Ready' }}</p>
                </div>
                <div v-if="player.isHost" class="pixel-chip bg-purple-500 text-white absolute top-2 right-2">HOST</div>
              </div>

              <!-- Empty Slots placeholders -->
              <div v-for="n in (4 - players.length)" :key="`empty-${n}`"
                class="border-2 border-dashed border-pix-ink/30 p-4 flex items-center gap-4 opacity-50">
                <div class="w-12 h-12 border-2 border-dashed border-pix-ink/30 bg-gray-50"></div>
                <div class="flex-1">
                  <p class="text-sm italic">Waiting for player...</p>
                </div>
              </div>
            </div>

            <div class="flex justify-center mt-8">
              <button v-if="isHost" @click="handleStartGame" :disabled="players.length < 2"
                class="pixel-btn primary text-xl py-4 px-12">
                START GAME
              </button>
              <div v-else class="text-pix-ink animate-pulse font-bold text-lg">
                Waiting for host to start...
              </div>
            </div>
            <p v-if="isHost && players.length < 2" class="text-center mt-2 text-pix-danger text-sm font-bold">Need at
              least 2 players</p>
          </div>
        </section>

        <!-- QUICK MATCH MODE -->
        <section v-if="activeTab === 'quick'" class="text-center py-12">
          <div v-if="gameStatus === 'waiting_match'">
            <div class="spinner mb-6 mx-auto"></div> <!-- Keep or replace with pixel spinner -->
            <h3 class="text-2xl font-display mb-2 text-pix-ink">Searching for Opponents...</h3>
            <p class="text-pix-ink mb-8">Time elapsed: {{ elapsedTime }}s</p>

            <button @click="cancelQuickMatch" class="pixel-btn danger">CANCEL</button>
          </div>
          <div v-else>
            <h3 class="text-2xl font-display mb-4 text-pix-ink">Quick Match</h3>
            <p class="text-pix-ink mb-8 max-w-md mx-auto">Find a game automatically. We will match you with other
              players looking for a game.</p>
            <button @click="handleQuickMatch" class="pixel-btn warning text-xl py-4 px-12">FIND MATCH</button>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MultiplayerLobby',
  data() {
    return {
      activeTab: 'standard', // 'standard' or 'quick' (though Quick Match has its own view now)
      // Local UI state for room details if we came here from CreateRoom
      isQuickMatch: false,
      timerInterval: null,
      elapsedTime: 0,
      createRoomName: '',
      joinRoomCode: ''
    }
  },
  computed: {
    roomId() {
      return this.$route.query.roomId || this.$store.state.multiplayer.roomId;
    },
    roomCode() {
      return this.$store.state.multiplayer.roomCode;
    },
    isHost() {
      return this.$store.state.multiplayer.isHost;
    },
    players() {
      return this.$store.state.multiplayer.players;
    },
    gameStatus() {
      return this.$store.state.multiplayer.gameStatus;
    }
  },
  async mounted() {
    if (this.roomId && !this.roomCode) {
      try {
        await this.$store.dispatch('multiplayer/joinRoom', this.roomId);
        await this.$store.dispatch('multiplayer/subscribeRoom');
      } catch (error) {
        console.error('Failed to join room:', error);
      }
    }
    if (this.roomCode) this.startPolling();
  },
  methods: {
    handleCreateRoom() {
      // Logic to create room
      this.$router.push('/create-room');
    },
    async handleJoinRoom() {
      if (this.joinRoomCode) {
        await this.$store.dispatch('multiplayer/joinByCode', this.joinRoomCode);
        await this.$store.dispatch('multiplayer/subscribeRoom');
        this.startPolling();
        this.$router.replace({ name: 'lobby', query: { roomId: this.$store.state.multiplayer.roomId } });
      }
    },
    startPolling() {
      if (this.timerInterval) return;
      this.timerInterval = setInterval(() => {
        this.elapsedTime++;
        if (this.elapsedTime % 5 === 0) this.$store.dispatch('multiplayer/refreshRoom');
      }, 1000);
    },
    async handleLeaveRoom() {
      await this.$store.dispatch('multiplayer/leaveRoom');
      this.$router.push('/');
    },
    async handleStartGame() {
      await this.$store.dispatch('multiplayer/startGame');
      this.$router.push({
        name: 'play',
        query: {
          mode: 'standard',
          roomId: this.$store.state.multiplayer.roomId,
          multiplayer: true
        }
      });
    },
    // Keep for compatibility if used elsewhere, but Home.vue links directly to QuickMatchSetup
    handleQuickMatch() {
      this.$router.push('/quick-match');
    },
    cancelQuickMatch() {
      this.$store.dispatch('multiplayer/cancelQuickMatch')
    }
  },
  beforeUnmount() {
    if (this.timerInterval) clearInterval(this.timerInterval)
  }
}
</script>

<style scoped>
/* Scoped styles removed in favor of global pixel classes */
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #fff;
  /* lighter */
  border-top: 4px solid var(--pix-primary);
  border-radius: 0;
  /* Square spinner */
  animation: spin 1s steps(8) infinite;
  /* Pixelated spin */
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
