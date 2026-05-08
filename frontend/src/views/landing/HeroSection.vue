<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSocialStore } from '../../stores/social'

const emit = defineEmits(['openProfile', 'openRegister'])

const socialStore = useSocialStore()

const boardMembers = [
  { name: 'Andi Pratama', role: 'Ketua', image: '/member_portrait_1_1777344189794.png' },
  { name: 'Laila Sari', role: 'Sekretaris', image: '/member_portrait_2_1777344210087.png' },
  { name: 'Rizky Ramadhan', role: 'Humas', image: '/member_portrait_3_1777354146065.png' }
]

const searchRoster = [
  { name: 'Ahmad Fauzi', role: 'Ketua FORMULA (Generasi 10)', instagram: 'https://instagram.com/ahmadfauzi_ngampon', image: '/member_portrait_1_1777344189794.png' },
  { name: 'Siti Aminah', role: 'Sekretaris (Generasi 10)', instagram: 'https://instagram.com/sitiaminah_am', image: '/member_portrait_2_1777344210087.png' },
  { name: 'Andi Pratama', role: 'Humas & Olahraga (Generasi 10)', instagram: 'https://instagram.com/andipratama_real', image: '/member_portrait_3_1777354146065.png' },
  { name: 'Laila Sari', role: 'Divisi Humas (Generasi 10)', instagram: 'https://instagram.com/lailasari_official', image: '/member_portrait_4_1777354168316.png' },
  { name: 'Rizky Ramadhan', role: 'Anggota Aktif (Generasi 10)', instagram: 'https://instagram.com/rizky_ngampon', image: '/member_portrait_1_1777344189794.png' },
  { name: 'Budi Santoso', role: 'Anggota Aktif (Generasi 10)', instagram: 'https://instagram.com/budi_ngampon', image: '/member_portrait_3_1777354146065.png' },
  { name: 'Sari Puspita', role: 'Anggota Aktif (Generasi 10)', instagram: 'https://instagram.com/sari_ngampon', image: '/member_portrait_4_1777354168316.png' },
  { name: 'Zaki Mubarak', role: 'Anggota Aktif (Generasi 10)', instagram: 'https://instagram.com/zaki_ngampon', image: '/member_portrait_1_1777344189794.png' },
  { name: 'M. Yusuf Efendi', role: 'Ketua Pelopor (Generasi 1)', instagram: 'https://instagram.com/yusuf_ngampon', image: '/member_portrait_3_1777354146065.png' },
  { name: 'Aris Munandar', role: 'Ketua (Generasi 2)', instagram: 'https://instagram.com/aris_ngampon', image: '/member_portrait_1_1777344189794.png' },
  { name: 'Tri Utomo', role: 'Ketua (Generasi 3)', instagram: 'https://instagram.com/tri_ngampon', image: '/member_portrait_3_1777354146065.png' },
  { name: 'Heri Prasetyo', role: 'Ketua (Generasi 4)', instagram: 'https://instagram.com/heri_ngampon', image: '/member_portrait_1_1777344189794.png' },
  { name: 'Bagus Setyawan', role: 'Ketua (Generasi 5)', instagram: 'https://instagram.com/bagus_ngampon', image: '/member_portrait_3_1777354146065.png' },
  { name: 'Wahyu Nugroho', role: 'Ketua (Generasi 6)', instagram: 'https://instagram.com/wahyu_ngampon', image: '/member_portrait_1_1777344189794.png' },
  { name: 'Rian Hidayat', role: 'Ketua (Generasi 7)', instagram: 'https://instagram.com/rian_ngampon', image: '/member_portrait_3_1777354146065.png' },
  { name: 'Eko Prasetyo', role: 'Ketua (Generasi 8)', instagram: 'https://instagram.com/eko_ngampon', image: '/member_portrait_1_1777344189794.png' },
  { name: 'Fajar Ramadhan', role: 'Ketua (Generasi 9)', instagram: 'https://instagram.com/fajar_ngampon', image: '/member_portrait_3_1777354146065.png' }
]

const searchQuery = ref('')
const showSearchResults = ref(false)

