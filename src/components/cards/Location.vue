<template>
  <div class="w-full h-full">
    <div class="w-full h-full flex flex-wrap content-between relative" v-if="typeof card.image === 'string'">
      <div
        class="absolute top-0 right-0 m-1 p-2 bg-white border-1 border-gray-800 w-6 h-6 rounded-md flex items-center justify-center">
        {{ card.point }}
      </div>
      <div class="w-full"></div>
      <div class="flex w-full">
        <div class="w-full bg-white rounded-lg border-1 border-gray-700 relative">
          <div class="p-1 flex flex-col leading-5" @click="chooseLocation(card.content[contentIndex])">
            {{ card.content[contentIndex] }}
          </div>

          <div class="flex flex-col border-t-1 border-gray-800 relative">
            <div v-for="(bonusContent, index) in card.bonusPoint" :key="'bonusPoint-' + index"
              :class="{ 'text-green-700': bonusContent.type == 'Verb' }">
              {{ bonusContent.word.join("/") }}
            </div>
            <span
              class="absolute right-0 bottom-0 bg-white w-5 h-5 border-1 border-black rounded-full flex items-center justify-center -m-0.5 text-sm">+{{
                card.bonusPoint[0].point }}</span>
          </div>
          <!-- bonus point -->
        </div>
      </div>
    </div>
    <div class="w-full h-full flex flex-wrap justify-between relative" v-if="typeof card.image === 'object'">
      <div
        class="absolute top-0 right-0 m-1 p-2 bg-white border-1 border-gray-800 w-6 h-6 rounded-md flex flex-col items-center justify-center">
        {{ card.point }}
      </div>
      <div class="w-full h-1/2 relative">
        <div class="absolute bottom-0 w-full">
          <div class="w-full -mx-1 bg-white rounded-lg border-1 border-gray-700 relative"
            @click="chooseLocation(card.content[0])">
            <div class="p-1 flex flex-col">
              {{ card.content[0] }}
            </div>
          </div>
        </div>
      </div>
      <div class="flex w-full h-1/2 relative">
        <div class="absolute bottom-0 w-full bg-white rounded-lg border-1 border-gray-700 px-0.5"
          @click="chooseLocation(card.content[1])">
          {{ card.content[1] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'location-card',
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  emits: ['choose'],
  setup(props, { emit }) {
    const store = useStore()
    const contentIndex = ref(0)
    const cardColors = computed(() => store.state.playing.cardColors)
    const playingStep = computed(() => store.state.playing.playingStep)

    const setObjectPhrase = (payload) => {
      store.commit('setObjectPhrase', payload)
    }

    const emitObjectPhrase = () => {
      if (playingStep.value === 'choose-word' && typeof props.card.image === 'string') {
        const contentOb = {
          text: props.card.content[contentIndex.value],
          point: props.card.point,
          bonus: props.card.bonusPoint,
          cardId: props.card.id
        }
        setObjectPhrase(contentOb)
        emit('choose', contentOb)
      }
    }

    watch(playingStep, emitObjectPhrase)

    onMounted(() => {
      if (props.card.content.length > 1) {
        contentIndex.value = Math.floor(Math.random() * props.card.content.length)
      }
      emitObjectPhrase()
    })

    const chooseLocation = (content) => {
      const contentOb = {
        text: content, // content is string
        point: props.card.point,
        bonus: props.card.bonusPoint,
        cardId: props.card.id
      }
      setObjectPhrase(contentOb)
      emit('choose', contentOb)
    }

    return {
      contentIndex,
      cardColors,
      playingStep,
      chooseLocation
    }
  }
}
</script>
