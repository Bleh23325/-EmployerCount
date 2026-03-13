<script setup>
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { onMounted } from 'vue'

const authStore = useAuthStore()

onMounted(() => {
  authStore.checkAuth()
})
</script>

<template>
  <RouterView />
</template>

<style>
@import '@/assets/main.css';
</style>
