import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product, CreateProductDto, UpdateProductDto } from '../interfaces/product.interface'
import { useProductService } from '../services/product.service'

export const useProductStore = defineStore('product', () => {
  const items = ref<Product[]>([])
  const current = ref<Product | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const service = useProductService()

  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      items.value = await service.getAll()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch Products'
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
      error.value = e instanceof Error ? e.message : 'Failed to fetch Product'
      current.value = null
    } finally {
      loading.value = false
    }
  }

  const create = async (data: CreateProductDto) => {
    loading.value = true
    error.value = null
    try {
      const newProduct = await service.create(data)
      items.value.push(newProduct)
      return newProduct
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create Product'
      throw e
    } finally {
      loading.value = false
    }
  }

  const update = async (id: string, data: UpdateProductDto) => {
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
      error.value = e instanceof Error ? e.message : 'Failed to update Product'
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
      error.value = e instanceof Error ? e.message : 'Failed to delete Product'
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
})