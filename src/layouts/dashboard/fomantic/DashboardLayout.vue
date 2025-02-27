<template>
  <div class="dashboard-layout">
    <!-- Top Navigation -->
    <div class="ui top fixed menu">
      <div class="item">
        <button class="ui icon button" @click="toggleSidebar">
          <i class="bars icon"></i>
        </button>
      </div>
      <div class="item">
        <h3 class="ui header">Admin Panel</h3>
      </div>
      <div class="item">
        <div class="ui transparent icon input">
          <input type="text" placeholder="Search...">
          <i class="search icon"></i>
        </div>
      </div>
      <div class="right menu">
        <!-- Notifications -->
        <div class="ui dropdown item" :class="{ active: showNotifications, visible: showNotifications }">
          <i class="bell icon"></i>
          <div class="ui red circular floating label">3</div>
          <div class="menu" :class="{ visible: showNotifications, transition: showNotifications }">
            <div class="header">Notifications</div>
            <div class="item">
              <i class="user plus icon"></i>
              <div class="content">
                <div class="description">New user registered</div>
                <div class="extra">5 minutes ago</div>
              </div>
            </div>
            <div class="item">
              <i class="shopping cart icon"></i>
              <div class="content">
                <div class="description">New order received</div>
                <div class="extra">1 hour ago</div>
              </div>
            </div>
            <div class="item">
              <i class="mail icon"></i>
              <div class="content">
                <div class="description">New message received</div>
                <div class="extra">3 hours ago</div>
              </div>
            </div>
            <div class="ui divider"></div>
            <div class="header center aligned">
              <a href="#">View all notifications</a>
            </div>
          </div>
        </div>

        <!-- Profile -->
        <div class="ui dropdown item" :class="{ active: showProfile, visible: showProfile }">
          <img class="ui avatar image" src="https://ui-avatars.com/api/?name=Admin+User">
          <i class="dropdown icon"></i>
          <div class="menu" :class="{ visible: showProfile, transition: showProfile }">
            <a class="item" href="#"><i class="user icon"></i> Profile</a>
            <a class="item" href="#"><i class="settings icon"></i> Settings</a>
            <div class="divider"></div>
            <a class="item" href="#"><i class="sign out icon"></i> Logout</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar -->
    <div 
      class="ui vertical inverted sidebar menu left overlay visible"
      :class="{ 'collapsed': !sidebarExpanded }"
    >
      <div class="item">
        <div class="header">Navigation</div>
        <div class="menu">
          <router-link 
            v-for="item in menuItems" 
            :key="item.path"
            :to="item.path"
            class="item"
            active-class="active"
          >
            <i :class="[item.icon, 'icon']"></i>
            {{ item.label }}
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

.ui.top.menu {
  height: 60px;
}

.ui.vertical.sidebar.menu {
  top: 60px !important;
  width: 260px;
  transition: all 0.3s ease;
}

.ui.vertical.sidebar.menu.collapsed {
  width: 0;
  overflow: hidden;
}

.main-content {
  margin-left: 260px;
  margin-top: 60px;
  padding: 2rem;
  transition: margin 0.3s ease;
}

.main-content.expanded {
  margin-left: 0;
}

.ui.circular.label {
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  padding: 0.5em;
}

.ui.avatar.image {
  width: 2em;
  height: 2em;
  margin-right: 0.5em;
}

.ui.dropdown .menu {
  display: none;
}

.ui.dropdown.visible .menu {
  display: block;
}

@media only screen and (max-width: 768px) {
  .ui.vertical.sidebar.menu {
    width: 0;
  }

  .ui.vertical.sidebar.menu.collapsed {
    width: 260px;
  }

  .main-content {
    margin-left: 0;
  }
}
</style>
