<template>
  <div class="
      flex
      items-center
      justify-center
      fixed
      left-0
      bottom-0
      w-full
      h-full
      bg-transparent
      p-4
      overflow-auto
    ">
    <div class="bg-white rounded-lg w-full h-full shadow">
      <div class="flex flex-col items-start p-4">
        <div class="w-full text-center mb-4">
          <h2 class="text-3xl font-bold text-green-600">🎉 {{ $t('game_over.title') }}</h2>
        </div>

        <div class="w-full mt-2 pt-2">
          <h3 class="text-xl font-bold mb-2">{{ $t('game_over.last_sentence') }}:</h3>
          <p class="font-bold text-2xl text-purple-700">{{ finalSentence }}</p>
          <p class="text-lg mt-2">{{ $t('game_over.round_score') }}: <span class="font-bold">+{{ finalPoint }}</span></p>
        </div>

        <!-- Round Summary -->
        <div v-if="roundScores && roundScores.length > 0" class="w-full mt-4 pt-4 border-t-2">
          <h3 class="text-xl font-bold mb-2">{{ $t('game_over.round_scores') }}:</h3>
          <div class="grid grid-cols-3 gap-2">
            <div v-for="(score, index) in roundScores" :key="index" class="bg-blue-100 p-3 rounded text-center">
              <div class="font-semibold">{{ $t('playing.round') }} {{ index + 1 }}</div>
              <div class="text-2xl font-bold text-blue-600">{{ score }}</div>
            </div>
          </div>
        </div>

        <!-- Total Score -->
        <div class="w-full mt-4 pt-4 border-t-2 bg-yellow-100 p-4 rounded-lg">
          <h3 class="text-2xl font-bold text-center">
            {{ $t('game_over.total_score') }}: <span class="text-green-600">{{ totalScore }}</span>
          </h3>
          <p v-if="totalScore >= 200" class="text-center mt-2 text-lg font-semibold">
            🏆 {{ $t('game_over.reached_200') }}
          </p>
          <p v-else-if="roundScores && roundScores.length >= 3" class="text-center mt-2 text-lg font-semibold">
            ✨ {{ $t('game_over.completed_3') }}
          </p>
        </div>

        <div class="w-full mt-4 flex justify-center gap-4">
          <router-link to="/" replace>
            <button class="px-6 py-3 border-b-4 border-l-2 shadow-lg bg-teal-700 border-teal-900 text-white rounded">
              🏠 {{ $t('game_over.home') }}
            </button>
          </router-link>
          <button @click="playAgain"
            class="px-6 py-3 border-b-4 border-l-2 shadow-lg bg-blue-600 border-blue-800 text-white rounded">
            🔄 {{ $t('game_over.play_again') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'gameover-modal',
  props: {
    finalSentence: String,
    finalPoint: Number
  },
  computed: {
    ...mapState({
      roundScores: state => state.playing.roundScores,
      totalScore: state => state.playing.totalScore
    })
  },
  methods: {
    ...mapMutations(['resetGame']),
    playAgain() {
      this.resetGame()
      this.$router.push('/play')
    }
  }
}
</script>
