<template>
  <div class="absolute bottom-0 -mb-8 mx-auto w-full flex items-center justify-center gap-1">
    <button type="button" @click="changeCard('Noun')" class="pixel-btn ghost px-2 py-1 text-[10px] leading-none"
      v-if="cardIndex == 0 && cardOb.type !== 'Noun'"><svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg"
        fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
      <span class="ml-1">Noun</span></button>
    <button type="button" @click="changeCard('Verb')" class="pixel-btn success px-2 py-1 text-[10px] leading-none"
      v-if="cardIndex == 1 && cardOb.type !== 'Verb'"><svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg"
        fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
      <span class="ml-1">Verb</span></button>
    <button type="button" @click="changeCard('TimeCard')" class="pixel-btn warning px-2 py-1 text-[10px] leading-none"
      v-if="cardIndex == 2 && cardOb.type !== 'TimeCard' && cardOb.type !== 'Location'"><svg class="w-6 h-6"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
      <span class="ml-1">Time</span></button>
    <button type="button" @click="changeCard('Location')" class="pixel-btn ghost px-2 py-1 text-[10px] leading-none"
      v-if="cardIndex == 2 && cardOb.type !== 'TimeCard' && cardOb.type !== 'Location'"><svg class="w-6 h-6"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
      <span class="ml-1">Location</span></button>
  </div>
</template>

<script>
export default {
  name: 'replace-btn',
  props: {
    cardIndex: Number,
    cardOb: Object
  },
  methods: {
    changeCard(card) {
      this.$emit('changeCard', { cardType: card, index: this.cardIndex, cardOb: this.cardOb })
    }
  }
}
</script>
