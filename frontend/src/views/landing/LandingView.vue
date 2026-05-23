<script setup>
import { ref } from 'vue'
import { useSocialStore } from '../../stores/social'
import LandingLayout from '../../layouts/LandingLayout.vue'
import HeroSection from './HeroSection.vue'
import AboutSection from './AboutSection.vue'
import SejarahSection from './SejarahSection.vue'
import KegiatanSection from './KegiatanSection.vue'
import GaleriSection from './GaleriSection.vue'
import SosialSection from './SosialSection.vue'
import AnggotaSection from './AnggotaSection.vue'
import GalleryModal from './GalleryModal.vue'
import MemberProfileModal from './MemberProfileModal.vue'
import RegisterModal from './RegisterModal.vue'

const socialStore = useSocialStore()

const activeGalleryItem = ref(null)
const activeMemberProfile = ref(null)
const showToast = ref(false)
const toastMessage = ref('')
const isRegisterOpen = ref(false)

const openRegisterModal = () => {
  isRegisterOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeRegisterModal = () => {
  isRegisterOpen.value = false
  document.body.style.overflow = 'auto'
}

const handleRegisterSuccess = (data) => {
  handleToast(`Selamat bergabung, ${data.name}! Pendaftaran berhasil dikirim. Pengurus akan menghubungi via WhatsApp. 🌿`)
}

const openGalleryModal = (item) => {
  activeGalleryItem.value = item
  document.body.style.overflow = 'hidden'
}

const closeGalleryModal = () => {
  activeGalleryItem.value = null
  document.body.style.overflow = 'auto'
}

const openMemberProfile = (nameOrPost) => {
  let name = ''
  let avatar = '/member_portrait_1_1777344189794.png'
  let role = 'Anggota FORMULA'

  if (typeof nameOrPost === 'string') {
    name = nameOrPost
  } else if (nameOrPost && nameOrPost.user) {
    name = nameOrPost.user
    avatar = nameOrPost.avatar
    role = nameOrPost.role
  }

  const firstWord = name.split(' ')[0].toLowerCase()
  const foundUser = Object.values(socialStore.users).find(u =>
    u.name.toLowerCase() === name.toLowerCase() ||
    u.nickname?.toLowerCase() === firstWord
  )

  if (foundUser) {
    activeMemberProfile.value = {
      name: foundUser.name,
      nickname: foundUser.nickname,
      role: foundUser.title,
      avatar: foundUser.avatar,
      age: foundUser.age,
      hobby: foundUser.hobby,
      quote: foundUser.quote,
      education: foundUser.education,
      instagram: foundUser.instagram,
      joinedSince: foundUser.joinedSince
    }
  } else {
    activeMemberProfile.value = {
      name,
      nickname: name.split(' ')[0],
      role,
      avatar,
      age: '22 Tahun',
      hobby: 'Organisasi & Musik',
      quote: 'Bersama FORMULA, berkontribusi aktif melahirkan kegunaan konkret bagi dusun tercinta.',
      education: 'Mahasiswa Universitas Lokal',
      instagram: `@${name.split(' ')[0].toLowerCase()}_ngampon`,
      joinedSince: '2024'
    }
  }
  document.body.style.overflow = 'hidden'
}

const closeMemberProfile = () => {
  activeMemberProfile.value = null
  document.body.style.overflow = 'auto'
}

const handleToast = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 4000)
}
</script>

<template>
  <LandingLayout>
    <HeroSection @open-profile="openMemberProfile" @open-register="openRegisterModal" />

    <AboutSection />
    <SejarahSection />
    <KegiatanSection />
    <GaleriSection @open-gallery="openGalleryModal" />
    <SosialSection @open-profile="openMemberProfile" @toast="handleToast" />
    <AnggotaSection @open-profile="openMemberProfile" />

    <section class="relative overflow-hidden bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div class="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 p-8 sm:p-12 lg:p-20 text-center shadow-2xl shadow-slate-900/40">
          <div class="absolute top-0 right-0 w-80 h-80 sm:w-[500px] sm:h-[500px] bg-emerald-500/10 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
          <div class="absolute bottom-0 left-0 w-80 h-80 bg-green-500/10 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

          <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 24px 24px;"></div>

          <div class="relative z-10 space-y-6 sm:space-y-8">
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="text-[10px] sm:text-xs font-black text-emerald-400 uppercase tracking-[0.2em]">Bergabunglah Sekarang</span>
            </div>

            <h2 class="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-white leading-tight">
              Muda, Beriman,<br>
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400">Berprestasi.</span>
            </h2>

            <p class="text-sm sm:text-base lg:text-lg text-white/60 max-w-xl sm:max-w-2xl mx-auto leading-relaxed font-medium">
              Mari bergabung dalam pergerakan pemuda Dusun Ngampon yang lebih cerdas, religius, dan berdaya saing secara global.
            </p>

            <div class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-2">
              <button
                @click="openRegisterModal"
                class="group relative px-8 sm:px-12 py-4 sm:py-5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/25 hover:-translate-y-0.5 active:scale-95 transition-all overflow-hidden cursor-pointer"
              >
                <span class="relative">DAFTAR SEKARANG</span>
              </button>
              <button
                class="px-8 sm:px-12 py-4 sm:py-5 bg-white/10 border border-white/20 hover:bg-white/20 text-white rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer"
              >
                HUBUNGI KAMI
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <transition name="toast">
      <div
        v-if="showToast"
        class="fixed bottom-6 right-4 left-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 px-5 py-4 bg-slate-900 border border-emerald-500/30 text-white rounded-2xl shadow-2xl shadow-slate-900/40 flex items-start gap-3"
      >
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0 mt-1"></span>
        <div class="flex-grow min-w-0">
          <p class="text-xs sm:text-sm font-bold leading-relaxed">{{ toastMessage }}</p>
        </div>
        <button @click="showToast = false" class="text-white/40 hover:text-white transition-colors cursor-pointer flex-shrink-0 ml-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
    </transition>

    <GalleryModal v-if="activeGalleryItem" :active-gallery-item="activeGalleryItem" @close="closeGalleryModal" />
    <MemberProfileModal v-if="activeMemberProfile" :active-member-profile="activeMemberProfile" @close="closeMemberProfile" />
    <RegisterModal :is-open="isRegisterOpen" @close="closeRegisterModal" @submit-success="handleRegisterSuccess" />
  </LandingLayout>
</template>

<style scoped>
.toast-enter-active { transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-leave-active { transition: all 0.2s ease-in; }
.toast-enter-from { opacity: 0; transform: translateY(20px) scale(0.95); }
.toast-leave-to { opacity: 0; transform: translateY(10px); }
</style>
