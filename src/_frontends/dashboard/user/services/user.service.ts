import type { User, CreateUserDto, UpdateUserDto } from '../interfaces/user.interface'

// Mock data
const mockUsers: User[] = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    _id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  },
  {
    _id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03')
  }
]

export const useUserService = () => {
  const getUsers = async (): Promise<User[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return [...mockUsers]
  }

  const getUserById = async (id: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const user = mockUsers.find(u => u._id === id)
    if (!user) {
      throw new Error('User not found')
    }
    return { ...user }
  }

  const createUser = async (userData: CreateUserDto): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const newUser: User = {
      _id: String(mockUsers.length + 1),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    mockUsers.push(newUser)
    return { ...newUser }
  }

  const updateUser = async (id: string, userData: UpdateUserDto): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const index = mockUsers.findIndex(u => u._id === id)
    if (index === -1) {
      throw new Error('User not found')
    }
    const updatedUser: User = {
      ...mockUsers[index],
      ...userData,
      updatedAt: new Date()
    }
    mockUsers[index] = updatedUser
    return { ...updatedUser }
  }

  const deleteUser = async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const index = mockUsers.findIndex(u => u._id === id)
    if (index === -1) {
      throw new Error('User not found')
    }
    mockUsers.splice(index, 1)
  }

  return {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
  }
}
