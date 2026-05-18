<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSocialStore } from '../../stores/social'

const emit = defineEmits(['openProfile'])
const socialStore = useSocialStore()

const fallbackMembers = [
  { name: 'Andi Pratama', role: 'Ketua', image: '/member_portrait_1_1777344189794.png' },
  { name: 'Laila Sari', role: 'Sekretaris', image: '/member_portrait_2_1777344210087.png' },
  { name: 'Rizky Ramadhan', role: 'Humas', image: '/member_portrait_3_1777354146065.png' }
]

const members = computed(() => {
  const allUsers = Object.values(socialStore.users)
  if (allUsers.length > 0) {
    return allUsers.map(u => ({
      name: u.name,
      role: u.title || (u.role === 'admin' ? 'Administrator' : 'Anggota FORMULA'),
      image: u.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + u.name
    }))
  }
  return fallbackMembers
})

const currentSlide = ref(0)
let slideInterval = null

const nextSlide = () => {
  if (members.value.length === 0) return
  currentSlide.value = (currentSlide.value + 1) % members.value.length
  resetInterval()
}

const prevSlide = () => {
  if (members.value.length === 0) return
  currentSlide.value = (currentSlide.value - 1 + members.value.length) % members.value.length
  resetInterval()
}

const resetInterval = () => {
  if (slideInterval) clearInterval(slideInterval)
  slideInterval = setInterval(nextSlide, 5000)
}

onMounted(() => {
  resetInterval()
})

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval)
})
</script>

<template>
  <section id="anggota" class="scroll-mt-28 relative overflow-hidden bg-linear-to-b from-white via-emerald-50/10 to-white">
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_50%,rgba(16,185,129,0.04),transparent_40%)]"></div>
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_50%,rgba(20,184,166,0.04),transparent_40%)]"></div>
    <div class="absolute top-1/2 left-10 -translate-y-1/2 w-96 h-96 bg-emerald-100/15 blur-[130px] rounded-full -z-10"></div>
    <div class="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
      <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-20 space-y-4">
        <span class="text-xs font-black uppercase tracking-[0.25em] text-emerald-600">Anggota FORMULA</span>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight">
          Pilar Kekuatan <span class="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 via-green-600 to-teal-500">Pergerakan Kami</span>
        </h2>
        <p class="text-slate-500 font-medium text-base sm:text-lg leading-relaxed">
          Kenali jajaran pengurus inti serta anggota spotlight hebat di balik berjalannya setiap rencana aksi kolaborasi positif kami.
        </p>
      </div>

      <div class="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        <div class="lg:col-span-8 bg-white border border-slate-100/80 rounded-xl p-4 sm:p-8 md:p-12 shadow-xl shadow-slate-100 flex flex-col justify-between">
          <div class="max-w-md mx-auto w-full">
            <h3 class="text-xl sm:text-2xl font-black text-slate-900 mb-6 sm:mb-8">Barisan Pengurus</h3>
            
            <div class="relative p-2 sm:p-3 bg-slate-50 rounded-xl shadow-inner overflow-hidden group/slider">
              
              <div class="relative aspect-[4/5] rounded-xl overflow-hidden cursor-grab active:cursor-grabbing">
                <transition-group name="fade">
                  <div v-for="(member, index) in members" :key="member.name" 
                       v-show="currentSlide === index"
                       class="absolute inset-0 select-none">
                    <img :src="member.image" class="w-full h-full object-cover shadow-xl pointer-events-none" :alt="member.name">
                    <div class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 sm:p-10 pointer-events-none">
                       <h4 class="text-lg sm:text-2xl font-black text-white leading-tight">{{ member.name }}</h4>
                       <p class="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-widest mt-1">{{ member.role }}</p>
                    </div>
                  </div>
                </transition-group>

                <div class="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300">
                   <button @click="prevSlide" class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-emerald-600 transition-all cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                   </button>
                   <button @click="nextSlide" class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-emerald-600 transition-all cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                   </button>
                </div>
              </div>
              
              <div class="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 sm:gap-2">
                <button v-for="(_, index) in members" :key="index" 
                        @click="currentSlide = index; resetInterval()"
                        :class="['w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 cursor-pointer', currentSlide === index ? 'w-6 sm:w-8 bg-white' : 'bg-white/40']">
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-4 bg-white border border-slate-100/80 rounded-xl p-6 sm:p-10 shadow-xl shadow-slate-100 flex flex-col justify-between">
          <div>
            <div class="w-12 h-1 bg-emerald-600 rounded-full mb-6 sm:mb-8"></div>
            <h3 class="text-xl sm:text-2xl font-black text-slate-900 mb-6 sm:mb-10 flex items-center justify-between">
              Spotlight Anggota
              <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            </h3>
            <div class="space-y-6 sm:space-y-8">
              <div v-for="member in members" :key="member.name" @click="emit('openProfile', member.name)" class="flex items-center gap-4 sm:gap-5 group cursor-pointer">
                <div class="relative flex-shrink-0">
                  <img :src="member.image" class="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover border border-slate-50 shadow-xl transition-all duration-500 group-hover:scale-110">
                  <div class="absolute -bottom-1 -right-1 w-4.5 h-4.5 sm:w-5 sm:h-5 bg-emerald-600 rounded-full border border-white flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  </div>
                </div>
                <div>
                  <h4 class="text-sm sm:text-base font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">{{ member.name }}</h4>
                  <p class="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{{ member.role }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-8 sm:mt-12 pt-6 sm:pt-10 border-t border-slate-100 flex justify-between text-center">
             <div>
                <p class="text-lg sm:text-2xl font-black text-slate-900">150+</p>
                <p class="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Anggota</p>
             </div>
             <div>
                <p class="text-lg sm:text-2xl font-black text-slate-900">48</p>
                <p class="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Aksi</p>
             </div>
             <div>
                <p class="text-lg sm:text-2xl font-black text-slate-900">12</p>
                <p class="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Tim</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
