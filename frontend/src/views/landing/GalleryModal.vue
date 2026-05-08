<script setup>
defineProps({
  activeGalleryItem: {
    type: Object,
    required: true
  }
})

defineEmits(['close'])
</script>

<template>
  <transition name="fade-zoom">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div @click="$emit('close')" class="absolute inset-0 bg-slate-900/80 backdrop-blur-md"></div>
      
      <div class="relative w-full max-w-4xl bg-white rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-y-auto md:overflow-hidden z-10 grid md:grid-cols-12 max-h-[85vh] md:max-h-[80vh] animate-in zoom-in-95 duration-300">
        
        <div class="md:col-span-7 relative h-56 sm:h-64 md:h-full bg-slate-100 overflow-hidden">
          <img :src="activeGalleryItem.image" class="w-full h-full object-cover" :alt="activeGalleryItem.title">
          <div class="absolute top-4 sm:top-6 left-4 sm:left-6 px-4 py-2 bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-black uppercase tracking-widest rounded-full">
            {{ activeGalleryItem.category }}
          </div>
        </div>
        
        <div class="md:col-span-5 p-5 sm:p-8 md:p-10 flex flex-col justify-between md:overflow-y-auto h-auto md:h-full">
          <div class="space-y-4 sm:space-y-6">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{{ activeGalleryItem.date }}</span>
              <button @click="$emit('close')" class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <div class="space-y-2.5">
              <h3 class="text-base sm:text-xl md:text-2xl font-black text-slate-900 leading-tight">{{ activeGalleryItem.title }}</h3>
              <div class="flex items-center gap-2 text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                <svg class="w-3.5 h-3.5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>{{ activeGalleryItem.location }}</span>
              </div>
            </div>
            
            <div class="h-px bg-slate-100"></div>
            
            <div class="space-y-1.5">
              <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400">Deskripsi Dokumentasi</h4>
              <p class="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                {{ activeGalleryItem.description }}
              </p>
            </div>
            
            <div class="space-y-1.5">
              <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400">Kontributor</h4>
              <div class="flex items-center gap-3">
                <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs">
                  {{ activeGalleryItem.author.substring(0,2).toUpperCase() }}
                </div>
                <div>
                  <h5 class="text-xs font-black text-slate-900">{{ activeGalleryItem.author }}</h5>
                  <p class="text-[9px] font-bold text-slate-400 uppercase">Dokumentator</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-slate-100 flex flex-wrap gap-1.5">
            <span v-for="tag in activeGalleryItem.tags" :key="tag" class="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-wider rounded-lg">
              #{{ tag }}
            </span>
          </div>
        </div>
        
      </div>
    </div>
  </transition>
</template>
