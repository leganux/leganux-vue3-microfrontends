<template>
  <div class="login-layout">
    <div class="ui middle aligned center aligned grid">
      <div class="column">
        <!-- Logo/Brand -->
        <h2 class="ui blue image header">
          <div class="content">
            Your Brand
            <div class="sub header">Sign in to continue</div>
          </div>
        </h2>

        <!-- Login Form -->
        <form class="ui large form" @submit.prevent="handleLogin">
          <div class="ui stacked segment">
            <!-- Email -->
            <div class="field">
              <div class="ui left icon input">
                <i class="user icon"></i>
                <input 
                  type="email" 
                  placeholder="Email address"
                  v-model="email"
                  required
                >
              </div>
            </div>

            <!-- Password -->
            <div class="field">
              <div class="ui left icon input">
                <i class="lock icon"></i>
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  placeholder="Password"
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
              class="ui fluid large blue submit button"
              :class="{ loading: isLoading }"
              type="submit"
            >
              {{ isLoading ? 'Signing in...' : 'Sign In' }}
            </button>

            <!-- Additional Options -->
            <div class="ui horizontal divider">Or</div>

            <!-- Social Login -->
            <div class="ui two buttons">
              <button class="ui google plus button" type="button">
                <i class="google icon"></i>
                Google
              </button>
              <button class="ui facebook button" type="button">
                <i class="facebook icon"></i>
                Facebook
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div class="ui error message"></div>
        </form>

        <!-- Register Link -->
        <div class="ui message">
          New to us? <a href="#">Sign Up</a>
        </div>

        <!-- Additional Links -->
        <div class="ui horizontal list">
          <a class="item">Terms of Service</a>
          <a class="item">Privacy Policy</a>
          <a class="item">Help Center</a>
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
  padding: 2rem;
}

.grid {
  min-height: calc(100vh - 4rem);
}

.column {
  max-width: 450px;
}

.ui.blue.header {
  margin-bottom: 2em;
}

.ui.stacked.segment {
  padding: 2em;
}

.ui.form .field {
  margin-bottom: 1.5em;
}

.ui.checkbox label {
  cursor: pointer;
}

.ui.horizontal.list {
  margin-top: 2em;
}

.ui.horizontal.list .item {
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.9em;
}

.ui.horizontal.divider {
  margin: 2em 0;
}

.ui.two.buttons {
  margin-top: 1em;
}

.ui.two.buttons .button {
  margin: 0;
}

.ui.google.plus.button {
  background-color: #dd4b39;
  color: white;
}

.ui.facebook.button {
  background-color: #3b5998;
  color: white;
}
</style>
