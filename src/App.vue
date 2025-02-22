<template>
  <DefaultLayout>
    <router-view></router-view>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from './layouts/DefaultLayout.vue'
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
</style>
