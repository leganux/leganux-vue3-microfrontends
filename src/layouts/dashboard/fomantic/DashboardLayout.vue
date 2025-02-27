<template>
  <div class="dashboard-layout">
    <!-- Top Navigation -->
    <div class="ui top fixed menu">
      <div class="item">
        <button class="ui icon button custom-button" @click="toggleSidebar">
          <i class="bars icon"></i>
        </button>
      </div>
      <div class="item">
        <h3 class="ui header gradient-text">Admin Panel</h3>
      </div>
      <div class="item search-container">
        <div class="ui transparent icon input custom-search">
          <input type="text" placeholder="Search...">
          <i class="search icon"></i>
        </div>
      </div>
      <div class="right menu">
        <!-- Notifications -->
        <div class="ui dropdown item custom-dropdown" :class="{ active: showNotifications, visible: showNotifications }">
          <button class="ui icon button custom-button" @click="toggleNotifications">
            <i class="bell icon"></i>
            <div class="ui red circular floating label">3</div>
          </button>
          <div class="menu custom-menu" :class="{ visible: showNotifications, transition: showNotifications }">
            <div class="header">Notifications</div>
            <div class="scrolling menu">
              <div class="item notification-item">
                <div class="notification-icon blue">
                  <i class="user plus icon"></i>
                </div>
                <div class="content">
                  <div class="description">New user registered</div>
                  <div class="extra">5 minutes ago</div>
                </div>
              </div>
              <div class="item notification-item">
                <div class="notification-icon green">
                  <i class="shopping cart icon"></i>
                </div>
                <div class="content">
                  <div class="description">New order received</div>
                  <div class="extra">1 hour ago</div>
                </div>
              </div>
              <div class="item notification-item">
                <div class="notification-icon yellow">
                  <i class="mail icon"></i>
                </div>
                <div class="content">
                  <div class="description">New message received</div>
                  <div class="extra">3 hours ago</div>
                </div>
              </div>
            </div>
            <div class="ui divider"></div>
            <div class="header center aligned">
              <div class="view-all" @click="handleViewAllNotifications">View all notifications</div>
            </div>
          </div>
        </div>

        <!-- Profile -->
        <div class="ui dropdown item custom-dropdown" :class="{ active: showProfile, visible: showProfile }">
          <button class="ui icon button custom-button" @click="toggleProfile">
            <img class="ui avatar image" src="https://ui-avatars.com/api/?name=Admin+User">
          </button>
          <div class="menu custom-menu" :class="{ visible: showProfile, transition: showProfile }">
            <div class="item custom-item" @click="handleProfile">
              <i class="user icon"></i>
              <span>Profile</span>
            </div>
            <div class="item custom-item" @click="handleSettings">
              <i class="settings icon"></i>
              <span>Settings</span>
            </div>
            <div class="divider"></div>
            <div class="item custom-item" @click="handleLogout">
              <i class="sign out icon"></i>
              <span>Logout</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar -->
    <div 
      class="ui vertical sidebar menu left overlay visible custom-sidebar"
      :class="{ 'collapsed': !sidebarExpanded }"
    >
      <div class="item">
        <div class="menu">
          <router-link 
            v-for="item in menuItems" 
            :key="item.path"
            :to="item.path"
            class="item custom-nav-item"
            active-class="active"
          >
            <i :class="[item.icon, 'icon']"></i>
            <span>{{ item.label }}</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content" :class="{ 'expanded': !sidebarExpanded }">
      <div class="ui container">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { MicroFrontendConfig } from '@/_frontends/dashboard/user/config'

const router = useRouter()
const sidebarExpanded = ref(true)
const showNotifications = ref(false)
const showProfile = ref(false)
const menuItems = ref<{label: string, icon: string, path: string}[]>([])

// Function to load microfrontend configs
const loadMicrofrontendConfigs = async () => {
  try {
    // Get all modules from dashboard directory
    const modules = import.meta.glob<{ config: MicroFrontendConfig }>('@/_frontends/dashboard/*/config.ts', { eager: true })
    
    for (const path in modules) {
      const config = modules[path].config
      
      // Only add if it's a dashboard type and has navItem
      if (config.type === 'dashboard' && config.navItem && config.routes.length > 0) {
        menuItems.value.push({
          label: config.navItem.label,
          icon: config.navItem.icon || 'folder',
          path: config.routes[0].path // Use the first route as main path
        })
      }
    }
    
    // Sort by order if specified
    menuItems.value.sort((a, b) => {
      const orderA = (a as any).order || 0
      const orderB = (b as any).order || 0
      return orderA - orderB
    })
  } catch (error) {
    console.error('Error loading microfrontend configs:', error)
  }
}

onMounted(() => {
  loadMicrofrontendConfigs()
})

const toggleSidebar = () => {
  sidebarExpanded.value = !sidebarExpanded.value
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showProfile.value = false
}

const toggleProfile = () => {
  showProfile.value = !showProfile.value
  showNotifications.value = false
}

