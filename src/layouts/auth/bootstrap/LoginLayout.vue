<template>
  <div class="login-layout">
    <div class="container">
      <div class="row min-vh-100">
        <!-- Left Side - Image -->
        <div class="col-lg-6 d-none d-lg-flex align-items-center justify-content-center">
          <div class="auth-image-wrapper">
            <img src="https://images.pexels.com/photos/1544420/pexels-photo-1544420.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Login" class="auth-image">
            <div class="auth-image-overlay"></div>
            <div class="auth-image-text">
              <h2 class="text-white mb-4">Welcome Back!</h2>
              <p class="text-white">Sign in to access your dashboard and manage your account.</p>
            </div>
          </div>
        </div>

        <!-- Right Side - Forms -->
        <div class="col-12 col-lg-6 d-flex align-items-center">
          <div class="w-100 px-4 py-5">
            <!-- Logo/Brand -->
            <div class="text-center mb-5">
              <h3 class="text-primary fw-bold mb-0">Your Brand</h3>
              <p class="text-muted">Access your account</p>
            </div>

            <!-- Alert for messages -->
            <div v-if="message" :class="['alert', `alert-${messageType}`, 'mb-4']" role="alert">
              {{ message }}
            </div>

            <!-- Login Form -->
            <form v-if="currentForm === 'login'" @submit.prevent="handleLogin" class="auth-form">
              <!-- Email -->
              <div class="mb-4">
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
              <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center">
                  <label for="password" class="form-label">Password</label>
                  <button type="button" class="btn btn-link p-0 text-decoration-none" @click="switchForm('reset')">
                    Forgot password?
                  </button>
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
              <div class="mb-4">
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
                class="btn btn-primary w-100 mb-4"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                {{ isLoading ? 'Signing in...' : 'Sign In' }}
              </button>

              <!-- Social Login -->
              <div class="text-center mb-4">
                <p class="text-muted mb-4">Or continue with</p>
                <button 
                  type="button" 
                  class="btn btn-outline-danger w-100 mb-3"
                  @click="handleGoogleLogin"
                  :disabled="isLoading"
                >
                  <i class="bi bi-google me-2"></i> Sign in with Google
                </button>
              </div>

              <!-- Register Link -->
              <p class="text-center mb-0">
                Don't have an account? 
                <button type="button" class="btn btn-link p-0 text-decoration-none" @click="switchForm('register')">
                  Register here
                </button>
              </p>
            </form>

            <!-- Register Form -->
            <form v-if="currentForm === 'register'" @submit.prevent="handleRegister" class="auth-form">
              <!-- Name -->
              <div class="mb-4">
                <label for="name" class="form-label">Full Name</label>
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0">
                    <i class="bi bi-person text-muted"></i>
                  </span>
                  <input 
                    type="text" 
                    class="form-control bg-light border-start-0" 
                    id="name"
                    v-model="name"
                    placeholder="John Doe"
                    required
                  >
                </div>
              </div>

              <!-- Email -->
              <div class="mb-4">
                <label for="registerEmail" class="form-label">Email address</label>
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0">
                    <i class="bi bi-envelope text-muted"></i>
                  </span>
                  <input 
                    type="email" 
                    class="form-control bg-light border-start-0" 
                    id="registerEmail"
                    v-model="email"
                    placeholder="name@example.com"
                    required
                  >
                </div>
              </div>

              <!-- Password -->
              <div class="mb-4">
                <label for="registerPassword" class="form-label">Password</label>
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0">
                    <i class="bi bi-lock text-muted"></i>
                  </span>
                  <input 
                    :type="showPassword ? 'text' : 'password'" 
                    class="form-control bg-light border-start-0 border-end-0" 
                    id="registerPassword"
                    v-model="password"
                    placeholder="Create a password"
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

              <!-- Submit Button -->
              <button 
                type="submit" 
                class="btn btn-primary w-100 mb-4"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                {{ isLoading ? 'Creating account...' : 'Create Account' }}
              </button>

              <!-- Login Link -->
              <p class="text-center mb-0">
                Already have an account? 
                <button type="button" class="btn btn-link p-0 text-decoration-none" @click="switchForm('login')">
                  Sign in here
                </button>
              </p>
            </form>

            <!-- Reset Password Form -->
            <form v-if="currentForm === 'reset'" @submit.prevent="handleResetPassword" class="auth-form">
              <!-- Email -->
              <div class="mb-4">
                <label for="resetEmail" class="form-label">Email address</label>
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0">
                    <i class="bi bi-envelope text-muted"></i>
                  </span>
                  <input 
                    type="email" 
                    class="form-control bg-light border-start-0" 
                    id="resetEmail"
                    v-model="email"
                    placeholder="name@example.com"
                    required
                  >
                </div>
              </div>

              <!-- Submit Button -->
              <button 
                type="submit" 
                class="btn btn-primary w-100 mb-4"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                {{ isLoading ? 'Sending...' : 'Reset Password' }}
              </button>

              <!-- Back to Login -->
              <p class="text-center mb-0">
                Remember your password? 
                <button type="button" class="btn btn-link p-0 text-decoration-none" @click="switchForm('login')">
                  Sign in here
                </button>
              </p>
            </form>

            <!-- Additional Links -->
            <div class="text-center mt-5">
              <a href="#" class="text-muted text-decoration-none small mx-2">Terms of Service</a>
              <span class="text-muted">·</span>
              <a href="#" class="text-muted text-decoration-none small mx-2">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth.service'

const router = useRouter()
const email = ref('')
const password = ref('')
const name = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const isLoading = ref(false)
const currentForm = ref<'login' | 'register' | 'reset'>('login')
const message = ref('')
const messageType = ref<'success' | 'danger'>('success')

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const switchForm = (form: 'login' | 'register' | 'reset') => {
  currentForm.value = form
  message.value = ''
  email.value = ''
  password.value = ''
  name.value = ''
}

const showError = (error: Error) => {
  message.value = error.message
  messageType.value = 'danger'
}

const handleLogin = async () => {
  try {
    isLoading.value = true
    await authService.loginWithEmail(email.value, password.value)
    router.push('/dashboard')
  } catch (error: any) {
    showError(error)
  } finally {
    isLoading.value = false
  }
}

const handleRegister = async () => {
  try {
    isLoading.value = true
    await authService.registerWithEmail(email.value, password.value, name.value)
    router.push('/dashboard')
  } catch (error: any) {
    showError(error)
  } finally {
    isLoading.value = false
  }
}

const handleGoogleLogin = async () => {
  try {
    isLoading.value = true
    await authService.loginWithGoogle()
    router.push('/dashboard')
  } catch (error: any) {
    showError(error)
  } finally {
    isLoading.value = false
  }
}

const handleResetPassword = async () => {
  try {
    isLoading.value = true
    await authService.resetPassword(email.value)
    message.value = 'Password reset email sent! Please check your inbox.'
    messageType.value = 'success'
  } catch (error: any) {
    showError(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-layout {
  min-height: 100vh;
  background: #ffffff;
}

.auth-image-wrapper {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.auth-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.auth-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7));
}

.auth-image-text {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
  text-align: center;
  width: 80%;
}

.auth-form {
  max-width: 400px;
  margin: 0 auto;
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
  background: linear-gradient(to right, #0d6efd, #0099ff);
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(to right, #0957c3, #007acc);
}

.btn-primary:focus {
  box-shadow: none;
}

.btn-outline-danger {
  border-radius: 5px;
}

.btn-link {
  color: #0d6efd;
}

.btn-link:hover {
  color: #0957c3;
}
</style>
