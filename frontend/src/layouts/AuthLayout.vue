<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const currentSlide = ref(0)
const totalSlides = 2
let slideInterval = null

onMounted(() => {
  slideInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % totalSlides
  }, 6000)
})

onBeforeUnmount(() => {
  clearInterval(slideInterval)
})
</script>

<template>
  <div class="min-h-screen bg-[#fafbfc] flex lg:grid lg:grid-cols-12 overflow-hidden font-sans select-none">
    
    <!-- LEFT SIDE: FORM CONTAINER (Col span 5 on desktop) -->
    <div class="w-full lg:col-span-5 flex flex-col justify-between p-6 sm:p-10 md:p-12 bg-white relative z-10 shadow-xl lg:shadow-none min-h-screen overflow-y-auto">
      
      <!-- Top header logo -->
      <div class="flex items-center justify-between">
        <router-link to="/" class="inline-flex items-center gap-3 group">
          <div class="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:rotate-6 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-white">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
            </svg>
          </div>
          <div class="text-left">
            <span class="text-lg font-black tracking-tight text-emerald-600 block leading-none">FORMULA</span>
            <span class="text-[8px] font-bold text-slate-400 tracking-[0.2em] uppercase">Ngampon Youth</span>
          </div>
        </router-link>

        <router-link to="/" class="text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 tracking-wider flex items-center gap-1">
          <span>← KEMBALI</span>
        </router-link>
      </div>

      <!-- Main Slot Content (Form Card centered) -->
      <div class="my-auto py-8 max-w-md w-full mx-auto">
        <slot />
      </div>

      <!-- Footer note -->
      <div class="text-center lg:text-left text-[9px] font-bold text-slate-400 uppercase tracking-widest">
        © 2026 FORMULA DUSUN NGAMPON. ALL RIGHTS RESERVED.
      </div>
    </div>

    <!-- RIGHT SIDE: FEATURES SHOWCASE CAROUSEL (Col span 7 on desktop, hidden on mobile) -->
    <div class="hidden lg:flex lg:col-span-7 bg-slate-950 relative flex-col justify-center items-center overflow-hidden p-16">
      
      <!-- Decorative Backdrop Blurs -->
      <div class="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-500/10 blur-[150px] rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-[45rem] h-[45rem] bg-teal-500/10 blur-[150px] rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
      
      <!-- Abstract Dot Grid Pattern -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/40 via-slate-950 to-slate-950 pointer-events-none"></div>
      <div class="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

      <!-- Slides Container -->
      <div class="w-full max-w-2xl relative z-10 flex flex-col items-center">
        
        <!-- SLIDE 1: ADMIN PORTAL MOCKUP -->
        <transition name="slide-fade">
          <div v-show="currentSlide === 0" class="w-full flex flex-col items-center text-center space-y-8 absolute top-1/2 -translate-y-1/2">
            <div class="space-y-3 px-8">
              <span class="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">
                🛡️ Portal Pengurus
              </span>
              <h2 class="text-3xl font-black text-white leading-tight">Kelola Data Kepengurusan Secara Transparan</h2>
              <p class="text-slate-400 text-xs max-w-lg mx-auto font-medium leading-relaxed">
                Manajemen data pengurus, pencatatan kas organisasi secara real-time, pencatatan agenda rapat, hingga rekap absensi kehadiran otomatis.
              </p>
            </div>

            <!-- CSS Admin Dashboard Mockup View -->
            <div class="w-full bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl p-4 flex gap-4 text-left overflow-hidden h-[240px]">
              <!-- Sidebar mock -->
              <div class="w-32 bg-slate-950/60 rounded-xl p-2.5 flex flex-col gap-1.5 border border-white/5 flex-shrink-0">
                <div class="w-8 h-8 bg-emerald-500/15 rounded-lg flex items-center justify-center text-emerald-400 text-sm font-black mb-3">F</div>
                <div class="h-3 w-16 bg-emerald-500/25 rounded-md"></div>
                <div class="h-3 w-12 bg-white/5 rounded-md mt-1"></div>
                <div class="h-3 w-14 bg-white/5 rounded-md"></div>
                <div class="h-3 w-10 bg-white/5 rounded-md"></div>
                <div class="h-3 w-16 bg-white/5 rounded-md"></div>
              </div>

              <!-- Main Mock Panel -->
              <div class="flex-grow flex flex-col gap-4">
                <!-- Header mock -->
                <div class="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <div class="h-4 w-32 bg-white/10 rounded-md"></div>
                  <div class="w-6 h-6 rounded-full bg-slate-700"></div>
                </div>

                <!-- Stats Grid mock -->
                <div class="grid grid-cols-3 gap-2">
                  <div class="p-2.5 bg-slate-950/40 rounded-xl border border-white/5 space-y-1">
                    <span class="text-[7px] font-bold text-slate-500 uppercase tracking-wider block">Total Kas</span>
                    <span class="text-[10px] font-black text-emerald-400">Rp 2.450.000</span>
                  </div>
                  <div class="p-2.5 bg-slate-950/40 rounded-xl border border-white/5 space-y-1">
                    <span class="text-[7px] font-bold text-slate-500 uppercase tracking-wider block">Kehadiran</span>
                    <span class="text-[10px] font-black text-sky-400">92%</span>
                  </div>
                  <div class="p-2.5 bg-slate-950/40 rounded-xl border border-white/5 space-y-1">
                    <span class="text-[7px] font-bold text-slate-500 uppercase tracking-wider block">Agenda Rapat</span>
                    <span class="text-[10px] font-black text-amber-400">4 Kegiatan</span>
                  </div>
                </div>

                <!-- List/Graph mock -->
                <div class="flex-grow bg-slate-950/40 rounded-xl border border-white/5 p-3 flex flex-col gap-1.5 justify-center">
                  <div class="flex justify-between items-center text-[8px] border-b border-white/5 pb-1">
                    <span class="font-bold text-white">Kas Mingguan Bersama</span>
                    <span class="text-emerald-400 font-bold">+Rp 350.000</span>
                  </div>
                  <div class="flex justify-between items-center text-[8px] border-b border-white/5 pb-1">
                    <span class="font-bold text-white">Konsumsi Rapat Bulanan</span>
                    <span class="text-rose-400 font-bold">-Rp 120.000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- SLIDE 2: MEMBER VIEW MOCKUP -->
        <transition name="slide-fade">
          <div v-show="currentSlide === 1" class="w-full flex flex-col items-center text-center space-y-8 absolute top-1/2 -translate-y-1/2">
            <div class="space-y-3 px-8">
              <span class="px-3 py-1 bg-teal-500/10 text-teal-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-teal-500/20">
                📱 Portal Anggota
              </span>
              <h2 class="text-3xl font-black text-white leading-tight">Akses Anggota Yang Terbuka & Informatif</h2>
              <p class="text-slate-400 text-xs max-w-lg mx-auto font-medium leading-relaxed">
                Pantau iuran kas pribadi Anda, cek riwayat kehadiran absensi rapat, serta lihat daftar kegiatan pemuda terkini kapan saja.
              </p>
            </div>

            <!-- CSS Phone Layout Mockup -->
            <div class="w-[200px] h-[240px] bg-slate-900 border-4 border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col text-left font-sans">
              <!-- Phone Notch -->
              <div class="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-3 bg-slate-800 rounded-b-lg z-20"></div>
              
              <!-- Screen content -->
              <div class="flex-grow p-3 pt-6 flex flex-col gap-3">
                <!-- User Profile info card -->
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-black text-white">AP</div>
                  <div>
                    <span class="text-[9px] font-bold text-white block">Aditya Pratama</span>
                    <span class="text-[7px] text-emerald-400 uppercase tracking-widest font-black leading-none">Anggota Aktif</span>
                  </div>
                </div>

                <!-- Personal Cash status card -->
                <div class="p-2.5 bg-slate-950/60 rounded-xl border border-white/5 space-y-1">
                  <span class="text-[7px] text-slate-500 font-bold block">Status Kas Anda:</span>
                  <div class="flex justify-between items-center">
                    <span class="text-[10px] font-black text-white">Lunas</span>
                    <span class="text-[8px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">✓ OK</span>
                  </div>
                </div>

                <!-- Recent Activities mock -->
                <div class="flex-grow bg-slate-950/40 rounded-xl p-2 border border-white/5 flex flex-col gap-1.5">
                  <span class="text-[7px] text-slate-500 font-bold block">Agenda Mendatang:</span>
                  <div class="p-1 bg-slate-900 rounded-md text-[7px] font-bold flex justify-between items-center text-slate-200 border-l-2 border-emerald-500">
                    <span>Futsal Pemuda</span>
                    <span class="text-[6px] text-slate-400">Sabtu, 24 Mei</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- Slide dots navigation -->
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        <button 
          v-for="index in totalSlides" 
          :key="index"
          @click="currentSlide = index - 1"
          :class="[
            'w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer',
            currentSlide === index - 1 ? 'bg-emerald-500 w-4' : 'bg-white/20 hover:bg-white/40'
          ]"
        ></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Slide Fade transitions */
.slide-fade-enter-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-fade-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}
</style>
