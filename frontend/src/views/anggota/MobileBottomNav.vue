<script setup>
defineProps({
  activeTab: String,
  activeTabIndex: Number,
  currentUser: Object
})
const emit = defineEmits(['update:activeTab'])
const set = (tab) => emit('update:activeTab', tab)
</script>

<template>
  <nav class="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-950 border-t border-slate-900/60 px-2 flex items-center justify-between z-40 pb-2 shadow-[0_-8px_20px_rgba(0,0,0,0.6)]">
    <div
      class="absolute -top-6 w-14 h-14 bg-gradient-to-tr from-emerald-500 via-green-500 to-teal-400 rounded-full shadow-2xl shadow-emerald-500/50 transition-all duration-300 ease-out flex items-center justify-center border-4 border-slate-950 pointer-events-none"
      :style="{ left: `calc(${activeTabIndex * 20}% + 10%)`, transform: 'translateX(-50%)' }"
    >
      <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse absolute bottom-1.5"></span>
    </div>

    <button @click="set('feed')" class="flex-1 flex flex-col items-center justify-center h-full cursor-pointer relative">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
        :class="['transition-all duration-300 ease-out', activeTab === 'feed' ? '-translate-y-6 scale-110 text-white drop-shadow-[0_2px_6px_rgba(255,255,255,0.5)]' : 'text-slate-500']">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
      <span :class="['text-[8px] font-black uppercase tracking-widest transition-all duration-300 ease-out', activeTab === 'feed' ? 'opacity-100 translate-y-0 text-emerald-400' : 'opacity-0 translate-y-2 absolute']">Beranda</span>
    </button>

    <button @click="set('explore')" class="flex-1 flex flex-col items-center justify-center h-full cursor-pointer relative">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
        :class="['transition-all duration-300 ease-out', activeTab === 'explore' ? '-translate-y-6 scale-110 text-white drop-shadow-[0_2px_6px_rgba(255,255,255,0.5)]' : 'text-slate-500']">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <span :class="['text-[8px] font-black uppercase tracking-widest transition-all duration-300 ease-out', activeTab === 'explore' ? 'opacity-100 translate-y-0 text-emerald-400' : 'opacity-0 translate-y-2 absolute']">Cari</span>
    </button>

    <button @click="set('create')" class="flex-1 flex flex-col items-center justify-center h-full cursor-pointer relative">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
        :class="['transition-all duration-300 ease-out', activeTab === 'create' ? '-translate-y-6 scale-110 text-white drop-shadow-[0_2px_6px_rgba(255,255,255,0.5)]' : 'text-slate-500']">
        <rect x="2" y="2" width="20" height="20" rx="4"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/>
      </svg>
      <span :class="['text-[8px] font-black uppercase tracking-widest transition-all duration-300 ease-out', activeTab === 'create' ? 'opacity-100 translate-y-0 text-emerald-400' : 'opacity-0 translate-y-2 absolute']">Kiriman</span>
    </button>

    <button @click="set('messages')" class="flex-1 flex flex-col items-center justify-center h-full cursor-pointer relative">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
        :class="['transition-all duration-300 ease-out', activeTab === 'messages' ? '-translate-y-6 scale-110 text-white drop-shadow-[0_2px_6px_rgba(255,255,255,0.5)]' : 'text-slate-500']">
        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
      <span :class="['text-[8px] font-black uppercase tracking-widest transition-all duration-300 ease-out', activeTab === 'messages' ? 'opacity-100 translate-y-0 text-emerald-400' : 'opacity-0 translate-y-2 absolute']">Pesan</span>
    </button>

    <button @click="set('profile')" class="flex-1 flex flex-col items-center justify-center h-full cursor-pointer relative">
      <img :src="currentUser?.avatar" class="w-7 h-7 rounded-full object-cover transition-all duration-300 ease-out"
        :class="activeTab === 'profile' ? '-translate-y-6 scale-110 ring-2 ring-white drop-shadow-[0_2px_6px_rgba(255,255,255,0.5)]' : 'ring-1 ring-slate-600 opacity-60'">
      <span :class="['text-[8px] font-black uppercase tracking-widest transition-all duration-300 ease-out', activeTab === 'profile' ? 'opacity-100 translate-y-0 text-emerald-400' : 'opacity-0 translate-y-2 absolute']">Profil</span>
    </button>
  </nav>
</template>