const handleProfile = () => {
  showProfile.value = false
  // Add profile navigation logic here
  console.log('Profile clicked')
}

const handleSettings = () => {
  showProfile.value = false
  // Add settings navigation logic here
  console.log('Settings clicked')
}

const handleLogout = () => {
  showProfile.value = false
  // Add logout logic here
  console.log('Logout clicked')
}

const handleViewAllNotifications = () => {
  showNotifications.value = false
  // Add view all notifications logic here
  console.log('View all notifications clicked')
}
</script>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

/* Navbar Styles */
.ui.top.menu {
  height: 70px !important;
  margin: 0;
  border: none !important;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
}

.gradient-text {
  background: linear-gradient(45deg, #4A90E2, #63B3ED);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700 !important;
  font-size: 1.4rem !important;
}

.custom-button {
  width: 40px !important;
  height: 40px !important;
  border-radius: 12px !important;
  background: transparent !important;
  color: #4A90E2 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.3s ease !important;
  padding: 0 !important;
  border: none !important;
}

.custom-button:hover {
  background: rgba(74, 144, 226, 0.1) !important;
}

/* Search Input */
.search-container {
  flex: 1;
  max-width: 500px;
  margin: 0 2rem !important;
}

.custom-search {
  width: 100% !important;
}

.custom-search input {
  background: rgba(248, 249, 250, 0.8) !important;
  border: none !important;
  border-radius: 15px !important;
  padding: 0.8rem 1rem 0.8rem 3rem !important;
  width: 100% !important;
  transition: all 0.3s ease !important;
}

.custom-search input:focus {
  background: #ffffff !important;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.1) !important;
}

.custom-search i.icon {
  left: 1rem !important;
  color: #6C757D !important;
}

/* Dropdown Menus */
.custom-menu {
  border-radius: 16px !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
  border: none !important;
  padding: 1rem !important;
  min-width: 280px !important;
  max-width: 320px !important;
  margin-top: 0.5rem !important;
  right: 0 !important;
  left: auto !important;
}

.custom-menu .scrolling.menu {
  max-height: 300px !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
}

.notification-item .content {
  flex: 1;
  min-width: 0;
  word-wrap: break-word;
}

.notification-item .description {
  white-space: normal !important;
  line-height: 1.4 !important;
}

.custom-menu .header {
  font-weight: 600 !important;
  color: #343A40 !important;
  padding: 0.5rem 1rem !important;
}

.notification-item {
  display: flex !important;
  align-items: center !important;
  padding: 1rem !important;
  border-radius: 12px !important;
  transition: all 0.3s ease !important;
}

.notification-item:hover {
  background: rgba(248, 249, 250, 0.8) !important;
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.notification-icon.blue {
  background: rgba(74, 144, 226, 0.1);
  color: #4A90E2;
}

.notification-icon.green {
  background: rgba(40, 167, 69, 0.1);
  color: #28A745;
}

.notification-icon.yellow {
  background: rgba(255, 193, 7, 0.1);
  color: #FFC107;
}

.custom-item {
  display: flex !important;
  align-items: center !important;
  padding: 0.75rem 1rem !important;
  border-radius: 12px !important;
  transition: all 0.3s ease !important;
}

.custom-item:hover {
  background: rgba(74, 144, 226, 0.05) !important;
  color: #4A90E2 !important;
}

.custom-item i.icon {
  margin-right: 0.75rem !important;
  font-size: 1.1rem !important;
}

/* Sidebar */
.custom-sidebar {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  border: none !important;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.02) !important;
  top: 70px !important;
  width: 280px !important;
  padding: 1.5rem 1rem !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.custom-sidebar.collapsed {
  transform: translateX(-100%) !important;
}

.custom-nav-item {
  display: flex !important;
  align-items: center !important;
  padding: 0.875rem 1.25rem !important;
  color: #6C757D !important;
  border-radius: 12px !important;
  transition: all 0.3s ease !important;
  margin: 0.25rem 0 !important;
  font-weight: 500 !important;
}

.custom-nav-item:hover {
  background: rgba(74, 144, 226, 0.05) !important;
  color: #4A90E2 !important;
}

.custom-nav-item.active {
  background: #4A90E2 !important;
  color: white !important;
}

.custom-nav-item i.icon {
  margin-right: 1rem !important;
  font-size: 1.25rem !important;
}

.custom-nav-item.active i.icon {
  color: white !important;
}

/* Main Content */
.main-content {
  margin-left: 280px;
  margin-top: 70px;
  padding: 2rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-content.expanded {
  margin-left: 0;
}

/* Responsive */
@media only screen and (max-width: 768px) {
  .custom-sidebar {
    transform: translateX(-100%);
  }
  
  .custom-sidebar.collapsed {
    transform: translateX(0);
  }
  
  .main-content {
    margin-left: 0;
  }
  
  .search-container {
    display: none !important;
  }
}

/* Animations */
.ui.dropdown .menu {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
