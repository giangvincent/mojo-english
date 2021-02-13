import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "@/assets/css/tailwind.css";
import "@/assets/css/animate.css";
import VueI18n from 'vue-i18n'
import lang from './lang.js'

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'vi',
  messages: lang,
})

Vue.config.productionTip = false;

/* console.log(window.innerWidth)
store.commit("SET_SCREEN_WIDTH", window.innerWidth)
store.commit("SET_SCREEN_HEIGHT", window.innerHeight * 9 / 16) */

new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
