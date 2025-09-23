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
  background: #dbf9ff;
}
</style>
