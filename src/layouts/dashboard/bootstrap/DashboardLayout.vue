<template>
  <div class="dashboard-layout">
    <!-- Top Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom fixed-top">
      <div class="container-fluid">
        <!-- Toggle Button -->
        <button 
          class="btn btn-link d-md-none" 
          @click="toggleSidebar"
        >
          <i class="bi bi-list fs-4"></i>
        </button>

        <!-- Brand -->
        <a class="navbar-brand mx-3" href="#">
          <span class="fw-bold text-primary">Admin Panel</span>
        </a>

        <!-- Search -->
        <div class="d-none d-md-block w-50">
          <div class="input-group">
            <span class="input-group-text bg-light border-end-0">
              <i class="bi bi-search"></i>
            </span>
            <input 
              type="text" 
              class="form-control bg-light border-start-0" 
              placeholder="Search..."
            >
          </div>
        </div>

        <!-- Right Navigation -->
        <ul class="navbar-nav ms-auto">
          <li class="nav-item dropdown">
            <a class="nav-link position-relative" href="#" @click.prevent="toggleNotifications">
              <i class="bi bi-bell fs-5"></i>
              <span class="position-absolute top-25 start-75 translate-middle badge rounded-pill bg-danger">
                3
              </span>
            </a>
            <!-- Notifications Dropdown -->
            <div class="dropdown-menu dropdown-menu-end p-0" :class="{ show: showNotifications }" style="width: 300px">
              <div class="p-3 border-bottom">
                <h6 class="mb-0">Notifications</h6>
              </div>
              <div class="list-group list-group-flush">
                <a href="#" class="list-group-item list-group-item-action">
                  <div class="d-flex align-items-center">
                    <i class="bi bi-person-plus text-primary me-3 fs-5"></i>
                    <div>
                      <p class="mb-1">New user registered</p>
                      <small class="text-muted">5 minutes ago</small>
                    </div>
                  </div>
                </a>
                <a href="#" class="list-group-item list-group-item-action">
                  <div class="d-flex align-items-center">
                    <i class="bi bi-cart-check text-success me-3 fs-5"></i>
                    <div>
                      <p class="mb-1">New order received</p>
                      <small class="text-muted">1 hour ago</small>
                    </div>
                  </div>
                </a>
                <a href="#" class="list-group-item list-group-item-action">
                  <div class="d-flex align-items-center">
                    <i class="bi bi-envelope text-warning me-3 fs-5"></i>
                    <div>
                      <p class="mb-1">New message received</p>
                      <small class="text-muted">3 hours ago</small>
                    </div>
                  </div>
                </a>
              </div>
              <div class="p-2 border-top text-center">
                <a href="#" class="text-decoration-none">View all notifications</a>
              </div>
            </div>
          </li>
          <li class="nav-item dropdown ms-3">
            <a class="nav-link dropdown-toggle" href="#" @click.prevent="toggleProfile">
              <img 
                src="https://ui-avatars.com/api/?name=Admin+User" 
                class="rounded-circle" 
                width="32" 
                height="32" 
                alt="profile"
              >
            </a>
            <ul class="dropdown-menu dropdown-menu-end" :class="{ show: showProfile }">
              <li><a class="dropdown-item" href="#"><i class="bi bi-person me-2"></i>Profile</a></li>
              <li><a class="dropdown-item" href="#"><i class="bi bi-gear me-2"></i>Settings</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="#"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Sidebar -->
    <div 
      class="sidebar bg-white border-end" 
      :class="{ 'sidebar-collapsed': !sidebarExpanded }"
    >
      <div class="sidebar-sticky pt-3">
        <ul class="nav flex-column">
          <li class="nav-item" v-for="item in menuItems" :key="item.path">
            <router-link 
              :to="item.path"
              class="nav-link"
              active-class="active"
            >
              <i :class="['bi', `bi-${item.icon}`, 'me-2']"></i>
              {{ item.label }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>

    <!-- Main Content -->
    <main class="main-content">
      <div class="container-fluid py-4">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { MicroFrontendConfig } from '@/_frontends/dashboard/user/config'

const sidebarExpanded = ref(true)
const showNotifications = ref(false)
const showProfile = ref(false)
const menuItems = ref<{label: string, icon: string, path: string}[]>([])
const router = useRouter()

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
}

.navbar {
  height: 60px;
  z-index: 1030;
}

.sidebar {
  position: fixed;
  top: 60px;
  bottom: 0;
  left: 0;
  width: 240px;
  padding: 0;
  z-index: 1020;
  transition: all 0.3s ease;
}

.sidebar-collapsed {
  width: 0;
  padding: 0;
  overflow: hidden;
}

.main-content {
  margin-left: 240px;
  margin-top: 60px;
  transition: margin 0.3s ease;
}

@media (max-width: 768px) {
  .sidebar {
    margin-left: -240px;
  }
  
  .sidebar-collapsed {
    margin-left: 0;
  }
  
  .main-content {
    margin-left: 0;
  }
}

.nav-link {
  color: #6c757d;
  padding: 0.5rem 1.5rem;
}

.nav-link:hover,
.nav-link.active {
  color: #0d6efd;
  background-color: #f8f9fa;
}

.nav-link i {
  width: 20px;
}
</style>
