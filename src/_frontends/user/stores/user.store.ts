import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, CreateUserDto, UpdateUserDto } from '../interfaces/user.interface'
import { useUserService } from '../services/user.service'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const userService = useUserService()

  const fetchUsers = async () => {
    loading.value = true
    error.value = null
    try {
      users.value = await userService.getUsers()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch users'
    } finally {
      loading.value = false
    }
  }

  const fetchUserById = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      currentUser.value = await userService.getUserById(id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch user'
      currentUser.value = null
    } finally {
      loading.value = false
    }
  }

  const createUser = async (userData: CreateUserDto) => {
    loading.value = true
    error.value = null
    try {
      const newUser = await userService.createUser(userData)
      users.value.push(newUser)
      return newUser
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create user'
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (id: string, userData: UpdateUserDto) => {
    loading.value = true
    error.value = null
    try {
      const updatedUser = await userService.updateUser(id, userData)
      const index = users.value.findIndex(user => user._id === id)
      if (index !== -1) {
        users.value[index] = updatedUser
      }
      if (currentUser.value?._id === id) {
        currentUser.value = updatedUser
      }
      return updatedUser
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update user'
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await userService.deleteUser(id)
      users.value = users.value.filter(user => user._id !== id)
      if (currentUser.value?._id === id) {
        currentUser.value = null
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete user'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    currentUser,
    loading,
    error,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser
  }
})
