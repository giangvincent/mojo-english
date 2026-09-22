import { createRouter, createWebHashHistory } from 'vue-router'
import { getAuthToken } from '@/services/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/callback',
    name: 'AuthCallback',
    component: () => import('../views/AuthCallback.vue')
  },
  {
    path: '/play',
    name: 'play',
    meta: { requiresAuth: true },
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
    path: '/progress',
    name: 'progress',
    meta: { requiresAuth: true },
    component: () => import('../views/ProgressScreen.vue')
  },
  {
    path: '/cosmetics',
    redirect: '/shopping'
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: { requiresAuth: true },
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/verba',
    name: 'verba',
    meta: { requiresAuth: true },
    component: () => import('../views/VerbaGame.vue')
  },
  {
    path: '/lobby',
    name: 'lobby',
    meta: { requiresAuth: true },
    component: () => import('../views/MultiplayerLobby.vue')
  },
  {
    path: '/create-room',
    name: 'create-room',
    meta: { requiresAuth: true },
    component: () => import('../views/CreateRoom.vue')
  },
  {
    path: '/quick-match',
    name: 'quick-match',
    meta: { requiresAuth: true },
    component: () => import('../views/QuickMatchSetup.vue')
  },
  {
    path: '/waiting-room',
    name: 'waiting-room',
    meta: { requiresAuth: true },
    component: () => import('../views/WaitingRoom.vue')
  },
  {
    path: '/vault',
    name: 'vault',
    meta: { requiresAuth: true },
    component: () => import('../views/Vault.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = getAuthToken()
    if (!token) {
      return next({ path: '/', query: { signIn: 'required', returnTo: to.fullPath } })
    }
  }
  next()
})

export default router
