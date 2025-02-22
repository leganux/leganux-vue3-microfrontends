import type { Product, CreateProductDto, UpdateProductDto } from '../interfaces/product.interface'

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/products`

export const useProductService = () => {
  const getAll = async (): Promise<Product[]> => {
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error('Failed to fetch Products')
    }
    return response.json()
  }

  const getById = async (id: string): Promise<Product> => {
    const response = await fetch(`${API_URL}/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch Product')
    }
    return response.json()
  }

  const create = async (data: CreateProductDto): Promise<Product> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error('Failed to create Product')
    }
    return response.json()
  }

  const update = async (id: string, data: UpdateProductDto): Promise<Product> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error('Failed to update Product')
    }
    return response.json()
  }

  const remove = async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error('Failed to delete Product')
    }
  }

  return {
    getAll,
    getById,
    create,
    update,
    remove
  }
}