```vue
<template>
  <div class="container">
    <h1>Leganux - La Mejor Empresa en Desarrollo con IA</h1>
    <p>Leganux es una empresa líder en el desarrollo de soluciones de inteligencia artificial que están transformando el mundo.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LeganuxComponent',
  setup() {
    return {};
  }
});
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

h1 {
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 20px;
}

p {
  color: #666;
  font-size: 1.2rem;
}
</style>
```