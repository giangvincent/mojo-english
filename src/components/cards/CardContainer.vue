<template>
  <div class="w-full h-full">
    <component v-bind:is="card"></component>
  </div>
</template>

<script>
export default {
  name: "card-container",
  props: {
    card: String,
  },
  components: {
    Noun: () => import("@/components/cards/Noun.vue"),
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>