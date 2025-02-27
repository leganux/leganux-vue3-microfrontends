import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Get UI framework from environment variable
const UI_FRAMEWORK = import.meta.env.VITE_UI_FRAMEWORK || 'bootstrap'

// Function to load Fomantic UI
const loadFomanticUI = () => {
  // Load CSS
  import('fomantic-ui/dist/semantic.min.css')
  
  // Load jQuery synchronously
  const jqueryScript = document.createElement('script')
  jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js'
  jqueryScript.async = false
  document.head.appendChild(jqueryScript)
  
  // Load Fomantic UI synchronously
  const fomanticScript = document.createElement('script')
  fomanticScript.src = '/node_modules/fomantic-ui/dist/semantic.min.js'
  fomanticScript.async = false
  document.head.appendChild(fomanticScript)
}

// Function to load Bootstrap
const loadBootstrap = () => {
  import('bootstrap/dist/css/bootstrap.min.css')
  import('bootstrap-icons/font/bootstrap-icons.css')
  import('bootstrap/dist/js/bootstrap.bundle.min.js')
}

// Create Vue app after UI framework is loaded
const initApp = () => {
  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(router)

  app.mount('#app')
}

// Load UI framework and initialize app
if (UI_FRAMEWORK === 'bootstrap') {
  loadBootstrap()
  initApp()
} else {
  // For Fomantic UI, wait for jQuery to load
  loadFomanticUI()
  window.addEventListener('load', () => {
    if (window.jQuery) {
      initApp()
    } else {
      console.error('jQuery failed to load')
    }
  })
}
