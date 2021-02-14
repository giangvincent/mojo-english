<template>
  <div class="mx-auto relative">
    <div :class="{ 'bg-filter-8': popupModal }">
      <div>
        <img class="w-3/5 mx-auto" src="@/assets/images/logo.png" alt="logo" />
      </div>
      <section class="w-full flex">
        <div class="w-1/3 -mt-16 flex flex-col">
          <router-link to="market">
            <button>
              <svg
                class="h-12 xs:h-16 sm:h-20 md:h-32 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                  clip-rule="evenodd"
                /></svg
              >Market
            </button>
          </router-link>
          <router-link to="tutorial">
            <button>
              <svg
                class="h-12 xs:h-16 sm:h-20 md:h-32 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.496 2.132a1 1 0 00-.992 0l-7 4A1 1 0 003 8v7a1 1 0 100 2h14a1 1 0 100-2V8a1 1 0 00.496-1.868l-7-4zM6 9a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1zm3 1a1 1 0 012 0v3a1 1 0 11-2 0v-3zm5-1a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                /></svg
              >Tutorial
            </button>
          </router-link>
        </div>
        <div class="w-1/3">
          <router-link to="play"
            ><button>
              <svg
                class="h-20 xs:h-24 sm:h-32 md:h-40"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clip-rule="evenodd"
                /></svg
              >Play
            </button></router-link
          >
        </div>
        <div class="w-1/3 -mt-10">
          <button
            @click="
              TOGGLE_MODAL();
              modalComponent = 'Setting';
            "
          >
            <svg
              class="h-20 xs:h-24 sm:h-32 md:h-40"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clip-rule="evenodd"
              /></svg
            >Setting
          </button>
        </div>
      </section>
      <!-- Action buttons -->
    </div>

    <component v-if="popupModal" v-bind:is="modalComponent"></component>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  name: "Home",
  components: {
    Setting: () => import("@/components/Setting.vue"),
  },
  data() {
    return {
      modalComponent: "Setting",
    };
  },
  computed: {
    ...mapState({
      popupModal: (state) => state.popupModal,
    }),
  },
  methods: {
    ...mapMutations(["TOGGLE_MODAL"]),
  },
};
</script>
