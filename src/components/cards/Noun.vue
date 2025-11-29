<template>
  <div class="w-full h-full flex flex-wrap content-between relative">
    <div class="w-full m-2 p-1 rounded-lg border-1 border-gray-700 relative bg-opacity-80 transition-colors"
      :class="{ 'bg-white': nounType == null || nounType === 'plural', 'bg-gray-500': nounType && nounType === 'singular' }"
      @click="chooseNoun('singular')">
      {{ card.singular.text }}
      <span
        class="absolute right-0 top-0 bg-white w-5 h-5 border-1 border-black rounded-full flex items-center justify-center -m-2 text-sm">+{{
          card.singular.point }}</span>
    </div>
    <div class="flex w-full m-2">
      <div class="w-full bg-white bg-opacity-80 rounded-lg border-1 border-gray-700 relative">
        <div class="relative p-1 rounded-t-md transition-colors"
          :class="{ 'bg-gray-500': nounType && nounType === 'plural' }" @click="chooseNoun('plural')">
          {{ card.plural.text }}
          <span
            class="absolute right-0 top-0 bg-white w-5 h-5 border-1 border-black rounded-full flex items-center justify-center -m-2 text-sm">+{{
              card.plural.point }}</span>
        </div>
        <!-- plural -->

        <div class="border-t-1 border-gray-700 flex items-center justify-center rounded-b-md"
          :class="'bg-' + cardColors[card.bonusPoint.type]">
          {{ card.bonusPoint.word.join("/ ") }}
          <span
            class="absolute right-0 bottom-0 bg-white w-5 h-5 border-1 border-black rounded-full flex items-center justify-center -m-2 text-sm">+{{
              card.bonusPoint.point }}</span>
        </div>
        <!-- bonus point -->
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'noun',
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const store = useStore()
    const cardColors = computed(() => store.state.playing.cardColors)
    const nounPhrase = computed(() => store.state.playing.nounPhrase)
    const nounType = computed(() => store.state.playing.nounType)
    const playingStep = computed(() => store.state.playing.playingStep)

    const setNounType = (value) => {
      store.commit('setNounType', value)
    }

    const setNounPhrase = (payload) => {
      store.commit('setNounPhrase', payload)
    }

    const chooseNoun = (type) => {
      if (playingStep.value === 'choose-word') {
        setNounType(type)
        const noun = {
          ...props.card[type],
          bonus: props.card.bonusPoint
        }
        setNounPhrase(noun)
      }
    }

    return {
      cardColors,
      nounPhrase,
      nounType,
      playingStep,
      chooseNoun
    }
  }
}
</script>
