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

export const config: MicroFrontendConfig = {
    name: 'Home',
    layout: 'WebsiteLayout',
    type: 'website',
    navItem: {
        label: 'Home',
        order: 0 // First item in nav
    },
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('./views/Home.vue'),
            meta: {
                title: 'Home'
            }
        }
    ]
}
