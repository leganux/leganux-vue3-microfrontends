<template>
  <div class="website-layout">
    <!-- Navigation -->
    <div class="ui large top fixed menu">
      <div class="ui container">
        <a class="header item" href="/">
          <span class="brand">Your Brand</span>
        </a>
        
        <!-- Dynamic Navigation Items -->
        <template v-for="item in sortedNavItems" :key="item.path">
          <router-link 
            :to="item.path" 
            class="item"
            :class="{ active: isCurrentPath(item.path) }"
          >
            {{ item.label }}
          </router-link>
        </template>
        
        <div class="right menu">
          <div class="item">
            <router-link to="/login" class="ui button">Sign In</router-link>
          </div>
          <div class="item">
            <a class="ui primary button">Get Started</a>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <a class="toc item" @click="toggleMobileMenu">
          <i class="sidebar icon"></i>
        </a>
      </div>
    </div>

    <!-- Mobile Sidebar -->
    <div class="ui vertical sidebar menu" :class="{ visible: mobileMenuOpen }">
      <template v-for="item in sortedNavItems" :key="item.path">
        <router-link 
          :to="item.path" 
          class="item"
          :class="{ active: isCurrentPath(item.path) }"
        >
          {{ item.label }}
        </router-link>
      </template>
      <div class="item">
        <router-link to="/login" class="ui fluid button">Sign In</router-link>
      </div>
      <div class="item">
        <a class="ui fluid primary button">Get Started</a>
      </div>
    </div>

    <!-- Main Content -->
    <main class="main-content">
      <slot></slot>
    </main>

    <!-- Footer -->
    <div class="ui inverted vertical footer segment">
      <div class="ui container">
        <div class="ui stackable inverted divided grid">
          <!-- Brand Column -->
          <div class="four wide column">
            <h4 class="ui inverted header">Your Brand</h4>
            <p>Making the world a better place through innovative solutions.</p>
            <div class="ui inverted link list">
              <a class="item"><i class="facebook icon"></i> Facebook</a>
              <a class="item"><i class="twitter icon"></i> Twitter</a>
              <a class="item"><i class="linkedin icon"></i> LinkedIn</a>
              <a class="item"><i class="instagram icon"></i> Instagram</a>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="three wide column">
            <h4 class="ui inverted header">Company</h4>
            <div class="ui inverted link list">
              <a class="item">About</a>
              <a class="item">Careers</a>
              <a class="item">Blog</a>
              <a class="item">Press</a>
            </div>
          </div>

          <!-- Resources -->
          <div class="three wide column">
            <h4 class="ui inverted header">Resources</h4>
            <div class="ui inverted link list">
              <a class="item">Documentation</a>
              <a class="item">Help Center</a>
              <a class="item">Guides</a>
              <a class="item">API Status</a>
            </div>
          </div>

          <!-- Legal -->
          <div class="three wide column">
            <h4 class="ui inverted header">Legal</h4>
            <div class="ui inverted link list">
              <a class="item">Privacy</a>
              <a class="item">Terms</a>
              <a class="item">Cookie Policy</a>
              <a class="item">Licenses</a>
            </div>
          </div>

          <!-- Contact -->
          <div class="three wide column">
            <h4 class="ui inverted header">Contact</h4>
            <div class="ui inverted link list">
              <a class="item">Support</a>
              <a class="item">Sales</a>
              <a class="item">Partners</a>
            </div>
          </div>
        </div>

        <!-- Copyright -->
        <div class="ui inverted section divider"></div>
        <div class="ui center aligned inverted">
          <small>&copy; {{ new Date().getFullYear() }} Your Brand. All rights reserved.</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'WebsiteLayout',
  setup() {
    const route = useRoute()
    const mobileMenuOpen = ref(false)

    // Load all microfrontend configs
    const modules = import.meta.glob('../../../_frontends/website/*/config.ts', { eager: true })

    // Extract navigation items from website microfrontends
    const navItems = computed(() => {
      const items: { label: string; path: string; order?: number }[] = []
      
      for (const path in modules) {
        const module = modules[path] as { config: { type: string; routes: any[]; navItem?: { label: string; order?: number } } }
        if (module?.config?.type === 'website' && module.config.navItem && module.config.routes.length > 0) {
          items.push({
            label: module.config.navItem.label,
            path: module.config.routes[0].path,
            order: module.config.navItem.order
          })
        }
      }
      
      return items
    })

    // Sort navigation items by order
    const sortedNavItems = computed(() => {
      return [...navItems.value].sort((a, b) => {
        const orderA = a.order ?? Infinity
        const orderB = b.order ?? Infinity
        return orderA - orderB
      })
    })

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value
    }

    const isCurrentPath = (path: string) => {
      return route.path === path
    }

    return {
      mobileMenuOpen,
      sortedNavItems,
      toggleMobileMenu,
      isCurrentPath
    }
  }
})
</script>

<style scoped>
.website-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.ui.menu {
  margin-bottom: 0;
}

.ui.menu .brand {
  font-weight: bold;
  color: var(--primary-color);
}

.main-content {
  margin-top: 60px;
  flex: 1;
}

.ui.footer.segment {
  padding: 4em 0;
  margin-top: 3em;
}

/* Mobile Menu Button */
.toc.item {
  display: none !important;
}

@media only screen and (max-width: 768px) {
  .ui.fixed.menu {
    display: none !important;
  }
  
  .toc.item {
    display: block !important;
  }
  
  .ui.sidebar.menu {
    z-index: 999;
  }
}

/* Hover Effects */
.ui.menu .item {
  position: relative;
  transition: color 0.2s;
}

.ui.menu .item::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 50%;
  background-color: var(--primary-color);
  transition: all 0.2s;
}

.ui.menu .item:hover::after {
  width: 100%;
  left: 0;
}
</style>
