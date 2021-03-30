<template>
  <div class="w-full h-full bg-green-700 flex flex-col text-white relative">
    <div
      class="h-1/3 flex flex-col items-center"
      v-for="(cardContent, index) in card.content"
      :key="'content-' + index"
      @click="chooseVerb(cardContent.tense)"
    >
      <div class="w-full h-full flex justify-between items-center">
        <div class="px-1 w-full" v-html="cardContent.text"></div>
        <div class="px-1 flex flex-col items-center">
          <span>{{ cardContent.point }}</span>
          <span
            v-if="cardContent.tense == 'present simple'"
            class="w-3 h-3 border-1 border-black bg-white"
          ></span>
          <span
            v-if="cardContent.tense == 'past simple'"
            class="w-3 h-3 border-1 border-black bg-black"
          ></span>
        </div>
      </div>

      <hr v-if="index == 0" class="w-3/5 border-black" />
      <hr v-if="index == 1" class="w-2/3 border-black" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "verb-card",
  props: {
    card: Object
  },
  computed: {
    ...mapState({
      cardColors: state => state.playing.cardColors
    })
  }
};
</script>
