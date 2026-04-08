import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/play',
    name: 'play',
    component: () => import('../views/VerbaGame.vue')
  },
  {
    path: '/shopping',
    name: 'shopping',
    component: () => import('../views/Shopping.vue')
  },
  {
    path: '/market',
    redirect: '/shopping'
  },
  {
    path: '/tutorial',
    name: 'tutorial',
    component: () => import('../views/Tutorial.vue')
  },
  {
    path: '/test-cards',
    name: 'test-cards',
    component: () => import('../views/test-view/cards.vue')
  },
  {
    path: '/progress',
    name: 'progress',
    component: () => import('../views/ProgressScreen.vue')
  },
  {
    path: '/cosmetics',
    redirect: '/shopping'
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/verba',
    name: 'verba',
    component: () => import('../views/VerbaGame.vue')
  },
  {
    path: '/lobby',
    name: 'lobby',
    component: () => import('../views/MultiplayerLobby.vue')
  },
  {
    path: '/create-room',
    name: 'create-room',
    component: () => import('../views/CreateRoom.vue')
  },
  {
    path: '/quick-match',
    name: 'quick-match',
    component: () => import('../views/QuickMatchSetup.vue')
  },
  {
    path: '/waiting-room',
    name: 'waiting-room',
    component: () => import('../views/WaitingRoom.vue')
  },
  {
    path: '/vault',
    name: 'vault',
    component: () => import('../views/Vault.vue')
  }
]

export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})
