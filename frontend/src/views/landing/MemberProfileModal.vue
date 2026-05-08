<script setup>
defineProps({
  activeMemberProfile: {
    type: Object,
    required: true
  }
})

defineEmits(['close'])
</script>

<template>
  <transition name="fade-zoom">
    <div class="fixed inset-0 z-55 flex items-center justify-center p-4 sm:p-6">
      <div @click="$emit('close')" class="absolute inset-0 bg-slate-900/85 backdrop-blur-md"></div>
      
      <div class="relative w-full max-w-sm bg-white rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-y-auto max-h-[85vh] sm:max-h-[90vh] scrollbar-hide z-10 animate-in zoom-in-95 duration-300 border border-emerald-100/50">
        <div class="h-28 sm:h-32 bg-linear-to-tr from-emerald-500 via-green-500 to-teal-600 relative">
          <button @click="$emit('close')" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-emerald-700 transition-all cursor-pointer flex items-center justify-center border border-white/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        
        <div class="relative -mt-12 sm:-mt-16 flex justify-center">
          <div class="w-24 h-24 sm:w-32 sm:h-32 rounded-full p-1 sm:p-1.5 bg-white shadow-2xl">
            <img :src="activeMemberProfile.avatar" class="w-full h-full rounded-full object-cover" :alt="activeMemberProfile.name">
          </div>
        </div>
        
        <div class="p-6 sm:p-8 pt-4 sm:pt-6 text-center space-y-4 sm:space-y-6">
          <div class="space-y-1">
            <h3 class="text-lg sm:text-2xl font-black text-slate-900 leading-tight">{{ activeMemberProfile.name }}</h3>
            <p class="text-[9px] sm:text-xs font-black text-emerald-600 uppercase tracking-widest">{{ activeMemberProfile.role }}</p>
          </div>
          
          <p class="text-xs text-slate-500 italic font-medium leading-relaxed bg-slate-50 px-4 py-3 sm:px-5 sm:py-4 rounded-2xl relative">
            "{{ activeMemberProfile.quote }}"
          </p>
          
          <div class="grid grid-cols-2 gap-3 sm:gap-4 text-left pt-1">
            <div class="p-3 bg-slate-50/50 rounded-xl sm:rounded-2xl space-y-1">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider">Usia</span>
              <p class="text-xs font-black text-slate-700">{{ activeMemberProfile.age }}</p>
            </div>
            <div class="p-3 bg-slate-50/50 rounded-xl sm:rounded-2xl space-y-1">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider">Bergabung</span>
              <p class="text-xs font-black text-slate-700">Sejak {{ activeMemberProfile.joinedSince }}</p>
            </div>
            <div class="p-3 bg-slate-50/50 rounded-xl sm:rounded-2xl space-y-1 col-span-2">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider">Pendidikan / Status</span>
              <p class="text-xs font-black text-slate-700 truncate">{{ activeMemberProfile.education }}</p>
            </div>
            <div class="p-3 bg-slate-50/50 rounded-xl sm:rounded-2xl space-y-1 col-span-2">
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider">Hobi & Ketertarikan</span>
              <p class="text-xs font-black text-slate-700 truncate">{{ activeMemberProfile.hobby }}</p>
            </div>
          </div>
          
          <a :href="'https://instagram.com/' + activeMemberProfile.instagram.replace('@', '')" target="_blank" class="block w-full py-3.5 sm:py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-colors cursor-pointer shadow-xl shadow-emerald-600/10">
            IKUTI INSTAGRAM {{ activeMemberProfile.instagram }}
          </a>
        </div>
      </div>
    </div>
  </transition>
</template>
