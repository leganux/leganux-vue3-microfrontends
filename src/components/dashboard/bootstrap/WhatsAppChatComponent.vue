<template>
  <div class="whatsapp-container">
    <!-- Chat List -->
    <div class="chat-list">
      <div class="chat-list-header">
        <div class="d-flex justify-content-between align-items-center p-3">
          <div class="d-flex align-items-center">
            <div class="profile-avatar">
              <i class="bi bi-person-circle fs-4"></i>
            </div>
          </div>
          <div>
            <i class="bi bi-three-dots-vertical"></i>
          </div>
        </div>
        <div class="search-box px-3 pb-2">
          <div class="input-group">
            <span class="input-group-text bg-light border-0">
              <i class="bi bi-search"></i>
            </span>
            <input type="text" class="form-control border-0 bg-light" placeholder="Search or start new chat">
          </div>
        </div>
      </div>
      <div class="chat-list-content">
        <div
          v-for="chat in chats"
          :key="chat.jid"
          class="chat-item"
          :class="{ 'active': selectedChat?.jid === chat.jid }"
          @click="selectChat(chat)"
        >
          <div class="chat-item-avatar">
            <i class="bi bi-person-circle"></i>
          </div>
          <div class="chat-item-content">
            <div class="chat-item-header">
              <h6 class="mb-0">{{ chat.name || formatPhoneNumber(chat.jid) }}</h6>
              <small class="text-muted">{{ formatTimestamp(chat.lastMessageTimestamp) }}</small>
            </div>
            <p class="chat-item-message mb-0" v-if="chat.messages?.[0]">
              {{ chat.messages[0].content }}
            </p>
            <span v-if="chat.unreadCount" class="badge bg-success rounded-pill">
              {{ chat.unreadCount }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Messages -->
    <div class="chat-messages">
      <div v-if="selectedChat" class="h-100 d-flex flex-column">
        <div class="chat-header">
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
              <div class="chat-avatar me-2">
                <i class="bi bi-person-circle"></i>
              </div>
              <div>
                <h6 class="mb-0" v-if="!isEditingName">
                  {{ selectedChat.name || formatPhoneNumber(selectedChat.jid) }}
                </h6>
                <input
                  v-else
                  v-model="editedName"
                  type="text"
                  class="form-control form-control-sm"
                  @keyup.enter="saveChatName"
                  @blur="saveChatName"
                />
                <small class="text-muted">online</small>
              </div>
            </div>
            <div class="chat-actions">
              <button class="btn btn-link text-dark" @click="startEditName">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-link text-dark">
                <i class="bi bi-three-dots-vertical"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div class="messages-content" ref="messagesContainer">
          <div v-for="message in selectedChat.messages" :key="message.messageId" 
               class="message"
               :class="{ 'sent': message.from === 'me', 'received': message.from !== 'me' }">
            <div class="message-bubble">
              <!-- Text content -->
              <div v-if="message.content && !isMediaMessage(message)" class="message-text">
                {{ message.content }}
              </div>
              
              <!-- Media Content -->
              <div v-if="message.file" class="media-content">
                <!-- Image -->
                <div v-if="message.type === 'image' || message.content === 'Image' || (message.file.mimeType && message.file.mimeType.startsWith('image/'))">
                  <img :src="getMediaUrl(message.file._id)" class="img-fluid rounded" alt="Image" />
                  <div v-if="message.content" class="media-caption">{{ message.content }}</div>
                  <div class="file-info">
                    <small>{{ formatFileSize(message.file.size) }} - {{ message.file.originalName }}</small>
                  </div>
                </div>

                <!-- Video -->
                <div v-if="message.type === 'video' || message.content === 'Video' || (message.file.mimeType && message.file.mimeType.startsWith('video/'))">
                  <video controls class="rounded">
                    <source :src="getMediaUrl(message.file._id)" type="video/mp4">
                    Your browser does not support the video tag.
                  </video>
                  <div v-if="message.content" class="media-caption">{{ message.content }}</div>
                  <div class="file-info">
                    <small>{{ formatFileSize(message.file.size) }} - {{ message.file.originalName }}</small>
                  </div>
                </div>

                <!-- Audio -->
                <div v-if="message.type === 'audio' || message.content === 'Audio' || (message.file.mimeType && message.file.mimeType.startsWith('audio/'))">
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
                  <img :src="getMediaUrl(message.file._id)" class="sticker" alt="Sticker" />
                </div>
              </div>
              <div class="message-time">
                {{ formatTimestamp(message.timestamp) }}
                <i class="bi bi-check2-all text-primary ms-1" v-if="message.from === 'me'"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="message-input">
          <div class="input-group">
            <button class="btn btn-link text-dark">
              <i class="bi bi-emoji-smile"></i>
            </button>
            <input
              v-model="newMessage"
              type="text"
              class="form-control border-0"
              placeholder="Type a message"
              @keyup.enter="sendTextMessage"
            />
            <input
              type="file"
              ref="fileInput"
              class="d-none"
              @change="handleFileSelected"
              accept="image/*,video/*,audio/*"
            />
            <button class="btn btn-link text-dark" @click="openFileInput">
              <i class="bi bi-paperclip"></i>
            </button>
            <button class="btn btn-link text-dark" @click="sendTextMessage">
              <i class="bi bi-send"></i>
            </button>
          </div>
        </div>
      </div>
      <div v-else class="h-100 d-flex align-items-center justify-content-center whatsapp-background">
        <div class="text-center text-muted">
          <i class="bi bi-whatsapp display-1"></i>
          <p class="mt-3">Select a chat to start messaging</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { WhatsAppService } from '../../../_frontends/dashboard/whatsapp/services/whatsapp.service'
import type { WhatsAppChat, WhatsAppMessage } from '../../../_frontends/dashboard/whatsapp/interface/whatsapp.interface'

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
  return jid
}

