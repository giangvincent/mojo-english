<template>
  <div class="relative min-h-screen overflow-hidden lobby-shell pixel-bg text-slate-900">
    <!-- Shared Background Elements -->
    <div class="bg-grid"></div>
    <div class="bg-glow bg-glow-1"></div>
    <div class="bg-glow bg-glow-2"></div>

    <header class="relative sticky top-0 z-10 flex items-center justify-between px-4 py-4 md:px-12 md:py-6">
      <div class="flex items-center gap-4 cursor-pointer" @click="$router.push('/')">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <div>
          <h1 class="inline-flex text-xl font-bold leading-tight md:text-2xl card-font">Multiplayer Lobby</h1>
        </div>
      </div>
    </header>

    <main class="relative z-10 w-full max-w-4xl px-4 pb-20 mx-auto md:px-12">

      <!-- Tab Navigation -->
      <div class="flex gap-4 mb-8">
        <button
          @click="activeTab = 'standard'"
          :class="['tab-btn', activeTab === 'standard' ? 'active' : '']">
          Standard Room
        </button>
        <button
          @click="activeTab = 'quick'"
          :class="['tab-btn', activeTab === 'quick' ? 'active' : '']">
          Quick Match
        </button>
      </div>

      <!-- STANDARD MODE -->
      <section v-if="activeTab === 'standard'" class="mode-panel">
        <div v-if="!roomCode" class="grid gap-8 md:grid-cols-2">
          <!-- Create Room -->
          <div class="action-card">
            <h3 class="text-xl font-display mb-4">Create Room</h3>
            <p class="mb-6 text-slate-600">Start a new game and invite your friends.</p>
            <div class="form-group mb-4">
              <label class="label">Room Name (Optional)</label>
              <input v-model="createRoomName" type="text" class="input" placeholder="My Game Room" />
            </div>
            <button @click="handleCreateRoom" class="cta primary w-full justify-center">Create Room</button>
          </div>

          <!-- Join Room -->
          <div class="action-card">
            <h3 class="text-xl font-display mb-4">Join Room</h3>
            <p class="mb-6 text-slate-600">Enter a code to join an existing game.</p>
            <div class="form-group mb-4">
              <label class="label">Room Code</label>
              <input v-model="joinRoomCode" type="text" class="input" placeholder="ABC-123" />
            </div>
            <button @click="handleJoinRoom" class="cta ghost w-full justify-center">Join Room</button>
          </div>
        </div>

        <!-- Lobby View (Inside Room) -->
        <div v-else class="lobby-room">
          <div class="flex justify-between items-center mb-6">
            <div>
              <p class="text-sm uppercase tracking-wide text-slate-500">Room Code</p>
              <h2 class="text-4xl font-display text-blue-600">{{ roomCode }}</h2>
            </div>
            <button @click="handleLeaveRoom" class="cta auth danger">Leave</button>
          </div>

          <div class="player-list grid gap-4 md:grid-cols-2 mb-8">
            <div v-for="player in players" :key="player.id" class="player-card glass">
              <img :src="player.photo?.src || 'https://placehold.co/64x64?text=Player'" class="w-12 h-12 border border-black" />
              <div class="flex-1">
                <p class="font-bold">{{ player.name }}</p>
                <p class="text-xs text-slate-500">{{ player.isHost ? 'Host' : 'Ready' }}</p>
              </div>
              <div v-if="player.isHost" class="badge badge-purple">HOST</div>
            </div>

            <!-- Empty Slots placeholders -->
            <div v-for="n in (4 - players.length)" :key="`empty-${n}`" class="player-card empty">
              <div class="w-12 h-12 border border-dashed border-slate-400 bg-slate-100"></div>
              <div class="flex-1">
                <p class="text-slate-400 italic">Waiting for player...</p>
              </div>
            </div>
          </div>

          <div class="flex justify-center">
             <button v-if="isHost" @click="handleStartGame" :disabled="players.length < 2" class="cta primary text-xl py-4 px-12">
               Start Game
             </button>
             <div v-else class="text-slate-500 animate-pulse">
               Waiting for host to start...
             </div>
          </div>
          <p v-if="isHost && players.length < 2" class="text-center mt-2 text-red-500 text-sm">Need at least 2 players</p>
        </div>
      </section>

      <!-- QUICK MATCH MODE -->
      <section v-if="activeTab === 'quick'" class="mode-panel text-center py-12">
        <div v-if="gameStatus === 'waiting_match'">
           <div class="spinner mb-6 mx-auto"></div>
           <h3 class="text-2xl font-display mb-2">Searching for Opponents...</h3>
           <p class="text-slate-600 mb-8">Time elapsed: {{ elapsedTime }}s</p>

           <button @click="cancelQuickMatch" class="cta auth danger">Cancel</button>
        </div>
        <div v-else>
           <h3 class="text-2xl font-display mb-4">Quick Match</h3>
           <p class="text-slate-600 mb-8 max-w-md mx-auto">Find a game automatically. We will match you with other players looking for a game.</p>
           <button @click="handleQuickMatch" class="cta primary text-xl py-4 px-12">Find Match</button>
        </div>
      </section>

    </main>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'MultiplayerLobby',
  data() {
    return {
      activeTab: 'standard',
      createRoomName: '',
      joinRoomCode: '',
      elapsedTime: 0,
      timerInterval: null
    }
  },
  computed: {
    ...mapState('multiplayer', ['roomCode', 'players', 'isHost', 'gameStatus']),
    ...mapState('player', ['playerData'])
  },
  methods: {
    ...mapActions('multiplayer', ['createRoom', 'joinRoom', 'leaveRoom', 'startGame', 'startQuickMatch', 'cancelQuickMatch']),

    async handleCreateRoom() {
      await this.createRoom(this.createRoomName)
    },
    async handleJoinRoom() {
      if(!this.joinRoomCode) return alert('Please enter a room code')
      await this.joinRoom(this.joinRoomCode)
    },
    handleLeaveRoom() {
      this.leaveRoom()
    },
    handleStartGame() {
      this.startGame()
      this.$router.push('/verba') // Or wherever the game view is
    },
    handleQuickMatch() {
      this.startQuickMatch()
      this.elapsedTime = 0
      this.timerInterval = setInterval(() => {
        this.elapsedTime++
        // Simulation: timeout after 30s or find match
        if(this.elapsedTime > 30 && this.players.length < 2) {
            // Timeout logic
        }
      }, 1000)
    },
    cancelQuickMatch() {
      clearInterval(this.timerInterval)
      this.$store.dispatch('multiplayer/cancelQuickMatch')
    }
  },
  beforeUnmount() {
    if(this.timerInterval) clearInterval(this.timerInterval)
  }
}
</script>

