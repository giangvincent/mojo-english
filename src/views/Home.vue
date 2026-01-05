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

          <!-- Market -->
          <article class="p-4 pixel-panel flex flex-col gap-2 transition-transform hover:-translate-y-1 bg-white">
            <h3 class="font-display text-xl">Market</h3>
            <p class="text-sm font-pixel text-slate-600 flex-1">Buy cards and items.</p>
            <button @click="$router.push('/market')" class="pixel-btn w-full text-center py-2 text-sm font-bold">OPEN
              MARKET</button>
          </article>

          <!-- Cosmetics -->
          <article class="p-4 pixel-panel flex flex-col gap-2 transition-transform hover:-translate-y-1 bg-white">
            <h3 class="font-display text-xl">Cosmetics</h3>
            <p class="text-sm font-pixel text-slate-600 flex-1">Customize your look.</p>
            <button @click="$router.push('/cosmetics')"
              class="pixel-btn w-full text-center py-2 text-sm font-bold">CUSTOMIZE</button>
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

        </div>
      </section>
    </main>

    <div class="auth-stack">
      <button v-if="!currentUser" @click="handleGoogleSignIn" class="cta auth">
        <svg class="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4" />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853" />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05" />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335" />
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
      showModeSelector: false
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
  },
  unmounted() {
    // No listener to unsubscribe
  },
  methods: {
    ...mapActions(['LoadCards', 'loginPlayer', 'logoutPlayer']),
    ...mapMutations(['TOGGLE_MODAL', 'SET_MODAL', 'setPlayerData', 'setPlayingStep']),
    async handleLogin() {
      // In a real app we'd open a modal for email/password or trigger OAuth flow
      // For now we can test with hardcoded or a prompt
      /*
      const email = prompt("Email:", "guest@verba.com")
      const password = prompt("Password:", "password")
      if (!email || !password) return
      */

      // Since the user asked to replace Google Sign In, we need a way to trigger Login.
      // Assuming a separate Login component is or will be used, or we temporarily prompt here.
      // But the requirement just said "Update Auth routes", usually implies we have a form.
      // For this step I will assume we might just trigger a login method or similar.
      // I'll leave a placeholder or basic prompt for dev testing as I don't have a Login Modal yet.
      // But since I'm modifying "handleGoogleSignIn" which was triggered by a button:

      try {
        // Temporarily calling login with hardcoded 'test' creds or similar to verify flow if no UI exists
        // Or better, redirect to a login page if one existed.
        // Let's just log a message that we need a UI for inputs, but for "Update Auth Routes" task
        // ensuring the underlying logic works is key.
        console.log("Login button clicked. UI for input needed.")

        // Example usage:
        // await this.loginPlayer({ email: '...', password: '...' })
      } catch (error) {
        console.error('Error signing in:', error)
      }
    },

    // Kept for backward compat if button calls this name, but better to rename in template too
    // checking template..
    async handleGoogleSignIn() {
      // Using a prompt for now to allow verifying the API call works
      const email = prompt("Email (dev):")
      const password = prompt("Password (dev):")
      if (email && password) {
        const success = await this.loginPlayer({ email, password })
        if (success) this.currentUser = getCurrentUser()
      }
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
