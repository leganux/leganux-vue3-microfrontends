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
    name: 'WhatsApp Integration',
    layout: 'DashboardLayout',
    type: 'dashboard',
    navItem: {
        label: 'WhatsApp',
        order: 3,
        icon: 'whatsapp'
    },
    routes: [
        {
            path: '/whatsapp',
            name: 'whatsapp',
            component: UI_FRAMEWORK === 'bootstrap'
                ? /* @vite-ignore */ () => import('./views/WhatsAppBootstrap.vue')
                : /* @vite-ignore */ () => import('./views/WhatsAppFomantic.vue'),
            meta: {
                title: 'WhatsApp'
            }
        }
    ]
}
