<script setup lang="ts">
import { RouterView } from 'vue-router'
import HomeHeader from '@/components/common/HomeHeader.vue'
import HomeFooter from '@/components/common/HomeFooter.vue'
</script>

<template>
  <div class="layout">
    <el-container>
      <el-header><HomeHeader /></el-header>
      <el-main><RouterView /></el-main>
      <el-footer><HomeFooter /></el-footer>
    </el-container>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
}
</style>
