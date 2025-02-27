import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { MicroFrontendConfig } from '../_frontends/dashboard/user/config'

// Get UI framework from environment variable
const UI_FRAMEWORK = import.meta.env.VITE_UI_FRAMEWORK || 'bootstrap'

// Function to load all microfrontend configurations
const loadMicroFrontendConfigs = () => {
  const configs: MicroFrontendConfig[] = []

  // Import all config.ts files from _frontends subdirectories
  const modules = import.meta.glob('../_frontends/**/**/config.ts', { eager: true })

  for (const path in modules) {
    const module = modules[path] as { config: MicroFrontendConfig }
    if (module && module.config) {
      configs.push(module.config)
    }
  }

  return configs
}

// Create base routes
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: UI_FRAMEWORK === 'bootstrap'
      ? /* @vite-ignore */ () => import('../_frontends/website/home/views/HomeBootstrap.vue')
      : /* @vite-ignore */ () => import('../_frontends/website/home/views/HomeFomantic.vue'),
    meta: {
      layout: 'WebsiteLayout'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: UI_FRAMEWORK === 'bootstrap'
      ? /* @vite-ignore */ () => import('../layouts/auth/bootstrap/LoginLayout.vue')
      : /* @vite-ignore */ () => import('../layouts/auth/fomantic/LoginLayout.vue'),
    meta: {
      layout: 'LoginLayout'
    }
  },
  {
    path: '/dashboard',
    redirect: '/dashboard/users',
    meta: {
      layout: 'DashboardLayout'
    }
  }
]

// Load micro-frontend routes
const configs = loadMicroFrontendConfigs()
for (const config of configs) {
  // Add dashboard prefix to routes if type is dashboard
  if (config.type === 'dashboard') {
    config.routes.forEach(route => {
      route.path = `/dashboard${route.path}`
      route.meta = { ...route.meta, layout: 'DashboardLayout' }
    })
  }
  routes.push(...config.routes)
}

// Create and configure router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard for dashboard routes
router.beforeEach((to, from, next) => {
  // If route is in dashboard, check authentication
  if (to.path.startsWith('/dashboard')) {
    const customToken = localStorage.getItem('customToken')
    const idToken = localStorage.getItem('idToken')
    const user = localStorage.getItem('user')

    if (!customToken || !idToken || !user) {
      // If any required auth data is missing, redirect to login
      next({
        path: '/login',
        query: { redirect: to.fullPath } // Save intended destination
      })
    } else {
      // User is authenticated, proceed to dashboard
      next()
    }
  } else if (to.path === '/login') {
    // If user is already authenticated and tries to access login page
    const customToken = localStorage.getItem('customToken')
    const idToken = localStorage.getItem('idToken')
    const user = localStorage.getItem('user')

    if (customToken && idToken && user) {
      // Redirect to dashboard if already authenticated
      next('/dashboard')
    } else {
      next()
    }
  } else {
    // For non-dashboard routes, proceed normally
    next()
  }
})

export default router
