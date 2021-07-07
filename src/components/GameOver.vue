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
    <div class="bg-white rounded-lg w-full shadow">
      <div class="flex flex-col items-start p-4">
        <div class="flex items-center w-full">
          <div class="text-gray-900 font-medium text-lg">Game Over</div>
          <svg
            class="ml-auto fill-current text-gray-700 w-6 h-6 cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 18 18"
          >
            <title>Close</title>
            <path
              d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
            />
          </svg>
        </div>
        <div class="w-full mt-2 pt-2 border-t-2 border-gray-200">
          <router-link to="/">
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
  name: 'gameover-modal'
}
</script>
