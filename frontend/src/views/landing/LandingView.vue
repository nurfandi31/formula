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
  handleToast(`Selamat bergabung, ${data.name}! Pendaftaran Anda berhasil dikirim. Pengurus akan menghubungi Anda via WhatsApp. 🌿`)
}

const memberProfiles = {
  'fandi': {
    name: 'Fandi Ahmad',
    nickname: 'Fandi',
    role: 'Ketua Umum',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin',
    age: '25 Tahun',
    hobby: 'Organisasi & Teknologi',
    quote: 'Keep the system clean and performant.',
    education: 'S1 Ilmu Komputer',
    instagram: '@fandi_ngampon',
    joinedSince: '2021'
  },
  'aditya': {
    name: 'Aditya Pratama',
    nickname: 'Aditya',
    role: 'Sekretaris I',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya',
    age: '22 Tahun',
    hobby: 'Membaca',
    quote: 'Tertib administrasi untuk kesuksesan bersama.',
    education: 'D3 Administrasi',
    instagram: '@aditya_ngampon',
    joinedSince: '2023'
  },
  'rina': {
    name: 'Rina Amalia',
    nickname: 'Rina',
    role: 'Bendahara Umum',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina',
    age: '23 Tahun',
    hobby: 'Memasak',
    quote: 'Transparansi keuangan adalah kunci kepercayaan.',
    education: 'S1 Akuntansi',
    instagram: '@rina_ngampon',
    joinedSince: '2022'
  }
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

  // Dynamic lookup in socialStore.users
  const foundUser = Object.values(socialStore.users).find(u => 
    u.name.toLowerCase() === name.toLowerCase() || 
    u.nickname.toLowerCase() === firstWord
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
      name: name,
      nickname: name.split(' ')[0],
      role: role,
      avatar: avatar,
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
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}
</script>

<template>
  <LandingLayout>
    <HeroSection @open-profile="openMemberProfile" @open-register="openRegisterModal" />

    <div class="bg-white py-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-8">
        <div class="h-[2px] w-full bg-linear-to-r from-transparent via-emerald-200/50 to-transparent relative flex justify-center">
          <div class="absolute -top-3.5 px-4 py-1.5 bg-emerald-50 border border-emerald-100/50 rounded-full text-[9px] font-black text-emerald-700 uppercase tracking-[0.2em] shadow-md flex items-center gap-1.5">
            <span>🌿</span> TENTANG KAMI
          </div>
        </div>
      </div>
    </div>

    <AboutSection />

    <div class="bg-white py-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-8">
        <div class="h-[2px] w-full bg-linear-to-r from-transparent via-emerald-200/50 to-transparent relative flex justify-center">
          <div class="absolute -top-3.5 px-4 py-1.5 bg-emerald-50 border border-emerald-100/50 rounded-full text-[9px] font-black text-emerald-700 uppercase tracking-[0.2em] shadow-md flex items-center gap-1.5">
            <span>📜</span> SEJARAH & SILSILAH
          </div>
        </div>
      </div>
    </div>

    <SejarahSection />

    <div class="bg-white py-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-8">
        <div class="h-[2px] w-full bg-linear-to-r from-transparent via-emerald-200/50 to-transparent relative flex justify-center">
          <div class="absolute -top-3.5 px-4 py-1.5 bg-emerald-50 border border-emerald-100/50 rounded-full text-[9px] font-black text-emerald-700 uppercase tracking-[0.2em] shadow-md flex items-center gap-1.5">
            <span>⚡</span> KEGIATAN KAMI
          </div>
        </div>
      </div>
    </div>

    <KegiatanSection />

    <div class="bg-white py-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-8">
        <div class="h-[2px] w-full bg-linear-to-r from-transparent via-emerald-200/50 to-transparent relative flex justify-center">
          <div class="absolute -top-3.5 px-4 py-1.5 bg-emerald-50 border border-emerald-100/50 rounded-full text-[9px] font-black text-emerald-700 uppercase tracking-[0.2em] shadow-md flex items-center gap-1.5">
            <span>📸</span> DOKUMENTASI & LANSA
          </div>
        </div>
      </div>
    </div>

    <GaleriSection @open-gallery="openGalleryModal" />

    <div class="bg-white py-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-8">
        <div class="h-[2px] w-full bg-linear-to-r from-transparent via-emerald-200/50 to-transparent relative flex justify-center">
          <div class="absolute -top-3.5 px-4 py-1.5 bg-emerald-50 border border-emerald-100/50 rounded-full text-[9px] font-black text-emerald-700 uppercase tracking-[0.2em] shadow-md flex items-center gap-1.5">
            <span>💬</span> SOSIAL & FEED
          </div>
        </div>
      </div>
    </div>

    <SosialSection @open-profile="openMemberProfile" @toast="handleToast" />

    <div class="bg-white py-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-8">
        <div class="h-[2px] w-full bg-linear-to-r from-transparent via-emerald-200/50 to-transparent relative flex justify-center">
          <div class="absolute -top-3.5 px-4 py-1.5 bg-emerald-50 border border-emerald-100/50 rounded-full text-[9px] font-black text-emerald-700 uppercase tracking-[0.2em] shadow-md flex items-center gap-1.5">
            <span>🤝</span> ANGGOTA & TIM
          </div>
        </div>
      </div>
    </div>

    <AnggotaSection @open-profile="openMemberProfile" />

    <section class="max-w-7xl mx-auto px-4 sm:px-8 pb-16 sm:pb-32 pt-8 sm:pt-16 bg-white">
      <div class="relative border border-slate-100/80 rounded-lg overflow-hidden bg-white p-8 sm:p-16 lg:p-24 text-center group shadow-xl shadow-slate-100">
        <div class="absolute top-0 right-0 w-96 h-96 bg-emerald-200 blur-[150px] rounded-full opacity-30 -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000"></div>
        <div class="relative z-10 space-y-6 sm:space-y-10">
          <h2 class="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-tight">Muda, Beriman, <br/><span class="text-emerald-600 italic">Berprestasi.</span></h2>
          <p class="text-xs sm:text-sm md:text-base lg:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Mari bergabung dalam pergerakan pemuda Dusun Ngampon yang lebih cerdas dan berdaya.
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-4 pt-4 sm:pt-6 w-full">
            <button @click="openRegisterModal" class="px-6 sm:px-12 py-4 sm:py-5 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-600/10 hover:scale-105 transition-transform cursor-pointer w-full sm:w-auto">
              DAFTAR SEKARANG
            </button>
            <button class="px-6 sm:px-12 py-4 sm:py-5 bg-white border border-emerald-200 text-emerald-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50/50 transition-all shadow-sm cursor-pointer w-full sm:w-auto">
              HUBUNGI KAMI
            </button>
          </div>
        </div>
      </div>
    </section>

    <transition name="fade-slide">
      <div v-if="showToast" class="fixed bottom-8 right-4 left-4 sm:left-auto sm:right-8 z-50 px-6 py-4 bg-emerald-600 text-white rounded-2xl shadow-2xl shadow-emerald-500/20 flex items-center justify-between gap-4 font-black text-xs uppercase tracking-widest border border-emerald-500/30">
        <div class="flex items-center gap-3">
          <span class="flex h-2 w-2 rounded-full bg-white animate-pulse"></span>
          <span>{{ toastMessage }}</span>
        </div>
        <button @click="showToast = false" class="text-white hover:text-emerald-200 transition-colors cursor-pointer text-[10px] font-bold">TUTUP</button>
      </div>
    </transition>

    <GalleryModal v-if="activeGalleryItem" :active-gallery-item="activeGalleryItem" @close="closeGalleryModal" />
    <MemberProfileModal v-if="activeMemberProfile" :active-member-profile="activeMemberProfile" @close="closeMemberProfile" />
    <RegisterModal :is-open="isRegisterOpen" @close="closeRegisterModal" @submit-success="handleRegisterSuccess" />
  </LandingLayout>
</template>
