<template>
  <div class="container-fluid p-4">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h2 class="card-title mb-4">WhatsApp Integration</h2>
            
            <!-- Show QR Scanner if not connected -->
            <QRScanner v-if="!isConnected" @connected="checkConnection" />
            
            <!-- Show Chat Interface if connected -->
            <WhatsAppChat v-else />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import QRScanner from '../components/QRScanner.vue'
import WhatsAppChat from '../../../../components/dashboard/bootstrap/WhatsAppChatComponent.vue'
import { WhatsAppService } from '../services/whatsapp.service'

const whatsappService = WhatsAppService.getInstance()
const isConnected = ref(false)

const checkConnection = async () => {
  try {
    const status = await whatsappService.getConnectionStatus()
    isConnected.value = status.connected
  } catch (error) {
    console.error('Error checking connection:', error)
    isConnected.value = false
  }
}

onMounted(async () => {
  await checkConnection()
})

defineOptions({
  name: 'WhatsAppBootstrap'
})
</script>
