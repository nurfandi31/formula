<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSocialStore } from '../../../stores/social'

const socialStore = useSocialStore()
const router = useRouter()

const totalUsers = computed(() => Object.keys(socialStore.users).length)
const totalBalance = computed(() => socialStore.kasData.saldo)
const totalAgendas = computed(() => socialStore.agendaKegiatan.length)

const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
}

const goToFinancials = () => {
  router.push('/admin/keuangan')
}

const searchQuery = ref('')
const perPage = ref(5)
const currentPage = ref(1)
const isCustomShowOpen = ref(false)

const selectShowVal = (val) => {
  perPage.value = val
  currentPage.value = 1
  isCustomShowOpen.value = false
}

const closeShowDropdown = (e) => {
  if (!e.target.closest('.dropdown-show-container')) {
    isCustomShowOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeShowDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeShowDropdown)
})

const unpaidMembers = computed(() => {
  const list = []
  const allUsers = Object.values(socialStore.users || {})
  
  allUsers.forEach((user, index) => {
    if (user.role === 'admin') return

    if (index % 2 === 1) {
      list.push({
        id: user.id || index,
        name: user.name,
        avatar: user.avatar,
        title: user.title,
        tunggakan: 20000,
        periode: 'Maret - April 2026',
        lastUpdated: '10 Mei 2026'
      })
    } else {
      list.push({
        id: user.id || index,
        name: user.name,
        avatar: user.avatar,
        title: user.title,
        tunggakan: 10000,
        periode: 'Mei 2026',
        lastUpdated: '15 Mei 2026'
      })
    }
  })
  
  return list
})

const filteredUnpaid = computed(() => {
  let result = unpaidMembers.value
  
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    result = result.filter(item => 
      item.name.toLowerCase().includes(q) || 
      item.periode.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q)
    )
  }
  
  return result
})

const paginatedUnpaid = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return filteredUnpaid.value.slice(start, start + perPage.value)
})

const totalPages = computed(() => {
  return Math.ceil(filteredUnpaid.value.length / perPage.value) || 1
})
</script>

