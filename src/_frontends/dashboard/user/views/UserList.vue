<template>
  <div class="user-list">
    <!-- Page Header -->
    <div class="ui grid">
      <div class="eight wide column">
        <h2 class="ui header">
          <i class="users icon"></i>
          <div class="content">
            Users
            <div class="sub header">Manage your users</div>
          </div>
        </h2>
      </div>
      <div class="eight wide column right aligned">
        <router-link to="/users/create" class="ui primary button">
          <i class="plus icon"></i>
          Create User
        </router-link>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="ui active centered inline loader"></div>
    
    <!-- Error State -->
    <div v-if="error" class="ui negative message">
      <i class="close icon"></i>
      <div class="header">Error</div>
      <p>{{ error }}</p>
    </div>

    <!-- Users Table -->
    <div v-if="!loading && !error && users.length" class="ui segment">
      <table class="ui celled table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Created At</th>
            <th width="150">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ formatDate(user.createdAt) }}</td>
            <td>
              <div class="ui tiny icon buttons">
                <router-link :to="`/users/${user._id}/edit`" class="ui blue button" title="Edit user">
                  <i class="edit icon"></i>
                </router-link>
                <button @click="handleDelete(user._id)" class="ui red button" title="Delete user">
                  <i class="trash icon"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && !error && !users.length" class="ui placeholder segment">
      <div class="ui icon header">
        <i class="users icon"></i>
        No Users Found
      </div>
      <router-link to="/users/create" class="ui primary button">
        <i class="plus icon"></i>
        Create User
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
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
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
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
  padding: 1rem;
}

.ui.header .icon {
  font-size: 2em;
}

.ui.table td {
  vertical-align: middle;
}

.ui.placeholder.segment {
  text-align: center;
  padding: 3rem;
}
</style>
