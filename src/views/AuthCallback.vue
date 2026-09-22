<template>
  <div class="flex items-center justify-center min-h-screen bg-pix-paper pixel-bg">
    <div class="text-center pixel-panel p-8">
      <h2 class="text-2xl font-display mb-4">{{ statusMessage }}</h2>
      <div v-if="loading" class="animate-spin h-8 w-8 border-4 border-pix-primary border-t-transparent rounded-full mx-auto"></div>
      <div v-if="error" class="mt-4 text-red-500 font-pixel">
        {{ errorMessage }}
        <div class="mt-4">
          <button @click="$router.push('/')" class="pixel-btn danger">Return Home</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { consumeAuthReturnPath, handleAuthCallback } from '@/services/auth';

export default {
  name: 'AuthCallback',
  data() {
    return {
      statusMessage: 'Authenticating...',
      loading: true,
      error: false,
      errorMessage: ''
    };
  },
  async mounted() {
    const searchParams = new URLSearchParams(window.location.search);
    const code = this.$route.query.code || searchParams.get('code');
    const state = this.$route.query.state;

    if (!code) {
      this.error = true;
      this.loading = false;
      this.statusMessage = 'Authentication Failed';
      this.errorMessage = 'No authorization code found in URL.';
      return;
    }

    try {
      const userData = await handleAuthCallback(code, state);
      this.setPlayerData(userData);
      this.statusMessage = 'Authenticated';
      this.loading = false;
      
      this.$router.push(consumeAuthReturnPath());
    } catch (err) {
      console.error('SSO Exchange Error:', err);
      this.error = true;
      this.loading = false;
      this.statusMessage = 'Authentication Error';
      this.errorMessage = err.message || 'Failed to exchange authorization code.';
    }
  },
  methods: {
    ...mapMutations(['setPlayerData'])
  }
}
</script>
