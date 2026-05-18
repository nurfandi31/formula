<script setup>
import { ref } from 'vue'
const props = defineProps({ exploreUsers: Array })
const emit = defineEmits(['viewProfile'])
const search = ref('')
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-300">
    <div class="text-center max-w-lg mx-auto mb-10">
      <h2 class="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">Cari Anggota FORMULA</h2>
      <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Jelajahi Profil dan Kontak Pengurus Dusun Ngampon</p>
    </div>

    <div class="max-w-md mx-auto">
      <div class="relative">
        <span class="absolute inset-y-0 left-4 flex items-center text-slate-500">🔍</span>
        <input
          v-model="search"
          type="text"
          placeholder="Cari berdasarkan nama, peran, atau sebutan..."
          class="w-full pl-11 pr-5 py-3.5 bg-slate-900/50 border border-slate-800 rounded-2xl text-xs font-bold text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
        >
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 max-w-3xl mx-auto">
      <div
        v-for="user in exploreUsers"
        :key="user.email"
        @click="emit('viewProfile', user)"
        class="p-5 bg-slate-900/20 border border-slate-850 rounded-xl flex items-center gap-4 hover:border-emerald-500/20 hover:bg-slate-900/40 transition-all cursor-pointer group"
      >
        <img :src="user.avatar" class="w-12 h-12 rounded-xl object-cover border border-slate-800 group-hover:scale-105 transition-transform">
        <div class="flex-1 truncate">
          <h4 class="text-xs font-black text-white group-hover:text-emerald-400 transition-colors truncate">{{ user.name }}</h4>
          <p class="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">{{ user.title }}</p>
          <p class="text-[9px] text-slate-500 truncate mt-1">🌿 Bergabung sejak {{ user.joinedSince }}</p>
        </div>
        <span class="text-xs text-slate-600 group-hover:text-emerald-500 transition-colors">➡️</span>
      </div>

      <div v-if="exploreUsers.length === 0" class="col-span-2 text-center py-12 text-slate-500 text-xs font-black uppercase tracking-widest">
        ❌ Anggota tidak ditemukan.
      </div>
    </div>
  </div>
</template>
