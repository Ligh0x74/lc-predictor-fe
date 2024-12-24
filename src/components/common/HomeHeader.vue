<template>
  <div class="header">
    <el-button type="primary" text @click="home">Home</el-button>
    <el-button type="primary" text style="position: absolute; right: 0px">Login</el-button>
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
  padding: 20px 0 20px 0;
}
</style>
