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
        <button class="ui primary button" @click="openCreateModal">
          <i class="plus icon"></i>
          Create User
        </button>
      </div>
    </div>

    <!-- User Modal -->
    <div class="ui modal" ref="userModal">
      <i class="close icon"></i>
      <div class="header">
        {{ isEditing ? 'Edit User' : 'Create User' }}
      </div>
      <div class="content">
        <form class="ui form" @submit.prevent="handleSubmit">
          <div class="field">
            <label>Name</label>
            <input type="text" v-model="userForm.name" placeholder="Enter name" required>
          </div>
          <div class="field">
            <label>Email</label>
            <input type="email" v-model="userForm.email" placeholder="Enter email" required>
          </div>
          <div class="field" v-if="!isEditing">
            <label>Password</label>
            <input type="password" v-model="userForm.password" placeholder="Enter password" required>
          </div>
          <div class="field">
            <label>Role</label>
            <select class="ui dropdown" v-model="userForm.role" required>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="field">
            <label>Photo URL</label>
            <input type="url" v-model="userForm.photoURL" placeholder="Enter photo URL">
          </div>
        </form>
      </div>
      <div class="actions">
        <div class="ui black deny button">
          Cancel
        </div>
        <div class="ui positive right labeled icon button" @click="handleSubmit">
          {{ isEditing ? 'Update' : 'Create' }}
          <i class="checkmark icon"></i>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <br>
    <hr>
    <br>
    <datatable-component ref="datatableRef" v-if="columns.length"
      uri="/users/datatable?search_fields=email,username,name" :columns="columns" :dynamicButtons="dynamicButtons"
      @edit="handleEdit" @delete="handleDelete" @checkbox="handleCheckbox" @dynamic-action="handleDynamicAction" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn, DatatableProps, ColumnDefinition, DynamicButton } from '../../../../types/datatable'
import type { CreateUserDto, UpdateUserDto } from '../interfaces/user.interface'
import DatatableComponent from '@/components/dashboard/fomantic/DatatableComponent.vue'
import { useUserService } from '../services/user.service'
import { authService } from '@/services/auth.service'
// @ts-ignore - No type definitions available
import Swal from 'sweetalert2'

// Make the component available in template
const datatableComponent = DatatableComponent

const datatableRef = ref()
const userModal = ref()
const userService = useUserService()
const isEditing = ref(false)
const editingId = ref('')

const userForm = ref<CreateUserDto & UpdateUserDto>({
  name: '',
  email: '',
  password: '',
  role: 'user',
  photoURL: ''
})

const resetForm = () => {
  userForm.value = {
    name: '',
    email: '',
    password: '',
    role: 'user',
    photoURL: ''
  }
  isEditing.value = false
  editingId.value = ''
}

const openCreateModal = () => {
  resetForm()
  // @ts-ignore - Fomantic UI types
  $(userModal.value).modal('show')
}

const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      const updateData: UpdateUserDto = {
        name: userForm.value.name,
        email: userForm.value.email,
        role: userForm.value.role,
        photoURL: userForm.value.photoURL
      }
      await userService.updateUser(editingId.value, updateData)
    } else {
      const createData: CreateUserDto = {
        name: userForm.value.name,
        email: userForm.value.email,
        password: userForm.value.password,
        role: userForm.value.role,
        photoURL: userForm.value.photoURL || ''
      }
      await userService.createUser(createData)
    }
    // @ts-ignore - Fomantic UI types
    $(userModal.value).modal('hide')
    resetForm()
    refreshTable()
  } catch (error) {
    console.error('Error saving user:', error)
  }
}

const refreshTable = () => {
  datatableRef.value?.forceRedraw()
}

const handleEdit = async (id: string) => {
  try {
    const userData = await userService.getUserById(id)
    userForm.value = {
      name: userData.name,
      email: userData.email,
      password: '',
      role: userData.role,
      photoURL: userData.photoURL
    }
    isEditing.value = true
    editingId.value = id
    // @ts-ignore - Fomantic UI types
    $(userModal.value).modal('show')
  } catch (error) {
    console.error('Error fetching user:', error)
  }
}

const handleDelete = async (id: string) => {
  try {
    const result = await Swal.fire({
      title: "¿Seguro que desea eliminar?",
      text: "Esta acción no tiene retorno",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      confirmButtonColor: "#27b30d",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#dd1111",
      reverseButtons: true
    })

    if (result.isConfirmed) {
      await userService.deleteUser(id)
      refreshTable()
    }
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}

const handleCheckbox = async (id: string, field: string, isChecked: boolean) => {
  try {
    const updateData = {
      [field]: isChecked
    } as UpdateUserDto
    await userService.updateUser(id, updateData)
    refreshTable()
  } catch (error) {
    console.error('Error updating user:', error)
  }
}

const handleDynamicAction = async ({ action, id }: { action: string, id: string }) => {
  if (action === 'reset-password') {
    try {
      const { value: email } = await Swal.fire({
        title: 'Reset Password',
        input: 'email',
        inputLabel: 'Email address',
        inputPlaceholder: 'Enter email address',
        showCancelButton: true,
        confirmButtonText: 'Reset Password',
        confirmButtonColor: '#27b30d',
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#dd1111',
      });

      if (email) {
        await authService.resetPassword(email);
        await Swal.fire({
          title: 'Success',
          text: 'Password reset email has been sent',
          icon: 'success',
          confirmButtonColor: '#27b30d'
        });
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      await Swal.fire({
        title: 'Error',
        text: error instanceof Error ? error.message : 'Failed to reset password',
        icon: 'error',
        confirmButtonColor: '#dd1111'
      });
    }
  }
}

const columns = ref<TableColumn[]>([
  {
    data: '_id',
    title: 'ID',
    type: 'string',
  },
  {
    data: 'email',
    title: 'Email',
    type: 'string',
  },
  {
    data: 'name',
    title: 'Name',
    type: 'string',
  },
  {
    data: 'role',
    title: 'Role',
    type: 'string',
  },
  {
    data: 'photoURL',
    title: 'Photo',
    type: 'picture',
  },
  {
    data: 'emailVerified',
    title: 'Email Verified',
    type: 'boolean',
  }
])

const dynamicButtons: DynamicButton[] = [
  {
    label: 'Request Password Reset',
    icon: 'key',
    action: 'reset-password',
    class: 'orange'
  }
]
</script>

<style scoped>
.ui.header .icon {
  font-size: 2em;
}
</style>
