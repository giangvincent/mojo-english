<template>
  <div class="mx-auto relative h-full">
    <div class="flex flex-col flex-wrap py-4" :class="{ 'bg-filter-8': popupModal }">
      <img class="w-2/5 mx-auto" src="@/assets/images/logo.png" alt="logo" />

      <section class="w-full flex">
        <div class="w-1/3 -mt-10">
          <button class="" @click="
            TOGGLE_MODAL();
          modalComponent = 'Setting';
          ">
            <svg class="h-20 xs:h-24 sm:h-32 md:h-40 text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
              fill="currentColor">
              <path fill-rule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clip-rule="evenodd" />
            </svg>{{ $t('home.settings') }}
          </button>
        </div>

        <div class="w-1/3 flex items-center justify-center">
          <button class="touch-3d text-white flex items-center">
            <router-link to="play" class="text-2xl bg-red-600 flex items-center text-white p-4 rounded-lg">
              <img class="h-16" src="@/assets/images/card-games.svg" alt="play-svg" />
              <span class="ml-4">{{ $t('home.play_now') }}</span>
            </router-link>
          </button>
        </div>
        <div class="w-1/3 -mt-16 flex flex-col">
          <router-link to="market">
            <button class="">
              <svg class="h-12 xs:h-16 sm:h-20 md:h-32 mx-auto text-orange-700" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                  clip-rule="evenodd" />
              </svg>{{ $t('home.shop') }}
            </button>
          </router-link>
          <router-link to="tutorial">
            <button class="">
              <svg class="h-12 xs:h-16 sm:h-20 md:h-32 mx-auto text-blue-700" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M10.496 2.132a1 1 0 00-.992 0l-7 4A1 1 0 003 8v7a1 1 0 100 2h14a1 1 0 100-2V8a1 1 0 00.496-1.868l-7-4zM6 9a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1zm3 1a1 1 0 012 0v3a1 1 0 11-2 0v-3zm5-1a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z"
                  clip-rule="evenodd" />
              </svg>{{ $t('home.guides') }}
            </button>
          </router-link>
        </div>
      </section>
      <!-- Action buttons -->
      <div class="fixed top-0 left-0">
        <div class="relative flex flex-col m-2">
          <img class="w-20 h-20 rounded-full border-2" :src="currentUser?.photoURL || playerData.photo.src"
            :alt="currentUser?.displayName || 'avatar'" />
          <div class="w-20 rounded-lg border-2 p-1 -mt-3 bg-white">
            {{ $t('home.level') + " " + playerData.level }}
          </div>
          <!-- Google Sign In Button -->
          <button v-if="!currentUser" @click="handleGoogleSignIn"
            class="mt-2 bg-white border-2 border-gray-300 rounded-lg px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50">
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
            <span>Sign in</span>
          </button>
          <button v-else @click="handleSignOut"
            class="mt-2 bg-red-500 text-white rounded-lg px-3 py-2 text-sm hover:bg-red-600">
            Sign out
          </button>
        </div>
      </div>
    </div>

    <component v-if="popupModal" v-bind:is="modalComponent"></component>
  </div>
</template>

<script>
/* eslint-disable no-undef */
import { mapActions, mapMutations, mapState } from 'vuex'
import { auth, signInWithGoogle, signOutUser, onAuthStateChanged } from '@/services/firebase'

export default {
  name: 'Home',
  components: {
    Setting: () => import('@/components/Setting.vue')
  },
  data() {
    return {
      modalComponent: 'Setting',
      currentUser: null
    }
  },
  computed: {
    ...mapState({
      playerData: state => state.player.playerData,
      popupModal: state => state.popupModal
    })
  },
  created() {
    this.setPlayingStep('arrange-card')
    this.LoadCards(this.playerData.level)
  },
  mounted() {
    // Listen for auth state changes
    onAuthStateChanged(auth, (user) => {
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
  methods: {
    ...mapActions(['LoadCards']),
    ...mapMutations(['TOGGLE_MODAL', 'setPlayerData', 'setPlayingStep']),
    async handleGoogleSignIn() {
      try {
        const result = await signInWithGoogle()
        console.log('User signed in:', result.user)
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
    }
  }
}
</script>
