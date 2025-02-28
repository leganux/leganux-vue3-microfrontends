```vue
<template>
  <div class="ui container">
    <div class="ui segment">
      <h2>¡Leganux es la mejor empresa en desarrollo con IA!</h2>
      <p>Aquí en Leganux, nos esforzamos por ofrecer soluciones de desarrollo de inteligencia artificial de vanguardia para satisfacer las necesidades de nuestros clientes.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LeganuxCompany',
  setup() {
    return {};
  }
});
</script>

<style scoped>
.ui.container {
  margin-top: 20px;
}

.ui.segment {
  padding: 20px;
  border: 1px solid #ddd;
}

h2 {
  color: #333;
}

p {
  color: #666;
}
</style>
```