const filteredMembers = computed(() => {
  if (searchQuery.value.trim() === '') return []
  return searchRoster.filter(m => 
    m.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const currentSlide = ref(0)
let slideInterval = null

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % boardMembers.length
  resetInterval()
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + boardMembers.length) % boardMembers.length
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
  <header id="home" class="scroll-mt-28 relative overflow-hidden pt-12 sm:pt-24 pb-16 sm:pb-32 bg-white">
    <div class="absolute inset-0 bg-white -z-20"></div>
    <div class="absolute inset-0 bg-linear-to-b from-emerald-50/30 via-white to-white -z-10"></div>
    <div class="absolute top-0 right-0 w-2/3 h-2/3 bg-linear-to-bl from-emerald-100/30 to-transparent blur-[120px] -z-10 rounded-full translate-x-1/4 -translate-y-1/4"></div>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
      <div class="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
        
        <div class="space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-left-12 duration-1000 flex flex-col items-center lg:items-start text-center lg:text-left">
          
          <div class="space-y-2">
            <h1 class="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-tight tracking-tight">
              {{ socialStore.landingConfig.heroTitle }} <span class="inline-flex items-center px-3 py-1 bg-emerald-600 text-white text-[10px] sm:text-xs font-black rounded-lg uppercase tracking-wider relative -top-3 sm:-top-5 align-middle select-none">Gen 18</span>
            </h1>
          </div>
          
          <p class="text-sm sm:text-base md:text-lg lg:text-xl text-slate-500 max-w-lg leading-relaxed font-medium">
            {{ socialStore.landingConfig.heroSubtitle }}
          </p>

          <div class="flex relative max-w-lg w-full bg-white rounded-2xl shadow-xl shadow-emerald-500/10 border border-slate-100 p-2 flex-col z-30">
            <div class="flex items-center gap-3 px-4 py-2.5 bg-slate-50/50 rounded-xl">
              <span class="text-slate-400 text-sm">🔍</span>
              <input v-model="searchQuery" @focus="showSearchResults = true" type="text" placeholder="Cari nama anggota atau pengurus..." class="w-full bg-transparent border-none text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-hidden">
              <button v-if="searchQuery" @click="searchQuery = ''; showSearchResults = false" class="text-slate-400 hover:text-slate-600 font-bold text-[10px] uppercase cursor-pointer">Bersihkan</button>
            </div>

            <transition name="fade-slide">
              <div v-if="showSearchResults && filteredMembers.length > 0" class="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl shadow-emerald-500/15 border border-slate-100 overflow-hidden max-h-60 overflow-y-auto z-40 p-2 space-y-1">
                <div v-for="member in filteredMembers" :key="member.name" class="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div class="flex items-center gap-3 cursor-pointer" @click="emit('openProfile', member.name); showSearchResults = false">
                    <img :src="member.image" class="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-sm">
                    <div class="text-left">
                      <h5 class="text-xs font-black text-slate-900 leading-tight">{{ member.name }}</h5>
                      <p class="text-[9px] font-black text-emerald-500 uppercase tracking-wider mt-0.5 leading-none">{{ member.role }}</p>
                    </div>
                  </div>
                  <a :href="member.instagram" target="_blank" class="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg font-black text-[9px] uppercase tracking-wider transition-all cursor-pointer">
                    Sosmed 🔗
                  </a>
                </div>
              </div>
            </transition>
            <div v-if="showSearchResults && searchQuery && filteredMembers.length === 0" class="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl shadow-emerald-500/15 border border-slate-100 p-6 text-center text-xs font-bold text-slate-400 z-40">
              Nama tidak ditemukan. Coba ketik nama lain! 🌿
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-3 pt-2 w-full max-w-lg">
            <button @click="emit('openRegister')" class="group relative px-2.5 sm:px-10 py-3.5 sm:py-5 bg-emerald-600 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs md:text-sm text-white shadow-xl shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all overflow-hidden cursor-pointer text-center whitespace-nowrap">
              <div class="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span class="relative">GABUNG FORMULA</span>
            </button>
            <button @click="document.getElementById('kegiatan')?.scrollIntoView({ behavior: 'smooth' })" class="px-2.5 sm:px-10 py-3.5 sm:py-5 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs md:text-sm text-slate-700 bg-white shadow-lg shadow-emerald-500/10 border border-slate-100 hover:bg-emerald-50/20 transition-all cursor-pointer text-center whitespace-nowrap">
              EKSPLORASI KEGIATAN
            </button>
          </div>
        </div>

        <div class="relative animate-in fade-in zoom-in duration-1000">
          <div class="hidden sm:flex absolute -top-6 -right-6 w-24 h-24 bg-white/80 backdrop-blur-md rounded-3xl z-20 shadow-2xl shadow-emerald-500/20 animate-bounce-slow items-center justify-center text-emerald-600">
             <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.7 1.5-1.7 1.5-2.7 0-1.5-1.3-2.8-3-2.8-1.5 0-2.8 1-3.2 2.4l-.4 1.1h-2.5l.4-1.1C10 5.8 12.3 4 15 4c2.8 0 5 2.2 5 5 0 1.5-1 3-2 4l-1 1h-2z"/><path d="M14 18h2v2h-2z"/><path d="M6 20h4"/><path d="M6 16h3"/><path d="M6 12h2"/></svg>
          </div>
          <div class="hidden sm:flex absolute -bottom-8 -left-10 w-28 h-28 bg-white/80 backdrop-blur-md rounded-[2.5rem] z-20 shadow-2xl shadow-emerald-500/20 animate-float items-center justify-center text-emerald-600">
             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
          </div>
          
          <div class="relative z-10 overflow-hidden group/slider max-w-sm mx-auto">
            <div class="relative aspect-[4/5] rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl shadow-emerald-500/25 overflow-hidden cursor-grab active:cursor-grabbing">
              <transition-group name="fade">
                <div v-for="(member, index) in boardMembers" :key="member.name" 
                     v-show="currentSlide === index"
                     class="absolute inset-0 select-none">
                  <img :src="member.image" class="w-full h-full object-cover pointer-events-none" :alt="member.name">
                  <div class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 sm:p-10 pointer-events-none">
                     <h4 class="text-xl sm:text-2xl font-black text-white leading-tight">{{ member.name }}</h4>
                     <p class="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-widest mt-1">{{ member.role }}</p>
                  </div>
                </div>
              </transition-group>

              <div class="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300">
                 <button @click="prevSlide" class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-emerald-600 transition-all cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                 </button>
                 <button @click="nextSlide" class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-emerald-600 transition-all cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                 </button>
              </div>
            </div>
            
            <div class="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 sm:gap-2">
              <button v-for="(_, index) in boardMembers" :key="index" 
                      @click="currentSlide = index; resetInterval()"
                      :class="['w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 cursor-pointer', currentSlide === index ? 'w-6 sm:w-8 bg-white' : 'bg-white/40']">
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </header>
</template>
