<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSocialStore } from '../../stores/social'

const emit = defineEmits(['openProfile', 'openRegister'])
const socialStore = useSocialStore()

const boardMembers = computed(() => {
  const allUsers = Object.values(socialStore.users)
  if (allUsers.length > 0) {
    return allUsers.map(u => ({
      name: u.name,
      role: u.title || (u.role === 'admin' ? 'Ketua Umum' : 'Anggota FORMULA'),
      image: u.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + u.name
    }))
  }
  return [
    { name: 'Fandi Ahmad', role: 'Ketua Umum', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin' },
    { name: 'Aditya Pratama', role: 'Sekretaris I', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya' },
    { name: 'Rina Amalia', role: 'Bendahara Umum', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina' }
  ]
})

const searchRoster = computed(() => {
  const allUsers = Object.values(socialStore.users)
  if (allUsers.length > 0) {
    return allUsers.map(u => ({
      name: u.name,
      role: u.title || (u.role === 'admin' ? 'Ketua Umum' : 'Anggota FORMULA'),
      instagram: u.instagram || `https://instagram.com/${u.name.split(' ')[0].toLowerCase()}_ngampon`,
      image: u.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + u.name
    }))
  }
  return [
    { name: 'Fandi Ahmad', role: 'Ketua Umum', instagram: 'https://instagram.com/fandi_ngampon', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin' },
    { name: 'Aditya Pratama', role: 'Sekretaris I', instagram: 'https://instagram.com/aditya_ngampon', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya' },
    { name: 'Rina Amalia', role: 'Bendahara Umum', instagram: 'https://instagram.com/rina_ngampon', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina' }
  ]
})

const searchQuery = ref('')
const showSearchResults = ref(false)
const searchRef = ref(null)

const filteredMembers = computed(() => {
  if (searchQuery.value.trim() === '') return []
  return searchRoster.value.filter(m =>
    m.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const currentSlide = ref(0)
let slideInterval = null

const nextSlide = () => {
  if (boardMembers.value.length === 0) return
  currentSlide.value = (currentSlide.value + 1) % boardMembers.value.length
}

const prevSlide = () => {
  if (boardMembers.value.length === 0) return
  currentSlide.value = (currentSlide.value - 1 + boardMembers.value.length) % boardMembers.value.length
}

const resetInterval = () => {
  if (slideInterval) clearInterval(slideInterval)
  slideInterval = setInterval(nextSlide, 5000)
}

const handleClickOutside = (e) => {
  if (searchRef.value && !searchRef.value.contains(e.target)) {
    showSearchResults.value = false
  }
}

onMounted(() => {
  resetInterval()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header id="home" class="scroll-mt-20 relative overflow-hidden bg-white">
    <div class="absolute inset-0 bg-gradient-to-br from-emerald-50/60 via-white to-white -z-10"></div>
    <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-emerald-100/40 via-green-50/20 to-transparent blur-[100px] -z-10 translate-x-1/4 -translate-y-1/4 rounded-full"></div>
    <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-teal-50/30 to-transparent blur-[80px] -z-10 rounded-full"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8 sm:pt-4 sm:pb-12 lg:pt-6 lg:pb-16">
      <div class="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-20 items-center">

        <div class="space-y-6 sm:space-y-7 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">

          <div class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200/60 rounded-full shadow-sm">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-[10px] sm:text-xs font-black text-emerald-700 uppercase tracking-[0.2em]">Generasi 18 · 2026</span>
          </div>

          <div class="space-y-3">
            <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl font-black text-slate-900 leading-tight tracking-tight">
              {{ socialStore.landingConfig.heroTitle || 'FORMULA' }}
            </h1>
            <p class="text-sm sm:text-base lg:text-sm xl:text-base text-slate-500 max-w-lg leading-relaxed font-medium mx-auto lg:mx-0">
              {{ socialStore.landingConfig.heroSubtitle || 'Forum Muda Mudi Islam Dusun Ngampon — Muda, Beriman, Berprestasi.' }}
            </p>
          </div>

          <div ref="searchRef" class="relative w-full max-w-lg">
            <div class="flex items-center gap-3 px-4 py-3.5 bg-white rounded-2xl shadow-xl shadow-emerald-500/10 border border-slate-200/80 hover:border-emerald-300/60 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400 flex-shrink-0">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
              <input
                v-model="searchQuery"
                @focus="showSearchResults = true"
                type="text"
                placeholder="Cari anggota atau pengurus..."
                class="w-full bg-transparent border-none text-xs sm:text-sm font-semibold text-slate-700 placeholder-slate-400 focus:outline-none"
              >
              <button
                v-if="searchQuery"
                @click="searchQuery = ''; showSearchResults = false"
                class="text-slate-400 hover:text-slate-600 cursor-pointer w-5 h-5 rounded-full hover:bg-slate-100 flex items-center justify-center flex-shrink-0 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <transition name="search-drop">
              <div
                v-if="showSearchResults && filteredMembers.length > 0"
                class="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl shadow-emerald-500/15 border border-slate-100 overflow-hidden max-h-64 overflow-y-auto z-40 p-2"
              >
                <div v-for="member in filteredMembers" :key="member.name" class="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div class="flex items-center gap-3 cursor-pointer" @click="emit('openProfile', member.name); showSearchResults = false">
                    <img :src="member.image" class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover border border-slate-100 shadow-sm flex-shrink-0">
                    <div class="text-left">
                      <h5 class="text-xs font-black text-slate-900 leading-tight">{{ member.name }}</h5>
                      <p class="text-[9px] sm:text-[10px] font-black text-emerald-500 uppercase tracking-wider mt-0.5 leading-none">{{ member.role }}</p>
                    </div>
                  </div>
                  <a :href="member.instagram" target="_blank" class="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg font-black text-[9px] sm:text-[10px] uppercase tracking-wider transition-all cursor-pointer flex-shrink-0">
                    Sosmed 🔗
                  </a>
                </div>
              </div>
            </transition>
            <div
              v-if="showSearchResults && searchQuery && filteredMembers.length === 0"
              class="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl shadow-emerald-500/15 border border-slate-100 p-5 text-center text-xs font-bold text-slate-400 z-40"
            >
              Nama tidak ditemukan. Coba kata kunci lain! 🌿
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
            <button
              @click="emit('openRegister')"
              class="group relative flex-1 px-6 py-4 bg-emerald-600 rounded-2xl font-black text-sm text-white shadow-xl shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:scale-95 transition-all overflow-hidden cursor-pointer text-center"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span class="relative flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
                GABUNG FORMULA
              </span>
            </button>
            <button
              @click="document.getElementById('kegiatan')?.scrollIntoView({ behavior: 'smooth' })"
              class="flex-1 px-6 py-4 rounded-2xl font-black text-sm text-slate-700 bg-white shadow-lg shadow-slate-200/60 border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/30 hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer text-center"
            >
              Jelajahi Kegiatan →
            </button>
          </div>

          <div class="flex items-center gap-6 sm:gap-8 pt-2 w-full max-w-lg justify-center lg:justify-start">
            <div class="text-center">
              <p class="text-xl sm:text-2xl font-black text-slate-900">150+</p>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Anggota</p>
            </div>
            <div class="w-px h-8 bg-slate-200"></div>
            <div class="text-center">
              <p class="text-xl sm:text-2xl font-black text-slate-900">10</p>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Generasi</p>
            </div>
            <div class="w-px h-8 bg-slate-200"></div>
            <div class="text-center">
              <p class="text-xl sm:text-2xl font-black text-slate-900">48+</p>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Aksi Sosial</p>
            </div>
          </div>
        </div>

        <div class="relative order-1 lg:order-2 flex justify-center">
          <div class="hidden lg:flex absolute -top-3 -right-3 w-16 h-16 bg-white rounded-2xl z-20 shadow-xl shadow-emerald-500/15 items-center justify-center text-emerald-600 animate-float">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
          </div>
          <div class="hidden lg:flex absolute -bottom-4 -left-5 w-20 h-20 bg-white rounded-[2rem] z-20 shadow-xl shadow-emerald-500/15 items-center justify-center text-emerald-600 animate-bounce-slow">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
          </div>

          <div class="relative z-10 w-full max-w-[240px] sm:max-w-[280px] lg:max-w-[320px]">
            <div class="group/slider relative aspect-[3/4] w-full mx-auto rounded-2xl sm:rounded-[2rem] shadow-2xl shadow-emerald-500/20 overflow-hidden cursor-grab active:cursor-grabbing">
              <transition-group name="fade">
                <div
                  v-for="(member, index) in boardMembers"
                  :key="index + '-' + member.name"
                  v-show="currentSlide === index"
                  class="absolute inset-0 select-none"
                >
                  <img :src="member.image" class="w-full h-full object-cover pointer-events-none" :alt="member.name">
                  <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex flex-col justify-end p-6 sm:p-8 pointer-events-none">
                    <h4 class="text-xl sm:text-2xl font-black text-white leading-tight">{{ member.name }}</h4>
                    <p class="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-widest mt-1">{{ member.role }}</p>
                  </div>
                </div>
              </transition-group>

              <div class="absolute inset-x-3 sm:inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 z-10">
                <button @click="prevSlide(); resetInterval()" class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-emerald-600 transition-all cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <button @click="nextSlide(); resetInterval()" class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-emerald-600 transition-all cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>

              <div class="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 sm:gap-2">
                <button
                  v-for="(_, index) in boardMembers"
                  :key="'dot-' + index"
                  @click="currentSlide = index; resetInterval()"
                  :class="['rounded-full transition-all duration-300 cursor-pointer h-1.5 sm:h-2', currentSlide === index ? 'w-6 sm:w-8 bg-white' : 'w-1.5 sm:w-2 bg-white/40']"
                ></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.6s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}
.animate-float { animation: float 4s ease-in-out infinite; }
.animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite 1s; }

.search-drop-enter-active { transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
.search-drop-leave-active { transition: all 0.15s ease-in; }
.search-drop-enter-from { opacity: 0; transform: translateY(-8px) scale(0.97); }
.search-drop-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
