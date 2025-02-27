<template>
  <div class="dashboard-layout">
    <!-- Top Navigation -->
    <nav class="navbar navbar-expand-lg fixed-top">
      <div class="container-fluid px-4">
        <!-- Toggle Button -->
        <button 
          class="btn btn-icon" 
          @click="toggleSidebar"
        >
          <i class="bi bi-list fs-4"></i>
        </button>

        <!-- Brand -->
        <a class="navbar-brand" href="#">
          <span class="brand-text">Admin Panel</span>
        </a>

        <!-- Search -->
        <div class="search-wrapper">
          <div class="search-input">
            <i class="bi bi-search"></i>
            <input 
              type="text" 
              placeholder="Search..."
            >
          </div>
        </div>

        <!-- Right Navigation -->
        <div class="navbar-right">
          <!-- Notifications -->
          <div class="nav-item">
            <button class="btn btn-icon" @click="toggleNotifications">
              <i class="bi bi-bell"></i>
              <span class="notification-badge">3</span>
            </button>
            <!-- Notifications Dropdown -->
            <div class="dropdown-panel notifications-panel" :class="{ show: showNotifications }">
              <div class="dropdown-header">
                <h6>Notifications</h6>
              </div>
              <div class="notification-list">
                <a href="#" class="notification-item">
                  <div class="notification-icon">
                    <i class="bi bi-person-plus"></i>
                  </div>
                  <div class="notification-content">
                    <p>New user registered</p>
                    <span>5 minutes ago</span>
                  </div>
                </a>
                <a href="#" class="notification-item">
                  <div class="notification-icon success">
                    <i class="bi bi-cart-check"></i>
                  </div>
                  <div class="notification-content">
                    <p>New order received</p>
                    <span>1 hour ago</span>
                  </div>
                </a>
                <a href="#" class="notification-item">
                  <div class="notification-icon warning">
                    <i class="bi bi-envelope"></i>
                  </div>
                  <div class="notification-content">
                    <p>New message received</p>
                    <span>3 hours ago</span>
                  </div>
                </a>
              </div>
              <div class="dropdown-footer">
                <a href="#">View all notifications</a>
              </div>
            </div>
          </div>

          <!-- Profile -->
          <div class="nav-item">
            <button class="btn btn-icon profile-button" @click="toggleProfile">
              <img 
                src="https://ui-avatars.com/api/?name=Admin+User" 
                class="profile-image" 
                alt="profile"
              >
            </button>
            <div class="dropdown-panel profile-panel" :class="{ show: showProfile }">
              <a class="dropdown-item" href="#">
                <i class="bi bi-person"></i>
                <span>Profile</span>
              </a>
              <a class="dropdown-item" href="#">
                <i class="bi bi-gear"></i>
                <span>Settings</span>
              </a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="#">
                <i class="bi bi-box-arrow-right"></i>
                <span>Logout</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Sidebar -->
    <div 
      class="sidebar" 
      :class="{ 'sidebar-collapsed': !sidebarExpanded }"
    >
      <div class="sidebar-sticky">
        <ul class="nav flex-column">
          <li class="nav-item" v-for="item in menuItems" :key="item.path">
            <router-link 
              :to="item.path"
              class="nav-link"
              active-class="active"
            >
              <i :class="['bi', `bi-${item.icon}`]"></i>
              {{ item.label }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>

    <!-- Main Content -->
    <main class="main-content" :class="{ 'expanded': !sidebarExpanded }">
      <div class="container-fluid">
        <slot></slot>
      </div>
    </main>
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
</script>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
  background: linear-gradient(to right, #f8f9fa, #ffffff);
}

/* Navbar Styles */
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  height: 70px;
  z-index: 1030;
  border: none;
}

.btn-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #4A90E2;
  transition: all 0.3s ease;
}

.btn-icon:hover {
  background: rgba(74, 144, 226, 0.1);
}

.brand-text {
  background: linear-gradient(45deg, #4A90E2, #63B3ED);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  font-size: 1.4rem;
}

/* Search Input */
.search-wrapper {
  flex: 1;
  max-width: 500px;
  margin: 0 2rem;
}

.search-input {
  position: relative;
  width: 100%;
}

.search-input input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 3rem;
  border: none;
  border-radius: 15px;
  background: rgba(248, 249, 250, 0.8);
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.search-input input:focus {
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.1);
  outline: none;
}

.search-input i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6C757D;
}

/* Navbar Right */
.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Notifications */
.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #DC3545;
  color: white;
  border-radius: 50%;
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
  transform: translate(25%, -25%);
}

.dropdown-panel {
  position: absolute;
  top: 100%;
  right: 0;
  width: 320px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s ease;
  z-index: 1000;
}

.dropdown-panel.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #E9ECEF;
}

.dropdown-header h6 {
  margin: 0;
  font-weight: 600;
  color: #343A40;
}

.notification-list {
  max-height: 360px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #F8F9FA;
  text-decoration: none;
  transition: all 0.3s ease;
}

.notification-item:hover {
  background: #F8F9FA;
}

.notification-icon {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: rgba(74, 144, 226, 0.1);
  color: #4A90E2;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.notification-icon.success {
  background: rgba(40, 167, 69, 0.1);
  color: #28A745;
}

.notification-icon.warning {
  background: rgba(255, 193, 7, 0.1);
  color: #FFC107;
}

.notification-content p {
  margin: 0;
  color: #343A40;
  font-weight: 500;
}

.notification-content span {
  font-size: 0.85rem;
  color: #6C757D;
}

.dropdown-footer {
  padding: 0.75rem;
  text-align: center;
  border-top: 1px solid #E9ECEF;
}

.dropdown-footer a {
  color: #4A90E2;
  text-decoration: none;
  font-weight: 500;
}

/* Profile */
.profile-button {
  padding: 0;
  overflow: hidden;
}

.profile-image {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  object-fit: cover;
}

.profile-panel {
  width: 240px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #343A40;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.dropdown-item i {
  margin-right: 0.75rem;
  font-size: 1.1rem;
  color: #6C757D;
}

.dropdown-item:hover {
  background: #F8F9FA;
  color: #4A90E2;
}

.dropdown-item:hover i {
  color: #4A90E2;
}

.dropdown-divider {
  margin: 0.5rem 0;
  border-top: 1px solid #E9ECEF;
}

/* Sidebar */
.sidebar {
  position: fixed;
  top: 70px;
  bottom: 0;
  left: 0;
  width: 280px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1020;
  padding: 1.5rem 1rem;
}

.sidebar-collapsed {
  transform: translateX(-100%);
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.875rem 1.25rem;
  color: #6C757D;
  border-radius: 12px;
  transition: all 0.3s ease;
  margin: 0.25rem 0;
  font-weight: 500;
}

.nav-link:hover {
  background: rgba(74, 144, 226, 0.05);
  color: #4A90E2;
}

.nav-link.active {
  background: #4A90E2;
  color: white;
}

.nav-link i {
  width: 24px;
  font-size: 1.25rem;
  margin-right: 1rem;
}

.nav-link.active i {
  color: white;
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

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar-collapsed {
    transform: translateX(0);
  }
  
  .main-content {
    margin-left: 0;
  }
  
  .search-wrapper {
    display: none;
  }
}
</style>
