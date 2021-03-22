<template>
  <span class="absolute top-0 -mt-2 mx-auto w-full" @click="$emit('click')">
    <svg
      class="w-6 h-6 bg-white rounded-full p-1 shadow mx-auto"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
      />
    </svg>
  </span>
</template>
