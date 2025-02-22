#!/usr/bin/env node
import { promises as fs } from 'fs'
import path from 'path'
import readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

interface MicroFrontendConfig {
  name: string
  pluralName: string
  singularName: string
  apiPath: string
  uiFramework: 'bootstrap' | 'fomantic'
}

const generateInterface = (config: MicroFrontendConfig) => `export interface ${config.singularName} {
  _id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Create${config.singularName}Dto {
  name: string;
}

export interface Update${config.singularName}Dto {
  name?: string;
}`

const generateService = (config: MicroFrontendConfig) => `import type { ${config.singularName}, Create${config.singularName}Dto, Update${config.singularName}Dto } from '../interfaces/${config.name}.interface'

const API_URL = \`\${import.meta.env.VITE_API_BASE_URL}/${config.apiPath}\`

export const use${config.singularName}Service = () => {
  const getAll = async (): Promise<${config.singularName}[]> => {
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error('Failed to fetch ${config.pluralName}')
    }
    return response.json()
  }

  const getById = async (id: string): Promise<${config.singularName}> => {
    const response = await fetch(\`\${API_URL}/\${id}\`)
    if (!response.ok) {
      throw new Error('Failed to fetch ${config.singularName}')
    }
    return response.json()
  }

  const create = async (data: Create${config.singularName}Dto): Promise<${config.singularName}> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error('Failed to create ${config.singularName}')
    }
    return response.json()
  }

  const update = async (id: string, data: Update${config.singularName}Dto): Promise<${config.singularName}> => {
    const response = await fetch(\`\${API_URL}/\${id}\`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error('Failed to update ${config.singularName}')
    }
    return response.json()
  }

  const remove = async (id: string): Promise<void> => {
    const response = await fetch(\`\${API_URL}/\${id}\`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error('Failed to delete ${config.singularName}')
    }
  }

  return {
    getAll,
    getById,
    create,
    update,
    remove
  }
}`

const generateStore = (config: MicroFrontendConfig) => `import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ${config.singularName}, Create${config.singularName}Dto, Update${config.singularName}Dto } from '../interfaces/${config.name}.interface'
import { use${config.singularName}Service } from '../services/${config.name}.service'

export const use${config.singularName}Store = defineStore('${config.name}', () => {
  const items = ref<${config.singularName}[]>([])
  const current = ref<${config.singularName} | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const service = use${config.singularName}Service()

  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      items.value = await service.getAll()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch ${config.pluralName}'
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      current.value = await service.getById(id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch ${config.singularName}'
      current.value = null
    } finally {
      loading.value = false
    }
  }

  const create = async (data: Create${config.singularName}Dto) => {
    loading.value = true
    error.value = null
    try {
      const new${config.singularName} = await service.create(data)
      items.value.push(new${config.singularName})
      return new${config.singularName}
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create ${config.singularName}'
      throw e
    } finally {
      loading.value = false
    }
  }

  const update = async (id: string, data: Update${config.singularName}Dto) => {
    loading.value = true
    error.value = null
    try {
      const updated = await service.update(id, data)
      const index = items.value.findIndex(item => item._id === id)
      if (index !== -1) {
        items.value[index] = updated
      }
      if (current.value?._id === id) {
        current.value = updated
      }
      return updated
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update ${config.singularName}'
      throw e
    } finally {
      loading.value = false
    }
  }

  const remove = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await service.remove(id)
      items.value = items.value.filter(item => item._id !== id)
      if (current.value?._id === id) {
        current.value = null
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete ${config.singularName}'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    current,
    loading,
    error,
    fetchAll,
    fetchById,
    create,
    update,
    remove
  }
})`

const generateConfig = (config: MicroFrontendConfig) => `import { defineAsyncComponent } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

export interface MicroFrontendConfig {
  name: string
  routes: RouteRecordRaw[]
  layout?: string
  menu?: string
}

export const config: MicroFrontendConfig = {
  name: '${config.singularName} Management',
  layout: 'DefaultLayout',
  menu: 'MainMenu',
  routes: [
    {
      path: '/${config.pluralName.toLowerCase()}',
      name: '${config.pluralName.toLowerCase()}',
      component: defineAsyncComponent(() => import('./views/List.vue')),
      meta: {
        title: '${config.pluralName} List'
      }
    },
    {
      path: '/${config.pluralName.toLowerCase()}/create',
      name: '${config.pluralName.toLowerCase()}-create',
      component: defineAsyncComponent(() => import('./views/Create.vue')),
      meta: {
        title: 'Create ${config.singularName}'
      }
    },
    {
      path: '/${config.pluralName.toLowerCase()}/:id/edit',
      name: '${config.pluralName.toLowerCase()}-edit',
      component: defineAsyncComponent(() => import('./views/Edit.vue')),
      meta: {
        title: 'Edit ${config.singularName}'
      }
    }
  ]
}`

const generateListView = (config: MicroFrontendConfig) => `<template>
  <div class="${config.name}-list">
    <div class="header">
      <h1>${config.pluralName}</h1>
      <router-link :to="'/${config.pluralName.toLowerCase()}/create'" class="btn btn-primary">
        Create ${config.singularName}
      </router-link>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <table v-if="!loading && !error && items.length" class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item._id">
          <td>{{ item.name }}</td>
          <td>{{ formatDate(item.createdAt) }}</td>
          <td>
            <div class="btn-group">
              <router-link :to="\`/${config.pluralName.toLowerCase()}/\${item._id}/edit\`" class="btn btn-sm btn-primary">
                Edit
              </router-link>
              <button @click="handleDelete(item._id)" class="btn btn-sm btn-danger">
                Delete
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="!loading && !error && !items.length" class="alert alert-info">
      No ${config.pluralName.toLowerCase()} found
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { use${config.singularName}Store } from '../stores/${config.name}.store'
import { storeToRefs } from 'pinia'

const store = use${config.singularName}Store()
const { items, loading, error } = storeToRefs(store)

onMounted(() => {
  store.fetchAll()
})

const formatDate = (date: Date | undefined) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this ${config.singularName.toLowerCase()}?')) {
    try {
      await store.remove(id)
    } catch (error) {
      console.error('Failed to delete ${config.singularName.toLowerCase()}:', error)
    }
  }
}
</script>`

