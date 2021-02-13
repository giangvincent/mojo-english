<template>
  <div></div>
</template>

<script>
export default {
  name: "noun",
  data() {
    return {
      id: "",
      image: "",
      singular: {
        text: "",
        point: 0,
      },
      plural: {
        text: "",
        point: 0,
      },
      finalPoint: 0,
      type: "",
      previousCards: [],
      nextCards: [],
      bonusPoint: [],
    };
  },
};
</script>