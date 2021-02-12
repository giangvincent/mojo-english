import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "@/assets/css/tailwind.css";

Vue.config.productionTip = false;

/* console.log(window.innerWidth)
store.commit("SET_SCREEN_WIDTH", window.innerWidth)
store.commit("SET_SCREEN_HEIGHT", window.innerHeight * 9 / 16) */

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