<template>
  <div class="space-y-8">
    <div class="grid grid-cols-3 gap-6">
      <div class="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-6 shadow-[0_10px_25px_-5px_rgba(79,70,229,0.3)] border border-indigo-400/20 relative overflow-hidden">
        <div class="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white opacity-10 blur-2xl pointer-events-none"></div>
        <div class="flex items-start justify-between relative z-10">
          <div>
            <h3 class="text-xs font-black uppercase tracking-widest mb-1 text-indigo-100">Total Pengurus</h3>
            <p class="text-3xl font-black leading-none text-white">{{ totalUsers }}</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm border border-white/20 shadow-inner">
            <font-awesome-icon icon="users" class="text-xl" />
          </div>
        </div>
        <div class="mt-4 text-[10px] font-black uppercase tracking-wider text-indigo-200 relative z-10">↑ Aktif & Terverifikasi</div>
      </div>
      
      <div class="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-[0_10px_25px_-5px_rgba(16,185,129,0.3)] border border-emerald-400/20 relative overflow-hidden">
        <div class="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white opacity-10 blur-2xl pointer-events-none"></div>
        <div class="flex items-start justify-between relative z-10">
          <div>
            <h3 class="text-xs font-black uppercase tracking-widest mb-1 text-emerald-100">Kas Organisasi</h3>
            <p class="text-3xl font-black leading-none text-white">{{ formatRupiah(totalBalance) }}</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm border border-white/20 shadow-inner">
            <font-awesome-icon icon="dollar-sign" class="text-xl" />
          </div>
        </div>
        <div class="mt-4 text-[10px] font-black uppercase tracking-wider text-emerald-250 relative z-10">Saldo saat ini</div>
      </div>
      
      <div class="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 shadow-[0_10px_25px_-5px_rgba(245,158,11,0.3)] border border-amber-400/20 relative overflow-hidden">
        <div class="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white opacity-10 blur-2xl pointer-events-none"></div>
        <div class="flex items-start justify-between relative z-10">
          <div>
            <h3 class="text-xs font-black uppercase tracking-widest mb-1 text-amber-100">Agenda & Rapat</h3>
            <p class="text-3xl font-black leading-none text-white">{{ totalAgendas }}</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm border border-white/20 shadow-inner">
            <font-awesome-icon icon="calendar" class="text-xl" />
          </div>
        </div>
        <div class="mt-4 text-[10px] font-black uppercase tracking-wider text-amber-200 relative z-10">Telah dipublikasi</div>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-6">
      
      <div class="col-span-2 bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
        <div>
          <div class="p-6 border-b border-slate-150 flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 class="text-xs font-black uppercase tracking-widest text-slate-800">Daftar Tunggakan Kas</h3>
              <p class="text-[9px] font-black text-rose-500 uppercase tracking-wider mt-0.5">Daftar anggota yang memiliki kewajiban kas belum terbayar</p>
            </div>
            <div class="flex items-center gap-3">
              <div class="relative dropdown-show-container">
                <button 
                  @click="isCustomShowOpen = !isCustomShowOpen"
                  class="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-350 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-2 cursor-pointer transition-all focus:outline-none shadow-xs"
                >
                  <span>{{ perPage }}</span>
                  <font-awesome-icon icon="chevron-down" class="text-[9px] text-slate-400 transition-transform duration-200" :class="{'rotate-180': isCustomShowOpen}" />
                </button>
                
                <transition
                  enter-active-class="transition duration-100 ease-out"
                  enter-from-class="transform scale-95 opacity-0 -translate-y-1"
                  enter-to-class="transform scale-100 opacity-100 translate-y-0"
                  leave-active-class="transition duration-75 ease-in"
                  leave-from-class="transform scale-100 opacity-100 translate-y-0"
                  leave-to-class="transform scale-95 opacity-0 -translate-y-1"
                >
                  <div v-if="isCustomShowOpen" class="absolute left-0 mt-1.5 w-16 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-30 py-1 divide-y divide-slate-100">
                    <button 
                      v-for="val in [3, 5, 10]" 
                      :key="val"
                      @click="selectShowVal(val)"
                      class="w-full text-center py-1.5 hover:bg-slate-50 text-xs font-bold transition-colors block cursor-pointer"
                      :class="perPage === val ? 'text-emerald-600 bg-emerald-50/20' : 'text-slate-700'"
                    >
                      {{ val }}
                    </button>
                  </div>
                </transition>
              </div>
              
              <input v-model="searchQuery" type="text" placeholder="Cari nama..." class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-40">
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="text-slate-500 uppercase font-black text-[9px] tracking-widest border-b border-slate-200/75 bg-slate-50/20">
                  <th class="p-4">Anggota</th>
                  <th class="p-4 text-right">Jumlah</th>
                  <th class="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-150">
                <tr 
                  v-for="item in paginatedUnpaid" 
                  :key="item.id" 
                  @click="goToFinancials" 
                  class="hover:bg-rose-50/40 transition-colors cursor-pointer group"
                >
                  <td class="p-4 flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-slate-50">
                      <img :src="item.avatar" class="w-full h-full object-cover" alt="Avatar">
                    </div>
                    <span class="font-bold text-slate-800 group-hover:text-rose-700 transition-colors">{{ item.name }}</span>
                  </td>
                  <td class="p-4 text-right font-black text-rose-600">
                    {{ formatRupiah(item.tunggakan) }}
                  </td>
                  <td class="p-4 text-center">
                    <span class="px-2 py-1 bg-rose-50 border border-rose-200 text-rose-600 text-[9px] font-black uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 w-28 mx-auto shadow-xs">
                      <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                      Belum Bayar
                    </span>
                  </td>
                </tr>
                <tr v-if="filteredUnpaid.length === 0">
                  <td colspan="3" class="p-12 text-center text-slate-400 font-bold uppercase tracking-wider text-xs">
                    🎉 Luar biasa! Semua kas pengurus lunas terbayar
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="p-4 border-t border-slate-150 bg-slate-50/30 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-500">
          <span>Menampilkan {{ paginatedUnpaid.length }} dari {{ filteredUnpaid.length }} tunggakan</span>
          <div class="flex items-center gap-1.5" v-if="totalPages > 1">
            <button 
              @click="currentPage = Math.max(1, currentPage - 1)" 
              :disabled="currentPage === 1"
              class="px-2.5 py-1 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Prev
            </button>
            <span class="px-1 text-slate-700">Halaman {{ currentPage }} / {{ totalPages }}</span>
            <button 
              @click="currentPage = Math.min(totalPages, currentPage + 1)" 
              :disabled="currentPage === totalPages"
              class="px-2.5 py-1 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div class="col-span-1 bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs flex flex-col">
        <div class="p-6 border-b border-slate-150 flex justify-between items-center bg-slate-50/50">
          <h3 class="text-xs font-black uppercase tracking-widest text-slate-800">Aktivitas Terkini</h3>
          <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sistem</span>
        </div>
        
        <div class="divide-y divide-slate-150 flex-grow">
          <div class="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500">
                 <font-awesome-icon icon="users" class="text-emerald-600 text-xs" />
              </div>
              <div>
                <p class="text-xs font-bold text-slate-800 uppercase tracking-wide">Sistem Stabil</p>
                <p class="text-[9px] text-slate-450 mt-0.5">Sinkronisasi otomatis aktif</p>
              </div>
            </div>
            <span class="px-2 py-0.5 bg-emerald-50 border border-emerald-250 text-emerald-700 text-[8px] font-black uppercase tracking-wider rounded-md">OK</span>
          </div>

          <div class="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500">
                 <font-awesome-icon icon="cog" class="text-indigo-600 text-xs animate-spin-slow" />
              </div>
              <div>
                <p class="text-xs font-bold text-slate-800 uppercase tracking-wide">Triger Kas Aktif</p>
                <p class="text-[9px] text-slate-450 mt-0.5">Otomatisasi saldo aktif</p>
              </div>
            </div>
            <span class="px-2 py-0.5 bg-indigo-50 border border-indigo-250 text-indigo-700 text-[8px] font-black uppercase tracking-wider rounded-md">NEW</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
