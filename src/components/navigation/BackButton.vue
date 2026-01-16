<template>
  <button
    @click="$router.go(-1)"
    class="pixel-icon-btn z-50 flex items-center justify-center bg-pix-paper"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-6 h-6 stroke-pix-ink"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="3"
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      />
    </svg>
  </button>
</template>

<script>
export default {
  name: 'back-button'
}
</script>
