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
    component: () => import('../views/PlayGround.vue')
  },
  {
    path: '/market',
    name: 'market',
    component: () => import('../views/Market.vue')
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
    name: 'cosmetics',
    component: () => import('../views/CosmeticsScreen.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/Dashboard.vue')
  }
]

export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})
