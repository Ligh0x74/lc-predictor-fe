<template>
  <div class="header">
    <el-button type="primary" text @click="home">Home</el-button>
    <el-button type="primary" text style="position: relative; margin-left: auto">Login</el-button>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'

const home = () => {
  router.push('/contest')
}
</script>

<style scoped>
.header {
  width: 100%;
  display: inline-flex;
  padding: 20px 0 20px 0;
}
</style>
