<script setup>
import { useToast } from '../composables/useToast'
import { useRouter } from 'vue-router'
import { onMounted, watch } from 'vue'

const { toasts, removeToast, flushPendingToast } = useToast()
const router = useRouter()

// Flush saat pertama kali mount (misalnya setelah navigasi fresh)
onMounted(() => {
  flushPendingToast()
})

// Flush setiap kali route berubah (SPA navigation)
watch(() => router.currentRoute.value.path, () => {
  setTimeout(() => {
    flushPendingToast()
  }, 50) // sedikit delay agar DOM halaman baru sudah render
})

const icons = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ'
}

const styles = {
  success: {
    wrapper: 'bg-white border-l-4 border-emerald-500 shadow-emerald-100',
    icon: 'bg-emerald-500 text-white',
    title: 'text-emerald-700',
    text: 'text-slate-600'
  },
  error: {
    wrapper: 'bg-white border-l-4 border-rose-500 shadow-rose-100',
    icon: 'bg-rose-500 text-white',
    title: 'text-rose-700',
    text: 'text-slate-600'
  },
  warning: {
    wrapper: 'bg-white border-l-4 border-amber-500 shadow-amber-100',
    icon: 'bg-amber-500 text-white',
    title: 'text-amber-700',
    text: 'text-slate-600'
  },
  info: {
    wrapper: 'bg-white border-l-4 border-blue-500 shadow-blue-100',
    icon: 'bg-blue-500 text-white',
    title: 'text-blue-700',
    text: 'text-slate-600'
  }
}

const titles = {
  success: 'Berhasil',
  error: 'Gagal',
  warning: 'Perhatian',
  info: 'Info'
}
</script>

<template>
  <!-- Toast Container: pojok kanan atas, fixed, z-index tinggi -->
  <div class="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none" style="max-width: 380px; min-width: 300px;">
    <TransitionGroup
      name="toast"
      tag="div"
      class="flex flex-col gap-3"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto"
      >
        <div
          :class="[
            'flex items-start gap-3 p-4 rounded-lg shadow-xl border border-slate-100',
            styles[toast.type]?.wrapper || styles.success.wrapper
          ]"
        >
          <!-- Icon -->
          <div
            :class="[
              'flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black',
              styles[toast.type]?.icon || styles.success.icon
            ]"
          >
            {{ icons[toast.type] || icons.success }}
          </div>

          <!-- Text -->
          <div class="flex-1 min-w-0 pt-0.5">
            <p :class="['text-[10px] font-black uppercase tracking-widest leading-none mb-1', styles[toast.type]?.title || styles.success.title]">
              {{ titles[toast.type] || 'Berhasil' }}
            </p>
            <p :class="['text-xs font-semibold leading-snug', styles[toast.type]?.text || styles.success.text]">
              {{ toast.message }}
            </p>
          </div>

          <!-- Close button -->
          <button
            @click="removeToast(toast.id)"
            class="flex-shrink-0 text-slate-300 hover:text-slate-500 transition-colors text-xs font-black leading-none cursor-pointer mt-0.5"
          >
            ✕
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
/* Animasi masuk dari kanan atas */
.toast-enter-active {
  transition: all 0.35s cubic-bezier(0.21, 1.02, 0.73, 1);
}
.toast-leave-active {
  transition: all 0.25s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(80px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(80px) scale(0.95);
}
.toast-move {
  transition: transform 0.3s ease;
}
</style>
