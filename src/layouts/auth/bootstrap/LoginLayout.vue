<template>
  <div class="login-layout bg-light">
    <div class="container">
      <div class="row min-vh-100 align-items-center justify-content-center">
        <div class="col-12 col-sm-8 col-md-6 col-lg-4">
          <div class="card shadow-sm border-0">
            <div class="card-body p-4">
              <!-- Logo/Brand -->
              <div class="text-center mb-4">
                <h4 class="text-primary fw-bold mb-0">Your Brand</h4>
                <p class="text-muted small">Sign in to continue</p>
              </div>

              <!-- Login Form -->
              <form @submit.prevent="handleLogin">
                <!-- Email -->
                <div class="mb-3">
                  <label for="email" class="form-label">Email address</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <i class="bi bi-envelope text-muted"></i>
                    </span>
                    <input 
                      type="email" 
                      class="form-control bg-light border-start-0" 
                      id="email"
                      v-model="email"
                      placeholder="name@example.com"
                      required
                    >
                  </div>
                </div>

                <!-- Password -->
                <div class="mb-3">
                  <div class="d-flex justify-content-between align-items-center">
                    <label for="password" class="form-label">Password</label>
                    <a href="#" class="text-decoration-none small">Forgot password?</a>
                  </div>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <i class="bi bi-lock text-muted"></i>
                    </span>
                    <input 
                      :type="showPassword ? 'text' : 'password'" 
                      class="form-control bg-light border-start-0 border-end-0" 
                      id="password"
                      v-model="password"
                      placeholder="Enter your password"
                      required
                    >
                    <button 
                      class="input-group-text bg-light border-start-0" 
                      type="button"
                      @click="togglePassword"
                    >
                      <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                    </button>
                  </div>
                </div>

                <!-- Remember Me -->
                <div class="mb-3">
                  <div class="form-check">
                    <input 
                      type="checkbox" 
                      class="form-check-input" 
                      id="remember"
                      v-model="rememberMe"
                    >
                    <label class="form-check-label" for="remember">Remember me</label>
                  </div>
                </div>

                <!-- Submit Button -->
                <button 
                  type="submit" 
                  class="btn btn-primary w-100"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ isLoading ? 'Signing in...' : 'Sign In' }}
                </button>

                <!-- Register Link -->
                <p class="text-center mt-4 mb-0">
                  Don't have an account? 
                  <a href="#" class="text-decoration-none">Register here</a>
                </p>
              </form>
            </div>
          </div>

          <!-- Additional Links -->
          <div class="text-center mt-4">
            <a href="#" class="text-muted text-decoration-none small mx-2">Terms of Service</a>
            <span class="text-muted">·</span>
            <a href="#" class="text-muted text-decoration-none small mx-2">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const isLoading = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  try {
    isLoading.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Redirect to dashboard
    router.push('/dashboard/user')
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.card {
  border-radius: 10px;
}

.form-control:focus,
.form-check-input:focus {
  box-shadow: none;
  border-color: #0d6efd;
}

.input-group-text {
  border-radius: 5px;
}

.btn-primary {
  padding: 0.6rem;
  border-radius: 5px;
}

.btn-primary:focus {
  box-shadow: none;
}
</style>
