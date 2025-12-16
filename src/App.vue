<template>
  <div id="app" class="w-screen h-screen main-bg  overflow-y-auto">
    <div
      class="game_screen w-full flex content-center items-center"
      v-bind:style="{ height: scr_height + 'px' }"
    >
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'main-app',
  created () {},
  computed: {
    ...mapState({
      scr_width: state => state.scr_width,
      scr_height: state => state.scr_height
    })
  }
}
</script>

<style lang="scss">
#app {
  text-align: center;
  color: #2c3e50;
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