const isMediaMessage = (message: WhatsAppMessage): boolean => {
  return Boolean(
    message.type === 'image' || 
    message.type === 'video' || 
    message.type === 'audio' || 
    message.type === 'sticker' ||
    message.file
  )
}

const getMediaUrl = (fileId: string): string => {
  return whatsappService.getMediaUrl(fileId)
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
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

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    formData.append('to', chat.jid)
    formData.append('content', newMessage.value || '')

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

    if (selectedChat.value) {
      const messages = await whatsappService.getChatMessages(selectedChat.value.jid)
      const currentMessagesCount = selectedChat.value.messages?.length || 0
      
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
      const status = await whatsappService.getConnectionStatus()
      
      if (status.hasNewMessages) {
        await checkForUpdates()
      }
    } catch (error) {
      console.error('Error in polling:', error)
    }
  }, 5000)
}

onMounted(async () => {
  await loadChats()
  await checkForUpdates()
  startPolling()
})

onUnmounted(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval)
  }
})

defineOptions({
  name: 'WhatsAppChatComponent'
})
</script>

<style scoped>
.whatsapp-container {
  display: grid;
  grid-template-columns: 350px 1fr;
  height: calc(100vh - 200px);
  background: #f0f2f5;
  border-radius: 0.25rem;
  overflow: hidden;
}

.chat-list {
  background: white;
  border-right: 1px solid #e9edef;
  display: flex;
  flex-direction: column;
}

.chat-list-header {
  background: #f0f2f5;
  border-bottom: 1px solid #e9edef;
}

.chat-list-content {
  overflow-y: auto;
  flex-grow: 1;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid #e9edef;
  transition: background-color 0.2s;
}

.chat-item:hover {
  background-color: #f5f6f6;
}

.chat-item.active {
  background-color: #f0f2f5;
}

.chat-item-avatar {
  width: 49px;
  height: 49px;
  border-radius: 50%;
  background: #e9edef;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  flex-shrink: 0;
}

.chat-item-content {
  flex-grow: 1;
  min-width: 0;
}

.chat-item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.chat-item-message {
  color: #667781;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-messages {
  background: #efeae2;
  position: relative;
}

.chat-header {
  background: #f0f2f5;
  padding: 0.625rem 1rem;
  border-bottom: 1px solid #e9edef;
}

.chat-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e9edef;
  display: flex;
  align-items: center;
  justify-content: center;
}

.messages-content {
  overflow-y: auto;
  padding: 1rem;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=');
  flex-grow: 1;
  height: calc(100vh - 400px);
  min-height: 300px;
}

.message {
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
}

.message.sent {
  align-items: flex-end;
}

.message.received {
  align-items: flex-start;
}

.message-bubble {
  max-width: 65%;
  padding: 0.5rem 0.75rem;
  border-radius: 7.5px;
  position: relative;
}

.message.sent .message-bubble {
  background: #d9fdd3;
}

.message.received .message-bubble {
  background: white;
}

.message-text {
  margin-right: 4rem;
  white-space: pre-wrap;
}

.message-time {
  font-size: 0.75rem;
  color: #667781;
  margin-top: 0.25rem;
  float: right;
}

.message-input {
  background: #f0f2f5;
  padding: 0.625rem;
  border-top: 1px solid #e9edef;
}

.message-input .form-control {
  background: white;
  border-radius: 8px;
}

.message-input .btn-link {
  color: #54656f;
  padding: 0.375rem 0.75rem;
}

.img-fluid {
  max-width: 100%;
  height: auto;
}

.sticker {
  max-width: 150px;
  height: auto;
}

.media-caption {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #667781;
}

.file-info {
  font-size: 0.75rem;
  color: #667781;
  margin-top: 0.25rem;
}

.media-content {
  margin-top: 0.5rem;
}

audio {
  max-width: 250px;
}

video {
  max-width: 250px;
}

.whatsapp-background {
  background-color: #f0f2f5;
}

.profile-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e9edef;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-box .input-group {
  background: #f0f2f5;
  border-radius: 8px;
  overflow: hidden;
}
</style>
