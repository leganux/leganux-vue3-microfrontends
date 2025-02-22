import type { User, CreateUserDto, UpdateUserDto } from '../interfaces/user.interface'

const API_URL = 'http://localhost:3000/api/user'

export const useUserService = () => {
  const getUsers = async (): Promise<User[]> => {
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }
    return response.json()
  }

  const getUserById = async (id: string): Promise<User> => {
    const response = await fetch(`${API_URL}/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch user')
    }
    return response.json()
  }

  const createUser = async (user: CreateUserDto): Promise<User> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    if (!response.ok) {
      throw new Error('Failed to create user')
    }
    return response.json()
  }

  const updateUser = async (id: string, user: UpdateUserDto): Promise<User> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    if (!response.ok) {
      throw new Error('Failed to update user')
    }
    return response.json()
  }

  const deleteUser = async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error('Failed to delete user')
    }
  }

  return {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
  }
}
