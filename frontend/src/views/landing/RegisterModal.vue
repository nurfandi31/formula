<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'submitSuccess'])

const name = ref('')
const whatsapp = ref('')
const rt = ref('')
const reason = ref('')
const isSubmitting = ref(false)

const rtOptions = ['RT 01', 'RT 02', 'RT 03', 'RT 04', 'RT 05']

// Select Search Option states
const showRtDropdown = ref(false)
const rtSearchQuery = ref('')
const rtDropdownRef = ref(null)

const filteredRtOptions = computed(() => {
  if (!rtSearchQuery.value.trim()) return rtOptions
  return rtOptions.filter(option => 
    option.toLowerCase().includes(rtSearchQuery.value.toLowerCase())
  )
})

const toggleRtDropdown = () => {
  showRtDropdown.value = !showRtDropdown.value
}

const selectRt = (option) => {
  rt.value = option
  showRtDropdown.value = false
  rtSearchQuery.value = ''
}

const handleClickOutside = (event) => {
  if (rtDropdownRef.value && !rtDropdownRef.value.contains(event.target)) {
    showRtDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleSubmit = () => {
  if (!name.value || !whatsapp.value || !rt.value || !reason.value) return

  isSubmitting.value = true
  
  setTimeout(() => {
    isSubmitting.value = false
    emit('submitSuccess', {
      name: name.value,
      whatsapp: whatsapp.value,
      rt: rt.value,
      reason: reason.value
    })
    
    name.value = ''
    whatsapp.value = ''
    rt.value = ''
    reason.value = ''
    
    emit('close')
  }, 1500)
}
</script>

<template>
  <transition name="fade-zoom">
    <div v-if="isOpen" class="fixed inset-0 z-55 flex items-center justify-center p-4 sm:p-6">
      <div @click="emit('close')" class="absolute inset-0 bg-slate-900/85 backdrop-blur-md"></div>
      
      <div class="relative w-full max-w-lg bg-white rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-y-auto max-h-[90vh] scrollbar-hide z-10 animate-in zoom-in-95 duration-300 border border-emerald-100/50">
        <div class="h-28 sm:h-32 bg-linear-to-tr from-emerald-500 via-green-500 to-teal-600 relative p-6 sm:p-8 flex items-end">
          <button @click="emit('close')" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-emerald-700 transition-all cursor-pointer flex items-center justify-center border border-white/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          <div class="text-white">
            <span class="text-[9px] font-black uppercase tracking-widest text-emerald-100">Bergabung Bersama Kami</span>
            <h3 class="text-lg sm:text-2xl font-black leading-tight mt-0.5">Formulir Pendaftaran</h3>
          </div>
        </div>
        
        <form @submit.prevent="handleSubmit" class="p-6 sm:p-8 space-y-4 sm:space-y-6">
          <div class="space-y-1.5 text-left">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Nama Lengkap</label>
            <input v-model="name" type="text" required placeholder="Contoh: Ahmad Pratama" class="w-full px-5 py-3.5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all">
          </div>
          
          <div class="space-y-1.5 text-left">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Nomor WhatsApp</label>
            <input v-model="whatsapp" type="tel" required placeholder="Contoh: 08123456789" class="w-full px-5 py-3.5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all">
          </div>
          
          <div class="space-y-1.5 text-left relative" ref="rtDropdownRef">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Asal RT (Dusun Ngampon)</label>
            <div class="relative">
              <!-- Trigger Button -->
              <button 
                type="button" 
                @click="toggleRtDropdown" 
                class="w-full px-5 py-3.5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all flex items-center justify-between cursor-pointer text-left"
                :class="{ 'ring-2 ring-emerald-500 bg-white': showRtDropdown }"
              >
                <span :class="rt ? 'text-slate-700' : 'text-slate-400'">
                  {{ rt || 'Pilih RT asal...' }}
                </span>
                <svg 
                  class="w-4 h-4 text-slate-400 transition-transform duration-200" 
                  :class="{ 'rotate-180': showRtDropdown }"
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="2.5" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
                </svg>
              </button>
              
              <!-- Hidden native select for HTML5 validation support -->
              <select 
                v-model="rt" 
                required 
                class="absolute opacity-0 pointer-events-none w-px h-px left-1/2 bottom-0"
                tabindex="-1"
              >
                <option value="" disabled selected>Pilih RT asal...</option>
                <option v-for="option in rtOptions" :key="option" :value="option">{{ option }}</option>
              </select>
            </div>

            <!-- Dropdown Panel -->
            <transition name="fade-slide">
              <div 
                v-if="showRtDropdown" 
                class="absolute left-0 right-0 z-50 mt-2 bg-white rounded-2xl shadow-2xl shadow-emerald-500/15 border border-slate-100 overflow-hidden p-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <!-- Search input -->
                <div class="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span class="text-slate-400 text-xs">🔍</span>
                  <input 
                    v-model="rtSearchQuery" 
                    type="text" 
                    placeholder="Cari RT asal..." 
                    class="w-full bg-transparent border-none text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-hidden"
                    @click.stop
                  >
                  <button 
                    v-if="rtSearchQuery" 
                    type="button"
                    @click.stop="rtSearchQuery = ''" 
                    class="text-slate-400 hover:text-slate-600 font-bold text-[10px] uppercase cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>

                <!-- Option list -->
                <div class="max-h-40 overflow-y-auto space-y-0.5 scrollbar-hide">
                  <button 
                    v-for="option in filteredRtOptions" 
                    :key="option" 
                    type="button"
                    @click="selectRt(option)" 
                    class="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between"
                    :class="rt === option ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'"
                  >
                    <span>{{ option }}</span>
                    <span v-if="rt === option" class="text-emerald-600 text-xs">✓</span>
                  </button>
                  <div 
                    v-if="filteredRtOptions.length === 0" 
                    class="p-4 text-center text-xs font-bold text-slate-400"
                  >
                    RT tidak ditemukan 🌿
                  </div>
                </div>
              </div>
            </transition>
          </div>
          
          <div class="space-y-1.5 text-left">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Alasan Bergabung</label>
            <textarea v-model="reason" required rows="3" placeholder="Sebutkan motivasi Anda bergabung..." class="w-full px-5 py-3.5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all resize-none"></textarea>
          </div>
          
          <button type="submit" :disabled="isSubmitting" class="w-full py-3.5 sm:py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all cursor-pointer shadow-xl shadow-emerald-600/10 flex items-center justify-center gap-2">
            <span v-if="isSubmitting" class="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
            <span>{{ isSubmitting ? 'MENGIRIM...' : 'KIRIM PENDAFTARAN' }}</span>
          </button>
        </form>
      </div>
    </div>
  </transition>
</template>
