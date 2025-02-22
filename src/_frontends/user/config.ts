import type { RouteRecordRaw } from 'vue-router'

export interface MicroFrontendConfig {
  name: string
  routes: RouteRecordRaw[]
  layout?: string
  menu?: string
}

export const config: MicroFrontendConfig = {
  name: 'User Management',
  layout: 'DefaultLayout',
  menu: 'MainMenu',
  routes: [
    {
      path: '/users',
      name: 'users',
      component: () => import('./views/UserList.vue'),
      meta: {
        title: 'Users List'
      }
    },
    {
      path: '/users/create',
      name: 'users-create',
      component: () => import('./views/UserCreate.vue'),
      meta: {
        title: 'Create User'
      }
    },
    {
      path: '/users/:id/edit',
      name: 'users-edit',
      component: () => import('./views/UserEdit.vue'),
      meta: {
        title: 'Edit User'
      }
    }
  ]
}
