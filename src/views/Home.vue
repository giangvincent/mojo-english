<template>
  <div class="mx-auto relative h-full">
    <div
      class="flex flex-col flex-wrap py-4"
      :class="{ 'bg-filter-8': popupModal }"
    >
      <img class="w-2/5 mx-auto" src="@/assets/images/logo.png" alt="logo" />

      <section class="w-full flex">
        <div class="w-1/3 -mt-16 flex flex-col">
          <router-link to="market">
            <button class="">
              <svg
                class="h-12 xs:h-16 sm:h-20 md:h-32 mx-auto text-orange-700"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                  clip-rule="evenodd"
                /></svg
              >{{ $t("home")[2] }}
            </button>
          </router-link>
          <router-link to="tutorial">
            <button class="">
              <svg
                class="h-12 xs:h-16 sm:h-20 md:h-32 mx-auto text-blue-700"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.496 2.132a1 1 0 00-.992 0l-7 4A1 1 0 003 8v7a1 1 0 100 2h14a1 1 0 100-2V8a1 1 0 00.496-1.868l-7-4zM6 9a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1zm3 1a1 1 0 012 0v3a1 1 0 11-2 0v-3zm5-1a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                /></svg
              >{{ $t("home")[3] }}
            </button>
          </router-link>
        </div>
        <div class="w-1/3 flex items-center justify-center">
          <button class="touch-3d text-white flex items-center">
            <router-link
              to="play"
              class="text-2xl bg-red-600 flex items-center text-white p-4 rounded-lg"
            >
              <img
                class="h-16"
                src="@/assets/images/card-games.svg"
                alt="play-svg"
              />
              <span class="ml-4">{{ $t("home")[0] }}</span>
            </router-link>
          </button>
        </div>
        <div class="w-1/3 -mt-10">
          <button
            class=""
            @click="
              TOGGLE_MODAL();
              modalComponent = 'Setting';
            "
          >
            <svg
              class="h-20 xs:h-24 sm:h-32 md:h-40 text-black"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clip-rule="evenodd"
              /></svg
            >{{ $t("home")[1] }}
          </button>
        </div>
      </section>
      <!-- Action buttons -->
      <div class="fixed top-0 left-0">
        <div class="relative flex flex-col m-2">
          <img
            class="w-20 h-20 rounded-full border-2"
            :src="playerData.photo.src"
            alt="avatar"
          />
          <div class="w-20 rounded-lg border-2 p-1 -mt-3 bg-white">
            {{
              $t("home")[4] +
                " " +
                (typeof playerData.level !== "undefined"
                  ? playerData.level
                  : "")
            }}
          </div>
        </div>
      </div>
    </div>

    <component v-if="popupModal" v-bind:is="modalComponent"></component>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
export default {
  name: "Home",
  components: {
    Setting: () => import("@/components/Setting.vue")
  },
  data() {
    return {
      modalComponent: "Setting"
    };
  },
  computed: {
    ...mapState({
      playerData: state => state.player.playerData,
      popupModal: state => state.popupModal
    })
  },
  created() {
    let self = this;
    FBInstant.player.getDataAsync(["locale", "level"]).then(function(data) {
      self.$i18n.locale = data["locale"];
      let playerData = self.playerData;
      playerData.level = data["level"];
      console.log(playerData);
      self.setPlayerData(playerData);
      self.LoadCards(data["level"]);
    });
  },
  methods: {
    ...mapActions(["LoadCards"]),
    ...mapMutations(["TOGGLE_MODAL", "setPlayerData"])
  }
};
</script>
