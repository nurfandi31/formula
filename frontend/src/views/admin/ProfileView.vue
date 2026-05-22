<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AdminLayout from '../../layouts/AdminLayout.vue'
import AdminMobileLayout from './mobile/AdminMobileLayout.vue'
import AdminProfile from './desktop/Profile.vue'

const isMobile = ref(false)
const checkScreen = () => { isMobile.value = window.innerWidth < 768 }

onMounted(() => { checkScreen(); window.addEventListener('resize', checkScreen) })
onUnmounted(() => window.removeEventListener('resize', checkScreen))
</script>

<template>
  <transition name="fade" mode="out-in">
    <AdminMobileLayout v-if="isMobile">
      <AdminProfile />
    </AdminMobileLayout>
    <AdminLayout v-else>
      <AdminProfile />
    </AdminLayout>
  </transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
