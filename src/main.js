import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import '@/assets/css/tailwind.css'
import '@/assets/css/animate.css'
import lang from './lang.js'
import Vue3TouchEvents from 'vue3-touch-events'
import fbInstant from '@/services/fbInstant'

function startGame () {
  const startGamePromise = typeof fbInstant.startGameAsync === 'function' ? fbInstant.startGameAsync() : Promise.resolve()
  startGamePromise.then(() => {
    const fbLocale = typeof fbInstant.getLocale === 'function' ? fbInstant.getLocale() : (typeof navigator !== 'undefined' ? navigator.language || 'en_US' : 'en_US')
    const locale = fbLocale ? fbLocale.split('_')[0] : 'en'

    const i18n = createI18n({
      legacy: true,
      globalInjection: true,
      locale,
      fallbackLocale: 'en',
      messages: lang
    })

    const playerData = {}
    playerData.id = fbInstant.player?.getID ? fbInstant.player.getID() : 'mock-player-id'
    playerData.name = fbInstant.player?.getName ? fbInstant.player.getName() : 'Guest Player'
    playerData.photo = new Image()
    playerData.level = 0
    playerData.photo.crossOrigin = 'anonymous'
    playerData.photo.src = fbInstant.player?.getPhoto ? fbInstant.player.getPhoto() : ''

    store.commit('setPlayerData', playerData)
    store.commit('SET_SCREEN')

    if (fbInstant.player && typeof fbInstant.player.getDataAsync === 'function') {
      fbInstant.player.getDataAsync(['locale', 'level', 'point']).then(function (data) {
        if (data.locale) {
          i18n.global.locale = data.locale
        }
        store.commit('setPlayerData', data)
      })
    }

    if (fbInstant.player && typeof fbInstant.player.getConnectedPlayersAsync === 'function') {
      fbInstant.player.getConnectedPlayersAsync().then(function (players) {
        // console.log('getConnectedPlayersAsync ', players)
      })
    }

    if (fbInstant.context && typeof fbInstant.context.getPlayersAsync === 'function') {
      fbInstant.context.getPlayersAsync().then(function (players) {
        // console.log('getPlayersAsync', players)
      })
    }

    const app = createApp(App)
    app.use(store)
    app.use(router)
    app.use(i18n)
    app.use(Vue3TouchEvents)

    app.mount('#app')

    router.afterEach((to, from) => {
      // ga('set', 'page', url)
      // ga('send', 'pageview')
    })
  })

  fbInstant.onPause && fbInstant.onPause(function () {
    // console.log('Pause event was triggered!')
  })
}
// const assets = ['@/assets/images/logo.png']
window.onload = function () {
  const initializePromise = typeof fbInstant.initializeAsync === 'function' ? fbInstant.initializeAsync() : Promise.resolve()
  initializePromise.then(() => {
    // for (let i in assets) {
    //   // When preloading assets, make sure to report the progress
    //   FBInstant.setLoadingProgress((i / assets.length) * 100);
    // }
    if (typeof fbInstant.setLoadingProgress === 'function') {
      fbInstant.setLoadingProgress(30 + Math.random() * 50)
    }
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
