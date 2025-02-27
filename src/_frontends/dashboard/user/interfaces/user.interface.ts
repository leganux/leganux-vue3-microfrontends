export interface User {
  _id: string;
  name: string;
  email: string;
  photoURL: string;
  role: 'user' | 'admin';
  emailVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  photoURL: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  role?: 'user' | 'admin';
  photoURL?: string;
}
