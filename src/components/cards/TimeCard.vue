<template>
  <div
    class="w-full h-full bg-orange-700 flex flex-wrap items-center justify-center relative"
  >
    <div class="mt-0.5 ml-1 absolute left-0 top-0 text-white">
      {{ card.symbol }}
    </div>
    <div class="pt-3 flex flex-col text-white w-full h-full">
      <div
        class="flex flex-col items-center justify-center relative"
        v-for="(cardContent, index) in card.content"
        :key="'content-' + index"
        :class="{
          'h-1/3': card.content.length == 3,
          'h-1/4': card.content.length == 4,
          'border-b-1 border-black': index == 0 || index == 2,
          'border-1 border-black mx-1 pl-2': index == 1,
          'bg-black bg-opacity-50': curTense && !(cardContent.tense.indexOf(curTense) > -1)
        }"
        @click="chooseTime(index)"
      >
        <!-- <div
          v-if="index === 1"
          class="px-1 h-full bg-pink-800 absolute left-0 flex items-center"
        >
          F
        </div> -->
        <span class="leading-3">{{ cardContent.text }}</span>
        <div class="flex">
          <div
            class="flex items-center"
          >

            <span
              class="w-3 h-3 border-1 border-black mr-1"
              :class="{
                'bg-black': cardContent.tense === 'past simple',
                'bg-white': cardContent.tense === 'present simple',
                'bg-gray-500 flex items-center justify-center text-black pb-2':
                  cardContent.tense === 'future simple',
              }"
              >{{ cardContent.tense === "future simple" ? "." : "" }}</span
            >
            <span>{{ cardContent.point }}</span>

          </div>
        </div>
      </div>
    </div>
    <!-- <div class="my-1 flex absolute bottom-0 w-full text-black">
      <div class="w-4 -ml-0.5 border-r-1 border-black">
        <div
          class="h-full border-t-1 border-b-1 border-black bg-green-800"
        ></div>
      </div>
      <div class="flex items-end w-full -mx-2 relative">
        <div
          class="p-0.5 border-1 border-gray-800 rounded-md bg-gray-400 flex items-center justify-center text-sxs md:text-xs"
        >
          {{ card.id }}
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import { computed, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'time-card',
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const store = useStore()
    const objectPhrase = computed(() => store.state.playing.objectPhrase)
    const playingStep = computed(() => store.state.playing.playingStep)
    const curTense = computed(() => store.state.playing.curTense)

    const setObjectPhrase = (payload) => {
      store.commit('setObjectPhrase', payload)
    }

    watch(curTense, () => {
      console.log('present simple / future simple / past simple'.indexOf(curTense.value))
    })

    const chooseTime = (index) => {
      if (playingStep.value === 'choose-word' && curTense.value && props.card.content[index].tense.indexOf(curTense.value) > -1) {
        setObjectPhrase(props.card.content[index])
      }
    }

    return {
      objectPhrase,
      playingStep,
      curTense,
      chooseTime
    }
  }
}
</script>
