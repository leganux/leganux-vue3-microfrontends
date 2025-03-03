<template>
  <div class="container-fluid">
    <div class="card">
      <div class="card-header">
        <h4>Send Email</h4>
      </div>
      <div class="card-body">
        <form @submit.prevent="sendEmail">
          <div class="mb-3">
            <label for="emailTo" class="form-label">To:</label>
            <input 
              type="email" 
              class="form-control" 
              id="emailTo" 
              v-model="emailData.to" 
              required
              placeholder="recipient@example.com"
            >
          </div>
          
          <div class="mb-3">
            <label for="subject" class="form-label">Subject:</label>
            <input 
              type="text" 
              class="form-control" 
              id="subject" 
              v-model="emailData.subject" 
              required
              placeholder="Email subject"
            >
          </div>

          <div class="mb-3">
            <label class="form-label">Content:</label>
            <CkeditorComponent v-model="emailData.content" />
          </div>

          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
            {{ loading ? 'Sending...' : 'Send Email' }}
          </button>
        </form>
      </div>
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
