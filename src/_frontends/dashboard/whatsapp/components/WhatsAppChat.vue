<template>
  <div class="chat-container">
    <!-- Chat List -->
    <div class="chat-list">
      <div class="chat-list-header p-3 border-bottom">
        <h4 class="mb-0">Conversations</h4>
      </div>
      <div class="chat-list-content">
        <div
          v-for="chat in chats"
          :key="chat.jid"
          class="chat-item p-3 border-bottom"
          :class="{ 'active': selectedChat?.jid === chat.jid }"
          @click="selectChat(chat)"
        >
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="mb-1">{{ chat.name || formatPhoneNumber(chat.jid) }}</h5>
            <small class="text-muted">
              {{ formatTimestamp(chat.lastMessageTimestamp) }}
            </small>
          </div>
          <p class="mb-1 text-truncate" v-if="chat.messages?.[0]">
            {{ chat.messages[0].content }}
          </p>
          <span v-if="chat.unreadCount" class="badge bg-primary rounded-pill">
            {{ chat.unreadCount }}
          </span>
        </div>
      </div>
    </div>

    <!-- Chat Messages -->
    <div class="chat-messages">
      <div v-if="selectedChat" class="h-100 d-flex flex-column">
        <div class="chat-header p-3 border-bottom">
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
              <h4 class="mb-0" v-if="!isEditingName">{{ selectedChat.name || formatPhoneNumber(selectedChat.jid) }}</h4>
              <input
                v-else
                v-model="editedName"
                type="text"
                class="form-control"
                @keyup.enter="saveChatName"
                @blur="saveChatName"
              />
            </div>
            <button class="btn btn-link" @click="startEditName">
              <i class="bi bi-pencil"></i>
            </button>
          </div>
        </div>
        
        <div class="messages-content flex-grow-1" ref="messagesContainer">
          <div v-for="message in selectedChat.messages" :key="message.messageId" 
               class="message p-2 m-2 rounded"
               :class="{ 'sent': message.from === 'me', 'received': message.from !== 'me' }">
            <div class="message-content">
              {{ message.content }}
              <img v-if="message.mediaUrl" :src="message.mediaUrl" class="img-fluid mt-2" />
            </div>
            <small class="message-time">
              {{ formatTimestamp(message.timestamp) }}
            </small>
          </div>
        </div>

        <div class="message-input p-3 border-top">
          <div class="input-group">
            <input
              v-model="newMessage"
              type="text"
              class="form-control"
              placeholder="Type a message..."
              @keyup.enter="sendMessage"
            />
            <button class="btn btn-primary" @click="sendMessage">
              <i class="bi bi-send"></i>
            </button>
          </div>
        </div>
      </div>
      <div v-else class="h-100 d-flex align-items-center justify-content-center">
        <p class="text-muted">Select a chat to start messaging</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { WhatsAppService } from '../services/whatsapp.service'
import type { WhatsAppChat, WhatsAppMessage } from '../interface/whatsapp.interface'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const whatsappService = WhatsAppService.getInstance()
const chats = ref<WhatsAppChat[]>([])
const selectedChat = ref<WhatsAppChat | null>(null)
const newMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const isEditingName = ref(false)
const editedName = ref('')
let pollingInterval: NodeJS.Timeout | null = null

const formatPhoneNumber = (jid: string): string => {
  return jid.replace('@s.whatsapp.net', '')
}

const startEditName = () => {
  if (selectedChat.value) {
    editedName.value = selectedChat.value.name || formatPhoneNumber(selectedChat.value.jid)
    isEditingName.value = true
  }
}

const saveChatName = async () => {
  if (selectedChat.value && editedName.value.trim()) {
    try {
      await whatsappService.updateChatName(selectedChat.value.jid, editedName.value.trim())
      selectedChat.value = {
        ...selectedChat.value,
        name: editedName.value.trim()
      }
      isEditingName.value = false
      await loadChats()
    } catch (error) {
      console.error('Error updating chat name:', error)
    }
  }
  isEditingName.value = false
}

const loadChats = async () => {
  try {
    chats.value = await whatsappService.getChats()
  } catch (error) {
    console.error('Error loading chats:', error)
  }
}

const selectChat = async (chat: WhatsAppChat) => {
  try {
    const messages = await whatsappService.getChatMessages(chat.jid)
    selectedChat.value = { ...chat, messages }
    await nextTick()
    scrollToBottom()
  } catch (error) {
    console.error('Error loading chat messages:', error)
  }
}

const sendMessage = async () => {
  const chat = selectedChat.value
  if (!chat || !newMessage.value.trim()) return

  try {
    const message = await whatsappService.sendMessage({
      to: chat.jid,
      message: newMessage.value.trim()
    })

    const updatedChat = { ...chat }
    if (!updatedChat.messages) {
      updatedChat.messages = []
    }
    updatedChat.messages.push({
      ...message,
      from: 'me'
    })
    selectedChat.value = updatedChat
    
    newMessage.value = ''
    await nextTick()
    scrollToBottom()
  } catch (error) {
    console.error('Error sending message:', error)
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const startPolling = () => {
  pollingInterval = setInterval(async () => {
    // Update chats list
    await loadChats()

    // Update current chat messages if one is selected
    if (selectedChat.value) {
      const messages = await whatsappService.getChatMessages(selectedChat.value.jid)
      if (messages.length !== selectedChat.value.messages?.length) {
        selectedChat.value = { ...selectedChat.value, messages }
        await nextTick()
        scrollToBottom()
      }
    }
  }, 3000) // Poll every 3 seconds
}

onMounted(async () => {
  await loadChats()
  startPolling()
})

onUnmounted(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval)
  }
})

defineOptions({
  name: 'WhatsAppChat'
})
</script>

<style scoped>
.chat-container {
  display: grid;
  grid-template-columns: 350px 1fr;
  height: calc(100vh - 200px);
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
}

.chat-list {
  border-right: 1px solid #dee2e6;
  display: flex;
  flex-direction: column;
}

.chat-list-content {
  overflow-y: auto;
  flex-grow: 1;
}

.chat-item {
  cursor: pointer;
  transition: background-color 0.2s;
}

.chat-item:hover {
  background-color: #f8f9fa;
}

.chat-item.active {
  background-color: #e9ecef;
}

.chat-messages {
  display: flex;
  flex-direction: column;
}

.messages-content {
  overflow-y: auto;
  padding: 1rem;
  background-color: #f8f9fa;
}

.message {
  max-width: 70%;
  margin-bottom: 1rem;
}

.message.sent {
  margin-left: auto;
  background-color: #dcf8c6;
}

.message.received {
  margin-right: auto;
  background-color: white;
}

.message-time {
  display: block;
  font-size: 0.75rem;
  color: #6c757d;
  text-align: right;
  margin-top: 0.25rem;
}

.message-input {
  background-color: white;
}

.img-fluid {
  max-width: 100%;
  height: auto;
  border-radius: 0.25rem;
}
</style>
