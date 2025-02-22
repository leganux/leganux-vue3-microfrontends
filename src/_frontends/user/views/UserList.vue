<template>
  <div class="user-list">
    <div class="header">
      <h1>Users</h1>
      <router-link to="/users/create" class="btn-create">Create User</router-link>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    
    <div v-if="error" class="error">{{ error }}</div>

    <table v-if="!loading && !error && users.length" class="users-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user._id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ formatDate(user.createdAt) }}</td>
          <td class="actions">
            <router-link :to="`/users/${user._id}/edit`" class="btn-edit">
              Edit
            </router-link>
            <button @click="handleDelete(user._id)" class="btn-delete">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="!loading && !error && !users.length" class="no-users">
      No users found
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '../stores/user.store'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { users, loading, error } = storeToRefs(userStore)

onMounted(() => {
  userStore.fetchUsers()
})

const formatDate = (date: Date | undefined) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await userStore.deleteUser(id)
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }
}
</script>

<style scoped>
.user-list {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-create {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.users-table th,
.users-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.users-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-edit,
.btn-delete {
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-edit {
  background-color: #2196F3;
  color: white;
  text-decoration: none;
}

.btn-delete {
  background-color: #f44336;
  color: white;
  border: none;
}

.loading,
.error,
.no-users {
  text-align: center;
  padding: 20px;
}

.error {
  color: #f44336;
}
</style>
