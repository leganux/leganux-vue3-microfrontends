import type { RouteRecordRaw } from 'vue-router'

export interface MicroFrontendConfig {
    name: string
    routes: RouteRecordRaw[]
    layout?: string
    menu?: string
    type?: string
    navItem?: {
        label: string
        order?: number
    }
}
const UI_FRAMEWORK = import.meta.env.VITE_UI_FRAMEWORK || 'bootstrap'

export const config: MicroFrontendConfig = {
    name: 'About Us',
    layout: 'WebsiteLayout',
    type: 'website',
    navItem: {
        label: 'About Us',
        order: 0
    },
    routes: [
        {
            path: '/about',
            name: 'about',
            component: UI_FRAMEWORK === 'bootstrap'
                ? /* @vite-ignore */ () => import('./views/AboutBootstrap.vue')
                : /* @vite-ignore */ () => import('./views/AboutFomantic.vue'),
            meta: {
                title: 'About Us'
            }
        }
    ]
}