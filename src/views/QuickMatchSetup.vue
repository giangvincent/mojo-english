<template>
  <div class="min-h-screen w-full flex flex-col items-center justify-center p-4">
    <div class="pixel-panel p-8 bg-white max-w-lg w-full flex flex-col gap-6">
      <h1 class="text-3xl font-display text-center text-white">Choose Mode</h1>

      <div class="grid grid-cols-1 gap-4">
        <button v-for="mode in modes" :key="mode.id" @click="selectMode(mode.id)"
          class="pixel-btn text-lg py-4 text-center transition-transform hover:-translate-y-1"
          :class="selectedMode === mode.id ? 'primary' : 'border-pix-ink'">
          <span class="block font-bold">{{ mode.name }}</span>
          <span class="text-xs font-normal opacity-80">{{ mode.description }}</span>
        </button>
      </div>

      <div class="flex gap-4 mt-4">
        <button @click="$router.push('/')" class="pixel-btn danger flex-1">BACK</button>
        <button @click="findMatch" :disabled="!selectedMode" class="pixel-btn warning flex-1"
          :class="{ 'opacity-50 cursor-not-allowed': !selectedMode }">
          FIND MATCH
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuickMatchSetup',
  data() {
    return {
      selectedMode: null,
      modes: [
        { id: 'standard', name: 'Standard', description: 'Classic rules, balanced deck.' },
        { id: '5-4-split', name: '5/4 Split', description: 'Strategic community pool.' },
        { id: 'coop', name: 'Co-op', description: 'Work together to win.' }
      ]
    }
  },
  methods: {
    selectMode(id) {
      this.selectedMode = id;
    },
    findMatch() {
      if (this.selectedMode) {
        this.$router.push({
          name: 'waiting-room',
          query: { mode: this.selectedMode }
        });
      }
    }
  }
}
</script>
