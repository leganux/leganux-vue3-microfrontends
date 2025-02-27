<template>
  <div class="website-layout">
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom fixed-top">
      <div class="container">
        <a class="navbar-brand" href="/">
          <span class="fw-bold text-primary">Your Brand</span>
        </a>
        
        <button 
          class="navbar-toggler" 
          type="button" 
          @click="toggleNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" :class="{ show: isNavOpen }">
          <!-- Dynamic Navigation Items -->
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li v-for="item in sortedNavItems" :key="item.path" class="nav-item">
              <router-link 
                :to="item.path" 
                class="nav-link"
                :class="{ active: isCurrentPath(item.path) }"
              >
                {{ item.label }}
              </router-link>
            </li>
          </ul>
          
          <div class="d-flex gap-2">
            <router-link to="/login" class="btn btn-outline-primary">Sign In</router-link>
            <a href="#" class="btn btn-primary">Get Started</a>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <slot></slot>
    </main>

    <!-- Footer -->
    <footer class="footer bg-light py-5 mt-auto">
      <div class="container">
        <div class="row g-4">
          <!-- Brand Column -->
          <div class="col-12 col-md-4">
            <h5 class="text-primary fw-bold mb-3">Your Brand</h5>
            <p class="text-muted mb-3">
              Making the world a better place through innovative solutions.
            </p>
            <div class="social-links">
              <a href="#" class="text-muted me-3"><i class="bi bi-facebook"></i></a>
              <a href="#" class="text-muted me-3"><i class="bi bi-twitter"></i></a>
              <a href="#" class="text-muted me-3"><i class="bi bi-linkedin"></i></a>
              <a href="#" class="text-muted"><i class="bi bi-instagram"></i></a>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="col-6 col-md-2">
            <h6 class="fw-bold mb-3">Company</h6>
            <ul class="list-unstyled mb-0">
              <li class="mb-2"><a href="#" class="text-muted text-decoration-none">About</a></li>
              <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Careers</a></li>
              <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Blog</a></li>
              <li><a href="#" class="text-muted text-decoration-none">Press</a></li>
            </ul>
          </div>

          <!-- Resources -->
          <div class="col-6 col-md-2">
            <h6 class="fw-bold mb-3">Resources</h6>
            <ul class="list-unstyled mb-0">
              <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Documentation</a></li>
              <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Help Center</a></li>
              <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Guides</a></li>
              <li><a href="#" class="text-muted text-decoration-none">API Status</a></li>
            </ul>
          </div>

          <!-- Legal -->
          <div class="col-6 col-md-2">
            <h6 class="fw-bold mb-3">Legal</h6>
            <ul class="list-unstyled mb-0">
              <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Privacy</a></li>
              <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Terms</a></li>
              <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Cookie Policy</a></li>
              <li><a href="#" class="text-muted text-decoration-none">Licenses</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div class="col-6 col-md-2">
            <h6 class="fw-bold mb-3">Contact</h6>
            <ul class="list-unstyled mb-0">
              <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Support</a></li>
              <li class="mb-2"><a href="#" class="text-muted text-decoration-none">Sales</a></li>
              <li><a href="#" class="text-muted text-decoration-none">Partners</a></li>
            </ul>
          </div>
        </div>

        <!-- Copyright -->
        <div class="border-top mt-4 pt-4 text-center text-muted">
          <small>&copy; {{ new Date().getFullYear() }} Your Brand. All rights reserved.</small>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'WebsiteLayout',
  setup() {
    const route = useRoute()
    const isNavOpen = ref(false)

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

    const toggleNav = () => {
      isNavOpen.value = !isNavOpen.value
    }

    const isCurrentPath = (path: string) => {
      return route.path === path
    }

    return {
      isNavOpen,
      sortedNavItems,
      toggleNav,
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

.navbar {
  height: 70px;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
}

.main-content {
  margin-top: 70px;
  flex: 1;
}

.nav-link {
  position: relative;
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--bs-primary) !important;
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 50%;
  background-color: var(--bs-primary);
  transition: all 0.2s;
}

.nav-link:hover::after {
  width: 100%;
  left: 0;
}

.social-links a {
  font-size: 1.25rem;
  transition: color 0.2s;
}

.social-links a:hover {
  color: var(--bs-primary) !important;
}
</style>
