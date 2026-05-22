<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSocialStore } from '../../../stores/social'
import { useToast } from '../../../composables/useToast'

const router = useRouter()
const route = useRoute()
const socialStore = useSocialStore()
const { queueToast } = useToast()

const showMoreMenu = ref(false)

const handleLogout = () => {
  const name = socialStore.currentUser?.name || 'Admin'
  socialStore.logout()
  queueToast(`Sampai jumpa, ${name}! Anda telah keluar. 👋`, 'info')
  router.push('/login')
  showMoreMenu.value = false
}

const navigateTo = (path) => {
  router.push(path)
  showMoreMenu.value = false
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans select-none antialiased pb-20">
    <header class="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
          <span class="text-white text-xs">🌿</span>
        </div>
        <div>
          <h2 class="text-xs font-black tracking-tight leading-none text-slate-800">FORMULA</h2>
          <p class="text-[8px] font-black tracking-widest text-emerald-600 uppercase mt-0.5">Dusun Ngampon</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-slate-100">
          <img :src="socialStore.currentUser?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=admin'" class="w-full h-full object-cover">
        </div>
      </div>
    </header>

    <main class="flex-grow px-4 py-6">
      <slot />
    </main>

    <nav class="fixed bottom-0 inset-x-0 h-16 bg-white/80 backdrop-blur-md border-t border-slate-200/80 flex items-center justify-around px-2 z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
      <button 
        @click="navigateTo('/admin')" 
        :class="['flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors cursor-pointer', route.path === '/admin' ? 'text-emerald-600' : 'text-slate-400']"
      >
        <font-awesome-icon icon="chart-pie" class="text-lg" />
        <span class="text-[8px] font-black uppercase tracking-wider">Dashboard</span>
      </button>

      <button 
        @click="navigateTo('/admin/keuangan')" 
        :class="['flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors cursor-pointer', route.path === '/admin/keuangan' ? 'text-emerald-600' : 'text-slate-400']"
      >
        <font-awesome-icon icon="dollar-sign" class="text-lg" />
        <span class="text-[8px] font-black uppercase tracking-wider">Keuangan</span>
      </button>

      <button 
        @click="navigateTo('/admin/kegiatan')" 
        :class="['flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors cursor-pointer', route.path === '/admin/kegiatan' ? 'text-emerald-600' : 'text-slate-400']"
      >
        <font-awesome-icon icon="calendar" class="text-lg" />
        <span class="text-[8px] font-black uppercase tracking-wider">Agenda</span>
      </button>

      <button 
        @click="navigateTo('/admin/absensi')" 
        :class="['flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors cursor-pointer', route.path === '/admin/absensi' ? 'text-emerald-600' : 'text-slate-400']"
      >
        <font-awesome-icon icon="file-alt" class="text-lg" />
        <span class="text-[8px] font-black uppercase tracking-wider">Absensi</span>
      </button>

      <button 
        @click="showMoreMenu = true" 
        :class="['flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors cursor-pointer', (route.path === '/admin/anggota' || route.path === '/admin/landing' || route.path === '/admin/akses-login' || showMoreMenu) ? 'text-emerald-600' : 'text-slate-400']"
      >
        <font-awesome-icon icon="bars" class="text-lg" />
        <span class="text-[8px] font-black uppercase tracking-wider">Lainnya</span>
      </button>
    </nav>

    <div v-if="showMoreMenu" class="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-end justify-center transition-all duration-300">
      <div class="fixed inset-0" @click="showMoreMenu = false"></div>
      
      <div class="bg-white w-full rounded-t-3xl p-6 space-y-4 relative z-10 shadow-2xl border-t border-slate-100 animate-in slide-in-from-bottom duration-300">
        <div class="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-2"></div>
        
        <div class="flex justify-between items-center pb-2 border-b border-slate-100">
          <h3 class="text-xs font-black uppercase tracking-widest text-slate-400">Menu Administrator</h3>
          <button @click="showMoreMenu = false" class="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
        </div>

        <div class="grid grid-cols-3 gap-2.5 py-2">
          <button 
            @click="navigateTo('/admin/anggota')" 
            :class="['p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.97] text-center', route.path === '/admin/anggota' ? 'bg-emerald-50 border-emerald-250 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100']"
          >
            <font-awesome-icon icon="users" class="text-lg" />
            <span class="text-[8px] font-black uppercase tracking-wider leading-tight">Kelola Pengurus</span>
          </button>

          <button 
            @click="navigateTo('/admin/akses-login')" 
            :class="['p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.97] text-center', route.path === '/admin/akses-login' ? 'bg-emerald-50 border-emerald-250 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100']"
          >
            <font-awesome-icon icon="key" class="text-lg" />
            <span class="text-[8px] font-black uppercase tracking-wider leading-tight">Akses Login</span>
          </button>

          <button 
            @click="navigateTo('/admin/landing')" 
            :class="['p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.97] text-center', route.path === '/admin/landing' ? 'bg-emerald-50 border-emerald-250 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100']"
          >
            <font-awesome-icon icon="cogs" class="text-lg" />
            <span class="text-[8px] font-black uppercase tracking-wider leading-tight">Landing Page</span>
          </button>
        </div>

        <button 
          @click="handleLogout" 
          class="w-full py-3.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer text-center"
        >
          Logout Sesi
        </button>
      </div>
    </div>
  </div>
</template>
