<template>
  <div
    class="
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
    "
  >
    <div class="bg-white rounded-lg w-full h-full shadow">
      <div class="flex flex-col items-start p-4">
        <div class="w-full mt-2 pt-2">
          <span>Congratulation! Your sentence finished:</span>
          <p class=" font-bold text-2xl">{{ finalSentence }}</p>
          <p>+{{ finalPoint }} Points</p>
        </div>
        <div class="w-full mt-2 pt-2">
          <router-link to="/" replace>
            <button
              class="
                px-3
                py-2
                m-1
                border-b-4 border-l-2
                shadow-lg
                bg-teal-700
                border-teal-900
                text-white
              "
            >
              Home
            </button>
          </router-link>
        </div>
        <!-- Setting body -->
        <hr />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'gameover-modal',
  props: {
    finalSentence: String,
    finalPoint: Number
  }
}
</script>
