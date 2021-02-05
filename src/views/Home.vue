<template>
  <div class="mx-auto pb-32 relative">
    <div>
      <img class="w-2/3 mx-auto" src="@/assets/images/logo.png" alt="logo" />
    </div>
    <section class="w-full flex">
      <div class="w-1/3 mb-10 flex flex-col">
        <button>Market</button>
        <button>Tutorial</button>
      </div>
      <div class="w-1/3 mt-10">
        <router-link to="play"><button>Play</button></router-link>
      </div>
      <div class="w-1/3 mb-10"><button>Setting</button></div>
    </section>
    <!-- Action buttons -->
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
};
</script>
