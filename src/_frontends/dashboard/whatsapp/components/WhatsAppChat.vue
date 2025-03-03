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
              <!-- Text content -->
              <div v-if="message.content && !isMediaMessage(message)">{{ message.content }}</div>
              
              <!-- Media Content -->
              <div v-if="message.file" class="media-content">
                <!-- Image -->
                <div v-if="message.type === 'image' || (message.file.mimeType && message.file.mimeType.startsWith('image/'))">
                  <img :src="getMediaUrl(message.file._id)" class="img-fluid mt-2" alt="Image" />
                  <div v-if="message.content" class="media-caption">{{ message.content }}</div>
                  <div class="file-info">
                    <small>{{ formatFileSize(message.file.size) }} - {{ message.file.originalName }}</small>
                  </div>
                </div>

                <!-- Video -->
                <div v-if="message.type === 'video' || (message.file.mimeType && message.file.mimeType.startsWith('video/'))">
                  <video controls class="img-fluid mt-2">
                    <source :src="getMediaUrl(message.file._id)" type="video/mp4">
                    Your browser does not support the video tag.
                  </video>
                  <div v-if="message.content" class="media-caption">{{ message.content }}</div>
                  <div class="file-info">
                    <small>{{ formatFileSize(message.file.size) }} - {{ message.file.originalName }}</small>
                  </div>
                </div>

                <!-- Audio -->
                <div v-if="message.type === 'audio' || (message.file.mimeType && message.file.mimeType.startsWith('audio/'))">
                  <audio controls class="mt-2 w-100">
                    <source :src="getMediaUrl(message.file._id)" type="audio/mpeg">
                    Your browser does not support the audio element.
                  </audio>
                  <div class="file-info">
                    <small>{{ formatFileSize(message.file.size) }} - {{ message.file.originalName }}</small>
                  </div>
                </div>

                <!-- Sticker -->
                <div v-if="message.type === 'sticker' || (message.file.mimeType && message.file.mimeType === 'image/webp')">
                  <img :src="getMediaUrl(message.file._id)" class="sticker mt-2" alt="Sticker" />
                </div>
              </div>
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
              @keyup.enter="sendTextMessage"
            />
            <input
              type="file"
              ref="fileInput"
              class="d-none"
              @change="handleFileSelected"
              accept="image/*,video/*,audio/*"
            />
            <button class="btn btn-outline-secondary" @click="openFileInput">
              <i class="bi bi-paperclip"></i>
            </button>
            <button class="btn btn-primary" @click="sendTextMessage">
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

const whatsappService = WhatsAppService.getInstance()
const chats = ref<WhatsAppChat[]>([])
const selectedChat = ref<WhatsAppChat | null>(null)
const newMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const isEditingName = ref(false)
const editedName = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
let pollingInterval: NodeJS.Timeout | null = null

const formatPhoneNumber = (jid: string): string => {
  return jid // No need to format since backend handles it
}

const isMediaMessage = (message: WhatsAppMessage): boolean => {
  return Boolean(
    message.type === 'image' || 
    message.type === 'video' || 
    message.type === 'audio' || 
    message.type === 'sticker' ||
    message.file
  );
}

const getMediaUrl = (fileId: string): string => {
  return whatsappService.getMediaUrl(fileId);
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

const openFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelected = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  const chat = selectedChat.value
  if (!chat) return

  try {
    let type: 'image' | 'video' | 'audio'
    if (file.type.startsWith('image/')) type = 'image'
    else if (file.type.startsWith('video/')) type = 'video'
    else if (file.type.startsWith('audio/')) type = 'audio'
    else {
      console.error('Unsupported file type')
      return
    }

    // Create FormData to send file
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    formData.append('to', chat.jid)
    formData.append('content', newMessage.value || '') // Optional caption

    const message = await whatsappService.sendMediaMessage({
      to: chat.jid,
      file: formData,
      type,
      message: newMessage.value
    })

    const updatedChat = { ...chat }
    if (!updatedChat.messages) {
      updatedChat.messages = []
    }
    updatedChat.messages.push({
      ...message,
      from: 'me',
      content: message.content || ''
    })
    selectedChat.value = updatedChat
    
    newMessage.value = ''
    await nextTick()
    scrollToBottom()
  } catch (error) {
    console.error('Error sending media:', error)
  }

  // Reset file input
  input.value = ''
}

const sendTextMessage = async () => {
  const chat = selectedChat.value
  if (!chat || !newMessage.value.trim()) return

  try {
    const message = await whatsappService.sendMessage({
      to: chat.jid,
      message: newMessage.value.trim(),
      type: 'text'
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

const checkForUpdates = async () => {
  try {
    const updatedChats = await whatsappService.getChats()
    chats.value = updatedChats

    // Update current chat messages if one is selected
    if (selectedChat.value) {
      const messages = await whatsappService.getChatMessages(selectedChat.value.jid)
      const currentMessagesCount = selectedChat.value.messages?.length || 0
      
      // Update the selected chat with latest data from chats list
      const updatedChatData = updatedChats.find(c => c.jid === selectedChat.value?.jid)
      if (updatedChatData) {
        const shouldScroll = messages.length > currentMessagesCount
        
        selectedChat.value = {
          ...updatedChatData,
          messages,
          name: updatedChatData.name || selectedChat.value.name
        }
        
        if (shouldScroll) {
          await nextTick()
          scrollToBottom()
        }
      }
    }
  } catch (error) {
    console.error('Error updating chats:', error)
  }
}

const startPolling = () => {
  pollingInterval = setInterval(async () => {
    try {
      // Check status first
      const status = await whatsappService.getConnectionStatus()
      
      // If we have new messages, update everything
      if (status.hasNewMessages) {
        await checkForUpdates()
      }
    } catch (error) {
      console.error('Error in polling:', error)
    }
  }, 1000) // Poll every second for more responsive updates
}

onMounted(async () => {
  await loadChats() // Initial load
  await checkForUpdates() // Initial update
  startPolling() // Start polling for updates
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

.sticker {
  max-width: 150px;
  height: auto;
}

.media-caption {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.file-info {
  font-size: 0.8rem;
  color: #888;
  margin-top: 0.25rem;
}

.media-content {
  margin-top: 0.5rem;
}

audio {
  max-width: 300px;
}

video {
  max-width: 300px;
  border-radius: 0.25rem;
}
</style>
