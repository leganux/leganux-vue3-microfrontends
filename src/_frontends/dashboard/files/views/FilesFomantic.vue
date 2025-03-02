<template>
  <div class="ui container fluid">
    <div class="ui segment">
      <div class="ui grid">
        <div class="eight wide column">
          <h2 class="ui header">File Manager</h2>
        </div>
        <div class="eight wide column right aligned">
          <input
            type="file"
            ref="fileInput"
            @change="handleFileSelect"
            multiple
            class="hidden"
          >
          <button class="ui primary button" @click="triggerFileInput">
            <i class="upload icon"></i>Upload Files
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="ui active dimmer">
        <div class="ui loader"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="ui negative message">
        <i class="close icon" @click="error = null"></i>
        <div class="header">Error</div>
        <p>{{ error }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!files.length" class="ui placeholder segment">
        <div class="ui icon header">
          <i class="folder open outline icon"></i>
          No files yet
          <div class="sub header">Upload files to get started</div>
        </div>
      </div>

      <!-- Files Grid -->
      <div v-else class="ui four stackable cards">
        <div v-for="file in files" :key="file._id" class="ui card">
          <!-- Preview for images -->
          <div v-if="isImage(file)" class="image" style="height: 200px; background-color: #f9fafb;">
            <img :src="getFileUrl(file._id)" 
                 :alt="file.originalName"
                 style="height: 100%; width: 100%; object-fit: cover;">
            <div class="ui top right attached label" @click="openPreview(file)">
              <i class="expand arrows alternate icon"></i>
            </div>
          </div>
          <!-- Icon for other files -->
          <div v-else class="image" style="height: 200px; background-color: #f9fafb;">
            <i :class="getFileIcon(file)" style="font-size: 4em; margin-top: 60px;"></i>
          </div>
          
          <div class="content">
            <div class="header" :title="file.originalName" style="overflow: hidden; text-overflow: ellipsis;">
              {{ file.originalName }}
            </div>
            <div class="meta">
              Size: {{ formatSize(file.size) }}
            </div>
            <div class="meta">
              Modified: {{ formatDate(file.updatedAt) }}
            </div>
          </div>
          
          <div class="extra content">
            <div class="ui two buttons">
              <a :href="getFileUrl(file._id)" 
                 class="ui basic blue button" 
                 target="_blank" 
                 :download="file.originalName">
                <i class="download icon"></i>
              </a>
              <button class="ui basic red button" @click="confirmDelete(file)">
                <i class="trash icon"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div class="ui modal" ref="previewModal">
      <i class="close icon"></i>
      <div class="header">
        {{ selectedFile?.originalName }}
      </div>
      <div class="content">
        <div class="ui center aligned basic segment">
          <img v-if="selectedFile && isImage(selectedFile)" 
               :src="getFileUrl(selectedFile._id)" 
               class="ui fluid image" 
               :alt="selectedFile.originalName">
          <div v-else class="ui placeholder segment">
            <div class="ui icon header">
              <i :class="selectedFile ? getFileIcon(selectedFile) : ''"></i>
              Preview not available
            </div>
          </div>
        </div>
      </div>
      <div class="actions">
        <a v-if="selectedFile" 
           :href="getFileUrl(selectedFile._id)" 
           class="ui primary button" 
           target="_blank" 
           :download="selectedFile.originalName">
          Download
        </a>
        <div class="ui cancel button">Close</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { filesService } from '../services/files.service'
import type { IFile } from '../interfaces/file.interface'

declare const $: any // For Fomantic UI jQuery

defineOptions({
  name: 'FilesFomantic'
})

const files = ref<IFile[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<IFile | null>(null)
const previewModal = ref<HTMLElement | null>(null)

onMounted(async () => {
  loadFiles()
  // Initialize Fomantic UI modal
  if (previewModal.value) {
    $(previewModal.value).modal({
      closable: true
    })
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
  if (previewModal.value) {
    $(previewModal.value).modal('show')
  }
}

const getFileUrl = (id: string) => filesService.getFileViewUrl(id)
const getFileIcon = (file: IFile) => {
  const iconClass = filesService.getFileIconClass(file)
  // Convert Bootstrap icons to Fomantic UI icons
  return iconClass
    .replace('bi bi-file-image', 'file image outline icon')
    .replace('bi bi-file-pdf', 'file pdf outline icon')
    .replace('bi bi-file-earmark', 'file outline icon')
}
const formatSize = (size: number) => filesService.formatFileSize(size)
const isImage = (file: IFile) => {
  const ext = file.extension.toLowerCase().replace('.', '')
  return ['jpg', 'jpeg', 'png', 'gif'].includes(ext)
}
const formatDate = (date: string) => new Date(date).toLocaleDateString()
</script>
