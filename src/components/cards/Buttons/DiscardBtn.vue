<template>
  <span class="absolute top-0 -mt-2 mx-auto w-full" @click="$emit('click')">
    <!-- <svg
      class="w-6 "
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg> -->
    <span class="h-6 bg-white rounded-full p-1 shadow mx-auto">{{ $t('buttons.discard') }}</span>
  </span>
</template>
