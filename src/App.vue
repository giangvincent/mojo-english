<template>
  <div id="app" class="w-full h-full main-bg flex content-center items-center">
    <div class="game_screen" :style="{ width: scr_width, height: scr_height }">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "main-app",
  created() {},
  computed: {
    ...mapState({
      scr_width: (state) => state.scr_width,
      scr_height: (state) => state.scr_height,
    }),
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.main-bg {
  background: #dbf9ff;
}
</style>
