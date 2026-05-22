<script setup>
import { useRoute } from 'vue-router'

const props = defineProps({
  isCollapsed: Boolean,
  isMobileOpen: Boolean
})

const emit = defineEmits(['closeMobile'])

const route = useRoute()

const menuItems = [
  { name: 'Dashboard', path: '/admin', icon: 'chart-pie' },
  { name: 'Keuangan Kas', path: '/admin/keuangan', icon: 'dollar-sign' },
  { name: 'Agenda & Rapat', path: '/admin/kegiatan', icon: 'calendar' },
  { name: 'Absensi Anggota', path: '/admin/absensi', icon: 'file-alt' },
  { name: 'Kelola Pengurus', path: '/admin/anggota', icon: 'users' },
  { name: 'Akses Login', path: '/admin/akses-login', icon: 'key' },
  { name: 'Landing Page', path: '/admin/landing', icon: 'cogs' }
]
</script>

<template>
  <aside :class="[
    'border border-slate-900 bg-slate-950 flex-col fixed inset-y-4 left-4 z-30 flex transition-all duration-300 ease-in-out rounded-lg shadow-2xl overflow-hidden',
    isCollapsed ? 'w-20 pt-8 items-center' : 'w-64 pt-8',
    isMobileOpen ? 'translate-x-0' : '-translate-x-[120%] md:translate-x-0'
  ]">
    <div :class="['flex items-center gap-3', isCollapsed ? 'mb-8 px-0' : 'mb-8 px-8']">
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

    <nav class="space-y-0 flex-1 w-full flex flex-col pb-4">
      <router-link 
        v-for="item in menuItems" 
        :key="item.path" 
        :to="item.path"
        @click="emit('closeMobile')"
        :class="[
          'flex items-center gap-4 text-xs font-black uppercase tracking-wider transition-all cursor-pointer',
          isCollapsed ? 'w-12 h-12 justify-center mx-auto rounded-2xl mb-2' : 'w-full px-8 py-4 border-l-4',
          route.path === item.path 
            ? (isCollapsed ? 'bg-emerald-600/10 text-emerald-400' : 'bg-emerald-600/10 text-emerald-400 border-emerald-500')
            : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
        ]"
      >
        <font-awesome-icon :icon="item.icon" :class="[isCollapsed ? 'text-lg' : 'text-lg w-5 h-5']" />
        <span v-if="!isCollapsed" class="animate-in fade-in duration-300">{{ item.name }}</span>
      </router-link>
    </nav>
  </aside>
</template>
