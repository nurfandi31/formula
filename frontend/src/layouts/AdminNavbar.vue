<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSocialStore } from '../stores/social'
import { useToast } from '../composables/useToast'

defineProps({
  isCollapsed: Boolean
})

const emit = defineEmits(['toggleCollapse', 'toggleMobile'])

const router = useRouter()
const socialStore = useSocialStore()
const { queueToast } = useToast()

const currentUser = computed(() => socialStore.currentUser)
const isProfileMenuOpen = ref(false)

const handleLogout = () => {
  const name = currentUser.value?.name || 'Admin'
  socialStore.logout()
  // Queue toast dulu, BARU navigate ke /login
  queueToast(`Sampai jumpa, ${name}! Anda telah keluar. 👋`, 'info')
  router.push('/login')
}

// Close dropdown when clicking outside
const closeMenu = (e) => {
  if (!e.target.closest('.profile-dropdown-container')) {
    isProfileMenuOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', closeMenu))
onUnmounted(() => document.removeEventListener('click', closeMenu))
</script>

<template>
  <header class="h-14 bg-white/80 border-b border-slate-250/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
    <div class="flex items-center gap-4">
      <button @click="emit('toggleCollapse')" class="hidden md:flex items-center justify-center p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-850 border border-slate-200/70 cursor-pointer transition-all">
        <font-awesome-icon :icon="isCollapsed ? 'indent' : 'outdent'" class="text-sm" />
      </button>
      <button @click="emit('toggleMobile')" class="flex md:hidden items-center justify-center p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-850 border border-slate-200/70 cursor-pointer transition-all">
        <font-awesome-icon icon="bars" class="text-sm" />
      </button>
      <h2 class="text-xs font-black uppercase tracking-widest text-slate-500">Dashboard Administrator</h2>
    </div>
    
    <div class="flex items-center gap-6">
      <!-- Profile Widget -->
      <div class="relative profile-dropdown-container">
        <button @click="isProfileMenuOpen = !isProfileMenuOpen" class="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <div class="text-right hidden sm:block">
            <h4 class="text-xs font-black text-slate-800 leading-tight">{{ currentUser?.name }}</h4>
            <p class="text-[9px] font-black text-emerald-600 uppercase tracking-wider mt-0.5">{{ currentUser?.title }}</p>
          </div>
          <div class="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-sm bg-slate-100 flex-shrink-0">
            <img :src="currentUser?.avatar" class="w-full h-full object-cover" alt="Avatar">
          </div>
        </button>

        <!-- Dropdown Menu -->
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform scale-95 opacity-0 translate-y-2"
          enter-to-class="transform scale-100 opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="transform scale-100 opacity-100 translate-y-0"
          leave-to-class="transform scale-95 opacity-0 translate-y-2"
        >
          <div v-if="isProfileMenuOpen" class="absolute right-0 mt-3 w-48 bg-white rounded-lg border border-slate-200 shadow-xl overflow-hidden py-2">
            <div class="px-4 py-3 border-b border-slate-100 sm:hidden">
              <h4 class="text-xs font-black text-slate-800">{{ currentUser?.name }}</h4>
              <p class="text-[9px] font-black text-emerald-600 uppercase mt-0.5">{{ currentUser?.title }}</p>
            </div>
            
            <router-link to="/admin/profil" @click="isProfileMenuOpen = false" class="w-full text-left px-4 py-3 flex items-center gap-3 text-xs font-black uppercase tracking-wider text-slate-600 hover:text-emerald-600 hover:bg-slate-50 transition-colors cursor-pointer">
              <font-awesome-icon icon="user" class="text-sm" />
              Profil Saya
            </router-link>
            
            <div class="h-px bg-slate-100 my-1 mx-2"></div>
            
            <button @click="handleLogout" class="w-full text-left px-4 py-3 flex items-center gap-3 text-xs font-black uppercase tracking-wider text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer">
              <font-awesome-icon icon="sign-out-alt" class="text-sm" />
              Keluar Sesi
            </button>
          </div>
        </transition>
      </div>

    </div>
  </header>
</template>
