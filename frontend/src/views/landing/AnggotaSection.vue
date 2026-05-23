<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSocialStore } from '../../stores/social'

const emit = defineEmits(['openProfile'])
const socialStore = useSocialStore()

const fallbackMembers = [
  { name: 'Fandi Ahmad', role: 'Ketua Umum', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin' },
  { name: 'Aditya Pratama', role: 'Sekretaris I', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya' },
  { name: 'Rina Amalia', role: 'Bendahara Umum', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina' }
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
}

const prevSlide = () => {
  if (members.value.length === 0) return
  currentSlide.value = (currentSlide.value - 1 + members.value.length) % members.value.length
}

const resetInterval = () => {
  if (slideInterval) clearInterval(slideInterval)
  slideInterval = setInterval(nextSlide, 5000)
}

onMounted(() => { resetInterval() })
onUnmounted(() => { if (slideInterval) clearInterval(slideInterval) })
</script>

<template>
  <section id="anggota" class="scroll-mt-24 relative overflow-hidden bg-gradient-to-b from-white via-emerald-50/10 to-white">
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_50%,rgba(16,185,129,0.04),transparent_40%)]"></div>
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_50%,rgba(20,184,166,0.04),transparent_40%)]"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">

      <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20 space-y-4">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200/60 rounded-full mb-2">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span class="text-[10px] sm:text-xs font-black text-emerald-600 uppercase tracking-[0.2em]">Anggota FORMULA</span>
        </div>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight">
          Pilar Kekuatan
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500">Pergerakan Kami</span>
        </h2>
        <p class="text-slate-500 font-medium text-sm sm:text-base lg:text-lg leading-relaxed">
          Kenali jajaran pengurus inti serta anggota spotlight hebat di balik berjalannya setiap rencana aksi kolaborasi positif kami.
        </p>
      </div>

      <div class="grid lg:grid-cols-12 gap-6 lg:gap-10 items-stretch">

        <div class="lg:col-span-7 bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl shadow-slate-100/80">
          <div class="mb-5 sm:mb-6">
            <h3 class="text-xl sm:text-2xl font-black text-slate-900">Barisan Pengurus</h3>
            <p class="text-xs sm:text-sm text-slate-400 font-medium mt-1">Hover untuk navigasi antar profil</p>
          </div>

          <div class="relative group/slider">
            <div class="relative rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing" style="aspect-ratio: 4/5;">
              <transition-group name="fade">
                <div
                  v-for="(member, index) in members"
                  :key="index + '-' + member.name"
                  v-show="currentSlide === index"
                  class="absolute inset-0 select-none"
                >
                  <img :src="member.image" class="w-full h-full object-cover pointer-events-none" :alt="member.name">
                  <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex flex-col justify-end p-6 sm:p-8 pointer-events-none">
                    <h4 class="text-lg sm:text-2xl font-black text-white leading-tight">{{ member.name }}</h4>
                    <p class="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-widest mt-1">{{ member.role }}</p>
                  </div>
                </div>
              </transition-group>

              <div class="absolute inset-x-3 sm:inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 z-10">
                <button @click="prevSlide(); resetInterval()" class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-emerald-600 transition-all cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <button @click="nextSlide(); resetInterval()" class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-emerald-600 transition-all cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>

              <div class="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 sm:gap-2">
                <button
                  v-for="(_, index) in members"
                  :key="'dot-' + index"
                  @click="currentSlide = index; resetInterval()"
                  :class="['rounded-full transition-all duration-300 cursor-pointer h-1.5 sm:h-2', currentSlide === index ? 'w-6 sm:w-8 bg-white' : 'w-1.5 sm:w-2 bg-white/40']"
                ></button>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-5 flex flex-col gap-5">

          <div class="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100/80 flex-grow">
            <div class="flex items-center justify-between mb-6 sm:mb-8">
              <div>
                <div class="w-10 h-1 bg-emerald-500 rounded-full mb-3"></div>
                <h3 class="text-lg sm:text-xl font-black text-slate-900">Spotlight Anggota</h3>
              </div>
              <span class="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-wider">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                AKTIF
              </span>
            </div>

            <div class="space-y-4 sm:space-y-5">
              <div
                v-for="member in members"
                :key="member.name"
                @click="emit('openProfile', member.name)"
                class="flex items-center gap-3 sm:gap-4 group cursor-pointer p-2.5 sm:p-3 rounded-2xl hover:bg-slate-50 transition-all"
              >
                <div class="relative flex-shrink-0">
                  <img :src="member.image" class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-slate-100 shadow-md transition-all duration-300 group-hover:scale-105">
                  <div class="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  </div>
                </div>
                <div class="flex-grow min-w-0">
                  <h4 class="text-sm sm:text-base font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight truncate">{{ member.name }}</h4>
                  <p class="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-[0.15em] mt-0.5">{{ member.role }}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-slate-300 group-hover:text-emerald-500 transition-colors flex-shrink-0"><path d="m9 18 6-6-6-6"/></svg>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl shadow-emerald-600/25 text-white">
            <p class="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-4">Statistik FORMULA</p>
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <p class="text-2xl sm:text-3xl font-black">150+</p>
                <p class="text-[9px] sm:text-[10px] font-black text-emerald-200 uppercase tracking-widest mt-1">Anggota</p>
              </div>
              <div class="border-x border-white/20">
                <p class="text-2xl sm:text-3xl font-black">48</p>
                <p class="text-[9px] sm:text-[10px] font-black text-emerald-200 uppercase tracking-widest mt-1">Aksi</p>
              </div>
              <div>
                <p class="text-2xl sm:text-3xl font-black">10</p>
                <p class="text-[9px] sm:text-[10px] font-black text-emerald-200 uppercase tracking-widest mt-1">Generasi</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.6s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
