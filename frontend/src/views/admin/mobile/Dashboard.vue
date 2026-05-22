<script setup>
import { ref, computed } from 'vue'
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
const perPage = ref(3)
const currentPage = ref(1)

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
  <div class="space-y-6 px-1">
    <div class="flex flex-col gap-4">
      <div class="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-5 shadow-md border border-indigo-400/25 relative overflow-hidden">
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <h3 class="text-[10px] font-black uppercase tracking-wider text-indigo-100/90">Total Pengurus</h3>
            <p class="text-2xl font-black text-white">{{ totalUsers }} Orang</p>
          </div>
          <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white border border-white/20">
            <font-awesome-icon icon="users" class="text-lg" />
          </div>
        </div>
      </div>

      <div @click="goToFinancials" class="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 shadow-md border border-emerald-400/25 relative overflow-hidden active:scale-[0.98] transition-transform cursor-pointer">
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <h3 class="text-[10px] font-black uppercase tracking-wider text-emerald-100/90">Kas Organisasi</h3>
            <p class="text-2xl font-black text-white">{{ formatRupiah(totalBalance) }}</p>
          </div>
          <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white border border-white/20">
            <font-awesome-icon icon="dollar-sign" class="text-lg" />
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-5 shadow-md border border-amber-400/25 relative overflow-hidden">
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <h3 class="text-[10px] font-black uppercase tracking-wider text-amber-100/90">Agenda & Rapat</h3>
            <p class="text-2xl font-black text-white">{{ totalAgendas }} Acara</p>
          </div>
          <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white border border-white/20">
            <font-awesome-icon icon="calendar" class="text-lg" />
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-xs">
      <div class="flex flex-col gap-2">
        <h3 class="text-xs font-black uppercase tracking-wider text-slate-800">Tunggakan Kas</h3>
        <p class="text-[9px] font-black text-rose-500 uppercase tracking-widest leading-none">Daftar Anggota Belum Bayar</p>
      </div>

      <input v-model="searchQuery" type="text" placeholder="Cari nama anggota..." class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all">

      <div class="space-y-3">
        <div 
          v-for="item in paginatedUnpaid" 
          :key="item.id" 
          @click="goToFinancials"
          class="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-150 active:bg-rose-50/20 active:border-rose-100 transition-all cursor-pointer"
        >
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full overflow-hidden border border-slate-200 bg-white">
              <img :src="item.avatar" class="w-full h-full object-cover">
            </div>
            <div>
              <h4 class="text-xs font-black text-slate-800 leading-tight">{{ item.name }}</h4>
              <p class="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{{ item.periode }}</p>
            </div>
          </div>
          <div class="text-right">
            <span class="text-xs font-black text-rose-600 block leading-tight">{{ formatRupiah(item.tunggakan) }}</span>
            <span class="text-[8px] font-black text-rose-500 uppercase tracking-wider">Belum Bayar</span>
          </div>
        </div>

        <div v-if="filteredUnpaid.length === 0" class="p-6 text-center text-slate-400 font-bold text-xs uppercase tracking-wide">
          🎉 Semua kas lunas
        </div>
      </div>

      <div v-if="totalPages > 1" class="flex justify-between items-center pt-2 text-[9px] font-black uppercase text-slate-500">
        <span>Hal. {{ currentPage }} dari {{ totalPages }}</span>
        <div class="flex gap-2">
          <button 
            @click="currentPage = Math.max(1, currentPage - 1)" 
            :disabled="currentPage === 1"
            class="px-2.5 py-1 bg-white border border-slate-200 rounded-md disabled:opacity-50 font-bold"
          >
            Prev
          </button>
          <button 
            @click="currentPage = Math.min(totalPages, currentPage + 1)" 
            :disabled="currentPage === totalPages"
            class="px-2.5 py-1 bg-white border border-slate-200 rounded-md disabled:opacity-50 font-bold"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-xs">
      <h3 class="text-xs font-black uppercase tracking-wider text-slate-800">Aktivitas Terkini</h3>
      
      <div class="space-y-3">
        <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-150">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <font-awesome-icon icon="users" class="text-xs" />
            </div>
            <div>
              <p class="text-xs font-bold text-slate-800 leading-tight">Sistem Stabil</p>
              <p class="text-[9px] text-slate-400">Sinkronisasi otomatis aktif</p>
            </div>
          </div>
          <span class="px-2 py-0.5 bg-emerald-100 border border-emerald-200 text-emerald-800 text-[8px] font-black uppercase rounded-md">OK</span>
        </div>

        <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-150">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <font-awesome-icon icon="cog" class="text-xs animate-spin-slow" />
            </div>
            <div>
              <p class="text-xs font-bold text-slate-800 leading-tight">Triger Kas Aktif</p>
              <p class="text-[9px] text-slate-400">Otomatisasi saldo aktif</p>
            </div>
          </div>
          <span class="px-2 py-0.5 bg-indigo-100 border border-indigo-200 text-indigo-800 text-[8px] font-black uppercase rounded-md">NEW</span>
        </div>
      </div>
    </div>
  </div>
</template>
