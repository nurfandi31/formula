<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSocialStore } from '../stores/social'

const isMobileMenuOpen = ref(false)
const activeSection = ref('home')
const isScrolled = ref(false)
const socialStore = useSocialStore()

const brandName = computed(() => {
  const setting = socialStore.landingSettings?.find(s => s.key === 'brand_name')
  return setting ? setting.value : 'FORMULA'
})

const menuItems = [
  { name: 'Home', id: 'home' },
  { name: 'About', id: 'about' },
  { name: 'Sejarah', id: 'sejarah' },
  { name: 'Kegiatan', id: 'kegiatan' },
  { name: 'Galeri', id: 'galeri' },
  { name: 'Sosial', id: 'sosial' },
  { name: 'Anggota', id: 'anggota' }
]

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
  document.body.style.overflow = 'auto'
  setTimeout(() => {
    const el = document.getElementById(id)
    if (el) {
      const navHeight = document.querySelector('nav')?.offsetHeight || 80
      const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 8
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
      activeSection.value = id
    }
  }, 50)
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  document.body.style.overflow = isMobileMenuOpen.value ? 'hidden' : 'auto'
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
  let current = menuItems[0].id
  for (const item of menuItems) {
    const el = document.getElementById(item.id)
    if (el) {
      const rect = el.getBoundingClientRect()
      if (rect.top <= 140) current = item.id
    }
  }
  activeSection.value = current
}

