import type { User, CreateUserDto, UpdateUserDto } from '../interfaces/user.interface'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export const useUserService = () => {
  const getUsers = async (): Promise<User[]> => {
    const response = await axios.get(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('idToken')}`
      }
    })
    return response.data.data
  }

  const getUserById = async (id: string): Promise<User> => {
    const response = await axios.get(`${API_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('idToken')}`
      }
    })
    return response.data.data
  }

  const createUser = async (userData: CreateUserDto): Promise<User> => {
    const response = await axios.post(`${API_URL}/users`, userData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('idToken')}`
      }
    })
    return response.data.data
  }

  const updateUser = async (id: string, userData: UpdateUserDto): Promise<User> => {
    const response = await axios.put(`${API_URL}/users/${id}`, userData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('idToken')}`
      }
    })
    return response.data.data
  }

  const deleteUser = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('idToken')}`
      }
    })
  }

  const updateField = async (id: string, field: string, value: any): Promise<User> => {
    const updateData = {
      [field]: value
    }
    const response = await axios.put(`${API_URL}/users/${id}`, updateData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('idToken')}`
      }
    })
    return response.data.data
  }

  return {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    updateField
  }
}