const generateCreateView = (config: MicroFrontendConfig) => `<template>
  <div class="${config.name}-create">
    <div class="header">
      <h1>Create ${config.singularName}</h1>
      <router-link :to="'/${config.pluralName.toLowerCase()}'" class="btn btn-secondary">
        Back to ${config.pluralName}
      </router-link>
    </div>

    <form @submit.prevent="handleSubmit" class="form">
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          required
          class="form-control"
        />
      </div>

      <div v-if="error" class="alert alert-danger">{{ error }}</div>

      <button type="submit" :disabled="loading" class="btn btn-primary">
        {{ loading ? 'Creating...' : 'Create' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { use${config.singularName}Store } from '../stores/${config.name}.store'
import type { Create${config.singularName}Dto } from '../interfaces/${config.name}.interface'

const router = useRouter()
const store = use${config.singularName}Store()

const formData = ref<Create${config.singularName}Dto>({
  name: ''
})

const loading = ref(false)
const error = ref<string | null>(null)

const handleSubmit = async () => {
  loading.value = true
  error.value = null

  try {
    await store.create(formData.value)
    router.push('/${config.pluralName.toLowerCase()}')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to create ${config.singularName.toLowerCase()}'
  } finally {
    loading.value = false
  }
}
</script>`

const generateEditView = (config: MicroFrontendConfig) => `<template>
  <div class="${config.name}-edit">
    <div class="header">
      <h1>Edit ${config.singularName}</h1>
      <router-link :to="'/${config.pluralName.toLowerCase()}'" class="btn btn-secondary">
        Back to ${config.pluralName}
      </router-link>
    </div>

    <div v-if="loading" class="loading">Loading...</div>

    <form v-else @submit.prevent="handleSubmit" class="form">
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          required
          class="form-control"
        />
      </div>

      <div v-if="error" class="alert alert-danger">{{ error }}</div>

      <button type="submit" :disabled="loading" class="btn btn-primary">
        {{ loading ? 'Updating...' : 'Update' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { use${config.singularName}Store } from '../stores/${config.name}.store'
import type { Update${config.singularName}Dto } from '../interfaces/${config.name}.interface'
import { storeToRefs } from 'pinia'

const router = useRouter()
const route = useRoute()
const store = use${config.singularName}Store()
const { current, loading: storeLoading, error: storeError } = storeToRefs(store)

const formData = ref<Update${config.singularName}Dto>({
  name: ''
})

const loading = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  const id = route.params.id as string
  if (!id) {
    router.push('/${config.pluralName.toLowerCase()}')
    return
  }

  try {
    await store.fetchById(id)
    if (current.value) {
      formData.value.name = current.value.name
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to fetch ${config.singularName.toLowerCase()}'
  }
})

const handleSubmit = async () => {
  const id = route.params.id as string
  loading.value = true
  error.value = null

  try {
    await store.update(id, formData.value)
    router.push('/${config.pluralName.toLowerCase()}')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to update ${config.singularName.toLowerCase()}'
  } finally {
    loading.value = false
  }
}
</script>`

async function createMicroFrontend() {
  console.log('Create a new micro-frontend\n')

  const name = await question('Enter the micro-frontend name (e.g., product): ')
  const pluralName = await question('Enter the plural name (e.g., Products): ')
  const singularName = await question('Enter the singular name (e.g., Product): ')
  const apiPath = await question('Enter the API path (e.g., products): ')
  const uiFramework = await question('Choose UI framework (bootstrap/fomantic): ') as 'bootstrap' | 'fomantic'

  const config: MicroFrontendConfig = {
    name,
    pluralName,
    singularName,
    apiPath,
    uiFramework
  }

  const basePath = path.join(process.cwd(), 'src/_frontends', name)

  // Create directory structure
  await fs.mkdir(basePath, { recursive: true })
  await fs.mkdir(path.join(basePath, 'interfaces'), { recursive: true })
  await fs.mkdir(path.join(basePath, 'services'), { recursive: true })
  await fs.mkdir(path.join(basePath, 'stores'), { recursive: true })
  await fs.mkdir(path.join(basePath, 'views'), { recursive: true })

  // Generate files
  await fs.writeFile(
    path.join(basePath, 'interfaces', `${name}.interface.ts`),
    generateInterface(config)
  )
  await fs.writeFile(
    path.join(basePath, 'services', `${name}.service.ts`),
    generateService(config)
  )
  await fs.writeFile(
    path.join(basePath, 'stores', `${name}.store.ts`),
    generateStore(config)
  )
  await fs.writeFile(
    path.join(basePath, 'config.ts'),
    generateConfig(config)
  )
  await fs.writeFile(
    path.join(basePath, 'views', 'List.vue'),
    generateListView(config)
  )
  await fs.writeFile(
    path.join(basePath, 'views', 'Create.vue'),
    generateCreateView(config)
  )
  await fs.writeFile(
    path.join(basePath, 'views', 'Edit.vue'),
    generateEditView(config)
  )

  console.log(`\nMicro-frontend '${name}' created successfully!`)
  rl.close()
}

createMicroFrontend().catch(console.error)
