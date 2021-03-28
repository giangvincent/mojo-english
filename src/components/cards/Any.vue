<template>
  <div></div>
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