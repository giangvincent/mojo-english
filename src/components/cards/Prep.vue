<template>
  <div
    class="w-full h-full py-2 bg-red-700 flex flex-wrap content-between items-center justify-center text-white relative"
  >
    <div class="absolute right-0 top-0 m-1">{{ card.point }}</div>
    <div class="w-full flex flex-col justify-center h-1/2">
      <div class="text-xs cursor-pointer" :class="{ 'opacity-70': !isActive('with') }" @click="choosePrep('with', card.point)">with</div>
      <div class="flex text-sxs">
        <div class="w-1/2 flex flex-col">
          <span class="cursor-pointer" :class="{ 'opacity-70': !isActive('to') }" @click="choosePrep('to', card.point)">to</span>
          <span class="cursor-pointer" :class="{ 'opacity-70': !isActive('from') }" @click="choosePrep('from', card.point)">from</span>
          <span class="cursor-pointer" :class="{ 'opacity-70': !isActive('over') }" @click="choosePrep('over', card.point)">over</span>
          <span class="cursor-pointer" :class="{ 'opacity-70': !isActive('into') }" @click="choosePrep('into', card.point)">into</span>
        </div>
        <div class="w-1/2 flex flex-col">
          <span class="cursor-pointer" :class="{ 'opacity-70': !isActive('at') }" @click="choosePrep('at', card.point)">at</span>
          <span class="cursor-pointer" :class="{ 'opacity-70': !isActive('for') }" @click="choosePrep('for', card.point)">for</span>
          <span class="cursor-pointer" :class="{ 'opacity-70': !isActive('about') }" @click="choosePrep('about', card.point)">about</span>
          <span class="cursor-pointer" :class="{ 'opacity-70': !isActive('of') }" @click="choosePrep('of', card.point)">of</span>
        </div>
      </div>
    </div>
    <span class="my-1 border-t-1 border-white w-1/2"></span>
    <div class="flex flex-col justify-center h-1/2 w-full text-xs">
      <div class="h-1/4 cursor-pointer" :class="{ 'opacity-70': !isActive('away from') }" @click="choosePrep('away from', card.point)">away from</div>
      <div class="h-1/4 cursor-pointer" :class="{ 'opacity-70': !isActive('over to') }" @click="choosePrep('over to', card.point)">over to</div>
      <div class="h-1/4 flex">
        <div class="w-1/4"></div>
        <div
          class="w-3/4 pl-4 border-1 border-black text-left -mr-1"
          :class="['bg-' + cardColors['Adverb'], { 'opacity-70': !isActive('away') }]"
          @click="choosePrep('away', card.point)"
        >
          away
        </div>
      </div>
      <div class="h-1/4">
        <div class="w-full flex justify-between items-center">
          <div class="flex z-10">
            <div
              class="w-3 flex flex-col"
              :class="'bg-' + cardColors['Verb']"
            ></div>
            <span
              class="-ml-1 p-0.5 bg-gray-200 rounded-md border-1 border-black text-black text-sxs md:text-xs"
              >{{ card.id }}</span
            >
          </div>

          <div
            class="h-4 -mx-1 border-1 border-black text-sxs px-1 bg-white flex text-black"
          >
            <svg
              class="w-3 h-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            / (<svg
              class="h-3 w-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
              /></svg
            >)
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'prep-card',
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  emits: ['choose'],
  setup (props, { emit }) {
    const store = useStore()
    const cardColors = computed(() => store.state.playing.cardColors)
    const playingStep = computed(() => store.state.playing.playingStep)
    const selectedKey = ref('')

    const choosePrep = (text, point) => {
      if (playingStep.value !== 'choose-word') return
      selectedKey.value = text
      emit('choose', { text, point, cardId: props.card.id })
    }

    const isActive = (key) => selectedKey.value === '' || selectedKey.value === key

    return {
      cardColors,
      choosePrep,
      isActive
    }
  }
}
</script>
