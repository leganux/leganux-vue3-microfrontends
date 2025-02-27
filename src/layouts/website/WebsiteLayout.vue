<template>
  <div class="website-layout">
    <!-- Header -->
    <header class="header py-2 bg-white border-bottom">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-auto">
            <a href="/" class="text-decoration-none">
              <h5 class="text-primary fw-bold mb-0">Your Brand</h5>
            </a>
          </div>
          
          <!-- Desktop Navigation -->
          <div class="col d-none d-lg-block">
            <nav class="nav justify-content-center">
              <a class="nav-link px-3 text-dark" href="#">Home</a>
              <a class="nav-link px-3 text-dark" href="#">Products</a>
              <a class="nav-link px-3 text-dark" href="#">Services</a>
              <a class="nav-link px-3 text-dark" href="#">About</a>
              <a class="nav-link px-3 text-dark" href="#">Contact</a>
            </nav>
          </div>
          
          <!-- Right Actions -->
          <div class="col-auto d-flex align-items-center">
            <a href="#" class="btn btn-outline-primary me-2 d-none d-sm-inline-block">Sign In</a>
            <a href="#" class="btn btn-primary d-none d-sm-inline-block">Get Started</a>
            
            <!-- Mobile Menu Button -->
            <button 
              class="btn btn-link d-lg-none"
              @click="toggleMobileMenu"
            >
              <i class="bi" :class="mobileMenuOpen ? 'bi-x-lg' : 'bi-list'"></i>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Navigation -->
    <div 
      class="mobile-menu bg-white border-bottom d-lg-none" 
      :class="{ 'show': mobileMenuOpen }"
    >
      <div class="container py-3">
        <nav class="nav flex-column">
          <a class="nav-link py-2 text-dark" href="#">Home</a>
          <a class="nav-link py-2 text-dark" href="#">Products</a>
          <a class="nav-link py-2 text-dark" href="#">Services</a>
          <a class="nav-link py-2 text-dark" href="#">About</a>
          <a class="nav-link py-2 text-dark" href="#">Contact</a>
          <div class="border-top my-3"></div>
          <a href="#" class="btn btn-outline-primary mb-2">Sign In</a>
          <a href="#" class="btn btn-primary">Get Started</a>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <main class="main-content flex-grow-1">
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

<script lang="ts" setup>
import { ref } from 'vue'

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}
</script>

<style scoped>
.website-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  position: sticky;
  top: 0;
  z-index: 1020;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
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

.mobile-menu {
  position: fixed;
  top: 56px;
  left: 0;
  right: 0;
  transform: translateY(-100%);
  transition: transform 0.3s ease-in-out;
  z-index: 1019;
}

.mobile-menu.show {
  transform: translateY(0);
}

.main-content {
  flex: 1;
}

.social-links a {
  font-size: 1.25rem;
  transition: color 0.2s;
}

.social-links a:hover {
  color: var(--bs-primary) !important;
}
</style>
