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
    name: 'Email Management',
    layout: 'DashboardLayout',
    type: 'dashboard',
    navItem: {
        label: 'Email',
        order: 2,
        icon: 'envelope'
    },
    routes: [
        {
            path: '/email',
            name: 'email',
            component: UI_FRAMEWORK === 'bootstrap'
                ? /* @vite-ignore */ () => import('./views/EmailBootstrap.vue')
                : /* @vite-ignore */ () => import('./views/EmailFomantic.vue'),
            meta: {
                title: 'Send Email'
            }
        }
    ]
}
