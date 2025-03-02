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
    name: 'File Management',
    layout: 'DashboardLayout',
    type: 'dashboard',
    navItem: {
        label: 'Files',
        order: 3,
        icon: 'folder'
    },
    routes: [
        {
            path: '/files',
            name: 'files',
            component: UI_FRAMEWORK === 'bootstrap'
                ? /* @vite-ignore */ () => import('./views/FilesBootstrap.vue')
                : /* @vite-ignore */ () => import('./views/FilesFomantic.vue'),
            meta: {
                title: 'File Manager'
            }
        }
    ]
}
