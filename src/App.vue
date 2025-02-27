<template>
  <component :is="currentLayout">
    <router-view></router-view>
  </component>
</template>

<script lang="ts">
import { defineComponent, shallowRef, watchEffect, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

const UI_FRAMEWORK = import.meta.env.VITE_UI_FRAMEWORK || 'bootstrap'

// Define async components
const BootstrapDashboard = defineAsyncComponent(() => 
  import('./layouts/dashboard/bootstrap/DashboardLayout.vue')
)
const FomanticDashboard = defineAsyncComponent(() => 
  import('./layouts/dashboard/fomantic/DashboardLayout.vue')
)
const BootstrapWebsite = defineAsyncComponent(() => 
  import('./layouts/website/bootstrap/WebsiteLayout.vue')
)
const FomanticWebsite = defineAsyncComponent(() => 
  import('./layouts/website/fomantic/WebsiteLayout.vue')
)
const BootstrapLogin = defineAsyncComponent(() => 
  import('./layouts/auth/bootstrap/LoginLayout.vue')
)
const FomanticLogin = defineAsyncComponent(() => 
  import('./layouts/auth/fomantic/LoginLayout.vue')
)

export default defineComponent({
  name: 'App',
  setup() {
    const route = useRoute()
    const currentLayout = shallowRef()

    watchEffect(() => {
      const layoutName = route.meta.layout as string || 'WebsiteLayout'
      
      // Set the appropriate layout based on UI framework
      switch (layoutName) {
        case 'DashboardLayout':
          currentLayout.value = UI_FRAMEWORK === 'bootstrap' 
            ? BootstrapDashboard
            : FomanticDashboard
          break
        case 'WebsiteLayout':
          currentLayout.value = UI_FRAMEWORK === 'bootstrap'
            ? BootstrapWebsite
            : FomanticWebsite
          break
        case 'LoginLayout':
          currentLayout.value = UI_FRAMEWORK === 'bootstrap'
            ? BootstrapLogin
            : FomanticLogin
          break
        default:
          currentLayout.value = UI_FRAMEWORK === 'bootstrap'
            ? BootstrapWebsite
            : FomanticWebsite
      }
    })

    return {
      currentLayout
    }
  }
})
</script>

<style>
/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  background-color: #f5f5f5;
}

/* CSS Variables for theming */
:root {
  --primary-color: #0d6efd;
  --secondary-color: #6c757d;
  --success-color: #198754;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #0dcaf0;
  --light-color: #f8f9fa;
  --dark-color: #212529;
}
</style>
