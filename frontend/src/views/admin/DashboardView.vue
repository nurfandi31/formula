<script setup>
import { computed } from 'vue'
import AdminLayout from '../../layouts/AdminLayout.vue'
import { useSocialStore } from '../../stores/social'

const socialStore = useSocialStore()

const totalUsers = computed(() => Object.keys(socialStore.users).length)
const totalBalance = computed(() => socialStore.kasData.saldo)
const totalAgendas = computed(() => socialStore.agendaKegiatan.length)

const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
}
</script>

<template>
  <AdminLayout>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-slate-900/60 border border-slate-900 rounded-lg p-6">
        <h3 class="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Total Pengurus</h3>
        <p class="text-3xl font-black text-white leading-none">{{ totalUsers }}</p>
        <div class="mt-4 text-[10px] text-emerald-400 font-black uppercase tracking-wider">↑ Aktif & Terverifikasi</div>
      </div>
      <div class="bg-slate-900/60 border border-slate-900 rounded-lg p-6">
        <h3 class="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Kas Organisasi</h3>
        <p class="text-3xl font-black text-emerald-400 leading-none">{{ formatRupiah(totalBalance) }}</p>
        <div class="mt-4 text-[10px] text-slate-400 font-black uppercase tracking-wider">Saldo saat ini</div>
      </div>
      <div class="bg-slate-900/60 border border-slate-900 rounded-lg p-6">
        <h3 class="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Agenda & Rapat</h3>
        <p class="text-3xl font-black text-white leading-none">{{ totalAgendas }}</p>
        <div class="mt-4 text-[10px] text-teal-400 font-black uppercase tracking-wider">Telah dipublikasi</div>
      </div>
    </div>

    <div class="mt-8 bg-slate-900/60 border border-slate-900 rounded-lg overflow-hidden">
      <div class="p-6 border-b border-slate-800/60 flex justify-between items-center bg-slate-900/40">
        <h3 class="text-xs font-black uppercase tracking-widest text-white">Log Aktivitas Terbaru</h3>
        <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sistem Harian</span>
      </div>
      <div class="divide-y divide-slate-800/40">
        <div class="p-6 flex items-center justify-between hover:bg-slate-800/10 transition-colors">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
               <font-awesome-icon icon="users" class="text-emerald-400 text-sm" />
            </div>
            <div>
              <p class="text-xs font-black text-white uppercase tracking-wider">Sistem Berjalan Stabil</p>
              <p class="text-[10px] text-slate-500 mt-1">Data sinkronisasi Pinia tersimpan otomatis</p>
            </div>
          </div>
          <span class="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-wider rounded-lg">Aktif</span>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
