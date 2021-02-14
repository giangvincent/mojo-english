<template>
  <div>
    <back-btn></back-btn>
    <card-container card="Noun"></card-container>
  </div>
</template>

<script>
import CardContainer from "@/components/cards/CardContainer";
import BackBtn from "@/components/navigation/BackButton";

export default {
  name: "test-view-cards",
  components: {
    CardContainer,
    BackBtn,
  },
};
</script>