import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { MicroFrontendConfig } from '../_frontends/user/config'

// Function to load all micro-frontend configurations
const loadMicroFrontendConfigs = () => {
  const configs: MicroFrontendConfig[] = []
  
  // Import all config.ts files from _frontends subdirectories
  const modules = import.meta.glob('../_frontends/*/config.ts', { eager: true })
  
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
    redirect: '/users'
  }
]

// Load micro-frontend routes
const configs = loadMicroFrontendConfigs()
for (const config of configs) {
  routes.push(...config.routes)
}

// Create and configure router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
