<template>
  <div class="relative min-h-screen overflow-hidden home-shell pixel-bg text-slate-900">
    <div class="bg-grid"></div>
    <div class="bg-glow bg-glow-1"></div>
    <div class="bg-glow bg-glow-2"></div>

    <game-mode-selector v-if="showModeSelector" @select-mode="onModeSelected" />

    <header class="relative sticky top-0 z-10 flex items-center justify-between px-4 py-4 md:px-12 md:py-6 text-white">
      <div class="flex items-center gap-4">
        <img class="w-auto h-10 md:h-12 pixelated" src="@/assets/images/logo.png" alt="VerbaPix logo" />
        <div>
          <h1 class="flex text-2xl font-bold leading-tight md:text-3xl card-font text-white">VerbaPix</h1>
          <sup class="leading-tight font-display card-font">Cards, Grammar, Fun</sup>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="flex flex-col items-center gap-1">
          <div class="flex items-center gap-3 glass chip">
            <img class="object-cover w-12 h-12 border border-black rounded-xl"
              :src="currentUser?.photoURL || playerData?.photo?.src || defaultAvatar"
              :alt="currentUser?.displayName || 'avatar'" />
            <div>
              <p class="text-sm font-semibold">{{ currentUser?.displayName || playerData.name || 'Guest' }}</p>
              <p class="text-xs text-slate-700">{{ $t('home.level') }} {{ progressionLevel || playerData.level }}</p>
            </div>
            <div class="level-pill">{{ progressionLevel || playerData.level }}</div>
          </div>
          <button v-if="pendingSync > 0" @click="handleSync"
            class="text-[10px] uppercase font-bold text-white bg-pix-primary px-2 py-0.5 rounded shadow-sm hover:scale-105 active:scale-95 transition-transform flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clip-rule="evenodd" />
            </svg>
            Sync ({{ pendingSync }})
          </button>
        </div>
        <button class="pixel-icon-btn" @click="openSettings">
          <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clip-rule="evenodd" />
          </svg>
        </button>
        <button class="pixel-icon-btn" @click="showTutorial = true">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-4a3 3 0 00-2.824 1.995.75.75 0 11-1.408-.51A4.5 4.5 0 1110 14.5a.75.75 0 010-1.5 3 3 0 100-6zM9.25 15.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5z"
              clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </header>

    <main class="relative z-10 w-full max-w-6xl px-4 pb-20 mx-auto overflow-y-auto md:px-12 pt-8">

      <!-- Hero Section -->
      <section class="pixel-panel p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center bg-pix-paper mb-12">
        <div class="flex-1 space-y-4">
          <div class="pixel-chip bg-pix-primary text-white w-max font-bold">NEW UPDATE</div>
          <h2 class="text-4xl md:text-6xl font-display text-pix-ink mb-2">VerbaPix</h2>
          <p class="text-lg md:text-xl text-pix-ink leading-relaxed">
            {{ $t('home.hero_desc') }}
          </p>
        </div>

        <!-- Decorative / Stats Block -->
        <div class="w-full md:w-1/3 flex flex-col gap-4">
          <div class="pixel-inset p-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs font-bold uppercase text-pix-ink">Level</span>
              <span class="text-xl font-bold text-pix-primary">{{ progressionLevel || playerData.level }}</span>
            </div>
            <XpBar :currentXp="progressionXp" :xpToNext="progressionXpToNext"
              :level="progressionLevel || playerData.level" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="pixel-panel p-2 flex flex-col items-center justify-center bg-pix-paper-2">
              <span class="text-3xl font-display text-pix-ink">7</span>
              <span class="text-[10px] uppercase font-bold text-pix-ink-light">Hand Size</span>
            </div>
            <div class="pixel-panel p-2 flex flex-col items-center justify-center bg-pix-paper-2">
              <span class="text-xl font-display text-pix-warning">5/4</span>
              <span class="text-[10px] uppercase font-bold text-pix-ink-light">Split Mode</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Multiplayer Game Modes -->
      <section class="grid gap-8 md:grid-cols-2">

        <!-- Standard Match -->
        <article class="p-6 pixel-panel flex flex-col gap-3 transition-transform hover:-translate-y-1 bg-white">
          <h3 class="font-display text-2xl mt-2">Standard Match</h3>
          <p class="text-base font-pixel leading-tight">Create your own room, set the rules, and invite friends to play.
            You are the host!</p>
          <button @click="$router.push('/create-room')"
            class="pixel-btn primary mt-auto text-center w-full block text-lg py-3">PLAY (CREATE ROOM)</button>
        </article>

        <!-- Quick Match -->
        <article class="p-6 pixel-panel flex flex-col gap-3 transition-transform hover:-translate-y-1 bg-white">
          <h3 class="font-display text-2xl mt-2">Quick Match</h3>
          <p class="text-base font-pixel leading-tight">Jump into a game instantly! Choose a mode and wait for
            opponents.</p>
          <button @click="$router.push('/quick-match')"
            class="pixel-btn warning mt-auto text-center w-full block text-lg py-3">QUICK MATCH</button>
        </article>

      </section>

      <!-- Explore & Personal -->
      <section class="mt-8">
        <h2 class="text-2xl font-display text-pix-dark mb-4 pl-1">Explore & Personal</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

          <!-- Shop -->
          <article class="p-4 pixel-panel flex flex-col gap-2 transition-transform hover:-translate-y-1 bg-white">
            <h3 class="font-display text-xl">Shop</h3>
            <p class="text-sm font-pixel text-slate-600 flex-1">Buy cards, items, and cosmetics.</p>
            <button @click="$router.push('/shopping')" class="pixel-btn w-full text-center py-2 text-sm font-bold">
              OPEN SHOP
            </button>
          </article>

          <!-- Dashboard -->
          <article class="p-4 pixel-panel flex flex-col gap-2 transition-transform hover:-translate-y-1 bg-white">
            <h3 class="font-display text-xl">Dashboard</h3>
            <p class="text-sm font-pixel text-slate-600 flex-1">View stats and more.</p>
            <button @click="$router.push('/dashboard')" class="pixel-btn w-full text-center py-2 text-sm font-bold">VIEW
              DASHBOARD</button>
          </article>

          <!-- Progress -->
          <article class="p-4 pixel-panel flex flex-col gap-2 transition-transform hover:-translate-y-1 bg-white">
            <h3 class="font-display text-xl">Progress</h3>
            <p class="text-sm font-pixel text-slate-600 flex-1">Track your journey.</p>
            <button @click="$router.push('/progress')" class="pixel-btn w-full text-center py-2 text-sm font-bold">CHECK
              PROGRESS</button>
          </article>

          <!-- Tutorial -->
          <article class="p-4 pixel-panel flex flex-col gap-2 transition-transform hover:-translate-y-1 bg-white">
            <h3 class="font-display text-xl">Tutorial</h3>
            <p class="text-sm font-pixel text-slate-600 flex-1">Learn how to play.</p>
            <button @click="$router.push('/tutorial')"
              class="pixel-btn w-full text-center py-2 text-sm font-bold">LEARN</button>
          </article>

          <!-- Vault -->
          <article class="p-4 pixel-panel flex flex-col gap-2 transition-transform hover:-translate-y-1 bg-white">
            <h3 class="font-display text-xl">Vault</h3>
            <p class="text-sm font-pixel text-slate-600 flex-1">View your saved sentences.</p>
            <button @click="$router.push('/vault')" class="pixel-btn w-full text-center py-2 text-sm font-bold">OPEN
              VAULT</button>
          </article>

        </div>
      </section>
    </main>

    <div class="auth-stack">
      <button v-if="!currentUser" @click="handleLogin" class="cta auth">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
            clip-rule="evenodd" />
        </svg>
        <span>{{ $t('home.sign_in') }}</span>
      </button>
      <button v-else @click="handleSignOut" class="cta auth danger">{{ $t('home.sign_out') }}</button>
    </div>
    <tutorial-overlay v-if="showTutorial" @close="showTutorial = false" class="z-50" />
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { getCurrentUser } from '@/services/auth'
import gvPixelService from '@/services/gvPixel'
import XpBar from '@/components/ui/XpBar.vue'
import TutorialOverlay from '@/components/TutorialOverlay.vue'
import { defineAsyncComponent } from 'vue'

