<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AdminLayout from '../../layouts/AdminLayout.vue'
import AdminMobileLayout from './mobile/AdminMobileLayout.vue'
import DesktopDashboard from './desktop/Dashboard.vue'
import MobileDashboard from './mobile/Dashboard.vue'

const isMobile = ref(false)

const checkScreen = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkScreen()
  window.addEventListener('resize', checkScreen)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreen)
})
</script>

<template>
  <transition name="fade" mode="out-in">
    <AdminMobileLayout v-if="isMobile">
      <MobileDashboard />
    </AdminMobileLayout>
    <AdminLayout v-else>
      <DesktopDashboard />
    </AdminLayout>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
