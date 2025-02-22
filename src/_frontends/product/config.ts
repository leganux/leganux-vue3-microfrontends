import { defineAsyncComponent } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

export interface MicroFrontendConfig {
  name: string
  routes: RouteRecordRaw[]
  layout?: string
  menu?: string
}

export const config: MicroFrontendConfig = {
  name: 'Product Management',
  layout: 'DefaultLayout',
  menu: 'MainMenu',
  routes: [
    {
      path: '/products',
      name: 'products',
      component: defineAsyncComponent(() => import('./views/List.vue')),
      meta: {
        title: 'Products List'
      }
    },
    {
      path: '/products/create',
      name: 'products-create',
      component: defineAsyncComponent(() => import('./views/Create.vue')),
      meta: {
        title: 'Create Product'
      }
    },
    {
      path: '/products/:id/edit',
      name: 'products-edit',
      component: defineAsyncComponent(() => import('./views/Edit.vue')),
      meta: {
        title: 'Edit Product'
      }
    }
  ]
}