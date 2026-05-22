<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSocialStore } from './stores/social'
import { useToast } from './composables/useToast'
import ToastNotification from './components/ToastNotification.vue'

const router = useRouter()
const socialStore = useSocialStore()
const { queueToast } = useToast()

// Timeout ketidakaktifan: 2 jam (2 * 60 * 60 * 1000 ms)
const INACTIVITY_TIMEOUT = 2 * 60 * 60 * 1000 
const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']

let checkInterval = null

const updateLastActivity = () => {
  if (socialStore.currentUser) {
    localStorage.setItem('formula_last_activity', Date.now().toString())
  }
}

const checkInactivity = () => {
  if (!socialStore.currentUser) return

  const lastActivity = localStorage.getItem('formula_last_activity')
  if (lastActivity) {
    const elapsed = Date.now() - parseInt(lastActivity, 10)
    if (elapsed >= INACTIVITY_TIMEOUT) {
      socialStore.logout()
      queueToast('Sesi Anda berakhir karena tidak ada aktivitas. 🔒', 'warning')
      router.push('/login')
    }
  } else {
    updateLastActivity()
  }
}

onMounted(() => {
  updateLastActivity()

  // Daftarkan listener aktivitas
  ACTIVITY_EVENTS.forEach(event => {
    window.addEventListener(event, updateLastActivity, { passive: true })
  })

  // Cek ketidakaktifan setiap 15 detik
  checkInterval = setInterval(checkInactivity, 15000)
})

onUnmounted(() => {
  ACTIVITY_EVENTS.forEach(event => {
    window.removeEventListener(event, updateLastActivity)
  })
  if (checkInterval) {
    clearInterval(checkInterval)
  }
})
</script>

<template>
  <router-view />
  <ToastNotification />
</template>

<style>
/* Global styles if any */
</style>
