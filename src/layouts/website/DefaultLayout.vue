<template>
  <div class="default-layout">
    <!-- Bootstrap Layout -->
    <template v-if="uiFramework === 'bootstrap'">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="/public">Micro-Frontends</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item" v-for="route in routes" :key="route.path">
                <router-link :to="route.path" class="nav-link" active-class="active">
                  {{ route.meta?.title || route.name }}
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <main class="container mt-4">
        <slot></slot>
      </main>
    </template>

    <!-- Fomantic UI Layout -->
    <template v-else>
      <div class="ui fixed inverted menu">
        <div class="ui container">
          <a href="/public" class="header item">Micro-Frontends</a>
          <router-link v-for="route in routes" :key="route.path" :to="route.path" class="item" active-class="active">
            {{ route.meta?.title || route.name }}
          </router-link>
        </div>
      </div>
      <div class="ui main container" style="margin-top: 6em;">
        <slot></slot>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Get UI framework from environment
const uiFramework = import.meta.env.VITE_UI_FRAMEWORK || 'bootstrap'

const router = useRouter()
const routes = computed(() =>
  router.getRoutes()
    .filter(route => !route.path.includes(':') && route.path !== '/')
)

// Load UI framework CSS and JS
onMounted(async () => {
  if (uiFramework === 'bootstrap') {
    // Load Bootstrap
    const bootstrap = await import('bootstrap')
    // Load Bootstrap CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'
    document.head.appendChild(link)

    const link2 = document.createElement('link')
    link2.rel = 'stylesheet'
    link2.href = 'https://cdnjs.cloudflare.com/ajax/libs/bootswatch/5.3.3/cerulean/bootstrap.min.css'
    document.head.appendChild(link2)
  } else {
    // Load Fomantic UI CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.0/dist/semantic.min.css'
    document.head.appendChild(link)

    // Load Fomantic UI JS
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.0/dist/semantic.min.js'
    document.body.appendChild(script)
  }
})
</script>
