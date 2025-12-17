<template>
  <div id="app" class="w-screen h-screen overflow-y-auto main-bg">
    <div
      class="flex items-center justify-center w-full game_screen"
    >
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
  created () {},
  computed: {
    ...mapState({
      scr_width: state => state.scr_width,
      scr_height: state => state.scr_height,
      popupModal: state => state.popupModal
    })
  }
}
</script>

<style lang="scss">
#app {
  color: #2c3e50;
  text-align: center;
}

.main-bg {
  background:
    repeating-linear-gradient(
      90deg,
      #7dd3fc 0,
      #7dd3fc 8px,
      #38bdf8 8px,
      #38bdf8 16px
    ),
    repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.2) 0,
      rgba(255, 255, 255, 0.2) 8px,
      rgba(0, 0, 0, 0.05) 8px,
      rgba(0, 0, 0, 0.05) 16px
    );
}
</style>
