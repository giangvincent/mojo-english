<template>
  <div @click="$router.go(-1)" class="fixed top-0 left-0">
    <button class="w-16 h-16 rounded-full p-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
        />
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: "back-button",
};
</script>