<script setup>
defineProps({
  activeTab: String,
  currentUser: Object
})
const emit = defineEmits(['update:activeTab', 'logout', 'open-notifications'])
const set = (tab) => emit('update:activeTab', tab)

</script>

<template>
  <aside class="hidden md:flex w-72 border-r border-slate-800 bg-slate-950 p-6 flex-col fixed inset-y-0 left-0 z-30">
    <div class="mb-10 flex items-center gap-3">
      <router-link to="/" class="flex items-center gap-2 group">
        <div class="w-10 h-10 bg-linear-to-tr from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
          <span class="text-white text-base">🌿</span>
        </div>
        <div>
          <h2 class="text-base font-black tracking-tight leading-none text-white group-hover:text-emerald-400 transition-colors">FORMULA</h2>
          <p class="text-[9px] font-black tracking-widest text-emerald-500 uppercase mt-1">Dusun Ngampon</p>
        </div>
      </router-link>
    </div>

    <nav class="space-y-2 flex-1">
      <button @click="set('feed')" :class="['w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer', activeTab === 'feed' ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent']">
        <span class="text-lg">🏠</span><span>Beranda</span>
      </button>
      <button @click="set('explore')" :class="['w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer', activeTab === 'explore' ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent']">
        <span class="text-lg">🔍</span><span>Cari Anggota</span>
      </button>
      <button @click="set('create')" :class="['w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer', activeTab === 'create' ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent']">
        <span class="text-lg">➕</span><span>Buat Kiriman</span>
      </button>
      <button @click="set('messages')" :class="['w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer', activeTab === 'messages' ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent']">
        <span class="text-lg">💬</span><span>Kotak Pesan</span>
      </button>
      <button @click="set('profile')" :class="['w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer', activeTab === 'profile' ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent']">
        <span class="text-lg">👤</span><span>Profil Saya</span>
      </button>
      <button @click="set('edit-profile')" :class="['w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer', activeTab === 'edit-profile' ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent']">
        <span class="text-lg">⚙️</span><span>Edit Profil</span>
      </button>
    </nav>

    <div class="border-t border-slate-850 pt-6 mt-auto space-y-4">
      <div class="flex items-center justify-between px-2">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex-shrink-0">
            <img :src="currentUser?.avatar" class="w-full h-full object-cover" alt="Avatar">
          </div>
          <div class="flex-1 truncate">
            <h4 class="text-xs font-black text-white leading-tight truncate">{{ currentUser?.name }}</h4>
            <p class="text-[9px] font-black text-emerald-500 uppercase tracking-wider mt-0.5">{{ currentUser?.title }}</p>
          </div>
        </div>
        <button @click="emit('open-notifications')" class="relative flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 transition-colors cursor-pointer active:scale-90">
          <span class="text-base">❤️</span>
          <span v-if="currentUser?.notifications?.filter(n => !n.read).length > 0" class="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-950 animate-pulse"></span>
        </button>
      </div>
      <button @click="emit('logout')" class="w-full flex items-center gap-4 px-4 py-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs font-black uppercase tracking-wider text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer">
        <span class="text-base">🚪</span><span>Keluar Sesi</span>
      </button>
    </div>
  </aside>
</template>
