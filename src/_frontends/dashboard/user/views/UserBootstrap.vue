<template>
  <div class="user-list">
    <!-- Page Header -->
    <div class="row mb-4">
      <div class="col-md-6">
        <h2>
          <i class="bi bi-people"></i>
          Users
          <small class="text-muted d-block">Manage your users</small>
        </h2>
      </div>

      <div class="col-md-6 text-end">
        <button class="btn btn-primary" @click="openCreateModal">
          <i class="bi bi-plus"></i>
          Create User
        </button>
      </div>
    </div>

    <!-- User Modal -->
    <div class="modal fade" ref="userModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Edit User' : 'Create User' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input type="text" class="form-control" v-model="userForm.name" placeholder="Enter name" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" v-model="userForm.email" placeholder="Enter email" required>
              </div>
              <div class="mb-3" v-if="!isEditing">
                <label class="form-label">Password</label>
                <input type="password" class="form-control" v-model="userForm.password" placeholder="Enter password" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Role</label>
                <select class="form-select" v-model="userForm.role" required>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Photo URL</label>
                <input type="url" class="form-control" v-model="userForm.photoURL" placeholder="Enter photo URL">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="handleSubmit">
              {{ isEditing ? 'Update' : 'Create' }}
              <i class="bi bi-check"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <hr class="my-4">
    <datatable-component ref="datatableRef" v-if="columns.length"
      uri="/users/datatable?search_fields=email,username,name" :columns="columns" :dynamicButtons="dynamicButtons"
      @edit="handleEdit" @delete="handleDelete" @checkbox="handleCheckbox" @dynamic-action="handleDynamicAction" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { TableColumn, DatatableProps, ColumnDefinition, DynamicButton } from '../../../../types/datatable'
import type { CreateUserDto, UpdateUserDto } from '../interfaces/user.interface'
import DatatableComponent from '@/components/dashboard/bootstrap/DatatableComponent.vue'
import { useUserService } from '../services/user.service'
import { authService } from '@/services/auth.service'
// @ts-ignore - No type definitions available
import Swal from 'sweetalert2'
// @ts-ignore - No type definitions available
import { Modal } from 'bootstrap'

// Make the component available in template
const datatableComponent = DatatableComponent

const datatableRef = ref()
const userModal = ref()
let modal: any = null
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

onMounted(() => {
  modal = new Modal(userModal.value)
})

const openCreateModal = () => {
  resetForm()
  modal.show()
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
    modal.hide()
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
    modal.show()
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
    class: 'warning'
  }
]
</script>

<style scoped>
.bi {
  font-size: 1.5em;
  vertical-align: middle;
  margin-right: 0.5rem;
}
</style>
