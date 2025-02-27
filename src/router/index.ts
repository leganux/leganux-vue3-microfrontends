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
    component: () => import('../_frontends/website/home/views/Home.vue'),
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
  // If route is in dashboard and not logged in, redirect to login
  if (to.path.startsWith('/dashboard')) {
    // Add your auth check logic here
    // For now, we'll just let them through
    next()
  } else {
    next()
  }
})

export default router
