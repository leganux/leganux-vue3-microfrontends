<template>
  <div class="qr-container text-center p-4">
    <div v-if="!connected">
      <h3>Scan QR Code to Connect WhatsApp</h3>
      <div v-if="qrCode" class="qr-code mt-4">
        <img :src="qrCode" alt="WhatsApp QR Code" class="img-fluid" />
      </div>
      <div v-else class="spinner-border text-primary mt-4" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3">Open WhatsApp on your phone and scan the QR code</p>
        <a  href="http://localhost:3000/api/v1/whatsapp/qr" target="_blank" class="btn btn-primary">Scan QR Code here</a>
    </div>
    <div v-else class="connected-status">
      <div class="alert alert-success" role="alert">
        <i class="bi bi-check-circle-fill me-2"></i>
        WhatsApp Connected Successfully!
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { WhatsAppService } from '../services/whatsapp.service'
import type { WhatsAppStatus } from '../interface/whatsapp.interface'
import * as QRCode from 'qrcode'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const whatsappService = WhatsAppService.getInstance()
const qrCode = ref<string>('')
const connected = ref<boolean>(false)
let pollingInterval: NodeJS.Timeout | null = null

const checkStatus = async () => {
  try {
    const response = await whatsappService.getConnectionStatus()
    connected.value = response.connected

    // If not connected, try to get QR code
    if (!connected.value) {
      const qrResponse = await whatsappService.getQRCode()
      qrCode.value = qrResponse.qr
    } else {
      qrCode.value = ''
      emit('connected')
    }
  } catch (error) {
    console.error('Error checking status:', error)
  }
}

const startPolling = () => {
  if (pollingInterval) return
  checkStatus() // Check immediately
  pollingInterval = setInterval(checkStatus, 2000) // Poll every 2 seconds
}

const stopPolling = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
}

onMounted(async () => {
  await checkStatus()
  startPolling()
})

onUnmounted(() => {
  stopPolling()
})

const emit = defineEmits<{
  (e: 'connected'): void
}>()

defineOptions({
  name: 'QRScanner'
})
</script>

<style scoped>
.qr-container {
  max-width: 500px;
  margin: 0 auto;
}

.qr-code img {
  max-width: 300px;
}

.connected-status {
  margin-top: 2rem;
}
</style>
