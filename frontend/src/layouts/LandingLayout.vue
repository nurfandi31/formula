<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSocialStore } from '../stores/social'

const isMobileMenuOpen = ref(false)
const activeSection = ref('home')
const socialStore = useSocialStore()

const brandName = computed(() => {
  const setting = socialStore.landingSettings?.find(s => s.key === 'brand_name')
  return setting ? setting.value : 'FORMULA'
})

const menuItems = computed(() => {
  if (socialStore.landingNavbars && socialStore.landingNavbars.length > 0) {
    return socialStore.landingNavbars.map(nav => {
      let id = nav.url_path.replace('/#', '')
      if (id === 'hero') id = 'home' // map hero to home anchor
      return {
        name: nav.label,
        id: id
      }
    })
  }
  return [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Sejarah', id: 'sejarah' },
    { name: 'Kegiatan', id: 'kegiatan' },
    { name: 'Galeri', id: 'galeri' },
    { name: 'Sosial', id: 'sosial' },
    { name: 'Anggota', id: 'anggota' }
  ]
})

const socialMediaLinks = computed(() => {
  if (socialStore.landingSocialLinks && socialStore.landingSocialLinks.length > 0) {
    return socialStore.landingSocialLinks.map(link => ({
      platform: link.platform.charAt(0).toUpperCase() + link.platform.slice(1),
      url: link.url
    }))
  }
  return [
    { platform: 'Instagram', url: 'https://instagram.com/formula_ngampon' },
    { platform: 'YouTube', url: 'https://youtube.com/formula_ngampon' },
    { platform: 'WhatsApp', url: 'https://wa.me/628123456789' }
  ]
})

const scrollToSection = (id) => {
  isMobileMenuOpen.value = false
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    activeSection.value = id
  }
}

const handleScroll = () => {
  const sections = menuItems.value.map(item => item.id)
  let current = sections[0] || 'home'
  
  for (const section of sections) {
    const el = document.getElementById(section)
    if (el) {
      const rect = el.getBoundingClientRect()
      if (rect.top <= 140) {
        current = section
      }
    }
  }
  activeSection.value = current
}

onMounted(() => {
  document.documentElement.classList.remove('dark')
  window.addEventListener('scroll', handleScroll)
  handleScroll()
  
  // Dynamic color injection into document root!
  if (socialStore.landingSettings) {
    const primary = socialStore.landingSettings.find(s => s.key === 'primary_color')?.value
    const secondary = socialStore.landingSettings.find(s => s.key === 'secondary_color')?.value
    if (primary) document.documentElement.style.setProperty('--primary-color', primary)
    if (secondary) document.documentElement.style.setProperty('--secondary-color', secondary)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="min-h-screen font-sans">
    <div class="bg-[#fcfdfd] text-slate-900 min-h-screen">
      <!-- Landing Navbar -->
      <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-emerald-100 px-8 py-4">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
          <router-link to="/" class="flex items-center gap-3 group">
            <div class="w-11 h-11 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/20 group-hover:rotate-6 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            </div>
            <div>
              <span class="text-2xl font-black tracking-tight text-emerald-600 block leading-none">{{ brandName }}</span>
              <span class="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">Ngampon Youth</span>
            </div>
          </router-link>
          
          <div class="flex items-center gap-10">
            <!-- Desktop Menu -->
            <div class="hidden lg:flex items-center gap-8 text-sm font-bold tracking-wide">
              <button 
                v-for="item in menuItems" 
                :key="item.id" 
                @click="scrollToSection(item.id)"
                :class="activeSection === item.id ? 'text-emerald-600 font-extrabold' : 'text-slate-500 hover:text-emerald-600'"
                class="transition-colors uppercase text-xs tracking-widest font-black cursor-pointer relative py-1"
              >
                {{ item.name }}
                <span 
                  v-if="activeSection === item.id" 
                  class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full"
                ></span>
              </button>
            </div>
            
            <div class="flex items-center gap-6 border-l border-slate-200 pl-8">
              <router-link to="/login" class="hidden sm:inline-block bg-emerald-600 text-white px-7 py-3 rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/25 active:scale-95">
                MASUK
              </router-link>
              
              <!-- Mobile Hamburger -->
              <button 
                @click="isMobileMenuOpen = !isMobileMenuOpen" 
                class="lg:hidden p-2 text-slate-500 hover:text-emerald-600 focus:outline-none cursor-pointer"
              >
                <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Mobile Dropdown Menu -->
        <transition name="slide">
          <div 
            v-if="isMobileMenuOpen" 
            class="lg:hidden mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2 text-sm font-bold tracking-wide animate-in fade-in slide-in-from-top-4 duration-300"
          >
            <button 
              v-for="item in menuItems" 
              :key="item.id" 
              @click="scrollToSection(item.id)"
              :class="activeSection === item.id ? 'text-emerald-600 bg-emerald-50/50 font-extrabold' : 'text-slate-500 hover:text-emerald-600 hover:bg-slate-50/50'"
              class="transition-all uppercase text-xs tracking-widest font-black text-left px-4 py-3 rounded-xl cursor-pointer"
            >
              {{ item.name }}
            </button>
            <router-link to="/login" class="bg-emerald-600 text-white text-center py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/25 mt-2">
              MASUK
            </router-link>
          </div>
        </transition>
      </nav>

      <slot />

      <footer class="bg-white border-t border-slate-100 py-16 transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-8 grid lg:grid-cols-4 gap-12">
          <div class="lg:col-span-2 space-y-6">
            <div class="flex items-center gap-3">
               <div class="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
               </div>
               <span class="text-xl font-black text-slate-900">{{ brandName }} NGAMPON</span>
            </div>
            <p class="text-slate-500 max-w-sm leading-relaxed font-medium">Wadah kreatifitas dan kolaborasi pemuda-pemudi Dusun Ngampon untuk membangun desa yang modern dan religius.</p>
          </div>
          <div>
            <h4 class="font-black text-slate-900 uppercase tracking-widest text-xs mb-6">Navigasi</h4>
            <ul class="space-y-4 text-sm font-bold text-slate-400">
              <li v-for="item in menuItems" :key="item.id">
                <button @click="scrollToSection(item.id)" class="hover:text-emerald-600 transition-colors cursor-pointer text-left font-bold text-slate-400">
                  {{ item.name }}
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="font-black text-slate-900 uppercase tracking-widest text-xs mb-6">Sosial Media</h4>
            <ul class="space-y-4 text-sm font-bold text-slate-400">
              <li v-for="link in socialMediaLinks" :key="link.platform">
                <a :href="link.url" target="_blank" class="hover:text-emerald-600 transition-colors">{{ link.platform }}</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="max-w-7xl mx-auto px-8 mt-16 pt-8 border-t border-slate-50 text-center">
           <p class="text-slate-400 text-xs font-bold">&copy; 2026 FORUM MUDA MUDI ISLAM NGAMPON. MADE WITH LOVE BY THE COMMUNITY.</p>
        </div>
      </footer>
    </div>
  </div>
</template>
