<template>
  <div
    class="flex items-center justify-center fixed left-0 bottom-0 w-full h-full bg-black/60 p-4 overflow-auto z-[999]"
  >
    <div class="pixel-panel w-full max-w-xl">
      <div class="flex flex-col items-start p-6">
        <div class="flex items-center w-full mb-4">
          <div class="text-pix-ink font-bold text-xl uppercase tracking-wider card-font">
            {{ $t("setting")[0] }}
          </div>
          <button class="pixel-icon-btn danger ml-auto w-10 h-10 min-h-[2.5rem]" @click="close">
            <svg
              class="w-5 h-5 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 18 18"
            >
              <title>Close</title>
              <path
                d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
              />
            </svg>
          </button>
        </div>

        <div class="w-full border-t-4 border-pix-ink pt-4">
          <ul class="space-y-4">
            <!-- Example Toggle Off -->
            <li class="flex items-center justify-between py-2">
              <div class="font-bold text-pix-ink">{{ $t("setting")[1] }}</div>
              <div class="cursor-pointer">
                <!-- Pixel Toggle OFF -->
                <div class="w-16 h-8 bg-pix-paper-2 border-2 border-pix-ink relative shadow-inner">
                  <div class="w-6 h-6 bg-gray-400 border-2 border-pix-ink absolute top-0.5 left-0.5"></div>
                </div>
              </div>
            </li>

            <!-- Example Toggle On -->
            <li class="flex items-center justify-between py-2">
              <div class="font-bold text-pix-ink">{{ $t("setting")[2] }}</div>
              <div class="cursor-pointer">
                 <!-- Pixel Toggle ON -->
                 <div class="w-16 h-8 bg-green-200 border-2 border-pix-ink relative shadow-inner">
                   <div class="w-6 h-6 bg-pix-success border-2 border-pix-ink absolute top-0.5 right-0.5"></div>
                 </div>
              </div>
            </li>

            <!-- Language Selector -->
            <li class="flex items-center justify-between py-2 relative z-20">
              <div class="font-bold text-pix-ink">{{ $t("setting")[3] }}</div>
              <div class="relative w-1/2">
                <button
                  @click="popupLanglist = !popupLanglist"
                  class="pixel-btn w-full flex justify-between items-center text-sm py-2"
                >
                  <span>{{ $t("language") }}</span>
                  <span class="text-xs">▼</span>
                </button>

                <div
                  v-if="popupLanglist"
                  class="absolute top-full right-0 w-full mt-2 pixel-panel bg-white p-0 z-30 max-h-48 overflow-y-auto"
                >
                  <ul class="flex flex-col">
                    <li
                      class="p-3 text-center hover:bg-pix-paper-2 cursor-pointer border-b border-pix-ink/20 last:border-0 font-bold text-sm"
                      v-for="(lang, index) in langList"
                      :key="'langlist-' + index"
                      @click="changeLanguage(index)"
                    >
                      {{ lang }}
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import langList from './langList'
export default {
  name: 'setting-modal',
  props: {},
  data () {
    return {
      popupLanglist: false,
      langList: langList
    }
  },
  computed: {
    ...mapState({
      playerData: state => state.player.playerData
    })
  },
  mounted () {},
  methods: {
    ...mapMutations(['TOGGLE_MODAL', 'SET_MODAL']),
    ...mapActions(['SetPlayerDataAsync']),
    close () {
      this.SET_MODAL(false)
    },
    changeLanguage (index) {
      console.log(index)
      this.popupLanglist = false
      this.$i18n.locale = index
      this.SetPlayerDataAsync({ locale: index })
    }
  }
}
</script>
