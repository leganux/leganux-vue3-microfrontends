<template>
  <div class="login-layout">
    <div class="ui grid">
      <!-- Left Side - Image -->
      <div class="eight wide column only computer">
        <div class="auth-image-wrapper">
          <img src="https://source.unsplash.com/random/800x1200/?technology" alt="Login" class="auth-image">
          <div class="auth-image-overlay"></div>
          <div class="auth-image-text">
            <h1 class="ui inverted header">Welcome Back!</h1>
            <p class="ui inverted text">Sign in to access your dashboard and manage your account.</p>
          </div>
        </div>
      </div>

      <!-- Right Side - Forms -->
      <div class="sixteen wide mobile eight wide computer column">
        <div class="auth-content">
          <!-- Logo/Brand -->
          <h2 class="ui blue center aligned header">
            <div class="content">
              Your Brand
              <div class="sub header">Access your account</div>
            </div>
          </h2>

          <!-- Message Display -->
          <div v-if="message" :class="['ui', messageType, 'message']">
            <i class="close icon" @click="message = ''"></i>
            <div class="content">
              <p>{{ message }}</p>
            </div>
          </div>

          <!-- Login Form -->
          <form v-if="currentForm === 'login'" class="ui large form" @submit.prevent="handleLogin">
            <div class="ui stacked segment">
              <!-- Email -->
              <div class="field">
                <label>Email address</label>
                <div class="ui left icon input">
                  <i class="mail icon"></i>
                  <input 
                    type="email" 
                    placeholder="name@example.com"
                    v-model="email"
                    required
                  >
                </div>
              </div>

              <!-- Password -->
              <div class="field">
                <label class="left aligned">
                  Password
                  <button type="button" class="ui basic mini right floated button" @click="switchForm('reset')">
                    Forgot password?
                  </button>
                </label>
                <div class="ui left icon input">
                  <i class="lock icon"></i>
                  <input 
                    :type="showPassword ? 'text' : 'password'" 
                    placeholder="Enter your password"
                    v-model="password"
                    required
                  >
                </div>
              </div>

              <!-- Remember Me -->
              <div class="field">
                <div class="ui checkbox">
                  <input 
                    type="checkbox" 
                    id="remember"
                    v-model="rememberMe"
                  >
                  <label for="remember">Remember me</label>
                </div>
              </div>

              <!-- Submit Button -->
              <button 
                class="ui fluid large primary submit button"
                :class="{ loading: isLoading }"
                type="submit"
              >
                {{ isLoading ? 'Signing in...' : 'Sign In' }}
              </button>

              <!-- Social Login -->
              <div class="ui horizontal divider">Or continue with</div>

              <button 
                type="button"
                class="ui fluid google plus button"
                @click="handleGoogleLogin"
                :class="{ loading: isLoading }"
              >
                <i class="google icon"></i>
                Sign in with Google
              </button>
            </div>

            <!-- Register Link -->
            <div class="ui message">
              New to us? 
              <a href="#" @click.prevent="switchForm('register')">Sign Up</a>
            </div>
          </form>

          <!-- Register Form -->
          <form v-if="currentForm === 'register'" class="ui large form" @submit.prevent="handleRegister">
            <div class="ui stacked segment">
              <!-- Name -->
              <div class="field">
                <label>Full Name</label>
                <div class="ui left icon input">
                  <i class="user icon"></i>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    v-model="name"
                    required
                  >
                </div>
              </div>

              <!-- Email -->
              <div class="field">
                <label>Email address</label>
                <div class="ui left icon input">
                  <i class="mail icon"></i>
                  <input 
                    type="email" 
                    placeholder="name@example.com"
                    v-model="email"
                    required
                  >
                </div>
              </div>

              <!-- Password -->
              <div class="field">
                <label>Password</label>
                <div class="ui left icon input">
                  <i class="lock icon"></i>
                  <input 
                    :type="showPassword ? 'text' : 'password'" 
                    placeholder="Create a password"
                    v-model="password"
                    required
                  >
                </div>
              </div>

              <!-- Submit Button -->
              <button 
                class="ui fluid large primary submit button"
                :class="{ loading: isLoading }"
                type="submit"
              >
                {{ isLoading ? 'Creating account...' : 'Create Account' }}
              </button>
            </div>

            <!-- Login Link -->
            <div class="ui message">
              Already have an account? 
              <a href="#" @click.prevent="switchForm('login')">Sign In</a>
            </div>
          </form>

          <!-- Reset Password Form -->
          <form v-if="currentForm === 'reset'" class="ui large form" @submit.prevent="handleResetPassword">
            <div class="ui stacked segment">
              <!-- Email -->
              <div class="field">
                <label>Email address</label>
                <div class="ui left icon input">
                  <i class="mail icon"></i>
                  <input 
                    type="email" 
                    placeholder="name@example.com"
                    v-model="email"
                    required
                  >
                </div>
              </div>

              <!-- Submit Button -->
              <button 
                class="ui fluid large primary submit button"
                :class="{ loading: isLoading }"
                type="submit"
              >
                {{ isLoading ? 'Sending...' : 'Reset Password' }}
              </button>
            </div>

            <!-- Back to Login -->
            <div class="ui message">
              Remember your password? 
              <a href="#" @click.prevent="switchForm('login')">Sign In</a>
            </div>
          </form>

          <!-- Additional Links -->
          <div class="ui horizontal divided list">
            <a class="item">Terms of Service</a>
            <a class="item">Privacy Policy</a>
            <a class="item">Help Center</a>
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
const messageType = ref<'success' | 'error'>('success')

const switchForm = (form: 'login' | 'register' | 'reset') => {
  currentForm.value = form
  message.value = ''
  email.value = ''
  password.value = ''
  name.value = ''
}

const showError = (error: Error) => {
  message.value = error.message
  messageType.value = 'error'
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

.auth-content {
  max-width: 450px;
  margin: 2rem auto;
  padding: 2rem;
}

.ui.form {
  margin-top: 2rem;
}

.ui.form .field {
  margin-bottom: 1.5rem;
}

.ui.stacked.segment {
  padding: 2rem;
}

.ui.checkbox label {
  cursor: pointer;
}

.ui.horizontal.list {
  margin-top: 2rem;
  justify-content: center;
}

.ui.horizontal.list .item {
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.9em;
}

.ui.horizontal.divider {
  margin: 2rem 0;
}

.ui.google.plus.button {
  background-color: #dd4b39;
  color: white;
}

.ui.google.plus.button:hover {
  background-color: #c23321;
}

.ui.message {
  text-align: center;
}

.ui.message a {
  color: #2185d0;
  margin-left: 0.5rem;
}

.ui.message a:hover {
  color: #1678c2;
}
</style>
