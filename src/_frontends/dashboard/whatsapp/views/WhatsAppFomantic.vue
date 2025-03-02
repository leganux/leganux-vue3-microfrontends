<template>
  <div class="ui container fluid">
    <div class="ui segment">
      <h2 class="ui header">WhatsApp Integration</h2>
      
      <!-- Show QR Scanner if not connected -->
      <QRScanner v-if="!isConnected" @connected="checkConnection" />
      
      <!-- Show Chat Interface if connected -->
      <WhatsAppChat v-else />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import QRScanner from '../components/QRScanner.vue'
import WhatsAppChat from '../components/WhatsAppChat.vue'
import { WhatsAppService } from '../services/whatsapp.service'

const whatsappService = WhatsAppService.getInstance()
const isConnected = ref(false)

const checkConnection = async () => {
  try {
    isConnected.value = await whatsappService.getConnectionStatus()
  } catch (error) {
    console.error('Error checking connection:', error)
    isConnected.value = false
  }
}

onMounted(async () => {
  await checkConnection()
})

defineOptions({
  name: 'WhatsAppFomantic'
})
</script>
