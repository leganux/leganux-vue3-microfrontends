<template>
  <div class="container-fluid">
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h4>File Manager</h4>
        <div>
          <input
            type="file"
            ref="fileInput"
            @change="handleFileSelect"
            multiple
            class="d-none"
          >
          <button class="btn btn-primary" @click="triggerFileInput">
            <i class="bi bi-upload me-2"></i>Upload Files
          </button>
        </div>
      </div>
      <div class="card-body">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="alert alert-danger" role="alert">
          {{ error }}
        </div>

        <!-- Empty State -->
        <div v-else-if="!files.length" class="text-center py-5">
          <i class="bi bi-folder2-open display-1 text-muted"></i>
          <h5 class="mt-3">No files yet</h5>
          <p class="text-muted">Upload files to get started</p>
        </div>

        <!-- Files Grid -->
        <div v-else class="row g-4">
          <div v-for="file in files" :key="file._id" class="col-md-3 col-sm-6">
            <div class="card h-100">
              <!-- Preview for images -->
              <div v-if="isImage(file)" class="card-img-top position-relative" style="height: 200px;">
                <img :src="getFileUrl(file._id)" class="w-100 h-100 object-fit-cover" :alt="file.originalName">
                <div class="position-absolute top-0 end-0 p-2">
                  <button class="btn btn-sm btn-light" @click="openPreview(file)">
                    <i class="bi bi-arrows-fullscreen"></i>
                  </button>
                </div>
              </div>
              <!-- Icon for other files -->
              <div v-else class="card-img-top d-flex align-items-center justify-content-center bg-light" style="height: 200px;">
                <i :class="getFileIcon(file)" style="font-size: 4rem;"></i>
              </div>
              
              <div class="card-body">
                <h6 class="card-title text-truncate" :title="file.originalName">
                  {{ file.originalName }}
                </h6>
                <p class="card-text small text-muted mb-0">
                  Size: {{ formatSize(file.size) }}
                </p>
                <p class="card-text small text-muted">
                  Modified: {{ formatDate(file.updatedAt) }}
                </p>
              </div>
              
              <div class="card-footer bg-transparent">
                <div class="btn-group w-100">
                  <a :href="getFileUrl(file._id)" 
                     class="btn btn-outline-primary btn-sm" 
                     target="_blank" 
                     :download="file.originalName">
                    <i class="bi bi-download"></i>
                  </a>
                  <button class="btn btn-outline-danger btn-sm" @click="confirmDelete(file)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div class="modal fade" id="previewModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedFile?.originalName }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-center">
            <img v-if="selectedFile && isImage(selectedFile)" 
                 :src="getFileUrl(selectedFile._id)" 
                 class="img-fluid" 
                 :alt="selectedFile.originalName">
            <div v-else class="p-5 bg-light">
              <i :class="selectedFile ? getFileIcon(selectedFile) : ''" style="font-size: 5rem;"></i>
              <p class="mt-3">Preview not available</p>
            </div>
          </div>
          <div class="modal-footer">
            <a v-if="selectedFile" 
               :href="getFileUrl(selectedFile._id)" 
               class="btn btn-primary" 
               target="_blank" 
               :download="selectedFile.originalName">
              Download
            </a>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import { filesService } from '../services/files.service'
import type { IFile } from '../interfaces/file.interface'

defineOptions({
  name: 'FilesBootstrap'
})

const files = ref<IFile[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<IFile | null>(null)
let previewModal: Modal | null = null

onMounted(async () => {
  loadFiles()
  // Initialize Bootstrap modal
  const modalElement = document.getElementById('previewModal')
  if (modalElement) {
    previewModal = new Modal(modalElement)
  }
})

const loadFiles = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await filesService.listFiles()
    if (response.success) {
      files.value = response.data
    } else {
      throw new Error(response.message || 'Failed to load files')
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load files'
  } finally {
    loading.value = false
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  try {
    loading.value = true
    error.value = null

    const files = Array.from(input.files)
    const response = files.length === 1
      ? await filesService.uploadFile(files[0])
      : await filesService.uploadMultipleFiles(files)

    if (response.success) {
      await loadFiles()
      input.value = '' // Reset input
    } else {
      throw new Error(response.message || 'Failed to upload files')
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to upload files'
  } finally {
    loading.value = false
  }
}

const confirmDelete = async (file: IFile) => {
  if (!confirm('Are you sure you want to delete this file?')) return

  try {
    loading.value = true
    error.value = null
    const response = await filesService.deleteFile(file._id)
    if (response.success) {
      await loadFiles()
    } else {
      throw new Error(response.message || 'Failed to delete file')
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to delete file'
  } finally {
    loading.value = false
  }
}

const openPreview = (file: IFile) => {
  selectedFile.value = file
  previewModal?.show()
}

const getFileUrl = (id: string) => filesService.getFileViewUrl(id)
const getFileIcon = (file: IFile) => filesService.getFileIconClass(file)
const formatSize = (size: number) => filesService.formatFileSize(size)
const isImage = (file: IFile) => {
  const ext = file.extension.toLowerCase().replace('.', '')
  return ['jpg', 'jpeg', 'png', 'gif'].includes(ext)
}
const formatDate = (date: string) => new Date(date).toLocaleDateString()
</script>

<style scoped>
.object-fit-cover {
  object-fit: cover;
}
</style>
