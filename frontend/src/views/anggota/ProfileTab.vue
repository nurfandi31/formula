<script setup>
defineProps({
  currentUser: Object,
  myPosts: Array
})
const emit = defineEmits(['editProfile', 'logout', 'editPost', 'goCreate'])
</script>

<template>
  <div class="space-y-8 animate-in fade-in duration-300">
    <div class="bg-slate-900/20 border border-slate-850 rounded-xl p-6 sm:p-10 flex flex-col md:flex-row gap-6 md:gap-10 items-center">
      <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-linear-to-tr from-emerald-500 via-green-500 to-teal-500">
        <div class="w-full h-full rounded-full border-4 border-slate-950 overflow-hidden bg-slate-900 shadow-xl">
          <img :src="currentUser?.avatar" class="w-full h-full object-cover">
        </div>
      </div>

      <div class="flex-1 text-center md:text-left space-y-4">
        <div class="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <h2 class="text-xl font-black text-white leading-none">{{ currentUser?.name }}</h2>
          <div class="flex gap-2">
            <button @click="emit('editProfile')" class="px-4 py-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-white transition-all cursor-pointer">Edit Profil</button>
            <button @click="emit('logout')" class="px-4 py-1.5 bg-rose-500/10 border border-rose-500/25 hover:bg-rose-500 rounded-xl text-[9px] font-black uppercase tracking-widest text-rose-400 hover:text-white transition-all cursor-pointer">Keluar</button>
          </div>
        </div>

        <div class="flex justify-center md:justify-start gap-8 font-bold text-xs uppercase tracking-wider text-slate-400">
          <div><span class="text-white font-black text-sm">{{ myPosts.length }}</span> Kiriman</div>
          <div><span class="text-white font-black text-sm">124</span> Pengikut</div>
          <div><span class="text-white font-black text-sm">82</span> Mengikuti</div>
        </div>

        <div class="space-y-1 text-xs text-slate-400 leading-relaxed font-medium">
          <p class="text-emerald-500 font-black uppercase tracking-widest text-[9px]">{{ currentUser?.title }}</p>
          <p class="italic text-slate-300">"{{ currentUser?.quote }}"</p>
          <div class="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 pt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <span>🎓 {{ currentUser?.education }}</span>
            <span>🏆 Hobi: {{ currentUser?.hobby }}</span>
            <span>📱 {{ currentUser?.instagram }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-4">
      <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-900 pb-2">Koleksi Kiriman Anda</h3>
      <div class="grid grid-cols-3 gap-3 md:gap-5">
        <div
          v-for="post in myPosts"
          :key="post.id"
          @click="emit('editPost', post)"
          class="aspect-square bg-slate-900 rounded-2xl overflow-hidden relative border border-slate-850/50 cursor-pointer group shadow-md"
        >
          <img :src="post.image" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-slate-950/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 sm:gap-6 text-white font-black text-xs sm:text-sm transition-all duration-300">
            <div class="flex items-center gap-1.5">❤️ {{ post.likes }}</div>
            <div class="flex items-center gap-1.5">💬 {{ post.commentsList.length }}</div>
          </div>
        </div>
      </div>

      <div v-if="myPosts.length === 0" class="text-center py-16 bg-slate-900/10 border border-dashed border-slate-850 rounded-xl space-y-4">
        <span class="text-4xl">📸</span>
        <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest">Belum Ada Kiriman Foto</h4>
        <p class="text-[10px] text-slate-500 max-w-xs mx-auto leading-normal">Karya, kegiatan, dan ungkapan batin Anda di dusun Ngampon akan terekam di sini.</p>
        <button @click="emit('goCreate')" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[9px] font-black uppercase tracking-widest cursor-pointer">Mulai Berbagi</button>
      </div>
    </div>
  </div>
</template>
