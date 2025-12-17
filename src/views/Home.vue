<template>
  <div class="relative min-h-screen overflow-hidden home-shell pixel-bg text-slate-900">
    <div class="bg-grid"></div>
    <div class="bg-glow bg-glow-1"></div>
    <div class="bg-glow bg-glow-2"></div>

    <header class="relative sticky top-0 z-10 flex items-center justify-between px-4 py-4 md:px-12 md:py-6">
      <div class="flex items-center gap-4">
        <img class="w-auto h-10 md:h-12 pixelated" src="@/assets/images/logo.png" alt="VerbaPix logo" />
        <div>
          <h1 class="inline-flex text-2xl font-bold leading-tight md:text-3xl card-font">VerbaPix</h1>
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
        <button class="icon-btn" @click="openSettings">
          <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clip-rule="evenodd" />
          </svg>
        </button>
        <button class="icon-btn" @click="showTutorial = true">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-4a3 3 0 00-2.824 1.995.75.75 0 11-1.408-.51A4.5 4.5 0 1110 14.5a.75.75 0 010-1.5 3 3 0 100-6zM9.25 15.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </header>

    <main class="relative z-10 w-full max-w-6xl px-4 pb-20 mx-auto overflow-y-auto md:px-12">
      <section class="grid items-center gap-10 lg:grid-cols-2">
        <div class="space-y-6">
          <div
            class="inline-flex items-center gap-2 pixel-chip">
            {{ $t('home.badge_updated') }}
          </div>
          <h2 class="text-4xl leading-tight md:text-5xl font-display">
            {{ $t('home.hero_title') }}
          </h2>
          <p class="max-w-xl text-base text-slate-700">
            {{ $t('home.hero_desc') }}
          </p>
          <div class="flex flex-wrap gap-3">
            <router-link to="play" class="cta primary">
              <img class="h-6" src="@/assets/images/card-games.svg" alt="play now" />
              <span>{{ $t('home.play_now') }}</span>
            </router-link>
            <router-link to="tutorial" class="cta ghost">
              {{ $t('home.guides') }}
            </router-link>
            <router-link to="cosmetics" class="cta ghost alt">
              {{ $t('home.shop') }}
            </router-link>
            <router-link to="progress" class="cta ghost">
              {{ $t('nav.progress') }}
            </router-link>
            <router-link to="dashboard" class="cta ghost">
              {{ $t('nav.dashboard') }}
            </router-link>
          </div>
          <div class="flex flex-wrap gap-2 text-[11px] uppercase tracking-wide">
            <span class="pill">{{ $t('home.pill_hand') }}</span>
            <span class="pill">{{ $t('home.pill_shared') }}</span>
            <span class="pill">{{ $t('home.pill_coop') }}</span>
            <span class="pill">{{ $t('home.pill_pvp') }}</span>
          </div>
        </div>

        <div class="glass hero-panel card-preview">
          <div class="grid h-full grid-cols-2 gap-4">
            <div class="stat-tile">
              <p class="text-xs tracking-wide uppercase text-slate-700">{{ $t('modes.standard') }}</p>
              <div class="text-5xl leading-none font-display">7</div>
              <p class="text-sm text-slate-700">{{ $t('home.cards_ready') }}</p>
            </div>
            <div class="stat-tile">
              <p class="text-xs tracking-wide uppercase text-slate-700">{{ $t('home.rounds') }}</p>
              <div class="flex items-center gap-2">
                <span class="progress-dot active"></span>
                <span class="progress-dot active"></span>
                <span class="progress-dot"></span>
              </div>
              <p class="text-xs text-slate-700">{{ $t('home.rounds_sprint') }}</p>
            </div>
            <div class="col-span-2 stat-tile">
              <XpBar :currentXp="progressionXp" :xpToNext="progressionXpToNext"
                :level="progressionLevel || playerData.level" />
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs uppercase text-slate-700">5/4 Split</p>
                  <p class="text-lg font-semibold">{{ $t('home.shared_center') }}</p>
                </div>
                <div class="badge badge-green">{{ $t('home.badge_immutable') }}</div>
              </div>
              <div class="divider"></div>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs uppercase text-slate-700">Co-op</p>
                  <p class="text-lg font-semibold">{{ $t('home.coop_last_card') }}</p>
                </div>
                <div class="badge badge-purple">{{ $t('home.badge_turn_track') }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-6 mt-12 md:grid-cols-3">
        <article class="mode-card">
          <div class="mode-badge">{{ $t('modes.standard') }}</div>
          <p class="mode-title">{{ $t('home.mode_standard_title') }}</p>
          <p class="mode-body">{{ $t('home.mode_standard_body') }}</p>
          <router-link to="play" class="mode-cta">{{ $t('home.start_standard') }}</router-link>
        </article>

        <article class="mode-card">
          <div class="mode-badge green">{{ $t('modes.5-4-split') }}</div>
          <p class="mode-title">{{ $t('home.mode_split_title') }}</p>
          <p class="mode-body">{{ $t('home.mode_split_body') }}</p>
          <router-link to="play" class="mode-cta">{{ $t('home.start_split') }}</router-link>
        </article>

        <article class="mode-card">
          <div class="mode-badge purple">{{ $t('modes.coop') }}</div>
          <p class="mode-title">{{ $t('home.mode_coop_title') }}</p>
          <p class="mode-body">{{ $t('home.mode_coop_body') }}</p>
          <router-link to="play" class="mode-cta">{{ $t('home.start_coop') }}</router-link>
        </article>
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
import { auth, signInWithGoogle, signOutUser, onAuthStateChanged } from '@/services/firebase'
import XpBar from '@/components/ui/XpBar.vue'
import TutorialOverlay from '@/components/TutorialOverlay.vue'

export default {
  name: 'Home',
  components: {
    XpBar,
    TutorialOverlay
  },
  data() {
    return {
      currentUser: null,
      defaultAvatar: 'https://placehold.co/96x96?text=User',
      showTutorial: false,
      unsubscribeAuth: null
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
    // Listen for auth state changes
    this.unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      this.currentUser = user
      if (user) {
        // Update player data when user logs in
        const userData = {
          id: user.uid,
          name: user.displayName || 'Player',
          photo: {
            src: user.photoURL || ''
          },
          level: this.playerData.level || 0
        }
        this.setPlayerData(userData)
      }
    })
  },
  unmounted() {
    if (typeof this.unsubscribeAuth === 'function') {
      this.unsubscribeAuth()
    }
  },
  methods: {
    ...mapActions(['LoadCards']),
    ...mapMutations(['TOGGLE_MODAL', 'SET_MODAL', 'setPlayerData', 'setPlayingStep']),
    async handleGoogleSignIn() {
      try {
        if (!auth) {
          alert('Firebase is not configured. Please set the environment variables.')
          return
        }
        const result = await signInWithGoogle()
        if (result?.user) {
          this.currentUser = result.user
          this.setPlayerData({
            id: result.user.uid,
            name: result.user.displayName || 'Player',
            photo: { src: result.user.photoURL || '' },
            level: this.playerData.level || 0
          })
        }
      } catch (error) {
        console.error('Error signing in with Google:', error)
        alert('Failed to sign in with Google. Please try again.')
      }
    },
    async handleSignOut() {
      try {
        await signOutUser()
        console.log('User signed out')
        // Reset to default player data
        const defaultData = {
          id: 'guest',
          name: 'Guest Player',
          photo: { src: '' },
          level: 0
        }
        this.setPlayerData(defaultData)
      } catch (error) {
        console.error('Error signing out:', error)
      }
    },
    openSettings() {
      this.SET_MODAL(true)
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

.bg-grid {
  display: none;
}

.bg-glow {
  display: none;
}

.bg-glow-1 {
  top: 10%;
  right: 5%;
  background: rgba(59, 130, 246, 0.6);
}

.bg-glow-2 {
  bottom: 8%;
  left: 5%;
  background: rgba(16, 185, 129, 0.6);
}

.font-display {
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.glass {
  backdrop-filter: none;
  box-shadow: var(--px) var(--px) 0 var(--pix-shadow);
  border: calc(var(--px) / 2) solid var(--pix-ink);
  border-radius: 0;
  background: var(--pix-paper);
  color: var(--pix-ink);
}

.chip {
  border-radius: 0;
  padding: 0.65rem 0.9rem;
}

.level-pill {
  margin-left: auto;
  box-shadow: calc(var(--px) / 2) calc(var(--px) / 2) 0 rgba(0, 0, 0, 0.35);
  border: calc(var(--px) / 2) solid var(--pix-ink);
  border-radius: 0;
  background: linear-gradient(180deg, #86efac, var(--pix-success));
  padding: 0.25rem 0.55rem;
  color: #052e16;
  font-weight: 900;
  font-size: 12px;
}

.icon-btn {
  display: grid;
  place-items: center;
  transition: transform 80ms steps(2, end), box-shadow 80ms steps(2, end), filter 80ms steps(2, end);
  box-shadow: 0 var(--px) 0 var(--pix-shadow);
  border: calc(var(--px) / 2) solid var(--pix-ink);
  border-radius: 0;
  background: var(--pix-paper);
  width: 44px;
  height: 44px;
}

.icon-btn:hover {
  filter: brightness(1.05);
}

.cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 80ms steps(2, end), box-shadow 80ms steps(2, end), filter 80ms steps(2, end);
  box-shadow: 0 var(--px) 0 var(--pix-shadow);
  border: calc(var(--px) / 2) solid var(--pix-ink);
  border-radius: 0;
  padding: 0.75rem 1rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;
}

.cta.primary {
  background: linear-gradient(180deg, #fca5a5, var(--pix-danger));
  color: #fff;
}

.cta.ghost {
  background: var(--pix-paper);
  color: var(--pix-ink);
}

.cta.ghost.alt {
  background: linear-gradient(180deg, #86efac, var(--pix-success));
  color: #052e16;
}

.cta.auth {
  border: calc(var(--px) / 2) solid var(--pix-ink);
  background: var(--pix-paper);
  padding: 0.75rem 1rem;
  color: var(--pix-ink);
}

.cta.auth.danger {
  background: linear-gradient(180deg, #fca5a5, var(--pix-danger));
  color: #450a0a;
}

.cta:hover {
  filter: brightness(1.05);
}

.cta:active,
.icon-btn:active {
  transform: translate3d(0, var(--px), 0);
  box-shadow: 0 0 0 var(--pix-shadow);
}

.pill {
  box-shadow: calc(var(--px) / 2) calc(var(--px) / 2) 0 rgba(0, 0, 0, 0.3);
  border: calc(var(--px) / 2) solid var(--pix-ink);
  border-radius: 0;
  background: var(--pix-paper);
  padding: 0.4rem 0.6rem;
  color: var(--pix-ink);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-panel {
  border-radius: 0;
  padding: 1.25rem;
  min-height: 320px;
}

.card-preview {
  aspect-ratio: 4 / 3;
}

.stat-tile {
  box-shadow:
    inset calc(var(--px) / 2) calc(var(--px) / 2) 0 rgba(0, 0, 0, 0.28),
    inset calc(var(--px) / -2) calc(var(--px) / -2) 0 rgba(255, 255, 255, 0.7);
  border: calc(var(--px) / 2) solid var(--pix-ink);
  border-radius: 0;
  background: var(--pix-paper-2);
  padding: 1rem;
}

.progress-dot {
  border-radius: 0;
  background: rgba(0, 0, 0, 0.18);
  width: 10px;
  height: 10px;
}

.progress-dot.active {
  background: linear-gradient(180deg, #86efac, var(--pix-success));
}

.badge {
  box-shadow: calc(var(--px) / 2) calc(var(--px) / 2) 0 rgba(0, 0, 0, 0.25);
  border: calc(var(--px) / 2) solid var(--pix-ink);
  border-radius: 0;
  padding: 0.4rem 0.75rem;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.badge-green {
  background: linear-gradient(180deg, #86efac, var(--pix-success));
  color: #052e16;
}

.badge-purple {
  background: linear-gradient(180deg, #c4b5fd, #8b5cf6);
  color: #1f1147;
}

.divider {
  margin: 0.75rem 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.18), transparent);
  width: 100%;
  height: 1px;
}

.mode-card {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  box-shadow: var(--px) var(--px) 0 var(--pix-shadow);
  border: calc(var(--px) / 2) solid var(--pix-ink);
  border-radius: 0;
  background: var(--pix-paper);
  padding: 1.25rem;
}

.mode-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  box-shadow: calc(var(--px) / 2) calc(var(--px) / 2) 0 rgba(0, 0, 0, 0.25);
  border: calc(var(--px) / 2) solid var(--pix-ink);
  border-radius: 0;
  background: linear-gradient(180deg, var(--pix-primary-2), var(--pix-primary));
  padding: 0.35rem 0.6rem;
  color: #fff;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.mode-badge.green {
  background: linear-gradient(180deg, #86efac, var(--pix-success));
  color: #052e16;
}

.mode-badge.purple {
  background: linear-gradient(180deg, #c4b5fd, #8b5cf6);
  color: #1f1147;
}

.mode-title {
  font-weight: 700;
  font-size: 1.1rem;
}

.mode-body {
  color: #334155;
  font-size: 0.95rem;
}

.mode-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: auto;
  box-shadow: 0 var(--px) 0 var(--pix-shadow);
  border: calc(var(--px) / 2) solid var(--pix-ink);
  border-radius: 0;
  background: linear-gradient(180deg, var(--pix-primary-2), var(--pix-primary));
  padding: 0.65rem 0.9rem;
  color: #fff;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;
}

.mode-cta:active {
  transform: translate3d(0, var(--px), 0);
  box-shadow: 0 0 0 var(--pix-shadow);
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
