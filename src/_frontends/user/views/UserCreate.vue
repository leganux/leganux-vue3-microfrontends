<template>
  <div class="user-form">
    <div class="header">
      <h1>Create User</h1>
      <router-link to="/users" class="btn-back">Back to Users</router-link>
    </div>

    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="name">Name</label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          required
          class="form-control"
        />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          required
          class="form-control"
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="formData.password"
          type="password"
          required
          class="form-control"
        />
      </div>

      <div v-if="error" class="error">{{ error }}</div>

      <button type="submit" :disabled="loading" class="btn-submit">
        {{ loading ? 'Creating...' : 'Create User' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.store'
import type { CreateUserDto } from '../interfaces/user.interface'

const router = useRouter()
const userStore = useUserStore()

const formData = ref<CreateUserDto>({
  name: '',
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref<string | null>(null)

const handleSubmit = async () => {
  loading.value = true
  error.value = null

  try {
    await userStore.createUser(formData.value)
    router.push('/users')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to create user'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.user-form {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-back {
  padding: 8px 16px;
  background-color: #607D8B;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.form {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-submit:disabled {
  background-color: #9E9E9E;
  cursor: not-allowed;
}

.error {
  color: #f44336;
  margin-bottom: 16px;
  text-align: center;
}
</style>
