<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSocialStore } from '../../stores/social'
import AuthLayout from '../../layouts/AuthLayout.vue'

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

const router = useRouter()
const socialStore = useSocialStore()

const handleLogin = () => {
  if (!email.value || !password.value) return
  isSubmitting.value = true
  errorMessage.value = ''

  setTimeout(async () => {
    const res = await socialStore.login(email.value, password.value)
    isSubmitting.value = false
    if (res.success) {
      if (res.user.role === 'admin') {
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
    <div class="bg-white border border-emerald-100/50 rounded-[2rem] p-8 sm:p-10 shadow-2xl shadow-emerald-950/5 relative overflow-hidden animate-in zoom-in-95 duration-300">
      <!-- Top aesthetic border glow -->
      <div class="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-emerald-500 via-green-500 to-teal-500"></div>

      <div class="text-center mb-8">
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 leading-none">Masuk Akun</h2>
        <p class="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-2">Portal Kepengurusan FORMULA</p>
      </div>

      <!-- Beautiful Error Feedback -->
      <div v-if="errorMessage" class="mb-5 p-3.5 bg-rose-50 border border-rose-100/50 rounded-xl text-center text-[10px] font-black text-rose-600 uppercase tracking-wider animate-in fade-in duration-300">
        ⚠️ {{ errorMessage }}
      </div>
      
      <form class="space-y-5" @submit.prevent="handleLogin">
        <div class="space-y-1.5 text-left">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Alamat Email</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-4 flex items-center text-slate-400 text-xs">✉</span>
            <input 
              v-model="email"
              type="email" 
              required
              class="w-full pl-10 pr-5 py-3.5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all" 
              placeholder="Contoh: pengurus@formula.org"
            >
          </div>
        </div>

        <div class="space-y-1.5 text-left">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Kata Sandi</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-4 flex items-center text-slate-400 text-xs">🔑</span>
            <input 
              v-model="password"
              :type="showPassword ? 'text' : 'password'" 
              required
              class="w-full pl-10 pr-12 py-3.5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all" 
              placeholder="Masukkan kata sandi..."
            >
            <button 
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer text-[10px] font-black"
            >
              {{ showPassword ? 'SEMBUNYI' : 'LIHAT' }}
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between pt-1">
          <label class="flex items-center gap-2 cursor-pointer select-none">
            <input 
              v-model="rememberMe"
              type="checkbox" 
              class="rounded-sm border-slate-200 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            >
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Ingat Saya</span>
          </label>
          <a href="#" class="text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-wider">Lupa Sandi?</a>
        </div>

        <button 
          type="submit" 
          :disabled="isSubmitting"
          class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl sm:rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-xl shadow-emerald-600/15 flex items-center justify-center gap-2 active:scale-95"
        >
          <span v-if="isSubmitting" class="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
          <span>{{ isSubmitting ? 'MEMPROSES...' : 'MASUK SEKARANG' }}</span>
        </button>
      </form>

      <!-- Social Logins Divider -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-100"></div></div>
        <div class="relative flex justify-center text-[9px] font-black uppercase tracking-widest"><span class="bg-white px-3 text-slate-400">Atau Masuk Dengan</span></div>
      </div>

      <!-- Social Logins Buttons -->
      <div class="grid grid-cols-2 gap-3">
        <button type="button" class="flex items-center justify-center gap-2 px-4 py-3.5 border border-slate-100 rounded-xl sm:rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all font-black text-[10px] uppercase tracking-wider text-slate-600 cursor-pointer">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          <span>Google</span>
        </button>
        <button type="button" class="flex items-center justify-center gap-2 px-4 py-3.5 border border-slate-100 rounded-xl sm:rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all font-black text-[10px] uppercase tracking-wider text-slate-600 cursor-pointer">
          <svg class="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.115-2.905-6.99-1.876-1.875-4.353-2.907-6.992-2.908-5.442 0-9.866 4.42-9.87 9.865-.001 1.748.461 3.454 1.341 4.966l-.993 3.63 3.73-.979zm12.336-7.147c-.29-.145-1.714-.846-1.98-.942-.266-.096-.46-.145-.654.145-.194.291-.749.942-.919 1.135-.17.194-.34.218-.63.073-.29-.145-1.226-.452-2.336-1.442-.863-.77-1.446-1.72-1.616-2.011-.17-.291-.018-.448.127-.592.13-.13.29-.34.436-.509.145-.17.194-.291.291-.485.097-.194.049-.364-.024-.509-.073-.145-.654-1.577-.896-2.158-.236-.569-.475-.491-.654-.5l-.558-.009c-.194 0-.509.073-.776.364-.266.291-1.018.995-1.018 2.426 0 1.431 1.041 2.816 1.187 3.01.145.194 2.05 3.13 4.965 4.387.694.3 1.236.479 1.658.613.697.221 1.332.19 1.833.115.558-.085 1.714-.7 1.956-1.38.242-.678.242-1.26.17-1.38-.072-.121-.266-.194-.558-.339z"/>
          </svg>
          <span>WhatsApp</span>
        </button>
      </div>
      
      <div class="mt-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
        Belum punya akun? <router-link to="/register" class="text-emerald-600 hover:text-emerald-700">Daftar Sekarang</router-link>
      </div>
    </div>
  </AuthLayout>
</template>
