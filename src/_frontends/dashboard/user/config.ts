import type { RouteRecordRaw } from 'vue-router'
// Get UI framework from environment variable
const UI_FRAMEWORK = import.meta.env.VITE_UI_FRAMEWORK || 'bootstrap'

export interface MicroFrontendConfig {
    name: string
    routes: RouteRecordRaw[]
    layout?: string
    menu?: string
    type?: string
    navItem?: {
        label: string
        order?: number
        icon?: string
    }
}

export const config: MicroFrontendConfig = {
    name: 'User Management',
    layout: 'DashboardLayout',
    type: 'dashboard',
    navItem: {
        label: 'Users',
        order: 1,
        icon: 'users'
    },
    routes: [
        {
            path: '/users',
            name: 'users',
            component: UI_FRAMEWORK === 'bootstrap'
                ? /* @vite-ignore */ () => import('./views/UserBootstrap.vue')
                : /* @vite-ignore */ () => import('./views/UserFomantic.vue'),
            meta: {
                title: 'Users List'
            }
        }
    ]
}
