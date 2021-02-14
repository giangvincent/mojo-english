<template>
  <div
    class="flex items-center justify-center fixed left-0 bottom-0 w-full h-full bg-transparent p-4 overflow-auto"
  >
    <div class="bg-white rounded-lg w-full shadow">
      <div class="flex flex-col items-start p-4">
        <div class="flex items-center w-full">
          <div class="text-gray-900 font-medium text-lg">
            {{ $t("title.setting") }}
          </div>
          <svg
            class="ml-auto fill-current text-gray-700 w-6 h-6 cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 18 18"
            @click="TOGGLE_MODAL"
          >
            <title>Close</title>
            <path
              d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
            />
          </svg>
        </div>
        <div class="w-full mt-2 pt-2 border-t-2 border-gray-200">
          <ul class="">
            <li class="flex py-2">
              <div class="w-1/2 text-left">{{ $t("setting.music") }}</div>
              <!------- off ----->
              <div class="w-1/2">
                <span
                  class="float-right border rounded-full border-gray-600 flex items-center cursor-pointer w-12 justify-start"
                >
                  <span
                    class="rounded-full border w-6 h-6 border-gray-600 shadow-inner bg-white shadow"
                  >
                  </span>
                </span>
              </div>
            </li>
            <li class="flex py-2">
              <div class="w-1/2 text-left">{{ $t("setting.sound") }}</div>
              <!------- on ----->
              <div class="w-1/2">
                <span
                  class="float-right border rounded-full border-gray-600 flex items-center cursor-pointer w-12 bg-green-600 justify-end"
                >
                  <span
                    class="rounded-full border w-6 h-6 border-gray-600 shadow-inner bg-white shadow"
                  >
                  </span>
                </span>
              </div>
            </li>
            <li class="flex py-2">
              <div class="w-1/2 text-left">{{ $t("setting.language") }}</div>
              <div class="w-1/2 text-right" @click="popupLanglist = true">
                {{ $t("language") }}
              </div>
            </li>
            <li></li>
            <li></li>
          </ul>
        </div>
        <!-- Setting body -->
        <hr />
      </div>
    </div>
    <div
      v-if="popupLanglist"
      class="w-full h-full fixed bg-white overflow-auto"
    >
      <ul class="w-full p-4">
        <li
          class="w-1/2 p-1"
          v-for="(lang, index) in langList"
          :key="'langlist-' + index"
          @click="changeLanguage(index)"
        >
          {{ lang }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import langList from "./langList";
export default {
  name: "setting-modal",
  props: {},
  data() {
    return {
      popupLanglist: false,
      langList: langList,
    };
  },
  computed: {
    ...mapState({}),
  },
  mounted() {},
  methods: {
    ...mapMutations(["TOGGLE_MODAL"]),
    changeLanguage(index) {
      console.log(index);
      this.popupLanglist = false;
    },
  },
};
</script>