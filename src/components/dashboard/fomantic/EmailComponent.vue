<template>
  <div class="ui container fluid">
    <div class="ui segment">
      <h3 class="ui header">Send Email</h3>
      
      <form class="ui form" @submit.prevent="sendEmail">
        <div class="field">
          <label>To:</label>
          <div class="ui input">
            <input 
              type="email" 
              v-model="emailData.to" 
              required
              placeholder="recipient@example.com"
            >
          </div>
        </div>
        
        <div class="field">
          <label>Subject:</label>
          <div class="ui input">
            <input 
              type="text" 
              v-model="emailData.subject" 
              required
              placeholder="Email subject"
            >
          </div>
        </div>

        <div class="field">
          <label>Content:</label>
          <CkeditorComponent v-model="emailData.content" />
        </div>

        <button 
          class="ui primary button" 
          type="submit"
          :class="{ loading: loading, disabled: loading }"
        >
          {{ loading ? 'Sending...' : 'Send Email' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import CkeditorComponent from '../../../components/common/CkeditorComponet.vue'
import { emailService } from '../../../services/email.service'
import type { EmailRequest } from '../../../services/email.service'

defineOptions({
  name: 'EmailComponent'
})

const loading = ref(false)

const emailData = ref<EmailRequest>({
  to: '',
  subject: '',
  content: ''
})

const sendEmail = async () => {
  try {
    loading.value = true
    const response = await emailService.sendEmail(emailData.value)
    
    if (response.success) {
      alert('Email sent successfully!')
      // Reset form
      emailData.value = {
        to: '',
        subject: '',
        content: ''
      }
    } else {
      throw new Error(response.message || 'Failed to send email')
    }
  } catch (error) {
    alert(error instanceof Error ? error.message : 'Failed to send email')
  } finally {
    loading.value = false
  }
}
</script>
