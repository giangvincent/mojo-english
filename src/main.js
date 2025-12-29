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

const resolveLocale = () => {
  const browserLocale = typeof navigator !== 'undefined' ? navigator.language || 'en_US' : 'en_US'
  return browserLocale.split('_')[0] || 'en'
}

const createPlayerData = () => {
  return {
    id: 'guest',
    name: 'Guest Player',
    photo: null,
    level: 0
  }
}

const mountVueApp = () => {
  const i18n = createI18n({
    legacy: true,
    globalInjection: true,
    locale: resolveLocale(),
    fallbackLocale: 'en',
    messages: lang
  })

  // Initialize store with default guest data
  store.commit('setPlayerData', createPlayerData())
  store.commit('SET_SCREEN')

  const app = createApp(App)

  app.use(store)

  if (import.meta.env.DEV) {
    window.store = store
  }

  app.use(router)
  app.use(i18n)
  app.use(Vue3TouchEvents)

  app.mount('#app')
}

if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    mountVueApp()
  })
}
