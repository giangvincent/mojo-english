<template>
  <div
    class="relative w-full h-full py-2 flex flex-col content-between items-center justify-center"
  ></div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "any-card",
  props: {
    card: Object,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      cardColors: (state) => state.playing.cardColors,
    }),
  },
};
</script>