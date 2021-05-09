<template>
  <div
    class="absolute bottom-0 -mb-6 mx-auto w-full flex items-center rounded-md"
  >
    <span
      @click="changeCard('Noun')"
      class="bg-white p-1 flex rounded-md"
      v-if="cardIndex == 0 && cardOb.type !== 'Noun'"
      ><svg
        class="w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        /></svg
      >Noun</span
    >
    <span
      @click="changeCard('Verb')"
      class="bg-green-700 p-1 flex rounded-md"
      v-if="cardIndex == 1 && cardOb.type !== 'Verb'"
      ><svg
        class="w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        /></svg
      >Verb</span
    >
    <span
      @click="changeCard('TimeCard')"
      class="bg-orange-700 p-1 flex rounded-l-md"
      v-if="cardIndex == 2 && cardOb.type !== 'TimeCard' && cardOb.type !== 'Location'"
      ><svg
        class="w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        /></svg
      >Time</span
    >
    <span
      @click="changeCard('Location')"
      class="bg-white p-1 flex rounded-r-md"
      v-if="cardIndex == 2 && cardOb.type !== 'TimeCard' && cardOb.type !== 'Location'"
      ><svg
        class="w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        /></svg
      >Location</span
    >
  </div>
</template>

<script>
export default {
  name: "replace-btn",
  props: {
    cardIndex: Number,
    cardOb: Object
  },
  methods: {
    changeCard(card) {
      this.$emit("changeCard", { card: card, index: this.cardIndex });
    }
  }
};
</script>
