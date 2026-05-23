<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  email: String,
  phone: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['verified', 'close'])

const otpStep = ref('channel') // 'channel' | 'input'
const selectedChannel = ref('whatsapp')
const generatedOtp = ref('')
const otpDigits = ref(['', '', '', ''])
const inputRefs = ref([])
const timer = ref(300) // 5 minutes in seconds
const timerInterval = ref(null)
const showNotification = ref(false)
const notificationText = ref('')
const isVerifying = ref(false)
const isOtpInvalid = ref(false)

// Generate a random 4-digit code
const generateNewOtp = () => {
  const code = Math.floor(1000 + Math.random() * 9000).toString()
  generatedOtp.value = code
  isOtpInvalid.value = false
  otpDigits.value = ['', '', '', '']
  return code
}

// Format seconds to MM:SS
const formatTime = (secs) => {
  const m = Math.floor(secs / 60).toString().padStart(2, '0')
  const s = (secs % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

// Start Countdown Timer
const startTimer = () => {
  clearInterval(timerInterval.value)
  timer.value = 300
  timerInterval.value = setInterval(() => {
    if (timer.value > 0) {
      timer.value--
    } else {
      clearInterval(timerInterval.value)
    }
  }, 1000)
}

// Trigger Simulated Notification
const triggerSimulation = (channel, code) => {
  showNotification.value = false
  setTimeout(() => {
    showNotification.value = true
  }, 600)
}

// Handle Send OTP
const sendOtp = () => {
  const code = generateNewOtp()
  startTimer()
  otpStep.value = 'input'
  triggerSimulation(selectedChannel.value, code)
  
  // Focus first input box after DOM updates
  setTimeout(() => {
    if (inputRefs.value[0]) {
      inputRefs.value[0].focus()
    }
  }, 200)
}

// Handle OTP Input Key Events
const handleInput = (e, index) => {
  const val = e.target.value
  
  // Accept only numbers
  if (!/^\d*$/.test(val)) {
    otpDigits.value[index] = ''
    return
  }

  // Set the digit
  otpDigits.value[index] = val.slice(-1)

  // Move to next input if filled
  if (otpDigits.value[index] && index < 3) {
    inputRefs.value[index + 1].focus()
  }

  checkOtpCompletion()
}

const handleKeyDown = (e, index) => {
  if (e.key === 'Backspace') {
    if (!otpDigits.value[index] && index > 0) {
      otpDigits.value[index - 1] = ''
      inputRefs.value[index - 1].focus()
    } else {
      otpDigits.value[index] = ''
    }
    isOtpInvalid.value = false
  }
}

// Paste Event Handler
const handlePaste = (e) => {
  e.preventDefault()
  const pastedData = e.clipboardData.getData('text').trim()
  if (/^\d{4}$/.test(pastedData)) {
    for (let i = 0; i < 4; i++) {
      otpDigits.value[i] = pastedData[i]
    }
    inputRefs.value[3].focus()
    checkOtpCompletion()
  }
}

// Check if all 4 digits are filled
const checkOtpCompletion = () => {
  const enteredOtp = otpDigits.value.join('')
  if (enteredOtp.length === 4) {
    verifyOtp(enteredOtp)
  }
}

// Verify OTP
const verifyOtp = (code) => {
  if (timer.value <= 0) {
    isOtpInvalid.value = true
    return
  }

  isVerifying.value = true
  isOtpInvalid.value = false

  setTimeout(() => {
    isVerifying.value = false
    if (code === generatedOtp.value) {
      showNotification.value = false
      emit('verified')
    } else {
      isOtpInvalid.value = true
      // Shake animation effect could be added here
    }
  }, 1000)
}

// Resend OTP
const resendOtp = () => {
  sendOtp()
}

// Close and clean up
const closeOtp = () => {
  clearInterval(timerInterval.value)
  showNotification.value = false
  emit('close')
}

onBeforeUnmount(() => {
  clearInterval(timerInterval.value)
})

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    otpStep.value = 'channel'
    selectedChannel.value = 'whatsapp'
    otpDigits.value = ['', '', '', '']
    showNotification.value = false
    isOtpInvalid.value = false
  } else {
    clearInterval(timerInterval.value)
  }
})
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <!-- Blur Backdrop -->
    <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" @click="closeOtp"></div>

    <!-- OTP Card Container -->
    <div class="bg-white rounded-[2rem] shadow-2xl border border-slate-100/80 w-full max-w-md overflow-hidden transform transition-all duration-300 relative z-10 animate-in zoom-in-95 duration-300">
      <!-- Top Color Accent Bar -->
      <div class="h-2 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500"></div>

      <!-- Close Button -->
      <button 
        @click="closeOtp" 
        class="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer text-xs"
      >
        ✕
      </button>

      <!-- STEP 1: Choose Channel -->
      <div v-if="otpStep === 'channel'" class="p-8 space-y-6">
        <div class="text-center space-y-2">
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-xl shadow-xs">
            🛡️
          </div>
          <h3 class="text-lg font-black text-slate-800 uppercase tracking-wide mt-2">Verifikasi Dua Langkah</h3>
          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Pilih saluran untuk menerima kode verifikasi OTP Anda</p>
        </div>

        <div class="space-y-3">
          <!-- WhatsApp Channel Selection -->
          <label 
            :class="[
              'flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all active:scale-[0.99] select-none',
              selectedChannel === 'whatsapp' 
                ? 'border-emerald-500 bg-emerald-50/40 shadow-xs' 
                : 'border-slate-200 hover:bg-slate-50'
            ]"
            @click="selectedChannel = 'whatsapp'"
          >
            <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 text-lg flex-shrink-0">
              💬
            </div>
            <div class="text-left flex-grow">
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-black text-slate-800 uppercase tracking-wide">WhatsApp Resmi</span>
                <span class="px-1.5 py-0.5 bg-emerald-600 text-white text-[7px] font-black uppercase tracking-wider rounded-sm leading-none flex items-center gap-0.5">
                  ✓ Verified
                </span>
              </div>
              <p class="text-[9px] text-slate-400 font-semibold mt-0.5">Dikirim langsung via WhatsApp System (formulaweb)</p>
            </div>
            <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
              :class="selectedChannel === 'whatsapp' ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-350'"
            >
              <span v-if="selectedChannel === 'whatsapp'" class="text-[8px] font-black">✓</span>
            </div>
          </label>

          <!-- Email Channel Selection -->
          <label 
            :class="[
              'flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all active:scale-[0.99] select-none',
              selectedChannel === 'email' 
                ? 'border-emerald-500 bg-emerald-50/40 shadow-xs' 
                : 'border-slate-200 hover:bg-slate-50'
            ]"
            @click="selectedChannel = 'email'"
          >
            <div class="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 text-lg flex-shrink-0">
              ✉️
            </div>
            <div class="text-left flex-grow">
              <span class="text-xs font-black text-slate-800 uppercase tracking-wide">Surel / Email</span>
              <p class="text-[9px] text-slate-400 font-semibold mt-0.5">Dikirim ke alamat email: {{ email }}</p>
            </div>
            <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
              :class="selectedChannel === 'email' ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-350'"
            >
              <span v-if="selectedChannel === 'email'" class="text-[8px] font-black">✓</span>
            </div>
          </label>
        </div>

        <button 
          @click="sendOtp"
          class="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 active:scale-95"
        >
          <span>KIRIM KODE OTP</span>
          <span class="text-sm">➔</span>
        </button>
      </div>

      <!-- STEP 2: Input OTP & Verification -->
      <div v-else class="p-8 space-y-6">
        <div class="text-center space-y-2">
          <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl shadow-xs">
            🔑
          </div>
          <h3 class="text-lg font-black text-slate-800 uppercase tracking-wide mt-2">Masukkan Kode Verifikasi</h3>
          <p class="text-[10px] text-slate-400 font-semibold leading-relaxed">
            Kode OTP telah dikirim melalui <span class="font-black text-slate-700 uppercase">{{ selectedChannel }}</span>. Berlaku 5 menit.
          </p>
        </div>

        <!-- 4 Digit Input Boxes -->
        <div class="flex justify-center gap-3.5 my-6" @paste="handlePaste">
          <input
            v-for="(digit, index) in otpDigits"
            :key="index"
            ref="inputRefs"
            v-model="otpDigits[index]"
            type="text"
            maxlength="1"
            class="w-14 h-14 text-center text-xl font-black rounded-xl border-2 focus:outline-hidden focus:ring-0 transition-all shadow-2xs"
            :class="[
              isOtpInvalid 
                ? 'border-rose-450 bg-rose-50/30 text-rose-600 focus:border-rose-500' 
                : 'border-slate-200 bg-slate-50/50 text-slate-850 focus:border-emerald-500 focus:bg-white focus:shadow-md'
            ]"
            @input="handleInput($event, index)"
            @keydown="handleKeyDown($event, index)"
          />
        </div>

        <!-- Feedback & Timer -->
        <div class="text-center space-y-3">
          <p v-if="isOtpInvalid" class="text-[10px] font-black text-rose-500 uppercase tracking-wider animate-pulse">
            ⚠️ Kode verifikasi salah atau kedaluwarsa!
          </p>

          <!-- Timer Countdown -->
          <div class="flex items-center justify-center gap-1.5 text-slate-400 text-[10px] font-black tracking-widest uppercase">
            <span>Masa berlaku:</span>
            <span :class="['font-mono text-xs', timer < 60 ? 'text-rose-500 font-bold animate-pulse' : 'text-slate-655']">
              {{ formatTime(timer) }}
            </span>
          </div>

          <div class="text-[10px] font-black uppercase tracking-wider">
            Tidak menerima kode? 
            <button 
              @click="resendOtp" 
              :disabled="timer > 0"
              :class="[
                'ml-1 font-black cursor-pointer uppercase transition-colors',
                timer > 0 ? 'text-slate-350 cursor-not-allowed' : 'text-emerald-600 hover:text-emerald-700'
              ]"
            >
              Kirim Ulang
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button 
          @click="checkOtpCompletion"
          :disabled="isVerifying || otpDigits.join('').length < 4"
          class="w-full py-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
        >
          <span v-if="isVerifying" class="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
          <span>{{ isVerifying ? 'VERIFIKASI...' : 'KONFIRMASI OTP' }}</span>
        </button>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- FLOATING PUSH NOTIFICATION SIMULATOR CARD -->
    <!-- ========================================== -->
    <transition name="slide-noti">
      <div 
        v-if="showNotification" 
        class="fixed top-6 right-6 z-[110] max-w-sm w-[90%] bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col font-sans"
      >
        <!-- Simulation Accent header banner -->
        <div class="bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-1 flex justify-between items-center text-[7px] font-black uppercase tracking-widest text-teal-950">
          <span>🖥️ simulasi pengiriman otp</span>
          <button @click="showNotification = false" class="hover:text-white text-[9px] font-bold">✕</button>
        </div>

        <!-- WHATSAPP NOTIFICATION BODY -->
        <div v-if="selectedChannel === 'whatsapp'" class="p-4 flex gap-3 text-left">
          <!-- Official Avatar / Icon -->
          <div class="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white text-lg flex-shrink-0 shadow-md">
            💬
          </div>
          <div class="flex-grow min-w-0">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1">
                <span class="text-xs font-black text-white">formulaweb</span>
                <!-- Verified Badge -->
                <span class="w-3.5 h-3.5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[8px] font-black" title="Verified Account">✓</span>
              </div>
              <span class="text-[8px] font-bold text-slate-400">sekarang</span>
            </div>
            
            <div class="mt-1.5 p-3 bg-slate-800 rounded-xl border border-slate-700/50 text-[10px] leading-relaxed space-y-1 font-mono text-slate-200">
              <p class="font-bold text-emerald-400">💡 [OFFICIAL FORMULA OTP]</p>
              <p v-if="phone">Ke Nomor WA: <strong class="text-teal-300 font-bold">{{ phone }}</strong></p>
              <p>Kode verifikasi login Anda adalah: <strong class="text-yellow-400 text-xs px-1 bg-yellow-500/10 rounded">{{ generatedOtp }}</strong></p>
              <p class="text-[8px] text-slate-400 mt-1">⚠️ Jangan bagikan kode ini demi keamanan akun Anda. Berlaku 5 menit.</p>
            </div>
          </div>
        </div>

        <!-- EMAIL NOTIFICATION BODY -->
        <div v-else class="p-4 flex gap-3 text-left">
          <div class="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white text-lg flex-shrink-0 shadow-md">
            ✉️
          </div>
          <div class="flex-grow min-w-0">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black text-white">noreply@formula.org</span>
              <span class="text-[8px] font-bold text-slate-400">sekarang</span>
            </div>
            <div class="text-[9px] font-black text-sky-400 mt-0.5">Subjek: Kode Keamanan Verifikasi FORMULA</div>
            
            <div class="mt-2 p-3 bg-slate-800 rounded-xl border border-slate-700/50 text-[10px] leading-relaxed space-y-1 font-mono text-slate-200">
              <p>Halo Pengurus FORMULA,</p>
              <p v-if="email">Ke Email: <strong class="text-sky-300 font-bold">{{ email }}</strong></p>
              <p>Berikut adalah 4 digit kode verifikasi masuk Anda:</p>
              <div class="py-2 text-center">
                <span class="text-sm font-black tracking-widest text-emerald-400 border border-emerald-500/30 px-3 py-1 bg-emerald-500/10 rounded-lg">
                  {{ generatedOtp }}
                </span>
              </div>
              <p class="text-[8px] text-slate-400 mt-1">Kode ini akan kedaluwarsa dalam waktu 5 menit.</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.slide-noti-enter-active,
.slide-noti-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-noti-enter-from {
  transform: translateY(-20px) scale(0.9);
  opacity: 0;
}
.slide-noti-leave-to {
  transform: translateY(-20px) scale(0.9);
  opacity: 0;
}
</style>
