<template>
  <div class="product-list">
    <div class="header">
      <h1>Products</h1>
      <router-link :to="'/products/create'" class="btn btn-primary">
        Create Product
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
              <router-link :to="`/products/${item._id}/edit`" class="btn btn-sm btn-primary">
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
      No products found
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useProductStore } from '../stores/product.store'
import { storeToRefs } from 'pinia'

const store = useProductStore()
const { items, loading, error } = storeToRefs(store)

onMounted(() => {
  store.fetchAll()
})

const formatDate = (date: Date | undefined) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await store.remove(id)
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }
}
</script>