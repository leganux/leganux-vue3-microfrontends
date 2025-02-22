<template>
  <div class="product-create">
    <div class="header">
      <h1>Create Product</h1>
      <router-link :to="'/products'" class="btn btn-secondary">
        Back to Products
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
import { useProductStore } from '../stores/product.store'
import type { CreateProductDto } from '../interfaces/product.interface'

const router = useRouter()
const store = useProductStore()

const formData = ref<CreateProductDto>({
  name: ''
})

const loading = ref(false)
const error = ref<string | null>(null)

const handleSubmit = async () => {
  loading.value = true
  error.value = null

  try {
    await store.create(formData.value)
    router.push('/products')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to create product'
  } finally {
    loading.value = false
  }
}
</script>