<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSocialStore } from '../stores/social'

const props = defineProps({
  isCollapsed: Boolean,
  isMobileOpen: Boolean
})

const emit = defineEmits(['closeMobile'])

const route = useRoute()
const router = useRouter()
const socialStore = useSocialStore()

const currentUser = computed(() => socialStore.currentUser)

const menuItems = [
  { name: 'Dashboard', path: '/admin', icon: 'chart-pie' },
  { name: 'Keuangan Kas', path: '/admin/keuangan', icon: 'dollar-sign' },
  { name: 'Agenda & Rapat', path: '/admin/kegiatan', icon: 'calendar' },
  { name: 'Absensi Anggota', path: '/admin/absensi', icon: 'file-alt' },
  { name: 'Kelola Pengurus', path: '/admin/anggota', icon: 'users' },
  { name: 'Landing Page', path: '/admin/landing', icon: 'cogs' }
]

const handleLogout = () => {
  socialStore.logout()
  router.push('/login')
}
</script>

<template>
  <aside :class="[
    'border-r border-slate-900 bg-slate-950 flex-col fixed inset-y-0 left-0 z-30 flex transition-all duration-300 ease-in-out',
    isCollapsed ? 'w-20 p-4 items-center' : 'w-72 p-6',
    isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
  ]">
    <div :class="['flex items-center gap-3', isCollapsed ? 'mb-8' : 'mb-10']">
      <router-link to="/" @click="emit('closeMobile')" class="flex items-center gap-2 group">
        <div class="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
          <span class="text-white text-base">🌿</span>
        </div>
        <div v-if="!isCollapsed" class="animate-in fade-in duration-300">
          <h2 class="text-base font-black tracking-tight leading-none text-white group-hover:text-emerald-400 transition-colors">FORMULA</h2>
          <p class="text-[9px] font-black tracking-widest text-emerald-500 uppercase mt-1">Dusun Ngampon</p>
        </div>
      </router-link>
    </div>

    <nav class="space-y-2 flex-1 w-full">
      <router-link 
        v-for="item in menuItems" 
        :key="item.path" 
        :to="item.path"
        @click="emit('closeMobile')"
        :class="[
          'flex items-center gap-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border',
          isCollapsed ? 'w-12 h-12 justify-center mx-auto' : 'w-full px-4 py-3.5',
          route.path === item.path ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
        ]"
      >
        <font-awesome-icon :icon="item.icon" :class="[isCollapsed ? 'text-lg' : 'text-lg w-5 h-5']" />
        <span v-if="!isCollapsed" class="animate-in fade-in duration-300">{{ item.name }}</span>
      </router-link>
    </nav>

    <div :class="['border-t border-slate-900 pt-6 mt-auto space-y-4 w-full', isCollapsed ? 'items-center flex flex-col' : '']">
      <div :class="['flex items-center gap-3', isCollapsed ? 'justify-center px-0' : 'px-2']">
        <div class="w-10 h-10 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex-shrink-0">
          <img :src="currentUser?.avatar" class="w-full h-full object-cover" alt="Avatar">
        </div>
        <div v-if="!isCollapsed" class="flex-1 truncate animate-in fade-in duration-300">
          <h4 class="text-xs font-black text-white leading-tight truncate">{{ currentUser?.name }}</h4>
          <p class="text-[9px] font-black text-emerald-500 uppercase tracking-wider mt-0.5">{{ currentUser?.title }}</p>
        </div>
      </div>
      <button 
        @click="handleLogout" 
        :class="[
          'flex items-center bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs font-black uppercase tracking-wider text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer',
          isCollapsed ? 'w-12 h-12 justify-center mx-auto' : 'w-full px-4 py-3.5 gap-4'
        ]"
      >
        <font-awesome-icon icon="sign-out-alt" class="text-base" />
        <span v-if="!isCollapsed" class="animate-in fade-in duration-300">Keluar Sesi</span>
      </button>
    </div>
  </aside>
</template>
