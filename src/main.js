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

const callFbPromise = (fn, ...args) => {
  if (typeof fn !== 'function') {
    return Promise.resolve()
  }

  try {
    return Promise.resolve(fn(...args))
  } catch (error) {
    return Promise.reject(error)
  }
}

const resolveLocale = () => {
  const fbLocale = typeof fbInstant.getLocale === 'function'
    ? fbInstant.getLocale()
    : (typeof navigator !== 'undefined' ? navigator.language || 'en_US' : 'en_US')

  if (!fbLocale) {
    return 'en'
  }

  return fbLocale.split('_')[0] || 'en'
}

const createPlayerData = () => {
  const photo = typeof Image === 'undefined' ? null : new Image()

  if (photo) {
    photo.crossOrigin = 'anonymous'
    photo.src = fbInstant.player?.getPhoto ? fbInstant.player.getPhoto() : ''
  }

  return {
    id: fbInstant.player?.getID ? fbInstant.player.getID() : 'mock-player-id',
    name: fbInstant.player?.getName ? fbInstant.player.getName() : 'Guest Player',
    photo,
    level: 0
  }
}

const hydratePlayerFromFb = async (i18n) => {
  if (!fbInstant.player || typeof fbInstant.player.getDataAsync !== 'function') {
    return
  }

  try {
    const data = await fbInstant.player.getDataAsync(['locale', 'level', 'point'])

    if (data.locale) {
      i18n.global.locale = data.locale
    }

    store.commit('setPlayerData', data)
  } catch (error) {
    console.error('Failed to load player data', error)
  }
}

const initConnectedPlayers = () => {
  if (fbInstant.player?.getConnectedPlayersAsync) {
    fbInstant.player.getConnectedPlayersAsync().catch(() => {})
  }

  if (fbInstant.context?.getPlayersAsync) {
    fbInstant.context.getPlayersAsync().catch(() => {})
  }
}

const mountVueApp = (i18n) => {
  const app = createApp(App)

  app.use(store)
  app.use(router)
  app.use(i18n)
  app.use(Vue3TouchEvents)

  app.mount('#app')

  router.afterEach(() => {
    // Hook reserved for future analytics
  })
}

const registerPauseHandler = () => {
  if (typeof fbInstant.onPause === 'function') {
    fbInstant.onPause(() => {
      // Pause event hook
    })
  }
}

const startGame = async () => {
  await callFbPromise(fbInstant.startGameAsync)

  const i18n = createI18n({
    legacy: true,
    globalInjection: true,
    locale: resolveLocale(),
    fallbackLocale: 'en',
    messages: lang
  })

  store.commit('setPlayerData', createPlayerData())
  store.commit('SET_SCREEN')

  hydratePlayerFromFb(i18n)
  initConnectedPlayers()
  registerPauseHandler()

  mountVueApp(i18n)
}

const initialize = async () => {
  await callFbPromise(fbInstant.initializeAsync)

  if (typeof fbInstant.setLoadingProgress === 'function') {
    fbInstant.setLoadingProgress(30 + Math.random() * 50)
  }

  await startGame()
}

if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    initialize().catch(error => {
      console.error('Failed to initialize the game', error)
    })
  })
}
