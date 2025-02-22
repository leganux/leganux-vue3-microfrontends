<template>
  <div class="product-edit">
    <div class="header">
      <h1>Edit Product</h1>
      <router-link :to="'/products'" class="btn btn-secondary">
        Back to Products
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
import { useProductStore } from '../stores/product.store'
import type { UpdateProductDto } from '../interfaces/product.interface'
import { storeToRefs } from 'pinia'

const router = useRouter()
const route = useRoute()
const store = useProductStore()
const { current, loading: storeLoading, error: storeError } = storeToRefs(store)

const formData = ref<UpdateProductDto>({
  name: ''
})

const loading = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  const id = route.params.id as string
  if (!id) {
    router.push('/products')
    return
  }

  try {
    await store.fetchById(id)
    if (current.value) {
      formData.value.name = current.value.name
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to fetch product'
  }
})

const handleSubmit = async () => {
  const id = route.params.id as string
  loading.value = true
  error.value = null

  try {
    await store.update(id, formData.value)
    router.push('/products')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to update product'
  } finally {
    loading.value = false
  }
}
</script>