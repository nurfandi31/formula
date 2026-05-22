<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AdminLayout from '../../layouts/AdminLayout.vue'
import AdminMobileLayout from './mobile/AdminMobileLayout.vue'
import DesktopActivities from './desktop/Activities.vue'
import MobileActivities from './mobile/Activities.vue'

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
      <MobileActivities />
    </AdminMobileLayout>
    <AdminLayout v-else>
      <DesktopActivities />
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