<style scoped>
.lobby-shell {
  background: transparent;
  font-family: var(--ui-font);
}

.tab-btn {
  padding: 1rem 2rem;
  font-weight: 800;
  text-transform: uppercase;
  border-bottom: 4px solid transparent;
  color: #64748b;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: #334155;
}

.tab-btn.active {
  color: #000;
  border-bottom-color: #000;
}

.mode-panel {
  background: var(--pix-paper);
  border: calc(var(--px) / 2) solid var(--pix-ink);
  box-shadow: var(--px) var(--px) 0 var(--pix-shadow);
  padding: 2rem;
  min-height: 400px;
}

.action-card {
  padding: 1.5rem;
  border: 2px dashed #cbd5e1;
  text-align: center;
}

.label {
  display: block;
  text-align: left;
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #cbd5e1;
  font-family: inherit;
  margin-bottom: 1rem;
}

.input:focus {
  outline: none;
  border-color: var(--pix-primary);
}

.player-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid #000;
}

.player-card.empty {
  border: 2px dashed #cbd5e1;
  background: transparent;
  box-shadow: none;
}

/* Spinner */
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Reuse existing button styles */
.cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 var(--px) 0 var(--pix-shadow);
  border: calc(var(--px) / 2) solid var(--pix-ink);
  padding: 0.75rem 1rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
}

.cta.primary {
  background: linear-gradient(180deg, #fca5a5, var(--pix-danger));
  color: #fff;
}

.cta.ghost {
  background: var(--pix-paper);
  color: var(--pix-ink);
}

.cta.auth.danger {
  background: linear-gradient(180deg, #fca5a5, var(--pix-danger));
  color: #450a0a;
}

.cta:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(1);
}

.glass {
  background: #fff;
}
</style>