onMounted(() => {
  document.documentElement.classList.remove('dark')
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
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

      <nav
        :class="[
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/90 backdrop-blur-2xl shadow-lg shadow-slate-200/40 border-b border-emerald-100/60'
            : 'bg-white/70 backdrop-blur-xl border-b border-transparent'
        ]"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16 sm:h-18 lg:h-20">

            <router-link to="/" class="flex items-center gap-2.5 sm:gap-3 group flex-shrink-0">
              <div class="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 bg-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-white sm:w-5 sm:h-5 lg:w-6 lg:h-6">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                </svg>
              </div>
              <div>
                <span class="text-lg sm:text-xl lg:text-2xl font-black tracking-tight text-emerald-600 block leading-none">{{ brandName }}</span>
                <span class="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-[0.15em] sm:tracking-[0.2em] uppercase hidden xs:block">Ngampon Youth</span>
              </div>
            </router-link>

            <div class="hidden lg:flex items-center gap-6 xl:gap-8">
              <button
                v-for="item in menuItems"
                :key="item.id"
                @click="scrollToSection(item.id)"
                :class="activeSection === item.id
                  ? 'text-emerald-600 font-extrabold'
                  : 'text-slate-500 hover:text-emerald-600'"
                class="transition-colors uppercase text-[11px] tracking-widest font-black cursor-pointer relative py-1.5 group"
              >
                {{ item.name }}
                <span
                  :class="activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'"
                  class="absolute bottom-0 left-0 h-0.5 bg-emerald-500 rounded-full transition-all duration-300"
                ></span>
              </button>
            </div>

            <div class="flex items-center gap-3 sm:gap-4">
              <router-link
                to="/login"
                class="hidden sm:inline-flex items-center gap-2 bg-emerald-600 text-white px-4 sm:px-5 lg:px-7 py-2 sm:py-2.5 lg:py-3 rounded-xl lg:rounded-2xl font-black text-[11px] sm:text-xs hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
              >
                MASUK
              </router-link>

              <button
                @click="toggleMobileMenu"
                class="lg:hidden relative w-9 h-9 sm:w-10 sm:h-10 flex flex-col items-center justify-center gap-1.5 focus:outline-none cursor-pointer rounded-xl hover:bg-slate-50 transition-colors p-2"
              >
                <span :class="isMobileMenuOpen ? 'rotate-45 translate-y-[8px]' : ''" class="block w-5 h-0.5 bg-slate-700 rounded-full transition-all duration-300"></span>
                <span :class="isMobileMenuOpen ? 'opacity-0 scale-x-0' : ''" class="block w-5 h-0.5 bg-slate-700 rounded-full transition-all duration-300"></span>
                <span :class="isMobileMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''" class="block w-5 h-0.5 bg-slate-700 rounded-full transition-all duration-300"></span>
              </button>
            </div>
          </div>
        </div>

        <transition name="mobile-menu">
          <div v-if="isMobileMenuOpen" class="lg:hidden bg-white/95 backdrop-blur-2xl border-t border-slate-100">
            <div class="max-w-7xl mx-auto px-4 py-4 space-y-1">
              <button
                v-for="item in menuItems"
                :key="item.id"
                @click="scrollToSection(item.id)"
                :class="activeSection === item.id
                  ? 'text-emerald-600 bg-emerald-50 font-extrabold'
                  : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'"
                class="w-full transition-all uppercase text-xs tracking-widest font-black text-left px-4 py-3.5 rounded-xl cursor-pointer flex items-center justify-between"
              >
                {{ item.name }}
                <svg v-if="activeSection === item.id" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              </button>
              <div class="pt-2">
                <router-link to="/login" class="flex items-center justify-center bg-emerald-600 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/25">
                  MASUK KE DASHBOARD
                </router-link>
              </div>
            </div>
          </div>
        </transition>
      </nav>

      <div class="h-16 sm:h-18 lg:h-20"></div>

      <slot />

      <footer class="bg-slate-900 text-white pt-16 pb-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12 lg:mb-16">

            <div class="sm:col-span-2 space-y-5">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                  </svg>
                </div>
                <div>
                  <span class="text-xl font-black text-white block leading-none">{{ brandName }}</span>
                  <span class="text-[10px] font-bold text-emerald-400 tracking-[0.2em] uppercase">Ngampon Youth</span>
                </div>
              </div>
              <p class="text-slate-400 text-sm leading-relaxed font-medium max-w-sm">
                Wadah kreatifitas dan kolaborasi pemuda-pemudi Dusun Ngampon untuk membangun desa yang modern, religius, dan berdaya saing.
              </p>
              <div class="flex items-center gap-3">
                <a
                  v-for="link in socialMediaLinks"
                  :key="link.platform"
                  :href="link.url"
                  target="_blank"
                  class="w-9 h-9 rounded-xl bg-white/10 hover:bg-emerald-500 flex items-center justify-center transition-all duration-200 hover:scale-110"
                  :title="link.platform"
                >
                  <span class="text-xs font-black text-white">{{ link.platform.charAt(0) }}</span>
                </a>
              </div>
            </div>

            <div>
              <h4 class="font-black text-white uppercase tracking-widest text-xs mb-5">Navigasi</h4>
              <ul class="space-y-3">
                <li v-for="item in menuItems" :key="item.id">
                  <button @click="scrollToSection(item.id)" class="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer font-medium text-sm text-left">
                    {{ item.name }}
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 class="font-black text-white uppercase tracking-widest text-xs mb-5">Kontak</h4>
              <ul class="space-y-4">
                <li class="flex items-start gap-3">
                  <span class="text-emerald-400 mt-0.5 text-base flex-shrink-0">📍</span>
                  <span class="text-slate-400 font-medium text-sm leading-relaxed">Dusun Ngampon, Kec. Wonosari, Kab. Klaten</span>
                </li>
                <li class="flex items-start gap-3">
                  <span class="text-emerald-400 mt-0.5 text-base flex-shrink-0">📱</span>
                  <span class="text-slate-400 font-medium text-sm">+62 812-3456-789</span>
                </li>
                <li class="flex items-start gap-3">
                  <span class="text-emerald-400 mt-0.5 text-base flex-shrink-0">📧</span>
                  <span class="text-slate-400 font-medium text-sm">formula@ngampon.id</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p class="text-slate-500 text-xs font-bold">© 2026 FORUM MUDA MUDI ISLAM NGAMPON</p>
            <p class="text-slate-500 text-xs font-bold">MADE WITH 💚 BY THE COMMUNITY</p>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  max-height: 0;
}
.mobile-menu-enter-to,
.mobile-menu-leave-from {
  opacity: 1;
  max-height: 600px;
}
</style>
