<template>
  <Layout>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
  </Layout>
  
</template>
<script setup lang="js">
import Layout from '../layout/layout.vue'
</script>
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
