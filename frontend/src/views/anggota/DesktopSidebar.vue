<script setup>
import { useRoute } from 'vue-router'

defineProps({
  activeTab: String,
  currentUser: Object
})
const emit = defineEmits(['update:activeTab', 'logout', 'open-notifications'])
const set = (tab) => emit('update:activeTab', tab)

const menuItems = [
  { id: 'feed', name: 'Beranda', icon: 'home' },
  { id: 'explore', name: 'Cari Anggota', icon: 'users' },
  { id: 'create', name: 'Buat Kiriman', icon: 'plus' },
  { id: 'messages', name: 'Kotak Pesan', icon: 'comments' },
  { id: 'profile', name: 'Profil Saya', icon: 'user' },
  { id: 'edit-profile', name: 'Edit Profil', icon: 'cog' }
]
</script>

<template>
  <aside class="border border-slate-900 bg-slate-950 flex-col fixed inset-y-4 left-4 z-30 flex transition-all duration-300 ease-in-out rounded-lg shadow-2xl overflow-hidden w-64 pt-8">
    <!-- Sidebar Brand Header -->
    <div class="mb-8 px-8">
      <router-link to="/" class="flex items-center gap-2 group">
        <div class="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
          <span class="text-white text-base">🌿</span>
        </div>
        <div class="animate-in fade-in duration-300">
          <h2 class="text-base font-black tracking-tight leading-none text-white group-hover:text-emerald-400 transition-colors">FORMULA</h2>
          <p class="text-[9px] font-black tracking-widest text-emerald-500 uppercase mt-1">Dusun Ngampon</p>
        </div>
      </router-link>
    </div>

    <!-- Navigation Menu Items -->
    <nav class="space-y-0 flex-1 w-full flex flex-col pb-4">
      <button 
        v-for="item in menuItems" 
        :key="item.id" 
        @click="set(item.id)"
        :class="[
          'w-full flex items-center gap-4 text-xs font-black uppercase tracking-wider transition-all cursor-pointer px-8 py-4 border-l-4 text-left',
          activeTab === item.id 
            ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500 font-black'
            : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
        ]"
      >
        <font-awesome-icon :icon="item.icon" class="text-lg w-5 h-5 flex-shrink-0" />
        <span class="animate-in fade-in duration-300">{{ item.name }}</span>
      </button>
    </nav>
  </aside>
</template>
