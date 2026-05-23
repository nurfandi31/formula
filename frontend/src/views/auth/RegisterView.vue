<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSocialStore } from '../../stores/social'
import AuthLayout from '../../layouts/AuthLayout.vue'
import { useToast } from '../../composables/useToast'
import OtpVerification from '../../components/OtpVerification.vue'

const name = ref('')
const email = ref('')
const whatsapp = ref('')
const password = ref('')
const confirmPassword = ref('')
const termsAccepted = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')
const isOtpOpen = ref(false)

const router = useRouter()
const socialStore = useSocialStore()
const { queueToast } = useToast()

const handleRegister = () => {
  if (!name.value || !email.value || !whatsapp.value || !password.value || !confirmPassword.value) return
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Konfirmasi kata sandi tidak cocok!'
    return
  }

  const lowerEmail = email.value.toLowerCase().trim()
  if (socialStore.users[lowerEmail]) {
    errorMessage.value = 'Alamat email ini sudah terdaftar!'
    return
  }
  
  errorMessage.value = ''
  isOtpOpen.value = true
}

const onOtpVerified = async () => {
  isOtpOpen.value = false
  isSubmitting.value = true
  
  const res = await socialStore.register(name.value, email.value.toLowerCase().trim(), password.value)
  isSubmitting.value = false
  
  if (res.success) {
    if (socialStore.currentUser) {
      socialStore.currentUser.otp_verified = true
    }
    queueToast(`Pendaftaran berhasil! Selamat bergabung, ${name.value}! 🎉`, 'success')
    router.push('/anggota')
  } else {
    errorMessage.value = res.message
  }
}

const onOtpClose = () => {
  isOtpOpen.value = false
}
</script>

<template>
  <AuthLayout>
    <div class="bg-white border border-emerald-100/50 rounded-2xl p-5 sm:p-7 shadow-2xl shadow-emerald-950/5 relative overflow-hidden animate-in zoom-in-95 duration-300">
      <!-- Top aesthetic border glow -->
      <div class="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-emerald-500 via-green-500 to-teal-500"></div>

      <div class="text-center mb-4.5">
        <h2 class="text-xl sm:text-2xl font-black text-slate-900 leading-none">Daftar Pengurus</h2>
        <p class="text-slate-400 text-[8px] font-black uppercase tracking-widest mt-1">Buat Akun FORMULA Baru</p>
      </div>

      <!-- Beautiful Error Feedback -->
      <div v-if="errorMessage" class="mb-4 p-3 bg-rose-50 border border-rose-100/50 rounded-xl text-center text-[10px] font-black text-rose-600 uppercase tracking-wider animate-in fade-in duration-300">
        ⚠️ {{ errorMessage }}
      </div>
      
      <form class="space-y-2.5" @submit.prevent="handleRegister">
        <div class="space-y-1 text-left">
          <label class="text-[9px] font-black text-slate-400 uppercase tracking-wider">Nama Lengkap</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-3.5 flex items-center text-slate-400 text-xs">👤</span>
            <input 
              v-model="name"
              type="text" 
              required
              class="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all" 
              placeholder="Contoh: Aditya Pratama"
            >
          </div>
        </div>

        <div class="space-y-1 text-left">
          <label class="text-[9px] font-black text-slate-400 uppercase tracking-wider">Alamat Email</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-3.5 flex items-center text-slate-400 text-xs">✉</span>
            <input 
              v-model="email"
              type="email" 
              required
              class="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all" 
              placeholder="Contoh: pengurus@formula.org"
            >
          </div>
        </div>

        <div class="space-y-1 text-left">
          <label class="text-[9px] font-black text-slate-400 uppercase tracking-wider">Nomor WhatsApp</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-3.5 flex items-center text-slate-400 text-xs">📞</span>
            <input 
              v-model="whatsapp"
              type="tel" 
              required
              class="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all" 
              placeholder="Contoh: 08123456789"
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
              class="w-full pl-9 pr-10 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all" 
              placeholder="Buat kata sandi..."
            >
            <button 
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer text-[8px] font-black"
            >
              {{ showPassword ? 'BATAL' : 'LIHAT' }}
            </button>
          </div>
        </div>

        <div class="space-y-1 text-left">
          <label class="text-[9px] font-black text-slate-400 uppercase tracking-wider">Konfirmasi Sandi</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-3.5 flex items-center text-slate-400 text-xs">🔒</span>
            <input 
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'" 
              required
              class="w-full pl-9 pr-10 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all" 
              placeholder="Ulangi kata sandi..."
            >
            <button 
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer text-[8px] font-black"
            >
              {{ showConfirmPassword ? 'BATAL' : 'LIHAT' }}
            </button>
          </div>
        </div>

        <div class="flex items-center pt-0.5">
          <label class="flex items-start gap-2 cursor-pointer select-none">
            <input 
              v-model="termsAccepted"
              type="checkbox" 
              required
              class="rounded-sm border-slate-200 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 mt-0.5"
            >
            <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider text-left leading-normal">
              Saya menyetujui <a href="#" class="text-emerald-600 hover:text-emerald-700">Syarat & Ketentuan</a> FORMULA
            </span>
          </label>
        </div>

        <button 
          type="submit" 
          :disabled="isSubmitting"
          class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-emerald-600/10 flex items-center justify-center gap-2 active:scale-95"
        >
          <span v-if="isSubmitting" class="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
          <span>{{ isSubmitting ? 'MEMPROSES...' : 'DAFTAR SEKARANG' }}</span>
        </button>
      </form>

      <div class="mt-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
        Sudah punya akun? <router-link to="/login" class="text-emerald-600 hover:text-emerald-700">Masuk Di Sini</router-link>
      </div>
    </div>

    <!-- OTP Verification Overlay Component -->
    <OtpVerification 
      :is-open="isOtpOpen" 
      :email="email"
      :phone="whatsapp"
      @verified="onOtpVerified" 
      @close="onOtpClose"
    />
  </AuthLayout>
</template>
