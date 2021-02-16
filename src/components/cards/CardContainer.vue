<template>
  <div class="m-1 bg-gray-300 rounded-md border-2 border-white overflow-hidden">
    <div :style="{ width: cardWidth }">
      <component v-bind:is="card"></component>
    </div>
  </div>
</template>

<script>
export default {
  name: "card-container",
  props: {
    card: String,
    cardHeight: Number,
  },
  components: {
    Noun: () => import("@/components/cards/Noun.vue"),
  },
  data() {
    return {
      cardWidth: 0,
    };
  },
  created() {
    this.cardWidth = (this.cardHeight - 32) / 1.612;
  },
  mounted() {},
  methods: {},
};
</script>