/* eslint-disable no-undef */
import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import '@/assets/css/tailwind.css'
import '@/assets/css/animate.css'
import VueI18n from 'vue-i18n'
import lang from './lang.js'
import Vue2TouchEvents from 'vue2-touch-events'

Vue.use(Vue2TouchEvents)
Vue.use(VueI18n)
/* const i18n = new VueI18n({
  locale: "vi",
  messages: lang
});
let playerData = {}
store.commit("setPlayerData", playerData);
store.commit("SET_SCREEN");
new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount("#app"); */

Vue.config.productionTip = false

function startGame () {
  FBInstant.startGameAsync().then(() => {
    const i18n = new VueI18n({
      locale:
        FBInstant.getLocale() !== 'undefined' && FBInstant.getLocale() != null
          ? FBInstant.getLocale().split('_')[0]
          : 'en',
      fallbackLocale: 'en',
      messages: lang
    })

    let playerData = {}
    playerData.id = FBInstant.player.getID()
    playerData.name = FBInstant.player.getName()
    playerData.photo = new Image()
    playerData.photo.crossOrigin = 'anonymous'
    playerData.photo.src = FBInstant.player.getPhoto()

    store.commit('setPlayerData', playerData)
    store.commit('SET_SCREEN')

    // console.log(playerData)
    FBInstant.player.getDataAsync(['locale', 'level', 'point']).then(function (data) {
      i18n.locale = data['locale']
      store.commit('setPlayerData', data)
      store.dispatch('LoadCards', data['level'])
    })

    // Fetch Player's Friends
    FBInstant.player.getConnectedPlayersAsync().then(function (players) {
      // console.log('getConnectedPlayersAsync ', players)
    })

    // Fetch Context Players
    FBInstant.context.getPlayersAsync().then(function (players) {
      // console.log('getPlayersAsync', players)
    })

    new Vue({
      i18n,
      router,
      store,
      render: h => h(App)
    }).$mount('#app')

    router.afterEach((to, from) => {
      // ga('set', 'page', url)
      // ga('send', 'pageview')
    })
  })

  FBInstant.onPause(function () {
    // console.log('Pause event was triggered!')
  })
}
// const assets = ['@/assets/images/logo.png']
window.onload = function () {
  FBInstant.initializeAsync().then(() => {
    // for (let i in assets) {
    //   // When preloading assets, make sure to report the progress
    //   FBInstant.setLoadingProgress((i / assets.length) * 100);
    // }
    FBInstant.setLoadingProgress(30 + Math.random() * 50)
    return startGame()
  })
  // (function(i, s, o, g, r, a, m) {
  //   i["GoogleAnalyticsObject"] = r;
  //   (i[r] =
  //     i[r] ||
  //     function() {
  //       (i[r].q = i[r].q || []).push(arguments);
  //     }),
  //     (i[r].l = 1 * new Date());
  //   (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
  //   a.async = 1;
  //   a.src = g;
  //   m.parentNode.insertBefore(a, m);
  // })(
  //   window,
  //   document,
  //   "script",
  //   "https://www.google-analytics.com/analytics.js",
  //   "ga"
  // );

  // ga('create', 'UA-127992318-1', 'auto')
}
