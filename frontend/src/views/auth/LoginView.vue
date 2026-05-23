<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSocialStore } from '../../stores/social'
import AuthLayout from '../../layouts/AuthLayout.vue'
import { useToast } from '../../composables/useToast'

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

const router = useRouter()
const socialStore = useSocialStore()
const { queueToast } = useToast()

const handleLogin = () => {
  if (!email.value || !password.value) return
  isSubmitting.value = true
  errorMessage.value = ''

  setTimeout(async () => {
    const res = await socialStore.login(email.value, password.value)
    isSubmitting.value = false
    if (res.success) {
      // Queue toast dulu, BARU pindah halaman — toast muncul setelah sampai di halaman tujuan
      queueToast(`Selamat datang, ${res.user.name}! 👋`, 'success')
      if (['admin', 'bendahara', 'sekertaris'].includes(res.user.role)) {
        router.push('/admin')
      } else {
        router.push('/anggota')
      }
    } else {
      errorMessage.value = res.message
    }
  }, 800)
}
</script>

<template>
  <AuthLayout>
    <div class="bg-white border border-emerald-100/50 rounded-2xl p-5 sm:p-7 shadow-2xl shadow-emerald-950/5 relative overflow-hidden animate-in zoom-in-95 duration-300">
      <!-- Top aesthetic border glow -->
      <div class="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-emerald-500 via-green-500 to-teal-500"></div>

      <div class="text-center mb-5">
        <h2 class="text-xl sm:text-2xl font-black text-slate-900 leading-none">Masuk Akun</h2>
        <p class="text-slate-400 text-[8px] font-black uppercase tracking-widest mt-1.5">Portal Kepengurusan FORMULA</p>
      </div>

      <!-- Beautiful Error Feedback -->
      <div v-if="errorMessage" class="mb-4.5 p-3 bg-rose-50 border border-rose-100/50 rounded-xl text-center text-[10px] font-black text-rose-600 uppercase tracking-wider animate-in fade-in duration-300">
        ⚠️ {{ errorMessage }}
      </div>
      
      <form class="space-y-4" @submit.prevent="handleLogin">
        <div class="space-y-1 text-left">
          <label class="text-[9px] font-black text-slate-400 uppercase tracking-wider">Alamat Email</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-3.5 flex items-center text-slate-400 text-xs">✉</span>
            <input 
              v-model="email"
              type="email" 
              required
              class="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all" 
              placeholder="Contoh: pengurus@formula.org"
            >
          </div>
        </div>

        <div class="space-y-1 text-left">
          <label class="text-[9px] font-black text-slate-400 uppercase tracking-wider">Kata Sandi</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-3.5 flex items-center text-slate-400 text-xs">🔑</span>
            <input 
              v-model="password"
              :type="showPassword ? 'text' : 'password'" 
              required
              class="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all" 
              placeholder="Masukkan kata sandi..."
            >
            <button 
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer text-[9px] font-black"
            >
              {{ showPassword ? 'BATAL' : 'LIHAT' }}
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between pt-0.5">
          <label class="flex items-center gap-2 cursor-pointer select-none">
            <input 
              v-model="rememberMe"
              type="checkbox" 
              class="rounded-sm border-slate-200 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
            >
            <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider">Ingat Saya</span>
          </label>
          <a href="#" class="text-[9px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-wider">Lupa Sandi?</a>
        </div>

        <button 
          type="submit" 
          :disabled="isSubmitting"
          class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-emerald-600/10 flex items-center justify-center gap-2 active:scale-95"
        >
          <span v-if="isSubmitting" class="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
          <span>{{ isSubmitting ? 'MEMPROSES...' : 'MASUK SEKARANG' }}</span>
        </button>
      </form>
      
      <div class="mt-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
        Belum punya akun? <router-link to="/register" class="text-emerald-600 hover:text-emerald-700">Daftar Sekarang</router-link>
      </div>
    </div>
  </AuthLayout>
</template>
