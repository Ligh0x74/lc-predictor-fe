<template>
  <canvas style="position: fixed; z-index: -1"></canvas>
  <HomeView />
</template>

<script setup lang="ts">
import('./assets/ts/canvas')
import HomeView from './views/HomeView.vue'
</script>

<style scoped></style>
