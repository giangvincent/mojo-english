<template>
  <div class="w-screen h-screen overflow-y-auto pixel-bg">
    <div class="flex items-center justify-center w-full game_screen">
      <router-view />
    </div>
    <Setting v-if="popupModal" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { defineAsyncComponent } from 'vue'

export default {
  name: 'main-app',
  components: {
    Setting: defineAsyncComponent(() => import('@/components/Setting.vue'))
  },
  created() {
     this.$store.dispatch('checkAuth');
     // T15: initialize daily/weekly missions (idempotent; restores existing progress).
     this.$store.dispatch('initializeMissions').catch((err) => console.error('Mission init failed:', err));
  },
  computed: {
    ...mapState({
      scr_width: state => state.scr_width,
      scr_height: state => state.scr_height,
      popupModal: state => state.popupModal
    })
  }
}
</script>
