<template>
  <div class="w-full h-full bg-green-700 flex flex-col text-white relative">
    <div
      class="h-1/3 flex flex-col items-center relative"
      v-for="(cardContent, index) in card.content"
      :key="'content-' + index"

    >
      <div class="w-full h-full absolute top-0 left-0 bg-black bg-opacity-50" v-if="nounType && !cardContent.condition.includes(nounType)"></div>
      <div class="w-full h-full flex justify-between items-center" @click="chooseVerb(index)">
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
import { computed, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'verb-card',
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const store = useStore()
    const cardColors = computed(() => store.state.playing.cardColors)
    const verbPhrase = computed(() => store.state.playing.verbPhrase)
    const nounType = computed(() => store.state.playing.nounType)
    const curTense = computed(() => store.state.playing.curTense)
    const playingStep = computed(() => store.state.playing.playingStep)

    const setVerbPhrase = (payload) => {
      store.commit('setVerbPhrase', payload)
    }

    const setTense = (payload) => {
      store.commit('setTense', payload)
    }

    const chooseVerb = (index) => {
      if (playingStep.value === 'choose-word') {
        setTense(props.card.content[index].tense)
        setVerbPhrase(props.card.content[index])
      }
    }

    watch(nounType, (value) => {
      console.log(value)
    })

    return {
      cardColors,
      verbPhrase,
      nounType,
      curTense,
      playingStep,
      chooseVerb
    }
  }
}
</script>
