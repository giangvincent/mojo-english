<template>
  <div>
    <back-btn></back-btn>
    <card-container card="Location"></card-container>
  </div>
</template>

<script>
import CardContainer from '@/components/cards/CardContainer.vue'
import BackBtn from '@/components/navigation/BackButton.vue'

export default {
  name: 'test-view-cards',
  components: {
    CardContainer,
    BackBtn
  }
}
</script>