export default {
  name: 'HomeView',
  components: {
    XpBar,
    TutorialOverlay,
    GameModeSelector: defineAsyncComponent(() => import('@/components/GameModeSelector.vue'))
  },
  data() {
    return {
      currentUser: null,
      defaultAvatar: 'https://placehold.co/96x96?text=User',
      showTutorial: false,
      showModeSelector: false,
      pendingSync: 0
    }
  },
  computed: {
    ...mapState({
      playerData: state => state.player.playerData,
      progressionLevel: state => state.progression.level,
      progressionXp: state => state.progression.xp,
      progressionXpToNext: state => state.progression.xpToNext
    })
  },
  created() {
    this.setPlayingStep('arrange-card')
    this.LoadCards(this.playerData.level)
  },
  mounted() {
    const user = getCurrentUser()
    this.currentUser = user
    if (user) {
      // Hydrate store if needed, though often store persistence handles this
      // or we dispatch an action to 'checkAuth' which validates token
      const userData = {
        id: user.id || user.uid,
        name: user.name || user.displayName || 'Player',
        photo: {
          src: user.photoKey ? user.photoKey : (user.photoURL || '')
        },
        level: this.playerData.level || 0
      }
      this.setPlayerData(userData)
    }

    // Check pending sync periodically
    this.updatePendingSync()
    this.syncInterval = setInterval(() => {
      this.updatePendingSync()
    }, 5000)
  },
  unmounted() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
    }
  },
  methods: {
    ...mapActions(['LoadCards', 'loginPlayer', 'logoutPlayer']),
    ...mapMutations(['TOGGLE_MODAL', 'SET_MODAL', 'setPlayerData', 'setPlayingStep']),
    async handleLogin() {
      // User request: redirect to base_url + /login?app=verbapix
      // We use VITE_BASE_URL which is exposed in .env
      const baseUrl = import.meta.env.VITE_BASE_URL;

      window.location.href = `${baseUrl}/login?app=verbapix`;
    },

    async handleSignOut() {
      try {
        await this.logoutPlayer()
        console.log('User signed out')
        this.currentUser = null
      } catch (error) {
        console.error('Error signing out:', error)
      }
    },
    openSettings() {
      this.SET_MODAL(true)
    },
    onModeSelected(mode) {
      this.showModeSelector = false
      this.$router.push({ name: 'play', query: { mode: mode } })
    },
    startGame(mode) {
      this.$router.push({ name: 'play', query: { mode: mode } })
    },
    updatePendingSync() {
      this.pendingSync = gvPixelService.getPendingSyncCount()
    },
    async handleSync() {
      try {
        const success = await gvPixelService.syncVaultQueue()
        if (success) {
          console.log('Successfully synced all items to vault')
        } else {
          console.warn('Some items failed to sync to vault')
        }
      } catch (e) {
        console.error('Sync failed', e)
      } finally {
        this.updatePendingSync()
      }
    }
  }
}
</script>

<style scoped>
.home-shell {
  background: transparent;
  font-family: var(--ui-font);
  letter-spacing: 0.02em;
}

.font-display {
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.auth-stack {
  display: flex;
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 20;
}
</style>
